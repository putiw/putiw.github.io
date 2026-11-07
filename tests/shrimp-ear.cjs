// The tank you can hear (Pass 257): shrimp/ear.html at 360 px. No console errors, every sound in the ? list plays,
// Feed and Change water work and post care, the clock runs a day in 5 s, Back posts back, the save key is shrimp-ear-v1.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','shrimp');let n=0,fails=0;const ok=(c,m)=>{if(c){n++;console.log('PASS',m);}else{fails++;console.log('FAIL',m);}};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html':f.endsWith('.wav')?'audio/wav':'application/octet-stream'});r.end(d);});}).listen(0);
(async()=>{const port=srv.address().port;const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:360,height:740}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 await p.addInitScript(()=>{window.__msgs=[];const op=window.postMessage.bind(window);window.addEventListener('message',e=>{if(e.data&&e.data.ear)window.__msgs.push(e.data.type+(e.data.k?':'+e.data.k:''));});});
 await p.goto('http://localhost:'+port+'/ear.html');await p.waitForTimeout(500);
 ok(await p.evaluate(()=>__msgs.includes('ready')),'posts ready');
 ok(await p.evaluate(()=>S.shrimp.length===5&&S.shrimp.filter(x=>x.sex==='f').length===3&&S.no3<1),'a clean tank, 5 shrimp, 3 females, nitrate about 0');
 const sw=await p.evaluate(()=>document.documentElement.scrollWidth);ok(sw<=360,'no sideways scroll at 360 px ('+sw+')');
 const btns=await p.evaluate(()=>[...document.querySelectorAll('.acts button')].map(x=>x.textContent));ok(btns.join('|')==='Play|Feed|Change water|Hear the tank'&&await p.evaluate(()=>!document.getElementById('again').offsetHeight),'four action buttons in a row: '+btns.join('|'));
 ok(await p.evaluate(()=>!document.getElementById('b-help')&&!!document.getElementById('pic')&&document.getElementById('day').hidden),'Pass 295 (Puti): no ? and no day line on top, the decor picture on the page');
 await p.click('#b-feed');await p.click('#b-water');await p.waitForTimeout(300);
 const st=await p.evaluate(()=>({m:__msgs.slice(),wc:(S.wc||[]).length,food:S.food,clog:S.clog,ctx:A&&A.ctx.state}));ok(st.m.includes('care:feed')&&st.m.includes('care:water')&&st.wc===1&&st.ctx==='running','Feed and Change water work, post care, sound runs: '+JSON.stringify(st));
 ok(await p.evaluate(()=>TANK&&document.getElementById('b-play').textContent==='Pause'),'Feed starts the live tank, the button reads Pause');
 await p.click('#b-play');ok(await p.evaluate(()=>!TANK&&document.getElementById('b-play').textContent==='Play'),'Pause stops it, the button reads Play');await p.click('#b-play');
 const d0=await p.evaluate(()=>S.day);await p.waitForTimeout(2600);const d1=await p.evaluate(()=>S.day);ok(d1-d0>0.4&&d1-d0<0.7,'a day in 5 s ('+(d1-d0).toFixed(2)+' days in 2.6 s)');
 const rows=await p.$$eval('#lights [data-k]',x=>x.map(e=>e.dataset.k));ok(rows.length===20,'Pass 295: '+rows.length+' sound buttons on the page');
 for(const k of rows){await p.evaluate(k=>{hear(k);},k);await p.waitForTimeout(60);}
 ok(!errs.length,'every sound plays with no errors'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
 await p.click('#b-hear');await p.waitForTimeout(1500);ok(await p.evaluate(()=>!!PICRUN),'Hear the tank plays the scan');ok(await p.evaluate(()=>document.querySelectorAll('#lights [data-k^="p:"].on').length>0),'Pass 295: the decor buttons light as the sweep passes');
 await p.click('#lights [data-k="beep"]');await p.waitForTimeout(60);ok(await p.evaluate(()=>document.querySelector('#lights [data-k="beep"]').classList.contains('on')),'Pass 295: a tapped sound lights');
 await p.setViewportSize({width:375,height:667});await p.waitForTimeout(200);const fit=await p.evaluate(()=>document.documentElement.scrollHeight);ok(fit<=667,'Pass 295: one screen at 375x667, no scroll ('+fit+')');await p.setViewportSize({width:360,height:740});
 await p.screenshot({path:require('os').tmpdir()+'/ear-360.png'});
 await p.click('#b-back');await p.waitForTimeout(200);ok(await p.evaluate(()=>__msgs.includes('back')&&!!localStorage.getItem('shrimp-ear-v1')),'Back posts back and saves in shrimp-ear-v1');
 const kb=fs.statSync(path.join(root,'ear.html')).size;ok(kb<120000,'ear.html is '+Math.round(kb/1024)+' kB');
 ok(!errs.length,'no page errors'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
 await b.close();srv.close();console.log(fails?fails+' FAILED':n+' ear tank checks passed');process.exit(fails?1:0);})();
