import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

export const toggleReaction = async (postOwnerId, postId, reactionType, userId) => {
  const postRef = doc(db, 'users', postOwnerId, 'posts', postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;
  const data = postSnap.data();

  const currentReactions = data.reactions || {};
  const userList = currentReactions[reactionType] || [];
  const alreadyReacted = userList.includes(userId);

  if (alreadyReacted) {
    await updateDoc(postRef, {
      [`reactions.${reactionType}`]: arrayRemove(userId),
    });
  } else {
    await updateDoc(postRef, {
      [`reactions.${reactionType}`]: arrayUnion(userId),
    });
  }
};

export const parseReactionCounts = (reactions = {}) => {
  const result = {};
  for (const key in reactions) {
    result[key] = reactions[key].length || 0;
  }
  return result;
};
