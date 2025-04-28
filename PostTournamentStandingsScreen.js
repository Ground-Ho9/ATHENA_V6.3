// screens/PostTournamentStandingsScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function PostTournamentStandingsScreen({ route }) {
  const { theme } = useTheme();

const { tournamentId } = route.params;
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const fetchStandings = async () => {
      const snapshot = await firestore()
        .collection('tournaments')
        .doc(tournamentId)
        .collection('standings')
        .orderBy('rank', 'asc')
        .get();

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStandings(data);
    };

    fetchStandings();
  }, [tournamentId]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>#{item.rank}</Text>
      <Text style={styles.name}>{item.displayName}</Text>
      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament Standings</Text>
      <FlatList
        data={standings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#111' },
  title: { fontSize: 24, color: '#FF9500', marginBottom: 15, textAlign: 'center' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  rank: { color: theme.text, fontWeight: 'bold' },
  name: { color: theme.text },
  points: { color: '#FF9500' }
});