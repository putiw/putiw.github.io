// Pass 289 moment tests, health (Pass 286 list): "Got it · show me" on the health card points at Check shrimp (or the tank)
// on the sick tank; the field guide is one column with 72 px sprites; Done with nothing picked nudges once, then says so.
const M=require('../lib/moment.cjs');
(async()=>{const g=await M.open({w:390});const m=M.find('card health');
 if(!m){M.skip('health','no card health moment');await g.close();M.done('health');}
 await g.load(m,{spots:true});await g.js(()=>{CARD_HOLD=1;G.opt.pauseTold=1;});/* the card came at 1x: closing it plays on, so the pause spotlight doesn't take the turn */
 M.check('health card up with a sick tank',!!await g.rect('#milestone-card')&&await g.js(()=>G.tanks.some(t=>!!t.ill)));
 M.check('show me tapped',await g.tapText('#milestone-card button',/show me/));await g.page.waitForTimeout(900);
 const sp=await g.js(()=>({id:SPOT&&SPOT.el&&SPOT.el.id,text:SPOT&&SPOT.el?($('spot-tip')||{}).innerText||'':'',sel:G.sel,sick:G.tanks.findIndex(t=>t.ill&&totalN(t)>=1),card:$('milestone-card').hidden}));
 M.check('show me: the card closes',sp.card===true);
 M.check('show me: the sick tank is selected (Pass 286)',sp.sel===sp.sick,sp);
 M.check('show me: spotlight on Check shrimp or the tank (Pass 286)',sp.id==='tv-check'||sp.id==='tankview',sp);
 await g.js(()=>{if(SPOT){SPOT.ready=1;spotClose();SPOT=null;}});
 // the health check itself: field guide one column, sprite left 72 px, text right
 await g.js(()=>{var i=G.tanks.findIndex(t=>t.ill&&totalN(t)>=1);openHealth(i);});await g.page.waitForTimeout(400);
 await g.js(()=>{var d=document.querySelector('.fg-grid');d=d&&d.closest('details');if(d)d.open=true;});await g.page.waitForTimeout(150);
 const it=await g.rects('.fg-grid .fg-it'),im=await g.rects('.fg-grid .fg-it img');
 M.check('field guide: four shrimp (healthy and the three signs)',it.length===4,it.length);
 M.check('field guide: one column (Pass 286)',it.length>1&&it.every(x=>Math.abs(x.x-it[0].x)<1)&&it.every((x,i)=>!i||x.y>=it[i-1].b-1),it.map(x=>[Math.round(x.x),Math.round(x.y)]));
 M.check('field guide: sprites 72 px wide, left of the text (Pass 286)',im.length===it.length&&im.every((x,i)=>Math.abs(x.w-72)<1.5&&x.x<it[i].x+it[i].w/2),im.map(x=>Math.round(x.w)));
 // Done looking with nothing picked: first a nudge line, then "You didn't pick any"
 const done=async()=>{const ok=await g.tapText('button',/^Done looking/);await g.page.waitForTimeout(300);return ok?(await g.js(()=>document.body.innerText.replace(/\s+/g,' '))):null;};
 const t1=await done();if(t1==null)M.skip('zero-pick nudge','no Done looking button');else{const t2=await done();
  M.check('Done with nothing picked: the second Done says You didn\'t pick any (Pass 286)',/didn.t pick any/i.test(t2||''),(t2||'').match(/.{0,60}pick.{0,60}/i));}
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('health');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
