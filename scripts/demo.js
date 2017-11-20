// 注册ServiceWorker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(() => { console.log('Service Worker Registered'); });

    document.querySelector('#sendMsg')
        .addEventListener('click', () => {
            Notification.requestPermission(result => {
                if (result === 'granted') {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification('Vibration Sample', {
                            body: 'Buzz! Buzz!',
                            icon: '../images/touch/chrome-touch-icon-192x192.png',
                            vibrate: [200, 100, 200, 100, 200, 100, 200],
                            tag: 'vibration-sample'
                        });
                    });
                } else {
                    alert(result);
                }
            });
        });
}
