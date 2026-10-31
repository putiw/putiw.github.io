// The Space bot: continue an Earth playthrough into the new space chapter (Leaving Earth, Pass 168; the planet search, Pass 169).
// From the win snapshot: fund research until Leave Earth opens, leave, pack the ship, launch, fly the search in space.html's sim,
// brake by the look-then-leap rule, and stop at "Preparing for settlement" (row 6 is not built).
// The bot knows each planet's true fit, so its rank is a ceiling for a player who only sees what the scans show.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8'),ship=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8');
const input=process.env.ACADEMY_RUN||require('os').tmpdir()+'/shrimp-academy-play/run-7.json';
const source=JSON.parse(fs.readFileSync(input,'utf8')),c=vm.createContext({Math,console});
if(!source.snapshots['win'])throw Error('Earth replay needs a win snapshot');
vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext(require('./shrimp-bot-cards.cjs')(false),c);c.fixture=source.snapshots['win'];
const sky=vm.createContext({console,Math,Object,JSON});vm.runInContext(ship.split('// ==SPACE-SIM-START==')[1].split('// ==SPACE-SIM-END==')[0],sky);
c.sky=sky;
vm.runInContext(`
var G=migrate(fixture),events=[];G.opt.all=true;G.progress.sandbox=true;
function record(k,x){events.push(Object.assign({event:k,day:Math.floor(G.day),money:Math.round(G.money),science:sciScore(G)},x||{}));}
function clear(){while(G.progress.queue.length)acknowledgeMilestone(G);}
clear();if(!G.emp.won)throw Error('Fixture is not a won game');if(typeof spaceOpen!=='undefined')throw Error('Old Space is back');
record('after the win');
// Fund research until the door opens. Strong players fund nothing on Earth, so this is the slow road in.
RLINES.forEach(function(l){for(var k=0;k<3;k++)rlHire(G,l.id,'pd');rlHire(G,l.id,'pi');});
var d0=G.day;for(var i=0;i<4*365*20&&!voyageOpen(G);i++){clear();stepGame(G);if(G.money<0)throw Error('Insolvent');}
if(!voyageOpen(G))throw Error('Leave Earth never opened: science '+sciScore(G));
record('Leave Earth opens',{years:+((G.day-d0)/365).toFixed(1)});
var owners=G.humans,kits=G.kits.sold;if(!startVoyage(G))throw Error('Could not leave');var V=G.voyage;
if(!earthArchived(G)||voyageOpen(G)||canLeave(G)||!landOpen(G))throw Error('Earth ends, the land comes along');
record('left Earth',{points:voyageTotal(V),fuel:V.fuel});
// Pack: fuel stays at 100, transit and radial velocity if they fit, then robots, then seeds.
['transit','rv'].forEach(function(id){voyageSet(G,'inst',id,true);});
while(voyageSet(G,'robots','',V.robots+1));voyageSet(G,'seeds','soil',true);
if(voyageLeft(G)<0)throw Error('Over the points');
for(var j=0;j<200;j++){clear();stepGame(G);}if(G.humans!==owners||G.kits.sold!==kits)throw Error('The company stopped');
if(!voyageLaunch(G)||voyageLaunch(G)||voyageSet(G,'fuel','',V.fuel+10))throw Error('Launch once, sealed after');
record('launch',{fuel:V.fuel,inst:Object.keys(V.inst).filter(function(k){return V.inst[k];}).join(','),robots:V.robots});
`,c,{timeout:600000});
// The search, in the ship's own sim.
const V=c.G.voyage,v={seed:V.seed,fuel:V.fuel,inst:V.inst,robots:V.robots,seeds:V.seeds},t=sky.tripNew(v.seed);t.woke=1;
const look=Math.round((v.fuel-sky.BRAKE)*0.37);let best=-1,scans=0;
while(!t.done){const next=sky.coneAt(v.seed,t.s+1);let pick=0,pf=-1;next.forEach((p,i)=>{const f=sky.fitOf(p,t.w);if(f>pf){pf=f;pick=i;}});
 if(!sky.fly(t,v,pick)){sky.brake(t,v);break;}
 for(const k of ['transit','rv'])if(sky.scan(t,v,k))scans++;
 const f=sky.fitOf(sky.here(t,v),t.w);if(t.s<=look){best=Math.max(best,f);continue;}
 if(f>=best-5&&sky.canBrake(t,v))sky.brake(t,v);}
if(!t.done)throw Error('Never stopped');
const R=sky.rankOf(t,v);
if(!c.voyageTrip(c.G,JSON.parse(JSON.stringify(t)))||!c.G.voyage.landed||c.G.voyage.landed.name!==t.done.name)throw Error('Landing not kept');
const saved=c.migrate(JSON.parse(JSON.stringify(c.G)));if(!saved.voyage.landed||!saved.voyage.trip||!saved.voyage.trip.done)throw Error('Landing lost on reload');
c.record('landed',{planet:t.done.name,fit:R.fit,flybys:t.s,scans,place:R.place+' of '+(R.pass.length+1)+' passed',betterAfter:R.betterAfter||0,fuelLeft:sky.fuelLeft(t,v)});
if(!/Preparing for settlement/.test(html)||!/Preparing for settlement/.test(ship))throw Error('The stop after landing should say Preparing for settlement');
const out=process.env.SPACE_OUTPUT||require('os').tmpdir()+'/shrimp-space-play';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'run.json'),JSON.stringify({events:c.events,final:c.G}));
console.log(JSON.stringify(c.events,null,2));console.log('PASS Leave Earth, launch, search and land after Earth');
