import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../utils/theme';
import { toggleBookmark, isPostBookmarked } from '../services/bookmarkService';

export default function BookmarkButton({ postId, userId, bookmarks = [], refreshUserData }) {
  const bookmarked = isPostBookmarked(bookmarks, postId);

  const handlePress = async () => {
    await toggleBookmark(userId, postId);
    if (refreshUserData) refreshUserData();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <FontAwesome
        name={bookmarked ? 'bookmark' : 'bookmark-o'}
        size={20}
        color={bookmarked ? Colors.accent : Colors.placeholderText}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    marginRight: 10,
  },
});
