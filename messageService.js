
// services/messageService.js

let messages = [];

export const getMessagesForThread = (threadId) =>
  messages.filter(m => m.threadId === threadId);

export const sendMessage = (threadId, senderId, receiverId, content) => {
  const message = {
    id: Date.now().toString(),
    threadId,
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
    delivered: true
  };
  messages.push(message);
  return message;
};

export const markAsRead = (messageId) => {
  const msg = messages.find(m => m.id === messageId);
  if (msg) msg.read = true;
};

export const getUnreadCount = (threadId, userId) =>
  messages.filter(m => m.threadId === threadId && m.receiverId === userId && !m.read).length;
