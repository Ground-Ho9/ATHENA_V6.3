// components/BottomNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack}>
        <Text style={styles.back}>{"← Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.version}>v0.9.3-alpha</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1A1A1A'
  },
  back: {
    color: '#ED1C24',
    fontSize: 14
  },
  version: {
    color: '#888',
    fontSize: 12
  }
});
