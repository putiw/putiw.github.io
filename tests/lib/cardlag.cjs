// Pass 288: card lag recorder, run inside a bot's vm context (sim only, no browser). Loaded by both bots after the game slice.
// For every milestone it records the day milestoneConditions first returns true and the day the card is acknowledged (the bots
// close a card as soon as it is queued, so ack day = show day), plus storyClock at each ack and introStill at the ack.
// A soon card dropped because its reason went (detectMilestones sets seen back to false) starts its clock again.
// The bot writes CL into its run json as `cardlag`; tests/shrimp-cardlag.cjs reads it.
module.exports=`
var CL={first:{},shown:[],drops:{},never:[]};
(function(){
 var step0=stepGame,ack0=acknowledgeMilestone;
 stepGame=function(G0,k){var r=step0.apply(this,arguments);try{var p=G0.progress||{},seen=p.seen||{},c=milestoneConditions(G0),d=Math.floor(G0.day);
  Object.keys(MILESTONES).forEach(function(k){
   if(CL.first[k]!=null&&!seen[k]&&!(p.queue||[]).concat(p.wait||[],p.soon||[]).includes(k)){CL.drops[k]=(CL.drops[k]||0)+1;CL.first[k]=null;}
   if(c[k]&&CL.first[k]==null&&!CL.shown.some(function(s){return s.k===k;}))CL.first[k]=d;});}catch(e){CL.err=String(e);}return r;};
 acknowledgeMilestone=function(G0){var p=G0.progress||{},k=p.queue&&p.queue[0];
  if(k){var m=MILESTONES[k]||{},react=typeof cardReact==='function'?cardReact(k):SOON_NOW.indexOf(k)>=0||CARD_NOW.indexOf(k)>=0,kind=react?'react':m.chapter?'chapter':storyWaits(k)?'story':'intro';/* Pass 290: react or content (chapter, story, intro) */
   CL.shown.push({k:k,kind:kind,first:CL.first[k]!=null?CL.first[k]:null,day:Math.floor(G0.day),clock:storyClock(G0),still:introStill(G0,k)});CL.first[k]=null;}
  return ack0.apply(this,arguments);};
})();
function cardlagEnd(G0){var p=G0.progress||{};Object.keys(CL.first).forEach(function(k){if(CL.first[k]!=null)CL.never.push({k:k,first:CL.first[k],where:['queue','wait','soon'].filter(function(q){return (p[q]||[]).indexOf(k)>=0;}).join('')||'dropped'});});CL.dropped=(p.dropped||[]).slice();CL.end=Math.floor(G0.day);return CL;}
`;
