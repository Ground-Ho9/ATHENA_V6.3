import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../utils/theme';

export default function AvatarBlock({ scrollY }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <Text style={styles.username}>@Groundhog</Text>
      <Text style={styles.bio}>
        Tactical strategist. Builder of worlds. Dominatus in motion.
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>+ Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.msgButton}>
          <Text style={styles.msgText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: fonts.subtitle,
    color: colors.text,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: fonts.body,
    color: colors.secondaryText,
    textAlign: 'center',
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  followText: {
    color: 'white',
    fontWeight: 'bold',
  },
  msgButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  msgText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
