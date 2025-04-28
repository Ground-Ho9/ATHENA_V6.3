// screens/DirectMessagesScreen.js

import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';
import {
  listenToThread,
  sendMessage,
  markAsRead
} from '../services/messageService';
import auth from '@react-native-firebase/auth';

export default function DirectMessagesScreen({ route }) {
  const { theme } = useTheme();

const { threadId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef();
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const unsub = listenToThread(threadId, (msgs) => {
      setMessages(msgs);
      markAsRead(threadId, userId);
    });
    return () => unsub();
  }, [threadId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    await sendMessage(threadId, input.trim());
    setInput('');
    setSending(false);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === userId ? styles.outgoing : styles.incoming
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.statusText}>
        {item.read ? '✓✓ Read' : item.delivered ? '✓ Delivered' : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          placeholderTextColor=theme.muted
        />
        <Button title="Send" onPress={handleSend} disabled={sending || !input.trim()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', padding: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopColor: '#222',
    borderTopWidth: 1
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    color: theme.text,
    padding: 10,
    borderRadius: 8,
    marginRight: 8
  },
  messageBubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%'
  },
  outgoing: { backgroundColor: '#1E3A5F', alignSelf: 'flex-end' },
  incoming: { backgroundColor: '#333', alignSelf: 'flex-start' },
  messageText: { color: theme.text },
  statusText: { fontSize: 10, color: theme.muted, marginTop: 4 }
});
