const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
function engine(seed=7){const M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const c=vm.createContext({Math:M,console});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);return c;}
let count=0;function check(name,code){const c=engine();vm.runInContext(code,c);count++;console.log('PASS',name);}
check('fresh starts preserve milestones; high-speed batches stop at a boundary',`
var g=newGame(),t=g.tanks[0];t.chem.bacA=t.chem.bacB=bacTarget(t);t.chem.nh=t.chem.no2=0;rememberCycle(g,t);
for(var i=0;i<400;i++)stepGame(g);
if(g.progress.queue[0]!=='cycle'||g.day!==0||g.step!==1)throw Error('Skipped milestone boundary');
var before=clock(g);stepGame(g);if(clock(g)!==before)throw Error('Continued while pending');
acknowledgeMilestone(g);stepGame(g);if(g.progress.queue.length)throw Error('Repeated milestone');
`);
check('old saves retain preferences and skip historical milestone spam',`
var g=newGame();delete g.progress;g.day=600;g.tanks[0].had=1;g.tanks[0].set.keep=20;g.stats.born=10;g.stats.sold=100;g.kits.sold=30;g.emp.farms.barn=1;
migrate(g);detectMilestones(g);if(g.progress.queue.length||g.tanks[0].set.keep!==20||g.progress.home!=='emp')throw Error('Migration regressed');
`);
check('bench is owner-operated; unsafe payroll cannot be hired',`
var g=newGame();g.stats.sold=60;g.money=400;if(!buyPackTier(g))throw Error('Bench failed');
if(g.emp.staff.pack!==0||staffCost(g)!==0||packCap(g)!==1)throw Error('Surprise payroll');
if(hire(g,'sales',1))throw Error('Unsafe hire');g.money=10000;if(!hire(g,'sales',1)||staffCost(g)!==130)throw Error('Safe hire failed');
`);
check('construction reserves, mothball, restart and sale are consistent',`
var g=newGame(),f=FARMS.find(x=>x.id==='rack');g.stats.sold=60;g.emp.proj.farmlic=1;g.money=f.cost;
if(buyFarm(g,'rack'))throw Error('Spent working capital');g.money=10000;if(!buyFarm(g,'rack'))throw Error('Build failed');
if(farmCap(g)!==1)throw Error('Wrong capacity');changeFarm(g,'rack','pause');if(farmCap(g)!==0||farmOverhead(g)!==0)throw Error('Mothball charges');
g.money=0;if(changeFarm(g,'rack','resume'))throw Error('Unsafe restart');g.money=10000;changeFarm(g,'rack','resume');var cash=g.money;changeFarm(g,'rack','sell');
if(g.money<=cash||farmCap(g)||g.emp.pausedFarms.rack>g.emp.farms.rack)throw Error('Sale inconsistent');
`);
check('automatic inventory respects reserve, target and zero-demand endgame',`
var g=newGame();g.stats.sold=60;g.emp.farms.barn=5;g.emp.inventoryDays=3;g.money=10000;var r=operatingReserve(g);empireDay(g);
if(g.money<r||g.kits.stock>Math.ceil(3*kitDemand(g)))throw Error('Inventory overspend');
g.humans=WORLD;g.emp.proj.last=1;g.emp.regions=REGIONS.map(x=>x.id);g.kits.stock=0;empireDay(g);if(g.emp.prod!==0)throw Error('Produced with no demand');
`);
check('manual kits protect actual adult breeder cohorts',`
var g=newGame(),t=g.tanks[0];g.stats.sold=60;g.money=1000;t.set.keep=6;t.pop=[{age:100,n:6,g:30},{age:25,n:16,g:90}];
if(packKits(g,t,2)!==2||t.pop.find(x=>x.age===100).n!==6)throw Error('Ate breeders');
`);
check('lab certificate affects survival and never needs recurring tank care',`
var g=newGame(),t=g.tanks[0];t.pop=[{age:100,n:10,g:90}];t.had=1;g.labQuality=labCandidate(g);var q=effectiveQuality(g);
t.pop=[];t.chem.nh=100;if(effectiveQuality(g)!==q||certifyLab(g))throw Error('Certificate decayed');
g.emp.q=1;if(effectiveQuality(g)>0.98)throw Error('Survival cap');
`);
check('victory globally stops the simulation, then sandbox is explicit',`
var g=newGame();g.emp.won=100;detectMilestones(g);var money=g.money;stepGame(g);
if(!g.progress.queue.includes('win')||g.money!==money||g.day!==0)throw Error('Win not paused');
g.progress.queue=[];g.progress.sandbox=true;if(!stepGame(g))throw Error('Sandbox blocked');
`);
check('campaigns and films produce a persistent result',`
var g=newGame();g.emp.proj.ministry=1;g.emp.proj.studio=1;g.emp.inf=1e9;g.emp.op.offer=['calm'];if(!runCampaign(g,'calm'))throw Error('Campaign failed');
if(!greenlight(g,0))throw Error('Film failed');for(var i=0;i<31;i++){g.day++;empireDay(g);}
if(!g.emp.op.recap||g.emp.op.recap.w<=0||!g.emp.filmRecap||g.emp.movie.n!==1)throw Error('Missing result');
`);
check('finance shows operating margin separately from purchases',`
var g=newGame();g.fin=[{shrimp:1000,farms:-100,logistics:-20,equipment:-9000,staff:-80}];
if(operatingNet(g)!==800)throw Error('Capital expense counted as payroll');
`);
check('queued milestones survive a saved-game round trip',`
var g=newGame();g.stats.sold=60;detectMilestones(g);var saved=JSON.parse(JSON.stringify(g));migrate(saved);
if(!saved.progress.queue.includes('kits')||!progressionBlocked(saved))throw Error('Lost kit handoff');
var clock0=clock(saved);for(var i=0;i<120;i++)stepGame(saved);if(clock(saved)!==clock0)throw Error('Offline progression bypassed pause');
`);
check('legacy victory does not accrue offline overhead before review',`
var g=newGame();delete g.progress;g.emp.won=2000;g.humans=WORLD;g.money=100;g.emp.farms.barn=3;migrate(g);var before=g.money;
for(var i=0;i<120;i++)stepGame(g);detectMilestones(g);
if(g.money!==before||!g.progress.queue.includes('win'))throw Error('Legacy winner charged overhead');
`);
check('experienced-player mode skips tutorials but still pauses at victory',`var g=newGame();g.opt.all=true;g.stats.sold=60;detectMilestones(g);if(g.progress.queue.length)throw Error('Tutorial not skipped');g.emp.won=200;detectMilestones(g);if(!g.progress.queue.includes('win'))throw Error('Victory skipped');`);
check('legacy navigation flags cannot complete a cycle or allow unsafe stocking',`
var g=newGame();delete g.progress;g.day=4;g.ob.market=1;g.tanks[0].cycledAt=4;g.money=1000;migrate(g);
if(g.tanks[0].cycledAt!=null||safeToStock(g,g.tanks[0])||buyPack(g,g.tanks[0],0))throw Error('Unsafe legacy stocking');
var t=g.tanks[0];t.chem.bacA=t.chem.bacB=bacTarget(t);rememberCycle(g,t);t.chem.nh=2*t.vol;if(buyPack(g,t,0))throw Error('Stocked toxic water');t.chem.nh=t.chem.no2=0;if(!buyPack(g,t,0))throw Error('Safe stocking rejected');
`);
console.log(count+' focused balance and migration checks passed');
module.exports={engine,html};
