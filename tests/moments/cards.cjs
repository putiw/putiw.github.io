// Pass 289 moment tests, cards (Pass 286 list): SOON_NOW cards, introStill, the Shrimp Times card, cards at the top.
// Each loads the bot's save at the moment the card is up, renders at 390 px and checks what Puti would look at.
const M=require('../lib/moment.cjs');
(async()=>{const g=await M.open({w:390});
 // Pass 286: a soon card (sale, kit, bulk, hatch) comes at once, and a tutorial card only while its reason holds
 for(const k of ['sale','kit','bulk','hatch']){const m=M.find('card '+k);if(!m){M.skip('card '+k,'no moment');continue;}await g.load(m);
  const r=await g.rect('#milestone-card');M.check('card '+k+' is on screen at the moment',!!r,m.bot);
  if(r)M.check('card '+k+' sits at the top (Pass 194)',r.y<80,'top '+Math.round(r.y));
  M.check('card '+k+' is SOON_NOW (Pass 286)',await g.js(k=>SOON_NOW.indexOf(k)>=0,k));}
 {const m=M.find('card bulk');if(m){await g.load(m);M.check('bulk card: an open offer at the card (introStill)',await g.js(()=>introStill(G,'bulk')&&!!G.korder&&!G.korder.taken));
   await g.js(()=>{G.korder.taken=1;});M.check('bulk card: introStill false once the offer is gone (Pass 286)',await g.js(()=>!introStill(G,'bulk')));}}
 {const m=M.find('card health');if(m){await g.load(m);M.check('health card: a sick tank at the card',await g.js(()=>G.tanks.some(t=>!!t.ill)));}else M.skip('card health','no moment');}
 // Pass 286: the Shrimp Times card waits for the first issue, and World shows only with something in it
 {const m=M.find('card ripple');if(m){await g.load(m);M.check('ripple card: the first issue is out (R.log)',await g.js(()=>rip(G).log.length>0),await g.js(()=>rip(G).log.length));
   M.check('ripple card: says New issues show up in World',/World/.test(await g.text('#milestone-card')||''));}else M.skip('card ripple','no moment');}
 // every card moment: the card shows, at the top, with its buttons inside the screen at 390 px
 let n=0;const off=[];for(const b of ['strong','kind','avg']){const ms=M.moments(b);for(const name of Object.keys(ms)){if(!name.startsWith('card '))continue;const m=Object.assign({bot:b,name},ms[name]);
   await g.load(m,{wait:60});const r=await g.rect('#milestone-card');n++;if(!r){off.push(b+' '+name+' (no card)');continue;}
   const bs=await g.rects('#milestone-card button');if(bs.some(x=>x.r>390.5||x.x<-0.5))off.push(b+' '+name+' (button past the edge)');if(r.y>80&&m.id!=='cycle'/* msPlace puts the cycle card under the tank on purpose */)off.push(b+' '+name+' (top '+Math.round(r.y)+')');}}
 M.check('every card moment shows its card at the top, buttons inside 390 px ('+n+' cards)',!off.length,off.slice(0,12).join(', '));
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('cards');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
