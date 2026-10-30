// Bots answer every card the way a player has to (Puti, 30 Oct): a card with choices is never closed without a pick.
// Specific picks first (the old per-card policy), then kind bots try the choices first to last, cold bots last to first,
// never a choice that ends the game. A card where no choice can be taken would stall a real player: it prints STUCK.
module.exports=function(kind){return 'var BOTKIND='+(!!kind)+',BOT_STUCK={};var _ack=acknowledgeMilestone;acknowledgeMilestone=function(G){var k=G.progress.queue[0],m=k&&MILESTONES[k],ch=k&&storyChoices(G,k);'+
'if(ch&&ch.length){var pref=[];if(m.dyn)pref=BOTKIND?[1,0]:[0];else if(k==="owntank")pref=[0];else if(k==="coin_offer")pref=[BOTKIND?0:1];else if(/^pain_/.test(k))pref=[BOTKIND?0:2,2];else if(k==="gp_land")pref=[BOTKIND?0:1];else if(k==="gp_scam")pref=BOTKIND?[0,1]:[1];'+
'var all=ch.map(function(c,i){return i;});if(!BOTKIND)all.reverse();pref=pref.concat(all);var done=false;'+
'for(var j=0;j<pref.length&&!done;j++){var i=pref[j];if(!ch[i]||/game ends here/i.test(ch[i][0]))continue;done=!!storyChoose(G,k,i);}'+
'if(!done&&!BOT_STUCK[k]){BOT_STUCK[k]=1;console.log("STUCK no choice could be taken on card "+k+" day "+Math.floor(G.day));}}return _ack(G);};';};
