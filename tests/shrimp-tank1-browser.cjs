// Pass 179, browser half of tests/shrimp-tank1.cjs: the company page and Grandma's land draw Tank 1 from the same data.
// Serves shrimp/ over http (the land is an iframe), 390x844. Screenshots, if any, go to os.tmpdir(), never the repo.
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'../shrimp');
const TYPES={'.html':'text/html','.js':'text/javascript','.mp3':'audio/mpeg','.png':'image/png','.ico':'image/x-icon'};
function serve(){return new Promise(r=>{const s=http.createServer((q,a)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){a.writeHead(404);a.end();return;}a.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(a);});
 s.listen(0,()=>r(s));});}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
module.exports=async function(ok){
 const srv=await serve(),url='http://127.0.0.1:'+srv.address().port+'/index.html';
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.dismiss());
 await p.goto(url);await p.waitForFunction(()=>typeof newGame==='function'&&window.G);
 // a game with the land, Tank 1 cycled with 30 shrimp, a month and a half of mess, two pests, green glass
 await p.evaluate(()=>{var g=newGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;T.feeder=1;T.autoWC=1;T.pop=[{n:30,age:120,g:60},{n:10,age:20,g:40}];
  g.ob.bottle=1;g.opt.all=true;g.me=newMe();g.me.on=1;g.me.keep='self';g.me.gplace={balcony:1,house:1,land:1};g.emp.farms.rack=1;g.money=1e6;g.day=g.tday=400;
  var C=careOf(T);C.mulm=0.5;C.sponge=0.5;C.grow=0.5;C.mc=null;ckMulm(C);C.pests=[{k:'snail',x:0.3,y:0.85,s:101},{k:'flat',x:0.6,y:0.45,s:202}];C.pestAt=g.tday;
  T.glass=[];for(var i=0;i<GLASS_W*GLASS_H;i++)T.glass.push(0.6);g.progress.queue=[];g.savedLand=1;g.savedAt=Date.now();
  G=g;localStorage.setItem(saveKey,JSON.stringify(g));});   // G too: the page saves G on pagehide
 const boot=async()=>{await p.reload();await p.waitForFunction(()=>window.G&&G.tanks&&G.me&&G.me.gplace);await p.evaluate(()=>{window.spotlight=function(){};G.progress.queue=[];});};
 await boot();
 // 1. 40x company speed leaves Tank 1 at 2.4 s a tank day
 const r=await p.evaluate(async()=>{G.progress.queue=[];window.maxSpeed=function(){return 40;};setSpeed(40);G.tAt=Date.now();var t0=G.tday+((G.tstep||0)+(G.tq||0))/4,d0=G.day;await new Promise(r=>setTimeout(r,6000));return {t:G.tday+((G.tstep||0)+(G.tq||0))/4-t0,d:G.day-d0,sp:speed};});
 ok(Math.abs(r.t-6000/2400)<0.6&&r.d>20,'at 40x company speed Tank 1 moved '+r.t.toFixed(2)+' tank days in 6 s (2.5 expected; company moved '+r.d.toFixed(1)+')');
 await p.evaluate(()=>setSpeed(0));
 // 2. the land draws the game's columns, pests and glass
 const frame=async()=>{for(let i=0;i<100;i++){const f=p.frames().find(f=>f.url().includes('home.html'));if(f)return f;await wait(100);}throw Error('no land frame');};
 const land=async()=>{await p.evaluate(()=>landShow());const f=await frame();
  await f.waitForFunction(()=>window.S&&S.tanks&&S.tanks[0]&&S.tanks[0].own&&S.tanks[0].pests.some(q=>/^g/.test(q.id)),null,{timeout:20000});await wait(1200);return f;};
 const compare=async(f,what)=>{const c=await p.evaluate(()=>{var C=careOf(G.tanks[0]);return {mc:ckMulm(C),ps:C.pests.map(q=>q.s+':'+q.x.toFixed(2)+','+q.y.toFixed(2)).sort().join(' ')};});
  const l=await f.evaluate(()=>{var T=S.tanks[0];return {mc:T.mulm.map(v=>v/0.8),ps:T.pests.map(q=>q.id.slice(1)+':'+q.x.toFixed(2)+','+q.y.toFixed(2)).sort().join(' ')};});
  const dm=Math.max(...c.mc.map((v,i)=>Math.abs(v-l.mc[i])));
  ok(dm<0.035,what+': mulm columns match within two tank days of new mulm (max diff '+dm.toFixed(3)+')');ok(c.ps===l.ps,what+': pests match ('+c.ps+' | '+l.ps+')');return c;};
 let f=await land();await compare(f,'first visit');
 // 3. a clean on the land: half the gravel, one pest, a wipe of the top left glass
 await f.evaluate(async()=>{var T=S.tanks[0];S.sel=0;setTab('tank');await new Promise(r=>setTimeout(r,400));toyStart('vac');for(var i=0;i<24;i++)T.mulm[i]=0;toyEnd();await new Promise(r=>setTimeout(r,300));
  toyStart('pests');T.pests=T.pests.filter(q=>q.k!=='planaria');toyEnd();await new Promise(r=>setTimeout(r,300));
  toyStart('glass');TOY.down([5,TV.H*0.25]);for(var x=5;x<TV.W*0.5;x+=4)TOY.move([x,TV.H*0.25]);TOY.up();toyEnd();});
 await wait(1500);
 const after=await p.evaluate(()=>{var C=careOf(G.tanks[0]),m=ckMulm(C);return {left:Math.max(...m.slice(0,24)),pests:C.pests.map(q=>q.s).join(),g0:G.tanks[0].glass[0],g40:G.tanks[0].glass[GLASS_W*8+20]};});
 ok(after.left<0.02,'the gravel cleaned on the land is clean in the game ('+after.left.toFixed(3)+')');
 ok(after.pests==='101','the flatworm picked on the land is gone in the game, the snail stays ('+after.pests+')');
 ok(after.g0<0.5&&after.g40>0.55,'the wiped glass is clean in the game, the rest still green ('+after.g0.toFixed(2)+', '+after.g40.toFixed(2)+')');
 await compare(f,'after the land clean');
 await wait(10000);
 const later=await p.evaluate(()=>{var m=ckMulm(careOf(G.tanks[0]));return Math.max(...m.slice(0,24));});
 ok(later<0.1,'10 s later the cleaned gravel is still clean ('+later.toFixed(3)+', 4 tank days of new mulm)');
 await compare(f,'10 s later');
 // 4. reload: both pages agree again
 await p.evaluate(()=>{landHide();save(true);});await boot();f=await land();await compare(f,'after a reload');
 // 5. a care button on the company page opens the land's job and comes back
 await p.evaluate(()=>{landHide();G.sel=0;selectTab('tank');render();});
 const j=await p.evaluate(async()=>{TVLOCK=null;tvLockOn('vac');await new Promise(r=>setTimeout(r,2500));return {on:LAND.on,busy:LAND.busy};});
 f=await frame();const tid=await f.evaluate(()=>TOY&&TOY.id);
 ok(j.on&&j.busy&&tid==='vac','Vacuum on the company Tank tab opens the land on its vacuum ('+JSON.stringify(j)+' '+tid+')');
 const held=await p.evaluate(async()=>{var t=G.tday+((G.tstep||0)+(G.tq||0))/4;await new Promise(r=>setTimeout(r,3000));return G.tday+((G.tstep||0)+(G.tq||0))/4-t;});
 ok(held===0,'Tank 1 holds while the job is open ('+held+')');
 await f.evaluate(()=>toyEnd());await wait(1200);
 const back=await p.evaluate(()=>({on:LAND.on,busy:LAND.busy,tab:activeTab}));
 ok(!back.on&&!back.busy&&back.tab==='tank','Done goes back to the company Tank tab ('+JSON.stringify(back)+')');
 const grad=errs.filter(e=>/createLinearGradient|non-finite/i.test(e));ok(grad.length===0,'no non-finite gradient errors ('+grad.length+')');
 const other=errs.filter(e=>!/createLinearGradient|non-finite|Failed to load resource|AudioContext/i.test(e));ok(other.length===0,'no other page errors'+(other.length?': '+other.slice(0,3).join(' | '):''));
 await b.close();srv.close();};
