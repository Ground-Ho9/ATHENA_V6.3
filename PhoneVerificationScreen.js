
// screens/PhoneVerificationScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, PhoneAuthProvider, signInWithCredential, RecaptchaVerifier } from 'firebase/auth';

const PhoneVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone } = route.params || {};
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const auth = getAuth();

  const startPhoneVerification = async () => {
    setLoading(true);
    try {
      const recaptcha = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
  callback: () => console.log('Recaptcha resolved'),
}
      }, auth);

      const confirmation = await PhoneAuthProvider.verifyPhoneNumber(auth, phone, recaptcha);
      setVerificationId(confirmation);
// TODO: UX-safe alert refactor needed
    } catch (error) {
  console.error(error);
}
if (__DEV__) { Alert.alert('Error', 'Failed to send verification code.'); }
    }
    setLoading(false);
  };

  const confirmCode = async () => {
    if (!verificationId) {
// TODO: UX-safe alert refactor needed
if (__DEV__) { Alert.alert('Error', 'No verification ID found. Try again.'); }
      return;
    }

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      navigation.reset({ index: 0, routes: [{ name: 'EmailVerification' }] });
    } catch (err) {
if (__DEV__) {
  console.error(err);
}
// TODO: UX-safe alert refactor needed
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Phone</Text>
      <TouchableOpacity style={styles.button} onPress={startPhoneVerification}>
        <Text style={styles.buttonText}>Send Verification Code</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={confirmCode} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Confirm Code</Text>}
      </TouchableOpacity>

      <View id="recaptcha-container" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#000', padding: 20 },
  title: { fontSize: 22, color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#111', color: '#fff', padding: 12, borderRadius: 6, marginVertical: 10 },
  button: { backgroundColor: '#0f0', padding: 14, borderRadius: 6, marginTop: 10 },
  buttonText: { color: '#000', fontWeight: 'bold', textAlign: 'center' },
});

export default PhoneVerificationScreen;
