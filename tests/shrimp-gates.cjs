// Pass 289: enabled means it works, in the sim (claude/shrimp-handoff-tests-step3-7nov.md item 3). Fast tier, no browser.
// For every bot snapshot and moment (one save per game week of each run) in tests/.runs (or GATE_RUNS, a comma list of run jsons): every project projAvail shows
// and every desk offer deskCan allows must buy on a copy of the save, buyProj / deskRun returning true. Twice: as saved
// (where the player can afford it and nothing is frozen), and with the cash and ✦ topped up (the gate half alone, what
// tapnow tests in the browser). The gala goes through buyProj(G,'gala',cause) before the ministry, like galaHTML.
// No runs yet (a fresh clone): prints a note and passes; node tests/run.cjs feature builds them.
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..'),html=fs.readFileSync(path.join(ROOT,'shrimp/index.html'),'utf8');
const RUNS=(process.env.GATE_RUNS?process.env.GATE_RUNS.split(','):['strong','kind','avg'].map(b=>path.join(__dirname,'.runs',b,'run-7.json'))).filter(f=>fs.existsSync(f));
if(!RUNS.length){console.log('note: no bot runs in tests/.runs, nothing to check (node tests/run.cjs feature builds them)');console.log('0 gate checks');process.exit(0);}
let seed=7;const M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const c=vm.createContext({Math:M,console});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext(`function gateMig(s){var G=JSON.parse(s);migrate(G);return JSON.stringify(G);}
function gateCheck(s,top){var G=JSON.parse(s),out=[],n=0;/* s is migrated once (gateMig) */
 function cp(){var g=JSON.parse(s);if(top){g.money=1e12;g.emp.inf=1e9;}return g;}
 if(top){G.money=1e12;G.emp.inf=1e9;}
 if(frozen(G))return {n:0,out:out};
 /* one shared copy, buys one after another; a refusal is tried again on a fresh copy before it counts (a fork sibling or the
    cash spent by the one before can refuse on the shared copy) */
 var sh=null;function try1(f){if(!sh)sh=cp();if(f(sh))return true;sh=null;return f(cp());}
 projAvail(G).forEach(function(p){var cm=pm(G,p);if(!top&&((cm>0&&G.money<cm+capitalReserve(G))||G.emp.inf<pi(G,p)))return;n++;
  if(!try1(function(g){return buyProj(g,p.id);}))out.push('proj '+p.id);});
 /* the gala is not in PROJ: before the ministry it is offered in Marketing (galaHTML) when it can be paid */
 if(!pd(G,'ministry')&&mktOpen(G)&&G.money>=galaCost(G)+capitalReserve(G)){n++;var gk=Object.keys(GALA_FOR)[0];if(!buyProj(cp(),'gala',gk))out.push('gala '+gk);}
 var o=G.emp.op;if(pd(G,'ministry')&&o&&!o.run&&o.offer)o.offer.forEach(function(id){if(!deskCan(G,id))return;n++;if(!deskRun(cp(),id))out.push('desk '+id);});
 return {n:n,out:out};}`,c);
const bad={};let n=0,saves=0;const t0=Date.now();
for(const f of RUNS){const run=JSON.parse(fs.readFileSync(f,'utf8')),name=path.basename(path.dirname(f));
 const all=Object.entries(run.snapshots||{}).map(([k,v])=>[k,v]).concat(Object.entries(run.moments||{}).filter(([k,v])=>v&&v.snap).map(([k,v])=>['moment '+k,v.snap]));
 const days=new Set();for(const [st,snap] of all){const dk=Math.floor(snap.day/7);if(days.has(dk))continue;days.add(dk);/* one save a game week per run is plenty for gates */const s=c.gateMig(JSON.stringify(snap));saves++;
  for(const top of [0,1]){let r;try{r=c.gateCheck(s,top);}catch(e){(bad['error '+e.message]=bad['error '+e.message]||[]).push(name+' '+st);continue;}n+=r.n;
   r.out.forEach(x=>{const k=x+(top?' (cash topped up)':' (as saved)');(bad[k]=bad[k]||[]).push(name+' '+st);});}}}
const keys=Object.keys(bad);
if(keys.length){console.error('FAIL '+keys.length+' enabled things that don\'t buy ('+n+' checks on '+saves+' saves):\n  '+keys.map(k=>k+': '+bad[k].length+'x, first '+bad[k][0]).join('\n  '));process.exit(1);}
console.log(n+' gate checks on '+saves+' saves passed, buyProj and deskRun agree with projAvail and deskCan ('+((Date.now()-t0)/1000).toFixed(1)+' s)');
