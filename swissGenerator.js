// services/swissGenerator.js
import firestore from '@react-native-firebase/firestore';

const shuffle = (array) => {
  let m = array.length, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    [array[m], array[i]] = [array[i], array[m]];
  }
  return array;
};

export const generateSwissRounds = (players, totalRounds = 3) => {
  const rounds = [];
  let pairingPool = [...players];

  for (let roundNum = 1; roundNum <= totalRounds; roundNum++) {
    shuffle(pairingPool);
    const roundPairings = [];

    for (let i = 0; i < pairingPool.length; i += 2) {
      const p1 = pairingPool[i];
      const p2 = pairingPool[i + 1] || null;

      roundPairings.push({
        round: roundNum,
        player1: p1,
        player2: p2,
        result: null
      });
    }

    rounds.push(roundPairings);
  }

  return rounds;
};

export const generateEliminationBracket = (standings, topN = 4) => {
  const seeds = standings
    .sort((a, b) => b.wins - a.wins)
    .slice(0, topN)
    .map(player => player.playerId);

  const matches = [];
  for (let i = 0; i < seeds.length / 2; i++) {
    matches.push({
      round: 1,
      player1: seeds[i],
      player2: seeds[seeds.length - 1 - i],
      result: null
    });
  }

  return matches;
};

export const scaffoldHybridTournament = async (tournamentId, players, rounds = 3, topCut = 4) => {
  const swiss = generateSwissRounds(players, rounds);
  const swissRounds = swiss.map((pairings, index) => ({
    roundNumber: index + 1,
    pairings: pairings
  }));

  await firestore().collection('tournaments').doc(tournamentId).update({
    swissRounds: swissRounds,
    eliminationBracket: [],
    status: 'in_progress'
  });
};

// Calculate standings based on Swiss match history
export const calculateStandings = (swissRounds = []) => {
  const scores = {};
  swissRounds.forEach(round => {
    round.pairings.forEach(match => {
      if (match.result && match.result.winner) {
        const winner = match.result.winner;
        scores[winner] = (scores[winner] || 0) + 1;
      }
    });
  });

  return Object.entries(scores)
    .map(([playerId, wins]) => ({ playerId, wins }))
    .sort((a, b) => b.wins - a.wins);
};

// Automatically advance winners in single elimination brackets
export const advanceEliminationBracket = (tournament) => {
  const { eliminationBracket } = tournament;
  const rounds = [];

  let currentRound = eliminationBracket.filter(match => match.round === 1);
  let roundNumber = 1;

  while (currentRound.length > 0) {
    const nextRound = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      const m1 = currentRound[i];
      const m2 = currentRound[i + 1];

      if (m1?.result?.winner && m2?.result?.winner) {
        nextRound.push({
          round: roundNumber + 1,
          player1: m1.result.winner,
          player2: m2.result.winner,
          result: null
        });
      }
    }
    if (nextRound.length > 0) {
      rounds.push(...nextRound);
    }
    currentRound = nextRound;
    roundNumber++;
  }

  return [...eliminationBracket, ...rounds];
};