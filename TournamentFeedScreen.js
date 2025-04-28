// screens/TournamentFeedScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import TournamentCard from '../components/TournamentCard';

export default function TournamentFeedScreen() {
  const { theme } = useTheme();

const [tournaments, setTournaments] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tournaments'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTournaments(data);
      } catch (error) {
  console.error('Error fetching tournaments:', error);
}
      }
    };

    fetchTournaments();
  }, []);

  const renderItem = ({ item }) => (
    <TournamentCard
      tournament={item}
      onPress={() =>
        navigation.navigate('TournamentDetailScreen', { tournamentId: item.id })
      }
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Tournaments</Text>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    flex: 1,
    backgroundColor: theme.background
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.accent,
    marginBottom: 16
  }
});
