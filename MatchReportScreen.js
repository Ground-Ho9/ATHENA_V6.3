// screens/MatchReportScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { handleMatchResult } from '../services/MatchResultHandler';

export default function MatchReportScreen({ navigation }) {
  const { theme } = useTheme();

const [matchId, setMatchId] = useState('');
  const [tournamentId, setTournamentId] = useState('');
  const [seasonId, setSeasonId] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [loserId, setLoserId] = useState('');
  const [roundType, setRoundType] = useState('swiss');

  const handleSubmit = async () => {
    const result = await handleMatchResult({ matchId, winnerId, loserId, roundType, tournamentId, seasonId });
    if (result.success) {
if (__DEV__) { Alert.alert('Match submitted!', `ELO updated successfully.`); }
      navigation.goBack();
    } else {
// TODO: UX-safe alert refactor needed
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Match Result</Text>
      <TextInput placeholder="Match ID" value={matchId} onChangeText={setMatchId} style={styles.input} />
      <TextInput placeholder="Tournament ID" value={tournamentId} onChangeText={setTournamentId} style={styles.input} />
      <TextInput placeholder="Season ID" value={seasonId} onChangeText={setSeasonId} style={styles.input} />
      <TextInput placeholder="Winner ID" value={winnerId} onChangeText={setWinnerId} style={styles.input} />
      <TextInput placeholder="Loser ID" value={loserId} onChangeText={setLoserId} style={styles.input} />
      <TextInput placeholder="Round Type (swiss/elimination/final)" value={roundType} onChangeText={setRoundType} style={styles.input} />
      <Button title="Submit Result" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#111' },
  title: { fontSize: 22, color: '#FF9500', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#333', padding: 10, marginBottom: 10,
    borderRadius: 6, backgroundColor: '#222', color: '#fff'
  }
});