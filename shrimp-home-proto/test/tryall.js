// Clicks every Try it button in turn, closes whatever opened, reports errors.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join(' ')));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|fonts/.test(m.text()))errs.push('console: '+m.text());});
 await p.goto('http://127.0.0.1:8765/index.html');await p.waitForTimeout(500);
 await p.evaluate(()=>{localStorage.clear();S=newState();S.cash=1e6;modCall('init',true);setTab('try');});await p.waitForTimeout(300);
 const ids=await p.evaluate(()=>PROPS.filter(x=>x.go).map(x=>x.id));
 for(const id of ids){await p.evaluate(()=>setTab('try'));await p.waitForTimeout(150);
  await p.click('[data-go="'+id+'"]');await p.waitForTimeout(700);
  const st=await p.evaluate(()=>({tab:activeTab,toy:TOY&&TOY.id,sheet:!!SHEET,stage:S.stage}));
  await p.screenshot({path:'/tmp/claude-0/tryall-'+id+'.png'});
  console.log(id,JSON.stringify(st));
  await p.evaluate(()=>{if(TOY)toyEnd();if(SHEET)closeSheet();});await p.waitForTimeout(150);}
 // run the clock fast for a while on each tab
 for(const t of ['home','tank','book','try']){await p.evaluate((t)=>{setTab(t);setSpeed(20);},t);await p.waitForTimeout(2500);}
 await p.evaluate(()=>skipDays(60));await p.waitForTimeout(300);
 console.log(errs.length?errs.join('\n'):'no errors');await b.close();})();
