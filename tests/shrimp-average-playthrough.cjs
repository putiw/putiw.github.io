// A reproducible average-player scenario, not a claim about real human timings.
// Default kit price; inexpensive starting shrimp; weekly early decisions and monthly business reviews, at most two
// investments per visit; visible project choices; no perfect farm/cost optimizer.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
let seed=Number(process.env.REVIEW_SEED||7);const initialSeed=seed,M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const c=vm.createContext({Math:M,console});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext('var BOTKIND='+(process.env.BOT_HEART!=='cold')+';var _ack=acknowledgeMilestone;acknowledgeMilestone=function(G){var k=G.progress.queue[0],m=k&&MILESTONES[k];if(m&&m.dyn){if(!(BOTKIND&&storyChoose(G,k,1)))storyChoose(G,k,0);}else if(k==="owntank")storyChoose(G,k,0);return _ack(G);};',c);
vm.runInContext('var cache={},lastChips="",lastColSig="",lastChartKey="",lastAlerts="";function toast(){};function big(n){return String(Math.round(n));};function anyHad(){return G.tanks.some(t=>t.had||totalN(t)>=1);}function updateReveal(){'+html.split('function updateReveal(){')[1].split('function applyReveal(){')[0],c);
vm.runInContext(html.slice(html.indexOf('var PROJ_SHOW='),html.indexOf('var seenNew='))+html.slice(html.indexOf('function projectRank('),html.indexOf('MILESTONES.spaceDream=')),c);
vm.runInContext(`
var G=newGame(),events=[],snapshots={},actions=[],seen={},minCash=G.money,waitingSeconds=0,visits=0;
function note(name){if(seen[name])return;seen[name]=1;events.push({event:name,day:G.day,years:+(G.day/365).toFixed(2),money:Math.round(G.money),owners:Math.round(G.humans)});snapshots[name]=JSON.parse(JSON.stringify(G));}
function act(name,fn){var ok=fn();if(ok){actions.push({day:G.day,name:name});return true;}return false;}
function canSpend(cost){return G.money>=cost+Math.max(200,capitalReserve(G)*1.25);}
function extraTanks(buy){if(!G.tanks[0].had)return;var T0=G.tanks[0];
 if(buy&&G.stats.sold>=1&&G.tanks.length<MAX_TANKS&&!(G.tanks.some(function(t){return !t.had;}))&&G.money>NEW_TANK_COST[G.tanks.length]+Math.max(300,capitalReserve(G)))addTank(G);
 for(var i=1;i<G.tanks.length;i++){var t=G.tanks[i],P=ppm(t);t.set.sellAge=T0.set.sellAge;t.set.keep=T0.set.keep;
  if(!t.had){if(t.cycledAt==null&&P.nh<.2&&P.no2<1){if(G.ob.doses<=0&&G.money>=40){pay(G,40,'supplies');G.ob.doses+=10;}addAmmonia(G,t);}if(t.chem.kh<2||P.no3>20)waterChange(G,t,50);
   if(safeToStock(G,t)&&totalN(T0)>=30)moveShrimp(G,T0,t,totalN(T0)/3);}
  else{if(!t.feeder)feed(G,t,.8);if(P.no3>18||t.chem.kh<2.5||t.chem.gh<5||(!t.autoWC&&G.day%7===0))waterChange(G,t,30);
   if(!t.feeder&&G.stats.born>0&&G.money>90+150+capitalReserve(G))buyUpgrade(G,t,'feeder');if(!t.fan&&G.money>60+150+capitalReserve(G))buyUpgrade(G,t,'fan');}}}
function care(){extraTanks(false);var T=G.tanks[0],P=ppm(T);if(kitsOpen(G)&&G.kits.sold>=3&&(qc(G).last==null||G.day-qc(G).last>=40))qcRound(G,{water:0.8,look:0.7,dip:G.day%3?1:0.4});var nq=nextQC(G);if(nq&&G.money>nq.cost*6+capitalReserve(G)+500)buyQC(G,nq.id);G.tanks.forEach(function(t,i){if(t.fresh&&G.day%2===0)dipFresh(G,i,{ok:G.day%3>0,loss:0.03});if(t.ill&&t.ill.days>=6)treatIll(G,i,illById(t.ill.type).cure,0.75,{ok:G.day%4>0,loss:0.05});});while(G.progress.queue.length){var key=G.progress.queue[0];note('milestone '+key);acknowledgeMilestone(G);}updateReveal();
 if(!G.ob.kit){pay(G,120,'supplies');G.ob.kit=1;}
 if(!G.ob.bottle){pay(G,40,'supplies');G.ob.bottle=1;G.ob.doses=10;}
 if(!T.had){if(T.cycledAt==null&&P.nh<.1){if(G.ob.doses<=0&&G.money>=40){pay(G,40,'supplies');G.ob.doses+=10;}addAmmonia(G,T);}if(T.chem.kh<2||P.no3>20)waterChange(G,T,50);if(safeToStock(G,T)&&buyPack(G,T,0))note('first shrimp');}
 else if(!earthArchived(G)){if(!T.feeder)feed(G,T,.8);if(P.nh>.1||P.no2>.1||P.no3>25||T.chem.kh<2||T.chem.gh<5||!T.autoWC&&G.day%7===0)waterChange(G,T,30);}
 checkGoals(G);if(G.stats.born)note('first hatch');if(kitsOpen(G))note('kits unlocked');if(G.kits.sold)note('first kit');if(farmCap(G))note('first farm');if(G.academy.level)note('first grant');if(G.academy.phds)note('PhDs');if(G.academy.professors)note('professor');if(G.story.anniversary)note('anniversary');if(G.emp.won)note('Earth complete');if(G.space.won)note('space complete');if(rip(G).n===RIPPLE.length)note('all newspaper headlines');
}
function visit(){visits++;var T=G.tanks[0],E=G.emp,A=G.academy,S=G.space,budget=2;function spend(name,fn){if(budget<1)return false;if(act(name,fn)){budget--;return true;}return false;}
 if(G.stats.sold>=1&&G.tanks.length<MAX_TANKS&&!G.tanks.some(t=>!t.had)&&G.money>NEW_TANK_COST[G.tanks.length]+250)spend('another tank',()=>addTank(G));
 if(G.order){if(!G.order.taken)takeOrder(G);if(orderStock(G,G.order)>=G.order.n)act('deliver pet shop order',()=>deliverOrder(G));}
 if(T.had&&!earthArchived(G)){var stock=sellableStock(G);if(stock&&!(G.order&&G.order.taken)){G.price=suggestedPrice(G,stock);act('sell surplus shrimp',()=>sellAll(G,false));}}
 if(G.ob.up&&!earthArchived(G))for(var id of ['fan','feeder','autoWC','heater','tank','filter']){var cost=upgradeCost(G,T,id);if(cost==null)continue;if(id==='heater'&&T.chem.temp<28)continue;if(id==='tank'&&totalN(T)<T.vol*2)continue;if(id==='filter'&&T.chem.bacA>=bacTarget(T))continue;if(canSpend(cost))spend('tank '+id,()=>buyUpgrade(G,T,id));}
 if(kitsOpen(G)&&!E.won){
  if(kitStage(G)===0){kitStep(G,'mat');kitStep(G,'catch');if(kitStep(G,'pack'))note('first hand-packed kit');}
  else if(!packCap(G)&&G.kits.stock<3&&G.money>kitMaterials(G)+100)manualPack(G,G.kits.sold<10?1:Math.min(10,Math.floor(spareKitShrimp(G)/8)));
  if(G.kits.sold>=3&&!E.staff.tier&&canSpend(300))spend('packing bench',()=>buyPackTier(G));
  if(G.kits.sold>=5&&!consultHas(G)&&G.money>consultCost(G)*4&&!(G._consulted>=2))spend('consultants',()=>{var ok=buyConsult(G,'visit');if(ok)G._consulted=(G._consulted||0)+1;return ok;});
  var bn=bottleneck(G);
  if(E.staff.tier===1&&G.kits.sold>=20&&canSpend(1800))spend('packing sealer',()=>buyPackTier(G));
  if(G.kits.sold>=10&&E.staff.tier&&bn.k==='packing'&&E.staff.pack<4&&canSpend(5000))spend('hire packer',()=>hire(G,'pack',1));
  for(var li=0;li<PACK_LINES.length;li++)if(lineReady(G,li)&&packCap(G)<kitDemand(G)*1.1&&canSpend(lineCost(G,li)+PACK_LINES[li].up*30))spend('packing '+PACK_LINES[li].id,()=>buyLine(G,li));
  if(packingMachineCap(G)>kitDemand(G)&&E.staff.pack)hire(G,'pack',-1);
  if(pd(G,'farmlic')&&(!farmCap(G)||bn.k==='shrimp')){var list=FARMS.filter(f=>farmOk(G,f));var next=list.find(f=>!(E.farms[f.id]>0));var existing=list.filter(f=>E.farms[f.id]>0).slice(-1)[0];var pick=next&&canSpend(farmCost(G,next))?next:existing||list[0];if(pick&&canSpend(farmCost(G,pick)))spend('farm '+pick.id,()=>buyFarm(G,pick.id));}
  // New regions first: a player expands before spending ✦ on extras.
  if(academyOpen(G)&&!A.level&&canSpend(200000))spend('pilot grant',()=>fundAcademy(G));
  var region=nextRegion(G);if(G.ob.ereg&&region&&canSpend(regionCost(G,region)))spend('region '+region.id,()=>buyRegion(G));
  if(G.ob.eproj){for(var area of ['emp','up','promote','world'])for(var p of (area==='world'?[].concat.apply([],TRACKS.map(t=>trackProj(G,t[0]))):shownProj(G,area,'biz'))){if(canSpend(pm(G,p))&&E.inf>=p.i)spend('project '+p.id,()=>buyProj(G,p.id));}
   // Choices: this player takes the kind answer when they can afford it (BOT_HEART=cold flips it).
   for(var fk in FORK_Q){if(forkDone(G,fk))continue;var opts=forkOpts(fk).filter(p=>p.req(G)).sort((a,b)=>(${process.env.BOT_HEART==='cold'}?a.h-b.h:b.h-a.h));var pk=opts[0];if(pk&&canSpend(pm(G,pk))&&E.inf>=pk.i)spend('choice '+pk.id,()=>buyProj(G,pk.id));}}
   if(hardOpen(G)&&!E.won){if(BOTKIND&&hardOf(G).goal!=='want')hardSetGoal(G,'want');HARD.forEach(function(g){g.ops.slice().sort(function(a,b){return BOTKIND?0:(b.k==='dark')-(a.k==='dark');}).forEach(function(o){if((!o.f&&o.id!=='deliver')||(BOTKIND&&o.k==='dark'))return;if(g.id==='war'&&o.id!==(BOTKIND?'pay':'fund'))return;if(canSpend(hardCost(G,o)))hardBuy(G,g.id,o.id);});});}
  // One modest advertising attempt; later keep referrals and distribution working.
  if(G.ob.sell&&G.kits.sold<100&&!G.webShop&&canSpend(1500)&&G.kits.sold>=10)spend('online shop',()=>addAd(G,'web'));
  if(G.ob.eshops&&!shopCount(G)&&G.money>100000)spend('market stall',()=>buyShop(G,'stall'));
  if(shopCount(G)&&!E.staff.mgr&&canSpend(5000))spend('hire manager',()=>hire(G,'mgr',1));
  if(G.kits.sold>=30&&!E.staff.sales&&!E.staff.aiSales&&canSpend(10000))spend('hire salesperson',()=>hire(G,'sales',1));
  if(pd(G,'drones')&&!E.staff.aiSales&&canSpend(3000))spend('AI sales',()=>goAI(G,'sales'));
  if(E.inf<500&&G.money>galaCost(G)*20)spend('community gala',()=>buyProj(G,'gala'));
 }
 if(academyOpen(G)){
  if(!A.level&&G.money>200000+capitalReserve(G))spend('pilot grant',()=>fundAcademy(G));
  if(A.level){A.autoFund=true;A.repeat=true;if(A.level===1&&uniqueStudies(G)&&canSpend(1000000))spend('university lab',()=>academyUpgrade(G,'lab'));
   if(A.phds&&!A.postdocs&&canSpend(500000))spend('postdoc',()=>academyUpgrade(G,'postdoc'));
   if(A.postdocs&&A.level<3&&canSpend(1000000))spend('independent group',()=>academyUpgrade(G,'group'));
   if(A.professors)for(var course of COURSES)if(!A.courses[course.id])spend('course '+course.id,()=>openCourse(G,course.id));
   var research=STUDIES.filter(r=>r.id!=='observe'&&!rd(G,r.id)&&r.req(G)).slice(0,3)[0];if(research&&A.active&&A.active.id==='observe')pauseStudy(G);if(!A.active)startStudy(G,research?research.id:'observe');
  }
 }
 if(spaceOpen(G)&&!S.started){if(requestSpaceDream(G)&&beginSpace(G))note('space started');}
 if(S.started&&!S.won){
  var w=WORLDS.find(w=>!S.colonies[w.id]||!S.colonies[w.id].settled);if(w){var col=S.colonies[w.id];if(!col){if(canSurvey(G,w.id))spend('survey '+w.id,()=>surveyWorld(G,w.id));if(canLaunch(G,w.id)){if(A.crew<w.crew&&canSpend(10000000))spend('mission crew',()=>buyMissionCrew(G));if(A.crew>=w.crew)spend('launch '+w.id,()=>launchColony(G,w.id));}}
   else{var m=habitatMetrics(G,w.id);if(m.temp>m.max&&!col.up.cooler)spend('cooling '+w.id,()=>buyHabitatUpgrade(G,w.id,'cooler'));if(m.capacityPower<0)spend('solar '+w.id,()=>buyHabitatUpgrade(G,w.id,'solar'));if(m.water<0){var u=!col.up.recycler?'recycler':'conditioner';spend(u+' '+w.id,()=>buyHabitatUpgrade(G,w.id,u));}if(m.capacityFood<0)spend('algae '+w.id,()=>buyHabitatUpgrade(G,w.id,'algaefarm'));if(w.id==='pelagia'&&!col.up.biosphere)spend('restore biosphere',()=>buyHabitatUpgrade(G,w.id,'biosphere'));if(col.water<60||col.food<20)spend('recovery supplies '+w.id,()=>resupplyColony(G,w.id));}
  }
  for(var world of WORLDS)if(S.colonies[world.id]&&S.colonies[world.id].settled)note('settled '+world.id);
 }
}
for(var day=0;day<7665;day++){
 care();if(G.day%(kitsOpen(G)?28:7)===0||G.day<35)visit();if(G.emp.won&&(G.space.won||!spaceOpen(G)))break;
 waitingSeconds+=2.4/maxSpeed(G);for(var q=0;q<4;q++){while(G.progress.queue.length){note('milestone '+G.progress.queue[0]);acknowledgeMilestone(G);}if(G.me&&G.me.on&&!G.me.botDay){G.me.botDay=1;setHour(G,19,'papers');setHour(G,20,'papers');setHour(G,21,'club');setHour(G,18,'exercise');}if(G.emp.won&&!spaceOpen(G))break;if(G.emp.won&&!G.space.started&&requestSpaceDream(G)&&beginSpace(G))note('space started');if(!stepGame(G))throw Error('Clock blocked at '+G.day);}
 minCash=Math.min(minCash,G.money);if(!Number.isFinite(G.money)||G.money<0)throw Error('Insolvent at '+G.day+' '+JSON.stringify(G.fin.slice(-3)));if(day%1000===0)console.log('progress',G.day,Math.round(G.money),Math.round(G.humans),farmCap(G),packCap(G));
 if(G.day%365===0){snapshots['year '+Math.floor(G.day/365)]=JSON.parse(JSON.stringify(G));}
}
care();var result={events:events,snapshots:snapshots,actions:actions,day:G.day,earth:G.emp.won,space:G.space.won,ending:endingPick(G),trees:Object.keys(G.emp.trees||{}),minCash:minCash,waitingMinutes:waitingSeconds/60,visits:visits,final:G};
`,c,{timeout:180000});
const out=process.env.REVIEW_OUTPUT||require('os').tmpdir()+'/shrimp-average';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'run-'+initialSeed+'.json'),JSON.stringify(c.result));console.log(JSON.stringify(c.events,null,2));console.log('RESULT',JSON.stringify({...c.result,snapshots:undefined,actions:undefined,final:undefined}));if(!c.G.emp.won||c.spaceOpen(c.G)&&!c.G.space.won)throw Error('Average-player scenario did not complete both chapters within 21 game years');if(c.minCash<=0)throw Error('Average-player scenario exhausted its working cash');
