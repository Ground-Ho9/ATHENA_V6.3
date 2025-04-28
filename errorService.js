// services/errorService.js
import { logErrorToFirebase } from './errorLogService';
import { showToast } from '../components/ErrorToast';

export const handleError = (error, context = 'Unknown', userId = null) => {
  console.error(`[${context}]`, error);
}
  const message = error?.message || 'An unexpected error occurred.';
  showToast(`${context}: ${message}`);
  logErrorToFirebase(error, context, userId);
};