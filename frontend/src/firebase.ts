import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCoTxKkOCTGoKdvvULMQT3MJe-6FA7WYXQ",
  authDomain: "vinutask-b0cc2.firebaseapp.com",
  projectId: "vinutask-b0cc2",
  storageBucket: "vinutask-b0cc2.firebasestorage.app",
  messagingSenderId: "881613460367",
  appId: "1:881613460367:web:ce97da78e0fb51d2faf1fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    // Check current permission state
    const currentPermission = Notification.permission;
    console.log('Current permission state:', currentPermission);

    // If already denied, we need to inform user to change browser settings
    if (currentPermission === 'denied') {
      throw new Error('Notifications blocked. Please enable them in your browser settings.');
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);

    if (permission === 'granted') {
      try {
        const token = await getToken(messaging, {
          vapidKey: "BNRUwl0vLsFSc-wvCGoojEcN2hCzA5fHpQDa1yoH9poxZkDE4TMGntyLPHJXWrlo7W-GPu2qFyo_Gx40Py-CYMc"
        });
        
        if (!token) {
          throw new Error('No registration token available');
        }

        console.log('FCM Token:', token);

        //Register token with backend
        const response = await fetch('http://localhost:8000/register-device', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to register token with backend');
        }
        
        return token;
      } catch (tokenError) {
        console.error('Error getting FCM token:', tokenError);
        throw tokenError;
      }
    }
    throw new Error(`Notification permission ${permission}`);
  } catch (error) {
    console.error('Permission request error:', error);
    throw error;
  }
};