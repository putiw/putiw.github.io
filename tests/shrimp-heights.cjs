// Pass 304: card heights at 390 px from the bot snapshots, the table the UX passes (302, 303, 304) put in the changelog.
//   node tests/shrimp-heights.cjs                       the default list below (kind run unless a row names a bot)
//   HEIGHTS="equipcard@first sale,c-farms@10k owners@avg" node tests/shrimp-heights.cjs
//   MOMENT_HTML=/tmp/old/index.html node tests/shrimp-heights.cjs   the same table on an older build (git show <ref>:shrimp/index.html)
//   HEIGHTS_W=360 for another width.
// Each row: load the snapshot (migrate, render, queue empty), tap each tab until the card is visible, then two heights:
// `as is` (the card's own fold state) and `open` (the card's shut removed, folds inside left as they are). `-` = not found.
// A row is card@stage[@bot][@tab]; tab (tank, up, market, promote, emp, hard, world, research, me) when the id is on more than one.
// Needs the bot runs (node tests/run.cjs strong kind avg).
const M=require('./lib/moment.cjs');
const DEF=['equipcard@first sale','equipcard@kits unlocked','owncare@first farm','c-farms@first farm','c-farms@10k owners','c-farms@100k kits',
 'c-farms@million owners','sellcard@first sale','sellcard@kits unlocked','c-proj@10k owners@@world','c-proj@100k kits@@world','c-proj@million owners@@world','c-proj@100k kits@@emp','c-proj@first farm@@promote','c-proj@100k kits@@research',
 'buycard@first sale','academy-card@10k owners','kordercard@million owners','kordercard@first farm@avg','colcard@first sale','colcard@first farm',
 'c-shops@10k owners','c-shops@million owners','c-mkt@million owners','logcard@first sale','logcard@first farm','charts@first sale'];
const TABS=['tank','up','market','promote','emp','hard','world','research','me'];
(async()=>{
 const rows=(process.env.HEIGHTS?process.env.HEIGHTS.split(','):DEF).map(s=>s.trim()).filter(Boolean);
 const g=await M.open({w:+process.env.HEIGHTS_W||390});const out=[];
 for(const r of rows){const [id,stage,bot,tb]=r.split('@');const m=M.snap(bot||'kind',stage);
  if(!m){out.push([id,'',stage+(bot?' ('+bot+')':''),'no snapshot','']);continue;}
  await g.load(m);let tab='';
  for(const t of tb?[tb]:TABS){const ok=await g.tab(t).catch(()=>false);if(!ok)continue;
   if(await g.js(id=>{var e=document.getElementById(id);return !!(e&&e.checkVisibility());},id)){tab=await g.js(()=>activeTab);break;}}
  const h=tab?await g.js(id=>{var e=document.getElementById(id),a=e.offsetHeight,sh=e.classList.contains('shut'),b;
    e.classList.remove('shut');b=e.offsetHeight;if(sh)e.classList.add('shut');return [a,b];},id):['-','-'];
  out.push([id,tab||'-',stage+(bot?' ('+bot+')':''),h[0],h[1]]);}
 console.log('| card | tab | stage | as is | open |\n|---|---|---|---|---|\n'+out.map(r=>'| '+r.join(' | ')+' |').join('\n'));
 if(g.errs.length)console.log('page errors: '+[...new Set(g.errs)].slice(0,3).join(' / '));
 await g.close();})().catch(e=>{console.error(e);process.exit(1);});
