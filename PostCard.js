// components/PostCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ReactionBar from './ReactionBar';
import CommentThread from './CommentThread';

export default function PostCard({ post }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.author}</Text>
      <Text style={styles.body}>{post.content}</Text>
      <ReactionBar postId={post.id} />
      <CommentThread postId={post.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1F1F1F', padding: 12, borderRadius: 8, marginBottom: 12 },
  title: { fontWeight: 'bold', color: '#FFF', fontSize: 16 },
  body: { color: '#DDD', marginVertical: 8 }
});