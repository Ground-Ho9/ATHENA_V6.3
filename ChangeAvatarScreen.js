// screens/ChangeAvatarScreen.js
import React
import { showToast } from '../components/ToastService';
import { useTheme } from '../context/ThemeContext';, { useState } from 'react';
import { View, Button, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../context/UserContext';
import { uploadAvatar } from '../services/mediaUploadService';

export default function ChangeAvatarScreen() {
  const { theme } = useTheme();

const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
showToast('We need access to change your avatar.', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      try {
        setLoading(true);
        const localUri = result.assets[0].uri;
        const response = await fetch(localUri);
        const blob = await response.blob();
        const url = await uploadAvatar(blob, user.uid);
showToast('Your avatar has been updated.', 'success');
      } catch (err) {
showToast(err.message || 'Failed to upload avatar.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {user?.avatarUrl && (
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
      )}
      {loading ? (
        <ActivityIndicator color=theme.accent size="large" style={{ marginVertical: 20 }} />
      ) : (
        <Button title="Choose New Avatar" onPress={handleChange} color=theme.accent />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center' },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.accent,
  }
});
