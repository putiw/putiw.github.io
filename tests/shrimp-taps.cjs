// Pass 233: button sounds and the iPhone tick (shrimp/taps.js) on the company page, the land and the ship.
// node tests/shrimp-taps.cjs  (serves shrimp/ over http, 390x844, headless Chromium)
// One tap makes one buffer source at the right gain, none with Button sounds off or muted; the hidden switch toggles
// once per tap with Taps on (also muted), never with it off, and takes no layout or focus.
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'../shrimp');
const TYPES={'.html':'text/html','.js':'text/javascript','.mp3':'audio/mpeg','.wav':'audio/wav','.png':'image/png'};
function serve(){return new Promise(r=>{const s=http.createServer((q,a)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){a.writeHead(404);a.end();return;}a.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(a);});
 s.listen(0,()=>r(s));});}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++;};
const NET=0.3,BUS=0.5*0.82;
// count buffer sources made from the nine tap files, with their gain
const HOOK=()=>{window.__src=[];var P=(window.AudioContext||window.webkitAudioContext).prototype,cb=P.createBufferSource;
 P.createBufferSource=function(){var s=cb.call(this),st=s.start,ctx=this;s.start=function(){var b=s.buffer;if(b&&window.TAPS&&Object.values(TAPS.bufs).indexOf(b)>=0){var g=s.__g;window.__src.push({g:g?g.gain.value:null,r:s.playbackRate.value,dest:g&&g.__d});}return st.apply(this,arguments);};
  var cn=s.connect;s.connect=function(n){s.__g=n;return cn.apply(this,arguments);};return s;};};
(async()=>{
 const srv=await serve(),base='http://127.0.0.1:'+srv.address().port+'/';
 const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.dismiss());
 await p.addInitScript(HOOK);
 await p.goto(base+'index.html');await p.waitForFunction(()=>typeof newGame==='function'&&window.G);
 await p.evaluate(()=>{var g=newGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;T.pop=[{n:30,age:120,g:60}];g.opt.all=true;g.progress.queue=[];G=g;localStorage.setItem(saveKey,JSON.stringify(g));
  localStorage.setItem('shrimp-music','1');localStorage.removeItem('shrimp-btnsfx');localStorage.removeItem('shrimp-taps');});
 await p.reload();await p.waitForFunction(()=>window.G&&window.TAPS);await p.evaluate(()=>{window.spotlight=function(){};G.progress.queue=[];render();});
 ok(await p.evaluate(()=>typeof navigator.vibrate==='undefined'||!/vibrate/.test(document.documentElement.innerHTML)),'no vibrate in the game');
 // first tap starts the context, then the buffers load
 await p.mouse.click(5,300);await wait(1500);
 ok(await p.evaluate(()=>MUS.ctx&&MUS.ctx.state==='running'&&Object.values(TAPS.bufs).filter(Boolean).length===9),'nine sounds loaded on the music context');
 const tap=async(sel,ms)=>{await p.evaluate(()=>{window.__src=[];TAPS.lastSnd=TAPS.lastTick=0;});const c0=await p.evaluate(()=>TAPS.input&&TAPS.input.checked);
  await p.click(sel);await wait(ms||120);return p.evaluate(c0=>({src:__src,role:TAPS.last&&TAPS.last.role,flip:TAPS.input?TAPS.input.checked!==c0:false,focus:document.activeElement===TAPS.input}),c0);};
 // a button with its own sound (sfxMoment) gets no tap sound
 await p.evaluate(()=>{var x=document.createElement('button');x.id='tt-main';x.textContent='Buy';x.style.cssText='position:fixed;left:150px;top:400px;z-index:99999';document.body.appendChild(x);
  var y=document.createElement('button');y.id='tt-moment';y.textContent='Pick';y.style.cssText='position:fixed;left:220px;top:400px;z-index:99999';y.onclick=function(){sfxMoment('card');};document.body.appendChild(y);
  var z=document.createElement('button');z.id='tt-step';z.textContent='−';z.style.cssText='position:fixed;left:290px;top:400px;z-index:99999';document.body.appendChild(z);});
 let r=await tap('#tt-main');
 ok(r.src.length===1,'one tap, one buffer source ('+r.src.length+')');
 ok(r.src[0]&&Math.abs(r.src[0].g*BUS-NET)<1e-3,'net gain 0.3 at the speakers (source '+(r.src[0]&&r.src[0].g.toFixed(3))+' x bus 0.41)');
 ok(r.src[0]&&r.src[0].r>=0.94&&r.src[0].r<=1.06,'playback rate within 0.94 to 1.06');
 ok(r.role==='main'&&r.flip,'main action sound, hidden switch toggled once');
 ok(!r.focus,'hidden switch never takes focus');
 r=await tap('#tt-step');ok(r.role==='step','− is a stepper sound');
 r=await tap('#tt-moment');ok(r.src.length===0&&r.flip,'a button that plays sfxMoment gets no tap sound, still the tick');
 // roles of the game's own buttons
 const roleOf=sel=>p.evaluate(s=>{var e=document.querySelector(s);return e?TAPS.role(e):null;},sel);
 ok(await roleOf('#tb-feed')==='feed'&&await roleOf('#tb-wc')==='water'&&await roleOf('#tb-sell')==='sell','Feed, Water and Sell have their own sounds before the farm');
 ok(await roleOf('#tab-tank')==='tab'&&await roleOf('#tb-info')==='open'&&await roleOf('#apop-x')==='close'&&await roleOf('#settings-close')==='close','tab, ? and close roles');
 ok(await roleOf('#t-taps')==='chip'&&await roleOf('label.toggle')==='chip','settings switches are chips');
 await p.evaluate(()=>{G.emp.farms.rack=1;});
 ok(await roleOf('#tb-feed')==='main'&&await roleOf('#tb-sell')==='main','after the first farm Feed and Sell are tap_tok');
 await p.evaluate(()=>{G.emp.farms.rack=0;});
 // 40 ms limit
 const burst=await p.evaluate(async()=>{window.__src=[];TAPS.lastSnd=TAPS.lastTick=0;var e=document.getElementById('tt-main'),r=e.getBoundingClientRect(),t0=TAPS.ticks;
  for(var i=0;i<3;i++){e.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.x+5,clientY:r.y+5}));e.click();}await new Promise(r=>setTimeout(r,120));return {n:__src.length,t:TAPS.ticks-t0};});
 ok(burst.n===1&&burst.t===1,'at most one sound and one tick per 40 ms');
 // Button sounds off: no sound, tick stays
 await p.evaluate(()=>TAPS.set(TAPS.KEY_SND,false));r=await tap('#tt-main');ok(r.src.length===0&&r.flip,'Button sounds off: no sound, still the tick');
 await p.evaluate(()=>TAPS.set(TAPS.KEY_SND,true));
 // Taps off: sound, no tick
 await p.evaluate(()=>TAPS.set(TAPS.KEY_TAP,false));r=await tap('#tt-main');ok(r.src.length===1&&!r.flip,'Taps you can feel off: sound, no tick');
 await p.evaluate(()=>TAPS.set(TAPS.KEY_TAP,true));
 // muted: no sound, tick stays
 await p.evaluate(()=>setMute(true));r=await tap('#tt-main');ok(r.src.length===0&&r.flip,'muted: no button sound, still the tick');
 await p.evaluate(()=>setMute(false));await p.mouse.click(5,300);await wait(1200);
 // the hidden switch takes no layout
 ok(await p.evaluate(()=>{var r=TAPS.el.getBoundingClientRect(),cs=getComputedStyle(TAPS.el);return cs.position==='fixed'&&cs.display!=='none'&&r.right<=0&&document.documentElement.scrollWidth<=innerWidth;}),'hidden switch is offscreen, fixed, not display:none, no sideways scroll');
 // the tick's click never reaches the game's listeners
 ok(await p.evaluate(()=>{var n=0,h=function(){n++;};document.addEventListener('click',h,true);TAPS.lastTick=0;TAPS.tick();document.removeEventListener('click',h,true);return n===0;}),'the tick click never reaches the game');
 // settings switches
 ok(await p.evaluate(()=>!!document.getElementById('t-btnsfx')&&!!document.getElementById('t-taps')&&document.getElementById('t-music').parentNode.nextElementSibling.querySelector('#t-btnsfx')),'Button sounds and Taps you can feel sit under the music switch');

 // the land
 await p.evaluate(()=>{G.me=newMe();G.me.on=1;G.me.gplace={balcony:1,house:1,land:1};G.money=1e6;G.day=G.tday=400;landShow();});
 await p.waitForFunction(()=>LAND.ready);await wait(1500);
 const fr=p.frame({url:/home\.html/});
 ok(await fr.evaluate(()=>typeof TAPS!=='undefined'&&!/navigator\.vibrate/.test(document.documentElement.innerHTML)),'land has taps.js, no vibrate');
 const seg=await fr.$('#lseg [data-seg]');
 await fr.evaluate(()=>{window.__src=[];TAPS.lastSnd=TAPS.lastTick=0;});if(seg)await seg.click();await wait(1500);
 await fr.evaluate(()=>{window.__src=[];TAPS.lastSnd=TAPS.lastTick=0;});const c0=await fr.evaluate(()=>TAPS.input&&TAPS.input.checked);
 const seg2=await fr.$$('#lseg [data-seg]');if(seg2[1])await seg2[1].click();await wait(150);
 const lr=await fr.evaluate(c0=>({n:__src.length,g:__src[0]&&__src[0].g,role:TAPS.last&&TAPS.last.role,flip:TAPS.input.checked!==c0}),c0);
 ok(lr.n===1&&lr.role==='tab'&&Math.abs(lr.g*BUS-NET)<1e-3,'land Home/Tank switch: one tab sound at 0.3 ('+lr.n+', '+lr.role+')');
 ok(lr.flip,'land tick toggles');
 await p.evaluate(()=>setMute(true));await wait(300);
 await fr.evaluate(()=>{window.__src=[];TAPS.lastSnd=TAPS.lastTick=0;});if(seg2[0])await seg2[0].click();await wait(150);
 ok(await fr.evaluate(()=>__src.length===0),'land muted: no button sound');
 await p.evaluate(()=>setMute(false));await p.evaluate(()=>landHide());

 // the ship
 const q=await b.newPage({viewport:{width:390,height:844}});q.on('pageerror',e=>errs.push('space: '+e));await q.addInitScript(HOOK);
 await q.goto(base+'space.html');await q.waitForFunction(()=>window.TAPS);await q.mouse.click(5,5);await wait(1500);
 await q.evaluate(()=>{var x=document.createElement('button');x.id='tt-s';x.textContent='Scan';x.style.cssText='position:fixed;left:150px;top:400px;z-index:99999';document.body.appendChild(x);});const btn=await q.$('#tt-s');
 await q.evaluate(()=>{window.__src=[];TAPS.lastSnd=TAPS.lastTick=0;});const sc0=await q.evaluate(()=>TAPS.input?TAPS.input.checked:false);
 if(btn)await btn.click();await wait(150);
 const sr=await q.evaluate(c0=>({n:__src.length,g:__src[0]&&__src[0].g,flip:TAPS.input&&TAPS.input.checked!==c0}),sc0);
 ok(sr.n===1&&Math.abs(sr.g-NET)<1e-3&&sr.flip,'ship: one sound at 0.3, tick toggles ('+sr.n+')');
 ok(!errs.length,'no page errors'+(errs.length?': '+errs.join(' | '):''));
 await b.close();srv.close();console.log(fails?fails+' FAILED':'all ok');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
