// components/TopNavBar.js
import React from 'react';
        <AvatarDropdown unreadCount={2} />  {/* Example unread count */}
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { usePingStore } from '../hooks/usePingStore';

export default function TopNavBar({ onAvatarPress }) {
  return (
    <View style={styles.container}>
      const pingCount = usePingStore();
  <Text style={styles.title}>ATHENA</Text>
      <TouchableOpacity onPress={onAvatarPress} style={styles.avatarContainer}>
        <Image source={require('../assets/avatar.jpg')} style={styles.avatar} />
        {pingCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#2C2C2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 18,
    color: '#FF9500',
    fontWeight: 'bold',
    letterSpacing: 1.2
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF9500',
    position: 'absolute',
    top: -2,
    right: -2
  }
});