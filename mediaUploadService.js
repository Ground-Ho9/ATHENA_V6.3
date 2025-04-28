// services/mediaUploadService.js
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

// Upload avatar and update user's Firestore profile
export const uploadAvatar = async (fileBlob, uid) => {
  if (!fileBlob || !uid) throw new Error('Missing file or UID');

  const avatarRef = ref(storage, `avatars/${uid}.jpg`);
  await uploadBytes(avatarRef, fileBlob);
  const downloadURL = await getDownloadURL(avatarRef);

  // Update Firestore user profile with avatar URL
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { avatarUrl: downloadURL });

  return downloadURL;
};