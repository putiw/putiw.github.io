// Continue an Earth playthrough after everyone has a tank: space opens only then.
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8'),input=process.env.ACADEMY_RUN||'/private/tmp/shrimp-academy-play/run-7.json';
const source=JSON.parse(fs.readFileSync(input,'utf8')),c=vm.createContext({Math,console});
if(!source.snapshots['win'])throw Error('Earth replay needs a win snapshot');
vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
vm.runInContext('var BOTKIND='+(false)+';var _ack=acknowledgeMilestone;acknowledgeMilestone=function(G){var k=G.progress.queue[0],m=k&&MILESTONES[k];if(m&&m.dyn){if(!(BOTKIND&&storyChoose(G,k,1)))storyChoose(G,k,0);}else if(k==="owntank")storyChoose(G,k,0);return _ack(G);};',c);c.fixture=source.snapshots['win'];
vm.runInContext(`
var G=migrate(fixture),events=[],snapshots={},earthStart=G.humans;G.opt.all=true;
G.tr={know:8,care:6,ego:-4};while(G.progress.queue.length)acknowledgeMilestone(G);if(!G.emp.won||!requestSpaceDream(G)||!beginSpace(G))throw Error('Space should start after Earth');
function record(k){if(!snapshots[k]){events.push({event:k,day:G.day,money:Math.round(G.money),owners:Math.round(G.humans),knowledge:Math.floor(G.academy.knowledge)});snapshots[k]=JSON.parse(JSON.stringify(G));}}
record('space begins after Earth');G.academy.autoFund=true;
function spacePolicy(){var A=G.academy,S=G.space;
 var research=STUDIES.find(r=>r.id!=='observe'&&!rd(G,r.id)&&r.req(G));
 if(research&&A.active&&A.active.id==='observe')pauseStudy(G);
 if(!A.active)startStudy(G,research?research.id:'observe');
 for(var w of WORLDS){if(canSurvey(G,w.id))surveyWorld(G,w.id);if(canLaunch(G,w.id))launchColony(G,w.id);
 var p=S.colonies[w.id];if(!p)continue;
 var upgrades=w.id==='orbit'?[]:['solar','recycler','conditioner','algaefarm'];if(w.id==='ember')upgrades.push('cooler');if(w.id==='pelagia')upgrades.push('biosphere');
 for(var u of upgrades)if(!p.up[u])buyHabitatUpgrade(G,w.id,u);
 if(p.settled)record(w.id+' self-sufficient');
 }
}
for(var i=0;i<2500&&!G.space.won;i++){while(G.progress.queue.length)acknowledgeMilestone(G);spacePolicy();for(var q=0;q<4;q++){while(G.progress.queue.length)acknowledgeMilestone(G);stepGame(G);}if(G.money<0)throw Error('Insolvent');}
if(!G.space.won)throw Error('Space did not finish: '+JSON.stringify(G.space));record('space dream achieved');
if(G.humans<earthStart)throw Error('Earth owners dropped during space');
for(var w of WORLDS)if(!habitatMetrics(G,w.id).stable)throw Error('Unstable completed habitat: '+w.id);
`,c,{timeout:180000});
const out=process.env.SPACE_OUTPUT||'/private/tmp/shrimp-space-play';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'run.json'),JSON.stringify({events:c.events,snapshots:c.snapshots,final:c.G}));console.log(JSON.stringify(c.events,null,2));console.log('PASS complete space chapter after Earth');
