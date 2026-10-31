// Pass 179: Tank 1, one clock and one tank. Part one runs the sim (no DOM): from clean, a job is due at about day 30 and
// the tank is fully covered at about day 90; no pests for a month after a pest clean, no flatworms in clean gravel.
// Part two (browser, skipped with TANK1_SIM_ONLY=1) opens the game with the land: the land draws the game's mulm columns,
// pests and glass, a land clean comes back and isn't undone, reloads agree, and 40x company speed leaves Tank 1 at 2.4 s a day.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
const sim=html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0];
let fails=0;const ok=(c,m)=>{if(c)console.log('PASS',m);else{fails++;console.log('FAIL',m);}};
function engine(seed){const M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const c=vm.createContext({Math:M,console});vm.runInContext(sim,c);return c;}
const SETUP=`var g=newGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;T.pop=[{n:30,age:120,g:60}];g.me=newMe();g.me.on=1;g.me.keep='self';g.me.gplace={balcony:1,house:1,land:1};g.tday=g.day;
 var C=careOf(T);T.glass=null;C.mulm=C.sponge=C.grow=0;C.pests=[];C.pestAt=g.tday;function days(n){for(var d=0;d<n;d++){g.tday++;glassGrow(g,T);careDay(g);}}`;
// 1. due at about a month, full at about three
for(const seed of [3,7,11]){const c=engine(seed);vm.runInContext(SETUP+`
 days(27);var due27=ownDue(g).filter(function(k){return k!=='pests';});days(6);var due33=ownDue(g);days(48);var at81={m:C.mulm,s:C.sponge,g:C.grow,gl:glassMean(T)};days(18);var at99={m:C.mulm,s:C.sponge,g:C.grow,gl:glassMean(T)};`,c);
 ok(c.due27.length===0,'seed '+seed+': nothing due at day 27 ('+c.due27+')');
 ok(['gravel','sponge','trim','glass'].every(k=>c.due33.indexOf(k)>=0),'seed '+seed+': gravel, sponge, trim and glass due by day 33 ('+c.due33+')');
 ok(c.at81.m<0.95&&c.at81.s<0.95&&c.at81.g<0.95&&c.at81.gl<0.95,'seed '+seed+': not fully covered at day 81 '+JSON.stringify(c.at81));
 ok(c.at99.m>=0.99&&c.at99.s>=0.99&&c.at99.g>=0.99&&c.at99.gl>=0.95,'seed '+seed+': fully covered by day 99 '+JSON.stringify(c.at99));}
// 2. pests: quiet month after a pest clean, rare for a monthly cleaner, no flatworms in clean gravel
{let early=0,flatClean=0,seen=0,runs=40;for(let s=1;s<=runs;s++){const c=engine(s*97);vm.runInContext(SETUP+`
 var early=0,flatClean=0,seen=0;for(var mo=0;mo<12;mo++){for(var d=0;d<30;d++){g.tday++;careDay(g);if(mo===0&&C.pests.length)early=1;if(C.mulm<OWN_DUE&&C.pests.some(function(p){return p.k==='flat';}))flatClean=1;}
  if(C.pests.length){seen++;C.pests=[];C.pestAt=g.tday;}C.mulm=0;C.mc=null;C.sponge=0;C.grow=0;}`,c);early+=c.early;flatClean+=c.flatClean;seen+=c.seen;}
 ok(early===0,'no pests in the month after a clean ('+early+' of '+runs+' tanks)');
 ok(flatClean===0,'no flatworm while the gravel is under a third ('+flatClean+')');
 ok(seen/(runs*12)<0.15,'a monthly cleaner rarely sees pests, under 15% of months ('+(seen/(runs*12)).toFixed(2)+')');}
// 3. the land's clean comes back as columns and pests by id
{const c=engine(5);vm.runInContext(SETUP+`days(45);C.pests=[{k:'snail',x:0.2,y:0.8,s:11},{k:'flat',x:0.5,y:0.5,s:22}];var o=landOwn(g);
 var mc=o.mc.slice();for(var i=0;i<24;i++)mc[i]=0;landTank(g,{mc:mc,ps:[11],job:1});var after=ckMulm(C).slice(0,24).every(function(v){return v===0;}),pests=C.pests.map(function(p){return p.s;}).join();`,c);
 ok(c.o.mc.length===48&&c.o.pests.length===2&&c.o.pests[1].x===0.5,'landOwn sends 48 mulm columns and each pest with its place');
 ok(c.after,'cleaned columns stay clean in the game');ok(c.pests==='11','picked pests leave the game by id');}
if(process.env.TANK1_SIM_ONLY){console.log(fails?fails+' FAILED':'all tank 1 sim checks passed');process.exit(fails?1:0);}
require('./shrimp-tank1-browser.cjs')(ok).then(()=>{console.log(fails?fails+' FAILED':'all tank 1 checks passed');process.exit(fails?1:0);});
