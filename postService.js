// services/postService.js
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const postsRef = firestore().collection('posts');
const reactionsRef = firestore().collection('reactions');
const commentsRef = firestore().collection('comments');

export const getAllPosts = async () => {
  const snapshot = await postsRef.orderBy('timestamp', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const reactToPost = async (postId, reactionType) => {
  const user = auth().currentUser;
  if (!user) return;

  const reactionDoc = reactionsRef.doc(`${postId}_${user.uid}`);
  await reactionDoc.set({ type: reactionType, userId: user.uid, postId });

  const snapshot = await reactionsRef.where('postId', '==', postId).get();
  const counts = {};
  let userReaction = null;

  snapshot.forEach(doc => {
    const data = doc.data();
    counts[data.type] = (counts[data.type] || 0) + 1;
    if (data.userId === user.uid) userReaction = data.type;
  });

  return { counts, userReaction };
};

export const getPostReactions = async (postId) => {
  const user = auth().currentUser;
  const snapshot = await reactionsRef.where('postId', '==', postId).get();

  const counts = {};
  let userReaction = null;

  snapshot.forEach(doc => {
    const data = doc.data();
    counts[data.type] = (counts[data.type] || 0) + 1;
    if (user && data.userId === user.uid) userReaction = data.type;
  });

  return { counts, userReaction };
};

export const getTopCommentsForPost = async (postId) => {
  const snapshot = await commentsRef
    .where('postId', '==', postId)
    .orderBy('timestamp', 'desc')
    .limit(3)
    .get();

  return snapshot.docs.map(doc => doc.data());
};

export const addCommentToPost = async (postId, text) => {
  const user = auth().currentUser;
  if (!user) return;
  await commentsRef.add({
    postId,
    text,
    author: user.displayName || 'User',
    userId: user.uid,
    timestamp: firestore.FieldValue.serverTimestamp()
  });
};