import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors, Layout } from '../utils/theme';

const REPORT_OPTIONS = ['Spam', 'Harassment', 'Inappropriate', 'Hate Speech', 'Other'];

export default function ReportModal({ visible, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit({ reason: selectedReason, message });
    setSelectedReason(null);
    setMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Report Content</Text>

          {REPORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, selectedReason === option && styles.selected]}
              onPress={() => setSelectedReason(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <TextInput
            placeholder="Optional message..."
            placeholderTextColor={Colors.placeholderText}
            style={styles.input}
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.submit}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    backgroundColor: Colors.background,
    padding: Layout.screenPadding,
    width: '90%',
    borderRadius: Layout.borderRadius,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  option: {
    padding: 10,
    backgroundColor: Colors.inputBackground,
    borderRadius: 6,
    marginVertical: 4,
  },
  selected: {
    backgroundColor: Colors.accent,
  },
  optionText: {
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    color: Colors.textPrimary,
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
    height: 80,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancel: {
    color: Colors.placeholderText,
  },
  submit: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
});
