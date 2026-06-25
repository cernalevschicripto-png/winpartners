// WinPartners Service Worker v2.0
const CACHE_NAME = 'winpartners-v2'

// Install — activează imediat noua versiune
self.addEventListener('install', event => {
  self.skipWaiting()
})

// Activate — șterge TOATE cache-urile vechi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch — pentru navigare (HTML) și JS/CSS: MEREU din rețea (fără cache vechi).
// Doar dacă rețeaua eșuează complet (offline), încearcă cache-ul.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith(self.location.origin)) return

  const url = new URL(event.request.url)
  // HTML, JS, CSS, manifest — network only (cu fallback offline)
  const isAppShell = event.request.mode === 'navigate' ||
                     /\.(js|css|json)$/.test(url.pathname)

  if (isAppShell) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
    return
  }

  // restul (imagini, iconițe) — cache first pentru viteză
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
    )
  )
})
