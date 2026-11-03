// Pass 235 (plan Part 5): sound. Under a minute, needs ffmpeg.
// node tests/shrimp-sound.cjs
//  - every sound file: peak no higher than -1 dBFS and no 50 ms stretch louder than -9 dBFS RMS (no harsh peaks),
//    each with its level printed;
//  - the two loops (music, water): the last and first half second within 6 dB of each other, so the wrap doesn't jump
//    (the pages also crossfade at the wrap);
//  - every sound a company mini game makes (sfx, sfxLoop in index.html) is the same as the land's (sound.js in home.html):
//    same names, same numbers;
//  - mute: the game's mute reaches the land and the ship, and only one page plays music. Those are browser checks in
//    tests/shrimp-taps.cjs and tests/shrimp-land-audio.cjs; run both with this one.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const SH=path.join(__dirname,'../shrimp');let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++;};
function pcm(f){const b=execFileSync('ffmpeg',['-v','error','-i',f,'-ac','1','-ar','44100','-f','f32le','-'],{maxBuffer:1<<28});return new Float32Array(b.buffer,b.byteOffset,b.length/4);}
const db=x=>x>0?20*Math.log10(x):-120;
function rms(a,s,e){let t=0;for(let i=s;i<e;i++)t+=a[i]*a[i];return Math.sqrt(t/Math.max(1,e-s));}
const files=fs.readdirSync(SH).filter(f=>/\.(mp3|wav)$/.test(f)).concat(fs.readdirSync(path.join(SH,'sfx')).map(f=>'sfx/'+f));
for(const f of files){const a=pcm(path.join(SH,f));let pk=0;for(const v of a)pk=Math.max(pk,Math.abs(v));let mx=0;const w=Math.min(2205,a.length);for(let i=0;i+w<=a.length;i+=w)mx=Math.max(mx,rms(a,i,i+w));
 const P=db(pk),R=db(mx);ok(P<=-1&&R<=-9,f.padEnd(26)+' peak '+P.toFixed(1)+' dBFS, loudest 50 ms '+R.toFixed(1)+' dBFS');}
for(const f of ['music.mp3','water.mp3']){const a=pcm(path.join(SH,f)),h=22050,end=db(rms(a,a.length-h,a.length)),st=db(rms(a,0,h));
 ok(Math.abs(end-st)<=6,f+' loop seam: last half second '+end.toFixed(1)+' dB, first '+st.toFixed(1)+' dB');}
// company mini game sounds against the land's
const game=fs.readFileSync(path.join(SH,'index.html'),'utf8'),land=fs.readFileSync(path.join(SH,'home.html'),'utf8');
function cases(src,fn){const i=src.indexOf('function '+fn+'(name');if(i<0)return {};const e=src.indexOf('\n}}catch',i)>0?src.indexOf('}}catch(e){}}',i):src.indexOf('\n',i+4000);const body=src.slice(i,e+1);const o={};
 body.replace(/case '([a-z]+)':([\s\S]*?)break;/g,(m,k,v)=>{o[k]=v.replace(/sfxTone\(/g,'tone(').replace(/sfxBurst\(/g,'nburst(').replace(/\s+/g,'');return m;});return o;}
const gs=cases(game,'sfx'),ls=cases(land,'sfx');
ok(Object.keys(gs).length>=6,'found the company sounds ('+Object.keys(gs).join(', ')+')');
for(const k in gs){ok(k in ls,'the land has the company sound '+k);if(k in ls)ok(gs[k]===ls[k],k+' plays the same on both pages'+(gs[k]===ls[k]?'':'\n   company '+gs[k].slice(0,140)+'\n   land    '+ls[k].slice(0,140)));}
const pk=s=>{const m=s.match(/var peak=\{([^}]*)\}/);return m?m[1].replace(/\s+/g,''):'';};const gp=pk(game.slice(game.indexOf('function sfxLoop('))),lp=pk(land.slice(land.indexOf('function sfxLoop(')));
// drain, fill and under are the health check's water change and salt dip, company only (the check is company-only)
const lvl=(t,k,d)=>{const y=t.split(',').find(z=>z.split(':')[0]===k);return y?+y.split(':')[1]:d;};
['siphon','wipe'].forEach(k=>{const a=lvl(gp,k,0.05),b2=lvl(lp,k,0.1);ok(a===b2,'loop '+k+' at the same level on both pages ('+a+' vs land '+b2+')');});
console.log(fails?fails+' FAILED':'all ok');process.exit(fails?1:0);
