
// screens/NotificationsScreen.js

import React
import { useTheme } from '../context/ThemeContext';, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getNotifications, markAllAsRead } from '../services/notificationService';

const { theme } = useTheme();

const FILTERS = ['All', 'Mentions', 'Follows', 'System'];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    return n.type === activeFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.filterBar}>
        {FILTERS.map(filter => (
          <TouchableOpacity key={filter} onPress={() => setActiveFilter(filter)}>
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilter
            ]}>{filter}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => {
          markAllAsRead();
          fetchNotifications();
        }}>
          <Text style={styles.markAll}>Mark All Read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notification, !item.read && styles.unread]}>
            <Text style={styles.content}>{item.preview}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#111' },
  title: { fontSize: 24, color: '#F5F5F5', marginBottom: 12 },
  filterBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterText: { color: theme.muted, marginHorizontal: 8 },
  activeFilter: { color: '#ED6A0C', fontWeight: 'bold' },
  markAll: { color: '#ED6A0C', fontSize: 14 },
  notification: { padding: 12, borderBottomColor: '#333', borderBottomWidth: 1 },
  unread: { backgroundColor: '#1C1C1C' },
  content: { color: theme.text, fontSize: 16 },
  timestamp: { color: theme.muted, fontSize: 12, marginTop: 4 }
});
