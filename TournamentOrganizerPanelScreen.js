// screens/TournamentOrganizerPanelScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import auth from '@react-native-firebase/auth';

export default function TournamentOrganizerPanelScreen() {
  const { theme } = useTheme();

const route = useRoute();
  const { tournamentId } = route.params;
  const [tournament, setTournament] = useState(null);
  const [user, setUser] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        setUser({ uid: currentUser.uid, ...userData });

        const tournamentRef = doc(db, 'tournaments', tournamentId);
        const tournamentSnap = await getDoc(tournamentRef);
        const tournamentData = tournamentSnap.data();

        setTournament({ id: tournamentSnap.id, ...tournamentData });
        setMaxPlayers(tournamentData.maxPlayers?.toString() || '');

        const isOrganizer = tournamentData.organizerId === currentUser.uid;
        const isAdmin = userData.role === 'admin';

        setAuthorized(isOrganizer || isAdmin);
      } catch (error) {
  console.error("Error verifying organizer access:", error);
}
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, [tournamentId]);

  const saveMaxPlayers = async () => {
    if (!maxPlayers) return;
    try {
      const ref = doc(db, 'tournaments', tournamentId);
      await updateDoc(ref, { maxPlayers: parseInt(maxPlayers) });
// TODO: UX-safe alert refactor needed
    } catch (err) {
if (__DEV__) { Alert.alert('Error', 'Failed to save max player count.'); }
    }
  };

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (!authorized) return <Text style={styles.denied}>Access Denied: TO credentials required.</Text>;
  if (!tournament) return <Text style={styles.loading}>Tournament not found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{tournament.name} - TO Control Panel</Text>
      <Text style={styles.subheader}>RSVP Limit</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={maxPlayers}
          onChangeText={setMaxPlayers}
          keyboardType="numeric"
          placeholder="Max Players"
        />
        <TouchableOpacity style={styles.button} onPress={saveMaxPlayers}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subheader}>Registered Players</Text>
      {tournament.players?.length > 0 ? (
        tournament.players.map((player, index) => (
          <View key={index} style={styles.playerBox}>
            <Text style={styles.playerName}>Player: {player.uid}</Text>
            <Text style={styles.playerText}>Army: {player.army?.name}</Text>
            <Text style={styles.playerText}>Points: {player.army?.points}</Text>
            <Text style={styles.playerText}>Operators:</Text>
            {player.army?.units?.map((unit, idx) => (
              <Text key={idx} style={styles.unitText}>
                {idx + 1}. {unit}
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noPlayers}>No players have registered yet.</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.accent,
    marginBottom: 16
  },
  subheader: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    marginRight: 10
  },
  button: {
    backgroundColor: theme.accent,
    padding: 12,
    borderRadius: 6
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  playerBox: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12
  },
  playerName: {
    color: '#1EF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  playerText: {
    color: theme.muted,
    fontSize: 14,
    marginTop: 4
  },
  unitText: {
    color: '#bbb',
    fontSize: 13,
    marginLeft: 10
  },
  noPlayers: {
    color: theme.muted,
    fontSize: 14,
    marginTop: 10
  },
  denied: {
    color: theme.accent,
    padding: 20,
    fontSize: 16,
    textAlign: 'center'
  },
  loading: {
    color: '#fff',
    padding: 20,
    fontSize: 15,
    textAlign: 'center'
  }
});
