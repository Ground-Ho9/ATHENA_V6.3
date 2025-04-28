
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTopSeasonalPlayers } from '../services/leaderboardService';

export default function LeaderboardSidebar() {
  const [players, setPlayers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const topPlayers = await getTopSeasonalPlayers(10);
      setPlayers(topPlayers);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>Top 10 Players</Text>
      <ScrollView>
        {players.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.name}>{player.username}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
        <Text style={styles.viewMore}>View Full Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { padding: 10, backgroundColor: '#1C1C1C', borderRadius: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#F0F0F0', marginBottom: 10 },
  playerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  rank: { color: '#EDAE49', fontWeight: 'bold', width: 20 },
  name: { color: '#FFF' },
  viewMore: { color: '#EDAE49', marginTop: 10, textAlign: 'right' }
});
