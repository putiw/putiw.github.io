const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
function engine(seed=7){const M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const c=vm.createContext({Math:M,console});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);vm.runInContext('function readyGame(){var g=newGame();acknowledgeMilestone(g);return g;}',c);return c;}
let count=0;function check(name,code){const c=engine();vm.runInContext(code,c);count++;console.log('PASS',name);}
check('opening is concise and the Tank goal preference survives saves',`
var intro=MILESTONES.intro.body,g=newGame();
if(intro.includes('You took him seriously.')||intro.includes('A tank for everyone. Ten years to try.'))throw Error('Opening still has the removed lines');
if(!GRANDMA_LETTERS.gift.body.includes('“Everyone on Earth?”')||!GRANDMA_LETTERS.gift.body.includes('Well, better get started. Let’s see what we can do in ten years.')||GRANDMA_LETTERS.gift.body.includes('You laughed'))throw Error('Grandma opening exchange is incorrect');
if(g.opt.goalOpen!==true)throw Error('New goal panel should start expanded');g.opt.goalOpen=false;
if(migrate(JSON.parse(JSON.stringify(g))).opt.goalOpen!==false)throw Error('Goal panel preference did not persist');
var old=newGame();delete old.opt.goalOpen;if(migrate(old).opt.goalOpen!==true)throw Error('Old saves need the expanded default');
`);
const tankStart=html.indexOf('<section class="panel" id="p-tank">'),marketStart=html.indexOf('<section class="panel" id="p-market"'),marketEnd=html.indexOf('<!-- UPGRADES -->'),goalCard=html.indexOf('id="ideas"'),apop=html.indexOf('id="apop"'),tradeColony=html.indexOf('id="trade-colcard"');
if(html.includes('id="next-card"'))throw Error('The goal card should be gone from the Tank tab');if(!(apop>=0&&apop<goalCard&&goalCard<tankStart&&tankStart<marketStart&&marketStart<tradeColony&&tradeColony<marketEnd))throw Error('Ideas belong in the info popup, Trade colony card in Trade');
if(html.includes('id="next-actions"')||html.includes('id="btn-gomarket"'))throw Error('Confusing Go-to CTA remains in the goal flow');
console.log('PASS ideas live in the info popup, navigation is tab-based and Trade includes the colony card');
if(html.includes('data-act="milestone-continue"')||!html.includes('>Got it<')||!html.includes('function setEmphasisText'))throw Error('Milestones should use one consistent paused action with readable emphasis');
console.log('PASS milestones use one paused next-step action and instructional text can emphasize key terms');
const tooltipMap=html.split('var PARAM_TIPS={')[1].split('};\nfunction initParameterTooltips')[0];
for(const id of ['nh','no2','no3','ph','kh','gh','temp','dens'])if(!tooltipMap.includes(id+':{name:'))throw Error('Missing cause tooltip for water parameter '+id);
if(!html.includes("addEventListener('click'")||!html.includes("e.key==='Enter'||e.key===' '")||!html.includes('Tap a water reading to see what raises or lowers it.'))throw Error('Water tooltips must open on tap and keyboard activation');
console.log('PASS all water readings explain what raises and lowers them on tap and keyboard activation');
if(html.indexOf('id="wccard"')>html.indexOf('id="wtcard"'))throw Error('Water care should appear before the water test');
console.log('PASS water care appears before the water test');
if((html.match(/data-act="wc"/g)||[]).length!==1||html.includes('id="btn-feed"')||html.includes('id="btn-scwc"'))throw Error('Feed and water actions should live only in the top action bar');
if(!/\.acts \.btn\{[^}]*min-height:4[4-9]px/.test(html))throw Error('Top feed, water and sell buttons should have a comfortable tap height');
if(!html.includes('details class="card" id="feedcard"')||!html.includes('details class="card" id="wtcard" open')||!html.includes("$('wtcard').open=waterStage!=='ready'")||!html.includes("$('tb-feed').classList.toggle('first-feed'"))throw Error('Feeding and stable readings should fold while the first feed is highlighted');
if(!html.includes("$('ideas').hidden=!idl.length"))throw Error('Ideas section should hide when there are no ideas');
if(!html.includes('id="tb-info"')||!html.includes('<div id="info-alerts"')||!html.includes('.apop .goalrow{'))throw Error('Alerts, owners and the year journal should live behind the ?/!/!! button');
console.log('PASS duplicate details fold away, header lines align and the first feed is highlighted');
if(!html.includes("+[['no3','NO₃'],['kh','KH'],['gh','GH'],['temp','Temp']]"))throw Error('Top readings should show nitrate, KH, GH and temperature in order');
if(!html.includes('#vwater{gap:3px;margin:0 0 0 auto;flex-wrap:nowrap;flex:0 0 auto}')||!html.includes('<div class="readrow" id="readrow">'))throw Error('Hunger, nutrition and water readings should share one compact line');
if(!html.includes("$('vitals').hidden=!sh;"))throw Error('Hunger and nutrition should show once there are shrimp');
console.log('PASS top readings show NO₃, KH, GH, pH and temperature');
const tradeStart=html.indexOf('id="sellcard"'),hist=html.indexOf('id="trade-colcard"'),sales=html.indexOf('id="trade-sales-rules"'),sellAge=html.indexOf('id="s-sellAge"'),sellAction=html.indexOf('id="btn-sellall"'),price=html.indexOf('id="s-price"'),salesDetails=html.indexOf('<summary>Sales details</summary>');
if(!(tradeStart>=marketStart&&tradeStart<hist&&hist<sales&&sales<sellAge&&sellAge<sellAction&&sellAction<price&&price<salesDetails&&salesDetails<marketEnd))throw Error('Trade should combine an independent colony histogram, sales rules, sell action, price and folded sales details in that order');
if(html.includes('id="rulescard"')||html.includes('id="trade-gradebars"')||html.includes('id="trade-gradeline"')||html.includes('id="trade-berried"'))throw Error('Merged Trade card should retain only the colony histogram from the old Colony panel');
if(!html.includes("$('sellcard').hidden=lt||!(sh&&(G.stats.born>0||G.stats.sold>0||G.opt.all))"))throw Error('Sales rules should appear as soon as the first shrimp are born');
if(!html.includes("f.hidden=!sh||!n.feed;w.hidden=!kit||!n.wc;se.hidden=!sh||!n.sell;")||!html.includes("feed:G.tanks.some(function(t){return !t.feeder;})")||!html.includes("sell:!(labMode()&&!G.opt.all)"))throw Error('Top Feed, Water and Sell actions should stay until every tank automates them, and Sell until shrimp all go to kits');
if(!html.includes("activeTab==='up'&&!G.opt.visitedUp")||!html.includes("g.tab==='up'&&o.visitedUp"))throw Error('Equipment tab guidance dot should be remembered as seen after visiting');
if(!html.includes("var CARD_GROUP={kits:'k',staff:'k',korder:'k'};"))throw Error('Sales rules and colony toggles should not be coupled by spotlight grouping');
console.log('PASS Trade combines independent colony/sales toggles; actions persist and Equipment dot clears after visit');
const goalRowStart=html.indexOf('<div class="goalrow">'),dreamSummary=html.indexOf('id="dream-tracker"'),infoPop=html.indexOf('<div class="apop" id="apop"');
if(!(infoPop>=0&&infoPop<goalRowStart&&goalRowStart<dreamSummary&&html.includes('id="b-goal-short"')))throw Error('Grandma year tracker should share the owners row inside the info panel');
console.log('PASS Grandma year tracker shares the progress row with a compact mobile progress label');
if(!html.includes('class="card coll" data-k="charts" id="charts"')||!html.includes('class="card coll" data-k="ads" id="adscard"'))throw Error('Delayed charts and advertising should fold when first revealed');
console.log('PASS delayed charts and advertising can fold when first revealed');
if(!html.includes('.coll.queued>:not(.hd){display:none!important}')||!html.includes('function promoteCardReveal(o)')||!html.includes('o.cardQueue.push({k:k,tab:activeTab})')||!html.includes('promoteCardReveal(o);render();')||!html.includes('var PROJ_SHOW=1,'))throw Error('New content should queue one at a time, focus the active card and advance when dismissed');
console.log('PASS newly revealed cards queue one at a time and fold other sections');
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
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.money=400;if(!buyPackTier(g)||!hasTool(g,'bag')||g.emp.staff.tier)throw Error('First packing tool failed');
if(hire(g,'pack',1))throw Error('Packers need the full packing station');g.money=10000;var n=0;while(buyPackTier(g)&&g.emp.staff.tier===0)n++;if(!stationDone(g)||g.emp.staff.tier!==1)throw Error('Five tools should complete the station');
if(g.emp.staff.pack!==0||staffCost(g)!==0||packCap(g)!==1)throw Error('Surprise payroll');g.money=400;
if(hire(g,'sales',1))throw Error('Unsafe hire');g.money=10000;if(!hire(g,'sales',1)||staffCost(g)!==130)throw Error('Safe hire failed');
`);
check('construction reserves, mothball, restart and sale are consistent',`
var g=readyGame(),f=FARMS.find(x=>x.id==='rack');g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.emp.proj.farmlic=1;g.money=f.cost;
if(buyFarm(g,'rack'))throw Error('Spent working capital');g.money=10000;if(!buyFarm(g,'rack'))throw Error('Build failed');
if(farmCap(g)!==1)throw Error('Wrong capacity');changeFarm(g,'rack','pause');if(farmCap(g)!==0||farmOverhead(g)!==0)throw Error('Mothball charges');
g.money=0;if(changeFarm(g,'rack','resume'))throw Error('Unsafe restart');g.money=10000;changeFarm(g,'rack','resume');var cash=g.money;changeFarm(g,'rack','sell');
if(g.money<=cash||farmCap(g)||g.emp.pausedFarms.rack>g.emp.farms.rack)throw Error('Sale inconsistent');
`);
check('automatic inventory respects reserve, target and zero-demand endgame',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.emp.farms.barn=5;g.emp.inventoryDays=3;g.money=10000;var r=operatingReserve(g);empireDay(g);
if(g.money<r||g.kits.stock>Math.ceil(3*kitDemand(g)))throw Error('Inventory overspend');
g.humans=WORLD;g.emp.proj.last=1;g.emp.regions=REGIONS.map(x=>x.id);g.kits.stock=0;empireDay(g);if(g.emp.prod!==0)throw Error('Produced with no demand');
`);
check('manual kits protect actual adult breeder cohorts',`
var g=readyGame(),t=g.tanks[0];g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.money=1000;t.set.keep=6;t.pop=[{age:100,n:6,g:30},{age:25,n:16,g:90}];
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
var g=readyGame();g.money=1e8;g.emp.proj.ministry=1;g.emp.proj.studio=1;g.emp.inf=1e9;g.emp.op.offer=['calm'];if(!runCampaign(g,'calm'))throw Error('Campaign failed');
if(!greenlight(g,0))throw Error('Film failed');for(var i=0;i<31;i++){g.day++;empireDay(g);}
if(!g.emp.op.recap||g.emp.op.recap.m<=0||!g.emp.filmRecap||g.emp.movie.n!==1)throw Error('Missing result');
if(!g.emp.ripple.log.some(function(x){return x.tx&&/Shrimpfather/.test(x.tx);}))throw Error('Films get a Shrimp Times review');
`);
check('finance shows operating margin separately from purchases',`
var g=readyGame();g.fin=[{shrimp:1000,farms:-100,logistics:-20,equipment:-9000,staff:-80}];
if(operatingNet(g)!==800)throw Error('Capital expense counted as payroll');
`);
check('queued milestones survive a saved-game round trip',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;detectMilestones(g);var saved=JSON.parse(JSON.stringify(g));migrate(saved);
if(!saved.progress.queue.includes('kits')||!progressionBlocked(saved))throw Error('Lost kit handoff');
var clock0=clock(saved);for(var i=0;i<120;i++)stepGame(saved);if(clock(saved)!==clock0)throw Error('Offline progression bypassed pause');
`);
check('legacy victory does not accrue offline overhead before review',`
var g=readyGame();delete g.progress;g.emp.won=2000;g.humans=WORLD;g.money=100;g.emp.farms.barn=3;migrate(g);var before=g.money;
for(var i=0;i<120;i++)stepGame(g);detectMilestones(g);
if(g.money!==before||!g.progress.queue.includes('win'))throw Error('Legacy winner charged overhead');
`);
check('experienced-player mode skips tutorials but still pauses at victory',`var g=readyGame();g.opt.all=true;g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;detectMilestones(g);if(g.progress.queue.length)throw Error('Tutorial not skipped');g.emp.won=200;detectMilestones(g);if(!g.progress.queue.includes('win'))throw Error('Victory skipped');`);
check('legacy navigation flags cannot complete a cycle or allow unsafe stocking',`
var g=readyGame();delete g.progress;g.day=4;g.ob.market=1;g.tanks[0].cycledAt=4;g.money=1000;migrate(g);
if(g.tanks[0].cycledAt!=null||safeToStock(g,g.tanks[0])||buyPack(g,g.tanks[0],0))throw Error('Unsafe legacy stocking');
var t=g.tanks[0];t.chem.bacA=t.chem.bacB=bacTarget(t);rememberCycle(g,t);t.chem.nh=2*t.vol;if(buyPack(g,t,0))throw Error('Stocked toxic water');t.chem.nh=t.chem.no2=0;if(!buyPack(g,t,0))throw Error('Safe stocking rejected');
`);
check('hatcheries supply shrimp and cannot bypass packing', `
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.money=100000;g.emp.farms.barn=1;g.emp.proj.farmlic=1;g.emp.beta=0;empireDay(g);
if(g.kits.stock||g.kits.sold||g.emp.rawShrimp<=0||g.emp.prod<=0)throw Error('Farm bypassed packing');
var raw=g.emp.rawShrimp,cash=g.money;if(manualPack(g,1)!==1||g.emp.rawShrimp!==raw-8||Math.abs(g.money-(cash-kitMaterials(g)))>1e-9)throw Error('Raw packing did not conserve resources');
`);
check('automatic packing respects labour, materials, holding and warehouse limits', `
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.kits.sold=100;g.money=1000000;g.emp.farms.hatch=1;g.emp.staff.tier=1;g.emp.beta=0;g.emp.acc=0;empireDay(g);
if(g.emp.packed>1||g.emp.rawShrimp>farmCap(g)*3*8||g.kits.stock>Math.ceil(kitDemand(g)*7))throw Error('Capacity bypass');
g.emp.rawShrimp=800;g.money=50;if(packRaw(g,10,false)!==0||g.emp.rawShrimp!==800)throw Error('Free materials');
`);
check('old farms retain packing exactly once, including mothballed assets and honest salvage', `
var g=readyGame();delete g.emp.chainVersion;g.emp.farms={hatch:2,ocean:1};g.emp.pausedFarms={hatch:1};g.kits.stock=123;g.kits.sold=10000;g.money=1000000;migrate(g);
var cap=packCap(g);if(cap!==50500||g.kits.stock!==123||farmSalvage(g,FARMS.find(x=>x.id==='ocean'))!==25000000)throw Error('Migration output or value changed');
migrate(g);if(packCap(g)!==cap)throw Error('Duplicate migration gift');
`);
check('shrimp-free ripple fires headlines in order with effects and a retraining fix', `
var g=readyGame();g.humans=5e5;g.kits.sold=2000;g.emp.q=0.9;g.emp.infOn=1;var f0=g.emp.op.m;for(var i=0;i<400;i++){g.day++;rippleDay(g);}
var R=g.emp.ripple;if(R.n<6||R.log[0].i!==0||R.log[3].i!==3||R.log[4].d<R.log[3].d)throw Error('Headlines out of order');
for(var k=0;k<12;k++)opinionDay(g);if(!(g.emp.op.m<f0))throw Error('Trawler headline should upset people');
g.humans=4e9;R.free=2.1e6;rippleDay(g);if(!rippleHas(g,'retrain')||!projAvail(g).some(p=>p.id==='retrain'))throw Error('Retraining not offered');
g.money=1e6;var before=g.emp.op.m;buyProj(g,'retrain');for(var k=0;k<12;k++)opinionDay(g);if(!(g.emp.op.m>before)||projAvail(g).some(p=>p.id==='harbors'))throw Error('Retraining should help, and close the other answer');
R.free=3e9;var inf=g.emp.inf;rippleDay(g);if(R.n!==RIPPLE.length||!(g.emp.inf>inf))throw Error('Late ripple incomplete');
if(regionCost(g,REGIONS[3])>=REGIONS[3].m)throw Error('Typhoon discount missing');
`);
check('bulk kit orders, honest feeding alerts and progress goals', `
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.kits.sold=12;g.money=1e5;g.humans=50;var t=g.tanks[0];
for(var i=0;i<5&&!g.korder;i++){g.day++;kitOrderDay(g);}if(g.korder)throw Error('Bulk orders need spare packing capacity');
g.emp.staff.tier=2;g.emp.staff.pack=2;g.emp.rawShrimp=8*400;g.korderNext=0;for(var i=0;i<5&&!g.korder;i++){g.day++;kitOrderDay(g);}if(!g.korder||g.korder.n<10)throw Error('No bulk order offered');
var o=g.korder;o.taken=true;g.kits.stock=o.n+5;g.emp.packed=o.n*2;var cash=g.money,own=g.humans;fillKitOrder(g);if(g.korder||g.kits.stock!==5||!(g.money>cash)||!(g.humans>own))throw Error('Bulk order fills from packing and ships when full');
g.emp.fastUnlocked=true;g.korderNext=0;g.day++;kitOrderDay(g);if(g.korder)throw Error('Bulk orders continue at 40x');
var g2=readyGame();g2.stats.born=1;g2.tanks[0].had=1;g2.ob.up=0;if(ideas(g2).length)throw Error('No ideas before the Equipment tab opens');g2.ob.up=1;var id2=ideas(g2);if(!id2.some(function(x){return x.k==='auto';})||!id2.some(function(x){return x.k==='home';}))throw Error('Early ideas should offer automation and making the tank nicer, side by side');if(id2.some(function(x){return /AED|\d+ L\b/.test(x.t);}))throw Error('Ideas should not name prices or exact items');
g2.tanks[0].feeder=1;g2.tanks[0].autoWC=1;if(ideas(g2).some(function(x){return x.k==='auto';}))throw Error('Automation idea should go once both are automated');if(ideas(g2).length>3)throw Error('At most three ideas');
`);
check('speeds unlock through care, automation and profitable fulfilment', `
var g=readyGame(),t=g.tanks[0];if(maxSpeed(g)!==4)throw Error('An empty cycling tank should allow 4x');buyPackFree(t,0);if(maxSpeed(g)!==2)throw Error('Shrimp in the tank should cap time at 2x');g.stats.born=1;t.feeder=t.autoWC=1;if(maxSpeed(g)!==2)throw Error('Tank care alone should not unlock 4x');
g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.money=1000000;g.emp.farms.barn=1;g.emp.staff.tier=2;if(maxSpeed(g)!==4)throw Error('First hatchery should unlock 4x');g.emp.proj.autopackm=1;g.emp.beta=.05;g.humans=100;g.webShop=true;g.ads=[{id:'yt',left:999,days:999,boost:6}];g.kits.stock=0;g.kitPrice=250;for(var i=0;i<20;i++){g.day++;empireDay(g);}if(g.emp.fastUnlocked)throw Error('Thin margins unlocked 40');g.kitPrice=600;g.humans=2000;for(var i=0;i<20;i++){g.day++;empireDay(g);}if(g.emp.fastUnlocked||!g.emp.fastReady)throw Error('40 before a million owners');g.humans=1.01e6;g.day++;empireDay(g);if(!g.emp.fastUnlocked||maxSpeed(g)!==12)throw Error('Profitable business at a million owners did not unlock 12');g.emp.won=1;if(maxSpeed(g)!==40)throw Error('Everyone with a tank should unlock 40x');
`);
check('industrial upgrades need real preceding stages and output', `
var g=readyGame();g.money=1e12;g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.emp.proj.farmlic=1;if(farmOk(g,FARMS[3])||buyFarm(g,'hatch')||(g.emp.tools={bag:1,catch:1,o2:1,seal:1,box:1},g.emp.staff.tier=1,buyPackTier(g)))throw Error('Skipped chapter');
g.emp.proj.autopackm=1;g.kits.sold=10000;g.emp.farms.hatch=1;if(lineReady(g,1))throw Error('Skipped first robotic line');g.emp.staff.lines=1;if(!lineReady(g,1)||!buyLine(g,1))throw Error('Next packing tier inaccessible');
`);
check('capital purchases protect accrued annual tax', `
var g=readyGame();g.day=364;g.fin=[{d:363,kits:10000000,supplies:-1000000}];g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.emp.farms.barn=1;g.emp.proj.farmlic=1;g.money=100000;
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
check('Grandma opening pauses a fresh run until the tank is accepted', `
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
var g=readyGame();delete g.story;delete g.emp.pains;g.day=4000;g.stats.born=10;g.stats.sold=1000;g.kits.sold=10000;g.humans=2000000;g.emp.farms.barn=1;g.progress.seen.hatch=g.progress.seen.sale=g.progress.seen.kits=g.progress.seen.kit=g.progress.seen.farm=true;migrate(g);detectMilestones(g);
if(g.progress.queue.length||!g.story.letters.million.historical||g.story.anniversary.owners!==null||g.story.tenYearAchieved)throw Error('Legacy story altered history');var saved=JSON.parse(JSON.stringify(g));migrate(saved);detectMilestones(saved);if(saved.progress.queue.length||saved.story.anniversary.owners!==null)throw Error('Story migration repeated');
`);
check('letters are saved at milestones and survive save/load without changing the clock', `
var g=readyGame();g.day=49;g.stats.born=5;detectMilestones(g);if(g.story.letters.hatch.day!==49||g.story.letters.kit)throw Error('Wrong letter unlock');g.progress.queue=[];g.day=60;detectMilestones(g);if(g.story.letters.hatch.day!==49)throw Error('Letter timestamp moved');var saved=JSON.parse(JSON.stringify(g));migrate(saved);if(saved.story.letters.hatch.day!==49||saved.day!==60)throw Error('Letter save lost');
`);
check('clean-water lifespans and breeder slots filled from young shrimp',`
var g=readyGame(),T=g.tanks[0];
function survive(days){var s=1;for(var a=0;a<days;a++){var b=a<10?0.004:a<30?0.0015:a<75?0.0008:0.0004+(a>540?(a-540)*0.000069:0);s*=1-b;}return s;}
if(Math.abs(survive(75)-0.9)>0.02||Math.abs(survive(365)-0.8)>0.02||Math.abs(survive(730)-0.2)>0.03)throw Error('Clean-water lifespan targets: 90% adult, 80% one year, 20% two years');
T.pop=[{age:60,n:50,g:80},{age:90,n:5,g:80}];T.set.keep=40;T.set.sellAge=45;T.set.cull=0;
var p=breederProtection(T),held=0;p.forEach(function(n){held+=n;});if(Math.round(held)!==40)throw Error('Young shrimp should fill breeder slots: held '+held);
`);
if(!html.includes("var old=rd(G,'longevity')?630:540,base=a<10?0.004:a<30?0.0015:a<75?0.0008:0.0004+(a>old?(a-old)*0.000069:0);"))throw Error('Mortality curve changed without updating the lifespan check');
check('owners’ tanks: welfare, kit design, climate, feed, water and shrimp prices in AED',`
var g=newGame();g.ob.kit=1;g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.kits.sold=60;g.humans=2e5;g.money=5e8;g.emp.regions=['auh','dxb','uae','gcc','mena','eu'];
if(!(regionMix(g).cold>0.3))throw Error('Europe should bring cold winters');
var before=welfareTarget(g);if(!buyWelfare(g,'winter'))throw Error('Winter kits');if(!(welfareTarget(g)>before))throw Error('Winter kits should help');
var m0=kitMaterials(g);if(buyWelfare(g,'moss'))throw Error('Moss kits need moss in your own tank first');g.tanks[0].moss=1;if(!buyWelfare(g,'moss'))throw Error('Moss kits');if(kitMaterials(g)!==m0+12||kitDesign(g)!==1)throw Error('Moss kits cost AED 12 more');
setKitDesign(g,0);if(kitMaterials(g)!==m0)throw Error('Basic design should drop the extra cost');
g.kitPrice=100;g.emp.commit=commitOf(100);if(!(welfareTarget(g)<0.6))throw Error('Very cheap kits should lower welfare');
g.emp.wel=0.3;var h=g.humans;welfareDay(g);if(!(g.humans<h&&g.emp.lapsed>0))throw Error('Struggling owners should lapse');
g.emp.wel=0.9;if(!(welfareMult(g)>1.1))throw Error('Thriving owners should refer more');
var f=fairShrimpPrice(g);g.priceAED=f*1.5;g.market.m=1.2;g.price=clamp(g.priceAED/fairShrimpPrice(g),0.5,3);if(Math.abs(g.price*fairShrimpPrice(g)-f*1.5)>1e-9)throw Error('An AED shrimp price must hold as mood moves');
g.emp.won=1;g.emp.farms={rack:3};var raw=g.emp.rawShrimp;empireDay(g);if(g.emp.rawShrimp>raw)throw Error('Farms stop breeding kit stock after the win');
var w=WORLDS[0];if(!w.wild||!/let into|let them go|live free|released/.test(w.why))throw Error('Space worlds should end with free-living shrimp');
`);
check('hand packing, packing tools, health checks, treats and story choices',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.money=10000;var t=g.tanks[0];t.had=1;t.pop=[{age:60,n:80,g:80},{age:120,n:30,g:80}];t.set.keep=10;
var taps=0,r;do{r=handStep(g);taps++;}while(!r.kit&&taps<10);if(!r.kit||taps!==5||g.kits.stock!==1)throw Error('A hand-packed kit takes five taps: '+taps);
if(!buyTool(g,'bag')||!buyTool(g,'catch'))throw Error('Tools');taps=0;do{r=handStep(g);taps++;}while(!r.kit&&taps<10);if(taps!==3)throw Error('Two tools should leave three taps: '+taps);
['o2','seal','box'].forEach(function(id){buyTool(g,id);});if(!stationDone(g)||g.emp.staff.tier!==1||packCap(g)!==1)throw Error('Five tools make the packing station');
taps=0;do{r=handStep(g);taps++;}while(!r.kit&&taps<10);if(taps!==1)throw Error('With the station a kit is one tap');
t.ill={type:'molt',day:0,days:0,sev:1,sick:4};if(treatIll(g,0,'salt',1)!=='wrong'||!t.ill)throw Error('Wrong cure should not help');if(treatIll(g,0,'minerals',1)!=='cured'||t.ill)throw Error('Right cure with a good search heals');
t.ill={type:'bact',day:0,days:0,frac:0.4};if(treatIll(g,0,'water',0.4)!=='partial'||!t.ill||!(t.ill.frac<0.4))throw Error('Missed sick shrimp should leave a smaller outbreak');
t.ill={type:'scut',day:0,days:0,frac:0.3};if(treatIll(g,0,'salt',1,{ok:false,loss:0})!=='partial'||!t.ill)throw Error('A short salt dip leaves flatworms');if(treatIll(g,0,'salt',1,{ok:true,loss:0})!=='cured'||t.ill)throw Error('A good salt dip cures flatworms');
if(!giveTreat(g,0,'pollen')||giveTreat(g,0,'pollen')||!giveTreat(g,0,'spinach')||Math.abs(treatMult(t)-1.15*1.05)>1e-9)throw Error('Treats stack, one of each; pollen boosts breeding');
var w0=g.emp.op.pend.length;if(!storyChoose(g,'ev_paper',0)||!(g.emp.op.pend.length>w0)||!g.ads.some(function(a){return a.id==='press';}))throw Error('Story choice should apply its effect');
['hatch','kits','farm','million'].forEach(function(k){if(!MILESTONES[k].chapter)throw Error('Chapter missing: '+k);});
['tanks2','health','tools','station','bulk','worldtab','ripple'].forEach(function(k){if(!MILESTONES[k].intro)throw Error('Feature intro missing: '+k);});
`);
{const g=html.slice(html.indexOf('function guideTarget(){'),html.indexOf('function applyGuide(){'));
if(!g||!html.includes('applyGuide();spotWatch();\n}')||g.indexOf("bottleneck(G)")<0||g.indexOf("consultHas(G,'fix')")>g.indexOf("bottleneck(G)")||/bnText\(G\)/.test(g.slice(0,g.indexOf("consultHas(G,'diag')"))))throw Error('The guide must run each render and only use bottleneck advice the player has paid for');
if(!html.includes('id="guidebar"')||html.includes('bar.dataset.tab'))throw Error('Guide bar must not reuse data-tab, which tab code selects on');
if(!g.includes("key:'feed1',tab:'tank'")||!g.includes("key:'sell',tab:'tank'"))throw Error('Feed and sell guidance must navigate to the Tank action bar');
console.log('PASS guide points at one next step and keeps bottleneck advice behind the consultancy');}
check('untreated illness spreads, fades colour and wipes the tank; moving and buying spread it',`
var f1=newGame(),t1=f1.tanks[0];buyPackFree(t1,2,60);t1.had=1;startIll(f1,t1,'bact');for(var d=0;d<90&&t1.ill;d++)illDay(f1,t1,0);if(t1.crashed||totalN(t1)<1||t1.ill)throw Error('The first illness passes without wiping the tank');
var g=newGame(),t=g.tanks[0];g.emp.healed=1;g.stats.sold=5;buyPackFree(t,2,60);t.had=1;var g0=adultGrade=t.pop[0].g;startIll(g,t,'bact');var f0=t.ill.frac;
for(var d=0;d<20;d++)illDay(g,t,0);if(!(t.ill.frac>f0*3))throw Error('Illness should spread when untreated');if(!(t.pop[0].g<g0))throw Error('Sick shrimp should lose colour');
var n20=totalN(t);for(d=0;d<80&&t.ill;d++)illDay(g,t,0);if(t.ill||totalN(t)>=1||!t.crashed)throw Error('An untreated outbreak should crash the whole tank');
var a=g.tanks[0];buyPackFree(a,2,40);var b=newTank(1);g.tanks.push(b);startIll(g,a,'scut');a.ill.frac=0.4;moveShrimp(g,a,b,5);if(!b.ill)throw Error('Moving sick shrimp should spread it');
var c=newTank(2);g.tanks.push(c);g.money=500;c.had=1;buyPack(g,c,0);if(c.fresh||c.newStock==null)throw Error('New stock raises risk, no dip');
var e=g.tanks[0];e.pop=[];e.ill=null;g.tanks.forEach(function(x){x.pop=[];x.ill=null;});g.money=2;g.day=500;dayRollover(g);if(totalN(g.tanks[0])<1)throw Error('Grandma should restart a broke player with no shrimp');
`);
check('quality checks: manual rounds, automation in order, strictness trade-off',`
var g=newGame();g.emp.kitsOpened=1;g.stats.sold=KIT_UNLOCK;g.kits.sold=5;var r0=sickKitRate(g);if(!(r0>0.1)||qcCoverage(g)!==0)throw Error('Unchecked kits should often ship sick');
if(nextQC(g))throw Error('Automation should wait until the first manual round');
qcRound(g,{water:1,look:1,dip:1});if(!(sickKitRate(g)<r0*0.4))throw Error('A good QC round should cut sick kits');
g.day+=50;if(qcFresh(g)!==0||!qcDue(g))throw Error('A QC round should expire after about 45 days');
g.money=1e6;if(buyQC(g,'look'))throw Error('Automation must be bought in order');if(!buyQC(g,'water')||!g.qc.own.water)throw Error('Water sensors should install');
['look','dip'].forEach(function(id){buyQC(g,id);});if(qcManual(g).length||qcDue(g))throw Error('Fully automated checks need no manual round');
var m1=kitMaterials(g);setQCStrict(g,2);if(!(kitMaterials(g)>m1))throw Error('Strict checks should cost more per kit');var rs=sickKitRate(g);setQCStrict(g,0);if(!(sickKitRate(g)>rs))throw Error('Relaxed checks should let more sick kits through');
`);
if(html.includes("needs '+big(nextLine.sold)")||html.includes('show up once your first three tanks')||html.includes('Bacteria starter unlocks when'))throw Error('Unlock rules should not be shown');
if(!html.includes("if(!g||g.bar===false||!g.text||inCard||g.soft||"))throw Error('Soft hints belong in the popup, not the bar');
if(!html.includes("if(SPOT||SPOTQ.length||Date.now()-(spotWatch.last||0)<15000)return;"))throw Error('One spotlight at a time');
check('player decides: room-based gates, any mix of tanks',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;var t=g.tanks[0];t.had=1;t.vol=80;t.volTier=2;t.pop=[{age:100,n:20,g:60}];if(!kitsOpen(g))throw Error('One 80 L tank should be enough room for kits');
t.vol=40;t.volTier=1;if(kitsOpen(g))throw Error('Kits still need some room');
`);
check('hired salespeople sell surplus without an extra toggle',`
var g=readyGame();g.stats.sold=5;g.money=5000;var t=g.tanks[0];t.had=1;t.pop=[{age:120,n:60,g:60},{age:30,n:20,g:60}];t.set.keep=20;
if(!hire(g,'sales',1))throw Error('Hiring failed');if(!t.set.autoSell)throw Error('Hiring sales should switch on selling');
var n0=totalN(t);dayRollover(g);if(!(totalN(t)<n0-1))throw Error('Salesperson did not sell surplus: '+n0+' -> '+totalN(t));
`);
if(!html.includes("else if(activeTab!=='space'){$('tankchips').hidden=G.tanks.length<2||!!G.recipe||ownTank(G);}"))throw Error('Tank buttons must come back after business tabs, so every tank can be picked');
if(!html.includes("business=inBiz&&(topAway(G)||labMode())"))throw Error('Top bar tank buttons leave the business tabs once tanks are done or farms carry the business');
check('consultants are paid per visit: 20% of cash, at least AED 20,000, 30 days',`
var g=readyGame();g.emp.kitsOpened=1;g.money=50000;if(consultCost(g)!==20000)throw Error('Minimum is AED 20,000');g.money=500000;if(consultCost(g)!==100000)throw Error('20% of cash');
if(!buyConsult(g,'visit')||g.money!==400000||!consultHas(g)||buyConsult(g,'visit'))throw Error('One paid visit at a time');g.day+=31;if(consultHas(g))throw Error('A visit lasts 30 days');
`);
if(html.includes('class="idea" data-tab='))throw Error('Ideas must not reuse data-tab');
check('first ad is there as soon as Marketing opens; health check shuffles sick shrimp',`
var g=readyGame();g.stats.sold=0;if(!adReady(g,ADS.find(a=>a.id==='fb')))throw Error('First ad should be ready before the first sale');
`);
if(!html.includes("for(var q=cells.length-1;q>0;q--)"))throw Error('Health check cells should be shuffled');
check('glass algae grows and sickness risk follows tank condition',`
var g=readyGame();var t=g.tanks[0];t.had=1;t.pop=[{age:120,n:40,g:60}];t.cycledAt=0;
for(var d=0;d<30;d++)glassGrow(g,t);var m30=glassMean(t);if(!(m30>0.05&&m30<0.6))throw Error('Algae after a month should be visible but not full: '+m30);
var r0=illRisk(g,t);t.glass=t.glass.map(()=>0);var rClean=illRisk(g,t);if(!(r0>rClean))throw Error('Dirty glass should raise risk');
t.chem.gh=3;if(!(illRisk(g,t)>rClean))throw Error('Soft water should raise risk');t.chem.gh=7;
t.leaves=1;if(!(illRisk(g,t)<rClean))throw Error('Almond leaves should lower risk');t.leaves=0;
for(d=0;d<200;d++)illDay(g,t,0);if(t.ill)throw Error('Illness should only start from the play-time schedule');
if(!illRandom(g)||!t.ill)throw Error('Scheduled illness should start in a stocked tank');if(illRandom(g))throw Error('Only one sick tank at a time');
`);
check('treats unlock once, then renew weekly from Feeding',`
var g=readyGame();g.money=200;var t=g.tanks[0];t.had=1;t.pop=[{age:120,n:40,g:60}];
if(unlockTreat(g,'pollen')!==true||g.money!==180||unlockTreat(g,'pollen'))throw Error('Unlock costs AED 20 once');
unlockTreat(g,'spinach');t.set.treats={pollen:true,spinach:true};dayRollover(g);if(!treatOn(t,'pollen')||!treatOn(t,'spinach'))throw Error('Weekly treats should start the next day, together');
for(var d=0;d<7;d++)dayRollover(g);if(!treatOn(t,'pollen'))throw Error('Weekly treat should renew');
var o=readyGame();o.tanks[0].treat={id:'flakes',left:3};delete o.tanks[0].treats;o.tanks[0].set.treat='pollen';delete o.tanks[0].set.treats;migrate(o);if(!o.tanks[0].treats||o.tanks[0].treats.flakes!==3||!o.tanks[0].set.treats.pollen||'treat' in o.tanks[0])throw Error('Old single treat should migrate');
`);
{const seen={},dup=[];(html.match(/(?:^|[\n;{}])function ([A-Za-z0-9_$]+)\(/g)||[]).forEach(m=>{const n=m.replace(/^[\n;{}]?function /,'').slice(0,-1);if(seen[n])dup.push(n);seen[n]=1;});if(dup.length)throw Error('Duplicate function names override each other: '+dup.join(', '));}
if(!html.includes('id="tv-check"')||!html.includes('id="tv-clean"'))throw Error('Tank tap should offer Check shrimp and Clean tank');
{const scripts=html.match(/<script>([\s\S]*?)<\/script>/g)||[];scripts.forEach((x,i)=>{try{new Function(x.replace(/^<script>|<\/script>$/g,''));}catch(e){throw Error('Script '+i+' does not parse: '+e.message);}});}
{const tp=html.slice(html.indexOf('function tips(T){'),html.indexOf('function tips(T){')+4000);if(/in debt|Cash runs out/.test(tp.slice(0,tp.indexOf('\nfunction ',10))))throw Error('Tank alerts should not include money');if(!html.includes("var ea=cashTips().concat(empTips())"))throw Error('Money alerts go with the business alerts');}
if(!html.includes("TVM.dacc=(TVM.dacc||0)+dd/N*TVM.ag.length"))throw Error('Visible deaths should be in proportion to real ones');
check('Shrimp Times opens with kit-count stories',`
var g=readyGame();g.humans=30;g.kits.sold=24;rippleDay(g);if(rip(g).n!==0)throw Error('No story before 25 kits');g.kits.sold=25;rippleDay(g);if(rip(g).n!==1||!/Shrimp Times/.test(RIPPLE[rip(g).log[0].i].t))throw Error('First story at 25 kits');
g.kits.sold=1000;rippleDay(g);if(rip(g).n!==3)throw Error('500 and 1000 kit stories');
var o=readyGame();o.emp.ripple={free:2e4,n:1,log:[{i:0,d:5}],seen:1};var R=rip(o);if(R.n!==4||R.log[0].i!==3||R.v!==2)throw Error('Old saves keep their place in the story list');
`);
if(html.includes("'Next story at '"))throw Error('No spoilers about the next story');
check('robots and AI replacing staff make the news, once',`
var g=readyGame();g.humans=50;g.kits.sold=100;newsEvent(g,'aisales');newsEvent(g,'aisales');var R=rip(g);if(R.log.length!==1||newsText(R.log[0]).indexOf('AI agents')<0)throw Error('One AI story');var g0=readyGame();g0.humans=50;newsEvent(g0,'aisales');newsLine(g0,'Something happens.');if(rip(g0).log.length!==0||!g0.notes||g0.notes.list.length!==2||g0.notes.list[0].k!=='word')throw Error('No Shrimp Times before the World tab opens, news becomes word of mouth');
`);
check('influence starts with Mira, never before',`
var g=readyGame();gainInf(g,50);if(g.emp.inf!==0||g.emp.infTotal!==0)throw Error('No influence before Mira');
if(!MILESTONES.ev_mira.body.includes('influence'))throw Error('Mira explains influence');
storyChoose(g,'ev_mira',2);if(!g.emp.infOn||!(g.emp.inf>0))throw Error('Any Mira choice starts influence');
var old=readyGame();old.emp.infTotal=40;delete old.emp.infOn;old=migrate(JSON.parse(JSON.stringify(old)));if(!old.emp.infOn)throw Error('Old saves keep influence');
`);
check('choices: one answer closes the other, cold answers cost heart and pay off',`
var g=readyGame();g.emp.infOn=1;g.kits.sold=200;g.money=1e6;g.emp.inf=1e4;
var ids=projAvail(g).map(p=>p.id);if(ids.indexOf('shipwarm')<0||ids.indexOf('shipcheap')<0)throw Error('Both shipping answers offered');
var m0=kitMaterials(g);if(!buyProj(g,'shipcheap')||buyProj(g,'shipwarm')||projAvail(g).some(p=>p.fk==='ship'))throw Error('One answer per question');
if(!(g.emp.heart<0)||!(kitMaterials(g)<m0))throw Error('Cheap shipping saves money and costs heart');
// science is wonder or use, not kind or cold, so it has no heart either way
Object.keys(FORK_Q).forEach(function(fk){var o=forkOpts(fk);if(o.length<2)throw Error('Question needs two answers: '+fk);if(fk!=='science'&&!o.some(p=>(p.h||0)>0)||!o.some(p=>(p.h||0)<=0))throw Error('Needs a kind and a cold answer: '+fk);});
PROJ.filter(p=>p.c==='cult'||p.c==='fork').forEach(function(p){if(p.c==='cult'&&!p.t)throw Error('World project without a track: '+p.id);});
if(!PROJ.some(p=>p.t==='uni'&&p.m>0&&p.i>0)||!PROJ.some(p=>p.t==='pol'&&!p.m&&p.i>0)||!PROJ.some(p=>p.t==='nature'&&p.m>0&&!p.i))throw Error('Costs should mix money and ✦ by item');
`);
check('cold deals pay every day, bad deeds can surface later in the news',`
var g=readyGame();g.emp.infOn=1;g.humans=2e6;g.money=1e7;g.emp.proj.filtercart=1;var m=g.money;dealsDay(g);if(!(g.money>m))throw Error('Cartridges pay daily');
g.kits.sold=Math.max(g.kits.sold,100);g.emp.later=[{d:Math.floor(g.day),t:'An algae bloom turns the river green.',m:-6}];var n=rip(g).log.length;laterDay(g);if(rip(g).log.length!==n+1||g.emp.later.length)throw Error('Delayed story prints once');
g.emp.proj.paperbuy=1;newsLine(g,'Something happened.');if(!/owner/.test(newsText(rip(g).log[rip(g).log.length-1])))throw Error('An owned paper flatters you');
`);
check('one public mood, honest and pushy campaigns, no Water or Fire left',`
var g=readyGame();g.emp.proj.ministry=1;drawOffer(g);var o=g.emp.op.offer.map(id=>MSGS.find(m=>m.id===id));
if(!o.some(m=>(m.h||0)>=0)||!o.some(m=>(m.h||0)<0))throw Error('Offer mixes honest and pushy');
if(g.emp.op.w||g.emp.op.f||typeof g.emp.op.m!=='number')throw Error('Single mood');
var old=readyGame();old.emp.op={w:{s:0.5,i:0.6},f:{s:0.5,i:0.4},pend:[{w:.01,f:0,cv:0,left:3}],used:{},offer:null,n:0,run:null};old=migrate(JSON.parse(JSON.stringify(old)));if(Math.abs(old.emp.op.m-0.5)>1e-9||old.emp.op.pend.length)throw Error('Old two-faction saves migrate');
`);
if(/Water interest|Fire interest|Water and Fire/.test(html))throw Error('Water/Fire text left');
check('research starts with a cheap postdoc and opens at 3,000 kits',`
var g=readyGame();g.kits.sold=ACADEMY_AT-1;if(academyOpen(g))throw Error('Too early');g.kits.sold=ACADEMY_AT;if(!academyOpen(g))throw Error('Opens at '+ACADEMY_AT+' kits');
var o=grantOffer(g);if(o.usd!==50000||o.cost!==Math.round(50000*USD)||o.days!==365)throw Error('Postdoc first, USD 50k');g.money=2e5;fundAcademy(g);if(grantOffer(g).usd!==150000)throw Error('PhD next, USD 150k');
if(STUDIES[0].id!=='automation'||!STUDIES[0].req(g))throw Error('Automation study first');
`);
check('the ending reads the path you took',`
if(PROJ.filter(p=>p.end).length<20)throw Error('Ending lists what you did');
`);
check('blackout replacements unlock an optional kit battery with a real cost and survival effect',`
var g=readyGame();g.money=1e10;g.emp.infOn=1;g.emp.inf=1e8;var q=effectiveQuality(g),c=productionUnitCost(g);
if(!card3Choose(g,'c_blackout',1)||!g.emp.batteryKitUnlocked)throw Error('Replacement choice should unlock the kit add-on');
g.emp.batteryKit=true;if(Math.abs(productionUnitCost(g)-c-35)>1e-7)throw Error('Battery should add AED 35 to each kit');
if(Math.abs(effectiveQuality(g)-q-0.02)>1e-7)throw Error('Battery should add two survival points');
g.emp.q=1.11;if(effectiveQuality(g)!==0.98)throw Error('Survival stays capped at 98% with the battery');
`);
if(!html.includes('id="battery-kit-upgrade"')||!html.includes('data-act="battery-kit"'))throw Error('Optional battery needs a control in Starter kits');
if(/;\s[a-z]/.test(JSON.stringify(eval('('+fs.readFileSync(path.join(__dirname,'../shrimp/ending-playtest-data.js'),'utf8').replace(/^window\.ENDING_TEST_DATA = /,'').replace(/;\s*$/,'')+')').cards)))throw Error('No semicolons in late-game card text');
if(!html.includes('function endingVerdict(G)')||!html.includes('What the world looks like'))throw Error('Ending shows what the world became');
const storyData={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../shrimp/ending-playtest-data.js'),'utf8'),storyData);
{const D=storyData.window.ENDING_TEST_DATA,cash=D.cards.find(x=>x.id==='c_cash'),war=D.cards.find(x=>x.id==='c_war');if(!cash||/shrimp as cash|legal tender/.test(cash.body)||war)throw Error('Ending preview should match the game text (the war is a hard-part group now)');}
if(!storyData.window.ENDING_TEST_DATA.forks.find(x=>x.id==='kids').options[1].label.includes('no ads to kids'))throw Error('Kids sponsorship choice should make its distinction clear');
check('time away stops when a tank gets sicker or loses shrimp, and pain cards always leave one way out',`
var g=readyGame(),T=g.tanks[0];g.emp.won=0;T.pop=[{n:100,age:60,sex:'f'}];T.ill=null;
var day=0,mode='sick';stepGame=function(G){G.day+=0.25;day++;if(mode==='sick'&&day===8)T.ill={type:'bact',day:G.day,days:0,frac:0.2,st:2};if(mode==='die'){T.pop[0].n-=2;G.stats.died=(G.stats.died||0)+2;}if(mode==='pack')T.pop[0].n-=2;if(mode==='again'&&day===4)T.ill={type:'bact',day:G.day,days:0,frac:0.2,st:2};return true;};
maxSpeed=function(){return 4;};
var r=awayRun(g,3600,4);if(!r||!r.why||!/got sick/.test(r.why)||r.days>3)throw Error('Away time should stop when a tank gets sick: '+JSON.stringify(r));
mode='die';day=0;T.ill=null;T.pop=[{n:100,age:60,sex:'f'}];r=awayRun(g,3600,4);if(!r||!/dying/.test(r.why)||totalN(T)<80)throw Error('Away time should stop when shrimp die: '+JSON.stringify(r));
mode='pack';day=0;T.pop=[{n:100,age:60,sex:'f'}];var d0=g.day;r=awayRun(g,3600,4);if(!r||r.why||Math.round(g.day-d0)!==30)throw Error('A quiet tank gets the full 30 days: '+JSON.stringify(r));
mode='again';day=0;T.pop=[{n:100,age:60,sex:'f'}];T.ill={type:'bact',day:-50,days:9,frac:0.2,st:2};r=awayRun(g,3600,4);if(!r||!/got sick /.test(r.why))throw Error('A new illness at the same stage should stop away time: '+JSON.stringify(r));
if(awayRun(g,30,4)!==null||awayRun(g,3600,0)!==null)throw Error('Short gaps and a paused game get no away time');
var h=readyGame();h.money=-1;var ids=Object.keys(PAINS);ids.forEach(function(id){var ok=PAINS[id].ch.some(function(c,i){var x=JSON.parse(JSON.stringify(h));return painPick(x,id,i);});if(!ok)throw Error('Pain card '+id+' has no choice at AED -1');});
h.money=1e9;if(!painPick(JSON.parse(JSON.stringify(h)),ids[0],PAINS[ids[0]].ch.length-1))throw Error('Pain choices still work with money');
var reset=migrate(newGame());if(!reset.progress.v8)throw Error('A fresh migrated game should carry the newest progress marks');
`);
if(!html.includes('G=migrate(newGame());seenNew=null;'))throw Error('Start over must build the game the same way a first load does');
if(!html.includes("['pointerup','touchend','click','keydown'].forEach(function(ev){document.addEventListener(ev,musicKick,true);});"))throw Error('Sound must unlock on finger-up taps and retry on every tap');
if(!/function save\(force\)\{if\(document\.hidden&&!force\)return;/.test(html)||!html.includes('catchUp(G,(Date.now()-at)/1000,speed)'))throw Error('No saving while hidden, and coming back from the background catches up');
if(!html.includes("else if(c.stop)setSpeed(0);")||!html.includes('if(cu.stop)G.savedSpeed=0;')||!html.includes('if(document.hidden)HIDDEN_AT=Date.now();')||!html.includes('Date.now()-MUS.fail>60000'))throw Error('A stopped catch-up pauses the game, a page loaded hidden still catches up, and failed sound loads back off');
check('Grandma helps a player who spent everything before the first shrimp',`
var g=readyGame(),T=g.tanks[0];g.progress.queue=[];T.cycledAt=1;safeToStock=function(){return true;};g.money=5;g.stats.giftDay=null;T.had=0;
for(var i=0;i<12;i++){g.progress.queue=[];g.money=5;stepGame(g);}
if(totalN(T)<1||!g.log.some(function(l){return /these are on me/.test(l.t);}))throw Error('Grandma should drop off shrimp once the water is ready and money is short');
`);
if(!html.includes(".opsrow select{font:500 16px")||!html.includes("#speed button,.tabs button,#guidebar,.newsflash,.top button{touch-action:manipulation}"))throw Error('iPhone should not zoom on the Operating dropdowns or on fast taps');
if(!html.includes("localStorage.setItem(saveKey+'-bak-'+Date.now(),r)")||!html.includes("function checkBuild(){if(!/^https?:/.test(location.protocol)||document.hidden)return;"))throw Error('A save that fails to load is kept, and a hidden tab skips update checks');
if(!html.includes("renderMilestone.last==='tenyears'&&$('milestone-card')"))throw Error('Nothing pops over the ten-year ending');
check('late game: 40x with the hard part, dark projects can be turned down, farms keep the best bloodline, one card jumps the line',`
var g=readyGame();g.emp.hard={open:1,goal:'home',picks:{}};if(maxSpeed(g)!==40)throw Error('40x opens with the hard part');
var pol=PROJ.filter(function(p){return p.id==='buypol';})[0];g.emp.regions=['auh','dxb','uae','gcc'];g.kits.sold=1e6;g.emp.kitsOpened=1;
if(!projDecline(g,'buypol')||projAvail(g).some(function(p){return p.id==='buypol';}))throw Error('Turning down the politician takes him off the list');
if(projDecline(g,'landfarm'))throw Error('One side of a choice is not turned down on its own');
var m=readyGame();m.labQuality=0.2;labCandidate=function(){return 0.9;};m.progress.queue=[];for(var i=0;i<5;i++){m.progress.queue=[];stepGame(m);}if(m.labQuality<0.89)throw Error('Farms should follow the best home bloodline without certifying');
for(var j=0;j<50;j++)if(paceGap(0)<60000||paceGap(12)<60000)throw Error('At least a minute between story cards');
if(STORY_FIRST.indexOf('coin_offer')<0)throw Error('The Shrimpcoin offer should not wait behind other decisions');
var o=readyGame();o.emp.hard={open:1,goal:'want',picks:{}};migrate(o);if(!o.emp.hard.goalOk||o.emp.hard.at!==HARD.length)throw Error('An old save already in the hard part skips the walk-through');
var n=readyGame();n.emp.hard={open:1,goal:'home',picks:{}};migrate(n);if(n.emp.hard.goalOk)throw Error('A fresh hard part starts with the goal');
`);
if(!html.includes("data-act=\"hard-next\"")||!html.includes("Before the groups, decide what “everyone” means.")||!html.includes("move('lab-card','up',false);")||!html.includes("wrap.hidden=true;$('p-up').appendChild(wrap)")||!html.includes("salesOpen(G)&&!salesDone(G)"))throw Error('Hard part walk-through, no lab certification, no home-tank gear after hatcheries, no idle Sales card');
if(/' of '\+l\.finds\.length\+' found/.test(html))throw Error('Research has no total to find');
check('one tree a tap, others plant slowly for the coin, research opens Space',`
var g=readyGame();g.humans=4e9;var C=coinOf(g);C.on=1;C.honest=1;C.price=30;g.money=1e12;
if(coinPlantBatch(g)!==COIN_TREE)throw Error('One tree a tap');
for(var d=0;d<30;d++){g.day+=1;coinDay(g);}if((C.otrees||0)>0.0002*3*g.humans*30*1.2+1)throw Error('Others plant at most 0.06% of people a day');
var s=readyGame();s.emp.won=1;s.academy=s.academy||{};s.academy.papers=45;if(!spaceOpen(s))throw Error('Years of research should open Space after Earth');s.academy.papers=3;s.academy.level=1;treesFor=function(){return [];};if(spaceOpen(s))throw Error('Without research or the curious path, no Space');
`);
if(!html.includes('id="after"')||!html.includes("showAfter(slab,stx,aft)")||!html.includes("if(pp&&pp.fk){showAfter(pp.name,pp.d,kindNote());}"))throw Error('Decisions show what happened afterwards, in a popup');
if(!html.includes("var renderInner=render;render=function(){var a=anchorGet();renderInner.apply(this,arguments);anchorFix(a);settleScan();};")||!html.includes('SETTLE_MS=500'))throw Error('The screen holds still under the finger and fresh decisions ignore taps for half a second');
check('own tank keeps 20 shrimp, care builds up only then, Look over from the first shrimp',`
var g=readyGame(),T=g.tanks[0];T.pop=[{n:80,age:120,g:40},{n:30,age:120,g:80},{n:10,age:20,g:90}];g.emp.rawShrimp=0;
careDay(g);if(T.care&&T.care.mulm>0)throw Error('No care chores before your own tank');
var moved=keepTwenty(g);if(Math.round(totalN(T))!==20||Math.round(moved)!==100||g.emp.rawShrimp<99)throw Error('Twenty stay home, the rest go to the farm: '+totalN(T)+' '+moved);
if(T.pop.some(function(k){return k.g===40;}))throw Error('The best coloured adults stay');
g.me=g.me||newMe();g.me.keep='self';for(var d=0;d<50;d++)careDay(g);var C=careOf(T);if(C.mulm<0.9||C.grow<0.9||C.sponge<0.6)throw Error('Mulm, growth and sponge build up by themselves');
var h=readyGame(),U=h.tanks[0];U.pop=[{n:5,age:120,g:30,b:1},{n:5,age:120,g:70}];var m0=h.money,r=cullPick(h,U,[{age:120,g:30,b:1},{age:120,g:70}]);if(r.n!==2||r.gave!==0||Math.round(totalN(U))!==8||U.pop.filter(function(k){return k.b;})[0].n!==4)throw Error('A bought one can be taken out');
if(Math.abs(h.money-m0-(priceAt(30)+priceAt(70))*0.25)>0.01)throw Error('Bought and bred ones are both sold as culls');var V=readyGame().tanks[0];V.pop=[{n:10,age:90,g:50,b:1}];if(cullSample(V,12).length!==10)throw Error('Look over works from the first shrimp you buy');
`);
check('a cull look stands for the tank: 5 rounds to go through it, then once a month covers it all',`
var g=readyGame(),T=g.tanks[0];T.pop=[{n:300,age:120,g:30},{n:500,age:120,g:70}];
if(Math.round(cullEach(g,T,16))!==10)throw Error('Each of 16 stands for a fifth of 800 over 16: '+cullEach(g,T,16));
var r=cullPick(g,T,[{age:120,g:30}],cullEach(g,T,16));if(r.n!==10||Math.round(T.pop[0].n)!==290)throw Error('One pick takes out about ten like it: '+r.n);
for(var i=0;i<4;i++){if(cullState(g,T).done)throw Error('Not done before 5 rounds');cullRound(g,T);}if(cullState(g,T).round!==5)throw Error('Round 5 of 5');cullRound(g,T);
var st=cullState(g,T);if(!st.done||st.share!==0.2||st.next!==30)throw Error('Gone through after 5, next full check in 30 days');
g.day+=30;st=cullState(g,T);if(!st.monthly||st.share!==1)throw Error('After a month one look covers the whole tank');cullRound(g,T);if(!cullState(g,T).done)throw Error('Monthly check resets the clock');
`);
check('the farm license opens with 3 tanks that run themselves, the first rack sends the extra tanks to the farm',`
var g=readyGame(),lic=PROJ.find(p=>p.id==='farmlic');g.kits.sold=49;while(g.tanks.length<3)g.tanks.push(newTank(g.tanks.length));g.tanks.forEach(function(t){t.pop=[{n:30,age:90,g:50}];t.feeder=0;t.autoWC=0;});
if(lic.req(g))throw Error('Not before the tanks run themselves');g.tanks.forEach(function(t){t.feeder=1;t.autoWC=1;});if(lic.req(g))throw Error('Not before 50 kits');g.kits.sold=50;if(!lic.req(g))throw Error('Open once all 3 have auto feed and auto water change');
if(milestoneConditions(g).owntank)throw Error('No own-tank card before a farm');g.emp.farms.rack=1;if(!milestoneConditions(g).owntank)throw Error('The first grow rack brings the own-tank card');
storyChoose(g,'owntank',0);if(g.tanks.length!==1||Math.round(totalN(g.tanks[0]))!==20)throw Error('One tank, twenty shrimp: '+g.tanks.length+' '+totalN(g.tanks[0]));
`);
check('old mothballed farms are sold at salvage, tree planting fits spare cash',`
var g=readyGame();g.emp.farms={rack:3};g.emp.farmPaid={rack:[2000,2200,2400]};g.emp.pausedFarms={rack:2};var m0=g.money;migrate(g);
if(g.emp.farms.rack!==1||Object.keys(g.emp.pausedFarms).length||!(g.money>m0))throw Error('Two mothballed racks sold, one keeps running: '+g.emp.farms.rack);
var h=readyGame();h.money=1e6;h.kits.sold=9999;if(treesOpen(h)||coinPlant(h,COIN_TREE))throw Error('Mangroves wait for 10,000 kits');h.kits.sold=1e4;if(!treesOpen(h)||coinPlant(h,coinPlantBatch(h))!==1)throw Error('Then one tree a tap, before any coin');
var C=coinOf(h);C.trees=1000;for(var d=0;d<100;d++){h.day++;coinDay(h);}if(C.otrees<150||C.otrees>300||C.coins)throw Error('People copy what they see, about 0.2% a day, no coins before shrimpcoin: '+C.otrees);
var o0=C.otrees;treesFromGala(h,4e6);if(C.otrees-o0!==1e6)throw Error('A mangrove gala pays for seedlings');
`);
if(!html.includes("$('legacy-equipment').hidden=hasFarm&&G.tanks.every(function(t){return t.feeder&&t.autoWC;})")||!html.includes("if(gc&&gc.closest('[hidden]:not(.panel)'))g=null;"))throw Error('Home gear stays until every tank runs itself, and the guide never points at a hidden card');
if(!html.includes('data-act="hc-cull"')||!html.includes("a==='hc-cull'")||!html.includes('function openCull(i)')||!html.includes("careBack(v,x,T,t);"))throw Error('Cull is a choice in Check shrimp, and the care jobs live in the tank');
check('traits read the balance of choices: a ruthless and a kind run end up apart on several axes',`
function prof(cold){var g=readyGame();g.money=1e12;g.humans=1e7;g.kits.sold=1e6;g.emp.staff.pack=5;g.emp.staff.lines=1;g.me.sent=5e5;var x=function(a,b){return cold?a:b;};
 [['ev_mira',2,0],['ev_rival',0,1],['ev_ai',0,1],['ev_marine',1,0],['ev_paper',2,1],['dye_offer',0,1],['fight_invite',0,1],['me_burnout',1,0],['coin_offer',1,0]].forEach(function(s){if(!storyChoose(g,s[0],x(s[1],s[2])))throw Error('Choice '+s[0]);});
 Object.keys(FORK_Q).forEach(function(fk){var o=forkOpts(fk).slice().sort(function(a,b){return (a.h||0)-(b.h||0);}),p=cold?o[0]:o[o.length-1];addHeart(g,p.h);trAdd(g,TRAIT_TAGS[p.id]);});
 Object.keys(PAINS).forEach(function(id){if(!painPick(g,id,x(2,0)))throw Error('Pain '+id);});
 if(!byeChoose(g,'pack',x(0,1)))throw Error('Bye');gpLand(g,!cold);partyGo(g,1,!cold);if(!gpScam(g,!cold))throw Error('Scam');
 [['c_cash',0,1],['c_power',2,0],['c_rivers',2,0],['c_many',1,0],['c_blackout',2,0],['c_prison',0,2],['c_fisher',0,2]].forEach(function(s){if(!card3Choose(g,s[0],x(s[1],s[2])))throw Error('Card '+s[0]);});
 (cold?[['war','fund'],['poor','credit'],['no','ministers'],['water','desal']]:[['war','pay'],['hot','cool'],['water','wells'],['poor','breeders'],['care','carers'],['no','ask']]).forEach(function(s){var o=hardOp(hardGroup(s[0]),s[1]);trAdd(g,o.tr);addHeart(g,o.h||0);});
 for(var n=0;n<4;n++)trAdd(g,GALA_FOR[x('own','kids')].tr);
 return traitVals(g);}
var R=prof(true),K=prof(false),apart=TRAITS.filter(function(k){return Math.abs(R[k]-K[k])>=0.4;});
if(apart.filter(function(k){return k!=='means';}).length<4)throw Error('Ruthless and kind only differ on '+apart.join(', ')+' '+JSON.stringify([R,K]));
['drive','means','kin','risk'].forEach(function(k){if(!(R[k]*K[k]<0))throw Error('Opposite sides on '+k+': '+R[k].toFixed(2)+' vs '+K[k].toFixed(2));});
var a=newGame();trAdd(a,{drive:1});if(!(traitVals(a).drive>0.1&&traitVals(a).drive<0.3))throw Error('One push is a lean, not the rail: '+traitVals(a).drive);
for(var i=0;i<10;i++)trAdd(a,{ego:i%2?1:-1});if(Math.abs(traitVals(a).ego)>0.01)throw Error('Ten pushes that cancel sit in the middle');
for(i=0;i<5;i++)trAdd(a,{kin:1});trAdd(a,{kin:-5});if(Math.abs(traitVals(a).kin)>0.01||a.trAbs.kin!==10)throw Error('The sum and the sizes are both kept');
var o=newGame();delete o.trAbs;o.tr={care:-3,know:2};migrate(o);if(o.trAbs.care!==3||o.trAbs.know!==2)throw Error('Old saves count their sums as one-way pushes');
['social','guide','aiconsult','farmlic','ministry','mangrove','arco','globalbrand'].forEach(function(id){if(TRAIT_TAGS[id])throw Error('Routine upgrade still pushes a trait: '+id);});
`);
console.log(count+' focused balance and migration checks passed');
module.exports={engine,html};
