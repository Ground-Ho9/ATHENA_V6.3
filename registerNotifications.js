// services/registerNotifications.js
import messaging from '@react-native-firebase/messaging';
import { triggerPing } from './pingService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerNotifications = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
  console.warn('Notification permissions not granted');
}
    return;
  }

  const fcmToken = await messaging().getToken();
if (__DEV__) {
}

  const user = auth().currentUser;
  if (user) {
    try {
      await firestore().collection('users').doc(user.uid).update({ fcmToken });
if (__DEV__) {
  console.log('FCM token synced to Firestore');
}
    } catch (e) {
if (__DEV__) {
  console.error('Error syncing FCM token:', e);
}
    }
  }

  messaging().onMessage(async remoteMessage => {
if (__DEV__) {
  console.log('Foreground message received:', remoteMessage);
}
    if (remoteMessage?.data) {
      const { type, fromUserId, toUserId, payload } = remoteMessage.data;
      triggerPing({ type, fromUserId, toUserId, payload });
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
if (__DEV__) {
  console.log('Background message:', remoteMessage);
}
  });
};