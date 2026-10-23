const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
function engine(){const c=vm.createContext({console,Math});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);return c;}
let count=0;function check(name,code){vm.runInContext(code,engine());console.log('PASS',name);count++;}
if(html.includes('id="world-mode"')||html.includes('society-view')||html.includes('research-view')||html.includes('A.view')||!html.includes("a.hidden=!open;a.style.order='5'")||!html.includes("chapterButton('world-tab','Open World tab',true)"))throw Error('Adoption and research should share one continuous World tab, with research following adoption');
console.log('PASS Adoption and Research share one continuous World tab');
check('research opens during Earth and grants preserve the reserve',`
var g=newGame();g.money=5000000;if(fundAcademy(g)||spaceOpen(g))throw Error('Early unlock');g.day=500;g.kits.sold=1000;g.money=Math.round(50000*USD);if(!fundAcademy(g)||g.money!==0||g.academy.funded!==365)throw Error('Pilot');
var d=g.academy.funded;academyDay(g);if(g.academy.funded!==d)throw Error('Idle funding spent');
g.academy.autoFund=true;g.academy.funded=0;startStudy(g,'materials');g.money=0;academyDay(g);if(g.money!==0||g.academy.active.progress!==0)throw Error('Unfunded work');
`);
check('discoveries change actual packing costs and automation without double applying',`
var g=newGame();g.kits.sold=1000;g.money=10000000;fundAcademy(g);startStudy(g,'materials');for(var i=0;i<60;i++)academyDay(g);if(kitMaterials(g)!==90||g.academy.knowledge!==40)throw Error('Material research');
g.emp.rawShrimp=80;var before=g.money;packRaw(g,10,false);if(before-g.money!==900)throw Error('Packing did not use discovery');
g.emp.proj.autopackm=1;var cap=packingMachineCap(g),cost=lineCost(g,0);g.academy.done.automation=1;if(packingMachineCap(g)!==cap*1.2||lineCost(g,0)!==cost*.75)throw Error('Automation effect');
var migrated=migrate(JSON.parse(JSON.stringify(g)));if(kitMaterials(migrated)!==90)throw Error('Effect stacked on load');
`);
check('pause resumes partial work and inactive projects do not consume grants',`
var g=newGame();g.kits.sold=1000;g.money=10000000;fundAcademy(g);startStudy(g,'materials');for(var i=0;i<20;i++)academyDay(g);pauseStudy(g);var days=g.academy.funded;academyDay(g);if(days!==g.academy.funded)throw Error('Idle debit');startStudy(g,'materials');if(g.academy.active.progress!==20)throw Error('Lost progress');
`);
check('academic career requires funded research, then professors teach graduates',`
var g=newGame();g.kits.sold=1000;g.money=100000000;fundAcademy(g);g.academy.autoFund=true;
function work(id){if(!startStudy(g,id))throw Error('Start '+id);while(g.academy.active)academyDay(g);}
work('materials');if(!academyUpgrade(g,'lab'))throw Error('Lab');work('automation');work('water');work('longevity');work('genes');work('algae');
g.academy.repeat=true;startStudy(g,'observe');while(!g.academy.phds)academyDay(g);if(!academyUpgrade(g,'postdoc'))throw Error('Postdoc');while(g.academy.postdocDays<180)academyDay(g);if(!academyUpgrade(g,'group'))throw Error('Group');while(!g.academy.professors)academyDay(g);if(!openCourse(g,'systems'))throw Error('Course');var crew=g.academy.crew;academyDay(g);if(g.academy.crew!==crew+1||g.academy.graduates!==5||g.day!==0)throw Error('Teaching');
`);
check('space opens once everyone on Earth has a tank, and the clock keeps going',`
var c=newGame();c.tr={drive:8,ego:8,means:-6};c.emp.won=3650;c.day=3650;if(spaceOpen(c))throw Error('Space is only for curious players');
var g=newGame();g.tr={know:8,care:6,ego:-4};acknowledgeMilestone(g);g.day=3650;if(requestSpaceDream(g)||spaceOpen(g))throw Error('Year ten alone should not open space');g.emp.won=g.day;if(!requestSpaceDream(g)||!beginSpace(g))throw Error('Space should open after Earth');if(progressionBlocked(g))throw Error('Parallel chapter blocked');var before=g.day;g.opt.all=true;for(var i=0;i<4;i++){while(g.progress.queue.length)acknowledgeMilestone(g);stepGame(g);}if(g.day!==before+1)throw Error('Clock stopped');
`);
check('completed Earth archives bills only after explicit space transition',`
var g=newGame();g.tr={know:8,care:6,ego:-4};acknowledgeMilestone(g);g.emp.won=3000;g.money=1234567;g.day=3000;detectMilestones(g);if(!requestSpaceDream(g)||g.day!==3650||!beginSpace(g))throw Error('Reunion');var money=g.money;for(var i=0;i<4;i++)stepGame(g);if(g.money!==money||g.day!==3651)throw Error('Archived overhead');
`);
check('mission prerequisites, recovery and two solutions to heat are real',`
var g=newGame();g.tr={know:8,care:6,ego:-4};g.day=3650;g.emp.won=3650;acknowledgeMilestone(g);requestSpaceDream(g);beginSpace(g);g.money=10000000000;g.academy.knowledge=5000;g.academy.crew=5000;
if(launchColony(g,'orbit'))throw Error('Skipped research');g.academy.done.water=g.academy.done.algae=1;if(!launchColony(g,'orbit'))throw Error('Orbit');for(var i=0;i<90;i++)spaceDay(g);if(!g.space.colonies.orbit.settled)throw Error('Orbit not stable');if(!surveyWorld(g,'ember'))throw Error('Survey');for(var i=0;i<30;i++)spaceDay(g);launchColony(g,'ember');buyHabitatUpgrade(g,'ember','shade');if(habitatMetrics(g,'ember').stable)throw Error('Shade alone solved heat');g.academy.done.heat=1;buyHabitatUpgrade(g,'ember','recycler');buyHabitatUpgrade(g,'ember','solar');buyHabitatUpgrade(g,'ember','algaefarm');if(!habitatMetrics(g,'ember').stable)throw Error('Adapted shade failed');
g.academy.done.heat=0;delete g.space.colonies.ember.up.solar;buyHabitatUpgrade(g,'ember','cooler');if(habitatMetrics(g,'ember').stable)throw Error('Cooling free power');buyHabitatUpgrade(g,'ember','solar');if(!habitatMetrics(g,'ember').stable)throw Error('Active cooling path');
`);
check('legacy saves acquire empty chapters without fabricated credentials',`
var g=newGame();delete g.academy;delete g.space;delete g.emp.trees;g.day=4000;g.kits.sold=100000;g.emp.won=3900;migrate(g);if(g.academy.level||g.academy.phds||g.space.started||!spaceOpen(g)||!academyOpen(g))throw Error('Migration');
`);
check('research purchases protect live Earth working capital',`
var g=newGame();g.kits.sold=1000;g.emp.farms.barn=1;g.money=Math.round(50000*USD);var cash=g.money;if(fundAcademy(g)||g.money!==cash)throw Error('Spent reserve');g.money=Math.round(50000*USD)+capitalReserve(g);if(!fundAcademy(g))throw Error('Safe grant rejected');
`);
check('space ending leaves unfinished Earth running and survives save/load',`
var g=newGame();acknowledgeMilestone(g);g.opt.all=true;g.day=4000;g.space.started=true;g.space.won=4000;g.academy.level=2;g.academy.funded=100;g.academy.done.materials=1;startStudy(g,'water');g=migrate(JSON.parse(JSON.stringify(g)));for(var i=0;i<4;i++)stepGame(g);if(g.day!==4001||g.academy.active.progress!==1.25||progressionBlocked(g))throw Error('Space blocked Earth or research');
`);
console.log(count+' academy and parallel chapter checks passed');
