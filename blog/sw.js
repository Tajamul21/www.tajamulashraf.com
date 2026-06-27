const CACHE_NAME = 'journey-in-bytes-v13';
const STATIC_ASSETS = [
  './favicon.ico',
  './assets/images/favicon-32.png',
  './assets/images/favicon-192.png',
  './assets/images/favicon-512.png',
  './assets/images/apple-touch-icon.png',
  './assets/images/blog-logo.png',
  './assets/css/theme-1.css',
  './assets/css/custom.css',
  './assets/data/posts.js',
  './assets/js/site-config.js',
  './assets/js/site.js?v=13',
  './assets/plugins/jquery-3.3.1.min.js',
  './assets/plugins/popper.min.js',
  './assets/plugins/bootstrap/js/bootstrap.min.js',
  './assets/images/profile.jpg'
];

const NETWORK_FIRST_PATHS = new Set([
  '/index.html',
  '/blog-list.html',
  '/blog-post.html',
  '/about.html',
  '/assets/css/custom.css',
  '/assets/data/posts.js',
  '/assets/js/site-config.js',
  '/assets/js/site.js'
]);

function normalizedPath(url) {
  const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, '');
  return url.pathname.startsWith(scopePath)
    ? url.pathname.slice(scopePath.length) || '/'
    : url.pathname;
}

function updateCache(request, response) {
  if (!response || !response.ok) return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
  return response;
}

function offlineMiss() {
  return new Response('', { status: 504, statusText: 'Offline' });
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => updateCache(request, response)).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html'))));
    return;
  }

  if (NETWORK_FIRST_PATHS.has(normalizedPath(url))) {
    event.respondWith(fetch(request).then(response => updateCache(request, response)).catch(() => caches.match(request).then(cached => cached || offlineMiss())));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      return updateCache(request, response);
    }))
  );
});
