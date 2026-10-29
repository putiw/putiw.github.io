// ===== Game link: the land inside Universal Shrimp (only in the game build, window.GAME_MODE) =====
// The game is the boss: its cash pays for everything, and its Tank 1 is Your tank here, the same tank.
// One clock (Pass 151): the land runs on the company's game days. While you're here the company runs at real time,
// so nothing much moves; back at the company time flies and the land catches up when you next come.
// Messages to the game: {land:1,type:'ready'|'spend'|'earn'|'take'|'give'|'care'|'back'}. From the game: {game:1,type:'cash'|'own'}.
(function(){
if(!window.GAME_MODE)return;
DAY_SEC=1e15;                       // no days pass on real time; game days come from the company
ADULT_DAYS=75;                      // the same as the game
SAVE_KEY='shrimp-land-v1';
var P=window.parent!==window?window.parent:(window.TEST_PARENT||null);   // the test page stands in for the company in the same page
function post(m){if(!P)return;m.land=1;try{P.postMessage(m,'*');}catch(e){}}
window.GAME_POST=post;
// no browser feel inside the game: no pinch zoom, no long-press menu (Puti, 28 Oct)
['gesturestart','gesturechange','gestureend'].forEach(function(k){document.addEventListener(k,function(e){e.preventDefault();},{passive:false});});
document.addEventListener('touchmove',function(e){if(e.touches&&e.touches.length>1)e.preventDefault();},{passive:false});
document.addEventListener('contextmenu',function(e){var t=e.target;if(!(t.closest&&t.closest('input,textarea')))e.preventDefault();});

// ----- money: the company's cash -----
var FROZEN='',NEED='',SEQ=0;   // SEQ: our last take/give; an 'own' from before the game handled it is stale
spend=function(n,what){if(n<=0)return true;if(FROZEN){toast(FROZEN,4200);sfx('nope');return false;}if(S.cash<n){toast('Not enough cash for '+what+'.');sfx('nope');return false;}
  S.cash-=n;post({type:'spend',n:n,what:what});updateHeader();save();return true;};
earn=function(n,what){if(n<=0)return;S.cash+=n;post({type:'earn',n:n,what:what});updateHeader();save();};

// ----- your own tank: Tank 1 here follows the game's tank 1 -----
var OWN=null;
function gradeOf(g){return clamp(1+Math.round((g||0)/100*7),1,8);}
function ownT(){return S.tanks[0]||null;}
// Your tank is the game's Tank 1. The game decides births and deaths, the land keeps each shrimp it knows (colour,
// name, age) and only adds or removes the difference, so nothing gets reset. Moves and sales here go to the game.
function gOf(i){return Math.round(clamp(phOf(i).grade,0,7)/7*100);}
function syncOwn(d){if((d.seq||0)<SEQ)return;OWN=d;var T=ownT();if(!T||typeof newInd!=='function'||typeof GEN!=='object')return;T.name='Your tank';T.own=1;
  var A=Math.min(600,d.adults|0),Y=Math.min(600,d.young|0),N=netList(),
    mine=function(){return T.shrimp.concat(N.filter(function(e){return e.from===T.id;}).map(function(e){return e.ind;}));},ad=function(){return mine().filter(function(i){return i.age>=ADULT_DAYS;});},yo=function(){return mine().filter(function(i){return i.age<ADULT_DAYS;});};
  // shrimp in the net from Your tank still count as in it until they're moved or sold
  function inNet(i){return N.some(function(e){return e.ind===i;});}
  // young the game has grown up: the oldest young here grow up too, rather than swapping shrimp
  var a0=ad(),y0=yo();if(a0.length<A&&y0.length>Y){var up=Math.min(A-a0.length,y0.length-Y);y0.sort(function(p,q){return q.age-p.age;}).slice(0,up).forEach(function(i){i.age=ADULT_DAYS;});}
  if(a0.length>A&&y0.length<Y){var dn=Math.min(a0.length-A,Y-y0.length);a0.filter(function(i){return !i.name&&!inNet(i);}).sort(function(p,q){return p.age-q.age;}).slice(0,dn).forEach(function(i){i.age=ADULT_DAYS-1;});}
  function add(n,adult){var moms=T.shrimp.filter(function(i){return i.sex==='f'&&i.age>=ADULT_DAYS;}),dads=T.shrimp.filter(function(i){return i.sex==='m'&&i.age>=ADULT_DAYS-5;});
    for(var k=0;k<n;k++){var i;
      if(!adult&&moms.length&&dads.length){var dd=pick(dads),pd=phOf(dd);i=kidOf(pick(moms),{dna:dd.dna,grade:pd.grade,l:pd.line,r:pd.rili?1:0});i.age=1;}
      else i=newInd({from:'grandma',sex:Math.random()<0.5?'f':'m',age:adult?Math.floor(ADULT_DAYS+10+Math.random()*150):Math.floor(8+Math.random()*(ADULT_DAYS-12)),dna:GEN.forStrain('red',gradeOf(d.g+(Math.random()-0.5)*20))});
      T.shrimp.push(i);}}
  function cut(list,n){list=list.filter(function(i){return !inNet(i)&&!i.name;}).sort(function(a,b){return b.age-a.age;});var gone=list.slice(0,n);T.shrimp=T.shrimp.filter(function(i){return gone.indexOf(i)<0;});}
  var a1=ad(),y1=yo();
  if(a1.length<A)add(A-a1.length,true);else if(a1.length>A)cut(a1,a1.length-A);
  if(y1.length<Y)add(Y-y1.length,false);else if(y1.length>Y)cut(y1,y1.length-Y);
  if(activeTab==='tank'&&typeof tvSync==='function')try{tvSync();}catch(e){}}
// births and deaths in Your tank come from the game; here they only grow older
if(typeof breedDay==='function'){var _bd=breedDay;breedDay=function(T,d){if(!T.own)return _bd(T,d);T.shrimp.forEach(function(i){i.age++;if(i.rest>0)i.rest--;i.eggs=null;if(i.age===JUV_DAYS)reveal(T,i);});};}
// the land's day is the game's day
function gameTime(day){if(day==null||!isFinite(day))return;window.GDAY=day;if(S.gday==null||S.gday>day){S.gday=day;return;}var n=Math.floor(day)-Math.floor(S.gday);if(n>=1){S.gday=day;advance(Math.min(n,365));}}
// a card waiting at the company, or frozen accounts
function needBar(){var b=$('lneed');if(!NEED){if(b)b.remove();return;}if(!b){b=document.createElement('button');b.type='button';b.id='lneed';b.className='lneed';b.onclick=function(){try{LAND.settle();}catch(e){}save(true);sfx('click');post({type:'back'});};document.body.appendChild(b);}b.textContent=NEED+' Tap to go back.';}
window.addEventListener('message',function(e){var d=e.data;if(!d||!d.game||!S)return;
  if(d.type==='cash'){S.cash=d.cash;FROZEN=d.frozen||'';var nd=d.need||'';if(nd!==NEED){NEED=nd;needBar();}gameTime(d.day);updateHeader();}
  if(d.type==='own')syncOwn(d);});
// shrimp that leave your tank here leave it in the game too
var _move=netMoveTo;netMoveTo=function(T2){var T=ownT(),N=netList(),a=0,y=0,giv=[];if(T&&T2)N.forEach(function(e){if(T2!==T&&e.from===T.id){if(e.ind.age>=ADULT_DAYS)a++;else y++;}if(T2===T&&e.from!==T.id)giv.push({age:e.ind.age,g:gOf(e.ind)});});_move(T2);if(a+y)post({type:'take',adults:a,young:y,seq:++SEQ});if(giv.length)post({type:'give',list:giv,seq:++SEQ});};
var _sell=sellShrimp;sellShrimp=function(T,i){var own=T===ownT(),ad=i.age>=ADULT_DAYS;var p=_sell(T,i);if(own)post({type:'take',adults:ad?1:0,young:ad?0:1,seq:++SEQ});return p;};
// care jobs count as caring for your tank in the game
if(typeof toyEnd==='function'){var _end=toyEnd;toyEnd=function(){var r=_end.apply(this,arguments);try{if(S.tanks[S.sel]===ownT())post({type:'care'});}catch(e){}return r;};}

// ----- the header: back to the company, today's real time -----
function clock(){var d=new Date();return d.toLocaleDateString('en-GB',{weekday:'short'})+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
var _uh=updateHeader;updateHeader=function(){_uh();var b=$('b-date');if(b)b.textContent=clock();var lc=$('lclock');if(lc){lc.hidden=false;lc.textContent=clock();}var s=$('b-sub');if(s)s.textContent='';};
function shell(){['tb-info'].forEach(function(id){var e=$(id);if(e)e.remove();});var tag=document.querySelector('.devtag');if(tag)tag.remove();var sp=$('speed');if(sp)sp.remove();
  document.querySelectorAll('.tabs [data-tab="book"],.tabs [data-tab="try"]').forEach(function(b){b.remove();});
  var row=document.querySelector('.top .brand');if(row&&!$('tb-back')){var bb=document.createElement('button');bb.className='btn sm';bb.id='tb-back';bb.type='button';bb.innerHTML='<span aria-hidden="true">‹</span><i> Company</i>';bb.setAttribute('aria-label','Back to the company');bb.onclick=function(){try{LAND.settle();}catch(e){}save(true);sfx('click');post({type:'back'});};row.insertBefore(bb,row.firstChild);}
  // one header row: back, cash, the Home / Tank switch, sound (Puti, 28 Oct: the big bottom tabs took room from the map)
  if(row&&!$('lseg')){var mo=$('b-money');if(mo)row.insertBefore(mo,$('tb-mute'));var sg=document.createElement('div');sg.className='lseg';sg.id='lseg';sg.setAttribute('role','tablist');
    sg.innerHTML='<button type="button" data-seg="home">Home</button><button type="button" data-seg="tank">Tank</button>';row.insertBefore(sg,$('tb-mute'));
    var td=$('tankdot');if(td)sg.querySelector('[data-seg="tank"]').appendChild(td);
    sg.querySelectorAll('[data-seg]').forEach(function(b){b.onclick=function(){sfx('click');setTab(b.dataset.seg);};});}
  document.body.classList.add('in-game');}
var _setTab=setTab;setTab=function(t,arg){var r=_setTab.apply(this,arguments);document.querySelectorAll('#lseg [data-seg]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.seg===activeTab));});return r;};

// ----- start: the land, from empty the first time; time that passed while away is caught up -----
var _save=save;save=function(now){if(S)S.savedAt=Date.now();return _save(now);};
var _toast=toast,quiet=0;toast=function(){if(quiet)return;return _toast.apply(this,arguments);};
var _boot=boot;boot=function(data){quiet=1;try{_boot(data);}finally{quiet=0;}
  shell();S.seen.hello=1;S.seen.cash1m=1;S.speed=1;S.opt.company='none';
  if(!S.land||!S.land.fresh){var c=S.cash;window.landFresh();S.cash=c;}
  S.stage=3;
  setTab(S.tab==='tank'?'tank':'home');updateHeader();save(true);post({type:'ready'});
  setInterval(updateHeader,15000);};
})();
