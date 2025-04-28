import React
import { useTheme } from '../context/ThemeContext';, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors, Layout, Typography } from '../utils/theme';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import PostCard from '../components/PostCard';
import { UserContext } from '../context/UserContext';

export default function SavedPostsScreen() {
  const { theme } = useTheme();

const { user } = useContext(UserContext);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;
      const bookmarks = userSnap.data().bookmarks || [];
      const postRefs = userSnap.data().postRefs || {};

      const posts = [];

      for (let uid of Object.keys(postRefs)) {
        for (let pid of postRefs[uid] || []) {
          if (bookmarks.includes(pid)) {
            const postRef = doc(db, 'users', uid, 'posts', pid);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
              posts.push({ id: pid, uid, ...postSnap.data() });
            }
          }
        }
      }

      setSavedPosts(posts);
    };

    fetchBookmarks();
  }, [user.uid]);

  return (
    <View style={styles.container}>
      <Text style={Typography.title}>Saved Posts</Text>
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} currentUserId={user.uid} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Layout.screenPadding,
  },
});
