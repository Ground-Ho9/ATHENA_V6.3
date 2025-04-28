// components/PostFeed.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { collection, query, where, orderBy, onSnapshot, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import PostCard from './PostCard';
import auth from '@react-native-firebase/auth';

export default function PostFeed({ userId = null, curated = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  useEffect(() => {
    let unsubscribe;
    const postsRef = collection(db, 'posts');

    const fetchPosts = async () => {
      try {
        let q;

        if (userId) {
          // Specific user's posts
          q = query(postsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(20));
        } else if (curated) {
          // Curated feed: own posts + followed + fallback
          const followSnap = await getDocs(collection(db, 'users', currentUser.uid, 'following'));
          const followingIds = followSnap.docs.map(doc => doc.id);
          const selfId = currentUser.uid;

          if (followingIds.length > 0) {
            q = query(postsRef, where('userId', 'in', [...followingIds, selfId]), orderBy('createdAt', 'desc'), limit(30));
          } else {
            // Fallback to top posts or recent news
            q = query(postsRef, orderBy('likes', 'desc'), limit(10));
          }
        } else {
          // Generic recent feed
          q = query(postsRef, orderBy('createdAt', 'desc'), limit(30));
        }

        unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(fetchedPosts);
          setLoading(false);
        });
      } catch (error) {
  console.error('Error fetching posts:', error);
}
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, curated, currentUser?.uid]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} color="#ED1C24" />;
  }

  if (posts.length === 0) {
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center',
    color: '#AAA',
    marginTop: 20,
    fontSize: 16
  }
});

  if (loading) return <Text>Loading...</Text>;
  if (!posts.length) return <Text>No posts</Text>;
