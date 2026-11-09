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
 // Pass 279: Grandma leaves the land while she can't be reached
 await p.evaluate(()=>{G.me.away=Math.floor(G.day)+50;landSend();});await wait(600);const ga=await fr().evaluate(()=>!!window.GM_AWAY);
 await p.evaluate(()=>{G.me.away=0;landSend();});await wait(600);const gb=await fr().evaluate(()=>!!window.GM_AWAY);ok(ga&&!gb,W+' Grandma off the land while unreachable, back after '+ga+' '+gb);
 // the log opens and fits
 const lg=await fr().evaluate(()=>{document.getElementById('lz-log').click();var s=document.getElementById('sheet');return {open:!s.hidden,txt:s.textContent.slice(0,120),sw:document.documentElement.scrollWidth,W:innerWidth};});
 ok(lg.open&&/Birds/.test(lg.txt)&&lg.sw<=lg.W,W+' log opens, no sideways scroll');
 await p.screenshot({path:require('os').tmpdir()+'/land-log-'+W+'.png'});
 // Pass 308, Pass 309 (Puti): floors go under built walls; a wall of another kind swaps in place for half back; an old big ground edit splits; a corner sits where the wall below it sits
 const m0=await p.evaluate(()=>G.money);
 const bw=await fr().evaluate(()=>{var H=LAND.life,L=H.L(),LS=H.LS,B=H.BUILDI,me=L.me,t=H.tileOf(me.x,me.y),o={},x0=null;
  for(var dy=1;dy<8&&!x0;dy++)for(var dx=-6;dx<3&&!x0;dx++){var ok=1;for(var j=0;j<4&&ok;j++)for(var i=0;i<4&&ok;i++){var g=H.mget(t[0]+dx+i,t[1]+dy+j);if(g!==3&&g!==4)ok=0;else if(!H.canPlace(B['wall-p'],t[0]+dx+i,t[1]+dy+j))ok=0;}if(ok)x0=[t[0]+dx,t[1]+dy];}
  if(!x0)return {none:1};var x=x0[0],y=x0[1];o.wall=H.placeAt(B['wall-p'],x,y);o.floorCan=H.canPlace(B['g-floor'],x,y);o.floor=H.placeAt(B['g-floor'],x,y);o.g=H.mget(x,y);
  o.same=H.canPlace(B['wall-p'],x,y);o.canSwap=H.canPlace(B['wall-s'],x,y);o.swap=H.placeAt(B['wall-s'],x,y);var w=LS().objs.filter(function(q){return q.k==='wall'&&q.tx===x&&q.ty===y;});o.n=w.length;o.v=w[0]&&w[0].v;
  o.pw=B['wall-p'].price;o.ps=B['wall-s'].price;o.pf=B['g-floor'].price;
  o.fence=H.placeAt(B.fence,x+3,y+3);o.wallOnFence=H.canPlace(B['wall-s'],x+3,y+3);
  LS().edits=(LS().edits||[]).concat([{k:'g-stone',tx:x+2,ty:y,fw:2,fh:1,prev:[[4,0],[4,0]],price:16}]);o.split=H.placeAt(B['g-floor'],x+2,y);o.ed=LS().edits.filter(function(e){return e.ty===y&&e.tx>=x+2&&e.tx<=x+3;}).map(function(e){return e.k+e.fw;}).join(',');
  /* a floor at (x+1,y+2), walls on the grass round its left: the corner above takes the side of the wall below it */
  H.placeAt(B['g-floor'],x+1,y+2);var a=H.mkObj('wall',x,y+1,{v:'p',built:1}),b2=H.mkObj('wall',x,y+2,{v:'p',built:1}),c=H.mkObj('wall',x+1,y+1,{v:'p',built:1});LS().objs.push(a,b2,c);
  o.below=H.wallSd(b2,H.wallMask(b2));o.corner=H.wallSd(a,H.wallMask(a));return o;});
 const m1=await p.evaluate(()=>G.money);
 ok(!bw.none&&bw.wall&&bw.floorCan&&bw.floor&&bw.g===1,W+' Pass 308: a wood deck goes under a built wall '+JSON.stringify(bw));
 ok(bw.same===false&&bw.canSwap&&bw.swap&&bw.n===1&&bw.v==='s',W+' Pass 309: a stone wall tapped on a plaster wall swaps it in place, one wall left');
 ok(bw.wallOnFence===false,W+' Pass 309: a wall does not swap a fence');
 ok(bw.split&&bw.ed==='g-floor1,g-stone1',W+' Pass 309: a two-tile ground edit splits, the floor takes one tile: '+bw.ed);
 ok(bw.below!==0&&bw.corner===bw.below,W+' Pass 309: the corner stands where the wall below it stands (side '+bw.corner+' / '+bw.below+')');
 await wait(1300);const m2=await p.evaluate(()=>G.money);
 ok(Math.abs((m0-m2)-(bw.pw+bw.pf*3+bw.ps-Math.floor(bw.pw/2)+15))<1.5,W+' Pass 309: the swap pays the new wall and gives half the old one back (spent '+Math.round((m0-m2)*10)/10+')');
 ok(!errs.length,W+' no page errors '+errs.slice(0,2).join(' | '));
 await p.close();}
 await b.close();srv.close();console.log(fails?fails+' failed':'all passed');process.exit(fails?1:0);})();
