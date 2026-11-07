// One runner for every shrimp suite (Pass 287). Quiet on pass, full output on fail, one table at the end.
//   node tests/run.cjs fast       sim suites, about 30 s. After every change.
//   node tests/run.cjs changed    fast + only the suites the diff touches (Pass 291), the sweeps on the touched tabs. Before a push.
//                                 Diff against the last pushed commit (@{u}), or --base=<ref>; --head=<ref> diffs two commits
//                                 instead of the working tree. --dry prints the picks and stops. Falls back to feature when a
//                                 change is in an area the map below doesn't know. The map is CH_FILES and CH_AREAS, edit there.
//   node tests/run.cjs feature    fast + the three bots + every suite that reads their snapshots, about 12 min. Before a deploy,
//                                 and when changed falls back.
//   node tests/run.cjs deploy     feature + spotlights, monkey, human, stable (full), tabshots. Hours. Before "deploy".
//   node tests/run.cjs <name>...  one or more suites by name (the names in SUITES), bots regenerated if stale.
//   --fresh re-runs the bots even if the sim hasn't changed. --list prints the suites and tiers.
//   --jobs=N (or SHRIMP_JOBS) suites at once, default 4 or the core count if fewer (Pass 289); --jobs=1 is the old one-after-another run.
// Bot runs live in tests/.runs/{strong,kind,avg}/run-7.json (gitignored) and are rebuilt when the part of shrimp/index.html the
// bots read (the SIM block and the two slices the average bot takes) or the bot scripts change, comments and BUILD left out
// (Pass 291; hash in tests/.runs/stamp.json). The table is also written to tests/.runs/last.md: paste that into the changelog.
const {spawn}=require('child_process'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const T=__dirname,ROOT=path.join(T,'..'),RUNS=path.join(T,'.runs');
const R={strong:path.join(RUNS,'strong','run-7.json'),kind:path.join(RUNS,'kind','run-7.json'),avg:path.join(RUNS,'avg','run-7.json')};
const WIDE=process.argv.includes('--wide');
const JA=process.argv.find(a=>a.startsWith('--jobs='));const JOBS=Math.max(1,+(JA?JA.slice(7):process.env.SHRIMP_JOBS||Math.min(4,require('os').cpus().length)));/* timing suites flake when jobs outnumber cores */
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
  tapall:['shrimp-tapnow.cjs',{HARD_RUN:R.avg,TAP_TABS:'tank,up,market,emp,promote,hard,world,research',TAP_ACTS:'all',TAP_STAGES:'kits unlocked,year 2,year 5,year 12',TAP_PLAY:'800',TAP_ONCE:'1',TAP_MOMENTS:'^(fork|land|hard (open|goal|option))',TAP_MRUNS:R.strong},['avg','strong'],'feature'],
  // Pass 289 moment tests (tests/moments/<area>.cjs, helper tests/lib/moment.cjs), on the bots' MOMENTS
  'm-cards':['moments/cards.cjs',{},['strong','kind','avg'],'feature'],
  'm-health':['moments/health.cjs',{},['strong','kind','avg'],'feature'],
  'm-games':['moments/games.cjs',{},['strong','kind','avg'],'feature'],
  'm-kits':['moments/kits.cjs',{},['strong','avg'],'feature'],
  'm-you':['moments/you.cjs',{},['strong','kind','avg'],'feature'],
  // Pass 290
  'm-tank':['moments/tank.cjs',{},['strong','avg'],'feature'],
  'm-hard':['moments/hard.cjs',{},['strong','kind','avg'],'feature'],
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
// ---- Pass 291: the `changed` tier. Two tables, edit them here. ----
// CH_FILES: a changed path → suites. 'fast' = nothing beyond fast, 'feature' = fall back to feature, 'index' = look inside
// shrimp/index.html with CH_AREAS, 'script' = the suites whose script is that file. First match wins.
const M_ALL=['m-cards','m-health','m-games','m-kits','m-you','m-tank','m-hard'];
const CH_FILES=[
  [/\.md$/,'fast','notes'],
  [/^tests\/run\.cjs$/,'fast','the runner itself'],
  [/^tests\/lib\/cardlag\.cjs$/,['cardlag'],'card lag recorder'],
  [/^tests\/lib\/moments?\.cjs$/,M_ALL,'moment helper'],
  [/^tests\/(shrimp-playthrough|shrimp-average-playthrough|shrimp-bot-cards)\.cjs$/,'feature','a bot script: every snapshot suite reads the bots'],
  [/^tests\/(build-|shrimp-profiles|shrimp-choices-audit|shrimp-pairs|shrimp-decs|__pycache__)/,'fast','a build or audit script no suite runs'],
  [/^tests\//,'script','suite file'],
  [/^shrimp\/index\.html$/,'index'],
  [/^shrimp\/space\.html$/,['space','space-search'],'space page'],
  [/^shrimp\/boardgames\.js$/,['boardgames','m-games'],'board games script'],
  [/^shrimp\/taps\.js$/,['taps','land-audio'],'taps script'],
  [/^shrimp\/region-map\.js$/,{suites:['tight','layout'],tabs:['world']},'world map'],
  [/^shrimp\/ear\.html$/,['ear'],'ear tank page'],
  [/^shrimp\/(sfx\/|.*\.mp3$)/,['taps','land-audio'],'sound files (sound is in fast)'],
  [/^shrimp\/(sw\.js|manifest\.webmanifest|home\.html|ending-playtest|dev-hard\.json|shots\/|.*\.(png|ico)$)/,'fast','not read by any suite but layout shots'],
  [/^shrimp\//,'feature','a file under shrimp/ the map doesn\'t know'],
  [/./,'fast','outside the game'],
];
// CH_AREAS: inside index.html. A changed line is matched by the words of the function or var it sits in (camelCase split,
// lower case; a word of 4+ letters also matches longer words: 'card' matches 'cards'), and of any function it declares.
// tabs: which tabs the sweeps (tapall, tight, greyreason) look at; 'card' = greyreason's card moments; 'all' = every tab.
// CSS, page markup and the core render helpers are 'core'. A line in no area → fall back to feature.
const CH_CORE_SUITES=['tight','layout','greyreason'];
const CH_AREAS=[
  ['cards','milestone milestones card cards story stories pain pains intro react queue chapter chapters news soon visit choice choices bonus fxc need fork forks bird push',['cardlag','m-cards','bot-cards','cardtap','projtabs'],['card']],/* projtabs: a card that now comes at once covered the tabs (Pass 290) */
  ['hard','hard prop props propose proposal war musk catch catches',['hard','m-hard','tight'],['hard','world']],
  ['projects','proj desk camp campaign mk market ad ads promote promo film movie media meme reach offer mkt greenlight wb gala',['projtabs','gates','tapall'],['promote','market','emp']],
  ['kits','staff hire pack packer packing kit kits emp empire qc line lines auto automation owner owners order orders price consult frame ow co',['m-kits','kitpack','tapall'],['emp','up']],
  ['tank','tank tanks feed food ps water salt cull breed baby hatch clean gear equip colony care rules molt wc age table upgrade upgrades mulm upg welfare',['tank1','yourtank','m-tank','tapall'],['tank','up']],
  ['health','health ill sick heal hc fg',['m-health','tapall'],['tank']],
  ['frozen','frz frozen freeze',['frozen','projtabs'],['promote','market','emp']],
  ['world','world region regions store stores times ripple farm farms coin pump rm reg opinion',['tight','tapall','greyreason'],['world','emp']],
  ['research','research lab sci tree trees',['tight','tapall','greyreason','land-life'],['research']],
  ['land','land grandma garden house pond plant plants pl grass',['land-life','land-audio','m-you'],['me']],
  ['you','me you party mira nour personal week shop shopping crs course away gp gt acts pick act',['me','m-you','tight'],['me']],
  ['games','game games gomoku reversi bg gm stale',['boardgames','m-games'],[]],
  ['ear','ear',['ear'],[]],
  ['space','space voy voyage launch planet earthline',['space','space-search'],[]],
  ['endings','end ending endings win won sell kindend broke',['endcards','fresh'],[]],
  ['saves','migrate new reset save load fresh dev',['fresh'],[]],
  ['core','header alert alerts notes notice gauge gauges vital vitals overview chart charts after controls init reveal progression busy tab anchor',CH_CORE_SUITES,['all']],
  ['clock','tick rollover',['cardlag','m-cards','m-health','tank1'],[]],
  ['costs','si pi scm pm',['gates','greyreason','tapall','m-cards'],['all']],
  ['finance','fin finance',['tapall','greyreason'],['all']],
  ['spot','spot spotlight help guide tooltip tooltips',['greyreason','layout'],['all']],
  ['sound','sound audio music sfx chime mute',['taps','land-audio'],[]],
];
const CH_CORE=/^(render|renderCore|itemHTML|bbtn|morph|selectTab|tabMap|tabLeave|settleScan|anchorCheck|anchorFix|hdFree|coll|fmt|aed|toast)$/;
// the part of index.html the bots read (shrimp-playthrough, shrimp-average-playthrough)
function simText(h){const a=h.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],sl=(x,y)=>{const i=h.indexOf(x),j=h.indexOf(y);return i>=0&&j>i?h.slice(i,j):'';};return a+sl('var PROJ_SHOW=','var seenNew=')+sl('function projectRank(','var storySure=null;');}
// comments and the BUILD stamp out, line count kept (so a diff of two stripped files has the real line numbers)
function stripKeep(s){return s.replace(/BUILD='[^']*'/g,"BUILD=''").replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g,m=>m.replace(/[^\n]/g,'')).replace(/(^|[\s;{},])\/\/[^\n]*/gm,'$1').replace(/[ \t]+$/gm,'');}
// stripped only if it still compiles: a '//' or '/*' inside a string would break it, then the raw text counts
function stripJS(s){const t=stripKeep(s);try{new (require('vm').Script)(t);return t;}catch(e){return s;}}
const words=id=>id.replace(/([a-z])([A-Z])/g,'$1 $2').toLowerCase().split(/[^a-z]+/).filter(Boolean);
const wordHit=(w,k)=>w===k||(k.length>=4&&w.startsWith(k));
function areaOf(ids){const ws=ids.flatMap(words),out=[];for(const [nm,ks,su,tb] of CH_AREAS){const k=ks.split(' ').find(k=>ws.some(w=>wordHit(w,k)));if(k)out.push([nm,k,su,tb]);}return out;}
function changedPicks(base,head){
  const git=c=>require('child_process').execSync(c,{cwd:ROOT,encoding:'utf8',maxBuffer:1<<28,stdio:['ignore','pipe','pipe']});
  if(!base){for(const r of ['@{u}','origin/'+git('git rev-parse --abbrev-ref HEAD').trim()]){try{base=git('git rev-parse --short '+r).trim();break;}catch(e){}}}
  if(!base)return {fall:'no base (no upstream): pass --base=<ref>'};
  const range=head?base+' '+head:base;
  let files=git('git diff --name-only '+range).split('\n').filter(Boolean);
  if(!head)files=files.concat(git('git ls-files --others --exclude-standard').split('\n').filter(f=>f&&/^(shrimp|tests)\//.test(f)));
  const why={},tabs=new Set(),fall=[],full=new Set(),add=(n,r)=>{(why[n]=why[n]||[]).push(r);};
  const scr={};for(const [n,s] of Object.entries(SUITES))(scr['tests/'+s[0]]=scr['tests/'+s[0]]||[]).push(n);
  for(const f of [...new Set(files)]){const m=CH_FILES.find(x=>x[0].test(f));const [,act,note]=m;
    if(act==='fast')console.log('  '+f+': fast only ('+note+')');
    else if(act==='feature')fall.push(f+': '+note);
    else if(act==='script'){let ns=(scr[f]||[]).filter(n=>SUITES[n][3]!=='deploy');if(ns.some(n=>SUITES[n][3]!=='name'))ns=ns.filter(n=>SUITES[n][3]!=='name');/* tapnow's file is tapall's too: tapall covers it */if(ns.length)ns.forEach(n=>{add(n,f+', all its tabs');full.add(n);});else console.log('  '+f+': '+((scr[f]||[]).length?'a deploy suite, runs in deploy or by name':'fast only (no suite runs it)'));}
    else if(act==='index')indexPicks(f,base,head,add,tabs,fall,git);
    else{const su=Array.isArray(act)?act:act.suites;su.forEach(n=>add(n,f+' ('+note+')'));(act.tabs||[]).forEach(t=>tabs.add(t));}}
  return {base,files,why,tabs,fall,full};}
function indexPicks(f,base,head,add,tabs,fall,git){
  const os=require('os'),now=head?git('git show '+head+':'+f):fs.readFileSync(path.join(ROOT,f),'utf8');let old='';try{old=git('git show '+base+':'+f);}catch(e){}
  const so=stripKeep(old),sn=stripKeep(now);
  const nb=x=>x.split('\n').map(l=>l.trim()).filter(Boolean).join('\n');if(nb(so)===nb(sn)){console.log('  '+f+': only comments or the BUILD stamp changed, fast only');return;}
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'shrimp-ch-'));fs.writeFileSync(tmp+'/a',so);fs.writeFileSync(tmp+'/b',sn);
  let d='';try{d=git('git diff --no-index -U0 --ignore-blank-lines --word-diff=porcelain "--word-diff-regex=[A-Za-z_$][A-Za-z0-9_$]*|[0-9.]+|[^[:space:]]" '+tmp+'/a '+tmp+'/b');}catch(e){d=e.stdout||'';}fs.rmSync(tmp,{recursive:true});
  const L=now.split('\n'),LO=old.split('\n');
  // regions of the new file: css, markup, js (sim or ui)
  const reg=new Array(L.length+1);let st='markup';for(let i=0;i<L.length;i++){const l=L[i];if(/<style/.test(l))st='css';else if(/<script>/.test(l))st='ui';if(/==SIM-START==/.test(l))st='sim';reg[i+1]=st;if(/==SIM-END==/.test(l))st='ui';if(/<\/style>/.test(l))st='markup';if(/<\/script>/.test(l)&&st!=='css')st='markup';}
  const decl=(lines,n)=>{for(let i=Math.min(n,lines.length)-1;i>=0;i--){const m=lines[i].match(/^(?:async\s+)?function\s*\*?\s*([\w$]+)|^(?:var|let|const)\s+([\w$]+)/);if(m)return m[1]||m[2];}return '';};
  const hit={},sim=[];let core=0,unknown=new Set();
  /* Pass 291: a line here is often a whole function, so the words that changed count too (word diff): Pass 288's fix sat in
     updateEmpire, but the changed words were frzTap('mk-body') and FRZ */
  const hunks=[];for(const l of d.split('\n')){if(l.startsWith('@@'))hunks.push({h:l,frag:[]});else if(hunks.length&&/^[+-]/.test(l)&&!/^(\+\+\+|---) /.test(l))hunks[hunks.length-1].frag.push(l.slice(1));}
  for(const {h,frag} of hunks){const fw=[...new Set(frag.join(' ').match(/[A-Za-z_$][\w$]*/g)||[])];const m=h.match(/-(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))?/);const os0=+m[1],oc=m[2]===undefined?1:+m[2],ns0=+m[3],nc=m[4]===undefined?1:+m[4];
    const lines=nc?Array.from({length:nc},(_,k)=>ns0+k):[ns0+1];
    for(const ln of lines){const r=reg[Math.max(1,Math.min(ln,L.length))]||'ui';
      if(r==='css'||r==='markup'){if(!/^\s*<script src=/.test(L[ln-1]||''))core++;continue;}/* a script's ?v= bump: that file has its own row in CH_FILES */
      const txt=(nc?L[ln-1]:LO[os0-1])||'',id=nc?decl(L,ln):decl(LO,os0),ids=[id].concat([...txt.matchAll(/function\s+([\w$]+)/g)].map(x=>x[1])).filter(Boolean);
      if(r==='sim')sim.push(id);
      const isCore=ids.some(x=>CH_CORE.test(x));if(isCore)core++;
      const a=areaOf(ids.concat(fw));if(!a.length){if(!isCore)unknown.add(id||'line '+ln);continue;}
      for(const [nm,k,su,tb] of a){(hit[nm]=hit[nm]||{su,tb,ids:new Set()}).ids.add(id+(words(id).some(w=>wordHit(w,k))?'':' ('+k+')'));}}}
  for(const [nm,o] of Object.entries(hit)){const r=f+' '+nm+': '+[...o.ids].slice(0,4).join(', ')+(o.ids.size>4?' …':'');o.su.forEach(n=>add(n,r));o.tb.forEach(t=>tabs.add(t));}
  if(core){CH_CORE_SUITES.forEach(n=>add(n,f+' core ('+core+' lines of CSS, markup or render helpers)'));tabs.add('all');}
  if(sim.length){['strong','kind','avg','bot-cards','cardlag'].forEach(n=>add(n,f+' sim: '+[...new Set(sim)].slice(0,4).join(', ')));}
  if(unknown.size)fall.push(f+': no area for '+[...unknown].slice(0,6).join(', ')+(unknown.size>6?' and '+(unknown.size-6)+' more':''));}
const args=process.argv.slice(2).filter(a=>!a.startsWith('--'));
const opt=k=>{const a=process.argv.find(x=>x.startsWith('--'+k+'='));return a?a.slice(k.length+3):'';};
if(process.argv.includes('--list')){for(const [n,s] of Object.entries(SUITES))console.log(n.padEnd(14),s[3].padEnd(8),s[0]);process.exit(0);}
if(!args.length){console.log('node tests/run.cjs fast|changed|feature|deploy|<suite>... [--base=<ref>] [--head=<ref>] [--dry] [--fresh] [--list]');process.exit(2);}
const OVR={};let CHNOTE='';
let names=[];for(const a of args){if(TIERS[a])names.push(...Object.keys(SUITES).filter(n=>TIERS[a].includes(SUITES[n][3])));
  else if(a==='changed'){const c=changedPicks(opt('base'),opt('head'));names.push(...Object.keys(SUITES).filter(n=>SUITES[n][3]==='fast'));
   const fall=c.fall&&(typeof c.fall==='string'?[c.fall]:c.fall);
   if(fall&&fall.length){fall.forEach(x=>console.log('  falls back to feature: '+x));names.push(...Object.keys(SUITES).filter(n=>TIERS.feature.includes(SUITES[n][3])));CHNOTE='changed vs '+(c.base||'?')+': fell back to feature ('+fall.join('; ').slice(0,300)+')';}
   else{const pk=Object.keys(c.why);const all=c.tabs.has('all'),T8=['tank','up','market','emp','promote','hard','world','research'];
    const pick=(n,k,list)=>{if(!pk.includes(n)||all||c.full.has(n))return;const t=list.filter(x=>c.tabs.has(x));if(!t.length){delete c.why[n];console.log('  '+n+': dropped, no tab of its own touched');return;}OVR[n]={[k]:t.join(',')};c.why[n].push('tabs '+t.join(' '));};
    pick('tapall','TAP_TABS',T8);pick('tight','TIGHT_TABS',T8.concat('me'));pick('greyreason','GREY_TABS',T8.concat('card'));
    for(const n of Object.keys(c.why)){if(!SUITES[n]){console.log('  map names a suite that isn\'t in SUITES: '+n);continue;}if(SUITES[n][3]!=='fast')names.push(n);console.log('  + '+n.padEnd(12)+' '+[...new Set(c.why[n])].join('; ').slice(0,WIDE?600:200));}
    if(!Object.keys(c.why).length)console.log('  nothing beyond fast');
    CHNOTE='changed vs '+c.base+(opt('head')?'..'+opt('head'):'')+': '+(Object.keys(c.why).filter(n=>SUITES[n]&&SUITES[n][3]!=='fast').join(', ')||'fast only')+(all?' (all tabs)':c.tabs.size?' (tabs '+[...c.tabs].join(' ')+')':'');}}
  else if(SUITES[a])names.push(a);else{console.log('no suite '+a+' (--list)');process.exit(2);}}
names=[...new Set(names)];
// bots needed by the chosen suites, rebuilt when the game or the bot scripts changed
// Pass 291: the bots read only the sim part of index.html; hash that without comments and BUILD, so a stamp, comment, CSS or
// UI change keeps the cached runs. A real sim change still rebuilds. (space.html left out: no bot reads it.)
const stampNow=()=>crypto.createHash('sha1').update(stripJS(simText(fs.readFileSync(path.join(ROOT,'shrimp/index.html'),'utf8'))).split('\n').map(l=>l.trim()).filter(Boolean).join('\n')+['tests/shrimp-playthrough.cjs','tests/shrimp-average-playthrough.cjs','tests/shrimp-bot-cards.cjs','tests/lib/cardlag.cjs','tests/lib/moments.cjs'].map(f=>fs.existsSync(path.join(ROOT,f))?fs.readFileSync(path.join(ROOT,f)):'').join('')).digest('hex').slice(0,12);
fs.mkdirSync(RUNS,{recursive:true});let stamp={};try{stamp=JSON.parse(fs.readFileSync(path.join(RUNS,'stamp.json'),'utf8'));}catch(e){}
const now=stampNow(),fresh=process.argv.includes('--fresh');
const needBots=new Set(names.flatMap(n=>SUITES[n][2]));for(const n of names)if(SUITES[n][3]==='bot')needBots.add(n);
const cached=new Set();
for(const b of needBots){const stale=fresh||stamp[b]!==now||!fs.existsSync(R[b]);if(stale){if(!names.includes(b))names.unshift(b);}else if(!args.includes(b)){cached.add(b);if(!names.includes(b))names.unshift(b);}}
if(process.argv.includes('--dry')){console.log('would run: '+names.join(' ')+(needBots.size?'  (bots: '+[...needBots].map(b=>cached.has(b)?b+' cached':b+' rerun').join(', ')+')':'')+(Object.keys(OVR).length?'  '+JSON.stringify(OVR):''));process.exit(0);}
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
  if(!fs.existsSync(path.join(T,script))){finish(i,{name:n,status:'SKIP',s:0,note:'no '+script+' at this commit'});return Promise.resolve();}
  const t0=Date.now();running++;
  return new Promise(res=>{const ch=spawn(process.execPath,[path.join(T,script)],{env:{...process.env,...env,...(OVR[n]||{})},cwd:ROOT});let out='';
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
const md=['Tests ('+args.join(' ')+', '+git+', '+new Date().toISOString().slice(0,16).replace('T',' ')+' UTC, '+((Date.now()-t00)/60000).toFixed(1)+' min, '+JOBS+' at once): '+rows.length+' suites, '+nf+' failed, '+nw+' warn, '+ns+' skipped.',...(CHNOTE?['',CHNOTE]:[]),'','| suite | result | s | note |','|---|---|---|---|',...rows.map(r=>'| '+r.name+' | '+r.status+' | '+r.s+' | '+r.note.replace(/\|/g,'/')+' |')].join('\n');
fs.writeFileSync(path.join(RUNS,'last.md'),md+'\n');
console.log('\n'+md.split('\n')[0]+'\nTable in tests/.runs/last.md');
process.exit(nf?1:0);
})();
