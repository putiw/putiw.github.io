// Tight and aligned (UI/UX chat 1, 6 Nov). Every tab at seven stages, 360 and 390 px:
//  gap   a vertical gap over 20 px between two visible neighbours inside a card (or under a card's last child)
//  btncut a row button cut with ... (the price is hidden)
//  cut   an .item.ih description cut off (scrollHeight > clientHeight), prints the text
//  empty a card with a title and nothing visible under it (when not collapsed)
//  align row buttons in one card whose right edges don't line up
//  wrap  a slider value or chip label on two lines
// TIGHT_RUN=<dir>/run-7.json [TIGHT_W=360,390] [ST="first sale,win"] [TIGHT_TABS=tank,me] node tests/shrimp-tight.cjs   (exit 1 on any finding)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const RJ=JSON.parse(fs.readFileSync(process.env.TIGHT_RUN||process.env.ACADEMY_RUN,'utf8')),snaps=RJ.snapshots;
// Pass 289: TIGHT_MOMENTS=<regex> adds the run's MOMENTS (tests/lib/moments.cjs), card moments left out (the card covers the
// page), each on its own tab only (tabMap of the moment's tab); TIGHT_MRUNS=<run json,...> adds other runs' moments.
const MRE=process.env.TIGHT_MOMENTS?new RegExp(process.env.TIGHT_MOMENTS):null,MTAB={},MST=[];
if(MRE){const add=(rj,tag)=>{for(const [k,v] of Object.entries(rj.moments||{})){if(!v||!v.snap||v.kind==='card'||!v.tab||!MRE.test(k))continue;const nm='moment '+tag+k;snaps[nm]=v.snap;MTAB[nm]=v.tab;MST.push(nm);}};add(RJ,'');
 for(const f of (process.env.TIGHT_MRUNS||'').split(',').filter(Boolean))add(JSON.parse(fs.readFileSync(f,'utf8')),path.basename(path.dirname(f))+' ');}
const Ws=(process.env.TIGHT_W||'360,390').split(',').map(Number);
const stages=(process.env.ST||'first shrimp,first sale,kits unlocked,first farm,10k owners,100k kits,million owners,win').split(',').concat(MST);
const only=process.env.TIGHT_TABS?process.env.TIGHT_TABS.split(','):null;
const GAP=20;
const SCAN=`(function(GAP){var out=[];function vis(e){if(!e.getClientRects().length)return false;var cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.position==='fixed'||cs.position==='absolute')return false;var r=e.getBoundingClientRect();return r.height>0.5&&r.width>0.5;}
 function nm(e){return (e.id?'#'+e.id:e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\\s+/).join('.'):''))+' "'+(e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,40)+'"';}
 var cards=[].slice.call(document.querySelectorAll('main .card,main details.card')).filter(function(c){return vis(c)&&!c.parentElement.closest('.card');});
 cards.forEach(function(c){var cid=c.id||c.className;var collapsed=c.tagName==='DETAILS'?!c.open:c.classList.contains('collapsed')||c.classList.contains('shut');
  if(collapsed)return;
  // gaps between visible siblings
  c.querySelectorAll('*').forEach(function(e){if(!vis(e)||e.closest('svg'))return;var cs=getComputedStyle(e);if(cs.display==='inline'||cs.display==='contents')return;var n=e.nextElementSibling;while(n&&!vis(n))n=n.nextElementSibling;if(!n)return;
    var a=e.getBoundingClientRect(),b=n.getBoundingClientRect();if(b.left>=a.right-1||a.left>=b.right-1)return;var mb=a.bottom,pv=e.previousElementSibling;while(pv){if(vis(pv)){var pr=pv.getBoundingClientRect();if(!(b.left>=pr.right-1||pr.left>=b.right-1))mb=Math.max(mb,pr.bottom);}pv=pv.previousElementSibling;}var g=b.top-mb;/* the lowest earlier sibling above it, so a short button beside tall text is not a gap */if(g>GAP)out.push(['gap',cid,Math.round(g)+' px between '+nm(e)+' and '+nm(n)]);});
  var kids=[].slice.call(c.children).filter(vis);if(kids.length){var last=kids[kids.length-1],cb=c.getBoundingClientRect(),lb=last.getBoundingClientRect(),pb=parseFloat(getComputedStyle(c).paddingBottom)||0;var g2=cb.bottom-pb-lb.bottom;if(g2>GAP)out.push(['gap',cid,Math.round(g2)+' px under last child '+nm(last)]);}
  // empty card
  var hd=c.querySelector(':scope>.hd,:scope>summary,:scope>h2');if(hd){var body=kids.filter(function(k){return k!==hd&&!k.matches('.hd,summary,h2,.qhelp');});if(!body.length)out.push(['empty',cid,'title only: '+nm(hd)]);}
  // cut descriptions
  c.querySelectorAll('.srow .btn,.item>.btn').forEach(function(b){if(vis(b)&&b.closest('.card')===c&&getComputedStyle(b).textOverflow==='ellipsis'&&b.scrollWidth>b.clientWidth+1)out.push(['btncut',cid,(b.textContent||'').trim().slice(0,60)]);});/* Chat 3: a button whose label ends in ... hides its price */
  c.querySelectorAll('.item.ih>div:first-child>p').forEach(function(p){if(vis(p)&&p.scrollHeight>p.clientHeight+2)out.push(['cut',cid,(p.textContent||'').trim().slice(0,140)]);});
  // right edges of row buttons
  var rs={};c.querySelectorAll('.item:not(.fork)>.btn:not(.fopt),.item:not(.fork)>.hb').forEach(function(b){if(!vis(b))return;if(b.closest('.card')!==c)return;var r=Math.round(b.getBoundingClientRect().right);rs[r]=(rs[r]||0)+1;});var ks=Object.keys(rs).map(Number).sort(function(x,y){return x-y;});if(ks.length>1&&ks[ks.length-1]-ks[0]>2)out.push(['align',cid,'row button right edges '+ks.join(', ')]);
  // wrapping values and chips
  c.querySelectorAll('.ctl .v,.btn.chip,.seg .btn,.fw-b b').forEach(function(v){if(!vis(v)||v.querySelector('small,br,.c2'))return;/* a label over a price is two lines on purpose */var rg=document.createRange();rg.selectNodeContents(v);var tops=[...rg.getClientRects()].filter(function(r){return r.width>0;}).map(function(r){return Math.round(r.top);}),lines=new Set(tops).size;/* UI/UX chat 2: count text lines, not the button's min-height */if(lines>1||v.scrollWidth>v.clientWidth+1)out.push(['wrap',cid,nm(v)]);});
 });
 return out;})`;
(async()=>{const b=await chromium.launch();let all=[];
 for(const W of Ws)for(const sk of stages){if(!snaps[sk])continue;const p=await b.newPage({viewport:{width:W,height:844}});p.on('dialog',d=>d.dismiss());p.on('pageerror',e=>all.push(['error',sk,W,'',e.message]));
  await p.goto('file://'+path.resolve(__dirname,'../shrimp/index.html'));await p.waitForTimeout(300);
  await p.evaluate(s=>{G=s;migrate(G);G.progress.queue=[];window.spotlight=function(){};window.spotWatch=function(){};try{setSpeed(0)}catch(e){};render();},snaps[sk]);
  let tabs=await p.evaluate(()=>[...document.querySelectorAll('.tabs [data-tab]')].filter(t=>!t.hidden&&t.offsetParent).map(t=>t.dataset.tab).concat(['me']));
  if(only)tabs=tabs.filter(t=>only.includes(t));
  if(MTAB[sk]){const mt=await p.evaluate(a=>{var f=typeof tabMap==='function'?tabMap:function(x){return x;};return a.map(f);},[MTAB[sk]].concat(tabs));tabs=tabs.filter((t,i)=>mt[i+1]===mt[0]);}
  for(const id of tabs){await p.evaluate(t=>{try{if(t==='me')selectTab('me');else document.querySelector('.tabs [data-tab="'+t+'"]').click();}catch(e){}render();},id);await p.waitForTimeout(120);
   const f=await p.evaluate(SCAN+'('+GAP+')');f.forEach(x=>all.push([x[0],sk,W,id,x[1]+': '+x[2]]));}
  await p.close();}
 await b.close();
 // one line per distinct finding, with where it shows
 const m={};all.forEach(([k,sk,W,t,msg])=>{const key=k+' '+t+' '+msg;(m[key]=m[key]||[]).push(sk+'@'+W);});
 // Known and handed to UI/UX Chat 2 (Kits card and the hard part move there). Remove a line once it's fixed.
 const KNOWN=[];/* UI/UX chat 2 fixed the two Chat 1 left */
 const keys=Object.keys(m).sort(),bad=keys.filter(k=>!KNOWN.some(r=>r.test(k)));keys.forEach(k=>console.log((bad.includes(k)?'':'known: ')+k+'  ['+[...new Set(m[k])].slice(0,4).join(', ')+(m[k].length>4?' …':'')+']'));
 console.log(bad.length+' findings'+(keys.length>bad.length?', '+(keys.length-bad.length)+' known':''));process.exit(bad.length?1:0);})();
