// screens/NearbyTournamentsScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GeoFirestore } from 'geofirestore';
import { getFirestore, GeoPoint } from 'firebase/firestore';
import { db } from '../firebase';
import * as Location from 'expo-location';

export default function NearbyTournamentsScreen({ navigation }) {
  const { theme } = useTheme();

const [tournaments, setTournaments] = useState([]);

  const [radius, setRadius] = useState(50);
  const [statusFilter, setStatusFilter] = useState('upcoming');

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyTournaments = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
if (__DEV__) { Alert.alert('Permission Denied', 'Location permission is required to find nearby tournaments.'); }
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);

        
        const firestore = getFirestore();
        const geofirestore = new GeoFirestore(firestore);
        const geoCollection = geofirestore.collection('tournaments');

        const query = geoCollection.near({
          center: new GeoPoint(loc.coords.latitude, loc.coords.longitude),
          radius
        });

        const snapshot = await query.get();
        const nearby = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTournaments(nearby);

      } catch (err) {
if (__DEV__) {
}
if (__DEV__) { Alert.alert('Error', 'Could not fetch location or tournaments.'); }
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyTournaments();
  }, []);

  if (loading) return <Text style={styles.loading}>Scanning for tournaments near you...</Text>;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.filterHeader}>Search Radius: {radius} km</Text>
      <Slider
        minimumValue={10}
        maximumValue={200}
        step={5}
        value={radius}
        onValueChange={setRadius}
        style={styles.slider}
      />
      <View style={styles.statusToggle}>
        {['upcoming', 'live', 'past'].map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => setStatusFilter(status)}
            style={[
              styles.statusButton,
              statusFilter === status && styles.statusActive
            ]}
          >
            <Text style={styles.statusText}>{status.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    
      <Text style={styles.header}>Nearby Tournaments</Text>
      {tournaments.length === 0 ? (
        <Text style={styles.empty}>No tournaments found near your location.</Text>
      ) : (
        tournaments.map((t, index) => {

          const distance = calculateDistance(
            userLocation.latitude, userLocation.longitude,
            t.location?.geopoint?.latitude, t.location?.geopoint?.longitude
          );
          if (statusFilter && t.status !== statusFilter) return null;
    
          <View key={index} style={styles.card}>
            <Text style={styles.name}>{t.name}</Text>
            <Text style={styles.info}>Status: {t.status}</Text>
            <Text style={styles.info}>Distance: {distance.toFixed(1)} km</Text>
            <Text style={styles.info}>Address: {t.location?.address || 'Unknown'}</Text>
            <Text style={styles.info}>Players: {t.players?.length || 0} / {t.maxPlayers || '∞'}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate('TournamentDetailScreen', { tournamentId: t.id })}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.background,
    flex: 1
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1EF',
    marginBottom: 16
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  info: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 4
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: theme.accent,
    padding: 10,
    borderRadius: 6
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  empty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20
  },
  loading: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20
  }
});
