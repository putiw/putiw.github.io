// Pass 288: grey with no reason (Puti's category 3, claude/shrimp-test-workflow-7nov.md 4C.2). Headless Chromium at 390 px.
// Every snapshot of the runs in GREY_RUNS (comma list), every tab the save has: closed folds opened (attribute only, no tap),
// then every disabled or .off button inside a visible card must have a reason in its row: "Needs", "Waiting", "until",
// "Done", "left", a number, or a ?. Then every dotted title (.qhelp.qt) on screen is tapped once per distinct title and must
// open the help sheet or change the page. Reports, doesn't fix. GREY_STAGES narrows the snapshots (a regex on '<run> <snapshot>').
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const MRE=process.env.GREY_MOMENTS?new RegExp(process.env.GREY_MOMENTS):null;
const RUNS=(process.env.GREY_RUNS||'').split(',').filter(Boolean),ONLY=process.env.GREY_STAGES?new RegExp(process.env.GREY_STAGES):null;/* regex on '<run> <snapshot>', e.g. '^strong |^avg year' */
if(!RUNS.length){console.error('FAIL set GREY_RUNS');process.exit(1);}
const T0=Date.now();const TABS=['tank','up','market','emp','promote','hard','world','research'];
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');
const grey={},dots={},dotSeen=new Set();let nb=0,ns=0,nd=0;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(300);
 for(const f of RUNS){const name=path.basename(path.dirname(f)),rj=JSON.parse(fs.readFileSync(f,'utf8')),snaps=rj.snapshots;
  /* Pass 289: GREY_MOMENTS=<regex> adds the run's MOMENTS: a card moment is checked on its card (every grey choice says why),
     any other on its own tab only */
  const list=Object.keys(snaps).filter(st=>!ONLY||ONLY.test(name+' '+st)).map(st=>[st,snaps[st],null]);
  if(MRE)for(const [k,v] of Object.entries(rj.moments||{}))if(v&&v.snap&&MRE.test(k))list.push(['moment '+k,v.snap,v]);
  for(const [st,snap,mo] of list){ns++;const card=!!(mo&&mo.kind==='card');
   await p.evaluate(([s,card])=>{G=JSON.parse(s);migrate(G);if(!card)G.progress.queue=[];window.spotlight=function(){};speed=0;FRZ={};$('after').hidden=true;AFTER_HOLD=null;$('helpsheet').hidden=true;render();},[JSON.stringify(snap),card]);
   if(card){await p.waitForTimeout(120);const r=await p.evaluate(()=>{const out=[];let n=0;const c=$('milestone-card');if(!c||c.hidden)return {n,out,none:1};
     c.querySelectorAll('button').forEach(b=>{if(!(b.disabled||b.classList.contains('off'))||!b.checkVisibility())return;n++;const tx=(b.innerText||'').replace(/\s+/g,' ').trim(),row=(b.parentElement.innerText||'').replace(/\s+/g,' ').trim();
      if(!/Needs|Waiting|until|left|\d|✦|\?/i.test(tx+' '+row))out.push('milestone-card: "'+tx.slice(0,50)+'"');});return {n,out};});
    nb+=r.n;r.out.forEach(x=>{(grey['card · '+x]=grey['card · '+x]||[]).push(name+' '+st);});continue;}
   let tabs=TABS;if(mo&&mo.tab){const mt=await p.evaluate(a=>{var f=typeof tabMap==='function'?tabMap:function(x){return x;};return a.map(f);},[mo.tab].concat(TABS));tabs=TABS.filter((t,i)=>mt[i+1]===mt[0]);}
   for(const t of tabs){const tb=await p.$('.tabs [data-tab="'+t+'"]');if(!tb||!await tb.isVisible())continue;const unspot=()=>p.evaluate(()=>{if(SPOT)SPOT.ready=1;spotClose();SPOT=null;$('spot').hidden=true;});await unspot();await tb.click({timeout:1500}).catch(()=>tb.evaluate(x=>x.click()));await p.waitForTimeout(150);await unspot();
    await p.evaluate(()=>{document.querySelectorAll('main .card:not([hidden]) details:not([open])').forEach(d=>d.open=true);render();});await p.waitForTimeout(80);
    const r=await p.evaluate(()=>{const out=[];let n=0;
     document.querySelectorAll('main .card:not([hidden]) button').forEach(b=>{if(!(b.disabled||b.classList.contains('off'))||!b.checkVisibility())return;if(b.classList.contains('qhelp'))return;n++;
      const row=b.closest('.item,.srow,.pr-row,.hb,.btns,.row,li,tr')||b.parentElement;const tx=(row.innerText||'').replace(/\s+/g,' ').trim();
      const bt=(b.innerText||'').trim();if(bt==='−'||bt==='-')return;/* a minus at its floor */
      const why=/Needs|Waiting|until|Done|left|Funded|Not this year|Picked|Chosen|Running|\d|\?|✦/i.test(tx)||!!row.querySelector('.qhelp');
      if(!why){const card=b.closest('.card');out.push((card&&card.id||'?')+': "'+(b.innerText||b.getAttribute('aria-label')||'').trim()+'" in "'+tx.slice(0,70)+'"');}});
     return {n,out};});
    nb+=r.n;r.out.forEach(x=>{(grey[t+' · '+x]=grey[t+' · '+x]||[]).push(name+' '+st);});
    // dotted titles: tap each distinct one once
    const qts=await p.evaluate(()=>[...document.querySelectorAll('main .card:not([hidden]) .qhelp.qt')].filter(e=>e.checkVisibility()).map((e,i)=>{e.dataset.qti=i;return [i,(e.innerText||'').trim().slice(0,40)];}));
    if(await p.evaluate(()=>!!G.emp.won&&!G.progress.sandbox))qts.length=0;/* the win save has the ending page over everything */
    for(const [i,tt] of qts){const key=t+' · '+tt;if(dotSeen.has(key))continue;dotSeen.add(key);nd++;
     /* find it fresh and tap its middle like a finger: a render can swap the node, a held handle goes stale */
     const pt=await p.evaluate(tt=>{if(SPOT)SPOT.ready=1;spotClose();SPOT=null;$('spot').hidden=true;var e=[...document.querySelectorAll('main .card:not([hidden]) .qhelp.qt')].find(x=>x.checkVisibility()&&(x.innerText||'').trim().slice(0,40)===tt);if(!e)return null;e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect(),x=r.x+Math.min(r.width/2,30),y=r.y+r.height/2,h=document.elementFromPoint(x,y);return {x,y,cov:h&&!(h===e||e.contains(h))?h.tagName+'#'+h.id+'.'+h.className:''};},tt);
     if(!pt)continue;
     const before=await p.evaluate(()=>document.body.innerText.length+'|'+[...document.querySelectorAll('.sheet,#helpsheet,#after,[role=dialog]')].filter(x=>!x.hidden&&x.checkVisibility()).length);
     await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(150);
     const after=await p.evaluate(()=>({hs:!$('helpsheet').hidden,sig:document.body.innerText.length+'|'+[...document.querySelectorAll('.sheet,#helpsheet,#after,[role=dialog]')].filter(x=>!x.hidden&&x.checkVisibility()).length}));
     if(!after.hs&&after.sig===before)(dots[key+(pt.cov?' (covered by '+pt.cov+')':'')]=dots[key]||[]).push(name+' '+st);
     await p.evaluate(()=>{$('helpsheet').hidden=true;if($('after'))$('after').hidden=true;});}
   }}}
 const gk=Object.keys(grey),dk=Object.keys(dots);
 if(errs.length)gk.push('page errors: '+[...new Set(errs)].slice(0,5).join(' | '));
 if(gk.length||dk.length){console.error('FAIL '+gk.length+' grey buttons with no reason (of '+nb+' grey seen), '+dk.length+' dotted titles that open nothing (of '+nd+'), '+ns+' snapshots:');
  gk.forEach(k=>console.error('  grey '+k+'  ['+(grey[k]||[]).length+' snaps, first '+((grey[k]||[])[0]||'')+']'));
  dk.forEach(k=>console.error('  dot  '+k+'  ['+dots[k][0]+']'));await b.close();process.exit(1);}
 console.log('PASS ('+Math.round((Date.now()-T0)/1000)+' s) '+nb+' grey buttons all say why, '+nd+' dotted titles all open, '+ns+' snapshots');await b.close();})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
