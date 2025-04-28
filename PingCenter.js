// screens/PingCenter.js
import React
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';
import { clearUnread } from '../hooks/usePingStore'; from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchUserPings } from '../services/pingService';

export default function PingCenter({ route }) {
  const { theme } = useTheme();

const userId = route?.params?.userId || 'currentUser';
  const pings = fetchUserPings(userId);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={pings}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.ping}>{item.type} from {item.fromUserId}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1C1C1E' },
  header: { color: theme.accent, fontSize: 24, marginBottom: 16 },
  ping: { color: theme.text, fontSize: 16, paddingVertical: 8 }
});

useEffect(() => {
  clearUnread();
}, []);