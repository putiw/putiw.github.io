// ===== Book: everything you've found =====
// Missing entries are solid black silhouettes, like Puti's silhouette drawings.
var bookMod={name:'book',tab:'shrimp',
 show:function(){bookMod.render();},
 bookChanged:function(){if(activeTab==='book'){clearTimeout(bookMod.t);bookMod.t=setTimeout(bookMod.render,250);}},
 render:function(){if(activeTab!=='book')return;var el=$('p-book');var ord=function(c){return BOOK[c].order!=null?BOOK[c].order:9;};var cats=Object.keys(BOOK).sort(function(a,b){return ord(a)-ord(b);});
  if(cats.indexOf(bookMod.tab)<0)bookMod.tab=cats[0];
  var total=0,found=0;cats.forEach(function(c){total+=BOOK[c].entries.length;found+=BOOK[c].entries.filter(function(e){return bookHas(c,e.id);}).length;});
  var h='<div class="card"><div class="hd"><h2>The book</h2><small>'+found+' of '+total+' found</small></div><div class="bprog"><i style="width:'+(total?found/total*100:0).toFixed(1)+'%"></i></div><div class="chips" id="bk-tabs">'+
   cats.map(function(c){var n=BOOK[c].entries.filter(function(e){return bookHas(c,e.id);}).length;return '<button class="tchip" data-bk="'+c+'" aria-pressed="'+(c===bookMod.tab)+'">'+esc(BOOK[c].title)+' · '+n+'/'+BOOK[c].entries.length+'</button>';}).join('')+'</div></div>';
  var C=BOOK[bookMod.tab],open=el.querySelector('details[open]')!=null;
  if(C.head)h+='<div class="card" id="bk-head"></div>';
  h+='<div class="card"><div class="hd"><h2>'+esc(C.title)+'</h2><small>'+esc(C.note||'')+'</small></div><div class="bgrid">';
  C.entries.forEach(function(e,i){var got=S.book[bookMod.tab]&&S.book[bookMod.tab][e.id];var hint=e.hint||(bookMod.tab==='shrimp'&&e.col&&typeof shrimpHint==='function'?shrimpHint(e):'')||'';
   var sub=got?(e.grades&&got.best!=null?'Best '+GRADE_NAMES[got.best]+' · day '+got.day:'Day '+got.day+(got.tank?' · '+got.tank:got.where?' · '+got.where:'')):(hint||' ');
   h+='<div class="bent'+(got?'':' no')+'"><canvas data-be="'+i+'" width="180" height="96"></canvas><b>'+(got?esc(e.name):'?')+'</b><small>'+esc(sub)+'</small></div>';});
  h+='</div></div>';el.innerHTML=h;
  if(C.head){try{C.head($('bk-head'));if(open){var d=el.querySelector('#bk-head details');if(d)d.open=true;}}catch(err){console.error(err);}}
  el.querySelectorAll('[data-bk]').forEach(function(b){b.onclick=function(){bookMod.tab=b.dataset.bk;sfx('click');bookMod.render();};});
  el.querySelectorAll('canvas[data-be]').forEach(function(cv){var e=C.entries[+cv.dataset.be],got=S.book[bookMod.tab]&&S.book[bookMod.tab][e.id];var w=90,h2=48,x=fitCanvas(cv,w,h2);cv.style.width='90px';cv.style.height='48px';
   whenArt(function(){x.clearRect(0,0,w,h2);try{e.draw(x,w,h2,got);}catch(err){}if(!got){x.save();x.globalCompositeOperation='source-atop';x.fillStyle='#22201b';x.fillRect(0,0,w,h2);x.restore();}});});}};
registerMod(bookMod);registerTab('book',bookMod);
