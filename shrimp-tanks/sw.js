const CACHE_NAME = "cherry-tanks-phaser-01a25162b5340213";
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./manifest.json",
  "./app-icon.svg",
  "./assets/icon/shrimp-logo.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/shop.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/sell.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/food.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/fishtank.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/catch-bucket.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/menu.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/wallet.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/wallet-short.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/wallet-short-mark.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/sell-shrimp.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/new-tank.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/wallet-label.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/DNA.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/grade.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/grade_dark.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/notebook.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/notebook-mark.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/notebook-coin.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-0.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-1.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-2.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-3.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-4.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-5.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-6.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-7.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-8.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/digits/number-9.png?v=v78-notebook-dna-assets-r1",
  "./assets/icon/settings.png?v=v75-settings-icon-r1",
  "./assets/shrimp/leg-swim-2.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/leg-default.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/leg-eat-2.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/leg-eat-3.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/body-female-color.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/body-female-color-highlight.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/body-female-outline.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/eye-highlight.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/tail-default.png?v=v78-notebook-dna-assets-r1",
  "./assets/shrimp/tail-swim-2.png?v=v78-notebook-dna-assets-r1",
  "./assets/tank/water.webp?v=v78-notebook-dna-assets-r1",
  "./assets/tank/sand.webp?v=v78-notebook-dna-assets-r1",
  "./assets/tank/generated/hardscape-masks.7019ba9cd00449c2.bin",
  "./assets/tank/generated/rock1.790fa6d3b8c94d4e.png",
  "./assets/tank/generated/rock2.fb8a1c2b609b0e7d.png",
  "./assets/tank/generated/rock3.1079b54d7aaba352.png",
  "./assets/tank/generated/rock4.0f61387d8fe0c44f.png",
  "./assets/tank/generated/rock5.064b3abdb63d434f.png",
  "./assets/tank/generated/rock6.b40fea91811b44c8.png",
  "./assets/tank/generated/rock7.037dd26084fc5efb.png",
  "./assets/tank/generated/rock8.1445c7815b4b9b7e.png",
  "./assets/tank/generated/wood.2d216e3de2c4e278.png",
  "./assets/tank/generated/wood2.96318926592ba9a9.png",
  "./assets/tank/generated/bamboo.77d16eaacfdf4a51.png",
  "./assets/tank/generated/bamboo2.c847ac669f28dc7f.png",
  "./assets/tank/generated/bamboo3.1cdbb7b670deea0f.png",
  "./assets/tank/generated/plant-grass.5d047c52bcffda53.png",
  "./assets/tank/generated/plant-anubias.47fbf93a7cabccd6.png",
  "./assets/tank/generated/plant-amazonsword.fc7a78dc6df1c390.png",
  "./assets/tank/generated/plant-mossball.ac14db25364852cb.png",
  "./assets/tank/generated/plant-cabomba.53ccd03315ba56c3.png",
  "./assets/tank/generated/plant-tigerlotus.9afddb034f3d0d94.png",
  "./assets/tank/generated/ship.5a59c2af1fd2a2bf.png",
  "./assets/tank/generated/elephant.905940fc86b79e6b.png",
  "./assets/tank/generated/panthon.6d8f7c1f06355a24.png",
  "./assets/tank/generated/lion.2c5879d67f607c5c.png",
  "./assets/tank/generated/head1.68698078617fd7b6.png",
  "./assets/tank/generated/head2.efc9dc7af65eee2f.png",
  "./assets/tank/generated/magic-mushroom.d7ce8349607543c8.png",
  "./assets/TankScene-Bfd9L7J7.js",
  "./assets/depthFigure8Lab-DTIJShp-.js",
  "./assets/lifespanRenderLab-CrmCEB0e.js",
  "./assets/main-BIUBHK0I.js",
  "./assets/main-DpfbixuU.css",
  "./assets/matingDanceLab-Cd0q-H58.js",
  "./assets/modulepreload-polyfill-B5Qt9EMX.js",
  "./assets/movementLab-DAkBji6H.js",
  "./assets/phaser-BFjO2D3v.js",
  "./assets/phaser-DFK5Ua9d.js"
];

const cacheShellAsset = async (cache, url) => {
  if (url.startsWith("./assets/")) {
    const reusable = await caches.match(url);
    if (reusable?.ok) {
      await cache.put(url, reusable.clone());
      return;
    }
  }
  const immutableGeneratedAsset = url.startsWith("./assets/tank/generated/");
  const response = await fetch(url, { cache: immutableGeneratedAsset ? "force-cache" : "reload" });
  if (!response.ok) throw new Error(`Failed to cache ${url}: ${response.status}`);
  await cache.put(url, response);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.all(
      APP_SHELL.map((url) => cacheShellAsset(cache, url))
    ))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.protocol.startsWith("http")) return;
  const acceptsHtml = event.request.headers.get("accept")?.includes("text/html") ?? false;
  if (event.request.mode === "navigate" || acceptsHtml) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => (
      cached || fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
    ))
  );
});
