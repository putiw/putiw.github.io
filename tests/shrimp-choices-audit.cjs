// Pass 268 (item 11): applies every option of every choice card to one save (average bot, STAGE default 'year 8'), runs a year,
// writes SP/audit.json; tests/shrimp-choices-audit.py turns it into claude/shrimp-choices-audit.md. SP=<dir holding avg/run-7.json>.
const fs=require('fs'),vm=require('vm');const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');
const snaps=JSON.parse(fs.readFileSync(process.env.HARD_RUN||process.env.SP+'/avg/run-7.json','utf8')).snapshots;
const c=vm.createContext({console});vm.runInContext('var __seed=1;Math.random=function(){__seed=(__seed*1664525+1013904223)>>>0;return __seed/4294967296;};',c);
vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
c.SNAP=JSON.stringify(snaps[process.env.STAGE||'year 8']);
const out=vm.runInContext(`
var KEYS=['money','q','humans','mood','inf','ceil','beta','sold','heart','mat'];
function meas(g){var E=g.emp;return {money:g.money,q:E.q,humans:g.humans,inf:E.inf,ceil:E.ceil,beta:E.beta,heart:E.heart||0,mat:E.mat};}
function flat(o,p,r){r=r||{};for(var k in o){var v=o[k],n=p?p+'.'+k:k;if(v&&typeof v==='object'&&!Array.isArray(v))flat(v,n,r);else r[n]=Array.isArray(v)?JSON.stringify(v).slice(0,60):v;}return r;}
var SKIPK=/^(tr\\.|trAbs|story|progress|fin|stats|ps|log|news|tanks|me\\.log|me\\.dlog|dayLog|emp\\.infTotal|emp\\.kindNew|ripple|times|emp\\.log|seen|day$|step$)/;
function diff(a,b){var A=flat(a),B=flat(b),o=[];for(var k in B){if(SKIPK.test(k))continue;if(A[k]!==B[k])o.push(k+': '+fmt(A[k])+' > '+fmt(B[k]));}for(var k2 in A)if(!(k2 in B)&&!SKIPK.test(k2))o.push(k2+' removed');return o;}
function fmt(v){return typeof v==='number'?(Math.abs(v)>=1e4?v.toExponential(2):Math.round(v*1000)/1000):String(v).slice(0,40);}
function fresh(){var g=JSON.parse(SNAP);migrate(g);G=g;g.progress.queue=[];return g;}
function run(g,days){for(var d=0;d<days*4;d++){if(g.progress)g.progress.queue=[];stepGame(g,0);}return g;}
var rows=[];
function probe(id,title,labels,apply){var r={id:id,title:title,opts:[]};labels.forEach(function(lab,i){var g=fresh();__seed=7;var before=JSON.parse(JSON.stringify(g));var d0=g.day;var ok=true;try{ok=apply(g,i)!==false;}catch(e){ok='error '+e.message;}
  var now=JSON.parse(JSON.stringify(g));var im=diff(before,now);var lat=(g.emp.later||[]).length-((before.emp.later||[]).length);__seed=99;var m0=meas(g);run(g,365);var m1=meas(g);
  r.opts.push({days:g.day-d0,label:lab,ok:ok,imm:im,later:lat,yr:m1,push:JSON.stringify(g.tr||{})});});rows.push(r);}
var skipM={stream:1,broke:1,kindsave:1,kindend:1};
for(var k in MILESTONES){var ch=null;try{ch=storyChoices(fresh(),k);}catch(e){}if(!ch||ch.length<2||skipM[k])continue;
 probe(k,(MILESTONES[k].title||'')+': '+String(MILESTONES[k].body||'').slice(0,90),ch.map(function(x){return x[0];}),function(g,i){g.tr={};return storyChoose(g,k,i);});}
var fk={};PROJ.forEach(function(p){if(p.c==='fork')(fk[p.fk]=fk[p.fk]||[]).push(p);});
for(var f in fk)probe('fork_'+f,FORK_Q[f]||f,fk[f].map(function(p){return p.name;}),function(g,i){var p=fk[f][i];g.money=Math.max(g.money,1e12);g.emp.inf=Math.max(g.emp.inf,1e9);var reqOld=p.req;p.req=function(){return true;};try{g.tr={};return buyProj(g,p.id);}finally{p.req=reqOld;}});
JSON.stringify(rows);`,c);
fs.writeFileSync(process.env.SP+'/audit.json',out);console.log(JSON.parse(out).length,'choices');
