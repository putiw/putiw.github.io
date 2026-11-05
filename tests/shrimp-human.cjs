// Pass 235 (plan: claude/shrimp-plan-human-checks-3nov.md, Parts 1 and 2): play a new game like a person, in real time,
// to the first farm, and watch what happens between taps. Chromium, 390x844 (HUMAN_W=360 for the narrow phone).
// node tests/shrimp-human.cjs        about 4 to 5 minutes. HUMAN_MAX_S caps the real seconds (default 290).
//
// The player is the strong bot's own policy() (tests/shrimp-playthrough.cjs), run once a game day inside the page,
// with the page's real clock at the fastest speed it allows (2x and 4x here). HUMAN_RATE (default 2) runs the page's
// clock that many times faster than the wall clock so the opening fits in 5 minutes; 1 is true real time. Cards,
// What happened, spotlights and sheets are answered by tapping them. Every 2 s of real time it records:
//  - the sticky header: empty space under its content (fail over 4 px) and every height change, with the rows shown;
//  - the open tab: gaps over 24 px between cards that hold nothing, anything overlapping #tankview;
//  - one ? opened every ~10 s: the help must sit right under or right over its button (fail if more than 16 px away);
//  - every card, note, news banner and spotlight shown, with the day. An intro or chapter card must not show before
//    its condition (milestoneConditions) was ever true, and not more than 60 game days and 150 s of play after (Pass 265, the queue at the 10-35 s gap);
//  - Puti's opening order: Ads not before 10 sales, kits not before tank 2's first baby, no speed hint on the speed
//    you're already at.
// Part 2: a text dump of everything shown (cards, ?, banners, toasts, button labels) with a state line, written to
// os.tmpdir()/shrimp-human-text.txt. Before a deploy, read it against its state lines and list anything not true then.
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),os=require('os');
const RATE=+(process.env.HUMAN_RATE||2),ROOT=path.join(__dirname,'../shrimp'),W=+(process.env.HUMAN_W||390),MAXS=+(process.env.HUMAN_MAX_S||290);
const TYPES={'.html':'text/html','.js':'text/javascript','.mp3':'audio/mpeg','.wav':'audio/wav','.png':'image/png'};
function serve(){return new Promise(r=>{const s=http.createServer((q,a)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){a.writeHead(404);a.end();return;}a.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(a);});
 s.listen(0,()=>r(s));});}
// the strong bot's player, from its own file: extraTanks, afford and policy (it reaches the first farm near day 350)
const botSrc=fs.readFileSync(path.join(__dirname,'shrimp-playthrough.cjs'),'utf8');
const PLAYER=botSrc.slice(botSrc.indexOf('function extraTanks('),botSrc.indexOf('for(var day=0;')).replace(/\$\{process\.env\.BOT_HEART==='kind'\}/g,'false').replace(/\$\{process\.env\.REVIEW_KIT_PRICE[^}]*\}/g,'600').replace(/\$\{process\.env\.REVIEW_ACADEMY[^}]*\}/g,'false').replace(/\$\{runSeed\}/g,'7');
if(PLAYER.length<2000)throw Error('could not read the bot player');
const fails=[];const fail=(k,m)=>{fails.push(k+': '+m);};
(async()=>{
 const srv=await serve(),url='http://127.0.0.1:'+srv.address().port+'/index.html';
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:844}});const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.dismiss());p.setDefaultTimeout(2500);
 await p.addInitScript(r=>{try{localStorage.clear();localStorage.setItem('shrimp-music','0');}catch(e){}var raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=function(cb){return raf(function(t){cb(t*r);});};},RATE);
 await p.goto(url);await p.waitForFunction(()=>window.G&&typeof render==='function');
 // install the player and the day hook
 await p.evaluate(src=>{window.BOTPROF=null;window.BOTKIND=true;window.NOSTORES=false;window.NOMEDIA=false;window.NEWBOT=true;window.MTR=false;window.events=[];window.snapshots={};window.actions=[];window.visits=0;
  window.note=function(){};window.last={};(0,eval)(src);
  window.H={days:{},cond:{},log:[],shown:{},tabs:{},real0:performance.now()};
  var _dr=dayRollover;window.dayRollover=function(g){var r=_dr.apply(this,arguments);if(g===G&&!H.stop){try{policy();}catch(e){H.err=String(e);}
   var c=milestoneConditions(G),d=Math.floor(G.day),t=performance.now();for(var k in c)if(c[k]&&!H.cond[k])H.cond[k]={d:d,t:t};}return r;};
 },PLAYER);
 const text=[],seenTxt=new Set();
 const state=()=>p.evaluate(()=>{var T=G.tanks[0];return 'day '+Math.floor(G.day)+', '+G.tanks.length+' tanks, '+Math.round(allN(G))+' shrimp, sold '+G.stats.sold+', kits '+(G.kits.sold||0)+', AED '+Math.round(G.money)+(farmBuilt(G)?', farm':'')+(T.feeder?', feeder':'')+(T.autoWC?', auto water':'');});
 const say=async(kind,t)=>{t=(t||'').replace(/\s+/g,' ').trim();if(!t||seenTxt.has(kind+t))return;seenTxt.add(kind+t);text.push('['+kind+'] '+t+'\n   ('+await state()+')');};
 let hdLast=null,lastQ=0,t0=Date.now(),lastSpeedFix=0;
 while((Date.now()-t0)/1000<MAXS){
  await p.waitForTimeout(2000);
  // answer what's on screen like a person: spotlight, What happened, the card, any sheet
  const ui=await p.evaluate(()=>{var o={};function vis(id){var e=document.getElementById(id);return e&&!e.hidden&&e.getBoundingClientRect().height>0;}
   o.spot=vis('spot')?document.getElementById('spot-text').textContent:'';o.after=vis('after')?document.getElementById('after').innerText:'';
   var mc=document.getElementById('milestone-card');o.card=mc&&!mc.hidden?{key:renderMilestone.last,text:mc.innerText,intro:!!(MILESTONES[renderMilestone.last]&&(MILESTONES[renderMilestone.last].intro||MILESTONES[renderMilestone.last].chapter))}:null;
   ['newsflash','noteflash'].forEach(function(id){var e=document.getElementById(id);if(e&&!e.hidden)o[id]=e.innerText;});var t=document.getElementById('toast');if(t&&t.textContent)o.toast=t.textContent;
   o.ts=vis('tsheet');o.day=Math.floor(G.day);o.tab=activeTab;o.speed=speed;o.max=maxSpeed(G);o.farm=farmBuilt(G);o.err=H.err;return o;});
  if(ui.err){fail('player',ui.err);break;}
  if(process.env.HUMAN_DEBUG)console.log(JSON.stringify({d:ui.day,sp:ui.speed,max:ui.max,tab:ui.tab,card:ui.card&&ui.card.key,spot:!!ui.spot,after:!!ui.after,ts:ui.ts,q:await p.evaluate(()=>G.progress.queue.join(','))+'|'+await p.evaluate(()=>[!!TVLOCK,!!HC,!!SB,!!QCR,!!TS,typeof busyUI==='function'&&busyUI(),afterOpen(),progressionBlocked(G)].join(','))}));
  if(ui.spot){await say('spotlight',ui.spot);await p.mouse.click(W/2,420);await p.waitForTimeout(300);}
  if(ui.after){await say('what happened',ui.after);await p.waitForTimeout(600);await p.click('#after-ok').catch(()=>{});}
  for(const k of ['newsflash','noteflash','toast'])if(ui[k])await say(k,ui[k]);
  if(ui.card){await say('card '+ui.card.key,ui.card.text);
   const chk=await p.evaluate(k=>{if(H.shown[k])return null;var c=H.cond[k],now=performance.now();H.shown[k]={d:Math.floor(G.day),t:now};var cur=milestoneConditions(G)[k];return {c:c,cur:cur,d:Math.floor(G.day),t:now};},ui.card.key);
   if(chk&&ui.card.intro){if(!chk.c&&chk.cur===false)fail('card '+ui.card.key,'shown on day '+chk.d+' before its condition was ever true');
    else if(chk.c&&chk.d-chk.c.d>60&&(chk.t-chk.c.t)*RATE/1000>150)/* Puti, 5 Nov: waiting behind 3 or 4 things at the 10-35 s gap is fine */fail('card '+ui.card.key,'shown '+(chk.d-chk.c.d)+' game days and '+Math.round((chk.t-chk.c.t)*RATE/1000)+' s of play after its cause (day '+chk.c.d+')');}
   const btn=await p.$('#milestone-card [data-act="story-choice"]:not([disabled])')||await p.$('#milestone-card [data-act="milestone-next"]:not([disabled])');
   await p.waitForTimeout(550);if(btn)await btn.click().catch(async e=>{fail('tap','the card button on '+ui.card.key+' is covered: '+String(e.message||e).split('\n').filter(l=>/intercepts/.test(l))[0]);await btn.evaluate(x=>x.click());});await p.waitForTimeout(300);}
  if(ui.ts){const tb=await p.$('#tsheet [data-act="ts-upg"]:not([disabled])')||await p.$('#tsheet [data-act="ts-close"]:not([disabled])')||await p.$('#tsheet [data-act="ts-later"]');if(tb)await tb.click().catch(()=>{});}
  // keep the clock running at the fastest the game allows, like a player
  if(!ui.card&&!ui.spot&&!ui.after&&ui.speed<ui.max)await p.evaluate(m=>{var bt=document.querySelector('#speed [data-speed="'+m+'"]');if(bt&&!bt.hidden)bt.click();else setSpeed(m);},ui.max);
  // the screen between taps
  const look=await p.evaluate(()=>{var o={};var hd=document.querySelector('header.top'),hr=hd.getBoundingClientRect(),cs=getComputedStyle(hd),pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
   var lo=1e9,hi=-1e9,rows=[];Array.from(hd.querySelectorAll('*')).forEach(function(e){if(!e.offsetParent&&getComputedStyle(e).position!=='fixed')return;var s=getComputedStyle(e);if(s.visibility==='hidden'||s.display==='none')return;var r=e.getBoundingClientRect();if(r.height<1||r.width<1||r.top>=hr.bottom||r.bottom<=hr.top)return;lo=Math.min(lo,r.top);hi=Math.max(hi,r.bottom);});
   Array.from(hd.children).forEach(function(e){if(e.getBoundingClientRect().height>0)rows.push((e.id||e.className||e.tagName).toString().split(' ')[0]);});
   o.hh=Math.round(hr.height);o.empty=hi>lo?Math.round(hr.height-(hi-lo)-pad):0;o.rows=rows.join(',');
   var pn=document.querySelector('section.panel:not([hidden])'),cards=pn?Array.from(pn.querySelectorAll(':scope > .card, :scope > div > .card')).filter(function(c){var r=c.getBoundingClientRect();return r.height>0&&getComputedStyle(c).display!=='none';}):[];
   cards.sort(function(a,b){return a.getBoundingClientRect().top-b.getBoundingClientRect().top;});o.gaps=[];for(var i=1;i<cards.length;i++){var g=cards[i].getBoundingClientRect().top-cards[i-1].getBoundingClientRect().bottom;if(g>24)o.gaps.push((cards[i-1].id||'card')+'→'+(cards[i].id||'card')+' '+Math.round(g)+'px');}
   var tv=document.getElementById('tankview');o.over=[];if(tv&&activeTab==='tank'&&tv.getBoundingClientRect().height>0){var t=tv.getBoundingClientRect();var mc=document.getElementById('milestone-card');
    [mc].concat(cards).forEach(function(c){if(!c||c.hidden||c.contains(tv)||tv.contains(c))return;var r=c.getBoundingClientRect();if(r.height<1)return;if(r.left<t.right-2&&r.right>t.left+2&&r.top<t.bottom-2&&r.bottom>t.top+2)o.over.push(c.id||c.className);});}
   var sb=document.querySelector('#speed button[aria-pressed="true"]'),pul=Array.from(document.querySelectorAll('#speed button')).filter(function(x){return (x.classList.contains('nudge')||x.classList.contains('nudge5'))&&getComputedStyle(x).animationName!=='none'&&!x.hidden;});o.pulseAt=pul.map(function(x){return +x.dataset.speed;});o.sp=speed;
   o.ads=!document.getElementById('tab-promote').hidden;o.kits=!document.getElementById('tab-emp').hidden;o.sold=G.stats.sold;o.ksold=G.kits.sold||0;o.t2=!!G.stats.t2Born;o.day=Math.floor(G.day);
   o.btns=pn?Array.from(pn.querySelectorAll('button')).filter(function(x){return x.getBoundingClientRect().height>0;}).map(function(x){return x.innerText.replace(/\s+/g,' ').trim();}).filter(Boolean):[];return o;});
  if(hdLast!==null&&look.hh!==hdLast.hh)H_log(look,hdLast);hdLast=look;
  if(look.empty>4)fail('header','empty space '+look.empty+' px under its content on day '+look.day+' (rows '+look.rows+')');
  look.gaps.forEach(g=>fail('gap','day '+look.day+' '+ui.tab+': '+g));look.over.forEach(o=>fail('tankview','day '+look.day+': '+o+' overlaps the tank'));
  if(look.ads&&look.sold<10)fail('order','Ads tab shown on day '+look.day+' with '+look.sold+' sales');
  if(look.kits&&!look.t2)fail('order','Kits tab before tank 2’s first baby, day '+look.day);
  if(look.sp>0&&look.pulseAt.some(s=>s<=look.sp))fail('order','speed hint pulses '+look.pulseAt.join(',')+'x while running at '+look.sp+'x, day '+look.day);
  for(const t of look.btns)await say('button',t);
  // one ? every ~10 s: it must open right by its button
  if(Date.now()-lastQ>10000){lastQ=Date.now();const q=await p.evaluate(()=>{var qs=Array.from(document.querySelectorAll('section.panel:not([hidden]) .qhelp, header.top .qhelp')).filter(function(x){var r=x.getBoundingClientRect();return r.height>0&&r.top>90&&r.bottom<innerHeight-120;});if(!qs.length)return null;var x=qs[Math.floor(Math.random()*qs.length)];x.id=x.id||'hq'+Date.now();var rr=x.getBoundingClientRect();window.__qr={top:rr.top,bottom:rr.bottom};window.__qk={h:x.dataset.help,l:x.getAttribute('aria-label')};return '#'+x.id;});
   if(q){await p.click(q).catch(()=>{});await p.waitForTimeout(350);const r=await p.evaluate(sel=>{var bt=document.querySelector(sel),hs=document.getElementById('helpsheet');if(!bt&&window.__qk){/* a render rebuilt the ? and dropped our id: find it again as the game does (hsTrack) */var k=window.__qk;bt=k.h?document.querySelector('.qhelp[data-help="'+k.h+'"]'):null;bt=bt||Array.from(document.querySelectorAll('.qhelp')).filter(function(q){return k.l&&q.getAttribute('aria-label')===k.l;})[0]||null;}if(!hs||hs.hidden)return null;var a=bt&&bt.getBoundingClientRect().height?bt.getBoundingClientRect():window.__qr,inn=hs.querySelector('.hs-in')||hs,h=inn.getBoundingClientRect();return {below:h.top-a.bottom,above:a.top-h.bottom,txt:inn.innerText,label:bt?bt.getAttribute('aria-label')||bt.textContent:sel,dbg:'btn '+Math.round(a.top)+'-'+Math.round(a.bottom)+', help '+Math.round(h.top)+'-'+Math.round(h.bottom)+', style top '+hs.style.top+' bottom '+hs.style.bottom};},q);
    if(r){await say('? '+r.label,r.txt);const ok=(r.below>=-2&&r.below<=16)||(r.above>=-2&&r.above<=16);if(!ok)fail('help','? "'+r.label+'" opened '+Math.round(Math.min(Math.abs(r.below),Math.abs(r.above)))+' px from its button ('+r.dbg+')');}
    await p.click('#hs-x').catch(()=>{});}}
  if(ui.farm)break;
 }
 function H_log(n,o){text.push('[header] '+o.hh+'→'+n.hh+' px on day '+n.day+', rows '+o.rows+' → '+n.rows);}
 const end=await p.evaluate(()=>({day:Math.floor(G.day),farm:farmBuilt(G),sold:G.stats.sold,kits:G.kits.sold||0}));
 const out=path.join(os.tmpdir(),'shrimp-human-text'+(W!==390?'-'+W:'')+'.txt');fs.writeFileSync(out,text.join('\n')+'\n');
 if(!end.farm)fail('progress','no farm after '+MAXS+' s (day '+end.day+', '+end.sold+' sold, '+end.kits+' kits)');
 errs.forEach(e=>fail('page error',e));
 const uniq=[...new Set(fails)];uniq.forEach(f=>console.log('FAIL '+f));
 console.log('played to day '+end.day+(end.farm?' (first farm)':'')+' in '+Math.round((Date.now()-t0)/1000)+' s at '+W+' px; text dump: '+out+' ('+text.length+' lines)');
 console.log(uniq.length?uniq.length+' FAILED':'all ok');await b.close();srv.close();process.exit(uniq.length?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
