// services/dmService.js
let conversations = {};

export const sendMessage = (fromUserId, toUserId, message) => {
  const timestamp = Date.now();
  const key = [fromUserId, toUserId].sort().join('_');
  if (!conversations[key]) conversations[key] = [];
  conversations[key].push({ fromUserId, toUserId, message, timestamp });
};

export const fetchConversations = (userId) => {
  return Object.entries(conversations)
    .filter(([key, _]) => key.includes(userId))
    .map(([key, msgs]) => ({ key, messages: msgs }));
};

export const fetchMessages = (fromUserId, toUserId) => {
  const key = [fromUserId, toUserId].sort().join('_');
  return conversations[key] || [];
};