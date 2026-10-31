// ===== Genetics: Puti's Shrimp Tanks DNA model (shrimp-tanks-phaser/src/game/genetics.ts, model v7) =====
// A plain JS port, without the old-save migrations. Every shrimp carries an 80-base genome:
//   Pigment 0-36  eight hue codons, two saturation, two lightness. The color is the circular mean.
//   Shell  36-52  the number of G/C bases sets how solid the color is: the grade, G1 to G8.
//   Pattern 52-56 three or more C bases shows rili.
//   Vigor  56-64  fertility, brood size, egg survival, stability (how little the babies drift).
//   Body   64-80  catch resistance, speed, escape, size, lifespan, activity, food focus.
// Close colors blend, far ones mostly follow one parent and carry a few of the other's hue
// genes, which pulls the grade down. Babies drift a little in hue, so a line can walk.
var GEN=(function(){
 var R=Math.random;
 function r(){return R();}
 function rng(a,b){return a+r()*(b-a);}
 function item(a){return a[Math.floor(r()*a.length)];}
 function shuffle(a){var n=a.slice();for(var i=n.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=n[i];n[i]=n[j];n[j]=t;}return n;}
 function normal(sd){var u=1-r(),a=r()*Math.PI*2;return Math.sqrt(-2*Math.log(u))*Math.cos(a)*sd;}
 function cl(v,a,b){return v<a?a:v>b?b:v;}
 var BASES=['A','T','G','C'];
 var LEN=80,COD=3,PIG_S=0,PIG_L=36,SH_S=36,SH_L=16,PAT_S=52,PAT_L=4,VIG_S=56,VIG_N=4,VIG_LOC=2,VIG_L=8,BODY_S=64,BODY_L=16;
 var HUE_N=8,SAT_N=2,LIT_N=2,HUE_B=24,SAT_S=24,LIT_S=30;
 var OPACITY=[0.02,0.1,0.24,0.38,0.54,0.7,0.86,0.98];
 var SHELL_SOLID=[0,2,4,6,9,11,14,16];
 var DRIFT=[[-2,0.05],[-1,0.30],[0,0.40],[1,0.19],[2,0.06]];   // 35% lower, 40% same, 25% higher
 var RILI_P=0.383,RILI_LOW=0.2,LEG='CGCGCG',LEG_S=LEN-6;
 var M={hueTolerance:10,huePenalty:1,saturationPenalty:0.24,vigorWeight:0.55,riliThreshold:3,blendStrength:1,legendaryVariance:1};
 var LINES=[['red',0],['orange',28],['yellow',58],['green',120],['cyan',180],['blue',220],['purple',272],['magenta',315]];
 var HUE_SD_MAX=15,LIGHT_MUT_MULT=2;
 // ---- small helpers ----
 function hueC(h){return ((h%360)+360)%360;}
 function hueDist(a,b){var d=Math.abs(hueC(a)-hueC(b));return Math.min(d,360-d);}
 function circLerp(a,b,t){var d=((hueC(b)-hueC(a)+540)%360)-180;return hueC(a+d*cl(t,0,1));}
 function smooth(s,e,v){var t=cl((v-s)/Math.max(0.0001,e-s),0,1);return t*t*(3-2*t);}
 function avg(v){var s=0;for(var i=0;i<v.length;i++)s+=v[i];return v.length?s/v.length:0;}
 function seg(g,s,l){var x=g.slice(s,s+l);while(x.length<l)x+='G';return x;}
 function counts(s){var o={A:0,T:0,G:0,C:0};for(var i=0;i<s.length;i++)if(o[s[i]]!=null)o[s[i]]++;return o;}
 function n2b(v,len){var c=cl(Math.round(v),0,Math.pow(4,len)-1),out='';for(var i=0;i<len;i++){out=BASES[c%4]+out;c=Math.floor(c/4);}return out;}
 function b2n(s){var t=0;for(var i=0;i<s.length;i++)t=t*4+Math.max(0,BASES.indexOf(s[i]));return t;}
 function b2u(s){return b2n(s)/Math.max(1,Math.pow(4,s.length)-1);}
 function encHue(h){return n2b(Math.round(hueC(h)/360*64)%64,COD);}
 function decHue(c){return b2n(c)/64*360;}
 function encUnit(v){return n2b(Math.round(cl(v,0,1)*63),COD);}
 function decUnit(c){return b2n(c)/63;}
 function circMean(hs){var x=0,y=0;for(var i=0;i<hs.length;i++){var a=hueC(hs[i])*Math.PI/180;x+=Math.cos(a);y+=Math.sin(a);}var L=Math.hypot(x,y);return {hue:L>0.001?hueC(Math.atan2(y,x)*180/Math.PI):0,coh:cl(L/Math.max(1,hs.length),0,1)};}
 function pairSpread(hs){var t=0,p=0;for(var a=0;a<hs.length;a++)for(var b=a+1;b<hs.length;b++){t+=hueDist(hs[a],hs[b]);p++;}return p?t/p:0;}
 function clean(g){g=String(g||'').toUpperCase().replace(/[^ATGC]/g,'');while(g.length<LEN)g+='G';return g.slice(0,LEN);}
 function replaceSeg(g,s,l,v){v=v.slice(0,l);while(v.length<l)v+='G';return (g.slice(0,s)+v+g.slice(s+l)).slice(0,LEN);}
 // ---- color ----
 function hslRgb(h,s,l){s=cl(s,0,100)/100;l=cl(l,0,100)/100;var c=(1-Math.abs(2*l-1))*s,hs=hueC(h)/60,x=c*(1-Math.abs(hs%2-1)),R1=0,G1=0,B1=0;
  if(hs<1){R1=c;G1=x;}else if(hs<2){R1=x;G1=c;}else if(hs<3){G1=c;B1=x;}else if(hs<4){G1=x;B1=c;}else if(hs<5){R1=x;B1=c;}else{R1=c;B1=x;}var m=l-c/2;
  return [Math.round(cl((R1+m)*255,0,255)),Math.round(cl((G1+m)*255,0,255)),Math.round(cl((B1+m)*255,0,255))];}
 function hslHex(h,s,l){return '#'+hslRgb(h,s,l).map(function(v){return ('0'+v.toString(16)).slice(-2);}).join('');}
 function hexHsl(hex){var v=parseInt(String(hex).replace('#',''),16),R1=(v>>16&255)/255,G1=(v>>8&255)/255,B1=(v&255)/255,mx=Math.max(R1,G1,B1),mn=Math.min(R1,G1,B1),d=mx-mn,h=0;
  if(d){if(mx===R1)h=60*(((G1-B1)/d)%6);else if(mx===G1)h=60*((B1-R1)/d+2);else h=60*((R1-G1)/d+4);}var l=(mx+mn)/2,s=d?d/(1-Math.abs(2*l-1)):0;return {h:hueC(h),s:cl(s*100,0,100),l:cl(l*100,0,100)};}
 function randAny(){return hslHex(rng(0,360),rng(42,96),rng(22,72));}
 function randCustom(){if(r()<0.16)return {h:0,s:0,l:Math.round(rng(8,238))/255*100};return {h:rng(0,360),s:rng(42,96),l:rng(22,72)};}
 function classify(h,s){if(s<18)return 'wild';var best=LINES[0];for(var i=1;i<LINES.length;i++)if(hueDist(h,LINES[i][1])<hueDist(h,best[1]))best=LINES[i];return best[0];}
 function isLine(st){return LINES.some(function(l){return l[0]===st;});}
 // ---- pigment ----
 function decPig(s){var hues=[],sats=[],lits=[],i;for(i=0;i<HUE_N;i++)hues.push(decHue(s.slice(i*3,i*3+3)));for(i=0;i<SAT_N;i++)sats.push(decUnit(s.slice(SAT_S+i*3,SAT_S+i*3+3))*100);for(i=0;i<LIT_N;i++)lits.push(decUnit(s.slice(LIT_S+i*3,LIT_S+i*3+3))*100);
  var cm=circMean(hues);return {h:cm.hue,s:avg(sats),l:cl(avg(lits),5,92),hues:hues,sats:sats,lits:lits,coh:cm.coh,spread:pairSpread(hues)};}
 function encPig(hues,sats,lits){var hp=hues.slice(0,HUE_N).map(encHue).join(''),sp=sats.slice(0,SAT_N).map(function(v){return encUnit(v/100);}).join(''),lp=lits.slice(0,LIT_N).map(function(v){return encUnit(v/100);}).join('');
  while(hp.length<HUE_B)hp+='G';while(sp.length<SAT_N*3)sp+='G';while(lp.length<LIT_N*3)lp+='G';return (hp+sp+lp).slice(0,PIG_L);}
 function hueCloud(c,n,spread,jit){if(!n)return [];var amp=cl(spread*1.16,0,130),o=[];for(var i=0;i<n;i++){var pos=n===1?0:(i/(n-1))*2-1;o.push(hueC(c+pos*amp+rng(-jit,jit)));}return o;}
 function unitAlleles(c,n,jit){var o=[];for(var i=0;i<n;i++)o.push(cl(c+rng(-jit,jit),0,100));return o;}
 function pigSeg(h,s,l,spread,jit){if(jit==null)jit=2.2;return encPig(hueCloud(h,HUE_N,spread,jit),unitAlleles(s,SAT_N,jit),unitAlleles(l,LIT_N,jit));}
 // ---- shell, pattern, vigor, body ----
 function opacitySeg(op){var s=cl(op,0,1),o='';for(var i=0;i<SH_L;i++){if(r()<s)o+=r()<0.55?'G':'C';else o+=r()<0.55?'A':'T';}return o;}
 function targetOpacitySeg(g){var solid=cl(Math.round(OPACITY[g]*SH_L),0,SH_L),clear=SH_L-solid,a=[],i;
  for(i=0;i<Math.ceil(clear/2);i++)a.push('A');for(i=0;i<Math.floor(clear/2);i++)a.push('T');for(i=0;i<Math.ceil(solid/2);i++)a.push('G');for(i=0;i<Math.floor(solid/2);i++)a.push('C');return shuffle(a).join('');}
 function shellWithCount(src,target){var b=seg(src,0,SH_L).split(''),isP=function(x){return x==='G'||x==='C';},cur=b.filter(isP).length,want=cl(Math.round(target),0,SH_L),i;
  if(cur<want){for(i=0;i<b.length&&cur<want;i++){if(isP(b[i]))continue;b[i]=b[i]==='T'?'C':'G';cur++;}}
  else if(cur>want){for(i=b.length-1;i>=0&&cur>want;i--){if(!isP(b[i]))continue;b[i]=b[i]==='C'?'T':'A';cur--;}}return b.join('');}
 function riliSeg(p){var o='';for(var i=0;i<PAT_L;i++)o+=r()<p?'C':item(['A','T','G']);return o;}
 function patWithC(n){var a=[];for(var i=0;i<n;i++)a.push('C');while(a.length<PAT_L)a.push(item(['A','T','G']));return shuffle(a).join('');}
 function patSegFor(p){return p==='solid'?patWithC(Math.floor(rng(0,3))):patWithC(r()<0.72?3:4);}
 function riliChance(st){if(st==='legendary')return 0;if(isLine(st)||st==='custom')return RILI_P;return RILI_LOW;}
 function encVig(v){return n2b(Math.round((cl(v,0.5,1)-0.5)*30),VIG_LOC);}
 function randStab(){return cl(0.75+normal(0.175),0.5,1);}   // shown as 0-100%: mean 50%, SD 35%
 function vigSegFor(score,stab){return [score,score,score,stab].map(function(t,i){t=cl(t,0.5,1);var jit=i===3?0:(r()-0.5)*0.24;return encVig(cl(t+jit,0.5,1));}).join('');}
 function vigSegStrain(st,g){var b=st==='legendary'?0.76:(st==='wild'||st==='clear')?0.66:cl(0.63-g*0.012,0.52,0.66);return vigSegFor(b,randStab());}
 function vigor(s){s=seg(s,0,VIG_L);var v=[];for(var i=0;i<VIG_N;i++)v.push(0.5+b2u(s.slice(i*VIG_LOC,(i+1)*VIG_LOC))*0.5);return {fert:v[0],fec:v[1],emb:v[2],stab:v[3],expr:(v[0]+v[1]+v[2])/3};}
 function catchBases(){var x=r(),v=x<0.75?Math.floor(rng(0,192)):x<0.95?Math.floor(rng(192,243)):x<0.99?Math.floor(rng(243,253)):Math.floor(rng(253,256));return n2b(v,4);}
 function bodySeg(){var b=catchBases();for(var i=0;i<6;i++)b+=n2b(Math.floor(rng(0,16)),2);b=b.slice(0,BODY_L);if(b.slice(-6)===LEG)b=b.slice(0,-1)+'A';return b;}
 function body(g){var b=seg(g,BODY_S,BODY_L),cr=b2n(b.slice(0,4));
  return {catchRes:cr<192?1:cr<243?2:cr<253?3:5,speed:0.9+b2u(b.slice(4,6))*0.2,escape:cl((b2u(b.slice(6,8))-0.16)/0.84*1.35,0,1.35),size:0.9+b2u(b.slice(8,10))*0.2,life:0.9+b2u(b.slice(10,12))*0.2,activity:b2u(b.slice(12,14)),food:b2u(b.slice(14,16))};}
 function hasLeg(g){return g.slice(LEG_S,LEN)===LEG;}
 function stampLeg(g){return g.slice(0,LEG_S)+LEG;}
 function unLeg(g){return hasLeg(g)?g.slice(0,LEN-1)+'A':g;}
 // ---- reading a genome ----
 function gradeExpr(pig,sh,vig){var satLoss=cl((38-pig.s)/38,0,1),satF=1-cl(M.saturationPenalty*satLoss,0,0.88),dens=(sh.G+sh.C)/SH_L,cohF=cl(1-M.huePenalty*(1-pig.coh),0.02,1),vigF=0.9+vig.expr*M.vigorWeight*0.14,e=cl(dens*cohF*satF*vigF,0,1);
  return {coverage:dens,coh:cohF,sat:satF,vig:vigF,expr:e,grade:exprGrade(e)};}
 function exprGrade(e){return e<0.08?0:e<0.17?1:e<0.3?2:e<0.43?3:e<0.58?4:e<0.73?5:e<0.88?6:7;}
 function pheno(genome){var g=clean(genome),pig=decPig(seg(g,PIG_S,PIG_L)),sh=counts(seg(g,SH_S,SH_L)),pat=counts(seg(g,PAT_S,PAT_L)),vig=vigor(seg(g,VIG_S,VIG_L)),ge=gradeExpr(pig,sh,vig),leg=hasLeg(g);
  return {h:pig.h,s:cl(pig.s,4,98),l:cl(pig.l,5,92),grade:ge.grade,rili:pat.C>=M.riliThreshold,line:leg?'legendary':classify(pig.h,pig.s),legend:leg,coh:pig.coh,spread:pig.spread,vig:vig,body:body(g)};}
 function inspect(genome){var g=clean(genome),pig=decPig(seg(g,PIG_S,PIG_L)),sh=counts(seg(g,SH_S,SH_L)),pat=counts(seg(g,PAT_S,PAT_L)),vig=vigor(seg(g,VIG_S,VIG_L));
  return {genome:g,pig:pig,shell:sh.G+sh.C,ge:gradeExpr(pig,sh,vig),patC:pat.C,vig:vig,body:body(g),legend:hasLeg(g)};}
 // Make the shell agree with a wanted grade, keeping everything else.
 function align(genome,target){var g=clean(genome);if(pheno(g).grade===target)return g;var sh=seg(g,SH_S,SH_L),cur=sh.split('').filter(function(b){return b==='G'||b==='C';}).length,best=g,bgd=1e9,bcd=1e9;
  for(var p=0;p<=SH_L;p++){var c=replaceSeg(g,SH_S,SH_L,shellWithCount(sh,p)),gd=Math.abs(pheno(c).grade-target),cd=Math.abs(p-cur);if(gd<bgd||(gd===bgd&&cd<bcd)){best=c;bgd=gd;bcd=cd;}}return best;}
 // ---- making shrimp ----
 function colourBase(st,g,hex){if(hex)return hexHsl(hex);if(st==='custom'||st==='legendary')return randCustom();if(st==='clear'||st==='wild')return {h:190,s:7,l:82};
  var L=LINES.find(function(x){return x[0]===st;})||LINES[0];return {h:hueC(L[1]+rng(-3.5,3.5)),s:cl(64+g*4.2+rng(-4,4),44,94),l:cl(61-g*0.9+rng(-5.5,5.5),50,66)};}
 function forStrain(st,grade,hex,opHint,patHint){var b=colourBase(st,grade,hex),sg=st==='legendary'?7:cl(grade|0,0,7),spread=(st==='wild'||st==='clear')?46:cl(8.5-sg*0.78,2.5,8.5);
  var g=[pigSeg(b.h,b.s,b.l,spread),opacitySeg(typeof opHint==='number'?opHint:OPACITY[sg]),patHint?patSegFor(patHint):riliSeg(riliChance(st)),vigSegStrain(st,sg),bodySeg()].join('').slice(0,LEN);
  if(st==='legendary')g=stampLeg(g);return align(g,sg);}
 function fromTraits(o){var g0=cl(Math.round(o.grade),0,7),spread=cl(o.hueSpread!=null?o.hueSpread:Math.max(3,12-g0*1.2),0,82);
  var g=[pigSeg(hueC(o.hue),cl(o.saturation,0,100),cl(o.lightness,5,92),spread),targetOpacitySeg(g0),o.pattern?patSegFor(o.pattern):riliSeg(RILI_P),vigSegFor(o.vigor!=null?o.vigor:0.68,o.stability!=null?o.stability:randStab()),bodySeg()].join('');
  return align(o.legendary?stampLeg(g):unLeg(g),g0);}
 // ---- inheritance ----
 function blendChance(d){var rise=smooth(0,14,d),fall=1-smooth(46,112,d);return cl((0.08+0.84*rise)*fall*cl(M.blendStrength,0,1),0,0.92);}
 function inheritPig(a,b,mc){var A=decPig(seg(a,PIG_S,PIG_L)),B=decPig(seg(b,PIG_S,PIG_L)),d=hueDist(A.h,B.h),ps=(A.spread+B.spread)/2,hues,sat,lit;
  if(r()<blendChance(d)){var bp=cl(0.5+rng(-0.12,0.12),0.28,0.72),c=circLerp(A.h,B.h,bp),cross=smooth(10,126,d),ts=cl(3+ps*(0.42+cross*0.22)+d*(0.28+cross*0.12),2,76);
   hues=hueCloud(c,HUE_N,ts,1.2+cross*1.8);sat=avg(A.sats)*(1-bp)+avg(B.sats)*bp;lit=avg(A.lits)*(1-bp)+avg(B.lits)*bp;}
  else{var P=r()<0.5?A:B,O=P===A?B:A,fc=d<=10?0:d<70?1:2,lsp=cl(2.5+P.spread*0.5+d*0.035,2,22),fsp=cl(2.5+O.spread*0.32,2,18);
   hues=shuffle(hueCloud(P.h,HUE_N-fc,lsp,1.5).concat(hueCloud(O.h,fc,fsp,1.5)));sat=avg(P.sats)*0.82+avg(O.sats)*0.18;lit=avg(P.lits)*0.82+avg(O.lits)*0.18;}
  // one shift for the whole child: a family spread that stability shrinks to nothing
  var stab=(vigor(seg(a,VIG_S,VIG_L)).stab+vigor(seg(b,VIG_S,VIG_L)).stab)/2,shift=normal(HUE_SD_MAX*(1-cl((stab-0.5)/0.5,0,1)));
  hues=hues.map(function(h){return hueC(h+shift);});
  var mr=cl((0.0025+mc*0.018)*(1.35-stab*0.62),0.001,0.075);hues=hues.map(function(h){return r()<mr?hueC(h+rng(-22,22)):h;});
  sat=cl(sat+rng(-3.5,3.5)+(r()<mr?rng(-10,10):0),0,100);var lmr=cl(mr*LIGHT_MUT_MULT,0,0.15);lit=cl(lit+rng(-3,3)+(r()<lmr?rng(-8,8):0),5,92);
  return encPig(hues,unitAlleles(sat,SAT_N,2),unitAlleles(lit,LIT_N,2));}
 function mutateRest(arr,mc,a,b){var st=(vigor(seg(a,VIG_S,VIG_L)).stab+vigor(seg(b,VIG_S,VIG_L)).stab)/2,pb=cl((0.0025+mc*0.018)*(1.35-st*0.62),0.001,0.05);
  for(var i=PIG_L;i<arr.length;i++){if(r()>pb)continue;var cur=arr[i];arr[i]=item(BASES.filter(function(x){return x!==cur;}));}}
 function sampleDrift(){var x=r(),t=0;for(var i=0;i<DRIFT.length;i++){t+=DRIFT[i][1];if(x<t)return DRIFT[i][0];}return DRIFT[DRIFT.length-1][0];}
 function shapeShell(arr,ga,gb){var c=(ga+gb)/2,lo=Math.floor(c),anchor=cl(lo+(r()<c-lo?1:0),0,7),tg=cl(anchor+sampleDrift(),0,7),want=SHELL_SOLID[tg],solid=[],clr=[];
  for(var i=SH_S;i<SH_S+SH_L;i++){if(arr[i]==='G'||arr[i]==='C')solid.push(i);else clr.push(i);}
  if(solid.length<want)shuffle(clr).slice(0,want-solid.length).forEach(function(i){arr[i]=item(['G','C']);});
  else if(solid.length>want)shuffle(solid).slice(0,solid.length-want).forEach(function(i){arr[i]=item(['A','T']);});}
 // A legendary parent resets it: the child is a fresh high-grade shrimp of any color.
 function legendChild(){var g=Math.floor(rng(5,8));return forStrain('custom',g,randAny(),OPACITY[g]);}
 function inherit(a,b,mc,ga,gb){a=clean(a);b=clean(b);if(hasLeg(a)||hasLeg(b))return legendChild();
  var arr=new Array(LEN),pig=inheritPig(a,b,mc),i;for(i=0;i<PIG_L;i++)arr[i]=pig[i];for(i=PIG_L;i<LEN;i++)arr[i]=(r()<0.5?a:b)[i];
  mutateRest(arr,mc,a,b);shapeShell(arr,ga!=null?ga:pheno(a).grade,gb!=null?gb:pheno(b).grade);return unLeg(arr.join(''));}
 // How well a pair breeds: higher grades are a little less fertile, vigor genes do the rest.
 function fitness(ga,gb){var av=cl((ga+gb)/14,0,1),low=1.16-Math.pow(av,1.2)*0.28;return cl(1-0.65+low*0.65,0.82,1.12);}
 function pair(a,b,ga,gb){var va=vigor(seg(clean(a),VIG_S,VIG_L)),vb=vigor(seg(clean(b),VIG_S,VIG_L)),f=fitness(ga,gb);
  return {fertility:cl(f*va.fert*vb.fert*1.72,0.18,1.18),brood:cl(f*va.fec*vb.fec*1.28,0.18,1.22),embryo:cl(va.emb*0.68+vb.emb*0.32,0.12,1),mutation:cl(1.35-(va.stab+vb.stab)/2*0.62,0.55,1.2)};}
 function withSeed(seed,fn){var old=R;R=mulberry32(seed);try{return fn();}finally{R=old;}}
 return {LEN:LEN,LINES:LINES,SEGS:[['Pigment',0,36],['Shell',36,16],['Pattern',52,4],['Vigor',56,8],['Body',64,16]],
  forStrain:forStrain,fromTraits:fromTraits,inherit:inherit,pheno:pheno,inspect:inspect,pair:pair,classify:classify,
  hueDist:hueDist,hueC:hueC,hslRgb:hslRgb,hslHex:hslHex,hexHsl:hexHsl,randAny:randAny,withSeed:withSeed};
})();
