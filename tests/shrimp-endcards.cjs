// Pass 190: every ending (all ENDINGS keys, bankruptcy and sold included) and the sell-company flow at 360 and 390 px:
// one column of text, buttons in one row at the bottom of the sheet, normal height, on screen, and they work.
// ACADEMY_RUN=<strong bot dir>/run-7.json node tests/shrimp-endcards.cjs
const {chromium}=require('playwright');const fs=require('fs');
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');
const snaps=JSON.parse(fs.readFileSync(process.env.ACADEMY_RUN||'/tmp/shrimp-tests/run-7.json','utf8')).snapshots;
const win=snaps.win,mid=snaps['million owners'];
(async()=>{const b=await chromium.launch();let n=0;const fails=[];
 for(const W of [360,390]){
  const p=await b.newPage({viewport:{width:W,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
  await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(250);
  const keys=await p.evaluate(()=>Object.keys(ENDINGS));
  const check=async(label)=>{const r=await p.evaluate(()=>{var c=document.getElementById('milestone-card');if(c.hidden)return {hidden:1};c.scrollTop=c.scrollHeight;
    var choice=!!c.querySelector('.story-choices');var bs=[...c.querySelectorAll('#milestone-actions button')].filter(x=>x.getClientRects().length&&!x.closest('details')&&!x.closest('.ending-box')),H=innerHeight;
    var eb=c.querySelector('.ending-box');var ebw=eb?eb.getBoundingClientRect().width:0,cw=c.clientWidth;
    return {n:bs.length,bad:bs.map(x=>{var r=x.getBoundingClientRect();return (r.height>64||r.height<30||r.bottom>H||r.top<0||r.width<70)?x.textContent.trim().slice(0,20)+' '+Math.round(r.width)+'x'+Math.round(r.height)+'@'+Math.round(r.top):null;}).filter(Boolean),narrow:eb&&ebw<cw*0.8,tops:choice?1:[...new Set(bs.map(x=>Math.round(x.getBoundingClientRect().top)))].length};});
   n++;if(r.hidden)fails.push(W+' '+label+': card hidden');else if(!r.n||r.bad.length||r.narrow||r.tops>1)fails.push(W+' '+label+': '+JSON.stringify(r));};
  const load=async(s,js)=>{await p.evaluate(([s,js])=>{var af=document.getElementById('after');if(af)af.hidden=true;G=JSON.parse(JSON.stringify(s));migrate(G);window.spotlight=function(){};paused=true;G.progress.queue=[];render();(0,eval)(js);render();},[s,js]);await p.waitForTimeout(80);};
  for(const k of keys){await load(win,"endingPick=function(){return '"+k+"';};G.progress.queue=['win'];");await check('win '+k);}
  await load(win,"endingPick=function(){return 'fall_broke'in ENDINGS?'fall_broke':Object.keys(ENDINGS)[0];};G.emp.ended={kind:'closed',day:G.day};G.progress.queue=['gameover'];");await check('gameover closed');
  await load(mid,"G.emp.ended={kind:'sold',day:G.day};G.progress.queue=['gameover'];");await check('gameover sold');
  await load(win,"G.left={day:G.day};G.progress.queue=['left'];");await check('left');
  // the buyout offer: both choices are on screen and Sell ends the game on its ending card
  await load(mid,"G.progress.queue=['buyout'];");await check('buyout offer');
  const tap=async(re)=>{await p.waitForTimeout(650);return p.evaluate(re=>{var bt=[...document.querySelectorAll('#milestone-card button, #after button')].find(x=>new RegExp(re).test(x.textContent)&&x.getClientRects().length);if(!bt)return false;bt.click();render();return true;},re);};
  await tap('Sell for');await tap('Tap again');for(let i=0;i<3;i++){const e=await p.evaluate(()=>!!G.emp.ended);if(e)break;await tap('Got it|OK|Close|Continue');}
  const sold=await p.evaluate(()=>G.emp.ended?G.emp.ended.kind:'not ended');
  n++;if(sold!=='sold')fails.push(W+' buyout sell: '+sold);
  await p.waitForTimeout(50);await p.evaluate(()=>{var af=document.getElementById('after');if(af&&!af.hidden){var x=af.querySelector('button');if(x)x.click();af.hidden=true;}if(G.emp.ended&&G.progress.queue.indexOf('gameover')<0)detectMilestones(G);render();});await check('after selling');
  // every button on the win card does something without an error
  await load(win,"G.progress.queue=['win'];");
  await p.waitForTimeout(650);const clicked=await p.evaluate(()=>{var out=[];['sandbox'].forEach(function(a){var bt=document.querySelector('#milestone-card [data-act="'+a+'"]');if(!bt){out.push('missing '+a);return;}bt.click();render();if(!document.getElementById('milestone-card').hidden&&ensureProgress(G).queue[0]==='win'&&!G.progress.sandbox)out.push(a+' did nothing');});return out;});
  n++;fails.push(...clicked.map(x=>W+' '+x));
  if(errs.length)fails.push(W+' page errors: '+errs[0]);
  await p.close();}
 await b.close();if(fails.length){console.log(fails.slice(0,20).join('\n'));process.exit(1);}console.log(n+' ending card checks passed');})();
