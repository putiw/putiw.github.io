// ===== Ink: hand-drawn lines and watercolour washes, to sit next to the tank art =====
var INK='#2c2823';
function hexRGB(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c;}).join('');var n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];}
function rgbHex(r){return '#'+r.map(function(v){v=clamp(Math.round(v),0,255);return (v<16?'0':'')+v.toString(16);}).join('');}
function mixC(a,b,t){var A=hexRGB(a),B=hexRGB(b);return rgbHex([lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t)]);}
function shadeC(c,k){return k>=0?mixC(c,'#ffffff',k):mixC(c,'#1b1712',-k);}
function rgba(c,a){var r=hexRGB(c);return 'rgba('+r[0]+','+r[1]+','+r[2]+','+a+')';}
// Resample a polyline and push each point sideways by a smooth seeded wobble.
function wobble(pts,seed,amp,closed){var r=mulberry32((seed|0)+7),p1=r()*6.28,p2=r()*6.28,f1=0.07+r()*0.05,f2=0.19+r()*0.08,out=[],acc=0;
  var P=closed?pts.concat([pts[0]]):pts;
  for(var i=0;i<P.length-1;i++){var a=P[i],b=P[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,n=Math.max(1,Math.ceil(L/5)),nx=-dy/L,ny=dx/L;
    for(var j=0;j<n;j++){var t=j/n,s=acc+L*t,o=amp*(Math.sin(s*f1+p1)*0.65+Math.sin(s*f2+p2)*0.35);out.push([a[0]+dx*t+nx*o,a[1]+dy*t+ny*o]);}acc+=L;}
  if(!closed){var e=P[P.length-1];out.push([e[0],e[1]]);}return out;}
function tracePts(x,pts,closed){x.beginPath();pts.forEach(function(p,i){if(i)x.lineTo(p[0],p[1]);else x.moveTo(p[0],p[1]);});if(closed)x.closePath();}
// inkPath(ctx, pts, {closed, w, col, seed, amp, fill, alpha, nostroke})
function inkPath(x,pts,o){o=o||{};var w=wobble(pts,o.seed||1,o.amp==null?0.8:o.amp,!!o.closed);tracePts(x,w,!!o.closed);
  if(o.fill){x.fillStyle=o.fill;x.fill();}if(!o.nostroke){x.lineWidth=o.w||1.6;x.strokeStyle=o.col||INK;x.lineJoin='round';x.lineCap='round';x.stroke();}return w;}
function blobPts(cx,cy,rx,ry,seed,irr,n){var r=mulberry32((seed|0)+3),pts=[],N=n||18,ph=r()*6.28,k1=1+Math.floor(r()*3),k2=3+Math.floor(r()*3);irr=irr==null?0.12:irr;
  for(var i=0;i<N;i++){var a=i/N*6.283+ph,f=1+irr*(Math.sin(a*k1+r()*0.6)*0.6+Math.sin(a*k2)*0.4);pts.push([cx+Math.cos(a)*rx*f,cy+Math.sin(a)*ry*f]);}return pts;}
// a filled, outlined irregular blob with a soft watercolour wash inside
function inkBlob(x,cx,cy,rx,ry,o){o=o||{};var pts=blobPts(cx,cy,rx,ry,o.seed||1,o.irr,o.n);var w=wobble(pts,(o.seed||1)+11,o.amp==null?0.7:o.amp,true);
  if(o.fill){x.save();tracePts(x,w,true);x.fillStyle=o.fill;x.fill();x.clip();washSpots(x,cx,cy,rx,ry,o.fill,o.seed||1,o.wash==null?1:o.wash);x.restore();}
  if(!o.nostroke){tracePts(x,w,true);x.lineWidth=o.w||1.5;x.strokeStyle=o.col||INK;x.lineJoin='round';x.stroke();}return w;}
// darker and lighter blotches, clipped by the caller, so flat fills read as paint
function washSpots(x,cx,cy,rx,ry,col,seed,k){var r=mulberry32((seed|0)+29),n=3+Math.floor(r()*3);for(var i=0;i<n;i++){var px=cx+(r()-0.5)*rx*1.6,py=cy+(r()-0.5)*ry*1.6,R=Math.max(rx,ry)*(0.4+r()*0.6),dark=r()<0.5;
  var g=x.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,rgba(shadeC(col,dark?-0.18:0.22),0.35*k));g.addColorStop(1,rgba(col,0));x.fillStyle=g;x.fillRect(px-R,py-R,R*2,R*2);}
  // a highlight along the top
  var hg=x.createLinearGradient(0,cy-ry,0,cy+ry);hg.addColorStop(0,rgba('#ffffff',0.16*k));hg.addColorStop(0.5,rgba('#ffffff',0));hg.addColorStop(1,rgba('#000000',0.08*k));x.fillStyle=hg;x.fillRect(cx-rx*1.3,cy-ry*1.3,rx*2.6,ry*2.6);}
// short ink strokes: grass tufts, hatching, fur
function inkTick(x,x0,y0,x1,y1,w,col){x.beginPath();x.moveTo(x0,y0);x.quadraticCurveTo((x0+x1)/2+(y1-y0)*0.15,(y0+y1)/2,x1,y1);x.lineWidth=w||1.2;x.strokeStyle=col||INK;x.lineCap='round';x.stroke();}
// paper grain, made once
var GRAIN=null;
function grainPattern(x){if(!GRAIN){var c=document.createElement('canvas');c.width=c.height=96;var g=c.getContext('2d'),d=g.createImageData(96,96);for(var i=0;i<d.data.length;i+=4){var v=Math.random();d.data[i]=d.data[i+1]=d.data[i+2]=v<0.5?40:255;d.data[i+3]=Math.floor(Math.random()*16);}g.putImageData(d,0,0);GRAIN=c;}return x.createPattern(GRAIN,'repeat');}
function grain(x,X,Y,W,H,a){x.save();x.globalAlpha=a==null?0.5:a;x.fillStyle=grainPattern(x);x.fillRect(X,Y,W,H);x.restore();}
// a little ink icon helper for buttons: draw(ctx,w,h) into a canvas element
function iconCanvas(w,h,draw){return miniCanvas(w,h,draw);}
