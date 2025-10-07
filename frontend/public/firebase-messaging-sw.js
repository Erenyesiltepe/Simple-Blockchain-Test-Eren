importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCoTxKkOCTGoKdvvULMQT3MJe-6FA7WYXQ',
  authDomain: 'vinutask-b0cc2.firebaseapp.com',
  projectId: 'vinutask-b0cc2',
  storageBucket: 'vinutask-b0cc2.firebasestorage.app',
  messagingSenderId: '881613460367',
  appId: '1:881613460367:web:ce97da78e0fb51d2faf1fa'
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationBody = JSON.parse(payload.notification.body);
  const notificationOptions = {
    body: `Amount: ${notificationBody.amount}, From: ${notificationBody.from}, To: ${notificationBody.to}`,
    icon: '/vite.svg', // You can replace this with your own icon
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});