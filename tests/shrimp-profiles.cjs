// Which ending each kind of player gets (Pass 202). For every profile in shrimp-profiles-def.cjs, N players (default 1,000)
// answer every decision from decisions() (shrimp-decs.cjs) by what they value plus noise, buy the tagged one-offs (trees,
// lifelines) they like when they can afford them, and play the way that profile plays (the measured half of the traits).
// A rich run lets cash never limit a pick: every tagged one-off the player doesn't object to, every hard part option.
// Prints the family shares. PROFILE_ASSERT=1 checks the targets from the plan (on by default once the rework lands).
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
const PROFILES=require('./shrimp-profiles-def.cjs'),DECS=require('./shrimp-decs.cjs');
const N=Number(process.env.PROFILE_N||1000),ASSERT=process.env.PROFILE_ASSERT!=='0'&&(process.env.PROFILE_ASSERT==='1'||/PROFILE_TARGETS_ON/.test(html));
const c=vm.createContext({Math:Object.create(Math),console});
vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext(DECS+`
var D=decisions(),TAGGED=[];
for(var tk in TREES)TREES[tk].steps.forEach(function(s){if(s.tr)TAGGED.push({id:s.id,tree:tk,push:s.tr,dues:!!s.dues});});
var BASE=JSON.stringify((function(){var g=newGame();acknowledgeMilestone(g);g.day=6000;g.me.on=1;return g;})());
var HARDIDS=D.filter(function(d){return /^hard_/.test(d.id);}).map(function(d){return d.id;});
`,c);
let s=12345;const rnd=()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
const gauss=()=>{let u=0;for(let i=0;i<6;i++)u+=rnd();return (u-3)/Math.sqrt(0.5);};
const TR=vm.runInContext('TRAITS',c);
function score(w,push){let v=0;for(const k in push)v+=(w[k]||0)*push[k];return v;}
function weights(p){if(p.w==='random'){const o={};TR.forEach(k=>o[k]=rnd()*2-1);return o;}const o={};TR.forEach(k=>o[k]=(p.w[k]||0)+0.25*gauss());return o;}
// 'random' draws within the range a real player could hold that measure.
const RANGE={grants:[0,1],give:[0,0.15],farmWell:[-1,1],centre:[0,0.01],land:[0,0.1]};
function val(x,k){if(x==='random'&&k==='give'&&rnd()<0.6)return 0;// most players never touch the give slider
 return x==='random'?RANGE[k][0]+(RANGE[k][1]-RANGE[k][0])*rnd():x;}
// One player: returns the ending key.
function player(p,rich){
 const g=JSON.parse(c.BASE),w=weights(p);g.tr={};g.trAbs={};
 const pick=p.pick;
 c.D.forEach(d=>{
  if(rich&&/^hard_/.test(d.id)&&!p.first&&!pick){d.opts.forEach(o=>{const q=Object.assign({},o.push);if(o.slow)q.care=(q.care||0)-c.HARD_SLOW;c.trAdd(g,q);});return;}
  let best=d.opts[0];
  if(pick==='random')best=d.opts[Math.floor(rnd()*d.opts.length)];
  else if(p.first&&/^(fork_|ev_|c_|pain_|bye_|dye|fight|wash|coin|hard_)/.test(d.id))best=d.opts[Math.floor(rnd()*d.opts.length)];// Pass 210: shown in a per-game order, so the top button is any of them
  else if(pick==='fair'||pick==='cold'){let bv=-1e9;d.opts.forEach(o=>{const v=(pick==='fair'?1:-1)*(o.push.means||0)+0.1*rnd();if(v>bv){bv=v;best=o;}});}
  else if(pick==='kindbot')best=d.opts[0];else if(pick==='coldbot')best=d.opts[d.opts.length-1];
  else if(!p.first){let bv=-1e9;d.opts.forEach(o=>{const v=score(w,o.push)+0.3*gauss();if(v>bv){bv=v;best=o;}});}
  c.trAdd(g,best.push);if(best.abs)for(const k in best.abs){const ex=best.abs[k]-Math.abs(best.push[k]||0);if(ex>1e-9)g.trAbs[k]=(g.trAbs[k]||0)+ex;}});
 c.TAGGED.forEach(t=>{const v=score(w,t.push);
  const buy=rich&&!t.dues?(p.first||pick?rnd()<0.8:v>-0.3):(p.first||pick?rnd()<p.buy:v>0.2&&rnd()<p.buy);if(buy)c.trAdd(g,t.push);});
 const P=g.ps=g.ps||{},pl=p.play,yrs=g.day/365;
 P.t=7.2e7;P.tw=pl.tw*(0.6+0.8*rnd());P.help=pl.help*(0.6+0.8*rnd());P.chart=0;
 P.home=1e7*pl.home;P.biz=1e7*(1-pl.home);P.look=pl.look;P.treat=pl.treat;P.cull=pl.cull;P.prep=[4,5];
 g.me.hrs={work:pl.hrs[0]*(0.85+0.3*rnd()),house:pl.hrs[1]*(0.85+0.3*rnd())};
 // Measures the rework reads (Part 1): real hours on the land, grant directions, giving, farm wellbeing, research centres.
 const ls=val(pl.land,'land')*(0.5+rnd());P.landMs=ls<0.95?P.t*ls/(1-ls):P.t*20;const gr=val(pl.grants,'grants');if(gr!=null){P.grN=6;P.grB=Math.round(6*gr);}
 P.giveD=4;P.giveY=val(pl.give,'give')*4*(0.6+0.8*rnd());P.fw=[Math.max(0,val(pl.farmWell,"farmWell"))*400,400];g.stats.earned=1e11;g.stats.rsp=1e11*val(pl.centre,'centre')*(0.6+0.8*rnd());
 if(p.evil){g.emp.network=1;g.emp.evil={bribe:2,dirty:1,mangrove:1,force:2};}
 if(process.env.PROF_DEBUG===p.id&&rnd()<0.01){const v=c.traitVals(g),sc=c.endingScores(g);console.log('DBG',JSON.stringify(Object.fromEntries(Object.entries(v).map(([k,x])=>[k,+x.toFixed(2)]))),JSON.stringify(Object.fromEntries(Object.entries(sc).map(([k,x])=>[k,+x.toFixed(2)]))));}
 return c.endingPick(g);}
function run(p,rich){const out={};for(let i=0;i<N;i++){const e=player(p,rich),f=e.split('_')[0];out[f]=(out[f]||0)+1;out[e]=(out[e]||0)+1;}return out;}
const FAM=['empire','garden','question','network','drift'];
function row(name,o){return '| '+name+' | '+FAM.map(f=>Math.round(100*(o[f]||0)/N)).join(' | ')+' | '+(o.empire_dictator?Math.round(100*o.empire_dictator/N):0)+'/'+(o.empire_cartel?Math.round(100*o.empire_cartel/N):0)+' |';}
console.log('| Profile | '+FAM.join(' | ')+' | dictator/cartel |');console.log('|---|'+FAM.map(()=>'---').join('|')+'|---|');
const fails=[],R={};
PROFILES.forEach(p=>{const a=run(p,false),b=run(p,true);R[p.id]=[a,b];console.log(row(p.name,a));console.log(row(p.name+', rich',b));
 if(p.target){const hit=o=>p.target.reduce((x,t)=>x+(o[t]||0),0)/N;
  if(hit(a)<0.7)fails.push(p.id+' gets '+p.target.join('/')+' '+Math.round(100*hit(a))+'%, want 70%');
  const fa=FAM.slice().sort((x,y)=>(a[y]||0)-(a[x]||0))[0],same=(b[fa]||0)/N;if(same<0.9*(a[fa]||0)/N)fails.push(p.id+' rich run keeps '+fa+' '+Math.round(100*same)+'% against '+Math.round(100*(a[fa]||0)/N)+'%');}
 else{const top=Math.max(...FAM.map(f=>a[f]||0))/N;if(top>0.5)fails.push(p.id+' has a family at '+Math.round(100*top)+'%, want under 50%');}});
[['Fair chooser','fair'],['Cold chooser','cold'],['Random chooser','random'],['Kind bot order (first option)','kindbot'],['Cold bot order (last option)','coldbot']].forEach(([n,k])=>{
 const p={id:k==='cold'?'coldc':k,pick:k,w:{},play:PROFILES.find(x=>x.id==='returning').play,buy:0.5},a=run(p,false);console.log(row(n,a));
 if(k==='fair'||k==='cold'){const top=Math.max(...FAM.map(f=>a[f]||0))/N;if(top>0.5)fails.push(k+' chooser has a family at '+Math.round(100*top)+'%, want under 50%');}
 if(k==='random'&&FAM.some(f=>!a[f]))fails.push('random chooser never reaches '+FAM.filter(f=>!a[f]).join(', '));});
if(fails.length){console.log('\nTargets missed:\n- '+fails.join('\n- '));if(ASSERT)throw Error(fails.length+' profile targets missed');}
else console.log('\nAll profile targets met.');
