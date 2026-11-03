// Pass 235 (plan Part 3): one action, one effect. Every action a player takes must change what it says it changes,
// within the time it says. Sim only (Node vm), a few seconds. EFFECTS_RUN=<strong run-7.json> adds the farm checks
// (packing runs whenever there's stock and farms), which need a farm save.
// node tests/shrimp-effects.cjs
// Land-only actions (river trap, net, eggs, mowing) are checked by tests/shrimp-land-life.cjs.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
let seed=7;const M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const c=vm.createContext({Math:M,console,Date,HTML:html});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
let n=0,bad=[];
function check(name,code){try{vm.runInContext('(function(){'+code+'})()',c);n++;console.log('ok   '+name);}catch(e){bad.push(name+': '+e.message);console.log('FAIL '+name+': '+e.message);}}
// a stocked, cycled first tank with money
vm.runInContext(`function fresh(){var g=newGame();g.progress.queue=[];var T=g.tanks[0];T.had=1;T.cycledAt=0;T.pop=[{n:40,age:120,g:60},{n:30,age:40,g:40}];g.money=1e6;g.ob.bottle=1;g.ob.doses=10;g.ob.kit=1;return g;}`,c);
// [action, the effect it must have]
check('Feed: the food in the tank goes up',`var g=fresh(),T=g.tanks[0];T.chem.food=0;feed(g,T,0.8);if(!(T.chem.food>0))throw Error('food '+T.chem.food);`);
check('Water: a 30% change takes nitrate down and brings KH back',`var g=fresh(),T=g.tanks[0];T.chem.no3=40;T.chem.kh=1;var n0=ppm(T).no3;waterChange(g,T,30);if(!(ppm(T).no3<n0)||!(T.chem.kh>1))throw Error('no3 '+n0+'→'+ppm(T).no3+', kh '+T.chem.kh);`);
check('Ammonia dose: ammonia goes up',`var g=newGame(),T=g.tanks[0];g.ob.bottle=1;g.ob.doses=10;var a=ppm(T).nh;addAmmonia(g,T);if(!(ppm(T).nh>a))throw Error('nh '+a+'→'+ppm(T).nh);`);
check('Buy shrimp: shrimp in, money out',`var g=fresh(),T=g.tanks[0],a=totalN(T),m=g.money;if(!buyPack(g,T,0))throw Error('refused');if(!(totalN(T)>a)||!(g.money<m))throw Error('shrimp '+a+'→'+totalN(T));`);
check('Sell: money in, shrimp out',`var g=fresh(),T=g.tanks[0];T.pop=[{n:200,age:120,g:60}];T.set.keepL=0.2;var a=totalN(T),m=g.money;sellAll(g,false);for(var i=0;i<28&&totalN(T)>=a;i++)stepGame(g);if(!(totalN(T)<a)||!(g.money>m-1e5))throw Error('shrimp '+a+'→'+totalN(T));`);
check('Another tank: one more tank',`var g=fresh();g.stats.sold=5;var a=g.tanks.length;addTank(g);if(g.tanks.length!==a+1)throw Error(a+'→'+g.tanks.length);`);
check('Auto feeder: the tank feeds itself',`var g=fresh(),T=g.tanks[0];g.ob.up=1;buyUpgrade(g,T,'feeder');if(!T.feeder)throw Error('no feeder');T.chem.food=0;for(var i=0;i<8;i++)stepGame(g);if(!(T.chem.food>0)&&!(T.fed>0))throw Error('not fed');`);
check('A finished tank job keeps sickness away for 2 minutes, company and land',`
 var g=fresh(),T=g.tanks[0];T.cleanT=Date.now();if(illRisk(g,T)!==0)throw Error('illRisk right after a clean '+illRisk(g,T));
 if(!/careDone\\(G,M\\.mode\\);[^}]*G\\.tanks\\[0\\]\\.cleanT=Date\\.now\\(\\)/.test(HTML))throw Error('careFinish must mark every finished job');
 if(!/T\\.cleanT=Date\\.now\\(\\)/.test(landTank.toString().slice(0,200)))throw Error('landTank must mark every land job');`);
check('A clean tank is not due again for about a month',`var g=fresh(),T=g.tanks[0],C=careOf(T);C.mulm=0;C.sponge=0;C.grow=0;C.pests=[];C.rk=null;C.pestAt=g.day;
 for(var i=0;i<4*25;i++)stepGame(g);var d=ownDue(g);if(d.length)throw Error('due after 25 days: '+JSON.stringify(d));`);
check('Work hours change your day',`var g=fresh();g.me=newMe();g.me.on=1;setWork(g,10);if(dayHours(g).work!==10)throw Error('work '+dayHours(g).work);setWork(g,6);if(dayHours(g).work!==6)throw Error('work '+dayHours(g).work);`);
check('Burnout costs: half days and fewer orders',`var g=fresh();g.me=newMe();g.me.on=1;var w=workMult(g);burnStart(g,'Test');if(!(workMult(g)<w))throw Error('workMult '+w+'→'+workMult(g));if(!(dayHours(g).work<=BURN_H))throw Error('hours '+dayHours(g).work);`);
check('Grant: funding starts it and it costs money each day',`var g=fresh();g.kits.sold=ACADEMY_AT;g.money=1e9;var G0=grOf(g);grantDay(g);if(!G0.c.length)throw Error('no applicants');if(!grPick(g,0))throw Error('refused');if(G0.run.length!==1)throw Error('not running');var m=g.money;grantDay(g);if(!(g.money<m))throw Error('no cost');`);
check('Farm wellbeing: fewer shrimp a day reads happier',`var g=fresh();var a=farmWell(g);fwOf(g).s=0.5;if(!(farmWell(g)>a))throw Error(a+'→'+farmWell(g));`);
check('Plant mangroves: trees on the coast, money out',`var g=fresh();g.kits.sold=TREES_AT;var C=coinOf(g),t=C.trees;for(var x=0;x<PL_W;x++)for(var y=0;y<PL_H;y++)if(plGround(x,y)===1&&plFree(g,x,y)){plPlant(g,x,y,'m');x=PL_W;break;}if(!(C.trees>t))throw Error('no trees');`);
if(process.env.EFFECTS_RUN){const snaps=JSON.parse(fs.readFileSync(process.env.EFFECTS_RUN,'utf8')).snapshots;c.SNAP=snaps['first farm']||snaps['100 owners'];
 check('Packing runs whenever there is stock and farms are on',`var g=JSON.parse(JSON.stringify(SNAP));migrate(g);g.progress.queue=[];var k=g.kits.sold+(g.kits.stock||0),days=0,stuck=0;
  for(var d=0;d<60;d++){var before=(g.kits.made||0)+(g.kits.sold||0)+(g.kits.stock||0);for(var q=0;q<4;q++){if(progressionBlocked(g)){while(g.progress.queue.length)acknowledgeMilestone(g);}stepGame(g);}
   var after=(g.kits.made||0)+(g.kits.sold||0)+(g.kits.stock||0);if(farmBuilt(g)&&spareKitShrimp(g)>=KIT_SHRIMP*3&&packCap(g)>0&&after<=before&&(g.kits.stock||0)<kitDemand(g)*STOCK_FULL)stuck++;}
  if(stuck>3)throw Error('packing stood still on '+stuck+' of 60 days with stock and room');`);}
else console.log('skip packing check (set EFFECTS_RUN=<strong run-7.json>)');
console.log(bad.length?bad.length+' FAILED':n+' action checks passed');process.exit(bad.length?1:0);
