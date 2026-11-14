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
  await g.load(A('milestone sale'));M.check('M1 after the jar sale the line reads 2',/^2 of 8,200,000,000 people have a shrimp tank$/.test(await hl()||''),await hl());
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
    return {line:nb,farm:num($('e-farmsum').innerText.replace(/^[\d.,kMB]+ farms · /,'')),pack:num($('e-staffsum').innerText.replace(/^[\d.,kMB]+ in stock · /,'')),ord:km?km[1]:null,vis:$('c-line').checkVisibility(),first:[...document.querySelectorAll('#p-emp>.card')].filter(c=>c.checkVisibility()&&c.id!=='c-homes'&&c.id!=='c-map').sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0].id};});
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
   {const o=await g.js(()=>{var ids=[...document.querySelectorAll('#p-emp>.card')].filter(c=>c.checkVisibility()&&c.id!=='c-homes'&&c.id!=='c-map').sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top).map(c=>c.id);return ids.slice(0,2);});M.check('M3 Letters sits under The line',o[0]==='c-line'&&o[1]==='c-mail',o);}
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
 // ---- M8: the choices ----
 if(on('m8')){
  await g.load(A('year 12'));
  {const r=await g.js(()=>({cut:projAvail(G).filter(p=>p.fk&&FORK_CUT[p.fk]).map(p=>p.id),n:['gene','land','culls','filter','data','labname'].map(fk=>forkOpts(fk).length),q:FORK_Q.filter,heart:['gene','land','culls','filter','labname'].every(fk=>forkOpts(fk).every(p=>!(p.h<0))),
     push:PROJ.filter(p=>p.c==='fork'&&['gene','land','culls','filter','data','labname'].indexOf(p.fk)>=0).filter(p=>{var f=FORK_PUSH[p.id]||{};return !Object.keys(f).some(k=>k!=='means'&&f[k]);}).map(p=>p.id)}));
   M.check('M8a the five doubled forks are never offered',!r.cut.length,r.cut);
   M.check('M8b six forks: 3, 3, 3, 2, 3, 4 answers',r.n.join()==='3,3,3,2,3,4',r.n);
   M.check('M8b the filter question is the new line',r.q==='The kit could be easier or it could last.',r.q);
   M.check('M8b no cold-heart answer on the good-against-good forks',r.heart);
   M.check('M8b every answer on the six rewritten forks moves a trait other than means',!r.push.length,r.push);}
  {const r=await g.js(()=>{var s=JSON.parse(JSON.stringify(G));s.emp.proj.shipwarm=5;migrate(s);return {kept:!!s.emp.proj.shipwarm,mat:matAdj(s)};});M.check('M8a a save that answered a cut fork keeps its effect',r.kept&&r.mat>=4,r);}
  {const r=await g.js(()=>{var s=JSON.parse(JSON.stringify(G));s.money=1e12;delete s.emp.proj.filtercart;delete s.emp.proj.filterlast;delete s.emp.proj.foodpods;delete s.emp.proj.foodopen;if(s.emp.no){delete s.emp.no.filtercart;delete s.emp.no.filterlast;}var ok=buyProj(s,'filtercart');return {ok:ok,pods:!!s.emp.proj.foodpods,food:projAvail(s).some(p=>p.fk==='food')};});M.check('M8b the filter fork takes the food fork with it',r.ok&&r.pods&&!r.food,r);}
  // a fork on screen with three answers, at 360
  {const fm=M.moment('avg','fork land');if(fm){await g.page.setViewportSize({width:360,height:844});await g.load(fm);await g.tab(fm.tab);await g.js(()=>{G.emp.proj.wasteclean=G.emp.proj.wasteclean||1;document.querySelectorAll('.card.shut').forEach(c=>c.classList.remove('shut'));cache={};render();});
    const r=await g.js(()=>{var f=[...document.querySelectorAll('.item.fork')].filter(x=>x.checkVisibility()&&x.querySelector('h3').innerText===FORK_Q.land)[0];if(!f)return null;f.scrollIntoView({block:'center'});var cr=f.closest('.card').getBoundingClientRect();return [...f.querySelectorAll('button.fopt')].map(b=>({id:b.dataset.id,over:b.getBoundingClientRect().right>cr.right+0.5||b.scrollWidth>b.clientWidth+1,t:b.innerText.replace(/\s+/g,' ')}));});
    M.check('M8b the land fork shows its three answers at 360, none cut',!!r&&r.length===3&&r.every(x=>!x.over)&&r.some(x=>/forty tenant families move/.test(x.t))&&r.some(x=>/30% fewer shrimp a day/.test(x.t)),r);await g.page.screenshot({path:'/tmp/shots/fork.png'});await g.page.setViewportSize({width:390,height:844});}else M.skip('M8b fork on screen','no fork land moment');}
  // goodbyes
  {const bm=M.find('card bye_sales',['avg','kind','strong']);if(bm){await g.load(bm,{card:true});await g.page.waitForTimeout(300);const t=await g.text('#milestone-body')||'',ls=await g.js(()=>byeOpts(G,'sales').map(o=>o[0]));
    M.check('M8d Luca asks for his own thing',/take the spreadsheet and open his own shop/.test(t),t.slice(-90));M.check('M8d Luca: the list first, Let them go last',/^Give him the list/.test(ls[0])&&/^Let them go/.test(ls[ls.length-1])&&ls.length===4,ls);}else M.skip('M8d','no card bye_sales moment');}
  {const r=await g.js(()=>['pack','sales','mgr','social'].map(k=>{var o=byeOpts(G,k);return k+':'+o.map(x=>x[2]).join('/')+':'+(PUSH['bye_'+k]||[]).length;}));M.check('M8d four goodbyes, four answers each, a push for each',r.join(' ')==='pack:bonus/loop/retrain/let:4 sales:list/bonus/study/let:4 mgr:shop/loop/mgr/let:4 social:loop5/study/bonus/let:4',r);}
  // invitations
  await g.load(A('year 2'));
  {const r=await g.js(()=>{G.me.on=1;G.me.inv={};var n0=(G.notes&&G.notes.list.length)||0,q0=G.progress.queue.length,ok=inviteOpen(G,'party1');cache={};render();return {ok:ok,note:G.notes.list.length-n0,last:G.notes.list[G.notes.list.length-1].t,q:G.progress.queue.length-q0,ring:$('tb-me').classList.contains('ring')};});
   M.check('M8c an invitation is a note, not a card, and the person button rings',r.ok&&r.note===1&&r.q===0&&r.ring&&/birthday party on Thursday/.test(r.last),r);}
  await g.tab('me');{const row=await g.text('#me-inv')||'';M.check('M8c a row with Go on the You page',/birthday party on Thursday/.test(row)&&/Go/.test(row),row);
   const top=await g.js(()=>{var cs=[...document.querySelectorAll('#p-me>.card')].filter(c=>c.checkVisibility()).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);return cs[0]&&cs[0].id;});M.check('M8c the row is at the top of the You page',top==='me-inv',top);}
  await g.tapText('#me-inv button',/^Go$/);await g.page.waitForTimeout(400);
  M.check('M8c Go applies the go answer and shows what happened',await g.js(()=>G.emp.party&&G.emp.party[1]==='go'&&!inviteList(G).length&&afterOpen()));
  await g.load(A('year 2'));
  {const r=await g.js(()=>{G.me.on=1;G.me.inv={};inviteOpen(G,'party1');var it=G.me.inv.party1;it.d=Math.floor(G.day)-GT_CAP-1;var n=G.log.length,q=G.progress.queue.length,nn=G.notes.list.length;inviteDay(G);return {p:G.emp.party&&G.emp.party[1],left:inviteList(G).length,log:G.log.filter(x=>/Cake in the old lab/.test(x.t)).length,q:G.progress.queue.length-q,notes:G.notes.list.length-nn};});
   M.check('M8c the window closing is the busy answer, no card and no message',r.p==='busy'&&!r.left&&!r.log&&!r.q&&!r.notes,r);}
  {const r=await g.js(()=>{G.me.on=0;G.me.inv={};return inviteOpen(G,'party2');});M.check('M8c before the You page opens it stays a card',r===false);}
  // the split
  {const vm=M.find('card c_vet',['avg','kind','strong']);if(vm){await g.load(vm,{card:true});await g.page.waitForTimeout(1200);
    const t0=await g.text('#milestone-actions')||'';M.check('M8e c_vet: three rows and Send it',/Friends and family/.test(t0)&&/A vet who learns shrimp/.test(t0)&&/Stays in the company/.test(t0)&&/Send it/.test(t0)&&/100%/.test(t0),t0);
    const m0=await g.js(()=>({m:G.money,a:splitAmt(G,'c_vet')}));
    for(let i=0;i<2;i++){await g.page.click('#milestone-actions button[data-act="split"][data-j="0"][data-d="25"]');await g.page.waitForTimeout(700);}
    const pc=await g.js(()=>[...document.querySelectorAll('#milestone-actions .sp-v')].map(e=>e.innerText));M.check('M8e rows add up to 100 in steps of 25',pc.join()==='50%,0%,50%',pc);
    await g.page.click('#milestone-actions button[data-act="split-send"]');await g.page.waitForTimeout(500);
    const r=await g.js(()=>({m:G.money,sp:G.story.split&&G.story.split.c_vet,up:!$('milestone-card').hidden&&G.progress.queue[0]==='c_vet',mail:G.progress.mail.includes('c_vet')}));
    M.check('M8e Send it pays the share and closes the card',Math.abs((m0.m-r.m)-m0.a*0.5)<=Math.max(2,m0.a*0.01)&&r.sp&&r.sp[0]===0.5&&!r.up&&!r.mail,{m0,r});}else M.skip('M8e','no card c_vet moment');}
  {const bm=M.find('card c_bonus',['avg','kind','strong']);if(bm){await g.load(bm,{card:true});await g.page.waitForTimeout(400);const acts=await g.js(()=>[...document.querySelectorAll('#milestone-actions button')].map(b=>b.dataset.act+(b.dataset.i||'')));
    M.check('M8e c_bonus: the split, Send it, and the pump as its own answer',acts.includes('split-send')&&acts.includes('story-choice2')&&acts.filter(a=>/^story-choice/.test(a)).length===1&&/little bird/.test(await g.text('#milestone-actions')||''),acts);
    await g.page.setViewportSize({width:360,height:844});await g.page.waitForTimeout(300);const o=await g.js(()=>[...document.querySelectorAll('#milestone-actions *')].filter(e=>e.checkVisibility()&&e.getBoundingClientRect().right>$('milestone-card').getBoundingClientRect().right+0.5).length);M.check('M8e the split fits at 360',o===0,o);await g.page.setViewportSize({width:390,height:844});}else M.skip('M8e bonus','no card c_bonus moment');}
  // two things you say
  await g.load(A('year 12'));
  {const r=await g.js(()=>{var s=JSON.parse(JSON.stringify(G));s.story.choices=s.story.choices||{};delete s.story.choices.c_rich;delete s.story.choices.c_was;s.progress.seen.mira_teen=true;s.money=3.6e9;var a=!!milestoneConditions(s).c_rich;s.money=3.7e9;var b=!!milestoneConditions(s).c_rich,m=s.money,q=s.emp.q;var ok=[0,1,2].map(i=>{var t=JSON.parse(JSON.stringify(s));var tr0=JSON.stringify(t.tr);return storyChoose(t,'c_rich',i)&&t.money===m&&t.emp.q===q&&JSON.stringify(t.tr)!==tr0;});
     s.day=DREAM_DAYS+5;s.progress.seen.tenyears=true;['queue','wait','soon'].forEach(k=>{s.progress[k]=(s.progress[k]||[]).filter(x=>x!=='tenyears');});var w=!!milestoneConditions(s).c_was;s.progress.queue=['tenyears'];var w2=!!milestoneConditions(s).c_was;return {a,b,ok,w,w2,l:isLetter('c_rich')||isLetter('c_was'),t:[MILESTONES.c_rich.title,MILESTONES.c_was.title,storyChoices(s,'c_was').map(c=>c[0]).join('/')]};});
   M.check('M8f c_rich comes when cash first passes AED 3.67B, after mira_teen',!r.a&&r.b,r);M.check('M8f its three answers cost nothing, change nothing in the company, and move a trait',r.ok.every(x=>x),r.ok);
   M.check('M8f c_was follows the ten-year card once it has closed',r.w&&!r.w2,r);M.check('M8f both are story cards with the drafted lines',!r.l&&r.t[0]==='Mira asks'&&r.t[1]==='Ten years'&&r.t[2]==='Bigger/I don’t know yet/I miss the first tank',r.t);}
 }
 // ---- M9: for scale ----
 if(on('m9')){
  const openHelp=async(sel)=>{await g.js(()=>{var x=$('hs-x');if(x&&!$('helpsheet').hidden)x.click();});await g.page.waitForTimeout(150);await g.js(s=>{var e=document.querySelector(s);e.scrollIntoView({block:'center'});},sel);await g.page.waitForTimeout(700);await g.page.click(sel);await g.page.waitForTimeout(300);return (await g.text('#helpsheet'))||'';};
  await g.load(A('year 12'));
  {const r=await g.js(()=>({ids:Object.keys(OUT_FACTS),ok:Object.keys(OUT_FACTS).every(k=>{var f=OUT_FACTS[k];return f.id===k&&f.text&&f.src&&f.asof&&/^https:/.test(f.url);}),sim:Array.isArray(FACTS)||typeof FACTS==='object',rate:FACT_AED}));
   M.check('M9 one table, every fact has text, a source, a date and a link',r.ok&&r.ids.join()==='rich,bill,oxfam,shrimp,mangrove'&&r.rate===3.6725,r);}
  // money sheet, live
  await g.js(()=>{G.money=5e8;cache={};render();openFin();});await g.page.waitForTimeout(300);
  M.check('M9 Money sheet: nothing under AED 1B',!(/Outside the game/.test(await g.text('#finsheet')||'')));
  await g.js(()=>{G.money=869e9*3.6725*0.009;cache={};render();});await g.page.waitForTimeout(300);
  {const t=await g.text('#fs-out')||'';M.check('M9 Money sheet over AED 1B: the line, the percent computed from cash, source and date',/Outside the game/i.test(t)&&/The richest person on Earth has USD 869B\. You have 0\.9% of that\./.test(t)&&/Forbes \(Elon Musk\), 1 Nov 2026\./.test(t),t);}
  await g.js(()=>{G.money=869e9*3.6725*0.25;cache={};render();});await g.page.waitForTimeout(300);
  M.check('M9 the percent follows the cash',/You have 25% of that/.test(await g.text('#fs-out')||''),await g.text('#fs-out'));
  await g.js(()=>closeFin());
  // the two one-line notes, once each
  {const r=await g.js(()=>{G.opt.facts={};G.notes={list:[],seen:0};/* the list is capped at 30 */G.money=3.6e9;var n0=G.notes.list.length;factNotes();var a=G.notes.list.length-n0;G.money=3.7e9;factNotes();factNotes();var b=G.notes.list.slice(n0).map(x=>x.k+': '+x.t);G.money=32e9;factNotes();factNotes();var c=G.notes.list.slice(n0).map(x=>x.k+': '+x.t);return {a,b,c};});
   M.check('M9 the billion-dollar note comes once, when cash first passes AED 3.67B',r.a===0&&r.b.length===1&&r.b[0]==='fact: You have a billion dollars. Forbes counted 3,428 people who do. (Forbes billionaires list, March 2026)',r);
   M.check('M9 the 1% note comes once, at AED 31.9B',r.c.length===2&&r.c[1]==='fact: You have 1% of what the richest person on Earth has. (Forbes (Elon Musk), 1 Nov 2026)',r.c);}
  // no fact while a card with answers is open
  {const cm=M.find('card c_play',['avg','kind','strong'])||M.find('card mira_teen');if(cm){await g.load(cm,{card:true});await g.js(()=>{G.opt.facts={};G.money=4e9;render();});await g.page.waitForTimeout(400);
    const r=await g.js(()=>({card:!$('milestone-card').hidden,note:!$('noteflash').hidden&&$('noteflash').dataset.k==='fact',txt:/Outside the game|Forbes|Oxfam|Rethink|FAO/.test($('milestone-card').innerText)}));
    M.check('M9 no fact on or over a card with answers',r.card&&!r.note&&!r.txt,r);}}
  // quit eating shrimp ? and the Mangroves ?
  await g.load(A('year 7'));
  {const t=await openHelp('#earthline');M.check('M9 the quit-eating-shrimp ? has the Rethink Priorities line with its range and date',/Outside the game/i.test(t)&&/About 440 billion farmed shrimp are killed for food each year/.test(t)&&/Rethink Priorities \(ranges 300 to 620 billion; 6\.5 to 66 trillion\), 2023\./.test(t),t.slice(-260));
   M.check('M9 the game count and the real count are in different sentences',!/quit eating shrimp[^.]*440 billion|440 billion[^.]*quit eating/.test(t));}
  await g.load(A('year 10'));if(await g.tab('world')!==false){await g.js(()=>{document.querySelectorAll('.card.shut').forEach(c=>c.classList.remove('shut'));render();});
   if(await g.rect('#coin-card')){const hb=await g.js(()=>{var b=document.querySelector('#coin-card .hd .qhelp, #coin-card .hd [data-help], #coin-card .hd button');return b?(b.id||(b.id='v2-coin-q')):null;});
    if(hb){const t=await openHelp('#'+hb);M.check('M9 the Mangroves ? has the FAO line with source and date',/Shrimp ponds caused 31% of the world’s mangrove loss from 2000 to 2010 and 21% from 2010 to 2020\. 677,000 hectares were lost in those twenty years\. 393,000 grew\./.test(t)&&/FAO, The World’s Mangroves 2000 to 2020, July 2023\./.test(t),t.slice(-300));}else M.skip('M9 mangroves','no ? on the card');}else M.skip('M9 mangroves','coast card not shown at year 10');}
  // hard part
  {const hm=M.find('hard poor',['avg','kind','strong'])||M.find('hard goal',['avg']);if(hm){await g.load(hm);
    const r=await g.js(()=>{var out={};HARD.forEach(function(gr){var P=(hardOf(G).g||{})[gr.id]||{};(gr.ops||gr.o||[]).forEach(function(o){var c=hardCost(G,o);var h=hardOptRow(gr,o,P,false);var m=/data-ht="([^"]*)"/.exec(h);var ht=m?m[1]:'';if(c>0&&!out.cost)out.cost={c:c,ht:ht,pct:factPct(c/FACT_AED,OUT_FACTS.bill.usd)};if(gr.id==='poor'&&!out.poor)out.poor=ht;if(!(c>0)&&gr.id!=='poor'&&!out.free)out.free=ht;});});return out;}).catch(e=>({err:String(e)}));
    if(r.err||!r.cost)M.skip('M9 hard part','could not build rows: '+(r.err||'no priced option'));else{
     M.check('M9 hard part: a priced option has the billionaires line, percent computed from its price',r.cost.ht.indexOf('The world’s billionaires hold USD 20.1 trillion between them. This is '+r.cost.pct+' of it.')>=0&&/Forbes billionaires list, March 2026\./.test(r.cost.ht),r.cost);
     M.check('M9 hard part: the Too poor options carry the Oxfam line, attributed',/Oxfam’s estimate to lift 3\.8 billion people above USD 8\.30 a day: USD 1\.65 trillion a year\./.test(r.poor||'')&&/Oxfam, Nov 2025\./.test(r.poor||''),(r.poor||'').slice(-200));
     if(r.free!=null)M.check('M9 hard part: an option with no price and outside Too poor has no fact',!/Outside the game/.test(r.free),r.free.slice(-120));}}else M.skip('M9 hard part','no hard moment');}
 }
 // ---- M6: the game answers back ----
 if(on('m6')){
  // 1. that worked
  await g.load(A('year 2'));
  {const r=await g.js(()=>{var p=G.progress;G.lev={};G.kits.sold=Math.max(G.kits.sold,60);var step=function(n){for(var i=0;i<n*4;i++){while(p.queue.length){var k=p.queue[0],ch=storyChoices(G,k);if(ch)for(var j=0;j<ch.length;j++)if(storyChoose(G,k,j))break;acknowledgeMilestone(G);}stepGame(G);}};
     step(2);var n0=G.log.length,pr=G.kitPrice;G.kitPrice=pr+60;step(9);var a=G.log.filter(x=>/^Price \d+\. Orders [\d.,kM]+ → [\d.,kM]+ a day\.$/.test(x.t)).map(x=>x.t);G.kitPrice=pr;step(9);var b=G.log.filter(x=>/^Price \d+\. Orders/.test(x.t)).length;return {a:a,b:b,pr:pr+60,done:G.lev.price&&G.lev.price.done};});
   M.check('M6.1 seven days after the first price move: one line, Price N. Orders a → b a day.',r.a.length===1&&r.a[0].indexOf('Price '+r.pr+'. ')===0&&r.done===1,r);M.check('M6.1 once per lever: a later move says nothing in Recent events',r.b===1,r);}
  {const r=await g.js(()=>{G.lev={};var s=JSON.parse(JSON.stringify(G));delete s.lev;migrate(s);return !!s.lev&&typeof leverDay==='function'&&Object.keys(LEVERS).join()==='price,breed,dens,qc';});M.check('M6.1 four levers, migrate default',r);}
  // 2. return address
  await g.load(A('year 12'));
  {const r=await g.js(()=>{var s=JSON.parse(JSON.stringify(G));s.money=1e12;s.emp.later=[];delete s.emp.proj.landwet;delete s.emp.proj.landfarm;delete s.emp.proj.landsmall;if(s.emp.no){delete s.emp.no.landwet;}var ok=buyProj(s,'landwet');var it=s.emp.later.filter(x=>/wetland/.test(x.t))[0];if(!it)return {ok:ok};var R=rip(s),n0=R.log.length+((R.pend||[]).length);s.day=it.d+1;laterDay(s);var all=JSON.stringify(R.log.slice(-3))+JSON.stringify(R.pend||[])+JSON.stringify((s.notes||{list:[]}).list.slice(-2));return {ok:ok,sl:it.sl,sd:it.sd,yr:gtDate(it.sd).getUTCFullYear(),hit:all.indexOf('The wetland, the herons move ('+gtDate(it.sd).getUTCFullYear()+'). The birds that used to stop')>=0};});
   M.check('M6.2 a later bill carries the choice and its year',r.ok&&r.sl==='The wetland, the herons move'&&r.hit,r);}
  {const r=await g.js(()=>{var s=JSON.parse(JSON.stringify(G));s.money=1e12;s.emp.later=[];s.emp.staff.pack=5;s.emp.staff.lines=1;if(s.emp.byeDone)delete s.emp.byeDone.pack;var ok=storyChoose(s,'bye_pack',1),it=(s.emp.later||[]).filter(x=>/Kiki/.test(x.t))[0];return {ok:ok,sl:it&&it.sl};});
   M.check('M6.2 a story answer tags its later line, price stripped from the label',r.ok&&r.sl==='Keep her to watch the machines',r);}
  // 3. the million card
  {const mm=M.find('card million',['avg','kind','strong']);if(mm){await g.load(mm,{card:true});await g.page.waitForTimeout(300);
    const r=await g.js(()=>{var M0=G.me,f=G.stats.ownFrom||0,n=M0&&M0.gt?M0.gt.log.filter(x=>x.k==='missed'&&x.d!=null&&x.d>=f).length:0;return {on:!!(M0&&M0.on),n:n,vis:M0?M0.visits|0:0,body:$('milestone-body').innerText};});
    const want=!r.on?null:r.n>0?'You missed '+r.n+' of her days since the farm. Her years has the dates.':r.vis>0?'You have been to see her '+r.vis+' time'+(r.vis===1?'':'s')+'.':null;
    M.check('M6.3 the million card ends with what her timeline counted, and only that',want?r.body.trim().endsWith(want):!/You missed|been to see her/.test(r.body),{want,tail:r.body.slice(-90),r:{n:r.n,vis:r.vis,on:r.on}});
    const off=await g.js(()=>{G.me.on=0;return MILESTONES.million.more(G);});M.check('M6.3 no line before the You page is open',off==='');}else M.skip('M6.3','no card million moment');}
  // 4. one of sixteen and the readout
  {const wm=M.snap('kind','win')||M.snap('strong','win');if(wm){await g.load(wm,{card:true});await g.js(()=>{G.progress.queue=['win'];renderMilestone.last=null;render();});await g.page.waitForTimeout(500);
    const r=await g.js(()=>{var c=$('milestone-card'),one=c.querySelector('.end-one'),rows=[...c.querySelectorAll('.ro-row')],id=endingPick(G),v=traitVals(G),name=c.querySelector('.end-name');
      return {id:id,one:one?one.innerText:null,after:one&&name&&name.nextElementSibling===one,rows:rows.map(x=>x.dataset.tr+':'+x.querySelector('.ro-a').innerText+'/'+x.querySelector('.ro-b').innerText+':'+x.querySelector('.ro-bar b').style.left),v:v,txt:(c.querySelector('.ro')||{}).innerText||'',n:Object.keys(ENDINGS).length};});
    const fam=String(r.id).split('_')[0],pair={empire:'Company first, your own people.',network:'Company first, strangers far away.',garden:'Life first, loves living things.',drift:'Life first, your own people.',question:'Curious.'}[fam];
    M.check('M6.4 under the ending title: One of N endings (N counted from ENDINGS, 18 today), and the pair that picked the family',r.after&&r.one==='One of '+({16:'sixteen',18:'eighteen'}[r.n]||r.n)+' endings. '+pair,r.one);
    M.check('M6.4 How you played: six rows, a word at each end, no numbers',r.rows.length===6&&r.rows.map(x=>x.split(':')[1]).join(' | ')==='company first/life first | by the book/whatever works | curious/growth first | shrimp are loved/shrimp are stock | strangers far away/your own people | careful/bold'&&!/\d/.test(r.txt),r.rows);
    const ok=r.rows.every(x=>{const [k,,l]=x.split(':'),val=Math.max(-1,Math.min(1,r.v[k]||0)),pos=Math.round(((k==='risk'?1:-1)*val+1)/2*100);return l===pos+'%';});
    M.check('M6.4 each dot sits where traitVals puts it',ok,{rows:r.rows,v:r.v});
    await g.page.setViewportSize({width:360,height:844});await g.page.waitForTimeout(300);const o=await g.js(()=>{var c=$('milestone-card').getBoundingClientRect();return [...document.querySelectorAll('.ro-row span')].filter(e=>e.getBoundingClientRect().right>c.right||e.scrollWidth>e.clientWidth+1).length;});M.check('M6.4 the readout fits at 360',o===0,o);await g.page.setViewportSize({width:390,height:844});}else M.skip('M6.4','no win snapshot');}
  // 5. where you were
  await g.load(A('milestone pain_inbox')||A('year 4'));
  {const r=await g.js(()=>({a:resumeDue(Date.now()-11*60000),b:resumeDue(Date.now()-9*60000),c:resumeDue(0)}));M.check('M6.5 only after more than ten minutes away',r.a&&!r.b&&!r.c,r);}
  {await g.js(()=>{if(!G.progress.mail.length)G.progress.mail=['pain_inbox'];speed=1;resumeShow();});await g.page.waitForTimeout(700);
   const t=await g.text('#after')||'',r=await g.js(()=>({day:Math.floor(G.day).toLocaleString('en-US'),homes:homesShown(G).toLocaleString('en-US'),last:G.log.slice(-2).map(x=>x.t.replace(/ · /g,', ').replace(/\s+/g,' ').trim()),mail:G.progress.mail.map(k=>MILESTONES[k].title),sp:speed}));
   M.check('M6.5 the sheet: the day, the homes count, the last two events, the letters, Carry on',/^Where you were/i.test(t)&&t.indexOf('Day '+r.day)>=0&&t.indexOf(r.homes)>=0&&r.last.every(x=>t.indexOf(x)>=0)&&r.mail.every(x=>t.indexOf(x)>=0)&&/Carry on$/.test(t),{t,r});
   M.check('M6.5 play waits under it',r.sp===0);
   await g.page.click('#after-ok');await g.page.waitForTimeout(300);M.check('M6.5 Carry on closes it and the popup is its old self again',await g.js(()=>$('after').hidden&&$('after-ok').textContent==='Go on'&&$('after').querySelector('.scope-label').textContent==='What happened'));}
 }
 // ---- M4: the homes picture ----
 if(on('m4')){
  const first=(t)=>g.js(t=>{var cs=[...document.querySelectorAll('#p-'+t+'>.card')].filter(c=>c.checkVisibility()).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);return cs[0]&&cs[0].id;},t);
  await g.js(()=>{G=newGame();migrate(G);cache={};render();});M.check('M4 fresh game: no Homes card',await g.rect('#c-homes')===null);
  await g.load(A('milestone sale'));await g.tab('market');await g.page.waitForTimeout(200);
  {const r=await g.js(()=>({n:homesShown(G),lit:HOMES.lit,sc:HOMES.scale,cap:$('hm-cap').innerText,h:$('hm-cv').getBoundingClientRect().height}));
   M.check('M4 right after the jar sale: Homes at the top of Trade, 2 lit windows, Your building',await first('market')==='c-homes'&&r.n===2&&r.lit===2&&r.sc===1&&r.cap==='Your building · 2'&&Math.abs(r.h-120)<1,r);}
  {const r=await g.js(()=>{var cv=document.createElement('canvas');cv.width=110;cv.height=40;var c=cv.getContext('2d'),a=[];for(var n=1;n<=16;n++){drawHomes(c,1,n,G.hseed,0);var d=c.getImageData(0,0,110,40).data,red=0;for(var i=0;i<d.length;i+=4)if(d[i]===0xbf&&d[i+1]===0x3a&&d[i+2]===0x2b)red++;a.push(red/20);}
     var o=homesOrder(16,G.hseed,[13,5]);return {a:a,o0:o[0],o1:o[1]};});
   M.check('M4 scale 1: lit windows equal the count, 1 to 16 (each window 4 by 5 px)',r.a.every((x,i)=>x===i+1),r.a);M.check('M4 your window first, the third floor next',r.o0===13&&r.o1===5,r);}
  for(const st of ['kits unlocked','first kit']){await g.load(A(st));await g.tab('emp');await g.page.waitForTimeout(150);const r=await g.js(()=>({n:homesShown(G),lit:HOMES.lit,sc:HOMES.scale,vis:$('c-homes').checkVisibility(),h:$('hm-cv').getBoundingClientRect().height}));
   M.check('M4 '+st+': Homes first on Kits, lit windows equal the count',r.vis&&await first('emp')==='c-homes'&&r.lit===r.n&&Math.abs(r.h-120)<1,r);}
  await g.load(A('first kit'));await g.tab('emp');
  {const r=await g.js(()=>{var out={};G.humans=40;render();out.s2={n:homesShown(G),lit:HOMES.lit,sc:HOMES.scale,cap:$('hm-cap').innerText,h:$('hm-cv').getBoundingClientRect().height,note:G.notes.list[G.notes.list.length-1].t};
     G.humans=3;render();out.back={sc:HOMES.scale,lit:HOMES.lit,n:homesShown(G)};G.humans=5000;render();out.s3={sc:HOMES.scale,lit:HOMES.lit,cap:$('hm-cap').innerText,h:$('hm-cv').getBoundingClientRect().height};G.humans=10;render();out.back2=HOMES.scale;return out;});
   M.check('M4 scale 2 from 17 homes: Your street, lit windows equal the count, one note',r.s2.sc===2&&r.s2.lit===r.s2.n&&r.s2.cap==='Your street · '+r.s2.n+''&&r.s2.note==='The picture is your street now.',r.s2);
   M.check('M4 the scale never goes back',r.back.sc===2&&r.back.lit===r.back.n&&r.back2===3,r);
   M.check('M4 scale 3 from 201 homes: Abu Dhabi, one lit pixel is 100 homes',r.s3.sc===3&&r.s3.lit===50&&/^Abu Dhabi · /.test(r.s3.cap),r.s3);
   M.check('M4 the canvas height is the same at every scale',Math.abs(r.s2.h-120)<1&&Math.abs(r.s3.h-120)<1);}
  {const h0=(await g.rect('#c-homes')).h;await g.page.click('#c-homes .hd h2');await g.page.waitForTimeout(250);M.check('M4 the card collapses',(await g.rect('#c-homes')).h<h0-80);await g.page.click('#c-homes .hd h2');await g.page.waitForTimeout(200);}
  await g.load(A('first farm'));await g.tab('emp');{const a=await g.rect('#c-homes');await g.js(()=>{['dxb','uae'].forEach(r=>{if(!regOpen(G,r))G.emp.regions.push(r);});cache={};render();});M.check('M4 once the UAE region is open the Homes card is gone',!!a&&await g.rect('#c-homes')===null&&await g.js(()=>regOpen(G,'uae')));}
  await g.page.setViewportSize({width:360,height:844});await g.load(A('first kit'));await g.tab('emp');{const o=await g.js(()=>{var c=$('c-homes'),cr=c.getBoundingClientRect();return [...c.querySelectorAll('*')].filter(e=>e.checkVisibility()&&e.getBoundingClientRect().right>cr.right+0.5).length;});M.check('M4 nothing in Homes overflows at 360',o===0,o);}
  await g.page.setViewportSize({width:390,height:844});
 }
 // ---- M5: the map ----
 if(on('m5')){
  const S=M.run('avg').snapshots,names=Object.keys(S),withUae=names.filter(k=>/^year \d+$/.test(k)&&S[k].emp.regions.indexOf('uae')>=0);
  const early=withUae[0],late=withUae[Math.min(withUae.length-1,3)];
  for(const st of [early,late,'year 12']){await g.load(A(st));const r=await g.js(()=>{var v=mapView(G),s=0;Object.keys(v.regs).forEach(k=>{s+=v.regs[k].owners;});var mr=mapRegs(v),s2=0;Object.keys(mr).forEach(k=>{s2+=mr[k].owners;});return {s:s,s2:s2,h:Math.floor(G.humans),n:Object.keys(v.regs).length,open:G.emp.regions.length};});
   M.check('M5 '+st+': owners over the regions add up to the world count',Math.abs(r.s-r.h)<=1&&Math.abs(r.s2-r.h)<=1&&r.n===r.open,r);}
  // the script is async: the list until it mounts
  await g.load(A(late));await g.tab('emp');await g.js(()=>{cache={};render();});
  {const r=await g.js(()=>({rm:!!window.RMAP,cap:$('mp-cap').innerText,vis:$('c-map').checkVisibility(),first:[...document.querySelectorAll('#p-emp>.card')].filter(c=>c.checkVisibility()).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top).slice(0,2).map(c=>c.id),reg:$('c-reg').classList.contains('shut'),homes:$('c-homes').hidden}));
   M.check('M5 before the map script loads the card lists the open regions',!r.rm&&r.vis&&/UAE/.test(r.cap),r);
   M.check('M5 Map is the first card on the company tab, The line second, Homes gone',r.first.join()==='c-map,c-line'&&r.homes,r.first);
   M.check('M5 the Regions rows are folded by default',r.reg);}
  await g.page.addScriptTag({path:require('path').join(__dirname,'..','..','shrimp','region-map.js')});await g.js(()=>{cache={};render();});await g.page.waitForTimeout(700);await g.js(()=>{render();});
  {const r=await g.js(()=>{var t0=RM.tintOf('uae'),h=G.humans;G.humans=h*6;render();var t1=RM.tintOf('uae');G.humans=h;render();return {t0:t0,t1:t1,shown:RM.shown().length,cap:$('mp-cap').innerText,h:$('rmap').getBoundingClientRect().height};});
   M.check('M5 mounted: open regions tinted, redder when a larger share has a tank',r.t0>0&&r.t1>r.t0&&r.shown>0&&r.cap===''&&r.h>100,r);}
  {const r=await g.js(()=>{var out={};(G.fin||[]).slice(-7).forEach(d=>{d._ks=0;});G.kits.stock=0;render();out.badge=[...document.querySelectorAll('#mp-ov .mp-badge')].map(b=>b.innerText);out.crate0=RM.crateOn();G.kits.stock=Math.max(10,kitDemand(G))*8;render();out.badge2=document.querySelectorAll('#mp-ov .mp-badge').length;out.crate1=RM.crateOn();return out;});
   M.check('M5 orders ahead of kits and no stock: a waiting badge',r.badge.length>=1&&r.badge.every(t=>/^[\d.,]+[kMB]? waiting$/.test(t))&&!r.crate0,r);
   M.check('M5 stock over a week of orders: no badge, crates at the farm',r.badge2===0&&r.crate1,r);}
  // tap a region
  {const pt=await g.js(()=>{$('c-map').scrollIntoView({block:'center'});var id=G.emp.regions.map(mapId).filter(x=>x!=='uae').pop()||'uae',q=RM.point(id),r=$('rmap').getBoundingClientRect();var p=q;if(id!=='uae'){for(var dy=0;dy<12&&RM.hit(p[0],p[1])!==id;dy++){p=[q[0]+(dy%2?dy:-dy),q[1]+(dy>5?2:0)];}}return {id:id,hit:RM.hit(p[0],p[1]),x:r.left+p[0]/RMAP.W*r.width,y:r.top+p[1]/RMAP.H*r.height,sy:scrollY};});
   await g.page.waitForTimeout(700);const p2=await g.js(([q])=>{var r=$('rmap').getBoundingClientRect();return {x:r.left+q.px*r.width,y:r.top+q.py*r.height,sy:scrollY};},[{px:0,py:0}]);
   const pos=await g.js(id=>{var q=RM.point(id),p=q;if(id!=='uae'){for(var k=0;k<40&&RM.hit(p[0],p[1])!==id;k++)p=[q[0]+((k%5)-2)*1.5,q[1]+(Math.floor(k/5)-4)*1.5];}var r=$('rmap').getBoundingClientRect();return {x:r.left+p[0]/RMAP.W*r.width,y:r.top+p[1]/RMAP.H*r.height,sy:scrollY,hit:RM.hit(p[0],p[1])};},pt.id);
   await g.page.mouse.click(pos.x,pos.y);await g.page.waitForTimeout(350);
   const r=await g.js(()=>{var i=$('mp-info');return {vis:i.checkVisibility(),t:i.innerText.replace(/\s+/g,' '),top:i.getBoundingClientRect().top,sy:scrollY};});
   M.check('M5 tapping an open region opens its sheet under the tap, the page does not move',pos.hit===pt.id&&r.vis&&/people · [\d.]+% have a tank · [\d.]+% want one · [\d.]+% know you/.test(r.t)&&r.top>=pos.y&&r.top<pos.y+40&&Math.abs(r.sy-pos.sy)<1,{pt,pos,r});
   await g.tapText('#mp-info button',/^Close$/);await g.page.waitForTimeout(250);M.check('M5 Close shuts the sheet',await g.rect('#mp-info')===null);
   const nx=await g.js(()=>{var nr=nextRegion(G);if(!nr)return null;var id=mapId(nr.id),q=RM.point(id),p=q;for(var k=0;k<40&&RM.hit(p[0],p[1])!==id;k++)p=[q[0]+((k%5)-2)*1.5,q[1]+(Math.floor(k/5)-4)*1.5];var r=$('rmap').getBoundingClientRect();return {id:id,name:nr.name,x:r.left+p[0]/RMAP.W*r.width,y:r.top+p[1]/RMAP.H*r.height,hit:RM.hit(p[0],p[1])};});
   if(nx&&nx.hit===nx.id){await g.page.waitForTimeout(650);await g.page.mouse.click(nx.x,nx.y);await g.page.waitForTimeout(350);const t=await g.text('#mp-info')||'',b=await g.js(()=>{var x=document.querySelector('#mp-info button[data-act="region"]');return x?{dis:x.disabled,t:x.innerText}:null;});
    M.check('M5 a closed region shows its people, Not open, and the Open button with its price (grey says why)',t.indexOf(nx.name)===0&&/people\. Not open\./.test(t)&&!!b&&/^Open · /.test(b.t.replace(/\s+/g,' '))&&(!b.dis||/Needs |Crew on the wells/.test(t)),{t,b});await g.tapText('#mp-info button',/^Close$/);await g.page.waitForTimeout(250);}else M.skip('M5 closed region','every region open or its point not found');}
  // a pin for a letter with a place
  {await g.js(()=>{G.progress.queue=[];G.progress.mail=['pain_moss'];G.progress.mailOpen=null;delete G.emp.pains.pain_moss;render();});await g.page.waitForTimeout(700);const pin=await g.rect('#mp-ov .mp-pin');M.check('M5 a letter about a place puts a pin on the map',!!pin,pin);
   if(pin){await g.page.mouse.click(pin.x+pin.w/2,pin.y+pin.h/2);await g.page.waitForTimeout(400);M.check('M5 tapping the pin opens the letter',await g.js(()=>G.progress.queue[0]==='pain_moss'&&G.progress.mailOpen==='pain_moss'&&!$('milestone-card').hidden));await g.js(()=>{mailLater(G);render();});}}
  await g.page.setViewportSize({width:360,height:844});await g.js(()=>{cache={};render();});await g.page.waitForTimeout(300);
  {const o=await g.js(()=>{var c=$('c-map'),cr=c.getBoundingClientRect();return [...c.querySelectorAll('.mp-info *,.mp-cap,.hd *')].filter(e=>e.checkVisibility()&&e.getBoundingClientRect().right>cr.right+0.5).length+(document.documentElement.scrollWidth>innerWidth?1:0);});M.check('M5 nothing in the Map card overflows at 360',o===0,o);}
  await g.page.setViewportSize({width:390,height:844});
 }
 // ---- v2b 1: one word for the count, people ----
 if(on('b1')){
  await g.load(A('first kit'));await g.tab('emp');
  {const r=await g.js(()=>{G.humans=42;cache={};render();return {line:$('homesline').innerText.replace(/\s+/g,' ').trim(),cap:$('hm-cap').innerText,title:$('c-homes').querySelector('.hd h2').innerText,bar:$('topgoal').querySelector('small').innerText,n:homesShown(G)};});
   M.check('v2b 1 the header line says people',r.line===r.n.toLocaleString('en-US')+' of 8,200,000,000 people have a shrimp tank',r.line);
   M.check('v2b 1 the Homes caption has no noun: Your street · N',r.cap==='Your street · '+r.n&&r.title==='Homes',r);
   M.check('v2b 1 the goal bar says people too',/people have a shrimp tank/.test(r.bar),r.bar);}
  M.check('v2b 1 no line in the header or the Homes card says N homes',await g.js(()=>!/\d homes\b/.test($('homesline').innerText+$('c-homes').innerText)));
 }
 await g.close();M.done('v2');})();
