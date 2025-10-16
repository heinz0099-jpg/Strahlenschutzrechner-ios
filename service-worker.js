const CACHE_NAME = 'strahlenschutz-rechner-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install & Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate & Clean Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch: Cache First, then Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request)
        .then(response => {
          // Cache new files dynamically
          return caches.open(CACHE_NAME).then(cache => {
            if(event.request.method === 'GET') cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Optional: Offline Fallback Page
          if(event.request.destination === 'document') return caches.match('/index.html');
        });
    })
  );
});
