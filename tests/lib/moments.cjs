// Pass 289: MOMENTS, snapshots named by the event, run inside a bot's vm context after the game slice and before cardlag.
// The bot writes MOM into its run json as `moments`: { name: {kind, day, tab, id, snap} }, first time only per name.
//   card <key>        a milestone card is up (taken before the bot closes it, so the save opens with the card on screen)
//   fork <fk>         a fork question is first offered (projAvail has one of its options)
//   campaign <id>     a desk offer was run (campaign, gala g_<cause> or ad push p_<id>), snapshot just after
//   film              the first film started
//   land open         Grandma's land was bought (a side branch, branch:1, when the bot has the cash: bots never buy it)
//   hard open         the hard part opened; hard goal: the first goal set
//   hard <group>      a hard-part group gets its first letter (a proposal for it is open)
//   hard option <id>  a hard-part option whose req was false turns true after the hard part opened
//   game draft / game checkpoint   a side branch (branch:1): from the day the You page opens (me_intro closed), a copy picks Video games, starts
//                     a game and runs until the 100-day decision is up. Its own random numbers, so the bot's run is unchanged.
// tab is where the thing is (tests map it with tabMap in the page); null for cards (the card covers the page).
module.exports=`
var MOM={},MOM_DAY=-1,MOM_HOPS={},MOM_LET={};
var momStep0=stepGame,momAck0=acknowledgeMilestone,momDesk0=deskRun;
function momTake(G0,name,info){if(MOM[name])return;var o={day:Math.floor(G0.day)};for(var k in info)o[k]=info[k];o.snap=JSON.parse(JSON.stringify(G0));MOM[name]=o;}
function momRng(s){return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function momGames(G0){/* the side branch: never touches G0 or the bot's random numbers */
 var mr=Math.random;Math.random=momRng(4242);try{var g2=JSON.parse(JSON.stringify(G0));
  if(!setPick(g2,'games'))return;g2.progress.queue=[];momTake(g2,'game draft',{kind:'game',tab:'me',branch:1});
  if(!gameStart(g2))return;for(var d=0;d<400&&!(gmOf(g2).cur&&gmOf(g2).cur.w);d++){for(var q=0;q<4;q++){while(g2.progress.queue.length)momAck0(g2);momStep0(g2);}}
  if(gmOf(g2).cur&&gmOf(g2).cur.w){g2.progress.queue=[];momTake(g2,'game checkpoint',{kind:'game',tab:'me',branch:1});}
 }catch(e){MOM_ERR=String(e);}finally{Math.random=mr;}}
function momLand(G0){/* bots never buy Grandma's places: a copy buys the flat and the house, answers the land card No (on sale now) and buys the land */
 var mr=Math.random;Math.random=momRng(4343);try{var g2=JSON.parse(JSON.stringify(G0));for(var i=0;i<2&&gplaceNext(g2)&&gplaceNext(g2).id!=='land';i++)buyGplace(g2);
  if(!landReady(g2))gpLand(g2,false);if(buyGplace(g2)&&landOpen(g2)){g2.progress.queue=[];momTake(g2,'land open',{kind:'land',tab:'tank',branch:1});}
 }catch(e){MOM_ERR=String(e);}finally{Math.random=mr;}}
var MOM_ERR=null;
function momDaily(G0){var d=Math.floor(G0.day);if(d===MOM_DAY)return;MOM_DAY=d;
 try{
  projAvail(G0).forEach(function(p){if(p.fk&&!MOM['fork '+p.fk])momTake(G0,'fork '+p.fk,{kind:'fork',id:p.fk,tab:projectArea(p),media:p.t==='media'?1:0});});
  if(landOpen(G0))momTake(G0,'land open',{kind:'land',tab:'tank'});
  else if(G0.me&&G0.me.on&&!MOM['land open']&&!MOM.landTried&&G0.money>3e5+capitalReserve(G0)){MOM.landTried=1;momLand(G0);}
  if(G0.me&&G0.me.on&&G0.progress.seen&&G0.progress.seen.me_intro&&!['queue','soon','wait'].some(function(q){return (G0.progress[q]||[]).indexOf('me_intro')>=0;})&&!MOM['game draft']&&!MOM.gameTried){MOM.gameTried=1;momGames(G0);}
  if(G0.emp.movie&&G0.emp.movie.left>0)momTake(G0,'film',{kind:'film',tab:'promote'});
  if(hardOpen(G0)){var H=hardOf(G0);momTake(G0,'hard open',{kind:'hard',tab:'hard'});if(H.goal)momTake(G0,'hard goal',{kind:'hard',tab:'hard'});
   (propOf(H).open||[]).forEach(function(o){var id=typeof o==='string'?o:(o&&(o.id||o.p)),pr=PROPS.filter(function(x){return x.id===id;})[0];if(pr&&pr.g&&!MOM_LET[pr.g]){MOM_LET[pr.g]=1;momTake(G0,'hard '+pr.g,{kind:'hard',id:pr.g,prop:id,tab:'hard'});}});
   HARD.forEach(function(g){g.ops.forEach(function(o){if(o.old||!o.req)return;var ok=false;try{ok=!!o.req(G0);}catch(e){}var k=g.id+'.'+o.id;if(MOM_HOPS[k]==null){MOM_HOPS[k]=ok;return;}if(ok&&!MOM_HOPS[k]){MOM_HOPS[k]=true;momTake(G0,'hard option '+o.id,{kind:'hard',id:o.id,group:g.id,tab:'hard'});}});});}
 }catch(e){MOM_ERR=String(e);}}
stepGame=function(G0){var r=momStep0.apply(this,arguments);if(G0===G)momDaily(G0);return r;};
acknowledgeMilestone=function(G0){var p=G0.progress||{},k=p.queue&&p.queue[0];if(k&&G0===G)momTake(G0,'card '+k,{kind:'card',id:k,tab:null});return momAck0.apply(this,arguments);};
deskRun=runCampaign=function(G0,id){var r=momDesk0.apply(this,arguments);if(r&&G0===G)momTake(G0,'campaign '+id,{kind:'campaign',id:id,tab:'promote'});return r;};
function momentsEnd(){var o={};for(var k in MOM)if(k!=='gameTried'&&k!=='landTried')o[k]=MOM[k];if(MOM_ERR)o._err=MOM_ERR;return o;}
`;
