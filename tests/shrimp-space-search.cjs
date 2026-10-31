// Space part 1, the planet search (shrimp/space.html). Loads the sim slice only.
// Pass 172: the sky is real, 220 planets from the NASA Exoplanet Archive, the same every trip.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8');
const sim=html.split('// ==SPACE-SIM-START==')[1].split('// ==SPACE-SIM-END==')[0];
function ctx(){const c=vm.createContext({console,Math,Object,JSON});vm.runInContext(sim,c);return c;}
let count=0;function check(name,fn){fn(ctx());count++;console.log('PASS',name);}
function ok(c,m){if(!c)throw Error(m);}
const PAPER=["GJ 1002 b","GJ 1002 c","GJ 1061 c","GJ 1061 d","GJ 251 c","GJ 273 b","GJ 3323 b","GJ 667 C c","GJ 667 C e","GJ 667 C f","GJ 682 b","K2-239 d","K2-288 B b","K2-3 d","K2-72 e","Kepler-1229 b","Kepler-1410 b","Kepler-1544 b","Kepler-1606 b","Kepler-1649 c","Kepler-1652 b","Kepler-186 f","Kepler-296 e","Kepler-296 f","Kepler-441 b","Kepler-442 b","Kepler-452 b","Kepler-62 e","Kepler-62 f","L 98-59 f","LHS 1140 b","LP 890-9 c","Proxima Centauri b","Ross 508 b","TOI-1266 d","TOI-700 d","TOI-700 e","TOI-715 b","TRAPPIST-1 d","TRAPPIST-1 e","TRAPPIST-1 f","TRAPPIST-1 g","Teegarden's Star c","Wolf 1061 c","Wolf 1069 b"];

check('a real sky: 200+ planets, all 45 from the 2026 list, the same every trip',c=>{
 ok(c.REAL.length>=200,'planets '+c.REAL.length);
 const names=new Set(c.REAL.map(r=>r.n));PAPER.forEach(n=>ok(names.has(n),'missing '+n));
 ok(c.REAL.filter(r=>r.hz).length===45,'45 flagged');ok(names.has('K2-18 b'),'K2-18 b');
 ok(JSON.stringify(c.coneAt(7,5))===JSON.stringify(c.coneAt(8,5)),'seed does not change the sky');
 const C=c.sky();let n=0;C.forEach(k=>{ok(k.length>=2&&k.length<=4,'cone size '+k.length);n+=k.length;});ok(n===c.REAL.length,'every planet in a cone');
 for(let s=2;s<=C.length;s++)ok(c.lyAt(s)>=c.lyAt(s-1),'cones go outward');
 ok(c.coneAt(0,1).some(p=>p.name==='Proxima Centauri b'),'Proxima first');
});
check('Earth’s line only says what was measured',c=>{
 c.REAL.forEach(r=>{ok('MKGF'.includes(r.sp)&&r.ly>0,'star and distance '+r.n);const p=c.truth(r);
  if(!r.r)ok(!/Earths wide/.test(p.known),'no width for '+r.n);
  if(r.ml==='min')ok(/At least/.test(p.known),'minimum mass for '+r.n);
  if(r.ml==='up')ok(!/Earths of mass/.test(p.known),'no upper limit as a mass for '+r.n);
  ok(!/—/.test(p.known),'no dash '+r.n);});
 const px=c.truth(c.REAL.find(r=>r.n==='Proxima Centauri b'));ok(px.flare===1&&px.rocky===1,'Proxima flares, rocky');
});
check('fuel: a flyby 1, scans 1 or 2, braking 10 kept back, new instruments only when packed',c=>{
 const v={seed:5,fuel:20,inst:{transit:1,rv:1,orbit:1},robots:0,seeds:{}};const t=c.tripNew(v.seed);
 ok(t.w.length===3&&new Set(t.w).size===3,'three wishes');ok(!c.fly(t,v,0),'no flying asleep');t.woke=1;
 ok(!c.canBrake(t,v),'nothing to brake at by the Sun');ok(c.fly(t,v,0)&&t.used===1&&t.s===1,'flyby');
 ok(c.scan(t,v,'transit')&&t.used===3,'transit costs 2');ok(!c.scan(t,v,'transit'),'once per planet');ok(!c.scan(t,v,'flare'),'not packed');
 ok(c.scan(t,v,'orbit')&&t.used===4,'orbit tracker costs 1');ok(!c.scan(t,v,'mag'),'radio watch not packed');
 while(c.fly(t,v,0));ok(c.fuelLeft(t,v)===10,'stops flying with braking fuel left: '+c.fuelLeft(t,v));
 ok(!c.canScan(t,v,'rv'),'scans never eat the braking fuel');ok(c.brake(t,v)&&c.fuelLeft(t,v)===0&&t.done,'brake');ok(!c.fly(t,v,0)&&!c.brake(t,v),'stays');
});
check('rank counts are kept for the bots, not shown',c=>{
 const v={seed:9,fuel:100,inst:{},robots:0,seeds:{}};const t=c.tripNew(v.seed);t.woke=1;for(let i=0;i<10;i++)c.fly(t,v,0);c.brake(t,v);
 const r=c.rankOf(t,v);let pass=0;for(let s=1;s<=10;s++)pass+=c.coneAt(9,s).length;ok(r.pass.length===pass-1,'passed');ok(r.place===1+r.pass.filter(x=>x.f>r.fit).length,'place');
 ok(!/planets you passed|were better|Best of all/.test(html),'no rank on the landing screen');
});
check('planets run from no chance to close to her wish',c=>{
 const fits=c.sky().flat().map(p=>c.fitOf(p,['river','warm','green'])).sort((a,b)=>a-b);const q=x=>fits[Math.floor(x*(fits.length-1))];
 console.log('  fit quantiles 10/50/90/max',q(.1),q(.5),q(.9),fits[fits.length-1]);
 ok(q(.5)<35,'most are poor');ok(fits[fits.length-1]>=80,'a few are close to her wish');ok(fits.every(f=>f>=0&&f<=100),'0 to 100');
});
console.log(count+' space search checks passed');
