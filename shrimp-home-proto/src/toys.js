// ===== Hands-on jobs: vacuum, sponge, trim, pests, aquascape =====
// Each one: touch the mess, it goes away, the before and after is obvious, it never fails.
var TOY=null;
var TOYS=[
 {id:'vac',name:'Vacuum',idle:function(T){var m=mulmMean(T);return m>0.2?'a bit dirty':'gravel clean';},icon:function(x,w,h){inkPath(x,[[w*0.42,h*0.12],[w*0.42,h*0.88]],{w:1.4,amp:0});inkPath(x,[[w*0.62,h*0.12],[w*0.62,h*0.88]],{w:1.4,amp:0});x.fillStyle='rgba(169,209,211,.6)';x.fillRect(w*0.43,h*0.14,w*0.18,h*0.72);inkPath(x,[[w*0.52,h*0.12],[w*0.6,h*0.02],[w*0.9,h*0.1]],{w:1.4,amp:0});x.fillStyle='#7a5a36';for(var i=0;i<4;i++){x.beginPath();x.arc(w*(0.47+i*0.04),h*(0.7-i*0.12),1.1,0,6.283);x.fill();}}},
 {id:'sponge',name:'Sponge',idle:function(T){return 'flow '+Math.round(T.flow*100)+'%';},icon:function(x,w,h){inkBlob(x,w*0.5,h*0.55,w*0.24,h*0.32,{fill:'#c9a25e',seed:3,irr:0.06,w:1.3});x.fillStyle='rgba(90,60,30,.5)';for(var i=0;i<6;i++){x.beginPath();x.arc(w*(0.36+0.1*(i%3)),h*(0.42+0.2*Math.floor(i/3)),1.1,0,6.283);x.fill();}}},
 {id:'trim',name:'Trim',idle:function(T){return overgrowth(T)>0.45?'growing':'neat';},icon:function(x,w,h){x.strokeStyle=INK;x.lineWidth=1.4;x.beginPath();x.arc(w*0.3,h*0.72,h*0.16,0,6.283);x.stroke();x.beginPath();x.arc(w*0.3,h*0.3,h*0.16,0,6.283);x.stroke();inkPath(x,[[w*0.4,h*0.64],[w*0.9,h*0.3]],{w:1.4,amp:0});inkPath(x,[[w*0.4,h*0.38],[w*0.9,h*0.72]],{w:1.4,amp:0});}},
 {id:'pests',name:'Pests',idle:function(T){var n=T.pests.length;return n?plural(n,'snail','snails'):'none';},icon:function(x,w,h){x.fillStyle='#8a4a30';x.beginPath();x.arc(w*0.55,h*0.6,h*0.22,0,6.283);x.fill();x.strokeStyle=INK;x.lineWidth=1.2;x.stroke();x.beginPath();x.arc(w*0.56,h*0.6,h*0.11,0,5.2);x.stroke();inkPath(x,[[w*0.18,h*0.08],[w*0.42,h*0.44]],{w:1.3,amp:0});inkPath(x,[[w*0.3,h*0.04],[w*0.46,h*0.42]],{w:1.3,amp:0});}},
 {id:'scape',name:'Aquascape',idle:function(T){return T.scape.length?plural(T.scape.length,'piece','pieces'):'empty';},icon:function(x,w,h){inkBlob(x,w*0.38,h*0.76,w*0.24,h*0.17,{fill:'#a9a9a3',seed:6,w:1.2});x.strokeStyle='#4f7f33';x.lineWidth=1.4;x.beginPath();x.moveTo(w*0.7,h*0.9);x.quadraticCurveTo(w*0.66,h*0.5,w*0.74,h*0.12);x.stroke();x.fillStyle='#7cbf4f';[0.3,0.5,0.7].forEach(function(t){x.beginPath();x.ellipse(w*0.72+(t*10%2?3:-3),h*(0.9-t*0.7),3,1.4,0.5,0,6.283);x.fill();});}}];
function toyBar(html){var b=$('lockbar');if(!b)return;b.innerHTML=html;var js=$('jobslot');if(js)js.classList.add('on');}
function lockOn(){document.body.classList.add('locked');if(!document.querySelector('.lockdim')){var d=document.createElement('div');d.className='lockdim';d.onclick=function(){if(TOY&&TOY.finish)TOY.finish();else if(TOY)toyEnd();};document.body.appendChild(d);}
  var tv=$('tv');if(tv)tv.classList.add('locked');}
function lockOff(){document.body.classList.remove('locked');var d=document.querySelector('.lockdim');if(d)d.remove();var tv=$('tv');if(tv)tv.classList.remove('locked');var b=$('lockbar');if(b)b.innerHTML='';var js=$('jobslot');if(js)js.classList.remove('on');var tp=$('toypanel');if(tp)tp.innerHTML='';}
function toyStart(id){if(TOY)toyEnd();var T=S.tanks[S.sel];closeBubble();
  if(id==='sponge')return openSponge(T);
  var mk={vac:vacToy,trim:trimToy,pests:pestToy,scape:scapeToy}[id];if(!mk)return;TOY=mk(T);TOY.id=id;TOY.T=T;hold();lockOn();if(TOY.start)TOY.start();tankMod.renderSide();}
function toyEnd(){if(!TOY)return;var t=TOY;TOY=null;if(t.end)try{t.end();}catch(e){console.error(e);}lockOff();release();TV.L={};tvSync(true);tankMod.renderSide();save();}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-toyact]');if(!b||!TOY)return;var k=b.dataset.toyact;if(k==='done'){if(TOY.finish)TOY.finish();else toyEnd();}else if(TOY.act)TOY.act(k,b);});
function barHtml(text,btns){return '<span>'+text+'</span>'+(btns||'')+'<button class="btn primary" data-toyact="done">Done</button>';}

// ---------- 1. Gravel vacuum ----------
// Drag anywhere and the tube moves with your finger, by the same amount. Hold its top, or drag from
// below the tank so your thumb never covers the mouth (Puti: the fingertip blocked the bottom).
// The brown fluff swirls up the tube, the water level drops, the bucket fills.
// A full bucket is a 30% change. Babies near the tube get pulled in, so you check the bucket and tap them back.
function vacToy(T){var V={p:null,on:false,water:0,cap:0.3,dirt:0,babies:[],parts:[],grains:[],mode:'vac',snd:null,no3a:T.no3,pour:0,refill:0,bucketBabies:[]};
  V.start=function(){V.snd=sfxLoop('siphon');V.bar();};
  V.bar=function(){if(V.mode==='vac')toyBar(barHtml(V.water>=0.999?'Bucket full. Check it for babies.':'Drag to move the tube over the gravel. Your finger can stay below it. Bucket '+Math.round(V.water*100)+'%'+(V.babies.length?' · '+plural(V.babies.length,'baby','babies')+' in it':''),''));
    else if(V.mode==='bucket')toyBar('<span>'+(V.babies.length?'Tap the babies to put them back':'Nothing alive in the bucket')+'</span><button class="btn primary" data-toyact="pour"'+(V.babies.length?' disabled':'')+'>Pour it out</button>');
    else toyBar('<span>Refilling with fresh water…</span>');};
  V.down=function(p){if(V.mode==='bucket'){V.tapBucket(p);return;}if(V.mode!=='vac'||V.water>=0.999)return;var tb=V.tube();V.grab={x:p[0],y:p[1],tx:tb.x,ty:tb.top};V.on=true;};
  V.move=function(p){if(!V.on||!V.grab)return;V.tx=V.grab.tx+(p[0]-V.grab.x);V.ty=V.grab.ty+(p[1]-V.grab.y);V.p=1;};
  V.up=function(){V.on=false;if(V.snd)V.snd.set(0);};
  V.finish=function(){if(V.mode==='vac'){if(V.water<0.02){toyEnd();return;}V.on=false;V.mode='bucket';V.layoutBucket();V.bar();sfx('pour',{v:0.4});}else if(V.mode==='bucket'){if(V.babies.length){toast('Put the babies back first');return;}V.act('pour');}};
  V.act=function(k){if(k==='pour'&&V.mode==='bucket'){V.mode='refill';V.refill=0;sfx('pour');V.bar();}};
  V.end=function(){if(V.snd)V.snd.stop();// anything still in the bucket goes back
    V.babies.forEach(function(i){V.back(i);});V.babies=[];T.level=1;TV.ag.forEach(function(a){a.hidden=false;});};
  V.tube=function(){var W=TV.W,H=TV.H,len=H*0.36,tw=Math.max(16,W*0.05);if(V.tx==null){V.tx=W*0.5;V.ty=H*0.5;}V.tx=clamp(V.tx,tw,W-tw);V.ty=clamp(V.ty,H*0.06,H*0.93-len);return {x:V.tx,y:V.ty+len,w:tw,top:V.ty};};
  V.step=function(dt){var W=TV.W,H=TV.H;if(V.mode==='vac'){var tb=V.tube(),active=V.on&&V.water<0.999;
     if(V.snd)V.snd.set(active?(tb.y>H*0.74?1:0.55):0);
     if(active){V.water=Math.min(1,V.water+dt/10);T.level=1-V.water*V.cap;
      if(tb.y>H*0.73){var R=tb.w*1.2;for(var i=0;i<MULM_N;i++){var cx=(i+0.5)/MULM_N*W,d=Math.abs(cx-tb.x);if(d<R&&T.mulm[i]>0){var take=Math.min(T.mulm[i],dt*2.4*(1-d/R));T.mulm[i]-=take;V.dirt+=take;var n=Math.ceil(take*40);for(var q=0;q<n;q++)V.parts.push({x:cx+rnd(-3,3),y:H*rnd(0.78,0.9),t:0,c:Math.random()<0.7?'rgba(96,70,40,.85)':'rgba(140,110,70,.7)',r:rnd(1,2.2),sw:rnd(0,6.28)});}}
        if(Math.random()<dt*14)V.grains.push({x:tb.x+rnd(-tb.w*0.35,tb.w*0.35),y:tb.y-2,vy:-rnd(30,60),t:0});}
      // babies get pulled toward the tube
      TV.ag.forEach(function(a){if(a.sc>0.5||a.hidden)return;var dx=tb.x-a.x,dy=tb.y-a.y,d=Math.hypot(dx,dy);if(d<tb.w*1.8){if(d<tb.w*0.45){a.hidden=true;var ind=a.ind;T.shrimp=T.shrimp.filter(function(z){return z!==ind;});V.babies.push(ind);V.parts.push({x:tb.x,y:tb.y,t:0,baby:1,c:'#fff',r:2.4,sw:0});V.bar();}else{var sp=tvBase()*0.9;a.pull=[dx/d*sp,dy/d*sp];}}});
      if(V.water>=0.999){V.on=false;if(V.snd)V.snd.set(0);V.bar();sfx('plop');}
      else if((V.bt=(V.bt||0)+dt)>0.5){V.bt=0;V.bar();}}
     // particles ride up the tube and out the hose
     V.parts.forEach(function(p){p.t+=dt;var tb2=V.tube();var tx=tb2.x+Math.sin(p.t*9+p.sw)*tb2.w*0.3;p.x+=(tx-p.x)*Math.min(1,dt*8);p.y-=dt*(140+p.t*120);});var tt=V.tube().top;V.parts=V.parts.filter(function(p){return p.y>tt+2&&p.t<3;});
     V.grains.forEach(function(g){g.t+=dt;g.vy+=dt*160;g.y+=g.vy*dt;});V.grains=V.grains.filter(function(g){return g.t<0.6;});}
   else if(V.mode==='bucket'){V.bucketBabies.forEach(function(b){b.a+=(Math.random()-0.5)*dt*3;b.x+=Math.cos(b.a)*dt*10;b.y+=Math.sin(b.a)*dt*10;var dx=b.x-V.bk.cx,dy=(b.y-V.bk.cy)/0.62;if(Math.hypot(dx,dy)>V.bk.r*0.78){b.a+=Math.PI;b.x-=Math.cos(b.a)*2;}});}
   else if(V.mode==='refill'){V.refill=Math.min(1,V.refill+dt/2.2);T.level=1-V.cap*V.water*(1-V.refill);if(V.refill>=1){var frac=V.water*V.cap,b0=Math.round(T.no3);T.no3=Math.max(2,T.no3*(1-frac));T.lastWC=Math.floor(S.day);T.lastClean.vac=Math.floor(S.day);
      toast('Changed '+Math.round(frac*100)+'% of the water'+(effectsOn()?'. Nitrate '+b0+' → '+Math.round(T.no3)+' ppm':'')+'.');toyEnd();}}};
  V.layoutBucket=function(){var W=TV.W,H=TV.H;V.bk={cx:W/2,cy:H*0.52,r:Math.min(W*0.3,H*0.62)};V.bucketBabies=V.babies.map(function(i){return {ind:i,x:V.bk.cx+rnd(-1,1)*V.bk.r*0.4,y:V.bk.cy+rnd(-1,1)*V.bk.r*0.25,a:rnd(0,6.28)};});
    V.specks=[];var n=Math.round(20+V.dirt*260);for(var i=0;i<Math.min(260,n);i++){var a=Math.random()*6.283,rr=Math.sqrt(Math.random())*V.bk.r*0.8;V.specks.push([V.bk.cx+Math.cos(a)*rr,V.bk.cy+Math.sin(a)*rr*0.62,rnd(0.8,2.2)]);}};
  V.tapBucket=function(p){var hit=null,bd=1e9;V.bucketBabies.forEach(function(b){var d=Math.hypot(p[0]-b.x,p[1]-b.y);if(d<22&&d<bd){bd=d;hit=b;}});if(!hit)return;V.bucketBabies.splice(V.bucketBabies.indexOf(hit),1);V.babies.splice(V.babies.indexOf(hit.ind),1);V.back(hit.ind);sfx('plip');V.bar();};
  V.back=function(ind){T.shrimp.push(ind);var a=TV.ag.find(function(z){return z.id===ind.id;});if(a){a.hidden=false;a.x=rnd(TV.W*0.2,TV.W*0.8);a.y=TV.H*0.32;a.surf='water';a.intent='swim';var sp=tvSpot('sand');a.tx=sp.x;a.ty=sp.y;a.tsurf='sand';a.speed=tvBase()*0.3;a.left=8;}};
  V.draw=function(x,g,t){var W=TV.W,H=TV.H;if(V.mode==='vac'){var tb=V.tube();
     // the gravel vac: a clear tube with a hose out of the top
     x.save();x.fillStyle='rgba(255,255,255,.22)';x.fillRect(tb.x-tb.w/2,tb.top,tb.w,tb.y-tb.top);
     V.grains.forEach(function(gr){x.fillStyle='#d8c294';x.beginPath();x.arc(gr.x,gr.y,1.3,0,6.283);x.fill();});
     V.parts.forEach(function(p){x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill();});
     inkPath(x,[[tb.x-tb.w/2,tb.top],[tb.x-tb.w/2,tb.y]],{w:1.4,amp:0.3,seed:3});inkPath(x,[[tb.x+tb.w/2,tb.top],[tb.x+tb.w/2,tb.y]],{w:1.4,amp:0.3,seed:4});
     x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=2;x.beginPath();x.moveTo(tb.x-tb.w*0.25,tb.top+4);x.lineTo(tb.x-tb.w*0.25,tb.y-4);x.stroke();
     var hx=tb.x+(tb.x<W*0.6?1:-1)*W*0.25;x.strokeStyle='rgba(44,40,35,.85)';x.lineWidth=Math.max(4,tb.w*0.32);x.lineCap='round';x.beginPath();x.moveTo(tb.x,tb.top);x.quadraticCurveTo(tb.x,tb.top-H*0.1,clamp(hx,4,W-4),Math.max(2,tb.top-H*0.06));x.stroke();
     x.strokeStyle='rgba(200,225,228,.55)';x.lineWidth=Math.max(2,tb.w*0.16);x.beginPath();x.moveTo(tb.x,tb.top);x.quadraticCurveTo(tb.x,tb.top-H*0.1,clamp(hx,4,W-4),Math.max(2,tb.top-H*0.06));x.stroke();
     // the grip: a dark rubber cap where your finger holds it
     var gw=tb.w*1.35,gh=Math.max(12,tb.w*0.75);x.fillStyle='#3d3a33';x.beginPath();x.roundRect?x.roundRect(tb.x-gw/2,tb.top-2,gw,gh,4):x.rect(tb.x-gw/2,tb.top-2,gw,gh);x.fill();
     x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=1;for(var gi=1;gi<4;gi++){x.beginPath();x.moveTo(tb.x-gw/2+3,tb.top-2+gh*gi/4);x.lineTo(tb.x+gw/2-3,tb.top-2+gh*gi/4);x.stroke();}x.restore();
     if(!V.p){x.save();x.globalAlpha=0.55+0.3*Math.sin(t*3);x.fillStyle='#fff';x.font='600 12px Inter,system-ui';x.textAlign='center';x.fillText('drag anywhere',tb.x,tb.top+gh+14);x.restore();}}
   };
  V.drawTop=function(x,g,t){var W=TV.W,H=TV.H;
   // bucket gauge, top left
   if(V.mode!=='bucket'){var bx=10,by=8,bw=34,bh=30;x.save();x.fillStyle='rgba(251,248,241,.92)';x.beginPath();x.moveTo(bx,by);x.lineTo(bx+bw,by);x.lineTo(bx+bw-4,by+bh);x.lineTo(bx+4,by+bh);x.closePath();x.fill();var lv=V.water;
     x.save();x.clip();x.fillStyle=mixC('#a9d1d3','#7a5a36',clamp(V.dirt*2.2,0,0.85));x.fillRect(bx,by+bh*(1-lv),bw,bh*lv);x.restore();
     x.strokeStyle=INK;x.lineWidth=1.3;x.stroke();x.beginPath();x.arc(bx+bw/2,by,bw*0.42,Math.PI,0);x.stroke();x.restore();
     if(V.babies.length){x.fillStyle=INK;x.font='600 11px Inter,system-ui';x.fillText(plural(V.babies.length,'baby','babies'),bx+bw+6,by+bh*0.7);}}
   if(V.mode==='bucket'){var b=V.bk;x.save();x.fillStyle='rgba(34,32,27,.35)';x.fillRect(0,0,W,H);
     x.fillStyle='#e9e2d1';x.beginPath();x.ellipse(b.cx,b.cy,b.r*1.06,b.r*0.68,0,0,6.283);x.fill();x.strokeStyle=INK;x.lineWidth=1.6;x.stroke();
     x.fillStyle=mixC('#b9d6d2','#6e5230',clamp(V.dirt*2.2,0.15,0.85));x.beginPath();x.ellipse(b.cx,b.cy,b.r*0.92,b.r*0.58,0,0,6.283);x.fill();
     V.specks.forEach(function(s){x.fillStyle='rgba(70,50,28,.6)';x.beginPath();x.arc(s[0]+Math.sin(t+s[1])*0.6,s[1],s[2],0,6.283);x.fill();});
     V.bucketBabies.forEach(function(bb){x.save();x.translate(bb.x,bb.y);x.rotate(bb.a);var L=tvBase()*0.5;x.drawImage(bodyCanvas(specOf(bb.ind)),-L/2,-L*SH/SW/2,L,L*SH/SW);x.restore();x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1.5;x.beginPath();x.arc(bb.x,bb.y,13+Math.sin(t*4)*1.5,0,6.283);x.stroke();});
     x.fillStyle='#fff';x.font='600 12px Inter,system-ui';x.textAlign='center';x.fillText('The bucket',b.cx,b.cy-b.r*0.72);x.restore();}
   if(V.mode==='refill'){var k=Math.sin(Math.min(1,V.refill*3)*Math.PI/2),bx2=W*0.16,by2=H*0.05,bw2=40,bh2=34,wy2=H*WATER_TOP+(1-T.level)*H*(SAND_TOP-WATER_TOP);
     x.save();x.strokeStyle='rgba(205,232,236,.95)';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(bx2+bw2*0.95,by2+bh2*0.3);x.quadraticCurveTo(bx2+bw2*1.25,by2+bh2,bx2+bw2*1.2,wy2);x.stroke();
     x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=2;x.beginPath();x.moveTo(bx2+bw2*0.97,by2+bh2*0.35);x.quadraticCurveTo(bx2+bw2*1.22,by2+bh2,bx2+bw2*1.17,wy2);x.stroke();
     for(var q=0;q<5;q++){var sx=bx2+bw2*1.2+Math.sin(t*9+q)*7,sy=wy2+Math.abs(Math.cos(t*7+q*1.7))*6;x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(sx,sy,1.4,0,6.283);x.fill();}
     x.translate(bx2+bw2/2,by2+bh2/2);x.rotate(0.9*k);x.translate(-bw2/2,-bh2/2);x.beginPath();x.moveTo(0,0);x.lineTo(bw2,0);x.lineTo(bw2-5,bh2);x.lineTo(5,bh2);x.closePath();x.fillStyle='#e9e2d1';x.fill();x.save();x.clip();x.fillStyle='#bfe1e8';x.fillRect(0,bh2*0.25,bw2,bh2);x.restore();x.strokeStyle=INK;x.lineWidth=1.4;x.stroke();x.beginPath();x.arc(bw2/2,0,bw2*0.42,Math.PI,0);x.stroke();x.restore();}};
  return V;}

// ---------- 2. Filter sponge (its own scene) ----------
function openSponge(T){var P={stage:'squeeze',dirt:clamp(1-T.flow,0.1,1),water:'old',murk:0,sq:0,parts:[],bub:[],warned:false,t:0,press:false,dn:0};
  openSheet({title:'Clean the filter sponge',onClose:function(){P.dead=true;if(P.upH)window.removeEventListener('pointerup',P.upH);},mount:function(el,api){
    el.innerHTML='<p class="hint" id="sp-line">Press and hold to squeeze, let go to let it soak. Old tank water keeps the good bacteria in it alive.</p><canvas class="sortcv" id="sp-cv" style="aspect-ratio:1.25/1;margin-top:8px"></canvas><div class="btns" id="sp-btns"></div>';
    var cv=$('sp-cv');var W=0,H=0,x=null;function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;x=fitCanvas(cv,W,H);}size();
    function btns(h){$('sp-btns').innerHTML=h;}function line(t){$('sp-line').textContent=t;}
    function flow(){return clamp(1-P.dirt*0.95,0.05,1);}
    function bucketAt(cx,cy,bw,bh,col,lab,tap){x.save();var top=cy-bh/2,bot=cy+bh/2;x.beginPath();x.moveTo(cx-bw/2,top);x.lineTo(cx+bw/2,top);x.lineTo(cx+bw*0.4,bot);x.lineTo(cx-bw*0.4,bot);x.closePath();x.fillStyle='#d9d2c2';x.fill();
      x.save();x.clip();x.fillStyle=col;x.fillRect(cx-bw/2,top+bh*0.18,bw,bh);x.restore();x.strokeStyle=INK;x.lineWidth=1.6;x.stroke();x.beginPath();x.ellipse(cx,top,bw/2,bh*0.07,0,0,6.283);x.stroke();
      x.beginPath();x.arc(cx,top,bw*0.46,Math.PI*1.05,Math.PI*1.95);x.stroke();
      if(tap){x.fillStyle='#8c8c86';x.fillRect(cx+bw*0.12,top-bh*0.42,bw*0.32,bh*0.08);x.fillRect(cx+bw*0.34,top-bh*0.42,bw*0.08,bh*0.22);x.strokeStyle=INK;x.lineWidth=1.2;x.strokeRect(cx+bw*0.12,top-bh*0.42,bw*0.32,bh*0.08);
        x.strokeStyle='rgba(169,209,211,.9)';x.lineWidth=3;x.beginPath();x.moveTo(cx+bw*0.38,top-bh*0.2);x.lineTo(cx+bw*0.38,top+bh*0.18);x.stroke();}
      x.fillStyle=INK;x.font='600 13px Inter,system-ui';x.textAlign='center';x.fillText(lab,cx,bot+18);x.restore();}
    function sponge(cx,cy,w,h){var sq=P.sq,sx=1+sq*0.22,sy=1-sq*0.32;x.save();x.translate(cx,cy);x.scale(sx,sy);var col=mixC('#e2c983','#5e4426',clamp(P.dirt,0,1));inkBlob(x,0,0,w/2,h/2,{fill:col,seed:21,irr:0.05,w:1.6,wash:0.9});
      var r=mulberry32(5);for(var i=0;i<34;i++){x.fillStyle=rgba(shadeC(col,-0.35),0.55);x.beginPath();x.ellipse((r()-0.5)*w*0.8,(r()-0.5)*h*0.8,1.2+r()*1.6,0.9+r(),0,0,6.283);x.fill();}
      x.fillStyle='#3d3a33';x.fillRect(-w*0.08,-h/2-h*0.25,w*0.16,h*0.27);x.restore();}
    function draw(){if(P.dead)return;requestAnimationFrame(draw);var now=performance.now(),dt=P.last?Math.min(0.05,(now-P.last)/1000):0.016;P.last=now;P.t+=dt;size();x.clearRect(0,0,W,H);
      x.fillStyle='#f6f3ec';x.fillRect(0,0,W,H);grain(x,0,0,W,H,0.6);
      var bcx=W*0.5,bcy=H*0.62,bw=W*0.62,bh=H*0.56,col=mixC('#96af8c','#5e4426',clamp(P.murk,0,0.9));bucketAt(bcx,bcy,bw,bh,col,'Old tank water',false);
      // dirt clouds bloom and spread through the water
      P.parts.forEach(function(p){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=0.96;p.vy=p.vy*0.96+6*dt;p.r+=dt*7;});P.parts=P.parts.filter(function(p){return p.t<2.2;});
      x.save();var top=bcy-bh/2;x.beginPath();x.moveTo(bcx-bw/2,top+bh*0.18);x.lineTo(bcx+bw/2,top+bh*0.18);x.lineTo(bcx+bw*0.4,bcy+bh/2);x.lineTo(bcx-bw*0.4,bcy+bh/2);x.closePath();x.clip();
      P.parts.forEach(function(p){x.fillStyle='rgba(94,68,38,'+(0.5*(1-p.t/2.2)).toFixed(3)+')';x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill();});
      P.bub.forEach(function(b){b.y-=dt*60;b.x+=Math.sin(b.y*0.1)*0.4;x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1;x.beginPath();x.arc(b.x,b.y,b.r,0,6.283);x.stroke();});P.bub=P.bub.filter(function(b){return b.y>top+bh*0.2;});x.restore();
      // the sponge sits in the water
      var target=P.press?1:0;P.sq+=(target-P.sq)*Math.min(1,dt*(P.press?14:6));sponge(bcx,bcy+bh*0.08,W*0.2,H*0.24);
      // flow meter
      var fl=flow();x.fillStyle=INK;x.font='600 13px Inter,system-ui';x.textAlign='left';x.fillText('Flow '+Math.round(fl*100)+'%',12,20);x.fillStyle='#e4ddcf';x.fillRect(12,27,W*0.36,7);x.fillStyle=fl>0.85?'#2f7a45':fl>0.55?'#93560f':'#b23a2e';x.fillRect(12,27,W*0.36*fl,7);}
    draw();
    cv.addEventListener('pointerdown',function(e){e.preventDefault();if(P.stage!=='squeeze')return;P.press=true;P.dn=performance.now();
      var take=P.dirt*0.2+0.01;P.dirt=Math.max(0,P.dirt-take);P.murk=Math.min(0.92,P.murk+take*1.05);sfx('squelch');var bcx=W*0.5,bcy=H*0.62+H*0.56*0.08;
      for(var i=0;i<Math.ceil(10+take*60);i++){var a=Math.random()*6.283,sp=rnd(30,110);P.parts.push({x:bcx+Math.cos(a)*W*0.06,y:bcy+Math.sin(a)*H*0.06,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*0.7,r:rnd(3,7),t:0});}
      if(P.dirt<0.06){P.stage='clean';btns('<button class="btn primary" id="sp-done">Put it back</button>');$('sp-done').onclick=finish;line('Clean. The bacteria are still in it, that’s what you want.');}});
    P.upH=function(){if(P.press){P.press=false;sfx('suck',{v:0.6});for(var i=0;i<6;i++)P.bub.push({x:W*0.5+rnd(-W*0.08,W*0.08),y:H*0.7,r:rnd(1.5,3.5)});}};window.addEventListener('pointerup',P.upH);
    function finish(){T.flow=1;T.lastClean.sponge=Math.floor(S.day);api.close();toast('The filter flows again. Bubbles are back.');sfx('plop');tankMod.renderSide();}
  }});}

// ---------- 3. Trim moss and stems ----------
// Drag the scissors through anything that has grown out. Cut bits float up, tap to scoop them.
// Drag a floating stem top down into the sand to plant it.
var MOSS_STEP=3;
function mossPuffs(a0,m,g,lenOverride){var r=mulberry32(m.seed),L=(lenOverride==null?m.len:lenOverride)*g.s,n=Math.max(1,Math.floor(L/MOSS_STEP)),px=a0[0],py=a0[1],ang=m.a,curl=(r()-0.5)*0.14,out=[],up=m.a>-Math.PI/2?1:-1;
  for(var i=0;i<n;i++){ang+=curl+(r()-0.5)*0.55;ang+=up*Math.min(0.06,i*0.004);px+=Math.cos(ang)*MOSS_STEP;py+=Math.sin(ang)*MOSS_STEP;
    var rr=(4.2+r()*3)*g.s*(1-Math.min(0.35,i*0.01))*(i>=n-2?0.7:1);out.push({x:px+(r()-0.5)*2.2,y:py+(r()-0.5)*2.2,r:rr,c:MOSS_C[Math.floor(r()*4)],al:0.86+r()*0.14,rot:r()*3,ang:ang,i:i});
    if(i%3===2){var ta=ang+(r()<0.5?-1:1)*(0.6+r()*0.6),tx=px,ty=py,tl=1+Math.floor(r()*3);for(var k=0;k<tl;k++){tx+=Math.cos(ta)*2.6;ty+=Math.sin(ta)*2.6;ta+=(r()-0.5)*0.5;out.push({x:tx,y:ty,r:rr*(0.72-k*0.14),c:MOSS_C[Math.floor(r()*4)],al:0.9,rot:r()*3,ang:ta,i:i,tw:1});}}}
  return out;}
function segHit(a,b,c,d){var den=(b[0]-a[0])*(d[1]-c[1])-(b[1]-a[1])*(d[0]-c[0]);if(Math.abs(den)<1e-6)return false;var t=((c[0]-a[0])*(d[1]-c[1])-(c[1]-a[1])*(d[0]-c[0]))/den,u=((c[0]-a[0])*(b[1]-a[1])-(c[1]-a[1])*(b[0]-a[0]))/den;return t>=0&&t<=1&&u>=0&&u<=1;}
function trimToy(T){var Z={trail:[],last:null,fl:[],moss:0,tops:0,drag:null,snipT:0,cuts:0,fine:true,cur:null,pc:new Map()};
  Z.start=function(){Z.bar();};
  Z.bar=function(){var got=Z.moss||Z.tops;toyBar(barHtml(!Z.cuts?'Drag the scissors through the moss and stems that grew out.':got?('Scooped '+(Z.moss?plural(Z.moss,'moss portion'):'')+(Z.moss&&Z.tops?' · ':'')+(Z.tops?plural(Z.tops,'stem top'):'')+(Z.fl.length?' · tap the floating bits':'')):'Tap the floating bits to scoop them. Drag a stem top into the sand to plant it.',''));};
  Z.anchor=function(it,m,g){var a=mossAnchor(it,m);return [g.ox+a[0]*g.s,a[1]*g.s];};
  // the puff list only changes when a strand is cut or the view resizes
  Z.puffsOf=function(it,m,g,a0){var c=Z.pc.get(m);if(c&&c.len===m.len&&c.x===a0[0]&&c.y===a0[1]&&c.s===g.s)return c.pf;var pf=mossPuffs(a0,m,g);Z.pc.set(m,{len:m.len,x:a0[0],y:a0[1],s:g.s,pf:pf});return pf;};
  Z.cutSeg=function(a,b){var g=tvGeom(),did=false;
    T.scape.forEach(function(it){var ms=T.moss[it.id];if(!ms)return;ms.forEach(function(m){var a0=Z.anchor(it,m,g),pf=Z.puffsOf(it,m,g,a0),ch=pf.filter(function(p){return !p.tw;});var keep=Math.min(4,ch.length);for(var i=keep;i<ch.length;i++){var p0=ch[i-1],p1=ch[i],rr=p1.r+2;
        if(segHit(a,b,[p0.x-rr,p0.y],[p1.x+rr,p1.y])||segHit(a,b,[p0.x,p0.y-rr],[p1.x,p1.y+rr])){var cut=pf.filter(function(p){return p.i>=i;});m.len=Math.max(4,(i*MOSS_STEP)/g.s);Z.float(cut,'moss');did=true;break;}}});});
    T.stems.forEach(function(st){var pts=stemPts(st,g);for(var i=Math.max(4,Math.floor(pts.length*0.25));i<pts.length;i++){if(segHit(a,b,pts[i-1],pts[i])){var top=pts.slice(i-1),cutLen=(i-1)*4/g.s;var taken=st.h-cutLen;if(taken<10/g.s)break;st.h=cutLen;Z.float(top,'stem',{seed:st.seed,len:taken});did=true;break;}}});
    if(did){var now=performance.now();if(now-Z.snipT>70){sfx('snip');Z.snipT=now;}Z.snapT=now;Z.cuts++;Z.bar();}};
  Z.float=function(pts,kind,o){if(kind==='moss'){var c0=pts[Math.floor(pts.length/2)];var near=Z.fl.find(function(f){return f.kind==='moss'&&!(Z.drag&&Z.drag.f===f)&&Math.hypot(f.x-c0.x,f.y-c0.y)<26&&f.pts.length<160;});
      if(near){pts.forEach(function(p){near.pts.push({x:p.x-near.x,y:p.y-near.y,r:p.r,c:p.c,al:p.al,rot:p.rot,ang:p.ang});});near.n=(near.n||0)+pts.length;return;}}
    var cx=0,cy=0;pts.forEach(function(p){cx+=(p.x!=null?p.x:p[0]);cy+=(p.y!=null?p.y:p[1]);});cx/=pts.length;cy/=pts.length;
    Z.fl.push({kind:kind,n:pts.length,pts:pts.map(function(p){return p.x!=null?{x:p.x-cx,y:p.y-cy,r:p.r,c:p.c,al:p.al,rot:p.rot}:{x:p[0]-cx,y:p[1]-cy};}),x:cx,y:cy,vx:rnd(-6,6),vy:-rnd(8,16),rot:0,vr:rnd(-0.4,0.4),seed:o&&o.seed,len:o&&o.len});};
  Z.down=function(p){Z.cur=p;var f=Z.pickFloat(p);if(f){Z.drag={f:f,p0:p,moved:false};return;}Z.last=p;Z.trail=[{x:p[0],y:p[1],t:0}];};
  Z.move=function(p){Z.cur=p;if(Z.drag){if(Math.hypot(p[0]-Z.drag.p0[0],p[1]-Z.drag.p0[1])>8)Z.drag.moved=true;Z.drag.f.x=p[0];Z.drag.f.y=p[1];Z.drag.f.vx=Z.drag.f.vy=0;return;}if(!Z.last)return;Z.cutSeg(Z.last,p);Z.last=p;Z.trail.push({x:p[0],y:p[1],t:0});};
  Z.up=function(p){if(Z.drag){var f=Z.drag.f,d=Z.drag;Z.drag=null;
     if(!d.moved){Z.scoop(f);return;}
     if(f.kind==='stem'&&f.y>TV.H*0.74){var fx=s2f(f.x,f.y)[0];T.stems.push({id:uid(),x:clamp(fx,60,ART_W-60),h:Math.max(30,f.len*0.7),seed:Math.floor(Math.random()*1e6),lean:rnd(-0.1,0.1)});Z.fl.splice(Z.fl.indexOf(f),1);sfx('plop');toast('Planted. It grows from here.');Z.bar();}
     return;}Z.last=null;};
  Z.pickFloat=function(p){var best=null,bd=1e9;Z.fl.forEach(function(f){var d=Math.hypot(p[0]-f.x,p[1]-f.y);if(d<30&&d<bd){bd=d;best=f;}});return best;};
  Z.scoop=function(f){Z.fl.splice(Z.fl.indexOf(f),1);if(f.kind==='moss')Z.puffs=(Z.puffs||0)+(f.n||f.pts.length);else Z.tops++;Z.moss=Math.round((Z.puffs||0)/16);if((Z.puffs||0)>0&&Z.moss<1)Z.moss=1;sfx('scoop');Z.bar();};
  Z.step=function(dt){var W=TV.W,H=TV.H,surf=H*WATER_TOP+6;Z.fl.forEach(function(f){if(Z.drag&&Z.drag.f===f)return;f.vy=Math.max(-18,f.vy-dt*4);f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=0.99;f.rot+=f.vr*dt;if(f.y<surf){f.y=surf;f.vy=0;f.vx+=Math.sin(performance.now()/900+f.x)*dt*3;}f.x=clamp(f.x,10,W-10);});
    Z.trail.forEach(function(t){t.t+=dt;});Z.trail=Z.trail.filter(function(t){return t.t<0.35;});};
  Z.draw=function(x,g,t){Z.fl.forEach(function(f){x.save();x.translate(f.x,f.y);x.rotate(f.rot);if(f.kind==='moss')drawPuffs(x,f.pts.map(function(p){return {x:p.x,y:p.y,r:p.r,c:p.c,al:p.al,rot:p.rot,ang:p.ang||0};}));else{x.strokeStyle='#4f7f33';x.lineWidth=1.3;x.beginPath();f.pts.forEach(function(p,i){if(i)x.lineTo(p.x,p.y);else x.moveTo(p.x,p.y);});x.stroke();
       for(var i=2;i<f.pts.length;i+=2){var p=f.pts[i],q=f.pts[i-1],ang=Math.atan2(p.y-q.y,p.x-q.x),lw=4.6;[-1,1].forEach(function(sd){var a=ang+sd*1.15;x.beginPath();x.ellipse(p.x+Math.cos(a)*lw/2,p.y+Math.sin(a)*lw/2,lw/2,lw*0.24,a,0,6.283);x.fillStyle='#8fc85c';x.fill();x.lineWidth=0.7;x.strokeStyle='#3d6e2a';x.stroke();});}}
     x.restore();x.save();x.globalAlpha=0.35+0.25*Math.sin(t*4+f.x);x.strokeStyle='#fff';x.lineWidth=1.2;x.beginPath();x.arc(f.x,f.y,15,0,6.283);x.stroke();x.restore();});
    if(Z.trail.length>1){x.save();x.lineCap='round';x.lineJoin='round';for(var i=1;i<Z.trail.length;i++){var a=Z.trail[i-1],b=Z.trail[i];x.strokeStyle='rgba(255,255,255,'+(0.85*(1-b.t/0.35)).toFixed(3)+')';x.lineWidth=2.2;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}x.restore();}
    if(Z.cur&&!Z.drag)drawScissors(x,Z.cur,performance.now()-(Z.snapT||0));};
  Z.finish=function(){Z.fl.forEach(function(f){if(f.kind==='moss')Z.puffs=(Z.puffs||0)+(f.n||f.pts.length);else Z.tops++;});Z.fl=[];Z.moss=Math.round((Z.puffs||0)/16);if((Z.puffs||0)>0&&Z.moss<1)Z.moss=1;var pay=Z.moss*8+Z.tops*3;T.lastClean.trim=Math.floor(S.day);toyEnd();if(pay>0){earn(pay,'moss');sfx('coin');toast((Z.moss?plural(Z.moss,'moss portion'):'')+(Z.moss&&Z.tops?' and ':'')+(Z.tops?plural(Z.tops,'stem top'):'')+' to the pet shop · '+fmtA(pay));}};
  return Z;}
// Scissors at the finger, tips pointing up and away so the finger doesn't hide the cut. They close on each snip.
function drawScissors(x,p,since){var open=since<90?0.06:since<200?0.06+(since-90)/110*0.34:0.4,L=20;x.save();x.translate(p[0]+6,p[1]-8);x.rotate(-0.75);
  [-1,1].forEach(function(sd){x.save();x.rotate(sd*open/2);x.fillStyle='#e9ecef';x.strokeStyle=INK;x.lineWidth=1.1;x.beginPath();x.moveTo(0,0);x.lineTo(L,-1.6*sd);x.lineTo(L+2,0);x.lineTo(0,2.2*sd);x.closePath();x.fill();x.stroke();
    x.beginPath();x.ellipse(-8,sd*3.6,4.2,3,0.3*sd,0,6.283);x.lineWidth=1.6;x.stroke();x.restore();});
  x.fillStyle=INK;x.beginPath();x.arc(0,0,1.3,0,6.283);x.fill();x.restore();}
// three passes: a dark green edge, the fill, then a few light flecks, so a clump reads as one inked bush
function drawPuffs(x,pf){x.fillStyle='#3a6528';pf.forEach(function(p){x.beginPath();x.ellipse(p.x,p.y,p.r*1.15+1,p.r*0.85+1,p.rot,0,6.283);x.fill();});
  pf.forEach(function(p){x.globalAlpha=p.al;x.fillStyle=p.c;x.beginPath();x.ellipse(p.x,p.y,p.r*1.15,p.r*0.85,p.rot,0,6.283);x.fill();});x.globalAlpha=1;
  x.strokeStyle='rgba(44,78,30,.7)';x.lineWidth=0.7;pf.forEach(function(p,i){if(i%2)return;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+Math.cos(p.ang+1.3)*p.r*1.2,p.y+Math.sin(p.ang+1.3)*p.r*1.2);x.stroke();});
  x.fillStyle='rgba(206,232,150,.55)';pf.forEach(function(p,i){if(i%4)return;x.beginPath();x.arc(p.x-p.r*0.3,p.y-p.r*0.35,p.r*0.28,0,6.283);x.fill();});}

// ---------- 4. Pick off pests ----------
function pestToy(T){var P={out:{snail:0,planaria:0},anim:[]};
  P.start=function(){P.bar();};
  P.bar=function(){var sn=T.pests.filter(function(p){return p.k==='snail';}).length,pl=T.pests.length-sn;toyBar(barHtml(T.pests.length?'Tap them to pick them off. '+(pl?plural(pl,'flatworm')+(sn?', ':''):'')+(sn?plural(sn,'snail'):'')+' left.':'All picked off.',''));};
  P.down=function(p){var W=TV.W,H=TV.H,best=null,bd=1e9;T.pests.forEach(function(q){var d=Math.hypot(p[0]-q.x*W,p[1]-q.y*H);if(d<26&&d<bd){bd=d;best=q;}});
    if(!best){P.anim.push({x:p[0],y:p[1],t:0,miss:1});return;}T.pests.splice(T.pests.indexOf(best),1);P.out[best.k]++;P.anim.push({x:best.x*W,y:best.y*H,t:0,pest:best});sfx('pop');P.bar();
    if(best.k==='planaria'&&!T.pests.some(function(q){return q.k==='planaria';}))toast('No flatworms left. Keep the gravel clean so they don’t come back.');};
  P.step=function(dt){P.anim.forEach(function(a){a.t+=dt;});P.anim=P.anim.filter(function(a){return a.t<0.7;});};
  P.draw=function(x,g,t){P.anim.forEach(function(a){var k=a.t/0.7;x.save();if(a.pest){var lift=k*k*40;x.globalAlpha=1-k;x.translate(a.x,a.y-lift);var px=a.pest;if(px.k==='snail'){var sr=6*px.sz*Math.max(1,TV.W/420);if(px.kind==='ramshorn')drawRamshorn(x,0,0,sr*0.85,px.a);else drawBladder(x,0,0,sr,px.a,0);}else{x.fillStyle='#f5f0e8';x.beginPath();x.arc(0,0,2.4,0,6.283);x.fill();x.strokeStyle=INK;x.lineWidth=0.8;x.stroke();}
      // tweezers
      var open=Math.max(0,1-k*4)*7;x.strokeStyle=INK;x.lineWidth=1.6;x.beginPath();x.moveTo(-open-1,-2);x.lineTo(-6,-34);x.moveTo(open+1,-2);x.lineTo(6,-34);x.stroke();
      for(var i=0;i<3;i++){x.fillStyle='rgba(255,255,255,.8)';x.beginPath();x.arc((i-1)*4,4+k*14+i*3,1.2,0,6.283);x.fill();}}
     else{x.globalAlpha=1-k;x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1.5;x.beginPath();x.arc(a.x,a.y,6+k*10,0,6.283);x.stroke();}x.restore();});};
  P.finish=function(){var sn=P.out.snail,pl=P.out.planaria;toyEnd();if(sn||pl){S.snails=(S.snails||0)+sn;toast((pl?plural(pl,'flatworm')+' out':'')+(pl&&sn?', ':'')+(sn?plural(sn,'snail')+' in a jar':'')+'.');}};
  return P;}

// ---------- 5. Aquascape ----------
var SCAPE_SHOP=[['wood',60],['rockpile',40],['rocks',30],['mossrock',35],['pebble',5],['lotus',25],['sword',25],['leaf',3],['stems',20],['moss',15]];
function scapeToy(T){var A={sel:null,drag:null,spent:0};
  A.start=function(){A.bar();A.panel();};
  A.bar=function(){toyBar(barHtml(A.sel?'Drag to move it. Tap the water to let go.':'Tap a piece below to add it, or drag what’s there.',''));};
  A.panel=function(){var tp=$('toypanel');if(!tp)return;var h='<div class="card"><div class="palette" id="sc-pal">'+SCAPE_SHOP.map(function(s){var nm=s[0]==='stems'?'Stem plants':s[0]==='moss'?'Java moss':DECOR[s[0]].name;return '<button data-add="'+s[0]+'"><canvas data-th="'+s[0]+'" width="112" height="72"></canvas>'+nm+'<small>'+fmtA(s[1])+'</small></button>';}).join('')+'</div>';
    if(A.sel){h+='<div class="btns" style="margin-top:4px"><button class="btn sm" data-sc="flip">Flip</button><button class="btn sm" data-sc="small">Smaller</button><button class="btn sm" data-sc="big">Bigger</button><button class="btn sm" data-sc="del">Remove</button></div>';}
    var hs=hideScore(T),pm=plantMass(T),gz=0;T.scape.forEach(function(it){var d=DECOR[it.k];if(d&&d.graze)gz+=d.graze;});for(var k in T.moss)gz+=0.1;
    var dots=function(v){var n=Math.round(clamp(v,0,1)*5);return '●●●●●'.slice(0,n)+'<span style="color:var(--line)">'+'●●●●●'.slice(0,5-n)+'</span>';};
    h+='<div class="kv" style="margin-top:8px"><span>Hiding spots</span><b>'+dots(hs/0.7)+'</b><span>Plants</span><b>'+dots(pm/1.2)+'</b><span>Grazing</span><b>'+dots(gz/0.9)+'</b></div><p class="hint">More hiding spots, more babies make it. Plants soak up nitrate. Wood, leaves and moss grow the film shrimp graze on.</p></div>';
    tp.innerHTML=h;tp.querySelectorAll('canvas[data-th]').forEach(function(cv){var k=cv.dataset.th,x=fitCanvas(cv,56,36);cv.style.width='56px';cv.style.height='36px';whenArt(function(){x.clearRect(0,0,56,36);scapeThumb(x,k,56,36);});});
    tp.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.add)A.add(b.dataset.add);else if(b.dataset.sc)A.edit(b.dataset.sc);};};
  A.add=function(k){var cost=SCAPE_SHOP.find(function(s){return s[0]===k;})[1];
    if(k==='moss'){var it=A.sel&&DECOR[A.sel.k]&&DECOR[A.sel.k].moss?A.sel:T.scape.find(function(i){return DECOR[i.k]&&DECOR[i.k].moss&&!T.moss[i.id];});if(!it){toast('Add driftwood or a stone first, the moss gets tied onto it.');return;}if(T.moss[it.id]&&T.moss[it.id].length>8){toast('That piece already has plenty of moss.');return;}if(!spend(cost,'moss'))return;var before=T.moss[it.id]||[];seedMoss(T,it,6,false);T.moss[it.id]=before.concat(T.moss[it.id]);A.spent+=cost;sfx('plop');toast('Moss tied onto the '+DECOR[it.k].name.toLowerCase()+'. It grows out from there.');A.panel();return;}
    if(!spend(cost,DECOR[k]?DECOR[k].name.toLowerCase():'plants'))return;A.spent+=cost;
    if(k==='stems'){var cx=rnd(160,ART_W-160);defaultStems(T,cx,4);T.stems.slice(-4).forEach(function(s){s.h=rnd(40,70);});sfx('plop');A.panel();return;}
    var d=DECOR_SIZE[k],it2={id:uid(),k:k,x:rnd(250,ART_W-250),y:ART_H*0.86+rnd(-6,10),s:k==='leaf'?1:0.85,f:Math.random()<0.5?1:-1,r:k==='leaf'?rnd(-0.5,0.5):0};
    if(k==='leaf')it2.y=ART_H*0.9;T.scape.push(it2);scapeResort(T,it2);if(DECOR[k].moss)seedMoss(T,it2,k==='wood'?5:3,false);A.sel=it2;sfx('thud');A.bar();A.panel();};
  A.edit=function(k){var it=A.sel;if(!it)return;if(k==='flip')it.f=-it.f;if(k==='small')it.s=Math.max(0.5,it.s-0.12);if(k==='big')it.s=Math.min(1.4,it.s+0.12);
    if(k==='del'){T.scape.splice(T.scape.indexOf(it),1);delete T.moss[it.id];var back=Math.round((SCAPE_SHOP.find(function(s){return s[0]===it.k;})||[0,0])[1]/2);earn(back,'decor');A.sel=null;sfx('pop');}
    A.bar();A.panel();};
  A.hit=function(p){var g=tvGeom(),best=null;for(var i=T.scape.length-1;i>=0;i--){var it=T.scape[i],d=DECOR_SIZE[it.k];if(!d)continue;var w=d.w*it.s*g.s,h=d.h*it.s*g.s,sp=f2s(it.x,it.y);if(p[0]>sp[0]-w/2&&p[0]<sp[0]+w/2&&p[1]>sp[1]-h&&p[1]<sp[1]+4){best=it;break;}}return best;};
  A.down=function(p){var it=A.hit(p);if(it){A.sel=it;var f=s2f(p[0],p[1]);A.drag={it:it,dx:it.x-f[0],dy:it.y-f[1]};A.bar();A.panel();sfx('click');}else{A.sel=null;A.bar();A.panel();}};
  A.move=function(p){if(!A.drag)return;var f=s2f(p[0],p[1]),it=A.drag.it;it.x=clamp(f[0]+A.drag.dx,40,ART_W-40);it.y=clamp(f[1]+A.drag.dy,ART_H*0.74,ART_H*0.97);};
  A.up=function(){if(A.drag){scapeResort(T,A.drag.it);A.drag=null;sfx('thud',{v:0.5});}};
  A.drawScape=function(x,g){x.drawImage(scapeLayer(T,g),0,0,TV.W,TV.H);if(A.sel){var d=DECOR_SIZE[A.sel.k],w=d.w*A.sel.s*g.s,h=d.h*A.sel.s*g.s,sp=f2s(A.sel.x,A.sel.y);x.save();x.setLineDash([5,4]);x.strokeStyle='#fff';x.lineWidth=1.6;x.strokeRect(sp[0]-w/2-3,sp[1]-h-3,w+6,h+6);x.restore();}};
  A.finish=function(){toyEnd();T.lastClean.scape=Math.floor(S.day);if(A.spent)toast(T.shrimp.length?'Looks good. Watch them check out the new spots.':'Looks lived in. Move some shrimp in with Sort from another tank, or bring wild ones home.');};
  return A;}
function scapeThumb(x,k,w,h){if(k==='stems'){var g={s:0.12};x.save();for(var i=0;i<4;i++){var bx=w*(0.25+i*0.16);x.strokeStyle='#4f7f33';x.lineWidth=1;x.beginPath();x.moveTo(bx,h*0.95);x.lineTo(bx+(i-1.5),h*0.12);x.stroke();for(var j=0;j<6;j++){var yy=h*(0.85-j*0.13);x.fillStyle='#7cbf4f';x.beginPath();x.ellipse(bx-3,yy,3,1.1,-0.6,0,6.283);x.fill();x.beginPath();x.ellipse(bx+3,yy,3,1.1,0.6,0,6.283);x.fill();}}x.restore();return;}
  if(k==='moss'){for(var q=0;q<26;q++){var r=hash2(q,3,1),r2=hash2(q,7,2);x.fillStyle=MOSS_C[q%4];x.beginPath();x.ellipse(w*(0.2+r*0.6),h*(0.3+r2*0.5),3.2,2.4,r*3,0,6.283);x.fill();}return;}
  var im=decorImg(k),d=DECOR_SIZE[k];if(!im||!d)return;var sc=Math.min(w/d.w,h/d.h)*0.95;x.drawImage(im,(w-d.w*sc)/2,(h-d.h*sc)/2,d.w*sc,d.h*sc);}
