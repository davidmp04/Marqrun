const CACHE_NAME = 'marqun-chat-v1';
const URLS_TO_CACHE = [
  '/frontend/loginchat.html',
  '/frontend/chat.html',
  '/frontend/index.html',
  '/frontend/manifest.json',
  'https://cdn.socket.io/4.7.2/socket.io.min.js'
];

// Instalar service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cachés abierto');
        return cache.addAll(URLS_TO_CACHE).catch(err => {
          console.log('[SW] Error cacheando URLs:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activar service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Si es API del servidor, usar red primero
  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/grupos') || 
      url.pathname.startsWith('/socket.io')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cachear respuestas exitosas
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si no hay conexión, usar cache
          return caches.match(request).then(response => {
            return response || new Response('Sin conexión', { status: 503 });
          });
        })
    );
  } else {
    // Para assets, usar cache primero
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
        .catch(() => new Response('Recurso no disponible', { status: 404 }))
    );
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nuevo mensaje',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23667eea" width="192" height="192"/><text x="50%" y="50%" font-size="120" text-anchor="middle" dy=".3em" fill="white">💬</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23667eea" width="192" height="192"/><text x="50%" y="50%" font-size="120" text-anchor="middle" dy=".3em" fill="white">💬</text></svg>',
    vibrate: [200, 100, 200],
    tag: 'marqun-message',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('💬 MARQRun Chat', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/frontend/chat.html' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/frontend/chat.html');
      }
    })
  );
});
