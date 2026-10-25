// ===== Colour breeding, on Puti's Shrimp Tanks genetics (genetics.js) =====
// Every shrimp carries an 80-base genome. Colour is continuous: eight hue genes plus saturation and
// lightness. Grade G1-G8 is how solid the colour is: the shell genes set it, and hue genes that
// disagree pull it down. Rili shows when 3 of the 4 pattern genes are C. Without picking, grade
// sinks a little each generation; keep the best and move the rest on and a line climbs. Babies
// drift a little in hue, so a line can slowly walk to a new colour.
var GRADE_NAMES=['G1','G2','G3','G4','G5','G6','G7','G8'];
var LINE_NAMES={red:'Red',orange:'Orange',yellow:'Yellow',green:'Green',cyan:'Cyan',blue:'Blue',purple:'Purple',magenta:'Magenta',wild:'Wild',legendary:'Legendary'};
var LINE_ORDER=['red','orange','yellow','green','cyan','blue','purple','magenta'];
var JUV_DAYS=25,ADULT_DAYS=60,EGG_DAYS=25,MUT=1;
// Decoded traits are cached off the save, the genome is the only thing stored.
var PHC=typeof WeakMap==='function'?new WeakMap():null;
function phOf(i){var p=PHC&&PHC.get(i);if(p&&p.dna===i.dna)return p;ensureDna(i);p=GEN.pheno(i.dna);p.dna=i.dna;if(PHC)PHC.set(i,p);return p;}
// Saves from the first round used simple recessive genes. Rebuild a genome that looks the same.
function ensureDna(i){if(i.dna)return;var line='wild',g=2,rili=false;
  if(i.R){var r=i.R[0]&&i.R[1],y=i.Y&&i.Y[0]&&i.Y[1],b=i.B&&i.B[0]&&i.B[1];line=r&&y&&b?'custom':r&&y?'orange':r&&b?'purple':y&&b?'green':r?'red':y?'yellow':b?'blue':'wild';rili=!!(i.L&&(i.L[0]||i.L[1]));g=clamp(Math.floor((i.g==null?40:i.g)/12.5),0,7);}
  if(line==='wild')g=Math.min(g,5);
  i.dna=GEN.forStrain(line,g,line==='custom'?'#2b2724':null,undefined,rili?'rili':'solid');delete i.R;delete i.Y;delete i.B;delete i.L;delete i.g;delete i.hu;}
function gradeOf(i){return phOf(i).grade;}
function lineOf(i){return phOf(i).line;}
function riliOf(i){return phOf(i).rili;}
function colOf(i){return lineOf(i);}
function juvOf(i){return i.age<JUV_DAYS?2:i.age<ADULT_DAYS?1:0;}
function lineRank(l){var k=LINE_ORDER.indexOf(l);return k<0?(l==='wild'?20:30):k;}
// What the art needs. Babies are nearly clear and colour up as they grow, like the game.
function specOf(i){var p=phOf(i),j=juvOf(i);return {male:i.sex==='m',col:p.line,vg:p.grade,h:p.h,s:p.s,l:p.l,juv:j,mat:j===2?0.3:j===1?0.7:1,rili:p.rili,legend:p.legend,berried:!!i.eggs,size:p.body.size};}
function shrimpRGB(i){var p=phOf(i);return 'rgb('+GEN.hslRgb(p.h,p.s,p.l).join(',')+')';}
function colourName(i,full){if(i.age<JUV_DAYS)return 'Baby';var p=phOf(i),n=(LINE_NAMES[p.line]||'Wild')+(p.rili?' rili':'');return full?n+' · '+GRADE_NAMES[p.grade]:n;}
function pct(v){return Math.round(clamp(v,0,1)*100)+'%';}
function stabPct(v){return Math.round(clamp((v-0.5)*2,0,1)*100)+'%';}
function geneStr(i){var q=GEN.inspect(i.dna),g=q.genome;
  var dna='<div class="genome">'+GEN.SEGS.map(function(s){return '<span class="gs gs'+s[1]+'" title="'+s[0]+'">'+g.substr(s[1],s[2])+'</span>';}).join('')+'</div>';
  return dna+'Hue '+Math.round(q.pig.h)+'° · sat '+Math.round(q.pig.s)+' · light '+Math.round(q.pig.l)+' · hue spread '+Math.round(q.pig.spread)+'°<br>Shell '+q.shell+'/16 · pattern '+q.patC+'/4 C · shows at '+Math.round(q.ge.expr*100)+'%<br>Fertility '+pct(q.vig.fert)+' · brood '+pct(q.vig.fec)+' · egg survival '+pct(q.vig.emb)+' · stability '+stabPct(q.vig.stab)+(q.legend?'<br>Legendary marker':'');}
function newInd(o){var i={id:uid(),sex:Math.random()<0.5?'f':'m',age:0,dna:null,from:'bred',born:Math.floor(S.day),eggs:null,rest:0,name:''};for(var k in o||{})i[k]=o[k];return i;}
// The stream: mostly clear wild shrimp. Now and then one has a faint colour, usually too faint
// to see at G1, and once in a blue moon a legendary one.
var STREAM_TINTS=[58,220,120,28,180,0,272,315];
function breedWild(){var x=Math.random(),dna;
  if(x<0.004)dna=GEN.forStrain('legendary',7);
  else if(x<0.18)dna=GEN.fromTraits({hue:pick(STREAM_TINTS)+rnd(-14,14),saturation:rnd(24,46),lightness:rnd(54,68),grade:Math.floor(rnd(0,3)),hueSpread:rnd(10,24)});
  else dna=GEN.forStrain('wild',Math.floor(rnd(1,4)));
  return newInd({from:'stream',age:Math.floor(rnd(60,160)),dna:dna});}
// Grandma's tank: a red line, G3 to G6, a few rili among them. The same every new game.
function grandmaStock(){return GEN.withSeed(42,function(){var r=mulberry32(7),out=[];
  for(var k=0;k<14;k++)out.push(newInd({from:'grandma',sex:k%2?'m':'f',age:Math.floor(70+r()*180),dna:GEN.forStrain('red',[2,3,3,4,4,5][Math.floor(r()*6)])}));
  for(var j=0;j<6;j++)out.push(newInd({from:'grandma',sex:r()<0.5?'f':'m',age:Math.floor(28+r()*30),dna:GEN.forStrain('red',[2,3,4][Math.floor(r()*3)])}));
  return out;});}
// price at the pet shop
var LINE_PRICE={wild:2,red:4,orange:6,yellow:6,green:8,cyan:9,blue:9,purple:10,magenta:10,legendary:250};
var GRADE_MULT=[0.4,0.6,0.8,1,1.4,2,2.8,4];
function shopPrice(i){var p=phOf(i),v=(LINE_PRICE[p.line]||4)*GRADE_MULT[p.grade]*(p.rili?1.5:1)*(i.age<ADULT_DAYS?0.5:1);return Math.max(1,Math.round(v));}
function tankCap(T){return Math.round(T.vol*2.5);}
function hasMale(T){return T.shrimp.some(function(m){return m.sex==='m'&&m.age>=ADULT_DAYS-5;});}
function kidOf(mom,dad){ensureDna(dad);var gd=dad.grade!=null?dad.grade:GEN.pheno(dad.dna).grade,pm=phOf(mom);
  return newInd({dna:GEN.inherit(mom.dna,dad.dna,MUT,pm.grade,gd),mum:{l:pm.line,g:pm.grade,r:pm.rili?1:0},dad:dad.l?{l:dad.l,g:gd,r:dad.r}:null});}
function hatch(T,mom,d){var e=mom.eggs,sv=e.surv!=null?e.surv:0.85,babies=[];for(var k=0;k<e.n;k++)if(Math.random()<sv)babies.push(kidOf(mom,e.dad));if(!babies.length)babies.push(kidOf(mom,e.dad));mom.eggs=null;mom.rest=4;
  T.shrimp=T.shrimp.concat(babies);T.born=(T.born||0)+babies.length;tankLog(T,plural(babies.length,'baby','babies')+' hatched');if(typeof tankEvent==='function')tankEvent(T,'hatch',babies.length);return babies;}
function tankLog(T,t){T.log=T.log||[];T.log.unshift({d:Math.floor(S.day),t:t});if(T.log.length>30)T.log.length=30;}
// Effects: 'score' is one wellbeing number (about 50 is enough, more makes them happy), 'on' counts each
// thing on its own, 'off' makes the jobs only for the look.
function effectsOn(){return S.opt.effects!=='off';}
function scoreMode(){return S.opt.effects==='score';}
// one day for one tank
function breedDay(T,d){var cap=tankCap(T),n=T.shrimp.length,crowd=n>cap?(n-cap)/cap:0,hide=typeof hideScore==='function'?hideScore(T):0.3,plan=(T.pests||[]).filter(function(p){return p.k==='planaria';}).length,each=S.opt.effects==='on',sc=scoreMode(),W=sc&&typeof wellbeing==='function'?wellbeing(T).total:100,male=hasMale(T),dead=[],dads=null;
  T.shrimp.forEach(function(i){i.age++;if(i.rest>0)i.rest--;
    var adult=i.age>=ADULT_DAYS,p=adult?(i.age>430*phOf(i).body.life?0.007:0.0011):0.0024*(1+1.4*(1-hide));
    if(i.age<JUV_DAYS&&each)p+=Math.min(0.04,0.002*plan);
    if(each){if(T.nh>0.4)p+=0.012*T.nh;if(T.no3>40)p+=Math.min(0.003,(T.no3-40)*0.00008);}
    if(sc&&W<50)p+=(50-W)/50*(adult?0.004:0.012);
    p+=crowd*0.012;
    if(Math.random()<p){dead.push(i);return;}
    if(i.sex==='f'&&i.age>=ADULT_DAYS&&!i.eggs&&i.rest<=0&&male){if(!dads)dads=T.shrimp.filter(function(m){return m.sex==='m'&&m.age>=ADULT_DAYS-5;});var dad=pick(dads),pm=phOf(i),pd=phOf(dad),pr=GEN.pair(i.dna,dad.dna,pm.grade,pd.grade);
      // the vigor genes, scaled so a typical pair breeds at the old pace
      var ch=0.05*clamp(pr.fertility/0.55,0.4,1.6)*(crowd>0?0.3:1)*(each&&T.no3>40?0.5:1)*(each&&T.nh>0.4?0.3:1)*(sc?clamp(W/50,0.25,1):1);
      if(Math.random()<ch)i.eggs={due:d+EGG_DAYS,n:Math.max(2,Math.round((6+Math.random()*9)*clamp(pr.brood/0.41,0.5,1.5))),surv:clamp(pr.embryo/0.57*0.85,0.4,0.98),dad:{dna:dad.dna,grade:pd.grade,l:pd.line,r:pd.rili?1:0}};}
    if(i.age===JUV_DAYS)reveal(T,i);});
  if(dead.length){T.shrimp=T.shrimp.filter(function(i){return dead.indexOf(i)<0;});T.dayDead=(T.dayDead||0)+dead.length;if(typeof tankEvent==='function')tankEvent(T,'dead',dead);}
  T.shrimp.slice().forEach(function(i){if(i.eggs&&d>=i.eggs.due)hatch(T,i,d);});}
// A baby shows its colour at 25 days.
// It only counts as a new colour (and lights up Sort) when no grown shrimp in the tank has it.
function reveal(T,i){var first=bookShrimpSeen(i,{tank:T.name}),p=phOf(i),have=T.shrimp.some(function(o){return o!==i&&o.age>=ADULT_DAYS&&lineOf(o)===p.line&&riliOf(o)===p.rili;});
  if(!have){T.newCol=(T.newCol||0)+1;if(first&&p.line!=='wild'){var nm=colourName(i).toLowerCase();tankLog(T,(/^[aeiou]/.test(nm)?'An ':'A ')+nm+' baby showed up');}}}
function tankMainColour(T){var cnt={};T.shrimp.forEach(function(i){if(i.age>=ADULT_DAYS){var c=lineOf(i);cnt[c]=(cnt[c]||0)+1;}});var best='red',bn=-1;for(var c in cnt)if(cnt[c]>bn){bn=cnt[c];best=c;}return best;}
function tankCounts(T){var o={n:T.shrimp.length,adults:0,young:0,babies:0,berried:0,by:{}};T.shrimp.forEach(function(i){var j=juvOf(i);if(j===2)o.babies++;else if(j===1)o.young++;else o.adults++;if(i.eggs)o.berried++;
  if(j!==2){var p=phOf(i),k=p.line+(p.rili?'-r':'');var b=o.by[k]||(o.by[k]={col:p.line,rili:p.rili,n:0,best:-1,ex:i});b.n++;if(p.grade>b.best){b.best=p.grade;b.ex=i;}}});return o;}
// Put shrimp into a tank, from the stream or a sort.
function addToTank(T,list,from){list.forEach(function(i){if(from)i.from=from;T.shrimp.push(i);bookShrimpSeen(i,{tank:T.name,from:from});});
  if(from==='stream'&&effectsOn()&&Math.random()<0.3&&typeof addPests==='function'){addPests(T,'planaria',2);T.hitch=1;}}
function takeHome(list,from){if(!list||!list.length)return;
  openSheet({title:'Take them home',mount:function(el,api){
    var row=document.createElement('div');row.className='chips';row.style.margin='0 0 10px';list.forEach(function(i){var c=document.createElement('span');c.className='chip';c.appendChild(shrimpIconCanvas(specOf(i),34,18));var t=document.createElement('span');t.textContent=colourName(i,true);c.appendChild(t);row.appendChild(c);});el.appendChild(row);
    var p=document.createElement('p');p.className='hint';p.textContent='Wild shrimp are mostly clear. Some carry a colour too faint to see at G1. Breed them and keep the most coloured babies.';el.appendChild(p);
    var b=document.createElement('div');b.className='btns';S.tanks.forEach(function(T,ti){var bt=document.createElement('button');bt.className='btn';bt.innerHTML=esc(T.name)+'<small>'+(T.shrimp.length?plural(T.shrimp.length,'shrimp','shrimp'):'empty')+'</small>';bt.onclick=function(){addToTank(T,list,from||'stream');api.close();toast(plural(list.length,'shrimp','shrimp')+' in '+T.name);sfx('plop');modCall('render');};b.appendChild(bt);});
    if(S.tanks.length<STAGES[S.stage].tanks&&typeof setupTank==='function'){var nt=document.createElement('button');nt.className='btn';nt.innerHTML='+ A new tank<small>'+fmtA(300)+', keeps them apart</small>';nt.onclick=function(){var T=setupTank('Stream tank');if(!T)return;addToTank(T,list,from||'stream');api.close();toast(plural(list.length,'shrimp','shrimp')+' in '+T.name);sfx('plop');modCall('render');};b.appendChild(nt);}
    var no=document.createElement('button');no.className='btn';no.textContent='Let them go';no.onclick=function(){api.close();toast('Back in the stream');};b.appendChild(no);el.appendChild(b);}});}
function sellShrimp(T,i){var p=shopPrice(i);T.shrimp=T.shrimp.filter(function(x){return x!==i;});earn(p,'shrimp');return p;}
function moveShrimp(i,from,to){from.shrimp=from.shrimp.filter(function(x){return x!==i;});to.shrimp.push(i);}

// ---- The book: every line solid and rili with the best grade reached, and a wheel of every hue ----
// (Puti's notebook keeps the best grade per line and per 3° of hue.)
function bookShrimpSeen(i,info,silent){if(i.age<JUV_DAYS)return false;var p=phOf(i),key=p.line+(p.rili&&!p.legend?':rili':''),B=S.book.shrimp||(S.book.shrimp={}),e=B[key],first=false;
  var rec={best:p.grade,h:Math.round(p.h),s:Math.round(p.s),l:Math.round(p.l)};
  if(!e){if(silent){B[key]=Object.assign({day:Math.floor(S.day)},rec,info||{});}else{bookAdd('shrimp',key,Object.assign(rec,info||{}));}first=true;}
  else if((e.best==null?-1:e.best)<p.grade){Object.assign(e,rec);if(!silent){if(p.grade===7)toast('First '+(LINE_NAMES[p.line]||'')+(p.rili?' rili':'')+' at G8',3200);modCall('bookChanged','shrimp',key);}}
  if(p.line!=='wild'&&!p.legend){var arr=p.rili?(S.book.hueR||(S.book.hueR=[])):(S.book.hue||(S.book.hue=[])),slot=Math.min(119,Math.floor(p.h/3));if(arr[slot]==null||arr[slot]<p.grade)arr[slot]=p.grade;}
  return first;}
// round 1 book keys were colour:tier
function migrateBook(){var B=S.book.shrimp;if(!B||S.book.v2)return;S.book.v2=1;var map={violet:'purple'},out={};
  Object.keys(B).forEach(function(k){var a=k.split(':'),c=map[a[0]]||a[0],t=a[1];if(c==='black')return;var nk=t==='rili'?c+':rili':c,best=t==='rili'?4:c==='wild'?2:[1,3,5,7][+t]||1;var e=out[nk]||(out[nk]={day:B[k].day,tank:B[k].tank,from:B[k].from});e.best=Math.max(e.best==null?-1:e.best,best);});
  S.book.shrimp=out;}
registerMod({name:'breed',init:function(){migrateBook();}});
var LINE_SHOW={};LINE_ORDER.forEach(function(c,k){LINE_SHOW[c]={h:GEN.LINES[k][1],s:84,l:56};});LINE_SHOW.wild={h:190,s:7,l:82};
// A found line shows your best one; a missing one is drawn solid so its silhouette reads.
function bookShrimpDraw(c,ri){return function(x,w,h,got){var L=LINE_SHOW[c];var sp={male:false,col:c,h:got&&got.h!=null?got.h:L.h,s:got&&got.s!=null?got.s:L.s,l:got&&got.l!=null?got.l:L.l,vg:got?(got.best!=null?Math.max(1,got.best):3):7,juv:0,mat:1,rili:ri};
  shrimpStill(x,sp,w/2,h/2,Math.min(w*0.9,h*2),1);};}
bookCat('shrimp',{title:'Shrimp colours',order:0,note:'Best grade so far for each line',head:function(el){shrimpBookHead(el);},entries:(function(){var e=[];
  LINE_ORDER.concat(['wild']).forEach(function(c){[false,true].forEach(function(ri){e.push({id:c+(ri?':rili':''),name:LINE_NAMES[c]+(ri?' rili':''),col:c,rili:ri,grades:true,draw:bookShrimpDraw(c,ri)});});});
  e.push({id:'legendary',name:'Legendary',hint:'Once in a blue moon, from the stream',draw:function(x,w,h){shrimpStill(x,{male:false,col:'legendary',legend:true,vg:7,juv:0,mat:1,h:0,s:80,l:55},w/2,h/2,Math.min(w*0.9,h*2),1);}});
  return e;})()});
var LINE_HINTS={red:'Grandma’s line',orange:'Reds drift toward it',magenta:'Reds drift toward it',yellow:'Faint ones in the stream',green:'Faint ones in the stream',cyan:'Faint ones in the stream',blue:'Faint ones in the stream',purple:'Red and blue, or the stream',wild:'From the stream'};
var RILI_HINTS={red:'Grandma has a few',orange:'From rili reds that drift',magenta:'From rili reds that drift',wild:'Rare in the stream'};
function shrimpHint(e){if(e.rili)return RILI_HINTS[e.col]||'Breed a rili into this colour';return LINE_HINTS[e.col]||'';}
// The wheel: 120 slots of 3° each, solid outside and rili inside, brighter for a higher grade.
function shrimpBookHead(el){var hs=S.book.hue||[],hr=S.book.hueR||[],n=0,n8=0,r8=0,rn=0;for(var k=0;k<120;k++){if(hs[k]!=null){n++;if(hs[k]===7)n8++;}if(hr[k]!=null){rn++;if(hr[k]===7)r8++;}}
  el.innerHTML='<div class="hd"><h2>Colour wheel</h2><small>'+n+' of 120 hues · '+n8+' at G8'+(rn?' · rili '+rn+(r8?' ('+r8+' at G8)':''):'')+'</small></div><div class="wheelrow"><canvas id="bk-wheel" width="220" height="220"></canvas><div class="wheeltxt">'+
   '<p>One slot for each shade you’ve kept: solid outside, rili inside. Brighter means a higher grade.</p>'+
   '<details><summary>How colour works</summary><p>Each shrimp has eight colour genes. Babies take after their parents: two close colours blend, far apart ones mostly follow one parent and carry a few of the other’s genes, which lowers the grade.</p><p>Grade, G1 to G8, is how solid the colour is. G1 is see-through. Without picking it sinks a little each generation. Keep the best, move the rest on, and it climbs.</p><p>Rili needs 3 of the 4 pattern genes. Babies drift a little in hue, so a line can slowly walk to a new colour. A shrimp’s stability gene sets how much.</p></details></div></div>';
  var cv=$('bk-wheel'),W=110,x=fitCanvas(cv,W,W);cv.style.width=W+'px';cv.style.height=W+'px';var c=W/2;
  for(var s=0;s<120;s++){var a0=(s*3-90-1.4)*Math.PI/180,a1=((s+1)*3-90-1.6)*Math.PI/180;[[hs,c-2,c-17],[hr,c-20,c-31]].forEach(function(ring){var g=ring[0][s];x.beginPath();x.arc(c,c,ring[1],a0,a1);x.arc(c,c,ring[2],a1,a0,true);x.closePath();
    if(g==null){x.fillStyle='rgba(120,110,90,.13)';}else{var rgb=GEN.hslRgb(s*3+1.5,30+g*9,82-g*4.5);x.fillStyle='rgb('+rgb.join(',')+')';}x.fill();});}
  x.fillStyle='rgba(34,32,27,.55)';x.font='600 9px Inter,system-ui';x.textAlign='center';x.fillText('rili',c,c+3);}
