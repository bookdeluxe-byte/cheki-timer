// Simple offline cache for Cheki Timer PWA - v3 with stale-while-revalidate
const CACHE = 'cheki-timer-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon.svg'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  // stale-while-revalidate: serve cache first, update cache in background
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const fetched = fetch(e.request).then(res=>{
        if(res && res.status===200 && e.request.method==='GET'){
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request, clone));
        }
        return res;
      }).catch(()=> cached || caches.match('./index.html'));
      return cached || fetched;
    })
  );
});
// listen for skipWaiting message from client
self.addEventListener('message', e=>{
  if(e.data==='SKIP_WAITING') self.skipWaiting();
});
