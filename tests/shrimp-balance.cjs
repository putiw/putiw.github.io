const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
function engine(seed=7){const M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const c=vm.createContext({Math:M,console});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);vm.runInContext('function readyGame(){var g=newGame();acknowledgeMilestone(g);return g;}',c);return c;}
let count=0;function check(name,code){const c=engine();vm.runInContext(code,c);count++;console.log('PASS',name);}
check('opening is concise and the Tank goal preference survives saves',`
var intro=MILESTONES.intro.body,g=newGame();
if(intro.includes('You took him seriously.')||intro.includes('A tank for everyone. Ten years to try.'))throw Error('Opening still has the removed lines');
if(!GRANDPA_LETTERS.gift.body.includes('“Everyone on Earth?”')||!GRANDPA_LETTERS.gift.body.includes('“Well, we’d better get started. Let’s see what we can do in ten years.”')||GRANDPA_LETTERS.gift.body.includes('You laughed'))throw Error('Grandpa opening exchange is incorrect');
if(g.opt.goalOpen!==true)throw Error('New goal panel should start expanded');g.opt.goalOpen=false;
if(migrate(JSON.parse(JSON.stringify(g))).opt.goalOpen!==false)throw Error('Goal panel preference did not persist');
var old=newGame();delete old.opt.goalOpen;if(migrate(old).opt.goalOpen!==true)throw Error('Old saves need the expanded default');
`);
const tankStart=html.indexOf('<section class="panel" id="p-tank">'),marketStart=html.indexOf('<section class="panel" id="p-market"'),marketEnd=html.indexOf('<!-- UPGRADES -->'),goalCard=html.indexOf('id="next-card"'),tradeColony=html.indexOf('id="trade-colcard"');
if(!(tankStart>=0&&tankStart<goalCard&&goalCard<marketStart&&marketStart<tradeColony&&tradeColony<marketEnd))throw Error('Goal or Trade colony card is outside its intended tab');
if(html.includes('id="next-actions"')||html.includes('id="btn-gomarket"'))throw Error('Confusing Go-to CTA remains in the goal flow');
console.log('PASS goal panel is Tank-only, navigation is tab-based and Trade includes the colony card');
if(html.includes('data-act="milestone-continue"')||!html.includes('Next step (paused)')||!html.includes('function setEmphasisText'))throw Error('Milestones should use one consistent paused action with readable emphasis');
console.log('PASS milestones use one paused next-step action and instructional text can emphasize key terms');
const tooltipMap=html.split('var PARAM_TIPS={')[1].split('};\nfunction initParameterTooltips')[0];
for(const id of ['nh','no2','no3','ph','kh','gh','temp','dens'])if(!tooltipMap.includes(id+':{name:'))throw Error('Missing cause tooltip for water parameter '+id);
if(!html.includes("addEventListener('pointerdown'")||!html.includes('Press and hold a water reading'))throw Error('Water tooltips must be discoverable through press and hold');
console.log('PASS all water readings explain what raises and lowers them on press and hold');
if(!html.includes("$('vwater').innerHTML=[['no3','NO₃'],['kh','KH'],['gh','GH'],['ph','pH'],['temp','Temp']]"))throw Error('Top readings should show nitrate, KH, GH, pH and temperature in order');
console.log('PASS top readings show NO₃, KH, GH, pH and temperature');
const goalRowStart=html.indexOf('<div class="goalrow">'),dreamSummary=html.indexOf('id="dream-tracker"'),nextHeaderRow=html.indexOf('<div class="chips" id="tankchips"');
if(!(goalRowStart>=0&&goalRowStart<dreamSummary&&dreamSummary<nextHeaderRow&&html.includes('id="b-goal-short"')))throw Error('Grandpa year tracker should share the compact progress row');
console.log('PASS Grandpa year tracker shares the progress row with a compact mobile progress label');
check('fresh starts preserve milestones; high-speed batches stop at a boundary',`
var g=readyGame(),t=g.tanks[0];t.chem.bacA=t.chem.bacB=bacTarget(t);t.chem.nh=t.chem.no2=0;rememberCycle(g,t);
for(var i=0;i<400;i++)stepGame(g);
if(g.progress.queue[0]!=='cycle'||g.day!==0||g.step!==1)throw Error('Skipped milestone boundary');
var before=clock(g);stepGame(g);if(clock(g)!==before)throw Error('Continued while pending');
acknowledgeMilestone(g);stepGame(g);if(g.progress.queue.length)throw Error('Repeated milestone');
`);
check('old saves retain preferences and skip historical milestone spam',`
var g=readyGame();delete g.progress;g.day=600;g.tanks[0].had=1;g.tanks[0].set.keep=20;g.stats.born=10;g.stats.sold=100;g.kits.sold=30;g.emp.farms.barn=1;
migrate(g);detectMilestones(g);if(g.progress.queue.length||g.tanks[0].set.keep!==20||g.progress.home!=='emp')throw Error('Migration regressed');
`);
check('bench is owner-operated; unsafe payroll cannot be hired',`
var g=readyGame();g.stats.sold=60;g.money=400;if(!buyPackTier(g))throw Error('Bench failed');
if(g.emp.staff.pack!==0||staffCost(g)!==0||packCap(g)!==1)throw Error('Surprise payroll');
if(hire(g,'sales',1))throw Error('Unsafe hire');g.money=10000;if(!hire(g,'sales',1)||staffCost(g)!==130)throw Error('Safe hire failed');
`);
check('construction reserves, mothball, restart and sale are consistent',`
var g=readyGame(),f=FARMS.find(x=>x.id==='rack');g.stats.sold=60;g.emp.proj.farmlic=1;g.money=f.cost;
if(buyFarm(g,'rack'))throw Error('Spent working capital');g.money=10000;if(!buyFarm(g,'rack'))throw Error('Build failed');
if(farmCap(g)!==1)throw Error('Wrong capacity');changeFarm(g,'rack','pause');if(farmCap(g)!==0||farmOverhead(g)!==0)throw Error('Mothball charges');
g.money=0;if(changeFarm(g,'rack','resume'))throw Error('Unsafe restart');g.money=10000;changeFarm(g,'rack','resume');var cash=g.money;changeFarm(g,'rack','sell');
if(g.money<=cash||farmCap(g)||g.emp.pausedFarms.rack>g.emp.farms.rack)throw Error('Sale inconsistent');
`);
check('automatic inventory respects reserve, target and zero-demand endgame',`
var g=readyGame();g.stats.sold=60;g.emp.farms.barn=5;g.emp.inventoryDays=3;g.money=10000;var r=operatingReserve(g);empireDay(g);
if(g.money<r||g.kits.stock>Math.ceil(3*kitDemand(g)))throw Error('Inventory overspend');
g.humans=WORLD;g.emp.proj.last=1;g.emp.regions=REGIONS.map(x=>x.id);g.kits.stock=0;empireDay(g);if(g.emp.prod!==0)throw Error('Produced with no demand');
`);
check('manual kits protect actual adult breeder cohorts',`
var g=readyGame(),t=g.tanks[0];g.stats.sold=60;g.money=1000;t.set.keep=6;t.pop=[{age:100,n:6,g:30},{age:25,n:16,g:90}];
if(packKits(g,t,2)!==2||t.pop.find(x=>x.age===100).n!==6)throw Error('Ate breeders');
`);
check('lab certificate affects survival and never needs recurring tank care',`
var g=readyGame(),t=g.tanks[0];t.pop=[{age:100,n:10,g:90}];t.had=1;g.labQuality=labCandidate(g);var q=effectiveQuality(g);
t.pop=[];t.chem.nh=100;if(effectiveQuality(g)!==q||certifyLab(g))throw Error('Certificate decayed');
g.emp.q=1;if(effectiveQuality(g)>0.98)throw Error('Survival cap');
`);
check('victory globally stops the simulation, then sandbox is explicit',`
var g=readyGame();g.emp.won=100;detectMilestones(g);var money=g.money;stepGame(g);
if(!g.progress.queue.includes('win')||g.money!==money||g.day!==0)throw Error('Win not paused');
g.progress.queue=[];g.progress.sandbox=true;if(!stepGame(g))throw Error('Sandbox blocked');
`);
check('campaigns and films produce a persistent result',`
var g=readyGame();g.emp.proj.ministry=1;g.emp.proj.studio=1;g.emp.inf=1e9;g.emp.op.offer=['calm'];if(!runCampaign(g,'calm'))throw Error('Campaign failed');
if(!greenlight(g,0))throw Error('Film failed');for(var i=0;i<31;i++){g.day++;empireDay(g);}
if(!g.emp.op.recap||g.emp.op.recap.w<=0||!g.emp.filmRecap||g.emp.movie.n!==1)throw Error('Missing result');
`);
check('finance shows operating margin separately from purchases',`
var g=readyGame();g.fin=[{shrimp:1000,farms:-100,logistics:-20,equipment:-9000,staff:-80}];
if(operatingNet(g)!==800)throw Error('Capital expense counted as payroll');
`);
check('queued milestones survive a saved-game round trip',`
var g=readyGame();g.stats.sold=60;detectMilestones(g);var saved=JSON.parse(JSON.stringify(g));migrate(saved);
if(!saved.progress.queue.includes('kits')||!progressionBlocked(saved))throw Error('Lost kit handoff');
var clock0=clock(saved);for(var i=0;i<120;i++)stepGame(saved);if(clock(saved)!==clock0)throw Error('Offline progression bypassed pause');
`);
check('legacy victory does not accrue offline overhead before review',`
var g=readyGame();delete g.progress;g.emp.won=2000;g.humans=WORLD;g.money=100;g.emp.farms.barn=3;migrate(g);var before=g.money;
for(var i=0;i<120;i++)stepGame(g);detectMilestones(g);
if(g.money!==before||!g.progress.queue.includes('win'))throw Error('Legacy winner charged overhead');
`);
check('experienced-player mode skips tutorials but still pauses at victory',`var g=readyGame();g.opt.all=true;g.stats.sold=60;detectMilestones(g);if(g.progress.queue.length)throw Error('Tutorial not skipped');g.emp.won=200;detectMilestones(g);if(!g.progress.queue.includes('win'))throw Error('Victory skipped');`);
check('legacy navigation flags cannot complete a cycle or allow unsafe stocking',`
var g=readyGame();delete g.progress;g.day=4;g.ob.market=1;g.tanks[0].cycledAt=4;g.money=1000;migrate(g);
if(g.tanks[0].cycledAt!=null||safeToStock(g,g.tanks[0])||buyPack(g,g.tanks[0],0))throw Error('Unsafe legacy stocking');
var t=g.tanks[0];t.chem.bacA=t.chem.bacB=bacTarget(t);rememberCycle(g,t);t.chem.nh=2*t.vol;if(buyPack(g,t,0))throw Error('Stocked toxic water');t.chem.nh=t.chem.no2=0;if(!buyPack(g,t,0))throw Error('Safe stocking rejected');
`);
check('hatcheries supply shrimp and cannot bypass packing', `
var g=readyGame();g.stats.sold=60;g.money=100000;g.emp.farms.barn=1;g.emp.proj.farmlic=1;g.emp.beta=0;empireDay(g);
if(g.kits.stock||g.kits.sold||g.emp.rawShrimp<=0||g.emp.prod<=0)throw Error('Farm bypassed packing');
var raw=g.emp.rawShrimp,cash=g.money;if(manualPack(g,1)!==1||g.emp.rawShrimp!==raw-8||g.money!==cash-g.emp.mat)throw Error('Raw packing did not conserve resources');
`);
check('automatic packing respects labour, materials, holding and warehouse limits', `
var g=readyGame();g.stats.sold=60;g.kits.sold=100;g.money=1000000;g.emp.farms.hatch=1;g.emp.staff.tier=1;g.emp.beta=0;g.emp.acc=0;empireDay(g);
if(g.emp.packed>1||g.emp.rawShrimp>farmCap(g)*3*8||g.kits.stock>Math.ceil(kitDemand(g)*7))throw Error('Capacity bypass');
g.emp.rawShrimp=800;g.money=50;if(packRaw(g,10,false)!==0||g.emp.rawShrimp!==800)throw Error('Free materials');
`);
check('old farms retain packing exactly once, including mothballed assets and honest salvage', `
var g=readyGame();delete g.emp.chainVersion;g.emp.farms={hatch:2,ocean:1};g.emp.pausedFarms={hatch:1};g.kits.stock=123;g.kits.sold=10000;g.money=1000000;migrate(g);
var cap=packCap(g);if(cap!==50500||g.kits.stock!==123||farmSalvage(g,FARMS.find(x=>x.id==='ocean'))!==25000000)throw Error('Migration output or value changed');
migrate(g);if(packCap(g)!==cap)throw Error('Duplicate migration gift');
`);
check('shrimp-free ripple fires headlines in order with effects and a retraining fix', `
var g=readyGame();g.humans=5e5;g.emp.q=0.9;var f0=g.emp.op.f.i;for(var i=0;i<400;i++){g.day++;rippleDay(g);}
var R=g.emp.ripple;if(R.n<3||R.log[0].i!==0||R.log[1].d<R.log[0].d)throw Error('Headlines out of order');
if(!(g.emp.op.f.i<f0))throw Error('Trawler headline did not cool Fire');
g.humans=4e9;R.free=2.1e6;rippleDay(g);if(!rippleHas(g,'retrain')||!projAvail(g).some(p=>p.id==='retrain'))throw Error('Retraining not offered');
g.money=1e6;var before=g.emp.op.f.i;buyProj(g,'retrain');if(!(g.emp.op.f.i>before))throw Error('Retraining did not help Fire');
R.free=3e9;var inf=g.emp.inf;rippleDay(g);if(R.n!==RIPPLE.length||!(g.emp.inf>inf))throw Error('Late ripple incomplete');
if(regionCost(g,REGIONS[3])>=REGIONS[3].m)throw Error('Typhoon discount missing');
`);
check('speeds unlock through care, automation and profitable fulfilment', `
var g=readyGame(),t=g.tanks[0];if(maxSpeed(g)!==4)throw Error('Fast start');g.stats.born=1;t.feeder=t.autoWC=1;if(maxSpeed(g)!==12)throw Error('Care did not unlock 12');
g.stats.sold=60;g.money=1000000;g.emp.farms.barn=1;g.emp.staff.tier=2;g.emp.proj.autopackm=1;g.emp.beta=.05;g.humans=100;g.kits.stock=0;g.kitPrice=250;for(var i=0;i<20;i++){g.day++;empireDay(g);}if(g.emp.fastUnlocked)throw Error('Thin margins unlocked 40');g.kitPrice=600;g.humans=2000;for(var i=0;i<20;i++){g.day++;empireDay(g);}if(g.emp.fastUnlocked||!g.emp.fastReady)throw Error('40 before a million owners');g.humans=1e6;g.day++;empireDay(g);if(!g.emp.fastUnlocked||maxSpeed(g)!==40)throw Error('Profitable business at a million owners did not unlock 40');
`);
check('industrial upgrades need real preceding stages and output', `
var g=readyGame();g.money=1e12;g.stats.sold=60;g.emp.proj.farmlic=1;if(farmOk(g,FARMS[2])||buyFarm(g,'hatch')||buyPackTier(g)&&buyPackTier(g))throw Error('Skipped chapter');
g.emp.proj.autopackm=1;g.kits.sold=10000;g.emp.farms.hatch=1;if(lineReady(g,1))throw Error('Skipped first robotic line');g.emp.staff.lines=1;if(!lineReady(g,1)||!buyLine(g,1))throw Error('Next packing tier inaccessible');
`);
check('capital purchases protect accrued annual tax', `
var g=readyGame();g.day=364;g.fin=[{d:363,kits:10000000,supplies:-1000000}];g.stats.sold=60;g.emp.farms.barn=1;g.emp.proj.farmlic=1;g.money=100000;
if(corporateTaxReserve(g)<700000||buyFarm(g,'rack')||buyProj(g,'guide'))throw Error('Spent tax reserve');
`);
check('marketing and shops develop gradually and staff still affect kit orders', `
var g=readyGame();g.stats.sold=200;g.emp.inf=10000;g.emp.proj.refer=1;g.humans=100;if(adReady(g,ADS.find(x=>x.id==='expo'))||shopOk(g,SHOPS[2])||buyProj(g,'unbox'))throw Error('Abrupt reveal');
g.kits.sold=100;if(!worldOpen(g)||!buyProj(g,'unbox'))throw Error('World inaccessible');var d=kitDemand(g);g.emp.staff.sales=1;if(Math.abs(kitDemand(g)/d-1.25)>.001)throw Error('Sales staff ignored kits');
g.money=100000;g.emp.shops.stall=1;g.emp.shopStage=0;if(!shopOk(g,SHOPS[1]))throw Error('Next shop inaccessible');
`);
check('partial historical milestone records do not replay old tutorials on chain migration', `
var g=readyGame();delete g.emp.chainVersion;g.day=2000;g.stats.sold=500;g.kits.sold=1000000;g.emp.farms.hatch=1;g.emp.won=2000;g.humans=WORLD;g.progress.seen={kit:true,farm:true,win:true};g.progress.queue=[];migrate(g);detectMilestones(g);if(g.progress.queue.some(x=>x!=='win'))throw Error('Replayed historical tutorial');
`);
check('AI sales retain the four-person bonus with a bounded operating bill', `
var g=readyGame();g.emp.staff.sales=4;var boost=salesBoost(g);g.money=1000000;g.emp.proj.aiconsult=g.emp.proj.drones=1;if(!goAI(g,'sales')||g.emp.staff.sales||salesBoost(g)!==boost)throw Error('Automation lost capability');g.emp.soldToday=100000000;if(staffCost(g)>300)throw Error('Token bill exceeded cap');
`);
check('Grandpa opening pauses a fresh run until the tank is accepted', `
var g=newGame(),cash=g.money;if(g.progress.queue[0]!=='intro'||stepGame(g)!==false||g.money!==cash||clock(g)!==0)throw Error('Intro did not pause');
if(acknowledgeMilestone(g)!=='intro'||!stepGame(g)||g.progress.queue.includes('intro'))throw Error('Cannot start gift');
`);
check('ten-year celebration snapshots progress once and allows continued play', `
var g=readyGame();g.day=DREAM_DAYS-1;g.step=3;g.money=100000;stepGame(g);if(g.day!==DREAM_DAYS||g.progress.queue[0]!=='tenyears'||!g.story.anniversary||g.story.tenYearAchieved)throw Error('Anniversary boundary wrong');
var time=clock(g);stepGame(g);if(clock(g)!==time)throw Error('Skipped celebration');acknowledgeMilestone(g);if(!stepGame(g))throw Error('Dream could not continue');var owners=g.story.anniversary.owners;g.humans=100;detectMilestones(g);if(g.story.anniversary.owners!==owners||g.progress.queue.includes('tenyears'))throw Error('Anniversary repeated or changed');
`);
check('ten-year achievement is inclusive and never awarded to a late finish', `
for(var d of [DREAM_DAYS-1,DREAM_DAYS,DREAM_DAYS+1]){var g=readyGame();g.day=d;g.emp.won=d;g.humans=WORLD;detectMilestones(g);if(g.story.tenYearAchieved!==(d<=DREAM_DAYS)||g.progress.queue.includes('tenyears'))throw Error('Wrong deadline outcome');}
`);
check('old journeys gain an archive without replaying story or inventing a ten-year score', `
var g=readyGame();delete g.story;g.day=4000;g.stats.born=10;g.stats.sold=1000;g.kits.sold=10000;g.humans=2000000;g.emp.farms.barn=1;g.progress.seen.hatch=g.progress.seen.sale=g.progress.seen.kits=g.progress.seen.kit=g.progress.seen.farm=true;migrate(g);detectMilestones(g);
if(g.progress.queue.length||!g.story.letters.million.historical||g.story.anniversary.owners!==null||g.story.tenYearAchieved)throw Error('Legacy story altered history');var saved=JSON.parse(JSON.stringify(g));migrate(saved);detectMilestones(saved);if(saved.progress.queue.length||saved.story.anniversary.owners!==null)throw Error('Story migration repeated');
`);
check('letters are saved at milestones and survive save/load without changing the clock', `
var g=readyGame();g.day=49;g.stats.born=5;detectMilestones(g);if(g.story.letters.hatch.day!==49||g.story.letters.kit)throw Error('Wrong letter unlock');g.progress.queue=[];g.day=60;detectMilestones(g);if(g.story.letters.hatch.day!==49)throw Error('Letter timestamp moved');var saved=JSON.parse(JSON.stringify(g));migrate(saved);if(saved.story.letters.hatch.day!==49||saved.day!==60)throw Error('Letter save lost');
`);
console.log(count+' focused balance and migration checks passed');
module.exports={engine,html};
