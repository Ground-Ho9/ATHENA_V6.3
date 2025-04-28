import React, { useState } from 'react';
import FloatingAegisButton from '../components/FloatingAegisButton';
import AegisModal from '../components/AegisModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import TopNavBar from '../components/TopNavBar';
import BottomToolbar from '../components/BottomToolbar';

export default function ScreenWithNav({ component: Component, ...props }) {
    const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopNavBar />
        <View style={styles.content}>
          <Component {...props} />
        </View>
        <BottomToolbar />
      </View>
          <FloatingAegisButton onPress={() => setModalVisible(true)} />
      <AegisModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1F1F1F'
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8
  }
});