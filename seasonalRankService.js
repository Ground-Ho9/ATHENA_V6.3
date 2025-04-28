// services/seasonalRankService.js
import firestore from '@react-native-firebase/firestore';

export const getSeasonRank = async (userId, seasonId) => {
  const usersRef = firestore().collection('users');
  const snapshot = await usersRef
    .where(`seasonElo.${seasonId}`, '>', 0)
    .get();

  const rankedUsers = snapshot.docs
    .map(doc => ({ id: doc.id, elo: doc.data().seasonElo?.[seasonId] || 1200 }))
    .sort((a, b) => b.elo - a.elo);

  const totalPlayers = rankedUsers.length;
  const rank = rankedUsers.findIndex(user => user.id === userId) + 1;

  return { rank, totalPlayers };
};