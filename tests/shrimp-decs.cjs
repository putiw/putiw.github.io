// The 77 or so decisions a player meets, with what each side pushes. Shared by shrimp-balance and shrimp-profiles.
module.exports=`var big=typeof big==='function'?big:function(n){return String(Math.round(n));};
function richGame(){var g=newGame();acknowledgeMilestone(g);g.day=2000;g.money=1e13;g.emp.inf=1e12;g.emp.infOn=1;g.kits.stock=1e9;g.kits.sold=1e8;g.humans=5e9;g.stats.sold=1e6;
 g.emp.staff={pack:3,sales:3,mgr:3,social:3};g.emp.farms={barn:4};g.me.on=1;g.story.choices={ev_mira:0};g.emp.fight=1;return g;}
function absOf(g){var o={};TRAITS.forEach(function(k){var v=(g.trAbs||{})[k]||0;if(v>1e-9)o[k]=v;});return o;}
function pushOf(g){var o={};TRAITS.forEach(function(k){var v=(g.tr||{})[k]||0;if(Math.abs(v)>1e-9)o[k]=v;});return o;}
function decisions(){var js=JSON.stringify(richGame()),out=[];
 for(var k in MILESTONES){var ch=null;try{ch=storyChoices(JSON.parse(js),k);}catch(e){}if(!ch||ch.length<2||k==='stream'||k==='broke'||k==='kindsave'||k==='kindend')continue;
  var d={id:k,text:(MILESTONES[k].title||'')+' '+(MILESTONES[k].body||''),opts:[]};
  for(var i=0;i<ch.length;i++){var g=JSON.parse(js);g.tr={};g.trAbs={};storyChoose(g,k,i);d.opts.push({label:ch[i][0],push:pushOf(g),abs:absOf(g)});}out.push(d);}
 var fk={};PROJ.forEach(function(p){if(p.c==='fork'&&p.fk!=='layoff')(fk[p.fk]=fk[p.fk]||[]).push(p);});
 for(var f in fk){if(typeof FORK_CUT!=='undefined'&&FORK_CUT[f])continue;/* v2 M8a: never offered */var d2={id:'fork_'+f,text:FORK_Q[f]||'',opts:[]};var fo=typeof forkOptsPush==='function'?forkOptsPush(f):null;fk[f].forEach(function(p,j){var g=JSON.parse(js);g.tr={};g.trAbs={};if(fo&&fo[j])pushApply(g,fo,j);else{trAdd(g,TRAIT_TAGS[p.id]);addHeart(g,p.h);}d2.opts.push({label:p.name,push:pushOf(g),abs:absOf(g)});});out.push(d2);}
 HARD.forEach(function(gr){var ops=(gr.ops||[]).filter(function(o){return !o.old;});if(ops.length<2)return;var d3={id:'hard_'+gr.id,text:gr.name||'',opts:[]};ops.forEach(function(o){var g=JSON.parse(js);g.tr={};g.trAbs={};var mt=Math.max(-1,Math.min(1,((o.tr||{}).means||0)+(o.h||0)*HEART_TR)),ot=Object.assign({},o.tr);delete ot.means;trAdd(g,ot);if(mt)trAdd(g,{means:mt});var sl=typeof hardSlow==='function'&&hardSlow(g,gr,o,{});if(sl)trAdd(g,{care:HARD_SLOW});d3.opts.push({label:o.t,push:pushOf(g),slow:sl});});out.push(d3);});
 if(typeof PROPS!=='undefined')PROPS.forEach(function(o){var g=JSON.parse(js);g.tr={};g.trAbs={};trAdd(g,o.tr);var ph=propHeart(o);if(ph)trAdd(g,{means:ph*HEART_TR});out.push({id:'prop_'+o.id,text:o.who+': '+o.line,opts:[{label:'Fund',push:pushOf(g)},{label:'Not now',push:(function(){var n=JSON.parse(js);n.tr={};n.trAbs={};var neg={};Object.keys(o.tr).forEach(function(k){if(k==='know')neg[k]=-o.tr[k];else if(k==='care'||k==='kin')neg[k]=-o.tr[k]/2;});trAdd(n,neg);return pushOf(n);})()}]});});/* Pass 251: proposals, fund or not */
 MOMENTS.forEach(function(m){out.push({id:'mo_'+m.id,text:'Grandma '+(m.t||''),opts:[{label:m.yes||'yes',push:Object.assign({},m.ytr)},{label:m.no||'no',push:Object.assign({},m.ntr)}]});});
 return out;}
`;
