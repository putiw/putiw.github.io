// ===== Game link: the land inside Universal Shrimp (only in the game build, window.GAME_MODE) =====
// The game is the boss: its cash pays for everything, and its Tank 1 is Your tank here, the same tank.
// One clock (Pass 151): the land runs on the company's game days. While you're here the company runs at real time,
// so nothing much moves; back at the company time flies and the land catches up when you next come.
// Messages to the game: {land:1,type:'ready'|'spend'|'earn'|'take'|'give'|'care'|'back'}. From the game: {game:1,type:'cash'|'own'}.
(function(){
if(!window.GAME_MODE)return;
DAY_SEC=1e15;                       // no days pass on real time; game days come from the company
ADULT_DAYS=75;                      // the same as the game
SAVE_KEY='shrimp-land-v1';
var P=window.parent!==window?window.parent:(window.TEST_PARENT||null);   // the test page stands in for the company in the same page
function post(m){if(!P)return;m.land=1;try{P.postMessage(m,'*');}catch(e){}}
window.GAME_POST=post;
// no browser feel inside the game: no pinch zoom, no long-press menu (Puti, 28 Oct)
['gesturestart','gesturechange','gestureend'].forEach(function(k){document.addEventListener(k,function(e){e.preventDefault();},{passive:false});});
document.addEventListener('touchmove',function(e){if(e.touches&&e.touches.length>1)e.preventDefault();},{passive:false});
document.addEventListener('contextmenu',function(e){var t=e.target;if(!(t.closest&&t.closest('input,textarea')))e.preventDefault();});

// ----- money: the company's cash -----
var FROZEN='',NEED='',SEQ=0,LEFT=0,VOY=0;   // SEQ: our last take/give; an 'own' from before the game handled it is stale
spend=function(n,what){if(n<=0)return true;if(FROZEN){toast(FROZEN,4200);sfx('nope');return false;}if(S.cash<n){toast('Not enough cash for '+what+'.');sfx('nope');return false;}
  S.cash-=n;post({type:'spend',n:n,what:what});updateHeader();save();return true;};
earn=function(n,what){if(n<=0)return;S.cash+=n;post({type:'earn',n:n,what:what});updateHeader();save();};

// ----- your own tank: Tank 1 here follows the game's tank 1 -----
var OWN=null;
function gradeOf(g){return clamp(1+Math.round((g||0)/100*7),1,8);}
function ownT(){return S.tanks[0]||null;}
// Your tank is the game's Tank 1. The game decides births and deaths, the land keeps each shrimp it knows (color,
// name, age) and only adds or removes the difference, so nothing gets reset. Moves and sales here go to the game.
function gOf(i){return Math.round(clamp(phOf(i).grade,0,7)/7*100);}
function syncOwn(d){if((d.seq||0)<SEQ)return;var T=ownT();if(!T||typeof newInd!=='function'||typeof GEN!=='object')return;T.name='Your tank';T.own=1;
  if(report())return;OWN=d;try{ownAge(T,d);}catch(e){}
  var A=Math.min(600,d.adults|0),Y=Math.min(600,d.young|0),N=netList(),
    mine=function(){return T.shrimp.concat(N.filter(function(e){return e.from===T.id;}).map(function(e){return e.ind;}));},ad=function(){return mine().filter(function(i){return i.age>=ADULT_DAYS;});},yo=function(){return mine().filter(function(i){return i.age<ADULT_DAYS;});};
  // shrimp in the net from Your tank still count as in it until they're moved or sold
  function inNet(i){return N.some(function(e){return e.ind===i;});}
  // young the game has grown up: the oldest young here grow up too, rather than swapping shrimp
  var a0=ad(),y0=yo();if(a0.length<A&&y0.length>Y){var up=Math.min(A-a0.length,y0.length-Y);y0.sort(function(p,q){return q.age-p.age;}).slice(0,up).forEach(function(i){i.age=ADULT_DAYS;});}
  if(a0.length>A&&y0.length<Y){var dn=Math.min(a0.length-A,Y-y0.length);a0.filter(function(i){return !i.name&&!inNet(i);}).sort(function(p,q){return p.age-q.age;}).slice(0,dn).forEach(function(i){i.age=ADULT_DAYS-1;});}
  function add(n,adult){var moms=T.shrimp.filter(function(i){return i.sex==='f'&&i.age>=ADULT_DAYS;}),dads=T.shrimp.filter(function(i){return i.sex==='m'&&i.age>=ADULT_DAYS-5;});
    for(var k=0;k<n;k++){var i;
      if(!adult&&moms.length&&dads.length){var dd=pick(dads),pd=phOf(dd);i=kidOf(pick(moms),{dna:dd.dna,grade:pd.grade,l:pd.line,r:pd.rili?1:0});i.age=1;}
      else i=newInd({from:'grandma',sex:Math.random()<0.5?'f':'m',age:adult?Math.floor(ADULT_DAYS+10+Math.random()*150):Math.floor(8+Math.random()*(ADULT_DAYS-12)),dna:GEN.forStrain('red',gradeOf(d.g+(Math.random()-0.5)*20))});
      T.shrimp.push(i);}}
  function cut(list,n){list=list.filter(function(i){return !inNet(i)&&!i.name;}).sort(function(a,b){return b.age-a.age;});var gone=list.slice(0,n);T.shrimp=T.shrimp.filter(function(i){return gone.indexOf(i)<0;});}
  var a1=ad(),y1=yo();
  if(a1.length<A)add(A-a1.length,true);else if(a1.length>A)cut(a1,a1.length-A);
  if(y1.length<Y)add(Y-y1.length,false);else if(y1.length>Y)cut(y1,y1.length-Y);
  try{ownGrades(T,d);applyOwn(T,d);}catch(e){console.error(e);}
  if(activeTab==='tank'&&typeof tvSync==='function')try{tvSync();}catch(e){}}
// ----- one tank (Pass 161): the game's Tank 1 is the only truth for Your tank -----
// The game sends ages (tank days), grades, the mess (mulm, sponge, growth, pests), glass, water, decor and wellbeing.
// The land draws them and sends back what a job changed (type 'tank'), the game applies it and the next 'own' agrees.
var MM_K=0.8,OG_K=1.36,LAST=null;
function ownAge(T,d){if(d.tday==null)return;var td=Math.floor(d.tday);if(T.tday==null||td<T.tday){T.tday=td;return;}var n=Math.min(400,td-T.tday);if(n<1)return;T.tday=td;
  T.shrimp.forEach(function(i){var a0=i.age;i.age+=n;if(i.rest>0)i.rest=Math.max(0,i.rest-n);if(a0<JUV_DAYS&&i.age>=JUV_DAYS)try{reveal(T,i);}catch(e){}});}
// grade by grade, the same counts as the game (plain red, the game has no other lines)
function ownGrades(T,d){[['ga',function(i){return i.age>=ADULT_DAYS;}],['gy',function(i){return i.age<ADULT_DAYS;}]].forEach(function(q){var h=d[q[0]];if(!Array.isArray(h))return;
  var list=T.shrimp.filter(q[1]).sort(function(a,b){return phOf(a).grade-phOf(b).grade;}),want=[];h.forEach(function(n,g){for(var k=0;k<n&&want.length<list.length;k++)want.push(g);});
  while(want.length<list.length)want.push(want.length?want[want.length-1]:3);
  list.forEach(function(i,k){var p=phOf(i);if(p.grade!==want[k]||p.line!=='red'||p.rili||p.legend){i.dna=GEN.forStrain('red',want[k]);}});});}
function decorFlags(T){var has=function(k){return T.scape.some(function(i){return i.k===k;});},moss=0;for(var k in T.moss)moss+=T.moss[k].length;
  return {wood:has('wood')?1:0,plants:has('sword')||has('lotus')||T.stems.length?1:0,moss:has('mossrock')||moss?1:0,leaves:has('leaf')?1:0};}
function decorSet(T,f){var D={wood:['wood'],plants:['sword','lotus'],moss:['mossrock'],leaves:['leaf']},now=decorFlags(T),ch=0;
  Object.keys(D).forEach(function(k){if(!!f[k]===!!now[k])return;ch=1;
    if(f[k]){var kk=D[k][0],ds=DECOR_SIZE[kk],it={id:uid(),k:kk,x:rnd(250,ART_W-250),y:kk==='leaf'?ART_H*0.9:ds.y+ds.h,s:kk==='leaf'?1:0.85,f:Math.random()<0.5?1:-1,r:kk==='leaf'?rnd(-0.5,0.5):0};T.scape.push(it);scapeResort(T,it);if(DECOR[kk].moss)seedMoss(T,it,6,true);if(k==='plants')defaultStems(T,it.x,4);}
    else{T.scape=T.scape.filter(function(i){if(D[k].indexOf(i.k)<0)return true;delete T.moss[i.id];return false;});if(k==='plants')T.stems=[];if(k==='moss')T.moss={};}});
  if(ch&&typeof TV==='object')TV.L={};}
function ownVals(T){var sn=0,pl=0;T.pests.forEach(function(p){if(p.k==='snail')sn++;else pl++;});return {mulm:mulmMean(T),flow:T.flow,og:overgrowth(T),sn:sn,pl:pl,no3:T.no3,wc:T.lastWC,dec:JSON.stringify(decorFlags(T))};}
function applyOwn(T,d){var c=d.care;if(!c)return;
  var tg=clamp(c.mulm*MM_K,0,1),mm=mulmMean(T),i;if(Math.abs(mm-tg)>0.002){if(mm<0.002){var w=0;for(i=0;i<MULM_N;i++)w+=mulmWeight(T,i);for(i=0;i<MULM_N;i++)T.mulm[i]=clamp(tg*mulmWeight(T,i)*MULM_N/w,0,1);}else for(i=0;i<MULM_N;i++)T.mulm[i]=clamp(T.mulm[i]*tg/mm,0,1);}
  T.flow=clamp(1-0.9*c.sponge,0.05,1);
  var og=overgrowth(T),to=clamp(c.grow,0,1)*OG_K;if(og>0.01&&Math.abs(og-to)>0.004){var f=to/og;for(var k in T.moss)T.moss[k].forEach(function(m){m.len=Math.max(6,m.len*f);});T.stems.forEach(function(st){st.h=Math.max(20,st.h*f);});TV.L={};}
  [['snail',c.snail|0],['planaria',c.flat|0]].forEach(function(q){var have=T.pests.filter(function(p){return p.k===q[0];});if(have.length<q[1])addPests(T,q[0],Math.min(40,q[1]-have.length));else if(have.length>q[1]){var gone=have.slice(q[1]);T.pests=T.pests.filter(function(p){return gone.indexOf(p)<0;});}});
  if(d.no3!=null)T.no3=d.no3;if(d.nh!=null)T.nh=d.nh;
  if(d.decor)decorSet(T,d.decor);
  LAST=ownVals(T);if(!d.decor)report(1);}
// what a job on the land changed, back to the game; first=1 also sends the land's decor once, it wins for old saves
function report(first){var T=ownT();if(!T||!LAST||TOY||$('sheet')&&!$('sheet').hidden)return false;var v=ownVals(T),m={type:'tank'},any=0;
  if(v.mulm<LAST.mulm-0.004){m.mulm=v.mulm/MM_K;any=1;}
  if(v.flow>LAST.flow+0.004){m.sponge=clamp((1-v.flow)/0.9,0,1);any=1;}
  if(v.og<LAST.og-0.004){m.grow=v.og/OG_K;any=1;}
  if(v.sn<LAST.sn||v.pl<LAST.pl){m.snail=v.sn;m.flat=v.pl;any=1;}
  if(v.wc!==LAST.wc&&LAST.no3>0){m.wc=Math.round(clamp(1-v.no3/LAST.no3,0,0.9)*100);any=1;}
  if(any)m.job=1;
  if(first||v.dec!==LAST.dec){m.decor=JSON.parse(v.dec);any=1;}
  if(!any)return false;m.seq=++SEQ;post(m);LAST=v;return true;}
// the game's glass algae, drawn the same way on the land
var GLC=null,GLK='';
function glassLayer(W,H,dpr,g){var k=g+'|'+W+'|'+H;if(GLC&&GLK===k)return GLC;var c=GLC||document.createElement('canvas');c.width=W*dpr;c.height=H*dpr;var x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
  var GW=32,GH=16,cw=W/GW,ch=(H*0.78)/GH;for(var i=0;i<g.length&&i<GW*GH;i++){var a=(+g[i])/9;if(a<0.06)continue;var cx=(i%GW)*cw,cy=H*0.22+Math.floor(i/GW)*ch;x.fillStyle='rgba(96,150,70,'+(a*0.07).toFixed(3)+')';x.fillRect(cx,cy,cw+0.5,ch+0.5);
    var n=Math.ceil(a*4);for(var q=0;q<n;q++){var h=((i+1)*2654435761^(q+1)*40503)>>>0;var px=cx+(h%997)/997*cw,py=cy+((h>>>10)%991)/991*ch,sz=1.2+((h>>>20)%4)*0.6;x.fillStyle='rgba('+(58+(h%30))+','+(120+(h>>>7)%40)+',52,'+(0.3+0.3*a).toFixed(2)+')';x.fillRect(px,py,sz,sz);}}
  GLC=c;GLK=k;return c;}
if(typeof tvDraw==='function'){var _tvd=tvDraw;tvDraw=function(){_tvd.apply(this,arguments);try{if(OWN&&OWN.glass&&TV.T&&TV.T===ownT()){var x=TV.cv.getContext('2d');x.setTransform(1,0,0,1,0,0);x.drawImage(glassLayer(TV.W,TV.H,TV.dpr,OWN.glass),0,0);}}catch(e){}};}
// Your tank's mess, water and wellbeing come from the game; the land's own day does nothing to it
if(typeof tankDay==='function'){var _td=tankDay;tankDay=function(T,d){if(T.own&&OWN)return;return _td(T,d);};}
if(typeof wellbeing==='function'){var _wb=wellbeing;wellbeing=function(T){if(T&&T.own&&OWN&&OWN.well)return {total:OWN.well.total,parts:OWN.well.parts.map(function(q){return q.slice();})};return _wb(T);};}
// births and deaths in Your tank come from the game; here they only grow older
if(typeof breedDay==='function'){var _bd=breedDay;breedDay=function(T,d){if(!T.own)return _bd(T,d);T.shrimp.forEach(function(i){i.eggs=null;});};}
// the land's day is the game's day
function gameTime(day){if(day==null||!isFinite(day))return;window.GDAY=day;if(S.gday==null||S.gday>day){S.gday=day;return;}var n=Math.floor(day)-Math.floor(S.gday);if(n>=1){S.gday=day;advance(Math.min(n,365));}}
// after the company is sold the land is all there is: the back button opens your years and settings instead (Pass 161)
// after leaving Earth (the game sends voy) the back button goes to Space (Pass 170)
function leftBack(){var b=$('tb-back');if(!b)return;b.innerHTML=LEFT?'<span aria-hidden="true">≡</span><i> Your years</i>':'<span aria-hidden="true">‹</span><i> '+(VOY?'Space':'Company')+'</i>';b.setAttribute('aria-label',LEFT?'Your years at the company, settings':VOY?'Back to Space':'Back to the company');}
// a card waiting at the company, or frozen accounts
function needBar(){var b=$('lneed');if(!NEED){if(b)b.remove();return;}if(!b){b=document.createElement('button');b.type='button';b.id='lneed';b.className='lneed';b.onclick=function(){try{LAND.settle();}catch(e){}save(true);sfx('click');post({type:'back'});};document.body.appendChild(b);}b.textContent=NEED+' Tap to go back.';}
window.addEventListener('message',function(e){var d=e.data;if(!d||!d.game||!S)return;
  if(d.type==='cash'){S.cash=d.cash;FROZEN=d.frozen||'';if(!!d.left!==!!LEFT||!!d.voy!==!!VOY){LEFT=d.left?1:0;VOY=d.voy?1:0;window.GM_AWAY=!!VOY;leftBack();}var nd=d.need||'';if(nd!==NEED){NEED=nd;needBar();}gameTime(d.day);updateHeader();}
  if(d.type==='own')syncOwn(d);});
// shrimp that leave your tank here leave it in the game too
var _move=netMoveTo;netMoveTo=function(T2){var T=ownT(),N=netList(),a=0,y=0,giv=[];if(T&&T2)N.forEach(function(e){if(T2!==T&&e.from===T.id){if(e.ind.age>=ADULT_DAYS)a++;else y++;}if(T2===T&&e.from!==T.id)giv.push({age:e.ind.age,g:gOf(e.ind)});});_move(T2);if(a+y)post({type:'take',adults:a,young:y,seq:++SEQ});if(giv.length)post({type:'give',list:giv,seq:++SEQ});};
var _sell=sellShrimp;sellShrimp=function(T,i){var own=T===ownT(),ad=i.age>=ADULT_DAYS;var p=_sell(T,i);if(own)post({type:'take',adults:ad?1:0,young:ad?0:1,seq:++SEQ});return p;};
// care jobs count as caring for your tank in the game
if(typeof toyEnd==='function'){var _end=toyEnd;toyEnd=function(){var r=_end.apply(this,arguments);try{report();}catch(e){}return r;};}

// ----- the header: back to the company, today's real time -----
function clock(){var d=new Date();return d.toLocaleDateString('en-GB',{weekday:'short'})+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
var _uh=updateHeader;updateHeader=function(){_uh();var b=$('b-date');if(b)b.textContent=clock();var lc=$('lclock');if(lc){lc.hidden=false;lc.textContent=clock();}var s=$('b-sub');if(s)s.textContent='';};
function shell(){['tb-info'].forEach(function(id){var e=$(id);if(e)e.remove();});var tag=document.querySelector('.devtag');if(tag)tag.remove();var sp=$('speed');if(sp)sp.remove();
  document.querySelectorAll('.tabs [data-tab="book"],.tabs [data-tab="try"]').forEach(function(b){b.remove();});
  var row=document.querySelector('.top .brand');if(row&&!$('tb-back')){var bb=document.createElement('button');bb.className='btn sm';bb.id='tb-back';bb.type='button';bb.innerHTML='<span aria-hidden="true">‹</span><i> Company</i>';bb.setAttribute('aria-label','Back to the company');bb.onclick=function(){try{LAND.settle();}catch(e){}save(true);sfx('click');post({type:LEFT?'menu':'back'});};row.insertBefore(bb,row.firstChild);}
  // one header row: back, cash, the Home / Tank switch, sound (Puti, 28 Oct: the big bottom tabs took room from the map)
  if(row&&!$('lseg')){var mo=$('b-money');if(mo)row.insertBefore(mo,$('tb-mute'));var sg=document.createElement('div');sg.className='lseg';sg.id='lseg';sg.setAttribute('role','tablist');
    sg.innerHTML='<button type="button" data-seg="home">Home</button><button type="button" data-seg="tank">Tank</button>';row.insertBefore(sg,$('tb-mute'));
    var td=$('tankdot');if(td)sg.querySelector('[data-seg="tank"]').appendChild(td);
    sg.querySelectorAll('[data-seg]').forEach(function(b){b.onclick=function(){sfx('click');setTab(b.dataset.seg);};});}
  document.body.classList.add('in-game');}
var _setTab=setTab;setTab=function(t,arg){var r=_setTab.apply(this,arguments);document.querySelectorAll('#lseg [data-seg]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.seg===activeTab));});return r;};

// ----- start: the land, from empty the first time; time that passed while away is caught up -----
var _save=save;save=function(now){if(S)S.savedAt=Date.now();return _save(now);};
var _toast=toast,quiet=0;toast=function(){if(quiet)return;return _toast.apply(this,arguments);};
var _boot=boot;boot=function(data){quiet=1;try{_boot(data);}finally{quiet=0;}
  shell();S.seen.hello=1;S.seen.cash1m=1;S.speed=1;S.opt.company='none';
  if(!S.land||!S.land.fresh){var c=S.cash;window.landFresh();S.cash=c;}
  S.stage=3;
  setTab(S.tab==='tank'?'tank':'home');updateHeader();save(true);post({type:'ready'});
  setInterval(updateHeader,15000);};
})();
