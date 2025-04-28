
// services/feedService.js

import { getAllPosts } from '../utils/mockData'; // Replace with real Firebase pull

export const getCuratedFeed = (currentUserId, followedUsers = [], tournamentIds = []) => {
  const allPosts = getAllPosts(); // Placeholder - integrate real DB fetch
  const now = new Date().getTime();

  return allPosts
    .map(post => {
      let score = 0;

      if (post.authorId === currentUserId) score += 3;
      if (followedUsers.includes(post.authorId)) score += 2;
      if (tournamentIds.includes(post.tournamentId)) score += 1;
      if (post.tags && post.tags.includes('system-broadcast')) score += 5;
      if (post.reactions && post.reactions[currentUserId]) score += 2;

      // Time decay
      const hoursOld = (now - new Date(post.timestamp).getTime()) / 3600000;
      const decay = Math.max(0, 10 - hoursOld); // cap influence to 10 hrs
      score += decay * 0.25;

      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score);
};
