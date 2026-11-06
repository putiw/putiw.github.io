// Pass 213: the vegetable bed, walks with the dog and the Log on Grandma's land. node tests/shrimp-land-life.cjs
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'../shrimp');
const TYPES={'.html':'text/html','.js':'text/javascript','.mp3':'audio/mpeg','.png':'image/png'};
function serve(){return new Promise(r=>{const s=http.createServer((q,a)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){a.writeHead(404);a.end();return;}a.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(a);});
 s.listen(0,()=>r(s));});}
const wait=ms=>new Promise(r=>setTimeout(r,ms));

let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++;};
(async()=>{
 const srv=await serve(),url='http://127.0.0.1:'+srv.address().port+'/index.html';
 const b=await chromium.launch();
 for(const W of [360,390]){
 const p=await b.newPage({viewport:{width:W,height:844}});const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.dismiss());
 await p.goto(url);await p.waitForFunction(()=>typeof newGame==='function'&&window.G);
 await p.evaluate(()=>{var g=newGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;T.pop=[{n:30,age:120,g:60}];g.opt.all=true;g.me=newMe();g.me.on=1;g.me.keep='self';
  g.me.gplace={balcony:1,house:1,land:1};g.money=1e6;g.day=g.tday=400;g.progress.queue=[];g.savedLand=1;g.savedAt=Date.now();G=g;localStorage.setItem(saveKey,JSON.stringify(g));localStorage.removeItem('shrimp-land-v1');});
 await p.reload();await p.waitForFunction(()=>window.G&&G.me&&G.me.gplace);await p.evaluate(()=>{window.spotlight=function(){};G.progress.queue=[];});
 const fr=()=>p.frame({url:/home\.html/});
 await p.evaluate(()=>landShow());await p.waitForFunction(()=>LAND.ready);await wait(1500);
 // a bed next to Millie, plant, water, ripen, pick
 const r=await fr().evaluate(()=>{var H=LAND.life,L=H.L(),LS=H.LS,vegState=H.vegState,vegTap=H.vegTap,mkObj=H.mkObj,tileOf=H.tileOf,objSprite=H.objSprite,me=L.me,t=tileOf(me.x,me.y),o=null;for(var dx=-4;dx<=4&&!o;dx++)for(var dy=-4;dy<=4&&!o;dy++){}
  o=mkObj('veg',t[0]+1,t[1]+1,{fw:2,fh:1});LS().objs.push(o);L.dirty=true;
  window.GDAY=500;o.crop='tomato';o.pl=500;o.w=500;var s1=vegState(o);[515,535,555].forEach(function(d){window.GDAY=d;vegTap(o);});var s2=vegState(o);window.GDAY=575;var s3=vegState(o);vegTap(o);
  var dead={k:'veg',crop:'okra',pl:600,w:600};window.GDAY=640;var s4=vegState(dead);
  return {s1:s1,s2:s2,s3:s3,s4:s4,h:LS().harvest,obj:!!objSprite(o)};});
 ok(r.s1==='growing'&&r.s3==='ripe'&&r.s4==='dead'&&r.h&&r.h.tomato===12&&r.obj,W+' bed grows, ripens, dries out, picks '+JSON.stringify(r));
 await wait(400);
 if(process.env.DBG)console.log(await fr().evaluate(()=>typeof post+' '+(window.parent!==window)+' '+typeof P));
 const hv=await p.evaluate(()=>JSON.stringify(G.me.harvest));ok(/tomatoes/.test(hv),W+' the game heard the harvest '+hv);
 const din=await p.evaluate(()=>harvestTake(G));ok(/12 tomatoes/.test(din),W+' the dinner line takes it: '+din);
 // a walk
 await fr().evaluate(()=>{var H=LAND.life,L=H.L(),dg=L.dog;L.walk={t:130,idle:0};dg.bound=false;H.walkTick(0.1);});await wait(400);
 const wk=await p.evaluate(()=>[G.me.walks,G.me.walkMin]);ok(wk[0]===1&&wk[1]===2,W+' a walk counts '+wk);
 // Pass 279: fish, birds and hens ride the act message into G for the ending; a caught hen counts
 await fr().evaluate(()=>{var st=LAND.life.LS().stats;st.fish=3;st.birds=4;st.hens=2;});await wait(2300);
 const ls=await p.evaluate(()=>JSON.stringify(G.me.ls||null));ok(/"f":3/.test(ls)&&/"b":4/.test(ls)&&/"h":2/.test(ls),W+' land stats reach the game '+ls);
 ok(/LS\(\)\.stats\.hens=\(LS\(\)\.stats\.hens\|\|0\)\+1;[^\n]{0,80}toast\('You caught a '/.test(fs.readFileSync(path.join(ROOT,'home.html'),'utf8')),W+' a caught hen counts');
 // the log opens and fits
 const lg=await fr().evaluate(()=>{document.getElementById('lz-log').click();var s=document.getElementById('sheet');return {open:!s.hidden,txt:s.textContent.slice(0,120),sw:document.documentElement.scrollWidth,W:innerWidth};});
 ok(lg.open&&/Birds/.test(lg.txt)&&lg.sw<=lg.W,W+' log opens, no sideways scroll');
 await p.screenshot({path:require('os').tmpdir()+'/land-log-'+W+'.png'});
 ok(!errs.length,W+' no page errors '+errs.slice(0,2).join(' | '));
 await p.close();}
 await b.close();srv.close();console.log(fails?fails+' failed':'all passed');process.exit(fails?1:0);})();
