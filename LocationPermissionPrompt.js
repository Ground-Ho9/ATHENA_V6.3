// components/LocationPermissionPrompt.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function LocationPermissionPrompt() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Access Needed</Text>
      <Text style={styles.body}>
        To show nearby tournaments and enable local discovery, we need access to your location.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openSettings()}
      >
        <Text style={styles.buttonText}>Open Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ED1C24',
    marginBottom: 16
  },
  body: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 24
  },
  button: {
    backgroundColor: '#1EF',
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
