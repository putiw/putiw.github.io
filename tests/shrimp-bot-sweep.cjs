// Pass 260: run the strong bot over many seeds and say what happened to each, with the cause of every failure.
// SWEEP_SEEDS=7,11,23,31  SWEEP_HEART=cold|kind|both  SWEEP_JOBS=2  BOT_OLD=1 (Pass 259 policy)  SHRIMP_GAME_PATH=<html>
// One seed is noise (Pass 259 moved which seeds died by moving when a story card fell), so read win rate and causes, not a single run.
const {spawn}=require('child_process'),path=require('path'),os=require('os');
const seeds=(process.env.SWEEP_SEEDS||'7,11,23,31,43,3,19,29').split(',').map(Number);
const hearts=process.env.SWEEP_HEART==='kind'?['kind']:process.env.SWEEP_HEART==='cold'?['cold']:['cold','kind'];
const jobs=Number(process.env.SWEEP_JOBS||2),jobsList=[];
hearts.forEach(h=>seeds.forEach(s=>jobsList.push({h,s})));
const out=[];let next=0,live=0;
function cause(j){const w=j.why||{};if(w.nfeed&&w.fc<=0)return 'feed stop'+(w.stores?' + '+w.stores+' stores ('+Math.round(w.storeDay)+'/day)':'');if(w.nosale>j.day)return 'police ban';return 'other (fc '+Math.round(w.fc||0)+', stores '+(w.stores||0)+')';}
function run(job){live++;
  const env=Object.assign({},process.env,{REVIEW_SEED:String(job.s),BOT_HEART:job.h==='kind'?'kind':'',REVIEW_OUTPUT:path.join(os.tmpdir(),'shrimp-sweep',job.h+job.s)});
  const p=spawn('node',[path.join(__dirname,'shrimp-playthrough.cjs')],{env});let buf='';
  p.stdout.on('data',d=>buf+=d);p.stderr.on('data',d=>buf+=d);
  p.on('close',()=>{live--;let r={h:job.h,s:job.s,res:'?',day:0,note:''};
    const w=buf.match(/^WIN (\d+) (\d+)[^\n]*ENDING ([^\n]*)/m),i=buf.match(/^INSOLVENT (\{.*\})$/m),b=(buf.match(/^BROKE-BANK \d+/gm)||[]).length;
    if(w){r.res='WIN';r.day=+w[2];r.note=w[3];}else if(i){const j=JSON.parse(i[1]);r.res='INSOLVENT';r.day=j.day;r.note=cause(j);}
    if(b)r.note+=(r.note?' · ':'')+'bank loan taken';
    out.push(r);console.log(r.h.padEnd(5),String(r.s).padEnd(3),r.res.padEnd(9),String(r.day).padEnd(6),r.note);pump();});}
function pump(){while(live<jobs&&next<jobsList.length)run(jobsList[next++]);if(!live&&next>=jobsList.length){
  hearts.forEach(h=>{const a=out.filter(x=>x.h===h),w=a.filter(x=>x.res==='WIN');console.log('\n'+h+': '+w.length+'/'+a.length+' win'+(w.length?', median win day '+w.map(x=>x.day).sort((x,y)=>x-y)[Math.floor(w.length/2)]:''));});}}
pump();
