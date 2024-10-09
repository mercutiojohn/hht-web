const CACHE_NAME = 'offline-cache-v2.0.8';
const urlsToCache = [
  '/',
  '/index.html',
  '/ico.png',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  const cacheWhitelist = [CACHE_NAME]; // 只保留当前的缓存
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // 删除过时的缓存
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  const requestUrl = new URL(event.request.url);
  if (/\.(html|css|js|png|jpg|jpeg|gif|svg)$/.test(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});