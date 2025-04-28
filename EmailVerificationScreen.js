
// screens/EmailVerificationScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, reload, sendEmailVerification } from 'firebase/auth';

const EmailVerificationScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [checking, setChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const checkVerification = async () => {
    setChecking(true);
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
if (__DEV__) { Alert.alert('Success', 'Email verified successfully.'); }
        navigation.reset({ index: 0, routes: [{ name: 'MyProfile' }] });
      } else {
// TODO: UX-safe alert refactor needed
      }
    } catch (err) {
if (__DEV__) {
  console.error(err);
}
if (__DEV__) { Alert.alert('Error', 'Could not check verification status.'); }
    }
    setChecking(false);
  };

  const handleResend = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
// TODO: UX-safe alert refactor needed
if (__DEV__) { Alert.alert('Sent', 'Verification email resent.'); }
      setResendCooldown(60);
    } catch (err) {
  console.error(err);
}
// TODO: UX-safe alert refactor needed
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>A verification link has been sent to your email.</Text>
      <Text style={styles.subtext}>Please verify and then tap below:</Text>
      <TouchableOpacity style={styles.button} onPress={checkVerification}>
        {checking ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>I’ve Verified My Email</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: resendCooldown > 0 ? '#555' : '#0f0' }]}
        onPress={handleResend}
        disabled={resendCooldown > 0}
      >
        <Text style={styles.buttonText}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 20 },
  text: { fontSize: 18, color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtext: { fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#0f0', padding: 14, borderRadius: 6, marginVertical: 10, width: '100%' },
  buttonText: { textAlign: 'center', fontWeight: 'bold', color: '#000' },
});

export default EmailVerificationScreen;
