// Bots answer every card the way a player has to (Puti, 30 Oct): a card with choices is never closed without a pick.
// Specific picks first (the old per-card policy), then kind bots try the choices first to last, cold bots last to first,
// never a choice that ends the game. A card where no choice can be taken would stall a real player: it prints STUCK.
// PROFILE=<id> (shrimp-profiles-def.cjs): cards and forks are picked by that profile's weights on what each side pushes,
// so the bots' endings can be compared per profile. It sets choices only, the bots' own play stays as it is.
const PROF=process.env.PROFILE?require('./shrimp-profiles-def.cjs').find(p=>p.id===process.env.PROFILE):null;
if(process.env.PROFILE&&!PROF)throw Error('No profile '+process.env.PROFILE);
module.exports=function(kind){return 'var BOTPROF='+JSON.stringify(PROF&&PROF.w!=='random'?PROF.w:null)+';function profSc(o){var v=0;if(BOTPROF)for(var k in o)v+=(BOTPROF[k]||0)*o[k];return v;}function profFork(p){return profSc(Object.assign({},TRAIT_TAGS[p.id]||{},{means:((TRAIT_TAGS[p.id]||{}).means||0)+(p.h||0)*HEART_TR}));}'+
'function profPick(G,k,ch){var js=JSON.stringify(G),sc=ch.map(function(c,i){if(/game ends here/i.test(c[0]))return -1e9;try{var g=JSON.parse(js);g.tr={};g.trAbs={};if(!storyChoose(g,k,i))return -1e9;return profSc(g.tr);}catch(e){return -1e9;}});return sc.map(function(v,i){return [v,i];}).sort(function(a,b){return b[0]-a[0];}).map(function(x){return x[1];});}'+
'var BOTKIND='+(!!kind)+',BOT_STUCK={};var _ack=acknowledgeMilestone;acknowledgeMilestone=function(G){var k=G.progress.queue[0],m=k&&MILESTONES[k],ch=k&&storyChoices(G,k);'+
'if(ch&&ch.length){var pref=[];if(m.dyn)pref=BOTKIND?[1,0]:[0];else if(k==="owntank")pref=[0];else if(k==="coin_offer")pref=[BOTKIND?0:1];else if(/^pain_/.test(k))pref=[BOTKIND?0:2,2];else if(k==="gp_land")pref=[BOTKIND?0:1];else if(k==="gp_scam")pref=BOTKIND?[0,1]:[1];'+
'var all=ch.map(function(c,i){return i;});if(!BOTKIND)all.reverse();if(BOTPROF){pref=profPick(G,k,ch);}pref=pref.concat(all);var done=false;'+
'for(var j=0;j<pref.length&&!done;j++){var i=pref[j];if(!ch[i]||/game ends here/i.test(ch[i][0]))continue;done=!!storyChoose(G,k,i);}'+
'if(!done&&!BOT_STUCK[k]){BOT_STUCK[k]=1;console.log("STUCK no choice could be taken on card "+k+" day "+Math.floor(G.day));}}return _ack(G);};';};
