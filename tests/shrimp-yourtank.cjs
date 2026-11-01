// Pass 200: Your tank reads the same on the company page and on Grandma's land. Same job tiles in the same order with the
// same state lines, Wellbeing, and Food and water (food, treats, water readings, automation) on both; a food tap or an
// automation slider on the land changes the game's tank. Before the land the sixth tile is Check shrimp.
// 390x844 Chromium over http (the land is an iframe). Screenshots go to os.tmpdir() only.
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),os=require('os');
const ROOT=path.join(__dirname,'../shrimp');
const TYPES={'.html':'text/html','.js':'text/javascript','.mp3':'audio/mpeg','.png':'image/png','.ico':'image/x-icon'};
let fails=0;const ok=(c,m)=>{if(c)console.log('PASS',m);else{fails++;console.log('FAIL',m);}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const srv=await new Promise(r=>{const s=http.createServer((q,a)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){a.writeHead(404);a.end();return;}a.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(a);});s.listen(0,()=>r(s));});
 const url='http://127.0.0.1:'+srv.address().port+'/index.html';
 const b=await chromium.launch(),W=+(process.env.YT_W||390);const p=await b.newPage({viewport:{width:W,height:844}});const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/net::ERR_/.test(m.text()))errs.push(m.text());});p.on('dialog',d=>d.dismiss());
 await p.goto(url);await p.waitForFunction(()=>typeof newGame==='function'&&window.G);
 const setup=async(land)=>{await p.evaluate((land)=>{var g=newGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;T.feeder=1;T.autoWC=1;T.pop=[{n:30,age:120,g:60},{n:10,age:20,g:40}];
  g.ob.bottle=1;g.opt.all=true;g.me=newMe();g.me.on=1;g.emp.farms.rack=1;g.money=1e6;g.day=g.tday=400;ownTankNow(g);if(land)g.me.gplace={balcony:1,house:1,land:1};
  var C=careOf(T);C.mulm=0.5;C.sponge=0.1;C.grow=0.5;C.mc=null;ckMulm(C);C.pests=[{k:'snail',x:0.3,y:0.85,s:101}];C.pestAt=g.tday;
  T.glass=[];for(var i=0;i<GLASS_W*GLASS_H;i++)T.glass.push(0.2);g.treatsOwned={};g.progress.queue=[];g.savedLand=1;g.savedAt=Date.now();
  G=g;localStorage.setItem(saveKey,JSON.stringify(g));},land);
  await p.reload();await p.waitForFunction(()=>window.G&&G.tanks&&G.me);await p.evaluate(()=>{window.spotlight=function(){};G.progress.queue=[];setSpeed(0);selectTab('tank');render();});await wait(300);};
 const tiles=()=>p.evaluate(()=>Array.from(document.querySelectorAll('#tv-care>.btn')).filter(b=>!b.hidden&&getComputedStyle(b).display!=='none').sort((a,c)=>(+a.style.order||0)-(+c.style.order||0)).map(b=>({n:(b.querySelector('span')||b).textContent.trim(),s:(b.querySelector('small')||{}).textContent||'',vis:b.style.visibility!=='hidden',r:b.getBoundingClientRect().width})));
 // 1. before the land: six tiles, Check shrimp in the fifth place
 await setup(false);let t=await tiles();
 ok(t.map(x=>x.n).join(',')==='Vacuum,Sponge,Trim,Pests,Check shrimp,Glass','before the land: '+t.map(x=>x.n).join(', '));
 ok(t.every(x=>x.vis&&x.s),'every tile shows with a state line ('+t.map(x=>x.s).join(' / ')+')');
 const c1=await p.evaluate(()=>({name:G.tanks[0].name,well:!$('wellcard').hidden,fw:!$('owncare').hidden,feed:$('feedcard').hidden,wt:$('wtcard').hidden,auto:$('oc-auto').contains($('auto-feed')),food:$('oc-body').querySelectorAll('[data-act="food"]').length,chips:$('oc-body').querySelectorAll('.chip').length,
  order:['wellcard','owncare','colcard','logcard'].map(id=>$(id).getBoundingClientRect().top)}));
 ok(c1.name==='Your tank','the tank is called Your tank');
 ok(c1.well&&c1.fw&&c1.feed&&c1.wt,'company shows Wellbeing and Food and water, not Feeding or Water test');
 ok(c1.auto&&c1.food===3&&c1.chips===7,'Food and water has 3 foods, 7 water readings and the automation sliders');
 ok(c1.order.every((v,i,a)=>i===0||v>a[i-1]),'order: Wellbeing, Food and water, Colony, Recent events');
 await p.evaluate(()=>{document.querySelector('#oc-body [data-act="food"][data-i="2"]').click();});await wait(200);
 ok(await p.evaluate(()=>G.tanks[0].set.food===2),'a food tap on the company page sets the food');
 await p.screenshot({path:path.join(os.tmpdir(),'yt-company-'+W+'.png'),fullPage:true});
 // 2. with the land: Aquascape replaces Check shrimp, the land shows the same tiles and lines
 await setup(true);t=await tiles();
 ok(t.map(x=>x.n).join(',')==='Vacuum,Sponge,Trim,Pests,Aquascape,Glass','with the land: '+t.map(x=>x.n).join(', '));
 const sy=await p.evaluate(()=>scrollY);await p.evaluate(()=>render());
 await p.evaluate(()=>landShow());let f=null;for(let i=0;i<100&&!f;i++){f=p.frames().find(x=>x.url().includes('home.html'));await wait(100);}
 await f.waitForFunction(()=>typeof S!=='undefined'&&S&&S.tanks&&S.tanks[0]&&S.tanks[0].own,null,{timeout:20000});
 await f.evaluate(()=>{S.sel=0;setTab('tank');});await f.waitForFunction(()=>document.querySelector('#tankside [data-k="fw"]'),null,{timeout:10000});await wait(500);
 const lt=await f.evaluate(()=>Array.from(document.querySelectorAll('#toybtns .btn')).map(b=>({n:b.childNodes[1]?b.childNodes[1].textContent.trim():b.textContent,s:(b.querySelector('small')||{}).textContent})));
 const gl=await p.evaluate(()=>{var L=ownLines(G);return L;});
 ok(lt.map(x=>x.n).join(',')==='Vacuum,Sponge,Trim,Pests,Aquascape,Glass','land tiles: '+lt.map(x=>x.n).join(', '));
 ok(['vac','sponge','trim','pests','glass'].every((k,i)=>lt[[0,1,2,3,5][i]].s===gl[k]),'land state lines match the game ('+lt.map(x=>x.s).join(' / ')+')');
 const lc=await f.evaluate(()=>Array.from(document.querySelectorAll('#tankside .card h2')).map(h=>h.textContent));
 ok(lc.slice(0,3).join(',')==='Wellbeing,Food and water,Colony','land cards: '+lc.join(', '));
 const wbL=await f.evaluate(()=>document.querySelector('#tankside [data-k="wb"] small').textContent),wbG=await p.evaluate(()=>$('wb-sum').textContent);
 ok(wbL===wbG,'Wellbeing reads the same ('+wbL+' / '+wbG+')');
 await f.evaluate(()=>document.querySelector('[data-fw="food"][data-i="1"]').click());await wait(1500);
 ok(await p.evaluate(()=>G.tanks[0].set.food===1),'a food tap on the land sets the game\'s food');
 ok(await f.evaluate(()=>document.querySelector('[data-fw="food"][data-i="1"]').getAttribute('aria-pressed')==='true'),'the land card shows the new food after the game syncs');
 await f.evaluate(()=>{var i=document.querySelector('[data-fwset="autoRation"]');i.value=150;i.dispatchEvent(new Event('change',{bubbles:true}));});await wait(1500);
 ok(await p.evaluate(()=>G.tanks[0].set.autoRation===150),'the auto feed slider on the land sets the game\'s auto feed');
 await f.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(os.tmpdir(),'yt-land-'+W+'.png'),fullPage:false});
 await f.evaluate(()=>{var s=document.querySelector('#tankside [data-k="fw"]');if(s)s.scrollIntoView();});await p.screenshot({path:path.join(os.tmpdir(),'yt-land2-'+W+'.png')});
 ok(!errs.length,'no page errors'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
 await b.close();srv.close();console.log(fails?fails+' FAILED':'all passed');process.exit(fails?1:0);})();
