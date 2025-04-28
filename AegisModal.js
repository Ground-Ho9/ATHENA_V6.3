import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { askAegis } from '../services/aegisService';

export default function AegisModal({ visible, onClose }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await askAegis(input.trim());
    setResponse(res);
    setLoading(false);
    setInput('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>A.E.G.I.S.</Text>
          <ScrollView style={styles.body}>
            <Text style={styles.response}>{loading ? 'Processing...' : response}</Text>
          </ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Query AEGIS..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#888"
          />
          <Button title="Ask" onPress={handleAsk} color="#ED1C24" />
          <Button title="Close" onPress={onClose} color="#444" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '90%',
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 12
  },
  header: {
    fontSize: 20,
    color: '#ED1C24',
    fontWeight: 'bold',
    marginBottom: 10
  },
  body: {
    height: 120,
    marginBottom: 10
  },
  response: {
    color: '#FFF',
    fontSize: 14
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  }
});