import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const APP_VERSION = 'v0.9.12-alpha';

export default function BottomToolbar() {
  const navigation = useNavigation();
  const route = useRoute();
  const showBack = route.name !== 'Home';

  return (
    <View style={styles.toolbar}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ED1C24" />
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text style={styles.version}>{APP_VERSION}</Text>
      <View style={styles.rightSpace} />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    height: 50,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  backButton: {
    padding: 10
  },
  backPlaceholder: {
    width: 44 // Space to match back button
  },
  version: {
    color: '#777',
    fontSize: 14
  },
  rightSpace: {
    width: 44
  }
});