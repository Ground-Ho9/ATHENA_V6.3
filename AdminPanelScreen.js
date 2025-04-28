// screens/AdminPanelScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { generateQRCodes } from '../services/qrGenerator';

export default function AdminPanelScreen({ navigation }) {
  const { theme } = useTheme();

const [qrCount, setQrCount] = useState('5');
  const [userQuery, setUserQuery] = useState('');
  const [loreDrop, setLoreDrop] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth().currentUser;
      if (!user) return;
      const snap = await firestore().collection('users').doc(user.uid).get();
      if (snap.exists && snap.data().role === 'admin') {
        setAuthorized(true);
      } else {
if (__DEV__) { Alert.alert('Unauthorized', 'You do not have access to this panel.'); }
        navigation.replace('Home');
      }
    };
    checkAdmin();
  }, []);

  const handleGenerateQR = async () => {
    const count = parseInt(qrCount, 10);
    if (isNaN(count) || count < 1 || count > 100)
// TODO: UX-safe alert refactor needed

    setLoading(true);
    try {
      await generateQRCodes(count);
// TODO: UX-safe alert refactor needed
if (__DEV__) { Alert.alert('Success', `${count} QR codes generated.`); }
    } catch (err) {
if (__DEV__) { Alert.alert('Error', err.message); }
    } finally {
      setLoading(false);
    }
  };

  const handleUserLookup = async () => {
    setLoading(true);
    try {
      const snap = await firestore().collection('users').where('email', '==', userQuery).get();
      if (snap.empty) {
// TODO: UX-safe alert refactor needed
if (__DEV__) { Alert.alert('User Not Found'); }
      } else {
        const userData = snap.docs[0].data();
if (__DEV__) { Alert.alert('User Found', JSON.stringify(userData, null, 2)); }
      }
    } catch (err) {
if (__DEV__) { Alert.alert('Error', err.message); }
    } finally {
      setLoading(false);
    }
  };

  const handleLoreDrop = async () => {
    setLoading(true);
    try {
      await firestore().collection('loreFeed').add({
        message: loreDrop,
        timestamp: Date.now(),
        author: 'Admin'
      });
      setLoreDrop('');
// TODO: UX-safe alert refactor needed
if (__DEV__) { Alert.alert('Broadcast Sent'); }
    } catch (err) {
// TODO: UX-safe alert refactor needed
if (__DEV__) { Alert.alert('Error', err.message); }
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Olympus Admin Panel</Text>

      <View style={styles.card}>
        <Text style={styles.section}>QR Code Generator</Text>
        <TextInput
          placeholder="Number of QR codes"
          value={qrCount}
          onChangeText={setQrCount}
          style={styles.input}
          keyboardType="number-pad"
        />
        <Button title="Generate QR Codes" onPress={handleGenerateQR} />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>User Lookup</Text>
        <TextInput
          placeholder="Enter user email"
          value={userQuery}
          onChangeText={setUserQuery}
          style={styles.input}
        />
        <Button title="Search User" onPress={handleUserLookup} />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Lore Broadcaster</Text>
        <TextInput
          placeholder="Lore message"
          value={loreDrop}
          onChangeText={setLoreDrop}
          style={styles.input}
        />
        <Button title="Send Lore Drop" onPress={handleLoreDrop} />
      </View>

      {loading && <ActivityIndicator color=theme.accent style={{ marginTop: 10 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1C1C1E' },
  title: { fontSize: 24, color: theme.accent, marginBottom: 20, textAlign: 'center' },
  section: { fontSize: 18, color: theme.text, marginBottom: 10 },
  input: { backgroundColor: '#2C2C2E', color: theme.text, padding: 10, borderRadius: 6, marginBottom: 10 },
  card: { backgroundColor: '#2A2A2D', borderRadius: 8, padding: 16, marginBottom: 20 }
});
