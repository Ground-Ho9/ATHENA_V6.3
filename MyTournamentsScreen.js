// screens/MyTournamentsScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function MyTournamentsScreen() {
  const { theme } = useTheme();

const [tournaments, setTournaments] = useState([]);
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    status: 'upcoming',
    address: '',
    maxPlayers: '',
  });

  const 
      import { geocodeAddress } from '../utils/locationUtils';
    

  handleCreateTournament = async () => {
    if (!newTournament.name || !newTournament.maxPlayers) {
if (__DEV__) { Alert.alert('Missing Fields', 'Name and Max Players are required.'); }
      return;
    }

    try {
      const coords = await geocodeAddress(newTournament.address);

    const newRef = await addDoc(collection(db, 'tournaments'), {
        ...newTournament,
        maxPlayers: parseInt(newTournament.maxPlayers),
        organizerId: auth().currentUser.uid,
        players: [],
        createdAt: new Date(),
        location: {
          address: newTournament.address,
          geopoint: new db.GeoPoint(coords.lat, coords.lng)
        }
      });
      setTournaments(prev => [...prev, { id: newRef.id, ...newTournament }]);
      setNewTournament({ name: '', status: 'upcoming',
    address: '', maxPlayers: '' });
      setShowCreateModal(false);
// TODO: UX-safe alert refactor needed
    } catch (err) {
  console.error('Creation failed:', err);
}
if (__DEV__) { Alert.alert('Error', 'Could not create tournament.'); }
    }
  };


  useEffect(() => {
    const fetchUserTournaments = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        const userSnap = await getDocs(query(collection(db, 'users'), where('__name__', '==', currentUser.uid)));
        const userData = userSnap.docs[0].data();
        setUser(userData);

        if (userData.role !== 'organizer' && userData.role !== 'admin') {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        setAuthorized(true);

        const tournamentsQuery = userData.role === 'admin'
          ? query(collection(db, 'tournaments'))
          : query(collection(db, 'tournaments'), where('organizerId', '==', currentUser.uid));

        const snapshot = await getDocs(tournamentsQuery);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTournaments(fetched);
      } catch (err) {
if (__DEV__) {
  console.error('Failed to load tournaments:', err);
}
// TODO: UX-safe alert refactor needed
      } finally {
        setLoading(false);
      }
    };

    fetchUserTournaments();
  }, []);

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (!authorized) return <Text style={styles.denied}>Access Denied: Organizer credentials required.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Tournaments</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
        <Text style={styles.createButtonText}>+ Create Tournament</Text>
      </TouchableOpacity>
    
      {tournaments.length === 0 ? (
        <Text style={styles.empty}>No tournaments found.</Text>
      ) : (
        tournaments.map((t, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>{t.name}</Text>
            <Text style={styles.status}>Status: {t.status}</Text>
            <Text style={styles.rsvpCount}>
              RSVPs: {t.players?.length || 0} / {t.maxPlayers || '∞'}
            </Text>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() =>
                navigation.navigate('TournamentOrganizerPanelScreen', { tournamentId: t.id })
              }
            >
              <Text style={styles.manageButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>New Tournament</Text>
            <TextInput
              style={styles.input}
              placeholder="Tournament Name"
              placeholderTextColor=theme.muted
              value={newTournament.name}
              onChangeText={text => setNewTournament(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor=theme.muted
              value={newTournament.address}
              onChangeText={text => setNewTournament(prev => ({ ...prev, address: text }))}
            />
    placeholder="Max Players"
              placeholderTextColor=theme.muted
              value={newTournament.maxPlayers}
              keyboardType="numeric"
              onChangeText={text => setNewTournament(prev => ({ ...prev, maxPlayers: text }))}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleCreateTournament}>
                <Text style={styles.confirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: theme.accent,
    marginBottom: 12
  },
  empty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20
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
  status: {
    fontSize: 14,
    color: theme.muted,
    marginTop: 4
  },
  rsvpCount: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2
  },
  manageButton: {
    marginTop: 10,
    backgroundColor: theme.accent,
    padding: 10,
    borderRadius: 6
  },
  manageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  loading: {
    color: '#fff',
    padding: 20,
    fontSize: 15,
    textAlign: 'center'
  },
  denied: {
    color: theme.accent,
    padding: 20,
    fontSize: 16,
    textAlign: 'center'
  }
});
