const cacheName = 'lvmama_7.10.8';
const filesToCache = [
    './index.html',
    './scripts/demo.js',
    './styles/demo.css'
];

// 安装
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

// 激活
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

// 捕获请求
self.addEventListener('fetch', e => {
    console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request)
            .then(response => response || fetch(e.request))
    );
});

// 点击通知事件
self.addEventListener('notificationclick', e => {
    console.log('[Service Worker] Notification click Received.');
    e.notification.close();
    if (e.action === 'eTicket') {
        e.waitUntil(
            clients.openWindow('./index.html?action=eTicket')
        );
    } else if (e.action === 'lvmm') {
        e.waitUntil(
            clients.openWindow('./index.html?action=lvmm')
        );
    } else {
        e.waitUntil(
            clients.openWindow('./index.html')
        );
    }
});
