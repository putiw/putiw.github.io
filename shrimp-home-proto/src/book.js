// ===== Book: everything you've found =====
var bookMod={name:'book',tab:'shrimp',
 show:function(){bookMod.render();},
 bookChanged:function(){if(activeTab==='book')bookMod.render();},
 render:function(){if(activeTab!=='book')return;var el=$('p-book');var ord=function(c){return BOOK[c].order!=null?BOOK[c].order:9;};var cats=Object.keys(BOOK).sort(function(a,b){return ord(a)-ord(b);});
  if(cats.indexOf(bookMod.tab)<0)bookMod.tab=cats[0];
  var total=0,found=0;cats.forEach(function(c){total+=BOOK[c].entries.length;found+=BOOK[c].entries.filter(function(e){return bookHas(c,e.id);}).length;});
  var h='<div class="card"><div class="hd"><h2>The book</h2><small>'+found+' of '+total+' found</small></div><div class="bprog"><i style="width:'+(total?found/total*100:0).toFixed(1)+'%"></i></div><div class="chips" id="bk-tabs">'+
   cats.map(function(c){var n=BOOK[c].entries.filter(function(e){return bookHas(c,e.id);}).length;return '<button class="tchip" data-bk="'+c+'" aria-pressed="'+(c===bookMod.tab)+'">'+esc(BOOK[c].title)+' · '+n+'/'+BOOK[c].entries.length+'</button>';}).join('')+'</div></div>';
  var C=BOOK[bookMod.tab];h+='<div class="card"><div class="hd"><h2>'+esc(C.title)+'</h2><small>'+esc(C.note||'')+'</small></div><div class="bgrid">';
  C.entries.forEach(function(e,i){var got=S.book[bookMod.tab]&&S.book[bookMod.tab][e.id];var hint=e.hint||(bookMod.tab==='shrimp'&&e.col?shrimpHint(e):'')||'';
   h+='<div class="bent'+(got?'':' no')+'"><canvas data-be="'+i+'" width="180" height="96"></canvas><b>'+(got?esc(e.name):'?')+'</b><small>'+(got?esc('Day '+got.day+(got.tank?' · '+got.tank:got.where?' · '+got.where:'')):esc(hint||' '))+'</small></div>';});
  h+='</div></div>';el.innerHTML=h;
  el.querySelectorAll('[data-bk]').forEach(function(b){b.onclick=function(){bookMod.tab=b.dataset.bk;sfx('click');bookMod.render();};});
  el.querySelectorAll('canvas[data-be]').forEach(function(cv){var e=C.entries[+cv.dataset.be],got=S.book[bookMod.tab]&&S.book[bookMod.tab][e.id];var w=90,h2=48,x=fitCanvas(cv,w,h2);cv.style.width='90px';cv.style.height='48px';
   whenArt(function(){x.clearRect(0,0,w,h2);try{e.draw(x,w,h2);}catch(err){}if(!got){x.save();x.globalCompositeOperation='source-atop';x.fillStyle='#d6cdb9';x.fillRect(0,0,w,h2);x.restore();}});});}};
registerMod(bookMod);registerTab('book',bookMod);

function shrimpHint(e){var t=e.id.split(':')[1];if(t==='rili')return 'A clear band, rare';if(t==='2')return 'Keep the best';if(t==='3')return 'Years of picking';return COLOUR_HINTS[e.col]||(t==='0'?'Starts pale':'');}
