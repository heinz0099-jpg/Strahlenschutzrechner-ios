// Dateiname: sw.js

const CACHE_NAME = 'strahlenschutz-calculator-v1';

// Liste der Dateien, die beim ersten Installieren im Cache gespeichert werden sollen
const urlsToCache = [
  './', // Wichtig: Das Root-Verzeichnis (index.html)
  'index.html', // Oder der Name Ihrer HTML-Datei
  'manifest.webmanifest',
  'icons/icon-192.png',
  // Fügen Sie hier alle weiteren Icons hinzu, die in der Manifest-Datei genannt sind
  'icons/icon-512.png', 
  'icons/icon-maskable.png'
  // Da die CSS-Styles direkt im HTML sind, müssen keine separaten CSS-Dateien hinzugefügt werden.
  // Falls Sie externe Schriftarten oder Skripte nutzen, müssen diese hier auch rein!
];

// 1. Install Event: Dateien in den Cache legen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache geöffnet und Dateien gespeichert.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Fehler beim Caching:', error);
      })
  );
  // Erzwingt die Aktivierung des neuen Service Workers sofort, anstatt auf den nächsten Seitenaufruf zu warten
  self.skipWaiting(); 
});

// 2. Fetch Event: Dateien aus dem Cache liefern (Cache-first-Strategie)
self.addEventListener('fetch', event => {
  // Ignoriert Anfragen, die nicht von der App stammen (z.B. Chrome-Erweiterungen)
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache Hit - Wenn die Datei im Cache ist, gib sie zurück
        if (response) {
          return response;
        }
        
        // Cache Miss - Wenn nicht, hol sie vom Netzwerk
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Service Worker: Fehler beim Fetching:', error);
        // Optional: Hier könnte eine Offline-Seite zurückgegeben werden
      })
  );
});

// 3. Activate Event: Alte Caches aufräumen
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Alten Cache entfernen:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
