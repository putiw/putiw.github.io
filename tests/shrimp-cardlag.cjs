// Pass 288: card lag (Puti's category 2, claude/shrimp-test-workflow-7nov.md 4C.1). Sim only: reads the `cardlag` block the
// bots write (tests/lib/cardlag.cjs). For every card: days from milestoneConditions first true to the card showing, against
// its limit (now = SOON_NOW and CARD_NOW 1 day, intro 7, chapter and story 30); a card shown while introStill says its reason
// is gone; two pausing cards (every card pauses) under 15 s of play apart (storyClock). CARDLAG_RUNS = comma list of run jsons.
// Quiet on pass, the findings on fail. Bots close a card the step it queues, so this measures the game's queue, not a player.
const fs=require('fs'),path=require('path');
const runs=(process.env.CARDLAG_RUNS||'').split(',').filter(Boolean);if(!runs.length){console.error('FAIL set CARDLAG_RUNS');process.exit(1);}
const LIM={now:1,intro:7,chapter:30,story:30},GAP=15000;const bad=[],notes=[];let n=0;
for(const f of runs){const name=path.basename(path.dirname(f));let L;try{L=JSON.parse(fs.readFileSync(f,'utf8')).cardlag;}catch(e){bad.push(name+': no run ('+e.message+')');continue;}
 if(!L){bad.push(name+': run has no cardlag block (bot older than Pass 288)');continue;}if(L.err)bad.push(name+': recorder error '+L.err);
 let prev=null;const late=[],gone=[],close=[];
 for(const s of L.shown){n++;
  if(s.first!=null&&s.day-s.first>LIM[s.kind])late.push(s.k+' ('+s.kind+') '+(s.day-s.first)+' d late, true day '+s.first+', shown '+s.day);
  if(!s.still)gone.push(s.k+' day '+s.day);
  if(prev&&s.clock-prev.clock<GAP)close.push(prev.k+' ('+prev.kind+') then '+s.k+' ('+s.kind+') '+((s.clock-prev.clock)/1000).toFixed(1)+' s apart, day '+s.day);
  prev=s;}
 if(late.length)bad.push(name+': '+late.length+' cards later than their limit\n    '+late.join('\n    '));
 if(gone.length)bad.push(name+': '+gone.length+' cards shown after their reason was gone\n    '+gone.join('\n    '));
 if(close.length)bad.push(name+': '+close.length+' pairs of cards under 15 s of play apart\n    '+close.join('\n    '));
 if(L.never.length)notes.push(name+': true but never shown by day '+L.end+': '+L.never.map(x=>x.k+' (day '+x.first+', '+x.where+')').join(', '));
 if(L.dropped&&L.dropped.length)notes.push(name+': stale stories dropped: '+L.dropped.join(', '));
 const dr=Object.keys(L.drops||{});if(dr.length)notes.push(name+': soon cards dropped and refired: '+dr.map(k=>k+'×'+L.drops[k]).join(', '));}
if(bad.length){console.error('FAIL card lag over '+n+' cards in '+runs.length+' runs:\n  '+bad.join('\n  '));if(notes.length)console.error('notes:\n  '+notes.join('\n  '));process.exit(1);}
console.log('PASS '+n+' cards on time in '+runs.length+' runs'+(notes.length?' (notes: '+notes.length+')':''));
