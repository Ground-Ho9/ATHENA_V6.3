import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { showToast } from '../components/ToastService';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { GeoFirestore } from 'geofirestore';
import { getFirestore, GeoPoint } from 'firebase/firestore';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import TournamentCard from '../components/TournamentCard';

const { theme } = useTheme();

const geoFirestore = new GeoFirestore(getFirestore());

export default function TournamentsPage() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNearbyTournaments = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const center = new GeoPoint(location.coords.latitude, location.coords.longitude);
        const geoQuery = geoFirestore.collection('tournaments').near({ center, radius: 50 });

        const results = await geoQuery.get();
        const tournaments = results.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllTournaments(tournaments);
      } catch (error) {
  console.error('Error fetching nearby tournaments:', error);
}
showToast('Could not fetch nearby tournaments.', 'error');
      }
    };

    fetchNearbyTournaments();
  }, []);

  useEffect(() => {
    const filtered = allTournaments.filter(t => t.status === selectedTab);
    setFilteredTournaments(filtered);
  }, [allTournaments, selectedTab]);

  const renderItem = ({ item }) => (
    <TournamentCard
      tournament={item}
      onPress={() =>
        navigation.navigate('TournamentDetailScreen', { tournamentId: item.id })
      }
    />
  );

  const renderTabs = () => (
    <View style={styles.tabs}>
      {['live', 'upcoming', 'past'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            selectedTab === tab && styles.tabSelected
          ]}
          onPress={() => setSelectedTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextSelected
            ]}
          >
            {tab.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tournaments Near You</Text>
      {renderTabs()}
      <FlatList
        data={filteredTournaments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.noTournaments}>No {selectedTab} tournaments nearby.</Text>}
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
    marginBottom: 12
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#222'
  },
  tabSelected: {
    backgroundColor: theme.accent
  },
  tabText: {
    fontSize: 14,
    color: theme.muted
  },
  tabTextSelected: {
    color: theme.text,
    fontWeight: 'bold'
  },
  noTournaments: {
    color: '#666',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center'
  }
});
