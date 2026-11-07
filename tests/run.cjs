// One runner for every shrimp suite (Pass 287). Quiet on pass, full output on fail, one table at the end.
//   node tests/run.cjs fast       sim suites, about 30 s. After every change.
//   node tests/run.cjs feature    fast + the three bots + every suite that reads their snapshots, about 10 min. Before a push.
//   node tests/run.cjs deploy     feature + spotlights, monkey, human, stable (full), tabshots. Hours. Before "deploy".
//   node tests/run.cjs <name>...  one or more suites by name (the names in SUITES), bots regenerated if stale.
//   --fresh re-runs the bots even if index.html hasn't changed. --list prints the suites and tiers.
//   --jobs=N (or SHRIMP_JOBS) suites at once, default 4 (Pass 289); --jobs=1 is the old one-after-another run.
// Bot runs live in tests/.runs/{strong,kind,avg}/run-7.json (gitignored) and are rebuilt when shrimp/index.html,
// space.html or the bot scripts change (hash in tests/.runs/stamp.json). The table is also written to
// tests/.runs/last.md: paste that into the changelog, don't retype it.
const {spawn}=require('child_process'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const T=__dirname,ROOT=path.join(T,'..'),RUNS=path.join(T,'.runs');
const R={strong:path.join(RUNS,'strong','run-7.json'),kind:path.join(RUNS,'kind','run-7.json'),avg:path.join(RUNS,'avg','run-7.json')};
const WIDE=process.argv.includes('--wide');
const JA=process.argv.find(a=>a.startsWith('--jobs='));const JOBS=Math.max(1,+(JA?JA.slice(7):process.env.SHRIMP_JOBS||4));
// name: [script, env, needs (bot runs), tiers, options]. 'bad' is a regex on the output that means failure when the exit code is 0.
const SUITES={
  balance:['shrimp-balance.cjs',{},[],'fast'],
  academy:['shrimp-academy.cjs',{},[],'fast'],
  me:['shrimp-me.cjs',{},[],'fast'],
  cardtap:['shrimp-cardtap.cjs',{},[],'fast'],
  'space-search':['shrimp-space-search.cjs',{},[],'fast'],
  'tank1-sim':['shrimp-tank1.cjs',{TANK1_SIM_ONLY:'1'},[],'fast'],
  sound:['shrimp-sound.cjs',{},[],'fast'],
  'effects-sim':['shrimp-effects.cjs',{},[],'fast'],
  // Pass 289: enabled means it buys, on every bot save already in tests/.runs (no bot rebuild in fast; a note when there are none)
  gates:['shrimp-gates.cjs',{},[],'fast'],
  // bots (write the snapshots everything below reads)
  strong:['shrimp-playthrough.cjs',{REVIEW_OUTPUT:path.dirname(R.strong)},[],'bot',{bad:/INSOLVENT|STUCK|^(?![\s\S]*\bWIN\b)/,key:/WIN \d+ (\d+)/}],
  kind:['shrimp-playthrough.cjs',{BOT_HEART:'kind',REVIEW_OUTPUT:path.dirname(R.kind)},[],'bot',{bad:/INSOLVENT|STUCK|^(?![\s\S]*\bWIN\b)/,key:/WIN \d+ (\d+)/}],
  avg:['shrimp-average-playthrough.cjs',{REVIEW_OUTPUT:path.dirname(R.avg)},[],'bot',{bad:/INSOLVENT|STUCK/,key:/"earth":(\d+)/}],
  space:['shrimp-space-playthrough.cjs',{ACADEMY_RUN:R.strong},['strong'],'feature'],
  'bot-cards':['shrimp-bot-cards.cjs',{},[],'feature',{bad:/STUCK/}],
  // snapshot suites (browser)
  tight:['shrimp-tight.cjs',{TIGHT_RUN:R.strong,TIGHT_MOMENTS:'^(fork|campaign|film|land|hard|game)',TIGHT_MRUNS:R.avg},['strong','avg'],'feature'],
  layout:['shrimp-layout.cjs',{ACADEMY_RUN:R.strong},['strong'],'feature',{warn:/^(\d+) things overflow/m}],
  projtabs:['shrimp-projtabs.cjs',{HARD_RUN:R.avg},['avg'],'feature'],
  tapnow:['shrimp-tapnow.cjs',{HARD_RUN:R.avg},['avg'],'name'],/* Pass 289: tapall covers Kits and Ads; by name only */
  // Pass 288 sweeps (claude/shrimp-test-workflow-7nov.md 4C.1 and 4C.2)
  cardlag:['shrimp-cardlag.cjs',{CARDLAG_RUNS:[R.strong,R.kind,R.avg].join(',')},['strong','kind','avg'],'feature'],
  greyreason:['shrimp-greyreason.cjs',{GREY_RUNS:[R.strong,R.avg].join(','),GREY_STAGES:'^strong |^avg year',GREY_MOMENTS:'.'},['strong','avg'],'feature'],
  tapall:['shrimp-tapnow.cjs',{HARD_RUN:R.avg,TAP_TABS:'tank,up,market,emp,promote,hard,world,research',TAP_ACTS:'all',TAP_STAGES:'kits unlocked,year 2,year 5,year 12',TAP_PLAY:'800',TAP_ONCE:'1',TAP_MOMENTS:'^(fork|campaign|film|land|hard)',TAP_MRUNS:R.strong},['avg','strong'],'feature'],
  // Pass 289 moment tests (tests/moments/<area>.cjs, helper tests/lib/moment.cjs), on the bots' MOMENTS
  'm-cards':['moments/cards.cjs',{},['strong','kind','avg'],'feature'],
  'm-health':['moments/health.cjs',{},['strong','kind','avg'],'feature'],
  'm-games':['moments/games.cjs',{},['strong','kind','avg'],'feature'],
  'm-kits':['moments/kits.cjs',{},['strong','avg'],'feature'],
  'm-you':['moments/you.cjs',{},['strong','kind','avg'],'feature'],
  frozen:['shrimp-frozen.cjs',{HARD_RUN:R.avg},['avg'],'feature'],
  hard:['shrimp-hard.cjs',{HARD_RUN:R.avg},['avg'],'feature'],
  endcards:['shrimp-endcards.cjs',{ACADEMY_RUN:R.strong},['strong'],'feature'],
  fresh:['shrimp-fresh.cjs',{FRESH_RUN:R.strong},['strong'],'feature'],
  effects:['shrimp-effects.cjs',{EFFECTS_RUN:R.strong},['strong'],'feature'],
  tank1:['shrimp-tank1.cjs',{},[],'feature'],
  yourtank:['shrimp-yourtank.cjs',{},[],'feature'],
  'yourtank-360':['shrimp-yourtank.cjs',{YT_W:'360'},[],'feature'],
  kitpack:['shrimp-kitpack.cjs',{},[],'feature'],
  boardgames:['shrimp-boardgames.cjs',{},[],'feature'],
  'land-audio':['shrimp-land-audio.cjs',{},[],'feature'],
  'land-life':['shrimp-land-life.cjs',{},[],'feature'],
  taps:['shrimp-taps.cjs',{},[],'feature'],
  ear:['shrimp-ear.cjs',{},[],'feature'],
  // long sweeps
  spotlights:['shrimp-spotlights.cjs',{SPOT_RUN:R.strong,SPOT_OUT:path.join(RUNS,'spots')},['strong'],'deploy',{bad:/^(?![\s\S]*all good)/}],
  monkey:['shrimp-monkey.cjs',{MONKEY_RUN:R.strong},['strong'],'deploy'],
  human:['shrimp-human.cjs',{},[],'deploy'],
  'human-360':['shrimp-human.cjs',{HUMAN_W:'360'},[],'deploy'],
  stable:['shrimp-stable.cjs',{STABLE_RUN:R.avg},['avg'],'deploy',{bad:/\((?!0 failures)\d+ failures\)/}],
  tabshots:['shrimp-tabshots.cjs',{SHOTS_RUN:R.strong,SHOTS_OUT:path.join(RUNS,'shots')},['strong'],'deploy'],
};
const TIERS={fast:['fast'],feature:['fast','bot','feature'],deploy:['fast','bot','feature','deploy']};
const args=process.argv.slice(2).filter(a=>!a.startsWith('--'));
if(process.argv.includes('--list')){for(const [n,s] of Object.entries(SUITES))console.log(n.padEnd(14),s[3].padEnd(8),s[0]);process.exit(0);}
if(!args.length){console.log('node tests/run.cjs fast|feature|deploy|<suite>... [--fresh] [--list]');process.exit(2);}
let names=[];for(const a of args){if(TIERS[a])names.push(...Object.keys(SUITES).filter(n=>TIERS[a].includes(SUITES[n][3])));else if(SUITES[a])names.push(a);else{console.log('no suite '+a+' (--list)');process.exit(2);}}
names=[...new Set(names)];
// bots needed by the chosen suites, rebuilt when the game or the bot scripts changed
const stampNow=()=>crypto.createHash('sha1').update(['shrimp/index.html','shrimp/space.html','tests/shrimp-playthrough.cjs','tests/shrimp-average-playthrough.cjs','tests/shrimp-bot-cards.cjs','tests/lib/cardlag.cjs','tests/lib/moments.cjs'].map(f=>fs.readFileSync(path.join(ROOT,f))).join('')).digest('hex').slice(0,12);
fs.mkdirSync(RUNS,{recursive:true});let stamp={};try{stamp=JSON.parse(fs.readFileSync(path.join(RUNS,'stamp.json'),'utf8'));}catch(e){}
const now=stampNow(),fresh=process.argv.includes('--fresh');
const needBots=new Set(names.flatMap(n=>SUITES[n][2]));for(const n of names)if(SUITES[n][3]==='bot')needBots.add(n);
const cached=new Set();
for(const b of needBots){const stale=fresh||stamp[b]!==now||!fs.existsSync(R[b]);if(stale){if(!names.includes(b))names.unshift(b);}else if(!args.includes(b)){cached.add(b);if(!names.includes(b))names.unshift(b);}}
names.sort((a,b)=>(SUITES[a][3]==='bot'?0:1)-(SUITES[b][3]==='bot'?0:1));
let hist={};try{hist=JSON.parse(fs.readFileSync(path.join(RUNS,'last.json'),'utf8'));}catch(e){}
const rows=[],fails=[];const t00=Date.now();
console.log('shrimp run: '+names.join(' ')+(needBots.size?'  (bots: '+[...needBots].map(b=>cached.has(b)?b+' cached':b+' rerun').join(', ')+')':'')+'  jobs '+JOBS);
// Pass 289: a pool of JOBS suites at once (spawn, not spawnSync). A suite starts when the bots it needs are done; bots go first.
// Rows keep the order of names, so the table reads the same as before.
const done={},row=new Array(names.length);let running=0;
function finish(i,r){row[i]=r;done[names[i]]=r;console.log(names[i].padEnd(14)+'... '+r.status+' '+r.s+(r.s==='-'?'':'s')+'  '+r.note);}
function startable(i){const n=names[i],needs=SUITES[n][2];return needs.every(b=>!names.includes(b)||done[b]);}
function launch(i){const n=names[i];const [script,env,needs,tier,opt={}]=SUITES[n];
  const missing=needs.filter(b=>!fs.existsSync(R[b])||(done[b]||{}).status==='FAIL');
  if(missing.length){finish(i,{name:n,status:'SKIP',s:0,note:'needs '+missing.join(',')});return Promise.resolve();}
  if(cached.has(n)){const k=hist[n]&&hist[n].key;finish(i,{name:n,status:'ok',s:'-',note:'cached, game unchanged'+(k?': '+(n==='avg'?'earth ':'WIN ')+k:'')});return Promise.resolve();}
  const t0=Date.now();running++;
  return new Promise(res=>{const ch=spawn(process.execPath,[path.join(T,script)],{env:{...process.env,...env},cwd:ROOT});let out='';
   ch.stdout.on('data',d=>{out+=d;});ch.stderr.on('data',d=>{out+=d;});
   ch.on('close',code=>{running--;const s=((Date.now()-t0)/1000).toFixed(0);
    let status=code===0?'ok':'FAIL';
    if(status==='ok'&&opt.bad&&opt.bad.test(out))status='FAIL';
    let note='';const lines=out.trim().split('\n').filter(Boolean);
    if(opt.warn){const m=out.match(opt.warn);if(m&&+m[1]>0){status='warn';note=m[0];}}
    if(opt.key){const m=out.match(opt.key);if(m){note=(n==='avg'?'earth ':'WIN ')+m[1];const prev=hist[n]&&hist[n].key;if(prev)note+=' (prev '+prev+')';hist[n]={key:m[1]};}}
    if(!note)note=((status==='FAIL'&&lines.find(l=>/^(FAIL|Error|\w*Error:)/.test(l)))||lines[lines.length-1]||'').replace(/\s+/g,' ').slice(0,WIDE?400:90);
    if(n==='strong'||n==='kind'){const e=out.match(/ENDING (\S+)/);if(e)note+=' '+e[1];}
    if(status==='FAIL'){fails.push({i,name:n,out:lines.slice(-80).join('\n')});hist[n]={key:'FAIL'};}
    if(tier==='bot'&&status!=='FAIL')stamp[n]=now;
    finish(i,{name:n,status,s,note});res();});});}
async function pool(){const todo=names.map((_,i)=>i);const live=new Set();
  while(todo.length||live.size){let k=-1;if(running<JOBS){k=todo.findIndex(startable);if(k<0&&!live.size)k=0;}
   if(k>=0){const i=todo.splice(k,1)[0];const pr=launch(i).then(()=>live.delete(pr));live.add(pr);continue;}
   await Promise.race(live);}}
(async()=>{await pool();rows.push(...row);fails.sort((a,b)=>a.i-b.i);
fs.writeFileSync(path.join(RUNS,'stamp.json'),JSON.stringify(stamp));
fs.writeFileSync(path.join(RUNS,'last.json'),JSON.stringify(hist));
for(const f of fails){console.log('\n==== '+f.name+' ====\n'+f.out);}
const nf=rows.filter(r=>r.status==='FAIL').length,nw=rows.filter(r=>r.status==='warn').length,ns=rows.filter(r=>r.status==='SKIP').length;
let git='';try{git=require('child_process').execSync('git rev-parse --short HEAD',{cwd:ROOT,encoding:'utf8'}).trim();}catch(e){}
const md=['Tests ('+args.join(' ')+', '+git+', '+new Date().toISOString().slice(0,16).replace('T',' ')+' UTC, '+((Date.now()-t00)/60000).toFixed(1)+' min, '+JOBS+' at once): '+rows.length+' suites, '+nf+' failed, '+nw+' warn, '+ns+' skipped.','','| suite | result | s | note |','|---|---|---|---|',...rows.map(r=>'| '+r.name+' | '+r.status+' | '+r.s+' | '+r.note.replace(/\|/g,'/')+' |')].join('\n');
fs.writeFileSync(path.join(RUNS,'last.md'),md+'\n');
console.log('\n'+md.split('\n')[0]+'\nTable in tests/.runs/last.md');
process.exit(nf?1:0);
})();
