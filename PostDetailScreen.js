import React
import { useTheme } from '../context/ThemeContext'; from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PostCard from '../components/PostCard';
import CommentBlock from '../components/CommentBlock';

export default function PostDetailScreen() {
  const { theme } = useTheme();

const route = useRoute();
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <PostCard post={post} fullView />
      <CommentBlock postId={post.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 16
  }
});