// screens/TournamentDetailScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import auth from '@react-native-firebase/auth';

export default function TournamentDetailScreen() {
  const { theme } = useTheme();

const route = useRoute();
  const navigation = useNavigation();
  const { tournamentId } = route.params;
  const [tournament, setTournament] = useState(null);
  const [army, setArmy] = useState(null);
  const [isRSVPd, setIsRSVPd] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchTournament = async () => {

    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      setUserRole(userDoc.data()?.role || '');
    }

      const docRef = doc(db, 'tournaments', tournamentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTournament({ id: docSnap.id, ...docSnap.data() });

        const currentUser = auth().currentUser;
        const players = docSnap.data().players || [];
        setIsRSVPd(players.some(p => p.uid === currentUser.uid));
      }
    };

    fetchTournament();
  }, [tournamentId]);

  const handleChoosePreset = () => {
    // Stub: Replace with modal selector
    const presetArmy = {
      id: 'preset_001',
      name: 'Shadow Doctrine',
      units: ['Unit A', 'Unit B'],
      points: 1000
    };
    setArmy(presetArmy);
  };

  const handleBuildNewArmy = () => {
    // Simulate routing to Army Builder
    const builtArmy = {
      id: 'new_001',
      name: 'Fresh Army Build',
      units: ['Scout A', 'Tank B'],
      points: 995
    };
    setArmy(builtArmy);
  };

  const confirmRSVP = async () => {
if (__DEV__) { Alert.alert( }
      "Confirm RSVP",
      "You cannot change your army after this. Do you confirm?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            const user = auth().currentUser;
            const ref = doc(db, 'tournaments', tournamentId);
            await updateDoc(ref, {
              players: arrayUnion({
                uid: user.uid,
                army,
                timestamp: Timestamp.now()
              })
            });
            setIsRSVPd(true);
          }
        }
      ]
    );
  };

  if (!tournament) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{tournament.name}</Text>
      <Text style={styles.status}>Status: {tournament.status}</Text>

      {tournament.players?.length >= tournament.maxPlayers && (
        <Text style={styles.fullText}>Tournament is Full</Text>
      )}
{!isRSVPd && tournament.status === 'upcoming' && tournament.players?.length < tournament.maxPlayers && (
        <>
          {!army ? (
            <>
              <TouchableOpacity style={styles.button} onPress={handleChoosePreset}>
                <Text style={styles.buttonText}>Choose Preset Army</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleBuildNewArmy}>
                <Text style={styles.buttonText}>Build New Army</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.armyBox}>
                <Text style={styles.armyTitle}>{army.name}</Text>
                <Text style={styles.armyInfo}>Points: {army.points}</Text>
                <Text style={styles.armyInfo}>Units: {army.units.join(', ')}</Text>
                <TouchableOpacity onPress={handleBuildNewArmy}>
                  <Text style={styles.editLink}>Edit Army</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.rsvpConfirm} onPress={confirmRSVP}>
                <Text style={styles.buttonText}>Confirm RSVP</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      
      {(userId === tournament.organizerId || userRole === 'admin') && (
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('TournamentOrganizerPanelScreen', { tournamentId: tournament.id })}
        >
          <Text style={styles.manageButtonText}>Manage Tournament</Text>
        </TouchableOpacity>
      )}

{isRSVPd && (
        <Text style={styles.rsvpStatus}>You are registered for this operation.</Text>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.accent,
    marginBottom: 8
  },
  status: {
    color: '#aaa',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#222',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  armyBox: {
    backgroundColor: '#1c1c1c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  armyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  armyInfo: {
    color: theme.muted,
    fontSize: 14,
    marginVertical: 2
  },
  editLink: {
    color: theme.accent,
    fontSize: 14,
    marginTop: 8
  },
  rsvpConfirm: {
    backgroundColor: theme.accent,
    padding: 12,
    borderRadius: 8
  },
  rsvpStatus: {
    color: '#1EF',
    fontSize: 14,
    marginTop: 20,
    fontWeight: 'bold'
  }
});
