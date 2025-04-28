import * as Location from 'expo-location';

import FollowButton from '../components/FollowButton';
import { getSeasonRank } from '../services/seasonalRankService';
import { useRoute } from '@react-navigation/native';
import React
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, Dimensions, Button } from 'react-native';
import { useUser } from '../context/UserContext';
import PostFeed from '../components/PostFeed';

const { theme } = useTheme();

const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 100;
const AVATAR_SIZE = 100;
const SCREEN_WIDTH = Dimensions.get('window').width;

const route = useRoute();
const { userId } = route.params;

  const [rank, setRank] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(null);
  const seasonId = 'S1'; // Example season ID

  
  useEffect(() => {
    const requestLocationPermission = async () => {
      const alreadyAsked = await AsyncStorage.getItem('locationPermissionRequested');
      if (alreadyAsked) return;

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
  console.log('Location permission granted.');
}
        await AsyncStorage.setItem('locationPermissionRequested', 'true');
      } else {
if (__DEV__) {
}
        await AsyncStorage.setItem('locationPermissionRequested', 'true');
      }
    };
    requestLocationPermission();
  }, []);


useEffect(() => {
    const fetchRank = async () => {
      const result = await getSeasonRank(user.id, seasonId);
      if (result) {
        setRank(result.rank);
        setTotalPlayers(result.totalPlayers);
      }
    };
    if (user?.id) fetchRank();
  }, []);


export default function ProfileScreen() {
  const { user } = useUser();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.6],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: user?.avatarUrl }}
          style={[styles.avatar, { transform: [{ scale: avatarScale }] }]}
        />
        <Text style={styles.username}>{user?.displayName || 'Operator'}</Text>
        <Text style={styles.bio}>{user?.bio || 'Awaiting deployment...'}</Text>
      </Animated.View>

      <View style={styles.body}>
        <View style={styles.sideColumn}>
          <Text style={styles.label}>Season Rank</Text>
          <Text style={styles.value}>{rank ? `#${rank} of ${totalPlayers}` : "Loading..."}</Text>
          <Text style={styles.label}>ELO</Text>
          <Text style={styles.value}>{user?.elo || "N/A"}</Text>
        </View>

        <ScrollView
          style={styles.feed}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <PostFeed userId={user?.id} />
        </ScrollView>

        <View style={styles.sideColumn}>
          <Text style={styles.label}>Stats</Text>
          <Text style={styles.value}>W: 14</Text>
          <Text style={styles.value}>L: 5</Text>
          <Text style={styles.value}>Draw: 2</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.card },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
    paddingTop: 20
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginBottom: 10
  },
  username: {
    fontSize: 18,
    color: theme.subtle,
    fontWeight: 'bold'
  },
  bio: {
    fontSize: 14,
    color: theme.muted,
    marginTop: 4
  },
  body: {
    flex: 1,
    flexDirection: 'row'
  },
  sideColumn: {
    width: SCREEN_WIDTH * 0.25,
    padding: 10
  },
  feed: {
    flex: 1
  },
  label: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 10
  },
  value: {
    color: theme.subtle,
    fontSize: 16
  }
});

import TournamentHistory from '../components/TournamentHistory';

// Inside your main component return or layout
// Assuming user is defined as the current profile

<TournamentHistory results={user?.tournamentResults} />
