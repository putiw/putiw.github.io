// Which pairs of ending families each decision separates (2 Nov plan). A decision tests families A and B when the best
// answer for A is a different button from the best for B, each by at least TH (default 0.2) on that family's score.
// Family scores are endingScores' trait part on one decision's push: empire drive-care, network drive+care,
// garden -drive+kin, drift -drive-care, question 2*know. Decisions: decisions() (shrimp-decs.cjs) plus the TREES steps
// with tags (buy or not). Prints the pair table. Env: TH threshold, IDS=1 lists decision ids per pair,
// PAIRS_MIN=n fails if a pair is under n.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
const DECS=require('./shrimp-decs.cjs');
const TH=Number(process.env.TH||0.2),IDS=process.env.IDS==='1',MIN=Number(process.env.PAIRS_MIN||0);
const c=vm.createContext({Math:Object.create(Math),console});
vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext(DECS+`var D=decisions();for(var tk in TREES)TREES[tk].steps.forEach(function(s){if(s.tr)D.push({id:'tree_'+s.id,opts:[{label:'buy',push:s.tr},{label:'skip',push:{}}]});});`,c);
const F={empire:p=>(p.drive||0)-(p.care||0),network:p=>(p.drive||0)+(p.care||0),garden:p=>-(p.drive||0)+(p.kin||0),drift:p=>-(p.drive||0)-(p.care||0),question:p=>2*(p.know||0)};
const fams=Object.keys(F),pairs={};
for(let i=0;i<fams.length;i++)for(let j=i+1;j<fams.length;j++)pairs[fams[i]+'-'+fams[j]]=[];
const best=(d,f)=>{let b=0;d.opts.forEach((o,k)=>{if(F[f](o.push)>F[f](d.opts[b].push))b=k;});return b;};
c.D.forEach(d=>{for(const k in pairs){const [a,b]=k.split('-'),ia=best(d,a),ib=best(d,b);if(ia===ib)continue;
 const A=d.opts[ia].push,B=d.opts[ib].push;if(F[a](A)-F[a](B)>=TH&&F[b](B)-F[b](A)>=TH)pairs[k].push(d.id);}});
const rows=Object.entries(pairs).sort((x,y)=>y[1].length-x[1].length);
console.log(c.D.length+' decisions, threshold '+TH);
rows.forEach(([k,v])=>console.log(k.padEnd(18)+String(v.length).padStart(4)+(IDS?'  '+v.join(' '):'')));
const low=rows.filter(r=>r[1].length<MIN);
if(MIN&&low.length){console.log('UNDER '+MIN+': '+low.map(r=>r[0]).join(', '));process.exit(1);}
