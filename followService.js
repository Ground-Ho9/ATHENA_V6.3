
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const followUser = async (currentUserId, targetUserId) => {
  const followDoc = doc(db, 'users', currentUserId, 'following', targetUserId);
  const followerDoc = doc(db, 'users', targetUserId, 'followers', currentUserId);
  await setDoc(followDoc, { followedAt: Date.now() });
  await setDoc(followerDoc, { followedAt: Date.now() });
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  const followDoc = doc(db, 'users', currentUserId, 'following', targetUserId);
  const followerDoc = doc(db, 'users', targetUserId, 'followers', currentUserId);
  await deleteDoc(followDoc);
  await deleteDoc(followerDoc);
};

export const isFollowing = async (currentUserId, targetUserId) => {
  const followDoc = doc(db, 'users', currentUserId, 'following', targetUserId);
  const docSnap = await getDoc(followDoc);
  return docSnap.exists();
};
