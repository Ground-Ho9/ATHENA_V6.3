import React
import { useTheme } from '../context/ThemeContext';, { useState } from 'react';
import { showToast } from '../components/ToastService';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function NewPostScreen() {
  const { theme } = useTheme();

const [content, setContent] = useState('');
  const navigation = useNavigation();
  const { user } = useUser();

  const handlePost = async () => {
    if (!content.trim()) {
showToast('Post cannot be empty.', 'error');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        uid: user.uid,
        displayName: user.displayName || 'Operator',
        avatarUrl: user.avatarUrl || '',
        content: content.trim(),
        createdAt: Timestamp.now(),
        reactions: {},
        comments: []
      });

// TODO: UX-safe alert refactor needed
showToast('Post uploaded.', 'success');
      setContent('');
      navigation.goBack();
    } catch (err) {
if (__DEV__) {
// Log redirected for dev, production-safe output follows
console.log('Post failed:', err);
}
// TODO: UX-safe alert refactor needed
showToast('Failed to post.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>MISSION LOG / FIELD UPDATE</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter message..."
        placeholderTextColor=theme.muted
        value={content}
        multiline
        numberOfLines={6}
        onChangeText={setContent}
      />
      <Button title="Transmit" onPress={handlePost} color=theme.accent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 20,
    justifyContent: 'center'
  },
  label: {
    color: theme.subtle,
    fontSize: 16,
    marginBottom: 10,
    letterSpacing: 1
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: theme.subtle,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 150,
    textAlignVertical: 'top'
  }
});