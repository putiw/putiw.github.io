// Stable screen (Part 2, Pass 180): pressing a button must not move the screen.
// 390x844, snapshots from a strong bot run (ACADEMY_RUN or STABLE_RUN, default /tmp/shrimp-tests/run-7.json).
// For every visible enabled button on every tab: fresh page, record scrollY, the button's rect, its card's height
// and the header height, click, wait 400 ms, check none moved more than 1 px (care buttons: also #tankview).
// Env: STABLE_STAGES="first sale,win" to limit stages, STABLE_TABS=tank,emp, STABLE_MAX=n buttons per tab,
// STABLE_SKIP_HOME=1 / STABLE_SKIP_SPACE=1. Screenshots never go in the repo.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const RUN=process.env.STABLE_RUN||process.env.ACADEMY_RUN||'/tmp/shrimp-tests/run-7.json';
const snaps=JSON.parse(fs.readFileSync(RUN,'utf8')).snapshots;
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
const W=390,H=844,TOL=1;
// Disclosures open something below themselves on purpose (collapsible headers, show/hide toggles): their card may change height,
// but the page must not scroll and the header must not change. One-off chapter starts change the card once; listed so they show.
const DISCLOSE=/(^#\w[\w-]* div ")|data-act=(gt-check|earlier-equipment)|act=(gt-check|earlier-equipment)|^#tb-info|summary/;
const ONEOFF={'rl-hire':'starting the lab turns the field pick into the lab','hard-goal':'picking the first goal opens the hard part','hard-keep':'keeping the goal opens the hard part','milestone-next':'closing a story card','sandbox':'Keep playing closes the win card','reset':'new game','fork':'answering a question card replaces it with what you picked'};
const onlyStages=process.env.STABLE_STAGES?process.env.STABLE_STAGES.split(','):null;
const onlyTabs=process.env.STABLE_TABS?process.env.STABLE_TABS.split(','):null;
const MAX=+process.env.STABLE_MAX||200;

// Runs in the page: a stable key for a button so it can be found again after a re-render.
const KEYFN=`window.__bkey=function(b){if(b.id)return '#'+b.id;var k=[];['act','id','i','k','tab','speed','card','opt','v','n'].forEach(function(a){var v=b.getAttribute('data-'+a);if(v!=null)k.push(a+'='+v);});
 var host=b.closest('[id]');return (b.classList.contains('fopt')?'fork ':'')+(host?'#'+host.id+' ':'')+b.tagName.toLowerCase()+(k.length?'['+k.join(',')+']':'')+' "'+(b.textContent||'').trim().replace(/\\s+/g,' ').slice(0,24)+'"';};
window.__find=function(k){var all=window.__btns();for(var i=0;i<all.length;i++)if(window.__bkey(all[i])===k)return all[i];return null;};
window.__vis=function(el){if(!el||!el.isConnected||!el.getClientRects().length)return false;var cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity===0)return false;var r=el.getBoundingClientRect();return r.width>1&&r.height>1;};
window.__btns=function(){return [].slice.call(document.querySelectorAll('header button,main button,main [role=button],nav.tabs button')).filter(function(b){return window.__vis(b)&&!b.disabled&&b.getAttribute('aria-disabled')!=='true';});};
window.__card=function(b){return b.closest('.card,.item,#milestone-card,.tv-care,.top')||b.parentElement;};
window.__m=function(b){var t=document.querySelector('header.top'),c=b&&window.__card(b),tv=document.getElementById('tankview');
 return {y:scrollY,b:b&&window.__vis(b)?b.getBoundingClientRect().toJSON():null,c:c&&window.__vis(c)?c.getBoundingClientRect().height:null,cid:c?(c.id||c.className):'',h:t.getBoundingClientRect().height,tv:tv&&window.__vis(tv)?tv.getBoundingClientRect().toJSON():null};};`;

async function fresh(b,snap,tab){
 const p=await b.newPage({viewport:{width:W,height:H}});p.on('dialog',d=>d.dismiss());p.on('pageerror',e=>{p.__err=(p.__err||'')+e.message+'\n';});
 await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(150);
 await p.evaluate(KEYFN);
 if(snap)await p.evaluate(s=>{window.spotlight=function(){};G=s;migrate(G);G.progress.queue=[];G.opt.all=true;try{setSpeed(0);}catch(e){}render();},snap);
 if(tab)await p.evaluate(t=>{try{if(t==='me')selectTab('me');else{var x=document.querySelector('.tabs [data-tab="'+t+'"]');if(x)x.click();}}catch(e){}render();scrollTo(0,0);},tab);
 await p.waitForTimeout(150);return p;}

(async()=>{const b=await chromium.launch();const fails={};let n=0,nf=0;const jobs=[];const allowed={};
 const add=(k,where,msg)=>{nf++;if(!fails[k])fails[k]={msg,where:[]};if(fails[k].where.length<4)fails[k].where.push(where);};
 const stages=Object.keys(snaps).filter(s=>!onlyStages||onlyStages.includes(s));
 for(const sk of stages){
  const p0=await fresh(b,snaps[sk],null);
  let tabs=await p0.evaluate(()=>[...document.querySelectorAll('.tabs [data-tab]')].filter(t=>!t.hidden).map(t=>t.dataset.tab));
  if(await p0.evaluate(()=>!document.getElementById('tb-me').hidden))tabs.push('me');
  await p0.close();
  if(onlyTabs)tabs=tabs.filter(t=>onlyTabs.includes(t));
  for(const tab of tabs){
   const p1=await fresh(b,snaps[sk],tab);
   // the tab bar itself, the speed buttons and the header's own popups are checked once per tab, not per stage
   const keys=await p1.evaluate(()=>{var seen={};return window.__btns().map(window.__bkey).filter(function(k){if(seen[k])return false;seen[k]=1;return !/^#tab-|data-speed|^nav|^#tb-me|^#earthline/.test(k);});});
   await p1.close();
   for(const k of keys.slice(0,MAX))jobs.push([sk,tab,k]);
  }
 }

 const one=async([sk,tab,k])=>{
    const p=await fresh(b,snaps[sk],tab);n++;
    const before=await p.evaluate(k=>{var el=window.__find(k);if(!el)return null;var r=el.getBoundingClientRect();if(r.top<120||r.bottom>innerHeight-80)scrollTo(0,Math.max(0,scrollY+r.top-innerHeight/2));return true;},k);
    if(!before){await p.close();return;}
    await p.waitForTimeout(60);
    const m0=await p.evaluate(k=>{var el=window.__find(k);window.__el=el;window.__c0=window.__card(el);return window.__m(el);},k);
    await p.evaluate(()=>{try{window.__el.click();}catch(e){}});
    await p.waitForTimeout(400);
    const m1=await p.evaluate(()=>{var el=window.__el;if(!el.isConnected){var k=window.__bkey(el);el=window.__find(k)||el;}var m=window.__m(el);var c=window.__c0;if(c&&!c.isConnected&&c.id)c=document.getElementById(c.id);m.c=c&&window.__vis(c)?c.getBoundingClientRect().height:null;
     m.nav=!window.__vis(el)||!c||!window.__vis(c);m.overlay=!![].slice.call(document.querySelectorAll('.sheet,.fs,#finsheet,#settings,#after,.modal,[role=dialog]')).filter(window.__vis).length;return m;});
    const where=sk+' / '+tab;const bad=[];
    if(Math.abs(m1.y-m0.y)>TOL)bad.push('scrollY '+Math.round(m0.y)+'→'+Math.round(m1.y));
    if(Math.abs(m1.h-m0.h)>TOL)bad.push('header h '+Math.round(m0.h)+'→'+Math.round(m1.h));
    const disc=DISCLOSE.test(k),one=k.indexOf('fork ')===0?'fork':Object.keys(ONEOFF).find(a=>k.indexOf('act='+a)>=0);
    if(!m1.nav&&!disc){
     if(m0.b&&m1.b&&(Math.abs(m1.b.x-m0.b.x)>TOL||Math.abs(m1.b.y-m0.b.y)>TOL||Math.abs(m1.b.width-m0.b.width)>TOL||Math.abs(m1.b.height-m0.b.height)>TOL))bad.push('button '+[m0.b.x,m0.b.y,m0.b.width,m0.b.height].map(Math.round)+'→'+[m1.b.x,m1.b.y,m1.b.width,m1.b.height].map(Math.round));
     if(m0.c!=null&&m1.c!=null&&Math.abs(m1.c-m0.c)>TOL)bad.push('card('+String(m0.cid).slice(0,20)+') h '+Math.round(m0.c)+'→'+Math.round(m1.c));
    }
    if(m0.tv&&m1.tv&&(Math.abs(m1.tv.y-m0.tv.y)>TOL||Math.abs(m1.tv.height-m0.tv.height)>TOL))bad.push('tankview y/h '+Math.round(m0.tv.y)+'/'+Math.round(m0.tv.height)+'→'+Math.round(m1.tv.y)+'/'+Math.round(m1.tv.height));
    if(bad.length){if(one){allowed[k]=ONEOFF[one]+': '+bad.join('; ');}else add(k,where,bad.join('; '));}
    await p.close();
 };
 console.error(jobs.length+' buttons to press');const N=+process.env.STABLE_N||6;let qi=0;await Promise.all(Array.from({length:N},async()=>{while(qi<jobs.length){const j=jobs[qi++];if(qi%100===0)console.error(qi+'/'+jobs.length);try{await one(j);}catch(e){add(j[2],j[0]+' / '+j[1],'error '+String(e.message).slice(0,80));}}}));
 // Grandma's land toys and space.html panels
 for(const [file,sel,label] of [['home.html','button','home'],['space.html','button','space']]){
  if(process.env['STABLE_SKIP_'+label.toUpperCase()])continue;
  const url='file://'+path.join(__dirname,'../shrimp/'+file);
  const pg=await b.newPage({viewport:{width:W,height:H}});pg.on('dialog',d=>d.dismiss());
  try{await pg.goto(url);await pg.waitForTimeout(500);}catch(e){await pg.close();continue;}
  await pg.evaluate(KEYFN);
  const keys=await pg.evaluate(s=>{var seen={};return [].slice.call(document.querySelectorAll(s)).filter(window.__vis).map(window.__bkey).filter(function(k){if(seen[k])return false;seen[k]=1;return true;});},sel);
  await pg.close();
  for(const k of keys.slice(0,MAX)){
   const p=await b.newPage({viewport:{width:W,height:H}});p.on('dialog',d=>d.dismiss());
   await p.goto(url);await p.waitForTimeout(400);await p.evaluate(KEYFN);
   await p.evaluate(()=>{window.__btns=function(){return [].slice.call(document.querySelectorAll('button')).filter(window.__vis);};});
   const ok=await p.evaluate(k=>{var el=window.__find(k);if(!el)return false;window.__el=el;window.__c0=el.parentElement;var r=el.getBoundingClientRect();window.__m0={y:scrollY,b:r.toJSON(),c:el.parentElement.getBoundingClientRect().height};return true;},k);
   if(!ok){await p.close();continue;}n++;
   await p.evaluate(()=>{try{window.__el.click();}catch(e){}});await p.waitForTimeout(400);
   const r=await p.evaluate(()=>{var m0=window.__m0,el=window.__el,out=[];if(Math.abs(scrollY-m0.y)>1)out.push('scrollY '+m0.y+'→'+scrollY);
    if(window.__vis(el)){var b=el.getBoundingClientRect();if(Math.abs(b.y-m0.b.y)>1||Math.abs(b.x-m0.b.x)>1)out.push('button moved '+Math.round(m0.b.y)+'→'+Math.round(b.y));}
    var c=window.__c0;if(c.isConnected&&window.__vis(c)&&Math.abs(c.getBoundingClientRect().height-m0.c)>1)out.push('parent h '+Math.round(m0.c)+'→'+Math.round(c.getBoundingClientRect().height));return out;});
   if(r.length)add(label+' '+k,label,r.join('; '));
   await p.close();
  }
 }
 const list=Object.entries(fails);
 console.log(n+' clicks, '+list.length+' buttons moved something ('+nf+' failures)');
 list.forEach(([k,f])=>console.log(k+'  '+f.msg+'  ['+f.where.join('; ')+']'));
 Object.entries(allowed).forEach(([k,v])=>console.log('allowed (one-off): '+k+'  '+v));
 await b.close();process.exit(list.length?1:0);})();
