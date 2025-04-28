// components/PingBannerOverlay.js
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { usePingBanner } from '../context/PingBannerContext';

export default function PingBannerOverlay() {
  const { ping } = usePingBanner();

  if (!ping) return null;

  return (
    <Animated.View style={styles.container}>
      <Text style={styles.text}>{ping.type}: {ping.payload?.message || 'New ping received'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 10,
    backgroundColor: '#FFB400',
    zIndex: 1000,
    elevation: 10,
    alignItems: 'center'
  },
  text: {
    color: '#111',
    fontWeight: '600',
    fontSize: 14
  }
});