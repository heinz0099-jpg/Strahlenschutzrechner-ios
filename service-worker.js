const CACHE_NAME = 'strahlenschutz-rechner-v1';
const ASSETS_TO_CACHE = [
  '/',                     // Index.html
  '/index.html',
  '/style.css',            // Deine CSS-Datei
  '/app.js',               // Deine JavaScript-Datei
  '/manifest.webmanifest', // Manifest
  '/icons/icon-192.png',   // App Icon
  '/icons/icon-512.png'    // Optional: Größeres Icon
];

// Install Event: Assets cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch Event: Zuerst Cache, dann Netzwerk
self.addEventListener('fetch', event => {
  const { request } = event;

  // Nur GET-Anfragen cachen
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request)
        .then(networkResponse => {
          // Cache aktualisieren (optional für Assets)
          return caches.open(CACHE_NAME).then(cache => {
            // Nur erfolgreiche Antworten cachen
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Offline-Fallback (optional)
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
