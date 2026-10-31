const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
function engine(){const c=vm.createContext({console,Math});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);return c;}
let count=0;function check(name,code){vm.runInContext(code,engine());console.log('PASS',name);count++;}
if(html.includes('id="world-mode"')||html.includes('society-view')||html.includes('research-view')||html.includes('A.view')||!html.includes("a.hidden=!open;a.style.order='0'"))throw Error('Adoption and research should share one continuous World tab, with research following adoption');
console.log('PASS Adoption and Research share one continuous World tab');
check('research opens during Earth and grants preserve the reserve',`
var g=newGame();g.money=5000000;if(fundAcademy(g))throw Error('Early unlock');g.day=500;g.kits.sold=ACADEMY_AT;g.money=Math.round(50000*USD);if(!fundAcademy(g)||g.money!==0||g.academy.funded!==365)throw Error('Pilot');
var d=g.academy.funded;academyDay(g);if(g.academy.funded!==d)throw Error('Idle funding spent');
g.academy.autoFund=true;g.academy.funded=0;startStudy(g,'materials');g.money=0;academyDay(g);if(g.money!==0||g.academy.active.progress!==0)throw Error('Unfunded work');
`);
check('discoveries change actual packing costs and automation without double applying',`
var g=newGame();g.kits.sold=ACADEMY_AT;g.money=10000000;fundAcademy(g);startStudy(g,'materials');for(var i=0;i<60;i++)academyDay(g);if(kitMaterials(g)!==90||g.academy.knowledge!==40)throw Error('Material research');
g.emp.rawShrimp=80;var before=g.money;packRaw(g,10,false);if(before-g.money!==900)throw Error('Packing did not use discovery');
g.emp.proj.autopackm=1;var cap=packingMachineCap(g),cost=lineCost(g,0);g.academy.done.automation=1;if(packingMachineCap(g)!==cap*1.2||lineCost(g,0)!==cost*.75)throw Error('Automation effect');
var migrated=migrate(JSON.parse(JSON.stringify(g)));if(kitMaterials(migrated)!==90)throw Error('Effect stacked on load');
`);
check('pause resumes partial work and inactive projects do not consume grants',`
var g=newGame();g.kits.sold=ACADEMY_AT;g.money=10000000;fundAcademy(g);startStudy(g,'materials');for(var i=0;i<20;i++)academyDay(g);pauseStudy(g);var days=g.academy.funded;academyDay(g);if(days!==g.academy.funded)throw Error('Idle debit');startStudy(g,'materials');if(g.academy.active.progress!==20)throw Error('Lost progress');
`);
check('academic career requires funded research, then professors teach graduates',`
var g=newGame();g.kits.sold=ACADEMY_AT;g.money=100000000;fundAcademy(g);g.academy.autoFund=true;
function work(id){if(!startStudy(g,id))throw Error('Start '+id);while(g.academy.active)academyDay(g);}
work('materials');if(!academyUpgrade(g,'lab'))throw Error('Lab');work('automation');work('water');work('longevity');work('genes');work('algae');
g.academy.repeat=true;startStudy(g,'observe');while(!g.academy.phds)academyDay(g);if(!academyUpgrade(g,'postdoc'))throw Error('Postdoc');while(g.academy.postdocDays<180)academyDay(g);if(!academyUpgrade(g,'group'))throw Error('Group');while(!g.academy.professors)academyDay(g);if(!openCourse(g,'systems'))throw Error('Course');var crew=g.academy.crew;academyDay(g);if(g.academy.crew!==crew+1||g.academy.graduates!==5||g.day!==0)throw Error('Teaching');
`);
check('after the win the clock keeps going and research keeps working',`
var g=newGame();g.tr={know:8,care:6};acknowledgeMilestone(g);g.day=3650;g.emp.won=g.day;g.opt.all=true;g.progress.sandbox=true;g.progress.queue=[];if(progressionBlocked(g))throw Error('Blocked after the win');var before=g.day;for(var i=0;i<4;i++){while(g.progress.queue.length)acknowledgeMilestone(g);stepGame(g);}if(g.day!==before+1)throw Error('Clock stopped');
`);
check('leaving Earth archives the company bills',`
var g=newGame();acknowledgeMilestone(g);g.emp.won=3000;g.day=3000;g.money=5e6;g.academy.papers=600;g.progress.sandbox=true;g.progress.queue=[];if(!startVoyage(g))throw Error('Leave');if(!earthArchived(g))throw Error('Archived');var day=g.day,money=g.money;for(var i=0;i<400;i++){g.progress.queue=[];stepGame(g);}if(g.day-day<99||money-g.money>100)throw Error('Archived overhead (Tank 1 running costs only) '+(g.money-money)+' days '+(g.day-day));
`);
check('legacy saves acquire an empty lab without fabricated credentials, and no old Space',`
var g=newGame();delete g.academy;g.space={v:1,started:false,colonies:{},surveys:{}};delete g.emp.trees;g.day=4000;g.kits.sold=100000;g.emp.won=3900;migrate(g);if(g.academy.level||g.academy.phds||g.space||!academyOpen(g))throw Error('Migration');
`);
check('research purchases protect live Earth working capital',`
var g=newGame();g.kits.sold=ACADEMY_AT;g.emp.farms.barn=1;g.money=Math.round(50000*USD);var cash=g.money;if(fundAcademy(g)||g.money!==cash)throw Error('Spent reserve');g.money=Math.round(50000*USD)+capitalReserve(g);if(!fundAcademy(g))throw Error('Safe grant rejected');
`);
check('keep observing repeats observing, and no study is Space only',`
var g=newGame();g.day=3650;g.emp.won=3650;acknowledgeMilestone(g);g.money=1e10;g.academy.level=2;g.academy.funded=999;g.academy.done.materials=1;g.academy.done.observe=1;g.academy.repeat=true;
startStudy(g,'observe');for(var i=0;i<80;i++)academyDay(g);if(!g.academy.active||g.academy.active.id!=='observe')throw Error('Observe should repeat');
if(STUDIES.some(function(r){return /Space:/.test(r.why);}))throw Error('Space-only study left');
`);
console.log(count+' academy and parallel chapter checks passed');
