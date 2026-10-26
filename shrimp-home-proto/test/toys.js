const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
 const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message+' '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
 await p.goto('http://127.0.0.1:8765/index.html');await p.waitForTimeout(400);
 await p.evaluate(()=>{localStorage.clear();S=newState();modCall('init',true);setTab('tank');});await p.waitForTimeout(900);
 const box=async()=>await p.evaluate(()=>{var r=$('tv-canvas').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};});
 const shot=async(n)=>{await p.screenshot({path:'/tmp/claude-0/toys/'+n+'.png'});};
 // VACUUM
 await p.evaluate(()=>{devMess('vac');toyStart('vac');});await p.waitForTimeout(500);let B=await box();
 await p.mouse.move(B.x+B.w*0.2,B.y+B.h*0.85);await p.mouse.down();
 for(let i=0;i<40;i++){await p.mouse.move(B.x+B.w*(0.2+0.6*Math.sin(i/40*Math.PI)),B.y+B.h*(0.84+0.05*Math.sin(i)));await p.waitForTimeout(60);}
 await shot('vac1');
 for(let i=0;i<70;i++){await p.mouse.move(B.x+B.w*(0.1+0.8*(i/70)),B.y+B.h*0.86);await p.waitForTimeout(60);}
 await p.mouse.up();await p.waitForTimeout(300);await shot('vac2');
 const vs=await p.evaluate(()=>({mode:TOY&&TOY.mode,water:TOY&&TOY.water,babies:TOY&&TOY.babies.length,mulm:mulmMean(S.tanks[0]).toFixed(2)}));console.log('vac',JSON.stringify(vs));
 await p.evaluate(()=>{if(TOY)TOY.finish();});await p.waitForTimeout(500);await shot('vac3');
 // tap babies in bucket if any
 const bb=await p.evaluate(()=>TOY&&TOY.bucketBabies?TOY.bucketBabies.map(b=>[b.x,b.y]):[]);B=await box();for(const q of bb){await p.mouse.click(B.x+q[0],B.y+q[1]);await p.waitForTimeout(150);}
 await p.evaluate(()=>{if(TOY&&TOY.mode==='bucket')TOY.act('pour');});await p.waitForTimeout(1200);await shot('vac4');await p.waitForTimeout(1600);
 console.log('after vac',await p.evaluate(()=>JSON.stringify({toy:!!TOY,no3:S.tanks[0].no3.toFixed(1),level:S.tanks[0].level,n:S.tanks[0].shrimp.length})));
 // TRIM
 await p.evaluate(()=>{devMess('trim');toyStart('trim');});await p.waitForTimeout(500);await shot('trim0');B=await box();
 for(let r=0;r<3;r++){await p.mouse.move(B.x+5,B.y+B.h*(0.45+r*0.08));await p.mouse.down();for(let i=0;i<30;i++){await p.mouse.move(B.x+B.w*(i/30),B.y+B.h*(0.45+r*0.08+0.03*Math.sin(i)));await p.waitForTimeout(20);}await p.mouse.up();}
 await p.waitForTimeout(1500);await shot('trim1');
 const fl=await p.evaluate(()=>TOY.fl.map(f=>[f.x,f.y]));console.log('floaters',fl.length);for(const q of fl.slice(0,4)){await p.mouse.click(B.x+q[0],B.y+q[1]);await p.waitForTimeout(100);}
 await shot('trim2');await p.evaluate(()=>TOY.finish());await p.waitForTimeout(300);
 // PESTS
 await p.evaluate(()=>{devMess('pests');toyStart('pests');});await p.waitForTimeout(400);await shot('pests0');B=await box();
 const ps=await p.evaluate(()=>S.tanks[0].pests.map(q=>[q.x*TV.W,q.y*TV.H]));for(const q of ps.slice(0,5)){await p.mouse.click(B.x+q[0],B.y+q[1]);await p.waitForTimeout(120);}
 await shot('pests1');await p.evaluate(()=>TOY.finish());await p.waitForTimeout(300);
 // SCAPE
 await p.evaluate(()=>{S.cash=5000;toyStart('scape');});await p.waitForTimeout(400);await p.evaluate(()=>{TOY.add('leaf');TOY.add('wood');});await p.waitForTimeout(300);await shot('scape1');
 await p.evaluate(()=>TOY.finish());await p.waitForTimeout(300);
 // SPONGE
 await p.evaluate(()=>{devMess('sponge');toyStart('sponge');});await p.waitForTimeout(500);await shot('sponge0');
 let sb=await p.evaluate(()=>{var r=$('sp-cv').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};});
 await p.mouse.click(sb.x+sb.w*0.28,sb.y+sb.h*0.6);await p.waitForTimeout(300);
 for(let i=0;i<5;i++){await p.mouse.move(sb.x+sb.w*0.5,sb.y+sb.h*0.6);await p.mouse.down();await p.waitForTimeout(250);await p.mouse.up();await p.waitForTimeout(250);}
 await shot('sponge1');for(let i=0;i<12;i++){await p.mouse.down();await p.waitForTimeout(120);await p.mouse.up();await p.waitForTimeout(120);}await shot('sponge2');
 await p.evaluate(()=>{var d=$('sp-done');if(d)d.click();else closeSheet();});await p.waitForTimeout(300);
 console.log(errs.join('\n')||'no errors');await b.close();})();
