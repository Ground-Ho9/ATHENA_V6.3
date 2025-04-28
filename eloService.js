// services/eloService.js
import firestore from '@react-native-firebase/firestore';

const BASE_K = 32;
const HIGH_STAKES_K = 40;
const FINAL_K = 50;

// Determine K-factor based on match round type
const getKFactor = (roundType) => {
  switch (roundType) {
    case 'final': return FINAL_K;
    case 'elimination': return HIGH_STAKES_K;
    default: return BASE_K;
  }
};

// ELO calculation function
const calculateEloChange = (playerElo, opponentElo, didWin, roundType) => {
  const K = getKFactor(roundType);
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const score = didWin ? 1 : 0;
  const delta = Math.round(K * (score - expectedScore));
  return delta;
};

// Apply ELO result to both users
export const recordMatchResult = async ({ winnerId, loserId, roundType, seasonId }) => {
  const winnerRef = firestore().collection('users').doc(winnerId);
  const loserRef = firestore().collection('users').doc(loserId);

  const [winnerDoc, loserDoc] = await Promise.all([winnerRef.get(), loserRef.get()]);
  if (!winnerDoc.exists || !loserDoc.exists) return;

  const winnerData = winnerDoc.data();
  const loserData = loserDoc.data();

  const winnerElo = winnerData.elo || 1200;
  const loserElo = loserData.elo || 1200;

  const eloGain = calculateEloChange(winnerElo, loserElo, true, roundType);
  const eloLoss = -calculateEloChange(loserElo, winnerElo, false, roundType);

  // Update global and seasonal ELO
  await Promise.all([
    winnerRef.update({
      elo: winnerElo + eloGain,
      [`seasonElo.${seasonId}`]: (winnerData.seasonElo?.[seasonId] || 1200) + eloGain,
    }),
    loserRef.update({
      elo: loserElo + eloLoss,
      [`seasonElo.${seasonId}`]: (loserData.seasonElo?.[seasonId] || 1200) + eloLoss,
    })
  ]);
};