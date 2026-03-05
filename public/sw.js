// ─── Service Worker ───────────────────────────────────────────────────────────
const CACHE_VERSION = 'v2';
const CACHE_NAME = `al-tariq-ila-al-janna-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/mosque-svgrepo-com.svg',
  '/img/photo.jpg',
  '/img/noshaf.png',
  '/img/baba.jpg',
  '/img/bro.jpg',
  '/img/hema.jpg',
  '/img/mosta.jpg',
  '/img/mostafa.jpg',
  '/img/abdoo.jpg',
  '/img/Sedeq.jpg',
  '/img/hosery.jpg',
  '/img/bana.jpg',
  '/img/agmy1.jpg',
  '/img/sodes.jpg',
  '/img/moeqlyi.jpeg',
  '/img/unnamed.png',
  '/img/mshary.jpg',
];

// ── Install: pre-cache static assets ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] Failed to cache:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: smart caching strategy ───────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // API calls (Vercel backend): Network-first, cache fallback
  if (url.hostname.includes('vercel.app')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            if (request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
            return new Response('{}', {
              headers: { 'Content-Type': 'application/json' },
              status: 503,
            });
          })
        )
    );
    return;
  }

  // Google Drive (PDFs): Network-only
  if (url.hostname.includes('drive.google.com')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response('Unavailable offline', { status: 503 })
      )
    );
    return;
  }

  // Audio files: Network-first, cache for offline playback
  if (request.url.match(/\.(mp3|m4a|ogg|wav)(\?|$)/i)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: Cache-first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// ── Messages ──────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});