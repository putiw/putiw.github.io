const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');let seed=Number(process.env.REVIEW_SEED||7);const runSeed=seed;const math=Object.create(Math);math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const c=vm.createContext({console,Math:math});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext('var cache={},lastChips="",lastColSig="",lastChartKey="",lastAlerts="";function toast(){};function anyHad(){return G.tanks.some(t=>t.had||totalN(t)>=1);}'+html.split('function updateReveal(){')[1].split('function applyReveal(){')[0].replace(/^/, 'function updateReveal(){'),c);
vm.runInContext(`
var G=newGame(),events=[],snapshots={},last={};
function note(k){detectMilestones(G);updateReveal();if(kitsOpen(G))G.emp.shownEmp=1;if(!last[k]){last[k]=1;events.push({event:k,day:G.day,money:Math.round(G.money),shrimp:Math.round(allN(G)),sold:G.stats.sold,kits:G.kits.sold,owners:Math.round(G.humans),inf:Math.round(G.emp.inf)});snapshots[k]=JSON.parse(JSON.stringify(G));}}
function afford(c){return G.money>c+Math.max(40,staffCost(G)*14);}
function policy(){
while(G.progress.queue.length)acknowledgeMilestone(G);updateReveal();var T=G.tanks[0],P=ppm(T),E=G.emp;
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
checkGoals(G);
if(kitsOpen(G)){
 note('kits unlocked');
 if(!E.staff.tier&&afford(300))buyPackTier(G);
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
 var r=nextRegion(G);if(G.ob.ereg&&r&&afford(r.m)&&G.humans>100)buyRegion(G);
 if(farmCap(G)&&E.inf<1000&&G.money>galaCost(G)*10)buyProj(G,'gala');
 G.kitPrice=farmCap(G)?600:250;
 if(G.humans>=100)note('100 owners');if(G.humans>=10000)note('10k owners');if(G.humans>=1e6)note('million owners');if(pd(G,'ministry'))note('ministry');if(pd(G,'last'))note('last holdouts');
 if(E.won)note('win');
}
}
for(var day=0;day<12000;day++){policy();for(var q=0;q<4;q++){if(progressionBlocked(G)){while(G.progress.queue.length)acknowledgeMilestone(G);if(G.emp.won)break;}stepGame(G);}if(G.emp.won)break;if(G.money<0){console.log('INSOLVENT',JSON.stringify({day:G.day,money:G.money,fc:farmCap(G),pc:packCap(G),d:kitDemand(G),stock:G.kits.stock,raw:G.emp.rawShrimp,overhead:fixedOverhead(G),reserve:operatingReserve(G),farms:G.emp.farms,lines:G.emp.packLines,log:G.log.slice(-15),fin:G.fin.slice(-3)}));break;}if(day%1000===0)console.log('progress',G.day,Math.round(G.money),G.kits.sold,Math.round(G.humans));}
`,c,{timeout:180000});
fs.mkdirSync(process.env.REVIEW_OUTPUT||'/private/tmp/shrimp-tests',{recursive:true});fs.writeFileSync(path.join(process.env.REVIEW_OUTPUT||'/private/tmp/shrimp-tests',`run-${runSeed}.json`),JSON.stringify({events:c.events,day:c.G.day,won:c.G.emp.won,money:c.G.money,owners:c.G.humans,snapshots:c.snapshots}));console.log(JSON.stringify(c.events,null,2));if(!c.G.emp.won)throw Error('Playthrough failed to finish');console.log('WIN',runSeed,c.G.day,c.G.money);
