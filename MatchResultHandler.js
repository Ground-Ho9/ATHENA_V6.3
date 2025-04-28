// services/MatchResultHandler.js
import firestore from '@react-native-firebase/firestore';
import { recordMatchResult } from './eloService';

// Handle a tournament match result
export const handleMatchResult = async ({ matchId, winnerId, loserId, roundType, tournamentId, seasonId }) => {
  try {
    const matchRef = firestore().collection('tournaments').doc(tournamentId).collection('matches').doc(matchId);

    // Save match result to Firestore
    await matchRef.set({
      winnerId,
      loserId,
      roundType,
      reportedAt: Date.now(),
      tournamentId,
      seasonId
    });

    // Call ELO engine
    await recordMatchResult({ winnerId, loserId, roundType, seasonId });

    return { success: true };
  } catch (error) {
  console.error('Match result error:', error);
}
    return { success: false, error };
  }
};