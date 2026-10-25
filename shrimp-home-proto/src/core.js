'use strict';
// ===== Core: state, clock, money, book, tabs, toasts, sheets =====
var BUILD='proto-2026-10-25a';
var $=function(id){return document.getElementById(id);};
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function lerp(a,b,t){return a+(b-a)*t;}
function rnd(a,b){return a+Math.random()*(b-a);}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function gauss(){var u=1-Math.random(),v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash2(x,y,s){var h=(x|0)*374761393+(y|0)*668265263+((s|0)+1)*1442695041;h=(h^(h>>>13))*1274126177;h=h^(h>>>16);return (h>>>0)/4294967296;}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmtN(n){n=Math.round(n);return n.toLocaleString('en-US');}
function fmtA(n){var a=Math.abs(n),s=n<0?'−':'';if(a>=999.5e6)return s+'AED '+(a/1e9).toFixed(a>=1e10?0:1).replace(/\.0$/,'')+'B';if(a>=999500)return s+'AED '+(a/1e6).toFixed(a>=1e7?0:1).replace(/\.0$/,'')+'M';if(a>=1e5)return s+'AED '+Math.round(a/1e3)+'k';return s+'AED '+fmtN(a);}
function plural(n,w,ws){return n+' '+(n===1?w:(ws||w+'s'));}

var DAY_SEC=20;            // real seconds per game day at 1x
var SEASONS=['spring','summer','autumn','winter'];
function seasonOf(day){return SEASONS[Math.floor(((day%360)+360)%360/90)];}

// ----- state -----
var S=null,SAVE_KEY='shrimp-proto-v1';
var STAGES=[
 {id:'flat',name:'Grandma’s flat',tanks:2,cost:0},
 {id:'balcony',name:'A flat with a balcony',tanks:3,cost:4000},
 {id:'house',name:'A house with a garden',tanks:5,cost:40000},
 {id:'land',name:'Land with a stream',tanks:6,cost:250000}];
function newState(){return {v:1,build:BUILD,day:0,lastDay:0,speed:1,cash:3000,stage:0,
  opt:{toys:'need',effects:'on',company:'running',genes:false,sound:true},
  tanks:[],sel:0,book:{shrimp:{},birds:{},fish:{},finds:{}},land:{},company:{week:0,last:null,reports:[]},
  stats:{earned:0,spent:0},nextId:1,tab:'try',seen:{}};}
var saveT=0;
function save(now){if(!S)return;if(!now){if(saveT)return;saveT=setTimeout(function(){saveT=0;save(true);},1500);return;}
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
function load(){try{var t=localStorage.getItem(SAVE_KEY);if(t){var s=JSON.parse(t);if(s&&s.v===1)return s;}}catch(e){}return null;}
function uid(){return S.nextId++;}

// ----- modules -----
var MODS=[];               // {name, init(), day(d), tick(dtDays,dtSec), show(), hide(), render()}
function registerMod(m){MODS.push(m);}
function modCall(fn){var a=Array.prototype.slice.call(arguments,1);MODS.forEach(function(m){if(m[fn])try{m[fn].apply(m,a);}catch(e){console.error(m.name,fn,e);}});}
var TABMOD={};             // tab name -> module that owns it
function registerTab(tab,m){TABMOD[tab]=m;}

// ----- clock -----
var LOCK=0;                // >0 while a toy, sheet or mini game holds time still
function hold(){LOCK++;updateHeader();}
function release(){LOCK=Math.max(0,LOCK-1);updateHeader();}
function running(){return S.speed>0&&LOCK===0;}
var lastTs=0;
function loop(ts){var dtSec=lastTs?Math.min(0.1,(ts-lastTs)/1000):0.016;lastTs=ts;
  var dd=0;if(running()){dd=dtSec*S.speed/DAY_SEC;advance(dd);}
  modCall('tick',dd,dtSec);
  if((loop.n=(loop.n||0)+1)%15===0)updateHeader();
  requestAnimationFrame(loop);}
function advance(dd){S.day+=dd;var guard=0;while(Math.floor(S.day)>S.lastDay&&guard++<400){S.lastDay++;dayRoll(S.lastDay);}}
function dayRoll(d){modCall('day',d);save();}
function skipDays(n){for(var i=0;i<n;i++){S.day=Math.floor(S.day)+1;S.lastDay=Math.floor(S.day);dayRoll(S.lastDay);}modCall('render');updateHeader();}
function setSpeed(v){S.speed=v;document.querySelectorAll('#speed button').forEach(function(b){b.setAttribute('aria-pressed',String(+b.dataset.speed===v));});updateHeader();save();}

// ----- money -----
function spend(n,what){if(n<=0)return true;if(S.cash<n){toast('Not enough cash for '+what+'. Add some under Try › Dev.');sfx('nope');return false;}S.cash-=n;S.stats.spent+=n;updateHeader();save();return true;}
function earn(n,what){if(n<=0)return;S.cash+=n;S.stats.earned+=n;updateHeader();save();}

// ----- book -----
var BOOK={};               // cat -> {title, entries:[{id,name,draw(ctx,w,h),hint}]}
function bookCat(cat,def){BOOK[cat]=def;}
function bookHas(cat,id){return !!(S.book[cat]&&S.book[cat][id]);}
function bookAdd(cat,id,info){if(!S.book[cat])S.book[cat]={};if(S.book[cat][id])return false;var e={day:Math.floor(S.day)};for(var k in info||{})e[k]=info[k];S.book[cat][id]=e;
  var def=BOOK[cat],ent=def&&def.entries.find(function(x){return x.id===id;});toast('New in the book: '+(ent?ent.name:id));sfx('book');save();modCall('bookChanged',cat,id);return true;}

// ----- header -----
function updateHeader(){if(!S)return;var d=Math.floor(S.day);$('b-date').textContent='Day '+d+' · '+seasonOf(d);
  $('b-money').textContent=fmtA(S.cash);
  var sub=LOCK?'Time stops while you work':S.speed===0?'Paused':'';if(!sub&&S.opt.company==='running'&&S.company.last)sub='Company last week '+(S.company.last.net>=0?'+':'')+fmtA(S.company.last.net);
  if(!sub&&S.opt.company==='sold')sub='Company sold · retired';
  $('b-sub').textContent=sub;}

// ----- toasts, sheets, popover -----
var toastQ=[],toastOn=false;
function toast(msg,ms){toastQ.push([msg,ms||2600]);if(!toastOn)toastNext();}
function toastNext(){var t=toastQ.shift();if(!t){toastOn=false;$('toast').hidden=true;return;}toastOn=true;var el=$('toast');el.textContent=t[0];el.hidden=false;setTimeout(toastNext,t[1]);}
var SHEET=null;
// openSheet({title, html, mount(el,api), onClose, keepTime}) -> api {el, close()}
function openSheet(o){closeSheet(true);var box=$('sheet-in');box.innerHTML='<div class="sheet-hd"><h2>'+esc(o.title||'')+'</h2>'+(o.noClose?'':'<button class="btn sm" data-x>Close</button>')+'</div><div class="sheet-body"></div>';
  var body=box.querySelector('.sheet-body');if(o.html)body.innerHTML=o.html;var api={el:body,close:function(){closeSheet();}};SHEET={o:o,api:api,at:performance.now()};
  var x=box.querySelector('[data-x]');if(x)x.onclick=function(){closeSheet();};$('sheet').hidden=false;document.body.classList.add('sheet-on');if(!o.keepTime)hold();
  if(o.mount)o.mount(body,api);return api;}
function closeSheet(silent){if(!SHEET)return;var s=SHEET;SHEET=null;$('sheet').hidden=true;document.body.classList.remove('sheet-on');$('sheet-in').innerHTML='';if(!s.o.keepTime)release();if(s.o.onClose)try{s.o.onClose();}catch(e){console.error(e);}if(!silent)modCall('render');}
var POP_AT=0;function openPop(html){$('pop').innerHTML=html;$('pop').hidden=false;$('pop-dim').hidden=false;POP_AT=performance.now();}
function closePop(){$('pop').hidden=true;$('pop-dim').hidden=true;}

// ----- tabs -----
var activeTab='home';
function setTab(t,arg){if(!TABMOD[t])t='home';if(activeTab!==t&&TABMOD[activeTab]&&TABMOD[activeTab].hide)TABMOD[activeTab].hide();activeTab=t;S.tab=t;
  document.querySelectorAll('.tabs [data-tab]').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.tab===t));});
  ['home','tank','book','try'].forEach(function(n){$('p-'+n).hidden=n!==t;});
  if(TABMOD[t].show)TABMOD[t].show(arg);window.scrollTo(0,0);sfxAmbient();save();}
function goTank(i){if(i!=null&&S.tanks[i])S.sel=i;setTab('tank');}

// ----- small canvas helper -----
function fitCanvas(cv,w,h){var d=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(w*d)||cv.height!==Math.round(h*d)){cv.width=Math.round(w*d);cv.height=Math.round(h*d);}var x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return x;}
function miniCanvas(w,h,draw){var c=document.createElement('canvas');var x=fitCanvas(c,w,h);c.style.width=w+'px';c.style.height=h+'px';draw(x,w,h);return c;}

// ----- boot -----
function boot(data){S=(data&&data.S)||load()||newState();var fresh=!S.tanks.length;
  if(S.build!==BUILD)S.build=BUILD;
  modCall('init',fresh);
  document.querySelectorAll('#speed button').forEach(function(b){b.onclick=function(){setSpeed(+b.dataset.speed);sfx('click');};});
  document.querySelectorAll('.tabs [data-tab]').forEach(function(b){b.onclick=function(){sfx('click');setTab(b.dataset.tab);};});
  $('sheet').addEventListener('click',function(e){if(e.target===this&&SHEET&&!SHEET.o.noClose&&performance.now()-SHEET.at>450)closeSheet();});
  $('pop-dim').onclick=function(){if(performance.now()-POP_AT>450)closePop();};
  $('tb-info').onclick=function(){openPop('<div class="sheet-hd"><h2>What this is</h2><button class="btn sm" onclick="closePop()">Close</button></div><p>A test bench for ideas, separate from the game. Nothing here touches your real save.</p><p><b>Home</b> is the place that grows with you: Grandma’s flat, a balcony, a house with a garden, then land with a stream.</p><p><b>Tank</b> has the hands-on jobs (vacuum, sponge, trim, pests, sort, aquascape) and colour breeding. Tap any shrimp to look closer.</p><p><b>Book</b> collects every colour, bird, fish and stream find.</p><p><b>Try</b> lists each idea with Keep, Maybe or Drop and a note. Dev controls are at the bottom (jump ahead, add money, switch designs).</p><p>One game day is 20 seconds at 1×.</p>');};
  $('tb-mute').onclick=function(){S.opt.sound=!S.opt.sound;sfxUnlock();sfxMute(!S.opt.sound);save();};
  $('tb-mute').classList.toggle('muted',!S.opt.sound);
  setSpeed(S.speed);setTab(S.tab||'try');updateHeader();if(!S.seen.hello){S.seen.hello=1;toast('Every idea is listed here with a Try it button. Your notes save as you go.',4200);}
  if(window.claude&&window.claude.hot&&window.claude.hot.snapshot)window.claude.hot.snapshot(function(){return {S:S};});
  window.addEventListener('pagehide',function(){save(true);});
  document.addEventListener('visibilitychange',function(){if(document.hidden)save(true);sfxAmbient();});
  requestAnimationFrame(loop);}
function start(){var h=window.claude&&window.claude.hot;if(h&&h.ready)h.ready(boot);else boot((h&&h.data)||{});}
