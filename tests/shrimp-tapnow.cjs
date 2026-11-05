// Pass 268 (item 14): every enabled choice option and buy button on Kits and Ads answers a tap made 100 ms after a render,
// with the game running. Headless Chromium at 390 px on the average bot's saves. Needs HARD_RUN (an average bot run json).
// For each button: fresh save, open the tab, play 1.5 s, wait for a render, 100 ms later pause and real-click it, and check
// the save changed. TAP_SPEED (default 4) sets the play speed, TAP_STAGES the snapshots.
const {chromium}=require('playwright');const fs=require('fs'),os=require('os');
const RUN=process.env.HARD_RUN||os.tmpdir()+'/shrimp-average/run-7.json',snaps=JSON.parse(fs.readFileSync(RUN,'utf8')).snapshots;
const STAGES=(process.env.TAP_STAGES||'year 5,year 8,year 12').split(','),SPEED=+(process.env.TAP_SPEED||4);
const ACTS=['proj','hire','line','wb','camp','ai','movie','region','stores','storefill','shop','qc-strict','dens'];
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');let n=0;const bad=[],gone=[],cards=[];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(300);
 /* the 250 ms render interval holds the old render, so mark renders through settleScan, which every render calls last */
 await p.evaluate(()=>{var s0=settleScan;settleScan=function(){window.__lastR=performance.now();return s0.apply(this,arguments);};});
 const load=async(st,t)=>{await p.evaluate(s=>{G=JSON.parse(s);migrate(G);G.progress.queue=[];window.spotlight=function(){};speed=0;G.money=1e12;G.emp.inf=1e9;FRZ={};$("after").hidden=true;AFTER_HOLD=null;render();},JSON.stringify(snaps[st]));await p.click('.tabs [data-tab="'+t+'"]');await p.waitForTimeout(200);};
 const list=()=>p.evaluate(A=>[...document.querySelectorAll('main .card:not([hidden]) button[data-act]')].filter(b=>b.getClientRects().length&&!b.disabled&&A.indexOf(b.dataset.act)>=0).map(b=>{var d=b.dataset,k=Object.keys(d).sort().map(x=>x+'='+d[x]).join('&');return k;}),ACTS);
 const SKIP=['tanks','ps','tday','tq','tstep','tAt','savedAt','illClock','illAt'];
 const sig=()=>p.evaluate(S=>JSON.stringify(G,function(k,v){return S.indexOf(k)>=0?undefined:v;}),SKIP);
 for(const st of STAGES)for(const t of ['emp','promote']){await load(st,t);const keys=await list();
  for(const k of keys){await load(st,t);await p.evaluate(s=>{speed=s;},SPEED);await p.waitForTimeout(1500);
   const sel='main .card:not([hidden]) button'+k.split('&').map(kv=>{var i=kv.indexOf('=');return '[data-'+kv.slice(0,i).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())+'="'+kv.slice(i+1).replace(/"/g,'\\"')+'"]';}).join('');
   await p.evaluate(sl=>{var b=document.querySelector(sl);if(b&&b.getClientRects().length)b.scrollIntoView({block:'center'});},sel);await p.waitForTimeout(300);
   await p.evaluate(()=>new Promise(r=>{var t0=window.__lastR;(function w(){if(window.__lastR!==t0){setTimeout(function(){speed=0;r();},100);}else requestAnimationFrame(w);})();}));
   const el=await p.$(sel);if(!el){gone.push(st+' '+t+' '+k);continue;}const off=await el.evaluate(b=>b.disabled||b.getAttribute("aria-pressed")==="true");if(off)continue;
   const s0=await sig();const bx=await el.boundingBox();if(!bx){continue;}
   if(await p.evaluate(()=>!$('milestone-card').hidden||!!G.progress.queue.length)){cards.push(st+' '+t+' '+k);continue;}/* a story card came up while playing: its shield takes taps on purpose */
   const cov=await p.evaluate(a=>{var e=document.elementFromPoint(a[1],a[2]),b=document.querySelector(a[0]);return e&&b&&(e===b||b.contains(e))?'':(e?e.tagName+'#'+e.id+'.'+e.className:'nothing');},[sel,bx.x+bx.width/2,bx.y+bx.height/2]);
   await p.mouse.click(bx.x+bx.width/2,bx.y+bx.height/2);await p.waitForTimeout(150);const s1=await sig();n++;
   if(s0===s1){const why=cov?'covered by '+cov:await p.evaluate(sl=>{var b=document.querySelector(sl);return b?(b.classList.contains('settling')?'swallowed by SETTLE':b.disabled?'grey now':'no change'):'gone';},sel);bad.push(st+' '+t+' '+k+': '+why);}}}
 if(errs.length)bad.push('page errors: '+errs.join(' | '));
 if(bad.length){console.error('FAIL '+bad.length+' of '+n+' taps did nothing:\n  '+bad.join('\n  '));process.exit(1);}
 if(gone.length)console.log('note: gone after 1.5 s of play, not tapped: '+gone.join(', '));if(cards.length)console.log('note: a story card came up, not tapped: '+cards.join(', '));console.log('PASS '+n+' taps 100 ms after a render all changed the save ('+STAGES.join(', ')+', Kits and Ads, speed '+SPEED+')');await b.close();})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
