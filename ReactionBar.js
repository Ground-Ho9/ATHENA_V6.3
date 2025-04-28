// components/ReactionBar.js
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { reactToPost, getPostReactions } from '../services/postService';

const reactionOptions = ['Like', 'Insightful', 'Question', 'Boost'];

export default function ReactionBar({ postId }) {
  const [reactions, setReactions] = useState({});
  const [userReacted, setUserReacted] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getPostReactions(postId);
      setReactions(data.counts);
      setUserReacted(data.userReaction);
    };
    fetch();
  }, [postId]);

  const handleReaction = async (type) => {
    const newReaction = await reactToPost(postId, type);
    setReactions(newReaction.counts);
    setUserReacted(newReaction.userReaction);
  };

  return (
    <View style={styles.bar}>
      {reactionOptions.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => handleReaction(type)}
          style={[
            styles.button,
            userReacted === type && styles.selected
          ]}
        >
          <Text style={styles.text}>{type} {reactions[type] || 0}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  button: { padding: 6, backgroundColor: '#333', borderRadius: 4 },
  selected: { backgroundColor: '#ED1C24' },
  text: { color: '#FFF' }
});