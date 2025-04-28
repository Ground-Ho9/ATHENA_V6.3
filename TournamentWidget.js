// components/TournamentWidget.js
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function TournamentWidget() {
  const [tournaments, setTournaments] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
  React.useCallback(() => {
    const fetchLiveTournaments = async () => {
      const q = query(collection(db, 'tournaments'), where('status', '==', 'live'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTournaments(data.slice(0, 2)); // Limit to top 2
    };

    fetchLiveTournaments();
    }, [])
);

  if (tournaments.length === 0) {
    return null;
  }

  
  if (loading) return <Text style={{ color: 'white', textAlign: 'center' }}>Loading tournaments...</Text>;
  if (error) return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Tournaments</Text>
      {tournaments.map((tournament) => (
        <TouchableOpacity
          key={tournament.id}
          style={styles.card}
          onPress={() => navigation.navigate('TournamentDetailScreen', { id: tournament.id })}
        >
          <Text style={styles.title}>{tournament.name}</Text>
          <Text style={styles.detail}>Status: {tournament.status.toUpperCase()}</Text>
          {tournament.endTime && (
            <Text style={styles.detail}>Ends: {new Date(tournament.endTime.seconds * 1000).toLocaleString()}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ED1C24',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  title: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600'
  },
  detail: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 4
  }
});
