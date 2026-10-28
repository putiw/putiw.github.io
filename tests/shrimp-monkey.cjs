// Monkey test: random taps on every strong-bot snapshot plus a new game, to catch crashes and broken state.
// Needs the game on http (sound, home.html):  cd shrimp && python3 -m http.server 8765 --bind 127.0.0.1
// MONKEY_RUN=<dir>/run-7.json  MONKEY_OUT=<file outside the repo>.json  [MONKEY_N=2000] [MONKEY_SEED=7] [MONKEY_MIN=10]
// An overlay counts as stuck after 30 actions and 5 s (decision buttons ignore taps for a moment, SETTLE_MS).
// [MONKEY_URL=http://127.0.0.1:8765/index.html] [MONKEY_STAGE=<name>] to rerun one stage. Same seed, same taps.
const {chromium}=require('playwright');const fs=require('fs');
const RUN=process.env.MONKEY_RUN||'/tmp/shrimp-tests/run-7.json';
const URL=process.env.MONKEY_URL||'http://127.0.0.1:8765/index.html';
const N=+process.env.MONKEY_N||2000,SEED=+process.env.MONKEY_SEED||7,CAP=(+process.env.MONKEY_MIN||10)*60e3;
const snaps=JSON.parse(fs.readFileSync(RUN,'utf8')).snapshots;
let stages=['new game'].concat(Object.keys(snaps));
if(process.env.MONKEY_STAGE)stages=stages.filter(s=>s===process.env.MONKEY_STAGE);

// Runs in the page. One call does a batch of random actions and the checks after each one.
function monkeyInit(seed){
 var s=seed>>>0;function R(){s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
 var DANGER=/new game|start over|erase|bankrupt|sell for|sell the company|close the company|game ends|tap again/i;
 var DANGER_ACT={reset:1,'sell-co':1,gland:1};
 var OVS=['after','spot','finsheet','hcheck','spsheet','tsheet','settings','land-ov','tv-dim','milestone-card','apop'];
 var M=window.__mk={log:[],stuck:{},blocked:[],n:0,kinds:{},day0:window.G?G.day:0};
 if(window.__mkSelfTest)setTimeout(function(){G.money=NaN;},1500);
 window.spotlight=function(){};window.spotNext=function(){if(window.SPOTQ)SPOTQ.length=0;};
 var _land=window.landShow;window.landShow=function(){M.blocked.push('landShow');};
 var _end=window.endGame;window.endGame=function(G,k){M.blocked.push('endGame '+k);return false;};
 function vis(el){if(!el||el.hidden)return false;var r=el.getClientRects();if(!r.length)return false;var cs=getComputedStyle(el);return cs.visibility!=='hidden'&&cs.display!=='none';}
 function lbl(el){var t=(el.innerText||el.value||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,40);return el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+(el.dataset&&el.dataset.act?'['+el.dataset.act+']':'')+(t?' "'+t+'"':'');}
 function safe(el){if(el.closest('#land-ov'))return false;if(el.dataset&&DANGER_ACT[el.dataset.act])return false;if(DANGER.test(el.innerText||el.value||''))return false;
  if(el.tagName==='A'&&el.getAttribute('href')&&el.getAttribute('href')[0]!=='#')return false;if(el.type==='file')return false;return true;}
 function openOv(){for(var i=0;i<OVS.length;i++){var e=document.getElementById(OVS[i]);if(e&&vis(e))return e;}return null;}
 function ovKey(ov){var h=ov.querySelector('h2,h3,b');return ov.id+(h?' "'+h.textContent.trim().slice(0,30)+'"':'');}
 function pick(a){return a[Math.floor(R()*a.length)];}
 function tap(el,how){try{el.scrollIntoView({block:'center'});}catch(e){}el.click();return how+' '+lbl(el);}
 function closer(ov){var bs=[].slice.call(ov.querySelectorAll('button,[role=button],summary')).filter(function(b){return vis(b)&&!b.disabled&&safe(b);});
  var c=bs.filter(function(b){return /close|done|go on|back|cancel|skip|stop|later|leave|^ok|not now|got it|×|✕/i.test((b.innerText||b.getAttribute('aria-label')||'').trim());});
  return c.length?pick(c):bs.length?pick(bs):null;}
 function act(){var ov=openOv(),root=document,G=window.G;
  var ok=ov?ovKey(ov):'';if(ov){var st=M.stuck[ok]||(M.stuck[ok]={n:0,t:Date.now()});st.n++;}Object.keys(M.stuck).forEach(function(k){if(k!==ok)delete M.stuck[k];});
  if(ov&&ov.id==='spot'){ov.click();return 'tap spotlight';}
  if(ov&&R()<0.6){var c=closer(ov);if(c)return tap(c,'close');if(ov.id==='finsheet'&&typeof closeFin==='function'){closeFin();return 'closeFin()';}
   document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));ov.click();return 'escape '+ov.id;}
  if(ov&&ov.id!=='milestone-card'&&ov.id!=='apop')root=ov;
  var r=R();
  if(root===document&&r<0.08){var tabs=[].slice.call(document.querySelectorAll('.tabs [data-tab]')).filter(vis);var t=pick(tabs.map(function(x){return x.dataset.tab;}).concat(['me']));selectTab(t);render();return 'tab '+t;}
  if(root===document&&r<0.11&&typeof openFin==='function'){var bc=document.getElementById('b-cash');if(bc&&vis(bc))return tap(bc,'money');}
  if(r<0.2){var ds=[].slice.call(root.querySelectorAll('details>summary,.coll>.hd')).filter(vis);if(ds.length)return tap(pick(ds),'fold');}
  if(r<0.3){var ins=[].slice.call(root.querySelectorAll('input[type=range],input[type=number]')).filter(function(e){return vis(e)&&!e.disabled;});
   if(ins.length){var e=pick(ins),lo=+e.min||0,hi=e.max!==''?+e.max:lo+100,st=+e.step||1,v=+e.value||0;v=R()<0.5?v+(R()<0.5?-st:st):lo+Math.round(R()*(hi-lo)/st)*st;
    e.value=String(Math.max(lo,Math.min(hi,v)));e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return 'slide '+lbl(e)+' '+e.value;}}
  if(r<0.33){var tx=[].slice.call(root.querySelectorAll('input[type=text],input:not([type]),input[type=checkbox],select')).filter(function(e){return vis(e)&&!e.disabled;});
   if(tx.length){var e2=pick(tx);if(e2.type==='checkbox'){e2.click();return 'check '+lbl(e2);}if(e2.tagName==='SELECT'){if(e2.options.length)e2.selectedIndex=Math.floor(R()*e2.options.length);}else e2.value=pick(['Mo','','Ana-Lu 2',"<b>x</b>'",'a very long name that goes on']);
    e2.dispatchEvent(new Event('input',{bubbles:true}));e2.dispatchEvent(new Event('change',{bubbles:true}));return 'type '+lbl(e2)+' '+e2.value;}}
  var all=[].slice.call(root.querySelectorAll('button,[role=button],[data-act]')).filter(function(b){return vis(b)&&safe(b);});
  var en=all.filter(function(b){return !b.disabled;}),pool=R()<0.05&&all.length?all:en;
  if(ov&&ov.id==='milestone-card'&&R()<0.6){var mb=en.filter(function(b){return ov.contains(b);});if(mb.length)pool=mb;}
  if(!pool.length)return 'nothing to tap';return tap(pick(pool),'tap');}
 function bad(){var G=window.G,out=[];if(!G)return['G missing'];
  if(!isFinite(G.money))out.push('G.money is '+G.money);
  (G.tanks||[]).forEach(function(T,i){(T.pop||[]).forEach(function(p,j){if(!(p.n>=0))out.push('tank '+i+' pop '+j+' n='+p.n);});});
  (function walk(o,path,d){if(!o||d>3)return;Object.keys(o).forEach(function(k){var v=o[k];if(typeof v==='number'&&isNaN(v))out.push('NaN in G.emp'+path+'.'+k);else if(v&&typeof v==='object')walk(v,path+'.'+k,d+1);});})(G.emp,'',0);
  var de=document.documentElement;if(de.scrollWidth>innerWidth+1)out.push('sideways scroll '+de.scrollWidth+' > '+innerWidth);
  Object.keys(M.stuck).forEach(function(k){var st=M.stuck[k];if(st.n>=30&&Date.now()-st.t>5000&&!st.told){st.told=1;out.push('overlay #'+k+' open for '+st.n+' actions');}});
  return out;}
 window.__mkBatch=function(k){var res=[];for(var i=0;i<k;i++){var a,ov0=openOv();M.n++;
   try{a=act();}catch(e){a='action threw';res.push({check:'action threw: '+String(e&&e.message||e).slice(0,160),n:M.n});}
   var kk=String(a).split(' ')[0];M.kinds[kk]=(M.kinds[kk]||0)+1;M.log.push(M.n+' '+a+(window.speed!=null?' (speed '+speed+')':''));if(M.log.length>20)M.log.shift();
   if(M.n%10===0){try{render();}catch(e){res.push({check:'render() threw: '+String(e&&e.message||e).slice(0,160),n:M.n});}}
   if(M.n%50===0&&!openOv()&&typeof setSpeed==='function'&&!speed)setSpeed(R()<0.5?1:4);
   bad().forEach(function(b){res.push({check:b,n:M.n});});
   if(res.length){res.forEach(function(x){x.last=M.log.slice();});break;}if(openOv()!==ov0||document.querySelector('.settling'))break;}
  if(M.blocked.length){res.push({info:M.blocked.splice(0)});}
  return res;};
}

(async()=>{const t0=Date.now();const b=await chromium.launch();const fails=[];let total=0;
 for(let si=0;si<stages.length;si++){const sk=stages[si];
  const p=await b.newPage({viewport:{width:390,height:800}});p.on('dialog',d=>d.dismiss().catch(()=>{}));
  const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+String(e.message||e).slice(0,200)));
  p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|favicon/i.test(m.text()))errs.push('console error: '+m.text().slice(0,200));});
  await p.goto(URL);await p.waitForTimeout(400);
  const load=async()=>{await p.evaluate(s=>{if(s){G=s;migrate(G);}try{render();}catch(e){}if(typeof setSpeed==='function')setSpeed(4);},sk==='new game'?null:snaps[sk]);};
  await load();if(process.env.MONKEY_SELFTEST)await p.evaluate(()=>{window.__mkSelfTest=1;});await p.evaluate(monkeyInit,SEED+si);
  const seen={};let done=0,probs=0;const budget=(CAP-(Date.now()-t0))/(stages.length-si);const ts=Date.now();
  const note=(check,last)=>{const k=check.replace(/\d+(\.\d+)?/g,'#');if(seen[k]){seen[k].times++;return;}probs++;seen[k]={stage:sk,check,last,times:1};fails.push(seen[k]);};
  while(done<N&&Date.now()-ts<budget){
   let r;try{r=await p.evaluate(k=>window.__mkBatch?window.__mkBatch(k):[{check:'page reloaded, monkey gone',n:0}],10);}catch(e){r=[{check:'evaluate failed: '+String(e.message).slice(0,160)}];}
   const lastLog=await p.evaluate(()=>window.__mk?window.__mk.log.slice():[]).catch(()=>[]);
   done=await p.evaluate(()=>window.__mk?window.__mk.n:0).catch(()=>done+10);
   for(const x of r){if(x.info)continue;note(x.check,x.last||lastLog);if(/reloaded|evaluate failed/.test(x.check)){await p.goto(URL).catch(()=>{});await p.waitForTimeout(400);await load();await p.evaluate(monkeyInit,SEED+si+done);}}
   while(errs.length)note(errs.shift(),lastLog);
   const ended=await p.evaluate(()=>!!(G&&G.emp&&G.emp.ended)).catch(()=>false);if(ended){note('game ended (should have been skipped)',lastLog);await load();}
   await p.waitForTimeout(25);}
  const info=await p.evaluate(()=>({kinds:__mk.kinds,days:Math.round((G.day-__mk.day0)*10)/10})).catch(()=>({}));
  total+=done;console.log(sk+': '+done+' taps, '+probs+' problems, '+info.days+' game days'+(done<N?' (time cap)':'')+(process.env.MONKEY_KINDS?' '+JSON.stringify(info.kinds):''));
  await p.close();}
 await b.close();
 fails.forEach(f=>{console.log('\n['+f.stage+'] '+f.check+(f.times>1?' (x'+f.times+')':''));f.last.forEach(l=>console.log('  '+l));});
 console.log('\n'+total+' taps, '+fails.length+' problems, '+Math.round((Date.now()-t0)/1000)+' s');
 if(process.env.MONKEY_OUT)fs.writeFileSync(process.env.MONKEY_OUT,JSON.stringify({seed:SEED,n:N,fails},null,1));
 process.exit(fails.length?1:0);})();
