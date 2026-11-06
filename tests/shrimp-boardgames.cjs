// Pass 277: Gomoku and Reversi in the game. The 1 June card holds the clock, a competition game is locked
// (no Undo, restart or switching) and Give up is a loss, a win pays through bgEnd, Grandma's question pauses
// before the bot moves and Undo leaves the bot's turn unplayed, three questions a game at most, "don't tell me" is saved.
// Reversi: Grandma stays quiet on most random moves. Touch emulation, 390 px.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.dismiss());
 await p.goto('file://'+path.join(__dirname,'../shrimp/index.html'));await p.waitForTimeout(500);
 await p.evaluate(()=>{localStorage.clear();G=newGame();G.name='Test';G.progress.seen.intro=true;G.progress.queue=[];G.tanks[0].had=1;G.tanks[0].cycledAt=0;G.money=30000;G.emp.farms={t:1};window.spotlight=function(){};G.me.on=1;
  Object.keys(MILESTONES).forEach(function(k){G.progress.seen[k]=true;});G.progress.wait=[];G.progress.soon=[];bgOf(G).f=0;G.day=bgJ1(2027)-0.5;G.progress.v2=G.progress.v3=1;render();});
 // reach 1 June: the card shows and the clock stops
 await p.evaluate(()=>{for(var i=0;i<4&&!bgHold(G);i++)stepGame(G,0);render();});
 let st=await p.evaluate(()=>({hold:bgHold(G),card:!document.getElementById('bg-card').hidden,never:!!document.querySelector('[data-v="never"]'),day:G.day}));
 if(!st.hold||!st.card)throw Error('1 June card did not show '+JSON.stringify(st));if(st.never)throw Error('no Never in the first year');
 await p.evaluate(()=>setSpeed(1));await p.waitForTimeout(1500);
 const d1=await p.evaluate(()=>G.day);if(d1!==st.day)throw Error('clock ran under the card '+st.day+' '+d1);
 // Play Gomoku: locked board, then Give up is a loss
 await p.click('[data-v="gomoku"]');await p.waitForTimeout(200);
 st=await p.evaluate(()=>{var el=document.getElementById('bg-el'),sr=el.shadowRoot,vis=id=>{var e=sr.getElementById(id);return !!(e&&e.offsetParent!==null);};return {ov:!document.getElementById('bg-ov').hidden,comp:el.classList.contains('comp'),undo:vis('undo'),tabs:vis('tab-reversi'),lvl:vis('difficulty'),hold:bgHold(G),on:BG.on,x:document.getElementById('bg-x').textContent};});
 if(!st.ov||!st.comp||st.undo||st.tabs||st.lvl||st.hold||!st.on||st.x!=='Give up')throw Error('competition board '+JSON.stringify(st));
 const d2=await p.evaluate(()=>G.day);await p.waitForTimeout(1200);if(await p.evaluate(()=>G.day)!==d2)throw Error('clock ran during the game');
 await p.click('#bg-x');await p.waitForTimeout(100);
 st=await p.evaluate(()=>({r:bgNow(G).gomoku,ov:!document.getElementById('bg-ov').hidden,left:bgLeft(G),row:!document.getElementById('me-bgc').hidden}));
 if(st.r!=='loss'||st.ov||st.left.join()!=='reversi')throw Error('give up '+JSON.stringify(st));
 // Reversi from the You tab row, a win pays half the cash
 await p.evaluate(()=>{G.money=6000;selectTab('me');render();});
 await p.evaluate(()=>{document.querySelector('[data-act="bg-comp"][data-g="reversi"]').click();});await p.waitForTimeout(150);
 st=await p.evaluate(()=>{var m0=G.money;document.getElementById('bg-el').dispatchEvent(new CustomEvent('bg-end',{detail:{game:'reversi',mode:'comp',result:'win'}}));return {got:G.money-m0,r:bgNow(G).reversi,x:document.getElementById('bg-x').textContent};});
 if(st.got!==3000||st.r!=='win'||st.x!=='Close')throw Error('win pays '+JSON.stringify(st));
 await p.click('#bg-x');
 // Grandma's games: Gomoku, a missed win gets the question; Undo restores the board and the bot hasn't moved
 await p.evaluate(()=>{document.querySelector('[data-act="bg-gm"]').click();});await p.waitForTimeout(150);
 const E='document.getElementById("bg-el")';
 const setup=async()=>p.evaluate(()=>{var el=document.getElementById('bg-el');el.start({mode:'gm',game:'gomoku',advice:!bgOf(G).q,sound:()=>false});var b=Array.from({length:15},()=>Array(15).fill(0));[3,4,5,6].forEach(c=>b[7][c]=1);b[7][2]=2;[2,3,4].forEach(c=>b[1][c]=2);el._t.set(b);});
 const tap=async(r,c)=>p.evaluate(([r,c])=>{var sr=document.getElementById('bg-el').shadowRoot;sr.getElementById('board').children[1+r*15+c].click();},[r,c]);
 const adv=async()=>p.evaluate(()=>{var sr=document.getElementById('bg-el').shadowRoot;return !sr.getElementById('advice').hidden;});
 const whites=async()=>p.evaluate(()=>document.getElementById('bg-el')._t.get().flat().filter(v=>v===2).length);
 await setup();
 for(let k=1;k<=3;k++){await tap(12,12);await p.waitForTimeout(100);if(!await adv())throw Error('no question on mistake '+k);
  await p.evaluate(()=>document.getElementById('bg-el').shadowRoot.getElementById('adv-thanks').click());
  await p.evaluate(()=>document.getElementById('bg-el').shadowRoot.getElementById('adv-undo').click());await p.waitForTimeout(900);
  const bd=await p.evaluate(()=>document.getElementById('bg-el')._t.get());if(bd[12][12]!==0)throw Error('undo did not restore');if(await whites()!==4)throw Error('bot moved after undo');}
 await tap(12,12);await p.waitForTimeout(100);if(await adv())throw Error('a fourth question in one game');
 await p.waitForTimeout(2800);if(await whites()!==5)throw Error('bot did not move after the quiet mistake');
 // a good move gets no question
 await setup();await tap(7,7);await p.waitForTimeout(100);if(await adv())throw Error('question on the winning move');
 // "don't tell me": saved, and no more questions
 await setup();await tap(12,12);await p.waitForTimeout(100);await p.evaluate(()=>document.getElementById('bg-el').shadowRoot.getElementById('adv-quiet').click());
 if(!await p.evaluate(()=>bgOf(G).q))throw Error('quiet not saved');await p.evaluate(()=>document.getElementById('bg-el').shadowRoot.getElementById('adv-go').click());
 await setup();await tap(12,12);await p.waitForTimeout(100);if(await adv())throw Error('question after quiet');
 // failing to block: the bot has four with one open end, you play away
 await p.evaluate(()=>{bgOf(G).q=0;var el=document.getElementById('bg-el');el.start({mode:'gm',game:'gomoku',advice:true,sound:()=>false});var b=Array.from({length:15},()=>Array(15).fill(0));[3,4,5,6].forEach(c=>b[5][c]=2);b[5][2]=1;b[9][9]=1;el._t.set(b);});
 await tap(12,12);await p.waitForTimeout(100);if(!await adv())throw Error('no question on a missed block');
 // Reversi: across random games, Grandma stays quiet on most moves
 const rs=await p.evaluate(()=>{var t=document.getElementById('bg-el')._t;document.getElementById('bg-el').start({mode:'gm',game:'reversi',advice:true,sound:()=>false});var asked=0,moves=0,seed=3;var rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  for(var gI=0;gI<12;gI++){var b=Array.from({length:8},()=>Array(8).fill(0));b[3][3]=2;b[3][4]=1;b[4][3]=1;b[4][4]=2;for(var ply=0;ply<60;ply++){var who=ply%2?2:1;var ms=who===1?t.legal(b):(function(){var x=[];for(var r=0;r<8;r++)for(var c=0;c<8;c++){var bb=b.map(q=>q.slice());if(!bb[r][c]&&t.apply(bb,r,c,2))x.push({r,c});}return x;})();if(!ms.length)continue;var m=ms[Math.floor(rnd()*ms.length)];
   if(who===1&&ms.length>1){var pre=b.map(q=>q.slice()),nb=b.map(q=>q.slice());t.apply(nb,m.r,m.c,1);moves++;if(t.mistake(pre,m.r,m.c,nb))asked++;}t.apply(b,m.r,m.c,who);}}return {asked,moves};});
 console.log('reversi random moves questioned',rs.asked,'of',rs.moves);if(rs.asked>rs.moves*0.35||rs.asked<1)throw Error('reversi question rate '+JSON.stringify(rs));
 await p.click('#bg-x');
 // second year: Never show this again; next June has no card but the You tab row
 st=await p.evaluate(()=>{G.day=bgJ1(2028)-0.5;for(var i=0;i<4&&!bgHold(G);i++)stepGame(G,0);render();var nv=!!document.querySelector('[data-v="never"]');document.querySelector('[data-v="never"]')&&document.querySelector('[data-v="never"]').click();G.day=bgJ1(2029)-0.5;for(var j=0;j<4;j++)stepGame(G,0);render();return {nv,never:bgOf(G).never,hold:bgHold(G),row:!document.getElementById('me-bgc').hidden,card:!document.getElementById('bg-card').hidden};});
 if(!st.nv||!st.never||st.hold||!st.row||st.card)throw Error('never '+JSON.stringify(st));
 if(errs.length)throw Error(errs[0]);
 console.log('board game checks passed');await b.close();})().catch(e=>{console.error(e.message);process.exit(1);});
