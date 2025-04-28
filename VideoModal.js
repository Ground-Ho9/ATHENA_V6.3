import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../utils/theme';

export default function VideoModal({ visible, uri, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <FontAwesome name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Video
          source={{ uri }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          shouldPlay
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
  },
});
