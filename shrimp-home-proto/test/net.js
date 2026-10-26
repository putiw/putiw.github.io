// The net and the cull tank: tap to net, tap the net to put back, move to the cull tank,
// hold to look closer, 36 at a time, her escape odds, hobbyists, and no free stand.
const {chromium}=require('playwright');
(async()=>{const W=+process.argv[2]||390;const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:844},deviceScaleFactor:2});
 const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message+' '+(e.stack||'').split('\n').slice(1,3).join(' | ')));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|net::ERR/.test(m.text()))errs.push('console: '+m.text());});
 const fail=[];const ok=(c,msg)=>{if(!c)fail.push(msg);};
 await p.goto('http://127.0.0.1:8765/index.html');await p.waitForTimeout(400);
 await p.evaluate(()=>{localStorage.clear();S=newState();modCall('init',true);setTab('try');});await p.waitForTimeout(400);
 await p.evaluate(()=>{PROPS.find(x=>x.id==='sort').go();});await p.waitForTimeout(1000);
 const shot=async(n)=>{await p.screenshot({path:'/tmp/claude-0/net/t'+W+'-'+n+'.png'});};
 const box=async()=>await p.evaluate(()=>{var r=$('tv-canvas').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};});
 let B=await box(),st;
 st=await p.evaluate(()=>({n:S.tanks[0].shrimp.length,ag:TV.ag.length}));ok(st.n===80&&st.ag===36,'36 of 80 shown '+JSON.stringify(st));
 // nobody swims under the net
 await p.waitForTimeout(2500);st=await p.evaluate(()=>TV.ag.filter(a=>{var r=netRect();return a.x>r.x&&a.x<r.x+r.w&&a.y<r.y+r.h*0.9&&a.surf!=='water';}).length);ok(st===0,'resting under the net: '+st);
 // tap to net (80 in the tank, so always caught)
 const tapAg=async()=>{const pos=await p.evaluate(()=>{var a=TV.ag.filter(a=>!a.hidden)[0];return a?[a.x,a.y]:null;});if(pos)await p.mouse.click(B.x+pos[0],B.y+pos[1]);return pos;};
 for(let k=0;k<4;k++){await tapAg();await p.waitForTimeout(120);}
 await p.waitForTimeout(900);
 st=await p.evaluate(()=>({net:S.net.length,n:S.tanks[0].shrimp.length,ag:TV.ag.length,netAg:Object.keys(TV.netAg).length,bar:!$('netbar').hidden}));
 ok(st.net===4&&st.n===76&&st.ag===32&&st.netAg===4&&st.bar,'netted 4 '+JSON.stringify(st));
 // inside the net box
 st=await p.evaluate(()=>{var b=netBox();return Object.values(TV.netAg).every(q=>q.x>=b.x0-1&&q.x<=b.x1+1&&q.y>=b.y0-1&&q.y<=b.y1+1);});ok(st,'netted shrimp stay in the net');
 await shot('a-net');
 // tap one in the net: back in the tank, in view again
 let q=await p.evaluate(()=>{var e=S.net[0],q=TV.netAg[e.ind.id];return [q.x,q.y,e.ind.id];});await p.mouse.click(B.x+q[0],B.y+q[1]);await p.waitForTimeout(900);
 st=await p.evaluate((id)=>({net:S.net.length,n:S.tanks[0].shrimp.length,ag:TV.ag.length,back:TV.ag.filter(a=>a.ind.id===id).length}),q[2]);
 ok(st.net===3&&st.n===77&&st.ag===33&&st.back===1,'returned one '+JSON.stringify(st));
 // the look doesn't refill from the rest of the tank
 await p.evaluate(()=>tvSync(true));st=await p.evaluate(()=>TV.ag.length);ok(st===33,'look not refilled: '+st);
 // move to cull tank: Grandma's old tank on the free stand
 await p.click('[data-net="cull"]');await p.waitForTimeout(1000);
 st=await p.evaluate(()=>({net:S.net.length,tanks:S.tanks.map(t=>[t.name,t.shrimp.length,t.role||'']),bar:$('netbar').hidden}));
 ok(st.net===0&&st.tanks.length===2&&st.tanks[1][2]==='cull'&&st.tanks[1][1]===3&&st.bar,'moved to cull '+JSON.stringify(st));
 // hold to look closer (no netting)
 const pos=await p.evaluate(()=>{var a=TV.ag[3];return [a.x,a.y,a.id];});
 await p.mouse.move(B.x+pos[0],B.y+pos[1]);await p.mouse.down();await p.waitForTimeout(650);await p.mouse.up();await p.waitForTimeout(150);
 st=await p.evaluate(()=>({bub:!!document.querySelector('.bub'),net:S.net.length,for:TV.bubbleFor}));ok(st.bub&&st.net===0,'hold opens the card '+JSON.stringify(st));await shot('b-hold');
 await p.evaluate(()=>closeBubble());
 // a held-then-dragged finger does nothing
 await p.mouse.move(B.x+pos[0],B.y+pos[1]);await p.mouse.down();await p.mouse.move(B.x+pos[0]+40,B.y+pos[1],{steps:2});await p.waitForTimeout(600);await p.mouse.up();
 st=await p.evaluate(()=>({bub:!!document.querySelector('.bub'),net:S.net.length}));ok(!st.bub&&st.net===0,'drag does nothing '+JSON.stringify(st));
 // a new look each visit
 const l1=await p.evaluate(()=>Object.keys(TV.look.ids).sort().join());await p.evaluate(()=>{setTab('book');setTab('tank');});await p.waitForTimeout(300);
 const l2=await p.evaluate(()=>Object.keys(TV.look.ids).sort().join());ok(l1!==l2,'new look on return');
 // her escape odds in a small tank: some slip away, a second tap while it flees always nets it
 const esc=await p.evaluate(()=>{var T=S.tanks[1];var l=[];for(var k=0;k<20;k++)l.push(newInd({age:90,dna:GEN.forStrain('red',3)}));T.shrimp=T.shrimp.concat(l);S.sel=1;tankMod.render();tvSync(true);
   var slips=0,tries=0,second=0,secondOk=0;for(var r=0;r<200;r++){var a=TV.ag.find(z=>z.intent!=='dash'&&!(TV.t<(z.escUntil||0)));if(!a)break;var before=S.net.length;tries++;netCatch(a);if(S.net.length===before){slips++;second++;netCatch(a);if(S.net.length>before)secondOk++;}
     netPutBack();TV.fly=[];tvSync(true);TV.t+=5;}
   return {tries,slips,second,secondOk};});
 ok(esc.slips>esc.tries*0.03&&esc.slips<esc.tries*0.5&&esc.secondOk===esc.second,'escape odds '+JSON.stringify(esc));
 // hobbyists take culls, more when it's full
 const hb=await p.evaluate(()=>{var T=S.tanks[1];var l=[];for(var k=0;k<40;k++)l.push(newInd({age:90,dna:GEN.forStrain('red',1)}));T.shrimp=T.shrimp.concat(l);var n0=T.shrimp.length,g0=S.stats.given||0;for(var d=0;d<12;d++)hobbyists(T);return {n0,n1:T.shrimp.length,given:(S.stats.given||0)-g0,log:T.log[0]&&T.log[0].t};});
 ok(hb.n1<hb.n0&&hb.given===hb.n0-hb.n1,'hobbyists '+JSON.stringify(hb));
 // no free stand: pick a tank to be the cull tank
 await p.evaluate(()=>{delete S.tanks[1].role;S.sel=0;newLook();tankMod.render();});await p.waitForTimeout(500);B=await box();
 for(let k=0;k<2;k++){await tapAg();await p.waitForTimeout(150);}await p.waitForTimeout(800);
 await p.click('[data-net="cull"]');await p.waitForTimeout(400);
 st=await p.evaluate(()=>({sheet:!!document.querySelector('[data-mk]'),title:(document.querySelector('.sheet h2')||{}).textContent}));ok(st.sheet,'no stand asks which '+JSON.stringify(st));await shot('c-pick');
 await p.click('[data-mk="1"]');await p.waitForTimeout(900);
 st=await p.evaluate(()=>({net:S.net.length,role:S.tanks[1].role,n1:S.tanks[1].shrimp.length}));ok(st.net===0&&st.role==='cull','picked cull tank '+JSON.stringify(st));
 // the toy hides the net and its bar
 await p.evaluate(()=>{var a=TV.ag[0];netCatch(a);});await p.waitForTimeout(900);await p.evaluate(()=>{devMess('vac');toyStart('vac');});await p.waitForTimeout(300);
 st=await p.evaluate(()=>({bar:$('netbar').hidden}));ok(st.bar,'net bar hidden in a job');await p.evaluate(()=>TOY.finish&&TOY.finish());await p.evaluate(()=>{if(TOY)toyEnd();});await p.waitForTimeout(300);
 st=await p.evaluate(()=>({bar:$('netbar').hidden,net:S.net.length}));ok(!st.bar&&st.net===1,'net bar back after '+JSON.stringify(st));
 // it survives a reload
 await p.evaluate(()=>save(true));await p.reload();await p.waitForTimeout(900);await p.evaluate(()=>setTab('tank'));await p.waitForTimeout(800);
 st=await p.evaluate(()=>({net:S.net.length,bar:!$('netbar').hidden,cull:S.tanks.filter(t=>t.role==='cull').length}));ok(st.net===1&&st.bar&&st.cull===1,'after reload '+JSON.stringify(st));await shot('d-reload');
 console.log('escape',JSON.stringify(esc),'hobby',JSON.stringify(hb));console.log(fail.length?'FAIL\n'+fail.join('\n'):'net: all passed');console.log(errs.join('\n')||'no errors');await b.close();})();
