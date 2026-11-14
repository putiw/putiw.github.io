// Pass 289: moment-test helper. Opens the game in headless Chromium, loads a save from a bot's MOMENTS (or any snapshot),
// migrates and renders it, ticks days, and answers questions about text and rects.
//   const M=require('../lib/moment.cjs');
//   const g=await M.open({w:390});                      // page at 390x844, the game loaded from shrimp/index.html
//   await g.load(M.moment('avg','card health'));         // M.find('card health') takes the first bot that has it; or g.load(snap, {card:true}) / M.snap('strong','first sale')
//   await g.tab('emp'); await g.tick(30);                // tab through tabMap ('me' is the You page), 30 game days (stepGame(G,0), then render)
//   await g.text('#milestone-card'); await g.rect('#x'); await g.rects('main .card'); await g.js(()=>G.day)
//   g.check(name, ok, detail); ... M.done()               // prints FAIL lines, exits 1 on any
// Card moments keep their card: load() keeps G.progress.queue when the moment's kind is 'card' (or {card:true}), so the card
// renders over the page the way the player sees it. Everything else loads with the queue empty and spotlights off.
// Runs come from tests/.runs/<bot>/run-7.json (node tests/run.cjs strong kind avg builds them), or MOMENT_RUNS=<dir>.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const RUNS=process.env.MOMENT_RUNS||path.join(__dirname,'..','.runs');const cache={};
function run(bot){if(!cache[bot]){const f=path.join(RUNS,bot,'run-7.json');if(!fs.existsSync(f))throw Error('no run '+f+' (node tests/run.cjs '+bot+')');cache[bot]=JSON.parse(fs.readFileSync(f,'utf8'));}return cache[bot];}
function moments(bot){return run(bot).moments||{};}
function moment(bot,name){const m=moments(bot)[name];if(!m)return null;return Object.assign({bot,name},m);}
function find(name,bots){for(const b of bots||['strong','avg','kind']){try{const m=moment(b,name);if(m)return m;}catch(e){}}return null;}
function snap(bot,name){const s=run(bot).snapshots[name];return s?{bot,name,kind:'snapshot',snap:s}:null;}
let fails=[],passes=0,skips=[];
function check(name,ok,detail){if(ok)passes++;else fails.push(name+(detail!=null?': '+(typeof detail==='string'?detail:JSON.stringify(detail)):''));return ok;}
function skip(name,why){skips.push(name+' ('+why+')');}
function done(label){if(skips.length)console.log('note: skipped '+skips.join(', '));if(fails.length){console.error('FAIL '+fails.length+' moment checks ('+label+'):\n  '+fails.join('\n  '));process.exit(1);}console.log('PASS '+passes+' '+label+' moment checks');process.exit(0);}
const html=()=>fs.readFileSync(process.env.MOMENT_HTML||path.join(__dirname,'..','..','shrimp','index.html'),'utf8');/* Pass 290: MOMENT_HTML=<an older index.html> to check a moment test fails on the old build */
async function open(o={}){const b=await chromium.launch();const p=await b.newPage({viewport:{width:o.w||390,height:o.h||844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.setContent('<body>'+html()+'</body>');await p.waitForTimeout(300);
 const unspot=()=>p.evaluate(()=>{if(typeof SPOT!=='undefined'&&SPOT){SPOT.ready=1;spotClose();SPOT=null;}var s=$('spot');if(s)s.hidden=true;});
 const g={page:p,errs,
  async load(m,opt={}){if(!m)throw Error('no moment');const keep=opt.card!=null?opt.card:m.kind==='card';
   await p.evaluate(([s,keep,spots])=>{G=JSON.parse(s);migrate(G);cache={};/* Pass 290: render caches by signature, the same save loaded twice left #hard-body empty */if(!keep)G.progress.queue=[];if(!spots)window.spotlight=function(){};speed=0;FRZ={};document.querySelectorAll('[role=dialog]:not(#bg-card):not(#milestone-card)').forEach(function(d){d.hidden=true;});$('after').hidden=true;AFTER_HOLD=null;$('helpsheet').hidden=true;render();},[JSON.stringify(m.snap),keep,!!opt.spots]);
   if(!opt.spots)await unspot();await p.waitForTimeout(opt.wait||200);return g;},
  async tab(t){const ok=await p.evaluate(t=>{if(t==='me'){var mb=$('tb-me');if(!mb||mb.hidden)return false;if(activeTab!=='me')mb.click();return 'me';}var m=typeof tabMap==='function'?tabMap(t):t,b=document.querySelector('.tabs [data-tab="'+m+'"]');if(!b||b.hidden||!b.getClientRects().length)return false;b.click();return m;},t);await p.waitForTimeout(150);await unspot();return ok;},
  async tick(days){await p.evaluate(n=>{for(var i=0;i<n*4;i++){stepGame(G,0);}render();},days);await p.waitForTimeout(100);return g;},
  async play(ms,sp){await p.evaluate(s=>{speed=s;},sp||1);await p.waitForTimeout(ms);await p.evaluate(()=>{speed=0;});return g;},
  js(fn,arg){return p.evaluate(fn,arg);},
  /* Pass 290: play on like the bots (4 steps a day, a card closed as soon as it's up, picks {key:i} answered first) and list the cards:
     k, day shown, storyClock at the card, day it came true (p.seen set), cardReact or not */
  cards(days,picks){return p.evaluate(([n,pk])=>{var out=[],seenAt={},P=G.progress;var rec=function(){Object.keys(P.seen).forEach(function(k){if(P.seen[k]&&seenAt[k]==null)seenAt[k]=Math.floor(G.day);});};
    Object.keys(P.seen).forEach(function(k){if(P.seen[k])seenAt[k]=-1;});(P.queue||[]).forEach(function(k){seenAt[k]=Math.floor(G.day);});
    var ack=function(){while(P.queue.length||typeof mailNext==='function'&&mailNext(G)){var k=P.queue[0];if(pk&&pk[k]!=null)storyChoose(G,k,pk[k]);out.push({k:k,letter:typeof isLetter==='function'&&isLetter(k),day:Math.floor(G.day),clock:storyClock(G),first:seenAt[k],react:typeof cardReact==='function'?cardReact(k):(CARD_NOW.indexOf(k)>=0||SOON_NOW.indexOf(k)>=0)});acknowledgeMilestone(G);rec();}};
    ack();for(var d=0;d<n;d++){for(var q=0;q<4;q++){if(progressionBlocked(G)||typeof mailCount==='function'&&mailCount(G))ack();if(G.emp.won||G.emp.ended)break;stepGame(G);rec();}ack();}return out;},[days,picks||null]);},
  text(sel){return p.evaluate(s=>{var e=document.querySelector(s);return e&&e.checkVisibility()?(e.innerText||'').replace(/\s+/g,' ').trim():null;},sel);},
  rect(sel){return p.evaluate(s=>{var e=document.querySelector(s);if(!e||!e.checkVisibility())return null;var r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom,r:r.right};},sel);},
  rects(sel){return p.evaluate(s=>[...document.querySelectorAll(s)].filter(e=>e.checkVisibility()).map(e=>{var r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom,r:r.right,t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)};}),sel);},
  async tapText(sel,re){const r=await p.evaluate(([s,src])=>{var rx=new RegExp(src),e=[...document.querySelectorAll(s)].filter(x=>x.checkVisibility()&&rx.test(x.innerText||''))[0];if(!e)return null;e.scrollIntoView({block:'center'});var b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2];},[sel,re.source]);if(!r)return false;await p.waitForTimeout(700);/* past TAP_AT and SETTLE */
   const r2=await p.evaluate(([s,src])=>{var rx=new RegExp(src),e=[...document.querySelectorAll(s)].filter(x=>x.checkVisibility()&&rx.test(x.innerText||''))[0];if(!e)return null;var b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2];},[sel,re.source]);if(!r2)return false;await p.mouse.click(r2[0],r2[1]);await p.waitForTimeout(250);return true;},
  close(){return b.close();}};
 return g;}
module.exports={open,run,moments,moment,find,snap,check,skip,done};
