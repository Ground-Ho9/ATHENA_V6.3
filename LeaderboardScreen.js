
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Vibration } from 'react-native';
import { getTopSeasonalPlayers } from '../services/leaderboardService';
import { AuthContext } from '../context/AuthContext';

const { theme } = useTheme();

const LeaderboardScreen = () => {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rankType, setRankType] = useState('seasonal'); // seasonal | elo | global
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPlayers = await getTopSeasonalPlayers(100);
      const enriched = fetchedPlayers.map(p => ({
        ...p,
        globalScore: (p.seasonalRank || 0) * 0.6 + (p.eloRating || 0) * 0.4
      }));
      setPlayers(enriched);

      const idx = enriched.findIndex(p => p.id === user?.id);
      setHighlightedIndex(idx !== -1 ? idx : null);
    };
    fetchData();
  }, []);

  const handleRankTypeChange = (type) => {
    setRankType(type);
    Vibration.vibrate(25);
  };

  const getSortedPlayers = () => {
    const base = [...players];
    if (rankType === 'elo') return base.sort((a, b) => b.eloRating - a.eloRating);
    if (rankType === 'global') return base.sort((a, b) => b.globalScore - a.globalScore);
    return base.sort((a, b) => a.seasonalRank - b.seasonalRank);
  };

  const filteredPlayers = getSortedPlayers().filter(player =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const screenWidth = Dimensions.get('window').width;
  const compact = screenWidth < 380;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Global Leaderboard</Text>
      <View style={styles.sliderWrapper}>
        <TouchableOpacity onPress={() => handleRankTypeChange('elo')} style={[styles.sliderButton, rankType === 'elo' && styles.activeSlider]}>
          <Text style={styles.sliderText}>ELO</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRankTypeChange('seasonal')} style={[styles.sliderButton, rankType === 'seasonal' && styles.activeSlider]}>
          <Text style={styles.sliderText}>Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRankTypeChange('global')} style={[styles.sliderButton, rankType === 'global' && styles.activeSlider]}>
          <Text style={styles.sliderText}>Global</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.search}
        placeholder="Search players..."
        placeholderTextColor=theme.muted
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity onPress={() => {
        if (highlightedIndex !== null) {
          flatListRef?.scrollToIndex({ animated: true, index: highlightedIndex });
        }
      }}>
        <Text style={styles.jump}>Jump to Me</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        ref={(ref) => (flatListRef = ref)}
        renderItem={({ item, index }) => (
          <View style={[
            styles.playerRow,
            user?.id === item.id && styles.highlighted
          ]}>
            <Text style={[styles.rank, { width: compact ? 25 : 30 }]}>{index + 1}.</Text>
            <Text style={[styles.name, { fontSize: compact ? 14 : 16 }]}>{item.username}</Text>
            <Text style={styles.score}>
              {rankType === 'elo' ? item.eloRating : rankType === 'global' ? Math.round(item.globalScore) : item.seasonalRank}
            </Text>
            {item.rankDelta !== undefined && (
              <Text style={{
                color: item.rankDelta > 0 ? '#43FF5E' : '#ED7E3A',
                marginLeft: 6
              }}>
                {item.rankDelta > 0 ? `+${item.rankDelta}` : item.rankDelta}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

let flatListRef;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.background },
  title: { fontSize: 24, color: theme.text, marginBottom: 10 },
  search: {
    backgroundColor: theme.card,
    padding: 10,
    borderRadius: 8,
    color: theme.text,
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  rank: { color: '#EDAE49' },
  name: { color: theme.text, flex: 1 },
  score: { color: theme.muted, width: 100, textAlign: 'right' },
  sliderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 15,
    backgroundColor: '#1E1E1E',
    padding: 6,
    borderRadius: 10
  },
  sliderButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  activeSlider: {
    backgroundColor: '#2D2D2D'
  },
  sliderText: {
    color: theme.text,
    fontSize: 14
  },
  jump: {
    color: '#EDAE49',
    marginBottom: 10,
    textAlign: 'right'
  },
  highlighted: {
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: 8
  }
});

export default LeaderboardScreen;
