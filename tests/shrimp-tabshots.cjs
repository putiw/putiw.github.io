// SHOTS_RUN=<dir>/run-7.json SHOTS_OUT=<dir> [SHOTS_W=390] [ST="first sale,first farm"] [SHOTS_TABS="up,me"] node tests/shrimp-tabshots.cjs
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const snaps=JSON.parse(fs.readFileSync(process.env.SHOTS_RUN,'utf8')).snapshots,out=process.env.SHOTS_OUT,W=+(process.env.SHOTS_W||390);
const stages=(process.env.ST||'first shrimp,first sale,kits unlocked,first farm,10k owners,million owners,win').split(',');
const only=process.env.SHOTS_TABS?process.env.SHOTS_TABS.split(','):null;
(async()=>{const b=await chromium.launch();fs.mkdirSync(out,{recursive:true});
 for(const sk of stages){const p=await b.newPage({viewport:{width:W,height:844}});p.on('dialog',d=>d.dismiss());
  p.on('pageerror',e=>console.log('PAGEERROR',sk,e.message));
  await p.goto('file://'+path.resolve(__dirname,'../shrimp/index.html'));await p.waitForTimeout(500);
  await p.evaluate(s=>{G=s;migrate(G);G.progress.queue=[];window.spotlight=function(){};window.spotWatch=function(){};try{setSpeed(0)}catch(e){};render();},snaps[sk]);
  let tabs=await p.evaluate(()=>[...document.querySelectorAll('.tabs [data-tab]')].filter(t=>!t.hidden&&t.offsetParent).map(t=>t.dataset.tab).concat(['me']));
  if(only)tabs=tabs.filter(t=>only.includes(t));
  for(const id of tabs){await p.evaluate(t=>{try{if(t==='me')selectTab('me');else document.querySelector('.tabs [data-tab="'+t+'"]').click();}catch(e){}
     document.querySelectorAll('#milestone-card,#milestone,#spot,.toast').forEach(e=>e.style.display='none');window.scrollTo(0,0)},id);
   await p.waitForTimeout(350);await p.screenshot({path:`${out}/${sk.replace(/ /g,'_')}__${id}_${W}.png`,fullPage:true});}
  await p.close();}
 await b.close();})();
