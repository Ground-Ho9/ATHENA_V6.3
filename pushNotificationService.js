// services/pingService.js
import { getPingBanner } from '../context/PingBannerContext';

let pings = [];

export const triggerPing = ({ type, fromUserId, toUserId, payload }) => {
  const timestamp = Date.now();
  const ping = { type, fromUserId, toUserId, payload, timestamp };
  pings.push(ping);
  console.log('Ping:', ping);
}

  try {
    const showPing = getPingBanner();
    if (showPing) showPing(ping);
  } catch (e) {
if (__DEV__) {
}
  }
};

export const fetchUserPings = (userId) => {
  return pings.filter(p => p.toUserId === userId);
};

export const clearPingsForUser = (userId) => {
  pings = pings.filter(p => p.toUserId !== userId);
};