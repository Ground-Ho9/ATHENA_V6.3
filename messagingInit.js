// firebase/messagingInit.js
import messaging from '@react-native-firebase/messaging';

export const initializeFCM = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
  console.log('FCM permission status:', authStatus);
}
    const token = await messaging().getToken();
if (__DEV__) {
}
    return token;
  } else {
if (__DEV__) {
  console.warn('FCM permission denied');
}
    return null;
  }
};