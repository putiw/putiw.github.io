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
 await g.close();M.done('tank');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
