// Pass 290 moment tests, hard part: descriptions that tight found cut. The four goal lines (hard open / hard goal) and the proposal
// rows ("AED 137B to build, 2% of income for 15 years, pays back") fit at 360 and 390, the full text behind the dotted title.
const M=require('../lib/moment.cjs');
(async()=>{const g=await M.open({w:390});
 /* a save loaded into a page that already had one can come up with the card shut (G.opt.shut); open it like the player, tap the header */
 const openHard=async()=>{if(await g.js(()=>$('hard-card').classList.contains('shut')))await g.tapText('#hard-card>.hd',/./);};
 const rowsFn=s=>[...document.querySelectorAll(s)].filter(x=>x.checkVisibility()).map(it=>{var p=it.querySelector(':scope>div:first-child>p'),q=it.querySelector('.qhelp');return {t:(it.querySelector('h3')||{}).innerText||'',cut:!!p&&p.scrollHeight>p.clientHeight+2,txt:p?p.innerText:'',full:q?(q.dataset.ht||''):''};});
 for(const w of [360,390]){await g.page.setViewportSize({width:w,height:844});
  for(const mk of ['hard open','hard goal']){const m=M.find(mk);if(!m){M.skip(mk,'no moment');continue;}await g.load(m);await g.tab('hard');await openHard();
   const gl=(await g.js(rowsFn,'main .card:not([hidden]) .item.ih')).filter(r=>/^(Every home|Every home that wants one|The spreadsheet|Stop counting)$/.test(r.t.trim()));
   M.check(mk+' '+w+': four goal rows',gl.length===4,gl.map(r=>r.t));for(const r of gl){M.check(mk+' '+w+': goal "'+r.t+'" not cut (Pass 290)',!r.cut,r.txt);M.check(mk+' '+w+': goal "'+r.t+'" full text behind the title',r.full.length>r.txt.length,r.full.slice(0,60));}}
  let np=0;for(const b of ['strong','kind','avg']){const ms=M.moments(b);for(const name of Object.keys(ms)){if(!/^hard /.test(name))continue;await g.load(Object.assign({bot:b,name},ms[name]),{wait:60});if(await g.tab('hard')===false)continue;await openHard();
    const pr=await g.js(()=>[...document.querySelectorAll('main .card:not([hidden]) .pr-row')].filter(x=>x.checkVisibility()).map(it=>{var p=it.querySelector(':scope>div:first-child>p'),q=it.querySelector('.qhelp');return {t:q?q.innerText:'',cut:p.scrollHeight>p.clientHeight+2,txt:p.innerText,full:q?q.dataset.ht:''};}));
    for(const r of pr){np++;M.check(b+' '+name+' '+w+': proposal "'+r.t+'" cost line not cut (Pass 290)',!r.cut,r.txt);if(/ yrs/.test(r.txt))M.check(b+' '+name+': proposal "'+r.t+'" full cost behind the title',/ years/.test(r.full),r.full.slice(0,120));}}}
  if(!np)M.skip('proposal rows '+w,'no hard moment shows a letter');}
 M.check('no page errors',!g.errs.length,g.errs.slice(0,3).join(' | '));
 await g.close();M.done('hard');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
