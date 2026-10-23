// Free time, Grandpa, your own tank, staff goodbyes and the endings.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
function engine(){const c=vm.createContext({console,Math});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);return c;}
let count=0;function check(name,code){vm.runInContext(code,engine());console.log('PASS',name);count++;}
if(!html.includes('id="tb-me"')||!html.includes('id="p-me"')||html.includes('data-act="help"'))throw Error('Top bar: person button and You panel');
if(html.indexOf('id="btn-settings"')<html.indexOf('id="apop"'))throw Error('Settings should live inside the ? popup');
console.log('PASS the person button and the You panel sit in the top bar, settings inside ?');count++;
check('free time opens once the first tank feeds and changes itself',`
var g=newGame();g.day=10;personalDay(g);if(g.me.on)throw Error('Too early');g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);if(!g.me.on||!milestoneConditions(g).me_intro)throw Error('Should open');
if(meSlots(g)!==2||!mePick(g,'overtime')||g.me.picks.join()!=='nothing,overtime')throw Error('Two slots, oldest pick drops '+g.me.picks);
mePick(g,'visit');g.fin=[{shrimp:400}];var m0=g.money;for(var d=0;d<30;d++){g.day++;personalDay(g);}
if(g.me.visits<3||g.money<=m0||g.me.n<3)throw Error('Picks repeat each Saturday '+g.me.visits+' '+g.money);
g.emp.farms.rack=1;if(mePer(g)!==30||meSlots(g)!==3)throw Error('Monthly after farms');g.me.moved=1;if(mePer(g)!==365)throw Error('Yearly after moving');
`);
check('working without rest burns you out',`
var g=newGame();g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);g.me.picks=['overtime','videos'];for(var d=0;d<40;d++){g.day++;personalDay(g);}
if(!g.me.burns||!milestoneConditions(g).me_burnout)throw Error('Burnout');var v=g.me.vids;g.day++;g.me.next=g.day;personalDay(g);if(g.me.vids!==v)throw Error('Burnt weeks do nothing');
`);
check('Grandpa moments wait for you, pass if nobody looks, and count both ways',`
var g=newGame();g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);g.ps.t=1;
for(var d=0;d<60&&!g.me.cur;d++){g.day++;g.ps.t+=4000;personalDay(g);}if(!g.me.cur||g.me.cur.id!=='clinic')throw Error('Clinic moment '+JSON.stringify(g.me.cur));
var c=g.tr.care||0;if(!momentAnswer(g,true)||g.me.done.clinic!==1||(g.tr.care||0)>=c||!g.me.hist.length)throw Error('Accept');
g.me.mNext=0;g.me.mT=0;g.me.n=10;g.day+=1;personalDay(g);if(!g.me.cur)throw Error('Next moment');var id=g.me.cur.id;g.ps.t+=200000;g.day+=20;personalDay(g);if(g.me.cur&&g.me.cur.id===id||g.me.done[id]!==3||g.me.missed!==1)throw Error('Missed');
`);
check('keeping your own tank makes treats hand-given, happy treats count',`
var g=newGame();var T=g.tanks[0];T.had=1;T.pop=[{age:60,n:30,g:40,b:1}];g.money=1000;g.treatsOwned={spinach:1};T.set.treats={spinach:true};
dayRollover(g);if(!treatOn(T,'spinach'))throw Error('Weekly treat before');T.treats.spinach=0;g.emp.farms.hatch=1;if(!milestoneConditions(g).owntank)throw Error('Card');
storyChoose(g,'owntank',0);if(!ownTank(g)||tankGone(g))throw Error('Kept');dayRollover(g);if(treatOn(T,'spinach'))throw Error('No auto renew once it is yours');
if(!giveTreat(g,0,'spinach')||!giveHappy(g,'pea')||giveHappy(g,'pea')||g.me.happy!==1)throw Error('By hand');
var h=newGame();h.emp.farms.hatch=1;storyChoose(h,'owntank',1);if(!tankGone(h)||gpLines(h).join().indexOf('kitchen')<0)throw Error('Grandpa keeps it');
`);
check('packers, salespeople, managers and Leo each get a goodbye card',`
var g=newGame();var E=g.emp;E.staff.pack=10;E.staff.lines=1;g.money=1e6;if(!milestoneConditions(g).bye_pack)throw Error('Rosa');
var o=byeOpts(g,'pack');if(o.length!==4||o[1][3]!==10*180*35)throw Error('Six months '+o[1][3]);var m=g.money;if(!storyChoose(g,'bye_pack',1)||E.staff.pack!==0||m-g.money!==63000)throw Error('Bonus');
if(byeReady(g,'pack'))throw Error('Once');
E.proj.aiconsult=1;E.proj.drones=1;E.staff.sales=4;E.regions=['auh','dxb'];g.money=1e7;goAI(g,'sales');if(!byeReady(g,'sales')||E.bye.sales!==4)throw Error('Imran');
var so=byeOpts(g,'sales');if(!so.some(function(x){return x[2]==='mgr';}))throw Error('Regional manager with two regions');
var c0=staffCost(g);storyChoose(g,'bye_sales',so.findIndex(function(x){return x[2]==='mgr';}));if(staffCost(g)-c0!==195)throw Error('Imran salary');
E.proj.social=1;if(!byeReady(g,'social'))throw Error('Leo');var lo=byeOpts(g,'social');storyChoose(g,'bye_social',3);if(!E.later.some(function(x){return /Leo/.test(x.t);}))throw Error('Later news');
if(gpLines(g).join(' ').indexOf('Imran')<0)throw Error('Ending line');
var h=newGame();h.money=0;h.emp.staff.pack=5;h.emp.staff.lines=1;if(storyChoose(h,'bye_pack',1)||!storyChoose(h,'bye_pack',0))throw Error('Letting go always works');
var old=newGame();old.emp.staff.pack=5;old.emp.staff.lines=1;old.emp.proj.layoffpack=1;if(byeReady(old,'pack'))throw Error('Old saves that already decided');
`);
check('how you play and what you choose pick the ending',`
function run(tr,ps,me){var g=newGame();g.tr=tr;if(ps)for(var k in ps)g.ps[k]=ps[k];if(me)for(var k2 in me)g.me[k2]=me[k2];return endingPick(g);}
var e=run({drive:6,ego:6,means:-6});if(e!=='empire_dictator')throw Error(e);
if(run({drive:6,ego:6,means:2})!=='empire_good')throw Error('good');
if(run({reach:-6,means:4,kin:6})!=='garden_village')throw Error('village');
if(run({reach:-6,means:4,kin:6},null,{n:20,cnt:{nothing:20,design:20}})!=='garden_hermit')throw Error('hermit');
if(run({know:6,ego:-4,care:4,drive:3})!=='question_prof')throw Error('prof');
if(run({know:6,ego:-4,care:4,drive:-3})!=='question_lucky')throw Error('lucky');
if(run({reach:6,know:-4,care:6})!=='network_life')throw Error('network');
if(run({drive:-6,ego:-6,care:-4})!=='drift_shop')throw Error('shop');
if(run({drive:-6,ego:-6,care:-4},null,{vids:30})!=='drift_famous')throw Error('famous');
var fast=run({drive:-1},{t:600000,fast:580000});var slow=run({drive:-1},{t:600000,fast:0});if(fast===slow)throw Error('Play style should count '+fast);
var g=newGame();g.me.visits=20;if(visitLevel(g)!=='many')throw Error('visits');g.me.visits=0;g.me.calls=3;if(visitLevel(g)!=='none')throw Error('calls count less');
`);
check('old saves get the new state without losing anything',`
var g=newGame();delete g.me;delete g.tr;delete g.ps;g.day=900;var m=migrate(JSON.parse(JSON.stringify(g)));if(!m.me||!m.tr||!m.ps||m.me.on!==0)throw Error('Migration');
`);
console.log(count+' free time, Grandpa and ending checks passed');
