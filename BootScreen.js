
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { redeemQRCode } from '../services/qrService'; // Existing service

const bootSequenceLines = [
  '>> Initializing A.T.H.E.N.A...',
  '>> AUTHENTICATION REQUIRED [SCAN QR / LOG IN]',
];

const postAuthSequence = [
  '>> AUTHORIZATION CONFIRMED',
  '>> SYNCING SECURE PROTOCOLS...',
  '>> CONNECTION STABILIZED',
  '>> ACCESS LEVEL: OPERATIVE',
  '>> DEPLOYING INTERFACE...',
];

const asciiArt = `
                                        
             %%*=+%%%%%%%%%             
          %%%%%*====*%%%%%%%%%          
        %%%%%%%*======*%%#===*%%%       
      %%*++++==============%+*%%%%%     
    %%%%%%+=============+%#+*#%%%%%%    
   %%%%*+*=======+======*#%#%%%%%%%%%   
   %%%%%%*==*%+==========#%%%%%%%%%%%%  
  %%%%%%%%==+%*==%#+%#====%%%%%%%%%%%%  
  %%%%%%%%*==*%*=+%%%%%+==+%%%%%%%%%%%  
  %%%%%%%%%===*%==*%%%%%%==+%%%%%%%%%%  
  %%%%%%%%%%+==*===%%%%%%%#==#%%%%%%%%  
  %%%%%%%%%%%+==+==%%%%%%%%%*=*%%%%%%%  
   %%%%%%%%%%%+===%%%%%%%%%%%%#*#%%%%%  
   %%%#%%%%%%#=+===*%%%%%%%%%*##%%%%%   
    %%%%%%%%*+=+%*==+%%%%%%%+**#*%%%    
     %%%%%%+==+++=+===+*=*%#+%+#%%%     
       *=====+**+===+====*%%%%%%%       
         %%%%%%%###+====*****+=         
             %%%%%%%%%%%%%%             
`;

export default function BootScreen() {
  const [linesToShow, setLinesToShow] = useState([]);
  const [showArt, setShowArt] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < bootSequenceLines.length) {
        setLinesToShow(prev => [...prev, bootSequenceLines[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 900);

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => clearInterval(interval);
  }, []);

  const handleAuthenticate = () => {
    setScannerActive(true);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScannerActive(false);
    try {
      await redeemQRCode(data);
      runPostAuthSequence();
    } catch (error) {
      console.error('QR Redemption failed:', error);
      setLinesToShow(prev => [...prev, '>> ERROR: INVALID QR CODE. RETRY.']);
    }
  };

  const runPostAuthSequence = () => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < postAuthSequence.length) {
        setLinesToShow(prev => [...prev, postAuthSequence[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setShowArt(true);
        setTimeout(() => {
          navigation.navigate('MainDrawer'); // Adjust if your main nav is named differently
        }, 5000);
      }
    }, 700);
  };

  if (scannerActive) {
    return (
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {linesToShow.map((line, idx) => (
        <Text key={idx} style={styles.text}>{line}</Text>
      ))}
      {!showArt && linesToShow.includes(bootSequenceLines[1]) && (
        <TouchableOpacity onPress={handleAuthenticate}>
          <Text style={styles.authText}>[ TAP TO SCAN QR CODE ]</Text>
        </TouchableOpacity>
      )}
      {showArt && <Text style={styles.ascii}>{asciiArt}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'flex-start',
  },
  text: {
    color: '#33FF99',
    fontFamily: 'monospace',
    fontSize: 16,
    marginBottom: 5,
  },
  authText: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 18,
    marginTop: 20,
  },
  ascii: {
    color: '#33FF99',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 30,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
