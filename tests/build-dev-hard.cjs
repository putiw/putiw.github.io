// Pass 250: makes shrimp/dev-hard.json, the save behind ?dev=hard (the game opens at Chapter 6).
// node tests/build-dev-hard.cjs <average run json>  (REVIEW_OUTPUT=<dir> node tests/shrimp-average-playthrough.cjs; after `node tests/run.cjs avg` that is tests/.runs/avg/run-7.json)
// Also writes shrimp/dev-mid.json for ?dev=mid (v2b 13).
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
// v2b 13: shrimp/dev-mid.json, the save behind ?dev=mid: the same run's "year 7" snapshot as it is (mid game: regions, farms, letters), same trimming, its own save key. Not in sw.js, never on main.
{const m=S['year 7'];if(!m)throw Error('no year 7 snapshot in '+run);
 if(m.progress)m.progress.queue=[];if(m.fin&&m.fin.length>300)m.fin=m.fin.slice(-300);if(m.log&&m.log.length>50)m.log=m.log.slice(-50);if(m.notes)m.notes.seen=(m.notes.list||[]).length;if(m.me&&m.me.fx)m.me.fx.at=null;
 m.savedAt=0;m.savedSpeed=1;delete m.savedLand;
 const o2=path.join(__dirname,'../shrimp/dev-mid.json'),t2=JSON.stringify(m);fs.writeFileSync(o2,t2);
 console.log('wrote',o2,Math.round(t2.length/1024)+' kB, day',Math.floor(m.day),'owners',Math.round(m.humans),'regions',m.emp.regions.length,'cash',Math.round(m.money/1e6)+'M');
 if(t2.length>300*1024)throw Error('dev-mid over 300 kB');}
