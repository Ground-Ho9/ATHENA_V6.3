import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function FloatingAegisButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Image source={require('../assets/aegis_avatar.png')} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'transparent',
    borderRadius: 40,
    overflow: 'hidden',
    width: 64,
    height: 64,
    elevation: 5,
    zIndex: 100
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  }
});