// Pass 266 (items 6, 13, 17): projects render in exactly one card, a bought row doesn't follow the player to the next tab,
// and the campaign desk's reserved height lets go on a tab change. Headless Chromium at 390 px on the average bot's year-5 save.
// Needs a bot run json: HARD_RUN (default /tmp/shrimp-average/run-7.json, make one with node tests/shrimp-average-playthrough.cjs).
const {chromium}=require('playwright');const fs=require('fs'),os=require('os');
const RUN=process.env.HARD_RUN||os.tmpdir()+'/shrimp-average/run-7.json';
const snaps=JSON.parse(fs.readFileSync(RUN,'utf8')).snapshots,S=snaps[process.env.STAGE||'year 5'];
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');let n=0;const ok=m=>{n++;console.log('PASS',m);};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(300);
 await p.evaluate(s=>{G=s;migrate(G);G.progress.queue=[];window.spotlight=function(){};speed=0;G.money=1e12;G.emp.inf=1e7;G.emp.movie.left=0;render();},S);
 const TABS=['up','promote','emp','world','research'],where={};
 for(const t of TABS){await p.click('.tabs [data-tab="'+t+'"]');await p.waitForTimeout(250);
  const ids=await p.evaluate(()=>[...document.querySelectorAll('main .card:not([hidden]) [data-act="proj"],main .card:not([hidden]) [data-act="movie"]')].filter(b=>b.getClientRects().length).map(b=>b.dataset.id||'movie'));
  ids.forEach(id=>{(where[id]=where[id]||[]).push(t);});}
 const dup=Object.keys(where).filter(k=>new Set(where[k]).size>1);if(dup.length)throw Error('project on two tabs: '+JSON.stringify(dup.map(k=>[k,where[k]])));ok('every project button on one tab: '+Object.keys(where).length+' ids over '+TABS.length+' tabs');
 // buy a media project on Ads, go to the Lab: the frozen row must not come along
 await p.click('.tabs [data-tab="promote"]');await p.waitForTimeout(700);
 const bt=await p.$('#e-proj .item.ih [data-act="proj"]:not(:disabled)');if(!bt)throw Error('no project to buy on Ads');const pid=await bt.evaluate(b=>b.dataset.id);await bt.click();await p.waitForTimeout(300);
 const f1=await p.evaluate(()=>({frz:Object.keys(FRZ).length,lab:document.querySelector('#e-proj .item.ih [data-act="proj"]:disabled').textContent}));if(!f1.frz||f1.lab!=='Done')throw Error('after the tap '+JSON.stringify(f1));ok('bought '+pid+': row stays, label Done');
 await p.click('.tabs [data-tab="research"]');await p.waitForTimeout(300);
 const f2=await p.evaluate(id=>({frz:Object.keys(FRZ).length,leak:!!document.querySelector('#e-proj [data-id="'+id+'"]'),title:document.querySelector('#c-proj h2').textContent}),pid);
 if(f2.frz||f2.leak)throw Error('the bought row followed to the Lab '+JSON.stringify(f2));ok('tab change lets the frozen list go ('+f2.title+' has no '+pid+')');
 // campaign desk: Launch keeps the three-offer height until a tab change, then the slot shrinks
 await p.click('.tabs [data-tab="promote"]');await p.waitForTimeout(700);
 const d0=await p.evaluate(()=>{var o=G.emp.op;if(!o.offer||o.run)return null;var s=document.querySelector('.desk-slot');return s?s.offsetHeight:null;});
 if(d0){const lb=await p.$('#op-desk [data-act="camp"]:not(:disabled)');if(lb){await lb.click();await p.waitForTimeout(300);
  const d1=await p.evaluate(()=>({h:document.querySelector('.desk-slot').offsetHeight,hold:DESK_HOLD}));if(d1.h<d0-2||!d1.hold)throw Error('desk shrank on the tap '+JSON.stringify([d0,d1]));
  await p.click('.tabs [data-tab="world"]');await p.waitForTimeout(200);await p.click('.tabs [data-tab="promote"]');await p.waitForTimeout(300);
  const d2=await p.evaluate(()=>({h:document.querySelector('.desk-slot').offsetHeight,hold:DESK_HOLD,run:!!G.emp.op.run}));if(d2.hold||!d2.run||d2.h>=d0-20)throw Error('desk kept the gap after a tab change '+JSON.stringify([d0,d1,d2]));ok('desk: tap keeps '+d0+' px, after a tab change '+d2.h+' px');}}
 else console.log('skip desk (no offers waiting on this save)');
 if(errs.length)throw Error('page errors: '+errs.join(' | '));console.log(n+' project tab checks passed');await b.close();})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
