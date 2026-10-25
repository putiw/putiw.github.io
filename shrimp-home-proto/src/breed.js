// ===== Colour breeding =====
// Real Neocaridina, simplified: every colour line is a recessive gene of its own, so mixing two
// colours gives wild brown babies (the hobby's "they all go brown"). Red + yellow make orange,
// red + blue violet, yellow + blue green, all three black. Rili (clear middle) is dominant.
// Grade (how solid the colour is) is passed on as an average with some noise, so picking the best
// and moving the rest on raises it a little each generation. A colour that pops out of carriers
// starts pale.
var TIER_NAMES=['Pale','Good','High','Painted'];
var WILD_FREQ={R:0.16,Y:0.2,B:0.15,L:0.035};
var JUV_DAYS=25,ADULT_DAYS=60,EGG_DAYS=25;
function colOf(i){var r=i.R[0]&&i.R[1],y=i.Y[0]&&i.Y[1],b=i.B[0]&&i.B[1];if(r&&y&&b)return 'black';if(r&&y)return 'orange';if(r&&b)return 'violet';if(y&&b)return 'green';if(r)return 'red';if(y)return 'yellow';if(b)return 'blue';return 'wild';}
function riliOf(i){return !!(i.L[0]||i.L[1]);}
function tierOf(g){return g<35?0:g<60?1:g<85?2:3;}
function juvOf(i){return i.age<JUV_DAYS?2:i.age<ADULT_DAYS?1:0;}
function specOf(i){var c=colOf(i);return {male:i.sex==='m',col:c,vg:c==='wild'?2:Math.max(1,toVG(i.g)),juv:juvOf(i),rili:riliOf(i),berried:!!i.eggs,hue:i.hu||0};}
function colourName(i,full){if(i.age<JUV_DAYS)return 'Baby';var c=colOf(i),n=COLOURS[c].name+(riliOf(i)?' rili':'');if(c==='wild'){return c==='wild'&&full?n+' type':n;}return full?n+' · '+TIER_NAMES[tierOf(i.g)]:n;}
function geneStr(i){var a=function(k,ch){return (i[k][0]?ch:'+')+'/'+(i[k][1]?ch:'+');};return 'red '+a('R','r')+' · yellow '+a('Y','y')+' · blue '+a('B','b')+' · rili '+(riliOf(i)?(i.L[0]&&i.L[1]?'L/L':'L/+'):'+/+');}
function bookKey(i){var c=colOf(i);if(riliOf(i))return c+':rili';return c==='wild'?'wild:0':c+':'+tierOf(i.g);}
function newInd(o){var i={id:uid(),sex:Math.random()<0.5?'f':'m',age:0,R:[0,0],Y:[0,0],B:[0,0],L:[0,0],g:40,from:'bred',born:Math.floor(S.day),eggs:null,rest:0,name:'',hu:Math.round(clamp(gauss()*3,-9,9)/3)*3};for(var k in o||{})i[k]=o[k];return i;}
function allele(f){return Math.random()<f?1:0;}
function breedWild(){return newInd({from:'stream',age:Math.floor(rnd(60,160)),R:[allele(WILD_FREQ.R),allele(WILD_FREQ.R)],Y:[allele(WILD_FREQ.Y),allele(WILD_FREQ.Y)],B:[allele(WILD_FREQ.B),allele(WILD_FREQ.B)],L:[allele(WILD_FREQ.L),0],g:rnd(12,34)});}
function grandmaStock(){var out=[],r=mulberry32(42);
  for(var k=0;k<14;k++){var i=newInd({from:'grandma',sex:k%2?'m':'f',age:Math.floor(70+r()*180),R:[1,1],g:Math.round(32+r()*28)});out.push(i);}
  out[0].B=[1,0];out[1].B=[0,1];out[3].Y=[1,0];out[4].Y=[0,1];
  for(var j=0;j<6;j++)out.push(newInd({from:'grandma',age:Math.floor(28+r()*30),R:[1,1],g:Math.round(30+r()*25)}));
  return out;}
// price at the pet shop
var BASE_PRICE={wild:2,red:4,yellow:6,blue:6,orange:8,green:8,violet:10,black:12};
function shopPrice(i){var c=colOf(i);var p=BASE_PRICE[c]*[0.5,1,2,4][c==='wild'?1:tierOf(i.g)]*(riliOf(i)?1.5:1)*(i.age<ADULT_DAYS?0.5:1);return Math.max(1,Math.round(p));}
function tankCap(T){return Math.round(T.vol*2.5);}
function hasMale(T){return T.shrimp.some(function(m){return m.sex==='m'&&m.age>=ADULT_DAYS-5;});}
function kid(m,d){var pickA=function(a){return a[Math.random()<0.5?0:1];};
  var b=newInd({R:[pickA(m.R),pickA(d.R)],Y:[pickA(m.Y),pickA(d.Y)],B:[pickA(m.B),pickA(d.B)],L:[pickA(m.L),pickA(d.L)]});
  var cm=colOf(m),cd=colOf(d),cb=colOf(b),avg=(m.g+d.g)/2;
  if(cb!==cm&&cb!==cd&&cb!=='wild')b.g=12+Math.abs(gauss())*9;           // a colour new to both parents starts pale
  else if(cm===cd&&cm!=='wild')b.g=avg+gauss()*7;
  else b.g=avg*0.7+gauss()*7;
  b.g=Math.round(clamp(b.g,1,99));return b;}
function hatch(T,mom,d){var e=mom.eggs,n=e.n,babies=[];for(var k=0;k<n;k++)babies.push(kid(mom,e.dad));mom.eggs=null;mom.rest=4;
  T.shrimp=T.shrimp.concat(babies);T.born=(T.born||0)+n;tankLog(T,plural(n,'baby','babies')+' hatched');if(typeof tankEvent==='function')tankEvent(T,'hatch',n);return babies;}
function tankLog(T,t){T.log=T.log||[];T.log.unshift({d:Math.floor(S.day),t:t});if(T.log.length>30)T.log.length=30;}
function effectsOn(){return S.opt.effects==='on';}
// one day for one tank
function breedDay(T,d){var cap=tankCap(T),n=T.shrimp.length,crowd=n>cap?(n-cap)/cap:0,hide=typeof hideScore==='function'?hideScore(T):0.3,plan=(T.pests||[]).filter(function(p){return p.k==='planaria';}).length,eff=effectsOn(),male=hasMale(T),dead=[];
  T.shrimp.forEach(function(i){i.age++;if(i.rest>0)i.rest--;
    var adult=i.age>=ADULT_DAYS,p=adult?(i.age>430?0.007:0.0011):0.0024*(1+1.4*(1-hide));
    if(i.age<JUV_DAYS&&eff)p+=Math.min(0.04,0.002*plan);
    if(eff){if(T.nh>0.4)p+=0.012*T.nh;if(T.no3>40)p+=Math.min(0.003,(T.no3-40)*0.00008);}
    p+=crowd*0.012;
    if(Math.random()<p){dead.push(i);return;}
    if(i.sex==='f'&&i.age>=ADULT_DAYS&&!i.eggs&&i.rest<=0&&male){var ch=0.05*(crowd>0?0.3:1)*(eff&&T.no3>40?0.5:1)*(eff&&T.nh>0.4?0.3:1);
      if(Math.random()<ch){var dads=T.shrimp.filter(function(m){return m.sex==='m'&&m.age>=ADULT_DAYS-5;});var dad=pick(dads);i.eggs={due:d+EGG_DAYS,n:6+Math.floor(Math.random()*9),dad:{R:dad.R.slice(),Y:dad.Y.slice(),B:dad.B.slice(),L:dad.L.slice(),g:dad.g}};}}
    if(i.age===JUV_DAYS)reveal(T,i);});
  if(dead.length){T.shrimp=T.shrimp.filter(function(i){return dead.indexOf(i)<0;});T.dayDead=(T.dayDead||0)+dead.length;if(typeof tankEvent==='function')tankEvent(T,'dead',dead);}
  T.shrimp.slice().forEach(function(i){if(i.eggs&&d>=i.eggs.due)hatch(T,i,d);});}
// A baby shows its colour at 25 days.
function reveal(T,i){var c=colOf(i),k=bookKey(i);var first=!bookHas('shrimp',k);
  if(first)bookAdd('shrimp',k,{tank:T.name});
  var main=tankMainColour(T);if(c!==main){T.newCol=(T.newCol||0)+1;if(first&&c!=='wild')tankLog(T,'A '+colourName(i).toLowerCase()+' baby showed up');}}
function tankMainColour(T){var cnt={};T.shrimp.forEach(function(i){if(i.age>=ADULT_DAYS){var c=colOf(i);cnt[c]=(cnt[c]||0)+1;}});var best='red',bn=-1;for(var c in cnt)if(cnt[c]>bn){bn=cnt[c];best=c;}return best;}
function tankCounts(T){var o={n:T.shrimp.length,adults:0,young:0,babies:0,berried:0,by:{}};T.shrimp.forEach(function(i){var j=juvOf(i);if(j===2)o.babies++;else if(j===1)o.young++;else o.adults++;if(i.eggs)o.berried++;if(j!==2){var k=colOf(i)+(riliOf(i)?'-r':'');var b=o.by[k]||(o.by[k]={col:colOf(i),rili:riliOf(i),n:0,best:0,ex:i});b.n++;if(i.g>b.best||(colOf(i)==='wild')){b.best=Math.max(b.best,i.g);if(i.g>=b.ex.g)b.ex=i;}}});return o;}
// Put shrimp into a tank, from the stream or a sort.
function addToTank(T,list,from){list.forEach(function(i){if(from)i.from=from;T.shrimp.push(i);if(i.age>=JUV_DAYS){var k=bookKey(i);if(!bookHas('shrimp',k)&&colOf(i)!=='wild')bookAdd('shrimp',k,{tank:T.name,from:from});}});
  if(from==='stream'){if(!bookHas('shrimp','wild:0'))bookAdd('shrimp','wild:0',{tank:T.name,from:'stream'});
    if(effectsOn()&&Math.random()<0.3&&typeof addPests==='function'){addPests(T,'planaria',2);T.hitch=1;}}}
function takeHome(list,from){if(!list||!list.length)return;
  openSheet({title:'Take them home',mount:function(el,api){
    var row=document.createElement('div');row.className='chips';row.style.margin='0 0 10px';list.forEach(function(i){var c=document.createElement('span');c.className='chip';c.appendChild(shrimpIconCanvas(specOf(i),34,18));var t=document.createElement('span');t.textContent=colourName(i);c.appendChild(t);row.appendChild(c);});el.appendChild(row);
    var p=document.createElement('p');p.className='hint';p.textContent='Which tank? Wild shrimp can carry colours you can’t see yet.';el.appendChild(p);
    var b=document.createElement('div');b.className='btns';S.tanks.forEach(function(T,ti){var bt=document.createElement('button');bt.className='btn';bt.innerHTML=esc(T.name)+'<small>'+(T.shrimp.length?plural(T.shrimp.length,'shrimp','shrimp'):'empty')+'</small>';bt.onclick=function(){addToTank(T,list,from||'stream');api.close();toast(plural(list.length,'shrimp','shrimp')+' in '+T.name);sfx('plop');modCall('render');};b.appendChild(bt);});
    var no=document.createElement('button');no.className='btn';no.textContent='Let them go';no.onclick=function(){api.close();toast('Back in the stream');};b.appendChild(no);el.appendChild(b);}});}
function sellShrimp(T,i){var p=shopPrice(i);T.shrimp=T.shrimp.filter(function(x){return x!==i;});earn(p,'shrimp');return p;}
function moveShrimp(i,from,to){from.shrimp=from.shrimp.filter(function(x){return x!==i;});to.shrimp.push(i);}
// Book: every colour line by grade, plus rili.
bookCat('shrimp',{title:'Shrimp colours',order:0,entries:(function(){var e=[{id:'wild:0',name:'Wild type',hint:'From the stream',draw:function(x,w,h){shrimpStill(x,{male:false,col:'wild',vg:2,juv:0},w/2,h/2,Math.min(w*0.9,h*2),1);}}];
  COLOUR_ORDER.forEach(function(c){if(c==='wild')return;TIER_NAMES.forEach(function(tn,ti){e.push({id:c+':'+ti,name:COLOURS[c].name+' · '+tn,col:c,draw:(function(c,ti){return function(x,w,h){shrimpStill(x,{male:false,col:c,vg:Math.max(1,toVG([20,48,72,92][ti])),juv:0},w/2,h/2,Math.min(w*0.9,h*2),1);};})(c,ti)});});
    e.push({id:c+':rili',name:COLOURS[c].name+' rili',col:c,draw:(function(c){return function(x,w,h){shrimpStill(x,{male:false,col:c,vg:6,juv:0,rili:true},w/2,h/2,Math.min(w*0.9,h*2),1);};})(c)});});
  e.push({id:'wild:rili',name:'Wild rili',hint:'Rare in the stream',draw:function(x,w,h){shrimpStill(x,{male:false,col:'wild',vg:2,juv:0,rili:true},w/2,h/2,Math.min(w*0.9,h*2),1);}});
  return e;})()});
var COLOUR_HINTS={yellow:'Hidden in wild shrimp',blue:'Hidden in wild shrimp',orange:'Red and yellow',violet:'Red and blue',green:'Yellow and blue',black:'All three'};
