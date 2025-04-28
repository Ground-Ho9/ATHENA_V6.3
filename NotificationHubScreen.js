
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function NotificationHubScreen() {
  const { theme } = useTheme();

const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotifications = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const notifQuery = query(
        collection(db, 'notifications'),
        where('targetUserId', '==', uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(notifQuery);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(results);
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notification}
      onPress={() => item.link && navigation.navigate(item.link.screen, item.link.params)}
    >
      <Text style={styles.type}>{item.type.toUpperCase()}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 20 },
  title: { fontSize: 24, color: theme.text, marginBottom: 15 },
  notification: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, marginBottom: 10 },
  type: { color: '#ED902E', fontWeight: 'bold', fontSize: 12 },
  message: { color: theme.text, fontSize: 16, marginTop: 5 },
  time: { color: theme.muted, fontSize: 12, marginTop: 5 }
});
