// components/OperationalIntel.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OperationalIntel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Operational Intel</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Live Operation</Text>
        <Text style={styles.value}>Fireline</Text>
        <Text style={styles.status}>Status: ACTIVE</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Next Briefing</Text>
        <Text style={styles.value}>Thu 19:00 Zulu</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Phase Ends In</Text>
        <Text style={styles.value}>2d 4h 12m</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ED1C24',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    color: '#888'
  },
  value: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginTop: 2
  },
  status: {
    fontSize: 12,
    color: '#0f0',
    marginTop: 4
  }
});
