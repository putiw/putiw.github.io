// Free time, Grandma, your own tank, staff goodbyes and the endings.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
function engine(){const c=vm.createContext({console,Math});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);return c;}
let count=0;function check(name,code){vm.runInContext(code,engine());console.log('PASS',name);count++;}
if(!html.includes('id="tb-me"')||!html.includes('id="p-me"')||html.includes('data-act="help"'))throw Error('Top bar: person button and You panel');
if(html.indexOf('id="btn-settings"')<html.indexOf('id="apop"'))throw Error('Settings should live inside the ? popup');
console.log('PASS the person button and the You panel sit in the top bar, settings inside ?');count++;
check('your day opens once the first tank feeds and changes itself, and the hours do things',`
var g=newGame();g.day=10;personalDay(g);if(g.me.on)throw Error('Too early');g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);if(!g.me.on||!milestoneConditions(g).me_intro)throw Error('Should open');
var h=dayHours(g);if(h.sleep!==8||h.work!==8||h.grandma!==1)throw Error('Default day '+JSON.stringify(h));
setHour(g,18,'grandma');setHour(g,19,'grandma');setHour(g,20,'grandma');setHour(g,21,'work');setHour(g,22,'work');g.fin=[{shrimp:400}];var m0=g.money;for(var d=0;d<30;d++){g.day++;personalDay(g);}
if(g.me.visits<4||g.money<=m0||g.me.n<3)throw Error('Hours turn into visits and overtime '+g.me.visits+' '+g.money);
if(setHour(g,3,'dinners'))throw Error('Dinners need a farm');g.emp.farms.rack=1;if(!setHour(g,3,'dinners'))throw Error('Dinners with a farm');
g.me.moved=1;if(actOk(g,'club')||!laneOpen(g,'y')||!meCan(g,'home','y')||meCan(g,'exercise','y'))throw Error('Moving away changes what you can do');var c0=g.me.calls;for(var d=0;d<14;d++){g.day++;personalDay(g);}if(!(g.me.calls>c0))throw Error('Grandma hours are calls after moving');
var inf0=g.emp.inf;g.emp.infOn=1;mePick(g,'conference','y');for(var d=0;d<400;d++){g.day++;personalDay(g);}if(!(g.me.cnt.conference>=1)||!(g.emp.inf>inf0))throw Error('Yearly runs once a year '+g.me.cnt.conference);
`);
check('long days burn you out, short nights and no exercise make you ill',`
var g=newGame();g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);for(var h=7;h<23;h++)setHour(g,h,'work');for(var d=0;d<80&&!g.me.burns;d++){g.day++;personalDay(g);}
if(!g.me.burns||!milestoneConditions(g).me_burnout)throw Error('Burnout '+g.me.bo);var v=g.me.vids,i0=g.emp.inf;g.emp.infOn=1;gainInf(g,10);if(g.emp.inf-i0!==5)throw Error('Half ✦ while burnt out');
var q=newGame();q.tanks[0].feeder=1;q.tanks[0].autoWC=1;personalDay(q);for(var h=0;h<24;h++)setHour(q,h,h<4?'sleep':'work');for(var h=15;h<24;h++)setHour(q,h,'nothing');q.money=1e6;var r=Math.random,sd=5;Math.random=function(){sd=(sd*16807)%2147483647;return sd/2147483647;};
for(var d=0;d<2500&&!q.me.ills;d++){q.day++;personalDay(q);}Math.random=r;if(!q.me.warned||!q.me.ills||sick(q)!==2||q.money>6e5||workMult(q)!==0.5)throw Error('Ill after years of four-hour nights '+q.me.hp+' '+q.money);
var w=newGame();w.tanks[0].feeder=1;w.tanks[0].autoWC=1;personalDay(w);setHour(w,19,'exercise');for(var d=0;d<900;d++){w.day++;personalDay(w);}if(w.me.ills||w.me.hp<70)throw Error('A normal day stays well '+w.me.hp);
var z=newGame();z.tanks[0].feeder=1;z.tanks[0].autoWC=1;personalDay(z);z.emp.infOn=1;for(var h=17;h<23;h++)setHour(z,h,'design');for(var d=0;d<200;d++){z.day++;personalDay(z);}if((z.me.dz||0)<2||!rip(z).log.some(function(x){return /Tank of the Year/.test(x.tx||'');}))throw Error('Design hours win prizes '+z.me.dz);
`);
check('Grandma moments wait for you, pass if nobody looks, and count both ways',`
var g=newGame();g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);g.ps.t=1;
for(var d=0;d<60&&!g.me.cur;d++){g.day++;g.ps.t+=4000;personalDay(g);}if(!g.me.cur||g.me.cur.id!=='clinic')throw Error('Clinic moment '+JSON.stringify(g.me.cur));
var c=g.tr.care||0;if(!momentAnswer(g,true)||g.me.done.clinic!==1||(g.tr.care||0)>=c||!g.me.hist.length)throw Error('Accept');
g.me.mNext=0;g.me.mT=0;g.me.n=10;g.day+=1;personalDay(g);if(!g.me.cur)throw Error('Next moment');var id=g.me.cur.id;g.ps.t+=200000;g.day+=20;personalDay(g);if(g.me.cur&&g.me.cur.id===id||g.me.done[id]!==3||g.me.missed!==1)throw Error('Missed');
`);
check('keeping your own tank makes treats hand-given, happy treats count',`
var g=newGame();var T=g.tanks[0];T.had=1;T.pop=[{age:60,n:30,g:40,b:1}];g.money=5000;g.treatsOwned={spinach:1};T.set.treats={spinach:true};
dayRollover(g);if(!treatOn(T,'spinach'))throw Error('Weekly treat before');T.treats.spinach=0;g.emp.farms.hatch=1;if(!milestoneConditions(g).owntank)throw Error('Card');
storyChoose(g,'owntank',0);if(!ownTank(g)||tankGone(g))throw Error('Kept');dayRollover(g);if(treatOn(T,'spinach'))throw Error('No auto renew once it is yours');
if(!giveTreat(g,0,'spinach')||!giveHappy(g,'pea')||giveHappy(g,'pea')||g.me.happy!==1)throw Error('By hand');
var h=newGame();h.emp.farms.hatch=1;storyChoose(h,'owntank',0);if(tankGone(h)||!ownTank(h)||storyChoices(h,'owntank').length!==1)throw Error('No choice, the tank is always there');h.ps.look+=15;if(ownLevel(h)!==2||gpLines(h).join().indexOf('never stopped')<0)throw Error('Tended ending');
`);
check('packers, salespeople, managers and Mimi each get a goodbye card',`
var g=newGame();var E=g.emp;E.staff.pack=10;E.staff.lines=1;g.money=1e6;if(!milestoneConditions(g).bye_pack)throw Error('Kiki');
var o=byeOpts(g,'pack');if(o.length!==4||o[1][3]!==10*180*35)throw Error('Six months '+o[1][3]);var m=g.money;if(!storyChoose(g,'bye_pack',1)||E.staff.pack!==0||m-g.money!==63000)throw Error('Bonus');
if(byeReady(g,'pack'))throw Error('Once');
E.proj.aiconsult=1;E.proj.drones=1;E.staff.sales=4;E.regions=['auh','dxb'];g.money=1e7;goAI(g,'sales');if(!byeReady(g,'sales')||E.bye.sales!==4)throw Error('Luca');
var so=byeOpts(g,'sales');if(!so.some(function(x){return x[2]==='mgr';}))throw Error('Regional manager with two regions');
var c0=staffCost(g);storyChoose(g,'bye_sales',so.findIndex(function(x){return x[2]==='mgr';}));if(staffCost(g)-c0!==195)throw Error('Luca salary');
E.proj.social=1;if(!byeReady(g,'social'))throw Error('Mimi');var lo=byeOpts(g,'social');storyChoose(g,'bye_social',3);if(!E.later.some(function(x){return /Mimi/.test(x.t);}))throw Error('Later news');
if(gpLines(g).join(' ').indexOf('Luca')<0)throw Error('Ending line');
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
storyChoose(g,'broke',0);if(g.money!==500||!g.emp.gpLoan||!g.me.gp.noSea||milestoneConditions(g).broke)throw Error('Grandma');
if(brokeOpts(Object.assign(g,{money:-10})).some(function(x){return x[2]==='gp';}))throw Error('Grandma only once');
g.money=5000;if(!payGrandma(g)||g.me.gp.noSea)throw Error('Pay back');
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
Math.random=function(){return 0.9;};var g=newGame();var T=g.tanks[0];T.had=1;T.pop=[{age:90,n:60,g:40,b:0}];T.feeder=1;T.autoWC=1;personalDay(g);g.emp.fight=1;for(var hh=17;hh<23;hh++)setHour(g,hh,'fight');g.fin=[{shrimp:100}];
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
check('a house that runs itself, piece by piece, for you or for Grandma',`
var g=newGame();g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);g.money=1e6;if(!houseOffer(g))throw Error('Offer');buyHouse(g);if(!g.me.house.land)throw Error('Land');
if(buyHouse(g))throw Error('Walls need a who');if(!buyHouse(g,'gp'))throw Error('Walls');for(var hh=17;hh<23;hh++)setHour(g,hh,'house');g.me.next=g.day;personalDay(g);if(!g.me.house.hp)throw Error('Working on it');
while(houseNext(g))buyHouse(g);if(!g.me.house.complete||treesFor(g).indexOf('rewild')<0||gpLines(g).join().indexOf('Grandma lives')<0)throw Error('Complete');
`);
check('hard places and late cards ask once and leave a line',`
var g=newGame();g.humans=2e9;var c=milestoneConditions(g);if(!c.c_war||!c.c_cash||c.c_water||c.c_gary!==undefined)throw Error('Thresholds');g.money=1e12;var before=g.money;
g.emp.inf=1e5;if(!storyChoose(g,'c_war',2)||g.emp.inf!==5e4)throw Error('Free kits to both armies cost ✦');if(card3Lines(g).join().indexOf('both banks kept your shrimp')<0)throw Error('Line');
var bail=newGame();bail.humans=1e9;var b0=bail.tr.means||0;storyChoose(bail,'c_cash',0);if((bail.tr.drive||0)!==1||(bail.tr.means||0)!==b0-.5)throw Error('Hatchery acquisition keeps the former drive/means scores');
var decline=newGame();decline.humans=1e9;storyChoose(decline,'c_cash',1);if((decline.tr.means||0)!==.5)throw Error('Restructuring keeps the former fairness score');
g.humans=3e9;g.money=0;if(storyChoose(g,'c_water',0))throw Error('Needs the money');if(!storyChoose(g,'c_water',4))throw Error('Free answer');
var old=newGame();old.day=3000;old.humans=7e9;delete old.progress.v5;migrateProgress(old);detectMilestones(old);if(old.progress.queue.some(function(k){return /^c_/.test(k);}))throw Error('Old saves skip passed cards');
`);
check('the world moves on in headlines, food and big builds keep paying after Earth',`
var g=newGame();g.emp.kitsOpened=1;g.humans=6e8;headlineDay(g);var R=rip(g);if(R.log.length!==5)throw Error('Gary, mayor, divorce and two about the founder '+R.log.length);headlineDay(g);if(rip(g).log.length!==5)throw Error('Once each');
var f0=foodIncome(g);g.emp.proj.foodfactory=1;if(Math.abs(foodIncome(g)/f0-4)>1e-9)throw Error('Factory');g.emp.proj.foodopen=1;if(foodIncome(g)>=f0*4)throw Error('Recipe means less food sold');
g.humans=8.2e9;g.emp.won=5000;g.space.started=true;g.emp.c3={c_water:0};var m=g.money;dayRollover(g);if(g.money-m<2e7)throw Error('After Earth it still earns '+(g.money-m));
if(sideIncome(g)<3e6||!rip(g).log.some(function(x){return /desalination/.test(x.tx);}))throw Error('Water sales');
`);
check('story cards wait their turn, about two minutes of play apart',`
var g=newGame();g.ps.t=1000;g.stats.sold=40;g.emp.kitsOpened=0;var p=ensureProgress(g);p.queue=[];p.seen.intro=true;g.tanks[0].cycledAt=null;
p.seen.cycle=p.seen.hatch=p.seen.sale=p.seen.ev_paper=true;
detectMilestones(g);var first=p.queue.slice();if(first.indexOf('ev_mira')<0||first.indexOf('dye_offer')>=0||p.wait.indexOf('dye_offer')<0)throw Error('Second card waits '+JSON.stringify(first)+JSON.stringify(p.wait));
p.queue=[];g.ps.t+=20000;detectMilestones(g);if(p.queue.length)throw Error('Too soon');g.ps.t+=101000;detectMilestones(g);if(p.queue[0]!=='dye_offer')throw Error('Within two minutes');
p.queue=[];g.money=-500;g.day=50;detectMilestones(g);if(p.queue[0]!=='broke')throw Error('Money trouble never waits');
`);
check('Shrimp Times stories come one at a time, and a choice\'s story comes next',`
var g=newGame();g.ps.t=5000;var R=rip(g),p=ensureProgress(g);p.queue=[];newsLine(g,'one');newsLine(g,'two');newsLine(g,'three');if(R.log.length)throw Error('Queued, not printed');
g.ps.t+=1000;newsTick(g);if(R.log.length!==1||R.log[0].tx!=='one')throw Error('First goes out');newsTick(g);if(R.log.length!==1)throw Error('Then waits');
g.emp.kitsOpened=1;g.money=1e6;g.day=500;storyChoose(g,'wash_offer',0);g.emp.dirty.noticed=0;g.emp.dirty.day=0;g.day=100;washDay(g);g._dec=1;newsLine(g,'because of you');g._dec=0;
if(R.pend[0].tx!=='because of you')throw Error('Your story jumps the line');g.ps.t+=25000;newsTick(g);if(R.log[R.log.length-1].tx!=='because of you')throw Error('Soon after the choice');
g.ps.t+=121000;newsTick(g);if(R.log.length!==3)throw Error('Then the rest, spaced');
var b=newGame();newsLine(b,'bots');if(rip(b).log.length!==1)throw Error('No play clock, straight to print');
`);
check('academia or industry, letters to Grandma, and choices that make the news',`
var g=newGame();g.kits.sold=1000;g.academy.level=1;g.money=1e7;if(!forkOpts('science').every(function(p){return p.req(g);}))throw Error('Science question after the first postdoc');
var m=g.emp.mat;buyProj(g,'sciind');if(g.emp.mat!==m*0.95||treesFor(g).indexOf('lab')<0||forkOpts('science').some(function(p){return p.id==='sciacad'&&g.emp.proj[p.id];}))throw Error('Industry');
var h=newGame();h.kits.sold=1000;h.academy.level=1;h.money=1e7;buyProj(h,'sciacad');if(!h.emp.acad||(h.tr.know||0)<2)throw Error('Academia');
var q=newGame();q.tanks[0].feeder=1;q.tanks[0].autoWC=1;personalDay(q);for(var hh=17;hh<23;hh++)setHour(q,hh,'grandma');for(var d=0;d<30;d++){q.day++;personalDay(q);}if(q.me.letters<3||!q.me.hist.some(function(x){return /fishing boat/.test(x);}))throw Error('His story in letters');
var w=newGame();w.humans=2e9;w.emp.inf=1e5;w.money=1e7;storyChoose(w,'c_war',3);if(!rip(w).log.some(function(x){return /families who fled/.test(x.tx);}))throw Error('The relief choice makes the news');
var o=newGame();o.emp.farms.hatch=1;storyChoose(o,'owntank',0);if(gpLines(o).join().indexOf('never looked')<0)throw Error('Kept and never looked');o.ps.look+=5;if(gpLines(o).join().indexOf('never looked')>=0)throw Error('Looked after');
`);
check('Mira shows up at more moments, and each one follows something you did',`
var g=newGame();g.day=1200;var c=milestoneConditions(g);if(c.mira_teen||c.mira_house||c.mira_net||c.mira_grown||c.mira_space||c.mira_bye)throw Error('Not before you met her');
g.story.choices={ev_mira:1};c=milestoneConditions(g);if(!c.mira_teen||c.mira_house||c.mira_net||c.mira_grown||c.mira_space||c.mira_bye)throw Error('Only the age one at first');
if(MILESTONES.mira_teen.more(g).indexOf('Sunday')<0)throw Error('Her answer shows');g.story.choices.ev_mira=0;if(MILESTONES.mira_teen.more(g).indexOf('jar')<0)throw Error('The jar');
g.me={on:1,house:{complete:5},cnt:{},gp:{}};g.emp.network=1;g.humans=2e8;g.space.started=true;g.story.choices.bye_pack=0;c=milestoneConditions(g);if(c.mira_grown)throw Error('Mira is not eighteen yet');g.day=3700;c=milestoneConditions(g);
['mira_house','mira_net','mira_grown','mira_space','mira_bye'].forEach(function(k){if(!c[k]||!MILESTONES[k]||!MILESTONES[k].body)throw Error(k);});
var n=Object.keys(MILESTONES).filter(function(k){return /^mira_/.test(k);}).length;if(n<10)throw Error('Mira moments '+n);
`);
check('paths without Space get a last chapter before the ending',`
var g=newGame();g.tr={drive:6,ego:4,means:-2};g.emp.won=2000;g.humans=WORLD;g.emp.trees={island:1};g.emp.tree={isl_buy:1,isl_nation:1};g.progress.seen={};g.progress.queue=['win'];
if(spaceOpen(g)||lastChapter(g)!=='island')throw Error('Island chapter '+lastChapter(g));detectMilestones(g);
if(g.progress.queue[0]!=='lastchap'||g.progress.queue.indexOf('win')<1)throw Error('Order '+g.progress.queue);var t=MILESTONES.lastchap.more(g);
if(t.indexOf('Shrimp Island')<0||t.indexOf('calls itself a country')<0||t.indexOf('jetty')<0)throw Error('Text '+t);
var q=newGame();q.emp.won=2000;q.emp.trees={space:1};q.tr={know:6,ego:-2,care:2};if(!spaceOpen(q)||lastChapter(q))throw Error('Space players keep their own last chapter');
var r=newGame();r.tr={drive:-6,ego:-4,care:-2};r.emp.won=2000;r.emp.trees={shop:1};r.progress.seen={};r.progress.queue=['win'];detectMilestones(r);if(r.progress.queue[0]!=='lastchap'||MILESTONES.lastchap.more(r).indexOf('cat')<0)throw Error('Shop chapter');
var o=newGame();o.tr={drive:-6,ego:-4};o.emp.won=1;o.progress={seen:{},queue:[],wait:[]};o.emp.trees={shop:1};detectMilestones(o);
`);
check('the player name shows up where it should and nowhere unsafe',`
var g=newGame();g.name='  Puti<b>  ';if(nm(g)!=='Putib')throw Error('Clean '+nm(g));
if(N(g,'Hi{,name}.')!=='Hi, Putib.'||N(newGame(),'Hi{,name}.')!=='Hi.'||N(newGame(),'{name|the founder} left')!=='the founder left')throw Error('Tokens');
if(grandmaLetter(g,'gift').indexOf('little things, Putib,')<0)throw Error('Letter has the name');if(grandmaLetter(newGame(),'gift').indexOf('little things,”')<0)throw Error('No name, no gap');
g.humans=3e7;g.emp.kitsOpened=1;headlineDay(g);if(!rip(g).log.some(function(x){return /Putib/.test(x.tx||'');}))throw Error('News names you');
`);
if(!html.includes("(nm(G)?'Dear '+nm(G)+',<br><br>':'')")||!html.includes('id="player-name"')||!html.includes("G.name=nm({name:pni.value})"))throw Error('Ending letter and name box');
count++;
check('play-test fixes: broke text early, bulk order by hand, moss per kit, SOP opens standard tanks, the farm takes the tanks',`
var g=newGame();g.money=-50;g.day=100;var o=brokeOpts(g).map(function(x){return x[0]+' '+x[1];}).join('|');if(/farm/.test(o))throw Error('No farm talk before a farm '+o);
g.korder={n:20,price:300,who:'A school',due:200,offerEnd:110,taken:true,filled:0,i:0};g.kits.stock=8;if(putKitOrder(g)!==8||g.korder.filled!==8||g.kits.stock!==0)throw Error('Put from stock');
if(wbItem('moss').m!==0||wbItem('planted').m!==0)throw Error('Kit designs cost per kit, not up front');
var h=newGame();h.emp.kitsOpened=1;h.kits.sold=10;h.tanks.push(newTank(1),newTank(2));if(stdUnlocked(h))throw Error('Not yet');h.emp.proj.sop=1;if(!stdUnlocked(h))throw Error('SOP opens standard tanks');h.money=1e6;buyStdTank(h);var T=h.tanks[3];if(!T.moss||!T.plants||!T.feeder||!T.autoWC)throw Error('Fully equipped');
T.pop=[{age:90,n:40,g:50}];var raw=h.emp.rawShrimp||0;h.emp.farms.hatch=1;storyChoose(h,'owntank',0);if(h.tanks.length!==1||!((h.emp.rawShrimp||0)>raw+30))throw Error('Farm takes the other tanks '+h.tanks.length);
var q=newGame();q.emp.frozen=40;q.emp.frozenWhy='audit';q.day=10;if(frozenText(q).indexOf('audit')<0||frozenText(q).indexOf('30 days')<0)throw Error('Frozen says why '+frozenText(q));
`);
check('fixed story prices grow with the company',`
var g=newGame();g.money=1e8;if(aiCost(g)!==2e7||rivalCost(g)!==1e6)throw Error('Scaled '+aiCost(g));if(storyChoices(g,'ev_ai')[0][0].indexOf('20M')<0&&storyChoices(g,'ev_ai')[0][0].indexOf('20,000,000')<0)throw Error('Label shows it '+storyChoices(g,'ev_ai')[0][0]);
storyChoose(g,'ev_ai',0);if(g.money!==8e7||g.emp.aiCut!==0.02)throw Error('Paid share');var h=newGame();h.money=1000;if(aiCost(h)!==50000||storyChoose(h,'ev_ai',0))throw Error('Small company still pays the base price');
`);
check('research lines: many people in many fields at once, finds are luck',`
var g=newGame();g.kits.sold=500;g.money=1e8;['energy','water','auto'].forEach(function(id){rlHire(g,id,'phd');rlHire(g,id,'pi');});if(rlines(g).water.pi!==1||rlines(g).energy.phd!==1)throw Error('Hired in parallel');
var y=rlYearAll(g);if(Math.abs(y-3*(40000+1500000)*USD)>1)throw Error('Yearly cost '+y);var m0=g.money;rlDay(g);if(Math.abs(m0-g.money-y/365)>1)throw Error('Paid daily');
var f0=distributionCost(g);g.emp.farms.hatch=2;var u0=farmOverhead(g);var r=Math.random,sd=11;Math.random=function(){sd=(sd*16807)%2147483647;return sd/2147483647;};for(var d=0;d<4*365;d++)rlDay(g);Math.random=r;
if(!(rlFound(g,'water')>=1&&rlFound(g,'energy')>=1))throw Error('Something found in four years '+rlFound(g,'water'));if(!(distributionCost(g)<f0)||!(farmOverhead(g)<u0))throw Error('Finds help');
var h=newGame();h.kits.sold=500;h.money=10;if(rlHire(h,'genes','pi'))throw Error('Needs cash');for(var i=0;i<20;i++){h.money=1e9;rlHire(h,'genes','phd');}if(rlines(h).genes.phd!==12)throw Error('Cap per field');
`);
check('the game keeps a history for the ending charts',`
var g=newGame();g.money=1000;for(var d=0;d<60;d++){g.day++;dayRollover(g);}var C=g.chart;if(!C||C.s.length<6||!(Object.keys(C.sp).length>=0))throw Error('History '+(C&&C.s.length));
g.kits.sold=1;g.day++;dayRollover(g);if(g.chart.ev.kit==null)throw Error('First kit marked');for(var i=0;i<2000;i++){g.day+=7;chartDay(g,{});}if(g.chart.s.length>330)throw Error('History stays small '+g.chart.s.length);
`);
check('hours are set with plus and minus, Rest takes the rest',`
var g=newGame();g.tanks[0].feeder=1;g.tanks[0].autoWC=1;personalDay(g);var h0=dayHours(g);if(!addHour(g,'exercise',1))throw Error('Add');var h=dayHours(g);if(h.exercise!==1||h.nothing!==h0.nothing-1||h.sleep!==h0.sleep)throw Error('Plus '+JSON.stringify(h));
if(addHour(g,'nothing',1))throw Error('Rest is not set by hand');while(addHour(g,'work',1));if(dayHours(g).nothing!==0||addHour(g,'videos',1))throw Error('No hours left');if(!addHour(g,'work',-1)||dayHours(g).nothing!==1)throw Error('Minus');var n=0;g.me.day.forEach(function(x){n++;});if(n!==24)throw Error('24 hours');
`);
check('postdocs cost USD 50k, extra pay is not faster, papers come out steadily',`
var g=newGame();g.money=1e9;g.kits.sold=5000;g.academy.level=1;var o=null;academyOpen=function(){return true;};if(!rlHire(g,'genes','pd')||!rlHire(g,'genes','phd'))throw Error('Hire');if(Math.round(rlYear(g,'genes')/USD)!==90000)throw Error('Cost '+rlYear(g,'genes')/USD);
var o1=rlOdds(g,'genes');setPdPay(g,2);if(Math.round(rlYear(g,'genes')/USD)!==115000)throw Error('Extra pay '+rlYear(g,'genes')/USD);if(rlOdds(g,'genes')!==o1)throw Error('Odds must not change');
var r=Math.random;Math.random=function(){return 0.99;};for(var d=0;d<365*5;d++)rlDay(g);Math.random=r;var p=g.academy.rl.genes.papers;if(p<7||p>9)throw Error('Papers in 5 years '+p);
`);
console.log(count+' free time, Grandma and ending checks passed');
