// Pass 235 (plan Part 4): a fresh start is fresh. A new game in a clean browser, and Start over from a late save, must
// both equal newGame() (after migrate), with nothing carried over: no gear, decor, cash, trees or flags. The land's save
// goes too (only its colors and drawn things are kept, by design), so the next land starts empty.
// node tests/shrimp-fresh.cjs   FRESH_RUN=<run-7.json> picks the late save (default: the strong run in os.tmpdir()).
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),os=require('os');
const ROOT=path.join(__dirname,'../shrimp');
const TYPES={'.html':'text/html','.js':'text/javascript','.mp3':'audio/mpeg','.wav':'audio/wav','.png':'image/png'};
function serve(){return new Promise(r=>{const s=http.createServer((q,a)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){a.writeHead(404);a.end();return;}a.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(a);});
 s.listen(0,()=>r(s));});}
const RUN=process.env.FRESH_RUN||path.join(os.tmpdir(),'shrimp-tests','run-7.json');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++;};
// what a game carries: if any of these differ from newGame(), something leaked over
const DIFF=`function carry(g){var T=g.tanks[0]||{},E=g.emp||{},C=E.coin||{};return {money:Math.round(g.money),day:Math.floor(g.day),tanks:g.tanks.length,
  gear:['feeder','autoWC','fan','heater','chiller','ice','light','filter','v','ldec','seeded'].map(function(k){return k+':'+JSON.stringify(T[k]===undefined?null:T[k]);}).join(','),
  shrimp:(T.pop||[]).reduce(function(a,c){return a+c.n;},0),ob:Object.keys(g.ob||{}).filter(function(k){return g.ob[k];}).sort().join(','),farms:JSON.stringify(E.farms||{}),trees:JSON.stringify(E.trees||{})+JSON.stringify(E.tree||{}),
  inf:Math.round(E.inf||0),coin:(C.trees||0)+(C.otrees||0),pl:(E.pl&&E.pl.t||[]).length,gplace:JSON.stringify(g.me&&g.me.gplace||{}),sold:(g.stats||{}).sold,born:(g.stats||{}).born,kits:(g.kits||{}).sold,
  left:!!g.left,voyage:!!g.voyage,won:!!E.won,recipe:!!g.recipe,seen:Object.keys((g.progress||{}).seen||{}).filter(function(k){return k!=='intro';}).sort().join(',')};}
 function freshDiff(g){var a=carry(g),b=carry(migrate(newGame())),o=[];for(var k in b)if(JSON.stringify(a[k])!==JSON.stringify(b[k]))o.push(k+': '+JSON.stringify(a[k]).slice(0,60)+' (new game '+JSON.stringify(b[k]).slice(0,40)+')');return o;}`;
(async()=>{
 if(!fs.existsSync(RUN)){console.log('FAIL no late save: run the strong bot first (REVIEW_OUTPUT=…) or set FRESH_RUN');process.exit(1);}
 const snaps=JSON.parse(fs.readFileSync(RUN,'utf8')).snapshots,late=snaps['million owners']||snaps[Object.keys(snaps).pop()];
 const srv=await serve(),base='http://127.0.0.1:'+srv.address().port+'/';
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.dismiss());
 // 1. a brand new game in a clean browser
 await p.goto(base+'index.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForFunction(()=>window.G&&typeof newGame==='function');
 let d=await p.evaluate(src=>{(0,eval)(src);return freshDiff(G);},DIFF);
 ok(!d.length,'a new game equals newGame()'+(d.length?': '+d.slice(0,12).join(', '):''));
 ok(await p.evaluate(()=>{var T=G.tanks[0];return G.tanks.length===1&&!T.feeder&&!T.autoWC&&!T.fan&&!T.heater&&!(T.pop||[]).length&&!G.emp.farms.rack&&!Object.keys(G.emp.tree||{}).length;}),'no gear, shrimp, farms or trees in a new game');
 // 2. Start over from a late save with a built land
 await p.evaluate(s=>{window.save=function(){};localStorage.setItem(saveKey,JSON.stringify(s));localStorage.setItem('shrimp-land-v1',JSON.stringify({land:{objs:[{k:'chair',x:3,y:3,built:1}],edits:[],pal:{chair:{'aa0000':'00aa00'}},made:[]},cash:5}));},late);
 await p.reload();await p.waitForFunction(()=>window.G&&G.day>100,null,{timeout:10000}).catch(()=>{});
 ok(await p.evaluate(()=>G.day>100&&G.money>0),'the late save loaded (day '+await p.evaluate(()=>Math.floor(G.day))+')');
 await p.evaluate(()=>{window.spotlight=function(){};G.progress.queue=[];renderMilestone();document.getElementById('settings').hidden=false;});
 const rb=await p.$('#btn-reset');await rb.evaluate(x=>x.click());await rb.evaluate(x=>x.click());
 await p.waitForNavigation({timeout:8000}).catch(()=>{});await p.waitForFunction(()=>window.G&&typeof newGame==='function');await p.waitForTimeout(500);
 d=await p.evaluate(src=>{(0,eval)(src);return freshDiff(G);},DIFF);
 ok(!d.length,'Start over equals newGame()'+(d.length?': '+d.slice(0,12).join(', '):''));
 const ls=await p.evaluate(()=>({land:localStorage.getItem('shrimp-land-v1'),keep:localStorage.getItem('shrimp-land-keep'),old:localStorage.getItem('shrimp-land-old')}));
 ok(!ls.land,'the land save is gone, the next land starts empty');
 ok(!!ls.keep&&/00aa00/.test(ls.keep),'the land’s colors are kept (by design)');
 ok(!!ls.old,'a built land is offered back as Your old land (by design, Pass 196)');
 ok(!errs.length,'no page errors'+(errs.length?': '+errs.join(' | '):''));
 await b.close();srv.close();console.log(fails?fails+' FAILED':'all ok');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
