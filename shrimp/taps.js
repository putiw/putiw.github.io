// Button sounds and the iPhone tick (Pass 233, Puti 3 Nov). One copy, loaded by index.html, home.html and space.html.
// A page calls TAPS.init({ctx, dest, gain, ok, table}) once:
//   ctx()  the AudioContext to play on (or null), dest() the node to connect to, gain the per-sound gain so the
//   level at the speakers is 0.3 of the file (0.3/(0.5*0.82) when routed through the 0.5 bus and 0.82 master),
//   ok()   false while the page's sound is off (muted, the land open over the game), table [[selector or fn, role]].
// Roles and files: tab, chip, step, main, open, close, feed, water, sell (SFX_FILE). Any button not matched is main.
// Settings keys (localStorage, '0' is off, default on): shrimp-btnsfx Button sounds, shrimp-taps Taps you can feel.
// The tick is a hidden <label for=X><input type=checkbox switch id=X></label>, clicked inside the tap: iOS 18+ Safari
// gives a small tick when a switch toggles. No navigator.vibrate anywhere (no Android code, Puti can't test it).
(function(){
// Pass 239 (Puti picked these on the sound lab page, 3 Nov): per role net volume at the speakers, low-pass cut (Hz),
// fade in (ms) and pitch. Feed, Water and Sell keep their files as they are (net 0.3, no filter).
var ROLE_SET={main:{vol:0.12,cut:850,att:6,pitch:0.9},tab:{vol:0.22,cut:1800,att:3,pitch:1},chip:{vol:0.2,cut:1600,att:3,pitch:0.95},step:{vol:0.18,cut:1500,att:3,pitch:0.95},open:{vol:0.22,cut:1800,att:3,pitch:1},close:{vol:0.24,cut:2000,att:2,pitch:1}};
var SFX_FILE={tab:'tap_felt',chip:'tap_tip',step:'tap_blip',main:'tap_tok',open:'tap_pop',close:'tap_pillow',feed:'feed_drop_002',water:'water_double',sell:'sell_coins_chime_b'};
var GAP=40,RATE0=0.94,RATE1=1.06;
var T={ctx:null,cfg:null,raw:{},bufs:{},bufCtx:null,lastSnd:0,lastTick:0,mark:0,pend:null,el:null,plays:0,ticks:0,
 KEY_SND:'shrimp-btnsfx',KEY_TAP:'shrimp-taps',FILE:SFX_FILE};
function lsOn(k){try{return localStorage.getItem(k)!=='0';}catch(e){return true;}}
T.soundsOn=function(){return lsOn(T.KEY_SND);};
T.tapsOn=function(){return lsOn(T.KEY_TAP);};
T.set=function(k,on){try{localStorage.setItem(k,on?'1':'0');}catch(e){}};
// a page's own sound just played for this tap (sfxMoment, a job sound): no tap sound on top of it
T.marked=function(){T.mark=performance.now();};
// Generic roles, after the page's table. Order matters: the first match wins.
var GEN=[
 ['[role="tab"]','tab'],
 ['input[type="range"]','step'],
 [function(b){var t=(b.textContent||'').trim();return /^[−+\-]\s?[\d.,]*$/.test(t)&&t.length<=6;},'step'],
 [function(b){var l=(b.getAttribute('aria-label')||'')+' '+(b.textContent||'').trim();return /^\s*(close|back|cancel|dismiss|not now|×|✕)\b/i.test(l.trim())||/^(close|back|cancel)\b/i.test((b.textContent||'').trim());},'close'],
 ['[data-act$="-close"],[aria-expanded="true"]','close'],
 ['.qhelp,.infob,[aria-haspopup],[aria-expanded="false"]','open'],
 ['input[type="checkbox"],label.toggle,[role="switch"],[aria-pressed]','chip']
];
var LIKE='button,[role="button"],[role="tab"],[role="switch"],summary,label.toggle,input[type="checkbox"],input[type="range"],input[type="radio"],select,a[href]';
function match(b,sel){try{return typeof sel==='function'?sel(b):b.matches(sel);}catch(e){return false;}}
T.role=function(b){var d=b.closest('[data-sfx]');if(d&&b.contains(d)||d===b)return d.dataset.sfx;if(d&&d.dataset.sfx==='none')return 'none';
 var tb=(T.cfg&&T.cfg.table)||[];for(var i=0;i<tb.length;i++)if(match(b,tb[i][0]))return tb[i][1];
 for(var j=0;j<GEN.length;j++)if(match(b,GEN[j][0]))return GEN[j][1];return 'main';};
function target(e){var t=e.target;if(!t||!t.closest)return null;if(T.el&&T.el.contains(t))return null;var b=t.closest(LIKE);if(!b)return null;
 // a label wrapping a switch: the label is the button
 if(b.tagName==='INPUT'&&b.type==='checkbox'){var l=b.closest('label');if(l)b=l;}
 if(b.disabled||b.getAttribute('aria-disabled')==='true')return null;if(b.matches('label')){var inp=b.querySelector('input');if(inp&&inp.disabled)return null;}
 return b;}
// --- sounds ---
function ctxNow(){var c=T.cfg&&T.cfg.ctx&&T.cfg.ctx();return c&&c.state!=='closed'?c:null;}
T.load=function(){var c=ctxNow();if(!c||T.bufCtx===c)return;T.bufCtx=c;T.bufs={};
 Object.keys(SFX_FILE).forEach(function(r){var f=SFX_FILE[r];if(T.bufs[f])return;T.bufs[f]=null;
  var got=T.raw[f]?Promise.resolve(T.raw[f]):fetch('sfx/'+f+'.wav').then(function(x){if(!x.ok)throw 0;return x.arrayBuffer();}).then(function(a){T.raw[f]=a;return a;});
  got.then(function(a){return new Promise(function(ok,no){c.decodeAudioData(a.slice(0),ok,no);});}).then(function(b){if(T.bufCtx===c)T.bufs[f]=b;}).catch(function(){});});};
T.play=function(role){var now=performance.now();if(now-T.lastSnd<GAP)return false;if(!T.soundsOn()||!T.cfg||(T.cfg.ok&&!T.cfg.ok()))return false;
 var c=ctxNow();if(!c||c.state!=='running')return false;if(T.bufCtx!==c)T.load();var b=T.bufs[SFX_FILE[role]||SFX_FILE.main];if(!b)return false;
 try{var R=ROLE_SET[SFX_FILE[role]?role:'main'],s=c.createBufferSource(),g=c.createGain(),t=c.currentTime;s.buffer=b;s.playbackRate.value=(R?R.pitch:1)*(RATE0+Math.random()*(RATE1-RATE0));g.gain.value=T.cfg.gain*(R?R.vol/0.3:1);s.connect(g);
  if(R){var env=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=R.cut;lp.Q.value=0.5;env.gain.setValueAtTime(R.att?0:1,t);if(R.att)env.gain.linearRampToValueAtTime(1,t+R.att/1000);g.connect(env);env.connect(lp);lp.connect(T.cfg.dest());}else g.connect(T.cfg.dest());s.start(t);T.lastSnd=now;T.plays++;T.last={role:role,gain:g.gain.value,rate:s.playbackRate.value};return true;}catch(e){return false;}};
// --- the tick ---
function tickEl(){if(T.el)return T.el;var id='taps-tick',l=document.createElement('label'),i=document.createElement('input');i.type='checkbox';i.setAttribute('switch','');i.id=id;i.tabIndex=-1;l.htmlFor=id;
 l.setAttribute('aria-hidden','true');i.setAttribute('aria-hidden','true');l.appendChild(i);
 l.style.cssText='position:fixed;left:-200px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;contain:strict';
 (document.body||document.documentElement).appendChild(l);T.el=l;T.input=i;return l;}
T.tick=function(){var now=performance.now();if(now-T.lastTick<GAP||!T.tapsOn())return false;T.lastTick=now;
 try{var l=tickEl(),fa=document.activeElement;T.inTick=1;l.click();T.inTick=0;if(document.activeElement===T.input){T.input.blur();if(fa&&fa.focus&&fa!==document.body)try{fa.focus({preventScroll:true});}catch(e){}}T.ticks++;return true;}catch(e){T.inTick=0;return false;}};
// the tick's clicks and changes never reach the page's own listeners (window capture runs first)
['click','change','input','pointerdown','pointerup','focusin'].forEach(function(ev){window.addEventListener(ev,function(e){if(T.el&&e.target&&T.el.contains(e.target))e.stopImmediatePropagation();},true);});
// --- one delegated listener: pointerup on an enabled button. The tick goes at once; the sound waits for the click
// to run (so a sound the button plays itself wins), at most 40 ms.
function resolve(){var p=T.pend;if(!p)return;T.pend=null;clearTimeout(p.t);if(T.mark>=p.at)return;T.play(p.role);}
// every tap: wake the context (in the gesture, for iPhone) and load the sounds once it exists (the page may make it
// in its own pointerup listener, so look again right after)
document.addEventListener('pointerup',function(e){T.load();setTimeout(T.load,0);if(e.button>0)return;var b=target(e);if(!b)return;var r=T.role(b);if(r==='none')return;
 T.tick();T.load();if(T.pend)resolve();T.pend={role:r,at:performance.now(),t:setTimeout(resolve,GAP)};},true);
window.addEventListener('click',function(e){if(T.inTick)return;if(T.pend)setTimeout(resolve,0);},false);
window.addEventListener('storage',function(e){if(e.key===T.KEY_SND||e.key===T.KEY_TAP)T.changed=Date.now();});
T.init=function(cfg){T.cfg=cfg;};
window.TAPS=T;
})();
