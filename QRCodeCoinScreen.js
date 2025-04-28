
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming firebase.js exports your initialized db

export default function QRCodeCoinScreen() {
  const [scannerActive, setScannerActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();

  const handleOpenScanner = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    setScannerActive(true);
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScannerActive(false);
    try {
      // Assume scanned 'data' is UID or a pointer
      const userDocRef = doc(db, 'users', data);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        navigation.navigate('ProfileScreen', { userId: data });
      } else {
        alert('Invalid QR code or player not found.');
      }
    } catch (error) {
      console.error('Scan lookup failed:', error);
      alert('Error scanning QR code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Existing 3D Challenge Coin Display would be here */}
      <Text style={styles.title}>Your Operative Challenge Coin</Text>

      <TouchableOpacity style={styles.scanButton} onPress={handleOpenScanner}>
        <Text style={styles.scanButtonText}>SCAN PLAYER QR</Text>
      </TouchableOpacity>

      {/* Scanner Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={scannerActive}
        onRequestClose={() => setScannerActive(false)}
      >
        <View style={styles.scannerContainer}>
          {hasPermission === null ? (
            <Text style={styles.text}>Requesting camera permission...</Text>
          ) : hasPermission === false ? (
            <Text style={styles.text}>No access to camera</Text>
          ) : (
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <TouchableOpacity style={styles.cancelButton} onPress={() => setScannerActive(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#33FF99',
    fontFamily: 'monospace',
    fontSize: 20,
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: '#33FF99',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  scanButtonText: {
    color: '#000',
    fontFamily: 'monospace',
    fontSize: 18,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#33FF99',
    fontFamily: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#FF3333',
    padding: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 16,
  },
});
