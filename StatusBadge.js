// components/StatusBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ status }) {
  const getColor = () => {
    switch (status) {
      case 'Open': return '#28a745';
      case 'In Progress': return '#ffc107';
      case 'Closed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColor() }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  text: { color: '#FFF', fontWeight: '600', fontSize: 12 }
});