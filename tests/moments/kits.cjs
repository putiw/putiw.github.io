// Pass 289 moment tests, kits (Pass 286 list: with packing machines the capacity line sits beside the packing art,
// #auto-pack-cap next to .pack-sprite, not an empty art row plus a line). Every strong and average snapshot with the line.
const M=require('../lib/moment.cjs');
(async()=>{const g=await M.open({w:390});let n=0;
 for(const b of ['strong','avg']){const S=M.run(b).snapshots;for(const st of Object.keys(S)){const m={bot:b,name:st,kind:'snapshot',snap:S[st]};await g.load(m,{wait:60});
   if(await g.tab('emp')===false)continue;const cap=await g.rect('#auto-pack-cap'),art=await g.rect('#auto-pack-loop .pack-sprite');if(!cap)continue;n++;
   M.check(b+' '+st+': the packing art shows with the capacity line',!!art);
   if(art)M.check(b+' '+st+': capacity line beside the art (Pass 286)',cap.x>=art.r-1&&cap.y<art.b&&cap.b>art.y,{cap,art});
   M.check(b+' '+st+': capacity line says kits a day',/kits a day/.test(await g.text('#auto-pack-cap')||''));}}
 if(!n)M.skip('capacity line','no snapshot has packing machines');
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('kits');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
