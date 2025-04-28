// screens/GameHubScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useState, useEffect } from 'react';
import { showToast } from '../components/ToastService';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import * as Location from 'expo-location';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  GeoPoint,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { GeoFirestore } from 'geofirestore';
import { getFirestore } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import { sendMessage, sendNotification } from '../services/messageService';

const { theme } = useTheme();

const geoFirestore = new GeoFirestore(getFirestore());

export default function GameHubScreen({ navigation }) {
  
  const [radius, setRadius] = useState(50);
  const [dateFilter, setDateFilter] = useState('all');

  const isWithinDateFilter = (gameDateStr) => {
    const today = new Date();
    const gameDate = new Date(gameDateStr);
    if (dateFilter === 'today') {
      return gameDate.toDateString() === today.toDateString();
    }
    if (dateFilter === 'week') {
      const oneWeekLater = new Date(today);
      oneWeekLater.setDate(today.getDate() + 7);
      return gameDate >= today && gameDate <= oneWeekLater;
    }
    return true; // 'all'
  };

  const [mode, setMode] = useState('find');
  
  const [rsvpModalVisible, setRsvpModalVisible] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  const openRsvpModal = (game) => {
    setSelectedGame(game);
    setRsvpMessage('');
    setRsvpModalVisible(true);
  };

  const submitRsvp = async () => {
    if (!rsvpMessage.trim()) {
showToast('Please include a message to the host.', 'error');
      return;
    }

    const user = auth.currentUser;
    const uid = user?.uid;
    const gameId = selectedGame?.id;

    if (!uid || !gameId) return;

    try {
      await setDoc(doc(db, 'games', gameId, 'attendees', uid), {
        uid,
        displayName: user.displayName || 'Anonymous',
        message: rsvpMessage,
        timestamp: Date.now()
      });

      // Optional DM logic here (could call a sendMessage service)
      
      // Fetch host ID and send notification
      const gameDoc = await getDoc(doc(db, 'games', gameId));
      const hostId = gameDoc.data()?.hostId;
      if (hostId && hostId !== uid) {
        await sendNotification(
          hostId,
          'New RSVP Received',
          `${user.displayName || 'A player'} requested to join: "${selectedGame?.title || 'a game'}"`
        );
      }
    
    
      // Check if game has auto-accept enabled and send auto-confirm + address
      const gameDoc = await getDoc(doc(db, 'games', gameId));
      const hostId = gameDoc.data()?.hostId;
      const autoAccept = gameDoc.data()?.autoAccept || false;
      if (hostId && hostId !== uid) {
        await sendNotification(
          hostId,
          'New RSVP Received',
          `${user.displayName || 'A player'} requested to join: "${selectedGame?.title || 'a game'}"`
        );
      }
      if (autoAccept) {
        await updateDoc(doc(db, 'games', gameId, 'attendees', uid), { status: 'confirmed' });
        const location = gameDoc.data()?.location || 'TBD';
        await sendNotification(
          uid,
          'RSVP Confirmed',
          `Your RSVP to "${selectedGame?.title}" was auto-confirmed. Location: ${location}`
        );
      }
    
showToast('RSVP request sent to host.', 'success');
      setRsvpModalVisible(false);
    } catch (err) {
  console.error('Failed to RSVP:', err);
}
showToast('Could not send RSVP request.', 'error');
    }
  };

  
  const [hostedRsvps
  const [autoAcceptGames, setAutoAcceptGames] = useState({});, setHostedRsvps] = useState({});

  const fetchRsvpsForHostedGames = async () => {
    const uid = auth.currentUser?.uid;
    const snapshot = await getDocs(collection(db, 'games'));
    const myGames = snapshot.docs.filter(doc => doc.data()?.hostId === uid);

    const rsvpData = {};
    for (const gameDoc of myGames) {
      const gameId = gameDoc.id;
      const rsvpSnap = await getDocs(collection(db, 'games', gameId, 'attendees'));
      rsvpData[gameId] = rsvpSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    setHostedRsvps(rsvpData);
  };

  const updateRsvpStatus = async (gameId, userId, status) => {
    try {
      const attendeeRef = doc(db, 'games', gameId, 'attendees', userId);
      await updateDoc(attendeeRef, { status });
      fetchRsvpsForHostedGames(); // refresh view
    } catch (err) {
if (__DEV__) {
}
    }
  };

  const [games, setGames] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const user = auth().currentUser;

  const toggleMode = () => setMode(mode === 'find' ? 'host' : 'find');

  const obfuscateLocation = (location) => {
    const offsetLat = (Math.random() - 0.5) * 0.0045;
    const offsetLng = (Math.random() - 0.5) * 0.0045;
    return new GeoPoint(location.coords.latitude + offsetLat, location.coords.longitude + offsetLng);
  };

  const hostGame = async () => {
    if (!title || !description || !date) {
showToast('Fill in all required game info.', 'error');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const blurredLocation = obfuscateLocation(location);
      const gamesRef = collection(db, 'games');

      await addDoc(gamesRef, {
        title,
        description,
        date,
        location: blurredLocation,
        createdAt: Timestamp.now(),
        hostId: user.uid,
        attendees: [user.uid]
      });

showToast('Your game has been posted.', 'success');
      setTitle('');
      setDescription('');
      setDate('');
    } catch (error) {
if (__DEV__) {
  console.error('Error hosting game:', error);
}
showToast('Could not host game.', 'error');
    }
  };

  const findGames = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const center = new GeoPoint(location.coords.latitude, location.coords.longitude);

      const geoQuery = geoFirestore.collection('games').near({ center, radius });
      const results = await geoQuery.get();
      const foundGames = results.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(game => isWithinDateFilter(game.date));
      setGames(foundGames);

    } catch (error) {
if (__DEV__) {
  console.error('Error finding games:', error);
}
showToast('Could not fetch games.', 'error');
    }
  };

  const rsvpToGame = async (gameId, hostId, title) => {
    try {
      const gameDoc = doc(db, 'games', gameId);
      await addDoc(collection(gameDoc, 'attendees'), { userId: user.uid });

      await sendMessage(`${user.uid}_${hostId}`, `${user.displayName || 'An operator'} has RSVP’d to your game: ${title}`);
      await sendNotification(hostId, {
        title: 'New RSVP',
        body: `${user.displayName || 'An operator'} is attending your game.`,
        route: 'GameHubScreen'
      });

showToast('You’ve joined this game.', 'success');
    } catch (err) {
showToast('Could not RSVP.', 'error');
if (__DEV__) {
  console.error(err);
}
    }
  };

  useEffect(() => {
    if (mode === 'find') findGames();
  }, [mode]);

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <TouchableOpacity onPress={() => setMode('find')}>
          <Text style={[styles.toggleText, mode === 'find' && styles.active]}>Find Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('host')}>
          <Text style={[styles.toggleText, mode === 'host' && styles.active]}>Host Game</Text>
        </TouchableOpacity>
      
      <Modal visible={rsvpModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Request to Join</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              placeholder="Send a message to the host..."
              placeholderTextColor=theme.muted
              value={rsvpMessage}
              onChangeText={setRsvpMessage}
            />
            <TouchableOpacity style={styles.modalButton} onPress={submitRsvp}>
              <Text style={styles.modalButtonText}>Send Request</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRsvpModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

      {mode === 'host' ? (
        <View>
          <Text style={styles.label}>Game Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor=theme.muted />
          <Text style={styles.label}>Description</Text>
          <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor=theme.muted multiline />
          <Text style={styles.label}>Date/Time</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="Date/Time" placeholderTextColor=theme.muted />
          <Button title="Host Game" onPress={hostGame} color=theme.accent />
        </View>
      ) : (
  
      {games.map((g, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{g.title}</Text>
          <Text style={styles.info}>Your Game • {new Date(g.date).toLocaleString()}</Text>
          <Text style={styles.info}>Location Obscured</Text>

          <View style={styles.autoAcceptToggle}>
            <Text style={styles.info}>Auto-Accept:</Text>
            <TouchableOpacity onPress={() => {
              const newVal = !autoAcceptGames[g.id];
              setAutoAcceptGames({ ...autoAcceptGames, [g.id]: newVal });
            }}>
              <Text style={styles.autoAcceptText}>{autoAcceptGames[g.id] ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subheader}>RSVPs:</Text>
          {hostedRsvps[g.id]?.map((rsvp, idx) => (
            <View key={idx} style={styles.rsvpEntry}>
              <Text style={styles.rsvpEntryText}>
                {rsvp.displayName}: {rsvp.message}
              </Text>
              <Text style={styles.rsvpStatus}>Status: {rsvp.status || 'pending'}</Text>
              <View style={styles.rsvpActions}>
                <TouchableOpacity onPress={() => updateRsvpStatus(g.id, rsvp.id, 'confirmed')}>
                  <Text style={styles.approve}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => updateRsvpStatus(g.id, rsvp.id, 'declined')}>
                  <Text style={styles.decline}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
          <FlatList contentContainerStyle={{ paddingBottom: 80 }}
          data={games}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No nearby games available.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gameDetail}>{item.description}</Text>
              <Text style={styles.gameDetail}>Date: {item.date}</Text>
              {item.hostId !== user.uid && (
                <>
                  <View style={styles.rsvpRow}>
                    <Button title="RSVP" onPress={() => rsvpToGame(item.id, item.hostId, item.title)} color="#0f0" />
                    <Button title="Message Host" onPress={() =>
                      navigation.navigate('ConversationScreen', {
                        threadId: `${user.uid}_${item.hostId}`
                      })} color=theme.accent
                    />
                  </View>
                </>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: theme.muted,
    marginBottom: 2,
  },
  rsvpEntry: {
    marginTop: 8,
    paddingVertical: 6,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    backgroundColor: '#2F2F2F',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  rsvpStatus: {
    color: '#FFD700',
    fontSize: 13,
    marginTop: 2,
  },
  rsvpActions: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 16,
  },
  approve: {
    color: '#1EF01A',
    fontWeight: 'bold',
  },
  decline: {
    color: '#FF3333',
    fontWeight: 'bold',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#444',
  },
  tabButtonActive: {
    borderColor: '#FFD700',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderColor: '#555',
    paddingBottom: 4,
  },

  autoAcceptToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  autoAcceptText: {
    color: '#1EF',
    marginLeft: 8,
    fontWeight: 'bold'
  },

  subheader: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: 'bold'
  },
  rsvpEntry: {
    marginTop: 8,
    paddingVertical: 4,
    borderBottomColor: '#333',
    borderBottomWidth: 1
  },
  rsvpEntryText: {
    color: '#fff',
    fontSize: 14
  },
  rsvpStatus: {
    color: theme.muted,
    fontSize: 12
  },
  rsvpActions: {
    flexDirection: 'row',
    marginTop: 4
  },
  approve: {
    color: '#0f0',
    marginRight: 12,
    fontWeight: 'bold'
  },
  decline: {
    color: '#f55',
    fontWeight: 'bold'
  },

  rsvpButton: {
    backgroundColor: '#1EF',
    borderRadius: 6,
    padding: 10,
    marginTop: 10
  },
  rsvpText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 12
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12
  },
  modalInput: {
    height: 100,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    color: '#fff',
    padding: 10,
    marginBottom: 12
  },
  modalButton: {
    backgroundColor: theme.accent,
    padding: 12,
    borderRadius: 8
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cancelText: {
    color: theme.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10
  },

  filterHeader: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10
  },
  slider: {
    width: '100%',
    marginBottom: 10
  },
  dateToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  dateButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#333',
    flex: 1,
    marginHorizontal: 4
  },
  dateActive: {
    backgroundColor: '#1EF'
  },
  dateText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold'
  },

  container: { flex: 1, backgroundColor: theme.card, padding: 20 },
  toggle: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  toggleText: { fontSize: 18, color: theme.muted },
  active: { color: theme.accent, fontWeight: 'bold' },
  label: { color: theme.subtle, marginBottom: 5 },
  input: {
    backgroundColor: '#2A2A2A',
    color: theme.text,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  card: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  gameTitle: { fontSize: 18, color: theme.subtle },
  gameDetail: { color: theme.muted, marginTop: 4 },
  empty: { color: theme.muted, textAlign: 'center', marginTop: 30 },
  rsvpRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});
      <Text style={styles.filterHeader}>Radius: {radius} km</Text>
      <Slider
        minimumValue={5}
        maximumValue={100}
        step={5}
        value={radius}
        onValueChange={setRadius}
        style={styles.slider}
      />
      <View style={styles.dateToggle}>
        {['today', 'week', 'all'].map(filter => (
          <TouchableOpacity
            key={filter}
            onPress={() => setDateFilter(filter)}
            style={[
              styles.dateButton,
              dateFilter === filter && styles.dateActive
            ]}
          >
            <Text style={styles.dateText}>{filter.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    
