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
                        registration.showNotification('驴妈妈旅游网', {
                            body: '出票成功！',
                            actions: [{
                                action: 'eTicket',
                                title: '查看电子票'
                            }, {
                                action: 'lvmm',
                                title: '打开驴妈妈'
                            }],
                            icon: './images/logo.png',
                            vibrate: [200, 100, 200, 100, 200, 100, 200]
                        });
                    });
                } else {
                    alert(result);
                }
            });
        });
}
