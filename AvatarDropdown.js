// components/AvatarDropdown.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function AvatarDropdown({ unreadCount }) {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const toggleDropdown = () => setVisible(!visible);
  const handleNavigate = (screen) => {
    setVisible(false);
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    await auth().signOut();
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown}>
        <View style={styles.avatarCircle}>
          {/* Replace with dynamic avatar if available */}
          <Text style={styles.avatarText}>A</Text>
          {unreadCount > 0 && (
            <View style={styles.pingBadge}>
              <Text style={styles.pingText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={toggleDropdown}>
          <View style={styles.dropdown}>
            <Pressable onPress={() => handleNavigate('UserProfile')}>
              <Text style={styles.item}>View Profile</Text>
            </Pressable>
            <Pressable onPress={() => handleNavigate('DirectMessagesScreen')}>
              <Text style={styles.item}>
                Messages{unreadCount > 0 ? ` (${unreadCount})` : ''}
              </Text>
            </Pressable>
            <Pressable onPress={() => handleNavigate('SettingsScreen')}>
              <Text style={styles.item}>Settings</Text>
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Text style={styles.logout}>Logout</Text>
            </Pressable>
          
        <Pressable style={styles.menuItem} onPress={() => handleNavigate('NotificationHub')}>
          <Text style={styles.menuText}>Notifications</Text>
        </Pressable>
</View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#2C2C2C', justifyContent: 'center', alignItems: 'center',
    position: 'relative'
  },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  pingBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#ED1C24', borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4
  },
  pingText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  dropdown: {
    backgroundColor: '#1F1F1F', padding: 12, borderRadius: 8,
    marginTop: 48, marginRight: 12, elevation: 5
  },
  item: { color: '#F0F0F0', fontSize: 14, paddingVertical: 6 },
  logout: { color: '#ED1C24', fontSize: 14, paddingVertical: 6 }
});