
// screens/AccountSetupScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../firebase';
import { finalizeQR } from '../services/qrService';

const AccountSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { codeId } = route.params || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const validatePassword = (pw) => {
    const upper = /[A-Z]/.test(pw);
    const number = /[0-9]/.test(pw);
    return pw.length >= 6 && upper && number;
  };

  const handleSubmit = async () => {
    if (!email || !password) {
if (__DEV__) { Alert.alert('Missing Info', 'Email and password are required.'); }
      return;
    }
    if (!validatePassword(password)) {
// TODO: UX-safe alert refactor needed
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      await finalizeQR(codeId);
// TODO: UX-safe alert refactor needed
if (__DEV__) { Alert.alert('Verify Email', 'Check your inbox to verify your email.'); }
      if (phone.trim().length > 0) {
        navigation.navigate('PhoneVerification', { phone });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'EmailVerification' }] });
      }
    } catch (err) {
if (__DEV__) {
  console.error(err);
}
if (__DEV__) { Alert.alert('Error', err.message); }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Operator Account</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TextInput placeholder="Phone Number (optional)" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#000' },
  title: { fontSize: 20, color: '#fff', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#111', color: '#fff', padding: 12, borderRadius: 6, marginVertical: 10 },
  button: { backgroundColor: '#0f0', padding: 14, borderRadius: 6, marginTop: 20 },
  buttonText: { color: '#000', fontWeight: 'bold' },
});

export default AccountSetupScreen;
