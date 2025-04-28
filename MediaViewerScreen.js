import React
import { useTheme } from '../context/ThemeContext'; from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function MediaViewerScreen() {
  const { theme } = useTheme();

const navigation = useNavigation();
  const route = useRoute();
  const { imageUrl } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      <TouchableOpacity onPress={() => navigation.navigate('ChangeAvatar')} style={styles.link}>
        <Text style={styles.linkText}>[ Change Avatar ]</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '80%' },
  link: { marginTop: 20 },
  linkText: { color: theme.accent, fontSize: 16 }
});