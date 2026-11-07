// Pass 289 moment tests, video games (Pass 286 list: a first pass of 100 days lands at 20 to 50; Pass 283: three genres
// offered). Uses the bots' side-branch moments 'game draft' and 'game checkpoint' (tests/lib/moments.cjs).
const M=require('../lib/moment.cjs');
(async()=>{const g=await M.open({w:390});
 for(const b of ['strong','kind','avg']){const d=M.moment(b,'game draft');if(!d){M.skip(b+' game draft','no moment');continue;}
  await g.load(d);M.check(b+' game draft: the You page opens',await g.tab('me')==='me');
  const t=await g.text('#me-game');M.check(b+' game draft: the Shrimp games card is on the You page',!!t,t);
  const o=await g.js(()=>gameOpts(G));M.check(b+' game draft: three genres offered (Pass 283)',o.length===3,o);}
 for(const b of ['strong','kind','avg']){const c=M.moment(b,'game checkpoint');if(!c){M.skip(b+' game checkpoint','no moment');continue;}
  await g.load(c);await g.tab('me');const cu=await g.js(()=>gmOf(G).cur);
  M.check(b+' game checkpoint: the first pass lands at 20 to 50 (Pass 286)',cu&&cu.q>=20&&cu.q<=50,cu&&cu.q);
  const t=await g.text('#me-game')||'';M.check(b+' game checkpoint: the card says it is waiting, with Release and Keep working',/Waiting for you/.test(t)&&/Release/.test(t)&&/Keep working/.test(t),t.slice(0,160));
  M.check(b+' game checkpoint: the quality on the card is the save\'s',t.indexOf('Quality '+cu.q+'%')>=0,t.slice(0,160));
  const bs=await g.rects('#me-game button');M.check(b+' game checkpoint: buttons inside 390 px',bs.length>=2&&bs.every(x=>x.r<=390.5),bs);}
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('games');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
