// components/LeaderboardWidget.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { getSeasonRankings, getGlobalRankings, getEloRankings } from '../services/leaderboardService';
import auth from '@react-native-firebase/auth';

export default function LeaderboardWidget() {
  const [rankType, setRankType] = useState('elo');
  const [rankings, setRankings] = useState([]);
  const flatListRef = useRef(null);
  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    const fetch = async () => {
      let data = [];
      if (rankType === 'elo') {
        data = await getEloRankings();
      } else if (rankType === 'season') {
        data = await getSeasonRankings();
      } else {
        data = await getGlobalRankings();
      }
      setRankings(data);
    };
    fetch();
  }, [rankType]);

  const scrollToMe = () => {
    const index = rankings.findIndex((r) => r.id === currentUserId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Text style={styles.name}>{item.displayName || 'Operator'}</Text>
      <Text style={styles.score}>{item.score || item.elo || '0'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setRankType('elo')}>
          <Text style={[styles.toggle, rankType === 'elo' && styles.active]}>ELO</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRankType('season')}>
          <Text style={[styles.toggle, rankType === 'season' && styles.active]}>Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRankType('global')}>
          <Text style={[styles.toggle, rankType === 'global' && styles.active]}>Global</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={rankings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.list}
      />
      <TouchableOpacity onPress={scrollToMe}>
        <Text style={styles.jump}>Jump to Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ED1C24',
    marginBottom: 10
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  toggle: {
    fontSize: 12,
    color: '#888'
  },
  active: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  rank: { color: '#BBB', fontSize: 12 },
  name: { color: '#EEE', fontSize: 12, flex: 1, marginLeft: 5 },
  score: { color: '#ED1C24', fontSize: 12 },
  jump: {
    color: '#00F0FF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10
  },
  list: {
    maxHeight: 200
  }
});
