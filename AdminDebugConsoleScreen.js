// screens/AdminDebugConsoleScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../context/AuthContext';

export default function AdminDebugConsoleScreen({ navigation }) {
  const { theme } = useTheme();

const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigation.navigate('Home');
      return;
    }

    const unsubscribe = firestore()
      .collection('errorLogs')
      .orderBy('timestamp', 'desc')
      .limit(25)
      .onSnapshot(snapshot => {
        const fetched = snapshot.docs.map(doc => doc.data());
        setLogs(fetched);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <Text style={styles.loading}>Authenticating...</Text>;
  if (loading) return <ActivityIndicator style={{ flex: 1 }} color=theme.accent />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error Logs</Text>
      {logs.length === 0 ? (
        <Text style={styles.noLogs}>No recent logs found.</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.context}>[{item.context}]</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.meta}>User: {item.userId || 'N/A'}</Text>
              <Text style={styles.meta}>Session: {item.sessionId}</Text>
              <Text style={styles.meta}>Time: {new Date(item.timestamp).toLocaleString()}</Text>
              <Text style={styles.breadcrumbs}>
                Trail: {item.breadcrumbs?.map(b => b.event).join('  →  ')}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#111' },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 10 },
  card: { backgroundColor: '#1C1C1C', marginBottom: 10, padding: 10, borderRadius: 6 },
  context: { color: '#FFD700', fontWeight: 'bold' },
  message: { color: theme.text },
  meta: { color: theme.muted, fontSize: 12 },
  breadcrumbs: { color: '#666', fontSize: 12, marginTop: 6 },
  loading: { textAlign: 'center', color: theme.muted, marginTop: 40 },
  noLogs: { textAlign: 'center', color: theme.muted, marginTop: 20 },
});
