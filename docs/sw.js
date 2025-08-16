// Лек service worker: кешира ядро + „stale-while-revalidate“ за тайловете
const CORE = 'bgx-core-v1';
const CORE_ASSETS = [
  './', './bgx.html', './sw.js', './manifest.webmanifest'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CORE).then(c=>c.addAll(CORE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CORE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  const isTile = /tile.openstreetmap.org|openstreetmap\.fr/.test(url.host);
  if(isTile){
    // stale-while-revalidate
    e.respondWith(
      caches.open('bgx-tiles').then(cache=>cache.match(e.request).then(cached=>{
        const fetchPromise = fetch(e.request).then(netRes=>{ cache.put(e.request, netRes.clone()); return netRes; });
        return cached || fetchPromise;
      }))
    );
    return;
  }
  // cache-first за нашите файлове
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request).then(net=> {
      if(net.ok && e.request.method==='GET' && (url.origin===location.origin)) {
        caches.open(CORE).then(c=>c.put(e.request, net.clone()));
      }
      return net;
    }).catch(()=> caches.match('./bgx.html')))
  );
});
