// ===== Try: every idea with Keep / Maybe / Drop and a note, plus dev controls =====
var GROUPS={vac:'In the tank',toymode:'Two ways to do it',breed:'Breeding and the book',home:'Home',company:'The big picture'};
var PROPS=[
 {id:'vac',t:'Gravel vacuum',d:'Drag anywhere and the tube moves with your finger, so your thumb can stay below it and you can see the mouth. The water drops as the bucket fills, then check the bucket for babies.',go:function(){devMess('vac');goTank(S.sel);toyStart('vac');}},
 {id:'sponge',t:'Filter sponge',d:'Squeeze the dirty sponge in a bucket of old tank water. The good bacteria in it stay alive.',go:function(){devMess('sponge');goTank(S.sel);toyStart('sponge');}},
 {id:'trim',t:'Trim moss and stems',d:'Cut what grew out, scoop the bits, drag a stem top into the sand to plant it.',go:function(){devMess('trim');goTank(S.sel);toyStart('trim');}},
 {id:'pests',t:'Pick off pests',d:'Tap bladder snails and flatworms off the glass. Flatworms eat babies.',go:function(){devMess('pests');goTank(S.sel);toyStart('pests');}},
 {id:'sort',t:'Net and cull tank',d:'Tap a shrimp and it goes into the net in the top corner, with the catch sound from Shrimp Tanks. Tap one in the net to put it back. Move to cull tank sends them all there, and now and then a hobbyist comes by and takes some, free. Only 36 come out at a time and the rest hide, different ones each time you look, so culling a big tank takes many looks. Start early. Hold a shrimp to look closer.',go:function(){var T=S.tanks[S.sel]&&S.tanks[S.sel].role!=='cull'?S.tanks[S.sel]:S.tanks.find(function(t){return t.role!=='cull';})||S.tanks[0];if(T&&T.shrimp.length<60){var l=[];for(var k=0;k<60;k++)l.push(newInd({sex:Math.random()<0.5?'f':'m',age:Math.floor(rnd(30,140)),dna:GEN.forStrain('red',Math.floor(rnd(0,6)))}));addToTank(T,l,'bred');toast('60 more reds in '+T.name+', some good, some to cull.',3200);}goTank(S.tanks.indexOf(T));}},
 {id:'scape',t:'Aquascape a tank',d:'Set up an empty tank with wood, stones, plants and moss. Hiding spots help babies.',go:function(){var i=S.tanks.findIndex(function(t){return !t.scape.length;});if(i<0&&S.tanks.length<STAGES[S.stage].tanks){var T=newTank('Tank '+(S.tanks.length+1),20,[]);S.tanks.push(T);i=S.tanks.length-1;}goTank(i<0?S.sel:i);toyStart('scape');}},
 {id:'toymode',t:'Jobs show when needed, or always',d:'When needed: a job appears and glows only when the tank needs it. Always: all five sit in a tray.',sw:{k:'toys',v:[['need','When needed'],['tray','Always']]}},
 {id:'effects',t:'Wellbeing score, each thing, or just for fun',d:'Score: one wellbeing number from the water, filter, gravel, plants, space and pests. About 50 is enough; above that the shrimp are happier and busier, and it never touches money. Each thing: nitrate, ammonia and flatworms count on their own. Off: the jobs are only for the look.',sw:{k:'effects',v:[['score','Score'],['on','Each thing'],['off','Off']]}},
 {id:'breed',t:'Color breeding',d:'Your Shrimp Tanks genetics: eight color genes, a grade from G1 to G8, and rili. Close colors blend, far ones pull the grade down. Keep the best of each generation and a line climbs, or slowly walks to a new color.',go:function(){var T=S.tanks[1]||null;if(!T&&S.tanks.length<STAGES[S.stage].tanks){T=newTank('Tank 2',20,grandmaScape());S.tanks.push(T);whenArt(function(){scapeNeedsMoss(T);});}T=T||S.tanks[0];var l=[];for(var k=0;k<10;k++)l.push(breedWild());addToTank(T,l,'stream');goTank(S.tanks.indexOf(T));toast('10 wild shrimp in '+T.name+'. Skip ahead a few months under Dev to see their babies.');}},
 {id:'book',t:'The collection book',d:'Every color and grade, birds, fish, stream finds, chickens and eggs. Empty slots show what’s left.',go:function(){setTab('book');}},
 {id:'home',t:'The home grows',d:'Grandma’s flat, a balcony, a house with a garden, then land with a stream. Tap where Millie should go and the dog comes too. Move up from the card above the map.',go:function(){setTab('home');}},
 {id:'mow',t:'Mow the lawn',d:'Pick Mow and walk Millie over the grass. Short lawn brings the hoopoe, long grass the bee-eater.',go:function(){landTry(2,'mow');}},
 {id:'birds',t:'Bird feeder',d:'Fill it, then sit on the bench or keep still and the birds come closer. Tap one and stay still while the ring fills. It goes in the book.',go:function(){landTry(Math.max(S.stage,0),'walk');}},
 {id:'hens',t:'Chickens and eggs',d:'Hens lay every day. Tap the eggs in the coop to collect them. On the land, throw grain, step back, and tap a wild chicken while it pecks.',go:function(){landTry(Math.max(2,S.stage),'walk');}},
 {id:'fish',t:'Fishing',d:'Tap the stream or the lake to cast. Tap again when the float goes under. Let your fish go in the pond.',go:function(){landTry(3,'rod');}},
 {id:'trap',t:'Shrimp trap in the stream',d:'Tap the stream to set a trap. Come back after a few hours and lift it. Take the wild shrimp home and see what colors they hide.',go:function(){landTry(3,'walk');}},
 {id:'build',t:'Decorate',d:'Place flowers, trees, a bird bath, a bench. Some things bring birds.',go:function(){landTry(Math.max(S.stage,1),'build');}},
 {id:'company',t:'The company runs itself',d:'While you’re at home, the consultants run things. Weekly reports wait in this card, no pop-ups. Or you sold it and retired.',sw:{k:'company',v:[['running','Running'],['sold','Sold']]}},
 {id:'pace',t:'Time',d:'One day is 20 seconds at 1×, and home always runs at 1×. Does it feel slow and calm, or too slow?'},
 {id:'overall',t:'Overall',d:'Would you spend time here between the big decisions? What would make you come back?'}];
function landTool(t){if(window.LAND&&LAND.setTool)LAND.setTool(t);}
function landTry(stage,tool){if(typeof landSetStage==='function'&&S.stage<stage)landSetStage(stage);setTab('home');if(tool&&typeof landTool==='function')landTool(tool);}
function devMess(k){var T=S.tanks[S.sel];if(!T)return;if(k==='vac'&&mulmMean(T)<0.5)for(var i=0;i<MULM_N;i++)T.mulm[i]=clamp(0.55+Math.random()*0.35,0,1);
  if(k==='sponge'&&T.flow>0.5)T.flow=0.32;if(k==='trim'&&overgrowth(T)<0.8){for(var id in T.moss)T.moss[id].forEach(function(m){m.len=m.max*rnd(0.8,1.05);});T.stems.forEach(function(st){st.h=ART_H*(SAND_TOP-WATER_TOP)+rnd(10,60);});if(!Object.keys(T.moss).length)scapeNeedsMoss(T);}
  if(k==='pests'&&T.pests.length<5){addPests(T,'snail',5);addPests(T,'planaria',3);}TV.L={};}
// ---- notes: saved to the artifact's database when it's there, this device otherwise ----
var NOTES={state:'local',data:{items:{}},ref:null,busy:false,dirty:false,t:0};
function notesLocal(){try{var d=JSON.parse(localStorage.getItem('shrimp-proto-notes')||'null');if(d&&d.items)NOTES.data=d;}catch(e){}}
notesLocal();
(function(){try{if(!window.claude||!window.claude.use)return;Promise.all([window.claude.use('db'),window.claude.use('user')]).then(function(r){var db=r[0],user=r[1];if(!db||!user)return null;return user.id().then(function(id){if(!id)return null;NOTES.ref=db.doc('notes/'+id);return NOTES.ref.get();});}).then(function(snap){if(!snap)return;
  if(snap.exists){var d=JSON.parse(JSON.stringify(snap.data()));var loc=NOTES.data.items||{};d.items=d.items||{};for(var k in loc)if(!d.items[k]||(loc[k].at||0)>(d.items[k].at||0))d.items[k]=loc[k];NOTES.data=d;}NOTES.state='db';if(activeTab==='try')tryMod.render();if(Object.keys(NOTES.data.items).length)notesSave();}).catch(function(){NOTES.state='local';});}catch(e){}})();
function notesSave(){try{localStorage.setItem('shrimp-proto-notes',JSON.stringify(NOTES.data));}catch(e){}clearTimeout(NOTES.t);NOTES.t=setTimeout(notesPush,900);savestate('Saving…');}
function notesPush(){if(NOTES.state!=='db'||!NOTES.ref){savestate('Saved on this device');return;}if(NOTES.busy){NOTES.dirty=true;return;}NOTES.busy=true;var body={items:NOTES.data.items,updated:new Date().toISOString(),build:BUILD};
  NOTES.ref.set(body).then(function(){NOTES.busy=false;savestate('Saved');if(NOTES.dirty){NOTES.dirty=false;notesPush();}}).catch(function(e){NOTES.busy=false;if(e&&e.code==='unavailable'){setTimeout(notesPush,1500+Math.random()*1500);return;}NOTES.state='local';savestate('Saved on this device');});}
function savestate(t){var e=$('savest');if(e)e.textContent=t;}
function noteOf(id){return NOTES.data.items[id]||(NOTES.data.items[id]={r:'',t:'',at:0});}
// ---- the company, on autopilot ----
var CONSULT=['opened a new region','hired four packers','added a packing line','ran a summer ad campaign','got freight 6% cheaper','fixed a QC problem before you heard about it','signed two mall stores','built a hatchery wing','raised the kit price a little','moved the call centre'];
function companyWeek(){var C=S.company;C.week++;var g=Math.pow(1.045,C.week),net=Math.round(820000*g*(0.8+Math.random()*0.4)),homes=Math.round(11000*g*(0.8+Math.random()*0.4)),share=Math.min(45000,Math.round(900*Math.pow(1.07,C.week)));
  var r={week:C.week,net:net,homes:homes,share:share,did:pick(CONSULT)};C.last=r;C.reports=[r].concat(C.reports||[]).slice(0,6);earn(share,'company');
  // Puti: not needed here, the game already runs the company. Reports stay in the Try card, no toasts.
  }
var tryMod={name:'try',
 stageChanged:function(){if(activeTab==='try')tryMod.render();},
 day:function(d){if(S.opt.company==='running'&&d%7===0)companyWeek();},
 show:function(){tryMod.render();},
 render:function(){if(activeTab!=='try')return;var el=$('p-try');var h='<div class="card"><div class="hd"><h2>What to try</h2><small id="savest">'+(NOTES.state==='db'?'Saved':'Saved on this device')+'</small></div><p class="hint">Each idea has a Try it button. Mark it Keep, Maybe or Drop and leave a note, I can read them when you tell me you’re done.</p>';
  PROPS.forEach(function(p){var n=noteOf(p.id);if(GROUPS[p.id])h+='<h3 class="track">'+GROUPS[p.id]+'</h3>';h+='<div class="prop" data-p="'+p.id+'">'+(p.go?'<button class="btn sm tryb" data-go="'+p.id+'">Try it</button>':'')+'<h3>'+esc(p.t)+'</h3><p>'+esc(p.d)+'</p>';
   if(p.sw)h+='<div class="seg" style="margin-bottom:6px">'+p.sw.v.map(function(v){return '<button class="btn sm" data-sw="'+p.sw.k+'" data-v="'+v[0]+'" aria-pressed="'+(S.opt[p.sw.k]===v[0])+'">'+v[1]+'</button>';}).join('')+'</div>';
   h+='<div class="seg">'+[['keep','Keep','k'],['maybe','Maybe','m'],['drop','Drop','d']].map(function(v){return '<button class="btn '+v[2]+'" data-r="'+v[0]+'" aria-pressed="'+(n.r===v[0])+'">'+v[1]+'</button>';}).join('')+'<button class="btn nb" data-note="'+p.id+'"'+(n.t?' hidden':'')+'>Note</button></div>'+
    '<textarea id="note-'+p.id+'" placeholder="What did you think?"'+(n.t?'':' hidden')+'>'+esc(n.t||'')+'</textarea></div>';});
  h+='<div class="btns"><button class="btn" id="copynotes">Copy all notes</button></div><textarea id="copybox" hidden style="width:100%;min-height:120px;margin-top:8px"></textarea></div>';
  // company reports
  h+='<div class="card"><div class="hd"><h2>Company</h2><small>'+(S.opt.company==='running'?'on autopilot':'sold')+'</small></div>';
  if(S.opt.company==='running'){(S.company.reports||[]).slice(0,4).forEach(function(r){h+='<div class="report"><b>Week '+r.week+'</b>Made '+fmtA(r.net)+', '+fmtN(r.homes)+' new homes. Consultants '+esc(r.did)+'. Your share '+fmtA(r.share)+'.</div>';});if(!(S.company.reports||[]).length)h+='<p class="hint">The first weekly report comes on day 7.</p>';}
  else h+='<p class="hint">You sold the company. No reports, just home.</p>';h+='</div>';
  // dev
  h+='<div class="card"><div class="hd"><h2>Dev</h2><small>for testing</small></div><h3 class="track">Where you live</h3><div class="seg">'+STAGES.map(function(st,i){return '<button class="btn sm" data-stage="'+i+'" aria-pressed="'+(S.stage===i)+'">'+['Flat','Balcony','House','Land'][i]+'</button>';}).join('')+'</div>'+
   '<h3 class="track">Time</h3><div class="seg"><button class="btn sm" data-skip="1">+1 day</button><button class="btn sm" data-skip="7">+7</button><button class="btn sm" data-skip="30">+30</button><button class="btn sm" data-skip="90">+90</button></div>'+
   '<h3 class="track">Cash</h3><div class="seg"><button class="btn sm" data-cash="10000">+AED 10k</button><button class="btn sm" data-cash="100000">+AED 100k</button><button class="btn sm" data-cash="1000000">+AED 1M</button></div>'+
   '<h3 class="track">Shrimp</h3><div class="seg"><button class="btn sm" data-sw="genes" data-v="0" aria-pressed="'+(!S.opt.genes)+'">Hide genes</button><button class="btn sm" data-sw="genes" data-v="1" aria-pressed="'+(!!S.opt.genes)+'">Show genes</button></div>'+
   '<h3 class="track">Mess</h3><div class="seg"><button class="btn sm" data-mess="all">Make this tank messy</button><button class="btn sm" data-mess="wild">Add 6 wild shrimp</button></div>'+
   '<h3 class="track">Start over</h3><div class="seg"><button class="btn sm" id="resetp">Reset the prototype</button></div><p class="hint">Your notes stay when you reset.</p></div>';
  el.innerHTML=h;}};
registerMod(tryMod);registerTab('try',tryMod);
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#p-try button');if(!b)return;
  if(b.dataset.go){var p=PROPS.find(function(z){return z.id===b.dataset.go;});sfx('click');p.go();return;}
  if(b.dataset.note){b.hidden=true;var ta=$('note-'+b.dataset.note);ta.hidden=false;ta.focus();return;}
  if(b.dataset.r){var pid=b.closest('.prop').dataset.p,n=noteOf(pid);n.r=n.r===b.dataset.r?'':b.dataset.r;n.at=Date.now();notesSave();b.parentNode.querySelectorAll('[data-r]').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.r===n.r));});sfx('click');return;}
  if(b.dataset.sw){var k=b.dataset.sw,v=b.dataset.v;if(k==='genes')v=v==='1';var was=S.opt[k];S.opt[k]=v;
    if(k==='company'&&v==='sold'&&was!=='sold'&&!S.company.soldPaid){S.company.soldPaid=1;earn(150000,'sale');toast('You sold the company. AED 150k for the home, the rest goes to Grandma’s trust.',3800);}
    sfx('click');save();tryMod.render();updateHeader();if(k==='toys'){var dot=$('tankdot');if(dot)dot.hidden=!(S.opt.toys==='need'&&anyNeeds());}return;}
  if(b.dataset.stage!=null){var st=+b.dataset.stage;if(typeof landSetStage==='function')landSetStage(st);else{S.stage=st;}save();tryMod.render();updateHeader();toast('Moved to: '+STAGES[st].name);return;}
  if(b.dataset.skip){skipDays(+b.dataset.skip);toast('+'+plural(+b.dataset.skip,'day'));tryMod.render();return;}
  if(b.dataset.cash){earn(+b.dataset.cash,'dev');sfx('coin');return;}
  if(b.dataset.mess){var T=S.tanks[S.sel];if(b.dataset.mess==='all'){['vac','sponge','trim','pests'].forEach(devMess);toast(T.name+' needs everything now. Have a look in Tank.');}else{var l=[];for(var q=0;q<6;q++)l.push(breedWild());addToTank(T,l,'stream');toast('6 wild shrimp in '+T.name);}save();return;}
  if(b.id==='resetp'){if(!b.dataset.sure){b.dataset.sure=1;b.textContent='Tap again to erase the prototype';setTimeout(function(){delete b.dataset.sure;b.textContent='Reset the prototype';},3500);return;}try{localStorage.removeItem(SAVE_KEY);}catch(e){}S=newState();modCall('init',true);setTab('home');toast('Started over');return;}
  if(b.id==='copynotes'){var txt=PROPS.map(function(p){var n=noteOf(p.id);return p.t+': '+(n.r||'-')+(n.t?' — '+n.t:'');}).join('\n');var box=$('copybox');box.value=txt;
    try{navigator.clipboard.writeText(txt).then(function(){toast('Copied');},function(){box.hidden=false;box.select();toast('Select and copy the text below');});}catch(err){box.hidden=false;box.select();}}});
document.addEventListener('input',function(e){var t=e.target;if(!t.id||t.id.indexOf('note-')!==0)return;var n=noteOf(t.id.slice(5));n.t=t.value.slice(0,2000);n.at=Date.now();notesSave();});
