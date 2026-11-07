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
 // Pass 290 (Puti): a reaction card shows the day it comes true; a content card waits at least 15 s of play after the card before it.
 const gapCheck=(lbl,L)=>{let prev=null;const late=[],close=[];for(const c of L){if(c.react&&c.first!=null&&c.first>=0&&c.day-c.first>1)late.push(c.k+' '+(c.day-c.first)+' d');
   if(prev&&!c.react&&c.clock-prev.clock<15000)close.push(prev.k+' then '+c.k+' '+((c.clock-prev.clock)/1000).toFixed(1)+' s');prev=c;}
  M.check(lbl+': reaction cards on the day ('+L.length+' cards)',!late.length,late.join(', '));M.check(lbl+': content cards 15 s or more after the card before',!close.length,close.join(', '));};
 // pump calls: CARD_NOW but they sat in the story queue 26 and 35 days (storyWaits took them first). From the pump choice to both calls.
 {const m=M.find('card c_bonus',['strong']);if(m){await g.load(m);const L=await g.cards(220,{c_bonus:2});const pc=L.filter(c=>/^pump_call/.test(c.k));
   M.check('pump calls: both come in 220 days after the pump choice',pc.length===2,pc.map(c=>c.k).join(','));for(const c of pc)M.check(c.k+' on the day it comes true (Pass 290)',c.first>=0&&c.day-c.first<=1,c);gapCheck('strong from c_bonus',L);}else M.skip('pump calls','no moment');}
 // the three pairs Puti asked to space: The World tab then Bulk orders (kind), Mira then The inbox (kind), A good year then Out of money (avg)
 for(const [bot,mk,days,a,b] of [['kind','card worldtab',40,'worldtab','bulk'],['kind','card mira_teen',40,'mira_teen','pain_inbox'],['strong','card ev_paper',120,null,null]]){const m=M.find(mk,[bot]);if(!m){M.skip(bot+' '+mk,'no moment');continue;}
  await g.load(m);const L=await g.cards(days);gapCheck(bot+' from '+mk,L);
  if(a){const i=L.findIndex(c=>c.k===a),j=L.findIndex(c=>c.k===b);if(i>=0&&j>i)M.check(a+' then '+b+' at least 15 s apart',L[j].clock-L[i].clock>=15000,((L[j].clock-L[i].clock)/1000)+' s');}}
 {const m=M.find('card c_bonus',['avg']);if(m){for(const i of [0,1,2]){await g.load(m);const r=await g.js(i=>{var a=bonusAmt(G),res=capitalReserve(G),ok=storyChoose(G,'c_bonus',i);acknowledgeMilestone(G);for(var q=0;q<12;q++)stepGame(G);return {a:a,res:res,money:G.money,broke:brokeNow(G),q:G.progress.queue.slice()};},i);
   M.check('A good year, choice '+i+': the company is not out of money three days later (Pass 290)',!r.broke&&r.q.indexOf('kindsave')<0&&r.q.indexOf('broke')<0,r);}}else M.skip('c_bonus avg','no moment');}
 // Pass 290 (Puti): a grey story choice says what it needs, AED and kits and ✦, not "Not possible right now"
 for(const [mk,set,re] of [['card dye_offer',()=>{G.money=0;},/^Needs AED [\d,.]+[KMB]?$/],['card c_permit',()=>{G.money=0;G.emp.inf=0;},/^Needs AED [\d,.]+[KMB]? and [\d,.]+[KMB]? influence ✦$/],['card c_permit',()=>{G.money=1e15;G.emp.inf=0;},/^Needs [\d,.]+[KMB]? influence ✦$/]]){const m=M.find(mk,['strong','kind','avg']);if(!m){M.skip(mk,'no moment');continue;}
  await g.load(m);await g.js(set);await g.js(()=>{FXC={};if(typeof NEEDC!=='undefined')NEEDC={};renderMilestone.last=null;render();});await g.page.waitForTimeout(150);
  const gr=await g.js(()=>[...document.querySelectorAll('#milestone-card button[data-act="story-choice"]')].filter(b=>b.disabled).map(b=>{var f=b.querySelector('small.fx');return f?f.innerText.trim():'';}));
  M.check(mk+': a grey choice when short',gr.length>0,gr);for(const t of gr)M.check(mk+': grey choice says what it needs',re.test(t),t);}
 // every card moment: the card shows, at the top, with its buttons inside the screen at 390 px
 let n=0;const off=[];for(const b of ['strong','kind','avg']){const ms=M.moments(b);for(const name of Object.keys(ms)){if(!name.startsWith('card '))continue;const m=Object.assign({bot:b,name},ms[name]);
   await g.load(m,{wait:60});const r=await g.rect('#milestone-card');n++;if(!r){off.push(b+' '+name+' (no card)');continue;}
   const bs=await g.rects('#milestone-card button');if(bs.some(x=>x.r>390.5||x.x<-0.5))off.push(b+' '+name+' (button past the edge)');if(r.y>80&&m.id!=='cycle'/* msPlace puts the cycle card under the tank on purpose */)off.push(b+' '+name+' (top '+Math.round(r.y)+')');}}
 M.check('every card moment shows its card at the top, buttons inside 390 px ('+n+' cards)',!off.length,off.slice(0,12).join(', '));
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('cards');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
