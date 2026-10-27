// ===== Home: Grandma's place as a small pixel world, in Puti's Haven / Echoing End style =====
// Millie walks where you tap and the dog follows her. Pierre the cat lives indoors. Things happen where Millie is.
// World units are art pixels: one tile is 64. The ground is painted once into an offscreen canvas at art size and
// scaled up crisp; everything that stands up is a pixel sprite, sorted by where its feet are.
// Everything lives in this closure. Globals out: landSetStage(n), LAND (for tests and the Try tab).
(function(){
'use strict';
var T=64;
var LAND_V=2;                 // S.land layout version. 2 is the pixel home; older saves get their map rebuilt

// ----- colours -----
// Outdoors follows her tiles (they use the DawnBringer 32 palette). Rooms follow her apartment drawings.
var PAL={K:'#21181b',INK:'#090609',CREAM:'#f1ebdb',PALE:'#d4e6f3',CORAL:'#dc8b79',CAB:'#446b7d',PLANT:'#4aa63e',
  g1:'#99e550',g2:'#6abe30',g3:'#37946e',g4:'#4b692f',g5:'#323c39',dirt:'#d9a066',dirt2:'#c18e5b',brown:'#8f563b',dbrown:'#663931',
  water:'#5fcde4',foam:'#cbdbfc',white:'#ffffff',grey:'#9badb7',grey2:'#847e87',grey3:'#696a6a',grey4:'#595652',
  yellow:'#fbf236',orange:'#df7126',red:'#ac3232',pink:'#d95763',rose:'#d77bba',blue:'#639bff',blue2:'#5b6ee1',navy:'#3f3f74',
  sky:'#cbdbfc',olive:'#8f974a',plum:'#45283c',purple:'#76428a',tan:'#eec39a',VOID:'#efe9dc'};
var UC={};
function U32(hex,a){var n=parseInt(hex.charAt(0)==='#'?hex.slice(1,7):hex,16);return ((((a==null?255:a)&255)<<24)|((n&255)<<16)|(n&0xff00)|((n>>16)&255))>>>0;}
function cu(h){if(typeof h!=='string')return h>>>0;return UC[h]!==undefined?UC[h]:(UC[h]=U32(h));}
function hexOf(u){var r=u&255,g=(u>>>8)&255,b=(u>>>16)&255;return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);}
function mixH(a,b,t){var A=parseInt(a.slice(1,7),16),B=parseInt(b.slice(1,7),16);var r=Math.round(lerp(A>>16&255,B>>16&255,t)),g=Math.round(lerp(A>>8&255,B>>8&255,t)),bb=Math.round(lerp(A&255,B&255,t));return '#'+((1<<24)|(r<<16)|(g<<8)|bb).toString(16).slice(1);}
function lt(h,t){return mixH(h,'#fff4dc',t==null?0.3:t);}
function dk(h,t){return mixH(h,'#1c1830',t==null?0.3:t);}
function rgbaH(h,a){var n=parseInt(h.slice(1,7),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';}
// smooth value noise, 0..1
function vnz(x,y,s,k){var gx=x/s,gy=y/s,x0=Math.floor(gx),y0=Math.floor(gy),fx=gx-x0,fy=gy-y0;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
  var a=hash2(x0,y0,k),b=hash2(x0+1,y0,k),c=hash2(x0,y0+1,k),d=hash2(x0+1,y0+1,k);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;}

// ----- a tiny pixel painter: sprites are drawn at art size into a buffer, then turned into a canvas -----
function PB(w,h){this.w=Math.max(1,w|0);this.h=Math.max(1,h|0);this.d=new Uint32Array(this.w*this.h);}
PB.prototype.set=function(x,y,c){x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=this.w||y>=this.h)return this;this.d[y*this.w+x]=cu(c);return this;};
PB.prototype.get=function(x,y){x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=this.w||y>=this.h)return 0;return this.d[y*this.w+x];};
PB.prototype.on=function(x,y){return (this.get(x,y)>>>24)>0;};
PB.prototype.rect=function(x,y,w,h,c){c=cu(c);for(var j=Math.floor(y);j<Math.floor(y+h);j++)for(var i=Math.floor(x);i<Math.floor(x+w);i++)this.set(i,j,c);return this;};
PB.prototype.box=function(x,y,w,h,c,o){this.rect(x,y,w,h,c);if(o){this.rect(x,y,w,1,o);this.rect(x,y+h-1,w,1,o);this.rect(x,y,1,h,o);this.rect(x+w-1,y,1,h,o);}return this;};
PB.prototype.ell=function(cx,cy,rx,ry,c){c=cu(c);for(var j=Math.floor(cy-ry-1);j<=Math.ceil(cy+ry+1);j++)for(var i=Math.floor(cx-rx-1);i<=Math.ceil(cx+rx+1);i++){var dx=(i+0.5-cx)/rx,dy=(j+0.5-cy)/ry;if(dx*dx+dy*dy<=1)this.set(i,j,c);}return this;};
PB.prototype.line=function(x0,y0,x1,y1,c){c=cu(c);x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);var dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,e=dx+dy,g=0;
  for(;g<4000;g++){this.set(x0,y0,c);if(x0===x1&&y0===y1)break;var e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}return this;};
PB.prototype.poly=function(pts,c){c=cu(c);var y0=1e9,y1=-1e9,i;for(i=0;i<pts.length;i++){y0=Math.min(y0,pts[i][1]);y1=Math.max(y1,pts[i][1]);}
  for(var y=Math.floor(y0);y<=Math.ceil(y1);y++){var xs=[],yc=y+0.5;for(i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
    xs.sort(function(p,q){return p-q;});for(var k=0;k+1<xs.length;k+=2)for(var x=Math.round(xs[k]);x<Math.round(xs[k+1]);x++)this.set(x,y,c);}return this;};
// 1 px outline round everything opaque (only into empty pixels)
PB.prototype.outline=function(c,diag){c=cu(c);var w=this.w,h=this.h,d=this.d,o=new Uint32Array(d);
  for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=y*w+x;if(d[i]>>>24)continue;
    var hit=(x>0&&(d[i-1]>>>24)>200)||(x<w-1&&(d[i+1]>>>24)>200)||(y>0&&(d[i-w]>>>24)>200)||(y<h-1&&(d[i+w]>>>24)>200);
    if(!hit&&diag)hit=(x>0&&y>0&&(d[i-w-1]>>>24)>200)||(x<w-1&&y>0&&(d[i-w+1]>>>24)>200)||(x>0&&y<h-1&&(d[i+w-1]>>>24)>200)||(x<w-1&&y<h-1&&(d[i+w+1]>>>24)>200);
    if(hit)o[i]=c;}this.d=o;return this;};
// light on the top-left edge of a colour region, dark on the bottom-right (do it before the outline)
// emptyOnly: only empty pixels count as the edge (inner details don't get a rim)
PB.prototype.shade=function(base,light,dark,k,emptyOnly){var B=cu(base),Lc=light?cu(light):0,Dc=dark?cu(dark):0,w=this.w,h=this.h,d=this.d,o=new Uint32Array(d);k=k||1;
  function out(x,y){if(x<0||y<0||x>=w||y>=h)return true;var c=d[y*w+x];return emptyOnly?(c>>>24)===0:c!==B;}
  for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=y*w+x;if(d[i]!==B)continue;var t=false,b=false;
    for(var q=1;q<=k;q++){if(out(x,y-q)||out(x-q,y))t=true;if(out(x,y+q)||out(x+q,y))b=true;}
    if(t&&Lc&&!b)o[i]=Lc;else if(b&&Dc&&!t)o[i]=Dc;}this.d=o;return this;};
PB.prototype.dots=function(x,y,w,h,c,p,seed){c=cu(c);for(var j=y;j<y+h;j++)for(var i=x;i<x+w;i++)if(this.on(i,j)&&hash2(i,j,seed||7)<p)this.set(i,j,c);return this;};
PB.prototype.recolor=function(a,b){var A=cu(a),B=cu(b),d=this.d;for(var i=0;i<d.length;i++)if(d[i]===A)d[i]=B;return this;};
PB.prototype.blit=function(src,dx,dy){for(var y=0;y<src.h;y++)for(var x=0;x<src.w;x++){var c=src.d[y*src.w+x];if(c>>>24)this.set(dx+x,dy+y,c);}return this;};
PB.prototype.flipX=function(){var o=new PB(this.w,this.h);for(var y=0;y<this.h;y++)for(var x=0;x<this.w;x++)o.d[y*this.w+(this.w-1-x)]=this.d[y*this.w+x];return o;};
PB.prototype.cv=function(){var c=document.createElement('canvas');c.width=this.w;c.height=this.h;var x=c.getContext('2d'),im=x.createImageData(this.w,this.h);new Uint32Array(im.data.buffer).set(this.d);x.putImageData(im,0,0);return c;};
// a soft pixel shadow under something standing
function shadowPB(pb,cx,cy,rx,ry,a){var s=cu(rgbaToU('#1c1830',a==null?70:a));for(var j=Math.floor(cy-ry);j<=Math.ceil(cy+ry);j++)for(var i=Math.floor(cx-rx);i<=Math.ceil(cx+rx);i++){var dx=(i+0.5-cx)/rx,dy=(j+0.5-cy)/ry;if(dx*dx+dy*dy<=1&&!pb.on(i,j))pb.d[j*pb.w+i]=s;}}
function rgbaToU(h,a){return U32(h,a);}
// sprite cache: key -> {c,ax,ay}; ax/ay is the pixel that sits on the thing's feet
var SPR={},SPR_GEN=1,CACHE=null,OC={};
function spr(key,make){var s=SPR[key];if(s)return s;s=make();SPR[key]=s;return s;}
// per-frame lookups go through small tables keyed by numbers or existing ids, never by a freshly built string
function resetSprites(){SPR={};OC={};SPR_GEN++;CACHE={bird:{},hen:{},cat:{},mow:{},sh:{},egg:{},gma:[],bf:[],fw:[],fish:{},find:{},one:{}};if(typeof L!=='undefined'&&L)L.dirty=true;}
resetSprites();
function cached(tab,k,make){var s=tab[k];if(s)return s;return tab[k]=make();}
function mk(pb,ax,ay){return {c:pb.cv(),ax:ax,ay:ay,w:pb.w,h:pb.h,pb:pb};}

// ----- Puti's art (src/pixart.js), loaded once -----
var IMG={},ART={ready:false,failed:false};
var MF=(typeof PIXMETA==='object'&&PIXMETA)?PIXMETA:{};
function loadArt(){var src=Object.assign({},(typeof PIXSRC==='object'&&PIXSRC)?PIXSRC:{},(typeof ANIMSRC==='object'&&ANIMSRC)?ANIMSRC:{}),keys=Object.keys(src),left=keys.length;
  if(!left){ART.failed=true;prepArt();return;}
  keys.forEach(function(k){var im=new Image();im.onload=function(){if(--left===0)prepArt();};im.onerror=function(){ART.failed=true;if(--left===0)prepArt();};im.src=src[k];IMG[k]=im;});}
function imgPix(im,sx,sy,w,h){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');try{x.drawImage(im,sx,sy,w,h,0,0,w,h);}catch(e){}return new Uint32Array(x.getImageData(0,0,w,h).data.buffer);}
function pixCanvas(d,w,h){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d'),im=x.createImageData(w,h);new Uint32Array(im.data.buffer).set(d);x.putImageData(im,0,0);return c;}
var TX={grass:[],meadow:[],dirt:[],sand:[],water:[],sea:[]};
// grass tiles from her terrain atlas (a 3x3 block), mixed at random. Her bottom row is lighter than the top two, so each tile
// is evened out to the same amount of dark and light blades first (eqGrass): then no tile stands out as a square
var GVAR=[[6,0],[7,0],[8,0],[6,1],[7,1],[8,1],[6,2],[7,2],[8,2]];
function grassVar(tx,ty){return Math.floor(hash2(tx,ty,4243)*9)%9;}
var GB_=U32('#6abe30'),GD_=U32('#37946e'),GL_=U32('#99e550'),GO_=U32('#8f974a');
// mown (0) to long (3): fewer or more of her dark blade strokes, whole short runs at a time so it still reads as strokes
function grassBucketTex(P,b,meadow,v){var o=new Uint32Array(4096);
  for(var y=0;y<64;y++)for(var x=0;x<64;x++){var i=y*64+x,c=P[i],r=hash2(x,(y>>2)+v*17,b*13+v),r2=hash2(x,y,91+v+b);
    // mown: almost no dark strokes, short light flecks, so a cut patch reads at a glance
    if(b===0){if(c===GD_&&r<0.93)c=GB_;else if(c===GB_&&hash2(x,y>>1,91+v)<0.17)c=GL_;}
    else if(b===1){if(c===GD_&&r<0.62)c=GB_;else if(c===GB_&&hash2(x,y>>1,93+v)<0.06)c=GL_;}
    else if(b===2){if(c===GD_&&r<0.15)c=GB_;}
    else{if(c===GB_&&hash2(x,(y>>2),77+v)<(meadow?0.2:0.16))c=GD_;}
    if(meadow&&b>=2&&c===GB_&&hash2(x>>1,y>>2,55+v)<(b===3?0.07:0.03))c=GO_;
    o[i]=c;}return o;}
// the stone and the white flower in two of her grass tiles would repeat in a grid, so they're painted out (grass from just above)
function cleanGrass(P){var o=new Uint32Array(P),F=new Uint8Array(4096),K=new Uint8Array(4096),x,y,i,yy;
  for(i=0;i<4096;i++){var c=P[i];F[i]=(c!==GB_&&c!==GD_&&c!==GL_)?1:0;}
  for(y=0;y<64;y++)for(x=0;x<64;x++){i=y*64+x;if(F[i]){K[i]=1;continue;}if(P[i]!==GL_)continue;
    for(var dy=-2;dy<=2&&!K[i];dy++)for(var dx=-2;dx<=2;dx++){var y2=y+dy,x2=x+dx;if(y2>=0&&y2<64&&x2>=0&&x2<64&&F[y2*64+x2]){K[i]=1;break;}}}
  for(x=0;x<64;x++)for(y=0;y<64;y++){i=y*64+x;if(!K[i])continue;yy=y-1;while(yy>=0&&K[yy*64+x])yy--;if(yy>=0){o[i]=o[yy*64+x];continue;}yy=y+1;while(yy<64&&K[yy*64+x])yy++;if(yy<64)o[i]=P[yy*64+x];}
  return o;}
function eqGrass(P,v){var o=new Uint32Array(P),nD=0,nL=0,nB=0,i,x,y,p;for(i=0;i<4096;i++){if(o[i]===GD_)nD++;else if(o[i]===GL_)nL++;else if(o[i]===GB_)nB++;}
  var TD=1000,TL=600;
  if(nD>TD){p=1-TD/nD;for(y=0;y<64;y++)for(x=0;x<64;x++){i=y*64+x;if(o[i]===GD_&&hash2(x,(y>>2)+v*17,5+v)<p){o[i]=GB_;nB++;}}}
  else if(nD<TD&&nB>0){p=(TD-nD)/nB;for(y=0;y<64;y++)for(x=0;x<64;x++){i=y*64+x;if(o[i]===GB_&&hash2(x,(y>>2),77+v)<p){o[i]=GD_;nB--;}}}
  for(nL=0,nB=0,i=0;i<4096;i++){if(o[i]===GL_)nL++;else if(o[i]===GB_)nB++;}
  if(nL>TL){p=1-TL/nL;for(y=0;y<64;y++)for(x=0;x<64;x++){i=y*64+x;if(o[i]===GL_&&hash2(x,(y>>1)+v*7,9+v)<p)o[i]=GB_;}}
  else if(nL<TL&&nB>0){p=(TL-nL)/nB;for(y=0;y<64;y++)for(x=0;x<64;x++){i=y*64+x;if(o[i]===GB_&&hash2(x,(y>>1),33+v)<p)o[i]=GL_;}}
  return o;}
function recolorTex(P,map){var o=new Uint32Array(P.length),m={};Object.keys(map).forEach(function(k){m[U32(k)]=U32(map[k]);});for(var i=0;i<P.length;i++){var c=P[i];o[i]=m[c]!==undefined?m[c]:c;}return o;}
function flipTex(P){var o=new Uint32Array(4096);for(var y=0;y<64;y++)for(var x=0;x<64;x++)o[y*64+63-x]=P[y*64+x];return o;}
function prepArt(){
  var ter=IMG.terrain,ok=ter&&ter.naturalWidth>=640;
  GVAR.forEach(function(v,i){var P=ok?imgPix(ter,v[0]*64,v[1]*64,64,64):(IMG.grass&&IMG.grass.naturalWidth?imgPix(IMG.grass,0,0,64,64):solidTex('#6abe30'));if(ok){if(i===2||i===3)P=cleanGrass(P);P=eqGrass(P,i);}
    TX.grass[i]=[];TX.meadow[i]=[];for(var b=0;b<4;b++){var g=grassBucketTex(P,b,false,i),m=grassBucketTex(P,b,true,i);TX.grass[i][b]={d:g,c:pixCanvas(g,64,64)};TX.meadow[i][b]={d:m,c:pixCanvas(m,64,64)};}});
  var dsrc=[];if(ok)for(var r=0;r<3;r++)dsrc.push(imgPix(ter,9*64,r*64,64,64));if(IMG.dirt&&IMG.dirt.naturalWidth)dsrc.push(imgPix(IMG.dirt,0,0,64,64));if(!dsrc.length)dsrc.push(solidTex('#d9a066'));
  var SAND={'#d9a066':'#e4c393','#c18e5b':'#cfa977','#c8935e':'#d6b07e','#e7aa6d':'#eccf9f','#8f563b':'#a9895f','#ba8957':'#c9a676'};
  dsrc.forEach(function(P){TX.dirt.push({d:P,c:pixCanvas(P,64,64)});var s=recolorTex(P,SAND);TX.sand.push({d:s,c:pixCanvas(s,64,64)});});
  var W=IMG.water&&IMG.water.naturalWidth?imgPix(IMG.water,0,0,64,64):solidTex('#5fcde4');
  [W,flipTex(W)].forEach(function(P){TX.water.push({d:P,c:pixCanvas(P,64,64)});var s=recolorTex(P,{'#5fcde4':'#3e98cc','#67dff8':'#52b0de','#89d8e4':'#6cbbe0','#cbdbfc':'#cfe4f7'});TX.sea.push({d:s,c:pixCanvas(s,64,64)});});
  ART.ready=true;resetSprites();if(L){L.groundOK=false;DOGL=null;}}
function solidTex(h){var o=new Uint32Array(4096),c=U32(h);for(var i=0;i<4096;i++)o[i]=c;return o;}

// ----- the map: one ground type per 64 px tile -----
var G_VOID=0,G_FLOOR=1,G_TILE=2,G_GRASS=3,G_MEADOW=4,G_DIRT=5,G_STONE=6,G_WATER=7,G_SAND=8,G_HALL=9,G_STEP=10,G_WALL=11;
function isGrass(g){return g===G_GRASS||g===G_MEADOW||g===G_STEP;}
function isWalkG(g){return g!==G_VOID&&g!==G_WATER&&g!==G_WALL;}
// for the painted edges: 1 grass, 2 bare earth or stone, 3 water, 0 indoors or nothing
function gClass(g){return isGrass(g)?1:(g===G_DIRT||g===G_SAND||g===G_STONE)?2:g===G_WATER?3:0;}
var STAGE_SEED=[1001,1107,1213,1319];
function newMap(w,h,seed){var n=w*h,m={w:w,h:h,seed:seed,g:[],gh:[],rooms:[],balcony:null,backdrop:null,henArea:null,wildArea:null,stream:false,lake:null,seaRow:99};
  for(var i=0;i<n;i++){m.g.push(G_VOID);m.gh.push(0);}return m;}
function mi(m,x,y){return y*m.w+x;}
function mget(m,x,y){if(x<0||y<0||x>=m.w||y>=m.h)return G_VOID;return m.g[y*m.w+x];}
// off the map edge, pretend the ground carries on (so no painted edge at the border)
function mgetE(m,x,y){return mget(m,clamp(x,0,m.w-1),clamp(y,0,m.h-1));}
function mset(m,x,y,g,h){if(x<0||y<0||x>=m.w||y>=m.h)return;var i=y*m.w+x;m.g[i]=g;if(h!=null)m.gh[i]=h;}
function mfill(m,x0,y0,x1,y1,g,h){for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++)mset(m,x,y,g,h);}
function bucketOf(h){return h<0.15?0:h<0.45?1:h<0.75?2:3;}

// ----- painted pixels for each kind of floor (world coordinates, so they flow across tiles) -----
var FLOOR_P=['#b6733f','#ad6b3b','#bb7a45','#a66536'].map(cu),F_SEAM=cu('#74401f'),F_GRAIN=cu('#9a5a31'),F_HI=cu('#c4844e');
function floorPx(px,py){var row=py>>4,ry=py&15,pl=128+Math.floor(hash2(row,3,5)*4)*16,off=Math.floor(hash2(row,11,5)*pl),seg=Math.floor((px+off)/pl),sx=(px+off)%pl;
  if(ry===0||sx===0)return F_SEAM;var c=FLOOR_P[Math.floor(hash2(seg,row,7)*4)];
  if(ry===1&&hash2(px>>1,row,3)<0.35)return F_HI;
  if(ry>3&&ry<14&&hash2(px>>4,py,seg*7+row)<0.045)return F_GRAIN;return c;}
var BT_P=['#c8714a','#c06a44','#cf7a52'].map(cu),BT_G=cu('#9a5a3a'),BT_S=cu('#b0603c'),BT_H=cu('#d9895f');
function balconyPx(px,py){var lx=px&31,ly=py&31;if(lx===0||ly===0)return BT_G;if(lx===1||ly===1)return BT_H;var c=BT_P[Math.floor(hash2(px>>5,py>>5,9)*3)];return hash2(px,py,4)<0.04?BT_S:c;}
var HT_A=cu('#e3ddd0'),HT_B=cu('#d6cfc0'),HT_G=cu('#b0a898');
function hallPx(px,py){var lx=px&31,ly=py&31;if(lx===0||ly===0)return HT_G;return (((px>>5)+(py>>5))&1)?HT_A:HT_B;}
var ST_P=['#a9b8c0','#9badb7','#b5c2c7','#8e9fa8'].map(cu),ST_G=cu('#595652'),ST_M=cu('#37946e'),ST_L=cu('#cbdbfc'),ST_D=cu('#847e87');
function stonePx(px,py){var cs=26,gx=Math.floor(px/cs),gy=Math.floor(py/cs),best=1e9,b2=1e9,bx=0,by=0,id=0;
  for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var cx=(gx+dx+0.2+0.6*hash2(gx+dx,gy+dy,3))*cs,cy=(gy+dy+0.2+0.6*hash2(gx+dx,gy+dy,4))*cs,d=(px-cx)*(px-cx)+(py-cy)*(py-cy);
    if(d<best){b2=best;best=d;bx=cx;by=cy;id=(gx+dx)*7919+(gy+dy)*104729;}else if(d<b2)b2=d;}
  var edge=Math.sqrt(b2)-Math.sqrt(best);if(edge<2.1)return hash2(px,py,8)<0.25?ST_M:ST_G;
  if(edge<3.2){if(px<bx&&py<by)return ST_L;if(px>bx&&py>by)return ST_D;}
  return ST_P[Math.floor(hash2(id,1,2)*4)];}
var VOID_U=cu(PAL.VOID);
function darkU(c,k){var r=c&255,g=(c>>>8)&255,b=(c>>>16)&255;k=k||0.86;return ((255<<24)|((b*k)<<16)|((g*k)<<8)|(r*k))>>>0;}

// ----- one tile, pixel by pixel. Outdoors, water and grass edges follow smooth fields made from the tile grid, so banks
// run on the diagonal instead of in steps. Her ragged dark fringe on the grass, foam and a bank face on the far side of water.
var K30=cu('#303030');
function texOf(m,g,tx,ty){if(isGrass(g))return grassTexFor(g,tx,ty,bucketOf(m.gh[mi(m,clamp(tx,0,m.w-1),clamp(ty,0,m.h-1))])).d;
  if(g===G_DIRT)return TX.dirt[Math.floor(hash2(tx,ty,31)*TX.dirt.length)].d;if(g===G_SAND)return TX.sand[Math.floor(hash2(tx,ty,32)*TX.sand.length)].d;
  if(g===G_WATER)return (m.backdrop==='sea'&&ty>=m.seaRow?TX.sea:TX.water)[((tx+ty*3)&1)].d;return null;}
function grassTexFor(g,tx,ty,b){return ((g===G_MEADOW?TX.meadow:TX.grass)[grassVar(tx,ty)]||TX.grass[0])[b];}
function bil(V,lx,ly){var ux=(lx+0.5-32)/64,uy=(ly+0.5-32)/64,cx=Math.floor(ux),cy=Math.floor(uy),fx=ux-cx,fy=uy-cy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);var c0=cx+1,r0=cy+1;
  var a=V[r0*3+c0],b=V[r0*3+c0+1],c=V[(r0+1)*3+c0],d=V[(r0+1)*3+c0+1];return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;}
var FB=cu('#8f563b'),FB2=cu('#7a4a32'),FD=cu('#663931'),FL=cu('#45283c'),FO=cu('#cbdbfc'),FO2=cu('#89d8e4');
// ----- natural water (the stream, the lake, the garden pond) is painted from its own smooth shape instead of from the tile
// squares, so the banks curve. Only when the map's tiles match the shape exactly: an old save made differently keeps squares.
var NAT_K=1.4;
function natShapes(m){var N={stream:false,lake:null,pond:null},x,y,i,ok;
  if(m.stream){var bad=0,tot=0;for(y=0;y<m.h;y++)for(x=0;x<m.w;x++){i=y*m.w+x;var sc=streamCy(x+0.5),sw=streamW(x+0.5),inW=y>=22&&Math.abs(y+0.5-sc)<sw/2,isW=m.g[i]===G_WATER&&!!m.wb&&m.wb[i]===W_STREAM;if(inW)tot++;if(inW!==isW&&!painted(m,i))bad++;}N.stream=bad<=Math.max(2,tot*0.05);}
  if(m.lake){var Lk=m.lake;ok=true;for(y=0;y<m.h&&ok;y++)for(x=0;x<m.w;x++){i=y*m.w+x;var ax=(x+0.5-Lk.cx)/Lk.rx,ay=(y+0.5-Lk.cy)/Lk.ry,dd=ax*ax+ay*ay+0.06*Math.sin(x*1.3+y),isL=m.g[i]===G_WATER&&!!m.wb&&m.wb[i]===W_LAKE;
    if(((isL&&dd>=1)||(dd<1&&m.g[i]!==G_WATER))&&!painted(m,i)){ok=false;break;}}N.lake=ok?Lk:null;}
  var P=m.pond||(m.w===18&&m.h===21?{cx:3.6,cy:15.6,rx:2.45,ry:1.6}:m.w===30&&m.h===40?{cx:9.6,cy:15.6,rx:2.45,ry:1.6}:null);
  if(P){ok=true;for(y=Math.max(0,Math.floor(P.cy-P.ry-1));y<=Math.min(m.h-1,Math.ceil(P.cy+P.ry+1))&&ok;y++)for(x=Math.max(0,Math.floor(P.cx-P.rx-1));x<=Math.min(m.w-1,Math.ceil(P.cx+P.rx+1));x++){i=y*m.w+x;
    var bx=(x+0.5-P.cx)/P.rx,by=(y+0.5-P.cy)/P.ry,inP=bx*bx+by*by<1,isP=m.g[i]===G_WATER&&(!m.wb||!m.wb[i]||m.wb[i]===W_POND);if(inP!==isP){ok=false;break;}}N.pond=null;}
  return N;}
// 1 natural water, 2 the stream's sand, 0 anything else
function painted(m,i){var P=L.pmask;if(!P||P.length!==m.w*m.h){P=L.pmask=new Uint8Array(m.w*m.h);(LS().edits||[]).forEach(function(e){if(!e.k||e.k.indexOf('g-')!==0)return;for(var y=e.ty;y<e.ty+e.fh;y++)for(var x=e.tx;x<e.tx+e.fw;x++)P[y*m.w+x]=1;});}return P[i];}
function natKind(m,x,y){var N=L.nat;if(!N||x<0||y<0||x>=m.w||y>=m.h)return 0;var i=y*m.w+x,g=m.g[i];if(g===G_SAND)return N.stream&&!painted(m,i)?2:0;if(g!==G_WATER)return 0;var k=m.wb&&m.wb[i];
  if(k===W_STREAM)return N.stream&&!painted(m,i)?1:0;if(k===W_LAKE)return N.lake&&!painted(m,i)?1:0;
  if(N.pond&&(!k||k===W_POND)){var P=N.pond,bx=(x+0.5-P.cx)/P.rx,by=(y+0.5-P.cy)/P.ry;if(bx*bx+by*by<1)return 1;}return 0;}
// how far into natural water a point is (tiles), as a field that is 0.5 at the bank. sc, sw: the stream's middle and width here
function natW(X,Y,sc,sw){var N=L.nat,f=-9,d;if(N.stream){d=sw/2-Math.abs(Y-sc);if(d>f)f=d;}
  if(N.lake){var Lk=N.lake,ax=(X-Lk.cx)/Lk.rx,ay=(Y-Lk.cy)/Lk.ry,gx=ax/Lk.rx,gy=ay/Lk.ry;d=(1-ax*ax-ay*ay-0.06*Math.sin((X-0.5)*1.3+(Y-0.5)))/(2*Math.sqrt(gx*gx+gy*gy)+1e-3);if(d>f)f=d;}
  if(N.pond){var P=N.pond,bx=(X-P.cx)/P.rx,by=(Y-P.cy)/P.ry,hx=bx/P.rx,hy=by/P.ry;d=(1-bx*bx-by*by)/(2*Math.sqrt(hx*hx+hy*hy)+1e-3);if(d>f)f=d;}
  return 0.5+f*NAT_K;}
// grass starts where the stream's sandy bank ends
function natG(Y,sc,sw){return 0.5+(Math.abs(Y-sc)-(sw/2+0.95))*NAT_K;}
var CT_W5=new Float32Array(25),WK_R2=1.3*1.3,CT_GM2=new Float32Array(9);
function water5(m,tx,ty,cls,nat){var k=0,any=false;for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++,k++){var x=clamp(tx+dx,0,m.w-1),y=clamp(ty+dy,0,m.h-1),g2=mget(m,x,y),c2=gClass(g2);if(c2===0)c2=cls;
  var w=c2===3&&!(nat&&natKind(m,x,y)===1)?1:0;CT_W5[k]=w;if(w)any=true;}return any;}
function wfield(lx,ly){var u=(lx+0.5)/64-0.5,v=(ly+0.5)/64-0.5,sw=0,sk=0,k=0;for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++,k++){var ex=u-dx,ey=v-dy,d2=ex*ex+ey*ey;if(d2>=WK_R2)continue;var q=1-d2/WK_R2;q*=q;sk+=q;sw+=q*CT_W5[k];}return sk?sw/sk:0;}
var CT_NK=new Uint8Array(9),CT_WB=new Float32Array(9),CT_GM=new Float32Array(9),CT_SC=new Float32Array(64),CT_SW=new Float32Array(64);
// composeTile reuses one buffer. A grass tile on an edge keeps a mask (L.tmk) of which pixels are its own grass, so regrowth
// and mowing repaint it with a quick copy instead of the whole edge sum
var CT_O=new Uint32Array(4096),CT_W=new Float32Array(9),CT_G=new Float32Array(9),CT_M=new Uint8Array(4096),CT_FW=new Float32Array(76*64);
function composeTile(m,tx,ty){var g=mget(m,tx,ty),o=CT_O,X=tx*T,Y=ty*T,i,lx,ly,cls=gClass(g);
  if(!ART.ready||!TX.grass.length){o.fill(VOID_U);return o;}
  if(cls===0||g===G_STONE){var f=g===G_FLOOR?floorPx:g===G_TILE?balconyPx:g===G_HALL?hallPx:g===G_STONE?stonePx:null;
    for(ly=0;ly<64;ly++)for(lx=0;lx<64;lx++)o[ly*64+lx]=f?f(X+lx,Y+ly):VOID_U;
    if((g===G_FLOOR||g===G_HALL||g===G_TILE)&&mget(m,tx,ty-1)===G_WALL)for(ly=0;ly<6;ly++)for(lx=0;lx<64;lx++)o[ly*64+lx]=darkU(o[ly*64+lx],0.72+ly*0.045);
    if(cls===0)return o;}
  else{o.set(texOf(m,g,tx,ty));
    if(cls===2&&g!==G_STONE){var Sv=CT_GM2,on=null,k2=0;for(var dy0=-1;dy0<=1;dy0++)for(var dx0=-1;dx0<=1;dx0++,k2++){var g3=mgetE(m,tx+dx0,ty+dy0),diff=g3!==g&&(g3===G_SAND||g3===G_DIRT);Sv[k2]=diff?0:1;if(diff&&!on)on=[g3,tx+dx0,ty+dy0];}
      if(on){var oT=texOf(m,on[0],on[1],on[2]);for(ly=0;ly<64;ly++)for(lx=0;lx<64;lx++){var qx2=X+lx,qy2=Y+ly,nz=(vnz(qx2,qy2,22,97)-0.5)*0.9+(vnz(qx2,qy2,7,96)-0.5)*0.35+(hash2(qx2>>1,qy2>>1,98)-0.5)*0.14,fs=bil(Sv,lx,ly)+(g===G_SAND?nz:-nz);
        if(fs<0.5)o[ly*64+lx]=oT[ly*64+lx];else if(fs<0.54&&hash2(qx2,qy2,99)<0.35)o[ly*64+lx]=darkU(o[ly*64+lx],0.9);}}}}
  // the 3x3 around: is it water, is it grass (floors and nothing count as this tile)
  var Wv=CT_W,Gv=CT_G,mixed=false,wn=false,gn=false,en=false,wx=0,wy=0,gg=0,gx=0,gy=0,eg=0,ex=0,ey=0,k=0;
  for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++,k++){var g2=mgetE(m,tx+dx,ty+dy),c2=gClass(g2);if(c2===0){c2=cls;g2=g;}if(c2!==cls)mixed=true;
    Wv[k]=c2===3?1:0;Gv[k]=c2===1?1:0;if(c2===3&&!wn){wn=true;wx=tx+dx;wy=ty+dy;}if(c2===1&&!gn){gn=true;gg=g2;gx=tx+dx;gy=ty+dy;}if(c2===2&&!en){en=true;eg=g2;ex=tx+dx;ey=ty+dy;}}
  if(!mixed)return o;
  var wT=wn?texOf(m,G_WATER,wx,wy):null,gT=cls===1?null:gn?grassTexFor(gg,gx,gy,2).d:null,eT=cls===2?null:en&&eg!==G_STONE?texOf(m,eg,ex,ey):null,eStone=en&&eg===G_STONE;
  // near the stream, the lake or the garden pond the banks come from their shapes
  var nat=false,NS=L.nat;if(NS&&(NS.stream||NS.lake||NS.pond)){k=0;for(dy=-1;dy<=1;dy++)for(dx=-1;dx<=1;dx++,k++){var nk=natKind(m,clamp(tx+dx,0,m.w-1),clamp(ty+dy,0,m.h-1));CT_NK[k]=nk;if(nk)nat=true;}if(nat&&painted(m,mi(m,tx,ty)))nat=false;}
  if(nat){for(k=0;k<9;k++){CT_WB[k]=(Wv[k]&&CT_NK[k]!==1)?1:0;CT_GM[k]=(Gv[k]||CT_NK[k])?1:0;}
    for(lx=0;lx<64;lx++){var xc=(X+lx+0.5)/T;CT_SC[lx]=NS.stream?streamCy(xc):0;CT_SW[lx]=NS.stream?streamW(xc):0;}
    if(!eT&&cls!==2&&NS.stream&&TX.sand.length)eT=TX.sand[Math.floor(hash2(tx,ty,32)*TX.sand.length)].d;}
  // mask codes for a grass tile: 0 fixed colour, 1 its own grass, 2-4 its own grass darkened
  var MK=CT_M,own=cls===1,FW=CT_FW;
  // the water field once per pixel, from 12 rows above the tile (the bank face looks up to 11 px up)
  var w5=wn&&water5(m,tx,ty,cls,nat);
  if(wn)for(ly=-12;ly<64;ly++)for(lx=0;lx<64;lx++){var qx=X+lx,qy=Y+ly,tw=w5?wfield(lx,ly)+(vnz(qx,qy,40,91)-0.5)*0.24:0,bw=nat?Math.max(tw,natW((qx+0.5)/T,(qy+0.5)/T,CT_SC[lx],CT_SW[lx])):tw;
    FW[(ly+12)*64+lx]=bw+(vnz(qx,qy,9,71)-0.5)*0.16+(hash2(qx>>1,qy>>1,73)-0.5)*0.07;}
  for(ly=0;ly<64;ly++)for(lx=0;lx<64;lx++){i=ly*64+lx;var px=X+lx,py=Y+ly;
    var fw=wn?FW[(ly+12)*64+lx]:0;
    if(fw>0.5){var c=wT[i],face=0,FH=8+Math.round(vnz(px,0,11,79)*3);
      if(fw<1.2)for(var q=1;q<=FH;q++){if(FW[(ly-q+12)*64+lx]<=0.5){face=q;break;}}
      if(face){c=face>=FH-1?FL:face>=FH-3?FD:(hash2(px>>1,py,77)<0.2?FB2:FB);}
      else if(fw<0.545){if(hash2(px,py,78)<0.62)c=FO;}else if(fw<0.58){if(hash2(px,py,79)<0.45)c=FO2;}
      o[i]=c;MK[i]=0;continue;}
    var dryW=cls===3&&fw<=0.5;
    var nG=(vnz(px,py,7,31)-0.5)*0.18+(hash2(px>>1,py>>1,57)-0.5)*0.1,fg=gn||cls===1?(nat?Math.min(bil(CT_GM,lx,ly),NS.stream?natG((py+0.5)/T,CT_SC[lx],CT_SW[lx]):9):bil(Gv,lx,ly))+nG:0;
    if(dryW&&gn&&fg<=0.5)fg=0.52+(0.5-fw)*0.4;
    if(fg>0.5){var cg=cls===1?o[i]:(gT?gT[i]:o[i]),mk=own?1:0;
      if(fg<0.555||(wn&&fw>0.44)){var r=hash2(px,py,63);if(r<0.42){cg=K30;mk=0;}else if(r<0.78){cg=GD_;mk=0;}}
      o[i]=cg;MK[i]=mk;}
    else{var fromOwn=own&&!eStone&&!eT,ce=cls===2?o[i]:eStone?stonePx(px,py):(eT?eT[i]:dryW&&gT?gT[i]:o[i]),d1=fg>0.43,d2=wn&&fw>0.42;
      if(d1)ce=darkU(ce,0.88);if(d2)ce=darkU(ce,0.9);o[i]=ce;MK[i]=fromOwn?1+(d1?1:0)+(d2?2:0):0;}}
  if(own&&L.tmk){var ti=mi(m,tx,ty);L.tmk[ti]={c:o.slice(),m:MK.slice()};}
  return o;}
// the quick repaint for a grass tile on an edge: fixed pixels from the mask, its own grass from today's texture
function maskedTile(m,tx,ty,mk){var o=CT_O,b=texOf(m,mget(m,tx,ty),tx,ty),sv=mk.c,md=mk.m;
  for(var i=0;i<4096;i++){var q=md[i];o[i]=q===0?sv[i]:q===1?b[i]:q===2?darkU(b[i],0.88):q===3?darkU(b[i],0.9):darkU(darkU(b[i],0.88),0.9);}return o;}
// tufts of long grass stand up out of the tile; flowers come back in the meadow
var TUFT_C=['#2b7a5a','#4fa83a','#99e550'].map(cu),SEED_C=[cu('#d9a066'),cu('#eec39a')],WFL=['#fbf236','#ffffff','#d77bba','#639bff'].map(cu);
function tuftsInto(o,m,tx,ty){var g=mget(m,tx,ty);if(!isGrass(g))return;var b=bucketOf(m.gh[mi(m,tx,ty)]);if(!b)return;var mead=g===G_MEADOW;
  var n=mead?[0,2,5,7][b]:[0,2,4,6][b],H=mead?[0,7,12,16][b]:[0,5,9,13][b];
  function put(x,y,c){if(x<0||y<0||x>63||y>63)return;o[y*64+x]=c;}
  for(var k=0;k<n;k++){var bx=6+Math.floor(hash2(tx*7+k,ty,101)*52),by=H+4+Math.floor(hash2(tx,ty*5+k,103)*(60-H-4));
    if(g===G_STEP&&Math.abs(bx-32)<20&&Math.abs(by-34)<14)continue;
    var nb=4+Math.floor(hash2(tx+k,ty,105)*3);
    for(var j=0;j<nb;j++){var hh=Math.max(3,Math.round(H*(0.55+0.45*hash2(tx*3+k,ty*3+j,107)))),lean=Math.round((j-(nb-1)/2)*1.4+(hash2(tx+j,ty+k,109)-0.5)*2),x0=bx+j-Math.floor(nb/2);
      for(var s=0;s<hh;s++){var x=x0+Math.round(lean*s/hh),y=by-s;put(x,y,s>hh-3?TUFT_C[2]:(j===0||j===nb-1)?TUFT_C[0]:TUFT_C[1]);}
      if(mead&&b===3&&hash2(tx+j,ty+k,111)<0.35){var sx=x0+lean,sy=by-hh;put(sx,sy,SEED_C[j&1]);put(sx,sy-1,SEED_C[(j+1)&1]);}}
    put(bx-1,by+1,TUFT_C[0]);put(bx,by+1,TUFT_C[0]);put(bx+1,by+1,TUFT_C[0]);}
  if(mead&&b>=2&&hash2(tx,ty,113)<(b===3?0.5:0.2)){var nf=1+Math.floor(hash2(tx,ty,115)*3);for(var f=0;f<nf;f++){var fx=8+Math.floor(hash2(tx,ty*3+f,117)*48),fy=8+Math.floor(hash2(tx*3+f,ty,119)*48),fc=WFL[Math.floor(hash2(tx+f,ty,121)*4)];
    put(fx,fy,fc);put(fx+1,fy,fc);put(fx,fy+1,fc);put(fx+1,fy+1,fc);put(fx,fy+2,TUFT_C[0]);}}}
// stepping stones sit in the grass
function stepStonesInto(o,tx,ty){var n=hash2(tx,ty,7)<0.5?1:2,SL=cu('#cbdbfc'),SM=cu('#9badb7'),SD=cu('#847e87'),SDD=cu('#696a6a'),SH=cu('#37946e');
  for(var s=0;s<n;s++){var cx=n===1?32:(s?42:22),cy=n===1?34:(s?40:26),rx=n===1?14:10,ry=n===1?9:7;cx+=Math.round((hash2(tx,ty,300+s)-0.5)*6);cy+=Math.round((hash2(tx,ty,310+s)-0.5)*6);
    for(var y=cy-ry-1;y<=cy+ry+2;y++)for(var x=cx-rx-1;x<=cx+rx+1;x++){if(x<0||y<0||x>63||y>63)continue;var dx=(x+0.5-cx)/rx,dy=(y+0.5-cy)/ry,dd=dx*dx+dy*dy,dy2=(y-1.5-cy)/ry;
      if(dd<=1){o[y*64+x]=(dx*dx+dy2*dy2>1&&dy>0)?SDD:(dy<-0.55&&dx<0.3)?SL:(dx>0.6||dy>0.6)?SD:SM;}
      else if(dx*dx+((y-2.5-cy)/ry)*((y-2.5-cy)/ry)<=1&&dy>0)o[y*64+x]=SH;}}}
// pebbles on a sandy bank
function pebblesInto(o,tx,ty){var n=Math.floor(hash2(tx,ty,121)*4),A=cu('#9badb7'),B=cu('#847e87');for(var k=0;k<n;k++){var x=4+Math.floor(hash2(tx*3+k,ty,123)*56),y=4+Math.floor(hash2(tx,ty*3+k,125)*56);o[y*64+x]=A;o[y*64+x+1]=A;o[(y+1)*64+x]=B;o[(y+1)*64+x+1]=B;}}

// ----- rooms: the back wall stands up (two tiles of wall face), the side walls are thin caps, the front wall is low -----
// room = {x,y,w,h, back:true, sections:[{x0,x1,k:'stone'|'pale'}], windows:[{x,w,view,feeder}], trellis:{x0,x1}, shelf:{x,w}, door:{x,w,kind}, face}
var STONE_C=['#7d828a','#8f949b','#a3a7ad','#b6babf','#c9ccd0','#6d7279','#dfe1e3','#9a9ea4'];
function stoneWall(pb,x0,x1,y0,y1,seed){pb.rect(x0,y0,x1-x0,y1-y0,'#e6e2da');var y=y0,row=0;
  while(y<y1){var rh=11+Math.floor(hash2(row,1,seed)*6),x=x0-Math.floor(hash2(row,2,seed)*16),k=0;
    while(x<x1){var sw=14+Math.floor(hash2(row,k,seed+3)*20),c=STONE_C[Math.floor(hash2(row,k,seed+5)*STONE_C.length)],cl=lt(c,0.22),cd=dk(c,0.12);
      var sx0=Math.max(x0,x+1),sx1=Math.min(x1,x+sw-1),sy0=y+1,sy1=Math.min(y1,y+rh-1);
      if(sx1-sx0>=3&&sy1-sy0>=3)for(var j=sy0;j<sy1;j++)for(var i=sx0;i<sx1;i++){var ex=i===sx0||i===sx1-1,ey=j===sy0||j===sy1-1;if(ex&&ey)continue;
        pb.set(i,j,(ex||ey)?'#3c3f45':j===sy0+1?cl:j===sy1-2?cd:c);}
      x+=sw;k++;}
    y+=rh;row++;}}
function paleWall(pb,x0,x1,y0,y1,seed){pb.rect(x0,y0,x1-x0,y1-y0,PAL.PALE);for(var i=x0;i<x1;i++){if(hash2(i,seed,3)<0.06){var l=6+Math.floor(hash2(i,seed,4)*16),s=y0+Math.floor(hash2(i,seed,5)*(y1-y0-l));pb.rect(i,s,1,l,'#c6dbec');}}}
function windowInto(pb,wx0,wx1,wy0,wy1,view,seed){pb.rect(wx0,wy0,wx1-wx0,wy1-wy0,'#1b1a1e');var ix0=wx0+3,ix1=wx1-3,iy0=wy0+3,iy1=wy1-3,ih=iy1-iy0,r=mulberry32(seed);
  if(view==='garden'){for(var y=iy0;y<iy1;y++){var t=(y-iy0)/ih;pb.rect(ix0,y,ix1-ix0,1,t<0.25?'#e2f0f8':t<0.5?'#cfe6f5':'#bcdcef');}
    for(var b=0;b<7;b++){var cx=ix0+r()*(ix1-ix0),cy=iy0+ih*(0.55+r()*0.35),rr=10+r()*14,col=['#4b692f','#37946e','#6abe30'][b%3];pb.ell(cx,cy,rr,rr*0.8,col);pb.ell(cx-rr*0.3,cy-rr*0.35,rr*0.45,rr*0.3,lt(col,0.25));}
    pb.rect(ix0,iy1-8,ix1-ix0,8,'#4b692f');for(var fx=ix0+3;fx<ix1;fx+=9)pb.rect(fx,iy1-12,2,10,'#d9a066');pb.rect(ix0,iy1-9,ix1-ix0,2,'#c18e5b');}
  else{var hz=iy0+Math.round(ih*0.5);for(var y2=iy0;y2<iy1;y2++){var c=y2<hz?(y2<iy0+ih*0.18?'#e6f1f8':y2<iy0+ih*0.36?'#d6eaf6':'#c4e1f2'):(y2<hz+3?'#86c3e6':y2<hz+ih*0.2?'#68addb':'#4f98cb');pb.rect(ix0,y2,ix1-ix0,1,c);}
    for(var s=0;s<(ix1-ix0)*ih/90;s++){var sx=ix0+Math.floor(r()*(ix1-ix0-6)),sy=hz+3+Math.floor(r()*(iy1-hz-4));pb.rect(sx,sy,3+Math.floor(r()*5),1,'#a9d6f0');}
    pb.rect(ix0,hz-2,Math.round((ix1-ix0)*0.3),2,'#9badb7');pb.rect(ix0,hz-4,Math.round((ix1-ix0)*0.12),2,'#9badb7');
    var bx=ix0+Math.round((ix1-ix0)*(0.55+r()*0.3)),by=hz+5;pb.rect(bx-3,by,8,2,'#3a2414');pb.poly([[bx,by-7],[bx,by],[bx+5,by]],'#ffffff');pb.rect(bx,by-7,1,7,'#3a2414');
    pb.ell(ix0+(ix1-ix0)*0.25,iy0+ih*0.2,9,3,'#f4f9fc');pb.ell(ix0+(ix1-ix0)*0.3,iy0+ih*0.18,6,3,'#f4f9fc');}
  for(var g=0;g<3;g++){var gx=ix0+Math.round((ix1-ix0)*(0.15+g*0.3));for(var q=0;q<10;q++)pb.set(gx+q,iy0+4+q*2,'#f4f8fc');}
  var panes=Math.max(1,Math.round((ix1-ix0)/58));for(var p=1;p<panes;p++)pb.rect(ix0+Math.round((ix1-ix0)*p/panes)-1,iy0,2,ih,'#1b1a1e');
  pb.rect(wx0-3,wy1,wx1-wx0+6,4,PAL.CREAM);pb.rect(wx0-3,wy1,wx1-wx0+6,1,PAL.INK);pb.rect(wx0-3,wy1+3,wx1-wx0+6,1,PAL.INK);}
var LEAF=['#4aa63e','#3d9134','#5bb84a'],LEAF_HI='#86d06a',LEAF_D='#2a6626';
// pothos leaves: chunky little hearts with a light edge and a dark tip
var LEAF_T=['.XX..','XXXX.','XXXXX','.XXX.','..X..'];
function leafAt(pb,x,y,side,seed){var c=LEAF[Math.floor(hash2(x,y,seed)*3)];for(var j=0;j<LEAF_T.length;j++)for(var i=0;i<5;i++){if(LEAF_T[j].charAt(i)!=='X')continue;var xx=side>0?x+i:x+4-i;pb.set(xx,y+j,(j===0||(j===1&&i===0))?LEAF_HI:(j>=3)?LEAF_D:c);}}
function vine(pb,x,y0,len,seed){for(var s=0;s<len;s++){var x1=x+Math.round(Math.sin((y0+s)*0.2+seed)*1.6);pb.set(x1,y0+s,'#2f6b2a');if(s%6===3){var sd=(s/6|0)%2?1:-1;leafAt(pb,x1+(sd>0?1:-5),y0+s-2,sd,seed+s);}}leafAt(pb,x-2,y0+len-1,1,seed+99);}
function trellisInto(pb,x0,x1,seed){var B='#6b4226',S='#8a5a36',O='#2a1810';pb.rect(x0,8,x1-x0,4,B);pb.rect(x0,22,x1-x0,4,B);pb.rect(x0,8,x1-x0,1,O);pb.rect(x0,25,x1-x0,1,O);pb.rect(x0,12,x1-x0,1,O);pb.rect(x0,22,x1-x0,1,O);
  for(var x=x0+3;x<x1-2;x+=9){pb.rect(x,12,3,10,S);pb.rect(x,12,1,10,O);pb.rect(x+3,12,1,10,O);}
  var r=mulberry32(seed);for(var vx=x0+6;vx<x1-6;vx+=12+Math.floor(r()*12)){var len=14+Math.floor(r()*50);vine(pb,vx,24,len,seed+vx);}
  for(var k=x0+2;k<x1-4;k+=6)if(r()<0.75)leafAt(pb,k,4+Math.floor(r()*6),r()<0.5?1:-1,seed+k);}
var POT_C=['#c8714a','#f1ebdb','#446b7d','#dfe1e3','#c8714a','#f1ebdb'];
function plantShelfInto(pb,x0,x1,sy,seed){var r=mulberry32(seed);
  for(var px=x0+4;px<x1-14;px+=16+Math.floor(r()*8)){var pw=10+Math.floor(r()*4),ph=8+Math.floor(r()*4),pc=POT_C[Math.floor(r()*POT_C.length)],kind=Math.floor(r()*4),top=sy-ph;
    pb.rect(px,top,pw,ph,pc);pb.rect(px,top,pw,1,lt(pc,0.3));pb.rect(px,top+ph-1,pw,1,dk(pc,0.25));pb.rect(px-1,top,1,ph,PAL.INK);pb.rect(px+pw,top,1,ph,PAL.INK);pb.rect(px-1,top-1,pw+2,1,PAL.INK);
    var cx=px+Math.floor(pw/2);
    if(kind===0){for(var l=-1;l<=1;l++){var hh=10+Math.floor(r()*7);pb.rect(cx+l*3-1,top-hh,3,hh,LEAF[1]);pb.set(cx+l*3,top-hh-1,LEAF_HI);pb.rect(cx+l*3+1,top-hh+2,1,hh-3,'#d9e26a');pb.rect(cx+l*3-1,top-hh+1,1,hh-1,LEAF_D);}}
    else if(kind===1){pb.ell(cx+0.5,top-5,7,6,LEAF[0]);pb.ell(cx-1.5,top-7.5,3.5,2.2,LEAF_HI);pb.rect(cx+2,top-2,3,1,LEAF_D);pb.set(cx-4,top-4,LEAF_D);}
    else if(kind===2){pb.ell(cx+0.5,top-3,6,4,'#8fbf8a');pb.ell(cx,top-5,3,2,'#b7dbb0');pb.rect(cx+2,top-2,3,1,'#6f9f6a');}
    else{leafAt(pb,cx-6,top-5,-1,px);leafAt(pb,cx,top-7,1,px+1);leafAt(pb,cx-2,top-10,1,px+2);vine(pb,px+pw,sy+2,12+Math.floor(r()*20),px);}}
  pb.rect(x0,sy,x1-x0,2,'#d9a066');pb.rect(x0,sy+2,x1-x0,3,'#8e4f26');pb.rect(x0,sy-1,x1-x0,1,PAL.INK);pb.rect(x0,sy+5,x1-x0,1,PAL.INK);pb.rect(x0-1,sy-1,1,7,PAL.INK);pb.rect(x1,sy-1,1,7,PAL.INK);
  for(var b=x0+8;b<x1-6;b+=Math.max(30,Math.floor((x1-x0)/3)))pb.rect(b,sy+6,2,5,'#2a2a2e');}
var WALLC={};
function backWallCanvas(r,ri){var key=S.stage+'|'+ri;if(WALLC[key])return WALLC[key];var W=r.w*T,H=2*T,pb=new PB(W,H),seed=STAGE_SEED[S.stage]+ri*31;
  (r.sections||[{x0:r.x,x1:r.x+r.w,k:'pale'}]).forEach(function(s,j){var a=(s.x0-r.x)*T,b=(s.x1-r.x)*T;if(s.k==='stone')stoneWall(pb,a,b,6,118,seed+j);else paleWall(pb,a,b,6,118,seed+j);});
  if(r.trellis)trellisInto(pb,(r.trellis.x0-r.x)*T,(r.trellis.x1-r.x)*T,seed+7);
  (r.windows||[]).forEach(function(w,j){windowInto(pb,(w.x-r.x)*T+6,(w.x-r.x+w.w)*T-6,14,100,w.view,seed+50+j);});
  if(r.shelf)plantShelfInto(pb,(r.shelf.x-r.x)*T+4,(r.shelf.x-r.x+r.shelf.w)*T-4,r.shelf.y||58,seed+9);
  pb.rect(0,0,W,6,PAL.CREAM);pb.rect(0,0,W,1,PAL.INK);pb.rect(0,5,W,1,PAL.INK);
  pb.rect(0,118,W,8,PAL.CREAM);pb.rect(0,118,W,1,PAL.INK);pb.rect(0,126,W,2,'#c9c2b0');
  var c=pb.cv();WALLC[key]=c;return c;}
var CAPC={};
function capCanvas(len,horiz){var key=(horiz?'h':'v')+len;if(CAPC[key])return CAPC[key];var pb=horiz?new PB(len,6):new PB(10,len);if(horiz){pb.rect(0,0,len,6,PAL.CREAM);pb.rect(0,0,len,1,PAL.INK);pb.rect(0,5,len,1,PAL.INK);}else{pb.rect(0,0,10,len,PAL.CREAM);pb.rect(0,0,1,len,PAL.INK);pb.rect(9,0,1,len,PAL.INK);pb.rect(1,0,1,len,'#fbf8f0');pb.rect(8,0,1,len,'#d8d0bd');}return (CAPC[key]=pb.cv());}
// where the room's walls are, in world pixels (for painting and for clipping a repaint). The top cap pokes 2 px above.
function roomBox(r){var top=r.back===false?r.y*T:(r.y-2)*T;return {x0:r.x*T-10,x1:(r.x+r.w)*T+10,y0:top-2,y1:(r.y+r.h)*T};}
function rboxes(m){if(L.rbxM!==m||!L.rbx){L.rbxM=m;L.rbx=(m.rooms||[]).map(roomBox);}return L.rbx;}
function roomHits(b,tx,ty){return !(tx*T>=b.x1||tx*T+T<=b.x0||ty*T>=b.y1+T||ty*T+T<=b.y0);}
function overlaid(m,tx,ty){var bx=rboxes(m),i;for(i=0;i<bx.length;i++)if(roomHits(bx[i],tx,ty))return true;
  var ob=LS().objs||[];for(i=0;i<ob.length;i++){var o=ob[i],d=OBJ[o.k];if(d&&d.flat&&tx>=o.tx&&tx<o.tx+o.fw&&ty>=o.ty&&ty<o.ty+o.fh)return true;}return false;}
// rooms and flat things (rugs, mats, the bridge) go over the ground. cx<0 paints all of them, else only those on tile cx,cy
function paintRooms(x,m,cx,cy){var rs=m.rooms||[],bx=rboxes(m);for(var ri=0;ri<rs.length;ri++){var r=rs[ri];
  if(cx>=0&&!roomHits(bx[ri],cx,cy))continue;
  if(r.back!==false)x.drawImage(backWallCanvas(r,ri),r.x*T,(r.y-2)*T);
  // window light falling on the floor
  var ws=r.windows||[];for(var wi=0;wi<ws.length;wi++){var w=ws[wi],X0=w.x*T+10,X1=(w.x+w.w)*T-10,Y0=r.y*T,Y1=Y0+T*1.9,sk=T*0.6;
    x.beginPath();x.moveTo(X0,Y0);x.lineTo(X1,Y0);x.lineTo(X1+sk,Y1);x.lineTo(X0+sk,Y1);x.closePath();x.fillStyle='rgba(255,236,186,0.17)';x.fill();}
  var capTop=r.back===false?r.y*T:(r.y-2)*T,len=(r.y+r.h)*T-capTop;
  if(r.side!==false){x.drawImage(capCanvas(len,false),r.x*T-10,capTop);x.drawImage(capCanvas(len,false),(r.x+r.w)*T,capTop);}
  if(r.back!==false)x.drawImage(capCanvas(r.w*T+20,true),r.x*T-10,capTop-2);}}
function paintFlats(x,cx,cy){var ob=LS().objs||[];for(var i=0;i<ob.length;i++){var o=ob[i],d=OBJ[o.k];if(!d||!d.flat)continue;
  if(cx>=0&&(cx<o.tx||cx>=o.tx+o.fw||cy<o.ty||cy>=o.ty+o.fh))continue;var sp=objSprite(o);if(!sp)continue;
  x.drawImage(sp.c,Math.round((o.tx+o.fw/2)*T-sp.ax),Math.round((o.ty+o.fh)*T-sp.ay));}}
function bucketKey(m,i){return isGrass(m.g[i])?bucketOf(m.gh[i]):-1;}
var TILE_IMG=null,TILE_U=null;
function paintTileInto(x,m,tx,ty){if(!TILE_IMG){TILE_IMG=x.createImageData(64,64);TILE_U=new Uint32Array(TILE_IMG.data.buffer);}
  var g=mget(m,tx,ty),mk=L.tmk&&L.tmk[mi(m,tx,ty)],o=mk&&isGrass(g)?maskedTile(m,tx,ty,mk):composeTile(m,tx,ty);
  if(isGrass(g))tuftsInto(o,m,tx,ty);if(g===G_STEP)stepStonesInto(o,tx,ty);if(g===G_SAND)pebblesInto(o,tx,ty);TILE_U.set(o);
  // outside the place is notebook paper, with an ink line along the edge, like the frame on her room drawings
  if(g===G_VOID){var K=cu(PAL.K),nb=function(dx,dy){var v=mget(m,tx+dx,ty+dy);return v!==G_VOID&&v!=null;};
    if(nb(0,-1))for(var a=0;a<64*2;a++)TILE_U[a]=K;if(nb(0,1))for(var b2=64*62;b2<64*64;b2++)TILE_U[b2]=K;
    if(nb(-1,0))for(var r=0;r<64;r++){TILE_U[r*64]=K;TILE_U[r*64+1]=K;}if(nb(1,0))for(var r2=0;r2<64;r2++){TILE_U[r2*64+62]=K;TILE_U[r2*64+63]=K;}}
  x.putImageData(TILE_IMG,tx*T,ty*T);}
function renderGround(){var m=M();if(!m)return;var W=m.w*T,H=m.h*T;if(!L.gcv)L.gcv=document.createElement('canvas');if(L.gcv.width!==W||L.gcv.height!==H){L.gcv.width=W;L.gcv.height=H;}
  var x=L.gcv.getContext('2d');x.imageSmoothingEnabled=false;x.setTransform(1,0,0,1,0,0);x.fillStyle=PAL.VOID;x.fillRect(0,0,W,H);
  if(!ART.ready){L.groundOK=false;return;}
  // what's on screen is painted now; the rest of the map follows a little each frame (gbk -2: not painted yet)
  L.nat=natShapes(m);var n=m.g.length;L.tmk=new Array(n);L.rqf=new Uint8Array(n);L.gbk=new Int8Array(n);for(var i=0;i<n;i++){L.rqf[i]=1;L.gbk[i]=-2;}
  L.rqn=n;L.rbx=null;L.groundOK=true;drainRepaint(0);}
function repaintTile(tx,ty){var m=M();if(!L.gcv||!L.groundOK||tx<0||ty<0||tx>=m.w||ty>=m.h)return;var i=mi(m,tx,ty);
  if(L.rqf&&L.rqf[i]){L.rqf[i]=0;L.rqn--;}if(inView((tx+0.5)*T,(ty+0.5)*T,T))L.dirty=true;var x=L.gcv.getContext('2d');paintTileInto(x,m,tx,ty);
  if(overlaid(m,tx,ty)){x.save();x.beginPath();x.rect(tx*T,ty*T,T,T);x.clip();paintRooms(x,m,tx,ty);paintFlats(x,tx,ty);x.restore();}L.gbk[i]=bucketKey(m,i);}
// after a change to the ground itself, the edges around it are worked out again
function repaintAround(tx,ty,fw,fh){var m=M();for(var y=ty-1;y<=ty+(fh||1);y++)for(var x=tx-1;x<=tx+(fw||1);x++){if(L.tmk&&x>=0&&y>=0&&x<m.w&&y<m.h)L.tmk[mi(m,x,y)]=null;repaintTile(x,y);}}
function touchTile(tx,ty,later){var m=M(),i=mi(m,tx,ty);if(!L.gbk||L.gbk[i]===bucketKey(m,i))return;
  if(later&&L.rqf){if(!L.rqf[i]){L.rqf[i]=1;L.rqn++;}return;}repaintTile(tx,ty);}
// regrowth (and a fresh map) is painted a little at a time within a couple of ms a frame: what's on screen first,
// then a margin round it, then the rest. Tiles on screen that were never painted are done at once.
var RQ_CUR=0;
function drainRepaint(ms){var f=L.rqf,m=M();if(!f||L.rqn<=0||!m||f.length!==m.g.length)return;var t0=performance.now(),w=m.w,gb=L.gbk,x,y,i;
  var x0=Math.max(0,Math.floor(L.cam.x/T)),y0=Math.max(0,Math.floor(L.cam.y/T)),x1=Math.min(w-1,Math.floor((L.cam.x+L.VW-1)/T)),y1=Math.min(m.h-1,Math.floor((L.cam.y+L.VH-1)/T));
  for(y=y0;y<=y1;y++)for(x=x0;x<=x1;x++){i=y*w+x;if(f[i]&&gb[i]===-2)repaintTile(x,y);}
  for(var pad=0;pad<=3;pad+=3){var a0=Math.max(0,x0-pad),b0=Math.max(0,y0-pad),a1=Math.min(w-1,x1+pad),b1=Math.min(m.h-1,y1+pad);
    for(y=b0;y<=b1;y++)for(x=a0;x<=a1;x++){i=y*w+x;if(f[i]){repaintTile(x,y);if(performance.now()-t0>ms)return;}}}
  var n=f.length;for(var k=0;k<n&&L.rqn>0;k++){i=RQ_CUR;RQ_CUR=(RQ_CUR+1)%n;if(f[i]){repaintTile(i%w,(i/w)|0);if(performance.now()-t0>ms)return;}}
  if(L.rqn<0)L.rqn=0;}

// ----- objects -----
// k: kind, tx/ty: footprint top-left tile, fw/fh: footprint size, built: placed by the player (can be taken away)
var OBJ={};   // kind -> {fw,fh,flat,solid,walk,spr(o),live(x,o,t),hit(o),use,name,keyOf(o)}
function defObj(k,d){OBJ[k]=d;d.fw=d.fw||1;d.fh=d.fh||1;if(d.solid==null)d.solid=!d.flat;}
function LS(){return S.land;}
function mkObj(k,tx,ty,o){var d=OBJ[k]||{},l=LS(),r={id:'o'+(l.oid=(l.oid||0)+1),k:k,tx:tx,ty:ty,fw:d.fw||1,fh:d.fh||1,seed:Math.floor(hash2(tx,ty,k.length*31)*1e6)};for(var p in o||{})r[p]=o[p];return r;}
function objVer(o){return o.k==='tank'?(S.tanks[o.i]?1:0):o.k==='feeder'?Math.round((o.s||0)*5):0;}
function objSprite(o){var d=OBJ[o.k];if(!d||!d.spr)return null;var c=OC[o.id],v=objVer(o);if(c&&c.g===SPR_GEN&&c.v===v)return c.s;
  var key=o.k+'|'+(d.keyOf?d.keyOf(o):((o.v==null?'':o.v)+'|'+o.fw+'x'+o.fh+'|'+(o.seed%7))),sp=spr(key,function(){return d.spr(o);});OC[o.id]={s:sp,v:v,g:SPR_GEN};return sp;}

// ----- the four homes, in tiles -----
// water bodies are remembered per tile: 1 pond (yours), 2 stream, 3 lake, 4 sea
var W_POND=1,W_STREAM=2,W_LAKE=3,W_SEA=4;
function setWater(m,x,y,kind){if(x<0||y<0||x>=m.w||y>=m.h)return;mset(m,x,y,G_WATER,0);(m.wb||(m.wb=[]))[mi(m,x,y)]=kind;}
function waterKind(tx,ty){var m=M();if(mget(m,tx,ty)!==G_WATER)return 0;return (m.wb&&m.wb[mi(m,tx,ty)])||W_POND;}
// tanks in the house: x, y, width (relative to the garden block)
var HOUSE_SLOTS=[[5,3,2],[7,3,2],[9,3,2],[12,7,1],[2,7,1],[2,5,1]];
function flatRoom(m,o,n){
  mfill(m,1,0,9,1,G_WALL);mfill(m,1,2,9,10,G_FLOOR);
  var room={x:1,y:2,w:9,h:9,sections:[{x0:1,x1:6,k:'stone'},{x0:6,x1:10,k:'pale'}],trellis:{x0:1,x1:6},shelf:{x:1,w:4,y:46},windows:[{x:6,w:3,view:'sea',feeder:1}],face:'pale',
    door:n===0?{x:2,w:2,kind:'door'}:{x:4,w:3,kind:'slide'}};
  m.rooms.push(room);
  o.push(mkObj('tank',1,2,{fw:2,i:0}));o.push(mkObj('tank',3,2,{fw:2,i:1}));
  if(n===1)o.push(mkObj('tank',5,2,{fw:1,i:2,v:'nano'}));else o.push(mkObj('lamp',5,2));
  o.push(mkObj('wfeeder',7,2,{s:0.6}));
  o.push(mkObj('tallplant',9,2));
  o.push(mkObj('sofa',2,5));
  o.push(mkObj('rug',1,6,{fw:5,fh:3}));
  o.push(mkObj('lowtable',2,7));
  o.push(mkObj('armchair',7,6,{gm:1}));
  o.push(mkObj('sidetable',8,6));
  o.push(mkObj('guitar',9,5));
  o.push(mkObj('bookshelf',9,8));
  if(n===0){mfill(m,1,11,4,12,G_HALL);m.rooms.push({x:1,y:11,w:4,h:2,back:false,face:'pale',entry:1});o.push(mkObj('mat',2,10,{fw:2}));}
  else{o.push(mkObj('lamp',5,4));
    // the balcony flat is another flat: the same things, the room the other way round (stone wall and tanks
    // on the right, the window on the left), so moving feels like moving
    var mx=function(x,w){return 11-x-w;};room.sections=[{x0:1,x1:5,k:'pale'},{x0:5,x1:10,k:'stone'}];room.trellis={x0:5,x1:10};room.shelf={x:mx(1,4),w:4,y:46};
    room.windows=[{x:mx(6,3),w:3,view:'sea',feeder:1}];room.door={x:mx(4,3),w:3,kind:'slide'};
    o.forEach(function(ob){if(ob.ty>=2&&ob.ty<=10)ob.tx=mx(ob.tx,ob.fw||1);});}}
function genGarden(m,o,ox,oy,nTanks,land){
  mfill(m,ox,oy,ox+17,oy+20,G_GRASS,0.55);
  // the house
  mfill(m,ox+2,oy+1,ox+12,oy+2,G_WALL);mfill(m,ox+2,oy+3,ox+12,oy+8,G_FLOOR);
  m.rooms.push({x:ox+2,y:oy+3,w:11,h:6,sections:[{x0:ox+2,x1:ox+5,k:'pale'},{x0:ox+5,x1:ox+11,k:'stone'},{x0:ox+11,x1:ox+13,k:'pale'}],trellis:{x0:ox+5,x1:ox+11},shelf:{x:ox+5,w:6,y:44},
    windows:[{x:ox+2,w:2,view:'garden'},{x:ox+11,w:2,view:'garden'}],door:{x:ox+7,w:2,kind:'door'},face:'plaster'});
  for(var i=0;i<nTanks;i++){var s=HOUSE_SLOTS[i];o.push(mkObj('tank',ox+s[0],oy+s[1],{fw:s[2],i:i,v:s[2]===1?'nano':''}));}
  o.push(mkObj('guitar',ox+4,oy+3));o.push(mkObj('tallplant',ox+12,oy+3));
  o.push(mkObj('sofa',ox+5,oy+5));o.push(mkObj('rug',ox+4,oy+6,{fw:5,fh:2}));o.push(mkObj('lowtable',ox+5,oy+6));
  o.push(mkObj('armchair',ox+10,oy+6,{gm:1}));o.push(mkObj('sidetable',ox+11,oy+6));o.push(mkObj('lamp',ox+11,oy+5));o.push(mkObj('bookshelf',ox+12,oy+5));
  o.push(mkObj('mat',ox+7,oy+8,{fw:2}));
  // patio, beds along the house, the path
  mfill(m,ox+6,oy+9,ox+9,oy+10,G_STONE);
  [2,3,4,5,10,11,12].forEach(function(x,j){o.push(mkObj('flowers',ox+x,oy+9,{v:j%4}));});
  for(var y=oy+11;y<=oy+19;y++){mset(m,ox+7,y,G_STEP,0.4);mset(m,ox+8,y,G_STEP,0.4);}
  // hedge at the back, the side garden
  mfill(m,ox,oy,ox+17,oy,G_DIRT,0);for(var hx=0;hx<18;hx++)o.push(mkObj('bush',ox+hx,oy,{v:hx%3,hedge:1}));

  o.push(mkObj('olive',ox+15,oy+7,{fw:2}));
  o.push(mkObj('oak',ox+1,oy+11));
  // coop with a scratched yard, feeder, pond, bench, a second big tree
  o.push(mkObj('coop',ox+13,oy+11,{fw:3,fh:2}));mfill(m,ox+12,oy+13,ox+16,oy+14,G_DIRT);
  o.push(mkObj('feeder',ox+10,oy+14,{s:0.7}));
  m.pond={cx:ox+3.6,cy:oy+15.6,rx:2.45,ry:1.6};
  for(var py=oy+13;py<=oy+18;py++)for(var px=ox;px<=ox+6;px++){var dx=(px+0.5-m.pond.cx)/m.pond.rx,dy=(py+0.5-m.pond.cy)/m.pond.ry;if(dx*dx+dy*dy<1)setWater(m,px,py,W_POND);}
  o.push(mkObj('bench',ox+10,oy+18,{fw:2}));
  o.push(mkObj('olive',ox+15,oy+18,{fw:2}));
  bankThings(m,o,ox+1,oy+13,ox+6,oy+18);
  // fence round the garden, the gate on the path
  for(var fy=oy+1;fy<=oy+20;fy++){o.push(mkObj('fence',ox,fy));o.push(mkObj('fence',ox+17,fy));}
  for(var fx=ox+1;fx<=ox+16;fx++){if(fx===ox+7||fx===ox+8)continue;o.push(mkObj('fence',fx,oy+20));}
  if(!land){o.push(mkObj('gate',ox+7,oy+20,{fw:2}));}
  m.henArea={x0:ox+1,y0:oy+10,x1:ox+16,y1:oy+19};}
// reeds and stones on the grass round a pond (they don't block)
function bankThings(m,o,x0,y0,x1,y1){var r=mulberry32(m.seed*7+x0),n=0;for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++){if(!isGrass(mget(m,x,y)))continue;var near=false;
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){if(mget(m,x+d[0],y+d[1])===G_WATER)near=true;});if(!near||objAtTileIn(o,x,y))continue;
  if(r()<0.42){o.push(mkObj(r()<0.6?'reeds':'rock',x,y,{v:n++%3,deco:1,ox:Math.round((r()-0.5)*26),oy:Math.round((r()-0.3)*20)}));}}}
function objAtTileIn(o,tx,ty){return o.some(function(p){return tx>=p.tx&&tx<p.tx+(p.fw||1)&&ty>=p.ty&&ty<p.ty+(p.fh||1);});}
function streamCy(x){return 30.0+1.3*Math.sin(0.15*x+0.5)+0.35*Math.sin(0.41*x+1.7);}
function streamW(x){return 2.5+0.4*Math.sin(0.27*x+2.0);}
function genStage(n){var m,o=[];
  if(n===0){m=newMap(11,13,STAGE_SEED[0]);flatRoom(m,o,0);m.start=[6,4];}
  else if(n===1){m=newMap(11,19,STAGE_SEED[1]);flatRoom(m,o,1);
    mfill(m,1,11,9,14,G_TILE);m.balcony={x:1,y:11,w:9,h:4};
    mfill(m,0,15,10,15,G_SAND);for(var sy=16;sy<19;sy++)for(var sx=0;sx<11;sx++)setWater(m,sx,sy,W_SEA);m.backdrop='sea';m.seaRow=16;
    o.push(mkObj('herbs',1,11,{v:0}));o.push(mkObj('herbs',2,11,{v:1}));o.push(mkObj('pot',9,11,{v:1}));o.push(mkObj('bchair',5,13));o.push(mkObj('feeder',8,13,{s:0.6,v:'hang'}));
    o.push(mkObj('palm',0,15,{deco:1}));o.push(mkObj('palm',10,15,{deco:1,v:1}));m.start=[6,4];}
  else if(n===2){m=newMap(18,21,STAGE_SEED[2]);genGarden(m,o,0,0,5,false);m.start=[7,10];}
  else{m=newMap(30,40,STAGE_SEED[3]);var rr=mulberry32(STAGE_SEED[3]);
    mfill(m,0,0,29,39,G_MEADOW,1);genGarden(m,o,6,0,6,true);
    for(var py=21;py<40;py++){mset(m,13,py,G_GRASS,0.1);mset(m,14,py,G_GRASS,0.1);}
    // the stream, left to right, with sandy banks
    m.stream=true;
    for(var x=0;x<30;x++){var c=streamCy(x+0.5),w=streamW(x+0.5);for(var y=22;y<40;y++){var d=Math.abs(y+0.5-c);if(d<w/2)setWater(m,x,y,W_STREAM);else if(d<w/2+0.95)mset(m,x,y,G_SAND,0);}}
    // the lake
    m.lake={cx:23.4,cy:35.6,rx:4.9,ry:2.7};
    for(var ly=31;ly<40;ly++)for(var lx=16;lx<30;lx++){var ddx=(lx+0.5-m.lake.cx)/m.lake.rx,ddy=(ly+0.5-m.lake.cy)/m.lake.ry,dd=ddx*ddx+ddy*ddy+0.06*Math.sin(lx*1.3+ly);if(dd<1&&mget(m,lx,ly)!==G_WATER)setWater(m,lx,ly,W_LAKE);}
    // a bridge where the path meets the stream
    var by0=99,by1=-1;for(var y2=21;y2<40;y2++){if(mget(m,13,y2)===G_WATER||mget(m,14,y2)===G_WATER){by0=Math.min(by0,y2);by1=Math.max(by1,y2);}}
    if(by1>=by0)o.push(mkObj('bridge',13,by0,{fw:2,fh:by1-by0+1}));
    for(var y3=by0;y3<=by1;y3++){if(mget(m,13,y3)!==G_WATER)mset(m,13,y3,G_SAND,0);if(mget(m,14,y3)!==G_WATER)mset(m,14,y3,G_SAND,0);}
    // trees: a wood bottom left, a few round the garden and the lake
    var taken={};function free(tx,ty,fw,fh){for(var yy=ty;yy<ty+fh;yy++)for(var xx=tx;xx<tx+fw;xx++){var g=mget(m,xx,yy);if(g!==G_MEADOW||taken[xx+','+yy])return false;}return true;}
    function take(tx,ty,fw,fh,pad){for(var yy=ty-pad;yy<ty+fh+pad;yy++)for(var xx=tx-pad;xx<tx+fw+pad;xx++)taken[xx+','+yy]=1;}
    for(var yy=0;yy<40;yy++){taken['12,'+yy]=1;taken['13,'+yy]=1;taken['14,'+yy]=1;taken['15,'+yy]=1;}
    [[1,3],[2,9],[0,16],[26,3],[27,10],[25,17],[3,23],[24,22],[9,24]].forEach(function(p,j){if(free(p[0],p[1],2,1)){o.push(mkObj('olive',p[0],p[1],{fw:2}));take(p[0],p[1],2,1,2);}});
    for(var k=0;k<90;k++){var tx,ty;if(k<50){tx=Math.floor(rr()*11);ty=33+Math.floor(rr()*7);}else if(k<70){tx=Math.floor(rr()*6)+(rr()<0.5?0:24);ty=Math.floor(rr()*21);}else{tx=Math.floor(rr()*30);ty=21+Math.floor(rr()*19);}
      if(free(tx,ty,1,1)){o.push(mkObj('oak',tx,ty,{v:Math.floor(rr()*3)}));take(tx,ty,1,1,k<50?0:1);}}
    // rocks on the banks, reeds by the lake
    for(var q=0;q<60;q++){var rx=Math.floor(rr()*30),ry=22+Math.floor(rr()*18);if(mget(m,rx,ry)===G_SAND&&!taken[rx+','+ry]&&!(rx>=12&&rx<=15)){o.push(mkObj('rock',rx,ry,{v:q%3,deco:1,ox:Math.round((rr()-0.5)*20)}));taken[rx+','+ry]=1;}}
    bankThings(m,o,16,31,29,39);
    m.wildArea={x0:0,y0:21,x1:29,y1:27};m.start=[13,10];}
  return {map:m,objs:o};}

// ----- object sprites: pixel art at art size, dark outlines on furniture (her rooms), none on plants and stones -----
var INKc='#090609';
function ink(pb){return pb.outline(INKc);}
// where an object stands: x is the middle of its footprint, base is the line its feet sit on
function oX(o){return (o.tx+o.fw/2)*T+(o.ox||0);}
function oBase(o){var d=OBJ[o.k]||{};return (o.ty+o.fh-1)*T+(o.base!=null?o.base:d.base!=null?d.base:58)+(o.oy||0);}
// -- tank on a black cabinet. Shrimp inside are drawn live
function tankPB(fw,have,nano){var W=fw*64,pw=nano?52:116,ch=nano?32:38,th=nano?40:52,H=ch+th+6,pb=new PB(W,H+2),cx=W/2,x0=Math.round(cx-pw/2);
  // cabinet
  var cw=pw+4,cx0=Math.round(cx-cw/2),cy0=H-ch;pb.rect(cx0,cy0,cw,ch,'#1b1a1e');pb.rect(cx0,cy0,cw,2,'#3c3b44');
  var nd=nano?1:2;for(var d=0;d<nd;d++){var dw=Math.floor((cw-6-(nd-1)*2)/nd),dx=cx0+3+d*(dw+2);pb.rect(dx,cy0+5,dw,ch-9,'#232229');pb.rect(dx,cy0+5,dw,1,'#3a3940');pb.rect(dx,cy0+5,1,ch-9,'#3a3940');pb.rect(dx+(d===0&&nd===2?dw-4:3),cy0+ch/2,2,5,'#8a8a92');}
  pb.rect(cx0+2,H-2,4,2,'#101014');pb.rect(cx0+cw-6,H-2,4,2,'#101014');
  // tank
  var ty0=cy0-th;
  if(!have){for(var q=0;q<pw;q+=4){pb.rect(x0+q,ty0,2,1,'#5b5a62');pb.rect(x0+q,cy0-1,2,1,'#5b5a62');}for(var q2=0;q2<th;q2+=4){pb.rect(x0,ty0+q2,1,2,'#5b5a62');pb.rect(x0+pw-1,ty0+q2,1,2,'#5b5a62');}
    pb.rect(cx-5,ty0+th/2-1,10,2,'#5b5a62');pb.rect(cx-1,ty0+th/2-5,2,10,'#5b5a62');ink(pb);return {pb:pb,glass:null,H:H};}
  for(var y=ty0+3;y<cy0;y++){var t=(y-ty0)/th;pb.rect(x0,y,pw,1,t<0.2?'#a6dde6':t<0.55?'#82cddb':'#69bccc');}
  pb.rect(x0,cy0-7,pw,7,'#d9c08a');pb.rect(x0,cy0-7,pw,1,'#e8d3a2');for(var s=0;s<pw;s+=3)if(hash2(s,fw,3)<0.5)pb.set(x0+s,cy0-3-Math.floor(hash2(s,1,fw)*3),'#a98c5c');
  var r=mulberry32(fw*91+(nano?7:3));
  for(var p=0;p<(nano?3:6);p++){var px=x0+4+Math.floor(r()*(pw-8)),ph=8+Math.floor(r()*(th-18)),col=['#4aa63e','#37946e','#6abe30'][p%3];for(var k=0;k<ph;k++){var xx=px+Math.round(Math.sin(k*0.35+p)*1.3);pb.set(xx,cy0-7-k,col);if(k%3===1){pb.set(xx-1,cy0-7-k,col);pb.set(xx+1,cy0-8-k,lt(col,0.2));}}}
  if(!nano){pb.line(x0+16,cy0-7,x0+40,cy0-15,'#6b4226');pb.line(x0+17,cy0-7,x0+41,cy0-15,'#6b4226');pb.line(x0+40,cy0-15,x0+50,cy0-23,'#6b4226');pb.ell(x0+44,cy0-20,7,3,'#3d9134');pb.ell(x0+30,cy0-12,6,2.5,'#2f7a3a');}
  pb.ell(x0+pw-14,cy0-9,6,3,'#8a8f96');pb.ell(x0+pw-16,cy0-10,3,1.5,'#b6babf');
  for(var g=0;g<14;g++)pb.set(x0+pw*0.62+g*0.4,ty0+5+g*2.2,'#d8f1f5');
  pb.rect(x0,ty0,pw,3,'#1b1a1e');pb.rect(x0,ty0+3,2,th-3,'#1b1a1e');pb.rect(x0+pw-2,ty0+3,2,th-3,'#1b1a1e');pb.rect(x0+2,ty0+3,1,th-3,'#cfe8ee');pb.rect(x0+pw-3,ty0+3,1,th-3,'#cfe8ee');pb.rect(x0,cy0-2,pw,2,'#1b1a1e');
  ink(pb);return {pb:pb,glass:{x:x0+1,y:ty0+3,w:pw-2,h:th-10},H:H};}
defObj('tank',{fw:2,base:30,name:'Tank',keyOf:function(o){return o.fw+'|'+(o.v||'')+'|'+(S.tanks[o.i]?1:0);},
  spr:function(o){var t=tankPB(o.fw,!!S.tanks[o.i],o.v==='nano'),s=mk(t.pb,o.fw*32,t.H);s.glass=t.glass;return s;},
  live:function(x,o,t){var s=objSprite(o),tk=S.tanks[o.i];if(!s||!s.glass||!tk)return;var g=s.glass,X=oX(o)-s.ax+g.x,Y=oBase(o)-s.ay+g.y,list=tk.shrimp||[],n=Math.min(list.length,o.v==='nano'?6:12);
    for(var j=0;j<n;j++){var ind=list[j],col='#c83c2c';try{if(typeof shrimpRGB==='function')col=shrimpRGB(ind);}catch(e){}
      var ph=hash2(j,o.i,3)*6.28,sx=X+2+Math.round((Math.sin(t*0.22+ph)*0.5+0.5)*(g.w-6)),sy=Y+g.h-3-((j*3)%4)-(hash2(j,1,o.i)<0.25?Math.round(g.h*0.4):0);
      wrect(x,sx,sy,3,1,col);wrect(x,sx+(Math.sin(t*0.22+ph+0.3)>Math.sin(t*0.22+ph)?3:-1),sy,1,1,col);}
    for(var b=0;b<3;b++){var by=Y+g.h-2-((t*14+b*9)%(g.h-2));wrect(x,X+g.w-4,Math.round(by),1,1,'#e8f8fb');}
    var dirt=typeof mulmMean==='function'?Math.max(clamp((mulmMean(tk)-0.3)/0.6,0,1),clamp((0.6-tk.flow)/0.5,0,1)):0;
    if(dirt>0.05){x.save();x.globalAlpha=0.45*dirt;wrect(x,X,Y,g.w,g.h,'#6e5230');x.restore();}
    if(typeof needs==='function'&&S.opt.toys==='need'&&needs(tk).length&&Math.floor(L.rt*2)%2===0){var cx=X+Math.round(g.w/2);wrect(x,cx-1,Y-24,3,8,'#fbf236');wrect(x,cx-1,Y-14,3,3,'#fbf236');wrect(x,cx-2,Y-25,5,1,INKc);}},
  hit:function(o){return [o.tx*T+2,oBase(o)-96,o.fw*T-4,100];},use:{side:'s'}});
// -- black arc floor lamp (her living room)
defObj('lamp',{base:40,name:'Lamp',spr:function(o){var pb=new PB(64,124),bx=20;pb.ell(bx,120,9,3,'#1b1a1e');pb.rect(bx-1,22,3,98,'#1b1a1e');
  for(var a=0;a<=20;a++){var ang=Math.PI*(1-a/20),xx=bx+Math.round(18-Math.cos(ang)*18),yy=22-Math.round(Math.sin(ang)*14);pb.rect(xx,yy,3,3,'#1b1a1e');}
  pb.poly([[38,22],[50,22],[56,36],[32,36]],'#1b1a1e');pb.rect(41,36,6,3,'#ffe28a');pb.set(44,39,'#fff2b8');pb.rect(36,24,3,6,'#3c3b44');ink(pb);return mk(pb,bx,120);}});
// -- tall snake plant in a blue pot
defObj('tallplant',{base:40,name:'Plant',spr:function(o){var pb=new PB(48,112),r=mulberry32(5);
  for(var l=0;l<7;l++){var bx=14+l*3+Math.floor(r()*2),h=46+Math.floor(r()*34),lean=(l-3)*1.6,w=4;for(var s=0;s<h;s++){var xx=Math.round(bx+lean*s/h),ww=s>h-8?Math.max(1,Math.round(w*(h-s)/8)):w;pb.rect(xx,78-s,ww,1,l%2?'#3d9134':PAL.PLANT);pb.set(xx,78-s,'#d9e26a');if(ww>2)pb.set(xx+ww-1,78-s,'#2f6b2a');if(s%7===3&&ww>2)pb.set(xx+1,78-s,'#2f6b2a');}}
  pb.rect(10,76,28,32,PAL.CAB);pb.rect(10,76,28,3,'#5b86a0');pb.rect(10,104,28,4,'#2f4d5c');pb.rect(12,80,3,22,'#5b86a0');pb.rect(33,80,2,24,'#36586a');pb.rect(8,74,32,3,'#5b86a0');
  ink(pb);return mk(pb,24,108);}});
// -- cream sofa with sage, blue and grey cushions
defObj('sofa',{fw:3,base:52,name:'Sofa',spr:function(o){var W=192,pb=new PB(W,74),CR=PAL.CREAM,CS='#ddd3bd',CD='#c8bda5';
  pb.rect(10,8,W-20,34,CR);pb.rect(10,8,W-20,3,'#fbf8f0');pb.rect(10,36,W-20,6,CS);
  pb.rect(4,26,W-8,34,CR);pb.rect(4,52,W-8,8,CS);pb.rect(4,58,W-8,2,CD);
  for(var s=1;s<3;s++)pb.rect(4+Math.round((W-8)*s/3),28,1,24,CD);
  pb.rect(0,18,18,44,CR);pb.rect(W-18,18,18,44,CR);pb.rect(0,18,18,3,'#fbf8f0');pb.rect(W-18,18,18,3,'#fbf8f0');pb.rect(14,22,4,38,CS);pb.rect(W-18,22,4,38,CS);
  pb.rect(8,62,6,8,'#5a3a22');pb.rect(W-14,62,6,8,'#5a3a22');pb.rect(W/2-3,62,6,6,'#5a3a22');
  var cush=[['#a9bf9a','#c3d5b6','#8aa37c'],['#7f9fb5','#9db8cb','#647f95'],['#a9bf9a','#c3d5b6','#8aa37c'],['#9aa0a6','#b7bcc1','#7d8389']];
  cush.forEach(function(c,i){var x=26+i*36+(i%2),y=12+(i%2?1:0);pb.rect(x,y,30,24,c[0]);pb.rect(x+1,y+1,28,3,c[1]);pb.rect(x+1,y+20,28,3,c[2]);pb.set(x,y,0);pb.set(x+29,y,0);pb.set(x,y+23,0);pb.set(x+29,y+23,0);pb.rect(x+14,y+8,2,8,c[2]);});
  var b=new PB(W,74);b.d.set(pb.d);ink(b);
  // the cushions get their own outline inside the sofa
  cush.forEach(function(c,i){var x=26+i*36+(i%2),y=12+(i%2?1:0);for(var q=1;q<29;q++){b.set(x+q,y-1,INKc);b.set(x+q,y+24,INKc);}for(var q2=1;q2<23;q2++){b.set(x-1,y+q2,INKc);b.set(x+30,y+q2,INKc);}});
  var sp=mk(b,W/2,70);sp.seat={x:-40,y:-32};return sp;}});
// -- pale shaggy rug (flat)
defObj('rug',{flat:true,fw:5,fh:3,name:'Rug',spr:function(o){var W=o.fw*64,H=o.fh*64,pb=new PB(W,H),r=mulberry32(o.seed||9),m=10;
  for(var y=m;y<H-m;y++)for(var x=m;x<W-m;x++){var e=Math.min(x-m,W-m-1-x,y-m,H-m-1-y);if(e<2&&hash2(x,y,5)<0.35)continue;pb.set(x,y,hash2(x>>1,y,7)<0.12?'#f6f2ea':hash2(x,y>>1,8)<0.1?'#dcd5c5':'#ebe6da');}
  for(var x2=m+8;x2<W-m-8;x2++){pb.set(x2,m+7,'#d7cfbd');pb.set(x2,H-m-8,'#d7cfbd');}for(var y2=m+8;y2<H-m-7;y2++){pb.set(m+7,y2,'#d7cfbd');pb.set(W-m-8,y2,'#d7cfbd');}
  ink(pb);return mk(pb,W/2,H);}});
// -- low oval wooden table
defObj('lowtable',{fw:2,base:50,name:'Table',spr:function(o){var pb=new PB(128,40);pb.rect(18,22,4,14,'#6b4226');pb.rect(106,22,4,14,'#6b4226');pb.rect(30,24,3,10,'#5a3a22');pb.rect(95,24,3,10,'#5a3a22');
  pb.ell(64,16,56,11,'#8e4f26');pb.ell(64,13,56,11,'#c68450');for(var g=0;g<5;g++)pb.rect(24+g*17,9+(g%3)*3,12,1,'#b0703f');pb.ell(52,9,22,3,'#d9a066');
  pb.rect(78,6,10,7,'#f1ebdb');pb.rect(80,5,6,1,'#f1ebdb');pb.rect(88,8,2,3,'#f1ebdb');pb.rect(79,7,8,2,'#8e4f26');pb.rect(38,10,16,4,'#446b7d');pb.rect(38,10,16,1,'#5b86a0');
  ink(pb);return mk(pb,64,36);}});
// -- coral armchair (from her bookroom) with a cream throw
defObj('armchair',{base:50,name:'Armchair',spr:function(o){var pb=new PB(88,80),C1=PAL.CORAL,C2='#ecae9f',C3='#b8695a',C4='#9a5548',CT='#cf7d6b';
  pb.rect(12,4,64,40,C1);pb.rect(12,4,64,3,C2);pb.rect(12,40,64,4,C3);
  pb.rect(6,36,76,30,C1);pb.rect(14,40,60,14,'#e39a88');pb.rect(14,40,60,2,C2);pb.rect(6,60,76,6,C3);pb.rect(6,65,76,2,C4);
  pb.rect(0,22,16,46,C1);pb.rect(72,22,16,46,C1);pb.rect(0,22,16,3,C2);pb.rect(72,22,16,3,C2);pb.rect(12,26,4,40,C4);pb.rect(72,26,4,40,C4);
  for(var k=0;k<60;k++){var x=2+Math.floor(hash2(k,1,9)*84),y=6+Math.floor(hash2(k,2,9)*58);if(pb.get(x,y)===cu(C1)){pb.set(x,y,CT);pb.set(x+1,y+1,CT);}}
  pb.rect(8,68,6,8,'#5a3a22');pb.rect(74,68,6,8,'#5a3a22');
  pb.rect(66,18,18,36,PAL.CREAM);pb.rect(66,18,18,2,'#fbf8f0');for(var f=0;f<6;f++)pb.rect(67+f*3,54,1,5,PAL.CREAM);pb.rect(81,20,3,34,'#ddd3bd');for(var q=0;q<4;q++)pb.rect(68,24+q*8,12,1,'#e4dccb');
  ink(pb);var s=mk(pb,44,76);s.seat={x:0,y:-30};return s;},
  hit:function(o){return [o.tx*T-10,oBase(o)-96,T+20,100];},use:{side:'s'}});
defObj('sidetable',{base:46,name:'Side table',spr:function(o){var pb=new PB(40,46);pb.ell(20,12,15,5,'#8e4f26');pb.ell(20,10,15,5,'#c68450');pb.rect(18,14,4,26,'#6b4226');pb.ell(20,42,9,3,'#6b4226');
  pb.rect(15,3,8,6,'#f1ebdb');pb.rect(23,5,2,3,'#f1ebdb');pb.rect(16,4,6,1,PAL.CORAL);pb.rect(14,8,10,1,'#ddd3bd');ink(pb);return mk(pb,20,44);}});
// -- guitar leaning on the wall
defObj('guitar',{base:36,name:'Guitar',spr:function(o){var pb=new PB(36,96);pb.rect(15,6,5,8,'#5a3a22');pb.rect(16,14,3,40,'#6b4226');for(var f=0;f<6;f++)pb.rect(16,18+f*6,3,1,'#c9ccd0');
  pb.ell(18,62,9,8,'#c8813f');pb.ell(18,80,13,11,'#c8813f');pb.ell(15,78,5,5,'#d99a5a');pb.ell(18,64,3.2,3.2,'#2a1810');pb.rect(12,84,12,2,'#5a3a22');pb.rect(17,52,1,34,'#e8e2d0');pb.rect(19,52,1,34,'#e8e2d0');
  pb.shade('#c8813f',null,'#9a5f2c',1,true);ink(pb);return mk(pb,18,92);}});
// -- blue bookshelf (cabinet blue from her bookroom)
var BOOKS=['#b5523f','#3f6e8a','#d7b25a','#5a8a4f','#8a5a8a','#e8dfc8','#2d4f6b','#c98a3c','#dc8b79','#f1ebdb'];
defObj('bookshelf',{base:44,name:'Bookshelf',spr:function(o){var pb=new PB(56,104),r=mulberry32(77);pb.rect(2,2,52,100,PAL.CAB);pb.rect(2,2,52,3,'#5b86a0');pb.rect(2,98,52,4,'#2f4d5c');
  for(var s=0;s<4;s++){var sy=8+s*22;pb.rect(6,sy,44,18,'#2f4d5c');var bx=7;while(bx<48){var bw=2+Math.floor(r()*3),bh=10+Math.floor(r()*7);if(r()<0.1){bx+=bw;continue;}var c=BOOKS[Math.floor(r()*BOOKS.length)];pb.rect(bx,sy+18-bh,bw,bh,c);pb.rect(bx,sy+18-bh,bw,1,lt(c,0.3));bx+=bw+1;}
    pb.rect(4,sy+18,48,3,'#5b86a0');}
  ink(pb);return mk(pb,28,102);}});
defObj('mat',{flat:true,fw:2,name:'Mat',spr:function(o){var W=o.fw*64,pb=new PB(W,64);pb.rect(14,16,W-28,32,PAL.CORAL);for(var s=0;s<4;s++)pb.rect(14,20+s*7,W-28,2,'#f1ebdb');pb.rect(14,16,W-28,1,'#ecae9f');ink(pb);return mk(pb,W/2,64);}});
// -- window feeder: a little clear box stuck to the glass (drawn with the wall, birds sit on it)
defObj('wfeeder',{solid:false,wall:true,name:'Window feeder',spr:function(o){var pb=new PB(40,26);pb.rect(4,6,32,16,'#d8eef4');pb.rect(4,6,32,1,'#ffffff');pb.rect(2,20,36,4,'#c9ccd0');pb.rect(2,20,36,1,'#ffffff');ink(pb);return mk(pb,20,24);},
  hit:function(o){return [o.tx*T-14,o.ty*T-48,T+28,58];},use:{side:'here'}});
// -- pole feeder outdoors (the balcony one hangs from a stand)
defObj('feeder',{base:58,name:'Bird feeder',keyOf:function(o){return (o.v||'')+'|'+Math.round((o.s||0)*5);},spr:function(o){var ys=yardSpr(o.v==='hang'?'feederhang':'feeder');
  if(ys&&ys.m.seed){var sd=ys.m.seed,lvl=clamp(o.s||0,0,1),cut=Math.round(sd.y1-(sd.y1-sd.y0+1)*lvl),x=ys.c.getContext('2d'),d=x.getImageData(0,0,ys.w,ys.h),p=d.data;
    for(var yy=sd.y0;yy<=cut&&yy<=sd.y1;yy++)for(var xx=sd.x0;xx<=sd.x1;xx++){var i=(yy*ys.w+xx)*4;if(p[i+3]&&p[i]>150&&p[i+1]>90&&p[i+1]<200&&p[i+2]<140&&Math.abs(p[i]-p[i+1])>25){p[i]=216;p[i+1]=238;p[i+2]=244;}}
    x.putImageData(d,0,0);ys.perch=ys.m.perch;ys.tray=ys.m.tray;return ys;}var hang=o.v==='hang',H=hang?84:104,pb=new PB(44,H+4),cx=22,top=hang?16:22,lvl=clamp(o.s||0,0,1);
  if(hang){pb.rect(cx-1,0,2,top,'#2a2a2e');pb.rect(cx-12,0,24,2,'#2a2a2e');pb.rect(cx-12,0,2,H,'#2a2a2e');pb.rect(cx-16,H-2,10,3,'#2a2a2e');}
  else{pb.rect(cx-1,top+34,3,H-top-34,'#3a3940');pb.rect(cx-6,H-3,13,3,'#3a3940');}
  pb.poly([[cx-14,top+2],[cx,top-8],[cx+14,top+2]],'#ac3232');pb.rect(cx-14,top+2,28,2,'#7a2020');pb.line(cx-12,top,cx,top-6,'#d95763');
  pb.rect(cx-6,top+4,12,24,'#d8eef4');var sh=Math.round(22*lvl);if(sh>0){pb.rect(cx-5,top+27-sh,10,sh,'#d9a066');for(var q=0;q<sh;q+=2)pb.set(cx-4+(q*3)%8,top+27-q,'#8a6f30');}pb.rect(cx-6,top+4,1,24,'#ffffff');
  pb.rect(cx-12,top+28,24,4,'#8f563b');pb.rect(cx-12,top+28,24,1,'#c68450');pb.rect(cx-16,top+30,4,1,'#2a2a2e');pb.rect(cx+12,top+30,4,1,'#2a2a2e');
  ink(pb);var s=mk(pb,cx,H+1);s.perch=[[-15,-(H+1)+top+29],[15,-(H+1)+top+29],[0,-(H+1)+top-8]];s.tray=-(H+1)+top+28;return s;},
  hit:function(o){return [oX(o)-20,oBase(o)-(o.v==='hang'?90:110),40,112];},use:{side:'any'}});
// -- the hen house
function yardSpr(n){var m=typeof ANIMMETA==='object'&&ANIMMETA.yard&&ANIMMETA.yard[n],im=IMG['yd-'+n];if(!m||!im||!im.naturalWidth)return null;
  var c=document.createElement('canvas');c.width=m.w;c.height=m.h;var x=c.getContext('2d');x.drawImage(im,0,0);return {c:c,ax:m.ax,ay:m.ay,w:m.w,h:m.h,m:m};}
defObj('coop',{fw:3,fh:2,base:50,name:'Coop',spr:function(o){var ys=yardSpr('coop');if(ys){if(ys.m.nest)ys.nest={x:ys.m.nest.x,y:ys.m.nest.y,w:ys.m.nest.w};return ys;}var W=200,H=156,pb=new PB(W,H),x0=22,bw=150,by0=56,bh=72;
  for(var l=0;l<4;l++){var lx=x0+6+l*44;pb.rect(lx,by0+bh,6,22,'#6b4226');}
  for(var y=by0;y<by0+bh;y++)pb.rect(x0,y,bw,1,((y-by0)>>3)%2?'#c68450':'#b97a47');for(var y2=by0;y2<by0+bh;y2+=8)pb.rect(x0,y2,bw,1,'#8e4f26');
  pb.rect(x0+14,by0+20,34,40,'#3a2414');pb.rect(x0+14,by0+20,34,2,'#2a1810');pb.rect(x0+16,by0+50,30,10,'#e8c56a');for(var s=0;s<12;s++)pb.set(x0+17+s*2.4,by0+48+(s%3),'#f2d88a');
  pb.rect(x0+96,by0+16,34,24,'#3a2414');pb.rect(x0+96,by0+16,34,24,'#3a2414');pb.rect(x0+99,by0+19,28,18,'#cfe6f5');pb.rect(x0+112,by0+19,2,18,'#3a2414');pb.rect(x0+99,by0+27,28,2,'#3a2414');
  pb.poly([[x0-14,by0+4],[x0+bw/2,by0-50],[x0+bw+14,by0+4]],'#ac3232');for(var r=0;r<6;r++){var ry=by0-40+r*8;pb.line(x0+bw/2-(r*8+10)*1.4,ry+8,x0+bw/2+(r*8+10)*1.4,ry+8,'#8a2a2a');}
  pb.line(x0-14,by0+4,x0+bw/2,by0-50,'#d95763');pb.rect(x0-14,by0+4,bw+28,4,'#7a2020');
  for(var p=0;p<7;p++){pb.line(x0+12+p*2,by0+60+p*5,x0+38+p*2,by0+60+p*5,'#a8673a');}pb.line(x0+10,by0+60,x0+22,by0+96,'#8e4f26');pb.line(x0+40,by0+60,x0+52,by0+96,'#8e4f26');
  ink(pb);var s=mk(pb,W/2,H-2);s.nest={x:x0+16-W/2,y:by0+46-(H-2),w:30};return s;},
  hit:function(o){return [o.tx*T,oBase(o)-150,o.fw*T,160];},use:{side:'s'}});
// -- her trees
defObj('olive',{fw:2,base:52,name:'Olive tree',keyOf:function(){return 'o';},spr:function(o){var im=IMG.olive2;if(!im||!im.naturalWidth){var pb=new PB(120,150);pb.rect(54,90,12,58,'#5c5143');pb.ell(60,60,56,44,'#5d6d56');pb.ell(50,46,36,24,'#879e7c');return mk(pb,60,148);}
  var c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight+6;var x=c.getContext('2d');x.fillStyle='rgba(28,24,48,0.22)';x.beginPath();x.ellipse(118,c.height-6,58,7,0,0,6.283);x.fill();x.drawImage(im,0,0);var b=(MF.olive2&&MF.olive2.base)||[118,195];return {c:c,ax:b[0],ay:b[1],w:c.width,h:c.height};}});
defObj('oak',{base:56,name:'Tree',keyOf:function(o){return 'k'+(o.v||0);},spr:function(o){var im=IMG.oak;if(!im||!im.naturalWidth){var pb=new PB(74,90);pb.rect(30,56,14,34,'#663931');pb.ell(37,34,34,30,'#6abe30');return mk(pb,37,89);}
  var P=new PB(74,96),src=imgPix(im,0,0,74,90);P.d.set(src,0);var v=o.v||0;if(v===1){P.recolor('#99e550','#6abe30');P.recolor('#6abe30','#4b8f3a');}else if(v===2){P.recolor('#99e550','#b9e070');P.recolor('#37946e','#3f8a5e');}
  var out=new PB(74,96);shadowPB(out,37,90,24,5,60);out.blit(P,0,0);return mk(out,37,89);}});
// -- bushes for the hedge and the garden
defObj('bush',{base:58,name:'Bush',spr:function(o){var pb=new PB(66,48),r=mulberry32(o.seed||3);shadowPB(pb,33,44,28,4,55);
  [[33,30,26,15,'#4b692f'],[20,28,15,13,'#37946e'],[46,27,16,13,'#37946e'],[33,22,20,14,'#6abe30'],[25,18,10,8,'#6abe30'],[42,17,11,8,'#99e550']].forEach(function(e){pb.ell(e[0]+(r()-0.5)*4,e[1]+(r()-0.5)*3,e[2],e[3],e[4]);});
  for(var k=0;k<40;k++){var x=8+Math.floor(r()*50),y=8+Math.floor(r()*34);if(pb.on(x,y)&&((pb.get(x,y)>>>24)===255))pb.set(x,y,r()<0.5?'#99e550':'#37946e');}
  if(o.v===1||o.v===2){var fc=o.v===1?'#d77bba':'#ffffff';for(var f=0;f<9;f++){var fx=10+Math.floor(r()*46),fy=10+Math.floor(r()*26);if(pb.on(fx,fy)){pb.set(fx,fy,fc);pb.set(fx+1,fy,fc);}}}
  return mk(pb,33,44);}});
var FLC=['#d95763','#fbf236','#d77bba','#ffffff','#639bff'];
defObj('flowers',{base:56,name:'Flower bed',spr:function(o){var pb=new PB(60,44),r=mulberry32((o.seed||1)+(o.v||0)*13),fc=FLC[(o.v||0)%FLC.length],fc2=FLC[((o.v||0)+2)%FLC.length];
  for(var f=0;f<8;f++){var x=8+f*6+Math.floor(r()*3),h=8+Math.floor(r()*12);pb.rect(x,30-h,1,h,'#37946e');pb.rect(x-2,30-Math.floor(h*0.5),2,1,'#6abe30');var c=f%3===2?fc2:fc;pb.rect(x-1,29-h,3,3,c);pb.set(x,30-h,'#fbf236');}
  pb.rect(4,30,52,12,'#8f563b');pb.rect(4,30,52,2,'#c68450');pb.rect(6,32,48,3,'#663931');pb.rect(4,40,52,2,'#663931');ink(pb);return mk(pb,30,42);}});
defObj('vegbed',{fw:3,fh:2,base:56,name:'Vegetable bed',spr:function(o){var W=184,H=112,pb=new PB(W,H),r=mulberry32(21);pb.rect(0,10,W,H-10,'#8f563b');pb.rect(0,10,W,3,'#c68450');pb.rect(6,16,W-12,H-28,'#663931');
  for(var y=22;y<H-14;y+=4)for(var x=8;x<W-8;x+=2)if(hash2(x,y,4)<0.3)pb.set(x,y,'#7a4a32');
  for(var row=0;row<3;row++)for(var c=0;c<7;c++){var cx=20+c*24+(row%2)*8,cy=30+row*24;pb.ell(cx,cy,8,6,'#37946e');pb.ell(cx,cy-2,6,4,'#6abe30');pb.set(cx-2,cy-4,'#99e550');if(row===1&&c%3===0){pb.rect(cx+6,cy-14,1,14,'#c68450');pb.rect(cx+5,cy-10,3,3,'#ac3232');}}
  pb.rect(0,H-12,W,12,'#8f563b');pb.rect(0,H-12,W,2,'#c68450');ink(pb);return mk(pb,W/2,H-1);}});
defObj('bench',{fw:2,base:50,name:'Bench',spr:function(o){var W=128,pb=new PB(W,56);shadowPB(pb,64,52,52,4,55);
  for(var s=0;s<3;s++){pb.rect(10,4+s*7,W-20,5,'#c68450');pb.rect(10,4+s*7,W-20,1,'#d9a066');pb.rect(10,8+s*7,W-20,1,'#8e4f26');}
  pb.rect(6,28,W-12,6,'#c68450');pb.rect(6,28,W-12,1,'#d9a066');pb.rect(6,33,W-12,2,'#8e4f26');pb.rect(6,36,W-12,4,'#b0703f');
  [10,W-14].forEach(function(x){pb.rect(x,2,4,48,'#2a2a2e');pb.rect(x-2,24,8,3,'#2a2a2e');});ink(pb);var sp=mk(pb,64,50);sp.seat={x:0,y:-22};return sp;},use:{side:'s'}});
defObj('birdbath',{base:56,name:'Bird bath',spr:function(o){var pb=new PB(48,48);shadowPB(pb,24,44,16,3,55);pb.rect(19,18,10,22,'#9badb7');pb.rect(19,18,3,22,'#cbdbfc');pb.rect(26,18,3,22,'#847e87');pb.rect(12,38,24,6,'#847e87');pb.rect(12,38,24,2,'#9badb7');
  pb.ell(24,14,20,7,'#847e87');pb.ell(24,12,20,6,'#9badb7');pb.ell(24,12,16,4,'#5fcde4');pb.rect(18,11,5,1,'#cbdbfc');ink(pb);var s=mk(pb,24,44);s.rim=[[-16,-32],[16,-32]];return s;}});
defObj('lantern',{base:56,name:'Lantern',spr:function(o){var pb=new PB(24,76);pb.rect(10,22,4,52,'#2a2a2e');pb.rect(5,72,14,3,'#2a2a2e');pb.rect(4,6,16,18,'#2a2a2e');pb.rect(6,9,12,12,'#fbf236');pb.rect(7,10,4,4,'#fff9c8');pb.poly([[3,7],[12,0],[21,7]],'#2a2a2e');ink(pb);return mk(pb,12,74);}});
// fences join up with their neighbours
function fenceMask(o){var ob=LS().objs,m=0;function has(dx,dy){return ob.some(function(p){return (p.k==='fence'||p.k==='gate'||(dy===0&&p.k==='wall'))&&p.tx<=o.tx+dx&&o.tx+dx<p.tx+p.fw&&p.ty===o.ty+dy;});}
  if(has(1,0))m|=1;if(has(-1,0))m|=2;if(has(0,-1))m|=4;if(has(0,1))m|=8;return m;}
defObj('fence',{base:46,name:'Fence',keyOf:function(o){return 'f'+fenceMask(o);},spr:function(o){var msk=fenceMask(o),pb=new PB(64,112),cx=32,base=104;
  function rail(x0,x1,y){pb.rect(x0,y,x1-x0,4,'#c68450');pb.rect(x0,y,x1-x0,1,'#d9a066');pb.rect(x0,y+3,x1-x0,1,'#8e4f26');}
  if(msk&1){rail(cx,64,base-30);rail(cx,64,base-16);}if(msk&2){rail(0,cx,base-30);rail(0,cx,base-16);}
  if(msk&4){pb.rect(cx-3,base-64-26,6,64,'#c68450');pb.rect(cx-3,base-64-26,1,64,'#d9a066');pb.rect(cx+2,base-64-26,1,64,'#8e4f26');}
  pb.rect(cx-4,base-40,8,40,'#a8673a');pb.rect(cx-4,base-40,2,40,'#c68450');pb.rect(cx+2,base-40,2,40,'#8e4f26');pb.poly([[cx-4,base-40],[cx,base-45],[cx+4,base-40]],'#c68450');
  ink(pb);return mk(pb,cx,base);}});
function wallMask(o){var ob=LS().objs,m=0;function has(dx,dy){return ob.some(function(p){return (p.k==='wall'||(dy===0&&(p.k==='gate'||p.k==='fence')))&&p.tx<=o.tx+dx&&o.tx+dx<p.tx+p.fw&&p.ty===o.ty+dy;});}
  if(has(1,0))m|=1;if(has(-1,0))m|=2;if(has(0,-1))m|=4;if(has(0,1))m|=8;return m;}
var WALL_H=76,WALL_CAP=12;
defObj('wall',{base:60,name:'Wall',keyOf:function(o){return 'w'+(o.v||'p')+wallMask(o);},spr:function(o){var msk=wallMask(o),stone=o.v==='s',H=WALL_H,cap=WALL_CAP,pb=new PB(64,64+H+cap),base=64+H+cap-4,cx=32;
  var F=stone?'#a3a7ad':'#efe8da',F2=stone?'#8f949b':'#ded5c3',FD=stone?'#6d7279':'#b9ad94',C=stone?'#6f747c':'#b8ab92',CD=stone?'#575b62':'#9a8e76';
  var side=(msk&3)||!(msk&12),x0=(msk&2)||(side&&!(msk&1)&&!(msk&2))?0:cx-12,x1=(msk&1)||(side&&!(msk&1)&&!(msk&2))?64:cx+12;if(!side){x0=cx-12;x1=cx+12;}
  // the face, seen from the front, unless another wall stands in front of it
  if(!(msk&8)||side){var fy0=base-H;pb.rect(x0,fy0,x1-x0,H,F);
    if(stone){for(var r=0;r*12<H;r++){var off=(r%2)*10;for(var bx=x0-off;bx<x1;bx+=20){var a=Math.max(x0,bx),b2=Math.min(x1,bx+19);if(b2-a>2){pb.rect(a,fy0+r*12+1,b2-a,10,((bx+r*7)&16)?F:F2);pb.rect(a,fy0+r*12+10,b2-a,1,FD);}}pb.rect(x0,fy0+r*12,x1-x0,1,FD);}}
    else{pb.rect(x0,fy0+H-10,x1-x0,10,F2);pb.rect(x0,fy0+H-10,x1-x0,1,FD);for(var q=0;q<4;q++)pb.set(x0+((q*17+o.tx*5)%Math.max(1,x1-x0)),fy0+12+q*13,F2);}
    pb.rect(x0,base-2,x1-x0,2,FD);}
  // the top: the wall's thickness seen from above, reaching up to the wall behind
  var cy=base-H-cap,top=(msk&4)?cy-64:cy;pb.rect(Math.max(0,(msk&2)?0:cx-12),top,((msk&1)?64:cx+12)-((msk&2)?0:cx-12),cy+cap-top,C);
  if(msk&4)pb.rect(cx-12,top,24,cy-top+cap,C);pb.rect((msk&2)?0:cx-12,cy+cap-2,((msk&1)?64:cx+12)-((msk&2)?0:cx-12),2,CD);
  ink(pb);return mk(pb,cx,base);}});
defObj('gate',{fw:2,base:46,name:'Gate',walk:true,spr:function(o){var pb=new PB(128,64),base=56;[2,120].forEach(function(x){pb.rect(x,base-46,6,46,'#a8673a');pb.rect(x,base-46,2,46,'#c68450');});
  for(var s=0;s<7;s++){var x=12+s*15;pb.rect(x,base-36,8,34,'#c68450');pb.rect(x,base-36,8,1,'#d9a066');pb.rect(x+7,base-36,1,34,'#8e4f26');}
  pb.rect(10,base-30,108,4,'#8e4f26');pb.rect(10,base-12,108,4,'#8e4f26');pb.line(12,base-10,116,base-30,'#8e4f26');pb.line(12,base-9,116,base-29,'#8e4f26');pb.rect(60,base-22,6,3,'#2a2a2e');ink(pb);return mk(pb,64,base);}});
defObj('rock',{base:56,solid:false,name:'Rock',keyOf:function(o){return 'r'+(o.v||0);},spr:function(o){var ys=yardSpr((o.v||0)===2?'bigrock':'rock');if(ys)return ys;var v=o.v||0,w=[30,22,40][v],h=[18,14,22][v],pb=new PB(w+8,h+8);shadowPB(pb,(w+8)/2,h+4,w/2,3,60);
  pb.ell((w+8)/2,h/2+3,w/2,h/2,'#847e87');pb.ell((w+8)/2-2,h/2+1,w/2-3,h/2-3,'#9badb7');pb.ell((w+8)/2-w*0.18,h*0.32+2,w*0.18,h*0.14,'#cbdbfc');for(var x=0;x<w+8;x++)if(pb.on(x,h+2)&&!pb.on(x,h+3))pb.set(x,h+2,'#696a6a');return mk(pb,(w+8)/2,h+4);}});
defObj('reeds',{base:58,solid:false,name:'Reeds',keyOf:function(o){return 'e'+(o.v||0);},spr:function(o){var pb=new PB(34,54),r=mulberry32(11+(o.v||0)*7);for(var s=0;s<7;s++){var x=6+s*3+Math.floor(r()*3),h=24+Math.floor(r()*24),lean=Math.round((r()-0.5)*6);
  for(var k=0;k<h;k++)pb.set(x+Math.round(lean*k/h),52-k,k>h-4?'#99e550':s%2?'#6abe30':'#4b692f');if(s%2===0&&h>30){var tx=x+lean,ty=52-h+4;pb.rect(tx-1,ty,3,7,'#8f563b');pb.rect(tx-1,ty,1,7,'#a9744f');}}return mk(pb,17,52);}});
function bridgeMask(o){var ob=LS().objs,m=0;function has(dx,dy){return ob.some(function(p){return p!==o&&p.k==='bridge'&&o.tx+dx>=p.tx&&o.tx+dx<p.tx+p.fw&&o.ty+dy>=p.ty&&o.ty+dy<p.ty+p.fh;});}
  if(has(o.fw,0))m|=1;if(has(-1,0))m|=2;if(has(0,-1))m|=4;if(has(0,o.fh))m|=8;return m;}
defObj('bridge',{flat:true,fw:2,fh:3,walk:true,name:'Bridge',keyOf:function(o){return 'b'+o.fw+'x'+o.fh+'m'+bridgeMask(o);},spr:function(o){var W=o.fw*64,H=o.fh*64,pb=new PB(W,H),msk=bridgeMask(o);
  // planks run across the way you walk: a bridge longer side to side has upright planks and rails top and bottom
  var ew=(msk&3)&&!(msk&12)||(o.fw>o.fh);
  if(!ew){for(var y=0;y<H;y+=10){pb.rect(0,y,W,8,hash2(y+o.ty*64,1,2)<0.5?'#c68450':'#b97a47');pb.rect(0,y,W,1,'#d9a066');pb.rect(0,y+7,W,1,'#8e4f26');}
    [[2,!(msk&2)],[W-8,!(msk&1)]].forEach(function(r){if(!r[1])return;var x=r[0];pb.rect(x,0,6,H,'#8e4f26');pb.rect(x,0,2,H,'#c68450');for(var py=0;py<H;py+=32)pb.rect(x-1,py,8,6,'#663931');});}
  else{for(var x2=0;x2<W;x2+=10){pb.rect(x2,0,8,H,hash2(x2+o.tx*64,3,2)<0.5?'#c68450':'#b97a47');pb.rect(x2,0,1,H,'#d9a066');pb.rect(x2+7,0,1,H,'#8e4f26');}
    [[2,!(msk&4)],[H-8,!(msk&8)]].forEach(function(r){if(!r[1])return;var y2=r[0];pb.rect(0,y2,W,6,'#8e4f26');pb.rect(0,y2,W,2,'#c68450');for(var px=0;px<W;px+=32)pb.rect(px,y2-1,6,8,'#663931');});}
  ink(pb);return mk(pb,W/2,H);}});
defObj('herbs',{base:40,name:'Herb pot',spr:function(o){var pb=new PB(32,36);pb.rect(6,20,20,14,'#c8714a');pb.rect(4,18,24,3,'#d9895f');pb.rect(6,31,20,3,'#a85a38');
  if(o.v){for(var s=0;s<6;s++){pb.line(9+s*3,19,8+s*3+(s%2),6+(s%3)*2,'#37946e');pb.set(8+s*3,8+(s%3)*2,'#6abe30');}}else{[[10,12],[16,8],[22,12],[13,15],[20,15]].forEach(function(p){pb.ell(p[0],p[1],4,3,'#4aa63e');pb.set(p[0]-1,p[1]-1,'#86d06a');});}
  ink(pb);return mk(pb,16,34);}});
defObj('pot',{base:44,name:'Flower pot',spr:function(o){var pb=new PB(34,44);pb.rect(8,28,18,14,'#c8714a');pb.rect(6,26,22,3,'#d9895f');pb.rect(8,39,18,3,'#a85a38');
  for(var s=0;s<5;s++)pb.line(12+s*3,26,10+s*4,12+(s%2)*4,'#37946e');[[9,12],[17,8],[25,12],[13,17],[22,17]].forEach(function(p){pb.rect(p[0]-1,p[1]-1,3,3,'#d95763');pb.set(p[0],p[1],'#fbf236');});ink(pb);return mk(pb,17,42);}});
defObj('bchair',{base:50,name:'Folding chair',spr:function(o){var pb=new PB(40,52);pb.line(8,48,30,22,'#2a2a2e');pb.line(32,48,10,22,'#2a2a2e');
  for(var s=0;s<4;s++)pb.rect(8,4+s*5,24,4,'#c68450');pb.rect(6,26,28,6,'#c68450');pb.rect(6,26,28,1,'#d9a066');pb.rect(6,2,3,26,'#2a2a2e');pb.rect(31,2,3,26,'#2a2a2e');ink(pb);return mk(pb,20,50);}});
defObj('palm',{base:58,solid:false,name:'Palm',spr:function(o){var pb=new PB(110,150),r=mulberry32(31+(o.v||0)),bx=55,lean=o.v?-1:1;
  for(var y=0;y<100;y++){var x=bx+Math.round(lean*Math.pow(y/100,2)*14);pb.rect(x-4,146-y,8,1,y%7<1?'#663931':'#8f563b');pb.set(x-4,146-y,'#a46b46');}
  var tx=bx+lean*14,ty=46;for(var f=0;f<9;f++){var a=-Math.PI+f*Math.PI/8+(r()-0.5)*0.2,len=34+r()*16;for(var k=0;k<len;k++){var px=tx+Math.cos(a)*k,py=ty+Math.sin(a)*k*0.55+k*k*0.012;pb.rect(px,py,2,2,k<len*0.5?'#37946e':'#6abe30');if(k%3===0){pb.set(px+1,py+3,'#4b692f');pb.set(px-1,py-2,'#99e550');}}}
  pb.ell(tx,ty+2,5,4,'#8f563b');return mk(pb,bx,146);}});
// the trap float and its rope, drawn live (it bobs)
defObj('trap',{solid:false,name:'Shrimp trap',spr:null,hit:function(o){return [o.tx*T+6,o.ty*T-10,T-12,T+10];},use:{side:'bank'}});

// ----- creatures: pixel sprites with dark outlines, facing right (mirrored for left) -----
// -- birds. Each has its real colour patches. Poses: 0 perched, 1 pecking, 2 wings up, 3 wings down
var BIRDS=[
 {id:'bulbul',name:'White-eared bulbul',len:16,where:['feeder','tree','window'],hint:'Comes to any feeder',w:8,stage:0},
 {id:'myna',name:'Common myna',len:17,where:['ground','lawn','feeder'],hint:'Walks about on the lawn',w:5,stage:0},
 // rare: one of these at most at a time
 {id:'hoopoe',name:'Hoopoe',len:19,where:['lawn','ground'],hint:'Rare. Probes the lawn for grubs',w:0.25,stage:0,rare:1},
 {id:'parakeet',name:'Rose-ringed parakeet',len:24,where:['tree','feeder'],hint:'Rare. Loud, in the trees',w:0.25,stage:0,rare:1},
 {id:'sunbird',name:'Purple sunbird',len:16,where:['flowers','feeder','tree'],hint:'Rare. Comes to flowers',w:0.25,stage:0,rare:1},
 {id:'kingfisher',name:'Arabian collared kingfisher',len:22,where:['water','fence','tree'],hint:'Rare. Watches the water',w:0.2,stage:0,rare:1}];
var BIRD={};BIRDS.forEach(function(b){BIRD[b.id]=b;});
function birdPB(B,pose){var L=Math.round(B.len*1.45),tall=!!B.tall,W=L+16,H=tall?Math.round(L*1.7):L+8,pb=new PB(W,H),s=L/18,fly=pose>=2;
  var bx=Math.round(W/2-1),by=tall?Math.round(H*0.5):H-Math.round(7*s)-1,peck=pose===1;
  if(!fly&&!tall){pb.line(bx-1,by+3,bx-2,H-2,'#4a3a30');pb.line(bx+2,by+3,bx+2,H-2,'#4a3a30');pb.set(bx-3,H-2,'#4a3a30');pb.set(bx+3,H-2,'#4a3a30');}
  if(tall&&!fly){pb.line(bx-1,by+5,bx-2,H-2,'#8a7a5a');pb.line(bx+2,by+5,bx+3,H-2,'#8a7a5a');}
  var tl=Math.round((B.longtail?12:B.pins?9:B.wag?8:6)*s),tilt=peck?-2:0;
  pb.poly([[bx-5*s,by-2],[bx-5*s-tl,by+tilt-1],[bx-5*s-tl+1,by+tilt+2],[bx-4*s,by+2]],B.back);
  if(B.pins)pb.line(bx-5*s-tl,by+tilt,bx-5*s-tl-4,by+tilt+1,B.back);
  pb.ell(bx,by,6.5*s,4.4*s,B.body);pb.ell(bx+1,by+1.6*s,4.6*s,2.6*s,B.belly);
  if(B.vent)pb.ell(bx-4*s,by+2*s,2*s,1.3*s,B.vent);
  var wc=B.wing||B.back;
  if(fly){if(pose===2)pb.poly([[bx-4*s,by-2],[bx+2*s,by-2],[bx-1*s,by-11*s],[bx-6*s,by-9*s]],wc);else pb.poly([[bx-4*s,by],[bx+2*s,by],[bx,by+8*s],[bx-5*s,by+6*s]],wc);}
  else{pb.ell(bx-1*s,by-0.8*s,4.3*s,2.4*s,wc);if(B.bars){for(var k=0;k<3;k++){pb.rect(bx-4*s+k*2.4*s,by-2*s,1,3,'#1e1a16');pb.rect(bx-3*s+k*2.4*s,by-2*s,1,3,'#f4f0e6');}}if(B.wingspot)pb.rect(bx-1,by-1,2,1,B.wingspot);}
  var hx=Math.round(bx+5*s+(peck?2:0)),hy=Math.round(tall?by-9*s:by-4*s+(peck?4*s:0)),hr=3.3*s;
  if(tall){for(var nq=0;nq<=12;nq++){var tq=nq/12,nx=lerp(bx+4*s,hx-1,tq)+Math.sin(tq*Math.PI)*-3*s,ny=lerp(by-2*s,hy+2,tq);pb.rect(nx-1,ny-1,3,3,nq>8?B.head:B.belly);}pb.line(bx+4*s,by-2*s,hx-2,hy+3,'#5a6066');}
  if(B.crest){pb.poly([[hx-3*s,hy-1],[hx-1*s,hy-7*s],[hx+2*s,hy-6.5*s],[hx+2*s,hy-1]],'#e3a56e');pb.set(hx-1*s,hy-7*s,'#1e1a16');pb.set(hx+1*s,hy-6.5*s,'#1e1a16');}
  pb.ell(hx,hy,hr,hr*0.95,B.head);
  if(B.cap)pb.ell(hx,hy-1.2*s,hr*0.9,hr*0.5,B.cap);
  if(B.cheek)pb.ell(hx+0.4*s,hy+0.9*s,1.7*s,1.2*s,B.cheek);
  if(B.throat)pb.ell(hx+1.6*s,hy+2.2*s,1.5*s,1.2*s,B.throat);
  if(B.mask)pb.rect(hx-1*s,hy-0.6,4.8*s,1,'#1e1e1e');
  if(B.ring)pb.line(hx-2*s,hy+2*s,hx+1*s,hy+3*s,'#1e1e1e');
  if(B.neck)pb.set(hx-2*s,hy+2*s,B.neck);
  pb.set(hx+1.3*s,hy-0.6*s,B.eye||'#1a1612');
  var bl=Math.round((B.dagger?6:B.curve?5:tall?7:3)*s);for(var q=0;q<bl;q++){var yy=Math.round(hy+(B.curve?q*q/(bl*1.6):q*0.15));pb.set(hx+hr+q,yy,B.beak);if(q<bl/2)pb.set(hx+hr+q,yy+1,B.beak);}
  ink(pb);return pb;}
var AM=function(kind,n){return (typeof ANIMMETA==='object'&&ANIMMETA[kind]&&ANIMMETA[kind][n])||null;};
function animFrame(kind,n,pose,ph,fps){var m=AM(kind,n);if(!m)return 0;var p=m.poses[pose]||m.poses[Object.keys(m.poses)[0]];return p[0]+(Math.floor(ph*fps)%p[1]+p[1])%p[1];}
function animSpr(key,m,i,face,ax,ay){var im=IMG[key];if(!im||!m)return null;var c=document.createElement('canvas');c.width=m.w;c.height=m.h;var x=c.getContext('2d');x.imageSmoothingEnabled=false;
  if(face<0){x.translate(m.w,0);x.scale(-1,1);}x.drawImage(im,i*m.w,0,m.w,m.h,0,0,m.w,m.h);return {c:c,ax:face<0?m.w-ax:ax,ay:ay,w:m.w,h:m.h};}
var BIRD_HIP={bulbul:44,myna:48};
function birdSpr(id,pose,face){var m=AM('birds',id);if(m&&IMG['an-bird-'+id]){var t=CACHE.bird[id]||(CACHE.bird[id]=[]);return cached(t,pose*2+(face<0?1:0),function(){return animSpr('an-bird-'+id,m,pose,face,m.ax||BIRD_HIP[id]||m.w/2,m.ay||m.h-13);});}
  var B=BIRD[id];var t=CACHE.bird[id]||(CACHE.bird[id]=[]);return cached(t,pose*2+(face<0?1:0),function(){var pb=birdPB(B,0);if(face<0)pb=pb.flipX();return mk(pb,Math.round(pb.w/2),pb.h-1);});}
// -- chickens
var HENS=[
 {id:'white',name:'White hen',body:'#f7f3ea',wing:'#e3dccc',tail:'#efe9dc',egg:'white',hint:'Lays white eggs',price:40},
 {id:'brown',name:'Brown hen',body:'#b9773f',wing:'#9c5f2e',tail:'#7a4a24',egg:'brown',hint:'Lays brown eggs',price:40},
 {id:'speckled',name:'Speckled hen',body:'#d8d2c6',wing:'#bdb5a6',tail:'#3a3530',egg:'speckled',spots:1,hint:'Lays speckled eggs',price:60},
 {id:'blue',name:'Blue egg hen',body:'#a88866',wing:'#8a6a4c',tail:'#5f4632',egg:'blue',muffs:1,hint:'Lays blue eggs',price:90},
 {id:'wild',name:'Wild junglefowl',body:'#9a6a3e',wing:'#c4562a',tail:'#2f3b2a',egg:'cream',wild:1,hint:'Out on the land. Catch one with grain',price:0}];
var HEN={};HENS.forEach(function(h){HEN[h.id]=h;});
// pose: 0/1 walking, 2 pecking, 3 standing, 4 flapping
function henPB(kind,pose){var H=HEN[kind]||HEN.white,pb=new PB(44,40),lift=pose===4?3:0,cx=19,cy=22-lift;
  var step=pose===0?2:pose===1?-2:0;
  pb.line(cx-3,cy+7,cx-3-step,36,'#d9a43a');pb.line(cx+3,cy+7,cx+3+step,36,'#d9a43a');pb.rect(cx-5-step,37,4,1,'#d9a43a');pb.rect(cx+2+step,37,4,1,'#d9a43a');
  if(H.wild){pb.poly([[cx-8,cy-2],[cx-18,cy-14],[cx-16,cy-15],[cx-6,cy-6]],H.tail);pb.poly([[cx-8,cy],[cx-19,cy-8],[cx-18,cy-5],[cx-7,cy+2]],'#1e2a1c');}
  else pb.poly([[cx-8,cy-1],[cx-13,cy-10],[cx-11,cy-12],[cx-6,cy-4]],H.tail);
  pb.ell(cx,cy,11,8.5,H.body);
  if(H.spots)for(var k=0;k<10;k++)pb.set(cx-7+Math.floor(hash2(k,1,7)*13),cy-5+Math.floor(hash2(k,2,7)*9),'#2a2622');
  if(pose===4){pb.poly([[cx-5,cy-2],[cx+4,cy-2],[cx-1,cy-13],[cx-7,cy-10]],H.wing);}else{pb.ell(cx-1,cy+0.5,6.5,4,H.wing);pb.line(cx-5,cy+2,cx+3,cy+3,dk(H.wing,0.25));}
  var peck=pose===2,hx=peck?cx+12:cx+8,hy=peck?cy+6:cy-9;
  if(!peck){pb.ell(cx+6,cy-5,4,5,H.wild?'#c4562a':H.body);}
  pb.ell(hx,hy,4.2,4,H.wild?'#c4562a':H.body);
  if(H.muffs)pb.ell(hx-1,hy+2,2.5,1.5,H.wing);
  pb.rect(hx-2,hy-6,5,2,'#d23b2b');pb.set(hx-2,hy-7,'#d23b2b');pb.set(hx,hy-7,'#d23b2b');pb.set(hx+2,hy-7,'#d23b2b');
  pb.rect(hx+2,hy+3,2,3,'#d23b2b');pb.poly([[hx+4,hy-1],[hx+8,hy],[hx+4,hy+2]],'#e8b03a');pb.set(hx+1,hy-1,'#1a1612');
  ink(pb);return pb;}
var HEN_SHEET={white:'white',brown:'brown',speckled:'speckled',blue:'blue',wild:'jungle'};
function henSpr(kind,pose,face){var hn=HEN_SHEET[kind]||'white',m=AM('hens',hn);if(m&&IMG['an-hen-'+hn]){var t0=CACHE.hen[kind]||(CACHE.hen[kind]=[]);return cached(t0,'a'+pose*2+(face<0?1:0),function(){return animSpr('an-hen-'+hn,m,pose,face,24,m.h-3);});}
  var t=CACHE.hen[kind]||(CACHE.hen[kind]=[]);return cached(t,pose*2+(face<0?1:0),function(){var pb=henPB(kind,pose);if(face<0)pb=pb.flipX();return mk(pb,face<0?pb.w-20:19,38);});}
var EGG_COL={white:'#f7f3ea',brown:'#c98a52',cream:'#ecdcb6',speckled:'#e9dcc4',blue:'#a9cfd3'};
function eggSpr(kind){return cached(CACHE.egg,kind,function(){var pb=new PB(9,11),c=EGG_COL[kind]||EGG_COL.white;pb.ell(4.5,6,3.6,4.6,c);pb.set(3,3,lt(c,0.5));pb.set(3,4,lt(c,0.4));pb.rect(4,9,3,1,dk(c,0.2));if(kind==='speckled'){pb.set(5,5,'#6b4a34');pb.set(3,7,'#6b4a34');pb.set(6,8,'#6b4a34');}ink(pb);return mk(pb,4,10);});}
// -- fish (for the catch, the book and the pond)
var FISH=[
 {id:'green-tiger-barb',name:'Green tiger barb',len:[3,6],where:'both',hint:'Green and quick, in schools',w:8},
 {id:'black-neon-tetra',name:'Black neon tetra',len:[2,4],where:'stream',hint:'A bright line down a black side',w:8},
 {id:'ember-tetra',name:'Ember tetra',len:[1.5,2.5],where:'stream',hint:'Small and orange',w:9},
 {id:'serpae-tetra',name:'Serpae tetra',len:[3,4.5],where:'both',hint:'Red with a black shoulder spot',w:6},
 {id:'black-phantom-tetra',name:'Black phantom tetra',len:[3,4.5],where:'lake',hint:'Grey with a black patch',w:5},
 {id:'rosy-tetra',name:'Rosy tetra',len:[3,4.5],where:'lake',hint:'Pink with a tall fin',w:5},
 {id:'tricolor-swordtail',name:'Tricolour swordtail',len:[5,8],where:'both',hint:'Rare. Orange, black and white, with a sword',w:1.5}];
var FISHI={};FISH.forEach(function(f){FISHI[f.id]=f;});
function fishPB(F){var W=46,H=22,pb=new PB(W,H),cy=11;
  if(F.eel){for(var x=2;x<44;x++){var y=Math.round(cy+Math.sin(x*0.3)*3);pb.rect(x,y-2,1,5,F.body);pb.set(x,y-2,F.back);pb.set(x,y-1,F.back);}pb.set(42,Math.round(cy+Math.sin(42*0.3)*3)-1,'#1a1612');ink(pb);return pb;}
  var bl=F.long?18:15,bh=F.deep?8:F.long?4.4:F.bighead?6:6,bx=24;
  pb.poly([[bx-bl+2,cy],[bx-bl-7,cy-6],[bx-bl-5,cy],[bx-bl-7,cy+6]],F.fins||F.back);
  pb.poly([[bx-4,cy-bh+1],[bx+1,cy-bh-4],[bx+6,cy-bh+1]],F.fins||F.back);pb.poly([[bx-2,cy+bh-1],[bx+2,cy+bh+3],[bx+4,cy+bh-1]],F.fins||F.back);
  pb.ell(bx,cy,bl,bh,F.body);for(var x2=bx-bl;x2<=bx+bl;x2++)for(var y2=cy-bh;y2<cy-bh*0.25;y2++)if(pb.get(x2,y2)===cu(F.body))pb.set(x2,y2,F.back);
  if(F.stripe)pb.rect(bx-bl+2,cy,bl*1.7,1,F.stripe);
  if(F.bars)for(var b=0;b<6;b++)for(var yy=cy-bh;yy<cy+bh;yy++)if(pb.on(bx-10+b*4,yy)&&pb.get(bx-10+b*4,yy)!==cu(F.fins||F.back))pb.set(bx-10+b*4,yy,F.bars);
  if(F.mottle||F.spots)for(var k=0;k<16;k++){var px=bx-bl+2+Math.floor(hash2(k,1,F.id.length)*bl*1.7),py=cy-bh+1+Math.floor(hash2(k,2,F.id.length)*bh*1.6);if(pb.on(px,py))pb.set(px,py,'#4a3a28');}
  if(F.dots)[[-6,-1],[3,-1],[-11,1]].forEach(function(p){pb.rect(bx+p[0],cy+p[1],2,2,'#1e1a16');});
  if(F.scales)for(var sx=bx-8;sx<bx+10;sx+=4)for(var sy=cy-3;sy<cy+4;sy+=3)pb.set(sx+(sy&1)*2,sy,lt(F.body,0.35));
  for(var x3=bx-bl+3;x3<bx+bl-2;x3++)if(pb.on(x3,cy+Math.round(bh*0.5)))pb.set(x3,cy+Math.round(bh*0.5),lt(F.body,0.3));
  pb.rect(bx+bl-5,cy-2,2,2,'#f4f0e6');pb.set(bx+bl-4,cy-2,'#1a1612');
  if(F.barbels){pb.set(bx+bl+1,cy+2,'#2a2420');pb.set(bx+bl+2,cy+3,'#2a2420');}
  ink(pb);return pb;}
function fishSpr(id,fr,face){var m=AM('fish',id);fr=fr||0;face=face||1;if(m&&IMG['an-fish-'+id])return cached(CACHE.fish,id+':'+fr+':'+face,function(){return animSpr('an-fish-'+id,m,fr,face,Math.round(m.w/2),Math.round(m.h/2));});
  return cached(CACHE.fish,id,function(){var pb=fishPB(FISHI[id]||FISH[0]);return mk(pb,23,21);});}
var FINDS=[{id:'crab',name:'Freshwater crab',hint:'Sometimes climbs into the trap'},{id:'snail',name:'Pond snail',hint:'Rides in on the trap'},{id:'nymph',name:'Dragonfly nymph',hint:'Lives under stones'},{id:'leaf',name:'Old leaf',hint:'Leaves drift into the trap'},{id:'bottle',name:'Old glass bottle',hint:'Rare. Someone lost it a long time ago'}];
var FINDI={};FINDS.forEach(function(f){FINDI[f.id]=f;});
function findPB(id){var pb=new PB(30,22);
  if(id==='crab'){for(var l=0;l<3;l++){pb.line(9,12+l*2,3,15+l*3,'#8a4a2a');pb.line(21,12+l*2,27,15+l*3,'#8a4a2a');}pb.ell(15,12,8,5,'#b8663a');pb.ell(14,10,5,2,'#d08050');pb.ell(5,6,3,2.5,'#c4683a');pb.ell(25,6,3,2.5,'#c4683a');pb.line(8,8,6,7,'#b8663a');pb.line(22,8,24,7,'#b8663a');pb.set(12,7,'#1a1612');pb.set(18,7,'#1a1612');}
  else if(id==='snail'){pb.poly([[3,18],[26,18],[28,16],[6,15]],'#c9b79a');pb.ell(15,11,8,7,'#9a6a3e');pb.ell(15,11,5,4.5,'#b07a48');pb.ell(15,11,2.5,2,'#8a5a32');pb.line(25,15,27,10,'#c9b79a');pb.set(27,9,'#1a1612');}
  else if(id==='nymph'){for(var l2=0;l2<3;l2++){pb.line(10+l2*4,13,7+l2*5,19,'#4a4a2a');pb.line(10+l2*4,9,7+l2*5,3,'#4a4a2a');}pb.ell(12,11,9,3.5,'#7a7a4a');pb.ell(23,11,4,3,'#6a6a3e');pb.set(25,10,'#1a1612');pb.set(25,12,'#1a1612');for(var s=0;s<4;s++)pb.set(6+s*3,11,'#5a5a34');}
  else if(id==='leaf'){pb.poly([[2,12],[10,5],[24,6],[29,11],[23,16],[9,17]],'#b07a3a');pb.line(2,12,28,11,'#7a5020');for(var v=0;v<4;v++)pb.line(8+v*5,11,11+v*5,7,'#8a5a28');pb.set(12,9,'#c99a5a');}
  else{pb.poly([[2,8],[19,8],[22,10],[28,10],[28,13],[22,13],[19,15],[2,15]],'#7eb296');pb.rect(4,9,13,2,'#c5e0d0');pb.rect(26,9,3,5,'#6b4226');}
  ink(pb);return pb;}
function findSpr(id){return cached(CACHE.find,id,function(){return mk(findPB(id),15,21);});}
// -- Grandma, sitting and knitting (2 frames). Same build as Millie: big dark eyes, a smile line, the same outline and skin
function grandmaPB(f){var pb=new PB(64,86),SK='#ffc2a1',SK2='#f0a888',HA='#c4c7cc',HH='#e4e6ea',HD='#9a9ea6',CA='#9db58f',CL='#b9cdae',CD='#7a9470',SKT=PAL.CAB,SKT2='#36586a',K=POL;
  // feet and shins
  pb.rect(20,74,9,8,PAL.CREAM);pb.rect(35,74,9,8,PAL.CREAM);pb.rect(20,74,9,1,'#fbf8f0');pb.rect(22,66,6,9,SKT2);pb.rect(36,66,6,9,SKT2);
  // skirt over the knees
  pb.rect(16,56,32,12,SKT);pb.rect(16,56,32,2,'#5b86a0');pb.rect(31,58,2,10,SKT2);
  // cardigan
  pb.poly([[18,36],[46,36],[50,60],[14,60]],CA);pb.rect(18,36,28,2,CL);pb.rect(14,57,36,3,CD);for(var k=0;k<14;k++)pb.set(16+Math.floor(hash2(k,1,4)*32),40+Math.floor(hash2(k,2,4)*16),CD);
  pb.poly([[27,36],[32,46],[37,36]],PAL.CREAM);pb.set(32,49,PAL.CREAM);pb.set(32,53,PAL.CREAM);
  // arms to the knitting
  pb.rect(12,40,8,16,CA);pb.rect(44,40,8,16,CA);pb.rect(12,40,2,16,CL);pb.rect(50,40,2,16,CD);pb.rect(16,54,10,5,CA);pb.rect(38,54,10,5,CA);
  var hx=f?1:0;pb.rect(24+hx,52,16,8,PAL.CORAL);pb.rect(24+hx,52,16,1,'#ecae9f');for(var q=0;q<7;q++)pb.set(25+hx+q*2,55+(q%2),'#b8695a');
  pb.rect(22,54,5,5,SK);pb.rect(37,54,5,5,SK);
  if(f){pb.line(21,48,36,60,'#e8eef8');pb.line(43,48,28,60,'#e8eef8');}else{pb.line(23,46,38,59,'#e8eef8');pb.line(41,46,26,59,'#e8eef8');}
  pb.ell(54,66,5,5,PAL.CORAL);pb.line(51,63,57,69,'#b8695a');pb.line(50,64,57,64,'#b8695a');pb.line(49,64,40,58,PAL.CORAL);
  // head: grey bob with a bun, face like Millie's
  pb.ell(32,22,14,13,HA);pb.ell(32,7,6,5,HA);pb.ell(30,5,3,2,HH);pb.ell(26,15,6,3,HH);for(var h=0;h<12;h++)pb.set(20+Math.floor(hash2(h,3,8)*24),12+Math.floor(hash2(h,4,8)*20),HD);
  pb.rect(23,18,18,14,SK);pb.rect(24,32,16,2,SK);pb.rect(25,34,14,1,SK);pb.rect(23,18,18,3,HA);pb.rect(23,21,2,4,HA);pb.rect(39,21,2,4,HA);
  pb.set(25,29,SK2);pb.set(26,29,SK2);pb.set(38,29,SK2);pb.set(37,29,SK2);
  // eyes: white, dark, dark, white, like hers; round glasses round them
  [[26,24],[34,24]].forEach(function(e){pb.rect(e[0],e[1],4,3,'#f6f3fa');pb.rect(e[0]+1,e[1],2,3,K);pb.rect(e[0]-1,e[1]-2,6,1,K);pb.rect(e[0]-1,e[1]+3,6,1,K);pb.rect(e[0]-1,e[1]-1,1,4,K);pb.rect(e[0]+4,e[1]-1,1,4,K);});
  pb.rect(31,24,2,1,K);pb.rect(29,31,6,1,K);pb.set(28,30,K);pb.set(35,30,K);
  ink(pb);return pb;}
function grandmaSpr(f){return cached(CACHE.gma,f,function(){return charSpr('grandma','sit-knit',f,1,false)||mk(grandmaPB(f),32,82);});}
// -- Pierre, Puti's tuxedo cat. Drawn the way her dog is: one dark outline that black fur melts into, three tones of white,
// chunky legs. Long and stretchy like her pose sheet: walks, lies stretched out, sits, and stands up to reach the tank glass
var PW1='#fbfaf6',PW2='#e9e8e3',PW3='#c7c6cc',PW4='#a3a2ab',PB2='#2a272d',PB1='#423f47',POL='#21181b',PEYE='#c6d84a',PNOSE='#e8919b',PBEAN='#f0a08a';
// fur like her dog: short strokes of the next tone inside each mass, and a ragged edge before the outline
function furStrokes(pb,base,stroke,p,seed,dx,dy){var B=cu(base),Sc=cu(stroke);for(var y=0;y<pb.h;y++)for(var x=0;x<pb.w;x++){if(pb.d[y*pb.w+x]!==B||hash2(x,y,seed)>=p)continue;var n=2+Math.floor(hash2(x,y,seed+1)*2);for(var k=0;k<n;k++){var xx=x+dx*k,yy=y+dy*k;if(pb.get(xx,yy)===B)pb.set(xx,yy,Sc);}}}
function furFuzz(pb,p,seed){var w=pb.w,h=pb.h,d=pb.d,o=new Uint32Array(d);for(var y=1;y<h-1;y++)for(var x=1;x<w-1;x++){var i=y*w+x;if(d[i]>>>24)continue;if(hash2(x,y,seed)>=p)continue;var c=d[i-w]||d[i+w]||d[i-1]||d[i+1];if(c&&(c>>>24)>200)o[i]=c;}pb.d=o;}
function catFur(pb,seed,dx){furFuzz(pb,0.22,seed);furStrokes(pb,PW2,PW3,0.035,seed+3,dx,1);furStrokes(pb,PB2,PB1,0.05,seed+5,dx,1);}
function furEdge(pb,x0,x1,y,dir,seed){for(var x=x0;x<=x1;x++){if(hash2(x,y,seed)<0.35){var c=pb.get(x,y);if(c>>>24)pb.set(x,y+dir,c);}}}
function catFace(pb,cx,cy,side,eyesShut){// a front face: black cap and ears, white blaze down the middle, small yellow-green eyes
  pb.ell(cx,cy,11,10,PW2);pb.ell(cx,cy-3,11,7,PB2);pb.poly([[cx-11,cy-3],[cx-10,cy-15],[cx-4,cy-8]],PB2);pb.poly([[cx+4,cy-8],[cx+10,cy-15],[cx+11,cy-3]],PB2);
  pb.set(cx-8,cy-10,PNOSE);pb.set(cx-8,cy-9,PNOSE);pb.set(cx+8,cy-10,PNOSE);pb.set(cx+8,cy-9,PNOSE);
  pb.rect(cx-1,cy-9,3,8,PW2);pb.rect(cx-3,cy-2,7,4,PW2);pb.rect(cx-5,cy+1,11,7,PW2);pb.rect(cx-1,cy-9,1,6,PW1);
  pb.rect(cx-8,cy-6,4,2,PB1);
  if(eyesShut){pb.rect(cx-7,cy-1,4,1,POL);pb.rect(cx+4,cy-1,4,1,POL);}
  else{pb.rect(cx-7,cy-2,4,3,PEYE);pb.rect(cx+4,cy-2,4,3,PEYE);pb.rect(cx-6,cy-2,1,3,POL);pb.rect(cx+5,cy-2,1,3,POL);pb.set(cx-7,cy-2,'#e9f2a0');pb.set(cx+4,cy-2,'#e9f2a0');}
  pb.rect(cx-1,cy+2,3,2,PNOSE);pb.set(cx,cy+4,POL);pb.set(cx-1,cy+5,POL);pb.set(cx+1,cy+5,POL);pb.rect(cx-5,cy+7,11,1,PW3);}
function whiskers(pb,cx,cy){pb.line(cx-6,cy+3,cx-14,cy+1,'#d9d8dc');pb.line(cx-6,cy+5,cx-14,cy+6,'#d9d8dc');pb.line(cx+6,cy+3,cx+14,cy+1,'#d9d8dc');pb.line(cx+6,cy+5,cx+14,cy+6,'#d9d8dc');}
function catWalkPB(f){var pb=new PB(76,52),bob=(f===1||f===3)?1:0,top=20+bob;
  // legs: far pair darker, near pair white; they swing with the frame
  var sw=[2,0,-2,0][f];
  function leg(x,dx,c){var y0=top+12;for(var y=y0;y<48;y++){var k=(y-y0)/(48-y0),xx=Math.round(x+dx*k);pb.rect(xx,y,5,1,c);}pb.rect(Math.round(x+dx)-1,47,7,2,c);}
  leg(18,-sw,PW3);leg(47,sw,PW3);
  // tail, long and black, up and back
  [[13,top+4],[9,top],[6,top-5],[5,top-11],[6,top-16],[9,top-19]].forEach(function(p,j){pb.rect(p[0]-2,p[1]-2,5,5,PB2);});pb.rect(8,top-20,3,2,PB1);
  // body: long and a bit saggy, chest deeper
  pb.ell(34,top+6,22,8,PW2);pb.ell(50,top+7,8,9,PW2);pb.ell(20,top+6,7,7,PW2);for(var x=14;x<58;x++){if(pb.get(x,top+12)===cu(PW2))pb.set(x,top+12,PW3);if(pb.get(x,top+13)===cu(PW2))pb.set(x,top+13,PW3);}
  for(var x2=16;x2<54;x2++)if(pb.get(x2,top-1)===cu(PW2))pb.set(x2,top-1,PW1);
  // black patches on the back
  pb.ell(30,top+1,10,5,PB2);pb.ell(24,top+4,5,4,PB2);pb.ell(16,top+3,4,4,PB2);pb.rect(27,top-2,6,1,PB1);pb.ell(41,top+2,3,2,PB2);
  // near legs
  leg(24,sw,PW2);leg(52,-sw,PW2);pb.rect(52-sw,46,6,1,PW1);
  // head, side on: black cap and ears, white blaze at the front, small eye, pink nose
  var hx=60,hy=top-5;pb.ell(hx,hy,9,9,PW2);pb.ell(hx-1,hy-3,9,6,PB2);pb.poly([[hx-8,hy-4],[hx-6,hy-15],[hx-1,hy-8]],PB2);pb.poly([[hx+1,hy-8],[hx+5,hy-16],[hx+8,hy-5]],PB2);pb.set(hx-5,hy-11,PNOSE);pb.set(hx+4,hy-12,PNOSE);
  pb.rect(hx+5,hy-7,3,6,PW2);pb.rect(hx+3,hy-1,7,6,PW2);pb.rect(hx+6,hy-7,1,5,PW1);
  pb.rect(hx+2,hy-2,4,3,PEYE);pb.rect(hx+4,hy-2,1,3,POL);pb.set(hx+2,hy-2,'#e9f2a0');pb.rect(hx+9,hy+1,2,2,PNOSE);pb.set(hx+8,hy+4,POL);
  furEdge(pb,16,54,top-2,-1,7);catFur(pb,11+f,-1);ink(pb);pb.line(hx+10,hy+2,hx+15,hy+1,'#d9d8dc');pb.line(hx+10,hy+4,hx+15,hy+5,'#d9d8dc');return pb;}
// lying stretched out on his side, front paws forward with pink beans showing
function catNapPB(f){var pb=new PB(96,34),up=f?1:0;
  [[16,25],[10,25],[4,26]].forEach(function(p){pb.rect(p[0]-3,p[1]-2,7,4,PB2);});
  pb.rect(8,26,16,5,PW3);pb.rect(4,28,8,3,PW3);
  pb.ell(44,21-up,28,8+up,PW2);pb.ell(66,20,10,9,PW2);for(var x=18;x<74;x++)if(pb.get(x,27)===cu(PW2))pb.set(x,27,PW3);
  pb.ell(40,15-up,11,4,PB2);pb.ell(28,17-up,6,4,PB2);pb.ell(55,15,4,2,PB2);pb.rect(36,12-up,6,1,PB1);
  pb.rect(70,25,20,5,PW2);pb.rect(72,29,18,2,PW3);pb.rect(86,25,5,5,PW1);pb.set(89,27,PBEAN);pb.set(89,29,PBEAN);pb.set(87,28,PBEAN);
  var hx=78,hy=16;pb.ell(hx,hy,9,8,PW2);pb.ell(hx,hy-3,9,5,PB2);pb.poly([[hx-8,hy-4],[hx-6,hy-13],[hx-1,hy-7]],PB2);pb.poly([[hx+1,hy-7],[hx+5,hy-14],[hx+8,hy-4]],PB2);pb.set(hx-5,hy-9,PNOSE);
  pb.rect(hx-1,hy-7,3,6,PW2);pb.rect(hx-4,hy-1,9,6,PW2);pb.rect(hx-6,hy,4,1,POL);pb.rect(hx+3,hy,4,1,POL);pb.rect(hx,hy+2,2,1,PNOSE);
  furEdge(pb,20,70,6,-1,9);catFur(pb,21+f,-1);ink(pb);return pb;}
function catSitPB(blink){var pb=new PB(48,62);
  pb.ell(24,46,14,13,PW2);pb.ell(24,36,10,12,PW2);pb.ell(11,50,6,7,PW3);pb.ell(37,50,6,7,PW3);pb.ell(10,46,3,5,PB2);pb.ell(38,44,3,5,PB2);
  for(var t=0;t<14;t++)pb.rect(33+Math.round(t*0.6),58-Math.round(Math.sin(t/13*3.1)*3),4,3,PB2);
  pb.rect(16,42,6,17,PW2);pb.rect(26,42,6,17,PW2);pb.rect(16,42,1,17,PW1);pb.rect(21,46,1,13,PW3);pb.rect(26,46,1,13,PW3);pb.rect(15,58,8,2,PW2);pb.rect(25,58,8,2,PW2);
  pb.rect(14,30,20,3,PW1);
  catFur(pb,31,1);catFace(pb,24,18,0,blink);
  ink(pb);whiskers(pb,24,18);return pb;}
// standing up on his back legs, front paws up: from behind at the tank (f: which paw is up), or facing you with the toe beans
function catStandPB(f,front){var pb=new PB(48,96),la=front?4:(f?4:12),ra=front?6:(f?12:4);
  pb.ell(16,80,7,10,PW2);pb.ell(32,80,7,10,PW2);pb.rect(10,88,10,5,PW2);pb.rect(28,88,10,5,PW2);pb.rect(10,92,10,1,PW3);pb.rect(28,92,10,1,PW3);
  if(!front){for(var t=0;t<12;t++)pb.rect(24+Math.round(Math.sin(t*0.4)*3),70+t*2,4,3,PB2);}
  else{for(var t2=0;t2<10;t2++)pb.rect(38+Math.round(t2*0.5),62+t2*3,4,3,PB2);}
  pb.ell(24,52,11,22,PW2);pb.ell(24,58,10,14,front?PW1:PW2);for(var y=34;y<74;y++){if(pb.get(13,y)===cu(PW2))pb.set(13,y,PW3);if(pb.get(35,y)===cu(PW2))pb.set(35,y,PW3);}
  if(front){pb.ell(13,48,3,7,PB2);pb.ell(35,56,3,5,PB2);}else{pb.ell(22,46,8,10,PB2);pb.ell(30,64,4,4,PB2);pb.rect(18,38,5,1,PB1);}
  function arm(x,top){pb.rect(x,top+4,7,32-top,PW2);pb.rect(x,top+4,1,32-top,PW1);pb.ell(x+3.5,top+3,4.5,4,PW2);if(front){pb.rect(x+1,top+2,5,3,PBEAN);pb.set(x+1,top,PBEAN);pb.set(x+3,top-1,PBEAN);pb.set(x+5,top,PBEAN);}}
  arm(9,la);arm(32,ra);
  catFur(pb,41+f,0);if(front){catFace(pb,24,30,0,false);}
  else{pb.ell(24,30,11,10,PB2);pb.poly([[13,27],[14,16],[20,22]],PB2);pb.poly([[28,22],[34,16],[35,27]],PB2);pb.rect(17,37,14,3,PW2);pb.rect(20,24,8,1,PB1);}
  ink(pb);if(front)whiskers(pb,24,30);return pb;}
// Pierre and Grandma from her files (cat-pierre.aseprite, grandma.aseprite) when loaded
function charSpr(n,tag,f,face,flip){var m=AM('chars',n);if(!m||!IMG['an-'+n])return null;var p=m.poses[tag];if(!p)return null;var i=p[0]+(f%p[1]);
  return animSpr('an-'+n,m,i,flip&&face<0?-1:1,m.ax,m.ay);}
function catSpr(pose,f,face){var t=CACHE.cat[pose]||(CACHE.cat[pose]=[]);
  if(AM('chars','pierre')&&IMG['an-pierre'])return cached(t,'p'+f*2+(face<0?1:0),function(){
    if(pose==='walk')return charSpr('pierre',face<0?'walk-left':'walk-right',f,face,false);
    if(pose==='nap')return charSpr('pierre','nap',f,face,true);
    if(pose==='reach'||pose==='paw')return charSpr('pierre','look-up',0,face,true);
    return charSpr('pierre','sit',f,face,true);});
  return cached(t,f*2+(face<0?1:0),function(){var pb;
  if(pose==='walk'){pb=catWalkPB(f);if(face<0)pb=pb.flipX();return mk(pb,face<0?pb.w-38:38,49);}
  if(pose==='sit'){pb=catSitPB(f);return mk(pb,24,60);}
  if(pose==='nap'){pb=catNapPB(f);if(face<0)pb=pb.flipX();return mk(pb,pb.w/2,32);}
  if(pose==='reach'){pb=catStandPB(0,true);return mk(pb,24,94);}
  pb=catStandPB(f,false);return mk(pb,24,94);});}
// -- small bits
function heartSpr(){return cached(CACHE.one,'heart',function(){var pb=new PB(9,8);[[1,0,2],[5,0,2],[0,1,4],[4,1,4],[0,2,8],[1,3,6],[2,4,4],[3,5,2]].forEach(function(r){pb.rect(r[0],r[1],r[2],1,'#d95763');});pb.set(1,1,'#f5a0a8');pb.set(2,1,'#f5a0a8');ink(pb);return mk(pb,4,8);});}
function bobberSpr(){return cached(CACHE.one,'bob',function(){var pb=new PB(7,9);pb.rect(1,1,5,3,'#d95763');pb.rect(1,4,5,3,'#ffffff');pb.rect(3,0,1,1,'#2a2a2e');ink(pb);return mk(pb,3,8);});}
function bucketSpr(n){return cached(CACHE.one,'bucket',function(){var pb=new PB(16,14);pb.poly([[2,3],[13,3],[12,13],[3,13]],'#9badb7');pb.rect(3,3,10,3,'#5fcde4');pb.rect(3,7,9,1,'#cbdbfc');pb.line(2,3,7,0,'#696a6a');pb.line(13,3,8,0,'#696a6a');ink(pb);return mk(pb,8,13);});}
function mowerSpr(dir){return cached(CACHE.mow,dir,function(){var pb;
  if(dir==='left'||dir==='right'){pb=new PB(44,40);pb.rect(4,24,26,10,'#ac3232');pb.rect(4,24,26,2,'#d95763');pb.rect(6,30,22,3,'#7a2020');pb.rect(10,20,12,5,'#3a3940');pb.ell(8,35,4,4,'#2a2a2e');pb.ell(26,35,4,4,'#2a2a2e');pb.set(8,35,'#9badb7');pb.set(26,35,'#9badb7');pb.line(28,24,40,4,'#2a2a2e');pb.line(29,24,41,4,'#2a2a2e');pb.rect(39,2,4,3,'#2a2a2e');ink(pb);if(dir==='left')pb=pb.flipX();return mk(pb,dir==='left'?pb.w-17:17,39);}
  pb=new PB(34,46);if(dir==='down'){pb.rect(4,30,26,10,'#ac3232');pb.rect(4,30,26,2,'#d95763');pb.rect(9,26,16,5,'#3a3940');pb.rect(3,38,5,6,'#2a2a2e');pb.rect(26,38,5,6,'#2a2a2e');pb.line(6,30,6,2,'#2a2a2e');pb.line(28,30,28,2,'#2a2a2e');pb.rect(6,2,23,3,'#2a2a2e');}
  else{pb.rect(6,2,23,3,'#2a2a2e');pb.line(6,4,6,30,'#2a2a2e');pb.line(28,4,28,30,'#2a2a2e');pb.rect(4,30,26,10,'#ac3232');pb.rect(4,30,26,2,'#d95763');pb.rect(3,38,5,6,'#2a2a2e');pb.rect(26,38,5,6,'#2a2a2e');}
  ink(pb);return mk(pb,17,44);});}
var BFLY_COLS=['#f7f4ec','#fbf236','#df7126','#639bff'];
function bflySpr(c,f){return cached(CACHE.bf,c*2+f,function(){var pb=new PB(9,7),col=BFLY_COLS[c];if(f){pb.rect(1,1,3,3,col);pb.rect(5,1,3,3,col);pb.rect(2,4,2,2,col);pb.rect(5,4,2,2,col);}else{pb.rect(3,0,1,4,col);pb.rect(5,0,1,4,col);}pb.rect(4,1,1,5,'#2a2420');ink(pb);return mk(pb,4,6);});}
function shadowSpr(rx,ry){return cached(CACHE.sh,rx*32+ry,function(){var pb=new PB(rx*2+2,ry*2+2);shadowPB(pb,rx+1,ry+1,rx,ry,62);return mk(pb,rx+1,ry+1);});}
// -- the low front wall of a room (sorted with everything else), the balcony rail
function frontWallSpr(r,ri){return cached(CACHE.fw,ri,function(){var W=r.w*T+20,H=48,pb=new PB(W,H),pl=r.face==='plaster',face=pl?'#efe6d6':PAL.PALE;
  pb.rect(0,0,W,6,PAL.CREAM);pb.rect(0,0,W,1,INKc);pb.rect(0,5,W,1,INKc);pb.rect(0,6,W,H-6,face);
  if(pl){pb.rect(0,H-12,W,12,'#b6aa98');for(var x=0;x<W;x+=14)pb.rect(x+((x/14|0)%2)*7,H-12,1,12,'#8e8474');pb.rect(0,H-12,W,1,'#8e8474');for(var x2=0;x2<W;x2++)if(hash2(x2,3,9)<0.05)pb.rect(x2,8+Math.floor(hash2(x2,4,9)*20),1,3,'#e2d6c2');}
  else{pb.rect(0,H-7,W,7,PAL.CREAM);pb.rect(0,H-7,W,1,INKc);}
  pb.rect(0,H-1,W,1,INKc);
  var d=r.door;if(d){var a=(d.x-r.x)*T+10,b=a+d.w*T;for(var y=0;y<H;y++)for(var xx=a;xx<b;xx++)pb.d[y*W+xx]=0;pb.rect(a-4,0,4,H,'#6b4226');pb.rect(b,0,4,H,'#6b4226');pb.rect(a-4,0,1,H,INKc);pb.rect(b+3,0,1,H,INKc);
    if(d.kind==='slide'){var gx=b+4,gw=Math.min(d.w*T-12,W-gx-6);pb.rect(gx,4,gw,H-6,'#bcd8e6');pb.rect(gx,4,gw,2,INKc);pb.rect(gx,H-3,gw,2,INKc);pb.rect(gx,4,2,H-6,INKc);pb.rect(gx+gw-2,4,2,H-6,INKc);for(var q=0;q<8;q++)pb.set(gx+6+q,10+q*3,'#eef6fa');}}
  if(r.entry){var ex=Math.round(W/2-20);pb.rect(ex,8,40,H-9,'#8f563b');pb.rect(ex,8,40,2,'#c68450');pb.rect(ex+4,13,32,12,'#7a4a32');pb.rect(ex+4,28,32,12,'#7a4a32');pb.rect(ex+31,26,3,3,'#d9a066');pb.rect(ex,8,1,H-9,INKc);pb.rect(ex+39,8,1,H-9,INKc);}
  return mk(pb,0,H-1);});}
function railSpr(b){return cached(CACHE.one,'rail',function(){var W=b.w*T+8,H=40,pb=new PB(W,H);pb.rect(0,6,W,H-8,U32('#c9e1ee',110));for(var x=0;x<W;x+=3)if(hash2(x,1,5)<0.2)pb.rect(x,8+Math.floor(hash2(x,2,5)*20),1,6,U32('#eef6fa',175));
  pb.rect(0,2,W,4,'#1b1a1e');pb.rect(0,H-3,W,3,'#1b1a1e');for(var p=0;p<=b.w;p++)pb.rect(Math.min(W-3,p*T+2),2,3,H-2,'#1b1a1e');return mk(pb,0,H-1);});}

// ----- runtime -----
var L={cv:null,x:null,cssW:0,cssH:0,dpr:1,s:1,VW:0,VH:0,cam:{x:0,y:0},cdx:0,cdy:0,tool:'walk',clock:0,rt:0,
  birds:[],henA:{},wildA:{},fishA:[],parts:[],grain:[],fishing:null,watch:null,buildSel:null,ptr:null,
  spots:[],hab:{},spotT:0,spawnT:0,gcv:null,groundOK:false,gbk:null,shown:false,mower:null,mowT:0,labels:[],confirmMove:0,
  me:null,dog:null,cat:null,trail:[],pass:null,eH:null,eV:null,camFree:false,marker:null,steer:null,camSet:false,tipShown:{}};
function M(){return LS().map;}
function inView(wx,wy,pad){pad=pad||0;return wx>L.cam.x-pad&&wx<L.cam.x+L.VW+pad&&wy>L.cam.y-pad&&wy<L.cam.y+L.VH+pad;}
function tileOf(wx,wy){return [Math.floor(wx/T),Math.floor(wy/T)];}
function objAtTile(tx,ty,flatToo){var ob=LS().objs;for(var i=ob.length-1;i>=0;i--){var o=ob[i],d=OBJ[o.k];if(!d||(!flatToo&&d.flat))continue;if(tx>=o.tx&&tx<o.tx+o.fw&&ty>=o.ty&&ty<o.ty+o.fh)return o;}return null;}
function objsOf(k){return LS().objs.filter(function(o){return o.k===k;});}
function stageHas(k){return LS().objs.some(function(o){return o.k===k;});}
function countG(pred){var m=M(),n=0;for(var i=0;i<m.g.length;i++)if(pred(m.g[i],m.gh[i]))n++;return n;}
function isStream(tx,ty){return waterKind(tx,ty)===W_STREAM;}
function wildWater(tx,ty){var k=waterKind(tx,ty);return k===W_STREAM||k===W_LAKE;}
function mainRoom(){return M().rooms[0];}
function inRoom(r,tx,ty){return r&&tx>=r.x&&tx<r.x+r.w&&ty>=r.y&&ty<r.y+r.h;}

// ----- state setup and old saves -----
function ensureLand(){var l=S.land;if(!l||typeof l!=='object')l=S.land={};if(l.objs)l.objs=l.objs.filter(function(o){return o.k!=='vegbed';});
  if(!l.basket)l.basket={};if(!l.eggs)l.eggs=[];if(!l.hens)l.hens=[];if(!l.wild)l.wild=[];if(!l.pond)l.pond=[];if(!l.bucket)l.bucket=[];
  if(!l.stats)l.stats={mowed:0,eggs:0,fish:0,birds:0,traps:0};if(!l.seen)l.seen={};
  if(l.v!==LAND_V){
    // the ink home kept things in an older tile grid: give back what was built, then rebuild the place
    if(l.map){var back=0;(l.objs||[]).forEach(function(o){if(o.built&&BUILDI[o.k])back+=BUILDI[o.k].price;if(o.k==='trap')back+=20;});(l.edits||[]).forEach(function(e){back+=e.price||0;});
      if(back>0){S.cash+=back;l.seen.refund=back;}}
    l.edits=[];l.map=null;l.objs=[];l.v=LAND_V;if(l.tool==='look')l.tool='walk';}
  if(l.stage!==S.stage||!l.map)buildStage(S.stage);}
function buildStage(n){var l=S.land;l.oid=l.oid||0;var g=genStage(n);l.stage=n;l.map=g.map;l.objs=g.objs;l.edits=[];l.v=LAND_V;
  
  if(n<3){l.wild=[];}if(n===3&&!l.wild.length){for(var i=0;i<4;i++)l.wild.push(newWild());}
  l.me=null;resetRuntime();}
function resetRuntime(){L.groundOK=false;L.pmask=null;resetSprites();WALLC={};L.henPx=undefined;L.wildPx=null;L.hints=null;L.birds=[];L.henA={};L.wildA={};L.fishA=[];L.grain=[];L.parts=[];L.fishing=null;L.watch=null;L.labels=[];closeBub();
  L.me=null;L.dog=null;L.cat=null;L.trail=[];L.pass=null;L.camSet=false;L.steer=null;L.marker=null;L.camFree=false;if(L.mower){L.mower.stop();L.mower=null;}}
window.landSetStage=function(n){n=clamp(n|0,0,STAGES.length-1);ensureLand();S.stage=n;buildStage(n);save();updateHeader();if(activeTab==='home'&&L.shown){mountHome();}modCall('stageChanged',n);};

// ----- where you can walk: tiles, solid things, and walls that sit on tile edges -----
function computePass(){var m=M(),w=m.w,h=m.h,p=new Uint8Array(w*h),i;
  for(i=0;i<w*h;i++)p[i]=isWalkG(m.g[i])?1:0;
  LS().objs.forEach(function(o){var d=OBJ[o.k];if(!d)return;for(var y=o.ty;y<o.ty+o.fh;y++)for(var x=o.tx;x<o.tx+o.fw;x++){if(x<0||y<0||x>=w||y>=h)continue;if(d.walk)p[y*w+x]=1;else if(d.solid&&!o.deco)p[y*w+x]=0;}});
  var eH=new Uint8Array(w*(h+1)),eV=new Uint8Array((w+1)*h);
  function hEdge(x,y){if(x>=0&&x<w&&y>=0&&y<=h)eH[y*w+x]=1;}function vEdge(x,y){if(x>=0&&x<=w&&y>=0&&y<h)eV[y*(w+1)+x]=1;}
  m.rooms.forEach(function(r){var d=r.door;for(var x=r.x;x<r.x+r.w;x++){if(d&&x>=d.x&&x<d.x+d.w)continue;hEdge(x,r.y+r.h);}for(var y=r.y;y<r.y+r.h;y++){vEdge(r.x,y);vEdge(r.x+r.w,y);}});
  var b=m.balcony;if(b){for(var bx=b.x;bx<b.x+b.w;bx++)hEdge(bx,b.y+b.h);for(var by=b.y;by<b.y+b.h;by++){vEdge(b.x,by);vEdge(b.x+b.w,by);}}
  L.pass=p;L.eH=eH;L.eV=eV;}
function passable(tx,ty){var m=M();if(tx<0||ty<0||tx>=m.w||ty>=m.h)return false;return !!L.pass[ty*m.w+tx];}
function canStep(ax,ay,bx,by){var m=M(),w=m.w;if(!passable(bx,by))return false;var dx=bx-ax,dy=by-ay;
  if(dx&&dy)return canStep(ax,ay,bx,ay)&&canStep(bx,ay,bx,by)&&canStep(ax,ay,ax,by)&&canStep(ax,by,bx,by);
  if(dx===1)return !L.eV[by*(w+1)+bx];if(dx===-1)return !L.eV[ay*(w+1)+ax];if(dy===1)return !L.eH[by*w+bx];if(dy===-1)return !L.eH[ay*w+ax];return true;}
// Dijkstra over the tile grid from one tile (cheap at these sizes); returns dist and prev
// Dijkstra over the tile grid from one tile (cheap at these sizes). Buffers are reused; read the result before the next call
var FL_BUF=null;
function flood(sx,sy,maxD){var m=M(),w=m.w,n=w*m.h,i;
  if(!FL_BUF||FL_BUF.n!==n)FL_BUF={n:n,dist:new Float64Array(n),prev:new Int32Array(n),hk:new Float64Array(n*8+16),hv:new Int32Array(n*8+16)};
  var B=FL_BUF,dist=B.dist,prev=B.prev,hk=B.hk,hv=B.hv,hn=0,cap=hk.length,F={dist:dist,prev:prev};for(i=0;i<n;i++){dist[i]=Infinity;prev[i]=-1;}
  if(sx<0||sy<0||sx>=w||sy>=m.h)return F;var s0=sy*w+sx;dist[s0]=0;
  function push(k,v){if(hn>=cap)return;var j=hn++;while(j>0){var p=(j-1)>>1;if(hk[p]<=k)break;hk[j]=hk[p];hv[j]=hv[p];j=p;}hk[j]=k;hv[j]=v;}
  push(0,s0);
  while(hn>0){var d=hk[0],c=hv[0];hn--;if(hn>0){var lk=hk[hn],lv=hv[hn],j=0;for(;;){var l=2*j+1;if(l>=hn)break;var r=l+1,mn=(r<hn&&hk[r]<hk[l])?r:l;if(hk[mn]>=lk)break;hk[j]=hk[mn];hv[j]=hv[mn];j=mn;}hk[j]=lk;hv[j]=lv;}
    if(d>dist[c])continue;if(maxD&&d>maxD)break;var cx=c%w,cy=(c/w)|0;
    for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;var nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=w||ny>=m.h)continue;var ni=ny*w+nx;if(!L.pass[ni])continue;if(!canStep(cx,cy,nx,ny))continue;
      var nd=d+(dx&&dy?1.4142:1);if(nd<dist[ni]){dist[ni]=nd;prev[ni]=c;push(nd,ni);}}}
  return F;}
function tilesTo(F,goal){var m=M(),out=[],c=goal,g=0;if(!isFinite(F.dist[goal]))return null;while(c>=0&&g++<5000){out.push(c);c=F.prev[c];}out.reverse();return out;}
// a straight walk between two points that doesn't clip a wall or a solid thing (checked on three parallel lines)
function losClear(ax,ay,bx,by){var dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy);if(len<1)return true;var nx=-dy/len,ny=dx/len;
  for(var o=-1;o<=1;o++){var ox=nx*o*11,oy=ny*o*11,pt=tileOf(ax+ox,ay+oy),steps=Math.ceil(len/8);
    for(var s=1;s<=steps;s++){var t=s/steps,q=tileOf(ax+ox+dx*t,ay+oy+dy*t);if(q[0]===pt[0]&&q[1]===pt[1])continue;
      if(Math.abs(q[0]-pt[0])>1||Math.abs(q[1]-pt[1])>1)return false;if(!canStep(pt[0],pt[1],q[0],q[1]))return false;pt=q;}}
  return true;}
function smoothPath(pts){if(pts.length<3)return pts;var out=[pts[0]],i=0;while(i<pts.length-1){var j=pts.length-1;while(j>i+1&&!losClear(pts[i][0],pts[i][1],pts[j][0],pts[j][1]))j--;out.push(pts[j]);i=j;}return out;}
// a path for someone standing at (x,y) to tile goal, ending at the point (ex,ey) if given
function pathFor(x,y,goalTile,ex,ey,F){var m=M(),st=tileOf(x,y);if(!F)F=flood(st[0],st[1]);var gi=goalTile[1]*m.w+goalTile[0],tl=tilesTo(F,gi);if(!tl)return null;
  var pts=[[x,y]];for(var k=1;k<tl.length;k++)pts.push([(tl[k]%m.w)*T+T/2,((tl[k]/m.w)|0)*T+T/2]);
  if(ex!=null){var cx=clamp(ex,goalTile[0]*T+14,goalTile[0]*T+T-14),cy=clamp(ey,goalTile[1]*T+16,goalTile[1]*T+T-10);if(pts.length>1)pts[pts.length-1]=[cx,cy];else pts.push([cx,cy]);}
  pts=smoothPath(pts);pts.shift();return pts;}
// the reachable walkable tile nearest to a world point
function nearestReachable(F,wx,wy,maxR){var m=M(),t=tileOf(wx,wy),best=-1,bd=1e9;maxR=maxR||5;
  for(var y=t[1]-maxR;y<=t[1]+maxR;y++)for(var x=t[0]-maxR;x<=t[0]+maxR;x++){if(x<0||y<0||x>=m.w||y>=m.h)continue;var i=y*m.w+x;if(!isFinite(F.dist[i]))continue;var d=Math.hypot((x+0.5)*T-wx,(y+0.5)*T-wy);if(d<bd){bd=d;best=i;}}
  return best<0?null:[best%m.w,(best/m.w)|0];}

// ----- Millie -----
var ME_SPEED=210;
function placeChars(){var m=M(),l=LS(),st=l.me&&passable(l.me.tx,l.me.ty)?[l.me.tx,l.me.ty]:(m.start||[Math.floor(m.w/2),Math.floor(m.h/2)]);
  if(!passable(st[0],st[1])){for(var i=0;i<m.g.length;i++)if(L.pass[i]){st=[i%m.w,(i/m.w)|0];break;}}
  L.me={x:st[0]*T+T/2,y:st[1]*T+T/2+8,dir:'down',moving:false,path:[],anim:0,act:null,idle:0,sit:null,speed:ME_SPEED};
  var dt=[[-1,0],[1,0],[0,1],[0,-1]].map(function(d){return [st[0]+d[0],st[1]+d[1]];}).filter(function(p){return passable(p[0],p[1])&&canStep(st[0],st[1],p[0],p[1]);})[0]||st;
  L.dog={x:dt[0]*T+T/2+(dt===st?24:0),y:dt[1]*T+T/2+8,face:1,dir:'side',st:'sit',anim:0,t:0,q:[],hop:0,idle:0,wt:3+Math.random()*4};L.trail=[];
  placeCat();}
function meStop(){var me=L.me;if(!me)return;me.path=[];me.moving=false;me.act=null;}
// walk to a tile; then do act()
function walkTo(goal,ex,ey,act,opt){var me=L.me;if(!me)return false;opt=opt||{};if(me.sit)standUp();var st=tileOf(me.x,me.y),F=flood(st[0],st[1]);
  if(!isFinite(F.dist[goal[1]*M().w+goal[0]])){var nr=nearestReachable(F,ex!=null?ex:(goal[0]+0.5)*T,ey!=null?ey:(goal[1]+0.5)*T,6);if(!nr)return false;goal=nr;ex=null;ey=null;}
  var p=pathFor(me.x,me.y,goal,ex,ey,F);if(!p)return false;me.path=p;me.act=act||null;me.speed=opt.speed||(L.tool==='mow'?150:ME_SPEED);me.sneak=!!opt.sneak;
  if(!p.length){me.moving=false;if(act){me.act=null;act();}return true;}
  if(!me.moving){me.moving=true;}
  if(L.watch){L.watch=null;}return true;}
// walk next to a thing and use it
function standTiles(o){var d=OBJ[o.k]||{},side=(d.use&&d.use.side)||'any',out=[],x,y;
  if(side==='here'){for(x=o.tx;x<o.tx+o.fw;x++)out.push([x,o.ty]);out.push([o.tx,o.ty+1]);return out;}
  if(side==='s'){for(x=o.tx;x<o.tx+o.fw;x++)out.push([x,o.ty+o.fh]);}
  if(side==='bank'){for(y=o.ty-2;y<=o.ty+2;y++)for(x=o.tx-2;x<=o.tx+2;x++)out.push([x,y]);return out;}
  for(y=o.ty-1;y<=o.ty+o.fh;y++)for(x=o.tx-1;x<=o.tx+o.fw;x++){if(x>=o.tx&&x<o.tx+o.fw&&y>=o.ty&&y<o.ty+o.fh)continue;if(side==='s'&&y<o.ty+o.fh)continue;out.push([x,y]);}
  return out;}
function goUse(o,fn,face){var me=L.me,m=M();if(!me)return;var st=tileOf(me.x,me.y),F=flood(st[0],st[1]),best=null,bd=1e9;
  standTiles(o).forEach(function(t){if(t[0]<0||t[1]<0||t[0]>=m.w||t[1]>=m.h)return;var d=F.dist[t[1]*m.w+t[0]];if(d<bd){bd=d;best=t;}});
  if(!best){toast('Can’t get there.');sfx('nope');return;}
  var cx=oX(o),cy=oBase(o),ex=(best[0]+0.5)*T,ey=(best[1]+0.5)*T;
  if(best[1]===o.ty+o.fh&&best[0]>=o.tx&&best[0]<o.tx+o.fw)ey=best[1]*T+20;
  walkTo(best,ex,ey,function(){faceTo(cx,cy-20);if(fn)fn(o);});}
function faceTo(x,y){var me=L.me;if(!me)return;var dx=x-me.x,dy=y-me.y;me.dir=Math.abs(dx)>Math.abs(dy)*1.1?(dx>0?'right':'left'):(dy>0?'down':'up');}
function sitOn(o){var me=L.me,s=objSprite(o);if(!me||!s)return;me.path=[];me.moving=false;me.sit={o:o,x:oX(o)+(s.seat?s.seat.x:0),y:oBase(o)+2};me.x=me.sit.x;me.y=me.sit.y;me.dir='down';me.idle=0;
  if(!LS().seen.bench){LS().seen.bench=1;toast('Sit still. Birds come closer.');}}
function standUp(){var me=L.me;if(!me||!me.sit)return;var o=me.sit.o;me.sit=null;me.x=clamp(me.x,o.tx*T+16,(o.tx+o.fw)*T-16);me.y=(o.ty+o.fh)*T+18;}
function stepMe(dt){var me=L.me;if(!me)return;
  if(me.moving&&me.path.length){var tgt=me.path[0],dx=tgt[0]-me.x,dy=tgt[1]-me.y,d=Math.hypot(dx,dy),sp=me.speed*(me.sneak?0.5:1)*dt;
    if(d<=sp){me.x=tgt[0];me.y=tgt[1];me.path.shift();}else{me.x+=dx/d*sp;me.y+=dy/d*sp;}
    if(d>0.5)me.dir=Math.abs(dx)>Math.abs(dy)*0.9?(dx>0?'right':'left'):(dy>0?'down':'up');
    me.anim+=dt*me.speed*(me.sneak?0.5:1)/15;me.idle=0;
    var lt=L.trail[L.trail.length-1];if(!lt||Math.hypot(lt[0]-me.x,lt[1]-me.y)>6){L.trail.push([me.x,me.y]);if(L.trail.length>400)L.trail.shift();}
    if(!me.path.length){me.moving=false;me.anim=0;var a=me.act;me.act=null;if(a)a();}}
  else{me.moving=false;me.idle+=dt;}}
// which picture of Millie: sets L.mfImg and L.mfIdx (no arrays made per frame)
function meFrame(){var me=L.me;if(me.sit){L.mfImg='millie2';L.mfIdx=2;return;}
  if(me.moving){var k=Math.floor(me.anim)%12;L.mfImg='millie';L.mfIdx=me.dir==='right'?1+k:me.dir==='left'?13+k:me.dir==='down'?26+k:39+k;return;}
  if(me.dir==='down'){L.mfImg='millie';L.mfIdx=0;}else if(me.dir==='up'){L.mfImg='millie';L.mfIdx=38;}else{L.mfImg='millie';L.mfIdx=me.lastV==='up'?38:0;}}

// ----- the dog follows Millie's footsteps -----
var DOG_GAP=92;
// The dog's love: hidden, 0 to 100, saved. Walking together and petting raise it slowly. More love means he follows longer,
// thinks of you more often when he's off on his own, and plays more.
function dogLove(){var l=LS();if(l.dogLove==null)l.dogLove=20;return l.dogLove;}
function addLove(n){var l=LS();l.dogLove=clamp(dogLove()+n*(1.1-dogLove()/110),0,100);}
// how long he stays with you before he loses interest (seconds): 25-50 s with a new dog, up to about 3 minutes at full love
function dogInterest(){var lv=dogLove();return 25+Math.random()*25+lv*1.3*(0.7+Math.random()*0.6);}
function dogBind(){var dg=L.dog;dg.bound=true;dg.left=dogInterest();}
function dogRejoin(){var dg=L.dog,me=L.me;if(!dg||!me)return;var gt=tileOf(me.x,me.y),p=pathFor(dg.x,dg.y,gt,me.x,me.y);dg.q=p||[];L.trail=[];dg.st='follow';dg.react=0;}
function trailLen(dg){var me=L.me,q=dg.q,t=L.trail,len=0,px=dg.x,py=dg.y;function add(x,y){len+=Math.hypot(x-px,y-py);px=x;py=y;}
  for(var i=0;i<q.length;i++)add(q[i][0],q[i][1]);for(var j=0;j<t.length;j++)add(t[j][0],t[j][1]);add(me.x,me.y);return len;}
// one step along a list of points; the legs keep pace with the speed. Returns true when the list is used up
function dogStep(dg,q,v,dt){if(!q.length)return true;var tg=q[0],dx=tg[0]-dg.x,dy=tg[1]-dg.y,d=Math.hypot(dx,dy),st=v*dt;
  if(d<=st){dg.x=tg[0];dg.y=tg[1];q.shift();}else{dg.x+=dx/d*st;dg.y+=dy/d*st;dogDir(dx,dy);}dg.anim+=dt*v/17;dg.run=true;return !q.length;}
function dogSettle(dg){dg.st='stand';dg.t=0;dg.wt=1.2+Math.random()*4;dg.run=false;faceDogTo(L.me.x);}
var DOG_RUN=360,DOG_TROT=150;
function stepDog(dt){var dg=L.dog,me=L.me;if(!dg||!me)return;dg.t+=dt;dg.run=false;if(dg.hop>0)dg.hop=Math.max(0,dg.hop-dt);
  if(dg.bound==null){dg.bound=true;dg.left=dogInterest();}
  var far=Math.hypot(dg.x-me.x,dg.y-me.y);
  // with you: count down the interest; walking together slowly grows his love
  if(dg.bound){dg.left-=dt;if(me.moving&&dg.st==='follow')addLove(dt*0.02);
    if(far>T*14){var b=L.trail[Math.max(0,L.trail.length-12)]||[me.x-30,me.y];dg.x=b[0];dg.y=b[1];dg.q=[];L.trail=L.trail.slice(-6);}
    if(dg.left<=0&&dg.st!=='play'&&dg.st!=='come'){dg.bound=false;dogWander(true);return;}}
  // you set off: he notices after a moment, not at once
  if(dg.bound&&me.moving&&dg.st!=='follow'&&dg.st!=='come'&&dg.st!=='play'){if(!dg.react)dg.react=0.15+Math.random()*(dg.st==='sit'?1.1:0.6);dg.react-=dt;if(dg.react<=0)dogRejoin();else return;}
  if(dg.st==='follow'){var R=trailLen(dg);
    if(R>DOG_GAP){var tgt=dg.q.length?[dg.q]:L.trail.length?[L.trail]:null,v=R>DOG_GAP+160?DOG_RUN:R>DOG_GAP+60?me.speed*1.45:me.speed*1.05;
      if(tgt)dogStep(dg,tgt[0],v,dt);else{var mx=me.x-dg.x,my=me.y-dg.y,md=Math.hypot(mx,my);dg.x+=mx/md*v*dt;dg.y+=my/md*v*dt;dogDir(mx,my);dg.anim+=dt*v/17;dg.run=true;}
      dg.idle=0;}
    else{dg.idle+=dt;
      // you stopped: he keeps going a step or two, then stands, then maybe sits
      if(!me.moving){if(!dg.lag)dg.lag=0.1+Math.random()*0.7;if(dg.idle>dg.lag){dg.lag=0;dogSettle(dg);}}}
    return;}
  if(dg.st==='come'){if(dogStep(dg,dg.q,DOG_RUN*1.1,dt)||Math.hypot(dg.x-me.x,dg.y-me.y)<DOG_GAP*0.8){dg.q=[];dogBind();dg.hop=0.5;puff('heart',dg.x,dg.y-56,1,{speed:0,up:26,life:1.1});if(me.moving)dogRejoin();else dogSettle(dg);}return;}
  if(dg.st==='play'){dogPlay(dt);return;}
  if(dg.st==='stand'){if(!dg.bound)dogMiss(dt);if(dg.st==='stand'&&dg.t>dg.wt){dg.st='sit';dg.t=0;dg.wt=4+Math.random()*7;}return;}
  if(dg.st==='sit'){
    if(dg.bound){if(dg.t>dg.wt&&me.idle>2&&!me.sit){dg.t=0;dg.wt=4+Math.random()*7;var r=Math.random(),lv=dogLove();
      if(r<0.12+lv*0.0025)dogPlayStart();else if(r<0.5)dogWander(false);}}
    else dogMiss(dt);
    return;}
  if(dg.st==='wander'){if(dogStep(dg,dg.q,dg.bound?DOG_TROT:DOG_TROT*1.15,dt)){dg.st='sniff';dg.t=0;dg.wt=1.6+Math.random()*2.5;}return;}
  if(dg.st==='sniff'){if(dg.t>dg.wt){if(dg.bound){var gt=tileOf(me.x,me.y),side=[[-1,0],[1,0],[0,1]].map(function(o){return [gt[0]+o[0],gt[1]+o[1]];}).filter(function(p){return passable(p[0],p[1]);})[0]||gt;
      dg.q=pathFor(dg.x,dg.y,side,(side[0]+0.5)*T+(side[0]<gt[0]?14:-14),(side[1]+0.5)*T+8)||[];dg.st='back';}
    else{var r2=Math.random();if(r2<0.45)dogWander(true);else{dg.st=r2<0.7?'stand':'sit';dg.t=0;dg.wt=3+Math.random()*8;}}}
    if(!dg.bound)dogMiss(dt);return;}
  if(dg.st==='back'){if(dogStep(dg,dg.q,DOG_TROT*1.4,dt))dogSettle(dg);return;}}
// on his own he thinks of you now and then, more often the more he loves you, and runs over from wherever he is
function dogMiss(dt){var dg=L.dog;dg.miss=(dg.miss||0)+dt;if(dg.miss<3)return;dg.miss=0;var lv=dogLove(),far=Math.hypot(dg.x-L.me.x,dg.y-L.me.y);
  if(Math.random()<0.03+lv*0.0035+(far>T*10?0.02:0))dogCome();}
function dogCome(){var dg=L.dog,me=L.me,gt=tileOf(me.x,me.y),p=pathFor(dg.x,dg.y,gt,me.x+(dg.x<me.x?-40:40),me.y+6);if(!p){dg.x=me.x-40;dg.y=me.y;dogBind();dogSettle(dg);return;}dg.q=p;dg.st='come';dg.t=0;}
// zoomies: a few quick dashes left and right, then he flops down
function dogPlayStart(){var dg=L.dog;dg.st='play';dg.pn=3+Math.floor(Math.random()*7);dg.pdir=Math.random()<0.5?-1:1;dg.ptx=null;dg.t=0;dg.pwait=0;}
// zoomies: every dash is different. Mostly short darts, some medium runs, now and then a long sprint; the speed changes
// a little each time, and he sometimes stops dead for a beat before turning
function dashLen(){var r=Math.random();return T*(r<0.4?0.35+Math.random()*0.6:r<0.78?1+Math.random()*1.2:2.4+Math.random()*2.8);}
function dogPlay(dt){var dg=L.dog;
  if(dg.pwait>0){dg.pwait-=dt;dg.run=false;return;}
  if(dg.ptx==null){if(dg.pn<=0){dg.st='stand';dg.t=0;dg.wt=0.8+Math.random()*1.8;return;}
    var len=dashLen(),tx,t,ok=false;
    for(var tries=0;tries<6&&!ok;tries++){tx=dg.x+dg.pdir*len;t=tileOf(tx,dg.y);if(passable(t[0],t[1])&&losClear(dg.x,dg.y,tx,dg.y))ok=true;else if(tries===2)dg.pdir=-dg.pdir;else len*=0.6;}
    if(!ok||len<T*0.3){dg.pn=0;return;}
    dg.ptx=tx;dg.pty=dg.y+(Math.random()-0.5)*(len>T*2?36:18);dg.psp=DOG_RUN*(0.75+Math.random()*0.55)*(len<T?0.85:1);dg.pn--;dg.dir='side';}
  var q=[[dg.ptx,dg.pty]];dogStep(dg,q,dg.psp||DOG_RUN,dt);dg.dir='side';
  if(!q.length){dg.ptx=null;dg.pdir=-dg.pdir;var r=Math.random();if(r<0.3)dg.hop=0.35;else if(r<0.55)dg.pwait=0.15+Math.random()*0.6;}}
function faceDogTo(x){var dg=L.dog;if(Math.abs(x-dg.x)>4)dg.face=x>dg.x?1:-1;}
function dogDir(dx,dy){var dg=L.dog,ax=Math.abs(dx),ay=Math.abs(dy);if(ax>1)dg.face=dx>0?1:-1;if(ax<0.5&&ay<0.5)return;
  if(dg.dir!=='down'&&dg.dir!=='up'){if(ay>ax*1.25)dg.dir=dy>0?'down':'up';}
  else if(ax>ay*1.25)dg.dir='side';else dg.dir=dy>0?'down':'up';}
function dogWander(far){var dg=L.dog,me=L.me,st=tileOf(dg.x,dg.y),R=far?9:4.5,F=flood(st[0],st[1],R),m=M(),c=[];
  for(var i=0;i<F.dist.length;i++){if(F.dist[i]>=(far?3:1.5)&&F.dist[i]<=R){var x=i%m.w,y=(i/m.w)|0;if(far||Math.hypot((x+0.5)*T-me.x,(y+0.5)*T-me.y)<T*4)c.push([x,y]);}}
  if(!c.length){dg.st='sit';dg.t=0;dg.wt=3+Math.random()*5;return;}var g=pick(c),p=pathFor(dg.x,dg.y,g,(g[0]+0.2+Math.random()*0.6)*T,(g[1]+0.3+Math.random()*0.5)*T,F);if(!p||!p.length){dg.st='sit';dg.t=0;dg.wt=3;return;}dg.q=p;dg.st='wander';}
function dogFrame(){var dg=L.dog;if(dg.hop>0)return 13;var d=(MF.dog&&MF.dog.n>=32)?dg.dir:'side';
  if(dg.run){if(d==='down')return 14+Math.floor(dg.anim*0.75)%8;if(d==='up')return 22+Math.floor(dg.anim*0.75)%8;return Math.floor(dg.anim)%13;}
  if(dg.st==='sit')return 13;return d==='down'?30:d==='up'?31:0;}
function petDog(){var dg=L.dog;if(!dg)return;var t0=L.lastPet||0,nw=performance.now();addLove(nw-t0>4000?1.2:0.3);L.lastPet=nw;if(!dg.bound){dogBind();dg.q=[];dogSettle(dg);}else dg.left=Math.max(dg.left,dogInterest()*0.6);if(dg.st!=='play'&&Math.random()<0.15+dogLove()*0.003){dogPlayStart();}dg.hop=0.5;puff('heart',dg.x,dg.y-56,1,{speed:0,up:26,life:1.1});sfx('pop',{v:0.6});if(!LS().seen.dog){LS().seen.dog=1;}}

// ----- Pierre, Puti's cat: naps, strolls, and stands at the tank pawing at the glass. The dog leaves him alone -----
function catRoom(){var rs=M().rooms;for(var i=0;i<rs.length;i++)if(rs[i].back!==false)return rs[i];return M().catArea||null;}
function catTiles(){var r=catRoom(),out=[];if(!r)return out;for(var y=r.y;y<r.y+r.h;y++)for(var x=r.x;x<r.x+r.w;x++)if(passable(x,y))out.push([x,y]);return out;}
function placeCat(){var r=catRoom();if(!r){L.cat=null;return;}var sofa=objsOf('sofa').filter(function(o){return inRoom(r,o.tx,o.ty);})[0];
  L.cat={x:(r.x+r.w-2)*T+T/2,y:(r.y+1)*T+40,face:-1,st:'nap',t:0,dur:8+Math.random()*14,anim:0,q:[],hop:0,on:null};
  if(sofa&&Math.random()<0.6)catOnSofa(sofa);else{var sun=catSunSpot();if(sun){L.cat.x=sun[0];L.cat.y=sun[1];}}}
function catSunSpot(){var r=catRoom();if(!r||!r.windows||!r.windows.length)return null;var w=pick(r.windows),x=(w.x+w.w/2)*T+T*0.4,y=r.y*T+T*0.9,t=tileOf(x,y);return passable(t[0],t[1])?[x,y]:null;}
function catOnSofa(sofa){var c=L.cat,s=objSprite(sofa);c.on=sofa;c.x=oX(sofa)+(s&&s.seat?s.seat.x:-30)+Math.round((Math.random()-0.5)*40);c.y=oBase(sofa)-24;c.st='nap';c.t=0;c.dur=12+Math.random()*20;}
function catGo(tile,ex,ey,then){var c=L.cat;var p=pathFor(c.x,c.y,tile,ex,ey);if(!p){then&&then(false);return;}c.q=p;c.st='walk';c.then=then;}
function catDecide(){var c=L.cat,r=catRoom();if(!c||!r)return;var roll=Math.random(),tanks=objsOf('tank').filter(function(o){return inRoom(r,o.tx,o.ty)&&S.tanks[o.i];});
  if(roll<0.3&&tanks.length){var tk=pick(tanks),gx=tk.tx+Math.floor(Math.random()*tk.fw),gt=[gx,tk.ty+tk.fh];if(!passable(gt[0],gt[1]))return catIdle();
    catGo(gt,(gx+0.5)*T,gt[1]*T+18,function(ok){if(!ok)return catIdle();c.x=(gx+0.5)*T;c.y=oBase(tk)+6;c.st='paw';c.t=0;c.dur=5+Math.random()*5;c.tank=tk;});return;}
  if(roll<0.55){var sofa=objsOf('sofa').filter(function(o){return inRoom(r,o.tx,o.ty);})[0];if(sofa){var ft=[sofa.tx+1,sofa.ty+1];if(passable(ft[0],ft[1])){catGo(ft,(ft[0]+0.5)*T,ft[1]*T+16,function(ok){if(!ok)return catIdle();c.hop=0.35;catOnSofa(sofa);});return;}}}
  if(roll<0.7){var sun=catSunSpot();if(sun){var stl=tileOf(sun[0],sun[1]);catGo(stl,sun[0],sun[1],function(){c.st='nap';c.t=0;c.dur=14+Math.random()*20;});return;}}
  var ts=catTiles();if(!ts.length)return catIdle();var t=pick(ts);catGo(t,(t[0]+0.2+Math.random()*0.6)*T,(t[1]+0.4+Math.random()*0.4)*T,function(){c.st='sit';c.t=0;c.dur=3+Math.random()*5;});}
function catIdle(){var c=L.cat;c.st='sit';c.t=0;c.dur=3+Math.random()*4;}
function stepCat(dt){var c=L.cat;if(!c)return;c.anim+=dt;if(c.hop>0)c.hop=Math.max(0,c.hop-dt);if(c.reach>0){c.reach=Math.max(0,c.reach-dt);return;}c.t+=dt;
  if(c.st==='walk'){if(c.on){var f=c.on;c.on=null;c.x=clamp(c.x,f.tx*T+10,(f.tx+f.fw)*T-10);c.y=(f.ty+f.fh)*T+16;}
    if(c.q.length){var tg=c.q[0],dx=tg[0]-c.x,dy=tg[1]-c.y,d=Math.hypot(dx,dy),v=52*dt;if(d<=v){c.x=tg[0];c.y=tg[1];c.q.shift();}else{c.x+=dx/d*v;c.y+=dy/d*v;if(Math.abs(dx)>0.5)c.face=dx>0?1:-1;}}
    else{var th=c.then;c.then=null;c.st='sit';c.t=0;c.dur=2;if(th)th(true);}return;}
  if(c.t>c.dur){if(c.st==='nap'){c.st='sit';c.t=0;c.dur=2+Math.random()*2;return;}if(c.st==='paw'){c.tank=null;}catDecide();}}
function catFrame(){var c=L.cat,p='sit',f=0;if(c.reach>0)p='reach';else if(c.hop>0)p='sit';else if(c.st==='walk'){p='walk';f=Math.floor(c.anim*7)%4;}else if(c.st==='nap'){p='nap';f=Math.floor(c.anim/1.6)%2;}else if(c.st==='paw'){p='paw';f=Math.floor(c.anim/0.35)%2;}else f=(c.anim%4)<0.18?1:0;L.cfPose=p;L.cfIdx=f;}
function petCat(){var c=L.cat;if(!c)return;if(c.on||c.st==='walk'||c.st==='paw'){c.hop=0.45;}else{c.reach=1.4;}if(c.st==='nap'){c.st='sit';c.t=0;c.dur=2.5;}puff('heart',c.x,c.y-(c.reach>0?100:c.on?44:56),1,{speed:0,up:26,life:1.1});sfx('pop',{v:0.5});if(!LS().seen.cat){LS().seen.cat=1;toast('Pierre likes that.');}}

// ----- camera: follows Millie softly -----
// The camera keeps to the part of the map that has something on it, so the dark outside of a flat only
// shows as an even frame when the room is narrower than the screen (like the frames on Puti's room drawings).
function contentBox(m){if(L.cbM===m&&L.cbN===m.g.length)return L.cb;var x0=m.w,y0=m.h,x1=-1,y1=-1;for(var y=0;y<m.h;y++)for(var x=0;x<m.w;x++)if(m.g[y*m.w+x]!==G_VOID){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  L.cbM=m;L.cbN=m.g.length;L.cb=x1<0?{x0:0,y0:0,x1:m.w*T,y1:m.h*T}:{x0:x0*T,y0:y0*T,x1:(x1+1)*T,y1:(y1+1)*T};return L.cb;}
function clampCam(){var m=M(),b=contentBox(m),W=b.x1-b.x0,H=b.y1-b.y0;if(W<=L.VW)L.cam.x=b.x0+(W-L.VW)/2;else L.cam.x=clamp(L.cam.x,b.x0,b.x1-L.VW);if(H<=L.VH)L.cam.y=b.y0+(H-L.VH)/2;else L.cam.y=clamp(L.cam.y,b.y0,b.y1-L.VH);}
function camFocus(wx,wy){L.cam.x=wx-L.VW/2;L.cam.y=wy-L.VH/2;clampCam();}
function stepCam(dt){var me=L.me;L.camMoving=false;if(!me||L.camFree)return;var ox=L.cam.x,oy=L.cam.y,tx=me.x-L.VW/2,ty=me.y-40-L.VH/2,k=1-Math.exp(-dt*5);L.cam.x+=(tx-L.cam.x)*k;L.cam.y+=(ty-L.cam.y)*k;clampCam();
  if(Math.round(L.cam.x)!==Math.round(ox)||Math.round(L.cam.y)!==Math.round(oy))L.camMoving=true;else if(Math.abs(L.cam.x-ox)+Math.abs(L.cam.y-oy)<0.02){L.cam.x=ox;L.cam.y=oy;}}

// ----- birds: they come to spots that suit them, closer when Millie keeps still -----
function computeSpots(){var m=M(),sp=[],hab={},shortN=0,longN=0,me=L.me;
  for(var ty=0;ty<m.h;ty++)for(var tx=0;tx<m.w;tx++){var i=mi(m,tx,ty),g=m.g[i];if(!isGrass(g))continue;if(!L.pass||!L.pass[i])continue;var h=m.gh[i];
    if(h<0.3){shortN++;if(hash2(tx,ty,S.lastDay)<0.16)sp.push({t:'lawn',x:tx*T+14+hash2(tx,ty,9)*36,y:ty*T+18+hash2(tx,ty,8)*36});}
    if(h>0.7){longN++;if(g===G_MEADOW&&hash2(tx,ty,S.lastDay+3)<0.05)sp.push({t:'meadow',x:tx*T+32,y:ty*T+40});}}
  hab.short=shortN>=6;hab.long=longN>=10;
  LS().objs.forEach(function(o){var s;
    if(o.k==='feeder'&&(o.s||0)>0.04&&(s=objSprite(o))){s.perch.forEach(function(p,j){sp.push({t:'feeder',x:oX(o)+p[0],y:oBase(o)+p[1],o:o,j:j});});
      if(o.v!=='hang')for(var g2=0;g2<3;g2++)sp.push({t:'ground',x:oX(o)-26+g2*26,y:oBase(o)+6+(g2%2)*6,o:o});}
    if(o.k==='wfeeder'&&(o.s||0)>0.04){var wp=wfeederPos(o);sp.push({t:'feeder',x:wp[0]-9,y:wp[1]-11,o:o,win:1});sp.push({t:'feeder',x:wp[0]+9,y:wp[1]-11,o:o,win:1});}
    if(o.k==='fence'&&hash2(o.tx,o.ty,4)<0.3)sp.push({t:'fence',x:oX(o),y:oBase(o)-44});
    // a bench: birds come and peck about right in front of it
    if(o.k==='bench'){for(var bq=0;bq<4;bq++){var bxx=oX(o)-60+bq*40,byy=oBase(o)+40+(bq%2)*26;if(passable(Math.floor(bxx/T),Math.floor(byy/T)))sp.push({t:bq<2?'ground':'lawn',x:bxx,y:byy,bench:1});}}
    if(o.k==='olive'){sp.push({t:'tree',x:oX(o)-46,y:oBase(o)-120});sp.push({t:'tree',x:oX(o)+40,y:oBase(o)-140});sp.push({t:'tree',x:oX(o)+6,y:oBase(o)-160});hab.treeN=(hab.treeN||0)+1;}
    if(o.k==='oak'){sp.push({t:'tree',x:oX(o)+(hash2(o.tx,o.ty,3)<0.5?-18:16),y:oBase(o)-62});hab.treeN=(hab.treeN||0)+1;}
    if(o.k==='flowers'||o.k==='pot'||(o.k==='bush'&&(o.v===1||o.v===2)&&!o.hedge)){sp.push({t:'flowers',x:oX(o),y:oBase(o)-28,hover:1});hab.flowers=true;}
    if(o.k==='birdbath'&&(s=objSprite(o))){s.rim.forEach(function(p){sp.push({t:'water',x:oX(o)+p[0],y:oBase(o)+p[1]});});hab.water=true;}
    if(o.k==='rock'&&o.deco&&isStreamNear(o.tx,o.ty))sp.push({t:'water',x:oX(o),y:oBase(o)-16,rock:1});});
  hab.trees=(hab.treeN||0)>=3;hab.fence=stageHas('fence');
  for(var y2=0;y2<m.h;y2++)for(var x2=0;x2<m.w;x2++){var g3=mget(m,x2,y2);
    if(g3===G_WATER&&waterKind(x2,y2)!==W_SEA){hab.water=true;var edge=[[1,0],[-1,0],[0,1],[0,-1]].some(function(d){var q=mget(m,x2+d[0],y2+d[1]);return q!==G_WATER&&q!==G_VOID;});if(edge&&hash2(x2,y2,5)<0.3)sp.push({t:'water',x:x2*T+T/2,y:y2*T+T/2+8,wade:1});}
    if((g3===G_STEP||g3===G_STONE)&&hash2(x2,y2,6)<0.25)sp.push({t:'path',x:x2*T+T/2,y:y2*T+T/2+10});}
  hab.stream=!!m.stream;hab.seed=LS().objs.some(function(o){return (o.k==='feeder'||o.k==='wfeeder')&&(o.s||0)>0.04;});
  L.spots=sp;L.hab=hab;}
function isStreamNear(tx,ty){for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++)if(isStream(tx+dx,ty+dy))return true;return false;}
function wfeederPos(o){var r=mainRoom();return [oX(o),(r?r.y:o.ty)*T-30];}
var BIRD_CAP=[2,3,5,7];
function spotOK(B,s){if(s.t==='feeder'){if(B.where.indexOf('feeder')<0)return false;return !s.win||B.id==='sparrow'||B.id==='bulbul';}
  if(B.where.indexOf(s.t)<0)return false;if(B.id==='heron')return !!s.wade;if(B.id==='kingfisher')return !!(s.rock||s.wade);return true;}
function meStill(){var me=L.me;return me&&!me.moving&&(me.sit||me.idle>1.6);}
function spawnBird(){var hab=L.hab,me=L.me,sit=me&&me.sit,cap=(BIRD_CAP[S.stage]||3)+(sit?2:0);if(L.birds.length>=cap)return;
  var cand=[],rareOut=L.birds.some(function(b){return BIRD[b.sp]&&BIRD[b.sp].rare;});BIRDS.forEach(function(B){if(S.stage<B.stage)return;if(B.need&&!hab[B.need])return;if(B.rare&&rareOut)return;
    var free=L.spots.filter(function(s){return spotOK(B,s)&&!L.birds.some(function(b){return b.spot===s;})&&!(me&&Math.hypot(s.x-me.x,s.y-me.y)<(sit?40:70));});
    if(!free.length)return;var w=B.rare?B.w:B.w*(free.some(function(s){return s.t==='feeder'||s.t==='ground';})?2.5:1);cand.push({B:B,free:free,w:w});});
  if(!cand.length)return;var rc=cand.filter(function(c){return c.B.rare;}),cc=cand.filter(function(c){return !c.B.rare;});cand=(rc.length&&(Math.random()<0.05||!cc.length))?rc:(cc.length?cc:rc);
  var tot=cand.reduce(function(a,c){return a+c.w;},0),r=Math.random()*tot,c=cand[0];for(var i=0;i<cand.length;i++){r-=cand[i].w;if(r<=0){c=cand[i];break;}}
  // when she keeps still, spots near her win
  var ws=c.free.map(function(s){var d=me?Math.hypot(s.x-me.x,s.y-me.y):9999,near=meStill()?(sit?5:3)*Math.exp(-d/(T*3)):0;return (inView(s.x,s.y,-10)?1:0.25)+near;}),wt=ws.reduce(function(a,b){return a+b;},0),q=Math.random()*wt,spot=c.free[0];
  for(var k=0;k<ws.length;k++){q-=ws[k];if(q<=0){spot=c.free[k];break;}}
  var from=spot.win?{x:spot.x+(Math.random()<0.5?-60:60),y:spot.y-40}:{x:L.cam.x+(Math.random()<0.5?-40:L.VW+40),y:L.cam.y+Math.random()*L.VH*0.5-30};
  L.birds.push({sp:c.B.id,x:from.x,y:from.y,fx:from.x,fy:from.y,spot:spot,st:'in',t:0,dur:1.2+Math.random()*0.9,stay:12+Math.random()*20,face:spot.x>from.x?1:-1,ph:Math.random()*9,peckT:0,win:!!spot.win});
  if(Math.random()<0.6)sfx('chirp',{v:0.7});}
function birdOut(b,fast){if(b.st==='out'||b.st==='flee')return;b.st=fast?'flee':'out';b.t=0;b.fx=b.x;b.fy=b.y;b.dur=fast?0.8:1.5;
  var tx=b.win?b.x+(Math.random()<0.5?-70:70):L.cam.x+(Math.random()<0.5?-80:L.VW+80),ty=b.win?b.y-50:L.cam.y-60-Math.random()*60;b.tx=tx;b.ty=ty;b.face=tx>b.x?1:-1;if(fast)sfx('flap',{v:0.6});
  if(L.watch&&L.watch.b===b)L.watch=null;}
function stepBirds(dt){var me=L.me,dg=L.dog;L.spawnT+=dt;var still=meStill(),per=me&&me.sit?0.6:still?0.9:1.3;
  if(L.spawnT>per){L.spawnT=0;var p=(L.hab.seed?0.5:0.24)*(me&&me.sit?1.6:1);if(Math.random()<p)spawnBird();}
  for(var bi=0;bi<L.birds.length;bi++){var b=L.birds[bi];b.t+=dt;b.ph+=dt;
    if(b.st==='in'){var k=clamp(b.t/b.dur,0,1),e=1-Math.pow(1-k,2);b.x=lerp(b.fx,b.spot.x,e);b.y=lerp(b.fy,b.spot.y,e)-Math.sin(k*Math.PI)*40;if(k>=1){b.st='stay';b.t=0;}}
    else if(b.st==='stay'){if(b.spot.hover){b.x=b.spot.x+Math.sin(b.ph*3)*5;b.y=b.spot.y+Math.sin(b.ph*5)*3;}
      b.peckT-=dt;if(b.peckT<=0){b.peck=!b.peck&&(b.spot.t==='feeder'||b.spot.t==='ground'||b.spot.t==='lawn'||b.spot.t==='path'||b.spot.t==='meadow');b.peckT=b.peck?0.6+Math.random()*1.2:0.8+Math.random()*2;
        if(b.peck&&b.spot.t==='feeder'&&b.spot.o)b.spot.o.s=Math.max(0,(b.spot.o.s||0)-0.006);if(!b.peck&&Math.random()<0.3)b.face=-b.face;
        if(!b.peck&&(b.spot.t==='lawn'||b.spot.t==='ground'||b.spot.t==='meadow')&&Math.random()<0.4){var nx=b.spot.x+(Math.random()-0.5)*30,ny=b.spot.y+(Math.random()-0.5)*12,nt=tileOf(nx,ny);if(passable(nt[0],nt[1])){b.spot={t:b.spot.t,x:nx,y:ny,o:b.spot.o};b.x=nx;b.y=ny;}}}
      var watched=L.watch&&L.watch.b===b;
      if(!watched&&me&&me.moving&&!me.sneak&&!b.win&&Math.hypot(b.x-me.x,b.y-me.y)<T*2.2)birdOut(b,true);
      else if(!watched&&dg&&dg.run&&!b.win&&Math.hypot(b.x-dg.x,b.y-dg.y)<T*1.5)birdOut(b,true);
      else if(b.t>b.stay&&!watched)birdOut(b);
      else if(b.spot.t==='feeder'&&b.spot.o&&(b.spot.o.s||0)<=0.02&&!watched)birdOut(b);}
    else{var k2=clamp(b.t/b.dur,0,1);b.x=lerp(b.fx,b.tx,k2);b.y=lerp(b.fy,b.ty,k2*k2);if(k2>=1)b.gone=true;}}
  compact(L.birds,'gone');}
function compact(a,flag){var n=0;for(var i=0;i<a.length;i++){if(!a[i][flag])a[n++]=a[i];}a.length=n;}
function birdPose(b){if(b.st!=='stay'||b.spot.hover)return animFrame('birds',b.sp,'fly',b.ph,12);if(b.peck)return animFrame('birds',b.sp,Math.sin(b.ph*0.9)>-0.3?'peck':'hop',b.ph,8);return animFrame('birds',b.sp,'idle',b.ph,4);}
function hitBird(wx,wy){var best=null,bd=34;L.birds.forEach(function(b){if(b.st!=='stay'&&b.st!=='in')return;var d=Math.hypot(b.x-wx,b.y-10-wy);if(d<bd){bd=d;best=b;}});return best;}
function watchBird(b){var me=L.me;if(me&&me.moving){me.path=[];me.moving=false;me.act=null;}L.watch={b:b,t:0};b.stay=Math.max(b.stay,b.t+3);faceTo(b.x,b.y);sfx('click');
  if(!LS().seen.watch)LS().seen.watch=1;}
function stepWatch(dt){var w=L.watch;if(!w)return;var b=w.b,me=L.me;if(!b||b.st==='out'||b.st==='flee'||b.gone||(me&&me.moving)){L.watch=null;return;}
  w.t+=dt;if(w.t>=1.5){var B=BIRD[b.sp];LS().stats.birds++;var isNew=bookAdd('birds',b.sp,{where:STAGES[S.stage].name});if(!isNew){showLabel(B.name,b.x,b.y-30);sfx('chirp');}L.watch=null;b.stay=Math.max(b.stay,b.t+4);L.dirty=true;updateStat(true);}}

// ----- hens in the garden, wild chickens out on the land -----
function areaPx(a){return a?{x0:a.x0*T,y0:a.y0*T,x1:(a.x1+1)*T,y1:(a.y1+1)*T}:null;}
function henArea(){if(L.henPx!==undefined)return L.henPx;var a=M().henArea,c=objsOf('coop')[0];if(!a&&c){var m=M();a={x0:Math.max(0,c.tx-3),y0:Math.max(0,c.ty-1),x1:Math.min(m.w-1,c.tx+c.fw+2),y1:Math.min(m.h-1,c.ty+c.fh+3)};}return (L.henPx=areaPx(a));}
function dryAt(x,y){var r=T*0.42;for(var k=0;k<5;k++){var px=x+(k===1?-r:k===2?r:0),py=y+(k===3?-r:k===4?r*0.6:0),t=tileOf(px,py);if(!passable(t[0],t[1])||waterKind(t[0],t[1]))return false;}return true;}
function randIn(a){for(var k=0;k<40;k++){var x=a.x0+12+Math.random()*(a.x1-a.x0-24),y=a.y0+12+Math.random()*(a.y1-a.y0-24);if(dryAt(x,y))return [x,y];}return [(a.x0+a.x1)/2,(a.y0+a.y1)/2];}
function syncAgents(){var a=henArea(),coop=objsOf('coop')[0];L.wildPx=areaPx(M().wildArea);L.henPx=a;
  LS().hens.forEach(function(h){if(!L.henA[h.id]&&a){var p=coop?[oX(coop)+(Math.random()-0.5)*80,oBase(coop)+30+Math.random()*30]:randIn(a);var t=tileOf(p[0],p[1]);if(!passable(t[0],t[1]))p=randIn(a);
    L.henA[h.id]={id:h.id,kind:h.kind,x:p[0],y:p[1],st:'idle',t:0,dur:1,face:1,ph:Math.random()*9,tx:p[0],ty:p[1],cl:8+Math.random()*30};}});
  Object.keys(L.henA).forEach(function(id){if(!LS().hens.some(function(h){return h.id===id;}))delete L.henA[id];});
  var w=areaPx(M().wildArea);LS().wild.forEach(function(h){if(!L.wildA[h.id]&&w){var p=randIn(w);L.wildA[h.id]={id:h.id,kind:h.kind||'wild',x:p[0],y:p[1],st:'idle',t:0,dur:1,face:1,ph:Math.random()*9,tx:p[0],ty:p[1],wild:1};}});
  Object.keys(L.wildA).forEach(function(id){if(!LS().wild.some(function(h){return h.id===id;}))delete L.wildA[id];});
  // fish kept in your pond
  var m=M(),pond=[];for(var y=0;y<m.h;y++)for(var x=0;x<m.w;x++)if(waterKind(x,y)===W_POND)pond.push([x,y]);L.pondTiles=pond;
  while(L.fishA.length>LS().pond.length)L.fishA.pop();
  while(L.fishA.length<LS().pond.length&&pond.length){var pt=pick(pond),f=LS().pond[L.fishA.length];L.fishA.push({kind:f.kind,len:f.len,x:pt[0]*T+T/2,y:pt[1]*T+T/2,a:Math.random()*6.28,ph:Math.random()*9});}}
function nearestGrain(c,r){var best=null,bd=r*r;L.grain.forEach(function(g){var d=(g.x-c.x)*(g.x-c.x)+(g.y-c.y)*(g.y-c.y);if(d<bd){bd=d;best=g;}});return best;}
function chickGo(c,x,y,area){if(!dryAt(x,y)){var p=randIn(area);x=p[0];y=p[1];}c.tx=clamp(x,area.x0+8,area.x1-8);c.ty=clamp(y,area.y0+8,area.y1-8);}
function stepChick(c,dt,area){c.t+=dt;c.ph+=dt;var me=L.me,dm=me?Math.hypot(c.x-me.x,c.y-me.y):1e9,g=nearestGrain(c,c.wild?T*8:T*5);
  function move(sp){var dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy);if(d<3)return true;var nx=c.x+dx/d*sp*dt,ny=c.y+dy/d*sp*dt;if(dryAt(nx,ny)||!dryAt(c.x,c.y)&&passable(Math.floor(nx/T),Math.floor(ny/T))){c.x=nx;c.y=ny;}else{c.st='idle';c.t=0;c.dur=0.6;return true;}if(Math.abs(dx)>0.5)c.face=dx>0?1:-1;return false;}
  if(c.st==='run'){if(move(96)||c.t>c.dur){c.st='idle';c.t=0;c.dur=1+Math.random()*2;}return;}
  if(c.st==='flap'){if(c.t>0.6){c.st='idle';c.t=0;c.dur=0.6;}return;}
  // wild ones keep away from Millie, unless they're busy with grain and she's creeping up
  if(c.wild&&me){var busy=c.st==='eat'||(c.ate&&L.rt-c.ate<2.5&&L.grain.length>0),scare=busy?(me.moving&&!me.sneak&&dm<T*1.3):(dm<T*(me.moving&&!me.sneak?3:1.6));
    if(scare){var ax=c.x-me.x,ay=c.y-me.y,ad=Math.hypot(ax,ay)||1;c.st='run';c.t=0;c.dur=1.6;chickGo(c,c.x+ax/ad*T*2.4,c.y+ay/ad*T*1.6,area);if(!c.ranOnce){c.ranOnce=1;sfx('flap',{v:0.5});}return;}}
  if(g&&!(c.wild&&me&&Math.hypot(g.x-me.x,g.y-me.y)<T*1.8&&!me.sneak&&c.st!=='eat')){var dx2=g.x-c.x,dy2=g.y-c.y,d2=Math.hypot(dx2,dy2);
    if(d2<12){c.st='eat';c.ate=L.rt;c.eatT=(c.eatT||0)+dt;c.face=dx2>=0?1:-1;if(c.eatT>1.1){c.eatT=0;g.gone=true;compact(L.grain,'gone');}return;}
    c.st='walk';grainStep(c,g);move(c.wild?24:32);return;}
  if(c.st==='eat')c.st='idle';
  if(c.st==='walk'){if(move(26)){c.st=Math.random()<0.6?'peck':'idle';c.t=0;c.dur=1+Math.random()*2.5;}}
  else if(c.t>c.dur){var p2=randIn(area);if(Math.hypot(p2[0]-c.x,p2[1]-c.y)>T*3.4){p2=[c.x+(p2[0]-c.x)*0.4,c.y+(p2[1]-c.y)*0.4];}chickGo(c,p2[0],p2[1],area);c.st='walk';c.t=0;}
  if(!c.wild){c.cl-=dt;if(c.cl<=0){c.cl=20+Math.random()*40;if(inView(c.x,c.y))sfx('cluck',{v:0.5});}}}
// toward the grain round whatever is in the way: follow the walking distance from where it landed
function grainStep(c,g){var F=L.grainField,m=M(),w=m.w,tx=Math.floor(c.x/T),ty=Math.floor(c.y/T),gx=Math.floor(g.x/T),gy=Math.floor(g.y/T);
  if(!F||(Math.abs(tx-gx)<=1&&Math.abs(ty-gy)<=1)){c.tx=g.x-(g.x>c.x?5:-5);c.ty=g.y;return;}
  var best=-1,bv=F[ty*w+tx];for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;var nx=tx+dx,ny=ty+dy;if(nx<0||ny<0||nx>=w||ny>=m.h)continue;var v=F[ny*w+nx];if(v<bv&&canStep(tx,ty,nx,ny)){bv=v;best=ny*w+nx;}}
  if(best<0){c.tx=g.x;c.ty=g.y;return;}c.tx=(best%w)*T+T/2;c.ty=((best/w)|0)*T+T/2+8;}
function chickPose(c){var n=HEN_SHEET[c.kind]||'white';if(c.st==='walk')return animFrame('hens',n,'walk',c.ph,8);if(c.st==='run'||c.st==='flap')return animFrame('hens',n,'run',c.ph,14);if(c.st==='peck'||c.st==='eat')return animFrame('hens',n,'peck',c.ph,7);return animFrame('hens',n,'idle',c.ph,3);}
function hitChick(wx,wy,list,r){var best=null,bd=r;Object.keys(list).forEach(function(k){var c=list[k],d=Math.hypot(c.x-wx,c.y-16-wy);if(d<bd){bd=d;best=c;}});return best;}

// ----- particles -----
function puff(kind,x,y,n,o){o=o||{};for(var i=0;i<n;i++){var a=Math.random()*6.283,s=(o.speed||40)*(0.4+Math.random());L.parts.push({k:kind,x:x,y:y,vx:Math.cos(a)*s+(o.vx||0),vy:Math.sin(a)*s*0.6-(o.up||0),life:0,max:(o.life||0.7)*(kind==='heart'?1:(0.6+Math.random()*0.6)),col:o.col,r:o.r||1,g:o.g});}}
function stepParts(dt){var a=L.parts,n=0;for(var i=0;i<a.length;i++){var p=a[i];p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;var dr=p.k==='clip'?3.5:p.k==='feather'?1.2:p.k==='heart'?0:2;p.vx*=Math.max(0,1-dr*dt);
  p.vy=p.vy*Math.max(0,1-dr*dt)+(p.k==='drop'?300:p.k==='feather'?16:p.k==='seed'?(p.g||240):p.k==='clip'?60:0)*dt;if(p.life<p.max)a[n++]=p;}a.length=n;}
function drawParts(x){for(var i=0;i<L.parts.length;i++)drawPart(x,L.parts[i]);x.globalAlpha=1;}
function drawPart(x,p){var a=1-p.life/p.max;x.globalAlpha=clamp(a*1.5,0,1);
  if(p.k==='clip')wrect(x,p.x,p.y,2,1,p.col||'#6abe30');
  else if(p.k==='feather'){wrect(x,p.x,p.y,3,1,p.col||'#f7f3ea');wrect(x,p.x+1,p.y+1,1,1,'#9badb7');}
  else if(p.k==='ring'){var rr=(4+(1-a)*18)*p.r;x.globalAlpha=clamp(0.85*a,0,1);x.fillStyle='#ffffff';for(var q=0;q<RING.length;q+=2){x.fillRect(Math.round(p.x+RING[q][0]/9*rr)-L.cdx,Math.round(p.y+RING[q][1]/9*rr*0.45)-L.cdy,1,1);}}
  else if(p.k==='drop')wrect(x,p.x,p.y,1,2,'#cbdbfc');
  else if(p.k==='seed'){wrect(x,p.x-1,p.y-1,4,3,'#3a2a14');wrect(x,p.x,p.y,2,1,'#f5cf5c');}
  else if(p.k==='spark')wrect(x,p.x,p.y,2,2,p.col||'#fbf236');
  else if(p.k==='heart')drawSpr(x,heartSpr(),p.x,p.y);
  else if(p.k==='dust')wrect(x,p.x,p.y,2,2,'#eec39a');}

// ----- butterflies over flowers and long grass -----
function stepButterflies(dt){if(S.stage<2){if(L.bfl&&L.bfl.length)L.bfl.length=0;return;}var bf=L.bfl||(L.bfl=[]),want=S.stage>=3?4:2;
  if(L.bflFor!==L.spots){L.bflFor=L.spots;L.bflT=L.spots.filter(function(s){return s.t==='flowers'||s.t==='meadow';});}var targets=L.bflT;
  if(bf.length<want&&targets.length&&Math.random()<dt*0.5){var t0=pick(targets);bf.push({x:L.cam.x+(Math.random()<0.5?-20:L.VW+20),y:L.cam.y+Math.random()*L.VH,tx:t0.x,ty:t0.y-16,ph:Math.random()*9,c:Math.floor(Math.random()*BFLY_COLS.length),rest:0,life:25+Math.random()*30});}
  for(var bj=0;bj<bf.length;bj++){var b=bf[bj];b.ph+=dt;b.life-=dt;if(b.rest>0){b.rest-=dt;continue;}var dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);
    if(d<4){b.rest=1+Math.random()*3;var t1=targets.length?pick(targets):{x:b.x+(Math.random()-0.5)*200,y:b.y+(Math.random()-0.5)*140};b.tx=t1.x+(Math.random()-0.5)*30;b.ty=t1.y-16+(Math.random()-0.5)*16;if(b.life<0){b.tx=L.cam.x-80;b.gone=b.life<-10;}}
    else{b.x+=dx/d*40*dt+Math.sin(b.ph*3)*0.6;b.y+=dy/d*40*dt+Math.sin(b.ph*7)*1;}if(b.x<L.cam.x-160||b.x>L.cam.x+L.VW+160)b.gone=true;}
  compact(bf,'gone');}
// ----- your pond fish -----
function pondAt(x,y){return waterKind(Math.floor(x/T),Math.floor(y/T))===W_POND;}
function pondOK(x,y){var tx=Math.floor(x/T),ty=Math.floor(y/T);if(waterKind(tx,ty)!==W_POND)return false;
  if(L.nat&&L.nat.pond&&natKind(M(),tx,ty)===1)return natW(x/T,y/T,-99,0)>0.5+0.25*NAT_K;
  return pondAt(x+14,y)&&pondAt(x-14,y)&&pondAt(x,y+12)&&pondAt(x,y-12);}
// the whole fish has to stay in the water: nose, tail, back and belly, not just its middle.
// A fish that is out anyway (a new pond shape, an old save) swims back to where it started.
function fishFits(f,x,y){if(f.loose)return pondOK(x,y);var m=AM('fish',f.kind),hw=m?m.w/2-5:12,hh=m?m.h/2-6:6;return pondOK(x,y)&&pondOK(x+hw,y)&&pondOK(x-hw,y)&&pondOK(x,y+hh)&&pondOK(x,y-hh);}
// a spot near where it started where the whole fish fits; ponds too small for it let it go by its middle only
function fishHome(f){var best=null,bd=1e9;for(var k=0;k<200;k++){var x=f.x+(Math.random()-0.5)*T*6,y=f.y+(Math.random()-0.5)*T*6;if(fishFits(f,x,y)){var d=Math.hypot(x-f.x,y-f.y);if(d<bd){bd=d;best=[x,y];}}}return best;}
function stepPondFish(dt){for(var fi=0;fi<L.fishA.length;fi++){var f=L.fishA[fi];f.ph+=dt;if(f.hx==null||(!fishFits(f,f.hx,f.hy)&&!f.loose)){var hp=fishHome(f);if(hp){f.hx=hp[0];f.hy=hp[1];}else{f.hx=f.x;f.hy=f.y;f.loose=1;}}
  if(!fishFits(f,f.x,f.y)){var dx=f.hx-f.x,dy=f.hy-f.y,d=Math.hypot(dx,dy)||1;f.a=Math.atan2(dy,dx);f.x+=dx/d*Math.min(d,30*dt);f.y+=dy/d*Math.min(d,30*dt);continue;}
  f.a+=Math.sin(f.ph*0.7)*dt*0.9;var nx=f.x+Math.cos(f.a)*18*dt,ny=f.y+Math.sin(f.a)*11*dt;
  if(fishFits(f,nx,ny)){f.x=nx;f.y=ny;}else{f.a+=Math.PI*(0.75+Math.random()*0.5);}}}
var PFCOL={};
function drawPondFish(x){for(var fi=0;fi<L.fishA.length;fi++){var f=L.fishA[fi];if(!inView(f.x,f.y,40))continue;var F=FISHI[f.kind]||FISH[0],face=Math.cos(f.a)<0?-1:1;x.globalAlpha=0.85;drawSpr(x,fishSpr(F.id,animFrame('fish',F.id,'swim',f.ph,8),face),f.x,f.y);x.globalAlpha=1;}}

// ----- world <-> screen. The canvas has one pixel per art pixel; CSS scales it up crisp (image-rendering: pixelated) -----
function sxOf(wx){return Math.round(wx)-L.cdx;}
function syOf(wy){return Math.round(wy)-L.cdy;}
function wrect(x,wx,wy,w,h,col){x.fillStyle=col;x.fillRect(Math.round(wx)-L.cdx,Math.round(wy)-L.cdy,w,h);}
function wimg(x,c,wx,wy,sw,sh,sx0,sy0){if(sw!=null){x.drawImage(c,sx0,sy0,sw,sh,Math.round(wx)-L.cdx,Math.round(wy)-L.cdy,sw,sh);return;}x.drawImage(c,Math.round(wx)-L.cdx,Math.round(wy)-L.cdy);}
function toCss(wx,wy){return [(Math.round(wx)-L.cdx)*L.cpa,(Math.round(wy)-L.cdy)*L.cpa];}
function fromCss(cx,cy){return [cx/L.cpa+L.cdx,cy/L.cpa+L.cdy];}
function hitThing(x,y,wx,wy,r){return Math.hypot(x-wx,y-wy)<r;}

// ----- pointer: tap to walk or use, hold and drag to steer Millie (in Build, drag looks around) -----
function localXY(e){var r=L.cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
function onDown(e){if(!L.cv)return;e.preventDefault();try{L.cv.setPointerCapture(e.pointerId);}catch(_){}var p=localXY(e);closeBub();
  L.ptr={id:e.pointerId,down:true,sx:p[0],sy:p[1],cx:p[0],cy:p[1],lx:p[0],ly:p[1],t0:performance.now(),mode:null,st:0};}
function onMove(e){var P=L.ptr;if(!P||!P.down||e.pointerId!==P.id)return;e.preventDefault();var p=localXY(e),dx=p[0]-P.lx,dy=p[1]-P.ly;P.cx=p[0];P.cy=p[1];
  if(!P.mode&&Math.hypot(p[0]-P.sx,p[1]-P.sy)>10){var gb=L.tool==='build'&&L.buildSel&&BUILDI[L.buildSel];P.mode=gb&&gb.ground?'paint':L.tool==='build'&&L.removing?'erase':L.tool==='build'?'pan':'steer';if(P.mode==='paint'){var w0=fromCss(P.sx,P.sy),t0=tileOf(w0[0],w0[1]);paintGround(gb,t0[0],t0[1],true);P.lt=t0;}}
  if(P.mode==='erase'){var we=fromCss(p[0],p[1]),te=tileOf(we[0],we[1]),ee=groundEdit(te[0],te[1]);if(ee&&ee.fw===1&&ee.fh===1)removeThing(null,ee);}
  if(P.mode==='paint'){var gb2=BUILDI[L.buildSel],w1=fromCss(p[0],p[1]),t1=tileOf(w1[0],w1[1]);if(gb2&&(!P.lt||t1[0]!==P.lt[0]||t1[1]!==P.lt[1])){var a0=P.lt||t1,n=Math.max(Math.abs(t1[0]-a0[0]),Math.abs(t1[1]-a0[1]),1);for(var k=1;k<=n;k++)paintGround(gb2,Math.round(a0[0]+(t1[0]-a0[0])*k/n),Math.round(a0[1]+(t1[1]-a0[1])*k/n),true);P.lt=t1;}}
  if(P.mode==='pan'){L.camFree=true;L.cam.x-=dx/L.cpa;L.cam.y-=dy/L.cpa;clampCam();L.dirty=true;}
  P.lx=p[0];P.ly=p[1];}
function onUp(e){var P=L.ptr;if(!P||e.pointerId!==P.id)return;P.down=false;if(P.mode==='paint'){groundDone();sfx('thud');}
  if(P.mode===null&&e.type!=='pointercancel'){var w=fromCss(P.cx,P.cy);onTap(w[0],w[1],P.cx,P.cy);}
  P.mode=null;}
function stepPointer(){var P=L.ptr;if(!P||!P.down)return;var now=performance.now();
  if(!P.mode&&L.tool!=='build'&&now-P.t0>330)P.mode='steer';
  if(P.mode==='steer'&&now-P.st>110){P.st=now;var w=fromCss(P.cx,P.cy),t=tileOf(w[0],w[1]);if(L.fishing&&L.fishing.st!=='idle')L.fishing=null;
    if(passable(t[0],t[1]))walkTo(t,w[0],w[1],null);else{var me=L.me,st=tileOf(me.x,me.y),F=flood(st[0],st[1]),nr=nearestReachable(F,w[0],w[1],3);if(nr)walkTo(nr,null,null,null);}
    L.marker=null;}}

// ----- taps -----
function onTap(wx,wy,cx,cy){var t=tileOf(wx,wy),m=M(),me=L.me;if(!me)return;
  if(L.tool==='build'){tapBuild(wx,wy,t,cx,cy);return;}
  if(L.fishing&&L.fishing.st!=='idle'&&L.fishing.st!=='cast'){rodTap();return;}
  var b=hitBird(wx,wy);if(b){watchBird(b);return;}
  if(L.dog&&hitThing(L.dog.x,L.dog.y-28,wx,wy,34)){petDog();return;}
  if(L.cat&&hitThing(L.cat.x,L.cat.y-(L.cat.st==='paw'?30:16),wx,wy,30)){petCat();return;}
  var wc=hitChick(wx,wy,L.wildA,30);if(wc){goCatch(wc);return;}
  var hc=hitChick(wx,wy,L.henA,28);if(hc){henFlap(hc);return;}
  var o=interactAt(wx,wy);if(o&&useObj(o))return;
  var g=mget(m,t[0],t[1]);
  if(L.tool==='grain'&&g!==G_WATER){throwGrain(wx,wy);return;}
  // the bridge is a flat thing over the water: tapping it walks, it never sets a trap or casts
  if(g===G_WATER&&!objAtTile(t[0],t[1],true)){tapWater(wx,wy,t);return;}
  if(me.sit&&Math.hypot(wx-me.x,wy-me.y)<30){return;}
  if(walkTo(t,wx,wy,null)){L.marker={x:wx,y:wy,t:0};if(!LS().seen.walk){LS().seen.walk=1;updateStat(true);}}}
var USE_KINDS={tank:1,feeder:1,wfeeder:1,coop:1,armchair:1,trap:1,bench:1};
function interactAt(wx,wy){var ob=LS().objs.slice().sort(function(a,b){return oBase(b)-oBase(a);});
  for(var i=0;i<ob.length;i++){var o=ob[i],d=OBJ[o.k];if(!d||!USE_KINDS[o.k])continue;if(o.k==='armchair'&&!o.gm)continue;var r;
    if(d.hit)r=d.hit(o);else{var s=objSprite(o);if(!s)continue;r=[oX(o)-s.ax,oBase(o)-s.ay,s.w,s.h];}
    if(o.k==='coop'&&LS().eggs.length){var s2=objSprite(o);if(s2&&s2.nest&&Math.abs(wx-(oX(o)+s2.nest.x+15))<26&&Math.abs(wy-(oBase(o)+s2.nest.y))<22)return o;}
    if(wx>=r[0]&&wx<=r[0]+r[2]&&wy>=r[1]&&wy<=r[1]+r[3])return o;}return null;}
function zoomToTank(o){var cv=L.cv,s=objSprite(o);if(!cv||!s){goTank(o.i);return;}var c=toCss(oX(o),oBase(o)-s.ay/2);
  cv.style.transformOrigin=Math.round(c[0])+'px '+Math.round(c[1])+'px';cv.style.transition='transform .24s ease-in, opacity .24s ease-in';cv.style.transform='scale(1.6)';cv.style.opacity='0.25';
  setTimeout(function(){S.fromHome=1;goTank(o.i);cv.style.transition='';cv.style.transform='';cv.style.opacity='';},240);}
function bubAt(wx,wy,html,mount){var c=toCss(wx,wy);showBub(c[0],c[1],html,mount);}
function useObj(o){
  if(o.k==='tank'){goUse(o,function(){if(S.tanks[o.i]){sfx('click');zoomToTank(o);return;}var s=objSprite(o);bubAt(oX(o),oBase(o)-(s?s.ay:60),'<b>An empty stand</b><div class="btns"><button class="btn primary" data-setup>Set up a tank here · '+fmtA(300)+'</button></div>',function(el){var b=el.querySelector('[data-setup]');if(b)b.onclick=function(){var T=setupTank();if(!T)return;closeBub();sfx('plop');toast(T.name+' is set up. A few stones to start.');goTank(S.tanks.length-1);};});});return true;}
  if(o.k==='feeder'||o.k==='wfeeder'){goUse(o,fillFeeder);return true;}
  if(o.k==='coop'){goUse(o,function(){collectEggs(o);});return true;}
  if(o.k==='armchair'&&o.gm){goUse(o,function(){grandmaSays(o);});return true;}
  if(o.k==='trap'){goUse(o,trapTap);return true;}
  if(o.k==='bench'){var me=L.me;if(me.sit&&me.sit.o===o)return true;goUse(o,sitOn);return true;}
  return false;}
function henFlap(hc){hc.st='flap';hc.t=0;sfx('cluck');puff('feather',hc.x,hc.y-16,3,{col:HEN[hc.kind].body,speed:30,life:1.1});}
// walk to the bank next to some water, then do fn
function goBank(wx,wy,t,fn){var me=L.me,m=M(),st=tileOf(me.x,me.y),F=flood(st[0],st[1]),best=null,bs=1e9;
  for(var y=t[1]-3;y<=t[1]+3;y++)for(var x=t[0]-3;x<=t[0]+3;x++){if(x<0||y<0||x>=m.w||y>=m.h)continue;var d=F.dist[y*m.w+x];if(!isFinite(d))continue;
    var wet=false;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(q){if(mget(m,x+q[0],y+q[1])===G_WATER)wet=true;});if(!wet)continue;
    var sc=d*0.6+Math.hypot((x+0.5)*T-wx,(y+0.5)*T-wy)/T*1.4;if(sc<bs){bs=sc;best=[x,y];}}
  if(!best){toast('Can’t get to the water from here.');sfx('nope');return false;}
  walkTo(best,null,null,function(){faceTo(wx,wy);fn&&fn(best);});return true;}
function tapWater(wx,wy,t){var k=waterKind(t[0],t[1]),bk=LS().bucket;
  if(k===W_SEA){toast('The sea. Nice from up here.');return;}
  if(k===W_POND){if(bk.length){goBank(wx,wy,t,function(){releaseFish(wx,wy);});return;}
    goBank(wx,wy,t,function(){bubAt(wx,wy-10,'<b>Your pond</b><div>'+(LS().pond.length?plural(LS().pond.length,'fish')+' live here.':'No fish yet. Catch some in the stream or the lake and bring them here.')+'</div>');});return;}
  if(L.tool==='rod'){goFish(wx,wy,t);return;}
  if(k===W_STREAM){goBank(wx,wy,t,function(){trapMenu(t,wx,wy);});return;}
  goBank(wx,wy,t,function(){bubAt(wx,wy-10,'<b>The lake</b><div>Fish here with the rod.</div>');});}

// ----- mowing: she pushes the mower where she walks, every grass tile she passes gets cut -----
function dirVec(d){return d==='right'?[1,0]:d==='left'?[-1,0]:d==='down'?[0,1]:[0,-1];}
// where the mower is: sets L.mpX, L.mpY
function mowerPos(){var me=L.me,d=me.dir;L.mpX=me.x+(d==='right'?30:d==='left'?-30:0);L.mpY=me.y+(d==='down'?20:d==='up'?-14:2);}
function mowTile(tx,ty){var m=M();if(tx<0||ty<0||tx>=m.w||ty>=m.h)return 0;var i=mi(m,tx,ty),g=m.g[i];if(!isGrass(g))return 0;var h=m.gh[i];if(h<=0.04)return 0;
  m.gh[i]=0;touchTile(tx,ty);LS().stats.mowed++;mowerPos();puff('clip',L.mpX,L.mpY-4,Math.ceil(h*6),{speed:60,up:30,col:g===G_MEADOW?'#8f974a':'#6abe30',life:0.6});
  if(g===G_MEADOW&&h>0.6&&Math.random()<0.3)puff('spark',L.mpX,L.mpY-6,1,{col:pick(WFL_HEX),speed:30});return h;}
var WFL_HEX=['#fbf236','#ffffff','#d77bba','#639bff'];
function stepMow(dt){var me=L.me;if(L.tool!=='mow'||!me){if(L.mower){L.mower.stop();L.mower=null;}return;}
  var cut=0;if(me.moving){var tx=Math.floor(me.x/T),ty=Math.floor((me.y-4)/T);mowerPos();cut+=mowTile(tx,ty)+mowTile(Math.floor(L.mpX/T),Math.floor(L.mpY/T));
    // grass you can't stand on (under a bush, by a fence) is cut as you go past it
    for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var nx=tx+dx,ny=ty+dy;if(!passable(nx,ny)&&isGrass(mget(M(),nx,ny)))cut+=mowTile(nx,ny);}
    L.mowT=0.5;if(!L.mower)L.mower=sfxLoop('mower');}
  else L.mowT-=dt;
  if(L.mower){if(L.mowT<=0){L.mower.stop();L.mower=null;}else L.mower.set(me.moving?clamp(0.35+cut*0.8,0,1):0.15);}
  if(cut>0&&!LS().seen.mow){LS().seen.mow=1;}}

// ----- feeders, eggs, Grandma -----
function fillFeeder(o){var p=o.k==='wfeeder'?wfeederPos(o):[oX(o),oBase(o)-70];
  if((o.s||0)>=0.95){bubAt(p[0],p[1],'<b>It’s full.</b>');return;}if(!spend(5,'seed'))return;o.s=1;sfx('pour');puff('seed',p[0],p[1]-6,14,{speed:24,up:14,life:0.6,g:160});
  if(!LS().seen.feeder){LS().seen.feeder=1;toast('Birds come while there’s seed. Keep still and they come closer.');}computeSpots();save();}
function collectEggs(o){var l=LS(),n=l.eggs.length,s=objSprite(o),nx=oX(o)+(s&&s.nest?s.nest.x+15:0),ny=oBase(o)+(s&&s.nest?s.nest.y:-40);
  if(n){var kinds={};l.eggs.forEach(function(k,j){l.basket[k]=(l.basket[k]||0)+1;kinds[k]=1;setTimeout(function(){sfx('egg');},j*110);});l.eggs=[];l.stats.eggs+=n;
    puff('spark',nx,ny,8,{col:'#fbf236',speed:40,life:0.6});Object.keys(kinds).forEach(function(k){bookAdd('coop','egg-'+k,{where:STAGES[S.stage].name});});toast(plural(n,'egg')+' in the basket.');updateStat(true);save();}
  coopBub(o,nx,ny-60);}
var GM_LINES=['The red ones are getting redder.','Did you eat?','Don’t change all the water at once.','That sparrow comes every morning. I call him Lao Wang.','When I was your age I kept fish in a washing bowl.','Sit with me a bit.','Your grandpa says hello.','Shrimp don’t like loud music. I checked.','Pierre was at the tank again. He only watches.','The dog brought me a sock. I said thank you.'];
function grandmaSays(o){var lines=GM_LINES.slice();if(S.stage>=3)lines.push('Your grandpa wants to see the stream.');if(S.stage>=2)lines.push('The hens are louder than your grandpa.');
  var i=(L.gmI=(L.gmI==null?Math.floor(Math.random()*lines.length):L.gmI+1))%lines.length;bubAt(oX(o),oBase(o)-70,'<b>Grandma</b><div>'+esc(lines[i])+'</div>');sfx('click');}
function coopBub(o,wx,wy){var l=LS(),n=l.hens.length,cnt={};l.hens.forEach(function(h){cnt[h.kind]=(cnt[h.kind]||0)+1;});
  var who=Object.keys(cnt).map(function(k){return cnt[k]+' '+HEN[k].name.toLowerCase()+(cnt[k]>1?'s':'');}).join(', ');
  bubAt(wx,wy,'<b>The coop</b><div>'+(n?esc(who):'Empty')+'</div><div class="hint">'+(n<8?'Wild chickens live by the stream. Throw grain, wait till one pecks, then tap it.':'It’s full.')+'</div>');}

// ----- grain and wild chickens -----
function throwGrain(wx,wy,walked){var me=L.me,d=Math.hypot(wx-me.x,wy-me.y);
  if(d>T*3.2&&!walked){var k=(d-T*2.4)/d,gx=me.x+(wx-me.x)*k,gy=me.y+(wy-me.y)*k,t=tileOf(gx,gy),st=tileOf(me.x,me.y),F=flood(st[0],st[1]),nr=passable(t[0],t[1])?t:nearestReachable(F,gx,gy,3);
    if(nr){walkTo(nr,gx,gy,function(){throwGrain(wx,wy,true);});return;}}
  if(me.sit)standUp();faceTo(wx,wy);sfx('scoop',{v:0.6});var hx=me.x,hy=me.y-46;
  for(var i=0;i<10;i++){var tx=wx+(Math.random()-0.5)*30,ty=wy+(Math.random()-0.5)*16,tt=0.42;L.parts.push({k:'seed',x:hx,y:hy,vx:(tx-hx)/tt,vy:(ty-hy)/tt-0.5*260*tt,life:0,max:tt,g:260});}
  setTimeout(function(){if(L.grain.length>80)L.grain.splice(0,10);for(var j=0;j<9;j++){var gx2=wx+(Math.random()-0.5)*30,gy2=wy+(Math.random()-0.5)*16,t2=tileOf(gx2,gy2);if(passable(t2[0],t2[1]))L.grain.push({x:gx2,y:gy2});}
    var gt=tileOf(wx,wy);if(passable(gt[0],gt[1])){var F=flood(gt[0],gt[1],10);L.grainField=new Float32Array(F.dist);}},420);
  var l=LS();if(!l.seen['grain'+(S.stage>=3?3:2)]){l.seen['grain'+(S.stage>=3?3:2)]=1;toast(S.stage>=3?'Step back and wait. When a chicken pecks the grain, tap it.':'The hens come running.',3600);}}
// busy with the grain: pecking now, or just moved to the next bit
function pecking(c){return c.st==='eat'||(c.ate&&L.rt-c.ate<2.5&&L.grain.length>0);}
function goCatch(c){var me=L.me;if(!pecking(c)){toast('Wait till it pecks the grain, then tap it.');sfx('nope');return;}
  var t=tileOf(c.x,c.y),st=tileOf(me.x,me.y),F=flood(st[0],st[1]),best=null,bd=1e9;
  for(var y=t[1]-1;y<=t[1]+1;y++)for(var x=t[0]-1;x<=t[0]+1;x++){var d=F.dist[y*M().w+x];if(isFinite(d)&&d<bd){bd=d;best=[x,y];}}
  if(!best)return;var ex=c.x+(me.x<c.x?-30:30),ey=c.y+4;walkTo(best,ex,ey,function(){if(L.wildA[c.id]&&pecking(c)&&Math.hypot(c.x-L.me.x,c.y-L.me.y)<T*1.8)catchWild(c);else toast('It ran off. Try more grain.');},{sneak:true,speed:ME_SPEED});
  if(!LS().seen.sneak){LS().seen.sneak=1;toast('Creeping up…');}}
var WILD_KINDS=[['wild',3],['brown',3],['white',2],['speckled',2],['blue',1]];
function newWild(){var l=LS(),tot=0,r;WILD_KINDS.forEach(function(k){tot+=k[1];});r=Math.random()*tot;var kind='wild';for(var i=0;i<WILD_KINDS.length;i++){r-=WILD_KINDS[i][1];if(r<0){kind=WILD_KINDS[i][0];break;}}return {id:'w'+(++l.oid),kind:kind};}
function catchWild(c){if(!objsOf('coop').length){c.st='run';c.t=0;c.dur=1.4;var ax=c.x-L.me.x,ad=Math.abs(ax)||1;chickGo(c,c.x+ax/ad*T*2.5,c.y,L.wildPx||henArea());sfx('flap');toast('She needs somewhere to live. Build a coop first (Build, Yard).',3600);return;}var l=LS();faceTo(c.x,c.y);l.wild=l.wild.filter(function(w){return w.id!==c.id;});delete L.wildA[c.id];var id='h'+(++l.oid),kind=c.kind||'wild';l.hens.push({id:id,kind:kind});
  puff('feather',c.x,c.y-16,10,{col:'#c4562a',speed:50,life:1.3});sfx('flap');sfx('cluck');syncAgents();
  bookAdd('coop','hen-'+kind,{where:'the land'});toast('You caught a '+HEN[kind].name.toLowerCase()+'. She lives in the coop now.');save();}

// ----- the stream trap -----
function trapsOn(){return objsOf('trap');}
function trapMenu(t,wx,wy){var n=trapsOn().length,here=trapsOn().some(function(o){return o.tx===t[0]&&o.ty===t[1];});
  bubAt(wx,wy-14,'<b>The stream</b><div>Wild shrimp live under the stones.</div><div class="btns"><button class="btn primary" data-trap'+(n>=3||here?' disabled':'')+'>'+(n>=3?'Three traps is enough':here?'There’s one here':'Set a shrimp trap · AED 20')+'</button></div>',function(el){var b=el.querySelector('[data-trap]');if(b)b.onclick=function(){if(!spend(20,'a trap'))return;
    var me=L.me,o=mkObj('trap',t[0],t[1],{set:S.day,bank:[me.x,me.y-10]});LS().objs.push(o);LS().stats.traps++;sfx('plop');puff('ring',t[0]*T+T/2,t[1]*T+T/2+4,1,{speed:0,life:1});closeBub();
    if(!LS().seen.trap){LS().seen.trap=1;toast('Check it after a few hours.');}save();};});}
function trapReady(o){return S.day-(o.set||0)>=0.25;}
function trapTap(o){if(trapReady(o)){openTrap(o);return;}var hrs=Math.max(1,Math.ceil((0.25-(S.day-(o.set||0)))*24));
  bubAt(o.tx*T+T/2,o.ty*T,'<b>Nothing yet</b><div>Check back in about '+plural(hrs,'hour')+'.</div><div class="btns"><button class="btn" data-out>Take the trap out</button></div>',function(el){el.querySelector('[data-out]').onclick=function(){LS().objs=LS().objs.filter(function(q){return q!==o;});sfx('plop');closeBub();save();};});}
function rollFinds(){var out=[],r=Math.random();if(r<0.12)out.push('crab');else if(r<0.27)out.push('snail');else if(r<0.37)out.push('nymph');else if(r<0.57)out.push('leaf');else if(r<0.6)out.push('bottle');return out;}
function spriteCanvas(s,scale,w,h){var c=document.createElement('canvas'),d=Math.min(2,window.devicePixelRatio||1);c.width=Math.round(w*d);c.height=Math.round(h*d);c.style.width=w+'px';c.style.height=h+'px';var x=c.getContext('2d');x.imageSmoothingEnabled=false;
  var sw=s.w*scale*d,sh=s.h*scale*d;x.drawImage(s.c,Math.round((c.width-sw)/2),Math.round((c.height-sh)/2),sw,sh);return c;}
function openTrap(o){var n=2+Math.floor(Math.random()*6),list=[];if(typeof breedWild==='function'){for(var i=0;i<n;i++){try{list.push(breedWild());}catch(e){console.error(e);}}}
  var finds=rollFinds();sfx('drip');
  openSheet({title:'Shrimp trap',mount:function(el,api){
    el.innerHTML='<canvas class="trapcv"></canvas><p class="sub trap-sum">Pulling it up…</p><div class="trap-catch"></div><div class="btns trap-btns" hidden></div>';
    var cv=el.querySelector('.trapcv'),w=Math.min(el.clientWidth||320,520),h=130,d=Math.min(2,window.devicePixelRatio||1),px=3;cv.width=Math.round(w*d);cv.height=Math.round(h*d);cv.style.width=w+'px';cv.style.height=h+'px';var x=cv.getContext('2d');x.imageSmoothingEnabled=false;
    var t0=performance.now(),drops=[],P=px*d,gw=Math.ceil(cv.width/P),gh=Math.ceil(cv.height/P);
    function cell(cx,cy,col){x.fillStyle=col;x.fillRect(cx*P,cy*P,P,P);}
    function anim(){if(!cv.isConnected)return;var t=(performance.now()-t0)/1000,k=clamp(t/1.2,0,1),e=1-Math.pow(1-k,3),wl=Math.round(gh*0.7);
      for(var yy=0;yy<gh;yy++){var col=yy<wl?(yy<gh*0.3?'#e6f1f8':'#d6eaf6'):yy<wl+2?'#89d8e4':'#5fcde4';x.fillStyle=col;x.fillRect(0,yy*P,cv.width,P);}
      for(var s=0;s<gw;s+=5)cell((s+Math.floor(t*6))%gw,wl+3+((s*7)%Math.max(1,gh-wl-4)),'#cbdbfc');
      var cx=Math.round(gw/2),cy=Math.round(lerp(gh+8,gh*0.36,e)),tw=22,th=12;
      for(var r=0;r<cy-th/2;r++)cell(cx,r,'#d8cfb8');
      for(var yy2=-th/2;yy2<th/2;yy2++)for(var xx=-tw/2;xx<tw/2;xx++){var edge=yy2===-th/2||yy2===th/2-1||xx===-tw/2||xx===tw/2-1,mesh=((xx+yy2)&1)===0;cell(cx+xx,cy+yy2,edge?'#1b1a1e':mesh?'#3a4a4a':(cy+yy2<wl?'#9fb8bd':'#4fa8bd'));}
      if(k>=1&&list.length){for(var j=0;j<Math.min(list.length,7);j++){var sx=cx-tw/2+3+(j*3)%(tw-6),sy=cy-th/2+3+(j%3)*2;cell(sx,sy,j%2?'#9a7a58':'#b59a76');cell(sx+1,sy,j%2?'#9a7a58':'#b59a76');}}
      if(cy<wl&&Math.random()<0.5)drops.push({x:cx-tw/2+Math.random()*tw,y:cy+th/2,v:0});
      drops.forEach(function(dd){dd.v+=60/60;dd.y+=dd.v/6;cell(Math.round(dd.x),Math.round(dd.y),'#cbdbfc');if(dd.y>wl&&!dd.s){dd.s=1;if(Math.random()<0.15)sfx('drip',{v:0.5});}});drops=drops.filter(function(dd){return dd.y<gh;});
      if(k>=1&&!anim.shown){anim.shown=1;reveal();}requestAnimationFrame(anim);}
    anim.shown=0;requestAnimationFrame(anim);
    function reveal(){var sum=el.querySelector('.trap-sum'),box=el.querySelector('.trap-catch'),bt=el.querySelector('.trap-btns');
      var parts=[];if(list.length)parts.push(plural(list.length,'wild shrimp','wild shrimp'));finds.forEach(function(f){parts.push(FINDI[f].name.toLowerCase());});
      sum.textContent=parts.length?parts.join(', ').replace(/^./,function(c){return c.toUpperCase();})+'.':'Empty this time.';
      var html='';list.forEach(function(s,i){html+='<div class="tc" data-i="'+i+'"><span class="tcv"></span><small>'+esc(typeof colourName==='function'?colourName(s):'Wild')+'</small></div>';});
      finds.forEach(function(f){html+='<div class="tc find" data-f="'+f+'"><span class="tcv"></span><small>'+esc(FINDI[f].name)+'</small></div>';});box.innerHTML=html;
      box.querySelectorAll('.tc[data-i]').forEach(function(dv){var s=list[+dv.dataset.i],sp=typeof specOf==='function'?specOf(s):{male:false,col:'wild',vg:3,juv:0};try{dv.querySelector('.tcv').appendChild(shrimpIconCanvas(sp,52,26));}catch(e){}});
      box.querySelectorAll('.tc[data-f]').forEach(function(dv){dv.querySelector('.tcv').appendChild(spriteCanvas(findSpr(dv.dataset.f),1,52,26));});
      finds.forEach(function(f){bookAdd('finds',f,{where:'the stream'});});
      var take=list.length&&typeof takeHome==='function';
      bt.innerHTML=(take?'<button class="btn primary" data-take>Take the shrimp home</button>':'')+'<button class="btn" data-go>'+(list.length?'Let them go':'Put it back')+'</button>';bt.hidden=false;
      o.set=S.day;save();
      var tb=bt.querySelector('[data-take]');if(tb)tb.onclick=function(){closeSheet();setTimeout(function(){takeHome(list,'stream');},60);};
      bt.querySelector('[data-go]').onclick=function(){closeSheet();sfx('splash');puff('drop',o.tx*T+T/2,o.ty*T+T/2,10,{speed:60,up:50,life:0.6});};}}});}

// ----- fishing in the stream and the lake; keep what you catch in a bucket and let it into your pond -----
// the rod tip: sets L.tipX, L.tipY
function rodTip(){var me=L.me,d=me.dir;L.tipX=me.x+(d==='right'?40:d==='left'?-40:16);L.tipY=me.y-70+(d==='down'?16:0);}
function goFish(wx,wy,t){if(!wildWater(t[0],t[1])){toast(waterKind(t[0],t[1])===W_POND?'Your fish live here. Fish in the stream or the lake.':'No fish here.');return;}
  if(L.fishing&&L.fishing.st!=='idle')return;goBank(wx,wy,t,function(){castAt(wx,wy);});}
function castAt(wx,wy){var me=L.me,d=Math.hypot(wx-me.x,wy-me.y),tx=wx,ty=wy;if(d>T*3.2){tx=me.x+(wx-me.x)/d*T*2.6;ty=me.y+(wy-me.y)/d*T*2.6;}
  var t=tileOf(tx,ty);if(!wildWater(t[0],t[1])){var tt=tileOf(wx,wy);tx=tt[0]*T+T/2;ty=tt[1]*T+T/2;t=tt;}
  // the banks curve, so the float is nudged out from the edge into open water
  if(L.nat&&natKind(M(),t[0],t[1])===1){var deep=L.nat.stream&&isStream(t[0],t[1])?[tx,streamCy(tx/T)*T]:L.nat.lake&&waterKind(t[0],t[1])===W_LAKE?[L.nat.lake.cx*T,L.nat.lake.cy*T]:null;
    for(var q=0;deep&&q<40&&natW(tx/T,ty/T,streamCy(tx/T),streamW(tx/T))<0.5+0.3*NAT_K;q++){var ddx=deep[0]-tx,ddy=deep[1]-ty,dl=Math.hypot(ddx,ddy);if(dl<4)break;tx+=ddx/dl*4;ty+=ddy/dl*4;}}
  rodTip();L.fishing={st:'fly',x0:L.tipX,y0:L.tipY,x1:tx,y1:ty,x:L.tipX,y:L.tipY,t:0,water:isStream(t[0],t[1])?'stream':'lake'};sfx('cast');updateStat(true);}
function rodTap(){var f=L.fishing;if(!f)return;if(f.st==='fly')return;if(f.st==='wait'){toast('Too soon, it swam off.');f.st='idle';updateStat(true);return;}
  if(f.st==='bite'){f.st='reel';f.t=0;sfx('splash');sfx('reel');puff('drop',f.x,f.y,12,{speed:60,up:60,life:0.7});}}
function stepFishing(dt){var f=L.fishing;if(!f)return;f.t+=dt;var me=L.me;if(me&&me.moving&&f.st!=='reel'){L.fishing=null;updateStat(true);return;}
  if(f.st==='fly'){var k=clamp(f.t/0.55,0,1);f.x=lerp(f.x0,f.x1,k);f.y=lerp(f.y0,f.y1,k)-Math.sin(k*Math.PI)*70;if(k>=1){f.st='wait';f.t=0;f.bite=2+Math.random()*6;f.tw=[];for(var i=0;i<1+Math.floor(Math.random()*3);i++)f.tw.push(Math.random()*f.bite*0.85);f.tw.sort();puff('ring',f.x,f.y+2,1,{speed:0,life:1.1,r:1.2});sfx('plop');updateStat(true);}}
  else if(f.st==='wait'){while(f.tw.length&&f.t>=f.tw[0]){f.tw.shift();f.dip=0.25;puff('ring',f.x,f.y+2,1,{speed:0,life:0.6,r:0.5});sfx('plip',{v:0.35});}if(f.dip>0)f.dip-=dt;if(f.t>=f.bite){f.st='bite';f.t=0;puff('ring',f.x,f.y+2,1,{speed:0,life:0.9,r:1.4});sfx('plip');updateStat(true);}}
  else if(f.st==='bite'){if(f.t>0.85){f.st='miss';f.t=0;toast('It got away.');updateStat(true);}}
  else if(f.st==='miss'){if(f.t>0.4){f.st='idle';updateStat(true);}}
  else if(f.st==='reel'){rodTip();f.x=lerp(f.x,L.tipX,dt*3);f.y=lerp(f.y,L.tipY+30,dt*3);if(f.t>0.9){f.st='idle';landFish(f.water);updateStat(true);}}}
function landFish(water){var pool=FISH.filter(function(F){return F.where==='both'||F.where===water;}),tot=pool.reduce(function(a,F){return a+F.w;},0),r=Math.random()*tot,F=pool[0];
  for(var i=0;i<pool.length;i++){r-=pool[i].w;if(r<=0){F=pool[i];break;}}var len=Math.round(lerp(F.len[0],F.len[1],Math.random()));LS().stats.fish++;
  var bk=LS().bucket,canKeep=(L.pondTiles||[]).length>0&&bk.length<3&&LS().pond.length+bk.length<10;
  openSheet({title:F.name,mount:function(el){el.innerHTML='<div class="fishcv"></div><p class="sub">'+len+' cm.'+(canKeep?' Let it go, or take it home for your pond.':(L.pondTiles||[]).length?(bk.length>=3?' The bucket’s full. Take them to the pond first.':''):'')+'</p><div class="btns"><button class="btn" data-go>Let it go</button>'+(canKeep?'<button class="btn primary" data-keep>Put it in the bucket</button>':'')+'</div>';
    var box=el.querySelector('.fishcv'),w=Math.min(el.clientWidth||320,520);box.style.cssText='width:'+w+'px;max-width:100%;height:110px;border-radius:10px;border:1px solid var(--line);margin:0 auto 8px;background:#89d8e4;display:flex;align-items:center;justify-content:center;overflow:hidden';
    var fs=fishSpr(F.id),sc=Math.max(1,Math.floor(Math.min((w-10)/fs.w,4)));box.appendChild(spriteCanvas(fs,sc,fs.w*sc,fs.h*sc));
    bookAdd('fish',F.id,{where:water==='stream'?'the stream':'the lake',cm:len});
    el.querySelector('[data-go]').onclick=function(){closeSheet();sfx('splash');var fb=L.fishing;if(fb)puff('drop',fb.x,fb.y,10,{speed:40,up:30,life:0.6});};
    var kb=el.querySelector('[data-keep]');if(kb)kb.onclick=function(){bk.push({kind:F.id,len:len});closeSheet();sfx('plop');if(!LS().seen.bucket){LS().seen.bucket=1;toast('Take it home and tap your pond to let it in.',3600);}updateStat(true);save();};}});}
function releaseFish(wx,wy){var l=LS(),n=l.bucket.length;if(!n)return;l.bucket.forEach(function(f){l.pond.push(f);});l.bucket=[];syncAgents();sfx('splash');puff('drop',wx,wy,14,{speed:60,up:50,life:0.7});puff('ring',wx,wy+4,1,{speed:0,life:1.2,r:1.4});
  toast(n===1?'It’s in the pond now.':n+' fish in the pond now.');updateStat(true);save();}

// ----- building -----
var OUT=[G_GRASS,G_MEADOW,G_DIRT],OUTS=[G_GRASS,G_MEADOW,G_DIRT,G_STONE];
var BUILD=[
 {k:'flowers',name:'Flower bed',price:30,where:OUT,stage:2},
 {k:'bush',name:'Bush',price:25,where:OUT,stage:2,o:{v:1}},
 {k:'oak',name:'Small tree',price:120,where:[G_GRASS,G_MEADOW],stage:2},
 {k:'stones',name:'Stepping stones',price:10,where:[G_GRASS,G_MEADOW],stage:2,edit:G_STEP},
 {k:'fence',name:'Fence',price:15,where:OUT.concat([G_SAND]),stage:2},
 {k:'bench',name:'Bench',price:80,where:OUTS,stage:2,o:{fw:2}},
 {k:'birdbath',name:'Bird bath',price:60,where:OUTS,stage:2},
 {k:'lantern',name:'Lantern',price:40,where:OUTS.concat([G_TILE]),stage:1},
 {k:'feeder',name:'Bird feeder',price:45,where:OUTS.concat([G_TILE]),stage:1,o:{s:0}},
 {k:'coop',name:'Coop',price:400,where:OUT,stage:2,max:1,o:{fw:3,fh:2}},
 {k:'pot',name:'Flower pot',price:20,where:[G_TILE,G_STONE,G_FLOOR],stage:1,o:{v:1}},
 {k:'herbs',name:'Herb pot',price:15,where:[G_TILE,G_STONE,G_FLOOR],stage:1},
 {k:'bchair',name:'Folding chair',price:35,where:[G_TILE,G_STONE,G_GRASS],stage:1},
 {k:'rug',name:'Rug',price:60,where:[G_FLOOR],stage:0,o:{fw:3,fh:2}},
 {k:'tallplant',name:'Plant',price:25,where:[G_FLOOR,G_TILE],stage:0},
 {k:'bookshelf',name:'Bookshelf',price:150,where:[G_FLOOR],stage:0},
 {k:'armchair',name:'Armchair',price:200,where:[G_FLOOR],stage:0,o:{v:'b'}},
 {k:'lamp',name:'Lamp',price:50,where:[G_FLOOR],stage:0}];
// ground: paint one tile at a time, or drag to paint a run. The edges against the neighbours are worked out on the fly
var GROUND_ON=[G_GRASS,G_MEADOW,G_DIRT,G_STONE,G_SAND,G_STEP,G_TILE,G_FLOOR,G_WATER];
[{k:'g-grass',name:'Lawn',edit:G_GRASS,price:2},{k:'g-meadow',name:'Long grass',edit:G_MEADOW,price:2},{k:'g-dirt',name:'Dirt',edit:G_DIRT,price:1},
 {k:'g-sand',name:'Sand',edit:G_SAND,price:3},{k:'g-stone',name:'Stone paving',edit:G_STONE,price:8},{k:'g-floor',name:'Wood deck',edit:G_FLOOR,price:10},
 {k:'g-tile',name:'Terracotta tiles',edit:G_TILE,price:10},{k:'g-water',name:'Pond water',edit:G_WATER,price:12}].reverse().forEach(function(b){b.ground=1;b.stage=0;b.where=GROUND_ON;BUILD.unshift(b);});
BUILD.push({k:'wall',name:'Plaster wall',price:20,where:GROUND_ON.filter(function(g){return g!==G_WATER;}),stage:0,o:{v:'p'},id2:'wall-p'},{k:'wall',name:'Stone wall',price:30,where:GROUND_ON.filter(function(g){return g!==G_WATER;}),stage:0,o:{v:'s'},id2:'wall-s'},{k:'gate',name:'Gate',price:40,where:OUT.concat([G_SAND,G_STONE]),stage:0,o:{fw:2}});
BUILD.push({k:'bridge',name:'Bridge',price:25,where:[G_WATER],stage:0,o:{fw:1,fh:1},fw:1,fh:1});
BUILD.forEach(function(b){if(b.id2)b.k2=b.id2;});
var BCAT=[{id:'ground',name:'Ground'},{id:'walls',name:'Walls'},{id:'garden',name:'Garden'},{id:'yard',name:'Yard'},{id:'indoor',name:'Indoors'}];
var BCAT_OF={stones:'ground',flowers:'garden',bush:'garden',oak:'garden',pot:'garden',herbs:'garden',
  bridge:'ground',fence:'walls',wall:'walls',gate:'walls',bench:'yard',birdbath:'yard',lantern:'yard',feeder:'yard',coop:'yard',bchair:'yard',rug:'indoor',tallplant:'indoor',bookshelf:'indoor',armchair:'indoor',lamp:'indoor'};
BUILD.forEach(function(b){b.cat=b.ground?'ground':BCAT_OF[b.k]||'yard';});
var BUILDI={};BUILD.forEach(function(b){b.id=b.k2||b.k;BUILDI[b.id]=b;if(!BUILDI[b.k])BUILDI[b.k]=b;});
function buildList(){var m=M(),has={};m.g.forEach(function(g){has[g]=1;});return BUILD.filter(function(b){if(b.ground)return S.stage>=1&&(has[G_GRASS]||has[G_MEADOW]||has[G_TILE]||has[G_STONE]);return S.stage>=b.stage&&b.where.some(function(g){return has[g];});});}
function itemSize(b){var o=b.o||{},d=OBJ[b.k]||{};return [b.fw||o.fw||d.fw||1,b.fh||o.fh||d.fh||1];}
function anchorFor(b,tx,ty){var sz=itemSize(b);return [tx-Math.floor((sz[0]-1)/2),ty-Math.floor((sz[1]-1)/2)];}
function occupied(x,y){var c=[L.me,L.dog,L.cat];for(var i=0;i<c.length;i++){var a=c[i];if(!a)continue;var t=tileOf(a.x,a.y);if(t[0]===x&&t[1]===y)return true;}return false;}
function inAnyRoom(x,y){var m=M();return (m.rooms||[]).some(function(r){return x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;});}
function groundEdit(x,y){return (LS().edits||[]).filter(function(e){return x>=e.tx&&x<e.tx+e.fw&&y>=e.ty&&y<e.ty+e.fh;})[0];}
function canGround(b,x,y){var m=M(),g=mget(m,x,y);if(GROUND_ON.indexOf(g)<0||inAnyRoom(x,y))return false;
  if(g===b.edit&&!(g===G_WATER&&waterKind(x,y)!==W_POND))return false;
  var e=groundEdit(x,y);if(e&&!(e.fw===1&&e.fh===1))return false;
  var o=objAtTile(x,y,true);if(o&&!o.deco)return false;if(occupied(x,y)&&(b.edit===G_WATER||g===G_WATER))return false;return true;}
function canPlace(b,ax,ay){if(b.ground)return canGround(b,ax,ay);var sz=itemSize(b),m=M(),flat=OBJ[b.k]&&OBJ[b.k].flat;if(b.max&&objsOf(b.k).length>=b.max)return false;
  for(var y=ay;y<ay+sz[1];y++)for(var x=ax;x<ax+sz[0];x++){var g=mget(m,x,y);if(b.where.indexOf(g)<0)return false;
    var o=objAtTile(x,y,true);if(o&&!o.deco){var of=OBJ[o.k]&&OBJ[o.k].flat;if(b.edit||flat?true:!of)return false;}
    if(b.edit&&edits(x,y))return false;if(!flat&&!b.edit&&occupied(x,y))return false;if(b.edit===G_WATER&&occupied(x,y))return false;}
  return true;}
function edits(x,y){return (LS().edits||[]).some(function(e){return x>=e.tx&&x<e.tx+e.fw&&y>=e.ty&&y<e.ty+e.fh;});}
function paintGround(b,x,y,quiet){if(!canGround(b,x,y)){if(!quiet)sfx('nope');return false;}if(!spend(b.price,b.name.toLowerCase()))return false;var m=M(),l=LS(),i=mi(m,x,y),e=groundEdit(x,y),wasW=mget(m,x,y)===G_WATER;
  if(!e){e={k:b.k,tx:x,ty:y,fw:1,fh:1,prev:[[mget(m,x,y),m.gh[i],m.wb?m.wb[i]||0:0]],price:b.price};(l.edits=l.edits||[]).push(e);}else{e.k=b.k;e.price=b.price;}
  if(b.edit===G_WATER)setWater(m,x,y,W_POND);else{mset(m,x,y,b.edit,b.edit===G_MEADOW?1:0);if(m.wb)m.wb[i]=0;}
  if(e.prev[0][0]===b.edit&&(b.edit!==G_WATER||e.prev[0][2]===W_POND||!e.prev[0][2]))l.edits=l.edits.filter(function(q){return q!==e;});
  l.objs=l.objs.filter(function(o){return !(o.deco&&o.tx===x&&o.ty===y);});
  L.pmask=null;repaintAround(x,y,1,1);if(b.edit===G_WATER||wasW)syncAgents();
  if(!quiet)sfx('thud');puff('dust',(x+0.5)*T,(y+1)*T-8,quiet?3:6,{speed:30,life:0.4});L.groundDirty=true;L.dirty=true;return true;}
function groundDone(){if(!L.groundDirty)return;L.groundDirty=false;computePass();computeSpots();L.hints=null;save();}
function placeAt(b,ax,ay){if(b.ground){var ok=paintGround(b,ax,ay,false);groundDone();return ok;}if(!canPlace(b,ax,ay)){sfx('nope');return false;}if(!spend(b.price,b.name.toLowerCase()))return false;var m=M(),sz=itemSize(b),l=LS();
  if(b.edit){var prev=[];for(var y=ay;y<ay+sz[1];y++)for(var x=ax;x<ax+sz[0];x++){prev.push([mget(m,x,y),m.gh[mi(m,x,y)]]);if(b.edit===G_WATER)setWater(m,x,y,W_POND);else mset(m,x,y,b.edit,m.gh[mi(m,x,y)]);}
    (l.edits=l.edits||[]).push({k:b.k,tx:ax,ty:ay,fw:sz[0],fh:sz[1],prev:prev,price:b.price});l.objs=l.objs.filter(function(o){return !(o.deco&&o.tx>=ax&&o.tx<ax+sz[0]&&o.ty>=ay&&o.ty<ay+sz[1]);});
    repaintAround(ax,ay,sz[0],sz[1]);if(b.edit===G_WATER)syncAgents();}
  else{var o={};for(var k in b.o||{})o[k]=b.o[k];o.built=1;var ob=mkObj(b.k,ax,ay,o);if(b.k==='flowers')ob.v=Math.floor(Math.random()*5);l.objs.push(ob);
    if(OBJ[b.k].flat)for(var y4=ay;y4<ay+sz[1];y4++)for(var x4=ax;x4<ax+sz[0];x4++)repaintTile(x4,y4);if(b.k==='fence'||b.k==='wall'||b.k==='gate'||b.k==='bridge'){resetSprites();if(b.k==='bridge')for(var yb=ay-1;yb<=ay+1;yb++)for(var xb=ax-1;xb<=ax+1;xb++)repaintTile(xb,yb);}}
  if(b.k==='coop'){L.henPx=undefined;syncAgents();}sfx('thud');puff('dust',(ax+sz[0]/2)*T,(ay+sz[1])*T-8,8,{speed:40,life:0.5});computePass();computeSpots();L.hints=null;L.dirty=true;save();return true;}
function removeThing(o,e){var l=LS(),m=M();
  if(o){l.objs=l.objs.filter(function(q){return q!==o;});var b=BUILDI[o.k];earn(Math.floor((b?b.price:0)/2),'refund');
    if(OBJ[o.k].flat)for(var y=o.ty;y<o.ty+o.fh;y++)for(var x=o.tx;x<o.tx+o.fw;x++)repaintTile(x,y);if(o.k==='fence'||o.k==='wall'||o.k==='gate'||o.k==='bridge')resetSprites();}
  else if(e){var j=0;for(var y2=e.ty;y2<e.ty+e.fh;y2++)for(var x2=e.tx;x2<e.tx+e.fw;x2++){var p=e.prev[j++];mset(m,x2,y2,p[0],p[1]);if(m.wb)m.wb[mi(m,x2,y2)]=p[2]||0;}l.edits=l.edits.filter(function(q){return q!==e;});L.pmask=null;earn(Math.floor(e.price/2),'refund');
    repaintAround(e.tx,e.ty,e.fw,e.fh);if(e.k==='pond'||e.k==='g-water'||e.prev.some(function(p){return p[0]===G_WATER;}))syncAgents();}
  sfx('pop');computePass();computeSpots();L.hints=null;L.dirty=true;save();}
function tapBuild(wx,wy,t,cx,cy){if(L.moving){tapMove(t);return;}if(L.removing){var ob0=LS().objs,o0=null;for(var i0=ob0.length-1;i0>=0;i0--){var q0=ob0[i0];if(q0.built&&t[0]>=q0.tx&&t[0]<q0.tx+q0.fw&&t[1]>=q0.ty&&t[1]<q0.ty+q0.fh){o0=q0;break;}}
    var e0=o0?null:groundEdit(t[0],t[1]);if(o0||e0){removeThing(o0,e0);return;}toast(objAtTile(t[0],t[1],true)?'That came with the place.':'Nothing you built here.');sfx('nope');return;}
  var b=L.buildSel&&BUILDI[L.buildSel];
  if(b){var a=b.ground?t:anchorFor(b,t[0],t[1]);if(!canPlace(b,a[0],a[1])){if(!(b.ground&&mget(M(),t[0],t[1])===b.edit))toast(b.ground&&inAnyRoom(t[0],t[1])?'Not inside the house.':'It doesn’t fit there.');sfx('nope');return;}placeAt(b,a[0],a[1]);return;}
  var o=null,ob=LS().objs;for(var i=ob.length-1;i>=0;i--){var q=ob[i];if(q.built&&t[0]>=q.tx&&t[0]<q.tx+q.fw&&t[1]>=q.ty&&t[1]<q.ty+q.fh){o=q;break;}}
  var e=(LS().edits||[]).filter(function(q){return t[0]>=q.tx&&t[0]<q.tx+q.fw&&t[1]>=q.ty&&t[1]<q.ty+q.fh;})[0];
  if(o){var bi=BUILDI[o.k];showBub(cx,cy,'<b>'+esc(bi?bi.name:o.k)+'</b><div class="btns"><button class="btn" data-rm>Take it away · '+fmtA(Math.floor((bi?bi.price:0)/2))+' back</button></div>',function(el){el.querySelector('[data-rm]').onclick=function(){closeBub();removeThing(o,null);};});return;}
  if(e){showBub(cx,cy,'<b>'+esc(BUILDI[e.k].name)+'</b><div class="btns"><button class="btn" data-rm>Take it away · '+fmtA(Math.floor(e.price/2))+' back</button></div>',function(el){el.querySelector('[data-rm]').onclick=function(){closeBub();removeThing(null,e);};});return;}
  if(objAtTile(t[0],t[1],true))toast('That came with the place.');else toast('Pick something first.');}
var GROUND_SW={};GROUND_SW[G_GRASS]='#6abe30';GROUND_SW[G_MEADOW]='#4f9a2c';GROUND_SW[G_DIRT]='#b07a46';GROUND_SW[G_SAND]='#e3cf96';GROUND_SW[G_STONE]='#9badb7';GROUND_SW[G_FLOOR]='#b6733f';GROUND_SW[G_TILE]='#c8714a';GROUND_SW[G_WATER]='#5fcde4';
function groundIcon(b){var m=M(),c=document.createElement('canvas');c.width=56;c.height=36;var x=c.getContext('2d');x.imageSmoothingEnabled=false;
  if(L.gcv&&L.groundOK)for(var i=0;i<m.g.length;i++){var tx=i%m.w,ty=Math.floor(i/m.w);if(m.g[i]!==b.edit||inAnyRoom(tx,ty))continue;if(b.edit===G_WATER&&waterKind(tx,ty)!==W_POND&&waterKind(tx,ty)!==W_STREAM)continue;
    var ok=true;for(var dy=-1;dy<=1&&ok;dy++)for(var dx=-1;dx<=1;dx++)if(mget(m,tx+dx,ty+dy)!==b.edit){ok=false;break;}if(!ok)continue;
    x.drawImage(L.gcv,tx*T,ty*T+Math.round(T*0.22),T,Math.round(T*0.56),0,0,56,36);return c;}
  x.fillStyle=GROUND_SW[b.edit]||'#888';x.fillRect(0,0,56,36);return c;}
// the build panel: a row of groups, the group's things as a grid, and Remove at the end of the row
var NO_MOVE={trap:1};
function canMove(o,ax,ay){var m=M(),d=OBJ[o.k]||{},b=BUILDI[o.k],flat=d.flat;
  for(var y=ay;y<ay+o.fh;y++)for(var x=ax;x<ax+o.fw;x++){if(x<0||y<0||x>=m.w||y>=m.h)return false;var g=mget(m,x,y);
    if(o.k==='bridge'){if(g!==G_WATER)return false;}else{if(g===G_VOID||g===G_WALL||g===G_WATER)return false;}
    var ob=LS().objs;for(var i=0;i<ob.length;i++){var q=ob[i];if(q===o||q.deco)continue;if(x>=q.tx&&x<q.tx+q.fw&&y>=q.ty&&y<q.ty+q.fh){var qf=OBJ[q.k]&&OBJ[q.k].flat;if(!(qf^!!flat))return false;}}
    if(!flat&&o.k!=='bridge'&&occupied(x,y))return false;}
  return true;}
function moveTo(o,ax,ay){var ox=o.tx,oy=o.ty,d=OBJ[o.k]||{};o.tx=ax;o.ty=ay;
  if(d.flat||o.k==='bridge'){for(var y=Math.min(oy,ay)-1;y<=Math.max(oy,ay)+o.fh;y++)for(var x=Math.min(ox,ax)-1;x<=Math.max(ox,ax)+o.fw;x++)repaintTile(x,y);}
  resetSprites();if(o.gm){M().catArea={x:ax-2,y:ay-1,w:o.fw+4,h:4,back:true};}
  if(o.k==='coop')L.henPx=undefined;LS().objs=LS().objs.filter(function(q){return !(q.deco&&q.tx>=ax&&q.tx<ax+o.fw&&q.ty>=ay&&q.ty<ay+o.fh);});
  computePass();computeSpots();syncAgents();L.hints=null;L.dirty=true;sfx('thud');puff('dust',(ax+o.fw/2)*T,(ay+o.fh)*T-8,6,{speed:30,life:0.5});save();}
function tapMove(t){var o=L.moveObj;
  if(!o){var ob=LS().objs,best=null;for(var i=ob.length-1;i>=0;i--){var q=ob[i];if(q.deco||NO_MOVE[q.k])continue;if(t[0]>=q.tx&&t[0]<q.tx+q.fw&&t[1]>=q.ty&&t[1]<q.ty+q.fh){if(!best||(OBJ[best.k]&&OBJ[best.k].flat&&!(OBJ[q.k]&&OBJ[q.k].flat)))best=q;}}
    if(!best){toast('Tap something to move.');sfx('nope');return;}L.moveObj=best;sfx('click');L.hints=null;L.dirty=true;updateStat(true);return;}
  if(t[0]>=o.tx&&t[0]<o.tx+o.fw&&t[1]>=o.ty&&t[1]<o.ty+o.fh){L.moveObj=null;L.hints=null;L.dirty=true;updateStat(true);return;}
  var ax=t[0]-Math.floor((o.fw-1)/2),ay=t[1]-Math.floor((o.fh-1)/2);if(!canMove(o,ax,ay)){toast('It doesn’t fit there.');sfx('nope');return;}
  moveTo(o,ax,ay);L.moveObj=null;updateStat(true);}
function renderBuildPal(pal){var list=buildList(),cats=BCAT.filter(function(c){return list.some(function(b){return b.cat===c.id;});});
  if(!L.buildCat||!cats.some(function(c){return c.id===L.buildCat;}))L.buildCat=cats.length?cats[0].id:null;
  var items=list.filter(function(b){return b.cat===L.buildCat;});
  pal.innerHTML='<div class="bcats" role="tablist">'+cats.map(function(c){return '<button class="bcat" role="tab" data-cat="'+c.id+'" aria-pressed="'+(!L.removing&&!L.moving&&L.buildCat===c.id)+'">'+esc(c.name)+'</button>';}).join('')+
    '<button class="bcat bmv" data-mmode aria-pressed="'+!!L.moving+'">Move</button><button class="bcat brm" data-rmode aria-pressed="'+!!L.removing+'">Remove</button></div>'+
    (L.moving?'<div class="bnote">Tap a thing to pick it up, then tap where it goes. Moving is free.</div>':L.removing?'<div class="bnote">Tap something you built or painted to take it away. You get half back.</div>':
    '<div class="bgrid">'+items.map(function(b){return '<button data-item="'+b.id+'" aria-pressed="'+(L.buildSel===b.id)+'"><span class="pi"></span><b>'+esc(b.name)+'</b><small>'+fmtA(b.price)+(b.ground?' a tile':'')+'</small></button>';}).join('')+'</div>');
  pal.querySelectorAll('[data-cat]').forEach(function(bt){bt.onclick=function(){L.buildCat=bt.dataset.cat;L.removing=false;L.moving=false;L.moveObj=null;L.buildSel=null;sfx('click');renderBuildPal(pal);updateStat(true);L.hints=null;L.dirty=true;};});
  pal.querySelector('[data-mmode]').onclick=function(){L.moving=!L.moving;L.removing=false;L.moveObj=null;L.buildSel=null;L.hints=null;sfx('click');renderBuildPal(pal);updateStat(true);L.dirty=true;};
  var rm=pal.querySelector('[data-rmode]');rm.onclick=function(){L.removing=!L.removing;L.moving=false;L.moveObj=null;L.buildSel=null;sfx('click');renderBuildPal(pal);updateStat(true);L.dirty=true;};
  pal.querySelectorAll('[data-item]').forEach(function(bt){var ic=bt.querySelector('.pi');try{ic.appendChild(itemIcon(BUILDI[bt.dataset.item]));}catch(e){}
    bt.onclick=function(){L.buildSel=L.buildSel===bt.dataset.item?null:bt.dataset.item;L.hints=null;L.dirty=true;pal.querySelectorAll('[data-item]').forEach(function(q){q.setAttribute('aria-pressed',String(q.dataset.item===L.buildSel));});sfx('click');updateStat(true);};});}
function itemIcon(b){var c=document.createElement('canvas'),d=Math.min(2,window.devicePixelRatio||1);c.width=56*d;c.height=36*d;c.style.width='56px';c.style.height='36px';var x=c.getContext('2d');x.imageSmoothingEnabled=false;
  var s;if(b.ground){var gi=groundIcon(b);if(gi){x.drawImage(gi,0,0,c.width,c.height);return c;}}
  if(b.edit===G_STEP){var pb=new PB(28,18);pb.rect(0,0,28,18,'#6abe30');pb.ell(9,9,6,4,'#9badb7');pb.ell(20,10,5,3.5,'#9badb7');pb.set(7,7,'#cbdbfc');s=mk(pb,14,18);}
  else if(b.edit===G_WATER){var pw=new PB(28,18);pw.rect(0,0,28,18,'#6abe30');pw.ell(14,9,11,6,'#5fcde4');pw.rect(9,6,6,1,'#cbdbfc');s=mk(pw,14,18);}
  else{var sz=itemSize(b),o={k:b.k,tx:0,ty:0,fw:sz[0],fh:sz[1],seed:17,v:(b.o&&b.o.v!=null)?b.o.v:0,s:0.6,i:-1};try{s=OBJ[b.k].spr(o);}catch(e){}}
  if(s){var sc=Math.min(56*d/s.w,36*d/s.h),k=sc>=1?Math.floor(sc):sc;x.drawImage(s.c,Math.round((c.width-s.w*k)/2),Math.round((c.height-s.h*k)/2),Math.round(s.w*k),Math.round(s.h*k));}return c;}

// ----- the bubble over the map -----
function showBub(cx,cy,html,mount){closeBub();var host=$('lwrap');if(!host)return;var d=document.createElement('div');d.className='bub lbub';d.innerHTML=html;host.appendChild(d);
  // the tap that opened it can turn into a click on whatever appears under the finger: ignore clicks for a moment
  d._t0=performance.now();d.addEventListener('click',function(e){if(performance.now()-d._t0<350){e.stopPropagation();e.preventDefault();}},true);
  d.addEventListener('pointerdown',function(e){e.stopPropagation();});
  var w=d.offsetWidth,h=d.offsetHeight,W=host.clientWidth,H=host.clientHeight,left=clamp(cx-w/2,6,Math.max(6,W-w-6)),top=cy-h-14;if(top<6)top=Math.min(H-h-6,cy+16);d.style.left=left+'px';d.style.top=Math.max(6,top)+'px';L.bub=d;L.bubCam=[L.cam.x,L.cam.y];if(mount)mount(d);}
function closeBub(){if(L.bub){L.bub.remove();L.bub=null;}}

// ----- the Home tab -----
var TOOLS=[
 {id:'walk',name:'Walk',svg:'<circle cx="11" cy="3.5" r="1.8"/><path d="M10.4 6.6L9 12"/><path d="M10.2 7.4L7 9.8"/><path d="M10.2 7.4l2.6 3"/><path d="M9 12l-2.8 5"/><path d="M9 12l3.2 2 .5 3"/>'},
 {id:'mow',name:'Mow',svg:'<path d="M3.5 13.5h9.5l1.6-4.5H6.2z"/><circle cx="6" cy="15.6" r="1.6"/><circle cx="12" cy="15.6" r="1.6"/><path d="M14.6 9l2.6-5.5"/>'},
 {id:'grain',name:'Grain',svg:'<path d="M3.5 9.5h9l-1.2 5H4.7z"/><path d="M12.5 10.5l4-3.2"/><path d="M6 6.5l.01 0M9 5l.01 0M11 7l.01 0M7.5 3.5l.01 0"/>'},
 {id:'rod',name:'Rod',svg:'<path d="M4 17.5L15.5 3"/><path d="M15.5 3c1.3 5 1 9-1.4 11.5"/><circle cx="13.9" cy="15.6" r="1.4"/>'},
 {id:'build',name:'Build',svg:'<path d="M11.5 3.5l5 5-2.2 2.2-5-5z"/><path d="M10.6 7.4l-6.6 6.6 2.2 2.2 6.6-6.6"/>'}];
function mapTool(t){return t==='look'||!t?'walk':t;}
function toolsHere(){var m=M(),has={},wild=false;m.g.forEach(function(g){has[g]=1;});if(m.wb)m.wb.forEach(function(k){if(k===W_STREAM||k===W_LAKE)wild=true;});
  return TOOLS.filter(function(t){if(t.id==='mow')return has[G_GRASS]||has[G_MEADOW];if(t.id==='grain')return S.stage>=2;if(t.id==='rod')return wild;return true;});}
function mountHome(){var p=$('p-home');ensureLand();
  p.innerHTML='<div class="card hcard"><div class="hd"><h2 id="h-name"></h2><small id="h-sub"></small><button class="qh" id="h-help" aria-label="How the home works">?</button></div><div class="hmove" id="h-move"></div></div>'+
   '<div class="landwrap pixland" id="lwrap"><canvas id="land-cv"></canvas></div><div class="ltools" id="ltools"></div><div class="palette lpal" id="lpal" hidden></div><div class="lstat" id="lstat"></div>';
  L.cv=$('land-cv');L.sizedCv=null;L.cv.addEventListener('pointerdown',onDown);L.cv.addEventListener('pointermove',onMove);L.cv.addEventListener('pointerup',onUp);L.cv.addEventListener('pointercancel',onUp);
  L.cv.addEventListener('contextmenu',function(e){e.preventDefault();});
  $('h-help').onclick=function(){openPop('<div class="sheet-hd"><h2>Home</h2><button class="btn sm" onclick="closePop()">Close</button></div>'+
    '<p><b>Walk:</b> tap where Millie should go, or hold and drag to steer her. Tap a thing and she walks over and uses it: a tank, the feeder, the coop, Grandma, the bench. The dog comes along. Tap him or Pierre to say hi.</p>'+
    '<p><b>Birds:</b> sit on the bench or keep still and they come closer. Tap one and stay still while the ring fills. It goes in the book.</p>'+
    '<p><b>Mow:</b> walk over the grass and the mower cuts it. Short lawn brings hoopoes, long grass brings bee-eaters.</p>'+
    '<p><b>Grain:</b> tap the ground to throw some. Out on the land, step back and wait. When a wild chicken pecks the grain, tap it and Millie creeps up and catches it.</p>'+
    '<p><b>Rod:</b> tap the stream or the lake. Tap again when the float goes under. Keep the fish in the bucket and tap your pond to let them in.</p>'+
    '<p><b>Shrimp trap:</b> with Walk, tap the stream. Check it after a few hours.</p>'+
    '<p><b>Build:</b> pick something, then tap where it goes. Drag to look around. Tap a thing you built to take it away.</p>');};
  var tl=$('ltools');tl.innerHTML=toolsHere().map(function(t){return '<button class="btn" data-tool="'+t.id+'" aria-pressed="false"><svg viewBox="0 0 20 20" aria-hidden="true">'+t.svg+'</svg>'+t.name+'</button>';}).join('');
  L.tool=mapTool(L.tool);if(!toolsHere().some(function(t){return t.id===L.tool;}))L.tool='walk';
  tl.querySelectorAll('[data-tool]').forEach(function(b){b.onclick=function(){setTool(b.dataset.tool);sfx('click');};});
  computePass();if(!L.me)placeChars();renderCard();updateStat(true);setTool(L.tool,true);sizeCanvas();syncAgents();computeSpots();
  if(!L.camSet){L.camSet=true;camFocus(L.me.x,L.me.y-40);}
  var l=LS();if(l.seen.refund){toast('Your old decorations were packed up. '+fmtA(l.seen.refund)+' back.',3800);l.seen.refund=0;}}
function setTool(id,quiet){id=mapTool(id);if(L.cv&&!toolsHere().some(function(t){return t.id===id;})){if(!quiet)toast(id==='rod'?'No fish here yet. Wait for the land with the stream.':'Not here yet.');id='walk';}
  L.tool=id;LS().tool=id;closeBub();L.hints=null;L.dirty=true;if(id!=='rod'&&L.fishing)L.fishing=null;if(id!=='build')L.camFree=false;if(id==='mow'&&L.me)L.me.speed=150;else if(L.me)L.me.speed=ME_SPEED;
  document.querySelectorAll('#ltools [data-tool]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.tool===id));});
  var pal=$('lpal');if(pal){if(id==='build'){renderBuildPal(pal);pal.hidden=false;}else{pal.hidden=true;L.buildSel=null;L.removing=false;L.moving=false;L.moveObj=null;}}
  if(!quiet)sizeCanvas();updateStat(true);}
// one canvas pixel per art pixel, scaled up by CSS: a whole number of screen pixels per art pixel where the screen allows
// (2 on 3x phones), 1.5 on 2x phones, about 44 CSS px per tile either way
function pickCpa(dpr){var d=dpr*0.6875;if(d>=1.75)return Math.round(d)/dpr;if(d>=1.2)return 1.5/dpr;return 1/dpr;}
function sizeCanvas(){var wrap=$('lwrap');if(!wrap||!L.cv)return;var W=wrap.clientWidth,top=wrap.getBoundingClientRect().top,pal=$('lpal'),palH=pal&&!pal.hidden?78:0;
  var tb=document.querySelector('.tabs'),tabsH=tb?tb.getBoundingClientRect().height:62,tl=$('ltools'),toolsH=(tl?tl.offsetHeight:50)+14;var H=Math.round(clamp(window.innerHeight-top-toolsH-34-palH-tabsH-10,250,660));
  var dpr=window.devicePixelRatio||1,cpa=pickCpa(dpr);if(Math.abs(H-L.cssH)<3&&W===L.cssW&&L.x&&L.sizedCv===L.cv&&cpa===L.cpa)return;L.sizedCv=L.cv;
  var mid=L.VW?[L.cam.x+L.VW/2,L.cam.y+L.VH/2]:null;L.cssW=W;L.cssH=H;L.dpr=dpr;L.cpa=cpa;L.s=1;L.cv.style.height=H+'px';L.cv.width=Math.max(1,Math.round(W/cpa));L.cv.height=Math.max(1,Math.round(H/cpa));L.VW=L.cv.width;L.VH=L.cv.height;
  if(mid){L.cam.x=mid[0]-L.VW/2;L.cam.y=mid[1]-L.VH/2;}L.x=L.cv.getContext('2d',{alpha:false});L.x.imageSmoothingEnabled=false;clampCam();L.dirty=true;}
function homeSub(){var l=LS(),n=Math.min(S.tanks.length,STAGES[S.stage].tanks),bits=[plural(n,'tank')+' of '+STAGES[S.stage].tanks];if(l.hens.length&&S.stage>=2)bits.push(plural(l.hens.length,'hen'));if(l.pond.length)bits.push(plural(l.pond.length,'fish','fish')+' in the pond');var birds=Object.keys(S.book.birds||{}).length;if(birds)bits.push(plural(birds,'bird')+' seen');return bits.join(' · ');}
function renderCard(){var nm=$('h-name');if(!nm)return;nm.textContent=STAGES[S.stage].name;$('h-sub').textContent=homeSub();var mv=$('h-move'),nx=STAGES[S.stage+1];
  if(!nx){mv.innerHTML='';mv.hidden=true;return;}mv.hidden=false;var sure=L.confirmMove>performance.now();
  var html='<span>Next: '+esc(nx.name)+'</span><button class="btn sm'+(sure?'':' primary')+'" id="h-go"'+(S.cash<nx.cost?' disabled':'')+'>'+(sure?'Tap again to move':'Move · '+fmtA(nx.cost))+'</button>';
  if(mv._h!==html){mv.innerHTML=html;mv._h=html;var b=$('h-go');if(b)b.onclick=function(){if(L.confirmMove>performance.now()){L.confirmMove=0;if(!spend(nx.cost,'the move'))return;landSetStage(S.stage+1);sfx('book');toast('You moved. '+STAGES[S.stage].name+'.');return;}L.confirmMove=performance.now()+3000;renderCard();setTimeout(renderCard,3100);};}}
function updateStat(force){var el=$('lstat');if(!el)return;var l=LS(),html='',eggsN=0,me=L.me;Object.keys(l.basket).forEach(function(k){eggsN+=l.basket[k];});
  var f=L.fishing,b=L.tool==='build'&&L.buildSel&&BUILDI[L.buildSel];
  if(L.watch)html='Stay still while the ring fills.';
  else if(f&&(f.st==='wait'||f.st==='fly'))html='Wait for the float to go under, then tap.';
  else if(f&&f.st==='bite')html='<b>Now!</b> Tap.';
  else if(L.tool==='build'&&L.moving)html=L.moveObj?'Tap where the '+esc(((OBJ[L.moveObj.k]||{}).name||'thing').toLowerCase())+' goes. Tap it again to put it down.':'Tap anything to pick it up.';
  else if(L.tool==='build'&&L.removing)html='Tap or drag over things you built to take them away.';
  else if(b)html=b.ground?esc(b.name)+': tap a tile, or drag to paint. '+fmtA(b.price)+' a tile.':'Tap where the '+esc(b.name.toLowerCase())+' goes. '+fmtA(b.price)+'.';
  else if(L.tool==='build')html='Pick something to build. Drag the map to look around.';
  else if(l.bucket.length)html='<span>Bucket: '+plural(l.bucket.length,'fish','fish')+'. Tap your pond to let '+(l.bucket.length>1?'them':'it')+' in.</span>';
  else if(eggsN)html='<span>Basket: '+plural(eggsN,'egg')+'</span><button class="btn sm" data-sell>Sell · '+fmtA(eggsN)+'</button><button class="btn sm" data-gm>Give Grandma</button>';
  else if(L.tool==='mow')html='Walk over the grass to cut it. Hold and drag to steer.';
  else if(L.tool==='grain')html=S.stage>=3?'Throw grain, step back. Tap a chicken while it pecks.':'Tap the ground to throw grain.';
  else if(L.tool==='rod')html='Tap the stream or the lake to cast.';
  else if(!l.seen.walk)html='Tap where Millie should go. Tap things to use them.';
  else{var fe=l.objs.filter(function(o){return o.k==='feeder'||o.k==='wfeeder';}),empty=fe.length&&fe.every(function(o){return (o.s||0)<0.05;}),ready=trapsOn().some(trapReady),eg=l.eggs.length;
    html=me&&me.sit?'Tap a bird to watch it.':ready?'Something’s in the trap.':eg?plural(eg,'egg')+' in the coop.':empty?'The feeder’s empty. Tap it to fill.':!Object.keys(S.book.birds||{}).length?(stageHas('bench')?'Sit on the bench and birds come close. Tap one to watch it.':'Keep still and birds come closer. Tap one to watch it.'):'';}
  if(el._h===html)return;el._h=html;el.innerHTML=html;
  var sb=el.querySelector('[data-sell]');if(sb)sb.onclick=function(){earn(eggsN,'eggs');l.basket={};sfx('coin');toast('Sold '+plural(eggsN,'egg')+' for '+fmtA(eggsN)+'.');updateStat(true);save();};
  var gb=el.querySelector('[data-gm]');if(gb)gb.onclick=function(){l.basket={};toast('Grandma got '+plural(eggsN,'egg')+'. She’s making steamed egg.');updateStat(true);save();};}

// ----- drawing (one canvas pixel per art pixel; nothing here allocates per frame) -----
function drawSpr(x,s,wx,wy){if(!s)return;x.drawImage(s.c,Math.round(wx-s.ax)-L.cdx,Math.round(wy-s.ay)-L.cdy);}
var DOGL=null;
function dogCanvas(left){var im=IMG.dog;if(!im||!im.naturalWidth)return null;if(!left)return im;if(DOGL)return DOGL;var n=13,c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;var x=c.getContext('2d');
  for(var i=0;i<n;i++){x.save();x.translate(i*128+128,0);x.scale(-1,1);x.drawImage(im,i*128,0,128,128,0,0,128,128);x.restore();}DOGL=c;return c;}
// a crisp pixel line between two world points
function pxLine(x,x0,y0,x1,y1,col,w){var n=Math.max(1,Math.round(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));x.fillStyle=col;w=w||1;for(var i=0;i<=n;i++){var t=i/n;x.fillRect(Math.round(x0+(x1-x0)*t)-L.cdx,Math.round(y0+(y1-y0)*t)-L.cdy,w,w);}}
function drawMillie(x){var me=L.me;meFrame();var im=IMG[L.mfImg];if(!im||!im.naturalWidth){wrect(x,me.x-12,me.y-60,24,60,'#d63636');return;}
  var sit=!!me.sit;drawSpr(x,shadowSpr(17,5),me.x,me.y-(sit?2:1));x.drawImage(im,L.mfIdx*128,0,128,128,Math.round(me.x-64)-L.cdx,Math.round(me.y-(sit?116:126))-L.cdy,128,128);
  if(L.tool==='rod'&&!me.moving&&!sit){rodTip();var d=me.dir,hx=me.x+(d==='right'?14:d==='left'?-14:12),hy=me.y-48;pxLine(x,hx,hy,L.tipX,L.tipY,'#8f563b',2);}}
function drawDog(x){var dg=L.dog,fi=dogFrame(),side=fi<13,left=dg.face<0&&side,im=dogCanvas(left);if(!im)return;var ax=side?60:71;if(left)ax=128-ax;
  var hop=dg.hop>0?Math.sin((1-dg.hop/0.5)*Math.PI)*16:0;drawSpr(x,shadowSpr(side?22:15,5),dg.x,dg.y-1);x.drawImage(im,fi*128,0,128,128,Math.round(dg.x-ax)-L.cdx,Math.round(dg.y-126-hop)-L.cdy,128,128);}
function drawCat(x){var c=L.cat;catFrame();var s=catSpr(L.cfPose,L.cfIdx,c.face),hop=c.hop>0?Math.sin((1-c.hop/0.45)*Math.PI)*12:0;if(!c.on)drawSpr(x,shadowSpr(L.cfPose==='nap'?30:L.cfPose==='walk'?24:21,4),c.x,c.y-1);drawSpr(x,s,c.x,c.y-hop);}
function drawWater(x){var m=M(),x0=Math.max(0,Math.floor(L.cam.x/T)),y0=Math.max(0,Math.floor(L.cam.y/T)),x1=Math.min(m.w-1,Math.ceil((L.cam.x+L.VW)/T)),y1=Math.min(m.h-1,Math.ceil((L.cam.y+L.VH)/T));x.fillStyle='#ffffff';
  for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){if(m.g[ty*m.w+tx]!==G_WATER)continue;var k=(m.wb&&m.wb[ty*m.w+tx])||W_POND,flow=k===W_STREAM,len=k===W_SEA?6:5;
    for(var j=0;j<2;j++){var h=hash2(tx*3+j,ty,21),lx=flow?((L.rt*(14+h*8)+h*64)%64):8+h*40+Math.sin(L.rt*0.8+h*9+j)*4,ly=10+hash2(tx,ty*3+j,22)*40,px=tx*T+lx,py=ty*T+ly;
      if(mget(m,(px+len)>>6,py>>6)!==G_WATER||mget(m,px>>6,(py+10)>>6)!==G_WATER||mget(m,px>>6,(py-10)>>6)!==G_WATER)continue;
      x.globalAlpha=0.45+0.35*Math.sin(L.rt*1.3+h*7);x.fillRect(Math.round(px)-L.cdx,Math.round(py)-L.cdy,len,1);x.fillRect(Math.round(px)+len-L.cdx,Math.round(py)-1-L.cdy,2,1);}}
  x.globalAlpha=1;}
function drawWindowFeeders(x){var ob=LS().objs;for(var i=0;i<ob.length;i++){var o=ob[i];if(o.k!=='wfeeder')continue;var r=mainRoom(),px=oX(o),py=(r?r.y:o.ty)*T-30;if(!inView(px,py,80))continue;drawSpr(x,objSprite(o),px,py);var lvl=clamp(o.s||0,0,1),sh=Math.round(14*lvl);if(sh>0)wrect(x,px-15,py-4-sh,30,sh,'#d9a066');
  for(var j=0;j<L.birds.length;j++)if(L.birds[j].win)drawBird(x,L.birds[j]);}}
function drawBird(x,b){var s=birdSpr(b.sp,birdPose(b),b.face);if(b.st==='stay'&&!b.spot.hover&&!b.win)drawSpr(x,shadowSpr(Math.max(4,Math.round(BIRD[b.sp].len*0.4)),2),b.x,b.y);drawSpr(x,s,b.x,b.y);}
function drawTrap(x,o){var cx=o.tx*T+T/2,cy=Math.round(o.ty*T+T/2+Math.sin(L.rt*2.2+o.tx)*1.5),bk=o.bank||[cx,cy+40];
  var n=Math.max(2,Math.round(Math.hypot(bk[0]-cx,bk[1]-cy)/3));x.fillStyle='#d8cfb8';for(var i=0;i<=n;i++){var t=i/n,sag=Math.sin(t*Math.PI)*6;x.fillRect(Math.round(cx+(bk[0]-cx)*t)-L.cdx,Math.round(cy+(bk[1]-cy)*t+sag)-L.cdy,1,1);}
  wrect(x,bk[0]-2,bk[1]-12,4,14,'#6b4226');wrect(x,bk[0]-2,bk[1]-12,4,1,'#8f563b');
  drawSpr(x,bobberSpr(),cx,cy);wrect(x,cx-5,cy+1,10,1,'#cbdbfc');
  if(trapReady(o)&&Math.floor(L.rt*2)%2===0){wrect(x,cx-1,cy-22,3,8,'#fbf236');wrect(x,cx-1,cy-12,3,3,'#fbf236');wrect(x,cx-2,cy-23,5,1,INKc);}}
function drawFishing(x){var f=L.fishing;if(!f||f.st==='idle')return;rodTip();var tx=L.tipX,ty=L.tipY,bx=f.x,by=f.y+(f.st==='bite'?3:f.dip>0?1.5:Math.sin(L.rt*2.4)*0.8),mx=(tx+bx)/2,my=Math.max(ty,by)+24;
  x.fillStyle='#4a423a';for(var i=0;i<=24;i++){var t=i/24,u=1-t,px=u*u*tx+2*u*t*mx+t*t*bx,py=u*u*ty+2*u*t*my+t*t*by;x.fillRect(Math.round(px)-L.cdx,Math.round(py)-L.cdy,1,1);}
  if(f.st==='bite'){x.save();x.beginPath();x.rect(Math.round(bx-6)-L.cdx,Math.round(by-12)-L.cdy,12,9);x.clip();drawSpr(x,bobberSpr(),bx,by);x.restore();}else drawSpr(x,bobberSpr(),bx,by);}
// the watch ring: pixel dots, white all round, green as it fills
var RING=[];(function(){for(var i=0;i<40;i++){var a=-Math.PI/2+i/40*Math.PI*2;RING.push([Math.round(Math.cos(a)*9),Math.round(Math.sin(a)*9)]);}})();
function drawWatch(x){var w=L.watch;if(!w||!w.b)return;var b=w.b,k=clamp(w.t/1.5,0,1),cy=Math.round(b.y-Math.round(BIRD[b.sp].len*1.45)-16),cx=Math.round(b.x),n=Math.round(k*RING.length);
  x.fillStyle='#fbf8f1';for(var i=0;i<RING.length;i++)x.fillRect(cx+RING[i][0]-1-L.cdx,cy+RING[i][1]-1-L.cdy,3,3);
  x.fillStyle='#2d6a4f';for(var j=0;j<n;j++)x.fillRect(cx+RING[j][0]-L.cdx,cy+RING[j][1]-L.cdy,2,2);}
// a bird's name floats up over it for a moment (a little HTML tag, so the text stays sharp)
function showLabel(text,wx,wy){var host=$('lwrap');if(!host)return;var c=toCss(wx,wy),d=document.createElement('div');d.className='llbl';d.textContent=text;d.style.left=c[0]+'px';d.style.top=c[1]+'px';host.appendChild(d);setTimeout(function(){d.remove();},2200);}
// where the chosen thing can go, worked out once per pick
function buildHints(){var b=L.tool==='build'&&L.buildSel&&BUILDI[L.buildSel];L.hints=null;
  if(L.tool==='build'&&L.moving&&L.moveObj){var mo=L.moveObj,mm=M(),hm=new Uint8Array(mm.w*mm.h);for(var yy=0;yy<mm.h;yy++)for(var xx=0;xx<mm.w;xx++){if(canMove(mo,xx-Math.floor((mo.fw-1)/2),yy-Math.floor((mo.fh-1)/2)))hm[yy*mm.w+xx]=1;}L.hints=hm;L.dirty=true;return;}
  if(!b)return;var m=M(),h=new Uint8Array(m.w*m.h);for(var ty=0;ty<m.h;ty++)for(var tx=0;tx<m.w;tx++){var a=anchorFor(b,tx,ty);if(canPlace(b,a[0],a[1]))h[ty*m.w+tx]=1;}L.hints=h;L.dirty=true;}
function drawBuildHints(x){if(L.tool!=='build'||!(L.buildSel||(L.moving&&L.moveObj)))return;if(L.moving&&L.moveObj){var mo=L.moveObj;x.strokeStyle='#fbf8f1';x.lineWidth=2;x.setLineDash([6,4]);x.strokeRect(mo.tx*T-L.cdx+1,mo.ty*T-L.cdy+1,mo.fw*T-2,mo.fh*T-2);x.setLineDash([]);}if(!L.hints)buildHints();var h=L.hints;if(!h)return;var m=M(),x0=Math.max(0,Math.floor(L.cam.x/T)),y0=Math.max(0,Math.floor(L.cam.y/T)),x1=Math.min(m.w-1,Math.ceil((L.cam.x+L.VW)/T)),y1=Math.min(m.h-1,Math.ceil((L.cam.y+L.VH)/T));
  for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){if(!h[ty*m.w+tx])continue;x.fillStyle=INKc;x.fillRect(tx*T+29-L.cdx,ty*T+29-L.cdy,6,6);x.fillStyle='#fbf8f1';x.fillRect(tx*T+30-L.cdx,ty*T+30-L.cdy,4,4);}}
function drawMarker(x){var mk2=L.marker;if(!mk2)return;var a=1-mk2.t/0.7,r=Math.round(4+mk2.t*10);x.globalAlpha=clamp(a,0,1);x.fillStyle='#fbf8f1';var X=Math.round(mk2.x)-L.cdx,Y=Math.round(mk2.y)-L.cdy;
  x.fillRect(X-r,Y,3,1);x.fillRect(X+r-3,Y,3,1);x.fillRect(X-1,Y-Math.round(r*0.5),3,1);x.fillRect(X-1,Y+Math.round(r*0.5),3,1);x.globalAlpha=1;}
// the y-sorted list is a pool of small records, refilled every frame
var IT=[],NIT=0,SORTED=[];
var I_OBJ=1,I_WALL=2,I_RAIL=3,I_ME=4,I_MOW=5,I_DOG=6,I_CAT=7,I_HEN=8,I_WILD=9,I_BIRD=10;
function addIt(y,t,a,b){var it=IT[NIT];if(!it)it=IT[NIT]={y:0,t:0,a:null,b:0};it.y=y;it.t=t;it.a=a;it.b=b;NIT++;SORTED.push(it);}
function byY(p,q){return p.y-q.y;}
function onGround(b){return !b.win&&b.st==='stay'&&!b.spot.hover&&b.spot.t!=='tree'&&b.spot.t!=='fence'&&b.spot.t!=='feeder';}
function drawIt(x,it){var t=it.t,o,c;
  if(t===I_OBJ){o=it.a;if(o.k==='trap'){drawTrap(x,o);return;}var sp=objSprite(o);if(sp)drawSpr(x,sp,oX(o),oBase(o));var d=OBJ[o.k];if(d.live)d.live(x,o,L.clock);}
  else if(t===I_WALL)drawSpr(x,frontWallSpr(it.a,it.b),it.a.x*T-10,(it.a.y+it.a.h)*T);
  else if(t===I_RAIL)drawSpr(x,railSpr(it.a),it.a.x*T-4,(it.a.y+it.a.h)*T);
  else if(t===I_ME)drawMillie(x);
  else if(t===I_MOW){mowerPos();drawSpr(x,mowerSpr(L.me.dir),L.mpX,L.mpY+8);}
  else if(t===I_DOG)drawDog(x);
  else if(t===I_CAT)drawCat(x);
  else if(t===I_HEN||t===I_WILD){c=it.a;drawSpr(x,shadowSpr(12,3),c.x,c.y);drawSpr(x,henSpr(c.kind||'wild',chickPose(c),c.face),c.x,c.y);}
  else if(t===I_BIRD)drawBird(x,it.a);}
function draw(){var x=L.x,m=M(),cv=L.cv,i;L.cdx=Math.round(L.cam.x);L.cdy=Math.round(L.cam.y);
  x.setTransform(1,0,0,1,0,0);x.imageSmoothingEnabled=false;
  if(!L.groundOK&&ART.ready)renderGround();
  var W=m.w*T,H=m.h*T;if(L.cdx<0||L.cdy<0||L.cdx+cv.width>W||L.cdy+cv.height>H||!L.groundOK){x.fillStyle=PAL.VOID;x.fillRect(0,0,cv.width,cv.height);}
  if(L.groundOK){var sx0=Math.max(0,L.cdx),sy0=Math.max(0,L.cdy),sx1=Math.min(W,L.cdx+cv.width),sy1=Math.min(H,L.cdy+cv.height);if(sx1>sx0&&sy1>sy0)x.drawImage(L.gcv,sx0,sy0,sx1-sx0,sy1-sy0,sx0-L.cdx,sy0-L.cdy,sx1-sx0,sy1-sy0);}
  if(!ART.ready)return;
  drawWater(x);drawPondFish(x);drawWindowFeeders(x);
  if(L.grain.length){for(i=0;i<L.grain.length;i++){var g=L.grain[i];var gx=Math.round(g.x)-L.cdx,gy=Math.round(g.y)-L.cdy;x.fillStyle='rgba(30,22,8,0.4)';x.fillRect(gx-4,gy+4,10,3);x.fillStyle='#2e2010';x.fillRect(gx-3,gy-3,8,8);x.fillRect(gx-4,gy-2,10,6);x.fillStyle='#f7c948';x.fillRect(gx-3,gy-2,8,6);x.fillRect(gx-2,gy-3,6,8);x.fillStyle='#c98f22';x.fillRect(gx-2,gy+2,7,2);x.fillStyle='#fff6c2';x.fillRect(gx-1,gy-2,3,2);}}
  drawMarker(x);
  NIT=0;SORTED.length=0;var ob=LS().objs;
  for(i=0;i<ob.length;i++){var o=ob[i],d=OBJ[o.k];if(!d||d.flat||d.wall)continue;var by=oBase(o),ox=oX(o);if(ox<L.cam.x-260||ox>L.cam.x+L.VW+260||by<L.cam.y-60||by>L.cam.y+L.VH+300)continue;addIt(by,I_OBJ,o,0);}
  for(i=0;i<m.rooms.length;i++)addIt((m.rooms[i].y+m.rooms[i].h)*T,I_WALL,m.rooms[i],i);
  if(m.balcony)addIt((m.balcony.y+m.balcony.h)*T,I_RAIL,m.balcony,0);
  if(L.me){addIt(L.me.y,I_ME,null,0);if(L.tool==='mow'&&!L.me.sit){mowerPos();addIt(L.mpY+(L.me.dir==='down'?4:L.me.dir==='up'?-30:1),I_MOW,null,0);}}
  if(L.dog)addIt(L.dog.y,I_DOG,null,0);
  if(L.cat)addIt(L.cat.on?oBase(L.cat.on)+1:L.cat.y,I_CAT,null,0);
  for(var id in L.henA){var c=L.henA[id];if(inView(c.x,c.y,60))addIt(c.y,I_HEN,c,0);}
  for(var id2 in L.wildA){var c2=L.wildA[id2];if(inView(c2.x,c2.y,60))addIt(c2.y,I_WILD,c2,0);}
  for(i=0;i<L.birds.length;i++){var b=L.birds[i];if(onGround(b))addIt(b.y,I_BIRD,b,0);}
  SORTED.sort(byY);for(i=0;i<SORTED.length;i++)drawIt(x,SORTED[i]);
  // up in the air: birds on perches and flying, butterflies, bits
  for(i=0;i<L.birds.length;i++){var b2=L.birds[i];if(b2.win||onGround(b2))continue;drawBird(x,b2);}
  if(L.bfl)for(i=0;i<L.bfl.length;i++){var f=L.bfl[i];drawSpr(x,bflySpr(f.c,f.rest>0?(Math.sin(f.ph*3)>0.6?1:0):Math.floor(f.ph*16)%2),Math.round(f.x),Math.round(f.y));}
  drawParts(x);drawFishing(x);drawBuildHints(x);drawWatch(x);
  if(L.me&&LS().bucket.length&&!L.me.sit)drawSpr(x,bucketSpr(1),L.me.x,L.me.y-118+Math.round(Math.sin(L.rt*3)));}
// eggs in the nest, Grandma in her chair: drawn after their furniture
OBJ.coop.live=function(x,o){var s=objSprite(o),eg=LS().eggs;if(!s||!s.nest)return;for(var i=0;i<Math.min(eg.length,6);i++)drawSpr(x,eggSpr(eg[i]),oX(o)+s.nest.x+4+i*5,oBase(o)+s.nest.y+2+(i%2));};
OBJ.armchair.live=function(x,o){if(!o.gm)return;drawSpr(x,grandmaSpr(Math.floor(L.rt*2.2)%2),oX(o)-2,oBase(o)-2);};
// draw at full rate while things move, 30 fps for small animals, 8 fps when only water and Grandma's needles move
function busy(){var me=L.me,dg=L.dog,c=L.cat;return L.dirty||L.camMoving||(me&&me.moving)||(dg&&(dg.run||dg.hop>0))||(c&&(c.st==='walk'||c.hop>0||c.reach>0))||L.parts.length>0||(L.fishing&&L.fishing.st!=='idle')||!!L.watch||!!L.marker||!!(L.ptr&&L.ptr.down);}
function lively(){var i,b;for(i=0;i<L.birds.length;i++){b=L.birds[i];if(b.st!=='stay'||b.spot.hover)return true;}if(L.bfl&&L.bfl.length)return true;for(var id in L.henA){var c=L.henA[id];if(c.st==='walk'||c.st==='run'||c.st==='flap')return true;}for(var id2 in L.wildA){var c2=L.wildA[id2];if((c2.st==='walk'||c2.st==='run')&&inView(c2.x,c2.y,40))return true;}return false;}
function frame(dt){if(!L.cv||!L.x)return;var wdt=running()?dt:0;L.clock+=wdt;L.rt+=dt;var t0=performance.now();
  if(!L.pass)computePass();if(!L.me)placeChars();
  stepPointer();stepMe(dt);stepMow(dt);stepDog(dt);if(wdt>0)stepCat(wdt);stepCam(dt);stepWatch(dt);
  L.spotT+=dt;if(L.spotT>4){L.spotT=0;computeSpots();}
  if(wdt>0){stepBirds(wdt);stepButterflies(wdt);var a=henArea();if(a)for(var id in L.henA)stepChick(L.henA[id],wdt,a);var wa=L.wildPx;if(wa)for(var id2 in L.wildA)stepChick(L.wildA[id2],wdt,wa);stepPondFish(wdt);}
  stepParts(dt);stepFishing(dt);if(L.rqn>0)drainRepaint(2.5);
  if(L.marker){L.marker.t+=dt;if(L.marker.t>0.7)L.marker=null;}
  // a bubble belongs to where it was opened: it rides along while the view settles, and goes when the view moves on
  if(L.bub&&L.bubCam){var bdx=Math.round((L.cam.x-L.bubCam[0])*L.cpa),bdy=Math.round((L.cam.y-L.bubCam[1])*L.cpa);
    if(Math.abs(L.cam.x-L.bubCam[0])+Math.abs(L.cam.y-L.bubCam[1])>40&&((L.me&&L.me.moving)||L.camFree))closeBub();
    else if(L.bub._dx!==bdx||L.bub._dy!==bdy){L.bub._dx=bdx;L.bub._dy=bdy;L.bub.style.transform='translate('+(-bdx)+'px,'+(-bdy)+'px)';}}
  L.drawAcc=(L.drawAcc||0)+dt;var need=busy()?0:lively()?1/30:1/8;
  if(L.drawAcc>=need){L.drawAcc=0;draw();L.dirty=false;L.draws=(L.draws||0)+1;}
  L.ft=performance.now()-t0;
  if((L.fc=(L.fc||0)+1)%10===0){updateStat();renderCard();var me=L.me;if(me&&!me.moving){var mt=tileOf(me.x,me.y),lm=LS().me;if(!lm||lm.tx!==mt[0]||lm.ty!==mt[1])LS().me={tx:mt[0],ty:mt[1]};}}}

// ----- the book -----
function bookDraw(x,s,w,h){if(!s)return;var d=1;try{d=x.getTransform().a||1;}catch(e){}x.imageSmoothingEnabled=false;var kd=Math.floor(Math.min((w-4)*d/s.w,(h-4)*d/s.h)),k=kd>=1?kd/d:Math.min((w-4)/s.w,(h-4)/s.h);
  x.drawImage(s.c,Math.round((w-s.w*k)/2*d)/d,Math.round((h-s.h*k)/2*d)/d,s.w*k,s.h*k);}
function regBook(){
  bookCat('birds',{title:'Birds',order:2,entries:BIRDS.map(function(B){return {id:B.id,name:B.name,hint:B.hint,draw:function(x,w,h){bookDraw(x,birdSpr(B.id,0,1),w,h);}};})});
  bookCat('fish',{title:'Fish',order:3,entries:FISH.map(function(F){return {id:F.id,name:F.name,hint:F.hint,draw:function(x,w,h){bookDraw(x,fishSpr(F.id),w,h);}};})});
  bookCat('finds',{title:'Stream finds',order:4,entries:FINDS.map(function(f){return {id:f.id,name:f.name,hint:f.hint,draw:function(x,w,h){bookDraw(x,findSpr(f.id),w,h);}};})});
  var coop=HENS.map(function(Hn){return {id:'hen-'+Hn.id,name:Hn.name,hint:Hn.hint,draw:function(x,w,h){bookDraw(x,henSpr(Hn.id,0,1),w,h);}};});
  [['white','White egg','From a white hen'],['brown','Brown egg','From a brown hen'],['speckled','Speckled egg','From a speckled hen'],['blue','Blue egg','From a blue egg hen'],['cream','Small cream egg','From a wild junglefowl']].forEach(function(e){coop.push({id:'egg-'+e[0],name:e[1],hint:e[2],draw:function(x,w,h){bookDraw(x,eggSpr(e[0]),w,h);}});});
  bookCat('coop',{title:'Chickens and eggs',order:5,entries:coop});}

// ----- module -----
var MOD={name:'land',
  init:function(){ensureLand();L.tool=mapTool(LS().tool);regBook();loadArt();window.addEventListener('resize',function(){if(L.shown){sizeCanvas();}});},
  // Home always runs at 1x (a day is 20 s), so things here move in real minutes: a mown lawn stays short
  // for about a minute and a half and is long again after six or so, the coop fills in about seven, a full
  // feeder lasts about a quarter of an hour.
  day:function(d){if(!S.land||!S.land.map)return;var l=LS(),m=l.map;
    for(var i=0;i<m.g.length;i++){var g=m.g[i];if(isGrass(g)){m.gh[i]=Math.min(1,m.gh[i]+(g===G_MEADOW?0.05:0.04));if(L.groundOK&&L.gbk)touchTile(i%m.w,(i/m.w)|0,true);}}
    if(S.stage>=2&&stageHas('coop'))l.hens.forEach(function(h){if(l.eggs.length<12&&Math.random()<(h.kind==='wild'?0.2:0.3))l.eggs.push(HEN[h.kind].egg);});
    l.objs.forEach(function(o){if(o.k==='feeder'||o.k==='wfeeder')o.s=Math.max(0,(o.s||0)-0.02);});
    if(S.stage===3&&l.wild.length<4&&Math.random()<0.6){l.wild.push(newWild());if(L.shown)syncAgents();}},
  tick:function(dd,ds){if(L.shown&&activeTab==='home'&&!document.hidden)try{frame(ds);}catch(e){if(!L.err){L.err=1;console.error('land frame',e);}}},
  show:function(){L.shown=true;mountHome();},
  hide:function(){L.shown=false;closeBub();if(L.mower){L.mower.stop();L.mower=null;}L.watch=null;if(L.ptr)L.ptr.down=false;},
  render:function(){if(L.shown){renderCard();updateStat(true);}},
  stageChanged:function(){}};
registerMod(MOD);registerTab('home',MOD);
// for tests, the Try tab and the Dev tab
window.LAND={L:L,T:T,stats:function(){return S.land.stats;},toWorld:fromCss,camFocus:camFocus,setTool:function(t){setTool(mapTool(t));},BIRDS:BIRDS,FISH:FISH,HENS:HENS,spawnBird:spawnBird,computeSpots:computeSpots,objs:function(){return S.land.objs;},
  me:function(){return L.me;},dog:function(){return L.dog;},cat:function(){return L.cat;},map:function(){return M();},passable:passable,ready:function(){return ART.ready&&L.groundOK;},
  screenOf:function(wx,wy){return toCss(wx,wy);},tapWorld:function(wx,wy){var c=toCss(wx,wy);onTap(wx,wy,c[0],c[1]);},walkTile:function(tx,ty){return walkTo([tx,ty],null,null,null);},
  waterKind:waterKind,tileOf:tileOf,objSprite:objSprite,oX:oX,oBase:oBase,
  _dbg:{flood:flood,pathFor:pathFor,smoothPath:smoothPath,losClear:losClear,nearestReachable:nearestReachable,tilesTo:tilesTo,repaintTile:repaintTile,renderGround:function(){var t=performance.now();renderGround();return performance.now()-t;},flushGround:function(){var t=performance.now();drainRepaint(1e9);return performance.now()-t;},catDecide:catDecide,catRoom:catRoom,composeTile:function(tx,ty){return composeTile(M(),tx,ty);}},
  _spr:{cat:catSpr,hen:henSpr,bird:birdSpr,grandma:grandmaSpr,fish:fishSpr,find:findSpr,egg:eggSpr,mower:mowerSpr,obj:function(k,o){var d=OBJ[k];o=o||{};var q={k:k,tx:0,ty:0,fw:o.fw||d.fw,fh:o.fh||d.fh,seed:o.seed||5,v:o.v,s:o.s,i:o.i==null?-1:o.i,gm:o.gm};return d.spr(q);}}};
// ----- #full: open straight on the land, fully upgraded, with every hen and her fish (for previews) -----
// #fresh: build from empty land. Kept: the stream and its banks, the lake, grass, the trees and rocks outside the garden,
// the bridge. Grandma sits in her armchair on a little wood floor; the dog and Pierre are there. No walls, no hens.
var FRESH_V=2;
window.landFresh=function(){ensureLand();S.stage=3;var l=S.land,g=genStage(3),m=g.map;
  for(var i=0;i<m.g.length;i++){var x=i%m.w,y=(i/m.w)|0,gi=m.g[i];var keep=gi===G_WATER||(gi===G_SAND&&y>=21);if(!keep){m.g[i]=G_MEADOW;m.gh[i]=0.5+Math.random()*0.3;}}
  m.rooms=[];m.balcony=null;m.henArea=null;m.pond=null;
  var KEEP={olive:1,oak:1,rock:1,reeds:1,bridge:1};g.objs=g.objs.filter(function(o){return KEEP[o.k]&&(o.k==='bridge'||o.ty>=21||o.tx<6||o.tx>=24);});
  var cx=13,cy=7;for(var yy=cy-1;yy<=cy+1;yy++)for(var xx=cx-1;xx<=cx+1;xx++)mset(m,xx,yy,G_FLOOR,0);
  g.objs=g.objs.filter(function(o){return !(o.tx>=cx-2&&o.tx<=cx+2&&o.ty>=cy-2&&o.ty<=cy+3);});
  g.objs.push(mkObj('armchair',cx,cy,{gm:1}));m.catArea={x:cx-2,y:cy-1,w:5,h:4,back:true};m.start=[cx,cy+2];
  l.oid=l.oid||0;l.stage=3;l.map=m;l.objs=g.objs;l.edits=[];l.v=LAND_V;l.hens=[];l.wild=[];for(var k=0;k<4;k++)l.wild.push(newWild());l.pond=[];l.eggs=[];l.me=null;l.fresh=FRESH_V;
  S.cash=Math.max(S.cash||0,1000000);resetRuntime();save(true);setTab('home');updateHeader();};
window.landFull=function(){ensureLand();if(S.stage<3||!S.land.map)landSetStage(3);var l=S.land;S.cash=Math.max(S.cash||0,1000000);
  l.pond=FISH.map(function(F){return {kind:F.id,len:F.len[1]};});
  resetRuntime();save(true);setTab('home');updateHeader();};
window.addEventListener('load',function(){var fr=location.hash==='#fresh'||window.FRESH_START;if(fr)setTimeout(function(){try{if(!(S.land&&S.land.fresh===FRESH_V))landFresh();else setTab('home');}catch(e){console.error(e);}},300);
  if(location.hash==='#full')setTimeout(function(){try{landFull();}catch(e){console.error(e);}},50);});
})();

