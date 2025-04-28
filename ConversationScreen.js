// screens/ConversationScreen.js
import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useRef, useState } from 'react';
import { View, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Text } from 'react-native';
import { listenToThread, sendMessage, setTypingStatus, listenToTyping, markAsRead } from '../services/messageService';
import MessageBubble from '../components/MessageBubble';
import { useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function ConversationScreen() {
  const { theme } = useTheme();

const route = useRoute();
  const { threadId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const flatListRef = useRef();
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const unsubMessages = listenToThread(threadId, (msgs) => {
      setMessages(msgs);
      markAsRead(threadId, userId);
    });

    const unsubTyping = listenToTyping(threadId, (isTyping) => {
      setPeerTyping(isTyping);
    });

    return () => {
      unsubMessages();
      unsubTyping();
    };
  }, [threadId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setSending(true);
    await sendMessage(threadId, input.trim());
    setInput('');
    setSending(false);
    await setTypingStatus(threadId, false);
  };

  const handleTyping = (text) => {
    setInput(text);
    if (!typing) {
      setTyping(true);
      setTypingStatus(threadId, true);
    }

    if (text.trim() === '') {
      setTyping(false);
      setTypingStatus(threadId, false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      />
      {peerTyping && (
        <Text style={styles.typingIndicator}>They’re typing...</Text>
      )}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={handleTyping}
          placeholder="Type your message..."
          placeholderTextColor="#999"
        />
        <Button title="Send" onPress={handleSend} disabled={sending || !input.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderColor: '#333'
  },
  input: {
    flex: 1,
    color: theme.text,
    paddingHorizontal: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 6,
    marginRight: 10
  },
  typingIndicator: {
    color: theme.muted,
    fontSize: 12,
    paddingHorizontal: 15,
    paddingBottom: 5,
    fontStyle: 'italic'
  }
});
