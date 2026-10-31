// Space part 1, the planet search (shrimp/space.html). Loads the sim slice only.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/space.html'),'utf8');
const sim=html.split('// ==SPACE-SIM-START==')[1].split('// ==SPACE-SIM-END==')[0];
function ctx(){const c=vm.createContext({console,Math,Object,JSON});vm.runInContext(sim,c);return c;}
let count=0;function check(name,fn){fn(ctx());count++;console.log('PASS',name);}
function ok(c,m){if(!c)throw Error(m);}

check('same seed, same sky; different seed, different sky',c=>{
 const a=JSON.stringify([1,5,20].map(s=>c.coneAt(7,s))),b=JSON.stringify([1,5,20].map(s=>c.coneAt(7,s)));ok(a===b,'deterministic');
 ok(JSON.stringify(c.coneAt(8,5))!==JSON.stringify(c.coneAt(7,5)),'seed matters');
 for(let s=1;s<120;s++){const n=c.coneAt(7,s).length;ok(n>=2&&n<=4,'cone size '+n);}
});
check('named stops sit at their real distances',c=>{
 ok(c.coneAt(3,1).some(p=>p.id==='proxb'),'Proxima in the first cone');
 const t=c.NAMED.find(p=>p.id==='t1e').s;ok(c.coneAt(3,t).map(p=>p.id).join()==='t1e,t1f,t1g','TRAPPIST trio is a whole cone');
 ok(Math.abs(c.lyAt(t)-40)<3,'TRAPPIST ~40 ly');
 for(const p of c.NAMED){ok(c.coneAt(11,p.s).some(q=>q.id===p.id),p.id+' in its cone');ok(Math.abs(c.lyAt(p.s)-p.ly)/p.ly<.04,p.id+' distance');ok(p.known&&!/—/.test(p.known),p.id+' text');}
 ok(c.NAMED.find(p=>p.id==='kep442b').s>90,'Kepler-442 b needs more than the 100 starting flybys');
 ok(!c.NAMED.find(p=>p.id==='k218b').rocky,'K2-18 b is no ground');
});
check('fuel: a flyby 1, scans 1 or 2, braking 10 kept back, never below it',c=>{
 const v={seed:5,fuel:20,inst:{transit:1,rv:1},robots:0,seeds:{}};const t=c.tripNew(v.seed);
 ok(t.w.length===3&&new Set(t.w).size===3,'three wishes');ok(!c.fly(t,v,0),'no flying asleep');t.woke=1;
 ok(!c.canBrake(t,v),'nothing to brake at by the Sun');ok(c.fly(t,v,0)&&t.used===1&&t.s===1,'flyby');
 ok(c.scan(t,v,'transit')&&t.used===3,'transit costs 2');ok(!c.scan(t,v,'transit'),'once per planet');ok(!c.scan(t,v,'flare'),'not packed');
 while(c.fly(t,v,0));ok(c.fuelLeft(t,v)===10,'stops flying with braking fuel left: '+c.fuelLeft(t,v));
 ok(!c.canScan(t,v,'rv'),'scans never eat the braking fuel');ok(c.brake(t,v)&&c.fuelLeft(t,v)===0&&t.done,'brake');ok(!c.fly(t,v,0)&&!c.brake(t,v),'stays');
 const r=c.rankOf(t,v);ok(r.after.length===0&&r.place>=1,'no fuel, nothing after');
});
check('rank counts every planet passed and every one the fuel left could reach',c=>{
 const v={seed:9,fuel:100,inst:{},robots:0,seeds:{}};const t=c.tripNew(v.seed);t.woke=1;for(let i=0;i<10;i++)c.fly(t,v,0);c.brake(t,v);
 const r=c.rankOf(t,v);let pass=0,after=0;for(let s=1;s<=10;s++)pass+=c.coneAt(9,s).length;for(let s=11;s<=10+80;s++)after+=c.coneAt(9,s).length;
 ok(r.pass.length===pass-1,'passed '+r.pass.length+' '+pass);ok(r.after.length===after,'after '+r.after.length+' '+after);
 ok(r.place===1+r.pass.filter(x=>x.f>r.fit).length,'place');
});
check('planets run from bare rock to paradise, and paradise is rare',c=>{
 const fits=[],life=[0,0,0,0,0];for(let seed=1;seed<=40;seed++)for(let s=1;s<=90;s++)c.coneAt(seed,s).forEach(p=>{if(p.named)return;fits.push(c.fitOf(p,['river','warm','green']));life[p.life]++;});
 fits.sort((a,b)=>a-b);const q=x=>fits[Math.floor(x*(fits.length-1))];
 console.log('  fit quantiles 10/50/90/99/max',q(.1),q(.5),q(.9),q(.99),fits[fits.length-1],' life 0-4',life.join('/'));
 ok(q(.5)<35,'most are poor');ok(fits[fits.length-1]>=80,'a few are close to her wish');ok(life[4]>0&&life[4]<life[0]/20,'paradise rare');
 ok(fits.every(f=>f>=0&&f<=100),'0 to 100');
});
console.log(count+' space search checks passed');
