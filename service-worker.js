self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('static-v1').then(function (cache) {
      return cache.addAll([
        './',
        './index.html',
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  const requestUrl = new URL(event.request.url);
  if (/\.(html|css|js)$/.test(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});
