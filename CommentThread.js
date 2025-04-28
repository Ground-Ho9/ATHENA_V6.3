// components/CommentThread.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTopCommentsForPost } from '../services/postService';

export default function CommentThread({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getTopCommentsForPost(postId);
      setComments(data);
    };
    load();
  }, [postId]);

  return (
    <View style={styles.thread}>
      {comments.map((c, i) => (
        <Text key={i} style={styles.comment}>
          <Text style={styles.author}>{c.author}:</Text> {c.text}
        </Text>
      ))}
      {comments.length > 3 && (
        <Text style={styles.more}>View more comments...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  thread: { marginTop: 10 },
  comment: { color: '#CCC', fontSize: 13, marginBottom: 4 },
  author: { fontWeight: 'bold', color: '#FFF' },
  more: { color: '#888', fontStyle: 'italic', marginTop: 6 }
});