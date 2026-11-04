// The hard part as things you watch (Pass 183), in headless Chromium at 390 px.
// Needs a bot run json with a snapshot inside the hard part: HARD_RUN (or ACADEMY_RUN), HARD_STAGE (default the first
// snapshot with the hard part open). Make one with REVIEW_OUTPUT=<dir> node tests/shrimp-average-playthrough.cjs.
// Checks: the grid draws at a fixed size, a legend tap or a tap on a block selects that group without moving the page,
// funding an option outlines its squares, Nour's jar shows with her count, after the win the grid and ledger stay read-only.
const {chromium}=require('playwright');const fs=require('fs'),os=require('os');
const RUN=process.env.HARD_RUN||process.env.ACADEMY_RUN||os.tmpdir()+'/shrimp-average/run-7.json';
const snaps=JSON.parse(fs.readFileSync(RUN,'utf8')).snapshots;
const key=process.env.HARD_STAGE||Object.keys(snaps).find(k=>snaps[k].emp&&snaps[k].emp.hard&&snaps[k].emp.hard.open&&!snaps[k].emp.won);
if(!key)throw Error('No snapshot with the hard part open in '+RUN);
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');let n=0;const ok=m=>{n++;console.log('PASS',m);};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.dismiss());
 await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(300);
 await p.evaluate(s=>{G=s;migrate(G);G.progress.queue=[];window.spotlight=function(){};speed=0;var H=hardOf(G);H.goalOk=1;H.at=3;HARD_SEL=null;ensureProgress(G).seen.nour1=1;nourOf(G);selectTab('world');render();},snaps[key]);
 if(await p.evaluate(()=>document.getElementById('hard-card').classList.contains('shut')))await p.click('#hard-card>.hd');
 await p.waitForTimeout(900);
 const g0=await p.evaluate(()=>{var c=document.getElementById('hg-cv'),r=c.getBoundingClientRect(),x=c.getContext('2d').getImageData(0,0,c.width,c.height).data,on=0;for(var i=3;i<x.length;i+=4)if(x[i])on++;return {w:r.width,h:r.height,on:on,key:HGK};});
 if(g0.h<120||g0.h>480||g0.on<1000)throw Error('grid not drawn: '+JSON.stringify(g0));ok('grid drawn, '+Math.round(g0.w)+'x'+Math.round(g0.h)+' px');
 // legend tap: select the first group; the card keeps its height and nothing scrolls
 await p.evaluate(()=>{var c=document.getElementById('hg-lab');window.scrollTo(0,c.getBoundingClientRect().top+scrollY-120);});await p.waitForTimeout(200);/* Pass 251: the panel above the grid is taller, scroll the legend into view (Playwright scrolls a covered target by itself) */
 const before=await p.evaluate(()=>({y:scrollY,h:document.getElementById('hard-card').offsetHeight,k:[...document.getElementById('hard-card').children].map(x=>x.offsetHeight).join(',')}));
 const tap0=await p.evaluate(()=>({next:!!document.querySelector('[data-act="hard-next"]'),txt:document.querySelector('#hard-body .hard-step').textContent}));if(tap0.next||!/Tap a group/.test(tap0.txt))throw Error('no step order, nothing picked at first: '+JSON.stringify(tap0));ok('no Next, Tap a group at first (Pass 190)');
 await p.click('#hg-lab [data-g="hot"]');await p.waitForTimeout(300);
 const after=await p.evaluate(()=>({y:scrollY,h:document.getElementById('hard-card').offsetHeight,k:[...document.getElementById('hard-card').children].map(x=>x.offsetHeight).join(','),lab:document.querySelector('#hard-body .hard-now .scope-label').textContent}));
 if(!/Too hot/.test(after.lab))throw Error('legend tap did not select: '+after.lab);if(Math.abs(after.y-before.y)>1)throw Error('legend tap scrolled the page '+JSON.stringify([before,after]));ok('legend tap selects a group, no scroll (Pass 229: no empty slot before the first pick, so the card grows once)');
 // tap on the water block in the grid
 const pt=await p.evaluate(()=>{var q=HGR.find(r=>r.id==='water'),c=document.getElementById('hg-cv').getBoundingClientRect();return q?{x:c.left+(q.x0+q.x1)/2,y:c.top+(q.y0+q.y1)/2}:null;});
 await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(300);
 const lab2=await p.evaluate(()=>document.querySelector('#hard-body .hard-now .scope-label').textContent),h2=await p.evaluate(()=>document.getElementById('hard-card').offsetHeight);if(!/No water/.test(lab2))throw Error('block tap did not select: '+lab2);if(Math.abs(h2-after.h)>1)throw Error('switching groups changed the card height '+after.h+' '+h2);ok('tapping a block selects it, switching groups keeps the height');
 // before a goal is picked the groups are grey and can't be picked; goal buttons: none filled, the current one has a check
 const pre=await p.evaluate(()=>{var H=hardOf(G);H.goalOk=0;HARD_SEL=null;HGK='';render();var cv=document.getElementById('hg-cv');
  var r={grid:cv.getClientRects().length,prim:document.querySelectorAll('#hard-body [data-act^="hard-"].primary').length,check:[...document.querySelectorAll('#hard-body button')].filter(b=>/\u2713/.test(b.textContent)).length};H.goalOk=1;HGK='';render();return r;});
 if(pre.grid||pre.prim||pre.check!==1)throw Error('before the goal '+JSON.stringify(pre));ok('before the goal: only the goal pick shows (Pass 198), no goal button filled, one check mark');
 // Change goal goes back to the pick, Keep this returns to the grid
 await p.click('#hard-top [data-act="hard-re"]');await p.waitForTimeout(700);
 const reA=await p.evaluate(()=>document.getElementById('hg-cv').getClientRects().length);
 await p.click('#hard-body [data-act="hard-keep"]');await p.waitForTimeout(300);
 const reB=await p.evaluate(()=>document.getElementById('hg-cv').getClientRects().length);
 if(reA||!reB)throw Error('change goal: '+JSON.stringify([reA,reB]));ok('Change goal opens the pick, Keep this goes back');
 // fund an option: its squares show as on the way, then fill as days pass
 const k0=await p.evaluate(()=>{G.money=1e15;HARD_SEL='war';var H=hardOf(G);delete H.picks.war;render();return HGK;});await p.waitForTimeout(800);
 await p.click('#hard-body [data-act="hard-buy"][data-o="out"]');await p.waitForTimeout(300);
 const fund=await p.evaluate(k0=>{var B=hgBlocks(G).find(b=>b.id==='war');return {k0:k0,k1:HGK,way:B.way,after:!document.getElementById('after').hidden};},k0);
 if(typeof fund==='string'||fund.k0===fund.k1||!(fund.way>1e8)||fund.after)throw Error('funding did not outline: '+JSON.stringify(fund));ok('funding outlines the squares it will reach, no popup');
 // Nour's jar
 const jar=await p.evaluate(()=>({hid:document.getElementById('nour-jar').hidden,cap:document.getElementById('nour-cap').textContent,h:document.getElementById('nour-cv').getBoundingClientRect().height}));
 if(jar.hid||!/^\d+ shrimp/.test(jar.cap)||jar.h<80||jar.h>120)throw Error('jar '+JSON.stringify(jar));ok('Milo’s jar: '+jar.cap);
 // Pass 184: a one-option group leaves no big gap, and every legend name is readable at 360 px
 for(const w of [360,390]){const q=await b.newPage({viewport:{width:w,height:844}});await q.setContent('<body>'+html+'</body>');await q.waitForTimeout(300);
  const r=await q.evaluate(s=>{G=s;migrate(G);G.progress.queue=[];window.spotlight=function(){};speed=0;var H=hardOf(G);H.goalOk=1;H.at=HARD.length-1;HARD_SEL='never';ensureProgress(G).seen.nour1=1;nourOf(G);selectTab('world');render();
   var c=document.getElementById('hard-card');if(c.classList.contains('shut'))c.querySelector('.hd').click();render();
   var st=document.querySelector('.hard-step'),rows=st.querySelectorAll('.item');return {gap:st.getBoundingClientRect().bottom-rows[rows.length-1].getBoundingClientRect().bottom,
    cut:[...document.querySelectorAll('.hg-k span')].filter(x=>x.scrollHeight>x.clientHeight+1||x.scrollWidth>x.clientWidth+1).map(x=>x.textContent)};},snaps[key]);
  if(r.gap>160||r.cut.length)throw Error(w+' px: gap under a one-option group '+Math.round(r.gap)+', cut legend names '+r.cut);ok(w+' px: gap under a one-option group '+Math.round(r.gap)+' px, legend names readable');await q.close();}
 // Pass 250: the allocation panel keeps the card height, a slider move scrolls nothing, the Musk line is in the ledger ?, the key has "for now"
 const al0=await p.evaluate(()=>{var c=document.getElementById('hard-card');window.scrollTo(0,c.getBoundingClientRect().top+scrollY-20);return {y:scrollY,h:c.offsetHeight,al:document.getElementById('hard-al').offsetHeight,n:document.querySelectorAll('#hard-al input[type=range]').length};});
 await p.evaluate(()=>{var sl=document.querySelector('#hard-al input[data-al="sci"]');sl.value=30;sl.dispatchEvent(new Event('input',{bubbles:true}));});await p.waitForTimeout(400);
 const al1=await p.evaluate(()=>({y:scrollY,h:document.getElementById('hard-card').offsetHeight,al:document.getElementById('hard-al').offsetHeight,alloc:hardAllocOf(hardOf(G)).sci,keep:document.querySelector('#hard-al .al-keep').textContent}));
 if(al0.n!==2||al1.alloc!==.3||Math.abs(al1.y-al0.y)>1||al1.h!==al0.h||al1.al!==al0.al||!/Keep 70%/.test(al1.keep))throw Error('allocation panel '+JSON.stringify([al0,al1]));ok('two route sliders (Pass 251), a move keeps the card height and scrolls nothing, Keep 70%');
 await p.evaluate(()=>{var sl=document.querySelector('#hard-al input[data-al="aid"]');sl.value=90;sl.dispatchEvent(new Event('input',{bubbles:true}));});await p.waitForTimeout(400);
 const al2=await p.evaluate(()=>({aid:hardAllocOf(hardOf(G)).aid,v:document.querySelector('#hard-al input[data-al="aid"]').value,keep:document.querySelector('#hard-al .al-keep').textContent}));
 if(al2.aid!==.7||al2.v!=='70'||!/Keep 0%/.test(al2.keep))throw Error('sum capped at 100%: '+JSON.stringify(al2));ok('the shares cap at 100%, the slider snaps back');
 // Pass 251: proposals. Three fixed rows, Fund keeps the panel's height and scrolls nothing, the Running list shows the funded one, Stop works
 const pr0=await p.evaluate(()=>{var R=propOf(hardOf(G));R.open=[];propArrive(G,hardOf(G),Math.floor(G.day));G.money=Math.max(G.money,1e13);render();var rows=[...document.querySelectorAll('#hard-al .pr-row')].filter(x=>!x.querySelector('[data-act="tree-step"]'));/* Pass 255: tree letters sit in the same list */var b=document.querySelector('#hard-al .pr-row button[data-act="prop-fund"]');return {rows:rows.length,open:propOf(hardOf(G)).open.length,hs:[...rows].map(x=>x.offsetHeight),y:scrollY,h:document.getElementById('hard-card').offsetHeight,al:document.getElementById('hard-al').offsetHeight,dis:b&&b.disabled,id:b&&b.dataset.id,help:document.querySelector('#hard-al .pr-row .qhelp').dataset.ht};});
 if(pr0.rows<1||pr0.rows>3||pr0.rows!==Math.max(1,pr0.open)||Math.max(...pr0.hs)-Math.min(...pr0.hs)>1||pr0.dis||!/a person|years|income|to build/.test(pr0.help))throw Error('proposal rows '+JSON.stringify(pr0));ok('one proposal row per letter, one height, the help has the cost');
 await p.evaluate(()=>{document.querySelector('#hard-al .pr-row button[data-act="prop-fund"]').click();});await p.waitForTimeout(400);
 const pr1=await p.evaluate(()=>({y:scrollY,h:document.getElementById('hard-card').offsetHeight,al:document.getElementById('hard-al').offsetHeight,run:Object.keys(propOf(hardOf(G)).run),lab:document.querySelector('#hard-al .pr-row button[data-act="prop-fund"]').textContent}));
 if(Math.abs(pr1.y-pr0.y)>1||pr1.h!==pr0.h||pr1.al!==pr0.al||pr1.run.indexOf(pr0.id)<0||pr1.lab!=='Funded')throw Error('fund '+JSON.stringify([pr0,pr1]));ok('Fund keeps the card height and scrolls nothing, the row reads Funded until a scroll');
 await p.evaluate(()=>{FRZ={};render();});const pr2=await p.evaluate(()=>{var r=[...document.querySelectorAll('#hard-al .pr-run')].filter(x=>x.querySelector('button[data-act="prop-stop"]'))[0];return {run:!!r,t:r&&r.textContent,stop:!!(r&&r.querySelector('button[data-act="prop-stop"]'))};});
 if(!pr2.run||!/people|paid|done/.test(pr2.t))throw Error('running list '+JSON.stringify(pr2));ok('the Running list has the funded one with its state');
 // Pass 253: trees as Running rows, Shaping the world inside the card
 const tr0=await p.evaluate(()=>{G.emp.trees=G.emp.trees||{};G.emp.trees.rewild=1;G.emp.trees.lastmile=1;G.money=Math.max(G.money,1e13);G.emp.inf=Math.max(G.emp.inf,1e12);FRZ={};render();
  var rows=[...document.querySelectorAll('#hard-al .pr-row')].filter(x=>x.querySelector('button[data-act="tree-step"]'));var tc=document.getElementById('treecard');
  return {n:rows.length,t:rows.map(x=>x.textContent),cardHidden:tc.hidden||!tc.innerHTML.match(/Rewilding|The last mile/),y:scrollY,h:document.getElementById('hard-card').offsetHeight,
   desk:!document.getElementById('hard-desk').hidden,deskIn:!!document.querySelector('#hard-desk-in #e-proj'),cproj:document.getElementById('c-proj').hidden};});
 if(tr0.n<2||!tr0.cardHidden||!tr0.desk||!tr0.deskIn||!tr0.cproj)throw Error('trees in the hard part '+JSON.stringify(tr0));ok('Rewilding and The last mile write letters (Pass 255), their cards are gone, Shaping the world sits in the card');
 await p.evaluate(()=>{[...document.querySelectorAll('#hard-al button[data-act="tree-step"]')][0].click();});await p.waitForTimeout(400);
 const tr1=await p.evaluate(()=>({y:scrollY,h:document.getElementById('hard-card').offsetHeight,done:[...document.querySelectorAll('#hard-al .pr-row .qhelp, #hard-al .pr-run .qhelp')].map(x=>x.dataset.ht).join('|')}));
 if(Math.abs(tr1.y-tr0.y)>1||Math.abs(tr1.h-tr0.h)>1||!/Done: /.test(tr1.done||''))throw Error('tree step '+JSON.stringify([tr0,tr1]));ok('a tree step keeps the card height and scrolls nothing, the step goes to Done');
 const led=await p.evaluate(()=>({t:document.querySelector('#hard-led .led-t').textContent,h:document.querySelector('#hard-led .qhelp').dataset.ht,key:document.getElementById('hg-key').textContent,slider:!!document.querySelector('#hard-led input')}));
 if(!/Elon Musk/.test(led.t)||!/0\.1% of his net worth/.test(led.h)||!/thousand lives/.test(led.h)||!/for now/.test(led.key)||led.slider)throw Error('ledger '+JSON.stringify(led));ok('the ledger reads in the richest person’s fortune, lives capped at what GiveWell can place, the key has "for now", the give slider lives in the panel');
 // after the win: grid and ledger stay, read-only
 const won=await p.evaluate(()=>{G.emp.won=Math.floor(G.day);render();return {hid:document.getElementById('hard-card').hidden,grid:document.getElementById('hg-cv').offsetHeight,dis:document.getElementById('hard-give').disabled,body:document.getElementById('hard-body').textContent.length,jar:document.getElementById('nour-jar').hidden};});
 if(won.hid||won.grid<100||!won.dis||won.body||!won.jar)throw Error('after the win '+JSON.stringify(won));ok('after the win the grid, the panel and a read-only ledger stay');
 if(errs.length)throw Error('page errors: '+errs.join(' | '));ok('no page errors');
 await b.close();console.log(n+' hard part checks passed ('+key+')');})().catch(e=>{console.error(e);process.exit(1);});
