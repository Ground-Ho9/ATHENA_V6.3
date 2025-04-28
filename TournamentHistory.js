// components/TournamentHistory.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function TournamentHistory({ results }) {
  if (!results || Object.keys(results).length === 0) {
    return <Text style={styles.empty}>No tournament history available.</Text>;
  }

  const data = Object.entries(results).map(([tid, info]) => ({
    id: tid,
    placement: info.placement,
    eloAfter: info.eloAfter
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament History</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.tid}>{item.id}</Text>
            <Text style={styles.details}>Placement: {item.placement}</Text>
            <Text style={styles.details}>ELO After: {item.eloAfter}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { fontSize: 18, color: '#F0F0F0', marginBottom: 10 },
  row: {
    backgroundColor: '#1C1C1C',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6
  },
  tid: { color: '#FFD700', fontWeight: 'bold' },
  details: { color: '#FFF' },
  empty: { color: '#888', textAlign: 'center', marginTop: 10 }
});