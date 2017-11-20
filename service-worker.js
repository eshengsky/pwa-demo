const cacheName = 'lvmama_7.10.8';
const filesToCache = [
    '/',
    '/index.html',
    '/scripts/demo.js',
    '/styles/demo.css'
];

self.addEventListener('install', e => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', e => {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys()
            .then(keyList => Promise.all(keyList.map(key => {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            })))
    );

    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request)
            .then(response => response || fetch(e.request))
    );
});
