// screens/SettingsScreen.js
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { Loadouts } from '../styles/themes';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { operatorStyles } from '../styles/operatorStyles';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { Loadouts } from '../styles/themes';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { Loadouts } from '../styles/themes';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { operatorStyles } from '../styles/operatorStyles';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { Loadouts } from '../styles/themes';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';

export default function SettingsScreen() {
  const { theme } = useTheme();

const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Operator Mode</Text>
        <Switch accessible={true} accessibilityLabel="Toggle Operator Mode" accessibilityHint="Enable high contrast mode for better visibility"
          value={isOperatorMode}
          onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); toggleOperatorMode(); }}
          thumbColor={isOperatorMode ? '#FF6F00' : theme.muted}
          trackColor={{ false: '#666', true: '#3B4A2F' }}
        />
      </View>
      <Text style={styles.optionNote}>High Contrast Tactical UI for Accessibility</Text>

      <Text style={styles.header}>Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch accessible={true} accessibilityLabel="Toggle Operator Mode" accessibilityHint="Enable high contrast mode for better visibility" value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch accessible={true} accessibilityLabel="Toggle Operator Mode" accessibilityHint="Enable high contrast mode for better visibility" value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Public Profile</Text>
        <Switch accessible={true} accessibilityLabel="Toggle Operator Mode" accessibilityHint="Enable high contrast mode for better visibility" value={publicProfile} onValueChange={setPublicProfile} />
      </View>

      <Text style={styles.footer}>More options coming soon...</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 20 },
  header: { color: theme.subtle, fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  setting: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20
  },
  label: { color: theme.subtle, fontSize: 16 },
  footer: { color: theme.muted, fontSize: 14, textAlign: 'center', marginTop: 40 }
});