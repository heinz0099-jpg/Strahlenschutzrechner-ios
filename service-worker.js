const CACHE_NAME = "strahlenschutz-cache-v1";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // sofort aktivieren
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim(); // sofort wirksam
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
