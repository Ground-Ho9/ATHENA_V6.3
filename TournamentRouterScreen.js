// screens/TournamentRouterScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function TournamentRouterScreen({ navigation }) {
  useEffect(() => {
    const { theme } = useTheme();

const routeUser = async () => {
      const user = auth().currentUser;
      if (!user) return navigation.replace('TournamentFeedScreen');

      const userSnap = await firestore().collection('users').doc(user.uid).get();
      const userData = userSnap.exists ? userSnap.data() : {};

      // If user is an organizer with created tournaments
      if (userData.role === 'organizer') {
        const events = await firestore()
          .collection('tournaments')
          .where('createdBy', '==', user.uid)
          .get();
        if (!events.empty) {
          const latest = events.docs[0];
          navigation.replace('TournamentDetailScreen', { tournamentId: latest.id });
          return;
        }
      }

      // If user is a player in an active tournament
      const activeTournaments = await firestore()
        .collection('tournaments')
        .where('status', 'in_progress')
        .get();

      for (let doc of activeTournaments.docs) {
        const data = doc.data();
        if (data.players && data.players.includes(user.uid)) {
          navigation.replace('ActiveTournamentScreen', { tournamentId: doc.id });
          return;
        }
      }

      // Fallback to public feed
      navigation.replace('TournamentFeedScreen');
    };

    routeUser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color=theme.accent />
      <Text style={styles.text}>Routing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: theme.text, marginTop: 10, fontSize: 16 }
});