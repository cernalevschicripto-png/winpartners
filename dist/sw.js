// WinPartners Service Worker v4.0
const CACHE_NAME = 'winpartners-v4'

// Install — activează imediat noua versiune, fără să aștepte
self.addEventListener('install', event => {
  self.skipWaiting()
})

// Permite paginii să forțeze activarea unui SW blocat în "waiting"
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})

// Activate — șterge TOATE cache-urile vechi și preia controlul imediat
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// Fetch — HTML/JS/CSS/JSON: MEREU din rețea (niciodată cache vechi).
// Doar offline complet → fallback la cache. Imagini → cache-first pentru viteză.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith(self.location.origin)) return

  const url = new URL(event.request.url)
  const isAppShell = event.request.mode === 'navigate' ||
                     /\.(js|css|json)$/.test(url.pathname)

  if (isAppShell) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
    return
  }

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
