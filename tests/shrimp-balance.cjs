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
if(!html.includes("$('vitals').hidden=!sh||"))throw Error('Hunger and nutrition should show once there are shrimp');
console.log('PASS top readings show NO₃, KH, GH, pH and temperature');
const tradeStart=html.indexOf('id="sellcard"'),hist=html.indexOf('id="trade-colcard"'),sales=html.indexOf('id="trade-sales-rules"'),sellAge=html.indexOf('id="s-sellAge"'),sellAction=html.indexOf('id="ss-ready"'),price=html.indexOf('id="s-price"'),salesDetails=html.indexOf('<summary>Sales details</summary>');
if(!(tradeStart>=marketStart&&tradeStart<hist&&hist<sales&&sales<sellAge&&sellAge<sellAction&&sellAction<price&&price<salesDetails&&salesDetails<marketEnd))throw Error('Trade should combine an independent colony histogram, sales rules, sell action, price and folded sales details in that order');
if(html.includes('id="rulescard"')||html.includes('id="trade-gradebars"')||html.includes('id="trade-gradeline"')||html.includes('id="trade-berried"'))throw Error('Merged Trade card should retain only the colony histogram from the old Colony panel');
if(!html.includes("$('sellcard').hidden=lt||!(sh&&(G.stats.born>0||G.stats.sold>0||G.opt.all))"))throw Error('Sales rules should appear as soon as the first shrimp are born');
if(!html.includes("f.hidden=!sh||!n.feed||emp;w.hidden=!kit||!n.wc||")&&html.includes("se.hidden=!sh||!n.sell||")||!html.includes("feed:G.tanks.some(function(t){return !t.feeder;})")||!html.includes("sell:!(labMode()&&!G.opt.all)"))throw Error('Top Feed, Water and Sell actions should stay until every tank automates them, and Sell until shrimp all go to kits');
if(!html.includes("activeTab==='up'&&!G.opt.visitedUp")||!html.includes("g.tab==='up'&&o.visitedUp"))throw Error('Equipment tab guidance dot should be remembered as seen after visiting');
if(!html.includes("var CARD_GROUP={kits:'k',staff:'k',korder:'k'};"))throw Error('Sales rules and colony toggles should not be coupled by spotlight grouping');
console.log('PASS Trade combines independent colony/sales toggles; actions persist and Equipment dot clears after visit');
const goalRowStart=html.indexOf('<div class="goalrow" style="display:none">'),dreamSummary=html.indexOf('id="dream-tracker"'),infoPop=html.indexOf('<div class="apop" id="apop"');
if(!(infoPop>=0&&infoPop<goalRowStart&&goalRowStart<dreamSummary&&html.includes('id="b-goal-short"')))throw Error('Grandma year tracker should share the owners row inside the info panel'); // Pass 194: the row stays in the DOM, hidden (Puti took the owners bar and letters out of the ? popup)
console.log('PASS Grandma year tracker shares the progress row with a compact mobile progress label');
if(!html.includes('class="card coll" data-k="charts" id="charts"')||!html.includes('class="card coll" data-k="ads" id="adscard"'))throw Error('Delayed charts and advertising should fold when first revealed');
console.log('PASS delayed charts and advertising can fold when first revealed');
if(!html.includes('.coll.queued>:not(.hd){display:none!important}')||!html.includes('function promoteCardReveal(o)')||!html.includes('o.cardQueue.push({k:k,tab:activeTab})')||!html.includes('promoteCardReveal(o);render();')||!html.includes('var PROJ_SHOW=1,'))throw Error('New content should queue one at a time, focus the active card and advance when dismissed');
console.log('PASS newly revealed cards queue one at a time and fold other sections');
check('fresh starts preserve milestones; high-speed batches stop at a boundary',`
var g=readyGame(),t=g.tanks[0];t.chem.bacA=t.chem.bacB=bacTarget(t);t.chem.nh=t.chem.no2=0;rememberCycle(g,t);g.progress.lastAck=null;
for(var i=0;i<400;i++)stepGame(g);
if(g.progress.queue[0]!=='cycle'||g.day!==0||g.step!==1)throw Error('Skipped milestone boundary');
var before=clock(g);stepGame(g);if(clock(g)!==before)throw Error('Continued while pending');
acknowledgeMilestone(g);stepGame(g);if(g.progress.queue.length)throw Error('Repeated milestone');
`);
check('old saves retain preferences and skip historical milestone spam',`
var g=readyGame();delete g.progress;g.day=600;g.tanks[0].had=1;delete g.tanks[0].set.keepL;g.tanks[0].set.keep=20;g.stats.born=10;g.stats.sold=100;g.kits.sold=30;g.emp.farms.barn=1;
migrate(g);detectMilestones(g);if(g.progress.queue.length||keepN(g.tanks[0])!==20||g.progress.home!=='emp')throw Error('Migration regressed');
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
if(farmCap(g)!==1)throw Error('Wrong capacity');if(changeFarm(g,'rack','pause'))throw Error('No pausing farms');var cash=g.money;changeFarm(g,'rack','sell');
if(g.money<=cash||farmCap(g)||g.emp.farms.rack)throw Error('Sale inconsistent');
`);
check('automatic inventory respects the reserve; farms and packing run full up to STOCK_FULL days of orders (Pass 190)',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.emp.farms.barn=5;g.emp.inventoryDays=3;g.money=10000;var r=operatingReserve(g);empireDay(g);
if(g.money<r)throw Error('Inventory overspend');
g.humans=WORLD;g.emp.proj.last=1;g.emp.regions=REGIONS.map(x=>x.id);g.kits.stock=0;g.money=1e9;var m0=g.money;empireDay(g);if(g.emp.prod!==0)throw Error('With no orders the warehouse is full and farms make what sells (Pass 190)');
var h=readyGame();h.stats.sold=KIT_UNLOCK;h.emp.kitsOpened=1;h.emp.farms.mhatch=3;h.humans=2e6;h.emp.regions=['uae','gcc'].filter(function(r){return REGIONS.some(function(x){return x.id===r;});});h.money=1e9;h.emp.staff.tier=2;h.emp.staff.pack=10;var kd=Math.max(1,kitDemand(h));h.kits.stock=Math.ceil(kd*20);empireDay(h);empireDay(h);if(!(h.emp.prod>0)||!(h.emp.packed>0))throw Error('3 mega hatcheries with 20 days of orders in stock: made '+h.emp.prod+' packed '+h.emp.packed+' kd '+kd);if(!(STOCK_FULL>=30))throw Error('warehouse limit');
`);
check('manual kits protect actual adult breeder cohorts',`
var g=readyGame(),t=g.tanks[0];g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.money=1000;t.set.keepL=6/t.vol;t.pop=[{age:100,n:6,g:30},{age:25,n:16,g:90}];
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
var g=readyGame();g.kits.sold=MKT_AT;g.money=1e8;g.emp.proj.ministry=1;g.emp.proj.studio=1;g.emp.inf=1e9;g.emp.op.offer=['calm'];if(!runCampaign(g,'calm'))throw Error('Campaign failed');
if(!greenlight(g,0))throw Error('Film failed');for(var i=0;i<366;i++){g.day++;empireDay(g);}
if(!g.emp.op.recap||g.emp.op.recap.m<=0||!g.emp.filmRecap||g.emp.movie.n!==1)throw Error('Missing result');
if(!g.emp.ripple.log.some(function(x){return x.tx&&/Shrimpfather/.test(x.tx);}))throw Error('Films get a Shrimp Times review');
`);
check('finance shows operating margin separately from purchases',`
var g=readyGame();g.fin=[{shrimp:1000,farms:-100,logistics:-20,equipment:-9000,staff:-80}];
if(operatingNet(g)!==800)throw Error('Capital expense counted as payroll');
`);
check('queued milestones survive a saved-game round trip',`
var g=readyGame();g.progress.lastAck=null;g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;detectMilestones(g);var saved=JSON.parse(JSON.stringify(g));migrate(saved);
if(!saved.progress.queue.concat(saved.progress.soon).includes('kits')||!progressionBlocked(saved))throw Error('Lost kit handoff');
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
var g=readyGame();g.emp.staff.sales=4;var boost=salesBoost(g);g.money=1000000;g.emp.proj.aiconsult=g.emp.proj.drones=1;if(!goAI(g,'sales')||g.emp.staff.sales||salesBoost(g)!==boost)throw Error('Automation lost capability');g.emp.soldToday=100000000;if(staffCost(g)>100000000*0.05||staffCost(g)<100000)throw Error('Token bill should be about 2 fils per order (Pass 125), exceeded cap');
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
T.pop=[{age:60,n:50,g:80},{age:90,n:5,g:80}];T.set.keepL=40/T.vol;T.set.sellAge=45;T.set.cull=0;
var p=breederProtection(T),held=0;p.forEach(function(n){held+=n;});if(Math.round(held)!==40)throw Error('Young shrimp should fill breeder slots: held '+held);
`);
if(!html.includes("var old=rd(G,'longevity')?630:540,base=a<10?0.004:a<30?0.0015:a<75?0.0008:0.0004+(a>old?(a-old)*0.000069:0);"))throw Error('Mortality curve changed without updating the lifespan check');
check('owners’ tanks: welfare, kit design, climate, feed, water and shrimp prices in AED',`
var g=newGame();g.ob.kit=1;g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.kits.sold=60;g.humans=2e5;g.money=5e8;g.emp.regions=['auh','dxb','uae','gcc','mena','eu'];
if(!(regionMix(g).cold>0.3))throw Error('Europe should bring cold winters');
var before=welfareTarget(g);if(!buyWelfare(g,'winter'))throw Error('Winter kits');if(!(welfareTarget(g)>before))throw Error('Winter kits should help');
var m0=kitMaterials(g);if(buyWelfare(g,'moss'))throw Error('Moss kits need moss in your own tank first');g.tanks[0].moss=1;if(!buyWelfare(g,'moss'))throw Error('Moss kits');if(Math.abs(kitMaterials(g)-m0-36)>1e-9)throw Error('Java moss costs AED 36 more');
if(!buyWelfare(g,'snail')||Math.abs(kitMaterials(g)-m0-44)>1e-9)throw Error('Snail AED 8 more');if(buyWelfare(g,'wood'))throw Error('Driftwood needs wood in your tank');g.tanks[0].wood=1;if(!buyWelfare(g,'wood')||Math.abs(kitMaterials(g)-m0-64)>1e-9)throw Error('Driftwood AED 20 more');
setKitExtra(g,'moss',0);if(Math.abs(kitMaterials(g)-m0-28)>1e-9)throw Error('Moss off drops its cost');setKitExtra(g,'snail',0);setKitExtra(g,'wood',0);if(Math.abs(kitMaterials(g)-m0)>1e-9)throw Error('All off is a basic kit');
var o=newGame();o.emp.wb={design:1,moss:5};if(!wb(o).on.moss||!wb(o).on.snail||!wbHas(o,'snail'))throw Error('Old moss-and-snail saves keep both');
g.kitPrice=100;g.emp.commit=commitOf(100);if(!(welfareTarget(g)<0.6))throw Error('Very cheap kits should lower welfare');
g.emp.wel=0.3;var h=g.humans;welfareDay(g);if(!(g.humans<h&&g.emp.lapsed>0))throw Error('Struggling owners should lapse');
g.emp.wel=0.9;if(!(welfareMult(g)>1.1))throw Error('Thriving owners should refer more');
var f=fairShrimpPrice(g);g.priceAED=f*1.5;g.market.m=1.2;g.price=clamp(g.priceAED/fairShrimpPrice(g),0.5,3);if(Math.abs(g.price*fairShrimpPrice(g)-f*1.5)>1e-9)throw Error('An AED shrimp price must hold as mood moves');
g.emp.won=1;g.emp.farms={rack:3};var raw=g.emp.rawShrimp;empireDay(g);if(g.emp.rawShrimp>raw)throw Error('Farms stop breeding kit stock after the win');
if(typeof WORLDS!=='undefined'||typeof spaceOpen!=='undefined'||typeof spaceDay!=='undefined')throw Error('The old Space chapter is gone');
`);
check('hand packing, packing tools, health checks, treats and story choices',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.money=10000;var t=g.tanks[0];t.had=1;t.pop=[{age:60,n:80,g:80},{age:120,n:30,g:80}];t.set.keepL=10/t.vol;
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
if(!html.includes("bar.hidden=true;\n  if(!g)return;")||!html.includes("$('ideas-now').hidden=!soft"))throw Error('Guide lines belong in the ? popup, never a bar over the game (Puti, 28 Oct)');
if(!html.includes("if(SPOT||SPOTQ.length||!introOK())return;")||!html.includes("if(!s.now&&(!introOK(s.gap)||momentWait(G)>=0))"))throw Error('One spotlight at a time');
check('story cards about a moment go first, narrative ones go stale after 60 days (Pass 190)',`
var g=readyGame();var p=ensureProgress(g);p.seen.ev_mira=true;g.story.choices={ev_mira:0};g.day=1200;p.wait=['ev_paper','ev_rival'];p.at={ev_paper:1100,ev_rival:1100};p.queue=[];p.soon=[];
detectMilestones(g);var w=p.wait.concat(p.queue);if(w.indexOf('mira_teen')<0||p.queue.indexOf('mira_teen')<0&&p.wait[0]!=='mira_teen')throw Error('Mira at eleven goes first '+JSON.stringify(w));
var g2=readyGame(),p2=ensureProgress(g2);g2.day=500;p2.wait=['ev_paper','mira_teen'];p2.at={ev_paper:400,mira_teen:400};p2.queue=[];p2.soon=[];p2.seen.mira_teen=true;detectMilestones(g2);if(p2.wait.concat(p2.queue).indexOf('mira_teen')>=0||(p2.dropped||[]).indexOf('mira_teen')<0)throw Error('Stale Mira card dropped');
if(miraAge(newGame())!==8||Math.round(miraAge({day:365*3}))!==11)throw Error('Mira is 8 on day 0');
var g3=readyGame();g3.story.choices={ev_mira:0,bye_sales:0};if(milestoneConditions(g3).mira_bye)throw Error('Mira asks about the packing line only after the packers go');
`);
check('fight club: raid fine 20% to 1000% of a month, third raid shuts it (Pass 190)',`
var g=readyGame();g.emp.fight=1;g.money=1e7;var F=fightOf(g.emp);F.hist=[1000,1000,1000];var r=Math.random,seq;
var run=function(v){seq=v.slice();Math.random=function(){return seq.length?seq.shift():0.99;};var m0=g.money,t0=F.m;g.emp.fightBan=0;fightNight(g,1);var take=F.m-t0+(F.d===0?F.hist[F.hist.length-1]:0);return m0+Math.max(100,dayIncome(g)*0.6)-g.money;};
var lo=run([0,0]);if(Math.abs(lo-200)>1)throw Error('low fine '+lo);var hi=run([0,0.9999999]);if(Math.abs(hi-10000)>2)throw Error('high fine '+hi);
if(g.emp.fightShut)throw Error('two raids do not shut it');run([0,0.5]);Math.random=r;if(!g.emp.fightShut||F.caught!==3)throw Error('third raid shuts it');var m1=g.money;g.emp.fightBan=0;fightNight(g,1);if(g.money!==m1)throw Error('shut means no more nights');
if(fightLine(g).indexOf('Shut')<0)throw Error('line');
`);
check('sold customer data pays AED 10 a new customer as kit income (Pass 190)',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;g.kits.stock=5000;g.humans=2e6;g.money=1e7;g.emp.proj.datasell=1;var k0=g.kits.sold;for(var i=0;i<5;i++){g.emp.acc=(g.emp.acc||0)+20;empireDay(g);}
var k=g.kits.sold-k0;if(!(g.emp.dataAED>0)||Math.abs(g.emp.dataAED-k*DATA_AED)>k*DATA_AED*0.5+1)throw Error('data income '+g.emp.dataAED+' for '+k+' kits');
`);
check('a tank seeded from Tank 1 stays cycled for 30 days with shrimp (1 Nov)',`
var g=readyGame();var t=g.tanks[0];t.had=1;t.cycledAt=0;t.pop=[{age:100,n:40,g:60}];g.money=1e5;if(!addTank(g))throw Error('addTank');var T=g.tanks[1];T.vol=640;T.volTier=VOLS.length-1;T.pop=[{age:100,n:600,g:60}];T.had=1;
for(var d=0;d<5;d++)tankRoll(g,T,1);if(T.chem.bacA<Math.min(capA(T),bacTarget(T))*0.99||T.chem.bacB<Math.min(capA(T),bacTarget(T))*0.99)throw Error('Seeded tank fell behind');
`);
check('police year: loose farm shrimp sell by hand, inside weekly buyers (Pass 189)',`
var g=readyGame();g.emp.farms.hatch=1;g.emp.rawShrimp=500;g.emp.nosale=g.day+100;if(!banSale(g))throw Error('ban sale on');var d=demandLeft(g),r=sellAll(g,true);if(r.count<1||r.count>d)throw Error('within buyers '+r.count+' '+d);
var m=g.money;sellAll(g,false);var q=banSell(g,false,demandLeft(g));if(g.emp.rawShrimp>=500)throw Error('raw shrimp sold');g.emp.nosale=g.day-1;if(banSale(g))throw Error('ends with the ban');
`);
check('kits need babies in tank 2 and room (1 Nov, Pass 190)',`
var g=readyGame();g.stats.sold=KIT_UNLOCK;var t=g.tanks[0];t.had=1;t.vol=80;t.volTier=2;t.pop=[{age:100,n:20,g:60}];if(kitsOpen(g))throw Error('One 80 L tank should not open kits');
var t2=newTank(1);t2.had=1;t2.pop=[{age:100,n:20,g:60}];g.tanks.push(t2);if(kitsOpen(g))throw Error('Kits wait for tank 2 babies');t2.clutches=[{due:0,f:1,g:60}];stepGame(g);if(!g.stats.t2Born)throw Error('tank 2 birth not marked');if(!kitsOpen(g))throw Error('A second tank with babies and 80 L stocked should open kits');
t.vol=20;t.volTier=0;t2.vol=20;if(kitsOpen(g))throw Error('Kits still need some room');
`);
check('hired salespeople sell surplus without an extra toggle',`
var g=readyGame();g.stats.sold=5;g.money=5000;var t=g.tanks[0];t.had=1;t.pop=[{age:120,n:60,g:60},{age:30,n:20,g:60}];t.set.keepL=20/t.vol;
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
var g=readyGame();g.emp.proj.ministry=1;drawOffer(g);var o=g.emp.op.offer.map(id=>MSGS.find(m=>m.id===id)).filter(Boolean);
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
if(html.includes('endingVerdict')||!html.includes('What the world looks like'))throw Error('Ending shows what the world became');
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
if(!(html.includes('G=migrate(newGame());var lf=')&&html.includes('location.reload();},60)')))throw Error('Start over must build the game the same way a first load does');
if(!html.includes("['pointerup','touchend','click','keydown'].forEach(function(ev){document.addEventListener(ev,musicKick,true);});"))throw Error('Sound must unlock on finger-up taps and retry on every tap');
if(!/function save\(force\)\{if\(document\.hidden&&!force\)return;/.test(html)||!html.includes('catchUp(G,(Date.now()-at)/1000,speed)'))throw Error('No saving while hidden, and coming back from the background catches up');
if(!html.includes("else if(c.stop)setSpeed(0);")||!html.includes('if(cu.stop)G.savedSpeed=0;')||!html.includes('if(document.hidden)HIDDEN_AT=Date.now();')||!html.includes('Date.now()-MUS.fail>60000'))throw Error('A stopped catch-up pauses the game, a page loaded hidden still catches up, and failed sound loads back off');
check('Grandma helps a player who spent everything before the first shrimp',`
var g=readyGame(),T=g.tanks[0];g.progress.queue=[];T.cycledAt=1;safeToStock=function(){return true;};g.money=5;g.stats.giftDay=null;T.had=0;
for(var i=0;i<12;i++){g.progress.queue=[];g.money=5;stepGame(g);}
if(totalN(T)<1||!g.log.some(function(l){return /these are on me/.test(l.t);}))throw Error('Grandma should drop off shrimp once the water is ready and money is short');
`);
if(!html.includes(".opsrow select{font:500 16px")||!html.includes("#speed button,.tabs button,#guidebar,.top button{touch-action:manipulation}.newsflash{touch-action:none}"))throw Error('iPhone should not zoom on the Operating dropdowns or on fast taps');
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
if(html.includes("Group '+(at+1)")||!html.includes("First decide what “everyone” means.")||!html.includes("move('lab-card','up',false);")||!html.includes("wrap.hidden=true;$('p-up').appendChild(wrap)")||!html.includes("salesOpen(G)&&!salesDone(G)"))throw Error('Hard part walk-through, no lab certification, no home-tank gear after hatcheries, no idle Sales card');
if(/' of '\+l\.finds\.length\+' found/.test(html))throw Error('Research has no total to find');
check('one tree a tap, others plant slowly for the coin, research opens Space',`
var g=readyGame();g.humans=4e9;var C=coinOf(g);C.on=1;C.honest=1;C.price=30;g.money=1e12;
if(coinPlantBatch(g)!==COIN_TREE)throw Error('One tree a tap');
for(var d=0;d<30;d++){g.day+=1;coinDay(g);}if((C.otrees||0)>0.0002*3*g.humans*30*1.2+1)throw Error('Others plant at most 0.06% of people a day');
var s=readyGame();s.emp.won=1;s.space={v:1,started:true,colonies:{orbit:{n:80}},surveys:{orbit:1},won:0};s.progress.queue=['spaceDream'];s.progress.reviewing=true;s.academy.active={id:'terraform',progress:20};s=migrate(s);
if(s.space||s.progress.queue.indexOf('spaceDream')>=0||s.progress.reviewing||s.academy.active||earthArchived(s)||!canLeave(s))throw Error('An old Space save goes back to its won company');
`);
if(!html.includes('id="after"')||!html.includes("showAfter(slab,stx,aft)")||!html.includes("if(pp&&pp.fk){showAfter(pp.name,pp.d,kindNote());}"))throw Error('Decisions show what happened afterwards, in a popup');
if(!html.includes("var renderInner=render;render=function(){var a=anchorGet();renderInner.apply(this,arguments);anchorFix(a);settleScan();};")||!html.includes('SETTLE_MS=500'))throw Error('The screen holds still under the finger and fresh decisions ignore taps for half a second');
if(html.includes('.tv-care.own .btn[data-idle]{opacity')||fs.readFileSync(path.join(__dirname,'../shrimp/home.html'),'utf8').includes('.toys .btn[data-idle]{opacity'))throw Error('Job buttons never grey out, do them any time (Puti, 4 Nov)');
check('own tank keeps 20 shrimp, care builds up only then, Look over from the first shrimp',`
var g=readyGame(),T=g.tanks[0];T.pop=[{n:80,age:120,g:40},{n:30,age:120,g:80},{n:10,age:20,g:90}];g.emp.rawShrimp=0;
careDay(g);if(T.care&&T.care.mulm>0)throw Error('No care chores before your own tank');
var moved=keepTwenty(g);if(Math.round(totalN(T))!==20||Math.round(moved)!==100||g.emp.rawShrimp<99)throw Error('Twenty stay home, the rest go to the farm: '+totalN(T)+' '+moved);
if(T.pop.some(function(k){return k.g===40;}))throw Error('The best coloured adults stay');
g.me=g.me||newMe();g.me.keep='self';var C=careOf(T),d;
/* Pass 246 (Puti, 4 Nov): after a clean, poop is full in a random 4 to 10 min (100 to 250 tank days), glass 3 to 6 min (75 to 150), plants always 5 min (125) */
var full=[];for(var r=0;r<40;r++){C.mulm=0;C.grow=0;careDay(g);for(d=1;d<400&&C.mulm<1;d++)careDay(g);full.push(d);}
if(Math.min.apply(null,full)<99||Math.max.apply(null,full)>251||Math.max.apply(null,full)-Math.min.apply(null,full)<40)throw Error('Poop full in 100 to 250 tank days, random each clean: '+full);
/* Pass 261 (Puti): every job holds a minute (CLEAN_HOLD) first, sponge and plants too; Pass 268 real-time hold off here, checked on its own */var CS0=CLEAN_SEEN;CLEAN_SEEN=null;C.grow=1;g.tday=g.day=1000;careDay(g);C.grow=0;careDay(g);for(d=0;d<CLEAN_HOLD-3;d++){g.tday=++g.day;careDay(g);}if(C.grow>0.01)throw Error('Plants stay trimmed for a minute: '+C.grow);for(d=0;d<125+3;d++){g.tday=++g.day;careDay(g);}if(Math.abs(C.grow-1)>1e-6)throw Error('Plants full 125 tank days after the minute: '+C.grow);
T.had=1;var gl=[];for(r=0;r<20;r++){T.glass=null;glassGrow(g,T);T.glass=T.glass.map(function(){return 0;});var gd=0;while(glassMean(T)<0.95&&gd<400){glassGrow(g,T);gd++;}gl.push(gd);}
if(Math.min.apply(null,gl)<55||Math.max.apply(null,gl)>170)throw Error('Glass about full in 75 to 150 tank days: '+gl);
T.pop=[];var m1=C.mulm=0.3;for(d=0;d<30;d++)careDay(g);if(C.mulm!==m1)throw Error('No new mulm in an empty tank, after a crash poop stops (Puti, 30 Oct)');
var f0=C.pests.filter(function(p){return p.k==='flat';}).length;for(d=0;d<200;d++)careDay(g);if(C.pests.filter(function(p){return p.k==='flat';}).length!==f0)throw Error('No new flatworms without shrimp');
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
check('people who quit eating shrimp let old ponds grow back into mangroves, after the first one does',`
var g=readyGame(),R=rip(g);R.free=1e6;for(var d=0;d<30;d++){g.day++;coinDay(g);}if(coinOf(g).ptrees)throw Error('No regrowth before the first flooded pond');
R.n=RIPPLE.findIndex(function(h){return h.fx==='mangrove';})+1;for(var d2=0;d2<200;d2++){g.day++;coinDay(g);}var e=earthNums(g);if(e.ponds<2.5e5||e.ponds>5e5+1||coinOf(g).coins)throw Error('Heading to half a tree per person who quit, over months, no coins: '+e.ponds);
`);
check('old mothballed farms are sold at salvage, tree planting fits spare cash',`
var g=readyGame();g.emp.farms={rack:3};g.emp.farmPaid={rack:[2000,2200,2400]};g.emp.pausedFarms={rack:2};var m0=g.money;migrate(g);
if(g.emp.farms.rack!==1||Object.keys(g.emp.pausedFarms).length||!(g.money>m0))throw Error('Two mothballed racks sold, one keeps running: '+g.emp.farms.rack);
var h=readyGame();h.money=1e6;h.kits.sold=9999;if(treesOpen(h)||coinPlant(h,COIN_TREE))throw Error('Mangroves wait for 10,000 kits');h.kits.sold=1e4;if(!treesOpen(h)||coinPlant(h,coinPlantBatch(h))!==1)throw Error('Then one tree a tap, before any coin');
var C=coinOf(h);C.trees=1000;for(var d=0;d<100;d++){h.day++;coinDay(h);}if(C.otrees<150||C.otrees>300||C.coins)throw Error('People copy what they see, about 0.2% a day, no coins before shrimpcoin: '+C.otrees);
var o0=C.otrees;treesFromGala(h,4e6);if(C.otrees!==o0||C.gq!==1e6)throw Error('A mangrove gala queues its seedlings');h.day+=1;treesDay(h);if(C.otrees-o0<1e6)throw Error('A mangrove gala pays for seedlings');
`);
if(!html.includes("lw2.hidden=hasFarm&&G.tanks.every(function(t){return t.feeder&&t.autoWC;})")||!html.includes("if(gc&&gc.closest('[hidden]:not(.panel)'))g=null;"))throw Error('Home gear stays until every tank runs itself, and the guide never points at a hidden card');
if(!html.includes('data-act="hc-cull"')||!html.includes("a==='hc-cull'")||!html.includes('function openCull(i)')||!html.includes("careBack(v,x,T,t);"))throw Error('Cull is a choice in Check shrimp, and the care jobs live in the tank');
check('traits read the balance of choices: a ruthless and a kind run end up apart on several axes',`
function prof(cold){var g=readyGame();g.money=1e12;g.emp.inf=1e7;g.humans=1e7;g.kits.sold=1e6;g.emp.staff.pack=5;g.emp.staff.lines=1;g.me.sent=5e5;var x=function(a,b){return cold?a:b;};
 [['ev_mira',2,0],['ev_rival',0,1],['ev_ai',0,1],['ev_marine',1,0],['ev_paper',2,1],['dye_offer',0,1],['fight_invite',0,1],['me_burnout',1,0],['coin_offer',1,0]].forEach(function(s){if(!storyChoose(g,s[0],x(s[1],s[2])))throw Error('Choice '+s[0]);});
 Object.keys(FORK_Q).forEach(function(fk){var o=forkOpts(fk).slice().sort(function(a,b){return (a.h||0)-(b.h||0);}),p=cold?o[0]:o[o.length-1];addHeart(g,p.h);trAdd(g,TRAIT_TAGS[p.id]);});
 Object.keys(PAINS).forEach(function(id){if(!painPick(g,id,x(2,0)))throw Error('Pain '+id);});
 if(!byeChoose(g,'pack',x(0,1)))throw Error('Bye');gpLand(g,!cold);partyGo(g,1,!cold);if(!gpScam(g,!cold))throw Error('Scam');
 [['c_cash',0,1],['c_power',2,0],['c_rivers',1,0],['c_many',1,0],['c_blackout',2,0],['c_prison',0,1],['c_fisher',0,2]].forEach(function(s){if(!card3Choose(g,s[0],x(s[1],s[2])))throw Error('Card '+s[0]);});
 (cold?[['war','fund'],['poor','credit'],['no','ministers'],['water','desal']]:[['war','pay'],['hot','cool'],['water','wells'],['poor','breeders'],['care','carers'],['no','ask']]).forEach(function(s){var o=hardOp(hardGroup(s[0]),s[1]);trAdd(g,o.tr);addHeart(g,o.h||0);});
 for(var n=0;n<4;n++)trAdd(g,GALA_FOR[x('own','kids')].tr);
 return traitVals(g);}
var R=prof(true),K=prof(false),apart=TRAITS.filter(function(k){return Math.abs(R[k]-K[k])>=0.4;});
// Pass 217: fair/cold only picks the version (Pass 203), so 3 other axes apart is enough.
if(apart.filter(function(k){return k!=='means';}).length<3)throw Error('Ruthless and kind only differ on '+apart.join(', ')+' '+JSON.stringify([R,K]));
['drive','means','kin','risk'].forEach(function(k){if(!(R[k]*K[k]<0))throw Error('Opposite sides on '+k+': '+R[k].toFixed(2)+' vs '+K[k].toFixed(2));});
var a=newGame();trAdd(a,{drive:1});if(!(traitVals(a).drive>0.1&&traitVals(a).drive<0.3))throw Error('One push is a lean, not the rail: '+traitVals(a).drive);
for(var i=0;i<10;i++)trAdd(a,{risk:i%2?1:-1});if(Math.abs(traitVals(a).risk)>0.01)throw Error('Ten pushes that cancel sit in the middle');
for(i=0;i<5;i++)trAdd(a,{kin:1});trAdd(a,{kin:-5});if(Math.abs(traitVals(a).kin)>0.01||a.trAbs.kin!==10)throw Error('The sum and the sizes are both kept');
var o=newGame();delete o.trAbs;o.tr={care:-3,know:2};migrate(o);if(o.trAbs.care!==3||o.trAbs.know!==2)throw Error('Old saves count their sums as one-way pushes');
['social','guide','aiconsult','farmlic','ministry','mangrove','arco','globalbrand'].forEach(function(id){if(TRAIT_TAGS[id])throw Error('Routine upgrade still pushes a trait: '+id);});
`);
// Pass 110: seven traits. DECS lists every one-off decision with the trait push of each option, measured by running it on a rich game
// (story cards, staff goodbyes, growing pains, late cards, forks, hard-part options, Grandma moments). Repeatables (galas, campaigns) are left out.
const DECS=require('./shrimp-decs.cjs');
check('seven traits: ego and reach fold into drive, a stuck review is released, the Space hand-off keeps its flag',`
if(TRAITS.length!==6||TRAITS.indexOf('ego')>=0||TRAITS.indexOf('reach')>=0||TRAITS.indexOf('control')>=0)throw Error('Six traits (Pass 218) '+TRAITS);
var o=newGame();o.tr={drive:1,ego:2,reach:-0.5,care:1};o.trAbs={drive:1,ego:3,reach:1.5,care:1};migrate(o);
if(o.tr.drive!==2.5||o.trAbs.drive!==5.5||'ego' in o.tr||'reach' in o.tr||'ego' in o.trAbs||'reach' in o.trAbs||o.tr.care!==1)throw Error('Fold '+JSON.stringify([o.tr,o.trAbs]));
var n=newGame();delete n.trAbs;n.tr={ego:2,reach:1};migrate(n);if(n.tr.drive!==3||n.trAbs.drive!==3||'ego' in n.tr)throw Error('Fold without sizes '+JSON.stringify([n.tr,n.trAbs]));
var v=traitVals(o);if(Object.keys(v).length!==6||Object.keys(v).some(function(k){return !isFinite(v[k]);}))throw Error('Values '+JSON.stringify(v));
var w=newGame();w.emp.won=2000;w.progress.reviewing=true;w.progress.queue=[];migrate(w);if(w.progress.reviewing)throw Error('Stuck review should be released so the win card offers Keep playing');
`);
if(html.includes('review-empire')||html.includes('Review your empire'))throw Error('The win card has no review button, it froze the game');
{const w0=html.indexOf("key==='win'?'<button"),w=html.slice(w0,html.indexOf("</button>':'",w0)+9);if(!w.includes('data-act="sandbox">Keep playing<')||!w.includes('data-act="reset">New game<')||(w.split('<button').length-1)!==2)throw Error('Win card offers Keep playing and New game only: '+w);}
count++;console.log('PASS the win card offers Keep playing and New game, no review button');
check('Grandma time never pushes care, it is easy-going where it pushes anything',`
`+DECS+`
var bad=[];decisions().forEach(function(d){d.opts.forEach(function(o){if(/Grandma/.test(d.text+' '+o.label)&&o.push.care)bad.push(d.id+': '+o.label);});});
MOMENTS.forEach(function(m){if((m.ytr||{}).care||(m.ntr||{}).care)bad.push('moment '+m.id);});
PICKS.forEach(function(p){if(/Grandma/.test(p.name)&&(p.tr.care||(p.tr.drive||0)>0))bad.push('pick '+p.id);});
['gp_land','party1','party2'].forEach(function(k){var g=richGame();g.tr={};g.trAbs={};storyChoose(g,k,0);if(g.tr.care||!((g.tr.drive||0)<0))bad.push(k+' should be easy-going only '+JSON.stringify(g.tr));});
var b=richGame();b.money=-5000;b.tr={};b.trAbs={};var bi=brokeOpts(b).map(function(x){return x.id;}).indexOf('gp');if(bi>=0){brokePick(b,bi);if(b.tr.care)bad.push('broke: Grandma money');}
if(bad.length)throw Error('Care pushes on Grandma: '+bad.join(' | '));
`);
check('drive: driven and easy-going options are about as many and as big',`
`+DECS+`
var p=0,n=0,ps=0,ns=0;decisions().forEach(function(d){d.opts.forEach(function(o){var v=o.push.drive||0;if(v>0){p++;ps+=v;}if(v<0){n++;ns-=v;}});});
if(p/n<0.8||p/n>1.25||ps/ns<0.85||ps/ns>1.18)throw Error('Drive pushes: '+p+' up ('+ps.toFixed(1)+') against '+n+' down ('+ns.toFixed(1)+')');
var g=richGame();g.tr={};g.trAbs={};storyChoose(g,'buyout',1);if(Object.keys(pushOf(g)).length)throw Error('Refusing the buyout pushes nothing');
`);
check('null test: a random chooser lands in the middle on every trait',`
`+DECS+`
var D=decisions(),s=11,rnd=function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;},R={};TRAITS.forEach(function(k){R[k]=[];});
for(var it=0;it<3000;it++){var t={},a={};D.forEach(function(d){var oo=d.opts[Math.floor(rnd()*d.opts.length)],o=oo.push,ab=oo.abs||{};for(var k in o)t[k]=(t[k]||0)+o[k];var ks={};for(var k1 in o)ks[k1]=1;for(var k2 in ab)ks[k2]=1;for(var k3 in ks)a[k3]=(a[k3]||0)+Math.max(Math.abs(o[k3]||0),ab[k3]||0);});TRAITS.forEach(function(k){R[k].push((t[k]||0)/((a[k]||0)+TRAIT_K));});}
var off=TRAITS.map(function(k){var v=R[k].sort(function(x,y){return x-y;});return [k,v[1500]];}).filter(function(x){return Math.abs(x[1])>0.05;});
if(D.length<60)throw Error('Only '+D.length+' decisions found');if(off.length)throw Error('Random chooser median off centre: '+JSON.stringify(off));
`);
check('every ending family can be reached, from choices alone',`
`+DECS+`
var D=decisions(),s=5,rnd=function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;},seen={},js=JSON.stringify(newGame());
for(var it=0;it<800;it++){var w={};TRAITS.forEach(function(k){w[k]=rnd()*2-1;});var g=JSON.parse(js);g.tr={};g.trAbs={};
 D.forEach(function(d){var best=null,bv=-1e9;d.opts.forEach(function(o){var v=rnd()*0.3;for(var k in o.push)v+=w[k]*o.push[k];if(v>bv){bv=v;best=o;}});trAdd(g,best.push);});
 var e=endingPick(g),f=e.split('_')[0];seen[f]=(seen[f]||0)+1;}
['empire','garden','question','network','drift'].forEach(function(f){if(!seen[f])throw Error('Never reached '+f+' '+JSON.stringify(seen));});
`);
check('Pass 203: curiosity is research spend and grant picks, never settings or ? taps; care is giving held over years; land time is life first',`
var g=newGame();g.day=730;g.ps.t=4e6;g.stats.earned=1e7;var lo=playVal(g,'know');g.ps.tw=600;g.ps.help=200;g.ps.chart=100;if(playVal(g,'know')!==lo)throw Error('Settings still move curiosity');
g.stats.rsp=2e5;var hi=playVal(g,'know');if(Math.abs(lo+0.6)>0.01||!(hi>0.45&&hi<=0.8))throw Error('Know from play '+lo+' '+hi);
g.ps.grN=4;g.ps.grB=4;if(!(playVal(g,'know')>hi))throw Error('Basic science grants add curiosity');
var c=newGame();if(playVal(c,'care')!=null)throw Error('No care from play before the hard part');c.ps.giveD=3;c.ps.giveY=0;var c0=playVal(c,'care');c.ps.giveY=0.3;if(!(c0==null&&playVal(c,'care')>0.6))throw Error('Giving '+c0+' '+playVal(c,'care'));
var d=newGame();d.day=3000;d.ps.t=3.6e6;d.ps.landMs=1.2e6;if(!(playVal(d,'drive')<-0.9))throw Error('A quarter of play on the land is life first '+playVal(d,'drive'));
var c=newGame();c.day=730;c.ps.t=4e6;c.ps.prep=[0.2,4];var lc=playVal(c,'risk');c.ps.prep=[4,4];if(!(lc>0.5&&playVal(c,'risk')<-0.5))throw Error('Careful/bold reads how ready you were at each big step (Pass 218, control merged into risk)');
var d=newGame();d.day=730;d.ps.t=4e6;if(playVal(d,'drive')!=null)throw Error('A player who never opened the You page says nothing about drive');
`);
if(!/psNote\('tw',p\[0\]\)/.test(html)||!/psNote\('help'/.test(html)||!/psNote\('chart'/.test(html)||!/G\.ps\.help\+\+/.test(html)||!/psNote\('tw','kitPrice'\)/.test(html))throw Error('Setting, ? and chart opens must reach G.ps');
count++;console.log('PASS sliders, kit price, ? and charts all count toward know');
check('Pass 111 text: an 80 L tank, kit cost lines say cost to make',`
var g=newGame();g.money=1e6;var t=g.tanks[0];t.volTier=1;t.vol=40;if(!buyUpgrade(g,t,'tank'))throw Error('Tank upgrade failed');
if(g.log[g.log.length-1].t!=='Moved to an 80 L tank')throw Error('Article before 80: '+g.log[g.log.length-1].t);
if(!PAINS.pain_copy.ch[2][2].mat||PAINS.pain_copy.ch[2][2].mat<=1)throw Error('Undercut still raises the cost of each kit');
`);
if(/Kits '\+Math\.round\(\(po\.mat/.test(html)||!html.includes("'Each kit costs '+Math.round((pa.mat-1)*100)+'% more to make'"))throw Error('Pain kit cost must read as the cost to make a kit, not its price');
if(!html.includes("d=a.days+' day'+(a.days===1?'':'s')")||!html.includes("' day'+(left===1?'':'s')+' left")||!html.includes("(storeCount(G)===1?' store · ':' stores · ')"))throw Error('One day, one store: singular forms');
if(!html.includes("return c[0].indexOf(a)>=0?'':m;"))throw Error('A story choice that names its price should not repeat it as Costs');
if(!/#milestone-actions>\[data-act=sandbox\],#milestone-actions>\[data-act=sandbox\]~\.btn\{flex:1 1 40%\}/.test(html)||!html.includes("(sty?'\\u00a0· '+sty.name:'')"))throw Error('Win card buttons share the row, the ending subtitle never starts a line with ·');
count++;console.log('PASS Pass 111 singulars, story costs once, win card buttons and ending title');
check('Pass 117: one home tank on a feeder drops hunger and ration, the header has no to-kits line',`
var g=newGame(),t=g.tanks[0];t.feeder=true;if(feedLite(g))throw Error('Feeding lite before farms');
g.emp.farms={rack:1};if(!feedLite(g))throw Error('One home tank on a feeder with a farm should be lite');
g.tanks.push(JSON.parse(JSON.stringify(t)));if(feedLite(g))throw Error('Two home tanks keep the full feeding card');
g.tanks.pop();t.feeder=false;if(feedLite(g))throw Error('No feeder keeps hunger and ration');
`);
if(html.includes("/d to kits"))throw Error('The header still says /d to kits');
if(!html.includes(".cash-sub{display:flex;gap:8px;align-items:baseline;margin-top:2px;white-space:nowrap"))throw Error('The cash line must not wrap');
count++;console.log('PASS Pass 117 feeding lite and header');
check('Pass 118: trees planted before shrimpcoin launches give coins on day one, old launched saves get them once',`
var g=newGame(),C=coinOf(g);C.otrees=1e6;coinLaunch(g,true);if(Math.round(C.coins)!==6e5)throw Error('Launch should coin the 60% of 1M trees that made it, got '+C.coins);if(C.coins-C.treasury<5e5)throw Error('Most launch coins belong to the planters');
var h=newGame(),D=coinOf(h);D.on=1;D.honest=1;D.otrees=2e6;D.ocohorts=[{day:0,n:5e5}];coinDay(h);if(Math.round(D.coins)!==9e5)throw Error('Old save: 1.5M trees not waiting should coin 900k, got '+D.coins);var c0=D.coins;coinDay(h);if(D.coins!==c0)throw Error('Pre-launch coins only once');
`);
count++;console.log('PASS Pass 118 shrimpcoin launch supply');
// Pass 119: card headers have no arrow and show the ? only when open; Money sheet behind the header cash
if(/h2::before\{content:'(▾|)'/.test(html)||!html.includes(".card>.hd h2::before,.card>summary h2::before{content:none!important")||!html.includes("details.card:not([open])>summary>.qhelp{display:none}"))throw Error('Card headers: no arrow, ? only on open cards');
if(!/<div id="fs-body">\s*(<div class="card" id="excelcard"[\s\S]*?<\/div><\/div>\s*)?<details class="card" id="consultcard"/.test(html)||!html.includes('<details class="card" id="operations-card"')||html.indexOf('id="operations-card"')<html.indexOf('id="finsheet"')||!html.includes('id="wagecard"'))throw Error('Consultants, Operating controls and Wages live in the Money sheet, not Kits');
if(html.includes("$('business-strip').mhtml")||html.includes("Consultants in Kits"))throw Error('No growth strip, no consultants in Kits');
count++;console.log('PASS Pass 119 card headers and Money sheet');
// Pass 120: Kits tab is three cards: Kits, Making kits (packing + quality checks), Kit development; sales staff have their own card in Ads
{const kitsSec=html.slice(html.indexOf('<section class="panel" id="p-emp"'),html.indexOf('<section class="panel" id="p-world"'));
 const make=kitsSec.slice(kitsSec.indexOf('id="c-staff"'),kitsSec.indexOf('id="c-sales"'));
 if(!make.includes('<h2>Making kits</h2>')||!make.includes('id="kit-steps"')||make.includes('id="qccard"')||!make.includes('id="kit-packrow"')||!kitsSec.includes('class="card coll" data-k="qc" id="qccard"'))throw Error('Making kits holds packing, quality checks are their own optional card (Pass 135)');
 if(!kitsSec.includes('<h2>Kits</h2>')||!html.includes('id="c-sales"')||html.includes("activeTab==='promote'?'Sales staff'"))throw Error('Kits card renamed, sales staff in their own card');
 if(html.includes("['Adoption ceiling',")||html.includes("['Packed yesterday',"))throw Error('Ceiling lives with Regions, packing numbers with Making kits');}
count++;console.log('PASS Pass 120 Kits tab in three cards');
// Pass 121: Ads holds Ads, Shops, Sales staff, Marketing + Campaigns, Regions; World holds Shaping the world, Owners' tanks, the coast card, The Shrimp Times
if(html.includes('id="c-op"')||!/<div id="e-proj"( class="wide")?><\/div>\s*<div id="op-wrap" hidden>/.test(html))throw Error('Campaigns live inside the Marketing development card');
if(!html.includes("move('c-reg','promote',rv('ereg'))")||!html.includes('Shrimp Island has its own card'))throw Error('Regions in Ads, Shrimp Island in its own card (Pass 234, Puti)');
if(!html.includes('class="btn adline"')||!html.includes('<details class="store-close"><summary>Close stores</summary>'))throw Error('One-off ads one per row, store closing in a fold');
count++;console.log('PASS Pass 121 Ads and World tabs');
// Pass 123: text fixes. No free bottleneck lines in the Next bar, ceiling and working-capital alerts only with consultants
for(const k of ["key:'packer'","key:'farmtier'","key:'reg1'","key:'lic'","key:'rack'","var descriptions={","in Business","after a project in Gear","40× speed unlocked","Grow racks start at AED 2,000","Hatcheries &amp; breeding"])if(html.includes(k))throw Error('Text fix not applied: '+k);
if(!/function empTips\(\)\{[\s\S]{0,700}if\(!consultHas\(G\)\)return out;\s*if\(G\.humans>=K\*0\.97/.test(html))throw Error('Bottleneck alerts only while consultants are in');
count++;console.log('PASS Pass 123 text fixes');
check('Pass 122: lab finds, funded studies and university news go to the Science section',`
var g=newGame();g.kits.sold=100;newsLine(g,'front');newsLine(g,'lab',1);var L=rip(g).log;if(L.length!==2||L[0].sci||!L[1].sci)throw Error('newsLine sci tag');
g.emp.later=[{d:0,t:'study',sci:1}];g.day=1;laterDay(g);if(!rip(g).log[2].sci)throw Error('later study news keeps the tag');
`);
if(!html.includes('<div class="card coll" data-k="sci" id="scicard"')||!html.includes("+l.fx.slice(1)+'.':''),1);"))throw Error('Science card (Puti 6 Nov: its own card under the Times) and research finds tagged');
if(html.includes('People start buying mud')||!html.includes('var AI_MGR_DAY=40;')||!html.includes("only as spots open up in your reach")||html.includes('vv.offsetTop'))throw Error('Pass 125: carbon line, token bills, reach-limit orders line, no lifted tab bar');
if(!/maximum-scale=1,user-scalable=no/.test(html)||!html.includes('gesturestart'))throw Error('Pass 125: no pinch zoom in the game');
console.log('PASS Pass 125 feel and text fixes');
check('Pass 126: farms jump to any opened bigger kind, sell one or all, packing lines sell, care income from living tanks',`
var g=newGame();g.money=1e12;g.emp.proj.farmlic=1;g.emp.kitsOpened=1;g.kits.sold=500;
if(!buyFarm(g,'rack')||!buyFarm(g,'shed'))throw Error('Rack straight to warehouse');if(buyFarm(g,'barn')||buyFarm(g,'rack'))throw Error('No smaller kinds once bigger');
if(!buyFarm(g,'shed')||!buyFarm(g,'shed'))throw Error('More warehouses');var all=farmSellAll(g,FARMS[2]),m=g.money;if(changeFarm(g,'shed','sellall')!==all||g.money-m!==all||g.emp.farms.shed)throw Error('Sell all warehouses');
g.emp.farms={hatch:1};g.emp.proj.sun=1;if(!hasFarm(g,'hatch')||!hasFarm(g,'shed')||hasFarm(g,'mhatch'))throw Error('hasFarm counts bigger kinds');g.emp.farms={mhatch:1};if(!hasFarm(g,'hatch'))throw Error('Hatchery projects stay open with a mega hatchery');
var h=newGame();h.money=1e12;h.emp.proj.autopackm=1;h.kits.sold=1e5;h.emp.farms={mhatch:2};if(!buyLine(h,0)||!buyLine(h,0)||!buyLine(h,1))throw Error('Lines');var s=lineSellAll(h,0),m2=h.money;sellLine(h,0,true);if(h.emp.staff.lines||h.money-m2!==s)throw Error('Sell all robotic lines');
if(!lineReady(h,1)||!buyLine(h,1))throw Error('Selling old lines keeps the tier open');var c1=lineSalvage(h,1);sellLine(h,1);if(h.emp.packLines.hall!==1||c1!==Math.round(scaledCost(8e6,1,1.2)*autoDisc(h)*0.5))throw Error('Sell one hall at half');
var k=newGame();k.emp.kitsOpened=1;k.humans=1e9;k.emp.wel=1;var full=careGoods(k);k.emp.wel=0.5;if(Math.abs(careGoods(k)/full-0.5)>1e-9)throw Error('Only living tanks buy');
if(topupShrimp(k)!==0)throw Error('Top-ups need spare farm output');k.emp.farms={mhatch:10};k.fin=[{_ks:0}];if(!(topupShrimp(k)>0)||topupShrimp(k)>farmCap(k)*KIT_SHRIMP)throw Error('Top-ups from spare output');
var a=foodRate(k);k.emp.proj.app=1;if(Math.abs(foodRate(k)-a-CARE_TESTS)>1e-12)throw Error('Test refills with the care app');
`);
if(html.includes('Mothballed ')||html.includes('is mothballed'))throw Error('No mothball wording');
if(!html.includes("['foodsales','Food and tank care',1]")||html.includes('earlier-packing'))throw Error('Pass 126: finance line and packing fold');
check('Pass 127: care plan fork, free costs calls and raises welfare, paid fee set by the player, fewer pay when dear or disliked',`
var g=newGame();g.emp.kitsOpened=1;g.humans=2e6;if(PROJ.find(p=>p.id==='careplanfree').req(g))throw Error('Needs the care app');g.emp.proj.app=1;if(!forkOpts('careplan').every(p=>p.req(g))||!FORK_Q.careplan)throw Error('Care plan fork');
var t0=welfareTarget(g);g.emp.proj.careplanfree=1;if(Math.abs(welfareTarget(g)-t0-PLAN_WEL)>1e-9&&welfareTarget(g)<0.99)throw Error('Free plan raises welfare');if(setPlanFee(g,30))throw Error('No fee on the free plan');
var m=g.money;planDay(g);if(!(g.money<m))throw Error('Free plan costs the calls');
var k=newGame();k.emp.kitsOpened=1;k.humans=2e6;k.emp.proj.app=1;k.emp.proj.careplanpaid=1;k.emp.op.m=0.5;var s15=planShare(k);setPlanFee(k,40);var s40=planShare(k);if(!(s40<s15)||planFee(k)!==40)throw Error('Dearer, fewer pay');
setPlanFee(k,999);if(planFee(k)!==60)throw Error('Fee capped');k.emp.op.m=0.2;if(!(planShare(k)<s40))throw Error('Disliked, fewer pay');
var m2=k.money;setPlanFee(k,15);k.emp.op.m=0.5;planDay(k);if(!(k.money>m2))throw Error('Paid plan earns after the calls');
if(TRAIT_TAGS.careplanfree.kin<=0||TRAIT_TAGS.careplanpaid.know<=0)throw Error('Care plan traits');
`);
if(!html.includes("data-act=\"planfee\"")&&!html.includes("bbtn('planfee'"))throw Error('Pass 127: fee stepper');
check('Pass 130: Grandma pays AED 15 for the first babies, social media manager opens with sales staff',`
var g=newGame();g.stats.born=1;var m=g.money;checkGoals(g);if(g.money-m!==15||!(g.today.loans>=15))throw Error('Grandma gift in Loans and gifts');if(!g.log.some(function(l){return /Grandma sent AED 15/.test(l.t||l.m||l);}))throw Error('Gift is logged');
var sm=PROJ.find(p=>p.id==='social'),k=newGame();k.stats.sold=59;if(sm.req(k))throw Error('Not before sales staff');k.stats.sold=60;if(!sm.req(k)||!salesOpen(k))throw Error('Opens with sales staff');
`);
if(!html.includes('Grandma sent <b><g>AED 15</g></b>. For the babies')/* Pass 248: Puti's formatting */||html.includes('the defaults work fine')||html.includes('id="h-ice"'))throw Error('Pass 130: copy and stable cooling');
check('Pass 131: salespeople leave the shrimp this week\'s packing needs, sell when there is no cash to pack',`
var g=newGame();g.emp.kitsOpened=1;g.emp.staff.tier=1;g.emp.staff.sales=1;g.money=5000;g.humans=500;var T=g.tanks[0];T.set.autoSell=true;T.set.keepL=0.25;T.pop=[{age:90,n:60,g:50}];
var h=kitHold(g);if(!(h[0]>0))throw Error('Holds for packing');if(doSell(g,T,true,undefined,true,h[0]).normal!==0)throw Error('Nothing sold while packing needs it');if(!(doSell(g,T,true,undefined,true,0).normal>0))throw Error('Sells without a hold');
g.money=0;if(kitHold(g)[0]!==0)throw Error('No cash, no hold');var k=newGame();if(kitHold(k)[0]!==0)throw Error('No hold before kits');
`);
check('Pass 132: cards wait 15 s of play after the last one, urgent ones do not',`
var g=newGame();acknowledgeMilestone(g);g.progress.lastAck=null;g.ps={t:100000};g.stats.sold=KIT_UNLOCK;g.emp.kitsOpened=1;detectMilestones(g);if(g.progress.queue[0]!=='sale')throw Error('First card now');
acknowledgeMilestone(g);g.ps.t+=5000;detectMilestones(g);if(g.progress.queue.length||g.progress.soon[0]!=='kits')throw Error('Second card waits');
if(!(g.progress.gap>=10000&&g.progress.gap<=35000))throw Error('Gap 10 to 35 s');g.ps.t+=Math.max(0,g.progress.gap-5000);detectMilestones(g);if(g.progress.queue[0]!=='kits')throw Error('Second card after 20 s');acknowledgeMilestone(g);
g.ps.t+=1000;g.money=-1e6;g.emp.broke=1;var p=g.progress;p.seen.gameover=false;if(CARD_NOW.indexOf('broke')<0||CARD_NOW.indexOf('gameover')<0)throw Error('Urgent cards skip the gap');
`);
if(!html.includes('The babies can be sold at 60 days old'))throw Error('Pass 132: waiting note on the Babies card');
check('Pass 133: first summer stays under 28.5 °C, the second can be hotter; packers short of shrimp are counted',`
var g=newGame();g.hot={until:400,add:3};for(var d=0;d<365;d+=5){g.day=d;if(roomT(g,d)>28.3+1e-9)throw Error('First summer too hot on day '+d);}
var hi=0;for(d=365;d<730;d+=5){g.day=d;hi=Math.max(hi,roomT(g,d));}if(!(hi>29))throw Error('Second summer can get hot');
var k=newGame();k.emp.kitsOpened=1;k.emp.staff.tier=2;k.emp.staff.pack=2;k.money=1e5;k.humans=5000;k.tanks[0].pop=[{age:90,n:12,g:50}];if(!(packCap(k)>1))throw Error('Packers');
for(var i=0;i<4;i++)packDay(k);if(k.emp.packLow<3)throw Error('Short days counted');k.tanks[0].pop=[{age:90,n:2000,g:50}];packDay(k);if(k.emp.packLow)throw Error('Reset when packing works');
`);
check('Pass 141/151: breeders show as the limit, the packaging machine can be stopped',`
var g=newGame();g.emp.proj=g.emp.proj||{};g.emp.proj.autopackm=1;if(!pd(g,'autopackm'))g.emp.proj.autopackm={done:1};
var on=packingMachineCap(g);g.emp.machOff=1;if(!(on>=20)||packingMachineCap(g)!==0)throw Error('Stopped machine packs nothing: '+on);g.emp.machOff=0;
g.tanks[0].set.keepL=4.5;g.tanks[0].vol=640;g.tanks[0].pop=[{age:90,n:1220,g:50}];var kb=keepBlocks(g);if(!kb||kb.keep<2880||kb.have<1220)throw Error('Under breeders is the block');
g.tanks[0].set.keepL=0.2;if(keepBlocks(g))throw Error('Lower breeders frees shrimp');
`);
if(!html.includes("bbtn('machtog'")||html.includes('s-maxN')||!html.includes('<label for="s-keepL">Breeders</label>'))throw Error('Stop button, one Breeders slider and no Pack above (Pass 141, 151)');
check('Pass 135: top Sell hides when salespeople sell every tank, Excel spotlight at AED 500, QC card is optional',`
var g=newGame();g.tanks[0].had=1;g.stats.sold=100;g.emp.staff.sales=1;g.tanks.forEach(function(t){t.set.autoSell=true;});
`);
if(!html.includes("fire('excel500'")||!html.includes('<h2>Quality checks</h2>')||!html.includes('Optional. Checks catch sick shrimp'))throw Error('Pass 135: Excel spotlight and optional QC card');
if(!html.includes("&&!(hasSales(G)&&G.tanks.every(function(t){return t.set.autoSell;}))"))throw Error('Pass 135: top Sell hides with salespeople');
// Puti's standing requests (29 Oct). Don't remove these under a general rule without asking her.
check('Breeders are per litre, the same value keeps more in a bigger tank (Pass 151, Puti)',`var G=newGame();G.tanks.push(newTank(1));G.tanks[0].vol=320;G.tanks[1].vol=20;G.tanks.forEach(function(t){t.set.keepL=1;});if(keepN(G.tanks[0])!==320||keepN(G.tanks[1])!==20)throw Error('1 per L: '+keepN(G.tanks[0])+' '+keepN(G.tanks[1]));if(packAbove(G,G.tanks[1])!==keepN(G.tanks[1]))throw Error('Packing takes everything above the breeders (1 Nov)');
var O=newGame();O.tanks[0].vol=20;O.tanks[0].set.keep=16;delete O.tanks[0].set.keepL;migrate(O);if(O.tanks[0].set.keepL!==0.8)throw Error('old 16 in 20 L is 0.8 per L: '+O.tanks[0].set.keepL);if(SHARED_SET.indexOf('keepL')<0)throw Error('shared');`);
if(!/function renderTankSheet[\s\S]{0,900}it\('feeder','Auto feeder'[\s\S]{0,200}it\('autoWC'/.test(html))throw Error('Puti: the new-tank sheet offers the auto feeder and auto water changer');
if(!html.includes("if(!supNeed(G)||T.cycledAt!=null)sup='';"))throw Error('Puti: no seed bacteria rows for a cycled tank');
check('Supplies card only while a tank still needs bacteria, new tank costs AED 150 and can skip its gear (Puti, 31 Oct)',`var G=newGame();G.tanks[0].cycledAt=0;G.money=150+capitalReserve(G);if(supNeed(G))throw Error('one tank');if(addTank(G))throw Error('a seeded tank needs the feeder and water changer cash too');G.money=150+tankGear(G)+capitalReserve(G);if(!addTank(G))throw Error('AED 150 plus the gear should buy a tank');if(supNeed(G))throw Error('seeded tank needs no supplies');if(gearDone(G.tanks[1]))throw Error('gear still due');`);
if(!html.includes("data-act=\"ts-later\""))throw Error('Puti: a buy-later way out of the new-tank sheet');
count++;console.log('PASS new-tank sheet offers auto gear, no seed rows for cycled tanks');
check('Pass 247: the tank card comes the moment the farm takes the tanks, not in the story queue',`var G=newGame();acknowledgeMilestone(G);var p=ensureProgress(G);p.queue=[];p.wait=['mira_teen'];p.soon=[];G.emp.farms.rack=1;detectMilestones(G);if(p.queue.indexOf('owntank')<0||p.wait.indexOf('owntank')>=0)throw Error('owntank should be queued now: '+JSON.stringify({q:p.queue,w:p.wait}));`);
check('the farm takes the extra tanks as soon as the first farm is built, before its card',`var G=newGame();G.tanks.push(newTank(1));G.tanks.push(newTank(2));G.tanks.forEach(function(t){t.pop=[{age:90,n:300,g:50}];});G.emp.farms.rack=1;if(!farmBuilt(G))throw Error('no farm');detectMilestones(G);if(G.tanks.length!==1)throw Error('tanks '+G.tanks.length);if(totalN(G.tanks[0])>20.5)throw Error('tank 1 keeps 20, has '+totalN(G.tanks[0]));var G2=newGame();G2.tanks.push(newTank(1));G2.emp.farms.rack=1;G2.progress.seen.owntank=true;detectMilestones(G2);if(G2.tanks.length!==1)throw Error('saves with the card waiting');`);
check('Pass 151: Tank 1 on the land breeds by the land rules, moved-in shrimp join it',`var G=newGame();G.me=newMe();G.me.on=1;var T=G.tanks[0];T.vol=20;T.set.keepL=0.2;T.pop=[{age:100,n:80,g:60}];if(landCrowd(G,T)!==0)throw Error('no land, no rule');G.me.gplace={land:1};if(!(Math.abs(landCrowd(G,T)-0.6)<1e-9))throw Error('80 in 20 L is 0.6 over: '+landCrowd(G,T));T.pop=[{age:100,n:40,g:60}];if(landCrowd(G,T)!==0)throw Error('40 in 20 L is fine');if(landGive(G,[{age:90,g:50},{age:10,g:20},{age:'x',g:1}])!==2||totalN(T)!==42)throw Error('give adds two');`);
if(!html.includes("e.source!==f.contentWindow"))throw Error('land messages only from the land page');
if(!html.includes("if(LAND.on){LAND.acc=(LAND.acc||0)+dt/21600000;"))throw Error('the company runs at real time on the land (Puti)');
if(!html.includes("d.type==='spend'&&d.n>0&&!frozen(G)"))throw Error('no spending on the land while frozen');
var home=require('fs').readFileSync(__dirname+'/../shrimp/home.html','utf8');if(home.indexOf('ADULT_DAYS=75;')<0||home.indexOf('DAY_SEC=1e15;')<0||home.indexOf("type:'give'")<0||home.indexOf('MOW_SPEED=330')<0)throw Error('Land: adult at 75, game days only, moves in go to the game, faster mower (Puti)');
check('Pass 151 review: old big-tank breeders migrate to a safe per-litre value',`var O=newGame();O.tanks.push(newTank(1));O.tanks[0].vol=20;O.tanks[1].vol=320;O.tanks.forEach(function(t){t.set.keep=40;delete t.set.keepL;});O.packPerL=3;migrate(O);if(!(O.tanks[1].set.keepL<=0.5))throw Error('capped by old pack above: '+O.tanks[1].set.keepL);`);
count++;console.log('PASS land: real time, game-day clock, adult at 75, frozen, faster mower');
check('Pass 154: late costs scale, the fast answer pays later, leaving for the land, permits',`
var g=readyGame();g.humans=6e9;g.money=1e11;g.fin=[];for(var i=0;i<7;i++)g.fin.push({kits:2e9,_inf:3e6});g.emp.inf=4e8;g.emp.infOn=1;
var m0=g.money,f0=g.emp.inf;if(!card3Choose(g,'c_power',1))throw Error('engineers');if(Math.abs(m0-g.money-4e10)>1||Math.abs(f0-g.emp.inf-9e7)>1)throw Error('20 days of income and 30 days of ✦: '+(m0-g.money)+' '+(f0-g.emp.inf));
var h=readyGame();h.humans=6e9;h.money=2e10;h.fin=g.fin;card3Choose(h,'c_power',2);if(!(h.emp.ceil>0))throw Error('leave it pays now');if(!(h.emp.later&&h.emp.later.length))throw Error('and bills later');h.emp.later[0].d=0;laterDay(h);if(Math.abs(hardN(h,hardGroup('hot'))-hardGroup('hot').n*1.2)>1)throw Error('too hot grows: '+hardN(h,hardGroup('hot')));
var q=readyGame();q.fin=g.fin;q.humans=6e9;q.money=2e10;card3Choose(q,'c_rivers',0);if(Math.abs(slowMult(q)-0.85)>1e-9)throw Error('shops: 15% fewer kits');
var s7=readyGame();s7.fin=[];for(var j=0;j<7;j++)s7.fin.push({kits:1e6});for(var j=0;j<83;j++)s7.fin.unshift({kits:1e8});if(incRef(s7)<1e8*0.9)throw Error('a quiet week does not lower the price: '+incRef(s7));
var L=readyGame();L.me.on=1;L.me.gplace={land:1};L.emp.hard={open:1,picks:{},goal:'home'};L.money=1e9;L.fin=g.fin;if(!canLeave(L))throw Error('can leave from the hard part');var tr0=(L.tr||{}).drive||0;if(!leaveCompany(L))throw Error('leave');if(!(L.left&&L.emp.ended&&L.emp.ended.kind==='left'))throw Error('left state');if(!(((L.tr||{}).drive||0)<tr0))throw Error('leaving is easy-going');stepGame(L);if(L.progress.queue[0]!=='left')throw Error('review card first');acknowledgeMilestone(L);if(progressionBlocked(L))throw Error('clock runs on the land');var d0=L.day;for(var k=0;k<40;k++)stepGame(L);if(!(L.day>d0))throw Error('days pass on the land');
var P=readyGame();P.emp.regions.push('sa');P.emp.regDay={sa:0};P.day=100;P.humans=2e9;if(!cards3Cond(P).c_permit)throw Error('permit card');var pop0=popOpen(P);card3Choose(P,'c_permit',0);if(!(popOpen(P)<pop0))throw Error('waiting closes the region');
var V=readyGame();V.me.on=1;V.me.hrs={videos:400};V.humans=1e6;var mv=V.money;videoDay(V);if(!(V.money>mv))throw Error('videos pay');`);
// Puti, 30 Oct: tanks 2 and 3 need the auto feeder and water changer to finish, ration and water care move once automated, the You page
check('31 Oct: a seeded tank costs AED 150, its auto gear is bought on the sheet or later, and the gear clears the flag',`
var g=newGame();g.tanks[0].cycledAt=0;g.money=100;if(addTank(g))throw Error('100 is not enough');g.money=460;if(!addTank(g))throw Error('buys the tank');if(g.money!==310)throw Error('tank only, '+g.money);var T=g.tanks[1];if(!T.gearDue)throw Error('flag');
if(!buyUpgrade(g,T,'feeder')||!buyUpgrade(g,T,'autoWC'))throw Error('gear');if(T.gearDue)throw Error('flag cleared');
var m=newGame();m.me=newMe();m.me.hrs={exercise:200};hoursDay(m);if(!(m.me.dlog&&m.me.dlog.length===1))throw Error('your day log');`);
if(!html.includes("if(a==='ts-close'){if(TS&&gearDone(G.tanks[TS.i]))closeTankSheet();return;}"))throw Error('Puti: Got it waits for both, I will buy them later is the other way out');
if(!html.includes("lite||(!!T.feeder&&(id==='f-ration'||id==='h-ration'))"))throw Error('Puti: no Ration slider once the tank has an auto feeder');
if(html.includes("$('autocard').after(c)"))throw Error('Puti 6 Nov (replaces Pass 155): all tank care stays on Tank, Gear only sells things');
if(!html.includes("data-act=\"treat-unlock\" data-id=\"'+x.id+'\" title=")||html.includes("Treats, for every tank</h3>"))throw Error('Puti 6 Nov: treats are unlocked and picked in Feeding, not in Gear');
if(!/id:'chiller'/.test(html)||!html.includes("if(id==='chiller')return T.heater<2?HEAT_COST[2]:null;"))throw Error('Puti 6 Nov: the thermostat chiller is on offer as soon as the heater is, not after it');
if(!html.includes('<section class="panel" id="p-me" hidden><div class="card coll" data-k="megp" id="me-gp"><div class="hd"><h2>Grandma</h2><small id="me-gsum"></small></div><div id="me-gplace"'))throw Error('Puti 6 Nov: one Grandma card on top of the You page, her place first inside it');
if(!html.includes("hh=GT_OPEN&&(lg.length||un)")||!html.includes("if(activeTab!=='me'){GT_OPEN=0;return;}"))throw Error('Puti: Grandma shows nothing until Check on Grandma, closed each visit');
check('30 Oct: the home tank goes back to 20 L when the farm takes over, and slows its breeding near 50',`
var g=readyGame(),T=g.tanks[0];T.volTier=4;T.vol=320;T.pop=[{n:200,age:120,g:80}];ownTankNow(g);if(T.vol!==20||Math.round(totalN(T))!==20)throw Error('20 L, 20 shrimp: '+T.vol+' '+totalN(T));g.money=1e6;if(upgradeCost(g,T,'tank')!=null||buyUpgrade(g,T,'tank'))throw Error('the home tank can not be made bigger again');
if(homeCrowd(g,T)!==1)throw Error('no slowdown while shrimp still sell by hand');g.emp.farms[FARMS[FARMS.length-1].id]=1;
T.pop=[{n:20,age:120,g:80}];var a=homeCrowd(g,T);T.pop=[{n:45,age:120,g:80}];var b=homeCrowd(g,T);T.pop=[{n:60,age:120,g:80}];var c=homeCrowd(g,T);if(!(a>0.8&&b<0.25&&c===0))throw Error('breeding slows toward 50: '+a+' '+b+' '+c);
var o=readyGame();o.me=o.me||newMe();o.me.keep='self';o.tanks[0].volTier=5;o.tanks[0].vol=640;o.tanks[0].pop=[{n:3000,age:120,g:80}];migrate(o);if(o.tanks[0].vol!==20||Math.round(totalN(o.tanks[0]))!==20)throw Error('old saves shrink too');
var k=readyGame();if(breedersAll(k)!==k.tanks.reduce(function(t,x){return t+keepN(x);},0))throw Error('one kept number');`);
if(!html.includes("big(breedersAll(G))+' kept to breed'"))throw Error('Puti: Kits shows the same kept number as Trade');
if(html.includes("['Change water',big(waterUse(G))"))throw Error('Puti: no Change water row in Owners tanks');
if(!html.includes("gb[bandOf(k.g)]+=k.n;if(k.age>=75)"))throw Error('Puti: colony grade rows count every shrimp');
if(!html.includes("Math.round(kitCap(G)/Math.max(1,popOpen(G))*100)+'% of them want a tank"))throw Error('Regions percent matches the people figure');
count++;console.log('PASS 30 Oct requests');
// Pass 161: Tank 1's own clock, one shared tank with the land, monthly jobs, leaving after Space
const OWN_SETUP=`function ownGame(){var g=readyGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;T.feeder=1;T.autoWC=1;T.pop=[{n:30,age:120,g:60},{n:10,age:20,g:40}];g.me=g.me||newMe();g.me.on=1;g.me.keep='self';g.emp.farms.rack=1;g.money=1e6;g.me.gplace={balcony:1,house:1,land:1};g.tday=g.day;return g;}
function run(g,n,k){for(var i=0;i<n;i++){g.progress.queue=[];g.emp.ended=null;stepGame(g,k);}}`;
check('Pass 161: tank clock, 40x elsewhere moves Tank 1 a day per 40, the land and old saves',OWN_SETUP+`
var g=readyGame();delete g.tday;run(g,8);if(g.tday!==g.day)throw Error('Before the land the tank day is the company day');
var f=ownGame();delete f.me.gplace;f.tday=f.day;var fd=f.day;run(f,4*40,1/40);if(f.tday-fd!==1)throw Error('Pass 261: with the farm but no land, Tank 1 moves by its own clock, not the company: '+(f.tday-fd));
var h=ownGame();h.tday=h.day;var d0=h.day,t0=h.tday;run(h,4*40,1/40);if(h.day-d0!==40||Math.round(h.tday-t0)!==1)throw Error('At 40x the company moves 40 days, the tank one: '+(h.day-d0)+' '+(h.tday-t0));
d0=h.day;t0=h.tday;run(h,4*3);if(h.day-d0!==3||h.tday-t0!==3)throw Error('On the land (real time) and at 1x both move together');
var o=ownGame();o.day=900;delete o.tday;migrate(o);if(o.tday!==900)throw Error('Old saves start the tank clock at the company day');
var T=h.tanks[0];waterChange(h,T,10);if(T.lastWC!==h.tday)throw Error('Tank stamps use tank days');
if(td(h,T)!==h.tday||td(g,g.tanks[0])!==g.day)throw Error('td reads the right clock');
var S=h.stats,n0=S.ownD||0,m0=S.ownTD||0;run(h,4*40,1/40);if((S.ownD||0)-n0!==40||(S.ownTD||0)-m0!==1)throw Error('Pass 184: first tank spans count company days, the care rate tank days: '+((S.ownD||0)-n0)+' '+((S.ownTD||0)-m0));`);
check('Pass 161: one tank, the land draws the game state and its jobs come back',OWN_SETUP+`
var g=ownGame(),T=g.tanks[0],C=careOf(T);C.mulm=0.6;C.sponge=0.55;C.grow=0.7;C.pests=[{k:'snail'},{k:'snail'},{k:'flat'}];
var o=landOwn(g);if(o.ga.reduce(function(a,b){return a+b;},0)!==o.adults||o.gy.reduce(function(a,b){return a+b;},0)!==o.young)throw Error('Grade counts add up to the shrimp');
if(o.ga[vgOf(60)]!==30||o.tday!==g.tday)throw Error('Grades are the tank view grades: '+o.ga);
if(o.care.mulm!==0.6||o.care.snail!==2||o.care.flat!==1||!o.well||o.due.indexOf('gravel')<0||o.due.indexOf('pests')<0||o.decor!==null)throw Error('The mess, wellbeing and due jobs go to the land: '+JSON.stringify(o));
var c0=g.stats.care||0;landTank(g,{mulm:0.05,sponge:0,grow:0.2,snail:1,flat:0,job:1,decor:{wood:1,plants:0,moss:1,leaves:0}});
if(C.mulm!==0.05||C.sponge!==0||C.grow!==0.2||C.pests.length!==1||(g.stats.care||0)!==c0+1)throw Error('A job on the land is done in the game too');
if(!T.wood||T.plants||!T.ldec||!landOwn(g).decor.wood)throw Error('The land decides the decor once, then the game sends it back');
if(ownDue(g).length)throw Error('Nothing due after the jobs: '+ownDue(g));`);
check('Pass 161/179: own-tank jobs about once a tank month, the tank stays fine between',OWN_SETUP+`
var g=ownGame(),T=g.tanks[0],C=careOf(T);T.glass=null;C.mulm=C.sponge=C.grow=0;C.pests=[];for(var d=0;d<30;d++){g.tday++;glassGrow(g,T);careDay(g);}
var gm=glassMean(T);if(gm<0.1||gm>0.5)throw Error('Pass 246: glass partly green after 30 tank days (full in 75 to 150): '+gm);
if(ownWell(g).total<50)throw Error('A month of mess still reads Fine: '+ownWell(g).total);
for(d=0;d<90;d++){g.tday++;glassGrow(g,T);careDay(g);}if(ownWell(g).total>=60)throw Error('Months of nothing shows: '+ownWell(g).total);`);
check('Pass 161: leaving after the win, without the land too',OWN_SETUP+`
var g=ownGame();g.emp.won=1;if(!canLeave(g))throw Error('Leaving is offered after the win');
if(!leaveCompany(g)||!g.left||!landOpen(g))throw Error('Leaving works and brings the land');
var h=ownGame();h.emp.won=1;if(!canLeave(h))throw Error('Leaving is offered after the win');
var k=ownGame();k.emp.hard={open:1};if(!canLeave(k))throw Error('Leaving is offered from the hard part');
var n=ownGame();if(canLeave(n))throw Error('Not before the hard part');`);
if(html.includes('id="leave-row"')||!html.includes("h+=leaveHTML();")||!html.includes("return leaveHTML()+HARD_GOALS"))throw Error('Leaving is on the You tab and the hard part, not in Settings (Puti, 30 Oct)');
if(!html.includes("body.left-on .tabs,body.left-on #speed{display:none!important}")||!html.includes("function landHide(){if(G&&G.left)return;"))throw Error('After leaving the land is all there is: no tabs, no back');
if(!html.includes("#review-box .sheet-in{max-height:88vh"))throw Error('The recap scrolls');
if(!html.includes("var PACE_T='Your tank runs at 1× on this tab'")||!html.includes("if(tankPace()&&v>1){SPEED_WANT=v;v=1;}"))throw Error('The Tank tab runs at 1x once the tank has its own clock');
const home161=fs.readFileSync(path.join(__dirname,'../shrimp/home.html'),'utf8');
if(!home161.includes('function applyOwn(T,d)')||!home161.includes("post({type:LEFT?'menu':'back'})")||!home161.includes("if(T.own||T===ownT())return;"))throw Error('The land follows the game tank and has no way back after leaving');
count++;console.log('PASS Pass 161 requests');
['shrimp-playthrough','shrimp-average-playthrough','shrimp-space-playthrough'].forEach(function(f){if(!fs.readFileSync(path.join(__dirname,f+'.cjs'),'utf8').includes("require('./shrimp-bot-cards.cjs')"))throw Error('Bots answer every card, they never close one without a pick (Puti, 30 Oct): '+f);});
count++;console.log('PASS bots pick on every card');
// Pass 163 (Puti, 31 Oct): the third-floor buyer, health check size, land clock card
check('Pass 163: a month after the first babies a neighbour buys 5, never breeders, AED 3 each',OWN_SETUP+`
var g=readyGame(),T=g.tanks[0];T.had=1;T.cycledAt=0;g.me=g.me||newMe();
T.pop=[{n:10,age:120,g:60,b:1},{n:4,age:3,g:40}];g.stats.bornDay=1;g.day=40;
if(milestoneConditions(g).jar)throw Error('Only 4 that are not breeders, no card yet');
T.pop.push({n:6,age:50,g:50});if(!milestoneConditions(g).jar)throw Error('Card once 5 spare shrimp a month after the babies');
var spare=jarSpare(g),bought=T.pop[0].n,m0=g.money;if(!storyChoose(g,'jar',0))throw Error('Sell him 5 fails');
if(T.pop[0].n!==bought)throw Error('Bought breeders were sold');if(Math.round(g.money-m0)!==15||g.stats.sold!==5)throw Error('Pays 15 for 5: '+(g.money-m0));
if(jarSpare(g)!==spare-5)throw Error('Takes exactly 5');
var k=readyGame();k.stats.bornDay=1;k.day=40;k.kits.sold=1;k.tanks[0].pop=[{n:20,age:50,g:50}];if(milestoneConditions(k).jar)throw Error('Not after kits');
var o=readyGame();o.stats.born=9;delete o.stats.bornDay;o.day=200;migrate(o);if(o.stats.bornDay!==200)throw Error('Old saves before kits get it a month from now');`);
check('Pass 163: the land starts the tank clock and brings Two clocks',`
if(CARD_NOW.indexOf('health')<0)throw Error('health card is urgent');
var g=readyGame();g.me=g.me||newMe();g.me.keep='self';g.emp.farms.rack=1;if(!tankClock(g))throw Error('Pass 261: from the first farm Your tank is on its own clock');
g.me.gplace={land:1};if(!tankClock(g)||!milestoneConditions(g).landtime)throw Error('land splits the clocks and brings Two clocks');`);
[[/si=hcWait\?-1:/,'the sick guide waits for the health card'],[/var n=Math\.max\(1,Math\.min\(16,Math\.floor\(totalN\(T\)\)\)\)/,'health check shows the colony when under 16'],[/function tankPace\(\)\{return false;\}/,'the Tank tab does not slow the company']].forEach(function(r){if(!r[0].test(html))throw Error('Pass 163: '+r[1]);});
if(/Tap the tank, then Check shrimp to find the sick ones/.test(html))throw Error('Pass 163: no extra Check shrimp spotlight after the health card');
count++;console.log('PASS Pass 163 requests');
check('Pass 166: the ledger gives late and partly, Nour writes six times, the sales drop is plain',`
var g=readyGame();g.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};g.money=1e10;g.day=0;
operatingNet=function(){return 1e8;};capitalReserve=function(){return 1e9;};
var H=hardOf(g);for(var d=0;d<30;d++){g.day=d;giveDay(g,H,d);}if(H.gv)throw Error('Nothing is given at 0%');
hardAlloc(g,'aid',.5);if(hardAllocOf(H).aid!==.5)throw Error('Aid is a share (Pass 250)');var m0=g.money;for(d=30;d<130;d++){g.day=d;giveDay(g,H,d);}
if(!(Math.abs(H.gv-100*5e7)<1))throw Error('Half the profit a day: '+H.gv);if(Math.abs(m0-g.money-H.gv)>1)throw Error('Giving comes out of cash');
if(!(H.gq.length===1&&H.gq[0].due>=121+365&&H.gq[0].due<121+730))throw Error('A batch lands a year or two later: '+JSON.stringify(H.gq));
g.money=1e9+3e7;for(d=130;d<140;d++){g.day=d;giveDay(g,H,d);}if(g.money<1e9-1)throw Error('Giving never eats the cash the company needs');
var gv=H.gv;for(d=140;d<1000;d++){g.day=d;giveDay(g,H,d);}
if(!(H.got>0&&H.lost>0))throw Error('Some arrives, some is lost');var w=H.gq.reduce(function(a,x){return a+x.a;},0)+H.bt;if(Math.abs(H.got+H.lost+w-H.gv)>1)throw Error('Given = arrived + lost + on its way');
if(!giveLines(g)[0]||!/arrived/.test(giveLines(g)[0]))throw Error('The ending reads what was given');
['wash','safe','power','lifeLo','lifeHi','noWater','noPower','africa'].forEach(function(k){if(!(LEDGER[k]>0))throw Error('Ledger number missing: '+k);});
var n=readyGame();n.story.miraDay=1;n.emp.hard={open:1,goal:'home',picks:{},day:0};n.day=44;var c=cards3Cond(n);if(c.nour1)throw Error('Nour waits 45 days');
n.day=2000;c=cards3Cond(n);if(!c.nour1||c.nour2)throw Error('Nour cards come one after another');
ensureProgress(n).seen.nour1=1;MILESTONES.nour1.pick(n,2);if(!cards3Cond(n).nour2)throw Error('then the next');
var b3=MILESTONES.nour3.bodyFn(n);if(nourOf(n).n!==7||!/Two more died/.test(b3))throw Error('No pump, no grid: 7 left, got '+nourOf(n).n);MILESTONES.nour3.bodyFn(n);if(nourOf(n).n!==7)throw Error('Deaths count once');
n.emp.hard.picks.hot={grid:{start:0,day:0}};var k=readyGame();k.story.miraDay=1;k.emp.hard={open:1,picks:{hot:{grid:{start:0}}},day:0};k.day=2000;if(!/Your solar farm/.test(MILESTONES.nour3.bodyFn(k))||nourOf(k).n!==14)throw Error('The grid helps her street');
MILESTONES.nour4.pick(n,1);if(nourOf(n).n!==4)throw Error('The bus loses three');
var x=readyGame();x.story.miraDay=1;x.emp.hard={open:1,goal:'home',picks:{never:{deliver:{start:0}}},day:0};x.day=2000;if(cards3Cond(x).nour1)throw Error('Mira stopped coming after the village');
ensureProgress(n).seen.nour6=1;if(!/water engineering/.test(nourLines(n)[0]))throw Error('Nour in the ending');
var txt=['nour1','nour2','nour3','nour4','nour5','nour6'].map(function(k){var m=MILESTONES[k];return (m.bodyFn?m.bodyFn(n):m.body)+(m.opts?JSON.stringify(m.opts(n)):'');}).join(' ')+GIVE_LOSS.join(' ');
if(/—/.test(txt))throw Error('No em-dashes');
`);
if(html.includes("hardSalesHTML")||!html.includes("'hard-give'")||!html.includes('Sources: WHO and UNICEF 2025'))throw Error('Pass 166: sales line, give slider and sources in the hard part');
for(const src of ['Hutton and Varughese 2016','Financing Electricity Access in Africa','givewell.org','WHO/UNICEF JMP','Tracking SDG 7'])if(!html.includes(src))throw Error('Pass 166: ledger source missing in a comment: '+src);
count++;console.log('PASS Pass 166 hard part additions in the page');
for(const src of ['PRIO','UNHCR Global Trends 2024','Survival International','WHO/UNICEF JMP','Tracking SDG 7 2025','FAO SOFI 2025','IAPB Vision Atlas','World Prison Brief','UCDP 2025','Fearon 1995','Walter 2002','Forbes Real-Time Billionaires','Ceres2030'])if(!html.includes(src))throw Error('Pass 250: source missing in a comment: '+src);
check('Pass 250 and 251: Aid, Science, Keep, proposals from people (arrive, fund, keep, stop, the levy, the class, the school), workarounds fade, one per group, the war ends once, the groups add up',`
var sum=0;HARD.forEach(function(x){sum+=x.n;});if(Math.abs(sum-3.896e9)>2e6)throw Error('the ten add to 3,896M: '+sum);if(hardGroup('water').n!==2.1e9||hardGroup('hot').n!==2.5e8)throw Error('water 2.1B, hot 250M');
var g=readyGame();g.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};g.money=1e12;g.day=0;g.fin=[];for(var i=0;i<7;i++)g.fin.push({kits:1e9,_inf:1e6});g.emp.inf=1e9;g.emp.infOn=1;
operatingNet=function(){return 1e9;};capitalReserve=function(){return 1e9;};infIncome=function(){return 1e6;};
var H=hardOf(g),A=hardAllocOf(H);if(A.aid||A.sci||A.build!=null||A.pol!=null||hardKeep(H)!==1)throw Error('Aid and Science start at 0, Keep is the rest, no Build or Policy (Pass 251)');
if(!hardAlloc(g,'aid',.15)||!hardAlloc(g,'sci',.1)||hardAlloc(g,'build',.3)||hardAlloc(g,'pol',.2)||Math.abs(hardKeep(H)-.75)>1e-9)throw Error('two shares in 5% steps, Keep is what is left');
hardAlloc(g,'aid',.95);if(Math.abs(A.aid-.9)>1e-9)throw Error('the sum is capped at 100%: '+A.aid);hardAlloc(g,'aid',.15);
var old=readyGame();old.emp.hard={open:1,goal:'home',picks:{},give:.5};if(hardAllocOf(old.emp.hard).aid!==.5||old.emp.hard.give!=null)throw Error('H.give migrates into Aid');
// Pass 251: old saves with Build and Policy money become running proposals at the reach they had
var o2=readyGame();o2.emp.hard={open:1,goal:'home',picks:{},alloc:{aid:0,sci:0,build:.3,pol:.2},bld:{water:{r:.2,pot:0},hot:{r:0,pot:0}},pol:{r:.1,given:5e6,y:1},day:0};var A2=hardAllocOf(o2.emp.hard),R2=propOf(o2.emp.hard);
if(A2.build!=null||A2.pol!=null||o2.emp.hard.bld||o2.emp.hard.pol||!R2.run.board||Math.abs(R2.run.board.r-.2)>1e-9||R2.run.solar||!R2.run.law||R2.run.law.given!==5e6||Math.abs(propReach(o2,'water')-.2)>1e-9)throw Error('Build and Policy migrate into a water board and a tank law: '+JSON.stringify(R2.run));
// proposals: arrive 10 to 50 days apart (Pass 258, letDay), at most 3 open, none from a group that is reached, the cross-cutting ones once there is something to pay
var R=propOf(H),d;for(d=0;d<1500;d++){g.day=d;hardDay(g);letDay(g);}
if(!(R.open.length===PROP_MAX))throw Error('three proposals open after four years with none answered: '+R.open.length);if(R.t.levy||R.t.school||R.t.talks)throw Error('the levy, the school and the talks wait for a running program');
var gaps=[];var pr=readyGame();pr.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};pr.humans=4.1e9;pr.money=1e12;pr.fin=g.fin;var PR=propOf(hardOf(pr)),last=null;for(d=0;d<3000;d++){pr.day=d;hardDay(pr);letDay(pr);if(PR.open.length){var id=PR.open[0].id;if(last!=null)gaps.push(d-last);last=d;propDecline(pr,id);}}
if(gaps.length<8||Math.min.apply(null,gaps)<LET_GAP[0]||gaps.filter(function(x){return x>LET_GAP[1]+1;}).length>gaps.length*.25)/* longer only when nobody is left to write (declined ones come back 90 days to 3 years later) */throw Error('a new proposal every 10 to 50 days: '+gaps.join(','));
if(!PR.no.board&&!PR.no.solar)throw Error('declined ones are noted');var ids=Object.keys(PR.t);if(ids.length<6)throw Error('different people write in: '+ids);
// fund one: build paid once, the crews a share of income, reach grows at their pace, 60 to 90% of the planned reach, the group's 7% a year cap
var fb=readyGame();fb.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};fb.humans=4.1e9;fb.money=1e12;fb.fin=g.fin;var FH=hardOf(fb),FR=propOf(FH);FR.open.push({id:'board',day:0,alt:0,grad:0});FR.t.board=1;
if(propDecline(fb,'nope'))throw Error('decline needs an open one');var m1=fb.money;if(!propFund(fb,'board'))throw Error('fund the water board');var p=FR.run.board;
if(!(m1-fb.money>=30*1e9*0.99)||!fb.emp.dues.some(function(x){return x.k==='prop:board'&&Math.abs(x.f-.015)<1e-9;}))throw Error('30 days of income to build, 1.5% of income for the crews: '+(m1-fb.money)+' '+JSON.stringify(fb.emp.dues));
if(!(p.full>=.12*.6-1e-9&&p.full<=.12*.9+1e-9))throw Error('60 to 90% of the planned reach arrives: '+p.full);if(FR.open.length)throw Error('funded leaves the open list');
for(d=1;d<=365;d++){fb.day=d;hardDay(fb);}if(!(p.r>0&&p.r<=p.full/6+1e-9&&Math.abs(propReach(fb,'water')-p.r)<1e-9&&Math.abs(hardReach(fb,hardGroup('water'))-p.r)<1e-9))throw Error('a year of the board: a sixth of its reach, counted for the group: '+p.r+' '+p.full);
for(d=366;d<=365*7;d++){fb.day=d;hardDay(fb);}if(Math.abs(p.r-p.full)>1e-9)throw Error('done in six years: '+p.r+' '+p.full);if(!rip(fb).log.some(function(x){return /work is done/.test(x.tx);}))throw Error('the Times says the work is done');
if(!propOK(fb,FH,propDef('board'),fb.day))throw Error('a cousin brings the next board once this one is done');
// stop paying the crews: reach falls 10% a year, the dues go, a news line, Grandma asks once
var r0=p.r;if(!propStop(fb,'board'))throw Error('stop');if(fb.emp.dues.some(function(x){return x.k==='prop:board';}))throw Error('stopping removes the dues');for(d=365*7+1;d<=365*8;d++){fb.day=d;hardDay(fb);}
if(!(p.r<r0&&Math.abs(p.r/r0-0.905)<0.01))throw Error('reach falls 10% a year after you stop: '+r0+' '+p.r);if(!rip(fb).log.some(function(x){return /mechanics went to the city/.test(x.tx);}))throw Error('she writes once');
if(!fb.me.hist.some(function(x){return /who Lana is/.test(x);}))throw Error('Grandma asks who she is');
// three in one group share the 7% a year cap
var c3=readyGame();c3.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};c3.humans=4.1e9;c3.money=1e13;c3.fin=g.fin;var CR=propOf(hardOf(c3));['board','loan','desal'].forEach(function(k){CR.open.push({id:k,day:0,alt:0,grad:0});CR.t[k]=1;if(!propFund(c3,k))throw Error('fund '+k);});for(d=1;d<=365;d++){c3.day=d;hardDay(c3);}
if(propReach(c3,'water')>BUILD_CAP+1e-9)throw Error('a group grows at most 7% a year: '+propReach(c3,'water'));if(!(rip(c3).log.some(function(x){return /desal plant opens/.test(x.tx);})))throw Error('the cold ones have their news');
// the levy: needs crews, a country every 6 to 18 months, one in four drops it, at 12 the crews are paid from it
var lv=readyGame();lv.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};lv.humans=4.1e9;lv.money=1e13;lv.fin=g.fin;lv.emp.inf=1e9;lv.emp.infOn=1;var LH=hardOf(lv),LR=propOf(LH);if(propOK(lv,LH,propDef('levy'),0))throw Error('the levy needs crews to pay');
LR.open.push({id:'board',day:0,alt:0,grad:0});LR.t.board=1;propFund(lv,'board');if(!propOK(lv,LH,propDef('levy'),0))throw Error('the levy comes once there are crews');LR.open.push({id:'levy',day:0,alt:0,grad:0});LR.t.levy=1;var i0=lv.emp.inf;if(!propFund(lv,'levy'))throw Error('fund the levy');
var sg=0,yrs=0;for(d=1;d<=365*25&&LR.lev.s<LEVY_N;d++){lv.day=d;hardDay(lv);}if(LR.lev.s<LEVY_N)throw Error('12 countries sign within 25 years: '+JSON.stringify(LR.lev));if(!(lv.emp.inf<i0))throw Error('the levy costs ✦');if(d/365<4||d/365>22)throw Error('the campaign takes years: '+(d/365));
if(lv.emp.dues.some(function(x){return x.k==='prop:board';}))throw Error('at 12 countries the crews come off your dues');if(!propLevyOn(lv)||propKeep(lv,propDef('board'))[0]!==0)throw Error('new crews are paid by the levy');
// the politics class: nothing for ten years, then a proposal a year from a graduate with the build a fifth cheaper; the maintenance school cuts the water crews' bill
var cs=readyGame();cs.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};cs.humans=4.1e9;cs.money=1e13;cs.fin=g.fin;var CH=hardOf(cs),CSR=propOf(CH);CSR.open.push({id:'course',day:0,alt:0,grad:0});CSR.t.course=1;propFund(cs,'course');
for(d=1;d<=365*12;d++){cs.day=d;hardDay(cs);if(CSR.open.length)CSR.open.forEach(function(x){propDecline(cs,x.id);});}if(!CSR.run.course.gok||CSR.grads<1||CSR.grads>3)throw Error('graduates bring one a year after ten years: '+CSR.grads+' '+JSON.stringify(CSR.run.course));
var gx={id:'board',day:0,alt:1,grad:1};if(Math.abs(propBuild(cs,propDef('board'),1)/propBuild(cs,propDef('board'),0)-0.8)>1e-6)throw Error('a graduate’s build costs a fifth less');
CSR.open.push({id:'board',day:0,alt:1,grad:0});CSR.t.board=2;propFund(cs,'board');if(propOK(cs,CH,propDef('school'),cs.day)!==true)throw Error('the school comes with a water program');CSR.open.push({id:'school',day:0,alt:0,grad:0});CSR.t.school=1;propFund(cs,'school');if(Math.abs(propKeep(cs,propDef('board'))[0]-.015*.7)>1e-9)throw Error('water crews cost 30% less with the school');
// science: 25 years at a trickle, stopping pauses the clock, done boosts workarounds
var sc=readyGame();sc.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};sc.money=1e12;sc.fin=g.fin;var HS=hardOf(sc);hardAlloc(sc,'sci',.05);for(d=0;d<365;d++){sc.day=d;sciDay(sc,HS,d,1e9);}if(!(HS.sci.p>1/26&&HS.sci.p<1/19))throw Error('5% is slower than 10%: '+HS.sci.p);
hardAlloc(sc,'sci',0);var p0=HS.sci.p;for(d=365;d<730;d++){sc.day=d;sciDay(sc,HS,d,1e9);}if(HS.sci.p!==p0)throw Error('stopping pauses the clock');
HS.sci.p=1;hardAlloc(sc,'sci',.1);sc.day=730;sciDay(sc,HS,730,1e9);if(!HS.sci.done)throw Error('done at 1');
/* Pass 267 (item 28): Ask nicely converts 30% of Said no for good each time, capped at 85%, three asks in 15 years reach the cap and a fourth adds nothing */var an=readyGame();an.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};an.money=1e13;an.fin=g.fin;var gno=hardGroup('no'),perms=[];for(var y=0;y<=15;y+=0.5){an.day=Math.floor(y*365);if(hardBuy(an,'no','ask'))perms.push([y,permReach(an,gno)]);}
if(perms.length!==3||Math.abs(perms[0][1]-0.3)>1e-9||Math.abs(perms[1][1]-0.6)>1e-9||Math.abs(perms[2][1]-0.85)>1e-9||perms[2][0]>15)throw Error('ask nicely perm '+JSON.stringify(perms));an.day=30*365;if(!hardBuy(an,'no','ask')||permReach(an,gno)!==0.85||hardReach(an,gno)>1)throw Error('cap');
/* Pass 267 (item 27): above a tenth, money buys a little speed, 15 years at a tenth, 12 at all of it, never printed in years */if(Math.abs(sciYears(0.1)-15)>1e-9||Math.abs(sciYears(1)-12)>1e-9||!(sciYears(0.5)<15&&sciYears(0.5)>12)||Math.abs(sciYears(0)-25)>1e-9)throw Error('sciYears '+[sciYears(0),sciYears(0.1),sciYears(0.5),sciYears(1)]);
sc.day=730+1825;if(Math.abs(sciReach(sc,'water')-0.3)>1e-9||sciReach(sc,'far')!==0)throw Error('science alone reaches 30% of water, hot, poor');
// workarounds: climb, hold, fade to the floor; one per group at a time; a faded one can be bought again; build underneath holds it up
var w=readyGame();w.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};w.money=1e12;w.fin=[{kits:1e9}];var WG=hardGroup('water'),WP=hardOf(w);
if(!hardBuy(w,'water','trucks'))throw Error('buy trucks');if(hardBuy(w,'water','jar'))throw Error('one workaround per group while one is running');
w.day=60;if(Math.abs(hardReach(w,WG)-0.15)>1e-9)throw Error('trucks reach 15%');w.day=60+365;if(Math.abs(hardReach(w,WG)-0.15)>1e-9)throw Error('held for a year');w.day=60+365+60;if(hardReach(w,WG)>1e-9)throw Error('faded to 0: '+hardReach(w,WG));
if(!hardBuy(w,'water','trucks'))throw Error('a faded one can be bought again');if(!WP.picks.water.trucks.again||WP.picks.water.trucks.start!==w.day)throw Error('again');w.day+=60+365+60;if(!hardBuy(w,'water','jar'))throw Error('after the fade another workaround can start');
var wb=readyGame();wb.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0,pr:{open:[],run:{board:{day:0,alt:0,r:.3,full:.3,given:0,paid:0,keep:.015,stop:null,grad:0}},no:{},t:{},next:null,n:1,lev:{s:0,f:0,next:0},grads:0,gnext:0}};wb.money=1e12;wb.fin=[{kits:1e9}];hardBuy(wb,'water','trucks');wb.day=60+365+200;if(Math.abs(hardReach(wb,WG)-0.45)>1e-9)throw Error('build underneath holds a workaround up: '+hardReach(wb,WG));
var c=readyGame();c.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};c.money=1e12;c.fin=[{kits:1e9}];hardBuy(c,'hot','panel');c.day=120;hardBuy(c,'hot','gene');var cap=hardWorkReach(c,hardGroup('hot'));if(cap>WORK_CAP)throw Error('workarounds cap at half a group');
// fading takes its tanks with it
var f=readyGame();f.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};f.money=1e12;f.fin=[{kits:1e9}];f.humans=hardEasy(f)+2e8;f.day=0;hardDay(f);if(!(f.humans<hardEasy(f)+2e8))throw Error('people above the cap lose their tanks, 2% of the gap a day');
// war: one ending option, work options stack under it, talks need Policy
var v=readyGame();v.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};v.money=1e13;v.fin=[{kits:1e9}];var VG=hardGroup('war');
if(hardBuy(v,'war','pay'))throw Error('the talks are a proposal now (Pass 251)');var VR=propOf(hardOf(v));if(propOK(v,hardOf(v),propDef('talks'),0))throw Error('the mediator waits for a running program');VR.run.board={day:0,alt:0,r:.01,full:.1,given:0,paid:0,keep:.015,stop:null,grad:0};if(!propOK(v,hardOf(v),propDef('talks'),0))throw Error('then the mediator writes');VR.open.push({id:'talks',day:0,alt:0,grad:0});VR.t.talks=1;if(!propFund(v,'talks'))throw Error('fund the talks');if(!(hardOf(v).picks.war.pay&&hardOf(v).picks.war.pay.start===0))throw Error('the talks take the war’s ending slot');if(hardBuy(v,'war','out')||hardBuy(v,'war','fund'))throw Error('one ending option');
if(!hardBuy(v,'war','convoy'))throw Error('convoy stacks under it');v.day=600;if(Math.abs(hardReach(v,VG)-1)>1e-9)throw Error('talks reach all after 540 days');
var x=readyGame();x.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};x.money=1e13;x.fin=[{kits:1e9}];hardBuy(x,'war','convoy');x.day=400;if(!hardBuy(x,'war','checkpoint'))throw Error('war work options stack');x.day=600;if(hardWorkReach(x,VG)>WAR_WORK_CAP)throw Error('to 0.8');
VG.ops.forEach(function(o){if(o.k==='work'&&!o.life&&!o.old)throw Error('war work options have a life: '+o.id);});
if(!/civil war/.test(VG.body))throw Error('the war sentence');['nour1','nour2','nour3','nour4','nour5','nour6'].forEach(function(k){var mm=MILESTONES[k],t=(mm.bodyFn?mm.bodyFn(v):mm.body)+(mm.opts?JSON.stringify(mm.opts(v)):'');if(/river|rice/.test(t))throw Error('Milo never mentions the river or rice water: '+k);});
HARD.forEach(function(gg){gg.ops.forEach(function(o){if(/river war/.test(o.end||'')&&!o.old)throw Error('no river war in endings: '+o.id);});});
if(!/one Musk/.test(muskPct(1e9)+' of one Musk')||muskPct(RICH_USD*USD_AED*0.001)!=='0.1%')throw Error('Musk units: '+muskPct(RICH_USD*USD_AED*0.001));
var rl=routeLines(fb).concat(routeLines(g));if(!rl.some(function(t){return /water board reached/.test(t)&&/stopped paying/.test(t);})||!rl.some(function(t){return /membrane was/.test(t);}))throw Error('the ending names the people and what you stopped paying for: '+rl.join(' | '));var rl2=routeLines(lv);if(!rl2.some(function(t){return /12 countries signed/.test(t);}))throw Error('the ending counts the levy: '+rl2.join(' | '));
`);

check('Pass 168: leaving Earth opens with the hard part and enough science, ends Earth, points buy the ship',`
var g=readyGame();g.money=2e10;g.kits.sold=3e9;g.humans=4e9;
if(voyageOpen(g))throw Error('Shut before the hard part');
g.academy.papers=600;if(voyageOpen(g))throw Error('Science alone does not open it');
g.emp.hard={open:1,goal:'home',picks:{},day:0};if(!voyageOpen(g))throw Error('Hard part plus 600 papers opens it');
g.academy.papers=0;g.academy.done={observe:40};rlines(g).genes.found=3;rlines(g).food.dud=2;if(sciScore(g)!==65)throw Error('Score: studies 1, finds and null results 5: '+sciScore(g));if(voyageOpen(g))throw Error('65 is not enough');
g.academy.papers=435;if(sciScore(g)!==500||!voyageOpen(g))throw Error('500 opens it');
var rich=voyagePtsOf(g),half=g.money;g.money=half/2;var poor=voyagePtsOf(g);g.money=half;if(!(rich.cash-poor.cash<=13&&rich.cash>poor.cash))throw Error('Giving half away costs a few points: '+rich.cash+' '+poor.cash);
var m0=g.money;if(!startVoyage(g))throw Error('Start');var V=g.voyage;
if(!earthArchived(g)||canLeave(g)||voyageOpen(g))throw Error('Earth ends, other doors shut');
if(!landOpen(g)||!ownTank(g))throw Error('The land and Tank 1 come along');if(m0-g.money>3e5)throw Error('Cash stays: '+(m0-g.money));
if(V.fuel!==300||voyageSpent(V)!==0||voyageTotal(V)!==V.pts.cash+V.pts.sci+V.pts.kits)throw Error('Starts with 300 free flybys');
if(voyageSet(g,'fuel','',290)||!voyageSet(g,'fuel','',310)||voyageSpent(g.voyage)!==10||!voyageSet(g,'fuel','',300))throw Error('300 is the least, more costs a point each');
var k0=g.kits.sold,h0=g.humans,d0=g.day;g.progress.queue=[];for(var i=0;i<400;i++){g.progress.queue=[];stepGame(g);}if(g.day-d0<99)throw Error('Days still pass: '+(g.day-d0));if(g.kits.sold!==k0||g.humans!==h0)throw Error('The company stops');
if(!voyageSet(g,'inst','transit',true)||!g.voyage.inst.transit)throw Error('Instrument');if(voyageSet(g,'fuel','',600)||voyageSet(g,'robots','',-1)||voyageSet(g,'inst','laser',true))throw Error('Out of range refused');
while(voyageSet(g,'robots','',g.voyage.robots+1));if(voyageLeft(g)<0)throw Error('Never over the points');if(voyageSet(g,'seeds','birds',true)&&voyageLeft(g)<0)throw Error('Seeds over the points');
if(!voyageSet(g,'robots','',0)||!voyageSet(g,'seeds','soil',true))throw Error('Taking back frees points');
var s2=JSON.parse(JSON.stringify(g));if(!s2.voyage||s2.voyage.fuel!==g.voyage.fuel)throw Error('Saves');
`);
check('Pass 169: launch seals the ship, the trip comes back from space.html and saves',`
var g=readyGame();g.money=2e10;g.kits.sold=3e9;g.humans=4e9;g.emp.hard={open:1,goal:'home',picks:{},day:0};g.academy.papers=600;
if(!startVoyage(g))throw Error('Start');if(voyageTrip(g,{s:0,used:0,path:[]}))throw Error('No trip before launch');
if(!voyageLaunch(g)||!g.voyage.sealed||!(g.voyage.seed>0))throw Error('Launch');if(voyageLaunch(g))throw Error('Once');
if(voyageSet(g,'robots','',1))throw Error('Sealed ship does not change');
if(voyageTrip(g,{s:-1,used:0,path:[]})||voyageTrip(g,'x'))throw Error('Bad trips refused');
if(!voyageTrip(g,{w:['river','warm','green'],s:3,used:4,path:[0,1,0],scans:{},done:null,woke:1})||g.voyage.trip.s!==3||g.voyage.landed)throw Error('Trip kept');
if(!voyageTrip(g,{w:['river'],s:3,used:14,path:[0,1,0],scans:{},done:{s:3,id:'3.0',name:'SC <b>30 b',fit:71},woke:1})||!g.voyage.landed||g.voyage.landed.fit!==71||/</.test(g.voyage.landed.name))throw Error('Landing kept, name cleaned');
var s2=migrate(JSON.parse(JSON.stringify(g)));if(!s2.voyage.landed||s2.voyage.trip.used!==14)throw Error('Saves');
`);
if(!html.includes('id="space-if"')||!html.includes("data-act=\"voy-launch\""))throw Error('Pass 169: launch button and ship overlay in the page');count++;console.log('PASS Pass 169 ship overlay in the page');
if(!html.includes('id="tab-land"')||!html.includes('id="voyage-door"')||!html.includes('id="voyage-card"')||!html.includes("if(b.dataset.tab==='land')"))throw Error('Pass 168: land tab, door and ship card in the page');
count++;console.log('PASS Pass 168 leaving Earth in the page');
// Pass 170 (Puti, 31 Oct): the old Space chapter is gone, the header goal hides after leaving Earth, the land knows it's a voyage, settling stops at Preparing for settlement
{const sp=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8'),home=fs.readFileSync(path.join(__dirname,'../shrimp/home.html'),'utf8');
if(/MILESTONES\.spaceDream|id="space-card"|function spaceOpen|WORLDS=\[/.test(html))throw Error('Pass 170: old Space chapter left in the page');
if(!html.includes("&&!G.emp.won&&!G.voyage;var el0=G.voyage?'':earthLine(G,!tg);"))throw Error('Pass 170: header goal bar hides after leaving Earth');
if(!html.includes('voy:G.voyage?1:0')||!home.includes("VOY?'Space':'Company'"))throw Error('Pass 170: the land gets a voyage flag for its back button');
if(!html.includes('Preparing for settlement…')||!sp.includes('Preparing for settlement…'))throw Error('Pass 170: landing stops at Preparing for settlement');
if(!home.includes('data-mir')||!home.includes("{id:'fence',name:'Fence'")||!home.includes('function gmSeats'))throw Error('Pass 170: land mirror tool, made fences, Grandma on made chairs');}
count++;console.log('PASS Pass 170 cleanup after the planet search');
check('Pass 171: Grandma sleeps on the ship, no Check on Grandma events after leaving Earth',`
var g=readyGame();g.me=g.me||newMe();g.me.on=1;g.voyage={day:1,pts:{cash:0,sci:0,kits:0}};g.me.cur={id:'x',t:0,d:0};g.me.call='gt';var q0=JSON.stringify(gtOf(g).q);
for(var i=0;i<400;i++){g.day+=1;personalDay(g);}if(g.me.cur||g.me.call||JSON.stringify(gtOf(g).q)!==q0||gtCheck(g))throw Error('Grandma events after leaving');
`);
{const sp=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8');
if(/planets you passed|were better|Best of all/.test(sp)||!sp.includes('⌂ Home'))throw Error('Pass 171: no rank against other planets on landing, Home button on the ship');
if(!html.includes("else if(d.type==='back'){spaceHide();if(landOpen(G))landShow();}")||!html.includes("if(!fj&&G.voyage&&G.voyage.sealed)spaceShow();"))throw Error('Pass 171: ship Home goes to the land, the land goes back to the ship');}
count++;console.log('PASS Pass 171 ship goes home to the land, landing has no rank');
// Pass 172 (Puti, 31 Oct): real sky, more instruments, Grandma off the land after leaving, color panel with sliders, Make icons
{const sp=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8'),home=fs.readFileSync(path.join(__dirname,'../shrimp/home.html'),'utf8');
if(!/var REAL=\[/.test(sp)||!sp.includes("{id:'orbit',name:'Orbit tracker'")||!html.includes("{id:'mag',name:'Radio aurora watch'"))throw Error('Pass 172: real planets and the new instruments');
if(!home.includes('window.GM_AWAY=!!VOY')||!home.includes('function gmAway')||!home.includes('class="cp-row"')||!home.includes('Reset this color')||!home.includes("mkI('undo','Back')"))throw Error('Pass 172: land changes');
if(/>Colours<|As drawn|All as drawn/.test(home))throw Error('Pass 172: color, and no As drawn buttons');}
count++;console.log('PASS Pass 172 real sky and land changes');
// Pass 173 (Puti, 31 Oct): stream shrimp put in Your tank reach Tank 1; whole-pixel zoom so Millie's eyes keep their shape
{const home=fs.readFileSync(path.join(__dirname,'../shrimp/home.html'),'utf8');if(!home.includes("if(T&&o&&T===o&&list&&list.length)post({type:'give'")||!home.includes('var ZOOMS=[1,2,4,6],ZDEF=1;'))throw Error('Pass 173: trap give and whole-pixel zoom');}
count++;console.log('PASS Pass 173 trap catches reach the game, whole-pixel zoom');
// Pass 174 (Puti, 31 Oct): Millie on whole canvas pixels; the ship's panel keeps one height, instruments are buttons in their rows, Fly by by the star, Brake on the map
{const home=fs.readFileSync(path.join(__dirname,'../shrimp/home.html'),'utf8'),sp=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8');
if(!home.includes('L.R=2;L.cv.width=vw*L.R'))throw Error('Pass 174: land canvas at 2 pixels per art pixel');
if(!sp.includes('id="flyb"')||!sp.includes('id="brakeb"')||!sp.includes("Not on board")||!sp.includes('#panel:not(.tall){height:'))throw Error('Pass 174: ship layout');}
count++;console.log('PASS Pass 174 Millie pixels, fixed ship layout');
// Pass 175 (Puti, 31 Oct): tests cost 0.1 (transit 0.2), the panel never scrolls, Orbit is the last row
{const sp=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8');
if(!sp.includes("name:'Transit spectroscopy',cost:.2,")||!sp.includes("name:'Orbit tracker',cost:.1,")||!sp.includes("['orbit','Orbit',orbitText]];")||!sp.includes('#panel:not(.tall){height:404px;max-height:none;overflow:auto'))throw Error('Pass 175: tenth test costs, fixed panel');}
count++;console.log('PASS Pass 175 test costs and fixed panel');
// Pass 179 (Puti, 31 Oct): Tank 1 on one real-time clock, 3 months from clean to covered, its jobs are the land's. Full checks: tests/shrimp-tank1.cjs
{const home=require('fs').readFileSync(__dirname+'/../shrimp/home.html','utf8');
if(!html.includes('var TANK_DAY_MS=2400,TANK_CATCH=30;')||!html.includes('var OWN_DUE=1/3,OWN_FULL=90,OWN_MULM=115;')||!html.includes('stepGame(G,0)||progressionBlocked(G))break;}')||!html.includes("var LAND_JOBS={glass:'glass',vac:'vac',sponge:'sponge',trim:'trim',pest:'pests',scape:'scape'};"))throw Error('Pass 179: Tank 1 runs 2.4 s a tank day at any speed, 90 days to full, jobs on the land');
if(!home.includes("TOYS.push({id:'glass'")||!home.includes("var busy=jobOpen();")||!home.includes("name==='wipe'"))throw Error('Pass 179: the land has the glass wipe and leaves a job alone');
count++;console.log('PASS Pass 179 one clock, one tank, slower mess');}
// Pass 181 (Puti, 1 Nov): no wind on the land, one mute, the land banner never for the win. Full checks: tests/shrimp-land-audio.cjs
{const home=require('fs').readFileSync(__dirname+'/../shrimp/home.html','utf8');
if(home.includes("sfxLoop('wind')")||home.includes('outdoorAmb')||!home.includes("localStorage.getItem('shrimp-music')==='0'")||!home.includes("if(d.type==='vis')landVis(!!d.on);"))throw Error('Pass 181: land has no wind and shares the mute');
if(!html.includes("k==='win'||k==='gameover'||LAND.seen[k]")||!html.includes("landPost({type:'vis',on:0});musicResume();")||!html.includes("landPost({type:'mute',off:off?1:0})"))throw Error('Pass 181: banner and audio');
count++;console.log('PASS Pass 181 land banner, no wind, one mute');}
check('Pass 183: the hard part is things you watch (orders chart removed in Pass 190), one-line groups, short Nour cards',`
var g=readyGame();g.humans=4.1e9;g.day=3000;var H=hardOf(g);hardDay(g);if(!H.open)throw Error('opens at 4B');
for(var i=0;i<30;i++){g.day++;hardDay(g);}if(H.oh)throw Error('no orders history any more (Pass 190)');
HARD.forEach(function(x){if(x.body.split('. ').length>2||x.body.length>110)throw Error('one or two short sentences per group (Pass 250, the war line is hers): '+x.name);});
var n=readyGame();n.story.miraDay=1;n.emp.hard={open:1,goal:'home',picks:{},day:0};n.day=2000;
['nour1','nour2','nour3','nour4','nour5','nour6'].forEach(function(k){var m=MILESTONES[k],t=m.bodyFn?m.bodyFn(n):m.body;if(t.length>230||/\\n/.test(t))throw Error(k+' is longer than two lines: '+t.length);});
`);
check('Pass 184: one-off personal spending is not a daily loss',`
var g=readyGame();g.money=300000;g.fin=[];for(var i=0;i<7;i++)g.fin.push({shrimp:20000,staff:-6000,family:-500});
var before=operatingNet(g);g.fin[6].personal=-294000;g.money-=294000;
if(Math.abs(operatingNet(g)-before)>1e-6||operatingNet(g)<=0)throw Error('personal counted in operatingNet: '+operatingNet(g));
if(cashRunway(g)!==Infinity)throw Error('runway after a personal buy');
g.fin[6].family=-500000;if(operatingNet(g)>=before)throw Error('money to Grandma must still count');
var h=readyGame();h.fin=[];h.mh=[];for(var i=0;i<5;i++){h.fin.push({shrimp:100});h.mh.push(1000+100*i);}h.money=1500;h.fin[4].personal=-4000;h.money-=4000;
if(Math.abs(netPerDay(h)-100)>1e-6)throw Error('netPerDay counts a personal buy: '+netPerDay(h));
`);
if(!html.includes("if(!G.ob.sp4c&&speed>=4)G.ob.sp4c=1;")||!html.includes("top:calc(24px + env(safe-area-inset-top,0px))"))throw Error('Pass 184: no 4x spotlight at 4x or more, story card near the top');count++;
if(!html.includes("var HG_COLS=80")||!html.includes('id="hg-cv"')||!html.includes('id="nour-cv"')||html.includes("showAfter(ho.t,ho.news"))throw Error('Pass 183: people grid, Nour jar, no popup after a hard-part option');count++;
check('Pass 205: farm wellbeing, many or happy',`
var g=readyGame();g.emp.farms={barn:4};g.money=1e9;var c0=farmCap(g),o0=farmOverhead(g),w0=farmWell(g),k0=sickKitRate(g);
if(w0!==FW_MID||farmWellMult(g)!==1)throw Error('The default farm changes nothing '+w0);
fwOf(g).s=0.5;if(!(farmCap(g)<c0*0.51&&farmWell(g)>w0+30))throw Error('Fewer a rack: less output, more wellbeing '+farmCap(g)+' '+farmWell(g));
fwOf(g).s=1;fwOf(g).f=2;if(!(farmOverhead(g)>o0*1.2&&farmWell(g)>w0))throw Error('Fancy feed costs upkeep and raises wellbeing');
fwOf(g).s=0.5;if(!(sickKitRate(g)<k0))throw Error('Happy farms send out fewer sick kits');
var h=newGame();h.ps.fw=[60,60];if(!(playVal(h,'kin')>0.9))throw Error('Kin reads the farm setting held '+playVal(h,'kin'));h.ps.fw=[0,60];if(playVal(h,'kin')!==0)throw Error('Default farm is neutral kin');
var q=readyGame();q.emp.farms={barn:1};q.money=1e9;q.ps=q.ps||{};fwOf(q).s=0.5;fwOf(q).f=2;for(var i=0;i<40;i++){q.progress.queue=[];stepGame(q);}if(!(q.ps.fw&&q.ps.fw[1]>0&&q.ps.fw[0]>0)&&q.emp.prod>0)throw Error('Farm days add to the held setting '+JSON.stringify(q.ps.fw));
`);
check('Pass 207: the evil route counts as evil acts, and dictator needs them',`
var g=readyGame();g.money=1e12;g.emp.inf=1e9;g.emp.farms={hatch:1};g.emp.regions=['auh','gcc','eu'];g.humans=2e7;g.emp.proj.farmlic=1;
['ev_port','ev_bay','ev_club','ev_rival','ev_lobby'].forEach(function(id){if(!buyProj(g,id))throw Error('Buy '+id);});
if(evilActs(g)<5||!g.emp.evil.bay)throw Error('Acts '+evilActs(g)+' '+JSON.stringify(g.emp.evil));
var o=farmOverhead(g);delete g.emp.proj.ev_bay;if(!(farmOverhead(g)>o))throw Error('The bay license cuts upkeep');
var d=newGame();d.tr={drive:8,means:-6};d.emp.evil={bribe:1,force:1};if(endingPick(d)!=='empire_dictator')throw Error('dictator '+endingPick(d));d.emp.evil={bribe:1};if(endingPick(d)!=='empire_hard')throw Error('one act is not enough');
var f=readyGame();fwOf(f).f=3;if(!(farmWell(f)<FW_MID))throw Error('Culls feed lowers wellbeing');
`);
check('Pass 208/234: planting by hand, mangroves on mud from the start, 9 a tap, one capacity with the coasts, ghaf after, a year to know, patches spread, 100 for the stream',`
var g=readyGame();g.kits.sold=TREES_AT;g.money=1e9;if(!plOpen(g))throw Error('The map opens with the mangroves, before Rewilding');
var mud=null,rock=null,water=null,wet=null,dry=null;for(var x=0;x<PL_W;x++)for(var y=0;y<PL_H;y++){var q=plGround(x,y);if(q===0&&!water)water=[x,y];if(q===1&&!mud)mud=[x,y];if(q===3&&!rock)rock=[x,y];if(q===2&&plWet(x,y)&&!wet)wet=[x,y];if(q===2&&!plWet(x,y)&&!dry)dry=[x,y];}
if(!water||!mud||!rock||!wet||!dry)throw Error('The map has water, mud, rock, wet and dry soil');
var C=coinOf(g),t0=C.trees,m0=g.money;if(plPlant(g,water[0],water[1],'m'))throw Error('No planting in water');
if(!plPlant(g,mud[0],mud[1],'m'))throw Error('Plant mangroves on mud');if(C.trees-t0!==9||Math.round(m0-g.money)!==9*COIN_TREE)throw Error('9 seedlings a tap, AED 4 each, counted on the coast ('+(C.trees-t0)+')');
if(plPlant(g,mud[0],mud[1],'m'))throw Error('One per spot');if(!plPlant(g,wet[0],wet[1],'g'))throw Error('Pass 268: ghaf from the start');
if(plOdds(g,rock[0],rock[1],'g')!==0||!(plOdds(g,wet[0],wet[1],'g')>plOdds(g,dry[0],dry[1],'g'))||plOdds(g,mud[0],mud[1],'m')!==COIN_SURV)throw Error('Rock dies, water helps, mangroves at the coin survival');
var f=readyGame();f.kits.sold=TREES_AT;f.money=1e9;var F=coinOf(f);F.otrees=COIN_COAST;if(plPlant(f,mud[0],mud[1],'m'))throw Error('Full coasts are full on the map too');
if(plFree(f,mud[0],mud[1])!==0)throw Error('Others fill the mud on the map');if(!plPlant(f,wet[0],wet[1],'g'))throw Error('Ghaf opens once the mangroves are done');
f.day+=366;plDay(f);var t=plOf(f).t.filter(function(e){return e[3]==='g';})[0];if(!t||t[5]<0)throw Error('A year later you know');
var s=readyGame();s.kits.sold=TREES_AT;s.emp.pl={b:0,t:[]};for(var i=0;i<200;i++)s.emp.pl.t.push([i%PL_W,Math.floor(i/PL_W),0,plGround(i%PL_W,Math.floor(i/PL_W))===1?'m':'g',1,1,0]);var before=s.emp.pl.t.length;for(var k=0;k<30;k++){s.day=365*(3+k);plDay(s);}
if(!(s.emp.pl.t.length>before))throw Error('Living patches spread');var own=0;s.emp.pl.t.forEach(function(e){if(!e[6])own+=plBits(e[5]>0?e[5]:0);});if(plLiving(s,true)!==own)throw Error('Spread trees are not yours');
var o=readyGame();o.kits.sold=TREES_AT;o.emp.pl={b:3,t:[[mud[0],mud[1],0,1,0]]};plOf(o);if(o.emp.pl.t[0].length!==7||o.emp.pl.t[0][5]!==511)throw Error('Old saves migrate');
var b=readyGame();b.emp.evil={bay:1};b.kits.sold=TREES_AT;b.money=1e9;if(plPlant(b,mud[0],mud[1],'m'))throw Error('The bay license greys the mud');
if(streamReady.toString().indexOf('plLiving(G,true)>=PL_OWN')<0)throw Error('The stream needs 100 of your trees');
`);
if(html.indexOf('data-act="pl-open"')<0||/itemHTML\('Plant a tree'/.test(html))throw Error('Mangroves by hand, no one-tap Plant button (Puti, 3 Nov)');

module.exports={engine,html};
// Pass 196 (Puti, 1 Nov): after Start over, a built land from the old game can be bought back for AED 300k plus AED 100 a built thing.
if(!html.includes('data-act="gplace-old"')||!html.includes('return 300000+100*o.n;')||!html.includes("localStorage.setItem('shrimp-land-old'"))throw Error('Old built land should be offered back after Start over');
// Pass 200 (Puti, 1 Nov): Your tank reads the same on both pages: the land's tiles and lines, Wellbeing, Food and water. Browser check: tests/shrimp-yourtank.cjs
if(!html.includes('function ownLines(G)')||!html.includes('id="owncare"')||!html.includes('id="wellcard"')||!html.includes("o0.lines=ownLines(G);o0.fw=ownFW(G);"))throw Error('Pass 200: Your tank the same on the company page and the land');
check('Pass 217: later() survives a reload, the wedding holds the Gulf without a second purchase, the bonus never goes past the cash',`
var g=newGame();g.day=500;g.emp.x217=0;later(g,10,null,function(h){h.emp.x217=1;});var r=JSON.parse(JSON.stringify(g));r.day=511;laterDay(r);if(r.emp.x217!==1)throw Error('later callback lost on reload');
var w=newGame();w.day=900;w.emp.regions=['auh','dxb','uae','gcc'];w.emp.regDay={gcc:899};w.emp.staff.pack=2;w.me.on=1;
if(!CARDS3.c_wedding.cond(w))throw Error('wedding should be open');if(!card3Choose(w,'c_wedding',1))throw Error('wedding go');
if(w.emp.regions.indexOf('gcc')<0||!regHeld(w,'gcc'))throw Error('Gulf should stay bought and be held');if(nextRegion(w)&&nextRegion(w).id==='gcc')throw Error('Gulf offered again');
w.day=915;if(regHeld(w,'gcc'))throw Error('Gulf still held after two weeks');
var b=newGame();b.money=10;b.fin=[{kits:1e6}];card3Choose(b,'c_bonus',0);if(b.money<0)throw Error('bonus put you in debt');
var P=PUSH;['c_wedding','c_play','c_flood','c_bonus'].forEach(function(k){if(P[k].length!==CARDS3[k].ch.length)throw Error('PUSH length '+k);});
if((P.c_wedding[1].drive||0)>=0||(P.c_play[1].drive||0)>=0||(P.c_flood[0].care||0)<=0||(P.c_bonus[1].care||0)>=0)throw Error('new card pushes out of order');
`);
// Pass 218 (Puti, 2 Nov): risk and control are one trait, careful/bold; buying the Times is an evil act; the ocean ranch is a lake ranch;
// grants pair a basic or ecology proposal with an applied one; the new cards; the land reports what you do there.
{const home218=fs.readFileSync(path.join(__dirname,'../shrimp/home.html'),'utf8');if(home218.indexOf('LAND_ACT')<0||home218.indexOf("type:'act'")<0)throw Error('The land reports what you do there (Pass 218)');
 if(html.indexOf('"id": "stream_world", "end": "garden"')<0)throw Error('The Stream is a Garden version (Pass 218)');
 if(/[Oo]cean (shrimp )?ranch/.test(html)||/Floating pens/.test(html))throw Error('Cherry shrimp are freshwater: no ocean ranch (Pass 218)');}
check('Pass 218: careful/bold, Times as evil, grants paired, new cards, land split, stream in garden',`
var g=newGame();g.tr={control:1,risk:.2};g.trAbs={control:1,risk:.2};migrate(g);if(g.tr.control!=null||Math.abs(g.tr.risk+0.8)>1e-9||Math.abs(g.trAbs.risk-1.2)>1e-9)throw Error('Old control folds into careful '+JSON.stringify(g.tr));
var p=newGame();p.emp.proj.paperbuy=1;if(evilActs(p)<1)throw Error('Buying the Times is an evil act');
for(var i=0;i<40;i++){var c=grCands(newGame()),b=c.filter(function(x){return x.d==='basic'||x.d==='eco';}).length;if(b!==1)throw Error('One basic or ecology grant a year, one applied');}
['c_nydin','c_fair','c_vet','c_price1','c_wells','c_feed','c_budget','c_bare','c_glass','c_kyoto','c_saturday','c_survey','c_box','c_abroad','c_sleep'].forEach(function(k){if(!CARDS3[k]||!PUSH[k]||PUSH[k].length!==CARDS3[k].ch.length)throw Error('card '+k);});
var f=newGame();f.emp.nfeed={m:'t',s:0};f.day=30;if(nfeedMul(f)!==0)throw Error('test feed: no breeding first 2 months');f.day=95;if(Math.abs(nfeedMul(f)-0.3)>1e-9)throw Error('test feed 15% a month '+nfeedMul(f));f.day=300;if(nfeedMul(f)!==1.08)throw Error('test feed boost');
f.emp.nfeed={m:'r',s:0,bad:1};f.day=20;if(nfeedMul(f)!==0)throw Error('bad rollout stops breeding');f.day=80;if(nfeedMul(f)!==1)throw Error('bad rollout back to old feed');f.emp.nfeed={m:'r',s:0,bad:0};if(nfeedMul(f)!==1.08)throw Error('good rollout boost');
var w=newGame();w.emp.lock={reg:w.day+365,farm:w.day+90};w.money=1e12;w.kits.sold=1e6;if(buyRegion(w))throw Error('wells: no region for a year');if(heldDays(w,'farm')!==90)throw Error('wells: farm held 3 months');
var l=newGame();l.ps.t=1e6;l.ps.landMs=1e6;l.ps.landG=1e6;var k0=playVal(l,'kin'),c0=playVal(l,'care');l.ps.landG=0;l.ps.landH=1e6;if(!(k0>playVal(l,'kin'))||!(playVal(l,'care')<(c0==null?0:c0)))throw Error('land time: living things read kin, Grandma reads own people');
`);
check('Pass 219 (Puti): burnout bites until you rest, an hour over 8 pays late, facts every 200 to 400 h at least 3 min apart, pop-ups 10 to 20 s after close',`
var g=newGame();g.me.on=1;g.me.hp=80;g.me.bo=99;g.me.hrs={};g.me.wh=12;g.humans=5e6;g.emp.farms.rack=1;var m0=workMult(g);if(!(m0>1.05))throw Error('an hour over 8 still pays late '+m0);
g.me.bo=100;lifeDay(g);if(!(g.me.burnt>g.day))throw Error('burnt out');if(workMult(g)!==BURN_MULT||dayHours(g).work!==BURN_H||setWork(g,10))throw Error('half days, orders at 0.6');
for(var d=0;d<12;d++){g.day++;lifeDay(g);}if(!(g.me.burnt>g.day))throw Error('still burnt out until strain is low');for(var d=0;d<80&&g.me.burnt>g.day;d++){g.day++;lifeDay(g);}if(g.me.burnt>g.day||g.me.bo>=BURN_LIM)throw Error('rest gets you out '+g.me.bo);
g.me.bo=100;g.day+=30;lifeDay(g);if(g.me.bLim!==BURN_LIM2||storyChoices(g,'me_burnout').length!==1)throw Error('second within a year is longer, no keeping going');
var f=newGame();f.me.on=1;f.me.hp=80;f.me.bo=0;f.me.hrs={papers:0};f.me.wh=8;f.me.p2=['papers'];f.ps={t:0};var n=0,got=[];for(var d=0;d<3000;d++){f.day++;f.ps.t+=4000;lifeDay(f);}
var F=f.me.fx;if(!F||!F.n)throw Error('facts come');if(F.n>Math.ceil(9000/200))throw Error('not more than one per 200 h');if(new Set(F.seen).size!==F.seen.length)throw Error('no repeats');
var f2=newGame();f2.me.on=1;f2.me.hp=80;f2.me.bo=0;f2.me.hrs={papers:5000};f2.me.fx={seen:[],next:0,at:null};f2.ps={t:1000};factDay(f2);f2.me.fx.next=0;f2.ps.t=100000;factDay(f2);if(f2.me.fx.n!==1)throw Error('3 minutes between facts');
if(FACTS.some(function(x){return /!|colour|behaviour/.test(x[0])||!/[0-9][0-9][0-9][0-9][)][.]$/.test(x[0]);}))throw Error('facts: American spelling, no exclamation, citation in text');
var c=newGame();introStamp(c);if(!(c.progress.gap>=10000&&c.progress.gap<=35000))throw Error('gap 10 to 35 s');
`);
check('Pass 219 (Puti): rest and getting better, courses finish once and pay, hours held move the traits',`
var g=newGame();g.me.on=1;g.me.hp=80;g.me.bo=0;g.me.hrs={mba:299};g.me.p2=['mba','hiking'];g.emp.staff.pack=3;var c0=staffCost(g);g.me.hrs.mba=300;lifeDay(g);
if(!crsDone(g,'mba')||actOk(g,'mba')||dayPicks(g).indexOf('mba')>=0)throw Error('course done, leaves the picks');if(!(staffCost(g)<c0))throw Error('MBA lowers running costs');
var a=newGame();a.me.on=1;a.me.hp=80;a.me.bo=90;a.me.hrs={};a.me.wh=8;a.me.p2=['friends','hiking'];lifeDay(a);var b=newGame();b.me.on=1;b.me.hp=80;b.me.bo=90;b.me.hrs={};b.me.wh=8;b.me.p2=['mba','ai'];lifeDay(b);if(!(a.me.bo<b.me.bo))throw Error('rest takes more strain off than courses');
var t=newGame();t.ps.t=1e6;t.me.hrs={work:30000,friends:3000};var c1=playVal(t,'care');t.me.hrs={work:30000,hiking:3000};var k1=playVal(t,'kin');t.me.hrs={work:30000,papers:3000};var n1=playVal(t,'know');
if(!(c1<0)||!(k1>playVal(newGame(),'kin')||k1>0)||!(n1>0))throw Error('friends read own people, hiking loves living things, papers curious '+c1+' '+k1+' '+n1);
var d=newGame();d.ps.t=1e6;d.me.hrs={work:20000,tv:30000};var d1=playVal(d,'drive');d.me.hrs={work:20000,mba:20000};if(!(d1<0)||!(d1<playVal(d,'drive')))throw Error('rest reads life first, courses do not');
`);
check('Pass 222 (Puti): out of money while a kind answer still costs you, Grandma or the shrimp bank twice, the third time it ends',`
var g=newGame();g.day=500;g.emp.farms.rack=4;g.emp.strain={u:600};g.money=-20000;g.me.sent=0;var mc=milestoneConditions(g);if(!mc.kindsave||mc.broke||mc.kindend)throw Error('kind save, not the usual card');
var o=kindOpts(g);if(o.length!==3||!/1 year/.test(o[0][0])||!/10 years/.test(o[2][0]))throw Error('bank: 1, 5 or 10 years');var a=kindLoanAmt(g);storyChoose(g,'kindsave',1);if(!(g.money>0)||!g.emp.kindLoan||g.emp.kindLoan.y!==5||Math.abs(g.emp.kindLoan.left-a*1.05)>1)throw Error('1% a year, five years');
var m0=g.money;g.day+=31;kindLoanDay(g);if(!(g.money<m0))throw Error('pays monthly');
var h=newGame();h.day=500;h.emp.farms.rack=4;h.emp.strain={u:620};h.money=-20000;h.me.sent=5000;var gift=kindGift(h);if(!(gift>=20000+30*Math.max(incRef(h),fixedOverhead(h))*4-1))throw Error('debt plus a month of income per month left, at least one');storyChoose(h,'kindsave',0);if(!(h.money>0))throw Error('Grandma pays');
h.emp.kindSaves=2;h.money=-5000;h.emp.brokeSnooze=0;var mc2=milestoneConditions(h);if(!mc2.kindend||mc2.kindsave)throw Error('third time ends it');storyChoose(h,'kindend',0);if(!h.emp.ended)throw Error('game over');
var n=newGame();n.day=500;n.money=-20000;var mc3=milestoneConditions(n);if(!mc3.broke||mc3.kindsave)throw Error('no kind cost running, the usual card');
`);
check('Pass 225 (Puti): bulk order takes the share you set, a choice with no money cost works on low cash, Yes they\u2019ll be happier',`
var g=newGame();g.kits.stock=1000;g.emp.packed=100;g.korder={n:500,price:10,who:'A school',due:30,offerEnd:7,taken:true,filled:0,pct:0.2};fillKitOrder(g);if(g.korder.filled!==20)throw Error('20% of 100 packed, got '+g.korder.filled);
var h=newGame();h.kits.sold=400;h.money=1;h.emp.infOn=1;h.emp.inf=100;if(!buyProj(h,'revreal'))throw Error('photos costs only influence, low cash must not block it');
if(CARDS3.c_letgo.ch[0][0]!=='Yes, they\u2019ll be happier')throw Error('Let them go yes label');
`);
check('Pass 227 (Puti): Grandma\u2019s land card comes after the 40k house, and the 250k land is for sale only after it',`
var g=newGame();g.me.on=1;g.money=1e6;g.me.gplace={balcony:1};if(milestoneConditions(g).gp_land)throw Error('not before the house');
g.me.gplace.house=1;if(!milestoneConditions(g).gp_land)throw Error('card after the house');if(gplaceOffer(g)!=='wait'||buyGplace(g))throw Error('land not for sale before the card');
storyChoose(g,'gp_land',1);if(gplaceOffer(g)!==true||!buyGplace(g)||!landOpen(g))throw Error('after Not this time the land is for sale');
var h=newGame();h.me.on=1;h.money=1e6;h.me.gplace={balcony:1,house:1};storyChoose(h,'gp_land',0);if(gplaceOffer(h)==='wait'&&h.me.landTrip>h.day){}else throw Error('waits during the trip');h.day=h.me.landTrip;landDay(h);if(landOpen(h))throw Error('the trip finds the land, it does not buy it');if(gplaceOffer(h)!==true)throw Error('for sale after the trip');
`);
if(!/function renderMilestone\(\)\{[\s\S]{0,400}busyUI\(\)/.test(html)||html.indexOf('LAND.on||LAND.busy')<0||html.indexOf('PL_SHOW')<0)throw Error('No story cards on the land, in a tank job or while planting (Pass 234, Puti)');
if(!html.includes('return {feed:G.tanks.some(function(t){return !t.feeder;}),wc:G.tanks.some(function(t){return !t.autoWC;}),'))throw Error('Feed and Water go once every tank is automated, no emergency comeback (Pass 244, Puti)');
console.log('PASS Feed and Water leave once every tank is automated');
check('Pass 248: Sea Cow in old saves, loan shark remembers what it took',`
var g=newGame();g.me=g.me||{};g.me.hist=['Grandma wrote about Grandpa’s fishing boat. It’s called Maryam, after his mother, and she still pays the harbor fee.','Maryam stayed at the dock all year.'];g.me.gv=3;fixGpText(g);
if(g.me.gv!==4||g.me.hist.join(' ').indexOf('Maryam')>=0||g.me.hist[1]!=='The Sea Cow stayed at the dock all year.')throw Error('Maryam lines not moved to the Sea Cow: '+JSON.stringify(g.me.hist));
if(JSON.stringify(GP_STORY).indexOf('Maryam')>=0||JSON.stringify(GT_EV).indexOf('Maryam')>=0)throw Error('Maryam still in the text');
`);
if(!html.includes("if(!E.sharkTook)E.sharkTook={day:now,what:'the '+tk.what}")||!html.includes("his men took '+tk.what+' at night")||html.includes('They smashed the first farm in October'))throw Error('Pass 248: the loan shark ending says what happened (Puti)');
if(!html.includes('function fmtH(t)')||!/r\{color:var\(--shrimp\)\}g\{color:var\(--good\)\}/.test(html))throw Error('Pass 248: <b> <i> <r> <g> in game text');
console.log('PASS Pass 248 static checks');
check('Pass 255 (Puti): a stopped letter restarts, tree steps are letters with Not now, gala causes do something, the coast soft cap, the clean hold',`
var g=readyGame();g.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};g.humans=4.1e9;g.money=1e13;g.fin=g.fin||[];var R=propOf(hardOf(g));R.open.push({id:'board',day:0,alt:0,grad:0});R.t.board=1;if(!propFund(g,'board'))throw Error('fund');
var d;for(d=1;d<=365;d++){g.day=d;hardDay(g);}var p=R.run.board,r1=p.r;if(!propStop(g,'board'))throw Error('stop');for(d=366;d<=730;d++){g.day=d;hardDay(g);}var r2=p.r;if(!(r2<r1))throw Error('falls while stopped');
if(!propStart(g,'board'))throw Error('restart');if(p.stop||!g.emp.dues.some(function(x){return x.k==='prop:board';}))throw Error('restart brings the dues back');for(d=731;d<=1095;d++){g.day=d;hardDay(g);}if(!(p.r>r2))throw Error('reach climbs again after a restart: '+r2+' '+p.r);
// tree steps (Pass 256): Not now holds the tree, the same step writes again 90 days to 3 years later
g.emp.trees={rewild:1};var s1=treeNext(g,'rewild');if(!s1||s1.id!=='rw_stream')throw Error('first step');var d0=g.day;if(!treeDecline(g,'rw_stream'))throw Error('decline');var bk=g.emp.treeBack.rw_stream;if(!(bk-d0>=90&&bk-d0<=1095))throw Error('roll '+(bk-d0));if(treeNext(g,'rewild'))throw Error('tree waits while a step is away');if(buyTreeStep(g,'rw_stream'))throw Error('a step away cannot be bought');if(treeWhy(g,'rw_stream')!=='Not the next step yet')throw Error('why');
g.day=bk-1;if(treeNext(g,'rewild'))throw Error('not back a day early');g.day=bk;var s3=treeNext(g,'rewild');if(!s3||s3.id!=='rw_stream')throw Error('the same step comes back');
g.emp.inf=1e9;var k0=g.tr.kin||0;treeDecline(g,'rw_stream');var k1=g.tr.kin||0;g.day=g.emp.treeBack.rw_stream;treeDecline(g,'rw_stream');var k2=g.tr.kin||0;if(!(Math.abs(k2-k1)<Math.abs(k1-k0)+1e-9))throw Error('second no pushes less: '+[k0,k1,k2]);g.day=g.emp.treeBack.rw_stream;if(!buyTreeStep(g,'rw_stream'))throw Error('buy after it came back');g.day=d0;
var R2=propOf(hardOf(g));R2.open.push({id:'board',day:g.day,alt:0,grad:0});var dd=Math.floor(g.day);if(!propDecline(g,'board'))throw Error('prop decline');var pb=R2.back.board;if(!(pb-dd>=90&&pb-dd<=1095))throw Error('letter roll '+(pb-dd));if(propOK(g,hardOf(g),propDef('board'),pb-1,0))throw Error('letter not back early');
// galas: water queues an Aid batch, kids reach a little of Can't do it alone, pets bring the vet card sooner
var H=hardOf(g);g.emp.inf=1e9;g.emp.infOn=1;var ks0=g.kits.sold;g.kits.sold=0;if(buyProj(g,'gala','water'))throw Error('no gala before MKT_AT kits');g.kits.sold=Math.max(ks0,MKT_AT);if(!buyProj(g,'gala','water'))throw Error('water gala');if(!(H.gq&&H.gq.length&&H.gv>0))throw Error('the water gala queues an Aid batch');
var c0=galaReach(g,hardGroup('care'));if(!buyProj(g,'gala','kids'))throw Error('kids gala');if(!(galaReach(g,hardGroup('care'))>c0&&hardReach(g,hardGroup('care'))>=GALA_CARE-1e-9))throw Error('the kids gala reaches the group');for(var i=0;i<20;i++)buyProj(g,'gala','kids');if(H.galaCare>GALA_CARE_MAX+1e-9)throw Error('capped');
if(!buyProj(g,'gala','pets')||!g.emp.galaPets)throw Error('pets gala');
// coast soft cap: spread and the coin planters slow as it fills, your taps always plant, ghaf at half, sidr at three quarters
var c=readyGame();c.kits.sold=1e5;var C=coinOf(c);C.trees=1e6;C.otrees=0;var s0=treeSpread(c);C.otrees=COIN_COAST*0.5-1e6;var sh=treeSpread(c)/(C.trees+C.otrees);if(!(Math.abs(sh/(s0/1e6)-0.25)<0.02))throw Error('spread at half the coast is a quarter of the pace: '+sh+' '+s0/1e6);
C.otrees=0;if(!(plKindOk(c,'g')&&plKindOk(c,'s')))throw Error('Pass 268: ghaf and sidr from the start');C.otrees=COIN_COAST*0.75;if(!(plFree(c,32,2)>0||plFree(c,10,2)>0||[0,1,2,3,4,5,6,7,8,9].some(function(x){return plGround(x*6,2)===3&&plFree(c,x*6,2)>0;})))throw Error('the hills take seedlings');
C.otrees=COIN_COAST*0.99;if(!(coastSlow(c)<0.001))throw Error('nearly full, others nearly stop');
// the clean hold: no poop for 25 tank days after a vacuum, no algae after a wipe
var t=readyGame();t.me.keep='self';t.me.on=1;var T=t.tanks[0];T.had=1;T.cycledAt=0;for(var k=0;k<30;k++)T.pop.push({age:100,n:1,g:2});var K=careOf(T);K.mulm=0;K.vacD=t.day;careDay(t);if(K.mulm!==0)throw Error('no poop right after a vacuum');t.day+=CLEAN_HOLD+1;var D1=Date.now,n1=D1();Date.now=function(){return n1+CLEAN_MS+1;};careDay(t);Date.now=D1;if(!(K.mulm>0))throw Error('poop again after the hold');
T.glass=null;glassGrow(t,T);var g0=T.glass.reduce(function(a,b){return a+b;},0);T.wipeD=t.day;glassGrow(t,T);if(T.glass.reduce(function(a,b){return a+b;},0)!==g0)throw Error('no algae right after a wipe');
`);
check('Pass 257 (Puti): the tank you can hear is a blind-group research option that never fades, stays, and its care counts once a day',`
var g=hardGroup('blind'),o=hardOp(g,'ear');if(!o||o.req||o.life||o.floor)throw Error('ear option (Pass 258): no req, no life/floor');if(hardOp(g,'touch'))throw Error('Pass 258: touch merged into ear');
var t=readyGame();var m=JSON.parse(JSON.stringify(t));m.emp.hard=m.emp.hard||{picks:{}};m.emp.hard.picks=m.emp.hard.picks||{};m.emp.hard.picks.blind={touch:{day:3,start:5}};migrate(m);if(m.emp.hard.picks.blind.touch||!m.emp.hard.picks.blind.ear||m.emp.hard.picks.blind.ear.start!==5)throw Error('an old touch pick becomes the ear tank');
var P={ear:{day:0,start:0},touch:{day:0,start:0}};if(hardFaded(t,o,P.ear,g))throw Error('never fades');t.day=99999;if(hardFaded(t,o,P.ear,g))throw Error('never fades, 270 years on');if(hardOpReach(t,o,P.ear,g)<o.f-1e-9)throw Error('keeps its reach');
if(hardWorkLive(t,g,{ear:{day:t.day,start:t.day}}))throw Error('it does not block the group running workaround');
var c0=t.stats.care||0;earCare(t);earCare(t);if((t.stats.care||0)-c0!==1)throw Error('care once a day');t.day+=1;earCare(t);if((t.stats.care||0)-c0!==2)throw Error('and again the next day');
`);
check('Pass 259 (Puti): research never runs out, the letters open with people not three tree steps, the shop is not a letter, tree letters name a person',`
var g=readyGame();var L=rlines(g);L.energy.found=5;var m5=rlM(g,'energy',0.05);L.energy.found=6;var m6=rlM(g,'energy',0.05);L.energy.found=40;var m40=rlM(g,'energy',0.05);
if(Math.abs(m5-0.75)>1e-9||Math.abs(m6-0.675)>1e-9||!(m40>0&&m40<0.05))throw Error('10% off what is left after five: '+[m5,m6,m40]);
grOf(g).ctr.energy=1;L.energy.found=5;L.energy.pd=1;if(!(rlOdds(g,'energy')>0))throw Error('a finished field still finds');if(rlFindTxt(RLINES[0],7).indexOf('10% off farm upkeep')<0)throw Error('find text');
var h=g.emp;g.emp.hard={open:1,goal:'home',picks:{},goalOk:0,day:0};g.humans=4.1e9;g.money=1e12;h.inf=1e12;h.trees={rewild:1,lastmile:1,shop:1,lab:1};
for(var d=0;d<30;d++){g.day=d;letDay(g);}g.emp.hard.goalOk=1;var t0=30,firstTree=null;
for(d=30;d<500;d++){g.day=d;hardDay(g);letDay(g);if(firstTree==null&&TREE_ORDER.some(function(k){return k!=='island'&&treeShow(g,k);}))firstTree=d;if(treeShow(g,'shop'))throw Error('the shop is a letter');}
if(firstTree!=null&&firstTree-t0<TLET_GAP[0])throw Error('a tree letter on day '+(firstTree-t0)+' of the letters');
var w=treeWho('lastmile',TREES.lastmile.steps[0]);if(w.who!=='Lasha')throw Error('tree letter names a person');
`);
check('Pass 259 (Puti): news waits the same 10 to 35 s gap after any pop-up closed',`
var g=readyGame();g.ps={t:500000};var p=ensureProgress(g);p.queue=[];p.wait=[];p.soon=[];p.lastStory=null;var R=rip(g);R.pend=[{t:'A test story.'}];R.nextAt=0;introStamp(g);var n0=R.log.length;
g.ps.t+=p.gap-1000;newsTick(g);if(R.log.length!==n0)throw Error('news inside the gap');g.ps.t+=1500;newsTick(g);if(R.log.length!==n0+1)throw Error('news after the gap');
`);
check('Pass 258 (Puti): one mailbox, at most 3 letters with the tree steps, tree letters 120+ days apart, two catch letters, aid says when it lands',`
var g=readyGame();g.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};g.humans=4.1e9;g.money=1e12;g.emp.inf=1e12;g.emp.trees={rewild:1,lastmile:1,shop:1,lab:1};
var tg=[],seen={},last=null,d,mx=0;for(d=0;d<4000;d++){g.day=d;hardDay(g);letDay(g);mx=Math.max(mx,letOpenN(g));if(letOpenN(g)>3)throw Error('more than 3 open: '+letOpenN(g));
 if(d%7)continue;TREE_ORDER.forEach(function(k){var s=treeShow(g,k);if(k!=='island'&&s&&!seen[s.id]){seen[s.id]=1;if(last!=null)tg.push(d-last);last=d;treeDecline(g,s.id);}});
 var R=propOf(g.emp.hard);R.open.slice().forEach(function(x){propDecline(g,x.id);});}
if(tg.length<2||Math.min.apply(null,tg)<TLET_GAP[0])throw Error('tree letters too close or too few: '+tg.join(','));/* Pass 259: the shop is out of the letters, three trees left */
if(!propDef('orbit')||!propDef('chef')||!propDef('orbit').sink||!propDef('chef').sink)throw Error('catch letters');
var c=readyGame();c.emp.hard={open:1,goal:'home',picks:{},goalOk:1,day:0};c.emp.trees={rewild:1};var s0=treeNext(c,'rewild');if(treeShow(c,'rewild'))throw Error('a tree step waits for its letter');c.emp.tlet={};c.emp.tlet[s0.id]=1;if(treeShow(c,'rewild')!==s0)throw Error('delivered, it shows');treeDecline(c,s0.id);if(c.emp.tlet[s0.id])throw Error('Not now needs a new letter');
var h={gv:100,got:0,gq:[{a:100,due:400}]};c.day=35;if(!/nothing has arrived yet, the first batch lands in about 1[23] months/.test(aidArrTxt(c,h,fmtA)))throw Error('aid: '+aidArrTxt(c,h,fmtA));h.got=60;h.lost=40;if(!/^arrived /.test(aidArrTxt(c,h,fmtA)))throw Error('aid arrived');
`);
check('Pass 260 (Puti, 5 Nov): the feed restock bill is at most half the cash, the status line says the farms stopped, Close all and Reopen work in one tap each, the Shops card knows no kits are selling',`
var g=readyGame();var E=g.emp;E.kitsOpened=1;E.farms={rack:3};g.kits.sold=30000;g.money=100;g.kits.stock=0;
var r0=Math.random;Math.random=function(){return 0;};CARDS3.c_feed.ch[1][3](g);Math.random=r0;if(!E.nfeed||!E.nfeed.bad)throw Error('the gamble went bad');
g.day+=15;var m0=g.money;laterDay(g);if(g.money<m0*0.5-1e-6)throw Error('the restock bill took more than half the cash: '+m0+' to '+g.money);
E.nfeed={m:'r',s:g.day-20,bad:1};if(nfeedMul(g)!==0)throw Error('farms stopped');if(bnText(g).indexOf('not breeding on the new feed, 54 days left')<0)throw Error('status line: '+bnText(g));
if(!kitsStopped(g))throw Error('kits are stopped with no stock and no output');E.nfeed=null;g.kits.stock=50;if(kitsStopped(g))throw Error('kits sell again');
g.money=1e10;E.stores={auh:5};if(!closeStores(g,'auh',5)||storeN(g,'auh')!==0||storeClosed(g,'auh')!==5)throw Error('close all five');
if(!buyStores(g,'auh',5)||storeN(g,'auh')!==5||storeClosed(g,'auh')!==0)throw Error('reopen all five in one tap, got '+storeN(g,'auh'));
`);
check('Pass 262 (Puti, 5 Nov): from the hard part the Company tab, and the shop density picker: fewer stores less rent and less trust, closing refunds nothing, online shop plus drones keeps a trust floor',`
var g=readyGame();var E=g.emp;E.kitsOpened=1;g.kits.sold=1e9;E.regions=REGIONS.map(function(r){return r.id;});E.stores={};REGIONS.forEach(function(r){E.stores[r.id]=storeGoal(r.id);});g.money=1e15;
if(densOf(g)!=='m5'||setDens(g,'m10'))throw Error('no density before the hard part');
E.hard={open:1,goal:'home',picks:{},day:0};var t5=trust(g),r5=storeDayCost(g),m0=g.money;
if(Math.abs(t5-1)>1e-9)throw Error('full stores, full trust');
if(!setDens(g,'m10'))throw Error('pick every 10th mall');if(g.money!==m0)throw Error('closing refunds nothing and costs nothing');
REGIONS.forEach(function(r){if(storeN(g,r.id)!==Math.ceil(MALLS[r.id]/10))throw Error('m10 count in '+r.id+': '+storeN(g,r.id));});
var t10=trust(g),r10=storeDayCost(g);if(!(t10<t5&&r10<r5))throw Error('fewer stores, less rent and less trust');
var prev=2;DENS.forEach(function(D){var x=densTrust(g,D.id);if(x>prev+1e-9)throw Error('trust falls with density: '+D.id);prev=x;});
setDens(g,'web');if(storeCount(g)!==0)throw Error('online only closes every store');if(trust(g)>0.62)throw Error('no online shop, no floor: '+trust(g));
g.webShop=1;E.proj.drones=1;if(Math.abs(trust(g)-WEB_FLOOR)>0.001&&trust(g)<WEB_FLOOR)throw Error('online shop and drones floor: '+trust(g));
setDens(g,'m5');if(storeFillN(g)!==mallsTotal(g))throw Error('fill counts every missing store');var c=storeFillCost(g);if(!storeFill(g)||g.money!==m0-c||storeCount(g)!==mallsTotal(g))throw Error('one tap fills back to the density');
`);
if(!html.includes("TAB_NAME.emp=lay?'Company':'Kits'")||!html.includes("lp=lay?$('p-tank'):$('p-up')")||!html.includes('id="c-mkt"')||!html.includes('id="tab-hard"')||!html.includes("TAB_NAME.promote=co?'Company':mk?'Market':'Ads'"))throw Error('Company tab, home tank cards on Tank, Marketing card');
check('Pass 261 (Puti, 5 Nov): research people cost fixed USD at any size, the first grant letters carry the ear tank, funding it opens the tank and fills the Can’t see square',`
var g=newGame();g.money=1e12;g.kits.sold=5000;academyOpen=function(){return true;};
var by={};RPOS.forEach(function(p){by[p.id]=posAed(g,p)/USD;});
if(Math.round(by.phd)!==30000||Math.round(by.pd)!==50000||Math.round(by.pi)!==666667)throw Error('PhD 2,500 a month, postdoc 50k, PI lab 2M over 3 years: '+JSON.stringify(by));
g.day=5000;g.emp.farms.rack=1;var big=posAed(g,RPOS[0])/USD;if(big!==30000)throw Error('No share of income on top: '+big);
grantDay(g);var gr=grOf(g);if(gr.c.length!==2||!gr.c.some(function(c){return c.ear;}))throw Error('The first letters hold the ear tank');
if(earGrant(g)||hardReach(g,HARD.filter(function(x){return x.id==='blind';})[0])>=1)throw Error('Not before funding');
var i=gr.c.findIndex(function(c){return c.ear;});if(!grPick(g,i,150)||!earGrant(g))throw Error('Funding it opens the ear tank');
if(hardReach(g,HARD.filter(function(x){return x.id==='blind';})[0])!==1)throw Error('The Can’t see square is finished');
g.day+=366;grantDay(g);if(grOf(g).c.some(function(c){return c.ear;}))throw Error('Offered once');
var h=newGame();h.kits.sold=5000;grantDay(h);var gh=grOf(h);gh.c.forEach(function(c){c.x='s';});h.day+=366;grantDay(h);if(grOf(h).c.some(function(c){return c.ear;}))throw Error('Skipped once, it comes back in the hard part, not as a letter');
`);
check('Pass 263: one desk (messages, galas, ad pushes), mood sticks, media reach past a million, a film takes a year',`
var g=readyGame();g.kits.sold=MKT_AT;g.money=1e9;g.emp.proj.ministry=1;g.emp.inf=1e6;g.emp.infOn=1;g.emp.op.offer=null;drawOffer(g);var o=g.emp.op;
if(o.offer.length!==3)throw Error('three offers');var ks=o.offer.map(function(id){return deskItem(id).k;});if(ks.filter(function(k){return k==='camp';}).length!==2||!ks.some(function(k){return k==='gala'||k==='push';}))throw Error('two messages and a gala or push: '+ks);
o.offer=['calm','g_kids','p_bill'];var m0=g.money,i0=g.emp.inf;if(!deskRun(g,'p_bill'))throw Error('push runs');if(o.offer!==null||!o.run||o.run.left!==15)throw Error('the other two go');if(!(g.money<m0)||g.emp.inf!==i0)throw Error('a push costs money, not stars');
if(deskRun(g,'calm'))throw Error('one slot');for(var i=0;i<15;i++){g.day++;empireDay(g);}if(o.run||!o.offer||o.offer.length!==3)throw Error('three new offers wait after it ends');
var off=o.offer.slice();for(var i=0;i<30;i++){g.day++;empireDay(g);}if(JSON.stringify(off)!==JSON.stringify(o.offer)||o.run)throw Error('nothing is picked for you');
o.offer=['calm','g_kids','p_bill'];var gl=g.emp.gala;if(!deskRun(g,'g_kids')||g.emp.gala!==gl+1||!(g.emp.galaFor.kids>0))throw Error('gala through the desk');
if(buyProj(g,'gala','water'))throw Error('no gala outside the desk after the ministry');
for(var i=0;i<10;i++){g.day++;empireDay(g);}o.offer=['calm','g_kids','p_bill'];g.emp.inf=1e8;var ip=campPrice(g);if(ip<1e7)throw Error('a message costs a tenth of the stars: '+ip);if(!deskRun(g,'calm')||g.emp.inf!==1e8-ip)throw Error('message costs stars');
o.pend=[];o.m=0.8;for(var i=0;i<1000;i++)opinionDay(g);if(Math.abs(o.m-0.8)>1e-9)throw Error('a good mood sticks: '+o.m);o.m=0.2;for(var i=0;i<1000;i++)opinionDay(g);if(!(o.m>0.3&&o.m<0.5))throw Error('a bad mood slowly mends: '+o.m);
var h=newGame();h.emp.op.m=0.5;h.humans=5e5;if(mediaReach(h)!==1)throw Error('no limit under a million');h.humans=1e9;var r0=mediaReach(h);if(!(r0>0.2&&r0<0.3))throw Error('no media at 1B: '+r0);h.emp.op.m=1;if(mediaReach(h)!==1)throw Error('full mood carries it: '+mediaReach(h));
h.emp.op.m=0.5;h.emp.movie.n=3;if(!(mediaReach(h)>r0*3.5))throw Error('films carry it');h.emp.movie.n=0;h.emp.hard=h.emp.hard||{};h.emp.hard.open=1;if(mediaReach(h)!==1)throw Error('no limit in the hard part');
h.stores={};if(marketingLevel(h)>STORE_MKT_MAX+50)throw Error('store cap');
var f=readyGame();f.kits.sold=MKT_AT;f.money=1e9;f.emp.proj.ministry=1;f.emp.proj.studio=1;f.emp.inf=1e9;if(!greenlight(f,0)||f.emp.movie.left!==365)throw Error('a film takes a year');
`);
check('Pass 264/269: shrimp video games: no credits, only while Video games is picked, Puti titles, sequels, ramps, caps, the 1B switch, the ledger, Grandma, Khalas',`
function me(g){g.me.on=1;g.me.hrs=g.me.hrs||{};g.me.p2=['games'];return g;}
var src=String(gamesDay)+String(gameStart)+String(gmOf)+String(gameKeep)+String(gameRelease);if(/credit/i.test(src))throw Error('no credits in the games code');
if(typeof gameCredits!=='undefined'||typeof gameEarned!=='undefined')throw Error('credit functions gone');
if(HOUR_STEPS.videos.map(function(x){return x[0];}).join()!=='100,400,1000')throw Error('video hour steps');
if(actById('make')||!actById('games'))throw Error('one Video games option');
// Puti's table
if(GAMES.length!==13||GAMES[0].join('|').indexOf('Red Shrimp Redemption|action|One small shrimp in the wide wild word')!==0||GAME_GEN.length!==13)throw Error('table');
// only while picked: no start, no days, no change while not picked
var g=me(readyGame());g.me.p2=['tanks'];if(gameStart(g))throw Error('no start without Video games');g.me.p2=['games'];g.me.gm=null;delete g.me.gm;gmOf(g).dr.g='action';if(!gameStart(g))throw Error('start');var c=g.me.gm.cur;
if(c.t!=='Red Shrimp Redemption'||c.q!==0)throw Error('first action title '+c.t);if(gameStart(g))throw Error('one at a time');
var d0=Math.floor(g.day);for(var i=1;i<=40;i++){g.day=d0+i;gamesDay(g);}var q40=c.q,w40=c.wd;g.me.p2=['tanks'];for(var i=41;i<=300;i++){g.day=d0+i;gamesDay(g);}
if(c.q!==q40||c.wd!==w40||c.w)throw Error('paused while not picked');g.me.p2=['games'];
var last=c.q;for(var i=301;i<=360;i++){g.day=d0+i;gamesDay(g);if(c.q-last>Math.ceil(c.qt/GAME_CHECK)+1)throw Error('start ramp jumps');last=c.q;}
if(!c.w||c.q!==c.qt||c.qt<0||c.qt>50)throw Error('checkpoint after 100 days of making: '+c.wd+' '+c.q+' '+c.qt);
for(var i=0;i<300;i++){g.day++;gamesDay(g);}if(!c.w||g.me.gm.cur!==c)throw Error('waits for the player');
// keep working: target 10-60% of the gap, min 5, reached in a straight line, no jump
for(var s=0;s<100;s++){var q=me(readyGame());gameStart(q);var cc=q.me.gm.cur;cc.w=1;cc.q=Math.floor(Math.random()*100);var b=cc.q;if(!gameKeep(q))throw Error('keep');var st=(cc.qt-b)/GAME_CHECK;
 if(cc.q!==b||cc.qt>100||cc.qt-b<Math.min(5,100-b)||cc.qt-b>Math.max(5,Math.ceil((100-b)*0.6)))throw Error('keep target '+b+' -> '+cc.qt);
 var pv=cc.q;for(var i=0;i<GAME_CHECK;i++){q.day++;gamesDay(q);if(cc.q-pv>Math.ceil(st)+1)throw Error('quality jumped '+pv+' -> '+cc.q);pv=cc.q;}if(cc.q!==cc.qt||!cc.w)throw Error('reaches target');}
var cq=me(readyGame());gameStart(cq);cq.me.gm.cur.w=1;cq.me.gm.cur.q=100;if(gameKeep(cq))throw Error('no keep at 100');
// release: the title shows only then; sales ramp over a year
if(gameRelease(readyGame()))throw Error('nothing to release');var x0=c;if(!gameRelease(g)||g.me.gm.cur)throw Error('release');var R=g.me.gm.rel[0];
if(R.t!=='Red Shrimp Redemption'||!R.rp)throw Error('released');var full=R.s0;if(!(R.s0*gameFade(R,R.d+1)<full*0.01))throw Error('day 1 under 1%');
if(Math.abs(gameFade(R,R.d+365)-1)>1e-9)throw Error('day 365 at the formula');if(!(gameFade(R,R.d+182)<0.55&&gameFade(R,R.d+182)>0.45))throw Error('half way');if(!(gameFade(R,R.d+800)<1))throw Error('fades after');
// sequels: originals first, never repeated; then 2, 3, Definitive, Extended, Retold, Return of the best one; each 15% under the one before
var h=me(readyGame());var H=gmOf(h);H.dr.g='action';var seen={},names=[];for(var n=0;n<7;n++){if(!gameStart(h))throw Error('start '+n);var cu=H.cur;names.push(cu.t);if(seen[cu.t])throw Error('repeat '+cu.t);seen[cu.t]=1;cu.w=1;cu.q=50;gameRelease(h);}
if(names.join('|')!=='Red Shrimp Redemption|Red Shrimp Redemption 2|Red Shrimp Redemption 3|Red Shrimp Redemption: Definitive Edition|Red Shrimp Redemption: Extended Edition|Red Shrimp Redemption: Retold|Red Shrimp Redemption: Return')throw Error('sequel order '+names);
if(gameNext(h,'action'))throw Error('action is out');var e0=gameScore(H.rel[0]);for(var n=1;n<7;n++){var r=H.rel[n];if(Math.abs(r.s0-gameScore(r)*Math.pow(0.85,n))>1e-12||Math.abs(r.s0/H.rel[n-1].s0-(r.hit===H.rel[n-1].hit?0.85:r.hit?0.85*GAME_HIT:0.85/GAME_HIT))>1e-9)throw Error('15% step '+n);}
if(gameStart(h))throw Error('no start in an empty genre');
// the best released game is the one sequelled
var t2=me(readyGame());var T2=gmOf(t2);T2.rel.push({t:'Grand Theft Shrimp',b:'Grand Theft Shrimp',k:0,g:'action',q:90,d:0,m:'paid',s0:0},{t:'Red Shrimp Redemption',b:'Red Shrimp Redemption',k:0,g:'action',q:40,d:0,m:'paid',s0:0});if(gameNext(t2,'action').t!=='Grand Theft Shrimp 2')throw Error('best one gets the sequel');
// out: every genre done, once: the news line and the Khalas card, the card says taking a break
var o=me(readyGame());var O=gmOf(o);GAME_GEN.forEach(function(G0){var t=GAMES.filter(function(x){return x[1]===G0[0];})[0][0];O.rel.push({t:t,b:t,k:0,g:G0[0],q:50,d:0,m:'paid',s0:0});for(var k=1;k<=6;k++)O.rel.push({t:t+GAME_SEQ[k-1],b:t,k:k,g:G0[0],q:50,d:0,m:'paid',s0:0});});
if(!gameOut(o))throw Error('out');var cnt=function(){return JSON.stringify(o).split('milking the past').length-1;};gamesDay(o);var l1=cnt();gamesDay(o);o.day++;gamesDay(o);if(!O.out||!milestoneConditions(o).gm_out)throw Error('out fires');
if(!l1||cnt()!==l1)throw Error('news once: '+l1+' '+cnt());if(gameStart(o))throw Error('no new games after');
if(MILESTONES.gm_out.body!=='Khalas. You have made enough games.')throw Error('Khalas');
// old Pass 264 save: genres and fields migrate, credits gone
var od=me(readyGame());od.me.gm={used:2,n:2,cur:{t:'World of Shrimpcraft',g:'cozy',p:'pc',m:'paid',pr:40,q:30,d:0,next:Math.floor(od.day)+40,w:0},rel:[{t:'Red Shrimp Redemption',g:'strat',p:'pc',m:'paid',pr:40,q:60,d:0,hit:0,s0:0.01}],dr:{g:'cozy',p:'phone',m:'paid',pr:40},fz:null,pay:0};
var OG=gmOf(od);if(OG.cur.g!=='online world'||OG.rel[0].g!=='action'||OG.dr.g!=='idle / tycoon'||OG.cur.wd!==60||OG.cur.qt!==30||OG.rel[0].rp)throw Error('migrate '+JSON.stringify(OG.cur));
// caps on the whole portfolio: 3% under 500M, 5% from 500M, base without games, work or loans; zero base gives the floor
var p=me(readyGame());p.fin=[];for(var i=0;i<30;i++)p.fin.push({kits:10000,games:5000,work:5000,loans:9e6});p.kits.sold=1e6;var b=gameBase(p);if(Math.abs(b-(10000-storeDayCost(p)-(shopCount(p)?(annualRent(p)+LICENSE)/365:0)))>1e-6)throw Error('base ignores games, work, loans: '+b);
var gm=gmOf(p);gm.cur=null;for(var i=0;i<5;i++)gm.rel.push({t:'x',g:'puzzle',p:'phone',m:'sub',pr:15,q:100,hit:1,d:0,s0:0.05});p.day=0;
if(Math.abs(gamePay(p,0)-0.03*b)>1e-6)throw Error('3% cap: '+gamePay(p,0));p.kits.sold=5e8;if(Math.abs(gamePay(p,0)-0.05*b)>1e-6)throw Error('5% cap');
gm.rel=[{t:'x',g:'puzzle',p:'phone',m:'paid',pr:40,q:50,hit:0,d:0,s0:0.01}];if(Math.abs(gamePay(p,0)-0.01*b)>1e-6)throw Error('under the cap it earns its score');
p.fin=[];for(var i=0;i<30;i++)p.fin.push({kits:0,staff:-50000});if(Math.abs(gamePay(p,0)-0.01*GAME_FLOOR)>1e-9)throw Error('loss: floor '+gamePay(p,0));
// 1B switch keeps the rate, then soft ceiling at 10% of company income
var z=me(readyGame());z.fin=[];for(var i=0;i<30;i++)z.fin.push({kits:1e6});z.kits.sold=9.9e8;z.humans=2e9;var zm=gmOf(z);for(var i=0;i<3;i++)zm.rel.push({t:'x',g:'puzzle',p:'phone',m:'sub',pr:15,q:90,hit:1,d:0,s0:0.03});z.day=0;
gamesDay(z);var before=zm.pay;z.kits.sold=1e9;z.day=1;gamesDay(z);if(!zm.fz||Math.abs(zm.pay-before)>before*0.01)throw Error('no jump at 1B: '+before+' -> '+zm.pay);
z.fin=[];for(var i=0;i<30;i++)z.fin.push({kits:2e6});var p1=gamePay(z,1);if(Math.abs(p1-zm.pay)>zm.pay*0.01)throw Error('after 1B not with company income: '+p1);
for(var i=0;i<40;i++)zm.rel.push({t:'y',g:'puzzle',p:'phone',m:'sub',pr:15,q:100,hit:1,d:1,s0:0.05});var big=gamePay(z,1),C=GAME_SOFT*gameBase(z);if(!(big>zm.pay*1.5))throw Error('grows with releases');if(!(big<C*1.6))throw Error('soft ceiling: '+big+' vs '+C);
// ledger: Games is its own income row, operatingNet and corporate tax count it, the base does not
if(!FIN_CATS.some(function(c){return c[0]==='games'&&c[2]===1;}))throw Error('Games category');
var L=me(readyGame());L.fin=[];for(var i=0;i<30;i++)L.fin.push({kits:1000});var on0=operatingNet(L),b0=gameBase(L);L.fin.forEach(function(r){r.games=500;});
if(Math.abs(operatingNet(L)-on0-500)>1e-6)throw Error('operatingNet counts games');if(gameBase(L)!==b0)throw Error('the base does not');
var m0=L.money;earn(L,123,'games');if(L.money-m0!==123||L.today.games!==123)throw Error('earn to Games');
// Grandma's card: only at 500M, only if she never made a game; yes holds Video games 60 days, then the old plan; no changes nothing
var y=me(readyGame());y.me.p2=['tanks','books'];y.kits.sold=4.9e8;if(milestoneConditions(y).gp_games)throw Error('not before 500M');y.kits.sold=5e8;if(!milestoneConditions(y).gp_games)throw Error('at 500M');
var yy=JSON.parse(JSON.stringify(y));yy.me.gm={rel:[]};if(milestoneConditions(migrate(yy)).gp_games)throw Error('not after a game');
var yn=migrate(JSON.parse(JSON.stringify(y)));if(!storyChoose(yn,'gp_games',1)||yn.me.vh||yn.me.p2.join()!=='tanks,books')throw Error('no changes nothing');
if(!storyChoose(y,'gp_games',0)||!gameMaking(y)||!gameHolding(y))throw Error('yes holds Video games');if(setPick(y,'games'))throw Error('held');setPick(y,'exercise');if(!gameMaking(y))throw Error('a new pick keeps it');
var d1=Math.floor(y.day);for(var i=0;i<GAME_HOLD;i++){y.day=d1+i+1;y.me.ill=null;lifeDay(y);gamesDay(y);}if(gameHolding(y)||y.me.p2.join()!=='tanks,books')throw Error('old plan back: '+y.me.p2);
`);
check('Pass 266: salesWhy says why kit sales are what they are, one fixed phrase, never advice; the hard part at capacity reads as the market ending (item 19)',`
var g=readyGame();if(salesWhy(g)!=='')throw Error('nothing before kits open');
g.emp.kitsOpened=1;g.humans=1000;g.stats.sold=500;g.kits.sold=50;g.money=1e9;
var w0=salesWhy(g);if(!/Orders outrun|Selling as fast|Word of mouth|Everyone who wants/.test(w0))throw Error('plain reason: '+w0);
if(/Ads|Kits|buy|Build|Add/.test(w0))throw Error('no advice in the line: '+w0);
g.emp.nosale=Math.floor(g.day)+30;if(!/police/.test(salesWhy(g)))throw Error('police');g.emp.nosale=0;
// the hard part: owners at kitCap means kitDemand 0 and the market-ending line, not a marketing one
hardOf(g).open=1;g.emp.op.m=1;g.humans=kitCap(g);if(kitDemand(g)!==0)throw Error('demand 0 at the cap');if(salesWhy(g)!=='Everyone who can keep a tank has one')throw Error('cap line: '+salesWhy(g));
g.emp.hard.open=0;g.humans=kitCap(g);if(salesWhy(g)!=='Everyone who wants a tank has one')throw Error('pre-hard cap line: '+salesWhy(g));
var P=Object.keys(PAINS)[0];g.humans=1000;g.emp.pains=g.emp.pains||{};g.emp.pains[P]={until:g.day+10};if(painMult(g)>=1||!/part speed/.test(salesWhy(g)))throw Error('pain line: '+salesWhy(g));
`);
check('Pass 268 item 12: Rewilding, the last mile and the lab are letters only, no story card before; the shop and the island keep theirs',`
var g=readyGame();g.emp.trees={rewild:1,lastmile:1,lab:1,shop:1,island:1};var o=cards3Cond(g);
if(o.tree_rewild||o.tree_lastmile||o.tree_lab)throw Error('letter trees have no story card');if(!o.tree_shop||!o.tree_island)throw Error('shop and island keep theirs');
if(!treeLetter('rewild')||treeLetter('shop')||treeLetter('island'))throw Error('treeLetter');
`);
check('Pass 268 item 9: Go with Grandma holds Europe stores until she is better, then they open',`
var g=readyGame();var E=g.emp;E.kitsOpened=1;E.farms={rack:3};g.kits.sold=30000;g.money=1e10;E.regions=['auh','dxb','uae','gcc','eu'];E.regDay={eu:Math.floor(g.day)};g.me=g.me||{};g.me.on=1;
if(!storeCanBuy(g,'eu',1))throw Error('eu stores buyable before the card');
CARDS3.c_knee.ch[0][3](g);if(storeCanBuy(g,'eu',1)||buyStores(g,'eu',1))throw Error('eu stores held');if(regWaitWhy(g,'eu')!=='Waiting for Grandma')throw Error('why: '+regWaitWhy(g,'eu'));
if(!storeCanBuy(g,'auh',1))throw Error('other regions still open');var f=storeFillN(g);E.regWait.eu=0;if(storeFillN(g)<=f)throw Error('fill skips the held region');
E.regWait.eu=Math.floor(g.day)+182;g.day+=183;if(!buyStores(g,'eu',1)||regWaitWhy(g,'eu'))throw Error('eu opens after she is better');
`);
check('Pass 268 item 10: the farms run in bursts (full until 60 days of orders are in stock, then nothing), the card figure is a 30-day rolling value, so it never drops from a lot to 0 in a day',`
var h=readyGame();h.stats.sold=KIT_UNLOCK;h.emp.kitsOpened=1;h.emp.farms.mhatch=3;h.humans=2e6;h.emp.regions=['uae','gcc'];h.money=1e9;h.emp.staff.tier=2;h.emp.staff.pack=10;var kd=Math.max(1,kitDemand(h));h.kits.stock=Math.ceil(kd*(STOCK_FULL-3));
var zero=0,made=0,prev=null,worst=1;for(var i=0;i<150;i++){h.day=Math.floor(h.day)+1;empireDay(h);if(h.emp.prod<1)zero++;else made++;if(prev>0)worst=Math.min(worst,h.emp.prodAvg/prev);prev=h.emp.prodAvg;}
if(!zero||!made)throw Error('expected burst days and idle days: '+made+' '+zero);if(worst<0.95)throw Error('figure fell '+Math.round((1-worst)*100)+'% in a day');
`);
check('Pass 268 item 16: after a clean the tank stays clean 2 real minutes, at any speed, then dirt comes back',`
var g=readyGame(),T=g.tanks[0];T.pop=[{n:20,age:120,g:90}];g.me=g.me||newMe();g.me.keep='self';var C=careOf(T),ms=1e9,D0=Date.now;Date.now=function(){return ms;};
C.mulm=0;C.grow=0;g.tday=g.day=1000;C.vacD=td(g,T);C.grD=C.vacD;for(var i=0;i<400;i++){ms+=200;g.tday=++g.day;careDay(g);}/* 400 tank days in 80 s, as at high speed */
if(C.mulm>1e-9||C.grow>1e-9)throw Error('dirt came back inside 2 real minutes: '+C.mulm+' '+C.grow);
ms+=CLEAN_MS-80000+1;for(i=0;i<50;i++){ms+=200;g.tday=++g.day;careDay(g);}if(!(C.mulm>0&&C.grow>0))throw Error('dirt comes back after 2 minutes');
var T2={},g2=readyGame();if(cleanHeld(g2,T2,g2.day-CLEAN_HOLD-1))throw Error('an old clean after a reload holds nothing');Date.now=D0;
`);
check('Pass 268 item 20: Shopping costs 0.5% of a month of income a day, AED 5 to 3,000',`
var g=readyGame();g.fin=[];if(shoppingCost(g)!==5)throw Error('floor '+shoppingCost(g));g.fin=[{kits:2000}];if(shoppingCost(g)!==300)throw Error('2,000 a day: '+shoppingCost(g));g.fin=[{kits:5e9}];if(shoppingCost(g)!==3000)throw Error('cap '+shoppingCost(g));
g.money=1e12;var m=g.money;shopDay(g);if(m-g.money!==3000)throw Error('paid '+(m-g.money));
`);
{/* Pass 270: BUILD is the real commit time in Abu Dhabi, never a guess in the future (Puti, 6 Nov: Settings showed a time not reached yet) */
const b=html.match(/BUILD='(\d{4}-\d\d-\d\dT\d\d:\d\d)/);if(!b)throw Error('BUILD needs YYYY-MM-DDTHH:MM');
const t=Date.parse(b[1]+':00+04:00');if(!(t<=Date.now()))throw Error('BUILD '+b[1]+' UAE is in the future, stamp it with: TZ=Asia/Dubai date +%Y-%m-%dT%H:%M');
count++;console.log('PASS Pass 270: BUILD is not in the future');}
check('UI/UX chat 2: films, campaigns, galas and the Media track open at MKT_AT kits sold; an old save keeps what runs',`
var g=readyGame();g.money=1e12;g.emp.inf=1e12;g.emp.infOn=1;g.humans=5e5;g.emp.proj.refer=1;g.emp.proj.high=1;g.kits.sold=MKT_AT-1;
var media=projAvail(g).filter(function(p){return MKT_LATE[p.id];});if(media.length)throw Error('media before MKT_AT: '+media.map(function(p){return p.id;}));
if(buyProj(g,'ministry'))throw Error('ministry before MKT_AT');
g.emp.proj.ministry=1;g.emp.proj.studio=1;g.emp.op.offer=null;opinionDay(g);if(g.emp.op.offer)throw Error('desk offer before MKT_AT');
g.emp.op.offer=['calm'];if(runCampaign(g,'calm'))throw Error('campaign before MKT_AT');if(greenlight(g,0))throw Error('film before MKT_AT');
g.emp.op.run={id:'calm',left:2,before:.5};opinionDay(g);opinionDay(g);if(g.emp.op.run||g.emp.op.offer)throw Error('a running campaign ends, no new offers yet');
g.kits.sold=MKT_AT;delete g.emp.proj.ministry;delete g.emp.proj.studio;if(!projAvail(g).some(function(p){return p.id==='ministry';}))throw Error('ministry at MKT_AT');
g.emp.proj.ministry=1;opinionDay(g);if(!g.emp.op.offer)throw Error('desk offers at MKT_AT');
if(!milestoneConditions(g).market)throw Error('the Company/Market card at MKT_AT');
`);
check('Pass 274: the little bird options exist, carry the flag, pay more than the rest; the good year amount is the cost',`
if(MILESTONES.pain_payout.bird!=='payout'||MILESTONES.c_bonus.bird!=='bonus')throw Error('bird flag missing');
if(PAINS.pain_payout.ch.length!==4||CARDS3.c_bonus.ch.length!==3)throw Error('bird option missing');
if(PUSH.pain_payout.length!==4||PUSH.c_bonus.length!==3||(PUSH.pain_payout[3].means||0)>=0||(PUSH.c_bonus[2].means||0)>=0)throw Error('bird PUSH');
function pg(){var g=newGame();g.emp.kitsOpened=1;g.humans=1.6e6;g.money=1e7;g.fin=[];for(var i=0;i<7;i++)g.fin.push({kits:9e4});return g;}
var res=[0,1,2,3].map(function(i){var g=pg(),m0=g.money,l0=(g.emp.later||[]).length,h0=g.emp.heart||0;if(!storyChoose(g,'pain_payout',i))throw Error('payout '+i);return {dm:g.money-m0,d:g.emp.pains.pain_payout.until-g.day,later:(g.emp.later||[]).length-l0,shell:!!g.emp.shell,g:g};});
var b=res[3];if(b.shell||b.later||b.g.emp.frozen)throw Error('bird payout schedules something');if(b.g.story.bird.payout!==3)throw Error('bird payout not recorded');
res.slice(0,3).forEach(function(r,i){if(!(b.dm>=r.dm&&b.d<=r.d))throw Error('bird payout not the best money option vs '+i);});
var cg=function(){var g=pg();g.emp.hard={};hardOf(g);g.emp.hard.picks=g.emp.hard.picks||{};return g;};
var bres=[0,1,2].map(function(i){var g=cg(),m0=g.money,l0=(g.emp.later||[]).length,lab=CARDS3.c_bonus.lab(g,i),a=bonusAmt(g);if(!storyChoose(g,'c_bonus',i))throw Error('bonus '+i);var f=g.today||{};return {dm:g.money-m0,a:a,lab:lab,tax:-(f.tax||0),later:(g.emp.later||[]).length-l0,g:g};});
bres.forEach(function(r,i){if(Math.abs(-r.dm-r.a)>1)throw Error('bonus '+i+' costs '+(-r.dm)+' not the label amount '+r.a);if(r.lab.indexOf(fmtA(r.a))<0)throw Error('bonus label amount '+r.lab);});
if(bres[0].tax>0||bres[0].later||!/^Donate/.test(bres[0].lab))throw Error('donate');if(Math.abs(bres[1].tax-0.3*bres[1].a)>1)throw Error('share tax 30%');
var bp=bres[2];if(bp.later||!/congresswoman/.test(bp.lab))throw Error('pump label or later');if(bp.g.story.bird.bonus!==2)throw Error('bird bonus not recorded');
var PG=bp.g,PP=pumpOf(PG);if(!PP||!coinOn(PG)||Math.abs(PP.a-bp.a)>1)throw Error('pump starts and launches the coin');if(!/launch Shrimpcoin/.test(MILESTONES.c_bonus.bodyFn(cg())))throw Error('body asks to launch');
var sv=JSON.parse(JSON.stringify(PG));migrate(sv);if(sv.story.bird.bonus!==2||!pumpOf(sv))throw Error('pump lost in save');
var x10=null;for(var t=1;t<=PUMP_END;t++){var b=pumpBase(t);if(t>PUMP_SPIKE&&b<10&&x10==null)x10=t;}if(x10!==PUMP_X10+1)throw Error('ten times line at '+x10);
if(pumpBase(PUMP_SPIKE)!==20||pumpBase(PUMP_SPIKE-1)>15||pumpBase(PUMP_SPIKE+1)>15||pumpBase(PUMP_END)>0.05)throw Error('pump shape');
var m1=PG.money;for(var d=0;d<PUMP_SPIKE-1;d++){PG.day+=1;coinDay(PG);}var mc=milestoneConditions(PG);if(!mc.pump_call1||!/selling tomorrow/.test(MILESTONES.pump_call1.bodyFn(PG)))throw Error('first call the day before the top');PG.day+=1;coinDay(PG);
var got=pumpExit(PG);if(got<19.9*PP.a||got>20.1*PP.a||PG.money-m1<got-1)throw Error('exit at the top pays 20x, got '+got/PP.a);if(pumpExit(PG))throw Error('exit twice');if(milestoneConditions(PG).pump_call2)throw Error('second call after exit');
var H=JSON.parse(JSON.stringify(sv));for(var d2=0;d2<PUMP_X10-7;d2++){H.day+=1;coinDay(H);}if(!milestoneConditions(H).pump_call2)throw Error('second call a week before ten times');
for(var d3=0;d3<300;d3++){H.day+=1;coinDay(H);}if(!pumpOf(H).done||!pumpOf(H).lost||pumpExit(H))throw Error('pump ends, held coins lost');
if(!/never be caught doing this/.test(MILESTONES.c_bonus.birdNote))throw Error('bonus bird note');
var o=newGame();delete o.story.bird;migrate(o);
`);
check('Pass 275: coins never sell out, more money pumps the price; nobody plants more than PLANT_DAY a day',`
var g=readyGame();g.humans=1e9;g.kits.sold=2e6;g.money=1e15;var C=coinOf(g);C.on=1;C.coins=1e6;C.treasury=0;var p0=C.price,q=coinBuy(g,1e8);if(!(q>0&&q<1e6))throw Error('buy '+q);var q2=coinBuy(g,1e12);if(!(q2>0)||C.treasury>=1e6)throw Error('second buy '+q2);if(!(C.price>p0))throw Error('price not pumped');
var h=readyGame();h.humans=4e9;h.kits.sold=2e6;var D=coinOf(h);D.trees=1e9;D.otrees=1e9;h.money=1e14;treesFromGala(h,4e10);var o0=D.otrees+(D.ptrees||0);h.day+=1;treesDay(h);if(D.otrees+(D.ptrees||0)-o0>PLANT_DAY+1)throw Error('more than PLANT_DAY in a day');if(!(D.gq>0))throw Error('gala queue');
if(coinPlant(h,4e10)>PLANT_DAY)throw Error('coinPlant over the cap');
`);
check('Pass 276: A good year shows once; coinBook adds up buys, the pump and sales',`
var g=readyGame();g.humans=1e9;g.money=1e12;var C=coinOf(g);C.on=1;C.coins=1e8;C.treasury=0;C.price=10;C.x=Math.log(10/12);var q=coinBuy(g,1e6);var b=coinBook(g);if(Math.abs(b.avg-1e6/q)>1e-6||Math.abs(b.ba-1e6)>1)throw Error('avg '+b.avg);
C.price=20;var got=coinSell(g,q/2);b=coinBook(g);if(!b.sold||Math.abs(b.real-(got-b.avg*Math.floor(q/2)))>1)throw Error('realized '+b.real);if(Math.abs(b.all-(got+C.treasury*C.price-1e6))>1)throw Error('all time');
var h=readyGame();h.progress.seen.c_bonus=true;if(CARDS3.c_bonus.cond(h))throw Error('bonus again after seen');var k=readyGame();k.story.bird={bonus:2};if(CARDS3.c_bonus.cond(k))throw Error('bonus again after pick');
`);
check('Pass 277: board game day opens the first June after the first farm, one game each a year, prize rule, level streak, forfeit',`
var g=newGame();g.money=50000;var J1=bgJ1(2027);var dj=bgDate(J1);if(dj.getMonth()!==5||dj.getDate()!==1)throw Error('J1 '+dj);
g.day=J1;bgDay(g);if(bgNow(g)||bgHold(g))throw Error('no farm, no competition');
g.emp.farms={t:1};g.day=J1+1;bgDay(g);if(bgNow(g))throw Error('farm built in June: wait for next year');
var J2=bgJ1(2028);g.day=J2-1;bgDay(g);if(bgNow(g))throw Error('May');g.day=J2;bgDay(g);var B=bgOf(g);if(!bgNow(g)||B.pop!==2028||!bgHold(g)||B.first!==2028)throw Error('opens 1 June 2028');
if(bgCanNever(g))throw Error('no Never in the first year');
g.money=50000;var lv=bgEnter(g,'gomoku');if(lv!=='balanced'||bgHold(g))throw Error('enter');if(bgEnter(g,'gomoku')!==null)throw Error('enter twice');
var m0=g.money,r=bgEnd(g,'gomoku','win');if(r.prize!==10000||g.money!==m0+10000)throw Error('capped prize '+r.prize);if(bgEnd(g,'gomoku','win')!==null)throw Error('second prize');
g.money=4001;bgEnter(g,'reversi');r=bgEnd(g,'reversi','win');if(r.prize!==2001||g.money!==6002)throw Error('half prize '+r.prize);
if(B.lv!=='hard')throw Error('two wins make it hard');if(bgLeft(g).length)throw Error('both played');
g.money=-500;if(bgPrize(g)!==1000)throw Error('minimum');g.money=1;if(bgPrize(g)!==1000)throw Error('min small');
g.day=J2+30;bgDay(g);if(bgNow(g))throw Error('July closes it');
var J3=bgJ1(2029);g.day=J3;bgDay(g);if(!bgNow(g)||B.pop!==2029)throw Error('2029');if(!bgCanNever(g))throw Error('Never from year two');bgNoCard(g,1);if(!B.never||bgHold(g))throw Error('never');
bgEnter(g,'gomoku');bgEnd(g,'gomoku','loss');bgEnter(g,'reversi');var s=JSON.parse(JSON.stringify(g));migrate(s);if(s.me.bg.y[2029].reversi!=='loss')throw Error('open game in a save is a loss');if(s.me.bg.lv!=='balanced')throw Error('two losses back to balanced '+s.me.bg.lv);
var J4=bgJ1(2030);s.day=J4;bgDay(s);if(!bgNow(s)||bgHold(s))throw Error('never: open without the card');
var o=newGame();o.emp.farms={t:1};delete o.me.bg;migrate(o);if(bgOf(o).f!==0)throw Error('old farm save');
`);
console.log(count+' focused balance and migration checks passed');
