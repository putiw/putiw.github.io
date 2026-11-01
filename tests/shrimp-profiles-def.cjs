// Player profiles (Pass 202, plan 1 Nov). A profile is what a person values (weights on what each side of a card pushes)
// plus how they play (the measured part of the traits). Used by tests/shrimp-profiles.cjs and by the bots (PROFILE=id).
// w: weights on trait pushes. drive + company first, - life first. means + fair, - cold. know + curious / tinkers.
//    kin + loves shrimp. care + strangers far away, - own people. risk + bets. control + finishes.
// play: the measured side, for ~16 game years. hrs [work, home] Your day hours. home: share of time on the You page.
//    tw, help: setting changes and ?/chart opens over the game. look, treat, cull: own tank. land: share of play time with the land open.
//    grants: share of research grants that are basic science or ecology (0..1, null = none taken). give: hard part give share, held over 4 years.
//    farmWell: farm wellbeing setting held (-1 crowded .. +1 happy, 0 default). centre: research spend as a share of everything earned.
// evil: takes bribes, dirty money and forced options when offered. first: picks the first option, ignores what it pushes.
// buy: share of tagged one-off purchases (trees, lifelines) the profile makes when it can afford them.
module.exports=[
 {id:'empire',name:'Empire builder',w:{drive:1,means:-0.4,care:-0.2,know:-0.2,kin:-0.2},play:{hrs:[30000,10000],home:0.02,tw:100,help:60,look:8,treat:2,cull:30,land:0.01,grants:0.1,give:0,farmWell:-0.5,centre:0.002},buy:0.5,target:['empire']},
 {id:'dictator',name:'Dictator',w:{drive:1,means:-1,care:-0.3,kin:-0.4},evil:1,play:{hrs:[32000,8000],home:0.01,tw:80,help:40,look:4,treat:0,cull:60,land:0,grants:0,give:0,farmWell:-1,centre:0},buy:0.5,target:['empire_dictator','empire_cartel']},
 {id:'grandma',name:'Grandma\'s kid',w:{drive:-1,care:-0.8,means:0.3,kin:0.2},play:{hrs:[14000,26000],home:0.15,tw:60,help:40,look:20,treat:10,cull:5,land:0.25,grants:0.3,give:0,farmWell:0.2,centre:0.002},buy:0.4,target:['drift']},
 {id:'dogooder',name:'Do-gooder',w:{care:1,means:0.5,drive:0.2,kin:0.1},play:{hrs:[22000,18000],home:0.06,tw:80,help:60,look:15,treat:6,cull:10,land:0.03,grants:0.3,give:0.12,farmWell:0.2,centre:0.003},buy:0.6,target:['network']},
 {id:'scientist',name:'Scientist',w:{know:1,means:0.2,care:0.1},play:{hrs:[24000,16000],home:0.05,tw:300,help:250,look:20,treat:6,cull:15,land:0.03,grants:0.9,give:0.02,farmWell:0,centre:0.02},buy:0.5,target:['question']},
 {id:'nerd',name:'Shrimp nerd',w:{kin:1,means:0.4,drive:-0.4,care:0.1},play:{hrs:[18000,22000],home:0.08,tw:150,help:100,look:80,treat:30,cull:2,land:0.12,grants:0.6,give:0.02,farmWell:1,centre:0.005},buy:0.5,target:['garden']},
 {id:'casual',name:'Casual',w:{},first:1,play:{hrs:[20000,20000],home:0,tw:5,help:5,look:5,treat:0,cull:5,land:0,grants:null,give:0,farmWell:0,centre:0},buy:0.2,target:null},
 {id:'returning',name:'Returning player',w:'random',play:{hrs:[24000,16000],home:0.03,tw:10,help:3,look:10,treat:4,cull:10,land:0.02,grants:'random',give:'random',farmWell:'random',centre:'random'},buy:0.5,target:null},
];
