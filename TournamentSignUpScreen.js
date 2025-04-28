
import React
import { useTheme } from '../context/ThemeContext';, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { GeoCollectionReference, GeoQuerySnapshot, GeoFirestore } from 'geofirestore';  // GeoFirestore for geospatial queries
import * as Location from 'expo-location';  // Expo's geolocation API

// Tournament Sign-Up Screen with GeoFirestore integration
const { theme } = useTheme();

const TournamentSignUpScreen = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);  // User location

  // Get user's current location
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (e) {
        setError('Failed to get location');
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  // Fetch tournaments from Firestore based on geolocation
  useEffect(() => {
    if (userLocation) {
      const fetchTournaments = async () => {
        try {
          // Set up GeoFirestore query
          const geoQuery = GeoFirestore(collection(db, 'tournaments')).near({
            center: new firebase.firestore.GeoPoint(userLocation.latitude, userLocation.longitude),
            radius: 50  // Example: Search within 50 km radius
          });

          const querySnapshot = await geoQuery.get();
          const fetchedTournaments = querySnapshot.docs.map(doc => doc.data());

          setTournaments(fetchedTournaments);
        } catch (e) {
          setError('Failed to load tournaments.');
        } finally {
          setLoading(false);
        }
      };

      fetchTournaments();
    }
  }, [userLocation]);

  const handleSignUp = (tournamentId) => {
    // Logic to handle tournament sign-up (e.g., add player to Firestore tournament participants list)
  console.log(`Player signed up for tournament with ID: ${tournamentId}`);
}
  };

  return (
    <View style={{ backgroundColor: theme.background }} style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Find a Tournament Near You</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={tournaments}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              <Text>{item.location}</Text>
              <Button title="Sign Up" onPress={() => handleSignUp(item.id)} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default TournamentSignUpScreen;
