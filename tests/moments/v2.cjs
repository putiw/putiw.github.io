// v2 moment tests (13-14 Nov, claude/shrimp-v2-plan-13nov.md and claude/shrimp-v2-choices-14nov.md). One block per milestone.
const M=require('../lib/moment.cjs');
const only=process.env.V2_ONLY?process.env.V2_ONLY.split(','):null,on=k=>!only||only.includes(k);
(async()=>{const g=await M.open({w:390});
 const A=n=>M.snap('avg',n);
 // ---- M1: the count, from the first home ----
 if(on('m1')){
  const hl=()=>g.js(()=>{var e=$('homesline');return e&&!e.hidden&&e.checkVisibility()?e.innerText.replace(/\s+/g,' ').trim():null;});
  await g.js(()=>{G=newGame();migrate(G);cache={};render();});
  M.check('M1 fresh game: no count line',await hl()===null,await hl());
  await g.load(A('milestone jar'));M.check('M1 before the jar sale: no count line',await hl()===null,await hl());
  await g.load(A('milestone sale'));M.check('M1 after the jar sale the line reads 2',/^2 of 8,200,000,000 homes have a shrimp tank$/.test(await hl()||''),await hl());
  await g.load(A('first kit'));{const t=await hl()||'',n=+(t.split(' ')[0].replace(/,/g,''));M.check('M1 first kit: 3 or more',n>=3,t);}
  const h0=await g.rect('header.top');
  await g.load(A('year 4'));const last=await g.js(()=>homesShown(G));
  M.check('M1 year 4: the bar shows and the line is hidden',!!(await g.rect('#topgoal'))&&await hl()===null);
  M.check('M1 the bar number is the count (never steps down at the handover)',await g.js(()=>$('tg-n').innerText===big(homesShown(G))&&homesShown(G)>=Math.floor(G.humans)),last);
  await g.page.setViewportSize({width:360,height:844});
  await g.load(A('milestone ev_rival'));{const r=await g.js(()=>{var e=$('homesline');return {t:e.innerText,cut:e.scrollWidth>e.clientWidth+1,h:e.getBoundingClientRect().height};});
   M.check('M1 360: the line is one line and not cut',!r.cut&&r.h<20,r);}
  await g.load(A('milestone sale'));{const a=await g.rect('header.top');await g.page.mouse.click(180,500);await g.page.waitForTimeout(250);const b=await g.rect('header.top');M.check('M1 header height stable under a tap',Math.abs(a.h-b.h)<1,{a:a.h,b:b.h});}
  await g.page.setViewportSize({width:390,height:844});
 }
 // ---- M2: The line ----
 if(on('m2')){
  for(const st of ['first farm','100k kits','year 7']){await g.load(A(st));await g.tab('emp');await g.js(()=>{document.querySelectorAll('.card.shut').forEach(c=>c.classList.remove('shut'));cache={};render();});
   const r=await g.js(()=>{var num=s=>{var m=/^\s*([\d.,]+[kMBT]?)/.exec(s||'');return m?m[1]:null;},nb=[...document.querySelectorAll('#ln-nums .ln-b b')].map(b=>b.innerText),k=$('e-kitsum').innerText,km=/of ([\d.,]+[kMBT]?) orders/.exec(k);
    return {line:nb,farm:num($('e-farmsum').innerText.replace(/^[\d.,kMB]+ farms · /,'')),pack:num($('e-staffsum').innerText.replace(/^[\d.,kMB]+ in stock · /,'')),ord:km?km[1]:null,vis:$('c-line').checkVisibility(),first:[...document.querySelectorAll('#p-emp>.card')].filter(c=>c.checkVisibility()).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0].id};});
   M.check('M2 '+st+': The line shows, first card on the tab',r.vis&&r.first==='c-line',r);
   M.check('M2 '+st+': Bred equals the Farms header',r.line[0]===r.farm,r);
   if(r.pack)M.check('M2 '+st+': Packed equals the Making kits header',r.line[1]===r.pack,r);
   M.check('M2 '+st+': Ordered equals the Kits header',r.line[2]===r.ord,r);}
  await g.load(A('year 7'));await g.tab('emp');await g.js(()=>{$('c-line').classList.remove('shut');speed=0;render();});await g.page.waitForTimeout(300);
  const t0=await g.js(()=>LN.t);await g.page.waitForTimeout(500);const t1=await g.js(()=>LN.t);await g.js(()=>{speed=1;});await g.page.waitForTimeout(600);const t2=await g.js(()=>{speed=0;return LN.t;});
  M.check('M2 dots stand still while paused',t1===t0,{t0,t1});M.check('M2 dots move while the clock runs',t2>t1,{t1,t2});
  {const h0=(await g.rect('#c-line')).h;await g.page.click('#c-line .hd h2');await g.page.waitForTimeout(250);const h1=(await g.rect('#c-line')).h;M.check('M2 the card collapses',h1<h0-60,{h0,h1});await g.page.click('#c-line .hd h2');await g.page.waitForTimeout(250);}
  M.check('M2 canvas height fixed at 84',Math.abs((await g.rect('#ln-cv')).h-84)<1);
  M.check('M2 the kit price slider sits in The line',await g.js(()=>$('kit-pricerow').parentNode.id==='ln-price'&&$('kit-pricerow').checkVisibility()));
  await g.load(A('first kit'));await g.tab('emp');M.check('M2 the fixed first-50 price stays on the Kits card',await g.js(()=>$('kit-pricerow').parentNode.id!=='ln-price'));
  await g.page.setViewportSize({width:360,height:844});
  for(const st of ['first kit','year 7']){await g.load(A(st));await g.tab('emp');await g.js(()=>{$('c-line').classList.remove('shut');render();});
   const o=await g.js(()=>{var c=$('c-line'),cr=c.getBoundingClientRect();return [...c.querySelectorAll('*')].filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().right>cr.right+0.5||e.scrollWidth>e.clientWidth+1&&e.tagName!=='CANVAS')).map(e=>e.id||e.className);});
   M.check('M2 360 '+st+': nothing in The line overflows',!o.length,o);}
  await g.page.setViewportSize({width:390,height:844});
  await g.load(A('year 7'));await g.tab('emp');await g.js(()=>{$('c-line').classList.remove('shut');render();});await g.tapText('#ln-nums .ln-b',/Packed/);await g.page.waitForTimeout(400);
  M.check('M2 tapping Packed goes to Making kits',await g.js(()=>{var r=$('c-staff').getBoundingClientRect();return activeTab==='emp'&&r.top<innerHeight&&r.bottom>0;}));
 }
 // ---- M3: letters ----
 if(on('m3')){
  await g.load(A('first farm'));
  {const ks=Object.keys(M.run('avg').snapshots),i0=ks.indexOf('first farm'),i1=ks.indexOf('milestone million'),all=ks.slice(i0+1,i1+1).filter(k=>/^milestone /.test(k)).map(k=>k.slice(10)),lt=await g.js(a=>a.map(k=>isLetter(k)),all),cs=all.map((k,i)=>({k,letter:lt[i]})),st=cs.filter(c=>!c.letter);M.check('M3 average run, first farm to a million: under 20 cards stop the clock (was 39)',st.length<20&&cs.length-st.length>=10,{stop:st.length,letters:cs.length-st.length,keys:st.map(c=>c.k).join(' ')});}
  const pm=M.moment('avg','card pain_heat');
  if(pm){
   const run=async(answer)=>{await g.load(pm,{card:true});return g.js((ans)=>{var p=G.progress;if(ans){storyChoose(G,'pain_heat',0);acknowledgeMilestone(G);}else mailLater(G);var o=0;
     for(var i=0;i<240;i++){while(p.queue.length){var k=p.queue[0],ch=storyChoices(G,k);if(ch)for(var j=0;j<ch.length;j++)if(storyChoose(G,k,j))break;acknowledgeMilestone(G);}stepGame(G);if(i>=120)o+=Math.max(0,kitDemand(G));}
     return {o:o/120,mail:p.mail.slice(),pm:painMult(G),blocked:progressionBlocked(G)};},answer);};
   const a=await run(false),b=await run(true);
   M.check('M3 a pain left unanswered 60 days: lower orders than answered on day 0',a.o<b.o*0.98,{left:a.o,answered:b.o});
   M.check('M3 the unanswered pain is still in Letters after 60 days, nothing picked for the player',a.mail.includes('pain_heat')&&!b.mail.includes('pain_heat'),{a:a.mail,b:b.mail});
   M.check('M3 a waiting letter does not stop the clock',!a.blocked);
   // old save: the pain card sits in queue, no mail fields
   await g.load(pm,{card:true});
   const mg=await g.js(()=>{var s=JSON.parse(JSON.stringify(G));delete s.progress.mail;delete s.progress.mailq;delete s.progress.mailOpen;delete s.progress.mailAt;s.progress.queue=['pain_heat'];migrate(s);return {q:s.progress.queue,m:s.progress.mail};});
   M.check('M3 old save with a pain card in queue loads with it in Letters',mg.m.includes('pain_heat')&&!mg.q.length,mg);
   // the player's path
   await g.load(pm,{card:true});await g.js(()=>{mailLater(G);cache={};render();});await g.tab('tank');
   M.check('M3 dot on the Kits tab while a letter waits',await g.js(()=>!$('empdot').hidden));
   await g.tab('emp');await g.js(()=>{document.querySelectorAll('.card.shut').forEach(c=>c.classList.remove('shut'));render();});
   const row=await g.text('#c-mail');M.check('M3 Letters card lists the letter with Open',/Dead on arrival/.test(row||'')&&/Open/.test(row||''),row);
   {const o=await g.js(()=>{var ids=[...document.querySelectorAll('#p-emp>.card')].filter(c=>c.checkVisibility()).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top).map(c=>c.id);return ids.slice(0,2);});M.check('M3 Letters sits under The line',o[0]==='c-line'&&o[1]==='c-mail',o);}
   M.check('M3 no card up while the letter waits',await g.rect('#milestone-card')===null);
   await g.tapText('#c-mail button',/^Open$/);await g.page.waitForTimeout(400);
   const sc=(await g.text('#milestone-scope')||'');M.check('M3 open letter: header LETTER, not time paused',/^letter$/i.test(sc),sc);
   const acts=await g.js(()=>[...document.querySelectorAll('#milestone-actions button')].map(b=>b.dataset.act));
   M.check('M3 open letter: answers plus Later, no Got it',acts.includes('mail-later')&&acts.includes('story-choice')&&!acts.includes('milestone-next'),acts);
   M.check('M3 time is paused while the letter is open',await g.js(()=>speed===0&&progressionBlocked(G)));
   await g.page.waitForTimeout(600);await g.tapText('#milestone-actions button',/^Later$/);await g.page.waitForTimeout(400);
   M.check('M3 Later closes it unanswered',await g.rect('#milestone-card')===null&&await g.js(()=>G.progress.mail.includes('pain_heat')&&!G.progress.queue.length&&!G.emp.pains.pain_heat));
   await g.tapText('#c-mail button',/^Open$/);await g.page.waitForTimeout(1100);await g.js(()=>{G.money=Math.max(G.money,1e7);render();});await g.page.waitForTimeout(700);
   await g.page.click('#milestone-actions button[data-act="story-choice"]:not([disabled])');await g.page.waitForTimeout(500);
   M.check('M3 answering takes it out of Letters',await g.js(()=>!G.progress.mail.includes('pain_heat')&&!!G.emp.pains.pain_heat));
   M.check('M3 the What happened card still comes after an answer',await g.js(()=>afterOpen()));
  }else M.skip('M3 pain','no card pain_heat moment');
  {const sm=M.moment('avg','card c_play')||M.moment('avg','card mira_teen');if(sm){await g.load(sm,{card:true});await g.page.waitForTimeout(300);const acts=await g.js(()=>[...document.querySelectorAll('#milestone-actions button')].map(b=>b.dataset.act));
    M.check('M3 a story card has no Later and says time paused',!acts.includes('mail-later')&&/time paused/i.test(await g.text('#milestone-scope')||''),acts);}}
 }
 await g.close();M.done('v2');})();
