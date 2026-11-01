// Pass 190: taps never go through a story card. While a card is open the page is inert behind a backdrop,
// and for 350 ms after it closes, taps outside it are dropped (iOS ghost click). Touch emulation, 390 px.
const {chromium}=require('playwright');const fs=require('fs');
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.dismiss());
 await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(300);
 // a mid-game page with buttons, then a story card on top
 await p.evaluate(()=>{G=newGame();G.name='Test';G.progress.seen.intro=true;G.progress.queue=[];G.tanks[0].had=1;G.tanks[0].cycledAt=0;G.money=5000;G.stats.sold=50;window.spotlight=function(){};G.opt.all=false;render();
  window.PAGE_HITS=0;window.addEventListener('click',function(e){if(!e.target.closest('#milestone-card'))window.PAGE_HITS++;},false);
  G.progress.queue=['kit'];render();});
 await p.waitForTimeout(200);
 const st=await p.evaluate(()=>{var c=document.getElementById('milestone-card'),bt=c.querySelector('[data-act="milestone-next"]'),r=bt.getBoundingClientRect();return {open:!c.hidden,x:r.left+r.width/2,y:r.top+r.height/2,mainInert:[...document.querySelector('main').children].some(x=>x.inert),tabsInert:document.querySelector('.tabs').inert,on:cardShield.on,kids:[...document.querySelector('main').children].map(x=>x.id+':'+x.inert).join(' ')};});
 if(!st.open)throw Error('card did not open');if(!st.mainInert||!st.tabsInert)throw Error('page behind the card is not inert '+JSON.stringify(st));
 await p.waitForTimeout(400);
 // tap the page outside the card: nothing behind reacts
 await p.touchscreen.tap(195,800);await p.waitForTimeout(100);
 let hits=await p.evaluate(()=>PAGE_HITS);if(hits)throw Error('a tap outside the card reached the page');
 // tap the card button, then a ghost tap at the same spot 80 ms later
 await p.touchscreen.tap(st.x,st.y);await p.waitForTimeout(80);
 const after=await p.evaluate(()=>({open:!document.getElementById('milestone-card').hidden,inert:[...document.querySelector('main').children].some(x=>x.inert)}));
 if(after.open)throw Error('card did not close');if(after.inert)throw Error('page still inert after the card closed');
 await p.touchscreen.tap(st.x,st.y);await p.waitForTimeout(50);
 hits=await p.evaluate(()=>PAGE_HITS);if(hits)throw Error('ghost tap went through: '+hits);
 // later taps work again
 await p.waitForTimeout(400);await p.touchscreen.tap(st.x,st.y);await p.waitForTimeout(50);
 hits=await p.evaluate(()=>PAGE_HITS);if(hits<1)throw Error('page taps blocked after the guard');
 if(errs.length)throw Error(errs[0]);
 console.log('card tap checks passed');await b.close();})().catch(e=>{console.error(e.message);process.exit(1);});
