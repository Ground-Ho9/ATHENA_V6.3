// services/errorLogService.js
import firestore from '@react-native-firebase/firestore';
import { getBreadcrumbs } from '../utils/breadcrumbs';

let sessionId = null;

export const getSessionId = () => {
  if (!sessionId) {
    sessionId = Date.now().toString() + '-' + Math.floor(Math.random() * 10000).toString();
  }
  return sessionId;
};

export const logErrorToFirebase = async (error, context = 'Unknown', userId = null) => {
  try {
    const timestamp = new Date().toISOString();
    const breadcrumbs = getBreadcrumbs();

    await firestore().collection('errorLogs').add({
      message: error?.message || 'Unknown error',
      stack: error?.stack || null,
      context,
      userId,
      sessionId: getSessionId(),
      timestamp,
      breadcrumbs
    });
  } catch (firebaseLogErr) {
  console.warn('Failed to write error log:', firebaseLogErr);
}
  }
};