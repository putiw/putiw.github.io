// ===== Shrimp and tank art, from the game's sprites (Puti's Shrimp Tanks art) =====
var IMG={},ART_READY=false,ART_WAIT=[];
(function(){var ks=Object.keys(SPR),left=ks.length;ks.forEach(function(k){var im=new Image();im.onload=im.onerror=function(){if(--left===0){ART_READY=true;ART_WAIT.splice(0).forEach(function(f){try{f();}catch(e){console.error(e);}});}};im.src=SPR[k];IMG[k]=im;});})();
function whenArt(f){if(ART_READY)f();else ART_WAIT.push(f);}
var SW=114,SH=58;
// Colors of the lines, for labels and the book. The shrimp themselves are drawn from their own
// genome: hue, saturation, lightness and grade (Puti's Shrimp Tanks lines and names).
var COLOURS={
 red:{name:'Red',h:0,s:0.84,l:0.56},orange:{name:'Orange',h:28,s:0.84,l:0.56},yellow:{name:'Yellow',h:58,s:0.84,l:0.56},green:{name:'Green',h:120,s:0.84,l:0.56},
 cyan:{name:'Cyan',h:180,s:0.84,l:0.56},blue:{name:'Blue',h:220,s:0.84,l:0.56},purple:{name:'Purple',h:272,s:0.84,l:0.56},magenta:{name:'Magenta',h:315,s:0.84,l:0.56},
 wild:{name:'Wild',h:190,s:0.07,l:0.82,wild:1},legendary:{name:'Legendary',h:0,s:0.8,l:0.55}};
var COLOUR_ORDER=['red','orange','yellow','green','cyan','blue','purple','magenta','wild'];
// Body coverage by grade, from the game's shader: G1 is clear, odd pixels dither until G8 is solid.
var VG_BODY=[0,0.4,0.5,0.6,0.7,0.8,0.9,1],VG_DITHER=[0,0.2,0.25,0.3,0.4,0.5,0.6,1],VG_HL=[0,0.5,1,1,1,1,1,1];
function hslRGB(h,s,l){h=((h%360)+360)%360;var c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2,r=0,g=0,b=0;if(h<60){r=c;g=x;}else if(h<120){r=x;g=c;}else if(h<180){g=c;b=x;}else if(h<240){g=x;b=c;}else if(h<300){r=x;b=c;}else{r=c;b=x;}return [Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];}
function toVG(g){return clamp(Math.floor(clamp(g,0,100)/12.5),0,7);}
var BODY={},BODY_N=0;
// spec: {male, h, s, l (0-100), vg (grade 0-7), mat (color maturity 0-1), juv, rili, legend, sick}
// Older callers pass col only; that falls back to the line's color.
function bodyCanvas(sp){var C=COLOURS[sp.col]||COLOURS.red,h=sp.h!=null?sp.h:C.h,s=sp.s!=null?sp.s:C.s*100,l=sp.l!=null?sp.l:C.l*100,vg=clamp(sp.vg|0,0,7),
   mat=sp.mat!=null?sp.mat:(sp.juv===2?0.3:sp.juv===1?0.7:1),hq=Math.round(h/3)*3,sq=Math.round(s/4)*4,lq=Math.round(l/3)*3,mq=Math.round(mat*10);
  if(sp.legend){vg=7;}
  var key=(sp.male?'m':'f')+hq+'.'+sq+'.'+lq+'g'+vg+'m'+mq+(sp.rili?'r':'')+(sp.legend?'L':'')+(sp.sick||'');if(BODY[key])return BODY[key];
  if(++BODY_N>480){BODY={};BODY_N=1;}
  var I=IMG,c=document.createElement('canvas');c.width=SW;c.height=SH;var x=c.getContext('2d');
  var col=document.createElement('canvas');col.width=SW;col.height=SH;var cx=col.getContext('2d');cx.drawImage(sp.male?I.cM:I.cF,0,0);cx.globalCompositeOperation='source-in';
  if(sp.legend&&sp.sick!=='dead'){var gr=cx.createLinearGradient(8,0,SW-8,0);for(var k=0;k<=6;k++){var rr=hslRGB(k*60,0.82,0.6);gr.addColorStop(k/6,'rgb('+rr.join(',')+')');}cx.fillStyle=gr;}
  else{var rgb=sp.sick==='dead'?[214,206,196]:hslRGB(hq,sq/100,lq/100);cx.fillStyle='rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';}
  cx.fillRect(0,0,SW,SH);
  var d=cx.getImageData(0,0,SW,SH),px=d.data;
  for(var yy=0;yy<SH;yy++)for(var xx=0;xx<SW;xx++){var k2=(yy*SW+xx)*4+3;if(!px[k2])continue;
    var cov=((xx+yy)%2?VG_DITHER[vg]:VG_BODY[vg])*mat;
    if(sp.rili&&xx>=60&&xx<=88)cov*=0.08;
    px[k2]=Math.round(px[k2]*cov);}
  cx.putImageData(d,0,0);x.drawImage(col,0,0);
  if(VG_HL[vg]&&sp.sick!=='dead'){x.globalAlpha=VG_HL[vg]*0.34*mat;x.drawImage(sp.male?I.hM:I.hF,0,0);x.globalAlpha=1;}
  x.drawImage(sp.male?I.oM:I.oF,0,0);if(sp.sick!=='dead')x.drawImage(I.ey,0,0);
  BODY[key]=c;return c;}
// Agent drawing, same layering as the game: eggs, rear legs, front legs, body, tail. To keep a full tank
// smooth on a phone, the two leg layers are pre-joined (8 combinations, shared by every shrimp) and the
// tail is joined onto each body, so a shrimp is 2 or 3 drawImage calls instead of 5.
var LEGS={};
function legsCanvas(r,f){var k=r+f;if(LEGS[k])return LEGS[k];var c=document.createElement('canvas');c.width=SW;c.height=SH;var x=c.getContext('2d');x.drawImage(IMG[r],0,0);x.drawImage(IMG[f],0,0);LEGS[k]=c;return c;}
function bodyTail(spec,tl){var b=bodyCanvas(spec),k='_'+tl;if(b[k])return b[k];var c=document.createElement('canvas');c.width=SW;c.height=SH;var x=c.getContext('2d');x.drawImage(b,0,0);x.drawImage(IMG[tl],0,0);b[k]=c;return c;}
function drawShrimp(x,a,L,t){var h=L*SH/SW,water=a.surf==='water',eat=a.intent==='graze'||(a.intent==='crawl'&&Math.sin(t/1.1+a.ph*3.9)>-0.88),rear=Math.floor(a.rp||0)%2,
  front=water?(Math.floor(t*(a.intent==='dash'?7.5:2.4)+a.ph)%2?'fF':'fS'):eat&&(a.sp||0)<L*0.5?['fS','fE2','fE3'][Math.floor(t*1000/165+a.ph*7)%3]:'fS',tail=water&&rear?'t1':'t0';
  x.save();x.translate(a.x,a.y);x.rotate(a.ang||0);x.scale(Math.abs(a.face)<0.08?0.08*Math.sign(a.face||1):a.face,1);var X=-L/2,Y=-h/2;
  if(a.berried)x.drawImage(IMG.eg,X,Y,L,h);x.drawImage(legsCanvas(rear?'r1':'r0',front),X,Y,L,h);x.drawImage(bodyTail(a.spec,tail),X,Y,L,h);x.restore();}
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
