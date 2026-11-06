// Shrimp, Inc. offline (Pass 238, Puti 3 Nov): once opened online, the game, the land, the ship,
// sounds and icons are kept on the phone, so it plays offline from the Home Screen.
// Pages (html) go network first, so a new BUILD still arrives when online (3 s, then the kept copy).
// Everything else comes from the kept copy at once and is refreshed in the background.
// Query strings (?v=BUILD, ?v=2) are ignored when matching. Bump CACHE only to drop old files.
var CACHE='shrimp-v1';
var FILES=['./','index.html','home.html','space.html','ear.html','taps.js','boardgames.js','manifest.webmanifest','favicon.ico','icon-32.png','icon-180.png','icon-192.png','icon-512.png',
 'music.mp3','water.mp3','catch-shrimp-1.mp3','catch-shrimp-2.mp3',
 'sfx/feed_drop_002.wav','sfx/sell_coins_chime_b.wav','sfx/tap_blip.wav','sfx/tap_felt.wav','sfx/tap_pillow.wav','sfx/tap_pop.wav','sfx/tap_tip.wav','sfx/tap_tok.wav','sfx/water_double.wav'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(FILES.map(function(f){return c.add(new Request(f,{cache:'reload'})).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k.indexOf('shrimp-')===0;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
function keep(req,res){if(res&&res.ok&&(res.type==='basic'||res.type==='cors'||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req.url.split('?')[0]===req.url?req:new Request(req.url.split('?')[0]),cp);});}return res;}
function kept(req){return caches.match(req,{ignoreSearch:true}).then(function(r){return r||(req.mode==='navigate'?caches.match('index.html',{ignoreSearch:true}):null);});}
self.addEventListener('fetch',function(e){var req=e.request;if(req.method!=='GET')return;var u=new URL(req.url);
 var font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(u.origin!==location.origin&&!font)return;
 if(u.origin===location.origin&&u.pathname.indexOf(location.pathname.replace(/sw\.js$/,''))!==0)return;
 if(req.headers.get('range'))return;
 var page=req.mode==='navigate'||/\.html$|\/$/.test(u.pathname);
 if(page){e.respondWith(new Promise(function(ok){var done=false,t=setTimeout(function(){kept(req).then(function(r){if(r&&!done){done=true;ok(r);}});},3000);
   fetch(req).then(function(res){keep(req,res);if(!done){done=true;clearTimeout(t);ok(res);}}).catch(function(){kept(req).then(function(r){if(!done){done=true;clearTimeout(t);ok(r||Response.error());}});});}));return;}
 e.respondWith(kept(req).then(function(r){var net=fetch(req).then(function(res){return keep(req,res);}).catch(function(){return r||Response.error();});return r||net;}));});
