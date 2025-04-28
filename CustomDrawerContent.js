import React
import auth from '@react-native-firebase/auth'; from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import SearchBar from '../components/SearchBar';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#1F1F1F' }}>
      <View style={styles.header}>
        <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatar} />
        <Text style={styles.username}>Operator</Text>
      </View>
      <View style={styles.searchWrapper}>
        <SearchBar mode="users" />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 10
  },
  username: {
    color: '#F0F0F0',
    fontSize: 18
  },
  searchWrapper: {
    paddingHorizontal: 10,
    paddingTop: 10
  }
});