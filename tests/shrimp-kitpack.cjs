// Pass 284: the kit packing art from kit-packing-preview. Five manual steps with their own art (Seal too),
// tools take steps over, after the fifth tool one looping sprite with a Pack button, kit extras in one row with icons.
// Browser, file://, 390 and 360 (KP_W to pick one). Screenshots go to os.tmpdir().
const {chromium}=require('playwright'),path=require('path'),os=require('os');
let fails=0;const ok=(c,m)=>{if(c)console.log('PASS',m);else{fails++;console.log('FAIL',m);}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{for(const W of process.env.KP_W?[+process.env.KP_W]:[390,360]){
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:844}});const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.dismiss());
 await p.goto('file://'+path.join(__dirname,'../shrimp/index.html'));await p.waitForFunction(()=>typeof newGame==='function'&&window.G);
 await p.evaluate(()=>{localStorage.clear();var g=newGame();Object.keys(MILESTONES).forEach(function(k){g.progress.seen[k]=true;});g.progress.queue=[];g.progress.wait=[];g.progress.soon=[];g.progress.v2=g.progress.v3=1;
  g.day=190;g.money=6000;g.ob.kit=1;g.ob.bottle=1;g.ob.excel500=1;g.emp.kitsOpened=true;g.kits.stock=1;g.opt.pauseTold=true;g.opt.hcDone=true;g.opt.spotSeen=new Proxy({},{get:function(){return 1;}});
  var T=g.tanks[0];T.had=1;T.cycledAt=0;T.pop=[{age:50,n:120,g:65,b:0}];T.chem.nutr=.85;KIT_EXTRAS.forEach(function(id){wb(g)[id]=1;});
  G=g;window.spotlight=function(){};setSpeed(0);selectTab('emp');render();});
 await wait(300);
 // 1. manual: five steps, each with its own art, Seal its own sheet
 let s=await p.evaluate(()=>[...document.querySelectorAll('#kit-steps .pstep')].map(e=>{var a=e.querySelector('[data-step-art]');return {t:e.textContent,art:a&&a.dataset.stepArt,bg:a&&a.style.backgroundImage};}));
 ok(s.length===5&&s.every(x=>/\.png/.test(x.bg||'')),W+': five steps with art ('+s.map(x=>x.art).join(',')+')');
 ok((s[3]||{}).bg&&/seal\.png/.test(s[3].bg),W+': Seal has its own art');
 const st0=await p.evaluate(()=>G.kits.stock);
 for(let i=0;i<5;i++){await p.evaluate(()=>document.getElementById('btn-handstep').click());await wait(i===0?60:30);
  if(i===0)ok(await p.evaluate(()=>!!document.querySelector('#kit-steps .pstep.is-playing')),W+': a step tap plays its art');await p.evaluate(()=>render());}
 ok(await p.evaluate(()=>G.kits.stock)===st0+1,W+': five taps pack a kit');
 ok(await p.evaluate(()=>document.getElementById('auto-pack-loop').hidden),W+': no loop before the station');
 await p.screenshot({path:path.join(os.tmpdir(),'kp-manual-'+W+'.png')});
 // 2. buy the five tools, the fifth one gives the loop and Pack
 await p.evaluate(()=>{G.money=50000;render();});
 for(let i=0;i<5;i++){const n=await p.evaluate(()=>{var x=document.querySelector('#kit-steps [data-act="tool"]');if(!x)return 0;x.click();render();return 1;});if(!n)break;await wait(30);}
 const a=await p.evaluate(()=>({done:stationDone(G),steps:document.getElementById('kit-steps').hidden,loop:!document.getElementById('auto-pack-loop').hidden,pack:!document.getElementById('btn-pack1').hidden&&!document.getElementById('btn-pack1').disabled,txt:document.getElementById('btn-pack1').textContent,cost:document.getElementById('e-pack-cost').textContent}));
 ok(a.done&&a.steps&&a.loop,W+': fifth tool: station done, steps go, loop shows');
 ok(a.pack&&a.txt==='Pack'&&/AED/.test(a.cost),W+': Pack button with its cost ('+a.cost+')');
 await p.evaluate(()=>document.getElementById('auto-pack-loop').scrollIntoView({block:'center'}));await wait(150);
 const f1=await p.evaluate(()=>{var x=document.querySelector('#auto-pack-loop .pack-sprite');return x.dataset.sheet+x.style.backgroundPositionX;});await wait(450);
 const f2=await p.evaluate(()=>{var x=document.querySelector('#auto-pack-loop .pack-sprite');return x.dataset.sheet+x.style.backgroundPositionX;});
 ok(f1!==f2,W+': the loop moves ('+f1+' -> '+f2+')');
 const sk=await p.evaluate(()=>{var x=G.kits.stock;document.getElementById('btn-pack1').click();return G.kits.stock-x;});
 ok(sk===1,W+': Pack packs one kit');
 await p.screenshot({path:path.join(os.tmpdir(),'kp-auto-'+W+'.png')});
 // 3. extras: one row with icons, nothing cut, a tap toggles the cost
 await p.evaluate(()=>{G.kits.sold=Math.max(G.kits.sold,20);render();var e=document.getElementById('kit-design');if(e)e.scrollIntoView({block:'center'});});await wait(150);
 const x=await p.evaluate(()=>{var bs=[...document.querySelectorAll('#kit-design .kx .btn')];var tops=new Set(bs.map(b=>Math.round(b.getBoundingClientRect().top)));
  return {n:bs.length,row:tops.size,img:bs.every(b=>b.querySelector('img.kit-extra-icon')),cut:bs.filter(b=>b.scrollWidth>b.clientWidth+1).map(b=>b.textContent)};});
 ok(x.n===4&&x.row===1&&x.img,W+': four extras in one row with icons');
 ok(!x.cut.length,W+': no extra cut ('+x.cut.join(',')+')');
 const t=await p.evaluate(()=>{var m0=kitMaterials(G),b=document.querySelector('#kit-design [data-id="moss"]'),on0=b.getAttribute('aria-pressed');b.click();render();var b2=document.querySelector('#kit-design [data-id="moss"]');return {d:kitMaterials(G)-m0,on0,on1:b2.getAttribute('aria-pressed'),cost:document.getElementById('e-pack-cost').textContent,want:aed(kitMaterials(G))};});
 ok(t.d!==0&&t.on0!==t.on1,W+': a tap on Moss toggles it and the kit cost moves ('+t.d+')');
 ok(t.cost.indexOf(t.want)===0,W+': the Pack cost line follows the extras ('+t.cost+')');
 await p.screenshot({path:path.join(os.tmpdir(),'kp-extras-'+W+'.png')});
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),W+': no sideways scroll');
 ok(!errs.length,W+': no page errors '+errs.slice(0,2).join(' | '));
 await b.close();}
 console.log(fails?fails+' kit packing checks failed':'kit packing checks passed');process.exit(fails?1:0);})();
