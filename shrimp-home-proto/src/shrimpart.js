// ===== Shrimp and tank art, from the game's sprites (Puti's Shrimp Tanks art) =====
var IMG={},ART_READY=false,ART_WAIT=[];
(function(){var ks=Object.keys(SPR),left=ks.length;ks.forEach(function(k){var im=new Image();im.onload=im.onerror=function(){if(--left===0){ART_READY=true;ART_WAIT.splice(0).forEach(function(f){try{f();}catch(e){console.error(e);}});}};im.src=SPR[k];IMG[k]=im;});})();
function whenArt(f){if(ART_READY)f();else ART_WAIT.push(f);}
var SW=114,SH=58;
// Colours of the lines. hsl at full grade. Wild is see-through brown with speckles.
var COLOURS={
 wild:{name:'Wild',h:34,s:0.28,l:0.46,wild:1},
 red:{name:'Red',h:6,s:0.8,l:0.5},
 yellow:{name:'Yellow',h:46,s:0.86,l:0.55},
 blue:{name:'Blue',h:208,s:0.62,l:0.47},
 orange:{name:'Orange',h:24,s:0.9,l:0.53},
 violet:{name:'Violet',h:282,s:0.42,l:0.44},
 green:{name:'Green',h:128,s:0.42,l:0.38},
 black:{name:'Black',h:24,s:0.18,l:0.15}};
var COLOUR_ORDER=['red','yellow','blue','orange','violet','green','black','wild'];
var VG_BODY=[0.25,0.4,0.5,0.6,0.7,0.8,0.9,1],VG_DITHER=[0.12,0.2,0.25,0.3,0.4,0.5,0.6,1],VG_HL=[0,0.5,1,1,1,1,1,1];
function hslRGB(h,s,l){h=((h%360)+360)%360;var c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2,r=0,g=0,b=0;if(h<60){r=c;g=x;}else if(h<120){r=x;g=c;}else if(h<180){g=c;b=x;}else if(h<240){g=x;b=c;}else if(h<300){r=x;b=c;}else{r=c;b=x;}return [Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];}
function toVG(g){return clamp(Math.floor(clamp(g,0,100)/12.5),0,7);}
var BODY={};
// spec: {male, col, vg, juv (0 adult,1 young,2 baby), berried, rili, sick, hue}
function bodyCanvas(sp){var key=(sp.male?'m':'f')+sp.col+sp.vg+'j'+(sp.juv||0)+(sp.rili?'r':'')+(sp.sick||'')+'h'+(sp.hue||0);if(BODY[key])return BODY[key];
  var I=IMG,c=document.createElement('canvas');c.width=SW;c.height=SH;var x=c.getContext('2d');
  var col=document.createElement('canvas');col.width=SW;col.height=SH;var cx=col.getContext('2d');cx.drawImage(sp.male?I.cM:I.cF,0,0);cx.globalCompositeOperation='source-in';
  var C=COLOURS[sp.col]||COLOURS.red,vg=sp.vg,juv=sp.juv||0,hb=sp.hue||0;
  var rgb=sp.sick==='dead'?[214,206,196]:juv===2?[250,238,232]:juv===1?hslRGB(C.h+hb,C.s*0.8,Math.min(0.82,C.l+0.2)):hslRGB(C.h+hb,C.s,C.l);
  cx.fillStyle='rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';cx.fillRect(0,0,SW,SH);
  var d=cx.getImageData(0,0,SW,SH),px=d.data;
  for(var yy=0;yy<SH;yy++)for(var xx=0;xx<SW;xx++){var k=(yy*SW+xx)*4+3;if(!px[k])continue;
    var cov=juv===2?0.62:C.wild?((xx*7+yy*13)%11<2?0.9:0.34):juv===1?Math.max(0.55,VG_BODY[vg]*0.85):((xx+yy)%2?VG_DITHER[vg]:VG_BODY[vg]);
    if(sp.rili&&juv!==2&&xx>=60&&xx<=88)cov*=0.08;
    px[k]=Math.round(px[k]*cov);
    if(C.wild&&juv!==2&&(xx*7+yy*13)%11<2){px[k-3]=Math.round(px[k-3]*0.45);px[k-2]=Math.round(px[k-2]*0.4);px[k-1]=Math.round(px[k-1]*0.35);}}
  cx.putImageData(d,0,0);x.drawImage(col,0,0);
  if(!juv&&!C.wild&&VG_HL[vg]&&sp.col!=='black'){x.globalAlpha=VG_HL[vg]*0.34;x.drawImage(sp.male?I.hM:I.hF,0,0);x.globalAlpha=1;}
  x.drawImage(sp.male?I.oM:I.oF,0,0);if(sp.sick!=='dead')x.drawImage(I.ey,0,0);
  BODY[key]=c;return c;}
// Agent drawing, same layering as the game: eggs, rear legs, front legs, body, tail.
function drawShrimp(x,a,L,t){var I=IMG,h=L*SH/SW,water=a.surf==='water',eat=a.intent==='graze'||(a.intent==='crawl'&&Math.sin(t/1.1+a.ph*3.9)>-0.88),rear=Math.floor(a.rp||0)%2,
  front=water?(Math.floor(t*(a.intent==='dash'?7.5:2.4)+a.ph)%2?I.fF:I.fS):eat&&(a.sp||0)<L*0.5?[I.fS,I.fE2,I.fE3][Math.floor(t*1000/165+a.ph*7)%3]:I.fS,tail=water&&rear?I.t1:I.t0;
  x.save();x.translate(a.x,a.y);x.rotate(a.ang||0);x.scale(Math.abs(a.face)<0.08?0.08*Math.sign(a.face||1):a.face,1);var X=-L/2,Y=-h/2;
  if(a.berried)x.drawImage(I.eg,X,Y,L,h);x.drawImage(rear?I.r1:I.r0,X,Y,L,h);x.drawImage(front,X,Y,L,h);x.drawImage(bodyCanvas(a.spec),X,Y,L,h);x.drawImage(tail,X,Y,L,h);x.restore();}
// A still shrimp for lists and the book
function shrimpStill(x,spec,cx,cy,L,face){var I=IMG,h=L*SH/SW;x.save();x.translate(cx,cy);x.scale(face||1,1);var X=-L/2,Y=-h/2;if(spec.berried)x.drawImage(I.eg,X,Y,L,h);x.drawImage(I.r0,X,Y,L,h);x.drawImage(I.fS,X,Y,L,h);x.drawImage(bodyCanvas(spec),X,Y,L,h);x.drawImage(I.t0,X,Y,L,h);x.restore();}
function shrimpIconCanvas(spec,w,h){var c=document.createElement('canvas');var d=Math.min(2,window.devicePixelRatio||1);c.width=w*d;c.height=h*d;c.style.width=w+'px';c.style.height=h+'px';
  whenArt(function(){var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);shrimpStill(x,spec,w/2,h/2,Math.min(w*0.92,h*2.1),1);});return c;}
// The tank decor pieces, cut from the game's art layers. Positions are in the 932x430 art frame.
var DECOR={
 wood:{name:'Driftwood',hide:0.3,graze:0.2,moss:true},
 rockpile:{name:'Big rocks',hide:0.15,graze:0.1},
 rocks:{name:'Rock stack',hide:0.15,graze:0.1,moss:true},
 mossrock:{name:'Moss stone',hide:0.12,graze:0.2,moss:true},
 pebble:{name:'Pebble',hide:0.03,graze:0.02},
 lotus:{name:'Red lotus',hide:0.05,plant:0.25},
 stem:{name:'Stem plant',hide:0.08,plant:0.3},
 sword:{name:'Sword plant',hide:0.06,plant:0.3},
 leaf:{name:'Almond leaf',hide:0.08,graze:0.3}};
var DECOR_SIZE={};DECOR_ORIG.forEach(function(d){DECOR_SIZE[d.k]={w:d.w,h:d.h,x:d.x,y:d.y};});DECOR_SIZE.leaf={w:120,h:65};
function decorImg(k){return k==='leaf'?IMG.tleaf:IMG['d_'+k];}
