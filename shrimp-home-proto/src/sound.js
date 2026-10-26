// ===== Sound: small synthesized effects, plus the game's water and music loops =====
var AC=null,MASTER=null,BUS=null,NOISE=null,AMB={},SFX_LOOPS={};
function sfxUnlock(){if(AC||!S||!S.opt.sound)return;try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();MASTER=AC.createGain();MASTER.gain.value=0.82;MASTER.connect(AC.destination);BUS=AC.createGain();BUS.gain.value=0.5;BUS.connect(MASTER);
  var len=AC.sampleRate*2,b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;NOISE=b;
  loadAmb('water','water.mp3',0.34);loadAmb('music','music.mp3',0.13);loadCatch();sfxAmbient();}catch(e){AC=null;}}
// Puti's two catch sounds from Shrimp Tanks; one is picked at random each time a shrimp is netted
var CATCH=[];
function loadCatch(){['catch-shrimp-1.mp3','catch-shrimp-2.mp3'].forEach(function(u){try{fetch(u).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer();}).then(function(ab){return new Promise(function(res,rej){AC.decodeAudioData(ab,res,rej);});}).then(function(b){CATCH.push(b);}).catch(function(){});}catch(e){}});}
['pointerdown','keydown'].forEach(function(ev){window.addEventListener(ev,function(){if(!AC)sfxUnlock();else if(AC.state==='suspended')AC.resume();},{capture:true,passive:true});});
function sfxMute(m){$('tb-mute').classList.toggle('muted',m);if(MASTER)MASTER.gain.setTargetAtTime(m?0:0.82,AC.currentTime,0.05);if(!m&&!AC)sfxUnlock();}
function loadAmb(k,url,vol){var a={vol:vol,g:AC.createGain(),src:null,buf:null,on:false};a.g.gain.value=0;a.g.connect(MASTER);AMB[k]=a;
  // next to the page when published as an artifact, or the game's copy when served from the repo
  try{fetch(url).then(function(r){if(r.ok)return r;return fetch('../shrimp/'+url);}).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer();}).then(function(ab){return new Promise(function(res,rej){AC.decodeAudioData(ab,res,rej);});}).then(function(buf){a.buf=buf;sfxAmbient();}).catch(function(){});}catch(e){}}
function ambSet(k,on){var a=AMB[k];if(!a||!AC)return;if(on&&a.buf&&!a.src){a.src=AC.createBufferSource();a.src.buffer=a.buf;a.src.loop=true;a.src.connect(a.g);a.src.start();}
  if(a.on===on)return;a.on=on;a.g.gain.cancelScheduledValues(AC.currentTime);a.g.gain.setTargetAtTime(on?a.vol:0,AC.currentTime,k==='water'?1.6:0.8);}
function sfxAmbient(){if(!AC||!S)return;var vis=!document.hidden;ambSet('water',vis&&activeTab==='tank');ambSet('music',vis);if(typeof outdoorAmb==='function')outdoorAmb(vis&&activeTab==='home'&&S.stage>=1);}
function env(g,t,a,peak,d){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d);}
function noiseSrc(){var s=AC.createBufferSource();s.buffer=NOISE;s.loop=true;s.playbackRate.value=0.8+Math.random()*0.4;return s;}
function tone(type,f0,f1,t,dur,vol,dest){var o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);env(g,t,0.006,vol,dur);o.connect(g);g.connect(dest||BUS);o.start(t);o.stop(t+dur+0.05);}
function nburst(t,dur,vol,ftype,freq,q,dest){var s=noiseSrc(),f=AC.createBiquadFilter(),g=AC.createGain();f.type=ftype;f.frequency.value=freq;f.Q.value=q||1;env(g,t,0.004,vol,dur);s.connect(f);f.connect(g);g.connect(dest||BUS);s.start(t,Math.random());s.stop(t+dur+0.05);}
// one-shot effects
function sfx(name,o){if(!AC||!S||!S.opt.sound)return;o=o||{};var t=AC.currentTime,v=o.v||1;try{switch(name){
 case 'click':tone('sine',900,600,t,0.04,0.05*v);break;
 case 'nope':tone('triangle',220,160,t,0.12,0.08*v);break;
 case 'snip':nburst(t,0.025,0.25*v,'highpass',3500,0.8);nburst(t+0.035,0.03,0.18*v,'highpass',4200,0.8);tone('square',2600,1800,t,0.015,0.02*v);break;
 case 'pop':tone('sine',700,180,t,0.09,0.18*v);nburst(t,0.03,0.06*v,'bandpass',1500,2);break;
 case 'plip':tone('sine',1300+Math.random()*300,380,t,0.07,0.16*v);break;
 case 'plop':tone('sine',420,120,t,0.14,0.2*v);nburst(t,0.06,0.05*v,'lowpass',700,1);break;
 case 'drip':tone('sine',1700+Math.random()*700,700,t,0.05,0.08*v);break;
 case 'squelch':nburst(t,0.22,0.22*v,'lowpass',520,4);tone('sine',140,70,t,0.2,0.08*v);for(var i=0;i<4;i++)tone('sine',500+Math.random()*500,200,t+0.04*i+Math.random()*0.03,0.04,0.04*v);break;
 case 'suck':nburst(t,0.3,0.12*v,'bandpass',600,1.5);tone('sine',180,420,t,0.25,0.04*v);break;
 case 'scoop':nburst(t,0.12,0.1*v,'bandpass',900,1);tone('sine',600,900,t,0.08,0.05*v);break;
 case 'egg':tone('sine',520,480,t,0.05,0.12*v);tone('triangle',1040,900,t+0.01,0.03,0.03*v);break;
 case 'coin':tone('triangle',1320,1320,t,0.06,0.06*v);tone('triangle',1760,1760,t+0.07,0.09,0.06*v);break;
 case 'book':tone('sine',660,660,t,0.1,0.07*v);tone('sine',880,880,t+0.09,0.12,0.07*v);tone('sine',1320,1320,t+0.18,0.18,0.05*v);break;
 case 'chirp':var f=2600+Math.random()*1800;for(var j=0;j<2+Math.floor(Math.random()*3);j++){tone('sine',f,f*(1.2+Math.random()*0.4),t+j*0.09,0.06,0.035*v);}break;
 case 'splash':nburst(t,0.35,0.25*v,'lowpass',1400,0.7);nburst(t+0.02,0.2,0.12*v,'highpass',2500,0.7);break;
 case 'cast':nburst(t,0.25,0.08*v,'bandpass',2200,3);break;
 case 'cluck':tone('square',420,300,t,0.05,0.035*v);tone('square',380,260,t+0.09,0.07,0.03*v);break;
 case 'flap':for(var k=0;k<5;k++)nburst(t+k*0.06,0.04,0.08*v,'bandpass',800,1.2);break;
 case 'reel':for(var r=0;r<6;r++)tone('square',1800,1700,t+r*0.03,0.01,0.015*v);break;
 case 'thud':tone('sine',160,60,t,0.12,0.15*v);break;
 case 'pour':nburst(t,0.9,0.12*v,'bandpass',700,0.8);break;
 case 'catch':if(CATCH.length){var cs=AC.createBufferSource(),cg=AC.createGain();cs.buffer=CATCH[Math.floor(Math.random()*CATCH.length)];cg.gain.value=0.52*v;cs.connect(cg);cg.connect(BUS);cs.start(t);}else{tone('sine',700,180,t,0.09,0.18*v);}break;
 case 'push':tone('triangle',116,74,t,0.16,0.14*v);break;
 }}catch(e){}}
// held loops: sfxLoop(name) -> {set(level 0..1), stop()}
function sfxLoop(name){if(!AC||!S||!S.opt.sound)return {set:function(){},stop:function(){}};var t=AC.currentTime,g=AC.createGain();g.gain.value=0;g.connect(BUS);var nodes=[];
 try{if(name==='siphon'){var s=noiseSrc(),f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=700;f.Q.value=1.4;s.connect(f);f.connect(g);s.start();nodes.push(s);
   var lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=7;lg.gain.value=260;lfo.connect(lg);lg.connect(f.frequency);lfo.start();nodes.push(lfo);}
  else if(name==='mower'){var o=AC.createOscillator(),f2=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=72;f2.type='lowpass';f2.frequency.value=420;o.connect(f2);f2.connect(g);o.start();nodes.push(o);var s2=noiseSrc(),f3=AC.createBiquadFilter();f3.type='bandpass';f3.frequency.value=2400;f3.Q.value=0.6;var g3=AC.createGain();g3.gain.value=0.25;s2.connect(f3);f3.connect(g3);g3.connect(g);s2.start();nodes.push(s2);}
  else if(name==='bubbles'){var s3=noiseSrc(),f4=AC.createBiquadFilter();f4.type='lowpass';f4.frequency.value=380;f4.Q.value=6;s3.connect(f4);f4.connect(g);s3.start();nodes.push(s3);}
  else if(name==='wind'){var s4=noiseSrc(),f5=AC.createBiquadFilter();f5.type='lowpass';f5.frequency.value=500;s4.connect(f5);f5.connect(g);s4.start();nodes.push(s4);var l2=AC.createOscillator(),lg2=AC.createGain();l2.frequency.value=0.08;lg2.gain.value=250;l2.connect(lg2);lg2.connect(f5.frequency);l2.start();nodes.push(l2);}
 }catch(e){}
 var peak={siphon:0.22,mower:0.12,bubbles:0.16,wind:0.05}[name]||0.1;
 return {set:function(l){if(AC)g.gain.setTargetAtTime(peak*clamp(l,0,1),AC.currentTime,0.06);},stop:function(){if(!AC)return;g.gain.setTargetAtTime(0,AC.currentTime,0.08);setTimeout(function(){nodes.forEach(function(n){try{n.stop();}catch(e){}});g.disconnect();},500);}};}
var OUTDOOR=null;
function outdoorAmb(on){if(!AC)return;if(on&&!OUTDOOR){OUTDOOR=sfxLoop('wind');OUTDOOR.set(1);}else if(!on&&OUTDOOR){OUTDOOR.stop();OUTDOOR=null;}}
