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
 // Pass 290 (Puti): a grey + Hire says why in its own button row (greyreason found "− + Hire" with nothing else)
 {let h=0;for(const [b,st] of [['strong','kits unlocked'],['avg','kits unlocked'],['strong','year 5']]){const m=M.snap(b,st);if(!m)continue;await g.load(m,{wait:60});await g.js(()=>{G.money=0;cache.estaff=null;render();});
   for(const t of ['emp','promote']){if(await g.tab(t)===false)continue;const rows=await g.js(()=>[...document.querySelectorAll('main .card:not([hidden]) button[data-act="hire"][data-d="1"]')].filter(x=>x.checkVisibility()).map(x=>({grey:x.disabled,hb:(x.closest('.hb').innerText||'').replace(/\s+/g,' ').trim()})));
    for(const r of rows){h++;M.check(b+' '+st+' '+t+': + Hire grey with no money',r.grey,r.hb);M.check(b+' '+st+' '+t+': its row says why (Pass 290)',/Needs /.test(r.hb),r.hb);}}}
  if(!h)M.skip('hire rows','no snapshot shows + Hire');}
 // Pass 290 (Puti): the second packing table row fits at 360 and 390, the full text behind the title
 {const m=M.find('fork breeder',['avg','strong','kind']);if(m){for(const w of [360,390]){await g.page.setViewportSize({width:w,height:844});await g.load(m);await g.tab('emp');
   const r=await g.js(()=>{var it=[...document.querySelectorAll('main .card:not([hidden]) .item.ih')].find(x=>/Second packing table/.test(x.innerText));if(!it)return null;var p=it.querySelector(':scope>div:first-child>p'),q=it.querySelector('.qhelp');return {cut:p.scrollHeight>p.clientHeight+2,txt:p.innerText,full:q?(q.dataset.ht||''):''};});
   if(!r){M.skip('packing table '+w,'row not shown');continue;}M.check('second packing table row not cut at '+w+' (Pass 290)',!r.cut,r.txt);M.check('second packing table: full text behind the title at '+w,/nobody waits on anyone/.test(r.full),r.full.slice(0,80));}
  await g.page.setViewportSize({width:390,height:844});}else M.skip('fork breeder','no moment');}
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('kits');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
