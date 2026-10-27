// layout scan: anything wider than its card (or the screen) at 360 and 390 px, on every tab, at several stages
const {chromium}=require('playwright');const fs=require('fs');
const snaps=JSON.parse(fs.readFileSync('/tmp/shrimp-tests/run-7.json','utf8')).snapshots;
const html=fs.readFileSync(__dirname+'/../shrimp/index.html','utf8');
(async()=>{const b=await chromium.launch();const found={};
 const stages=[null].concat(Object.keys(snaps));
 for(const w of [320,360,390]){
  for(const sk of stages){
   const p=await b.newPage({viewport:{width:w,height:800}});p.on('dialog',d=>d.dismiss());
   await p.setContent('<body>'+html+'</body>');await p.waitForTimeout(300);
   if(sk)await p.evaluate(s=>{G=s;migrate(G);G.progress.queue=[];window.spotlight=function(){};G.opt.all=true;if(G.me)G.me.on=true;render();},snaps[sk]);
   const tabs=sk?await p.evaluate(()=>[...document.querySelectorAll('.tabs [data-tab]')].filter(t=>!t.hidden).map(t=>t.dataset.tab).concat(['me'])):['intro'];
   for(const tab of tabs){
    if(sk)await p.evaluate(t=>{try{if(t==='me')selectTab('me');else document.querySelector('.tabs [data-tab="'+t+'"]').click();}catch(e){}document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelectorAll('.coll').forEach(c=>c.classList.remove('folded','closed'));render();},tab);
    await p.waitForTimeout(120);
    const bad=await p.evaluate(()=>{var out=[],W=innerWidth;
     document.querySelectorAll('body *').forEach(function(el){if(!el.getClientRects().length)return;var cs=getComputedStyle(el);if(cs.position==='fixed'&&el.id!=='milestone')return;
      var r=el.getBoundingClientRect();if(r.width<2||r.height<2)return;
      var box=el.parentElement;while(box&&box!==document.body){var bs=getComputedStyle(box);if(/auto|scroll|hidden/.test(bs.overflowX))break;if(box.classList.contains('card')||box.id==='milestone'||box.classList.contains('item'))break;box=box.parentElement;}
      var limR=W,limL=0;if(box&&box!==document.body){var br=box.getBoundingClientRect(),bs2=getComputedStyle(box);if(/auto|scroll/.test(bs2.overflowX))return;limR=br.right-parseFloat(bs2.borderRightWidth);limL=br.left+parseFloat(bs2.borderLeftWidth);}
      var over=Math.max(r.right-limR,limL-r.left);if(over>1.5){var id=(el.id?'#'+el.id:'')+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).join('.'):'');
       out.push(el.tagName.toLowerCase()+id+' "'+(el.innerText||el.value||el.placeholder||'').trim().slice(0,30).replace(/\n/g,' ')+'" +'+Math.round(over)+'px in '+(box&&box.id?'#'+box.id:box&&box.className?String(box.className).split(' ')[0]:'screen'));}});
     return out;});
    bad.forEach(x=>{var k=x.replace(/\+\d+px/,'');if(!found[k])found[k]={x,where:[]};if(found[k].where.length<3)found[k].where.push(w+' '+(sk||'start')+' '+tab);});
   }
   await p.close();}}
 const list=Object.values(found);console.log(list.length+' things overflow');list.slice(0,60).forEach(f=>console.log(f.x+'  ['+f.where.join('; ')+']'));await b.close();})();
