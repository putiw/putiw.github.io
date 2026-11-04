// Pass 250: makes shrimp/dev-hard.json, the save behind ?dev=hard (the game opens at Chapter 6).
// node tests/build-dev-hard.cjs <average run json>  (REVIEW_OUTPUT=<dir> node tests/shrimp-average-playthrough.cjs)
// Takes the "milestone hardpart" snapshot, sets humans just under HARD_AT (the chapter card fires on day one), drops the
// hard part state and the queue, keeps the last 300 finance rows so the file stays under 300 kB. Not in sw.js, never on main.
const fs=require('fs'),path=require('path');
const run=process.argv[2]||require('os').tmpdir()+'/shrimp-average/run-7.json';
const S=JSON.parse(fs.readFileSync(run,'utf8')).snapshots,g=S['milestone hardpart'];if(!g)throw Error('no hardpart snapshot in '+run);
g.humans=3.99e9;delete g.emp.hard;if(g.progress){g.progress.queue=[];if(g.progress.seen)delete g.progress.seen.hardpart;}
if(g.fin&&g.fin.length>300)g.fin=g.fin.slice(-300);if(g.log&&g.log.length>50)g.log=g.log.slice(-50);
if(g.notes)g.notes.seen=(g.notes.list||[]).length;// Pass 253: the bot's backlog of notes is history, not news
if(g.me&&g.me.fx)g.me.fx.at=null;
g.savedAt=0;g.savedSpeed=1;delete g.savedLand;
const out=path.join(__dirname,'../shrimp/dev-hard.json'),txt=JSON.stringify(g);fs.writeFileSync(out,txt);
console.log('wrote',out,Math.round(txt.length/1024)+' kB, day',Math.floor(g.day),'cash',Math.round(g.money/1e9)+'B, Mira',g.story&&g.story.miraDay!=null?'met':'not met','land',g.me&&g.me.gplace&&g.me.gplace.land?'bought':'not bought');
if(txt.length>300*1024)throw Error('over 300 kB');
