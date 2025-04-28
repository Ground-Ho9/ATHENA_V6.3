// hooks/usePingStore.js
import { useState, useEffect } from 'react';

let listeners = [];
let unread = 0;

export const usePingStore = () => {
  const [count, setCount] = useState(unread);

  useEffect(() => {
    const listener = (newCount) => setCount(newCount);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return count;
};

export const incrementUnread = () => {
  unread += 1;
  listeners.forEach(fn => fn(unread));
};

export const clearUnread = () => {
  unread = 0;
  listeners.forEach(fn => fn(unread));
};