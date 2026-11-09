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
 // Pass 294 (Puti): two racks gave "10 shrimp/d" next to "1 kit/d" rows. Header in kits a day, a new rack counts the same day; the Shrimp a rack label opens its tip
 {const m=M.snap('strong','first farm');if(m){await g.load(m,{wait:60});await g.js(()=>{G.money=1e6;G.emp.farms.rack=1;G.emp.prodAvg=8;G.emp.farms.rack=2;G.emp.fw={s:1,f:0};G.kits.stock=0;cache={};render();});
   if(await g.tab('up')!==false){await g.tick(1);await g.js(()=>{cache={};render();});const hd=await g.text('#e-farmsum')||'';M.check('Farms header in shrimp a day, 2 racks at 100% = 16 shrimp/d (Pass 295, was 2 kits/d in 294)',/\b16 shrimp\/d\b/.test(hd)&&!/kits?\/d/.test(hd),hd);
    const rr=await g.js(()=>{var it=[...document.querySelectorAll('#e-farms .item')].find(x=>/grow rack ×2/.test(x.innerText));return it?it.querySelector('p').innerText:'';});M.check('rack row says 8 shrimp/d (one farm, Pass 302 drops each), adds up to the header (Pass 295)',/^8 shrimp\/d · AED/.test(rr),rr);
    if(await g.rect('label[for="s-fwS"]')){await g.page.click('label[for="s-fwS"]');await g.page.waitForTimeout(150);const tp=await g.js(()=>{var t=document.getElementById('param-tooltip');return t&&!t.hidden?t.innerText:'';});M.check('Shrimp a rack label opens its tip (Pass 294)',/How full each rack is/.test(tp),tp);}else M.skip('fwS tip','label not shown');}}else M.skip('farm header','no first farm snapshot');}
 // Pass 295 (Puti): sell one at a time, a quiet dotted Sell on the row's line, no Sell all, no pills
 {const m=M.snap('strong','million owners');if(m){for(const w of [360,390]){await g.page.setViewportSize({width:w,height:844});await g.load(m,{wait:60});await g.js(()=>{G.emp.staff.lines=6;G.emp.packLines={hall:1};G.emp.staff.pack=0;cache={};render();});if(await g.tab('emp')===false)continue;
   const k=await g.js(()=>{var c=$('c-staff');c.classList.remove('shut');c.querySelectorAll('details').forEach(d=>d.open=true);var sp=c.querySelector('#auto-pack-loop .pack-sprite').getBoundingClientRect(),cap=$('auto-pack-cap').getBoundingClientRect(),hd=$('e-staffsum'),h2=c.querySelector('.hd h2');
    return {hd:hd.innerText,hdOne:hd.getBoundingClientRect().height<24&&hd.getBoundingClientRect().right<=c.getBoundingClientRect().right,txt:c.innerText,split:(c.querySelector('.pack-split')||{}).innerText||'',beside:cap.left>=sp.right-1&&cap.top<sp.bottom&&cap.bottom>sp.top,
     sells:[...c.querySelectorAll('button[data-act="line-sell"]')].map(x=>({inP:x.parentElement.classList.contains('item'),cls:x.className,bg:getComputedStyle(x).backgroundColor})),all:c.querySelectorAll('[data-act$="sellall"]').length,sum:[...c.querySelectorAll('details.old-tier>summary')].map(x=>x.innerText)};});
   M.check(w+': Making kits header "up to 14.4k a day" on one line (Pass 295, Pass 301: capacity, not today\'s count)',/^up to [0-9.,kM]+ a day/.test(k.hd)&&k.hdOne&&!/stock/.test(k.hd),k.hd);
   M.check(w+': capacity and who packs beside the art, stock on the second line (Pass 295)',k.beside&&/12k by the hall, 2,400 by 6 robotic lines · [0-9.,k]+ in stock/.test(k.split),k.split);
   M.check(w+': no Earlier packing tools fold, Older equipment · 6 robotic lines (Pass 295)',!/Earlier packing tools/.test(k.txt)&&k.sum.join('|')==='Older equipment · 6 robotic lines',k.sum);
   M.check(w+': Sell is a quiet link under the row text, no Sell all (Pass 295, own line since Pass 302)',k.sells.length===2&&k.sells.every(x=>x.inP&&/tlink sell/.test(x.cls)&&/0\)$|transparent/.test(x.bg))&&!k.all,k.sells);}
  await g.page.setViewportSize({width:390,height:844});
  const t1=await g.js(()=>{var b=document.querySelector('#c-staff button[data-act="line-sell"]');b.click();return [document.querySelector('#c-staff button[data-act="line-sell"]').innerText,G.emp.packLines.hall];});
  M.check('first tap: red "Tap again, AED …", nothing sold (Pass 295)',/^Tap again, AED [0-9.,]+[kM]?$/.test(t1[0])&&t1[1]===1,t1);
  await g.page.waitForTimeout(3300);const t2=await g.js(()=>document.querySelector('#c-staff button[data-act="line-sell"]').innerText);M.check('after 3 s it says Sell again (Pass 295)',t2==='Sell',t2);
  const t3=await g.js(()=>{var b=()=>document.querySelector('#c-staff button[data-act="line-sell"]');b().click();b().click();return [G.emp.packLines.hall,G.emp.staff.lines];});M.check('two taps sell one hall, nothing else (Pass 295)',t3[0]===0&&t3[1]===6,t3);
 }else M.skip('sell one','no million owners snapshot');}
 // Pass 295 (Puti): the first mall store closes the small shops, one line, no Earlier shops fold
 {const m=M.snap('strong','first farm')||M.snap('avg','first farm');if(m){await g.load(m,{wait:60});const r=await g.js(()=>{G.money=1e8;G.kits.sold=Math.max(G.kits.sold,2000);G.emp.stores={};G.emp.closed={};G.emp.shopsGone=0;G.emp.shops={stall:3,pet:3,bout:1};G.emp.leases=[];if(!buyStores(G,"auh",1))return null;cache={};render();return {log:G.log.slice(-3).map(x=>x.t).join(' | '),shops:$('c-shops').innerText};});
   if(!r)M.skip('mall store','buyStores refused');else{M.check('one line: "The first mall store opened. Your 3 weekend market stalls, 3 pet shop corners and 1 shrimp boutique closed, AED x back." (Pass 295)',/The first mall store opened\. Your 3 weekend market stalls, 3 pet shop corners and 1 shrimp boutique closed, AED [0-9,]+ back\./.test(r.log),r.log);M.check('no Earlier shops fold (Pass 295)',!/Earlier shops/.test(r.shops),r.shops.slice(0,200));}}}
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('kits');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
