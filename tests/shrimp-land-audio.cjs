// Pass 181: Grandma's land banner, no wind, one mute, one page playing music.
// node tests/shrimp-land-audio.cjs  (serves shrimp/ over http, 390x844, headless Chromium)
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
 const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.dismiss());
 await p.goto(url);await p.waitForFunction(()=>typeof newGame==='function'&&window.G);
 await p.evaluate(()=>{var g=newGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;T.pop=[{n:30,age:120,g:60}];g.opt.all=true;g.me=newMe();g.me.on=1;g.me.keep='self';
  g.me.gplace={balcony:1,house:1,land:1};g.money=1e6;g.day=g.tday=400;g.progress.queue=[];g.savedLand=1;g.savedAt=Date.now();G=g;localStorage.setItem(saveKey,JSON.stringify(g));
  localStorage.setItem('shrimp-music','1');});
 await p.reload();await p.waitForFunction(()=>window.G&&G.me&&G.me.gplace);await p.evaluate(()=>{window.spotlight=function(){};G.progress.queue=[];});
 const fr=()=>p.frame({url:/home\.html/});
 const land=async()=>{await p.evaluate(()=>landShow());await p.waitForFunction(()=>LAND.ready);await wait(1300);};
 const need=async()=>fr().evaluate(()=>{var b=document.getElementById('lneed');return b?b.textContent:'';});

 // 1. after the win, nothing queued: no banner
 await p.evaluate(()=>{G.emp.won=1;});await land();
 ok(!(await need()),'no banner after the win');
 ok(await fr().evaluate(()=>typeof outdoorAmb==='undefined'&&typeof OUTDOOR==='undefined'),'no wind loop on the land');
 // 2. a new card while on the land: banner once
 await p.evaluate(()=>{G.emp.won=0;G.progress.queue=['farm'];});await wait(1300);
 ok(/needs you/.test(await need()),'banner for a new card');
 await p.evaluate(()=>landHide());await land();
 ok(!(await need()),'banner only once per card');
 // 3. a card already seen on the company page: no banner
 await p.evaluate(()=>{landHide();G.progress.queue=['ministry'];renderMilestone();});await land();
 ok(!(await need()),'no banner for a card seen at the company');
 await p.evaluate(()=>{G.progress.queue=[];renderMilestone();});

 // 4. audio: the land plays, the company doesn't, while the land is open
 await fr().evaluate(()=>{window.dispatchEvent(new Event('pointerdown'));});await wait(400);
 const s1=await p.evaluate(()=>({mus:!!(MUS.ctx&&MUS.ctx.state==='running')}));
 const l1=await fr().evaluate(()=>({ac:AC&&AC.state,hid:!!window.LAND_HID,snd:S.opt.sound}));
 ok(!s1.mus,'company music not running while the land is open');
 ok(l1.ac==='running'&&!l1.hid&&l1.snd,'land sound running while shown ('+l1.ac+')');
 // 5. hidden: land suspends, company resumes
 await p.evaluate(()=>landHide());await wait(500);
 const l2=await fr().evaluate(()=>({ac:AC&&AC.state,hid:!!window.LAND_HID}));
 ok(l2.ac==='suspended'&&l2.hid,'land suspended when hidden ('+l2.ac+')');
 await p.mouse.click(5,300);await wait(800);
 ok(await p.evaluate(()=>MUS.on&&MUS.ctx&&MUS.ctx.state==='running'),'company music back after the land');
 // 6. one mute: company mute reaches the land, land mute reaches the company
 await p.evaluate(()=>setMute(true));await wait(200);
 ok(await fr().evaluate(()=>!S.opt.sound&&document.getElementById('tb-mute').classList.contains('muted')),'company mute mutes the land');
 await land();await fr().evaluate(()=>document.getElementById('tb-mute').click());await wait(300);
 ok(await p.evaluate(()=>musicOn()&&!document.getElementById('tb-mute').classList.contains('muted')),'land unmute reaches the company');
 ok(await p.evaluate(()=>!(MUS.ctx&&MUS.ctx.state==='running')),'company music stays off while the land is open after unmute');
 await fr().evaluate(()=>document.getElementById('tb-mute').click());await wait(300);
 ok(await p.evaluate(()=>!musicOn()),'land mute reaches the company');
 const bad=errs.filter(e=>!/net::|Failed to load/.test(e));
 ok(!bad.length,'no page errors'+(bad.length?': '+bad.slice(0,3).join(' | '):''));
 await b.close();srv.close();console.log(fails?fails+' failed':'all passed');process.exit(fails?1:0);
})();
