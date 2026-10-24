// Rebuilds shrimp/ending-playtest-data.js from the game itself, so the preview never drifts from the real text.
// Run after changing forks, late-game cards or endings: node tests/build-ending-playtest.cjs
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../shrimp/index.html'),'utf8');
const c=vm.createContext({console,Math});vm.runInContext(html.split('// ==SIM-START==')[1].split('// ==SIM-END==')[0],c);
const get=k=>vm.runInContext(k,c);
const PROJ=get('PROJ'),FORK_Q=get('FORK_Q'),TT=get('TRAIT_TAGS'),CARDS3=get('CARDS3'),TRAITS=get('TRAITS');
const i=html.indexOf('var ENDINGS=');const ENDINGS=JSON.parse(html.slice(i+12,html.indexOf('\n',i)).replace(/;\s*$/,''));
const forks=Object.keys(FORK_Q).map(fk=>({id:fk,question:FORK_Q[fk],options:PROJ.filter(p=>p.c==='fork'&&p.fk===fk).map(p=>{const o={id:p.id,label:p.name,description:p.d,traits:TT[p.id]||{},heart:p.h||0};if(p.end)o.endingLine=p.end;return o;})}));
const cards=Object.keys(CARDS3).map(k=>({id:k,title:CARDS3[k].title,body:CARDS3[k].body,options:CARDS3[k].ch.map(x=>{const o={label:x[0],description:x[1],traits:x[2]||{}};if(x[4])o.endingLine=x[4];return o;})}));
const traits=Array.isArray(TRAITS)?TRAITS.map(t=>t.id||t):Object.keys(TRAITS);
const out='window.ENDING_TEST_DATA = '+JSON.stringify({traits,forks,cards,endingTypes:ENDINGS},null,2)+';\n';
fs.writeFileSync(path.join(__dirname,'../shrimp/ending-playtest-data.js'),out);console.log('wrote',forks.length,'forks',cards.length,'cards',Object.keys(ENDINGS).length,'endings');
