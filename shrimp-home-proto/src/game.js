// ===== Game link: the land inside Universal Shrimp (only in the game build, window.GAME_MODE) =====
// The game is the boss: its cash pays for everything, its own 20 L tank is Tank 1 here, and its company keeps running.
// Messages to the game: {land:1,type:'ready'|'spend'|'earn'|'take'|'care'|'back'}. From the game: {game:1,type:'cash'|'own'}.
(function(){
if(!window.GAME_MODE)return;
DAY_SEC=86400;                      // a second is a second
SAVE_KEY='shrimp-land-v1';
var P=window.parent!==window?window.parent:null;
function post(m){if(!P)return;m.land=1;try{P.postMessage(m,'*');}catch(e){}}
window.GAME_POST=post;
// no browser feel inside the game: no pinch zoom, no long-press menu (Puti, 28 Oct)
['gesturestart','gesturechange','gestureend'].forEach(function(k){document.addEventListener(k,function(e){e.preventDefault();},{passive:false});});
document.addEventListener('touchmove',function(e){if(e.touches&&e.touches.length>1)e.preventDefault();},{passive:false});
document.addEventListener('contextmenu',function(e){var t=e.target;if(!(t.closest&&t.closest('input,textarea')))e.preventDefault();});

// ----- money: the company's cash -----
spend=function(n,what){if(n<=0)return true;if(S.cash<n){toast('Not enough cash for '+what+'.');sfx('nope');return false;}
  S.cash-=n;post({type:'spend',n:n,what:what});updateHeader();save();return true;};
earn=function(n,what){if(n<=0)return;S.cash+=n;post({type:'earn',n:n,what:what});updateHeader();save();};

// ----- your own tank: Tank 1 here follows the game's tank 1 -----
var OWN=null;
function gradeOf(g){return clamp(1+Math.round((g||0)/100*7),1,8);}
function ownT(){return S.tanks[0]||null;}
function syncOwn(d){OWN=d;var T=ownT();if(!T||typeof newInd!=='function'||typeof GEN!=='object')return;T.name='Your tank';T.own=1;
  var A=Math.min(150,d.adults|0),Y=Math.min(150,d.young|0),g=gradeOf(d.g),ad=T.shrimp.filter(function(i){return i.age>=ADULT_DAYS;}),yo=T.shrimp.filter(function(i){return i.age<ADULT_DAYS;}),N=netList();
  function inNet(i){return N.some(function(e){return e.ind===i;});}
  function add(n,adult){for(var k=0;k<n;k++){var i=newInd({from:'grandma',sex:Math.random()<0.5?'f':'m',age:adult?Math.floor(ADULT_DAYS+10+Math.random()*150):Math.floor(8+Math.random()*(ADULT_DAYS-12)),dna:GEN.forStrain('red',gradeOf(d.g+(Math.random()-0.5)*20))});T.shrimp.push(i);}}
  function cut(list,n){list=list.filter(function(i){return !inNet(i)&&!i.name;}).sort(function(a,b){return b.age-a.age;});var gone=list.slice(0,n);T.shrimp=T.shrimp.filter(function(i){return gone.indexOf(i)<0;});}
  if(ad.length<A)add(A-ad.length,true);else if(ad.length>A)cut(ad,ad.length-A);
  if(yo.length<Y)add(Y-yo.length,false);else if(yo.length>Y)cut(yo,yo.length-Y);
  if(activeTab==='tank'&&typeof tvSync==='function')try{tvSync();}catch(e){}}
window.addEventListener('message',function(e){var d=e.data;if(!d||!d.game||!S)return;
  if(d.type==='cash'){S.cash=d.cash;updateHeader();}
  if(d.type==='own')syncOwn(d);});
// shrimp that leave your tank here leave it in the game too
var _move=netMoveTo;netMoveTo=function(T2){var T=ownT(),N=netList(),a=0,y=0;if(T&&T2&&T2!==T)N.forEach(function(e){if(e.from===T.id){if(e.ind.age>=ADULT_DAYS)a++;else y++;}});_move(T2);if(a+y)post({type:'take',adults:a,young:y});};
var _sell=sellShrimp;sellShrimp=function(T,i){var own=T===ownT(),ad=i.age>=ADULT_DAYS;var p=_sell(T,i);if(own)post({type:'take',adults:ad?1:0,young:ad?0:1});return p;};
// care jobs count as caring for your tank in the game
if(typeof toyEnd==='function'){var _end=toyEnd;toyEnd=function(){var r=_end.apply(this,arguments);try{if(S.tanks[S.sel]===ownT())post({type:'care'});}catch(e){}return r;};}

// ----- the header: back to the company, today's real time -----
function clock(){var d=new Date();return d.toLocaleDateString('en-GB',{weekday:'short'})+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
var _uh=updateHeader;updateHeader=function(){_uh();var b=$('b-date');if(b)b.textContent=clock();var s=$('b-sub');if(s)s.textContent='';};
function shell(){['tb-info'].forEach(function(id){var e=$(id);if(e)e.remove();});var tag=document.querySelector('.devtag');if(tag)tag.remove();var sp=$('speed');if(sp)sp.remove();
  document.querySelectorAll('.tabs [data-tab="book"],.tabs [data-tab="try"]').forEach(function(b){b.remove();});
  var row=document.querySelector('.top .brand');if(row&&!$('tb-back')){var bb=document.createElement('button');bb.className='btn sm';bb.id='tb-back';bb.type='button';bb.textContent='Back to the company';bb.onclick=function(){save(true);sfx('click');post({type:'back'});};row.insertBefore(bb,row.firstChild);}
  document.body.classList.add('in-game');}

// ----- start: the land, from empty the first time; time that passed while away is caught up -----
var _save=save;save=function(now){if(S)S.savedAt=Date.now();return _save(now);};
var _toast=toast,quiet=0;toast=function(){if(quiet)return;return _toast.apply(this,arguments);};
var _boot=boot;boot=function(data){quiet=1;try{_boot(data);}finally{quiet=0;}
  shell();S.seen.hello=1;S.seen.cash1m=1;S.speed=1;S.opt.company='none';
  if(!S.land||!S.land.fresh){var c=S.cash;window.landFresh();S.cash=c;}
  S.stage=3;
  if(S.savedAt){var away=(Date.now()-S.savedAt)/1000;if(away>5)advance(Math.min(away,30*86400)/DAY_SEC);}
  setTab(S.tab==='tank'?'tank':'home');updateHeader();save(true);post({type:'ready'});
  setInterval(updateHeader,15000);};
})();
