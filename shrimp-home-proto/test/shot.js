// usage: node test/shot.js out.png "js to run in page" [waitMs] [width] [height] [fullPage]
const {chromium}=require('playwright');
(async()=>{const [out,code,wait,w,h,full]=process.argv.slice(2);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:+(w||390),height:+(h||844)},deviceScaleFactor:2,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
 await p.goto('http://127.0.0.1:8765/index.html');await p.waitForTimeout(600);
 if(code){const r=await p.evaluate(code);if(r!==undefined)console.log('eval:',typeof r==='string'?r:JSON.stringify(r));}
 await p.waitForTimeout(+(wait||400));
 await p.screenshot({path:out,fullPage:full==='1'});
 if(errs.length)console.log(errs.filter(e=>!/fonts.g|net::ERR/.test(e)).join('\n'));
 await b.close();})();
