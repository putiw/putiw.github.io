// Pass 290 moment tests, tank: the food buttons on the Tank tab (tapall said food i=1 and i=2 change nothing, kits unlocked and year 2).
// That was the test: tapnow's save signature left out G.tanks, where the food lives. The player opens Feeding, taps a food, it's set.
const M=require('../lib/moment.cjs');
(async()=>{const g=await M.open({w:390});
 for(const [bot,st] of [['strong','kits unlocked'],['strong','year 2'],['avg','year 2']]){const m=M.snap(bot,st);if(!m){M.skip(bot+' '+st,'no snapshot');continue;}
  for(const i of [0,1,2]){await g.load(m);await g.tab('tank');
   const f0=await g.js(()=>{var T=G.tanks[0];return T&&T.set.food;});if(f0===i)await g.js(j=>{G.tanks[0].set.food=(j+1)%FOODS.length;cache.segsig=null;render();},i);
   if(await g.js(()=>!$('feedcard').open))await g.tapText('#feedcard>summary',/./);
   const ok=await g.tapText('main .card:not([hidden]) button[data-act="food"][data-i="'+i+'"]',/./);
   const r=await g.js(j=>({food:G.tanks[0].set.food,pressed:(document.querySelector('main .card:not([hidden]) button[data-act="food"][data-i="'+j+'"]')||{}).getAttribute?document.querySelector('main .card:not([hidden]) button[data-act="food"][data-i="'+j+'"]').getAttribute('aria-pressed'):null}),i);
   M.check(bot+' '+st+': food i='+i+' tapped sets the food',ok&&r.food===i&&r.pressed==='true',r);}}
 // Pass 303 (UX Part B 8-13): bulk order in one line, Colony folded from Your tank, Recent events newest three, small-shop rows without rent.
 {const m=M.snap('avg','first farm');if(!m)M.skip('avg first farm','no snapshot');else{await g.load(m);await g.tab('tank');
  const r=await g.js(()=>({col:$('colcard').classList.contains('shut'),sum:$('b-berried').textContent,top:$('log').querySelectorAll(':scope>li:not(.fact-fold)').length,fold:!!$('log').querySelector(':scope>li.fact-fold details')}));
  M.check('avg first farm: Colony folded with the count on its line',r.col&&/^\d[\d,]* shrimp · \d+ berried$/.test(r.sum),r);
  M.check('avg first farm: Recent events shows three, the rest under Earlier',r.top===3&&r.fold,r);
  await g.tab('emp');const k=await g.js(()=>({t:$('ko-text').textContent,h:$('kordercard').hidden}));
  M.check('avg first farm: bulk order is one line, no how-it-works',!k.h&&/^\d[\d.,k]* kits at AED [\d,.]+ \(AED [\d,.kM]+\)\.\n?\d+ days to fill\. You can make about/.test(k.t)&&!/If you accept|each day/.test(k.t),k);}}
 {const m=M.snap('avg','first grant');if(!m)M.skip('avg first grant','no snapshot');else{await g.load(m);await g.tab('promote');
  const r=await g.js(()=>[...document.querySelectorAll('#e-shops .item p')].map(p=>p.textContent));
  M.check('avg first grant: small-shop rows say orders, not rent',r.length>0&&r.every(t=>!/rent/.test(t)),r);}}
 await g.close();M.done('tank');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
