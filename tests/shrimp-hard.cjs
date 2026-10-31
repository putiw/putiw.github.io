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
 await p.waitForTimeout(400);
 const g0=await p.evaluate(()=>{var c=document.getElementById('hg-cv'),r=c.getBoundingClientRect(),x=c.getContext('2d').getImageData(0,0,c.width,c.height).data,on=0;for(var i=3;i<x.length;i+=4)if(x[i])on++;return {w:r.width,h:r.height,on:on,key:HGK};});
 if(g0.h<120||g0.h>320||g0.on<1000)throw Error('grid not drawn: '+JSON.stringify(g0));ok('grid drawn, '+Math.round(g0.w)+'x'+Math.round(g0.h)+' px');
 // legend tap: select the first group; the card keeps its height and nothing scrolls
 await p.evaluate(()=>{var c=document.getElementById('hard-card');window.scrollTo(0,c.getBoundingClientRect().top+scrollY-60);});await p.waitForTimeout(200);
 const before=await p.evaluate(()=>({y:scrollY,h:document.getElementById('hard-card').offsetHeight}));
 await p.click('#hg-key [data-g="hot"]');await p.waitForTimeout(300);
 const after=await p.evaluate(()=>({y:scrollY,h:document.getElementById('hard-card').offsetHeight,lab:document.querySelector('#hard-body .hard-now .scope-label').textContent}));
 if(!/Too hot/.test(after.lab))throw Error('legend tap did not select: '+after.lab);if(Math.abs(after.y-before.y)>1||Math.abs(after.h-before.h)>1)throw Error('legend tap moved the page '+JSON.stringify([before,after]));ok('legend tap selects a group, page still');
 // tap on the water block in the grid
 const pt=await p.evaluate(()=>{var q=HGR.find(r=>r.id==='water'),c=document.getElementById('hg-cv').getBoundingClientRect();return q?{x:c.left+(q.x0+q.x1)/2,y:c.top+(q.y0+q.y1)/2}:null;});
 await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(300);
 const lab2=await p.evaluate(()=>document.querySelector('#hard-body .hard-now .scope-label').textContent);if(!/No water/.test(lab2))throw Error('block tap did not select: '+lab2);ok('tapping a block selects it');
 // a group not reached in the walk can't be picked from the grid
 const far=await p.evaluate(()=>{var q=HGR.find(r=>r.id==='no');if(!q)return 'none';var c=document.getElementById('hg-cv').getBoundingClientRect();return hgHit({clientX:c.left+q.x0+1,clientY:c.top+q.y0+1});});
 if(far!==null)throw Error('unseen group picked: '+far);ok('unseen groups are grey and not tappable');
 // fund an option: its squares show as on the way, then fill as days pass
 const k0=await p.evaluate(()=>{G.money=1e15;HARD_SEL='war';var H=hardOf(G);delete H.picks.war;render();return HGK;});await p.waitForTimeout(800);
 await p.click('#hard-body [data-act="hard-buy"][data-o="out"]');await p.waitForTimeout(300);
 const fund=await p.evaluate(k0=>{var B=hgBlocks(G).find(b=>b.id==='war');return {k0:k0,k1:HGK,way:B.way,after:!document.getElementById('after').hidden};},k0);
 if(typeof fund==='string'||fund.k0===fund.k1||!(fund.way>1e8)||fund.after)throw Error('funding did not outline: '+JSON.stringify(fund));ok('funding outlines the squares it will reach, no popup');
 // Nour's jar
 const jar=await p.evaluate(()=>({hid:document.getElementById('nour-jar').hidden,cap:document.getElementById('nour-cap').textContent,h:document.getElementById('nour-cv').getBoundingClientRect().height}));
 if(jar.hid||!/Nour’s jar · \d+ shrimp/.test(jar.cap)||jar.h<100)throw Error('jar '+JSON.stringify(jar));ok('Nour’s jar: '+jar.cap);
 // after the win: grid and ledger stay, read-only
 const won=await p.evaluate(()=>{G.emp.won=Math.floor(G.day);render();return {hid:document.getElementById('hard-card').hidden,grid:document.getElementById('hg-cv').offsetHeight,dis:document.getElementById('hard-give').disabled,body:document.getElementById('hard-body').textContent.length,jar:document.getElementById('nour-jar').hidden};});
 if(won.hid||won.grid<100||!won.dis||won.body||!won.jar)throw Error('after the win '+JSON.stringify(won));ok('after the win the grid and a read-only ledger stay');
 if(errs.length)throw Error('page errors: '+errs.join(' | '));ok('no page errors');
 await b.close();console.log(n+' hard part checks passed ('+key+')');})().catch(e=>{console.error(e);process.exit(1);});
