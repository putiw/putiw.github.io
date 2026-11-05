// Pass 270: monkey test (the Pass 129 script was never committed; this is a small rewrite of what it did).
// Random taps on a new game and on snapshots of a bot run json, headless Chromium, 390 and 360 px, clock at speed 1 or 4.
// Taps visible buttons (sometimes disabled ones), tabs including You, folds, sliders. After every action: page errors,
// G.money finite, no NaN in G.emp numbers or shrimp counts, no sideways scroll. render() every 10 actions.
// MONKEY_RUN = run json (default strong bot), MONKEY_N = actions per stage (default 150), MONKEY_W = widths (default 390,360).
const {chromium}=require('playwright');const fs=require('fs'),os=require('os');
const RUN=process.env.MONKEY_RUN||os.tmpdir()+'/shrimp-strong/run-7.json';
const snaps=fs.existsSync(RUN)?JSON.parse(fs.readFileSync(RUN,'utf8')).snapshots:{};
const N=+(process.env.MONKEY_N||150),WS=(process.env.MONKEY_W||'390,360').split(',').map(Number);
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');
let seed=12345;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const keys=Object.keys(snaps);const pick=keys.length<=6?keys:[0,.2,.4,.6,.8,1].map(f=>keys[Math.min(keys.length-1,Math.round(f*(keys.length-1)))]);
const stages=['new game'].concat(pick);const bad=[];
(async()=>{const b=await chromium.launch();
 for(const W of WS)for(const st of stages){
  const p=await b.newPage({viewport:{width:W,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(300);
  if(st!=='new game')await p.evaluate(s=>{G=JSON.parse(s);migrate(G);render();},JSON.stringify(snaps[st]));
  await p.evaluate(sp=>{try{setSpeed(sp);}catch(e){speed=sp;}},rnd()<.5?1:4);
  const log=[];let fail='';
  for(let i=0;i<N&&!fail;i++){
   const r=rnd();
   const act=await p.evaluate(a=>{
    var vis=function(e){var c=e.getClientRects();return c.length&&c[0].width>0&&getComputedStyle(e).visibility!=='hidden';};
    var r=a[0],q=a[1];
    if(r<.12){var tabs=[...document.querySelectorAll('nav button, #tb-me, .tab')].filter(vis);if(tabs.length){var t=tabs[Math.floor(q*tabs.length)];t.click();return 'tab '+(t.id||t.textContent.trim().slice(0,20));}}
    if(r<.2){var f=[...document.querySelectorAll('summary, .coll > h2, .coll > .ch')].filter(vis);if(f.length){var s=f[Math.floor(q*f.length)];s.click();return 'fold '+s.textContent.trim().slice(0,24);}}
    if(r<.27){var sl=[...document.querySelectorAll('input[type=range]')].filter(vis).filter(e=>!e.disabled);if(sl.length){var e=sl[Math.floor(q*sl.length)];var lo=+e.min||0,hi=+e.max||100;e.value=String(lo+(hi-lo)*a[2]);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return 'slider '+(e.id||'')+'='+e.value;}}
    var bs=[...document.querySelectorAll('button')].filter(vis).filter(e=>r<.3||!e.disabled);
    /* never end the game or wipe the save on purpose */
    bs=bs.filter(e=>!/start over|new game|bankrupt|sell the company|close the company|reset/i.test(e.textContent));
    if(!bs.length)return 'none';var bt=bs[Math.floor(q*bs.length)];bt.click();return 'btn '+(bt.id||bt.dataset.act||'')+' '+bt.textContent.trim().replace(/\s+/g,' ').slice(0,28);
   },[r,rnd(),rnd()]);
   log.push(act);if(log.length>20)log.shift();
   await p.waitForTimeout(rnd()<.2?600:120);
   const chk=await p.evaluate(k=>{var o=[];if(!isFinite(G.money))o.push('money '+G.money);
    var bad=function(x,path,d){if(d>3||x==null)return;if(typeof x==='number'){if(isNaN(x))o.push('NaN '+path);return;}if(typeof x==='object'&&!Array.isArray(x))for(var key in x)bad(x[key],path+'.'+key,d+1);};
    bad(G.emp,'emp',0);(G.tanks||[]).forEach(function(T,i){(T.pop||[]).forEach(function(c){if(!(c.n>=0))o.push('tank'+i+' pop '+c.n);});});
    if(document.documentElement.scrollWidth>innerWidth+1)o.push('sideways scroll '+document.documentElement.scrollWidth);
    if(k%10===9){try{render();}catch(e){o.push('render: '+e.message);}}return o.slice(0,4).join('; ');},i);
   if(errs.length)fail='page error: '+errs[0];else if(chk)fail=chk;
  }
  console.log((fail?'FAIL ':'ok   ')+W+' px '+st+(fail?': '+fail:''));
  if(fail)bad.push(W+' px '+st+': '+fail+'\n    last actions: '+log.join(' | '));
  await p.close();}
 await b.close();
 if(bad.length){console.error('\n'+bad.join('\n'));process.exit(1);}
 console.log('PASS monkey, '+N+' actions on '+stages.length+' stages at '+WS.join(' and ')+' px');
})();
