// Spotlight sweep in a real browser (Playwright). Needs the strong bot's snapshots: run tests/shrimp-playthrough.cjs first, or set SPOT_RUN.
// Every spotlight card on every open tab, each tab button and the Water button: ring up, target visible between header and tabs, ring on the card, tip not covering it.
const {chromium,devices}=require('playwright');const fs=require('fs');
const snaps=JSON.parse(fs.readFileSync(process.env.SPOT_RUN||require('os').tmpdir()+'/shrimp-tests/run-7.json','utf8')).snapshots;
(async()=>{const b=await chromium.launch();const html=fs.readFileSync(require('path').join(__dirname,'../shrimp/index.html'),'utf8');const bad=[];let n=0;fs.mkdirSync((process.env.SPOT_OUT||require('os').tmpdir()+'/shrimp-spots'),{recursive:true});
 for(const sk of ['first shrimp','first hatch','first sale','first kit','first farm','million owners']){
  const p=await b.newPage({viewport:{width:390,height:760}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setContent('<body>'+html+'</body>');
  await p.evaluate((s)=>{G=s;migrate(G);G.progress.queue=[];G.opt.all=false;cache={};render();},snaps[sk]);
  const tabs=await p.evaluate(()=>Array.from(document.querySelectorAll('.tabs [data-tab]')).filter(t=>!t.hidden).map(t=>t.dataset.tab));
  for(const tab of tabs){
   await p.evaluate((t)=>{document.querySelector('.tabs [data-tab="'+t+'"]').click();render();window.scrollTo(0,0);},tab);await p.waitForTimeout(150);
   const targets=await p.evaluate(()=>{var o=[];document.querySelectorAll('main .card[id]').forEach(c=>{if(SPOT_INFO[c.id]&&spotShown(c))o.push('#'+c.id);});return o;});
   targets.push('TAB');targets.push('#tb-wc');
   for(const tg of targets){
    const ok=await p.evaluate((a)=>{var el=a.tg==='TAB'?document.querySelector('.tabs [data-tab="'+a.tab+'"]'):document.querySelector(a.tg);if(!el||!el.getClientRects().length)return false;window.scrollTo(0,0);spotWatch.last=0;G.progress.lastAck=null;SPOTQ.length=0;SPOT=null;spotlight(el,'Test: '+(el.id||a.tab));return true;},{tg,tab});
    if(!ok)continue;await p.waitForTimeout(1900);
    const r=await p.evaluate((a)=>{var el=SPOT&&SPOT.el;if(!el)return {err:'no spot'};var e=el.getBoundingClientRect(),g=$('spot-ring').getBoundingClientRect(),t=$('spot-tip').getBoundingClientRect(),B=spotBars(),fixed=!!el.closest('.tabs,.top');
      var vis=Math.min(e.bottom,fixed?innerHeight:B.bot)-Math.max(e.top,fixed?0:B.top);return {ready:SPOT.ready,e:[e.top,e.bottom].map(Math.round),ring:[g.top,g.bottom].map(Math.round),tip:[t.top,t.bottom].map(Math.round),vis:Math.round(vis),h:Math.round(e.height),B:[Math.round(B.top),Math.round(B.bot)],tipOverRing:t.bottom>g.top+4&&t.top<g.bottom-4};},{});
    n++;const name=sk.replace(/ /g,'_')+'-'+tab+'-'+tg.replace('#','');
    if(r.err){console.log('NOSPOT',sk,tab,tg,JSON.stringify(await p.evaluate(()=>({q:SPOTQ.length,ok:introOK(),mc:!$('milestone-card').hidden,key:G.progress.queue[0],tv:TVLOCK,hc:!$('hcheck').hidden,ts:!$('tsheet').hidden}))));continue;}
    const problems=[];if(!r.ready)problems.push('not ready');if(r.vis<Math.min(r.h,80))problems.push('target not visible');if(Math.abs(r.ring[0]-Math.max(r.e[0]-6,r.B[0]+2))>8&&!(tg==='TAB'||tg==='#tb-wc'))problems.push('ring top off');if(r.tipOverRing&&r.h<300)problems.push('tip covers ring');
    if(problems.length){bad.push(name+' '+problems.join(',')+' '+JSON.stringify(r));await p.screenshot({path:(process.env.SPOT_OUT||require('os').tmpdir()+'/shrimp-spots')+'/'+name+'.png'});}
    await p.evaluate(()=>{if(SPOT&&SPOT.ready)spotClose();});await p.waitForTimeout(100);}
  }
  if(errs.length)bad.push(sk+' errors '+errs.join('|'));await p.close();}
 // Play-stat hooks for the ending (Pass 110): a setting change, a ? open and a chart open each count once, and screen time
 // splits into the You page (home) and the company tabs.
 {const p=await b.newPage({viewport:{width:390,height:760}});await p.setContent('<body>'+html+'</body>');
  await p.evaluate((s)=>{G=s;migrate(G);G.progress.queue=[];cache={};render();G.ps.tw=G.ps.help=G.ps.chart=G.ps.home=G.ps.biz=0;SPOT=null;},snaps['first sale']);
  const r=await p.evaluate(async()=>{var w=function(ms){return new Promise(function(r){setTimeout(r,ms);});};document.querySelector('.tabs [data-tab="tank"]').click();render();await w(100);
   var sl=document.getElementById('s-ration');sl.value=+sl.value+10;sl.dispatchEvent(new Event('input',{bubbles:true}));sl.value=+sl.value+5;sl.dispatchEvent(new Event('input',{bubbles:true}));var o={tw:G.ps.tw};
   var q=document.querySelector('.qhelp');if(q)q.click();o.help=G.ps.help;var ch=document.getElementById('charts');ch.classList.add('shut');ch.querySelector('.hd').click();o.chart=G.ps.chart;
   G.me.on=1;await w(700);o.biz=G.ps.biz;o.home=G.ps.home;return o;});
  n++;if(r.tw!==1||r.help!==1||r.chart!==1||!(r.biz>0)||r.home!==0)bad.push('play-stat hooks '+JSON.stringify(r));await p.close();}
 console.log('checked',n);console.log(bad.join('\n')||'all good');await b.close();})();
