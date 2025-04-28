// services/standingsService.js
import firestore from '@react-native-firebase/firestore';

export const generateTournamentStandings = async (tournamentId) => {
  const matchesRef = firestore().collection('tournaments').doc(tournamentId).collection('matches');
  const standingsRef = firestore().collection('tournaments').doc(tournamentId).collection('standings');

  const snapshot = await matchesRef.get();
  const pointsMap = {};

  snapshot.docs.forEach(doc => {
    const { winnerId, loserId } = doc.data();
    if (winnerId) pointsMap[winnerId] = (pointsMap[winnerId] || 0) + 3;
    if (loserId) pointsMap[loserId] = (pointsMap[loserId] || 0);
  });

  // Convert to array and sort
  const sorted = Object.entries(pointsMap)
    .map(([userId, points]) => ({ userId, points }))
    .sort((a, b) => b.points - a.points);

  // Write standings with rank
  await Promise.all(sorted.map((entry, index) => {
    return standingsRef.doc(entry.userId).set({
      rank: index + 1,
      userId: entry.userId,
      points: entry.points
    });
  }));

  return { success: true };
};