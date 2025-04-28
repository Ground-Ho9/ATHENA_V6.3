
import { ToastAndroid, Platform } from 'react-native';

export const showToast = (message, type = 'info') => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  } else {
    // Placeholder: implement iOS toast logic or use a UI library
  }
};
