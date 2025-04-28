// components/TournamentCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';
import JoinButton from './JoinButton';

export default function TournamentCard({ tournament }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{tournament.name}</Text>
      <Text style={styles.details}>{tournament.date} | {tournament.location}</Text>
      <StatusBadge status={tournament.status} />
      <JoinButton tournamentId={tournament.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F1F1F',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  details: { fontSize: 14, color: '#AAA', marginBottom: 6 }
});