// screens/ActiveTournamentScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { calculateStandings } from '../services/swissGenerator';

export default function ActiveTournamentScreen({ route }) {
  const { theme } = useTheme();

const { tournamentId } = route.params;
  const [tournament, setTournament] = useState(null);
  const [myStanding, setMyStanding] = useState(null);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      const snap = await firestore().collection('tournaments').doc(tournamentId).get();
      if (snap.exists) {
        const data = snap.data();
        setTournament(data);

        const standings = calculateStandings(data.swissRounds);
        const rank = standings.findIndex(s => s.playerId === userId);
        if (rank !== -1) setMyStanding({ ...standings[rank], position: rank + 1 });
      }
    };
    fetchData();
  }, [tournamentId, userId]);

  if (!tournament) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>You’re in: {tournament.name}</Text>
      <Text style={styles.section}>Your Standing:</Text>
      {myStanding ? (
        <Text style={styles.highlight}>
          Rank {myStanding.position} – Wins: {myStanding.wins}
        </Text>
      ) : (
        <Text style={styles.subtle}>No wins logged yet.</Text>
      )}

      <Text style={styles.section}>Your Matches:</Text>
      {tournament.swissRounds.length === 0 ? (
        <Text style={styles.subtle}>No matches yet. You’ll see them here once rounds begin.</Text>
      ) : (
        tournament.swissRounds.map((round, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.subHeader}>Round {round.roundNumber}</Text>
            {round.pairings
              .filter(p => p.player1 === userId || p.player2 === userId)
              .map((match, j) => {
                const isWinner = match.result?.winner === userId;
                return (
                  <Text key={j} style={[styles.match, isWinner && styles.winner]}>
                    {match.player1} vs {match.player2 || 'BYE'} –{" "}
                    {match.result ? `Winner: ${match.result.winner}` : 'Pending'}
                  </Text>
                );
              })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 20 },
  header: { fontSize: 22, color: theme.accent, marginBottom: 20 },
  section: { fontSize: 18, color: theme.text, marginTop: 10 },
  subHeader: { fontSize: 16, color: theme.accent, marginBottom: 5 },
  card: { backgroundColor: theme.card, padding: 10, borderRadius: 8, marginBottom: 10 },
  match: { color: '#EEE' },
  winner: { color: '#00FF00', fontWeight: 'bold' },
  highlight: { fontSize: 16, color: '#0f0' },
  loading: { color: theme.muted, textAlign: 'center', marginTop: 50 },
  subtle: { color: theme.muted, fontStyle: 'italic', marginBottom: 10 },
});
