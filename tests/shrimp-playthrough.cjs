const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(process.env.SHRIMP_GAME_PATH||path.join(__dirname,'../shrimp/index.html'),'utf8');let seed=Number(process.env.REVIEW_SEED||7);const runSeed=seed;const math=Object.create(Math);math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const c=vm.createContext({console,Math:math});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext('var BOTKIND='+(process.env.BOT_HEART==='kind')+';var _ack=acknowledgeMilestone;acknowledgeMilestone=function(G){var k=G.progress.queue[0],m=k&&MILESTONES[k];if(m&&m.dyn){if(!(BOTKIND&&storyChoose(G,k,1)))storyChoose(G,k,0);}else if(k==="owntank")storyChoose(G,k,0);else if(k==="coin_offer")storyChoose(G,k,BOTKIND?0:1);return _ack(G);};',c);
vm.runInContext('var cache={},lastChips="",lastColSig="",lastChartKey="",lastAlerts="";function toast(){};function anyHad(){return G.tanks.some(t=>t.had||totalN(t)>=1);}'+html.split('function updateReveal(){')[1].split('function applyReveal(){')[0].replace(/^/, 'function updateReveal(){'),c);
vm.runInContext('var NOSTORES='+(process.env.NOSTORES==='1')+';',c);
vm.runInContext(`
var G=newGame(),events=[],snapshots={},last={};
function note(k){detectMilestones(G);updateReveal();if(kitsOpen(G))G.emp.shownEmp=1;if(!last[k]){last[k]=1;events.push({event:k,day:G.day,money:Math.round(G.money),shrimp:Math.round(allN(G)),sold:G.stats.sold,kits:G.kits.sold,owners:Math.round(G.humans),inf:Math.round(G.emp.inf)});snapshots[k]=JSON.parse(JSON.stringify(G));}}
function extraTanks(buy){if(!G.tanks[0].had)return;var T0=G.tanks[0];
 if(buy&&G.stats.sold>=1&&G.tanks.length<MAX_TANKS&&!(G.tanks.some(function(t){return !t.had;}))&&G.money>NEW_TANK_COST[G.tanks.length]+Math.max(300,capitalReserve(G)))addTank(G);
 for(var i=1;i<G.tanks.length;i++){var t=G.tanks[i],P=ppm(t);t.set.sellAge=T0.set.sellAge;t.set.keep=T0.set.keep;
  if(!t.had){if(t.cycledAt==null&&P.nh<.2&&P.no2<1){if(G.ob.doses<=0&&G.money>=40){pay(G,40,'supplies');G.ob.doses+=10;}addAmmonia(G,t);}if(t.chem.kh<2||P.no3>20)waterChange(G,t,50);
   if(safeToStock(G,t)&&totalN(T0)>=30)moveShrimp(G,T0,t,totalN(T0)/3);}
  else{if(!t.feeder)feed(G,t,.8);if(P.no3>18||t.chem.kh<2.5||t.chem.gh<5||(!t.autoWC&&G.day%7===0))waterChange(G,t,30);
   if(!t.feeder&&G.stats.born>0&&G.money>90+150+capitalReserve(G))buyUpgrade(G,t,'feeder');if(!t.fan&&G.money>60+150+capitalReserve(G))buyUpgrade(G,t,'fan');}}}
function afford(c){return G.money>c+Math.max(40,staffCost(G)*14);}
function policy(){
while(G.progress.queue.length)acknowledgeMilestone(G);updateReveal();var T=G.tanks[0],P=ppm(T),E=G.emp;if(qcDue(G))qcRound(G,{water:1,look:0.95,dip:1});var nq=nextQC(G);if(nq&&G.money>nq.cost*3+capitalReserve(G)+300)buyQC(G,nq.id);if(farmBuilt(G)&&qc(G).strict!==2)setQCStrict(G,2);G.tanks.forEach(function(t,i){if(t.fresh)dipFresh(G,i);if(t.ill&&t.ill.days>=1)treatIll(G,i,illById(t.ill.type).cure,0.9);});
if(!G.ob.kit&&G.money>=120){pay(G,120,'supplies');G.ob.kit=1;}
if(!G.ob.bottle&&G.money>=40){pay(G,40,'supplies');G.ob.bottle=1;G.ob.doses=10;}
if(!T.had){
 if(T.cycledAt==null&&P.nh<.2&&P.no2<1){if(G.ob.doses<=0&&G.money>=40){pay(G,40,'supplies');G.ob.doses+=10;}addAmmonia(G,T);}
 if(T.chem.kh<2||P.no3>20)waterChange(G,T,50);
 if(T.cycledAt!=null&&P.nh<.05&&P.no2<.05&&P.no3<=20&&T.chem.kh>=2){note('cycled');buyPack(G,T,3);buyPack(G,T,3);note('first shrimp');}
}else{
 if(!T.feeder)feed(G,T,.8);
 if(P.no3>18||T.chem.kh<2.5||T.chem.gh<5||(!T.autoWC&&G.day%7===0))waterChange(G,T,30);
 if(!T.fan&&roomT(G,G.day)>27&&afford(60))buyUpgrade(G,T,'fan');
 if(G.ob.up&&!T.feeder&&afford(90))buyUpgrade(G,T,'feeder');
 if(G.ob.up&&!T.autoWC&&afford(220))buyUpgrade(G,T,'autoWC');
 var stock=sellableStock(G);if(stock){G.price=suggestedPrice(G,stock);sellAll(G,false);}
 if(G.stats.born>0)note('first hatch');if(G.stats.sold>0)note('first sale');
 if(G.ob.up&&totalN(T)>T.vol*2&&upgradeCost(G,T,'tank')!=null&&afford(upgradeCost(G,T,'tank')))buyUpgrade(G,T,'tank');
 if(T.chem.temp>28&&!T.heater&&afford(60))buyUpgrade(G,T,'heater');
 if(T.chem.temp>28&&T.heater===1&&afford(1300))buyUpgrade(G,T,'heater');
 if(G.ob.up&&T.chem.bacA<bacTarget(T)&&upgradeCost(G,T,'filter')!=null&&afford(upgradeCost(G,T,'filter')))buyUpgrade(G,T,'filter');
}
extraTanks(true);checkGoals(G);if(G.story.anniversary)note('ten-year celebration');
if(kitsOpen(G)){
 note('kits unlocked');
 if(!E.staff.tier&&afford(300))buyPackTier(G);
 var adOn=function(id){return G.ads.some(function(x){return x.id===id;});};
 if(!G.webShop&&G.kits.sold>=10&&afford(1500))addAd(G,'web');
 if(G.kits.sold>=300&&!adOn('yt')&&afford(15000))addAd(G,'yt');else if(G.kits.sold>=30&&!adOn('shelf')&&!adOn('yt')&&afford(1800))addAd(G,'shelf');
 if(G.ob.eshops&&!shopCount(G)&&G.money>100000)buyShop(G,'stall');
 if(E.staff.tier===1&&G.kits.sold>=20&&afford(1800))buyPackTier(G);
 if(E.staff.tier&&G.kits.sold>=10&&packCap(G)<Math.min(farmCap(G),kitDemand(G))&&afford(2000)&&E.staff.pack<4)hire(G,'pack',1);
 for(var li=0;li<PACK_LINES.length;li++)if(lineReady(G,li)&&packCap(G)<kitDemand(G)*1.3&&afford(lineCost(G,li)+PACK_LINES[li].up*30))buyLine(G,li);
 if(packingMachineCap(G)>kitDemand(G)*1.2&&E.staff.pack)hire(G,'pack',-1);
 if(!packCap(G)&&G.money>180&&G.kits.stock<Math.max(5,kitDemand(G)*7)&&totalN(T)>T.set.keep+10)packKits(G,T,1);
 for(var id of ['guide','refer','precycle','farmlic','bulk','aicam','autopackm','app','brand','retention','partners','globalbrand','factory','hotline','ocean','recycle','arco']){var p=PROJ.find(x=>x.id===id);if(!pd(G,id)&&p.req(G)&&afford(pm(G,p)))buyProj(G,id);}
 if(G.kits.sold>=1)note('first kit');if(pd(G,'farmlic'))note('farm license');
 if(pd(G,'farmlic')){
  var fc=farmCap(G),d=kitDemand(G);var best=FARMS.filter(f=>farmOk(G,f)&&G.money>farmCost(G,f)+Math.max(2000,E.mat*Math.min(f.out,d*20)+f.up*60)).sort((a,b)=>farmCost(G,a)/a.out-farmCost(G,b)/b.out)[0];
  if(best&&(!fc||fc<d*1.5))buyFarm(G,best.id);
  if(fc)note('first farm');
 }
 for(var p of PROJ.filter(p=>p.c==='cult'))if(!pd(G,p.id)&&p.req(G)&&E.inf>=p.i)buyProj(G,p.id);
 // Choices: the fast player takes the cold answer (BOT_HEART=kind flips it).
 for(var fk in FORK_Q){if(forkDone(G,fk))continue;var opts=forkOpts(fk).filter(p=>p.req(G)).sort((a,b)=>(${process.env.BOT_HEART==='kind'}?b.h-a.h:a.h-b.h));var pk=opts[0];if(pk&&afford(pm(G,pk))&&E.inf>=pk.i)buyProj(G,pk.id);}
 if(pd(G,'ministry')&&E.op.offer&&!E.op.run&&E.inf>campCost(E.op.n)*4){var cms=E.op.offer.map(function(id){return MSGS.find(function(m){return m.id===id;});}).filter(function(m){return !BOTKIND||(m.h||0)>=0;}).sort(function(a,b){return b.e-a.e;});if(cms[0])runCampaign(G,cms[0].id);}
 if(pd(G,'studio')&&!(E.movie.left>0)&&E.movie.n<MOVIES.length){var ct=CUTS[E.movie.n]||[];var ci=ct.length>1?(BOTKIND?((ct[1][1].h||0)>=(ct[0][1].h||0)?1:0):(ct[1][1].b>ct[0][1].b?1:0)):0;if(afford(movieBudget(E.movie.n)))greenlight(G,ci);}
 if(academyOpen(G)&&G.academy.level){var RL=rlines(G);RLINES.forEach(function(l){if(RL[l.id].pd<1&&afford(posUsd(G,RPOS[1])*USD*3))rlHire(G,l.id,'pd');if(RL[l.id].phd<2&&afford(posUsd(G,RPOS[0])*USD*6))rlHire(G,l.id,'phd');});}
 if(coinOn(G)&&Math.floor(G.day)%90<30){var CC=coinOf(G);if(CC.price>coinBreakEven(G)*1.5&&afford(coinPlantCost(G)*30))coinPlant(G,coinPlantCost(G));if(CC.price>COIN_FAIR*1.3&&CC.treasury>0)coinSell(G,CC.treasury*0.25);else if(CC.price<COIN_FAIR*0.7&&afford(coinPlantCost(G)*3))coinBuy(G,coinPlantCost(G));}
 if(typeof storesOn==='function'&&storesOn(G)&&!NOSTORES&&Math.floor(G.day)%7===0){var sr=null,sw=0;REGIONS.forEach(function(r){if(!regOpen(G,r.id)||storeN(G,r.id)>=storeGoal(r.id))return;var w=r.pop*(1-regTrust(G,r.id));if(w>sw){sw=w;sr=r.id;}});if(sr){var sb=[1000,100,10,1].filter(function(b){return b<=storeBatchMax(G)&&storeCanBuy(G,sr,b)&&(operatingNet(G)||0)>storeBatchN(G,sr,b)*storeDay(G,sr)*10&&afford(storeBatchCost(G,sr,b)*6);});if(sb.length)buyStores(G,sr,sb[0]);}}
 if(G.ob.eshops&&Math.floor(G.day)%30===0){var nsh=SHOPS.filter(function(x){return shopOk(G,x);}).sort(function(a,b){return a.cost-b.cost;}).find(function(x){return afford(x.cost*100)&&(G.emp.shops[x.id]||0)<3;});if(nsh)buyShop(G,nsh.id);if(shopCount(G)&&!E.staff.mgr&&!E.staff.aiMgr&&afford(5000))hire(G,'mgr',1);}
 if(hardOpen(G)&&!E.won){if(BOTKIND&&hardOf(G).goal!=='want')hardSetGoal(G,'want');HARD.forEach(function(g){g.ops.slice().sort(function(a,b){return BOTKIND?0:(b.k==='dark')-(a.k==='dark');}).forEach(function(o){if((!o.f&&o.id!=='deliver')||(BOTKIND&&o.k==='dark'))return;if(g.id==='war'&&o.id!==(BOTKIND?'pay':'fund'))return;if(afford(hardCost(G,o)))hardBuy(G,g.id,o.id);});});}
 var r=nextRegion(G);if(G.ob.ereg&&r&&afford(r.m)&&G.humans>100)buyRegion(G);
 if(farmCap(G)&&E.inf<1000&&G.money>galaCost(G)*10)buyProj(G,'gala',BOTKIND?'kids':'own');
 G.kitPrice=farmCap(G)?${process.env.REVIEW_KIT_PRICE==='market'?'bestKitPrice(G)':Number(process.env.REVIEW_KIT_PRICE||600)}:250;
 if(G.humans>=100)note('100 owners');if(G.humans>=10000)note('10k owners');if(G.humans>=1e6)note('million owners');if(pd(G,'ministry'))note('ministry');if(pd(G,'last'))note('last holdouts');
 if(${process.env.REVIEW_ACADEMY==='1'?'true':'false'}&&academyOpen(G)){
  var A=G.academy;if(G.money>10000000+capitalReserve(G)&&A.funded<30)fundAcademy(G);
  if(A.level){note('first research grant');if(A.level===1&&uniqueStudies(G)&&G.money>10000000+capitalReserve(G))academyUpgrade(G,'lab');
   if(!A.active){var study=STUDIES.find(x=>x.id!=='observe'&&x.req(G)&&!rd(G,x.id));startStudy(G,study?study.id:'observe');}
   if(A.phds&&!A.postdocs&&G.money>10000000+capitalReserve(G))academyUpgrade(G,'postdoc');
   if(A.postdocs&&A.level<3&&G.money>10000000+capitalReserve(G))academyUpgrade(G,'group');
   if(A.professors)for(var course of COURSES)openCourse(G,course.id);
   if(A.phds)note('PhD graduates');if(A.professors)note('first professor');if(uniqueStudies(G)>=6)note('Earth research complete');
  }
 }
 if(E.won)note('win');
}
}
for(var day=0;day<12000;day++){policy();for(var q=0;q<4;q++){if(progressionBlocked(G)){while(G.progress.queue.length)acknowledgeMilestone(G);if(G.emp.won)break;}stepGame(G);}if(G.emp.won)break;if(G.money<0){console.log('INSOLVENT',JSON.stringify({day:G.day,money:G.money,fc:farmCap(G),pc:packCap(G),d:kitDemand(G),stock:G.kits.stock,raw:G.emp.rawShrimp,overhead:fixedOverhead(G),reserve:operatingReserve(G),farms:G.emp.farms,lines:G.emp.packLines,log:G.log.slice(-15),fin:G.fin.slice(-3)}));break;}if(day%1000===0)console.log('progress',G.day,Math.round(G.money),G.kits.sold,Math.round(G.humans));}
if(G.emp.won)note('win');
`,c,{timeout:180000});
fs.mkdirSync(process.env.REVIEW_OUTPUT||require('os').tmpdir()+'/shrimp-tests',{recursive:true});fs.writeFileSync(path.join(process.env.REVIEW_OUTPUT||require('os').tmpdir()+'/shrimp-tests',`run-${runSeed}.json`),JSON.stringify({heart:c.G.emp.heart,ending:c.endingPick(c.G),traits:c.traitVals(c.G),events:c.events,day:c.G.day,won:c.G.emp.won,money:c.G.money,owners:c.G.humans,dream:c.G.story,snapshots:c.snapshots}));console.log(JSON.stringify(c.events,null,2));if(!c.G.emp.won)throw Error('Playthrough failed to finish');console.log('WIN',runSeed,c.G.day,c.G.money,'TEN_YEAR',c.G.story.tenYearAchieved,'ENDING',c.endingPick(c.G));if(process.env.REQUIRE_TEN_YEAR==='1'&&!c.G.story.tenYearAchieved)throw Error('Ten-year dream missed');

if(process.env.REQUIRE_AFTER_TEN_YEAR==='1'&&!(c.G.day>c.DREAM_DAYS&&c.G.story.anniversary&&!c.G.story.tenYearAchieved))throw Error('Expected a continued run after the ten-year celebration');
