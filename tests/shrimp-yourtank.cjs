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
 const c1=await p.evaluate(()=>({name:G.tanks[0].name,well:!$('wellcard').hidden,fw:!$('owncare').hidden,feed:$('feedcard').hidden,wt:$('wtcard').hidden,auto:$('oc-auto').contains($('auto-feed')),food:$('oc-body').querySelectorAll('[data-act="food"]').length,chips:$('oc-body').querySelectorAll('.wcell').length,
  order:['wellcard','owncare','colcard','logcard'].map(id=>$(id).getBoundingClientRect().top)}));
 ok(c1.name==='Your tank','the tank is called Your tank');
 ok(c1.well&&c1.fw&&c1.feed&&c1.wt,'company shows Wellbeing and Food and water, not Feeding or Water test');
 ok(c1.auto&&c1.food===3&&c1.chips===7,'Food and water has 3 foods, 7 water readings and the automation sliders');
 ok(c1.order.every((v,i,a)=>i===0||v>a[i-1]),'order: Wellbeing, Food and water, Colony, Recent events');
 await p.evaluate(()=>{document.querySelector('#oc-body [data-act="food"][data-i="2"]').click();});await wait(200);
 ok(await p.evaluate(()=>G.tanks[0].set.food===2),'a food tap on the company page sets the food');
 await p.screenshot({path:path.join(os.tmpdir(),'yt-company-'+W+'.png'),fullPage:true});
 // 2. with the land (Pass 228, Puti): the company page keeps Check shrimp, the land has Aquascape in that place
 await setup(true);t=await tiles();
 ok(t.map(x=>x.n).join(',')==='Vacuum,Sponge,Trim,Pests,Aquascape,Glass','with the land: '+t.map(x=>x.n).join(', '));
 // Pass 231: a sick Tank 1 swaps Check shrimp in for Aquascape on the company page (the health check is company-only)
 await p.evaluate(()=>{G.tanks[0].ill={day:G.day,st:1};render();});await wait(200);const ts=await tiles();await p.evaluate(()=>{delete G.tanks[0].ill;render();});await wait(200);
 ok(ts.map(x=>x.n).join(',')==='Vacuum,Sponge,Trim,Pests,Check shrimp,Glass','sick with the land: '+ts.map(x=>x.n).join(', '));
 const sy=await p.evaluate(()=>scrollY);await p.evaluate(()=>render());
 await p.evaluate(()=>landShow());let f=null;for(let i=0;i<100&&!f;i++){f=p.frames().find(x=>x.url().includes('home.html'));await wait(100);}
 await f.waitForFunction(()=>typeof S!=='undefined'&&S&&S.tanks&&S.tanks[0]&&S.tanks[0].own,null,{timeout:20000});
 await f.evaluate(()=>{S.sel=0;setTab('tank');});await f.waitForFunction(()=>document.querySelector('#tankside [data-k="fw"]'),null,{timeout:10000});await wait(500);
 // Pass 292: a tank day is 2.4 s, so one can land between the two reads; read again then (the land gets each new day at once now)
 let lt,gl;for(let k=0;k<4;k++){const d0=await p.evaluate(()=>G.tday);await wait(150);
  lt=await f.evaluate(()=>Array.from(document.querySelectorAll('#toybtns .btn')).map(b=>({n:b.childNodes[1]?b.childNodes[1].textContent.trim():b.textContent,s:(b.querySelector('small')||{}).textContent})));
  const g2=await p.evaluate(()=>({L:ownLines(G),d:G.tday}));gl=g2.L;if(g2.d===d0)break;}
 ok(lt.map(x=>x.n).join(',')==='Vacuum,Sponge,Trim,Pests,Aquascape,Glass','land tiles: '+lt.map(x=>x.n).join(', '));
 ok(['vac','sponge','trim','pests','glass'].every((k,i)=>lt[[0,1,2,3,5][i]].s===gl[k]),'land state lines match the game ('+lt.map(x=>x.s).join(' / ')+' vs '+['vac','sponge','trim','pests','glass'].map(k=>gl[k]).join(' / ')+')');
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
 // Pass 254 (Puti 5 Nov): the Aquascape sticks. Take the driftwood out, add a rock pile, turn it, finish: the game's flags, the
 // piece list it draws (T.scp, Pass 257; was a picture) and the land's pieces all keep the edit after Back, a reload and the next visit.
 await f.evaluate(()=>{var T=S.tanks[0];T.scape=T.scape.filter(i=>i.k!=='wood');toyStart('scape');});await wait(400);
 await f.evaluate(()=>{var el=[...document.querySelectorAll('[data-add]')].find(b=>b.dataset.add==='rockpile');el.click();TOY.edit('rot');TOY.edit('rot');});await wait(200);
 // v2b 14: the land sends a rotation rounded to 3 places (scapePack). Round the land's own value the same way before comparing: the leaf's turn is random,
 // and about 1 run in 40 the raw value and the sent one fell on two sides of a 2-place boundary (or the raw one was under 0.0005 and read as turned). That was the flaky "same pieces" failure.
 const pieces=()=>f.evaluate(()=>S.tanks[0].scape.map(i=>{var r=Math.round((i.r||0)*1000)/1000;return i.k+(r?'r'+r.toFixed(2):'');}).sort().join(','));
 const before=await pieces();await f.evaluate(()=>TOY.finish());await wait(2500);
 const g1=await p.evaluate(()=>{var P=G.tanks[0].scp;return {w:G.tanks[0].wood,n:P&&P.s.length,len:P?JSON.stringify(P).length:0,img:!!G.opt.scImg,on:scpOn(G.tanks[0]),k:P&&P.s.map(i=>i[0]+(i[5]?'r'+(+i[5]).toFixed(2):'')).sort().join(',')};});
 ok(g1.w===0&&g1.n>0&&g1.len<20000&&!g1.img&&g1.on,'after the job the game has no driftwood and the land\'s piece list ('+g1.len+' chars, no picture)');
 ok(g1.k===before,'the game\'s list has the same pieces as the land: '+g1.k);
 // the same pieces drawn on both pages at the art size: same pixels, give or take antialiasing
 const pxl=async(fr,fn)=>fr.evaluate(fn);
 const landPx=await pxl(f,()=>{var c=document.createElement('canvas');c.width=932;c.height=430;var W=TV.W,H=TV.H,D=TV.dpr;TV.W=932;TV.H=430;TV.dpr=1;TV.L={};try{drawScapeAll(c.getContext('2d'),S.tanks[0],tvGeom());}finally{TV.W=W;TV.H=H;TV.dpr=D;TV.L={};}return Array.from(c.getContext('2d').getImageData(0,0,932,430).data.filter((v,i)=>i%4===3&&(i>>2)%7===0));});
 const gamePx=await pxl(p,()=>{var c=document.createElement('canvas');c.width=932;c.height=430;scpDraw(c.getContext('2d'),G.tanks[0].scp);return Array.from(c.getContext('2d').getImageData(0,0,932,430).data.filter((v,i)=>i%4===3&&(i>>2)%7===0));});
 let dif=0,on=0;for(let i=0;i<landPx.length;i++){if(landPx[i]>40)on++;if(Math.abs(landPx[i]-gamePx[i])>60)dif++;}
 ok(on>2000&&dif/on<0.03,'the company page draws the same scape as the land ('+dif+' of '+on+' covered pixels differ)');
 ok(before.indexOf('rockpiler')>=0,'a rotated rock pile is in the pieces: '+before);
 await f.evaluate(()=>$('tb-back').click());await wait(600);ok(await p.evaluate(()=>!LAND.on),'Back leaves the land');
 await p.evaluate(()=>landShow());await wait(2500);
 ok((await pieces())===before&&(await p.evaluate(()=>G.tanks[0].wood))===0,'the next visit keeps the pieces and the game keeps the flags');
 await p.reload();await p.waitForFunction(()=>window.G&&G.tanks&&G.me);await p.evaluate(()=>{window.spotlight=function(){};landShow();});f=null;for(let i=0;i<100&&!f;i++){f=p.frames().find(x=>x.url().includes('home.html'));await wait(100);}
 await f.waitForFunction(()=>window.S&&S.tanks&&S.tanks[0]);await wait(2500);
 ok((await pieces())===before,'after a reload the land still has them: '+(await pieces()));
 ok(await p.evaluate(()=>G.tanks[0].wood===0&&G.tanks[0].scp&&G.tanks[0].scp.s.length>0&&scpOn(G.tanks[0])),'after a reload the game draws the list');
 // Pass 257: an old save with a picture and no list still draws the picture, until a list comes
 const mig=await p.evaluate(()=>{var T=G.tanks[0],keep=T.scp;delete T.scp;var c=document.createElement('canvas');c.width=93;c.height=43;G.opt.scImg=c.toDataURL('image/png');scImgLoad();return new Promise(r=>setTimeout(()=>{var a=scImgOn(T);landTank(G,{scp:keep});r({pic:a,after:scImgOn(T),gone:!G.opt.scImg,list:scpOn(T)});},500));});
 ok(mig.pic&&!mig.after&&mig.gone&&mig.list,'an old picture is drawn until the land sends a list, then dropped: '+JSON.stringify(mig));
 // Back with the job open: the job is ended and reported first
 await f.evaluate(()=>{toyStart('scape');var el=[...document.querySelectorAll('[data-add]')].find(b=>b.dataset.add==='wood');el.click();$('tb-back').click();});await wait(2500);
 ok(await f.evaluate(()=>!TOY)&&await p.evaluate(()=>G.tanks[0].wood===1),'Back with Aquascape open finishes it and the game gets the driftwood');
 // Pass 257: the tank you can hear, a row under Your tank once the blind group's research is found, ear.html over the game
 await p.evaluate(()=>{landHide&&LAND.on&&landHide();var H=hardOf(G);H.picks.blind={ear:{day:G.day,start:G.day}};G.sel=0;selectTab('tank');render();});await wait(300);
 const er=await p.evaluate(()=>{var c=document.getElementById('earcard');return {vis:!c.hidden&&c.offsetHeight>0,btn:!!c.querySelector('[data-act="ear-go"]'),y:scrollY};});ok(er.vis&&er.btn,'Try the tank you can hear sits under Your tank');
 await p.evaluate(()=>document.querySelector('#earcard [data-act="ear-go"]').click());let ef=null;for(let i=0;i<50&&!ef;i++){ef=p.frames().find(x=>x.url().includes('ear.html'));await wait(100);}
 await ef.waitForFunction(()=>window.S&&S.shrimp);await wait(300);
 const eo=await p.evaluate(()=>({on:EAR.on,busy:busyUI(),ov:!document.getElementById('ear-ov').hidden,y:scrollY}));ok(eo.on&&eo.busy&&eo.ov&&Math.abs(eo.y-er.y)<2,'it opens full screen, nothing new comes while it is open, the page under it stays put');
 const n0=await p.evaluate(()=>G.stats.care||0);await ef.evaluate(()=>{document.getElementById('b-feed').click();document.getElementById('b-water').click();});await wait(400);
 const n1=await p.evaluate(()=>({care:G.stats.care||0,ear:G.stats.earN||0}));ok(n1.care-n0===1&&n1.ear===1,'a feed and a water change there count as care on Your tank, once: '+JSON.stringify(n1));
 await ef.evaluate(()=>document.getElementById('b-back').click());await wait(400);ok(await p.evaluate(()=>!EAR.on&&document.getElementById('ear-ov').hidden),'Back returns to the game');
 ok(!errs.length,'no page errors'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
 await b.close();srv.close();console.log(fails?fails+' FAILED':'all passed');process.exit(fails?1:0);})();
