// screens/MyProfileScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useState, useRef, useEffect } from 'react';
import { showToast } from '../components/ToastService';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  Button,
  Alert
} from 'react-native';
import { doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getSeasonRank } from '../services/seasonalRankService';
import { useUser } from '../context/UserContext';
import PostFeed from '../components/PostFeed';
import auth from '@react-native-firebase/auth';

const { theme } = useTheme();

const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 100;
const AVATAR_SIZE = 100;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MyProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [rank, setRank] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(null);
  const seasonId = 'S1';
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [newBio, setNewBio] = useState(user?.bio || '');

  useEffect(() => {
    const fetchFollowStats = async () => {
      const uid = auth().currentUser?.uid;
      if (uid) {
        const followersSnap = await getDocs(collection(db, 'users', uid, 'followers'));
        const followingSnap = await getDocs(collection(db, 'users', uid, 'following'));
        setFollowerCount(followersSnap.size);
        setFollowingCount(followingSnap.size);
      }
    };
    fetchFollowStats();
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

  const handleSave = async () => {
    try {
      const uid = auth().currentUser?.uid;
      await updateDoc(doc(db, 'users', uid), {
        displayName: newDisplayName,
        bio: newBio
      });
showToast('Profile updated successfully.', 'success');
      setModalVisible(false);
    } catch (error) {
showToast(error.message || 'Profile update failed.', 'error');
    }
  };

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
        <Button title="Edit Profile" onPress={() => setModalVisible(true)} />
      </Animated.View>

      <View style={styles.body}>
        <View style={styles.sideColumn}>
          <Text style={styles.label}>Season Rank</Text>
          <Text style={styles.value}>{rank ? `#${rank} of ${totalPlayers}` : 'Loading...'}</Text>
          <Text style={styles.label}>ELO</Text>
          <Text style={styles.value}>{user?.elo || 'N/A'}</Text>
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


      <TouchableOpacity
        style={styles.newPostButton}
        onPress={() => navigation.navigate('NewPostScreen')}
      >
        <Text style={styles.newPostText}>+ New Post</Text>
      </TouchableOpacity>


      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalWrap}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Edit Display Name</Text>
            <TextInput style={styles.input} value={newDisplayName} onChangeText={setNewDisplayName} />
            <Text style={styles.label}>Edit Bio</Text>
            <TextInput style={styles.input} value={newBio} onChangeText={setNewBio} />
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color=theme.muted />
          </View>
        </View>
      </Modal>
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
  },
  modalWrap: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  input: {
    backgroundColor: '#333',
    color: theme.text,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 10
  }
});
