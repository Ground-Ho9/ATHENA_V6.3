// components/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function MessageBubble({ message }) {
  const isMe = message.senderId === auth().currentUser?.uid;

  return (
    <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    margin: 6,
    borderRadius: 10,
    maxWidth: '80%'
  },
  bubbleLeft: {
    backgroundColor: '#333',
    alignSelf: 'flex-start'
  },
  bubbleRight: {
    backgroundColor: '#ED1C24',
    alignSelf: 'flex-end'
  },
  text: { color: '#FFF' }
});