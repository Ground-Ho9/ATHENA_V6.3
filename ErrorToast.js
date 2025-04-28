// components/ErrorToast.js
import { ToastAndroid, Platform, Alert } from 'react-native';

export const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
if (__DEV__) { Alert.alert('Error', message); }
  }
};