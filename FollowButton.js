
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { followUser, unfollowUser, isFollowing } from '../services/followService';
import { getAuth } from 'firebase/auth';

const FollowButton = ({ targetUserId }) => {
  const [following, setFollowing] = useState(false);
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (currentUserId && targetUserId) {
        const status = await isFollowing(currentUserId, targetUserId);
        setFollowing(status);
      }
    };
    checkFollowStatus();
  }, [currentUserId, targetUserId]);

  const toggleFollow = async () => {
    if (following) {
      await unfollowUser(currentUserId, targetUserId);
    } else {
      await followUser(currentUserId, targetUserId);
    }
    setFollowing(!following);
  };

  return (
    <Button
      title={following ? "Unfollow" : "Follow"}
      onPress={toggleFollow}
      color={following ? "#888" : "#00AEEF"}
    />
  );
};

export default FollowButton;
