// ===== Home: the place that grows with you (flat, balcony, house and garden, land with a stream) =====
// Hand-drawn 2D map in 3/4 view: flat ground tiles, things drawn standing up and sorted by y, cutaway house.
// Everything lives in this closure. Globals out: landSetStage(n), LAND (for tests and the Dev tab).
(function(){
'use strict';
var T=32;                                   // tile size in CSS px (world units)
// ground types
var G_VOID=0,G_FLOOR=1,G_TILE=2,G_GRASS=3,G_MEADOW=4,G_DIRT=5,G_STONE=6,G_WATER=7,G_SAND=8,G_HALL=9,G_STEP=10;
function isGrass(g){return g===G_GRASS||g===G_MEADOW;}
function isWalk(g){return g===G_GRASS||g===G_MEADOW||g===G_DIRT||g===G_STONE||g===G_SAND||g===G_STEP;}
var STAGE_SEED=[1001,1107,1213,1319];

// ----- map model -----
function newMap(w,h,seed){var n=w*h,m={w:w,h:h,seed:seed,g:[],gh:[],gb:[],rooms:[],balcony:null,backdrop:null,henArea:null,wildArea:null,stream:false};
  for(var i=0;i<n;i++){m.g.push(0);m.gh.push(0);m.gb.push(0);}return m;}
function mi(m,x,y){return y*m.w+x;}
function mget(m,x,y){if(x<0||y<0||x>=m.w||y>=m.h)return G_VOID;return m.g[y*m.w+x];}
function mset(m,x,y,g,h){if(x<0||y<0||x>=m.w||y>=m.h)return;var i=y*m.w+x;m.g[i]=g;if(h!=null)m.gh[i]=h;}
function mfill(m,x0,y0,x1,y1,g,h){for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++)mset(m,x,y,g,h);}

// ----- objects -----
// k: kind, tx/ty: footprint top-left tile, fw/fh: footprint size, built: placed by the player (removable)
var OBJ={};   // kind -> {fw,fh,flat,solid,draw(x,o,X,Y,W,H,t),live,price,where,name,indoor}
function mkObj(k,tx,ty,o){var d=OBJ[k]||{},r={id:'o'+(LS().oid=(LS().oid||0)+1),k:k,tx:tx,ty:ty,fw:d.fw||1,fh:d.fh||1,seed:Math.floor(hash2(tx,ty,k.length*31)*1e6)};for(var p in o||{})r[p]=o[p];return r;}
function LS(){return S.land;}

// ----- stage maps -----
// The garden block (20 x 22) is shared by the house and the land. ox, oy shift it.
var HOUSE_SLOTS=[[2,3,2],[6,3,2],[10,3,2],[12,3,1],[12,6,1],[2,7,1]];
function genGarden(m,o,ox,oy,nTanks,isLand){
  mfill(m,ox,oy,ox+19,oy+21,G_GRASS,0.5);
  // the house
  mfill(m,ox+2,oy+3,ox+12,oy+9,G_FLOOR);
  m.rooms.push({x:ox+2,y:oy+3,w:11,h:7,door:{x:ox+7,w:2,kind:'door'},windows:[{x:ox+4,w:2},{x:ox+8,w:2}],paper:'#ece3cf'});
  for(var i=0;i<nTanks;i++){var s=HOUSE_SLOTS[i];o.push(mkObj('tank',ox+s[0],oy+s[1],{fw:s[2],i:i,v:s[2]===1?'nano':''}));}
  o.push(mkObj('rug',ox+4,oy+5,{fw:5,fh:3,v:1}));
  o.push(mkObj('sofa',ox+5,oy+7,{v:'back'}));
  o.push(mkObj('armchair',ox+10,oy+6,{gm:1}));
  o.push(mkObj('sidetable',ox+11,oy+7));
  o.push(mkObj('shelf',ox+2,oy+5));
  o.push(mkObj('plant',ox+12,oy+9));
  o.push(mkObj('lamp',ox+3,oy+9));
  o.push(mkObj('mat',ox+7,oy+9,{fw:2}));
  // patio and path
  mfill(m,ox+6,oy+10,ox+9,oy+11,G_STONE);
  for(var y=oy+12;y<=oy+21;y++){mset(m,ox+7,y,G_STEP,0.3);mset(m,ox+8,y,G_STEP,0.3);}
  // beds under the windows
  [[2,10],[3,10],[4,10],[5,10],[10,10],[11,10],[12,10]].forEach(function(p){mset(m,ox+p[0],oy+p[1],G_DIRT);o.push(mkObj('flowers',ox+p[0],oy+p[1],{v:(p[0]*7)%4}));});
  // hedge at the back, side garden
  for(var hx=0;hx<20;hx+=2)if(hx<2||hx>12)o.push(mkObj('bush',ox+hx,oy+0,{v:hx%3}));
  o.push(mkObj('tree',ox+16,oy+1,{fw:2,fh:2,v:0}));
  mfill(m,ox+14,oy+6,ox+16,oy+7,G_DIRT);o.push(mkObj('vegbed',ox+14,oy+6,{fw:3,fh:2}));
  // coop, feeder, pond, trees
  o.push(mkObj('coop',ox+14,oy+12,{fw:3,fh:2}));
  o.push(mkObj('feeder',ox+11,oy+15,{s:0.7}));
  var pond={k:'pond',cx:ox+3.9,cy:oy+16.9,rx:2.55,ry:1.45,seed:3};(m.bodies||(m.bodies=[])).push(pond);
  o.push(mkObj('tree',ox+16,oy+17,{fw:2,fh:2,v:1}));
  o.push(mkObj('tree',ox+1,oy+12,{v:2,small:1}));
  o.push(mkObj('bench',ox+10,oy+19,{fw:2}));
  // fence round the garden, gate on the path
  for(var fy=oy+10;fy<=oy+21;fy++){o.push(mkObj('fence',ox+0,fy));o.push(mkObj('fence',ox+19,fy));}
  for(var fx=ox+1;fx<=ox+18;fx++){if(fx===ox+7||fx===ox+8)continue;o.push(mkObj('fence',fx,oy+21));}
  m.henArea={x0:(ox+1)*T,y0:(oy+10)*T,x1:(ox+19)*T,y1:(oy+21)*T};
  applyBodies(m);bankThings(m,o,pond);
}
// reeds and stones round a pond, sitting on the curved bank (sub-tile offsets)
function bankThings(m,o,b){var r=mulberry32(b.seed*97+11),spots=[[2.35,'reeds'],[2.75,'reeds'],[0.55,'rock'],[3.6,'rock'],[1.5,'rock'],[4.9,'reeds'],[5.6,'rock']];
  spots.forEach(function(sp,j){var a=sp[0]+(r()-0.5)*0.25,R=1.12+r()*0.08,wx=(b.cx+Math.cos(a)*b.rx*R)*T,wy=(b.cy+Math.sin(a)*b.ry*R)*T+(sp[1]==='rock'?6:2),tx=Math.floor(wx/T),ty=Math.floor(wy/T);
    if(mget(m,tx,ty)===G_WATER||objAtTileIn(o,tx,ty))return;var ob=mkObj(sp[1],tx,ty,{v:j%3,ox:wx-(tx*T+T/2),oy:wy-(ty*T+T*0.72)});o.push(ob);});}
function objAtTileIn(o,tx,ty){return o.some(function(p){return tx>=p.tx&&tx<p.tx+(p.fw||1)&&ty>=p.ty&&ty<p.ty+(p.fh||1);});}
function genStage(n){var m,o=[],r;
  if(n===0||n===1){
    m=newMap(11,n===0?13:17,STAGE_SEED[n]);
    mfill(m,1,2,9,10,G_FLOOR);
    var room={x:1,y:2,w:9,h:9,windows:[{x:4,w:3,feeder:1}],paper:'#efe4d0'};
    if(n===0){mfill(m,1,11,4,12,G_HALL);room.door={x:2,w:2,kind:'door'};}
    else{room.door={x:5,w:3,kind:'slide'};mfill(m,2,11,8,14,G_TILE);m.balcony={x:2,y:11,w:7,h:4};m.backdrop='city';}
    m.rooms.push(room);
    o.push(mkObj('tank',1,2,{fw:2,i:0}));
    o.push(mkObj('tank',7,2,{fw:2,i:1}));
    if(n===1)o.push(mkObj('tank',9,2,{i:2,v:'nano',fw:1}));else o.push(mkObj('shelf',9,2));
    if(n===1)o.push(mkObj('shelf',1,5));
    o.push(mkObj('rug',3,5,{fw:4,fh:3,v:0}));
    o.push(mkObj('armchair',6,6,{gm:1}));
    o.push(mkObj('sidetable',7,6));
    o.push(mkObj('plant',1,9));
    o.push(mkObj('wfeeder',5,2,{wall:1,s:0.6}));
    if(n===0)o.push(mkObj('mat',2,10,{fw:2}));
    else{o.push(mkObj('herbs',2,12,{v:0}));o.push(mkObj('herbs',3,12,{v:1}));o.push(mkObj('pot',8,11,{v:0}));o.push(mkObj('bchair',5,13));o.push(mkObj('feeder',8,13,{s:0.6,v:'hang'}));}
  }else if(n===2){
    m=newMap(20,22,STAGE_SEED[n]);genGarden(m,o,0,0,5,false);
  }else{
    m=newMap(30,40,STAGE_SEED[n]);
    var rr=mulberry32(STAGE_SEED[n]);
    mfill(m,0,0,29,39,G_MEADOW,1);
    genGarden(m,o,5,0,6,true);
    // a mown path from the gate
    for(var py=22;py<40;py++){mset(m,12,py,G_GRASS,0.1);mset(m,13,py,G_GRASS,0.1);}
    // the stream, left to right
    m.stream=true;(m.bodies||(m.bodies=[])).push({k:'stream',cy:30.2,seed:5});
    applyBodies(m);
    // bridge where the path meets the stream
    var by0=99,by1=-1;for(var y2=22;y2<40;y2++){if(mget(m,12,y2)===G_WATER||mget(m,13,y2)===G_WATER){by0=Math.min(by0,y2);by1=Math.max(by1,y2);}}
    if(by1>=by0)o.push(mkObj('bridge',12,by0,{fw:2,fh:by1-by0+1}));
    // trees: a small wood bottom left, a stand on the right, a few loose ones
    var taken={};function free(tx,ty,fw,fh){for(var yy=ty;yy<ty+fh;yy++)for(var xx=tx;xx<tx+fw;xx++){var g=mget(m,xx,yy);if(g!==G_MEADOW||taken[xx+','+yy])return false;}return true;}
    function take(tx,ty,fw,fh){for(var yy=ty-1;yy<ty+fh+1;yy++)for(var xx=tx-1;xx<tx+fw+1;xx++)taken[xx+','+yy]=1;}
    for(var k=0;k<80;k++){var big=rr()<0.55,tw=big?2:1,txx,tyy;
      if(k<46){txx=Math.floor(rr()*9);tyy=33+Math.floor(rr()*6);}else if(k<60){txx=24+Math.floor(rr()*5);tyy=22+Math.floor(rr()*6);}else{txx=Math.floor(rr()*29);tyy=22+Math.floor(rr()*17);}
      if(txx===12||txx===13||txx+tw-1===12)continue;
      if(free(txx,tyy,tw,tw)){o.push(mkObj('tree',txx,tyy,{fw:tw,fh:tw,v:Math.floor(rr()*3),small:big?0:1}));take(txx,tyy,tw,tw);}}
    // trees and bushes either side of the garden
    [[1,3],[2,8],[1,15],[26,4],[27,11],[26,17]].forEach(function(p,j){if(free(p[0],p[1],2,2)){o.push(mkObj('tree',p[0],p[1],{fw:2,fh:2,v:j%3}));take(p[0],p[1],2,2);}});
    // rocks on the banks
    for(var q=0;q<40;q++){var rx=Math.floor(rr()*30),ry=22+Math.floor(rr()*18);if(mget(m,rx,ry)===G_SAND&&!taken[rx+','+ry]){o.push(mkObj('rock',rx,ry,{v:q%3}));taken[rx+','+ry]=1;}}
    m.wildArea={x0:0,y0:22*T,x1:30*T,y1:40*T};
  }
  // where hens wander when there is no fenced garden: nowhere (no hens before the house)
  r={map:m,objs:o};return r;}
// ----- ground: painted once into an offscreen canvas, single tiles redrawn when they change -----
function waterDepth(m){var d=[],n=m.w*m.h,q=[];for(var i=0;i<n;i++){if(m.g[i]===G_WATER){var x=i%m.w,y=(i/m.w)|0,sh=false;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(o){if(mget(m,x+o[0],y+o[1])!==G_WATER)sh=true;});d.push(sh?0:-1);if(sh)q.push(i);}else d.push(-2);}
  while(q.length){var j=q.shift(),jx=j%m.w,jy=(j/m.w)|0;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(o){var nx=jx+o[0],ny=jy+o[1];if(nx<0||ny<0||nx>=m.w||ny>=m.h)return;var k=ny*m.w+nx;if(d[k]===-1){d[k]=d[j]+1;q.push(k);}});}
  m.depth=d;}
// smooth noise across tiles so the lawn has soft patches instead of a grid
function vnoise(wx,wy,cell,k){var gx=wx/cell,gy=wy/cell,x0=Math.floor(gx),y0=Math.floor(gy),fx=gx-x0,fy=gy-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  var a=hash2(x0,y0,k),b=hash2(x0+1,y0,k),c=hash2(x0,y0+1,k),d=hash2(x0+1,y0+1,k);return lerp(lerp(a,b,sx),lerp(c,d,sx),sy);}
function grassBucket(h){return Math.round(clamp(h,0,1)*6);}
function hh(tx,ty,k){return hash2(tx*13+k*101,ty*7+k*17,STAGE_SEED[S.stage]);}
function paintTile(x,m,tx,ty){var i=mi(m,tx,ty),g=m.g[i],X=tx*T,Y=ty*T;x.save();x.beginPath();x.rect(X,Y,T,T);x.clip();
  if(g===G_VOID){}
  else if(g===G_FLOOR)paintFloor(x,tx,ty,X,Y);
  else if(g===G_TILE)paintCeramic(x,tx,ty,X,Y,['#d99f76','#d0956c','#d6a27c']);
  else if(g===G_HALL)paintCeramic(x,tx,ty,X,Y,['#dcd5c6','#d4ccbc','#e0d9cb']);
  else if(g===G_GRASS||g===G_STEP)paintGrass(x,m,tx,ty,X,Y,m.gh[i],m.gb[i],false);
  else if(g===G_MEADOW)paintGrass(x,m,tx,ty,X,Y,m.gh[i],m.gb[i],true);
  else if(g===G_DIRT)paintDirt(x,tx,ty,X,Y);
  else if(g===G_STONE)paintPatio(x,tx,ty,X,Y);
  else if(g===G_WATER)paintWater(x,m,tx,ty,X,Y);
  else if(g===G_SAND)paintSand(x,m,tx,ty,X,Y);
  if(g===G_STEP)paintStep(x,tx,ty,X,Y);
  if(g!==G_VOID)grain(x,X,Y,T,T,0.55);
  x.restore();}
function paintFloor(x,tx,ty,X,Y){var ph=T/3;for(var r=0;r<3;r++){var row=ty*3+r,off=hash2(row,3,9)*T*3,py=Y+r*ph;
  var seg0=Math.floor((X+off)/(T*3));for(var sg=seg0;sg<=seg0+1;sg++){var seg=sg,x0=seg*T*3-off;if(x0>X+T||x0+T*3<X)continue;
   var k=hash2(seg,row,11),c=mixC('#d9b78c','#c9a376',k*0.7);x.fillStyle=c;x.fillRect(x0,py,T*3,ph);
   x.strokeStyle=rgba('#ffffff',0.12);x.lineWidth=0.8;x.beginPath();x.moveTo(x0+4,py+ph*0.35+k*2);x.bezierCurveTo(x0+T,py+ph*0.25,x0+T*2,py+ph*0.6,x0+T*3-4,py+ph*0.4);x.stroke();
   x.strokeStyle=rgba('#8a6440',0.18);x.beginPath();x.moveTo(x0+6,py+ph*0.7);x.bezierCurveTo(x0+T*0.8,py+ph*0.8,x0+T*2.2,py+ph*0.55,x0+T*3-6,py+ph*0.75);x.stroke();
   if(k>0.86){x.fillStyle=rgba('#8a6440',0.35);x.beginPath();x.ellipse(x0+T*1.5*k,py+ph/2,2.2,1.3,0,0,6.283);x.fill();}
   x.strokeStyle=rgba('#9c7650',0.75);x.lineWidth=1;x.beginPath();x.moveTo(x0+0.5,py);x.lineTo(x0+0.5,py+ph);x.stroke();}
  x.strokeStyle=rgba('#9c7650',0.7);x.lineWidth=1;x.beginPath();x.moveTo(X,py+0.5);x.lineTo(X+T,py+0.5);x.stroke();}}
function paintCeramic(x,tx,ty,X,Y,cols){var s=T/2;for(var a=0;a<2;a++)for(var b=0;b<2;b++){var k=hash2(tx*2+a,ty*2+b,5);x.fillStyle=cols[Math.floor(k*cols.length)];x.fillRect(X+a*s,Y+b*s,s,s);
  var hg=x.createLinearGradient(X+a*s,Y+b*s,X+a*s+s,Y+b*s+s);hg.addColorStop(0,rgba('#ffffff',0.14));hg.addColorStop(1,rgba('#000000',0.05));x.fillStyle=hg;x.fillRect(X+a*s,Y+b*s,s,s);}
  x.strokeStyle=rgba('#a8917a',0.8);x.lineWidth=1;x.beginPath();for(var q=0;q<=2;q++){x.moveTo(X+q*s,Y);x.lineTo(X+q*s,Y+T);x.moveTo(X,Y+q*s);x.lineTo(X+T,Y+q*s);}x.stroke();}
var FLOWER_COLS=['#f2c94c','#ffffff','#b07ad6','#e05a47','#7fb3e6'];
function paintGrass(x,m,tx,ty,X,Y,h,bend,meadow){var k0=hh(tx,ty,1);
  var base=meadow?mixC('#bfd486','#9fb662',h):mixC('#abd281','#84b660',h);
  // soft patches from a smooth noise field, painted in 8 px cells so neighbouring tiles blend
  for(var sy2=0;sy2<4;sy2++)for(var sx2=0;sx2<4;sx2++){var nx=X+sx2*8+4,ny=Y+sy2*8+4,nv=vnoise(nx,ny,T*2.6,3)*0.7+vnoise(nx,ny,T*0.9,4)*0.3;x.fillStyle=shadeC(base,(nv-0.5)*0.16);x.fillRect(X+sx2*8,Y+sy2*8,8,8);}
  // mown stripes: the way you pushed the mower decides light or dark
  var str=bend?clamp(1-h*1.7,0,1):0;
  if(str>0){var light=bend===1||bend===3;x.fillStyle=light?rgba('#ffffff',0.15*str):rgba('#2a3a1a',0.09*str);x.fillRect(X,Y,T,T);
    x.strokeStyle=light?rgba('#ffffff',0.22*str):rgba('#2a3a1a',0.12*str);x.lineWidth=0.9;x.beginPath();
    for(var s=0;s<8;s++){var o=(s+0.5)*T/8+(hh(tx,ty,10+s)-0.5)*2;if(bend<3){x.moveTo(X,Y+o);x.lineTo(X+T,Y+o+(hh(tx,ty,30+s)-0.5)*1.5);}else{x.moveTo(X+o,Y);x.lineTo(X+o+(hh(tx,ty,30+s)-0.5)*1.5,Y+T);}}x.stroke();}
  // tufts grow back with the height
  var n=Math.round((meadow?3:2)+h*(meadow?11:9)),dark=meadow?'#62813a':'#4f8a3c';
  for(var j=0;j<n;j++){var L=(meadow?3.5:2.5)+h*(meadow?9:5)*(0.6+0.4*hh(tx,ty,90+j)),lean=(hh(tx,ty,110+j)-0.5)*L*0.8,mg=Math.abs(lean)+2,bx=X+mg+hh(tx,ty,40+j)*(T-mg*2-1),by=Y+L+1.5+hh(tx,ty,70+j)*Math.max(1,T-L-2.5);
    x.strokeStyle=rgba(dark,0.45+0.35*hh(tx,ty,130+j));x.lineWidth=1;x.lineCap='round';x.beginPath();
    x.moveTo(bx,by);x.quadraticCurveTo(bx+lean*0.3,by-L*0.6,bx+lean,by-L);x.moveTo(bx+1,by);x.quadraticCurveTo(bx+1-lean*0.2,by-L*0.5,bx+1-lean*0.6,by-L*0.8);x.stroke();
    if(meadow&&h>0.65&&hh(tx,ty,150+j)<0.28){x.fillStyle=rgba('#c9b06e',0.9);x.beginPath();x.ellipse(bx+lean,by-L,1.1,2,lean*0.05,0,6.283);x.fill();}}
  // flowers come back when it's long
  var fl=meadow?(h>0.6?Math.floor(hh(tx,ty,5)*3.2):0):(h>0.55&&hh(tx,ty,6)<0.14?1:0);
  for(var f=0;f<fl;f++){var fx=X+4+hh(tx,ty,200+f)*(T-8),fy=Y+4+hh(tx,ty,220+f)*(T-8),col=meadow?FLOWER_COLS[Math.floor(hh(tx,ty,240+f)*FLOWER_COLS.length)]:'#ffffff';
    x.fillStyle=col;for(var p=0;p<5;p++){var a=p/5*6.283+hh(tx,ty,260+f);x.beginPath();x.arc(fx+Math.cos(a)*1.8,fy+Math.sin(a)*1.8,1.4,0,6.283);x.fill();}
    x.fillStyle=col==='#f2c94c'?'#a5701c':'#e9b93a';x.beginPath();x.arc(fx,fy,1.1,0,6.283);x.fill();}}
function paintStep(x,tx,ty,X,Y){var n=hh(tx,ty,7)<0.5?1:2;for(var s=0;s<n;s++){var cx=X+T*(n===1?0.5:(s?0.68:0.32))+(hh(tx,ty,300+s)-0.5)*4,cy=Y+T*(n===1?0.5:(s?0.62:0.36))+(hh(tx,ty,310+s)-0.5)*4,rx=n===1?11:8,ry=n===1?8:6;
  x.fillStyle=rgba('#3a3020',0.15);x.beginPath();x.ellipse(cx+1,cy+2,rx,ry,0,0,6.283);x.fill();inkBlob(x,cx,cy,rx,ry,{fill:mixC('#dad2c0','#c9c0ab',hh(tx,ty,320+s)),seed:tx*31+ty*7+s,irr:0.1,w:1.2,wash:0.8});}}
function paintDirt(x,tx,ty,X,Y){x.fillStyle=mixC('#c8a77c','#bc9a6e',hh(tx,ty,1));x.fillRect(X,Y,T,T);
  for(var j=0;j<26;j++){var px=X+hh(tx,ty,20+j)*T,py=Y+hh(tx,ty,60+j)*T,k=hh(tx,ty,100+j);x.fillStyle=k<0.5?rgba('#8f6c45',0.45):rgba('#e3cba3',0.5);x.fillRect(px,py,1.3+k,1.3);}
  for(var q=0;q<3;q++){var kx=X+3+hh(tx,ty,140+q)*(T-6),ky=Y+3+hh(tx,ty,150+q)*(T-6);x.fillStyle='#b5ad9c';x.beginPath();x.ellipse(kx,ky,1.8,1.3,0,0,6.283);x.fill();x.strokeStyle=rgba(INK,0.4);x.lineWidth=0.6;x.stroke();}}
function paintPatio(x,tx,ty,X,Y){x.fillStyle='#b8aa8f';x.fillRect(X,Y,T,T);var s=T/2;
  for(var a=0;a<2;a++)for(var b=0;b<2;b++){var k=hash2(tx*2+a,ty*2+b,8),off=(ty*2+b)%2?s/2:0,px=X+a*s+off;
   for(var rep=-1;rep<=0;rep++){var sx=px+rep*s;if(sx+s<X||sx>X+T)continue;
    x.fillStyle=mixC('#ddd5c3','#cbc1ab',hash2(Math.floor((sx-X)/s)+tx*2,ty*2+b,9));x.beginPath();x.roundRect?x.roundRect(sx+1.2,Y+b*s+1.2,s-2.4,s-2.4,2.5):x.rect(sx+1.2,Y+b*s+1.2,s-2.4,s-2.4);x.fill();
    x.strokeStyle=rgba(INK,0.35);x.lineWidth=0.8;x.stroke();}}}
// ----- water: one smooth field per body (stream, pond). Tiles follow the field for the game logic; the picture is traced from it -----
function streamC(b,x){return b.cy+3.0*Math.sin(0.17*x+0.6)+1.2*Math.sin(0.43*x+1.7);}
function streamC1(b,x){return 0.51*Math.cos(0.17*x+0.6)+0.516*Math.cos(0.43*x+1.7);}
function streamW(b,x){return 2.6+0.9*Math.sin(0.29*x+2.0)+0.3*Math.sin(0.71*x+0.4);}
function bodyF(b,wx,wy){var tx=wx/T,ty=wy/T;
  if(b.k==='stream'){var c=streamC(b,tx),sl=streamC1(b,tx),d=Math.abs(ty-c)/Math.sqrt(1+sl*sl)-streamW(b,tx)/2;return 0.5-d*0.9+(vnoise(wx,wy,T*1.4,b.seed||5)-0.5)*0.2;}
  var dx=(tx-b.cx)/b.rx,dy=(ty-b.cy)/b.ry,r=Math.sqrt(dx*dx+dy*dy),a=Math.atan2(dy,dx),sd=b.seed||1,wob=0.09*Math.sin(a*3+sd)+0.06*Math.sin(a*5+sd*2.3);
  return 0.5-(r-1-wob)*Math.min(b.rx,b.ry)*0.9+(vnoise(wx,wy,T*1.1,sd+7)-0.5)*0.12;}
function fieldAt(m,wx,wy){var f=-9,bs=m.bodies||[];for(var i=0;i<bs.length;i++){var v=bodyF(bs[i],wx,wy);if(v>f)f=v;}return f;}
// set the tiles from the field: water inside, a sandy bank along the stream
function applyBodies(m){for(var ty=0;ty<m.h;ty++)for(var tx=0;tx<m.w;tx++){var cx=tx*T+T/2,cy=ty*T+T/2,f=fieldAt(m,cx,cy);if(f>0.5){mset(m,tx,ty,G_WATER,0);continue;}
  var sf=-9;(m.bodies||[]).forEach(function(b){if(b.k==='stream')sf=Math.max(sf,bodyF(b,cx,cy));});if(sf>0.12&&isGrass(mget(m,tx,ty)))mset(m,tx,ty,G_SAND,0.45);}}
// the field sampled every 8 px, for drawing and for runtime checks (fish, bobber, shimmer)
var WSTEP=8;
function buildField(m){var nx=Math.ceil(m.w*T/WSTEP)+1,ny=Math.ceil(m.h*T/WSTEP)+1,v=new Float32Array(nx*ny),any=false;
  if(!(m.bodies&&m.bodies.length)){L.wf=null;return null;}
  for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var f=fieldAt(m,i*WSTEP,j*WSTEP);v[j*nx+i]=f;if(f>-0.2)any=true;}
  L.wf=any?{nx:nx,ny:ny,v:v}:null;return L.wf;}
function waterF(wx,wy){var F=L.wf;if(!F)return -1;var gx=clamp(wx/WSTEP,0,F.nx-1.001),gy=clamp(wy/WSTEP,0,F.ny-1.001),i=Math.floor(gx),j=Math.floor(gy),fx=gx-i,fy=gy-j,v=F.v,n=F.nx;
  return lerp(lerp(v[j*n+i],v[j*n+i+1],fx),lerp(v[(j+1)*n+i],v[(j+1)*n+i+1],fx),fy);}
function bankW(wx,wy){return 0.26+0.32*vnoise(wx,wy,T*2.2,41);}            // how far the bank wash reaches, in field units
function smooth01(a,b,v){var t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);}
// marching squares on the field: returns polylines of the level line
function contours(F,level){var nx=F.nx,ny=F.ny,v=F.v,segs=[];function P(i,j){return [i*WSTEP,j*WSTEP];}
  function ip(a,b,va,vb){var t=(level-va)/(vb-va);return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
  for(var j=0;j<ny-1;j++)for(var i=0;i<nx-1;i++){var a=v[j*nx+i],b=v[j*nx+i+1],c=v[(j+1)*nx+i+1],d=v[(j+1)*nx+i];var k=(a>level?8:0)|(b>level?4:0)|(c>level?2:0)|(d>level?1:0);if(k===0||k===15)continue;
    var pa=P(i,j),pb=P(i+1,j),pc=P(i+1,j+1),pd=P(i,j+1),T0=ip(pa,pb,a,b),R0=ip(pb,pc,b,c),B0=ip(pd,pc,d,c),L0=ip(pa,pd,a,d);
    var mid=(a+b+c+d)/4>level;
    switch(k){case 1:case 14:segs.push([L0,B0]);break;case 2:case 13:segs.push([B0,R0]);break;case 3:case 12:segs.push([L0,R0]);break;case 4:case 11:segs.push([T0,R0]);break;
      case 6:case 9:segs.push([T0,B0]);break;case 7:case 8:segs.push([L0,T0]);break;
      case 5:if(mid){segs.push([L0,T0]);segs.push([B0,R0]);}else{segs.push([L0,B0]);segs.push([T0,R0]);}break;
      case 10:if(mid){segs.push([T0,R0]);segs.push([L0,B0]);}else{segs.push([L0,T0]);segs.push([B0,R0]);}break;}}
  // join the pieces into lines
  var key=function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);},ends={},used=new Uint8Array(segs.length),out=[];
  segs.forEach(function(s,ix){[0,1].forEach(function(e){var k2=key(s[e]);(ends[k2]||(ends[k2]=[])).push(ix);});});
  function next(p,skip){var l=ends[key(p)]||[];for(var q=0;q<l.length;q++)if(!used[l[q]]&&l[q]!==skip)return l[q];return -1;}
  for(var s0=0;s0<segs.length;s0++){if(used[s0])continue;used[s0]=1;var line=[segs[s0][0],segs[s0][1]];
    for(var dir=0;dir<2;dir++){var guard=0;while(guard++<20000){var tail=line[line.length-1],n2=next(tail,-1);if(n2<0)break;used[n2]=1;var sg=segs[n2];line.push(key(sg[0])===key(tail)?sg[1]:sg[0]);}line.reverse();}
    var closed=key(line[0])===key(line[line.length-1]);if(closed)line.pop();if(line.length>2)out.push({pts:line,closed:closed});}
  return out;}
function chaikin(pts,closed,it){for(var k=0;k<it;k++){var o=[],n=pts.length;for(var i=0;i<(closed?n:n-1);i++){var a=pts[i],b=pts[(i+1)%n];o.push([a[0]*0.75+b[0]*0.25,a[1]*0.75+b[1]*0.25]);o.push([a[0]*0.25+b[0]*0.75,a[1]*0.25+b[1]*0.75]);}if(!closed){o.unshift(pts[0]);o.push(pts[n-1]);}pts=o;}return pts;}
// paint the whole water layer (bank wash, water, ripples, foam, one ink outline) into its own canvas
function renderWater(m){var F=buildField(m);L.wov=null;if(!F)return;var W=m.w*T,H=m.h*T;
  // bounding box of anything wet or sandy
  var x0=W,y0=H,x1=0,y1=0;for(var j=0;j<F.ny;j++)for(var i=0;i<F.nx;i++){if(F.v[j*F.nx+i]>0.5-0.62){x0=Math.min(x0,i*WSTEP);y0=Math.min(y0,j*WSTEP);x1=Math.max(x1,i*WSTEP);y1=Math.max(y1,j*WSTEP);}}
  if(x1<=x0)return;x0=Math.max(0,x0-16);y0=Math.max(0,y0-16);x1=Math.min(W,x1+16);y1=Math.min(H,y1+16);var bw=x1-x0,bh=y1-y0,d=L.gd;
  // 1. colour mask at 4 px, scaled up smooth
  var R=4,mw=Math.ceil(bw/R),mh=Math.ceil(bh/R),mc=document.createElement('canvas');mc.width=mw;mc.height=mh;var mx=mc.getContext('2d'),img=mx.createImageData(mw,mh),px=img.data;
  var SH=hexRGB('#acd9e3'),DP=hexRGB('#6fb0c6'),DRY=hexRGB('#e3cfa2'),WET=hexRGB('#c4ab7c');
  for(var yy=0;yy<mh;yy++)for(var xx=0;xx<mw;xx++){var wx=x0+xx*R+R/2,wy=y0+yy*R+R/2,f=waterF(wx,wy),aw=smooth01(0.47,0.53,f),bwid=bankW(wx,wy),ab=smooth01(0.5-bwid,0.5-bwid*0.45,f),o=(yy*mw+xx)*4;
    var dt=smooth01(0.52,1.25,f)+(vnoise(wx,wy,T*1.6,8)-0.5)*0.18,wc=[lerp(SH[0],DP[0],clamp(dt,0,1)),lerp(SH[1],DP[1],clamp(dt,0,1)),lerp(SH[2],DP[2],clamp(dt,0,1))];
    var wet=smooth01(0.5-bwid*0.55,0.5,f),bc=[lerp(DRY[0],WET[0],wet),lerp(DRY[1],WET[1],wet),lerp(DRY[2],WET[2],wet)];
    px[o]=lerp(bc[0],wc[0],aw);px[o+1]=lerp(bc[1],wc[1],aw);px[o+2]=lerp(bc[2],wc[2],aw);px[o+3]=Math.round(255*Math.max(aw,ab*0.92));}
  mx.putImageData(img,0,0);
  var c=document.createElement('canvas');c.width=Math.ceil(bw*d);c.height=Math.ceil(bh*d);var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.imageSmoothingEnabled=true;try{x.imageSmoothingQuality='high';}catch(e){}
  x.drawImage(mc,0,0,mw*R,mh*R);x.translate(-x0,-y0);
  // 2. pebbles on the bank, ripples in the water
  var r=mulberry32(m.seed+5);for(var q=0;q<Math.round(bw*bh/900);q++){var qx=x0+r()*bw,qy=y0+r()*bh,f2=waterF(qx,qy),bw2=bankW(qx,qy);
    if(f2>0.5-bw2*0.9&&f2<0.46){x.fillStyle=mixC('#bdb6a6','#a39c8c',r());x.beginPath();x.ellipse(qx,qy,1.6+r()*1.6,1.1+r()*1,r()*3,0,6.283);x.fill();x.strokeStyle=rgba(INK,0.4);x.lineWidth=0.6;x.stroke();}
    else if(f2>0.62&&r()<0.45){x.strokeStyle=rgba('#ffffff',0.36);x.lineWidth=1;x.beginPath();x.moveTo(qx,qy);x.quadraticCurveTo(qx+4,qy-2,qx+9,qy);x.stroke();}}
  // 3. foam just inside the edge, then one ink line round each body
  contours(F,0.565).forEach(function(cn){var pts=chaikin(cn.pts,cn.closed,2);inkPath(x,pts,{closed:cn.closed,col:rgba('#ffffff',0.5),w:2.2,seed:7,amp:0.8});});
  contours(F,0.5).forEach(function(cn,ix){var pts=chaikin(cn.pts,cn.closed,2);inkPath(x,pts,{closed:cn.closed,col:rgba(INK,0.82),w:1.6,seed:11+ix,amp:1.1});});
  // paper grain on the paint
  x.setTransform(d,0,0,d,0,0);x.globalCompositeOperation='source-atop';x.globalAlpha=0.5;x.fillStyle=grainPattern(x);x.fillRect(0,0,bw,bh);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  L.wov={c:c,x:x0,y:y0,w:bw,h:bh};}
function blitWater(x,clip){var o=L.wov;if(!o)return;if(clip){var ax=Math.max(clip[0],o.x),ay=Math.max(clip[1],o.y),bx=Math.min(clip[0]+clip[2],o.x+o.w),by=Math.min(clip[1]+clip[3],o.y+o.h);if(bx<=ax||by<=ay)return;
    var d=L.gd;x.drawImage(o.c,(ax-o.x)*d,(ay-o.y)*d,(bx-ax)*d,(by-ay)*d,ax,ay,bx-ax,by-ay);return;}x.drawImage(o.c,o.x,o.y,o.w,o.h);}
// under the water layer, wet tiles and banks are painted as the grass around them
function landUnder(m,tx,ty){var best=null,cnt={},hs=0,hn=0;for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++){var g=mget(m,tx+dx,ty+dy);if(g===G_GRASS||g===G_MEADOW||g===G_STEP){cnt[g]=(cnt[g]||0)+1;hs+=m.gh[mi(m,tx+dx,ty+dy)];hn++;}}
  Object.keys(cnt).forEach(function(k){if(best==null||cnt[k]>cnt[best])best=+k;});return {g:best==null?(m.stream?G_MEADOW:G_GRASS):best,h:hn?hs/hn:0.6};}
function paintWater(x,m,tx,ty,X,Y){var u=landUnder(m,tx,ty);paintGrass(x,m,tx,ty,X,Y,u.h,0,u.g===G_MEADOW);}
function paintSand(x,m,tx,ty,X,Y){var u=landUnder(m,tx,ty);paintGrass(x,m,tx,ty,X,Y,u.h,0,u.g===G_MEADOW);}
// a city view under the balcony rail
function paintBackdrop(x,m){if(m.backdrop!=='city'||!m.balcony)return;var b=m.balcony,Y0=(b.y+b.h)*T,W=m.w*T,H=m.h*T-Y0;
  var g=x.createLinearGradient(0,Y0,0,Y0+H);g.addColorStop(0,'#e4ecec');g.addColorStop(1,'#f0ede2');x.fillStyle=g;x.fillRect(0,Y0,W,H);
  var r=mulberry32(77),bx=-6;while(bx<W){var bw=18+r()*30,bh=14+r()*40,col=mixC('#c4d1d6','#b4c3ca',r());x.fillStyle=col;x.fillRect(bx,Y0+H-bh,bw,bh);x.strokeStyle=rgba(INK,0.35);x.lineWidth=1;x.strokeRect(bx+0.5,Y0+H-bh+0.5,bw-1,bh);
    x.fillStyle=rgba('#ffffff',0.6);for(var wy=Y0+H-bh+4;wy<Y0+H-3;wy+=6)for(var wx=bx+3;wx<bx+bw-3;wx+=5)if(r()<0.55)x.fillRect(wx,wy,2,2.5);bx+=bw+2+r()*6;}
  // a palm by the road
  var px=W*0.78,py=Y0+H;inkPath(x,[[px,py],[px+2,py-26],[px+4,py-40]],{col:'#8a6a48',w:2.4,seed:5,amp:0.6});
  for(var f=0;f<6;f++){var a=-2.6+f*0.42;inkPath(x,[[px+4,py-40],[px+4+Math.cos(a)*9,py-40+Math.sin(a)*6-3],[px+4+Math.cos(a)*16,py-40+Math.sin(a)*9+2]],{col:'#5f8f4a',w:2,seed:9+f,amp:0.4});}}
// window light falling on the floor
function paintWindowLight(x,m){m.rooms.forEach(function(r){(r.windows||[]).forEach(function(w){var X0=w.x*T+4,X1=(w.x+w.w)*T-4,Y0=r.y*T,Y1=Y0+T*2.4,sk=T*0.5;
  x.save();x.beginPath();x.moveTo(X0,Y0);x.lineTo(X1,Y0);x.lineTo(X1+sk,Y1);x.lineTo(X0+sk,Y1);x.closePath();var g=x.createLinearGradient(0,Y0,0,Y1);g.addColorStop(0,'rgba(255,244,214,.34)');g.addColorStop(1,'rgba(255,244,214,0)');x.fillStyle=g;x.fill();x.restore();});});}
function renderGround(){var m=LS().map,W=m.w*T,H=m.h*T,big=W*H>700000,d=Math.min(big?1.5:2,window.devicePixelRatio||1);
  if(!L.gcv)L.gcv=document.createElement('canvas');L.gcv.width=Math.round(W*d);L.gcv.height=Math.round(H*d);L.gd=d;var x=L.gcv.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,W,H);
  waterDepth(m);
  if(S.stage<2){x.save();x.shadowColor='rgba(60,45,25,0.22)';x.shadowBlur=18;x.shadowOffsetY=6;x.fillStyle='#e6dfcd';m.rooms.forEach(function(r){x.fillRect(r.x*T-6,r.y*T-BW,r.w*T+12,r.h*T+BW+12);});if(m.balcony){var bb=m.balcony;x.fillRect(bb.x*T-3,bb.y*T,bb.w*T+6,bb.h*T+4);}x.restore();}
  for(var ty=0;ty<m.h;ty++)for(var tx=0;tx<m.w;tx++)paintTile(x,m,tx,ty);
  renderWater(m);blitWater(x);
  paintBackdrop(x,m);paintWindowLight(x,m);
  LS().objs.forEach(function(o){if(OBJ[o.k]&&OBJ[o.k].flat)paintObjInto(x,o);});
  L.gbk={};for(var i=0;i<m.g.length;i++)L.gbk[i]=grassBucket(m.gh[i])+'|'+m.gb[i];L.groundOK=true;}
// redraw one tile (and anything flat that sits on it)
function repaintTile(tx,ty){var m=LS().map;if(!L.gcv||!L.groundOK)return;var x=L.gcv.getContext('2d');x.setTransform(L.gd,0,0,L.gd,0,0);paintTile(x,m,tx,ty);
  LS().objs.forEach(function(o){if(OBJ[o.k]&&OBJ[o.k].flat&&tx>=o.tx&&tx<o.tx+o.fw&&ty>=o.ty&&ty<o.ty+o.fh){x.save();x.beginPath();x.rect(tx*T,ty*T,T,T);x.clip();paintObjInto(x,o);x.restore();}});
  if(L.wov){x.save();x.beginPath();x.rect(tx*T,ty*T,T,T);x.clip();blitWater(x,[tx*T,ty*T,T,T]);x.restore();}
  m.rooms.forEach(function(r){if(ty>=r.y&&ty<r.y+3&&tx>=r.x&&tx<r.x+r.w){x.save();x.beginPath();x.rect(tx*T,ty*T,T,T);x.clip();paintWindowLight(x,{rooms:[r]});x.restore();}});
  L.gbk[mi(m,tx,ty)]=grassBucket(m.gh[mi(m,tx,ty)])+'|'+m.gb[mi(m,tx,ty)];}
function touchTile(tx,ty,later){var m=LS().map,i=mi(m,tx,ty),k=grassBucket(m.gh[i])+'|'+m.gb[i];if(!L.gbk||L.gbk[i]===k)return;if(later){(L.rq||(L.rq={}))[i]=1;return;}repaintTile(tx,ty);}
// day-by-day regrowth is repainted a few tiles per frame so nothing stutters
function drainRepaint(n){if(!L.rq)return;var ks=Object.keys(L.rq),m=LS().map;if(!ks.length)return;for(var j=0;j<Math.min(n,ks.length);j++){var i=+ks[j];delete L.rq[i];repaintTile(i%m.w,(i/m.w)|0);}}
// ----- object art: ink outlines, watercolour fills, 3/4 view -----
function rpath(x,X,Y,W,H,r){x.beginPath();if(x.roundRect)x.roundRect(X,Y,W,H,r);else x.rect(X,Y,W,H);}
function rectPts(X,Y,W,H){return [[X,Y],[X+W,Y],[X+W,Y+H],[X,Y+H]];}
// a filled, washed, outlined closed shape
function shape(x,pts,fill,seed,o){o=o||{};var w=wobble(pts,seed||1,o.amp==null?0.6:o.amp,true);x.save();tracePts(x,w,true);x.fillStyle=fill;x.fill();
  if(o.wash!==0){x.clip();var bx=1e9,by=1e9,bX=-1e9,bY=-1e9;pts.forEach(function(p){bx=Math.min(bx,p[0]);by=Math.min(by,p[1]);bX=Math.max(bX,p[0]);bY=Math.max(bY,p[1]);});washSpots(x,(bx+bX)/2,(by+bY)/2,(bX-bx)/2,(bY-by)/2,fill,seed||1,o.wash==null?0.8:o.wash);}
  x.restore();if(!o.nostroke){tracePts(x,w,true);x.lineWidth=o.w||1.4;x.strokeStyle=o.col||INK;x.lineJoin='round';x.stroke();}}
function box(x,X,Y,W,H,fill,seed,o){shape(x,rectPts(X,Y,W,H),fill,seed,o);}
function line(x,pts,w,col,seed,amp){inkPath(x,pts,{w:w||1.3,col:col||INK,seed:seed||3,amp:amp==null?0.5:amp});}
function shadowE(x,cx,cy,rx,ry,a){x.fillStyle=rgba('#2c2418',a==null?0.16:a);x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,6.283);x.fill();}
var WOOD='#9c7450',WOOD_D='#6e4f36',WOOD_L='#b98f62',METAL='#4a4a42';
var BOOKS=['#b5523f','#3f6e8a','#d7b25a','#5a8a4f','#8a5a8a','#e8dfc8','#2d4f6b','#c98a3c'];

function defObj(k,d){OBJ[k]=d;d.fw=d.fw||1;d.fh=d.fh||1;d.pad=d.pad||{l:4,r:4,u:40,d:4};}

// tanks: a cabinet with a glass tank on top. The shrimp inside are live.
defObj('tank',{fw:2,pad:{l:4,r:4,u:44,d:3},
  draw:function(x,o,X,Y,W,H){var nano=o.v==='nano',b=Y+H-3,cw=W-6;
    shadowE(x,X+W/2,b+1,W/2-2,4,0.18);
    box(x,X+3,b-(nano?16:19),cw,nano?16:19,WOOD_D,o.seed,{wash:0.6});box(x,X+2,b-(nano?21:24),W-4,5,'#8a6646',o.seed+1,{wash:0.5});
    if(!nano){line(x,[[X+W/2,b-17],[X+W/2,b-2]],1,rgba(INK,0.7),o.seed+2);x.fillStyle='#d8c08a';x.beginPath();x.arc(X+W/2-4,b-10,1.3,0,6.283);x.arc(X+W/2+4,b-10,1.3,0,6.283);x.fill();}
    var tb=b-(nano?21:24),th=nano?20:27,tx0=X+5,tw=W-10,ty0=tb-th;o._t={x:tx0,y:ty0,w:tw,h:th};
    var have=S.tanks[o.i]!=null;
    if(!have){x.save();x.setLineDash([3,3]);x.strokeStyle=rgba(INK,0.55);x.lineWidth=1.2;x.strokeRect(tx0+0.5,ty0+0.5,tw-1,th-1);x.restore();
      line(x,[[X+W/2-4,ty0+th/2],[X+W/2+4,ty0+th/2]],1.6,rgba(INK,0.6),o.seed+5,0.2);line(x,[[X+W/2,ty0+th/2-4],[X+W/2,ty0+th/2+4]],1.6,rgba(INK,0.6),o.seed+6,0.2);return;}
    var g=x.createLinearGradient(0,ty0,0,tb);g.addColorStop(0,'#b7dee6');g.addColorStop(1,'#7db4c6');x.fillStyle=g;x.fillRect(tx0,ty0+3,tw,th-3);
    x.fillStyle='#e8d6ad';x.fillRect(tx0,tb-5,tw,5);x.fillStyle=rgba('#c9b383',0.6);x.fillRect(tx0,tb-5,tw,1.2);
    // a few plants and a bit of wood
    var r=mulberry32(o.seed);for(var p=0;p<(nano?2:4);p++){var px=tx0+3+r()*(tw-6),ph=6+r()*(th-12);x.strokeStyle=p%2?'#4f8f3f':'#6aa64f';x.lineWidth=1.6;x.beginPath();x.moveTo(px,tb-4);x.quadraticCurveTo(px-2,tb-4-ph/2,px+(r()-0.5)*4,tb-4-ph);x.stroke();}
    if(!nano){x.strokeStyle='#7a5a3c';x.lineWidth=2.4;x.beginPath();x.moveTo(tx0+tw*0.15,tb-5);x.lineTo(tx0+tw*0.45,tb-9);x.lineTo(tx0+tw*0.55,tb-14);x.stroke();}
    x.fillStyle=rgba('#ffffff',0.35);x.beginPath();x.moveTo(tx0+tw*0.62,ty0+4);x.lineTo(tx0+tw*0.7,ty0+4);x.lineTo(tx0+tw*0.5,tb-6);x.lineTo(tx0+tw*0.44,tb-6);x.closePath();x.fill();
    box(x,tx0,ty0,tw,th,'rgba(0,0,0,0)',o.seed+3,{wash:0,w:1.5});x.fillStyle='#3b3a34';x.fillRect(tx0-1,ty0-2.5,tw+2,3);
    // a name plate
    x.fillStyle='#efe6d0';rpath(x,X+5,b-(nano?14:16),nano?8:9,7,1.5);x.fill();x.strokeStyle=rgba(INK,0.6);x.lineWidth=0.8;x.stroke();x.fillStyle=INK;x.font='700 6px Inter,system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(o.i+1),X+5+(nano?4:4.5),b-(nano?10.5:12.5));},
  live:function(x,o,X,Y,W,H,t){var tk=S.tanks[o.i];if(!tk||!o._t)return;var R=o._t,list=tk.shrimp||[],n=Math.min(list.length,o.v==='nano'?5:10);
    for(var j=0;j<n;j++){var ind=list[j],col='#c83c2c';if(typeof specOf==='function'){try{var sp=specOf(ind),C=COLOURS[sp.col];if(C){var rgb=hslRGB(C.h,C.s,sp.juv===2?0.9:C.l);col='rgb('+rgb.join(',')+')';}}catch(e){}}
      var ph=hash2(j,o.i,3)*6.28,sx=R.x+3+((Math.sin(t*0.25+ph)*0.5+0.5)*(R.w-6)),sy=R.y+R.h-6.5-((j*3)%5)*0.6-(hash2(j,1,o.i)<0.25?R.h*0.35:0);
      x.fillStyle=col;x.beginPath();x.ellipse(sx,sy,2,1.1,0,0,6.283);x.fill();}
    x.strokeStyle=rgba('#ffffff',0.75);x.lineWidth=0.7;for(var b=0;b<3;b++){var by=R.y+R.h-6-((t*9+b*7)%(R.h-6));x.beginPath();x.arc(R.x+R.w-4,by,0.9,0,6.283);x.stroke();}}});
defObj('shelf',{pad:{l:3,r:3,u:44,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-3,top=b-48;shadowE(x,X+W/2,b+1,W/2-2,3);
  box(x,X+3,top,W-6,48,WOOD,o.seed,{wash:0.5});var r=mulberry32(o.seed);
  for(var s=0;s<3;s++){var sy=top+5+s*14;x.fillStyle=rgba('#4a3524',0.5);x.fillRect(X+5,sy,W-10,11);var bx=X+6;
    while(bx<X+W-8){var bw=2.5+r()*3,bh=7+r()*4;if(r()<0.12){bx+=bw;continue;}var c=BOOKS[Math.floor(r()*BOOKS.length)];x.fillStyle=c;x.fillRect(bx,sy+11-bh,bw,bh);x.strokeStyle=rgba(INK,0.55);x.lineWidth=0.6;x.strokeRect(bx,sy+11-bh,bw,bh);bx+=bw+0.4;}
    line(x,[[X+4,sy+11.5],[X+W-4,sy+11.5]],1.3,INK,o.seed+s);}
  // a small cactus on top
  shape(x,[[X+W/2-4,top-1],[X+W/2+4,top-1],[X+W/2+3,top-6],[X+W/2-3,top-6]],'#c97a54',o.seed+9,{w:1});shape(x,blobPts(X+W/2,top-10,3,5,o.seed,0.05,10),'#6f9d55',o.seed+10,{w:1});}});
function drawGrandma(x,cx,b,seed){// sitting in her chair, knitting
  shape(x,blobPts(cx,b-17,8,8.5,seed,0.08,14),'#c46b55',seed+1,{w:1.3});                         // cardigan
  line(x,[[cx-3,b-21],[cx-1,b-13]],1,rgba(INK,0.5),seed+2);
  shape(x,blobPts(cx,b-29,5.3,5.6,seed+3,0.04,12),'#f1d4bd',seed+4,{w:1.2,wash:0.4});              // face
  shape(x,[[cx-5.6,b-30],[cx-4,b-34.5],[cx,b-35.8],[cx+4,b-34.5],[cx+5.6,b-30],[cx+3,b-32.5],[cx-3,b-32.5]],'#dedad2',seed+5,{w:1.1,wash:0.3});
  shape(x,blobPts(cx,b-37,2.6,2.2,seed+6,0.05,8),'#dedad2',seed+7,{w:1});                         // bun
  x.strokeStyle=INK;x.lineWidth=0.8;x.beginPath();x.arc(cx-2,b-29,1.4,0,6.283);x.arc(cx+2,b-29,1.4,0,6.283);x.stroke();
  x.fillStyle=rgba('#e07a6a',0.5);x.beginPath();x.arc(cx-3.4,b-26.8,1.1,0,6.283);x.arc(cx+3.4,b-26.8,1.1,0,6.283);x.fill();
  shape(x,blobPts(cx+3,b-12,3,2.6,seed+8,0.1,8),'#6f8fc9',seed+9,{w:1});                         // yarn
  line(x,[[cx-5,b-15],[cx+2,b-10]],0.9,'#8a6a48',seed+10,0.1);line(x,[[cx-4,b-10],[cx+3,b-15]],0.9,'#8a6a48',seed+11,0.1);}
defObj('armchair',{pad:{l:4,r:4,u:42,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-3,cx=X+W/2,fab=o.v==='b'?'#b97a5a':'#8aa07a';shadowE(x,cx,b+1,13,4);
  shape(x,[[X+4,b-30],[X+W-4,b-30],[X+W-3,b-12],[X+3,b-12]],fab,o.seed,{w:1.4});                    // back
  if(o.gm)drawGrandma(x,cx,b,o.seed+20);
  box(x,X+4,b-13,W-8,9,shadeC(fab,0.08),o.seed+1);                                                  // seat front
  shape(x,blobPts(X+5,b-14,4,7,o.seed+2,0.05,10),shadeC(fab,-0.06),o.seed+3);shape(x,blobPts(X+W-5,b-14,4,7,o.seed+4,0.05,10),shadeC(fab,-0.06),o.seed+5);
  line(x,[[X+6,b-4],[X+6,b]],1.6,WOOD_D,o.seed+6,0);line(x,[[X+W-6,b-4],[X+W-6,b]],1.6,WOOD_D,o.seed+7,0);}});
defObj('sidetable',{pad:{l:3,r:3,u:30,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-3,cx=X+W/2;shadowE(x,cx,b+1,9,3);
  line(x,[[cx,b-13],[cx,b-1]],2,WOOD_D,o.seed);line(x,[[cx-5,b],[cx+5,b]],1.6,WOOD_D,o.seed+1);
  shape(x,blobPts(cx,b-14,11,4,o.seed+2,0.02,14),'#b98a5c',o.seed+3);
  // teapot and cup
  shape(x,blobPts(cx-2,b-20,5.5,4.5,o.seed+4,0.03,12),'#f4f0e6',o.seed+5,{w:1.1,wash:0.3});x.strokeStyle='#5b7fb3';x.lineWidth=1.2;x.beginPath();x.moveTo(cx-7,b-20);x.quadraticCurveTo(cx-2,b-18,cx+3,b-20);x.stroke();
  line(x,[[cx+3,b-21],[cx+7,b-24]],1.3,INK,o.seed+6,0.1);x.strokeStyle=INK;x.lineWidth=1;x.beginPath();x.arc(cx-8,b-20,2.2,1.2,5.1);x.stroke();
  shape(x,[[cx-3,b-24.5],[cx-1,b-24.5],[cx-0.5,b-26],[cx-3.5,b-26]],'#f4f0e6',o.seed+7,{w:0.9,wash:0});
  shape(x,[[cx+4,b-15],[cx+8,b-15],[cx+7.5,b-18.5],[cx+4.5,b-18.5]],'#f4f0e6',o.seed+8,{w:0.9,wash:0});}});
defObj('sofa',{fw:3,pad:{l:4,r:4,u:30,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-3,fab='#8fa6a0';shadowE(x,X+W/2,b+1,W/2-3,4);
  shape(x,[[X+4,b-24],[X+W-4,b-24],[X+W-4,b-4],[X+4,b-4]],fab,o.seed,{w:1.4});
  line(x,[[X+W/2,b-23],[X+W/2,b-6]],1,rgba(INK,0.5),o.seed+1);
  shape(x,blobPts(X+6,b-17,5,9,o.seed+2,0.04,10),shadeC(fab,-0.07),o.seed+3);shape(x,blobPts(X+W-6,b-17,5,9,o.seed+4,0.04,10),shadeC(fab,-0.07),o.seed+5);
  // Grandma's blanket over the back
  shape(x,[[X+W*0.55,b-25],[X+W*0.78,b-25],[X+W*0.8,b-12],[X+W*0.56,b-14]],'#d9b36a',o.seed+6,{w:1.1});
  x.strokeStyle=rgba('#b5523f',0.7);x.lineWidth=1;x.beginPath();for(var s=1;s<4;s++){x.moveTo(X+W*0.55+s*4.5,b-25);x.lineTo(X+W*0.56+s*4.5,b-13);}x.stroke();
  line(x,[[X+8,b-4],[X+8,b]],1.6,WOOD_D,o.seed+7,0);line(x,[[X+W-8,b-4],[X+W-8,b]],1.6,WOOD_D,o.seed+8,0);}});
defObj('rug',{flat:true,fw:4,fh:3,draw:function(x,o,X,Y,W,H){if(o.v===1){var c='#b5523f';box(x,X+4,Y+4,W-8,H-8,c,o.seed,{wash:0.7,w:1.3});box(x,X+9,Y+9,W-18,H-18,'#efe2c6',o.seed+1,{wash:0.4,w:1});box(x,X+13,Y+13,W-26,H-26,'#3f5a7a',o.seed+2,{wash:0.6,w:1});
    x.fillStyle='#efe2c6';for(var k=0;k<5;k++){var cx=X+W/2+(k-2)*12,cy=Y+H/2;x.beginPath();x.moveTo(cx,cy-5);x.lineTo(cx+4,cy);x.lineTo(cx,cy+5);x.lineTo(cx-4,cy);x.closePath();x.fill();}}
  else{shape(x,blobPts(X+W/2,Y+H/2,W/2-4,H/2-4,o.seed,0.03,24),'#c4734f',o.seed,{w:1.3});shape(x,blobPts(X+W/2,Y+H/2,W/2-10,H/2-9,o.seed+1,0.03,22),'#e9d3a8',o.seed+1,{w:1});shape(x,blobPts(X+W/2,Y+H/2,W/2-17,H/2-14,o.seed+2,0.04,20),'#c4734f',o.seed+2,{w:0.9});}}});
defObj('mat',{flat:true,fw:2,draw:function(x,o,X,Y,W,H){box(x,X+6,Y+9,W-12,H-16,'#c9a46e',o.seed,{w:1.1});x.strokeStyle=rgba('#8a6a40',0.6);x.lineWidth=1;x.beginPath();for(var s=X+10;s<X+W-8;s+=4){x.moveTo(s,Y+11);x.lineTo(s,Y+H-9);}x.stroke();}});
defObj('plant',{pad:{l:8,r:8,u:42,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-3,cx=X+W/2;shadowE(x,cx,b+1,9,3);
  var r=mulberry32(o.seed);for(var l=0;l<5;l++){var a=-1.9+l*0.65+(r()-0.5)*0.3,len=14+r()*8,lx=cx+Math.cos(a)*len*0.75,ly=b-14+Math.sin(a)*len;
    line(x,[[cx,b-12],[lx,ly]],1.2,'#3f6a35',o.seed+l,0.3);var lc=l%2?'#4f8a45':'#3f7a3e';shape(x,blobPts(lx,ly,7,5,o.seed+30+l,0.18,14),lc,o.seed+40+l,{w:1.2});
    x.strokeStyle=rgba('#cfe3b2',0.7);x.lineWidth=0.8;x.beginPath();x.moveTo(lx-5,ly);x.lineTo(lx+5,ly);x.stroke();}
  shape(x,[[cx-8,b-13],[cx+8,b-13],[cx+6,b],[cx-6,b]],'#c97a54',o.seed+1,{w:1.3});box(x,cx-9,b-15,18,3,'#d88c64',o.seed+2,{w:1.1});}});
defObj('lamp',{pad:{l:10,r:10,u:46,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-3,cx=X+W/2;var g=x.createRadialGradient(cx,b-34,2,cx,b-30,22);g.addColorStop(0,'rgba(255,226,160,.45)');g.addColorStop(1,'rgba(255,226,160,0)');x.fillStyle=g;x.fillRect(cx-24,b-56,48,48);
  shadowE(x,cx,b+1,7,2.5);shape(x,blobPts(cx,b-1,6,2,o.seed,0.02,10),METAL,o.seed+1,{w:1});line(x,[[cx,b-2],[cx,b-30]],1.6,METAL,o.seed+2,0.1);
  shape(x,[[cx-8,b-30],[cx+8,b-30],[cx+5,b-41],[cx-5,b-41]],'#f1e4c4',o.seed+3,{w:1.2,wash:0.4});}});
defObj('herbs',{pad:{l:4,r:4,u:26,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4,cx=X+W/2;shadowE(x,cx,b+1,8,2.5);var lc=o.v?'#6aa84f':'#4f9a45';
  for(var l=0;l<7;l++){var a=-2.6+l*0.45,lx=cx+Math.cos(a)*7,ly=b-12+Math.sin(a)*6;shape(x,blobPts(lx,ly,3.6,2.6,o.seed+l,0.1,8),l%2?lc:shadeC(lc,-0.1),o.seed+10+l,{w:0.9});}
  shape(x,[[cx-7,b-10],[cx+7,b-10],[cx+5,b],[cx-5,b]],'#c97a54',o.seed,{w:1.2});}});
defObj('pot',{pad:{l:5,r:5,u:30,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4,cx=X+W/2;shadowE(x,cx,b+1,8,2.5);
  for(var l=0;l<5;l++){var a=-2.8+l*0.6;shape(x,blobPts(cx+Math.cos(a)*6,b-13+Math.sin(a)*4,4.2,3,o.seed+l,0.12,8),'#5a8f45',o.seed+20+l,{w:0.9});}
  for(var f=0;f<4;f++){var fx=cx-6+f*4,fy=b-20-(f%2)*4;x.fillStyle=o.v===1?'#f2c94c':'#d9473a';for(var p=0;p<5;p++){var a2=p*1.256;x.beginPath();x.arc(fx+Math.cos(a2)*1.6,fy+Math.sin(a2)*1.6,1.4,0,6.283);x.fill();}}
  shape(x,[[cx-7,b-10],[cx+7,b-10],[cx+5,b],[cx-5,b]],'#c97a54',o.seed,{w:1.2});}});
defObj('bchair',{pad:{l:4,r:4,u:30,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-3,cx=X+W/2;shadowE(x,cx,b+1,10,3);
  line(x,[[cx-8,b],[cx+6,b-20]],1.4,METAL,o.seed);line(x,[[cx+8,b],[cx-6,b-20]],1.4,METAL,o.seed+1);
  box(x,cx-9,b-13,18,4,'#c49a6c',o.seed+2,{w:1.1});box(x,cx-8,b-26,16,10,'#c49a6c',o.seed+3,{w:1.1});line(x,[[cx-7,b-21],[cx+7,b-21]],0.8,rgba(INK,0.5),o.seed+4);}});
// a window feeder on the glass: drawn with the back wall
defObj('wfeeder',{wall:true,draw:function(){},live:function(x,o,X,Y,W,H){var cx=X+W/2,fy=Y-13;o._perch=[[cx-9,fy-6],[cx+1,fy-6],[cx+10,fy-6]];
  shape(x,[[cx-14,fy-6],[cx+14,fy-6],[cx+14,fy+2],[cx-14,fy+2]],'rgba(255,255,255,0.35)',o.seed,{w:1.1,wash:0});
  var lv=clamp(o.s||0,0,1);if(lv>0.02){x.fillStyle='#a5784a';x.fillRect(cx-13,fy+2-7*lv,26,7*lv);x.fillStyle=rgba('#e3c48f',0.9);for(var k=0;k<10;k++){x.fillRect(cx-12+hash2(k,1,o.seed)*24,fy+1.5-7*lv*hash2(k,2,o.seed),1.4,1.2);}}
  line(x,[[cx-15,fy-6],[cx+15,fy-6]],1.6,'#8a6646',o.seed+2,0.2);}});
defObj('feeder',{pad:{l:12,r:12,u:56,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4,cx=X+W/2;
  if(o.v==='hang'){line(x,[[X+W+6,b-44],[cx,b-44]],2,METAL,o.seed,0.2);line(x,[[cx,b-44],[cx,b-36]],0.8,METAL,o.seed+1,0.1);}
  else{shadowE(x,cx,b+1,7,2.5);line(x,[[cx,b],[cx,b-34]],2.2,METAL,o.seed,0.15);line(x,[[cx-5,b],[cx+5,b]],1.6,METAL,o.seed+1,0.1);}
  var top=o.v==='hang'?b-36:b-34;o._fd={x:cx,y:top};
  shape(x,[[cx-9,top-3],[cx+9,top-3],[cx+6,top-10],[cx-6,top-10]],'#8a5a3c',o.seed+2,{w:1.2});                         // roof
  shape(x,[[cx-9,top+15],[cx+9,top+15],[cx+9,top+18],[cx-9,top+18]],WOOD_L,o.seed+3,{w:1.1});                         // tray
  line(x,[[cx-13,top+14],[cx-8,top+14]],1.2,WOOD_D,o.seed+4,0);line(x,[[cx+8,top+14],[cx+13,top+14]],1.2,WOOD_D,o.seed+5,0);},
  live:function(x,o,X,Y,W,H){if(!o._fd)return;var cx=o._fd.x,top=o._fd.y,lv=clamp(o.s||0,0,1);o._perch=[[cx-11,top+13],[cx+11,top+13]];
    x.fillStyle='rgba(235,245,246,0.55)';x.fillRect(cx-5,top-3,10,18);
    if(lv>0.02){x.fillStyle='#a5784a';x.fillRect(cx-5,top+15-18*lv,10,18*lv);x.fillStyle=rgba('#e3c48f',0.9);for(var k=0;k<8;k++)x.fillRect(cx-4+hash2(k,3,o.seed)*8,top+14-17*lv*hash2(k,4,o.seed),1.3,1.1);}
    x.strokeStyle=INK;x.lineWidth=1.2;x.strokeRect(cx-5,top-3,10,18);x.fillStyle=rgba('#ffffff',0.5);x.fillRect(cx-3.5,top-1,1.5,13);}});
defObj('coop',{fw:3,fh:2,pad:{l:6,r:10,u:30,d:4},draw:function(x,o,X,Y,W,H){var b=Y+H-6,x0=X+6,w=62;
  shadowE(x,X+W/2,b+2,W/2,7,0.15);
  x.fillStyle=rgba('#e6c56a',0.55);for(var s=0;s<30;s++){var sx=X+4+hash2(s,1,o.seed)*(W-8),sy=b-2+hash2(s,2,o.seed)*8;x.fillRect(sx,sy,3,0.9);}
  [x0+3,x0+w-5].forEach(function(lx,j){line(x,[[lx,b],[lx,b-8]],2,WOOD_D,o.seed+j,0);});
  box(x,x0,b-38,w,30,'#c98d5a',o.seed,{w:1.4});
  x.strokeStyle=rgba('#7a4f2c',0.45);x.lineWidth=0.9;x.beginPath();for(var p=1;p<6;p++){x.moveTo(x0+1,b-38+p*5);x.lineTo(x0+w-1,b-38+p*5);}x.stroke();
  shape(x,[[x0-5,b-37],[x0+w+5,b-37],[x0+w-6,b-56],[x0+6,b-56]],'#8a4f38',o.seed+1,{w:1.4});                         // roof
  x.strokeStyle=rgba('#5c3022',0.55);x.lineWidth=0.9;x.beginPath();for(var q=1;q<4;q++){var yy=b-37-q*4.8;x.moveTo(x0-4+q*2.8,yy);x.lineTo(x0+w+4-q*2.8,yy);}x.stroke();
  box(x,x0+22,b-26,14,18,'#7a4f2c',o.seed+2,{w:1.2});x.fillStyle='#2f2418';x.beginPath();x.arc(x0+29,b-17,8,Math.PI,0);x.fill();             // door
  shape(x,[[x0+24,b-8],[x0+34,b-8],[x0+44,b+2],[x0+34,b+2]],WOOD_L,o.seed+3,{w:1.1});x.strokeStyle=rgba(INK,0.6);x.lineWidth=0.8;x.beginPath();for(var rg=1;rg<4;rg++){x.moveTo(x0+24+rg*3.4,b-8+rg*2.6);x.lineTo(x0+34+rg*3.4,b-8+rg*2.6);}x.stroke();
  box(x,x0+6,b-33,10,8,'#cfe7f0',o.seed+4,{w:1,wash:0});line(x,[[x0+11,b-33],[x0+11,b-25]],0.8,INK,o.seed+5,0);
  // the nest box on the side, open in front
  box(x,x0+w-2,b-30,24,20,'#b97a48',o.seed+6,{w:1.3});shape(x,[[x0+w-4,b-30],[x0+w+24,b-30],[x0+w+20,b-36],[x0+w,b-36]],'#8a4f38',o.seed+7,{w:1.2});
  x.fillStyle='#4a3424';x.fillRect(x0+w+1,b-27,18,13);x.fillStyle='#e6c56a';x.fillRect(x0+w+1,b-17,18,4);x.strokeStyle=rgba('#b8902e',0.8);x.lineWidth=0.7;x.beginPath();for(var st=0;st<8;st++){x.moveTo(x0+w+2+st*2.3,b-17);x.lineTo(x0+w+3.5+st*2.3,b-13.5);}x.stroke();
  o._nest={x:x0+w+1,y:b-27,w:18,h:13};},
  live:function(x,o){if(!o._nest)return;var N=o._nest,eggs=LS().eggs||[];o._eggPos=[];
    for(var j=0;j<Math.min(eggs.length,6);j++){var ex=N.x+3.5+(j%3)*5.6,ey=N.y+N.h-3.6-(j>=3?3.2:0);o._eggPos.push([ex,ey,j]);drawEgg(x,eggs[j],ex,ey,2.6);}}});
defObj('tree',{fw:2,fh:2,pad:{l:14,r:14,u:70,d:4},draw:function(x,o,X,Y,W,H){var small=o.small||o.fw===1,b=Y+H-(small?4:7),cx=X+W/2,R=small?13:24,top=b-(small?22:34);
  var greens=[['#6f9d55','#5b8a47','#a7cb7f'],['#5b8a47','#4b7a3c','#93bd6e'],['#86a457','#6f8f45','#bad38a']][o.v%3];
  shadowE(x,cx+3,b+1,R*0.9,R*0.32,0.17);
  shape(x,[[cx-3.5,b],[cx+3.5,b],[cx+2.2,top+6],[cx-2.2,top+6]],'#7a5a3c',o.seed,{w:1.3});
  if(!small){line(x,[[cx,top+16],[cx+9,top+6]],2,'#7a5a3c',o.seed+1,0.3);line(x,[[cx,top+20],[cx-8,top+10]],1.8,'#7a5a3c',o.seed+2,0.3);}
  var r=mulberry32(o.seed),parts=[];for(var p=0;p<(small?4:7);p++){var a=p/(small?4:7)*6.283+r()*0.6,d=R*(0.35+r()*0.3);parts.push([cx+Math.cos(a)*d,top-R*0.55+Math.sin(a)*d*0.62,R*(0.42+r()*0.22)]);}
  parts.push([cx,top-R*0.7,R*0.55]);
  parts.sort(function(a,c){return a[1]-c[1];}).forEach(function(q,j){shape(x,blobPts(q[0],q[1],q[2],q[2]*0.86,o.seed+10+j,0.14,16),j%2?greens[0]:greens[1],o.seed+20+j,{w:1.4,wash:1});});
  x.fillStyle=rgba(greens[2],0.65);parts.slice(0,4).forEach(function(q,j){x.beginPath();x.ellipse(q[0]-q[2]*0.3,q[1]-q[2]*0.35,q[2]*0.32,q[2]*0.2,-0.4,0,6.283);x.fill();});
  if(small&&o.v===2){x.fillStyle='#e8892e';for(var f=0;f<6;f++){x.beginPath();x.arc(cx+(r()-0.5)*R*1.4,top-R*0.5+(r()-0.5)*R*0.9,1.8,0,6.283);x.fill();}}}});
defObj('bush',{pad:{l:6,r:6,u:24,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4,cx=X+W/2;shadowE(x,cx,b+1,12,3.5);
  var gs=['#5b8a47','#6f9d55','#4f7f40'];for(var p=0;p<3;p++){shape(x,blobPts(cx-7+p*7,b-9-(p===1?4:0),8.5,7.5,o.seed+p,0.15,14),gs[(p+o.v)%3],o.seed+10+p,{w:1.3});}
  if(o.v){x.fillStyle=o.v===1?'#f7f4ec':'#e88aa6';for(var f=0;f<7;f++){x.beginPath();x.arc(cx-10+hash2(f,1,o.seed)*20,b-17+hash2(f,2,o.seed)*12,1.3,0,6.283);x.fill();}}}});
defObj('flowers',{pad:{l:3,r:3,u:22,d:2},draw:function(x,o,X,Y,W,H){var b=Y+H-5,r=mulberry32(o.seed),cols=[['#d9473a','#f2c94c'],['#9b6cc9','#f7f4ec'],['#f2c94c','#e88aa6'],['#f7f4ec','#d9473a']][o.v%4];
  for(var s=0;s<6;s++){var fx=X+5+r()*(W-10),fy=b-8-r()*9;line(x,[[fx,b-1],[fx+(r()-0.5)*3,fy]],1,'#4f8a3c',o.seed+s,0.2);
    shape(x,blobPts(fx+3,fy+5,2.8,1.6,o.seed+30+s,0.1,8),'#5f9a45',o.seed+40+s,{w:0.7,wash:0});
    var c=cols[s%2];x.fillStyle=c;for(var p=0;p<5;p++){var a=p*1.256+r();x.beginPath();x.arc(fx+Math.cos(a)*2.1,fy+Math.sin(a)*2.1,1.7,0,6.283);x.fill();}
    x.strokeStyle=rgba(INK,0.45);x.lineWidth=0.6;x.beginPath();x.arc(fx,fy,3.6,0,6.283);x.stroke();x.fillStyle='#a5701c';x.beginPath();x.arc(fx,fy,1,0,6.283);x.fill();}}});
defObj('vegbed',{fw:3,fh:2,pad:{l:3,r:3,u:20,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4;box(x,X+3,Y+8,W-6,H-12,'#7a5638',o.seed,{w:1.3});box(x,X+3,b-4,W-6,5,'#9a7048',o.seed+1,{w:1.2});
  var r=mulberry32(o.seed);for(var c=0;c<6;c++){var vx=X+10+c*14,vy=Y+20;shape(x,blobPts(vx,vy,5,4,o.seed+c,0.2,10),c%2?'#8cc46a':'#79b35a',o.seed+10+c,{w:1});}
  for(var t=0;t<5;t++){var px=X+10+t*18,py=Y+38;line(x,[[px,py+6],[px,py-10]],1.2,'#8a6a48',o.seed+20+t,0.1);shape(x,blobPts(px,py-4,5,5,o.seed+30+t,0.2,10),'#5f9a45',o.seed+40+t,{w:1});x.fillStyle='#d9473a';x.beginPath();x.arc(px+2,py-2,1.9,0,6.283);x.arc(px-2.5,py-6,1.6,0,6.283);x.fill();}}});
defObj('bench',{fw:2,pad:{l:4,r:4,u:26,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4;shadowE(x,X+W/2,b+1,W/2-4,3.5);
  [X+8,X+W-8].forEach(function(lx,j){line(x,[[lx,b],[lx,b-10]],2,WOOD_D,o.seed+j,0);});
  box(x,X+4,b-13,W-8,4,WOOD_L,o.seed+2,{w:1.2});box(x,X+4,b-24,W-8,4,WOOD_L,o.seed+3,{w:1.2});box(x,X+4,b-19,W-8,3.5,WOOD,o.seed+4,{w:1.1});}});
defObj('birdbath',{pad:{l:4,r:4,u:26,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4,cx=X+W/2;shadowE(x,cx,b+1,9,3);
  shape(x,[[cx-4,b],[cx+4,b],[cx+2.5,b-14],[cx-2.5,b-14]],'#cfc8b8',o.seed,{w:1.2});shape(x,blobPts(cx,b-16,12,4.5,o.seed+1,0.02,16),'#cfc8b8',o.seed+2,{w:1.3});
  x.fillStyle='#a9d6e0';x.beginPath();x.ellipse(cx,b-17,9,2.8,0,0,6.283);x.fill();o._bath=[cx,b-17];},
  live:function(x,o,X,Y,W,H,t){if(!o._bath)return;x.strokeStyle=rgba('#ffffff',0.7);x.lineWidth=0.8;x.beginPath();x.ellipse(o._bath[0]+Math.sin(t*1.3)*2,o._bath[1],3,0.9,0,0,6.283);x.stroke();}});
defObj('lantern',{pad:{l:12,r:12,u:40,d:3},draw:function(x,o,X,Y,W,H){var b=Y+H-4,cx=X+W/2;shadowE(x,cx,b+1,6,2);line(x,[[cx,b],[cx,b-24]],2,METAL,o.seed,0.1);
  shape(x,[[cx-5,b-24],[cx+5,b-24],[cx+4,b-34],[cx-4,b-34]],'#f6d58a',o.seed+1,{w:1.2,wash:0.3});shape(x,[[cx-7,b-34],[cx+7,b-34],[cx,b-39]],METAL,o.seed+2,{w:1});o._lamp=[cx,b-29];},
  live:function(x,o,X,Y,W,H,t){if(!o._lamp)return;var f=0.85+0.15*Math.sin(t*7+o.seed);var g=x.createRadialGradient(o._lamp[0],o._lamp[1],1,o._lamp[0],o._lamp[1],18);g.addColorStop(0,'rgba(255,220,140,'+0.4*f+')');g.addColorStop(1,'rgba(255,220,140,0)');x.fillStyle=g;x.fillRect(o._lamp[0]-18,o._lamp[1]-18,36,36);}});
function fenceDir(o){var ob=LS().objs,has=function(dx,dy){return ob.some(function(p){return p.k==='fence'&&p.tx===o.tx+dx&&p.ty===o.ty+dy;});};var h=has(-1,0)||has(1,0),v=has(0,-1)||has(0,1);o._fd2={l:has(-1,0),r:has(1,0),u:has(0,-1),d:has(0,1)};return h&&!v?'h':v&&!h?'v':h&&v?'x':'p';}
defObj('fence',{pad:{l:4,r:4,u:24,d:3},draw:function(x,o,X,Y,W,H){var d=fenceDir(o),n=o._fd2,b=Y+H-8,cx=X+W/2;
  function post(px,py){shadowE(x,px+1,py+0.5,4,1.4,0.16);shape(x,[[px-2.6,py],[px+2.6,py],[px+2.6,py-16],[px,py-18.5],[px-2.6,py-16]],'#a87d54',o.seed+(px|0),{w:1.2,wash:0.5});x.fillStyle=rgba('#ffffff',0.22);x.fillRect(px-1.8,py-15,1.2,13);}
  if(n.l||n.r||d==='p'){var x0=n.l?X:cx,x1=n.r?X+W:cx;if(x1>x0){shape(x,[[x0,b-12],[x1,b-12],[x1,b-9.5],[x0,b-9.5]],WOOD_L,o.seed+1,{w:0.9,wash:0});shape(x,[[x0,b-6],[x1,b-6],[x1,b-3.5],[x0,b-3.5]],WOOD_L,o.seed+2,{w:0.9,wash:0});}}
  // a run going up the screen: two boards seen from above, offset a little so both read
  if(n.u){var ub=b-T;shape(x,[[cx-4.2,ub-13],[cx+0.6,ub-13],[cx+0.6,b-13],[cx-4.2,b-13]],WOOD_L,o.seed+3,{w:1,wash:0.4});
    shape(x,[[cx-0.4,ub-6],[cx+4.4,ub-6],[cx+4.4,b-6],[cx-0.4,b-6]],WOOD,o.seed+4,{w:1,wash:0.4});
    x.strokeStyle=rgba('#7a5434',0.55);x.lineWidth=0.7;x.beginPath();x.moveTo(cx-1.8,ub-11);x.lineTo(cx-1.8,b-15);x.moveTo(cx+2,ub-4);x.lineTo(cx+2,b-8);x.stroke();
    x.fillStyle=rgba('#3a2c20',0.7);[[cx-1.8,ub-10],[cx-1.8,b-16],[cx+2,ub-3],[cx+2,b-9]].forEach(function(q){x.fillRect(q[0]-0.6,q[1]-0.6,1.2,1.2);});}
  post(cx,b);}});
defObj('rock',{pad:{l:22,r:22,u:34,d:22},draw:function(x,o,X,Y,W,H){var b=Y+H-6,cx=X+W/2;shadowE(x,cx+2,b+1,11,3.5,0.14);var r=mulberry32(o.seed),n=1+(o.v%3);
  for(var p=0;p<n;p++){var rx=cx-6+p*7+(r()-0.5)*3,rw=n===1?11:7,rh=n===1?8:6;shape(x,blobPts(rx,b-rh+1,rw,rh,o.seed+p,0.12,12),mixC('#bdb8ad','#a39e93',r()),o.seed+10+p,{w:1.3});}
  if(o.v===1){x.fillStyle=rgba('#7fa45a',0.85);x.beginPath();x.ellipse(cx-2,b-11,5,2,0.2,0,6.283);x.fill();}}});
defObj('reeds',{pad:{l:24,r:24,u:56,d:22},draw:function(x,o,X,Y,W,H){var b=Y+H-6,cx=X+W/2,r=mulberry32(o.seed);
  x.fillStyle=rgba('#2c2418',0.13);x.beginPath();x.ellipse(cx,b+1,11,3,0,0,6.283);x.fill();
  for(var k=0;k<9;k++){var bx=cx-8+r()*16,hgt=18+r()*20,lean=(r()-0.5)*10;x.strokeStyle=k%3?'#5f8a3c':'#4b7432';x.lineWidth=1.8;x.lineCap='round';x.beginPath();x.moveTo(bx,b);x.quadraticCurveTo(bx+lean*0.3,b-hgt*0.6,bx+lean,b-hgt);x.stroke();
    x.strokeStyle=rgba('#cfe3a6',0.6);x.lineWidth=0.7;x.beginPath();x.moveTo(bx+0.6,b-2);x.quadraticCurveTo(bx+lean*0.3+0.6,b-hgt*0.6,bx+lean+0.4,b-hgt+2);x.stroke();}
  for(var c=0;c<(o.v===1?2:3);c++){var hx=cx-5+c*5+(r()-0.5)*3,top=b-30-r()*10;line(x,[[hx,b],[hx+1,top]],1.1,'#6a7a3a',o.seed+c,0.2);shape(x,blobPts(hx+1,top+4,1.9,4.6,o.seed+20+c,0.03,10),'#7a5232',o.seed+30+c,{w:1,wash:0.3});line(x,[[hx+1,top-0.5],[hx+1,top-4]],0.9,'#6a7a3a',o.seed+40+c,0);}}});
defObj('bridge',{fw:2,fh:3,pad:{l:5,r:5,u:14,d:6},draw:function(x,o,X,Y,W,H){x.fillStyle=rgba('#1e4a5c',0.25);x.fillRect(X+2,Y+4,W-2,H);
  for(var p=0;p<H/6;p++){var py=Y-4+p*6;box(x,X+2,py,W-4,6,p%2?'#b98a5c':'#a87d50',o.seed+p,{w:0.9,wash:0.4});}
  [X+3,X+W-3].forEach(function(rx,j){line(x,[[rx,Y-14],[rx,Y+H-6]],2,WOOD_D,o.seed+40+j,0.3);line(x,[[rx,Y-4],[rx,Y-14]],2.4,WOOD_D,o.seed+50+j,0);line(x,[[rx,Y+H-6],[rx,Y+H-16]],2.4,WOOD_D,o.seed+60+j,0);});}});
// the shrimp trap: a mesh tube in the water, a float, a cord to the bank
defObj('trap',{pad:{l:10,r:10,u:14,d:6},draw:function(){},live:function(x,o,X,Y,W,H,t){var cx=X+W/2,cy=Y+H/2+2,ready=S.day-(o.set||0)>=0.25;
  x.fillStyle=rgba('#1e4a5c',0.25);x.beginPath();x.ellipse(cx,cy+2,10,5,0,0,6.283);x.fill();
  x.save();x.beginPath();x.ellipse(cx,cy,8,4.5,0,0,6.283);x.fillStyle=rgba('#2a3a3a',0.35);x.fill();x.clip();x.strokeStyle=rgba('#1c2626',0.7);x.lineWidth=0.7;x.beginPath();for(var m=-10;m<12;m+=2.6){x.moveTo(cx+m,cy-6);x.lineTo(cx+m+6,cy+6);x.moveTo(cx+m+6,cy-6);x.lineTo(cx+m,cy+6);}x.stroke();x.restore();
  x.strokeStyle=INK;x.lineWidth=1.2;x.beginPath();x.ellipse(cx,cy,8,4.5,0,0,6.283);x.stroke();
  var fx=cx+11,fy=cy-6+Math.sin(t*2.2+o.seed)*1.2;x.strokeStyle=rgba('#e8e0cc',0.9);x.lineWidth=0.8;x.beginPath();x.moveTo(cx+6,cy-2);x.quadraticCurveTo(cx+9,fy+3,fx,fy);x.stroke();
  x.fillStyle='#d9473a';x.beginPath();x.arc(fx,fy,3,Math.PI,0);x.fill();x.fillStyle='#f7f4ec';x.beginPath();x.arc(fx,fy,3,0,Math.PI);x.fill();x.strokeStyle=INK;x.lineWidth=1;x.beginPath();x.arc(fx,fy,3,0,6.283);x.stroke();
  if(o.bank){x.strokeStyle=rgba('#e8e0cc',0.85);x.lineWidth=0.9;x.beginPath();x.moveTo(cx-7,cy);x.quadraticCurveTo((cx+o.bank[0])/2,(cy+o.bank[1])/2+5,o.bank[0],o.bank[1]);x.stroke();}
  if(ready){var p=(t*1.4)%1;x.strokeStyle=rgba('#ffffff',0.8*(1-p));x.lineWidth=1.2;x.beginPath();x.ellipse(fx,fy+1,4+p*9,2+p*4,0,0,6.283);x.stroke();}}});
// eggs, for the coop and the book
var EGG_COL={white:'#f7f3ea',brown:'#c98a52',cream:'#ecdcb6',speckled:'#e9dcc4',blue:'#a9cfd3'};
function drawEgg(x,kind,cx,cy,r){x.save();x.beginPath();x.ellipse(cx,cy,r*0.82,r,0,0,6.283);x.fillStyle=EGG_COL[kind]||EGG_COL.white;x.fill();
  if(kind==='speckled'){x.fillStyle=rgba('#7a5a3c',0.75);for(var k=0;k<6;k++)x.fillRect(cx-r*0.6+hash2(k,1,r*10|0)*r*1.2,cy-r*0.7+hash2(k,2,r*10|0)*r*1.4,r*0.18+0.3,r*0.18+0.3);}
  x.fillStyle=rgba('#ffffff',0.5);x.beginPath();x.ellipse(cx-r*0.28,cy-r*0.35,r*0.22,r*0.32,-0.4,0,6.283);x.fill();
  x.strokeStyle=INK;x.lineWidth=Math.max(0.8,r*0.13);x.beginPath();x.ellipse(cx,cy,r*0.82,r,0,0,6.283);x.stroke();x.restore();}
// paint into a context without the cache (flat things into the ground, sprites into their cache)
function oX(o){return o.tx*T+(o.ox||0);}function oY(o){return o.ty*T+(o.oy||0);}
function paintObjInto(x,o){var d=OBJ[o.k];if(!d||!d.draw)return;d.draw(x,o,oX(o),oY(o),o.fw*T,o.fh*T,0);}
// static parts are drawn once into a small canvas per object
var SPRC={};
function objSprite(o){var d=OBJ[o.k],key=o.id+'|'+o.k+'|'+(o.v||'')+'|'+(o.gm?1:0)+'|'+o.fw+'x'+o.fh+'|'+(o.k==='tank'?(S.tanks[o.i]?1:0):'')+(o.k==='fence'?fenceDir(o)+JSON.stringify(o._fd2):'');
  var c=SPRC[o.id];if(c&&c._key===key)return c;var p=d.pad,W=o.fw*T,H=o.fh*T,dp=Math.min(2,window.devicePixelRatio||1);
  c=c||document.createElement('canvas');c.width=Math.ceil((W+p.l+p.r)*dp);c.height=Math.ceil((H+p.u+p.d)*dp);var x=c.getContext('2d');x.setTransform(dp,0,0,dp,0,0);x.clearRect(0,0,W+p.l+p.r,H+p.u+p.d);
  x.translate(p.l-o.tx*T,p.u-o.ty*T);d.draw(x,o,oX(o),oY(o),W,H,0);
  // paper grain on the paint only
  x.setTransform(dp,0,0,dp,0,0);x.globalCompositeOperation='source-atop';x.globalAlpha=0.5;x.fillStyle=grainPattern(x);x.fillRect(0,0,W+p.l+p.r,H+p.u+p.d);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  c._key=key;c._w=W+p.l+p.r;c._h=H+p.u+p.d;c._ox=p.l;c._oy=p.u;SPRC[o.id]=c;return c;}
// ----- walls: the back wall stands up, the side and front walls are low (a cutaway) -----
var BW=40;          // back wall height in px
function paintBackWall(x,r){var X0=r.x*T,X1=(r.x+r.w)*T,Yb=r.y*T,Yt=Yb-BW;
  box(x,X0-6,Yt,X1-X0+12,BW,r.paper||'#efe4d0',r.x*13+r.y,{wash:0.5,w:1.4});
  x.fillStyle='#cdb895';x.fillRect(X0,Yb-5,X1-X0,5);line(x,[[X0,Yb-5],[X1,Yb-5]],1,rgba(INK,0.6),r.x+3,0.2);
  box(x,X0-6,Yt-4,X1-X0+12,5,'#d8ccb0',r.x*7+r.y,{wash:0,w:1.3});
  (r.windows||[]).forEach(function(w,j){var wx=w.x*T+4,ww=w.w*T-8,wy=Yt+7,wh=BW-15;
    // curtains
    shape(x,[[wx-7,wy-3],[wx+2,wy-3],[wx+1,wy+wh+3],[wx-8,wy+wh+3]],'#c9a7a0',j*5+r.x,{w:1.1});shape(x,[[wx+ww-2,wy-3],[wx+ww+7,wy-3],[wx+ww+8,wy+wh+3],[wx+ww-1,wy+wh+3]],'#c9a7a0',j*5+r.x+1,{w:1.1});
    var g=x.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,'#cfe6ef');g.addColorStop(1,'#eaf3ee');x.fillStyle=g;x.fillRect(wx,wy,ww,wh);
    // a bit of tree outside
    x.save();x.beginPath();x.rect(wx,wy,ww,wh);x.clip();x.fillStyle=rgba('#7fae5c',0.55);x.beginPath();x.ellipse(wx+ww*0.25,wy+wh+2,ww*0.3,wh*0.45,0,0,6.283);x.fill();x.fillStyle=rgba('#a7cb7f',0.5);x.beginPath();x.ellipse(wx+ww*0.8,wy+wh+4,ww*0.25,wh*0.4,0,0,6.283);x.fill();x.restore();
    box(x,wx,wy,ww,wh,'rgba(0,0,0,0)',j*9+r.y,{wash:0,w:1.6});line(x,[[wx+ww/2,wy],[wx+ww/2,wy+wh]],1.2,INK,j+40,0.1);line(x,[[wx,wy+wh/2],[wx+ww,wy+wh/2]],1,INK,j+41,0.1);
    box(x,wx-3,wy+wh,ww+6,3,'#f2ece0',j+50,{wash:0,w:1.1});});
  // a photo on the wall: Grandma's first tank
  if(r.w>=9){var px=(r.x+r.w)*T-30,py=Yt+10;box(x,px,py,16,13,'#f6f1e6',r.x+77,{wash:0,w:1.2});x.fillStyle='#9fcfda';x.fillRect(px+3,py+3,10,7);x.fillStyle='#c83c2c';x.fillRect(px+6,py+7,2.5,1.2);x.fillRect(px+9,py+6,2.2,1.1);}}
function paintSideWalls(x,r){var X0=r.x*T,X1=(r.x+r.w)*T,Y0=r.y*T-BW-4,Y1=(r.y+r.h)*T;
  box(x,X0-6,Y0,6,Y1-Y0+3,'#d8ccb0',r.x*3+1,{wash:0,w:1.3});box(x,X1,Y0,6,Y1-Y0+3,'#d8ccb0',r.x*3+2,{wash:0,w:1.3});}
function paintFrontWall(x,r){var X0=r.x*T-6,X1=(r.x+r.w)*T+6,Y=(r.y+r.h)*T,d=r.door,dx0=d?d.x*T:0,dx1=d?(d.x+d.w)*T:0;
  function seg(a,b,s){if(b-a<1)return;box(x,a,Y+2,b-a,9,'#e3d7be',s,{wash:0.4,w:1.3});box(x,a,Y-3,b-a,6,'#d8ccb0',s+1,{wash:0,w:1.3});}
  if(d){seg(X0,dx0,r.x*5+1);seg(dx1,X1,r.x*5+3);
    x.fillStyle=rgba('#8a6646',0.9);x.fillRect(dx0,Y-1,dx1-dx0,3);
    if(d.kind==='slide'){shape(x,[[dx1-4,Y-24],[dx1+2,Y-24],[dx1+2,Y+10],[dx1-4,Y+10]],'rgba(207,230,239,0.6)',r.x+90,{w:1.2,wash:0});}
    else{shape(x,[[dx0,Y-2],[dx0+4,Y-2],[dx0-8,Y+12],[dx0-12,Y+12]],'#a87d54',r.x+91,{w:1.2});}}
  else seg(X0,X1,r.x*5+1);}
function paintBalcony(x,m,front){var b=m.balcony;if(!b)return;var X0=b.x*T,X1=(b.x+b.w)*T,Y0=b.y*T,Y1=(b.y+b.h)*T;
  if(!front){[X0-3,X1].forEach(function(rx,j){box(x,rx,Y0-2,3,Y1-Y0+2,METAL,j+3,{wash:0,w:1});});return;}
  line(x,[[X0-3,Y1-16],[X1+3,Y1-16]],2.6,METAL,7,0.2);line(x,[[X0-3,Y1+1],[X1+3,Y1+1]],2,METAL,8,0.2);
  x.strokeStyle=METAL;x.lineWidth=1.3;x.beginPath();for(var bx=X0;bx<=X1;bx+=6){x.moveTo(bx,Y1-15);x.lineTo(bx,Y1);}x.stroke();
  [X0-3,X1+3].forEach(function(px,j){line(x,[[px,Y1+2],[px,Y1-18]],3,METAL,11+j,0);});}

// ----- birds -----
// Each has real colour patches; draw(ctx, cx, cy(feet), face, pose, ph, sc). Pose: 0 perched, 1 pecking, 2 flying
var BIRDS=[
 {id:'sparrow',name:'House sparrow',len:13,body:'#a07850',back:'#7a5634',belly:'#d9ccb2',head:'#8a8a86',cheek:'#e8e0cf',throat:'#2b2622',beak:'#3a3530',where:['feeder','ground'],hint:'Comes to any feeder',w:10,stage:0},
 {id:'bulbul',name:'White-eared bulbul',len:16,body:'#b8ad97',back:'#9c917b',belly:'#e6e0d2',head:'#2a2622',cheek:'#f2efe6',vent:'#f2c230',beak:'#2a2622',where:['feeder','tree','window'],hint:'Comes to any feeder',w:8,stage:0},
 {id:'dove',name:'Laughing dove',len:17,body:'#c69a86',back:'#a9806c',belly:'#e3c7b6',head:'#c9a596',wing:'#8fa0ad',neck:'#7a4a3a',beak:'#4a3a35',where:['ground'],hint:'Pecks seed under the feeder',w:6,stage:0},
 {id:'myna',name:'Common myna',len:17,body:'#5f4433',back:'#4c3628',belly:'#7a5a46',head:'#2a2420',eye:'#f2c230',beak:'#f2c230',wingspot:'#f1ece0',where:['ground','lawn'],hint:'Walks about on the lawn',w:5,stage:1},
 {id:'sunbird',name:'Purple sunbird',len:11,body:'#3c2f63',back:'#2f2550',belly:'#4a3a78',head:'#3c2f63',beak:'#1e1a2e',curve:1,where:['flowers'],hint:'Visits flowers',w:4,stage:1,need:'flowers'},
 {id:'hoopoe',name:'Hoopoe',len:19,body:'#e3a56e',back:'#d29660',belly:'#ecbf93',head:'#e3a56e',crest:1,bars:1,beak:'#2a2420',curve:1,where:['lawn'],hint:'Likes a short lawn',w:3,stage:2,need:'short'},
 {id:'beeeater',name:'Green bee-eater',len:18,body:'#4fae4a',back:'#3f9a3c',belly:'#7cc35a',head:'#c7b23a',throat:'#3fa7d6',mask:1,beak:'#1e1e1e',pins:1,where:['fence','meadow'],hint:'Likes long grass and a fence to sit on',w:3,stage:2,need:'long'},
 {id:'wagtail',name:'White wagtail',len:16,body:'#9a9a96',back:'#8a8a86',belly:'#f4f2ec',head:'#f4f2ec',cap:'#262422',throat:'#262422',beak:'#262422',wag:1,where:['water','path'],hint:'Near water and paths',w:3,stage:2,need:'water'},
 {id:'parakeet',name:'Rose-ringed parakeet',len:20,body:'#5cbf4a',back:'#4aa83c',belly:'#7cd06a',head:'#5cbf4a',beak:'#d23b2b',ring:1,longtail:1,where:['tree'],hint:'Lives in the trees',w:3,stage:3,need:'trees'},
 {id:'roller',name:'Indian roller',len:19,body:'#a57f7a',back:'#3aa0c8',belly:'#9fb6c8',head:'#4aa9c9',wing:'#24438f',beak:'#2a2420',where:['fence','tree'],hint:'Rare, sits on fences out on the land',w:1,stage:3},
 {id:'kingfisher',name:'Common kingfisher',len:14,body:'#e67d2e',back:'#2a8fd1',belly:'#e98a3c',head:'#2a8fd1',throat:'#f4efe4',beak:'#1e1e1e',dagger:1,where:['water'],hint:'Rare, by the stream',w:1,stage:3,need:'stream'},
 {id:'heron',name:'Grey heron',len:30,body:'#9aa2a6',back:'#8a9297',belly:'#e7e7e2',head:'#f0efe9',cap:'#262422',beak:'#e0b23a',tall:1,where:['water'],hint:'Rare, stands in shallow water',w:1,stage:2,need:'water'}];
var BIRD={};BIRDS.forEach(function(b){BIRD[b.id]=b;});
function drawBird(x,sp,cx,cy,face,pose,ph,sc){var B=BIRD[sp]||sp,L=(B.len||14)*(sc||1),s=L/16;x.save();x.translate(cx,cy);x.scale(face<0?-s:s,s);
  var bob=pose===1?Math.max(0,Math.sin(ph*9))*2.2:0,tilt=pose===1?0.35*Math.max(0,Math.sin(ph*9)):0,fl=pose===2;
  if(!fl){x.fillStyle=rgba('#2c2418',0.16);x.beginPath();x.ellipse(0,0.5,7,1.8,0,0,6.283);x.fill();}
  var bodyY=B.tall?-17:-6.5,hx=B.tall?7:6,hy=B.tall?-27:-10;
  if(!fl&&!B.tall){x.strokeStyle='#4a3a30';x.lineWidth=1;x.beginPath();x.moveTo(-1,bodyY+4);x.lineTo(-1.5,0);x.moveTo(1.5,bodyY+4);x.lineTo(1.5,0);x.stroke();}
  if(B.tall){x.strokeStyle='#8a7a5a';x.lineWidth=1.3;x.beginPath();x.moveTo(-1,bodyY+5);x.lineTo(-1.5,0);x.moveTo(2,bodyY+5);x.lineTo(2.5,0);x.stroke();}
  // tail
  var tl=B.longtail?13:B.pins?10:B.wag?9:6,tw=B.wag?Math.sin(ph*14)*2:0;shape(x,[[-6,bodyY-1],[-6-tl,bodyY+1+tw],[-6-tl+1,bodyY+3+tw],[-5,bodyY+2.5]],B.back,7,{w:0.9,wash:0,amp:0.2});
  if(B.pins){line(x,[[-6-tl,bodyY+2],[-6-tl-5,bodyY+3]],0.9,B.back,9,0);}
  // body
  x.save();x.translate(0,-bob*0.3);
  shape(x,blobPts(0,bodyY,7.5,B.tall?6:4.6,3,0.04,14),B.body,5,{w:1.1,wash:0.5,amp:0.2});
  x.fillStyle=B.belly;x.beginPath();x.ellipse(1.5,bodyY+1.8,5,2.4,0,0,6.283);x.fill();
  if(B.vent){x.fillStyle=B.vent;x.beginPath();x.ellipse(-4.5,bodyY+2.5,2.2,1.4,0,0,6.283);x.fill();}
  // wing
  var wc=B.wing||B.back;if(fl){var up=Math.sin(ph*22)>0;shape(x,up?[[-3,bodyY-1],[2,bodyY-1],[-2,bodyY-11],[-6,bodyY-9]]:[[-3,bodyY],[2,bodyY],[-1,bodyY+8],[-5,bodyY+6]],wc,11,{w:0.9,wash:0,amp:0.2});}
  else{shape(x,[[-4.5,bodyY-2.5],[3,bodyY-2.8],[1,bodyY+1.5],[-6,bodyY+1]],wc,11,{w:0.9,wash:0,amp:0.2});
    if(B.bars){x.fillStyle='#1e1a16';for(var k=0;k<3;k++)x.fillRect(-4+k*2.4,bodyY-2.2,1.1,3.2);x.fillStyle='#f4f0e6';for(var k2=0;k2<3;k2++)x.fillRect(-2.8+k2*2.4,bodyY-2.2,1.1,3.2);}
    if(B.wingspot){x.fillStyle=B.wingspot;x.fillRect(-1,bodyY-0.5,2.2,1.4);}}
  // head
  x.save();x.translate(hx,hy+bob);x.rotate(tilt);
  if(B.tall){line(x,[[-6,10],[-2,4],[0,0]],2.4,B.body,13,0.3);}
  if(B.crest){shape(x,[[-3,-2],[-1,-8],[2,-7.5],[3,-2]],'#e3a56e',15,{w:0.8,wash:0,amp:0.1});x.fillStyle='#1e1a16';x.fillRect(-1.6,-8.2,1.2,1.4);x.fillRect(1.2,-7.8,1.2,1.4);}
  shape(x,blobPts(0,0,3.6,3.3,17,0.03,10),B.head,19,{w:1,wash:0,amp:0.15});
  if(B.cap){x.fillStyle=B.cap;x.beginPath();x.arc(0,-1,3.2,Math.PI*1.05,Math.PI*1.95);x.fill();}
  if(B.cheek){x.fillStyle=B.cheek;x.beginPath();x.ellipse(0.4,0.8,1.8,1.3,0,0,6.283);x.fill();}
  if(B.throat){x.fillStyle=B.throat;x.beginPath();x.ellipse(1.8,2.6,1.6,1.4,0,0,6.283);x.fill();}
  if(B.mask){x.fillStyle='#1e1e1e';x.fillRect(-1,-0.6,4.8,1.1);}
  if(B.ring){x.strokeStyle='#1e1e1e';x.lineWidth=0.8;x.beginPath();x.arc(-0.5,1,3.3,0.3,1.9);x.stroke();}
  x.fillStyle=B.eye||'#1a1612';x.beginPath();x.arc(1.4,-0.6,0.85,0,6.283);x.fill();if(B.eye){x.fillStyle='#1a1612';x.beginPath();x.arc(1.4,-0.6,0.45,0,6.283);x.fill();}
  // beak
  var bl=B.dagger?6:B.curve?5.5:B.tall?7:3;x.fillStyle=B.beak;x.beginPath();x.moveTo(3,-0.8);if(B.curve)x.quadraticCurveTo(3+bl*0.7,-0.5,3+bl,1.5);else x.lineTo(3+bl,0.2);x.lineTo(3,0.8);x.closePath();x.fill();x.strokeStyle=INK;x.lineWidth=0.6;x.stroke();
  x.restore();x.restore();x.restore();}

// ----- chickens -----
var HENS=[
 {id:'white',name:'White hen',body:'#f7f3ea',wing:'#e9e2d4',tail:'#efe9dc',egg:'white',hint:'Lays white eggs',price:40},
 {id:'brown',name:'Brown hen',body:'#b9773f',wing:'#9c5f2e',tail:'#7a4a24',egg:'brown',hint:'Lays brown eggs',price:40},
 {id:'speckled',name:'Speckled hen',body:'#d8d2c6',wing:'#bdb5a6',tail:'#3a3530',egg:'speckled',spots:1,hint:'Lays speckled eggs',price:60},
 {id:'blue',name:'Blue egg hen',body:'#a88866',wing:'#8a6a4c',tail:'#5f4632',egg:'blue',muffs:1,hint:'Lays blue eggs',price:90},
 {id:'wild',name:'Wild junglefowl',body:'#9a6a3e',wing:'#c4562a',tail:'#2f3b2a',egg:'cream',wild:1,hint:'Out on the land. Catch one with grain',price:0}];
var HEN={};HENS.forEach(function(h){HEN[h.id]=h;});
function drawHen(x,kind,cx,cy,face,pose,ph,sc){var H=HEN[kind]||HEN.white,s=(sc||1)*(H.wild?0.92:1);x.save();x.translate(cx,cy);x.scale(face<0?-s:s,s);
  var walk=pose===0,peck=pose===1,flap=pose===3,lift=flap?Math.abs(Math.sin(ph*16))*4:0,step=walk?Math.sin(ph*12):0;
  x.fillStyle=rgba('#2c2418',0.17);x.beginPath();x.ellipse(0,0.5,8,2.2,0,0,6.283);x.fill();x.translate(0,-lift);
  x.strokeStyle='#d9a43a';x.lineWidth=1.2;x.beginPath();x.moveTo(-1.5,-5);x.lineTo(-1.5-step*1.5,0);x.moveTo(1.5,-5);x.lineTo(1.5+step*1.5,0);x.stroke();
  // tail
  shape(x,H.wild?[[-6,-11],[-14,-19],[-15,-14],[-11,-6]]:[[-6,-9],[-11,-15],[-12,-10],[-7,-5]],H.tail,21,{w:1,wash:0,amp:0.2});
  if(H.wild){line(x,[[-10,-15],[-17,-21]],1.4,'#1e2a1c',23,0.3);line(x,[[-10,-13],[-18,-15]],1.4,'#2f4a2a',24,0.3);}
  // body
  shape(x,blobPts(0,-9,8,6.2,31,0.05,16),H.body,33,{w:1.2,wash:0.6,amp:0.25});
  if(H.spots){x.fillStyle=rgba('#2a2622',0.7);for(var k=0;k<9;k++)x.fillRect(-6+hash2(k,1,7)*11,-13+hash2(k,2,7)*7,1.2,1.2);}
  var fl=flap?Math.sin(ph*16):0;shape(x,fl>0?[[-4,-11],[3,-11],[-1,-20],[-6,-17]]:[[-5,-10.5],[3.5,-11],[1,-6],[-5.5,-6.5]],H.wing,35,{w:1,wash:0,amp:0.2});
  // head and neck
  var hy=peck?-6+Math.max(0,Math.sin(ph*10))*4:-16,hx=peck?8:5.5;
  if(H.wild){shape(x,[[2,-12],[hx+2,hy-1],[hx+1,hy+4],[3,-7]],'#c4562a',37,{w:0.9,wash:0,amp:0.2});}
  shape(x,blobPts(hx,hy,3.4,3.3,39,0.04,10),H.wild?'#c4562a':H.body,41,{w:1.1,wash:0,amp:0.15});
  if(H.muffs){x.fillStyle=H.wing;x.beginPath();x.ellipse(hx-0.5,hy+2.2,2.4,1.5,0,0,6.283);x.fill();}
  x.fillStyle='#d23b2b';x.beginPath();x.moveTo(hx-2,hy-2.6);x.lineTo(hx-1,hy-5.2);x.lineTo(hx,hy-3.2);x.lineTo(hx+1,hy-5.6);x.lineTo(hx+2,hy-3);x.lineTo(hx+2.4,hy-2.2);x.closePath();x.fill();
  x.beginPath();x.ellipse(hx+2.2,hy+3,1,1.6,0,0,6.283);x.fill();
  x.fillStyle='#e8b03a';x.beginPath();x.moveTo(hx+3,hy-0.6);x.lineTo(hx+5.8,hy+0.4);x.lineTo(hx+3,hy+1.2);x.closePath();x.fill();
  x.fillStyle='#1a1612';x.beginPath();x.arc(hx+1.2,hy-0.6,0.8,0,6.283);x.fill();
  x.restore();}

// ----- fish and stream finds (for the catch sheets and the book) -----
var FISH=[
 {id:'minnow',name:'Minnow',body:'#c9cfc6',back:'#8f9a88',stripe:'#3a3f38',len:[4,8],where:'both',hint:'Common in ponds and streams',w:10},
 {id:'goby',name:'Stream goby',body:'#b39a74',back:'#7a6448',mottle:1,bighead:1,len:[3,6],where:'stream',hint:'Sits on stones in the stream',w:7},
 {id:'loach',name:'Loach',body:'#c6b48c',back:'#8a7a58',spots:1,long:1,barbels:1,len:[6,11],where:'stream',hint:'Hides in the gravel',w:5},
 {id:'chub',name:'Pale chub',body:'#dcdcd6',back:'#9ab0b6',bars:'#8fb0d6',fins:'#e07a5a',len:[8,15],where:'stream',hint:'Shiny, quick, in the stream',w:4},
 {id:'barb',name:'Barb',body:'#d9b45a',back:'#a98a3a',dots:1,len:[5,9],where:'both',hint:'Gold with black spots',w:4},
 {id:'eel',name:'Eel',body:'#7a7448',back:'#4f4a2c',eel:1,len:[30,60],where:'stream',hint:'Rare, at the bottom of the stream',w:0.6}];
var FISHI={};FISH.forEach(function(f){FISHI[f.id]=f;});
function drawFish(x,id,cx,cy,len,face){var F=FISHI[id]||FISH[0];x.save();x.translate(cx,cy);var s=len/40,u=1.5/s;x.scale((face||1)*s,s);
  if(F.eel){x.beginPath();x.moveTo(-20,0);for(var i=0;i<=20;i++){var px=-20+i*2.1;x.lineTo(px,Math.sin(i*0.6)*2.4-2);}for(var j=20;j>=0;j--){var qx=-20+j*2.1;x.lineTo(qx,Math.sin(j*0.6)*2.4+2.2);}x.closePath();x.fillStyle=F.body;x.fill();x.strokeStyle=INK;x.lineWidth=1.6*u;x.stroke();
    x.fillStyle='#1a1612';x.beginPath();x.arc(20,-0.8,1,0,6.283);x.fill();x.restore();return;}
  var bl=F.long?17:14,bh=F.long?4.2:F.bighead?6:6.5;
  shape(x,[[-bl+1,0],[-bl-7,-6],[-bl-5,0],[-bl-7,6]],F.fins||F.back,3,{w:1.1*u,wash:0,amp:0.2});
  shape(x,[[-3,-bh+1],[3,-bh-4],[7,-bh+1]],F.fins||F.back,5,{w:1*u,wash:0,amp:0.2});
  shape(x,blobPts(0,0,bl,bh,7,0.03,18),F.body,9,{w:1.3*u,wash:0.7,amp:0.3});
  x.save();x.beginPath();x.ellipse(0,0,bl,bh,0,0,6.283);x.clip();x.fillStyle=F.back;x.fillRect(-bl,-bh,bl*2,bh*0.75);
  if(F.stripe){x.fillStyle=F.stripe;x.fillRect(-bl,-0.6,bl*1.8,1.4);}
  if(F.bars){x.fillStyle=rgba(F.bars,0.7);for(var b=0;b<6;b++)x.fillRect(-10+b*3.6,-bh,1.6,bh*2);}
  if(F.mottle||F.spots){x.fillStyle=rgba('#4a3a28',0.6);for(var k=0;k<14;k++)x.beginPath(),x.arc(-bl+hash2(k,1,id.length)*bl*1.8,-bh+hash2(k,2,id.length)*bh*1.6,F.spots?0.8:1.4,0,6.283),x.fill();}
  if(F.dots){x.fillStyle='#1e1a16';[[-6,-1],[3,-1.5],[-11,1]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],1.5,0,6.283);x.fill();});}
  x.fillStyle=rgba('#ffffff',0.3);x.fillRect(-bl,bh*0.2,bl*2,bh*0.4);x.restore();
  x.strokeStyle=INK;x.lineWidth=1.4*u;x.beginPath();x.ellipse(0,0,bl,bh,0,0,6.283);x.stroke();
  x.fillStyle='#f4f0e6';x.beginPath();x.arc(bl-4,-1.2,1.7,0,6.283);x.fill();x.fillStyle='#1a1612';x.beginPath();x.arc(bl-3.8,-1.2,0.9,0,6.283);x.fill();
  if(F.barbels){line(x,[[bl-1,1.5],[bl+3,4]],0.8*u,INK,11,0.1);line(x,[[bl-1,1],[bl+3.5,1.5]],0.8*u,INK,12,0.1);}
  line(x,[[bl-7,-bh*0.7],[bl-7.5,bh*0.6]],0.9*u,rgba(INK,0.6),13,0.1);
  x.restore();}
var FINDS=[
 {id:'crab',name:'Freshwater crab',hint:'Sometimes climbs into the trap',draw:function(x,w,h){var cx=w/2,cy=h/2+2,s=Math.min(w,h)/30;x.save();x.translate(cx,cy);x.scale(s,s);
   for(var l=0;l<3;l++){line(x,[[-6,1+l*2],[-12,4+l*3]],1.2,INK,l,0.1);line(x,[[6,1+l*2],[12,4+l*3]],1.2,INK,l+5,0.1);}
   shape(x,blobPts(-9,-5,3.5,2.6,3,0.1,8),'#c4683a',5,{w:1});shape(x,blobPts(9,-5,3.5,2.6,4,0.1,8),'#c4683a',6,{w:1});
   shape(x,blobPts(0,0,9,6,7,0.05,14),'#b8663a',8,{w:1.3});x.fillStyle='#1a1612';x.fillRect(-3,-6.5,1.4,1.4);x.fillRect(2,-6.5,1.4,1.4);x.restore();}},
 {id:'snail',name:'Pond snail',hint:'Rides in on the trap',draw:function(x,w,h){var cx=w/2,cy=h/2+3,s=Math.min(w,h)/28;x.save();x.translate(cx,cy);x.scale(s,s);
   shape(x,[[-10,4],[10,4],[12,2],[-8,1]],'#c9b79a',2,{w:1});shape(x,blobPts(0,-3,7.5,6.5,3,0.02,14),'#9a6a3e',4,{w:1.3});
   x.strokeStyle=INK;x.lineWidth=1;x.beginPath();for(var a=0;a<12;a+=0.2){var r=6-a*0.45;if(r<0.5)break;x.lineTo(Math.cos(a)*r,-3+Math.sin(a)*r*0.85);}x.stroke();line(x,[[10,1],[13,-3]],0.8,INK,5,0.1);x.restore();}},
 {id:'nymph',name:'Dragonfly nymph',hint:'Lives under stones',draw:function(x,w,h){var cx=w/2,cy=h/2,s=Math.min(w,h)/28;x.save();x.translate(cx,cy);x.scale(s,s);
   for(var l=0;l<3;l++){line(x,[[-2+l*3,1],[-5+l*4,7]],1,INK,l,0.1);line(x,[[-2+l*3,-1],[-5+l*4,-7]],1,INK,l+4,0.1);}
   shape(x,blobPts(-4,0,9,3.5,2,0.05,14),'#7a7a4a',3,{w:1.2});shape(x,blobPts(7,0,3.5,3,3,0.05,10),'#6a6a3e',4,{w:1.1});x.fillStyle='#1a1612';x.fillRect(8,-2,1.3,1.3);x.fillRect(8,1,1.3,1.3);x.restore();}},
 {id:'leaf',name:'Old leaf',hint:'Leaves drift into the trap',draw:function(x,w,h){var cx=w/2,cy=h/2;x.save();x.translate(cx,cy);x.rotate(-0.4);shape(x,[[-14,0],[-4,-7],[10,-5],[15,0],[10,5],[-4,7]],'#b07a3a',4,{w:1.2});line(x,[[-14,0],[15,0]],0.9,rgba(INK,0.7),5,0.2);x.restore();}},
 {id:'bottle',name:'Old glass bottle',hint:'Rare. Someone lost it a long time ago',draw:function(x,w,h){var cx=w/2,cy=h/2;x.save();x.translate(cx,cy);x.rotate(-0.5);shape(x,[[-12,-5],[6,-5],[9,-2.5],[15,-2.5],[15,2.5],[9,2.5],[6,5],[-12,5]],'rgba(126,178,150,0.75)',6,{w:1.2,wash:0});x.fillStyle=rgba('#ffffff',0.45);x.fillRect(-10,-3.5,14,1.5);x.restore();}}];
var FINDI={};FINDS.forEach(function(f){FINDI[f.id]=f;});
// ----- runtime -----
var L={cv:null,x:null,VW:0,VH:0,dpr:1,cam:{x:0,y:0},vel:{x:0,y:0},tool:'look',clock:0,rt:0,birds:[],henA:{},wildA:{},fishA:[],parts:[],grain:[],fishing:null,watch:null,buildSel:null,ptr:null,
  spots:[],hab:{},spotT:0,spawnT:0,lastSpawn:0,gcv:null,gd:1,groundOK:false,gbk:null,shown:false,mower:null,labels:[],confirmMove:0,tipShown:{}};
function M(){return LS().map;}
function inView(wx,wy,pad){pad=pad||0;return wx>L.cam.x-pad&&wx<L.cam.x+L.VW+pad&&wy>L.cam.y-pad&&wy<L.cam.y+L.VH+pad;}
function tileAt(wx,wy){return [Math.floor(wx/T),Math.floor(wy/T)];}
function objAtTile(tx,ty,flatToo){var ob=LS().objs;for(var i=ob.length-1;i>=0;i--){var o=ob[i],d=OBJ[o.k];if(!d||(!flatToo&&d.flat))continue;if(tx>=o.tx&&tx<o.tx+o.fw&&ty>=o.ty&&ty<o.ty+o.fh)return o;}return null;}
function objsOf(k){return LS().objs.filter(function(o){return o.k===k;});}
function stageHas(k){return LS().objs.some(function(o){return o.k===k;});}
function countG(pred){var m=M(),n=0;for(var i=0;i<m.g.length;i++)if(pred(m.g[i],m.gh[i]))n++;return n;}
function isStream(tx,ty){var m=M();return m.stream&&mget(m,tx,ty)===G_WATER&&ty>=22;}

// ----- state setup -----
function ensureLand(){var l=S.land;if(!l||typeof l!=='object')l=S.land={};
  if(!l.basket)l.basket={};if(!l.eggs)l.eggs=[];if(!l.hens)l.hens=[];if(!l.wild)l.wild=[];if(!l.pond)l.pond=[];if(!l.stats)l.stats={mowed:0,eggs:0,fish:0,birds:0,traps:0};if(!l.seen)l.seen={};
  if(l.stage!==S.stage||!l.map)buildStage(S.stage);}
function buildStage(n){var l=S.land;l.oid=l.oid||0;var g=genStage(n);l.stage=n;l.map=g.map;l.objs=g.objs;
  if(n>=2&&!l.hens.length){l.hens.push({id:'h'+(++l.oid),kind:'white'});l.hens.push({id:'h'+(++l.oid),kind:'brown'});var bk=S.book.coop||(S.book.coop={});['white','brown'].forEach(function(k){if(!bk['hen-'+k])bk['hen-'+k]={day:Math.floor(S.day),where:'came with the house'};});}
  if(n<2){l.wild=[];}if(n===3&&!l.wild.length){for(var i=0;i<3;i++)l.wild.push({id:'w'+(++l.oid)});}
  L.groundOK=false;SPRC={};WALLC={};L.birds=[];L.henA={};L.wildA={};L.fishA=[];L.grain=[];L.parts=[];L.fishing=null;L.watch=null;closeBub();
  L.camSet=false;}
window.landSetStage=function(n){n=clamp(n|0,0,STAGES.length-1);ensureLand();S.stage=n;buildStage(n);save();updateHeader();if(activeTab==='home'&&L.shown){mountHome();}modCall('stageChanged',n);};

// ----- birds -----
function computeSpots(){var m=M(),sp=[],hab={};
  var shortN=0,longN=0;for(var ty=0;ty<m.h;ty++)for(var tx=0;tx<m.w;tx++){var i=mi(m,tx,ty),g=m.g[i];if(!isGrass(g))continue;var h=m.gh[i];
    if(h<0.3){shortN++;if(hash2(tx,ty,S.lastDay)<0.18)sp.push({t:'lawn',x:tx*T+8+hash2(tx,ty,9)*16,y:ty*T+10+hash2(tx,ty,8)*16});}
    if(h>0.7){longN++;}}
  hab.short=shortN>=6;hab.long=longN>=10;
  LS().objs.forEach(function(o){var X=o.tx*T,Y=o.ty*T,W=o.fw*T,H=o.fh*T;
    if((o.k==='feeder'||o.k==='wfeeder')&&o._perch&&(o.s||0)>0.04){o._perch.forEach(function(p,j){sp.push({t:'feeder',x:p[0],y:p[1],o:o,win:o.k==='wfeeder',j:j});});
      if(o.k==='feeder'&&o.v!=='hang')for(var g2=0;g2<3;g2++)sp.push({t:'ground',x:X+W/2-14+g2*14,y:Y+H-2+(g2%2)*4,o:o});}
    if(o.k==='fence'&&hash2(o.tx,o.ty,4)<0.35)sp.push({t:'fence',x:X+W/2,y:Y+H-8-17});
    if(o.k==='tree'){var cx=X+W/2,b=Y+H-(o.small?4:7),top=b-(o.small?22:34),R=o.small?13:24;sp.push({t:'tree',x:cx-R*0.5,y:top-R*0.25});sp.push({t:'tree',x:cx+R*0.55,y:top-R*0.1});hab.treeN=(hab.treeN||0)+1;}
    if(o.k==='flowers'||o.k==='pot'||(o.k==='bush'&&o.v)){sp.push({t:'flowers',x:X+W/2,y:Y+H-14,hover:1});hab.flowers=true;}
    if(o.k==='birdbath'&&o._bath){sp.push({t:'water',x:o._bath[0]-8,y:o._bath[1]-1});sp.push({t:'water',x:o._bath[0]+8,y:o._bath[1]-1});hab.water=true;}
    if(o.k==='rock'&&m.stream&&o.ty>=22)sp.push({t:'water',x:X+W/2,y:Y+H-14,rock:1});});
  hab.trees=(hab.treeN||0)>=3;hab.fence=stageHas('fence');
  for(var y2=0;y2<m.h;y2++)for(var x2=0;x2<m.w;x2++){var g3=mget(m,x2,y2);if(g3===G_WATER){hab.water=true;if(m.depth&&m.depth[mi(m,x2,y2)]===0&&hash2(x2,y2,5)<0.3)sp.push({t:'water',x:x2*T+T/2,y:y2*T+T/2+4,wade:1});}
    if((g3===G_STEP||g3===G_STONE)&&hash2(x2,y2,6)<0.2)sp.push({t:'path',x:x2*T+T/2,y:y2*T+T/2+6});}
  hab.stream=!!m.stream;hab.seed=LS().objs.some(function(o){return (o.k==='feeder'||o.k==='wfeeder')&&(o.s||0)>0.04;});
  L.spots=sp;L.hab=hab;}
var BIRD_CAP=[2,3,5,7];
function spotOK(B,s){if(s.t==='feeder'){if(B.where.indexOf('feeder')<0)return false;return !s.win||B.id==='sparrow'||B.id==='bulbul';}
  if(B.where.indexOf(s.t)<0)return false;if(B.id==='heron')return !!s.wade;if(B.id==='kingfisher')return !!(s.rock||s.wade);return true;}
function spawnBird(){var hab=L.hab,cap=BIRD_CAP[S.stage]||3;if(L.birds.length>=cap)return;
  var cand=[];BIRDS.forEach(function(B){if(S.stage<B.stage)return;if(B.need&&!hab[B.need])return;
    var free=L.spots.filter(function(s){return spotOK(B,s)&&!L.birds.some(function(b){return b.spot===s;});});
    if(!free.length)return;var w=B.w*(free.some(function(s){return s.t==='feeder'||s.t==='ground';})?2.5:1);cand.push({B:B,free:free,w:w});});
  if(!cand.length)return;var tot=cand.reduce(function(a,c){return a+c.w;},0),r=Math.random()*tot,c=cand[0];for(var i=0;i<cand.length;i++){r-=cand[i].w;if(r<=0){c=cand[i];break;}}
  var vis=c.free.filter(function(s){return inView(s.x,s.y,-10);}),spot=pick(vis.length&&Math.random()<0.8?vis:c.free);
  var from=spot.win?{x:spot.x+(Math.random()<0.5?-40:40),y:spot.y-30}:{x:L.cam.x+(Math.random()<0.5?-30:L.VW+30),y:L.cam.y+Math.random()*L.VH*0.5-20};
  L.birds.push({sp:c.B.id,x:from.x,y:from.y,fx:from.x,fy:from.y,spot:spot,st:'in',t:0,dur:1.1+Math.random()*0.9,stay:10+Math.random()*18,face:spot.x>from.x?1:-1,ph:Math.random()*9,peckT:0,win:!!spot.win});
  if(Math.random()<0.6)sfx('chirp',{v:0.7});}
function birdOut(b,fast){if(b.st==='out'||b.st==='flee')return;b.st=fast?'flee':'out';b.t=0;b.fx=b.x;b.fy=b.y;b.dur=fast?0.7:1.4;
  var tx=b.win?b.x+(Math.random()<0.5?-50:50):L.cam.x+(Math.random()<0.5?-60:L.VW+60),ty=b.win?b.y-40:L.cam.y-40-Math.random()*40;b.tx=tx;b.ty=ty;b.face=tx>b.x?1:-1;if(fast)sfx('flap',{v:0.6});}
function stepBirds(dt){L.spawnT+=dt;if(L.spawnT>1.3){L.spawnT=0;var p=L.hab.seed?0.5:0.22;if(Math.random()<p)spawnBird();}
  L.birds.forEach(function(b){b.t+=dt;b.ph+=dt;
    if(b.st==='in'){var k=clamp(b.t/b.dur,0,1),e=1-Math.pow(1-k,2);b.x=lerp(b.fx,b.spot.x,e);b.y=lerp(b.fy,b.spot.y,e)-Math.sin(k*Math.PI)*24;if(k>=1){b.st='stay';b.t=0;}}
    else if(b.st==='stay'){if(b.spot.hover){b.x=b.spot.x+Math.sin(b.ph*3)*3;b.y=b.spot.y+Math.sin(b.ph*5)*2;}
      b.peckT-=dt;if(b.peckT<=0){b.peck=!b.peck&&(b.spot.t==='feeder'||b.spot.t==='ground'||b.spot.t==='lawn'||b.spot.t==='path');b.peckT=b.peck?0.6+Math.random()*1.2:0.8+Math.random()*2;
        if(b.peck&&b.spot.t==='feeder'&&b.spot.o)b.spot.o.s=Math.max(0,(b.spot.o.s||0)-0.006);if(!b.peck&&Math.random()<0.3)b.face=-b.face;
        if(!b.peck&&(b.spot.t==='lawn'||b.spot.t==='ground')&&Math.random()<0.4){b.spot={t:b.spot.t,x:b.spot.x+(Math.random()-0.5)*16,y:b.spot.y+(Math.random()-0.5)*6,o:b.spot.o};b.x=b.spot.x;b.y=b.spot.y;}}
      if(b.t>b.stay&&!(L.watch&&L.watch.b===b))birdOut(b);
      if(b.spot.t==='feeder'&&b.spot.o&&(b.spot.o.s||0)<=0.02&&!(L.watch&&L.watch.b===b))birdOut(b);}
    else{var k2=clamp(b.t/b.dur,0,1);b.x=lerp(b.fx,b.tx,k2);b.y=lerp(b.fy,b.ty,k2*k2);if(k2>=1)b.gone=true;}});
  L.birds=L.birds.filter(function(b){return !b.gone;});}
function drawBirdA(x,b){var pose=b.st==='stay'?(b.peck?1:0):2;if(b.spot&&b.spot.hover&&b.st==='stay')pose=2;drawBird(x,b.sp,b.x,b.y,b.face,pose,b.ph,BIRD[b.sp].tall?1:0.95);}

// ----- hens and wild chickens -----
function henArea(){return M().henArea;}
function randIn(a){for(var k=0;k<20;k++){var x=a.x0+8+Math.random()*(a.x1-a.x0-16),y=a.y0+8+Math.random()*(a.y1-a.y0-16),t=tileAt(x,y),g=mget(M(),t[0],t[1]);if(isWalk(g)&&!objAtTile(t[0],t[1]))return [x,y];}return [(a.x0+a.x1)/2,(a.y0+a.y1)/2];}
function syncAgents(){var a=henArea(),coop=objsOf('coop')[0];LS().hens.forEach(function(h){if(!L.henA[h.id]&&a){var p=coop?[coop.tx*T+coop.fw*T/2+(Math.random()-0.5)*40,(coop.ty+coop.fh)*T+10+Math.random()*16]:randIn(a);L.henA[h.id]={id:h.id,kind:h.kind,x:p[0],y:p[1],st:'idle',t:0,dur:1,face:1,ph:Math.random()*9,tx:p[0],ty:p[1],cl:8+Math.random()*30};}});
  Object.keys(L.henA).forEach(function(id){if(!LS().hens.some(function(h){return h.id===id;}))delete L.henA[id];});
  var w=M().wildArea;LS().wild.forEach(function(h){if(!L.wildA[h.id]&&w){var p=randIn({x0:w.x0,y0:w.y0+T*8,x1:w.x1,y1:w.y1});L.wildA[h.id]={id:h.id,kind:'wild',x:p[0],y:p[1],st:'idle',t:0,dur:1,face:1,ph:Math.random()*9,tx:p[0],ty:p[1],wild:1};}});
  Object.keys(L.wildA).forEach(function(id){if(!LS().wild.some(function(h){return h.id===id;}))delete L.wildA[id];});
  // fish kept in the pond
  var pond=[];var m=M();for(var y=0;y<m.h;y++)for(var x=0;x<m.w;x++)if(mget(m,x,y)===G_WATER&&!(m.stream&&y>=22))pond.push([x,y]);L.pondTiles=pond;
  while(L.fishA.length<LS().pond.length&&pond.length){var pt=pick(pond);L.fishA.push({kind:LS().pond[L.fishA.length].kind,x:pt[0]*T+T/2,y:pt[1]*T+T/2,a:Math.random()*6.28,ph:Math.random()*9});}}
function nearestGrain(c,r){var best=null,bd=r*r;L.grain.forEach(function(g){var d=(g.x-c.x)*(g.x-c.x)+(g.y-c.y)*(g.y-c.y);if(d<bd){bd=d;best=g;}});return best;}
function fingerNear(c,r){var p=L.ptr;if(!p||!p.down)return false;var w=toWorld(p.cx,p.cy);return Math.hypot(w[0]-c.x,w[1]-c.y)<r;}
function stepChick(c,dt,area){c.t+=dt;c.ph+=dt;var g=nearestGrain(c,c.wild?220:160);
  if(c.st==='run'){var dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy);if(d<2||c.t>c.dur){c.st='idle';c.t=0;c.dur=1+Math.random()*2;}else{c.x+=dx/d*46*dt;c.y+=dy/d*46*dt;c.face=dx>0?1:-1;}return;}
  if(c.st==='flap'){if(c.t>0.6){c.st='idle';c.t=0;c.dur=0.6;}return;}
  if(c.wild&&fingerNear(c,c.st==='eat'?42:75)&&!(c.st==='eat'&&Math.random()>dt*1.2)){var p=toWorld(L.ptr.cx,L.ptr.cy),ax=c.x-p[0],ay=c.y-p[1],ad=Math.hypot(ax,ay)||1;c.st='run';c.t=0;c.dur=1.5;c.tx=clamp(c.x+ax/ad*70,area.x0+6,area.x1-6);c.ty=clamp(c.y+ay/ad*50,area.y0+6,area.y1-6);if(!c.ranOnce){c.ranOnce=1;sfx('flap',{v:0.5});}return;}
  if(g&&!(c.wild&&L.ptr&&L.ptr.down&&fingerNear(c,90))){var dx2=g.x-c.x,dy2=g.y-c.y,d2=Math.hypot(dx2,dy2);if(d2<5){c.st='eat';c.eatT=(c.eatT||0)+dt;c.face=dx2>=0?1:-1;if(c.eatT>1.1){c.eatT=0;g.gone=true;L.grain=L.grain.filter(function(q){return !q.gone;});}return;}
    c.st='walk';var sp=c.wild?11:15;c.x+=dx2/d2*sp*dt;c.y+=dy2/d2*sp*dt;c.face=dx2>0?1:-1;return;}
  if(c.st==='eat')c.st='idle';
  if(c.st==='walk'){var dx3=c.tx-c.x,dy3=c.ty-c.y,d3=Math.hypot(dx3,dy3);if(d3<2){c.st=Math.random()<0.6?'peck':'idle';c.t=0;c.dur=1+Math.random()*2.5;}else{c.x+=dx3/d3*13*dt;c.y+=dy3/d3*13*dt;c.face=dx3>0?1:-1;}}
  else if(c.t>c.dur){var p2=randIn(area);if(Math.hypot(p2[0]-c.x,p2[1]-c.y)>110){p2=[c.x+(p2[0]-c.x)*0.4,c.y+(p2[1]-c.y)*0.4];}c.tx=p2[0];c.ty=p2[1];c.st='walk';c.t=0;}
  if(!c.wild){c.cl-=dt;if(c.cl<=0){c.cl=20+Math.random()*40;if(inView(c.x,c.y))sfx('cluck',{v:0.5});}}}
function chickPose(c){return c.st==='walk'||c.st==='run'?0:c.st==='peck'||c.st==='eat'?1:c.st==='flap'?3:2;}

// ----- particles -----
function puff(kind,x,y,n,o){o=o||{};for(var i=0;i<n;i++){var a=Math.random()*6.283,s=(o.speed||30)*(0.4+Math.random());L.parts.push({k:kind,x:x,y:y,vx:Math.cos(a)*s+(o.vx||0),vy:Math.sin(a)*s*0.6-(o.up||0),life:0,max:(o.life||0.7)*(0.6+Math.random()*0.6),col:o.col,rot:Math.random()*6.28,r:o.r||1});}}
function stepParts(dt){L.parts.forEach(function(p){p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;var dr=p.k==='clip'?3.5:p.k==='feather'?1.2:2;p.vx*=Math.max(0,1-dr*dt);p.vy=p.vy*Math.max(0,1-dr*dt)+(p.k==='drop'?160:p.k==='feather'?8:p.k==='seed'?120:0)*dt;p.rot+=dt*(p.k==='feather'?2:4);});
  L.parts=L.parts.filter(function(p){return p.life<p.max;});}
function drawParts(x){L.parts.forEach(function(p){var a=1-p.life/p.max;x.save();x.globalAlpha=clamp(a*1.4,0,1);
  if(p.k==='clip'){x.translate(p.x,p.y);x.rotate(p.rot);x.strokeStyle=p.col||'#5f9a45';x.lineWidth=1.1;x.beginPath();x.moveTo(-2,0);x.lineTo(2,0);x.stroke();}
  else if(p.k==='feather'){x.translate(p.x,p.y);x.rotate(p.rot);x.fillStyle=p.col||'#f7f3ea';x.beginPath();x.ellipse(0,0,2.6,1,0,0,6.283);x.fill();x.strokeStyle=rgba(INK,0.5);x.lineWidth=0.5;x.stroke();}
  else if(p.k==='ring'){x.strokeStyle=rgba('#ffffff',0.85*a);x.lineWidth=1.2;x.beginPath();x.ellipse(p.x,p.y,3+(1-a)*14*p.r,1.5+(1-a)*6*p.r,0,0,6.283);x.stroke();}
  else if(p.k==='drop'){x.fillStyle=rgba('#cfeaf2',0.9);x.beginPath();x.arc(p.x,p.y,1.2,0,6.283);x.fill();}
  else if(p.k==='seed'){x.fillStyle='#a5784a';x.fillRect(p.x,p.y,1.6,1.4);}
  else if(p.k==='spark'){x.fillStyle=p.col||'#f2c94c';x.beginPath();x.arc(p.x,p.y,1.4,0,6.283);x.fill();}
  x.restore();});}
// ----- camera and pointer -----
function toWorld(cx,cy){return [cx+L.cam.x,cy+L.cam.y];}
function clampCam(){var m=M(),W=m.w*T,H=m.h*T;if(W<=L.VW)L.cam.x=(W-L.VW)/2;else L.cam.x=clamp(L.cam.x,0,W-L.VW);if(H<=L.VH)L.cam.y=(H-L.VH)/2;else L.cam.y=clamp(L.cam.y,0,H-L.VH);}
function camFocus(wx,wy){L.cam.x=wx-L.VW/2;L.cam.y=wy-L.VH/2;clampCam();}
function localXY(e){var r=L.cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
function hitChick(wx,wy,list,r){var best=null,bd=r;Object.keys(list).forEach(function(k){var c=list[k],d=Math.hypot(c.x-wx,c.y-6-wy);if(d<bd){bd=d;best=c;}});return best;}
function hitBird(wx,wy){var best=null,bd=20;L.birds.forEach(function(b){if(b.st!=='stay'&&b.st!=='in')return;var d=Math.hypot(b.x-wx,b.y-7-wy);if(d<bd){bd=d;best=b;}});return best;}
function onDown(e){if(!L.cv)return;e.preventDefault();try{L.cv.setPointerCapture(e.pointerId);}catch(_){}var p=localXY(e);closeBub();
  L.ptr={id:e.pointerId,down:true,sx:p[0],sy:p[1],cx:p[0],cy:p[1],lx:p[0],ly:p[1],t0:performance.now(),mode:null,vx:0,vy:0};L.vel.x=L.vel.y=0;
  var w=toWorld(p[0],p[1]);
  if(L.tool==='mow'){L.ptr.mode='mow';L.ptr.lw=w;if(!L.mower)L.mower=sfxLoop('mower');L.mower.set(0.25);mowSeg(w,w);}
  else if(L.tool==='look'){var b=hitBird(w[0],w[1]);if(b){L.watch={b:b,t:0};L.ptr.mode='watch';}}}
function onMove(e){var P=L.ptr;if(!P||!P.down||e.pointerId!==P.id)return;e.preventDefault();var p=localXY(e),dx=p[0]-P.lx,dy=p[1]-P.ly,now=performance.now();P.cx=p[0];P.cy=p[1];
  var dist=Math.hypot(p[0]-P.sx,p[1]-P.sy);
  if(P.mode==='mow'){var w=toWorld(p[0],p[1]);mowSeg(P.lw,w);P.lw=w;P.lx=p[0];P.ly=p[1];return;}
  if(P.mode==='watch'&&dist>10){if(L.watch&&L.watch.b)birdOut(L.watch.b,true);L.watch=null;P.mode='pan';}
  if(!P.mode&&dist>8)P.mode='pan';
  if(P.mode==='pan'){L.cam.x-=dx;L.cam.y-=dy;clampCam();if(!LS().seen.pan){LS().seen.pan=1;updateStat(true);}var dt=Math.max(1,now-(P.lt||now-16));P.vx=dx/dt*1000;P.vy=dy/dt*1000;P.lt=now;
    if(L.tool==='look'&&Math.hypot(dx,dy)>6){var wf=toWorld(p[0],p[1]);L.birds.forEach(function(b){if(b.st==='stay'&&Math.hypot(b.x-wf[0],b.y-wf[1])<42)birdOut(b,true);});}}
  P.lx=p[0];P.ly=p[1];}
function onUp(e){var P=L.ptr;if(!P||e.pointerId!==P.id)return;P.down=false;var held=performance.now()-P.t0;
  if(P.mode==='mow'){if(L.mower){L.mower.stop();L.mower=null;}save();}
  else if(P.mode==='watch'){if(L.watch){if(held<320&&L.watch.b)birdOut(L.watch.b,true);L.watch=null;}}
  else if(P.mode==='pan'){L.vel.x=P.vx;L.vel.y=P.vy;}
  else if(P.mode===null&&e.type!=='pointercancel'){var w=toWorld(P.cx,P.cy);onTap(w[0],w[1],P.cx,P.cy);}
  P.mode=null;}

// ----- mowing -----
function mowSeg(a,b){var m=M(),dx=b[0]-a[0],dy=b[1]-a[1],L0=Math.hypot(dx,dy),n=Math.max(1,Math.ceil(L0/4)),cut=0;
  var dir=0;if(L0>1.5){dir=Math.abs(dx)>=Math.abs(dy)?(dx>0?1:2):(dy>0?3:4);var ta=Math.atan2(dy,dx)+Math.PI/2,ca=L.mowDir||0,da=((ta-ca+Math.PI*3)%(Math.PI*2))-Math.PI;L.mowDir=ca+da*0.35;}
  for(var s=0;s<=n;s++){var px=a[0]+dx*s/n,py=a[1]+dy*s/n,R=12;
    for(var ty=Math.floor((py-R)/T);ty<=Math.floor((py+R)/T);ty++)for(var tx=Math.floor((px-R)/T);tx<=Math.floor((px+R)/T);tx++){var g=mget(m,tx,ty);if(!isGrass(g)&&g!==G_STEP)continue;
      var cx=clamp(px,tx*T,tx*T+T),cy=clamp(py,ty*T,ty*T+T);if(Math.hypot(cx-px,cy-py)>R)continue;if(objAtTile(tx,ty))continue;var i=mi(m,tx,ty),h=m.gh[i];
      if(h>0.04){cut+=h;puff('clip',px,py,Math.ceil(h*5),{speed:45,col:g===G_MEADOW?'#7f9c45':'#5f9a45',life:0.7});if(g===G_MEADOW&&h>0.5&&Math.random()<0.3)puff('spark',px,py,1,{col:pick(FLOWER_COLS),speed:20});LS().stats.mowed++;}
      m.gh[i]=0;if(dir)m.gb[i]=dir;touchTile(tx,ty);}}
  if(L.mower)L.mower.set(clamp(0.3+cut*0.6+(L0>2?0.2:0),0,1));
  // keep mowing past the edge: the map slides along
  var P=L.ptr;if(P){var ex=P.cx<34?-1:P.cx>L.VW-34?1:0,ey=P.cy<34?-1:P.cy>L.VH-34?1:0;if(ex||ey){L.autoPan=[ex,ey];}else L.autoPan=null;}}

// ----- taps -----
function onTap(wx,wy,cx,cy){var t=tileAt(wx,wy);
  if(L.tool==='look')tapLook(wx,wy,t,cx,cy);
  else if(L.tool==='grain')tapGrain(wx,wy,t,cx,cy);
  else if(L.tool==='rod')tapRod(wx,wy,t);
  else if(L.tool==='build')tapBuild(wx,wy,t,cx,cy);}
function interactAt(wx,wy){var ob=LS().objs.slice().sort(function(a,b){return (b.ty+b.fh)-(a.ty+a.fh);});
  for(var i=0;i<ob.length;i++){var o=ob[i],X=o.tx*T,Y=o.ty*T,W=o.fw*T,H=o.fh*T,r=null;
    if(o.k==='tank')r=[X,Y-30,W,H+30];else if(o.k==='feeder')r=[X+W/2-15,Y+H-58,30,58];else if(o.k==='wfeeder')r=[X+W/2-24,Y-34,48,30];
    else if(o.k==='coop')r=[X,Y-26,W,H+26];else if(o.k==='armchair'&&o.gm)r=[X,Y-14,W,H+14];else if(o.k==='trap')r=[X-6,Y-8,W+12,H+12];
    if(r&&wx>=r[0]&&wx<=r[0]+r[2]&&wy>=r[1]&&wy<=r[1]+r[3])return o;}return null;}
function tapLook(wx,wy,t,cx,cy){
  var coop=objsOf('coop')[0];if(coop&&coop._eggPos){for(var j=0;j<coop._eggPos.length;j++){var ep=coop._eggPos[j];if(Math.hypot(ep[0]-wx,ep[1]-wy)<9){collectEgg(ep[2],ep[0],ep[1]);return;}}}
  var wc=hitChick(wx,wy,L.wildA,15);if(wc){tryCatch(wc);return;}
  var hc=hitChick(wx,wy,L.henA,14);if(hc){hc.st='flap';hc.t=0;sfx('cluck');puff('feather',hc.x,hc.y-8,3,{col:HEN[hc.kind].body,speed:20,life:1.1});return;}
  var b=hitBird(wx,wy);if(b){birdOut(b,true);return;}
  var o=interactAt(wx,wy);
  if(o){if(o.k==='tank'){if(S.tanks[o.i]){sfx('click');goTank(o.i);}else{toast('Set up a new tank in the Tank tab.');setTab('tank');}return;}
    if(o.k==='feeder'||o.k==='wfeeder'){fillFeeder(o,cx,cy);return;}
    if(o.k==='coop'){coopBub(o,cx,cy);return;}
    if(o.k==='armchair'&&o.gm){grandmaSays(cx,cy);return;}
    if(o.k==='trap'){trapTap(o,cx,cy);return;}}
  var g=mget(M(),t[0],t[1]);
  if(g===G_WATER){if(isStream(t[0],t[1]))trapMenu(t,cx,cy);else{toast('Fish here with the rod.');}return;}}
function tapGrain(wx,wy,t,cx,cy){var wc=hitChick(wx,wy,L.wildA,15);if(wc){tryCatch(wc);return;}var hc=hitChick(wx,wy,L.henA,14);if(hc){hc.st='flap';hc.t=0;sfx('cluck');return;}
  var g=mget(M(),t[0],t[1]);if(!isWalk(g)){toast('Scatter it on the ground.');return;}
  if(L.grain.length>70)L.grain.splice(0,10);for(var i=0;i<9;i++)L.grain.push({x:wx+(Math.random()-0.5)*16,y:wy+(Math.random()-0.5)*9});sfx('scoop',{v:0.6});puff('seed',wx,wy-6,6,{speed:25,up:20,life:0.4});
  if(!LS().seen.grain){LS().seen.grain=1;toast(S.stage>=3?'Wild chickens come if you keep still. Tap one while it eats.':'The hens like that.');}}
function collectEgg(j,x,y){var l=LS(),k=l.eggs[j];if(!k)return;l.eggs.splice(j,1);l.basket[k]=(l.basket[k]||0)+1;l.stats.eggs++;sfx('egg');puff('spark',x,y,5,{col:'#f2c94c',speed:30,life:0.5});bookAdd('coop','egg-'+k,{where:STAGES[S.stage].name});updateStat(true);save();}
function tryCatch(c){if(c.st==='eat'){var l=LS();l.wild=l.wild.filter(function(w){return w.id!==c.id;});delete L.wildA[c.id];var id='h'+(++l.oid);l.hens.push({id:id,kind:'wild'});
    puff('feather',c.x,c.y-8,8,{col:'#c4562a',speed:35,life:1.3});sfx('flap');sfx('cluck');syncAgents();var na=L.henA[id];if(na){na.st='flap';na.t=0;}
    bookAdd('coop','hen-wild',{where:'the land'});toast('You caught a wild junglefowl. She lives in the coop now.');save();}
  else{c.st='run';c.t=0;c.dur=1.4;c.tx=c.x+(Math.random()-0.5)*120;c.ty=c.y+(Math.random()-0.5)*80;var a=M().wildArea;if(a){c.tx=clamp(c.tx,a.x0+6,a.x1-6);c.ty=clamp(c.ty,a.y0+6,a.y1-6);}sfx('flap',{v:0.6});}}
function fillFeeder(o,cx,cy){if((o.s||0)>=0.95){showBub(cx,cy,'<b>It’s full.</b>');return;}if(!spend(5,'seed'))return;o.s=1;sfx('pour');
  var fx=o.k==='wfeeder'?o.tx*T+o.fw*T/2:(o._fd?o._fd.x:o.tx*T+T/2),fy=o.k==='wfeeder'?o.ty*T-20:(o._fd?o._fd.y:o.ty*T);puff('seed',fx,fy-6,14,{speed:18,up:10,life:0.5});
  if(!LS().seen.feeder){LS().seen.feeder=1;toast('Birds come while there’s seed. Hold one to watch it.');}computeSpots();save();}
var GM_LINES=['The red ones are getting redder.','Did you eat?','Don’t change all the water at once.','That sparrow comes every morning. I call him Lao Wang.','When I was your age I kept fish in a washing bowl.','Sit with me a bit.','Your grandpa says hello.','Shrimp don’t like loud music. I checked.'];
function grandmaSays(cx,cy){var lines=GM_LINES.slice();if(S.stage>=3)lines.push('Your grandpa wants to see the stream.');if(S.stage>=2)lines.push('The hens are louder than your grandpa.');
  var i=(L.gmI=(L.gmI==null?Math.floor(Math.random()*lines.length):L.gmI+1))%lines.length;showBub(cx,cy,'<b>Grandma</b><div>'+esc(lines[i])+'</div>');sfx('click');}
function coopBub(o,cx,cy){var l=LS(),n=l.hens.length,cnt={};l.hens.forEach(function(h){cnt[h.kind]=(cnt[h.kind]||0)+1;});
  var who=Object.keys(cnt).map(function(k){return cnt[k]+' '+HEN[k].name.toLowerCase()+(cnt[k]>1?'s':'');}).join(', ');
  var btns=n<8?HENS.filter(function(h){return h.price;}).map(function(h){return '<button class="btn" data-buyhen="'+h.id+'">'+esc(h.name)+' · '+fmtA(h.price)+'</button>';}).join(''):'';
  showBub(cx,cy,'<b>The coop</b><div>'+(n?esc(who):'Empty')+'</div>'+(btns?'<div class="btns">'+btns+'</div>':'<div class="hint">It’s full.</div>'),function(el){el.querySelectorAll('[data-buyhen]').forEach(function(bt){bt.onclick=function(){var k=bt.dataset.buyhen;if(!spend(HEN[k].price,'a hen'))return;l.hens.push({id:'h'+(++l.oid),kind:k});syncAgents();bookAdd('coop','hen-'+k,{where:'bought'});sfx('cluck');closeBub();toast('A '+HEN[k].name.toLowerCase()+' joined the coop.');save();};});});}
// ----- the stream trap -----
function trapsOn(){return objsOf('trap');}
function trapMenu(t,cx,cy){var n=trapsOn().length;showBub(cx,cy,'<b>The stream</b><div>Wild shrimp live under the stones.</div><div class="btns"><button class="btn primary" data-trap'+(n>=3?' disabled':'')+'>'+(n>=3?'Three traps is enough':'Set a shrimp trap · AED 20')+'</button></div>',function(el){var b=el.querySelector('[data-trap]');if(b)b.onclick=function(){if(!spend(20,'a trap'))return;
  var m=M(),bank=null,bd=1e9;for(var dy=-3;dy<=3;dy++)for(var dx=-3;dx<=3;dx++){var g=mget(m,t[0]+dx,t[1]+dy);if(isWalk(g)){var d=dx*dx+dy*dy;if(d<bd){bd=d;bank=[(t[0]+dx)*T+T/2,(t[1]+dy)*T+T/2];}}}
  var o=mkObj('trap',t[0],t[1],{set:S.day,bank:bank});LS().objs.push(o);LS().stats.traps++;sfx('plop');puff('ring',t[0]*T+T/2,t[1]*T+T/2+2,1,{speed:0,life:1});closeBub();
  if(!LS().seen.trap){LS().seen.trap=1;toast('Check it after a few hours.');}save();};});}
function trapTap(o,cx,cy){var age=S.day-(o.set||0);if(age>=0.25){openTrap(o);return;}var hrs=Math.max(1,Math.ceil((0.25-age)*24));
  showBub(cx,cy,'<b>Nothing yet</b><div>Check back in about '+plural(hrs,'hour')+'.</div><div class="btns"><button class="btn" data-out>Take the trap out</button></div>',function(el){el.querySelector('[data-out]').onclick=function(){LS().objs=LS().objs.filter(function(q){return q!==o;});sfx('plop');closeBub();save();};});}
function rollFinds(){var out=[],r=Math.random();if(r<0.12)out.push('crab');else if(r<0.27)out.push('snail');else if(r<0.37)out.push('nymph');else if(r<0.57)out.push('leaf');else if(r<0.6)out.push('bottle');return out;}
function openTrap(o){var n=2+Math.floor(Math.random()*6),list=[];if(typeof breedWild==='function'){for(var i=0;i<n;i++){try{list.push(breedWild());}catch(e){console.error(e);}}}
  var finds=rollFinds();sfx('drip');
  openSheet({title:'Shrimp trap',mount:function(el,api){
    el.innerHTML='<canvas class="trapcv" width="10" height="10"></canvas><p class="sub trap-sum">Pulling it up…</p><div class="trap-catch"></div><div class="btns trap-btns" hidden></div>';
    var cv=el.querySelector('.trapcv'),w=Math.min(el.clientWidth||320,520),h=130,x=fitCanvas(cv,w,h);cv.style.width=w+'px';cv.style.height=h+'px';
    var t0=performance.now(),drops=[];
    function anim(){if(!cv.isConnected)return;var t=(performance.now()-t0)/1000,k=clamp(t/1.2,0,1),e=1-Math.pow(1-k,3);x.clearRect(0,0,w,h);
      var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#eef3ee');g.addColorStop(1,'#e2ecea');x.fillStyle=g;x.fillRect(0,0,w,h);
      var wl=h*0.72;x.fillStyle='#8cc3d4';x.fillRect(0,wl,w,h-wl);inkPath(x,[[0,wl],[w,wl]],{col:rgba(INK,0.6),w:1.2,seed:3,amp:1.5});
      var cx=w/2,cy=lerp(h*0.95,h*0.38,e),tw=64,th=34;
      line(x,[[cx,cy-th/2],[cx,0]],1,'#d8cfb8',5,0.2);
      x.save();rpath(x,cx-tw/2,cy-th/2,tw,th,8);x.fillStyle=rgba('#2a3a3a',0.18);x.fill();x.clip();x.strokeStyle=rgba('#1c2626',0.55);x.lineWidth=0.8;x.beginPath();for(var q=-tw;q<tw*1.5;q+=5){x.moveTo(cx-tw/2+q,cy-th/2);x.lineTo(cx-tw/2+q-th,cy+th/2);x.moveTo(cx-tw/2+q-th,cy-th/2);x.lineTo(cx-tw/2+q,cy+th/2);}x.stroke();
      if(k>=1&&list.length){for(var j=0;j<Math.min(list.length,7);j++){var sx=cx-tw/2+10+(j*9)%(tw-18),sy=cy-th/2+9+((j*7)%3)*7;x.fillStyle=j%2?'#9a7a58':'#b59a76';x.beginPath();x.ellipse(sx,sy,4,1.8,0.2*j,0,6.283);x.fill();}}
      x.restore();x.strokeStyle=INK;x.lineWidth=1.5;rpath(x,cx-tw/2,cy-th/2,tw,th,8);x.stroke();
      if(cy<wl&&Math.random()<0.5)drops.push({x:cx-tw/2+Math.random()*tw,y:cy+th/2,v:0});
      drops.forEach(function(d){d.v+=500/60;d.y+=d.v/60;x.fillStyle=rgba('#a9d6e0',0.9);x.beginPath();x.arc(d.x,d.y,1.4,0,6.283);x.fill();if(d.y>wl&&!d.s){d.s=1;if(Math.random()<0.15)sfx('drip',{v:0.5});}});drops=drops.filter(function(d){return d.y<h;});
      if(k>=1&&!anim.shown){anim.shown=1;reveal();}requestAnimationFrame(anim);}
    anim.shown=0;requestAnimationFrame(anim);
    function reveal(){var sum=el.querySelector('.trap-sum'),box=el.querySelector('.trap-catch'),bt=el.querySelector('.trap-btns');
      var parts=[];if(list.length)parts.push(plural(list.length,'wild shrimp','wild shrimp'));finds.forEach(function(f){parts.push(FINDI[f].name.toLowerCase());});
      sum.textContent=parts.length?parts.join(', ').replace(/^./,function(c){return c.toUpperCase();})+'.':'Empty this time.';
      var html='';list.forEach(function(s,i){html+='<div class="tc" data-i="'+i+'"><span class="tcv"></span><small>'+esc(typeof colourName==='function'?colourName(s):'Wild')+'</small></div>';});
      finds.forEach(function(f){html+='<div class="tc find" data-f="'+f+'"><span class="tcv"></span><small>'+esc(FINDI[f].name)+'</small></div>';});box.innerHTML=html;
      box.querySelectorAll('.tc[data-i]').forEach(function(d){var s=list[+d.dataset.i],sp=typeof specOf==='function'?specOf(s):{male:false,col:'wild',vg:3,juv:0};d.querySelector('.tcv').appendChild(shrimpIconCanvas(sp,52,26));});
      box.querySelectorAll('.tc[data-f]').forEach(function(d){d.querySelector('.tcv').appendChild(miniCanvas(52,26,function(x2,w2,h2){FINDI[d.dataset.f].draw(x2,w2,h2);}));});
      finds.forEach(function(f){bookAdd('finds',f,{where:'the stream'});});
      var take=list.length&&typeof takeHome==='function';
      bt.innerHTML=(take?'<button class="btn primary" data-take>Take the shrimp home</button>':'')+'<button class="btn" data-go>'+(list.length?'Let them go':'Put it back')+'</button>';bt.hidden=false;
      o.set=S.day;save();
      var tb=bt.querySelector('[data-take]');if(tb)tb.onclick=function(){closeSheet();setTimeout(function(){takeHome(list,'stream');},60);};
      bt.querySelector('[data-go]').onclick=function(){closeSheet();sfx('splash');puff('drop',o.tx*T+T/2,o.ty*T+T/2,10,{speed:40,up:30,life:0.6});};}}});}

// ----- fishing -----
function rodTip(){return [L.cam.x+L.VW*0.7,L.cam.y+L.VH-44];}
function tapRod(wx,wy,t){var f=L.fishing;
  if(!f||f.st==='idle'){if(mget(M(),t[0],t[1])!==G_WATER){toast('Tap the water to cast.');return;}if(waterF(wx,wy)<0.6){wx=t[0]*T+T/2;wy=t[1]*T+T/2;}var tip=rodTip();L.fishing={st:'fly',x0:tip[0],y0:tip[1],x1:wx,y1:wy,x:tip[0],y:tip[1],t:0,water:isStream(t[0],t[1])?'stream':'pond'};sfx('cast');return;}
  if(f.st==='fly')return;
  if(f.st==='wait'){toast('Too soon, it swam off.');f.st='idle';return;}
  if(f.st==='bite'){f.st='reel';f.t=0;sfx('splash');sfx('reel');puff('drop',f.x,f.y,12,{speed:45,up:40,life:0.7});return;}}
function stepFishing(dt){var f=L.fishing;if(!f)return;f.t+=dt;
  if(f.st==='fly'){var k=clamp(f.t/0.55,0,1);f.x=lerp(f.x0,f.x1,k);f.y=lerp(f.y0,f.y1,k)-Math.sin(k*Math.PI)*60;if(k>=1){f.st='wait';f.t=0;f.bite=2+Math.random()*7;f.tw=[];for(var i=0;i<1+Math.floor(Math.random()*3);i++)f.tw.push(Math.random()*f.bite*0.85);f.tw.sort();puff('ring',f.x,f.y+2,1,{speed:0,life:1.1,r:1.2});sfx('plop');}}
  else if(f.st==='wait'){while(f.tw.length&&f.t>=f.tw[0]){f.tw.shift();f.dip=0.25;puff('ring',f.x,f.y+2,1,{speed:0,life:0.6,r:0.5});sfx('plip',{v:0.35});}
    if(f.dip>0)f.dip-=dt;if(f.t>=f.bite){f.st='bite';f.t=0;puff('ring',f.x,f.y+2,1,{speed:0,life:0.9,r:1.4});sfx('plip');}}
  else if(f.st==='bite'){if(f.t>0.8){f.st='miss';f.t=0;toast('It got away.');}}
  else if(f.st==='miss'){if(f.t>0.4)f.st='idle';}
  else if(f.st==='reel'){if(f.t>0.9){f.st='idle';landFish(f.water);}}}
function landFish(water){var pool=FISH.filter(function(F){return F.where==='both'||F.where===water;}),tot=pool.reduce(function(a,F){return a+F.w;},0),r=Math.random()*tot,F=pool[0];
  for(var i=0;i<pool.length;i++){r-=pool[i].w;if(r<=0){F=pool[i];break;}}var len=Math.round(lerp(F.len[0],F.len[1],Math.random()));LS().stats.fish++;
  var canKeep=(L.pondTiles||[]).length>0&&LS().pond.length<8;
  openSheet({title:F.name,mount:function(el){el.innerHTML='<canvas class="fishcv"></canvas><p class="sub">'+len+' cm.'+(canKeep?' Let it go, or keep it in the pond.':'')+'</p><div class="btns"><button class="btn primary" data-go>Let it go</button>'+(canKeep?'<button class="btn" data-keep>Keep it in the pond</button>':'')+'</div>';
    var cv=el.querySelector('.fishcv'),w=Math.min(el.clientWidth||320,520),h=110,x=fitCanvas(cv,w,h);cv.style.width=w+'px';cv.style.height=h+'px';
    var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#d9ecef');g.addColorStop(1,'#b9dbe4');x.fillStyle=g;x.fillRect(0,0,w,h);grain(x,0,0,w,h,0.5);
    x.strokeStyle=rgba('#ffffff',0.6);x.lineWidth=1;for(var k=0;k<6;k++){var rx=hash2(k,1,len)*w,ry=hash2(k,2,len)*h;x.beginPath();x.moveTo(rx,ry);x.quadraticCurveTo(rx+8,ry-3,rx+18,ry);x.stroke();}
    drawFish(x,F.id,w/2,h/2,Math.min(w*0.55,F.eel?220:170),1);
    bookAdd('fish',F.id,{where:water==='stream'?'the stream':'the pond',cm:len});
    el.querySelector('[data-go]').onclick=function(){closeSheet();sfx('splash');var fb=L.fishing;if(fb)puff('drop',fb.x,fb.y,10,{speed:40,up:30,life:0.6});};
    var kb=el.querySelector('[data-keep]');if(kb)kb.onclick=function(){LS().pond.push({kind:F.id,len:len});syncAgents();closeSheet();sfx('plop');toast('It’s in the pond now.');save();};}});}
function drawFishing(x){var f=L.fishing;if(L.tool!=='rod'||!f||f.st==='idle')return;var tip=rodTip(),bx=f.x,by=f.y+(f.st==='bite'?3:f.dip>0?1.5:Math.sin(L.rt*2.4)*0.8);
  x.strokeStyle=rgba('#2c2823',0.6);x.lineWidth=0.8;x.beginPath();x.moveTo(tip[0],tip[1]);x.quadraticCurveTo((tip[0]+bx)/2,Math.max(tip[1],by)+20,bx,by);x.stroke();
  if(f.st==='reel'){by-=f.t*12;}
  x.save();x.translate(bx,by);if(f.st==='bite'){x.beginPath();x.rect(-6,-8,12,6.5);x.clip();}
  x.fillStyle='#d9473a';x.beginPath();x.arc(0,-2,3.2,Math.PI,0);x.fill();x.fillStyle='#f7f4ec';x.beginPath();x.arc(0,-2,3.2,0,Math.PI);x.fill();x.strokeStyle=INK;x.lineWidth=1;x.beginPath();x.arc(0,-2,3.2,0,6.283);x.stroke();line(x,[[0,-5],[0,-8]],1,INK,3,0);x.restore();}
function drawRod(x){if(L.tool!=='rod')return;var tip=[L.VW*0.7,L.VH-44];x.save();line(x,[[L.VW*0.9,L.VH+8],[tip[0],tip[1]]],3.2,'#7a5a3c',9,0.2);line(x,[[L.VW*0.9,L.VH+8],[L.VW*0.87,L.VH-4]],4.5,'#3b3a34',10,0);
  x.fillStyle='#bdb8ad';x.beginPath();x.arc(L.VW*0.88,L.VH-2,3.4,0,6.283);x.fill();x.strokeStyle=INK;x.lineWidth=1;x.stroke();x.restore();}
// ----- building -----
var OUT=[G_GRASS,G_MEADOW,G_DIRT],OUTS=[G_GRASS,G_MEADOW,G_DIRT,G_STONE];
var BUILD=[
 {k:'flowers',name:'Flower bed',price:30,where:OUT,stage:2,ground:G_DIRT},
 {k:'bush',name:'Bush',price:25,where:OUT,stage:2,o:{v:1}},
 {k:'tree',name:'Small tree',price:120,where:[G_GRASS,G_MEADOW],stage:2,o:{small:1,fw:1,fh:1,v:2}},
 {k:'stones',name:'Stepping stones',price:10,where:[G_GRASS,G_MEADOW],stage:2,edit:G_STEP},
 {k:'fence',name:'Fence',price:15,where:OUT.concat([G_SAND]),stage:2},
 {k:'bench',name:'Bench',price:80,where:OUTS,stage:2,o:{fw:2}},
 {k:'birdbath',name:'Bird bath',price:60,where:OUTS,stage:2},
 {k:'lantern',name:'Lantern',price:40,where:OUTS.concat([G_TILE]),stage:1},
 {k:'vegbed',name:'Vegetable bed',price:50,where:OUT,stage:2,ground:G_DIRT,o:{fw:3,fh:2}},
 {k:'feeder',name:'Bird feeder',price:45,where:OUTS.concat([G_TILE]),stage:1,o:{s:0}},
 {k:'coop',name:'Coop',price:400,where:OUT,stage:2,max:1,o:{fw:3,fh:2}},
 {k:'pond',name:'Pond',price:300,where:[G_GRASS,G_MEADOW],stage:3,edit:G_WATER,fw:2,fh:2},
 {k:'pot',name:'Flower pot',price:20,where:[G_TILE,G_STONE,G_FLOOR],stage:1,o:{v:1}},
 {k:'herbs',name:'Herb pot',price:15,where:[G_TILE,G_STONE,G_FLOOR],stage:1},
 {k:'bchair',name:'Folding chair',price:35,where:[G_TILE,G_STONE,G_GRASS],stage:1},
 {k:'rug',name:'Rug',price:60,where:[G_FLOOR],stage:0,o:{fw:3,fh:2,v:0}},
 {k:'plant',name:'Plant',price:25,where:[G_FLOOR,G_TILE],stage:0},
 {k:'shelf',name:'Bookshelf',price:150,where:[G_FLOOR],stage:0},
 {k:'armchair',name:'Armchair',price:200,where:[G_FLOOR],stage:0,o:{v:'b'}},
 {k:'lamp',name:'Lamp',price:50,where:[G_FLOOR],stage:0}];
var BUILDI={};BUILD.forEach(function(b){BUILDI[b.k]=b;});
function buildList(){var m=M(),has={};m.g.forEach(function(g){has[g]=1;});return BUILD.filter(function(b){return S.stage>=b.stage&&b.where.some(function(g){return has[g];});});}
function itemSize(b){var o=b.o||{},d=OBJ[b.k]||{};return [b.fw||o.fw||d.fw||1,b.fh||o.fh||d.fh||1];}
function anchorFor(b,tx,ty){var sz=itemSize(b);return [tx-Math.floor((sz[0]-1)/2),ty-Math.floor((sz[1]-1)/2)];}
function canPlace(b,ax,ay){var sz=itemSize(b),m=M(),flat=OBJ[b.k]&&OBJ[b.k].flat;if(b.max&&objsOf(b.k).length>=b.max)return false;
  for(var y=ay;y<ay+sz[1];y++)for(var x=ax;x<ax+sz[0];x++){var g=mget(m,x,y);if(b.where.indexOf(g)<0)return false;
    var o=objAtTile(x,y,true);if(o){var of=OBJ[o.k]&&OBJ[o.k].flat;if(b.edit||flat?true:!of)return false;}
    if(b.edit&&L.edits(x,y))return false;}
  return true;}
L.edits=function(x,y){return (LS().edits||[]).some(function(e){return x>=e.tx&&x<e.tx+e.fw&&y>=e.ty&&y<e.ty+e.fh;});};
function placeAt(b,ax,ay){if(!canPlace(b,ax,ay)){sfx('nope');return false;}if(!spend(b.price,b.name.toLowerCase()))return false;var m=M(),sz=itemSize(b),l=LS();
  if(b.edit){var prev=[];for(var y=ay;y<ay+sz[1];y++)for(var x=ax;x<ax+sz[0];x++){prev.push([mget(m,x,y),m.gh[mi(m,x,y)]]);mset(m,x,y,b.edit,b.edit===G_WATER?0:m.gh[mi(m,x,y)]);}
    var ed={k:b.k,tx:ax,ty:ay,fw:sz[0],fh:sz[1],prev:prev,price:b.price};(l.edits=l.edits||[]).push(ed);if(b.edit===G_WATER){var bid='pb'+(++l.oid);ed.body=bid;(m.bodies||(m.bodies=[])).push({k:'pond',id:bid,cx:ax+sz[0]/2,cy:ay+sz[1]/2,rx:sz[0]*0.62,ry:sz[1]*0.5,seed:(l.oid%9)+1});renderGround();syncAgents();}else for(var y2=ay-1;y2<=ay+sz[1];y2++)for(var x2=ax-1;x2<=ax+sz[0];x2++)if(mget(m,x2,y2)!==G_VOID)repaintTile(x2,y2);}
  else{if(b.ground)for(var y3=ay;y3<ay+sz[1];y3++)for(var x3=ax;x3<ax+sz[0];x3++){mset(m,x3,y3,b.ground);repaintTile(x3,y3);}
    var o={};for(var k in b.o||{})o[k]=b.o[k];o.built=1;var ob=mkObj(b.k,ax,ay,o);if(b.k==='flowers')ob.v=Math.floor(Math.random()*4);l.objs.push(ob);
    if(OBJ[b.k].flat)for(var y4=ay;y4<ay+sz[1];y4++)for(var x4=ax;x4<ax+sz[0];x4++)repaintTile(x4,y4);}
  sfx('thud');puff('spark',(ax+sz[0]/2)*T,(ay+sz[1])*T-4,6,{col:'#c9b38a',speed:25,life:0.5});computeSpots();save();return true;}
function removeThing(o,e){var l=LS(),m=M();
  if(o){l.objs=l.objs.filter(function(q){return q!==o;});delete SPRC[o.id];var b=BUILDI[o.k];earn(Math.floor((b?b.price:0)/2),'refund');
    if(OBJ[o.k].flat)for(var y=o.ty;y<o.ty+o.fh;y++)for(var x=o.tx;x<o.tx+o.fw;x++)repaintTile(x,y);}
  else if(e){var j=0;for(var y2=e.ty;y2<e.ty+e.fh;y2++)for(var x2=e.tx;x2<e.tx+e.fw;x2++){var p=e.prev[j++];mset(m,x2,y2,p[0],p[1]);}l.edits=l.edits.filter(function(q){return q!==e;});earn(Math.floor(e.price/2),'refund');
    if(e.k==='pond'){if(e.body)m.bodies=(m.bodies||[]).filter(function(q){return q.id!==e.body;});renderGround();syncAgents();}else for(var y3=e.ty-1;y3<=e.ty+e.fh;y3++)for(var x3=e.tx-1;x3<=e.tx+e.fw;x3++)if(mget(m,x3,y3)!==G_VOID)repaintTile(x3,y3);}
  sfx('pop');computeSpots();save();}
function tapBuild(wx,wy,t,cx,cy){var b=L.buildSel&&BUILDI[L.buildSel];
  if(b){var a=anchorFor(b,t[0],t[1]);if(!placeAt(b,a[0],a[1])&&canPlace(b,a[0],a[1])===false)toast('It doesn’t fit there.');return;}
  var o=objAtTile(t[0],t[1],true);if(o&&!o.built){var o2=LS().objs.filter(function(q){return q.built&&t[0]>=q.tx&&t[0]<q.tx+q.fw&&t[1]>=q.ty&&t[1]<q.ty+q.fh;})[0];if(o2)o=o2;}
  var e=(LS().edits||[]).filter(function(q){return t[0]>=q.tx&&t[0]<q.tx+q.fw&&t[1]>=q.ty&&t[1]<q.ty+q.fh;})[0];
  if(o&&o.built){var bi=BUILDI[o.k];showBub(cx,cy,'<b>'+esc(bi?bi.name:o.k)+'</b><div class="btns"><button class="btn" data-rm>Take it away · '+fmtA(Math.floor((bi?bi.price:0)/2))+' back</button></div>',function(el){el.querySelector('[data-rm]').onclick=function(){closeBub();removeThing(o,null);};});return;}
  if(e){showBub(cx,cy,'<b>'+esc(BUILDI[e.k].name)+'</b><div class="btns"><button class="btn" data-rm>Take it away · '+fmtA(Math.floor(e.price/2))+' back</button></div>',function(el){el.querySelector('[data-rm]').onclick=function(){closeBub();removeThing(null,e);};});return;}
  if(o)toast('That came with the place.');else toast('Pick something first.');}
function drawBuildHints(x){var b=L.tool==='build'&&L.buildSel&&BUILDI[L.buildSel];if(!b)return;var m=M(),sz=itemSize(b),x0=Math.max(0,Math.floor(L.cam.x/T)),y0=Math.max(0,Math.floor(L.cam.y/T)),x1=Math.min(m.w-1,Math.ceil((L.cam.x+L.VW)/T)),y1=Math.min(m.h-1,Math.ceil((L.cam.y+L.VH)/T));
  x.fillStyle=rgba('#2d6a4f',0.5);for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){var a=anchorFor(b,tx,ty);if(a[0]!==tx-Math.floor((sz[0]-1)/2))continue;if(canPlace(b,a[0],a[1])){x.beginPath();x.arc(tx*T+T/2,ty*T+T/2,2.6,0,6.283);x.fill();}}}
function itemIcon(b){return miniCanvas(56,36,function(x,w,h){if(b.edit===G_STEP){x.fillStyle='#abd281';x.fillRect(0,0,w,h);inkBlob(x,w/2-8,h/2,9,7,{fill:'#d8d0bd',seed:3,w:1.1});inkBlob(x,w/2+10,h/2+2,8,6,{fill:'#cfc6b2',seed:5,w:1.1});return;}
  if(b.edit===G_WATER){x.fillStyle='#abd281';x.fillRect(0,0,w,h);inkBlob(x,w/2,h/2,20,11,{fill:'#8cc6d8',seed:4,w:1.3});return;}
  var sz=itemSize(b),d=OBJ[b.k],p=d.pad,W=sz[0]*T,H=sz[1]*T,o={k:b.k,tx:0,ty:0,fw:sz[0],fh:sz[1],seed:17,v:(b.o&&b.o.v!=null)?b.o.v:0,small:b.o&&b.o.small,s:0.6,i:-1};
  var sc=Math.min(w/(W+p.l+p.r),h/(H+p.u+p.d))*0.95;x.save();x.translate(w/2-(W/2)*sc,h-(H+p.d)*sc-1);x.scale(sc,sc);try{d.draw(x,o,0,0,W,H,0);if(d.live&&b.k!=='coop'&&b.k!=='tank')d.live(x,o,0,0,W,H,0);}catch(e){}x.restore();});}

// ----- the bubble over the map -----
function showBub(cx,cy,html,mount){closeBub();var host=$('lwrap');if(!host)return;var d=document.createElement('div');d.className='bub lbub';d.innerHTML=html;host.appendChild(d);
  // the tap that opened it can turn into a click on whatever appears under the finger: ignore clicks for a moment
  d._t0=performance.now();d.addEventListener('click',function(e){if(performance.now()-d._t0<350){e.stopPropagation();e.preventDefault();}},true);
  var w=d.offsetWidth,h=d.offsetHeight,W=host.clientWidth,H=host.clientHeight,left=clamp(cx-w/2,6,W-w-6),top=cy-h-14;if(top<6)top=Math.min(H-h-6,cy+16);d.style.left=left+'px';d.style.top=top+'px';L.bub=d;if(mount)mount(d);}
function closeBub(){if(L.bub){L.bub.remove();L.bub=null;}}

// ----- the Home tab -----
var TOOLS=[
 {id:'look',name:'Look',svg:'<path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z"/><circle cx="10" cy="10" r="2.2"/>'},
 {id:'mow',name:'Mow',svg:'<path d="M3.5 13.5h9.5l1.6-4.5H6.2z"/><circle cx="6" cy="15.6" r="1.6"/><circle cx="12" cy="15.6" r="1.6"/><path d="M14.6 9l2.6-5.5"/>'},
 {id:'grain',name:'Grain',svg:'<path d="M3.5 9.5h9l-1.2 5H4.7z"/><path d="M12.5 10.5l4-3.2"/><path d="M6 6.5l.01 0M9 5l.01 0M11 7l.01 0M7.5 3.5l.01 0"/>'},
 {id:'rod',name:'Rod',svg:'<path d="M4 17.5L15.5 3"/><path d="M15.5 3c1.3 5 1 9-1.4 11.5"/><circle cx="13.9" cy="15.6" r="1.4"/>'},
 {id:'build',name:'Build',svg:'<path d="M11.5 3.5l5 5-2.2 2.2-5-5z"/><path d="M10.6 7.4l-6.6 6.6 2.2 2.2 6.6-6.6"/>'}];
function toolsHere(){var m=M(),has={};m.g.forEach(function(g){has[g]=1;});return TOOLS.filter(function(t){if(t.id==='mow')return has[G_GRASS]||has[G_MEADOW];if(t.id==='grain')return S.stage>=2;if(t.id==='rod')return has[G_WATER];return true;});}
function mountHome(){var p=$('p-home');ensureLand();
  p.innerHTML='<div class="card hcard"><div class="hd"><h2 id="h-name"></h2><small id="h-sub"></small><button class="qh" id="h-help" aria-label="How the home works">?</button></div><div class="hmove" id="h-move"></div></div>'+
   '<div class="landwrap" id="lwrap"><canvas id="land-cv"></canvas></div><div class="ltools" id="ltools"></div><div class="palette lpal" id="lpal" hidden></div><div class="lstat" id="lstat"></div>';
  L.cv=$('land-cv');L.cv.addEventListener('pointerdown',onDown);L.cv.addEventListener('pointermove',onMove);L.cv.addEventListener('pointerup',onUp);L.cv.addEventListener('pointercancel',onUp);
  L.cv.addEventListener('contextmenu',function(e){e.preventDefault();});
  $('h-help').onclick=function(){openPop('<div class="sheet-hd"><h2>Home</h2><button class="btn sm" onclick="closePop()">Close</button></div>'+
    '<p><b>Look:</b> drag to look around, tap things to use them. Hold your finger on a bird until the ring fills to watch it.</p>'+
    '<p><b>Mow:</b> drag over the grass. Go one way, then back, for stripes. Short grass brings hoopoes, long grass brings bee-eaters.</p>'+
    '<p><b>Grain:</b> tap the ground. Out on the land, wild chickens come if you keep still. Tap one while it eats to catch it.</p>'+
    '<p><b>Rod:</b> tap the water, wait, then tap again when the float goes under.</p>'+
    '<p><b>Shrimp trap:</b> with Look, tap the stream. Check it after a few hours.</p>'+
    '<p><b>Build:</b> pick something, then tap where it goes. Tap a thing you built to take it away.</p>');};
  var tl=$('ltools');tl.innerHTML=toolsHere().map(function(t){return '<button class="btn" data-tool="'+t.id+'" aria-pressed="false"><svg viewBox="0 0 20 20" aria-hidden="true">'+t.svg+'</svg>'+t.name+'</button>';}).join('');
  if(!toolsHere().some(function(t){return t.id===L.tool;}))L.tool='look';
  tl.querySelectorAll('[data-tool]').forEach(function(b){b.onclick=function(){setTool(b.dataset.tool);sfx('click');};});
  renderCard();updateStat(true);setTool(L.tool,true);sizeCanvas();syncAgents();computeSpots();
  if(!L.camSet){L.camSet=true;var r=M().rooms[0];if(r)camFocus((r.x+r.w/2)*T,(r.y+r.h/2)*T+(S.stage===1?70:S.stage>=2?-20:0));else camFocus(M().w*T/2,M().h*T/2);}}
function setTool(id,quiet){L.tool=id;LS().tool=id;closeBub();if(id!=='rod'&&L.fishing)L.fishing=null;
  document.querySelectorAll('#ltools [data-tool]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.tool===id));});
  var pal=$('lpal');if(id==='build'){var list=buildList();pal.innerHTML=list.map(function(b){return '<button data-item="'+b.k+'" aria-pressed="'+(L.buildSel===b.k)+'"><span class="pi"></span><b>'+esc(b.name)+'</b><small>'+fmtA(b.price)+'</small></button>';}).join('');
    pal.querySelectorAll('[data-item]').forEach(function(bt){bt.querySelector('.pi').appendChild(itemIcon(BUILDI[bt.dataset.item]));bt.onclick=function(){L.buildSel=L.buildSel===bt.dataset.item?null:bt.dataset.item;pal.querySelectorAll('[data-item]').forEach(function(q){q.setAttribute('aria-pressed',String(q.dataset.item===L.buildSel));});sfx('click');updateStat(true);};});
    pal.hidden=false;}else{pal.hidden=true;L.buildSel=null;}
  if(!quiet)sizeCanvas();updateStat(true);}
function sizeCanvas(){var wrap=$('lwrap');if(!wrap||!L.cv)return;var W=wrap.clientWidth,top=wrap.getBoundingClientRect().top,pal=$('lpal'),palH=pal&&!pal.hidden?78:0;
  var tb=document.querySelector('.tabs'),tabsH=tb?tb.getBoundingClientRect().height:62,tl=$('ltools'),toolsH=(tl?tl.offsetHeight:50)+14;var H=Math.round(clamp(window.innerHeight-top-toolsH-34-palH-tabsH-10,250,660));if(Math.abs(H-L.VH)<3&&W===L.VW&&L.x&&L.sizedCv===L.cv)return;L.sizedCv=L.cv;var mid=L.VW?[L.cam.x+L.VW/2,L.cam.y+L.VH/2]:null;L.VW=W;L.VH=H;if(mid){L.cam.x=mid[0]-W/2;L.cam.y=mid[1]-H/2;}L.cv.style.height=H+'px';L.dpr=Math.min(2,window.devicePixelRatio||1);L.cv.width=Math.round(W*L.dpr);L.cv.height=Math.round(H*L.dpr);L.x=L.cv.getContext('2d');clampCam();}
function homeSub(){var l=LS(),n=Math.min(S.tanks.length,STAGES[S.stage].tanks),bits=[plural(n,'tank')+' of '+STAGES[S.stage].tanks];if(l.hens.length&&S.stage>=2)bits.push(plural(l.hens.length,'hen'));var birds=Object.keys(S.book.birds||{}).length;if(birds)bits.push(plural(birds,'bird')+' seen');return bits.join(' · ');}
function renderCard(){var nm=$('h-name');if(!nm)return;nm.textContent=STAGES[S.stage].name;$('h-sub').textContent=homeSub();var mv=$('h-move'),nx=STAGES[S.stage+1];
  if(!nx){mv.innerHTML='';mv.hidden=true;return;}mv.hidden=false;var sure=L.confirmMove>performance.now();
  var html='<span>Next: '+esc(nx.name)+'</span><button class="btn sm'+(sure?'':' primary')+'" id="h-go"'+(S.cash<nx.cost?' disabled':'')+'>'+(sure?'Tap again to move':'Move · '+fmtA(nx.cost))+'</button>';
  if(mv._h!==html){mv.innerHTML=html;mv._h=html;var b=$('h-go');if(b)b.onclick=function(){if(L.confirmMove>performance.now()){L.confirmMove=0;if(!spend(nx.cost,'the move'))return;landSetStage(S.stage+1);sfx('book');toast('You moved. '+STAGES[S.stage].name+'.');return;}L.confirmMove=performance.now()+3000;renderCard();setTimeout(renderCard,3100);};}}
function updateStat(force){var el=$('lstat');if(!el)return;var l=LS(),html='',eggsN=0;Object.keys(l.basket).forEach(function(k){eggsN+=l.basket[k];});
  var f=L.fishing,b=L.tool==='build'&&L.buildSel&&BUILDI[L.buildSel];
  if(L.tool==='rod'&&f&&(f.st==='wait'||f.st==='fly'))html='Wait for the float to go under, then tap.';
  else if(L.tool==='rod'&&f&&f.st==='bite')html='<b>Now!</b>';
  else if(b)html='Tap where the '+esc(b.name.toLowerCase())+' goes. '+fmtA(b.price)+'.';
  else if(L.tool==='build')html='Pick something to add, or tap a thing you built.';
  else if(eggsN)html='<span>Basket: '+plural(eggsN,'egg')+'</span><button class="btn sm" data-sell>Sell · '+fmtA(eggsN)+'</button><button class="btn sm" data-gm>Give Grandma</button>';
  else if(L.tool==='mow')html='Go one way, then back, for stripes.';
  else if(L.tool==='grain')html=S.stage>=3?'Keep still near the wild chickens. Tap one while it eats.':'Tap the ground. The hens come running.';
  else if(L.tool==='rod')html='Tap the water to cast.';
  else if(!l.seen.pan&&(M().w*T>L.VW+8||M().h*T>L.VH+8))html='Drag the map to look around.';
  else{var fe=LS().objs.filter(function(o){return o.k==='feeder'||o.k==='wfeeder';}),empty=fe.length&&fe.every(function(o){return (o.s||0)<0.05;}),ready=trapsOn().some(function(o){return S.day-(o.set||0)>=0.25;}),eg=l.eggs.length;
    html=ready?'Something’s in the trap.':eg?plural(eg,'egg')+' in the coop.':empty?'The feeder’s empty. Tap it to fill.':!Object.keys(S.book.birds||{}).length?'Hold a bird to watch it.':'';}
  if(el._h===html)return;el._h=html;el.innerHTML=html;
  var sb=el.querySelector('[data-sell]');if(sb)sb.onclick=function(){earn(eggsN,'eggs');l.basket={};sfx('coin');toast('Sold '+plural(eggsN,'egg')+' for '+fmtA(eggsN)+'.');updateStat(true);save();};
  var gb=el.querySelector('[data-gm]');if(gb)gb.onclick=function(){l.basket={};toast('Grandma got '+plural(eggsN,'egg')+'. She’s making steamed egg.');updateStat(true);save();};}

// ----- drawing -----
var WALLC={};
function wallSprite(r,kind){var key=kind+r.x+','+r.y+','+r.w+','+r.h;var c=WALLC[key];if(c)return c;var pad=10,X0=r.x*T-pad,Y0=r.y*T-BW-pad,W=r.w*T+pad*2,H=kind==='back'?BW+pad*2:r.h*T+BW+pad*2+12,d=Math.min(2,window.devicePixelRatio||1);
  c=document.createElement('canvas');c.width=Math.ceil(W*d);c.height=Math.ceil(H*d);var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.translate(-X0,-Y0);
  if(kind==='back')paintBackWall(x,r);else if(kind==='side')paintSideWalls(x,r);else paintFrontWall(x,r);
  x.setTransform(d,0,0,d,0,0);x.globalCompositeOperation='source-atop';x.globalAlpha=0.5;x.fillStyle=grainPattern(x);x.fillRect(0,0,W,H);c._x=X0;c._y=Y0;c._w=W;c._h=H;WALLC[key]=c;return c;}
function blit(x,c){x.drawImage(c,c._x,c._y,c._w,c._h);}
function drawWater(x){var m=M(),x0=Math.max(0,Math.floor(L.cam.x/T)),y0=Math.max(0,Math.floor(L.cam.y/T)),x1=Math.min(m.w-1,Math.ceil((L.cam.x+L.VW)/T)),y1=Math.min(m.h-1,Math.ceil((L.cam.y+L.VH)/T));
  x.strokeStyle=rgba('#ffffff',0.32);x.lineWidth=1;x.beginPath();for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){if(mget(m,tx,ty)!==G_WATER)continue;var k=hash2(tx,ty,21),flow=m.stream&&ty>=22;
    var px=tx*T+((flow?L.rt*9:Math.sin(L.rt*0.7+k*6)*3)+k*T)%T,py=ty*T+6+hash2(tx,ty,22)*(T-12);if(!flow)px=tx*T+6+k*(T-16)+Math.sin(L.rt*0.8+k*9)*3;
    if(waterF(px,py)<0.62)continue;x.moveTo(px,py);x.quadraticCurveTo(px+3,py-1.6,px+7,py);}x.stroke();}
function drawPondFish(x,dt){var m=M();L.fishA.forEach(function(f){f.ph+=dt;f.a+=Math.sin(f.ph*0.7)*dt*0.9;var nx=f.x+Math.cos(f.a)*10*dt,ny=f.y+Math.sin(f.a)*6*dt,t=tileAt(nx,ny);if(mget(m,t[0],t[1])===G_WATER&&!(m.stream&&t[1]>=22)&&waterF(nx,ny)>0.62){f.x=nx;f.y=ny;}else f.a+=Math.PI*0.6;
  var F=FISHI[f.kind]||FISH[0];x.save();x.translate(f.x,f.y);x.rotate(f.a);x.globalAlpha=0.55;x.fillStyle=F.back;x.beginPath();x.ellipse(0,0,5,1.8,0,0,6.283);x.fill();x.beginPath();x.moveTo(-4.5,0);x.lineTo(-8,-2.2+Math.sin(f.ph*8));x.lineTo(-8,2.2+Math.sin(f.ph*8));x.closePath();x.fill();x.restore();});}
// butterflies over flowers and long grass, just to be there
var BFLY_COLS=['#f7f4ec','#f2d04c','#e8892e','#8fb8e8'];
function stepButterflies(dt){if(S.stage<2){L.bfl=[];return;}var bf=L.bfl||(L.bfl=[]),want=S.stage>=3?4:2;
  var targets=L.spots.filter(function(s){return s.t==='flowers';}).concat(countG(function(g,h){return g===G_MEADOW&&h>0.6;})>20?[{x:L.cam.x+Math.random()*L.VW,y:L.cam.y+Math.random()*L.VH}]:[]);
  if(bf.length<want&&targets.length&&Math.random()<dt*0.5){var t0=pick(targets);bf.push({x:L.cam.x+(Math.random()<0.5?-10:L.VW+10),y:L.cam.y+Math.random()*L.VH,tx:t0.x,ty:t0.y-8,ph:Math.random()*9,col:pick(BFLY_COLS),rest:0,life:25+Math.random()*30});}
  bf.forEach(function(b){b.ph+=dt;b.life-=dt;if(b.rest>0){b.rest-=dt;return;}var dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);
    if(d<3){b.rest=1+Math.random()*3;var t1=targets.length?pick(targets):{x:b.x+(Math.random()-0.5)*120,y:b.y+(Math.random()-0.5)*80};b.tx=t1.x+(Math.random()-0.5)*20;b.ty=t1.y-8+(Math.random()-0.5)*10;if(b.life<0){b.tx=L.cam.x-40;b.gone=b.life<-10;}}
    else{b.x+=dx/d*22*dt+Math.sin(b.ph*3)*0.4;b.y+=dy/d*22*dt+Math.sin(b.ph*7)*0.7;}});L.bfl=bf.filter(function(b){return !b.gone&&b.x>L.cam.x-80&&b.x<L.cam.x+L.VW+80;});}
function drawButterflies(x){(L.bfl||[]).forEach(function(b){var fl=b.rest>0?0.35+0.15*Math.sin(b.ph*3):Math.abs(Math.sin(b.ph*18));x.save();x.translate(b.x,b.y);
  x.fillStyle=rgba('#2c2418',0.12);x.beginPath();x.ellipse(0,10,2.4,0.8,0,0,6.283);x.fill();
  x.fillStyle=b.col;x.strokeStyle=rgba(INK,0.7);x.lineWidth=0.6;[-1,1].forEach(function(sd){x.save();x.scale(sd*(0.25+0.75*fl),1);x.beginPath();x.ellipse(2.2,-1.2,2.4,1.9,-0.4,0,6.283);x.fill();x.stroke();x.beginPath();x.ellipse(1.8,1.3,1.6,1.3,0.4,0,6.283);x.fill();x.stroke();x.restore();});
  x.fillStyle=INK;x.fillRect(-0.4,-2,0.8,4);x.restore();});}
function frame(dt){if(!L.cv||!L.x)return;var wdt=running()?dt:0;L.clock+=wdt;L.rt+=dt;
  if(L.ptr&&!L.ptr.down&&(Math.abs(L.vel.x)+Math.abs(L.vel.y))>8){L.cam.x-=L.vel.x*dt;L.cam.y-=L.vel.y*dt;var k=Math.pow(0.04,dt);L.vel.x*=k;L.vel.y*=k;clampCam();}
  if(L.autoPan&&L.ptr&&L.ptr.down&&L.ptr.mode==='mow'){L.cam.x+=L.autoPan[0]*160*dt;L.cam.y+=L.autoPan[1]*160*dt;clampCam();var w=toWorld(L.ptr.cx,L.ptr.cy);mowSeg(L.ptr.lw,w);L.ptr.lw=w;}
  L.spotT+=dt;if(L.spotT>2.2){L.spotT=0;computeSpots();}
  if(wdt>0){stepBirds(wdt);stepButterflies(wdt);var a=henArea();if(a)Object.keys(L.henA).forEach(function(id){stepChick(L.henA[id],wdt,a);});var wa=M().wildArea;if(wa)Object.keys(L.wildA).forEach(function(id){stepChick(L.wildA[id],wdt,wa);});}
  stepParts(dt);stepFishing(dt);drainRepaint(60);
  if(L.watch){var b=L.watch.b;if(!b||b.st==='out'||b.st==='flee'||b.gone){L.watch=null;}else{L.watch.t+=dt;if(L.watch.t>=1.2){var B=BIRD[b.sp];LS().stats.birds++;var isNew=bookAdd('birds',b.sp,{where:STAGES[S.stage].name});if(!isNew){L.labels.push({text:B.name,x:b.x,y:b.y-22,t:0});sfx('chirp');}L.watch=null;if(L.ptr)L.ptr.mode='done';b.stay=Math.max(b.stay,b.t+4);}}}
  L.labels.forEach(function(q){q.t+=dt;});L.labels=L.labels.filter(function(q){return q.t<2.2;});
  draw(wdt);if((L.fc=(L.fc||0)+1)%10===0){updateStat();renderCard();}}
function draw(wdt){var x=L.x,d=L.dpr,VW=L.VW,VH=L.VH,m=M(),cx=L.cam.x,cy=L.cam.y,t=L.clock;x.setTransform(d,0,0,d,0,0);x.fillStyle='#e6dfcd';x.fillRect(0,0,VW,VH);
  if(!L.groundOK)renderGround();var W=m.w*T,H=m.h*T,sx=Math.max(0,cx),sy=Math.max(0,cy),ex=Math.min(W,cx+VW),ey=Math.min(H,cy+VH),gd=L.gd;
  if(ex>sx&&ey>sy)x.drawImage(L.gcv,sx*gd,sy*gd,(ex-sx)*gd,(ey-sy)*gd,sx-cx,sy-cy,ex-sx,ey-sy);
  x.save();x.translate(-cx,-cy);
  drawWater(x);drawPondFish(x,wdt);
  L.grain.forEach(function(g){x.fillStyle='#8a6a34';x.fillRect(g.x-1.4,g.y-0.6,2.8,2.1);x.fillStyle='#e8c977';x.fillRect(g.x-1.1,g.y-0.9,2.2,1.6);});
  // the wall layer: back walls, window birds outside the glass, the window feeder
  m.rooms.forEach(function(r){blit(x,wallSprite(r,'back'));
    LS().objs.forEach(function(o){if(OBJ[o.k]&&OBJ[o.k].wall&&OBJ[o.k].live){OBJ[o.k].live(x,o,o.tx*T,o.ty*T,o.fw*T,o.fh*T,t);}});
    (r.windows||[]).forEach(function(wn){var wx=wn.x*T+4,ww=wn.w*T-8,wy=r.y*T-BW+7,wh=BW-15;x.save();x.beginPath();x.rect(wx,wy-4,ww,wh+4);x.clip();L.birds.forEach(function(b){if(b.win&&b.x>wx-60&&b.x<wx+ww+60)drawBirdA(x,b);});x.restore();});
    blit(x,wallSprite(r,'side'));});
  paintBalcony(x,m,false);
  // everything that stands up, back to front
  var items=[];
  LS().objs.forEach(function(o){var dd=OBJ[o.k];if(!dd||dd.flat||dd.wall)return;var key=o.k==='bridge'?o.ty*T+1:(o.ty+o.fh)*T+(o.oy||0);if(!inView(o.tx*T+o.fw*T/2,key,140))return;items.push({y:key,o:o});});
  m.rooms.forEach(function(r){items.push({y:(r.y+r.h)*T+2,f:function(){blit(x,wallSprite(r,'front'));}});});
  if(m.balcony)items.push({y:(m.balcony.y+m.balcony.h)*T+3,f:function(){paintBalcony(x,m,true);}});
  L.birds.forEach(function(b){if(!b.win)items.push({y:b.st==='stay'?b.y:b.y+40,f:function(){drawBirdA(x,b);}});});
  Object.keys(L.henA).forEach(function(id){var c=L.henA[id];items.push({y:c.y,f:function(){drawHen(x,c.kind,c.x,c.y,c.face,chickPose(c),c.ph);}});});
  Object.keys(L.wildA).forEach(function(id){var c=L.wildA[id];items.push({y:c.y,f:function(){drawHen(x,'wild',c.x,c.y,c.face,chickPose(c),c.ph);}});});
  items.sort(function(a,b){return a.y-b.y;});
  items.forEach(function(it){if(it.f){it.f();return;}var o=it.o,dd=OBJ[o.k];if(dd.draw.length&&o.k!=='trap'&&o.k!=='wfeeder'){var c=objSprite(o);x.drawImage(c,o.tx*T-c._ox,o.ty*T-c._oy,c._w,c._h);}if(dd.live)dd.live(x,o,o.tx*T,o.ty*T,o.fw*T,o.fh*T,t);});
  drawButterflies(x);drawParts(x);drawFishing(x);drawBuildHints(x);
  if(L.ptr&&L.ptr.down&&L.ptr.mode==='mow'){var mw=toWorld(L.ptr.cx,L.ptr.cy),mv=L.mowDir||0;x.save();x.translate(mw[0],mw[1]);x.rotate(mv);
    line(x,[[0,6],[0,30]],2.4,'#3b3a34',5,0.1);line(x,[[-7,30],[7,30]],2.6,'#3b3a34',6,0.1);
    shape(x,[[-12,-7],[12,-7],[12,6],[-12,6]],'#c4483a',7,{w:1.4,wash:0.5});shape(x,[[-10,-5],[10,-5],[10,-1],[-10,-1]],'#d96a58',8,{w:0,nostroke:1,wash:0});
    [[-13,-8],[13,-8],[-13,7],[13,7]].forEach(function(q,j){shape(x,blobPts(q[0],q[1],3.2,3.6,9+j,0.02,10),'#2f2c28',10+j,{w:1,wash:0});});x.restore();}
  if(L.watch&&L.watch.b){var b=L.watch.b,k=clamp(L.watch.t/1.2,0,1);x.strokeStyle=rgba('#ffffff',0.9);x.lineWidth=3;x.beginPath();x.arc(b.x,b.y-7,14,-Math.PI/2,-Math.PI/2+k*6.283);x.stroke();x.strokeStyle=rgba('#2d6a4f',0.95);x.lineWidth=1.6;x.beginPath();x.arc(b.x,b.y-7,14,-Math.PI/2,-Math.PI/2+k*6.283);x.stroke();}
  L.labels.forEach(function(q){var a=q.t<0.2?q.t/0.2:q.t>1.8?(2.2-q.t)/0.4:1;x.save();x.globalAlpha=clamp(a,0,1);x.font='600 11px Inter,system-ui,sans-serif';var tw=x.measureText(q.text).width+12;x.fillStyle='#fbf8f1';rpath(x,q.x-tw/2,q.y-q.t*6-16,tw,17,8);x.fill();x.strokeStyle=rgba(INK,0.5);x.lineWidth=1;x.stroke();x.fillStyle=INK;x.textAlign='center';x.textBaseline='middle';x.fillText(q.text,q.x,q.y-q.t*6-7.5);x.restore();});
  x.restore();drawRod(x);}

// ----- the book -----
function regBook(){
  bookCat('birds',{title:'Birds',order:2,entries:BIRDS.map(function(B){return {id:B.id,name:B.name,hint:B.hint,draw:function(x,w,h){var st=Math.min(2,(h-6)/(B.tall?33:13.5),(w-8)/(B.len+14));drawBird(x,B.id,w/2+2,h-4,1,0,0.4,st*16/B.len);}};})});
  bookCat('fish',{title:'Fish',order:3,entries:FISH.map(function(F){return {id:F.id,name:F.name,hint:F.hint,draw:function(x,w,h){drawFish(x,F.id,w/2,h/2,Math.min(w*0.8,F.eel?w*0.9:w*0.7),1);}};})});
  bookCat('finds',{title:'Stream finds',order:4,entries:FINDS.map(function(f){return {id:f.id,name:f.name,hint:f.hint,draw:f.draw};})});
  var coop=HENS.map(function(Hn){return {id:'hen-'+Hn.id,name:Hn.name,hint:Hn.hint,draw:function(x,w,h){drawHen(x,Hn.id,w/2,h-4,1,2,0,Math.min(2,(h-6)/22));}};});
  [['white','White egg','From a white hen'],['brown','Brown egg','From a brown hen'],['speckled','Speckled egg','From a speckled hen'],['blue','Blue egg','From a blue egg hen'],['cream','Small cream egg','From a wild junglefowl']].forEach(function(e){coop.push({id:'egg-'+e[0],name:e[1],hint:e[2],draw:function(x,w,h){drawEgg(x,e[0],w/2,h/2,Math.min(h*0.36,12));}});});
  bookCat('coop',{title:'Chickens and eggs',order:5,entries:coop});}

// ----- module -----
var MOD={name:'land',
  init:function(){ensureLand();L.tool=LS().tool||'look';regBook();window.addEventListener('resize',function(){if(L.shown){sizeCanvas();}});},
  day:function(d){if(!S.land||!S.land.map)return;var l=LS(),m=l.map;
    for(var i=0;i<m.g.length;i++){var g=m.g[i];if(isGrass(g)||g===G_STEP){m.gh[i]=Math.min(1,m.gh[i]+(g===G_MEADOW?0.25:0.2));if(L.shown&&L.groundOK)touchTile(i%m.w,(i/m.w)|0,true);}}
    if(!L.shown)L.groundOK=false;
    if(S.stage>=2&&stageHas('coop'))l.hens.forEach(function(h){if(l.eggs.length<12&&Math.random()<(h.kind==='wild'?0.5:0.8))l.eggs.push(HEN[h.kind].egg);});
    l.objs.forEach(function(o){if(o.k==='feeder'||o.k==='wfeeder')o.s=Math.max(0,(o.s||0)-0.06);});
    if(S.stage===3&&l.wild.length<3&&Math.random()<0.5){l.wild.push({id:'w'+(++l.oid)});if(L.shown)syncAgents();}},
  tick:function(dd,ds){if(L.shown&&activeTab==='home'&&!document.hidden)try{frame(ds);}catch(e){if(!L.err){L.err=1;console.error('land frame',e);}}},
  show:function(){L.shown=true;mountHome();},
  hide:function(){L.shown=false;closeBub();if(L.mower){L.mower.stop();L.mower=null;}L.watch=null;if(L.ptr)L.ptr.down=false;},
  render:function(){if(L.shown){renderCard();updateStat(true);}},
  stageChanged:function(){}};
registerMod(MOD);registerTab('home',MOD);
window.LAND={L:L,T:T,stats:function(){return S.land.stats;},toWorld:toWorld,camFocus:camFocus,setTool:function(t){setTool(t);},BIRDS:BIRDS,FISH:FISH,HENS:HENS,spawnBird:spawnBird,computeSpots:computeSpots,objs:function(){return S.land.objs;}};
})();
