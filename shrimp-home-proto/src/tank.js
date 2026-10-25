// ===== Tank tab: the tank view, the colony, the water =====
var ART_W=932,ART_H=430,WATER_TOP=0.215,SAND_TOP=0.74;
var MULM_N=48;
// ---- tank objects ----
function newTank(name,vol,scape){return {id:uid(),name:name,vol:vol||20,born:Math.floor(S.day),scape:scape||[],moss:{},stems:[],mulm:new Array(MULM_N).fill(0),flow:1,pests:[],no3:6,nh:0,level:1,shrimp:[],log:[],newCol:0,lastWC:null,lastClean:{}};}
function grandmaScape(){var sq=function(cx){return 466+(cx-466)*0.8;};var order=['wood','sword','lotus','rockpile','mossrock','rocks','pebble'];
  return order.map(function(k){var d=DECOR_SIZE[k];return {id:uid(),k:k,x:sq(d.x+d.w/2),y:d.y+d.h,s:1,f:1};});}
function defaultStems(T,cx,n){for(var i=0;i<n;i++)T.stems.push({id:uid(),x:cx+(i-(n-1)/2)*13+rnd(-3,3),h:rnd(120,170),seed:Math.floor(Math.random()*1e6),lean:rnd(-0.12,0.12)});}
// moss grows from the top edge of driftwood and stones
var TOPS={};
function decorTop(k){if(TOPS[k])return TOPS[k];var im=decorImg(k);if(!im||!im.width)return null;var c=document.createElement('canvas');c.width=im.width;c.height=im.height;var x=c.getContext('2d');x.drawImage(im,0,0);var d=x.getImageData(0,0,c.width,c.height).data,out=[];
  for(var cx=0;cx<c.width;cx+=4){var y=-1;for(var cy=0;cy<c.height;cy++){if(d[(cy*c.width+cx)*4+3]>140){y=cy;break;}}out.push(y);}TOPS[k]={step:4,y:out,w:c.width,h:c.height};return TOPS[k];}
function seedMoss(T,item,n,grown){var top=decorTop(item.k);if(!top)return;var list=T.moss[item.id]=[];var r=mulberry32(item.id*31+7);
  for(var i=0;i<n;i++){var u=0.1+r()*0.8,ix=Math.floor(u*top.y.length);if(top.y[ix]<0)continue;var side=r()<0.25;list.push({u:u,a:side?(r()<0.5?-0.35:-Math.PI+0.35)+(r()-0.5)*0.6:-Math.PI/2+(r()-0.5)*1.4,len:grown?rnd(34,56):rnd(14,22),max:rnd(78,118),seed:Math.floor(r()*1e6)});}}
function mossAnchor(item,m){var top=decorTop(item.k);var d=DECOR_SIZE[item.k];var ix=clamp(Math.floor(m.u*top.y.length),0,top.y.length-1),px=ix*top.step,py=top.y[ix]+2;
  var w=d.w*item.s,h=d.h*item.s,lx=(item.f<0?(d.w-px):px)*item.s;return [item.x-w/2+lx,item.y-h+py*item.s];}
function scapeNeedsMoss(T){T.scape.forEach(function(it){if(DECOR[it.k]&&DECOR[it.k].moss&&!T.moss[it.id])seedMoss(T,it,it.k==='wood'?16:it.k==='mossrock'?10:8,false);});}
function hideScore(T){var h=0;T.scape.forEach(function(it){var d=DECOR[it.k];if(d)h+=d.hide*it.s;});var moss=0;for(var k in T.moss)T.moss[k].forEach(function(m){moss+=m.len;});h+=Math.min(0.3,moss/900);h+=Math.min(0.15,T.stems.length*0.02);return clamp(h,0,1);}
function plantMass(T){var m=0;T.scape.forEach(function(it){var d=DECOR[it.k];if(d&&d.plant)m+=d.plant*it.s;});T.stems.forEach(function(st){m+=st.h/400;});for(var k in T.moss)T.moss[k].forEach(function(mm){m+=mm.len/600;});return m;}
function mulmMean(T){var s=0;for(var i=0;i<MULM_N;i++)s+=T.mulm[i];return s/MULM_N;}
function overgrowth(T){var o=0;for(var k in T.moss)T.moss[k].forEach(function(m){o=Math.max(o,m.len/m.max);});T.stems.forEach(function(st){o=Math.max(o,st.h/ (ART_H*(SAND_TOP-WATER_TOP)) );});return o;}
function mulmWeight(T,i){var x=(i+0.5)/MULM_N*ART_W,w=0.7;T.scape.forEach(function(it){var d=DECOR_SIZE[it.k];if(!d)return;var hw=d.w*it.s/2;if(Math.abs(x-it.x)<hw+20)w+=0.45;});if(i<4||i>MULM_N-5)w+=0.5;return w;}
// ---- daily tank care: mess builds up, water drifts ----
function tankDay(T,d){var n=T.shrimp.length,eff=effectsOn();
  for(var i=0;i<MULM_N;i++)T.mulm[i]=clamp(T.mulm[i]+(0.018+0.0007*n)*mulmWeight(T,i)*rnd(0.6,1.3),0,1);
  T.flow=clamp(T.flow-0.021-(mulmMean(T)>0.6?0.01:0),0.05,1);
  for(var k in T.moss)T.moss[k].forEach(function(m){m.len=Math.min(m.max*1.08,m.len+rnd(1.8,3.4));});
  var surf=ART_H*(SAND_TOP-WATER_TOP)+18;T.stems.forEach(function(st){st.h=Math.min(surf+70,st.h+rnd(3,5.5));});
  // pests
  var sn=T.pests.filter(function(p){return p.k==='snail';}).length,pl=T.pests.filter(function(p){return p.k==='planaria';}).length;
  if(sn>=2&&sn<30&&Math.random()<0.14)addPests(T,'snail',1);
  if(eff&&pl===0&&mulmMean(T)>0.7&&Math.random()<0.02)addPests(T,'planaria',1+Math.floor(Math.random()*2));
  if(pl>0&&pl<12&&Math.random()<(mulmMean(T)>0.5?0.12:0.05))addPests(T,'planaria',1);
  // water
  T.no3=clamp(T.no3+0.3+0.03*n-plantMass(T)*0.4,2,90);
  T.nh=Math.max(0,T.nh-0.14)+(T.flow<0.3?0.04:0);
  if(T.level<1)T.level=1;
  breedDay(T,d);}
function addPests(T,k,n){for(var i=0;i<n;i++){var onGlass=k==='planaria'?Math.random()<0.8:Math.random()<0.55;T.pests.push({id:uid(),k:k,kind:k==='snail'?(Math.random()<0.5?'ramshorn':'bladder'):'',x:rnd(0.08,0.92),y:onGlass?rnd(0.3,0.68):rnd(0.77,0.9),glass:onGlass,a:Math.random()*6.28,sz:rnd(0.8,1.2)});}}
function needs(T){var o=[],mm=mulmMean(T),og=overgrowth(T),sn=T.pests.filter(function(p){return p.k==='snail';}).length,pl=T.pests.length-sn;
  if(!T.scape.length)o.push({id:'scape',t:'Empty tank'});
  if(mm>0.4)o.push({id:'vac',t:mm>0.65?'Very dirty':'Gravel dirty'});
  if(T.flow<0.55)o.push({id:'sponge',t:'Flow '+Math.round(T.flow*100)+'%'});
  if(og>0.68)o.push({id:'trim',t:'Overgrown'});
  if(pl>0||sn>=5)o.push({id:'pests',t:pl?(pl===1?'A flatworm':pl+' flatworms'):sn+' snails'});
  if(T.newCol>0)o.push({id:'sort',t:'New colours'});
  return o;}
function anyNeeds(){return S.tanks.some(function(T){return needs(T).length;});}
// ---- the view ----
var TV={cv:null,W:0,H:0,dpr:1,ag:[],dead:[],bub:[],t:0,T:null,sig:'',L:{},on:false,bubbleFor:null};
function tvGeom(){var s=TV.H/ART_H;return {s:s,ox:(TV.W-ART_W*s)/2,sand:TV.H*0.8};}
function f2s(fx,fy){var g=tvGeom();return [g.ox+fx*g.s,fy*g.s];}
function s2f(px,py){var g=tvGeom();return [(px-g.ox)/g.s,py/g.s];}
function tvSize(){var r=TV.cv.getBoundingClientRect(),W=Math.round(r.width),H=Math.round(r.height);if(!W||!H)return false;var d=Math.min(2,window.devicePixelRatio||1);
  if(W!==TV.W||H!==TV.H||d!==TV.dpr){var rx=TV.W?W/TV.W:1,ry=TV.H?H/TV.H:1;TV.ag.forEach(function(a){a.x*=rx;a.y*=ry;a.tx*=rx;a.ty*=ry;});TV.W=W;TV.H=H;TV.dpr=d;TV.cv.width=W*d;TV.cv.height=H*d;TV.L={};}return true;}
function tvBase(){return clamp(TV.W*0.17,42,92);}
function layer(name,key,draw){var L=TV.L[name];if(L&&L.key===key)return L.c;if(!L)L=TV.L[name]={c:document.createElement('canvas'),key:''};L.key=key;var c=L.c;c.width=TV.W*TV.dpr;c.height=TV.H*TV.dpr;var x=c.getContext('2d');x.setTransform(TV.dpr,0,0,TV.dpr,0,0);x.clearRect(0,0,TV.W,TV.H);draw(x);return c;}
function drawBg(x){var g=tvGeom(),W=TV.W,H=TV.H;if(ART_READY)x.drawImage(IMG.tbg,g.ox,0,ART_W*g.s,H);else{x.fillStyle='#8fc6d8';x.fillRect(0,0,W,H);x.fillStyle='#e8d6ad';x.fillRect(0,H*0.72,W,H);}
  [[0.06,7,0.7,'95,152,91',0.22],[0.16,12,0.98,'109,169,103',0.3],[0.28,8,0.76,'120,180,109',0.24],[0.44,11,0.9,'101,159,96',0.27],[0.58,9,0.72,'122,179,109',0.23],[0.72,14,1.08,'112,168,98',0.32],[0.88,10,0.92,'111,167,101',0.28],[0.97,6,0.72,'93,149,89',0.2]].forEach(function(gr,gi){var k=W/1000;
   for(var i=0;i<gr[1];i++){var bx=W*gr[0]+(i-gr[1]/2)*8.5*gr[2]*k,by=H*0.72+(i%3)*1.2,bh=H*(0.18+((i+gi)%6)*0.035)*gr[2],sw=Math.sin(i*0.74+gi)*10*gr[2]*k;
    x.strokeStyle='rgba('+gr[3]+','+gr[4]+')';x.lineWidth=Math.max(1,3.1*gr[2]*k);x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx+sw*0.28,by-bh*0.5,bx+sw,by-bh);x.stroke();}});}
function drawItem(x,it,alpha){var im=decorImg(it.k),d=DECOR_SIZE[it.k];if(!im||!d)return;var g=tvGeom(),w=d.w*it.s*g.s,h=d.h*it.s*g.s,p=f2s(it.x,it.y);x.save();if(alpha!=null)x.globalAlpha=alpha;x.translate(p[0],p[1]);if(it.f<0)x.scale(-1,1);
  if(it.k==='leaf'){x.rotate(it.r||0.2);x.drawImage(im,-w/2,-h*0.7,w,h);}else x.drawImage(im,-w/2,-h,w,h);x.restore();}
function scapeKey(T){return T.scape.map(function(i){return i.k+i.x.toFixed(0)+i.y.toFixed(0)+i.s+i.f;}).join('|');}
// moss: soft green puffs along a curve from the anchor, with a few dark ticks for texture
var MOSS_C=['#6f9f4a','#7fae55','#5f8f3f','#8cbb62'];
function drawMossStrand(x,a0,m,g,alpha){var r=mulberry32(m.seed),L=m.len*g.s,step=3.2,n=Math.max(1,Math.floor(L/step)),px=a0[0],py=a0[1],ang=m.a,bend=(r()-0.5)*0.09;
  for(var i=0;i<n;i++){ang+=bend+(r()-0.5)*0.12;px+=Math.cos(ang)*step;py+=Math.sin(ang)*step;var rr=(2.1+r()*1.8)*g.s/0.48*0.5+1;
    x.fillStyle=MOSS_C[Math.floor(r()*4)];x.globalAlpha=alpha*(0.82+r()*0.18);x.beginPath();x.ellipse(px+(r()-0.5)*2,py+(r()-0.5)*2,rr*1.15,rr*0.85,r()*3,0,6.283);x.fill();
    if(i%2===0){x.strokeStyle='rgba(52,86,36,.65)';x.lineWidth=0.8;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(ang+1.2)*rr*1.4,py+Math.sin(ang+1.2)*rr*1.4);x.stroke();}}
  x.globalAlpha=1;return [px,py];}
function mossPath(a0,m,g,upto){var r=mulberry32(m.seed),L=(upto==null?m.len:upto)*g.s,step=3.2,n=Math.max(1,Math.floor(L/step)),px=a0[0],py=a0[1],ang=m.a,bend=(r()-0.5)*0.09,pts=[[px,py]];
  for(var i=0;i<n;i++){ang+=bend+(r()-0.5)*0.12;px+=Math.cos(ang)*step;py+=Math.sin(ang)*step;r();r();r();r();r();r();pts.push([px,py]);}return pts;}
// stems: a thin stem with leaf pairs, the top bends along the surface once it gets there
function stemPts(st,g){var base=f2s(st.x,ART_H*0.765),top=ART_H*WATER_TOP*g.s+3,pts=[],len=st.h*g.s,y=base[1],xx=base[0],step=4,i=0;
  while(len>0&&i<200){var dy=Math.min(step,len);if(y-dy>top){y-=dy;xx+=st.lean*dy+Math.sin((y+st.seed%50)/17)*0.35;}else{xx+=(st.lean>=0?1:-1)*dy;}len-=dy;pts.push([xx,y]);i++;}
  return [base].concat(pts);}
function drawStem(x,st,g,alpha){var pts=stemPts(st,g),r=mulberry32(st.seed);x.save();x.globalAlpha=alpha==null?1:alpha;
  x.strokeStyle='#4f7f33';x.lineWidth=1.3;tracePts(x,pts,false);x.stroke();
  for(var i=2;i<pts.length;i+=2){var p=pts[i],q=pts[i-1],ang=Math.atan2(p[1]-q[1],p[0]-q[0]),lw=(4.2+r()*1.6)*Math.max(0.7,g.s/0.48);
    [-1,1].forEach(function(sd){var a=ang+sd*1.15,ex=p[0]+Math.cos(a)*lw,ey=p[1]+Math.sin(a)*lw;x.beginPath();x.ellipse((p[0]+ex)/2,(p[1]+ey)/2,lw/2,lw*0.24,a,0,6.283);x.fillStyle=i>pts.length-7?'#9fd06a':'#7cbf4f';x.fill();x.lineWidth=0.7;x.strokeStyle='#3d6e2a';x.stroke();});}
  x.restore();return pts;}
function drawPlants(x,T,g){T.stems.forEach(function(st){drawStem(x,st,g);});
  T.scape.forEach(function(it){var ms=T.moss[it.id];if(!ms)return;ms.forEach(function(m){var a0=mossAnchor(it,m);drawPuffs(x,mossPuffs([g.ox+a0[0]*g.s,a0[1]*g.s],m,g));});});}
function plantsKey(T){var k=scapeKey(T)+'#';T.stems.forEach(function(s){k+=s.x.toFixed(0)+':'+s.h.toFixed(0)+',';});for(var id in T.moss)T.moss[id].forEach(function(m){k+=m.len.toFixed(1)+',';});return k;}
// mulm: brown fluff on the sand, more in the corners and behind the decor
function drawMulm(x,T){var W=TV.W,H=TV.H;for(var i=0;i<MULM_N;i++){var a=T.mulm[i];if(a<0.03)continue;var n=Math.round(a*15),cx0=i/MULM_N*W,cw=W/MULM_N;
  for(var q=0;q<n;q++){var h=hash2(i,q,T.id),h2=hash2(q,i,T.id+5),px=cx0+h*cw*1.4-cw*0.2,py=H*(0.775+h2*0.15),sz=(1.1+hash2(i+q,q,9)*1.9)*(0.7+a*0.5);
    x.fillStyle='rgba('+(92+Math.floor(h*30))+','+(66+Math.floor(h2*20))+',38,'+(0.45+a*0.4).toFixed(2)+')';x.beginPath();x.ellipse(px,py,sz*1.3,sz*0.8,0,0,6.283);x.fill();
    if(a>0.5&&q%3===0){x.fillStyle='rgba(110,84,50,.35)';x.beginPath();x.ellipse(px+sz,py-sz*0.6,sz*1.8,sz,0,0,6.283);x.fill();}}}}
function mulmKey(T){var k='';for(var i=0;i<MULM_N;i++)k+=Math.round(T.mulm[i]*30)+',';return k;}
// the sponge filter in the back right, bubbles show how well it flows
function filterBox(){var W=TV.W,H=TV.H;return {x:W*0.905,y:H*0.62,w:W*0.06,h:H*0.17};}
function drawFilter(x,T){var W=TV.W,H=TV.H,b=filterBox();x.fillStyle='rgba(61,58,51,.85)';x.fillRect(b.x+b.w/2-1.5,H*0.17,3,b.y-H*0.17);
  var dirt=1-T.flow,col=mixC('#d9c48a','#6e5230',clamp(dirt*1.2,0,1));inkBlob(x,b.x+b.w/2,b.y+b.h/2,b.w/2,b.h/2,{fill:col,seed:5,irr:0.05,w:1.2,wash:0.8});
  x.strokeStyle='rgba(44,40,35,.35)';x.lineWidth=0.8;for(var i=1;i<4;i++){x.beginPath();x.moveTo(b.x+2,b.y+b.h*i/4);x.lineTo(b.x+b.w-2,b.y+b.h*i/4);x.stroke();}}
// ---- agents (ported from the game's tank view) ----
function tvSpot(kind){var W=TV.W||300,H=TV.H||150,sand=TV.H*0.8,L=tvBase();
  if(kind==='glassL'||kind==='glassR')return {surf:kind,x:kind==='glassL'?L*0.18+3:W-L*0.18-3,y:H*(0.32+Math.random()*0.42)};
  var wood=TV.T&&TV.T.scape.find(function(i){return i.k==='wood';});if(kind==='wood'&&wood){var d=DECOR_SIZE.wood,p=f2s(wood.x+(Math.random()-0.5)*d.w*wood.s*0.55,wood.y-d.h*wood.s*0.62);return {surf:'wood',x:p[0],y:p[1]};}
  return {surf:'sand',x:W*(0.06+Math.random()*0.86),y:sand+H*(0.02+Math.random()*0.08)};}
function newAgent(ind,near){var r=Math.random(),sp=tvSpot(r<0.12?'glassL':r<0.2?'glassR':r<0.32?'wood':'sand');if(near){sp={surf:'sand',x:clamp(near.x+rnd(-14,14),8,TV.W-8),y:TV.H*0.8+TV.H*rnd(0.02,0.1)};}
  var a={id:ind.id,ind:ind,x:sp.x,y:sp.y,surf:sp.surf,tx:sp.x,ty:sp.y,ang:0,av:0,face:Math.random()<0.5?1:-1,faceT:1,intent:'graze',left:Math.random()*3,ph:Math.random()*10,rp:0,sp:0,speed:0};a.faceT=a.face;a.ang=restAngle(a);agentSpec(a);return a;}
function agentSpec(a){var i=a.ind;a.spec=specOf(i);a.berried=!!i.eggs;a.sc=a.spec.juv===2?0.36:a.spec.juv===1?0.62:1;}
function restAngle(a){return a.surf==='glassL'||a.surf==='glassR'?(a.face>0?Math.PI/2:-Math.PI/2):a.surf==='wood'?-0.12*a.face:0;}
function angDelta(a,b){var d=(b-a)%(2*Math.PI);if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;return d;}
function turn(a,des,dt){var d=angDelta(a.ang,des);if(Math.abs(d)<0.0001){a.av=0;a.ang=des;return;}var dv=clamp(d*5.2,-2.8,2.8);a.av+=clamp(dv-a.av,-7.5*dt,7.5*dt);a.av=clamp(a.av,-2.8,2.8);var st=a.av*dt;if(Math.sign(st)===Math.sign(d)&&Math.abs(st)>=Math.abs(d)){st=d;a.av=0;}a.ang+=st;}
function agentPick(a){var L=tvBase()*a.sc,r=Math.random(),sand=TV.H*0.8,W=TV.W,H=TV.H;
  if(r<0.12){a.intent='idle';a.left=1+Math.random()*2.5;a.speed=0;return;}
  if(r<0.38){a.intent='graze';a.left=1.2+Math.random()*3;a.speed=0;return;}
  if(r<0.84||a.surf==='water'){a.intent='crawl';a.speed=L*0.3*(0.8+Math.random()*0.4);a.left=8;
    if(a.surf==='glassL'||a.surf==='glassR'){a.tx=a.x;a.ty=clamp(a.y+(Math.random()<0.5?-1:1)*L*(1+Math.random()*1.5),H*0.18,sand-L*0.2);}
    else if(a.surf==='wood'){var wsp=tvSpot('wood');a.tx=wsp.surf==='wood'?wsp.x:a.x;a.ty=wsp.surf==='wood'?wsp.y:a.y;}
    else if(a.surf==='water'){a.tx=clamp(a.x+(Math.random()-0.5)*L*2.5,8,W-8);a.ty=clamp(a.y+(Math.random()-0.5)*L,H*0.3,H*0.9);}
    else{a.tx=clamp(a.x+(Math.random()-0.5)*L*4,W*0.05,W*0.95);a.ty=clamp(a.y+(Math.random()-0.5)*H*0.04,sand+H*0.02,sand+H*0.1);}return;}
  var q=Math.random(),sp=tvSpot(q<0.2?'glassL':q<0.38?'glassR':q<0.5?'wood':'sand');a.intent=Math.random()<0.25?'dash':'swim';a.speed=L*(a.intent==='dash'?1.6:0.5);a.tx=sp.x;a.ty=sp.y;a.tsurf=sp.surf;a.surf='water';a.left=12;}
function agentsStep(dt){var W=TV.W,H=TV.H,sand=H*0.8,L0=tvBase();
  TV.ag.forEach(function(a){var L=L0*a.sc;a.ph+=dt;a.left-=dt;if(a.pull){a.x+=a.pull[0]*dt;a.y+=a.pull[1]*dt;a.pull=null;a.sp=L;return;}
    var moving=a.intent==='crawl'||a.intent==='swim'||a.intent==='dash';
    if(moving){var dx=a.tx-a.x,dy=a.ty-a.y,d=Math.sqrt(dx*dx+dy*dy);if(a.intent==='dash'&&d<L*1.2){a.intent='swim';a.speed=L*0.5;}
      if(d<1.5){a.x=a.tx;a.y=a.ty;if(a.tsurf){a.surf=a.tsurf;a.tsurf=null;}a.sp=0;a.intent=Math.random()<0.6?'graze':'idle';a.left=1.5+Math.random()*3;}
      else{var m=Math.min(d,a.speed*dt);a.x+=dx/d*m;a.y+=dy/d*m;a.sp=a.speed;if(Math.abs(dx)>d*0.25)a.faceT=dx>0?-1:1;
        var slope=Math.atan2(dy,Math.max(0.001,Math.abs(dx))),des=a.faceT<0?slope:-slope;if(a.surf==='sand')des=0;else if(a.surf==='wood')des=-0.12*a.faceT;turn(a,des+Math.sin(a.ph*9)*0.03,dt);}}
    else{a.sp=0;turn(a,a.surf==='water'?clamp(a.ang,-0.5,0.5):restAngle(a),dt);if(a.left<=0)agentPick(a);}
    if(a.left<=0&&moving)agentPick(a);
    a.face+=clamp(a.faceT-a.face,-6*dt,6*dt);a.rp+=dt*Math.min(12,a.sp/Math.max(1,L)*13.7);a.x=clamp(a.x,6,W-6);a.y=clamp(a.y,H*0.27,H*0.95);});
  var gap=L0*0.5;for(var i=0;i<TV.ag.length;i++)for(var j=i+1;j<TV.ag.length;j++){var p=TV.ag[i],q=TV.ag[j];if(p.surf!==q.surf||(p.surf!=='sand'&&p.surf!=='water'))continue;var dx=q.x-p.x;if(Math.abs(dx)<gap&&Math.abs(q.y-p.y)<gap*0.4){var push=(gap-Math.abs(dx))*dt*1.2*(dx>=0?1:-1);p.x-=push;q.x+=push;}}
  TV.dead.forEach(function(d){d.ms+=dt*1000;});TV.dead=TV.dead.filter(function(d){return d.ms<d.sinkMs+2100;});
  TV.bub.forEach(function(b){b.y-=dt*H*0.35*(b.sp||1);b.x+=Math.sin(b.y*0.08)*0.3;});TV.bub=TV.bub.filter(function(b){return b.y>H*WATER_TOP+3+(1-(TV.T?TV.T.level:1))*H*(SAND_TOP-WATER_TOP);});
  var T=TV.T;if(T){var fb=filterBox(),rate=0.6+T.flow*5.5;if(Math.random()<dt*rate)TV.bub.push({x:fb.x+fb.w/2+rnd(-2,2),y:H*0.17+6,r:0.8+T.flow*1.6*Math.random()+0.4,sp:0.6+T.flow*0.7});}}
var MAX_AG=45;
function sampleInds(T){var list=T.shrimp;if(list.length<=MAX_AG)return list;var main=tankMainColour(T),pri=list.filter(function(i){return i.eggs||i.name||colOf(i)!==main||i.id===TV.bubbleFor;}),rest=list.filter(function(i){return pri.indexOf(i)<0;});
  var r=mulberry32(Math.floor(S.day)*13+T.id);rest=rest.map(function(i){return [r(),i];}).sort(function(a,b){return a[0]-b[0];}).map(function(p){return p[1];});return pri.slice(0,MAX_AG).concat(rest).slice(0,MAX_AG);}
function tvSync(force){var T=S.tanks[S.sel];if(!T||!TV.cv)return;if(!TV.W&&!tvSize())return;if(TV.T!==T){TV.ag=[];TV.dead=[];TV.T=T;}var sig=T.id+'|'+T.shrimp.length+'|'+Math.floor(S.day);if(!force&&TV.sig===sig)return;TV.sig=sig;
  var want=sampleInds(T),ids={};want.forEach(function(i){ids[i.id]=1;});var alive={};T.shrimp.forEach(function(i){alive[i.id]=1;});
  TV.ag=TV.ag.filter(function(a){if(ids[a.id])return true;if(!alive[a.id]&&TV.W)killAgent(a);return false;});
  var have={};TV.ag.forEach(function(a){have[a.id]=a;});
  want.forEach(function(i){if(have[i.id]){agentSpec(have[i.id]);return;}var near=null;if(i.age<2){var moms=TV.ag.filter(function(a){return a.ind.sex==='f'&&a.ind.age>=ADULT_DAYS;});near=moms.length?pick(moms):null;}TV.ag.push(newAgent(i,near));});}
function killAgent(a){var sand=TV.H*0.8,ty=Math.max(a.y,sand+TV.H*(-0.02+Math.random()*0.08));TV.dead.push({a:a,x0:a.x,y0:a.y,ty:ty,ms:0,sinkMs:clamp(1650+(ty-a.y)*3.4,1850,3400),amp:clamp(tvBase()*a.sc*0.35,6,16),dir:Math.random()<0.5?-1:1,face:a.face<0?-1:1});}
function tankEvent(T,kind){if(T===TV.T)tvSync(true);if(kind==='hatch'&&T===TV.T&&activeTab==='tank')sfx('plip');}
function tvDraw(){var x=TV.cv.getContext('2d'),W=TV.W,H=TV.H,T=TV.T,t=TV.t,g=tvGeom();x.setTransform(TV.dpr,0,0,TV.dpr,0,0);x.clearRect(0,0,W,H);
  var edit=TOY&&TOY.id==='scape';
  x.drawImage(layer('bg',W+'x'+H+(ART_READY?1:0),drawBg),0,0,W,H);
  if(edit)TOY.drawScape(x,g);else x.drawImage(layer('scape',scapeKey(T)+W+(ART_READY?1:0),function(c){T.scape.forEach(function(it){drawItem(c,it);});}),0,0,W,H);
  if(!(TOY&&TOY.id==='trim'))x.drawImage(layer('plants',plantsKey(T)+W,function(c){drawPlants(c,T,g);}),0,0,W,H);else TOY.drawPlants(x,g);
  drawFilter(x,T);
  x.drawImage(layer('mulm',mulmKey(T)+W,function(c){drawMulm(c,T);}),0,0,W,H);
  TV.bub.forEach(function(b){x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1;x.beginPath();x.arc(b.x,b.y,b.r,0,6.283);x.stroke();});
  drawPests(x,T,t);
  if(!ART_READY)return;var base=tvBase();
  TV.dead.forEach(function(d){var raw=clamp((d.ms-320)/d.sinkMs,0,1),flip=clamp(d.ms/320,0,1),vs=1-flip*flip*(3-2*flip)*2,sink=1-Math.pow(1-raw,3),wave=Math.sin(raw*Math.PI*4)*d.dir,alpha=1-clamp((d.ms-d.sinkMs-1000)/700,0,1),a=d.a,w=base*a.sc,h=w*SH/SW;
    x.save();x.globalAlpha=alpha;x.translate(d.x0+wave*d.amp,d.y0+(d.ty-d.y0)*sink);x.rotate(-wave*0.085);x.scale(d.face,vs);x.drawImage(IMG.ld,-w/2,-h/2,w,h);x.drawImage(bodyCanvas(a.spec),-w/2,-h/2,w,h);x.drawImage(IMG.t0,-w/2,-h/2,w,h);x.restore();});
  TV.ag.slice().sort(function(a,b){return a.y-b.y;}).forEach(function(a){if(a.hidden)return;var L=base*a.sc;drawShrimp(x,a,L,t);if(a.id===TV.bubbleFor){x.save();x.lineWidth=2;x.strokeStyle='#2d6a4f';x.beginPath();x.arc(a.x,a.y,L*0.55,0,6.283);x.stroke();x.restore();}});
  if(TOY&&TOY.draw)TOY.draw(x,g,t);
  // water level (vacuum lowers it)
  if(T.level<0.999){var wy=H*WATER_TOP+(1-T.level)*H*(SAND_TOP-WATER_TOP);var gr=x.createLinearGradient(0,0,0,wy);gr.addColorStop(0,'#e8f4f4');gr.addColorStop(1,'#d5ebee');x.fillStyle=gr;x.fillRect(0,0,W,wy);
    x.strokeStyle='rgba(90,150,170,.8)';x.lineWidth=1.4;x.beginPath();for(var px=0;px<=W;px+=6)x.lineTo(px,wy+Math.sin(px*0.08+t*2)*1.2);x.stroke();}
  if(TOY&&TOY.drawTop)TOY.drawTop(x,g,t);}
function drawPests(x,T,t){var W=TV.W,H=TV.H;T.pests.forEach(function(p){var px=p.x*W,py=p.y*H;if(p.k==='snail'){var r=4.8*p.sz*Math.max(1,W/420);
   if(p.kind==='ramshorn'){x.fillStyle='#8a4a30';x.beginPath();x.arc(px,py,r,0,6.283);x.fill();x.strokeStyle=INK;x.lineWidth=0.9;x.stroke();x.beginPath();x.arc(px+0.5,py,r*0.55,0,5.2);x.stroke();x.beginPath();x.arc(px+0.6,py,r*0.22,0,6.283);x.stroke();}
   else{x.fillStyle='rgba(196,168,112,.95)';x.beginPath();x.ellipse(px,py,r*0.75,r*1.1,p.a,0,6.283);x.fill();x.strokeStyle=INK;x.lineWidth=0.8;x.stroke();x.beginPath();x.moveTo(px-r*0.3,py-r*0.2);x.lineTo(px+r*0.3,py+r*0.4);x.stroke();}}
  else{var len=11*p.sz*Math.max(1,W/420),ang=p.a;x.save();x.translate(px,py);x.rotate(ang);x.fillStyle='rgba(245,240,232,.92)';x.beginPath();x.moveTo(len/2,0);x.lineTo(len/2-2.6,-1.6);x.quadraticCurveTo(-len/3,-1.6,-len/2,0);x.quadraticCurveTo(-len/3,1.6,len/2-2.6,1.6);x.closePath();x.fill();x.strokeStyle='rgba(120,110,96,.9)';x.lineWidth=0.6;x.stroke();
   x.fillStyle=INK;x.beginPath();x.arc(len/2-2.4,-0.6,0.45,0,6.283);x.arc(len/2-2.4,0.6,0.45,0,6.283);x.fill();x.restore();}});}
function pestsStep(T,dt){var W=TV.W,H=TV.H;T.pests.forEach(function(p){if(p.held)return;var sp=p.k==='snail'?0.006:0.03;p.a+=(Math.random()-0.5)*dt*(p.k==='snail'?0.8:2.4);p.x+=Math.cos(p.a)*sp*dt*(p.glass?1:0.6);p.y+=Math.sin(p.a)*sp*dt*(p.glass?1:0.25)*(W/H);
  if(p.glass){if(p.y<0.26||p.y>0.72)p.a=-p.a;p.y=clamp(p.y,0.25,0.73);}else{p.y=clamp(p.y,0.77,0.92);}if(p.x<0.04||p.x>0.96)p.a=Math.PI-p.a;p.x=clamp(p.x,0.03,0.97);});}
function tvLoop(){if(!TV.on)return;requestAnimationFrame(tvLoop);if(!tvSize())return;var now=performance.now(),dt=TV.last?Math.min(0.1,(now-TV.last)/1000):0.016;TV.last=now;
  var live=running()||TOY;if(live){TV.t+=dt;agentsStep(dt);if(TV.T)pestsStep(TV.T,dt);}if(TOY&&TOY.step)TOY.step(dt);tvDraw();}
function tvStart(){if(TV.on)return;TV.on=true;TV.last=0;requestAnimationFrame(tvLoop);}
function tvStop(){TV.on=false;}
// ---- the Tank tab ----
var tankMod={name:'tank',
 stageChanged:function(){if(activeTab==='tank')tankMod.renderSide();},
 init:function(fresh){if(fresh||!S.tanks.length){var T=newTank('Grandma’s tank',20,grandmaScape());T.shrimp=grandmaStock();defaultStems(T,705,5);T.stems.forEach(function(st){st.h=rnd(60,105);});S.tanks.push(T);S.sel=0;
    for(var i=0;i<T.mulm.length;i++)T.mulm[i]=0.12+Math.random()*0.1;T.flow=0.72;addPests(T,'snail',2);
    S.book.shrimp=S.book.shrimp||{};T.shrimp.forEach(function(i){if(i.age>=JUV_DAYS)S.book.shrimp[bookKey(i)]={day:0,tank:T.name,from:'grandma'};});}
   whenArt(function(){S.tanks.forEach(function(T){scapeNeedsMoss(T);if(T.shrimp.some(function(i){return i.from==='grandma';})&&!T.mossGrown){T.mossGrown=1;for(var k in T.moss)T.moss[k].forEach(function(m){m.len=rnd(30,50);});}});TV.L={};if(activeTab==='tank')tankMod.render();});},
 day:function(d){S.tanks.forEach(function(T){tankDay(T,d);});if(activeTab==='tank'){tvSync();tankMod.renderSide();}var dot=$('tankdot');if(dot)dot.hidden=!(S.opt.toys==='need'&&anyNeeds());},
 show:function(){tankMod.render();tvStart();},
 hide:function(){tvStop();closeBubble();if(TOY)toyEnd();},
 render:function(){if(activeTab!=='tank')return;var el=$('p-tank');if(!el.querySelector('#tv-canvas')){el.innerHTML='<div class="tchips" id="tchips"></div><div class="lockzone" id="lockzone"><div class="lockbar" id="lockbar" hidden></div><div class="tv" id="tv"><canvas id="tv-canvas"></canvas><span class="tv-cap" id="tv-cap"></span></div><div id="toypanel"></div></div><div id="tankside"></div>';
   TV.cv=$('tv-canvas');TV.L={};bindTv();}
  if(!S.tanks[S.sel])S.sel=0;tvSize();tvSync(true);tankMod.renderSide();tvStart();},
 renderSide:function(){if(activeTab!=='tank'||!$('tankside'))return;var T=S.tanks[S.sel];
  // tank chips
  var slots=STAGES[S.stage].tanks,ch='';S.tanks.forEach(function(t,i){var nd=S.opt.toys==='need'&&needs(t).length;ch+='<button class="tchip" data-sel="'+i+'" aria-pressed="'+(i===S.sel)+'">'+esc(t.name)+(nd&&i!==S.sel?' <i class="dot" style="position:static;display:inline-block;width:7px;height:7px;border:0;border-radius:50%;background:var(--shrimp)"></i>':'')+'</button>';});
  if(S.tanks.length<slots)ch+='<button class="tchip" data-newtank>+ New tank</button>';$('tchips').innerHTML=ch;$('tchips').hidden=S.tanks.length<2&&S.tanks.length>=slots;
  $('tv-cap').textContent=T.name+' · '+(T.shrimp.length?plural(T.shrimp.length,'shrimp','shrimp')+(S.seen.tapShrimp?'':' · tap one to look closer'):'empty');
  var side='';
  // jobs
  var nd=needs(T),ids=nd.map(function(n){return n.id;}),tray=S.opt.toys==='tray';var show=tray?TOYS.map(function(t){return t.id;}):ids;
  if(!TOY){side+='<div class="card"><div class="hd"><h2>'+(tray?'Jobs':'Needs doing')+'</h2><small>'+(tray?'any time':'shows up when the tank needs it')+'</small></div>';
   if(show.length){side+='<div class="toys">';TOYS.forEach(function(t){if(show.indexOf(t.id)<0)return;var n=nd.find(function(z){return z.id===t.id;});side+='<button class="btn'+(n?' need':'')+(n&&!tray?' glow':'')+'" data-toy="'+t.id+'"><canvas data-icon="'+t.id+'" width="56" height="44"></canvas>'+t.name+'<small>'+(n?n.t:t.idle(T))+'</small></button>';});side+='</div>';}
   else side+='<p class="hint">Nothing needs doing. The tank is fine for now.</p>';side+='</div>';}
  // water
  if(effectsOn()){var no=Math.round(T.no3),nh=T.nh;side+='<div class="card"><div class="hd"><h2>Water</h2><small>'+(T.lastWC!=null?'changed '+(Math.floor(S.day)-T.lastWC===0?'today':plural(Math.floor(S.day)-T.lastWC,'day')+' ago'):'not changed yet')+'</small></div><div class="chips">'+
   '<span class="chip '+(no>40?'bad':no>20?'warn':'ok')+'">Nitrate '+no+' ppm</span>'+(nh>0.05?'<span class="chip bad">Ammonia '+nh.toFixed(2)+'</span>':'<span class="chip ok">Ammonia 0</span>')+
   '<span class="chip '+(T.flow<0.35?'bad':T.flow<0.55?'warn':'ok')+'">Filter '+Math.round(T.flow*100)+'%</span><span class="chip '+(mulmMean(T)>0.65?'bad':mulmMean(T)>0.4?'warn':'ok')+'">Gravel '+(mulmMean(T)>0.65?'very dirty':mulmMean(T)>0.4?'dirty':mulmMean(T)>0.2?'a bit dirty':'clean')+'</span></div>'+
   (no>40?'<p class="hint">High nitrate slows breeding. The vacuum changes water as it cleans.</p>':'')+(nh>0.3?'<p class="hint">Ammonia is up. The filter bacteria are recovering.</p>':'')+'</div>';}
  // colony
  var c=tankCounts(T);side+='<div class="card"><div class="hd"><h2>Colony</h2><small>'+c.n+' of '+tankCap(T)+' comfy · '+c.adults+' adults · '+(c.young+c.babies)+' young'+(c.berried?' · '+c.berried+' carrying eggs':'')+'</small></div>';
  var groups=Object.keys(c.by).map(function(k){return c.by[k];}).sort(function(a,b){return b.n-a.n;});
  if(groups.length){side+='<div class="colony">';groups.forEach(function(g){side+='<div class="cl"><canvas data-cl="'+g.ex.id+'" width="88" height="44"></canvas><div><b>'+esc(COLOURS[g.col].name+(g.rili?' rili':''))+' · '+g.n+'</b><small>'+(g.col==='wild'?'Wild type':'Best '+Math.round(g.best)+' · '+TIER_NAMES[tierOf(g.best)])+'</small></div></div>';});side+='</div>';}
  else side+='<p class="hint">'+(T.scape.length?'No shrimp yet. Move some in with Sort, or take wild ones home from the stream.':'Set up the tank with Aquascape first.')+'</p>';
  if(c.babies)side+='<p class="hint">'+plural(c.babies,'baby','babies')+' still too small to show a colour.</p>';
  side+='<div class="btns"><button class="btn sm" data-dev="wild">Dev: add 6 wild shrimp</button>'+(S.tanks.length>1?'<button class="btn sm" data-rename>Rename</button>':'<button class="btn sm" data-rename>Rename</button>')+'</div></div>';
  if(T.log&&T.log.length){side+='<div class="card"><div class="hd"><h2>Recent</h2></div>';T.log.slice(0,5).forEach(function(l){side+='<p class="hint">Day '+l.d+' · '+esc(l.t)+'</p>';});side+='</div>';}
  $('tankside').innerHTML=side;
  $('tankside').querySelectorAll('canvas[data-icon]').forEach(function(cv){var t=TOYS.find(function(z){return z.id===cv.dataset.icon;});var x=fitCanvas(cv,28,22);cv.style.width='28px';cv.style.height='22px';t.icon(x,28,22);});
  $('tankside').querySelectorAll('canvas[data-cl]').forEach(function(cv){var ind=T.shrimp.find(function(i){return i.id===+cv.dataset.cl;});if(!ind)return;var x=fitCanvas(cv,44,22);cv.style.width='44px';cv.style.height='22px';whenArt(function(){x.clearRect(0,0,44,22);shrimpStill(x,specOf(ind),22,11,42,1);});});},
};
registerMod(tankMod);registerTab('tank',tankMod);
function bindTv(){var cv=TV.cv,down=null;
  cv.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect(),p=[e.clientX-r.left,e.clientY-r.top];if(TOY){e.preventDefault();try{cv.setPointerCapture(e.pointerId);}catch(_){}TOY.down&&TOY.down(p,e);return;}down={p:p,t:performance.now()};});
  cv.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),p=[e.clientX-r.left,e.clientY-r.top];if(TOY){TOY.move&&TOY.move(p,e);return;}});
  cv.addEventListener('pointerup',function(e){var r=cv.getBoundingClientRect(),p=[e.clientX-r.left,e.clientY-r.top];if(TOY){TOY.up&&TOY.up(p,e);return;}if(down&&Math.hypot(p[0]-down.p[0],p[1]-down.p[1])<12)tvTap(p);down=null;});
  cv.addEventListener('pointercancel',function(e){if(TOY&&TOY.up)TOY.up(null,e);down=null;});
  document.addEventListener('touchmove',function(e){if(TOY&&e.target&&e.target.closest&&e.target.closest('#tv,.sortcv'))e.preventDefault();},{passive:false});
  $('p-tank').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.dataset.sel!=null){S.sel=+b.dataset.sel;closeBubble();sfx('click');tankMod.render();}
    else if(b.dataset.newtank!=null){if(spend(300,'a new tank')){var T=newTank('Tank '+(S.tanks.length+1),20,[]);for(var i=0;i<MULM_N;i++)T.mulm[i]=0;S.tanks.push(T);S.sel=S.tanks.length-1;toast(T.name+' is set up and seeded from Grandma’s filter. Aquascape it, then move shrimp in.');sfx('plop');tankMod.render();}}
    else if(b.dataset.toy){sfx('click');toyStart(b.dataset.toy);}
    else if(b.dataset.dev==='wild'){var T2=S.tanks[S.sel];var list=[];for(var k=0;k<6;k++)list.push(breedWild());addToTank(T2,list,'stream');toast('6 wild shrimp added to '+T2.name);tvSync(true);tankMod.renderSide();}
    else if(b.dataset.rename!=null)renameTank();});}
function renameTank(){var T=S.tanks[S.sel];openSheet({title:'Rename',keepTime:true,html:'<input id="rn-in" maxlength="24" style="width:100%;font:15px var(--font-body);padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--surface-2)"><div class="btns"><button class="btn primary" id="rn-ok">Save</button></div>',mount:function(el,api){var i=$('rn-in');i.value=T.name;i.focus();$('rn-ok').onclick=function(){var v=i.value.replace(/[<>]/g,'').trim();if(v)T.name=v.slice(0,24);api.close();};}});}
// tap a shrimp to look closer
function tvTap(p){var base=tvBase(),best=null,bd=1e9;TV.ag.forEach(function(a){var L=base*a.sc,d=Math.hypot((p[0]-a.x)/(L*0.55),(p[1]-a.y)/(L*0.35));if(d<1.4&&d<bd){bd=d;best=a;}});
  if(!best){if(TV.bubbleFor)closeBubble();else{var fb=filterBox();if(p[0]>fb.x-8&&p[1]>fb.y-10){toast('That’s the sponge filter. Clean it under Needs doing when the flow drops.');}}return;}
  S.seen.tapShrimp=1;openBubble(best);sfx('click');}
function closeBubble(){TV.bubbleFor=null;var b=document.querySelector('.bub');if(b)b.remove();}
function openBubble(a){closeBubble();var i=a.ind,T=TV.T;TV.bubbleFor=i.id;var el=document.createElement('div');el.className='bub';
  var age=i.age,ageT=age<JUV_DAYS?age+' days, colour shows at '+JUV_DAYS:age<ADULT_DAYS?age+' days, grown at '+ADULT_DAYS:age+' days';
  var from={grandma:'Grandma’s line',stream:'From the stream',bred:'Born here',shop:'From the shop'}[i.from]||'';
  var h='<b>'+esc(i.name?i.name+' · ':'')+esc(colourName(i,true))+(colOf(i)!=='wild'&&age>=JUV_DAYS?' · grade '+Math.round(i.g):'')+'</b><br>'+(i.sex==='f'?'Female':'Male')+' · '+ageT+(i.eggs?'<br>Carrying '+i.eggs.n+' eggs, hatching in '+Math.max(0,i.eggs.due-Math.floor(S.day))+' days':'')+(from?' · <small>'+from+'</small>':'');
  if(S.opt.genes)h+='<div class="gene">'+geneStr(i)+'</div>';
  h+='<div class="btns">'+(S.tanks.length>1?'<button class="btn" data-b="move">Move</button>':'')+'<button class="btn" data-b="sell">Pet shop · '+fmtA(shopPrice(i))+'</button><button class="btn" data-b="name">'+(i.name?'Rename':'Name')+'</button></div><div data-b-extra></div>';
  el.innerHTML=h;$('tv').appendChild(el);var W=TV.W,H=TV.H,bw=el.offsetWidth,bh=el.offsetHeight;var left=clamp(a.x-bw/2,6,W-bw-6),top=a.y-bh-18;if(top<6)top=a.y+18;if(top+bh>H-4)top=Math.max(4,H-bh-4);el.style.left=left+'px';el.style.top=top+'px';
  if(bh>H-8){el.style.top='4px';el.style.maxHeight=(H-8)+'px';el.style.overflow='auto';}
  el.addEventListener('pointerdown',function(e){e.stopPropagation();});
  el.addEventListener('click',function(e){var b=e.target.closest('[data-b]');if(!b)return;var k=b.dataset.b,ex=el.querySelector('[data-b-extra]');
    if(k==='sell'){var pr=sellShrimp(T,i);sfx('coin');toast('Sold to the pet shop for '+fmtA(pr));closeBubble();tvSync(true);tankMod.renderSide();}
    else if(k==='move'){ex.innerHTML='<div class="btns">'+S.tanks.map(function(t,ti){return t===T?'':'<button class="btn" data-mv="'+ti+'">'+esc(t.name)+'</button>';}).join('')+'</div>';}
    else if(k==='name'){ex.innerHTML='<div class="btns"><input maxlength="14" style="flex:1;min-width:0;font:14px var(--font-body);padding:6px 8px;border:1px solid var(--line);border-radius:8px" value="'+esc(i.name||'')+'"><button class="btn" data-nm>Save</button></div>';ex.querySelector('input').focus();}
    else if(b.dataset.mv!=null){}});
  el.addEventListener('click',function(e){var mv=e.target.closest('[data-mv]');if(mv){var to=S.tanks[+mv.dataset.mv];moveShrimp(i,T,to);toast('Moved to '+to.name);sfx('plop');closeBubble();tvSync(true);tankMod.renderSide();}
    var nm=e.target.closest('[data-nm]');if(nm){var v=el.querySelector('input').value.replace(/[^A-Za-z0-9 .'-]/g,'').trim().slice(0,14);i.name=v;closeBubble();toast(v?'Named '+v:'Name cleared');save();}});}
