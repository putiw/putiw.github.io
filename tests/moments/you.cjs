// Pass 289 moment tests, the You page and Grandma's land (Pass 286 list: no Grandma business lesson call, board game day
// waits for free time; Pass 184/227: the land puts decor in Your tank and the Go row sits on Tank 1).
const M=require('../lib/moment.cjs');
(async()=>{const g=await M.open({w:390});
 // over every moment of every bot: never the lesson call, and the June board game card only with free time
 const bad=[],bg=[];let n=0;for(const b of ['strong','kind','avg']){const ms=M.moments(b);for(const k of Object.keys(ms)){const s=ms[k].snap;if(!s||!s.me)continue;n++;
   if(s.me.call==='lesson')bad.push(b+' '+k);const B=s.me.bg;if(B&&B.pop&&s.me.on===false)bg.push(b+' '+k);}}
 M.check('no Grandma lesson call in any moment (Pass 286, '+n+' moments)',!bad.length,bad.slice(0,8).join(', '));
 M.check('no board game card without free time (Pass 286)',!bg.length,bg.slice(0,8).join(', '));
 {const m=M.find('card me_intro');if(m){await g.load(m);await g.js(()=>{acknowledgeMilestone(G);render();});
   M.check('You page opens after the me_intro card',await g.tab('me')==='me');const t=await g.text('#p-me')||await g.js(()=>document.querySelector('main').innerText.replace(/\s+/g,' '));
   M.check('You page: Check on Grandma is there, her years are not (GT_OPEN)',/Check on Grandma/.test(t||'')&&!/Her years/.test(t||''),(t||'').slice(0,200));}else M.skip('me_intro','no moment');}
 {const m=M.find('land open');if(!m)M.skip('land open','no moment');else{await g.load(m);
   M.check('land open: Tank 1 got the land decor (Pass 184)',await g.js(()=>!!G.tanks[0].ldec&&!!G.tanks[0].plants));
   await g.js(()=>{G.sel=0;render();});M.check('land open: Tank tab shows',await g.tab('tank')==='tank');
   const t=await g.text('#landcard')||'';M.check('land open: the Grandma\'s land row with Go is on Tank 1',/Grandma.s land/.test(t)&&/\bGo\b/.test(t),t);
   const r=await g.rects('#landcard button');M.check('land open: Go inside 390 px',r.length&&r.every(x=>x.r<=390.5),r);}}
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('you');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
