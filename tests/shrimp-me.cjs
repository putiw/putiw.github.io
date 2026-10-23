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
check('out of money offers what fits, loans come due, bankruptcy ends the game',`
var g=newGame();g.day=40;g.money=-300;if(!milestoneConditions(g).broke)throw Error('Card');var o=brokeOpts(g).map(function(x){return x[2];});
if(o.indexOf('gp')<0||o.indexOf('shark')<0||o.indexOf('bank')>=0||o.indexOf('wash')>=0)throw Error('Early options '+o);
storyChoose(g,'broke',0);if(g.money!==500||!g.emp.gpLoan||!g.me.gp.noSea||milestoneConditions(g).broke)throw Error('Grandpa');
if(brokeOpts(Object.assign(g,{money:-10})).some(function(x){return x[2]==='gp';}))throw Error('Grandpa only once');
g.money=5000;if(!payGrandpa(g)||g.me.gp.noSea)throw Error('Pay back');
var h=newGame();h.day=100;h.emp.farms.rack=2;h.emp.farmPaid.rack=[1,1];h.money=-2000;var i=brokeOpts(h).findIndex(function(x){return x[2]==='shark';});storyChoose(h,'broke',i);
if(!h.emp.shark||h.money<=0)throw Error('Shark');h.money=0;h.day=h.emp.shark.due;debtDay(h);if(h.emp.farms.rack!==1||!h.emp.shark)throw Error('Smashed farm');
h.money=-50000;var bi=brokeOpts(h).findIndex(function(x){return x[2]==='bankrupt';});if(bi<0)throw Error('Bankruptcy should show for deep debt');storyChoose(h,'broke',bi);
if(!h.emp.ended||endingPick(h)!=='fall_shark'||!progressionBlocked(h)||!milestoneConditions(h).gameover)throw Error('Ends '+endingPick(h));
var k=newGame();k.day=400;k.kits.sold=500;k.money=-1000;if(!brokeOpts(k).some(function(x){return x[2]==='bank';}))throw Error('Bank with income');
k.emp.bank={left:12000,pay:600,miss:0,next:k.day};k.emp.farms.barn=1;k.emp.farmPaid.barn=[1];k.money=0;for(var m=0;m<3;m++){k.day=k.emp.bank.next;debtDay(k);}if(k.emp.farms.barn!==0)throw Error('Bank takes a farm');
`);
check('dyed shrimp sell for more until someone finds out',`
var g=newGame();var T=g.tanks[0];T.had=1;T.set.sellAge=50;T.pop=[{age:90,n:40,g:40,b:0}];g.stats.sold=40;if(!milestoneConditions(g).dye_offer)throw Error('Offer');
var a=doSell(g,T,true,10).revenue;storyChoose(g,'dye_offer',0);var b=doSell(g,T,true,10).revenue;if(Math.abs(b/a-1.6)>0.01)throw Error('60% more '+a+' '+b);
g.day=30;var r=Math.random;Math.random=function(){return 0;};dyeDay(g);Math.random=r;if(g.dye.on||!milestoneConditions(g).mira_dye||g.orderNext<100)throw Error('Found out');
`);
check('fight nights pay, cost shrimp, can be raided, and lead to the investor',`
Math.random=function(){return 0.9;};var g=newGame();var T=g.tanks[0];T.had=1;T.pop=[{age:90,n:60,g:40,b:0}];T.feeder=1;T.autoWC=1;personalDay(g);g.emp.fight=1;g.me.picks=['fight','nothing'];g.fin=[{shrimp:100}];
var m=g.money,n=totalN(T);for(var d=0;d<29;d++){g.day++;personalDay(g);}if(g.money<=m||totalN(T)>=n||!g.emp.fightDead)throw Error('Fight nights');
if(!milestoneConditions(g).mira_fight)throw Error('Mira');g.emp.kitsOpened=1;if(!milestoneConditions(g).wash_offer)throw Error('Investor after four nights');
`);
check('washing money pays every day, asks favours, and the way back costs almost everything',`
var g=newGame();g.emp.kitsOpened=1;g.money=100000;g.day=500;storyChoose(g,'wash_offer',0);if(!dirtyOn(g))throw Error('On');var m=g.money;washDay(g);if(g.money<=m)throw Error('Cash');
g.day=g.emp.dirty.next;if(!milestoneConditions(g).fav_0)throw Error('Favour');storyChoose(g,'fav_0',0);if(g.emp.staff.pack!==5)throw Error('Cousins');
g.day=g.emp.dirty.next;storyChoose(g,'fav_1',0);g.day=g.emp.dirty.next;if(!favourDue(g,2))throw Error('Routes');
var p=JSON.parse(JSON.stringify(g));storyChoose(g,'fav_2',0);if(!g.emp.network||favourDue(g,0)||favourDue(g,1)||favourDue(g,2)||!milestoneConditions(g).gp_net)throw Error('Network is the point of no return');
g.tr={reach:6,know:-4,care:6};if(endingPick(g)!=='network_dark')throw Error('Dark '+endingPick(g));
var q=Object.assign(engineCopy(p));function engineCopy(x){var y=newGame();for(var k in x)y[k]=x[k];return y;}
q.money=1000000;q.emp.farms.barn=4;storyChoose(q,'fav_2',1);if(q.money>100000||!frozen(q)||farmCap(q)!==20||!q.emp.turned||dirtyOn(q))throw Error('Police '+q.money+' '+farmCap(q));
q.tr={reach:6,know:-4,care:6};if(endingPick(q)!=='network_back')throw Error('Back');q.day+=366;turnedDay(q);if(!milestoneConditions(q).mira_back)throw Error('Mira comes back');
var r=engineCopy(JSON.parse(JSON.stringify(p)));r.money=1e6;storyChoose(r,'fav_2',2);if(dirtyOn(r)||!r.emp.paidOut||gpLines(r).join().indexOf('route')<0)throw Error('Paid out');
`);
check('the buyout offer ends the game with its own ending',`
var g=newGame();g.humans=1e6;if(!milestoneConditions(g).buyout)throw Error('Offer');storyChoose(g,'buyout',1);if(g.emp.ended||!g.emp.offerOpen)throw Error('No');
var h=newGame();h.humans=1e6;var m=h.money;storyChoose(h,'buyout',0);if(endingPick(h)!=='sold'||h.money-m<2e7)throw Error('Sold');
`);
check('only some players see each tree, and the steps add to the ending',`
var g=newGame();g.humans=6e7;g.day=900;g.tr={drive:8,ego:8,means:-6};treeDay(g);if(!treeHas(g,'island')||treeHas(g,'shop')||!milestoneConditions(g).tree_island)throw Error('Island for climbers '+JSON.stringify(g.emp.trees));
g.money=1e8;if(!buyTreeStep(g,'isl_buy')||buyTreeStep(g,'isl_pass'))throw Error('Steps in order');g.emp.inf=1e5;buyTreeStep(g,'isl_nation');if(taxRate(g)!==0.045)throw Error('Island tax');
if(gpLines(g).join(' ').indexOf('Shrimp Island')<0)throw Error('Ending line');
var h=newGame();h.humans=6e7;h.day=900;h.tr={drive:-8,ego:-8,care:-4};treeDay(h);if(!treeHas(h,'shop')||treeHas(h,'island'))throw Error('Shop for floaters');
var q=newGame();q.tr={know:8,care:6,ego:-4};q.emp.won=4000;if(!spaceOpen(q))throw Error('Space for the curious');q.tr={drive:8,ego:8,means:-6};q.emp.trees={};if(spaceOpen(q))throw Error('Not for climbers');
var l=newGame();l.humans=6e7;l.day=900;l.tr={know:-8,kin:-8,drive:6,ego:6};treeDay(l);if(!treeHas(l,'lab'))throw Error('Designer lab for use and tool');
`);
check('a house that runs itself, piece by piece, for you or for Grandpa',`
var g=newGame();g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);g.money=1e6;if(!houseOffer(g))throw Error('Offer');buyHouse(g);if(!g.me.house.land)throw Error('Land');
if(buyHouse(g))throw Error('Walls need a who');if(!buyHouse(g,'gp'))throw Error('Walls');g.me.picks=['house','nothing'];g.me.next=g.day;personalDay(g);if(!g.me.house.hp)throw Error('Working on it');
while(houseNext(g))buyHouse(g);if(!g.me.house.complete||treesFor(g).indexOf('rewild')<0||gpLines(g).join().indexOf('Grandpa lives')<0)throw Error('Complete');
`);
check('hard places and late cards ask once and leave a line',`
var g=newGame();g.humans=2e9;var c=milestoneConditions(g);if(!c.c_war||!c.c_cash||c.c_water||c.c_gary!==undefined)throw Error('Thresholds');g.emp.inf=1e5;var ce=g.emp.ceil;
if(!storyChoose(g,'c_war',2)||g.emp.inf!==5e4)throw Error('Peace Corps');if(card3Lines(g).join().indexOf('peace deal')<0)throw Error('Line');
g.humans=3e9;g.money=0;if(storyChoose(g,'c_water',0))throw Error('Needs the money');if(!storyChoose(g,'c_water',4))throw Error('Free answer');
var old=newGame();old.day=3000;old.humans=7e9;delete old.progress.v5;migrateProgress(old);detectMilestones(old);if(old.progress.queue.some(function(k){return /^c_/.test(k);}))throw Error('Old saves skip passed cards');
`);
check('the world moves on in headlines, food and big builds keep paying after Earth',`
var g=newGame();g.emp.kitsOpened=1;g.humans=6e8;headlineDay(g);var R=rip(g);if(R.log.length!==3)throw Error('Gary, mayor, divorce '+R.log.length);headlineDay(g);if(rip(g).log.length!==3)throw Error('Once each');
var f0=foodIncome(g);g.emp.proj.foodfactory=1;if(Math.abs(foodIncome(g)/f0-4)>1e-9)throw Error('Factory');g.emp.proj.foodopen=1;if(foodIncome(g)>=f0*4)throw Error('Recipe means less food sold');
g.humans=8.2e9;g.emp.won=5000;g.space.started=true;g.emp.c3={c_water:0};var m=g.money;dayRollover(g);if(g.money-m<2e7)throw Error('After Earth it still earns '+(g.money-m));
if(sideIncome(g)<3e6||!rip(g).log.some(function(x){return /desalination/.test(x.tx);}))throw Error('Water sales');
`);
check('story cards wait their turn, about two minutes of play apart',`
var g=newGame();g.ps.t=1000;g.stats.sold=40;g.emp.kitsOpened=0;var p=ensureProgress(g);p.queue=[];p.seen.intro=true;g.tanks[0].cycledAt=null;
p.seen.cycle=p.seen.hatch=p.seen.sale=p.seen.ev_paper=true;
detectMilestones(g);var first=p.queue.slice();if(first.indexOf('ev_mira')<0||first.indexOf('dye_offer')>=0||p.wait.indexOf('dye_offer')<0)throw Error('Second card waits '+JSON.stringify(first)+JSON.stringify(p.wait));
p.queue=[];g.ps.t+=60000;detectMilestones(g);if(p.queue.length)throw Error('Too soon');g.ps.t+=61000;detectMilestones(g);if(p.queue[0]!=='dye_offer')throw Error('Now');
p.queue=[];g.money=-500;g.day=50;detectMilestones(g);if(p.queue[0]!=='broke')throw Error('Money trouble never waits');
`);
console.log(count+' free time, Grandpa and ending checks passed');
