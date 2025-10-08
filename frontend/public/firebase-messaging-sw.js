importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyCoTxKkOCTGoKdvvULMQT3MJe-6FA7WYXQ',
  authDomain: 'vinutask-b0cc2.firebaseapp.com',
  projectId: 'vinutask-b0cc2',
  storageBucket: 'vinutask-b0cc2.firebasestorage.app',
  messagingSenderId: '881613460367',
  appId: '1:881613460367:web:ce97da78e0fb51d2faf1fa'
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages - only show system notification, don't duplicate UI updates
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message (system notification only):', payload);

  const notificationTitle = payload.notification.title;
  const notificationBody = JSON.parse(payload.notification.body);
  const notificationOptions = {
    body: `Amount: ${notificationBody.amount} USDT, From: ${notificationBody.from}, To: ${notificationBody.to}`,
    icon: '/vite.svg',
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});