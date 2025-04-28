// components/JoinButton.js
import React from 'react';
import { Button, Alert } from 'react-native';

export default function JoinButton({ tournamentId }) {
  const handleJoin = () => {
    // Hook into future join logic
if (__DEV__) { Alert.alert('Joined Tournament', `ID: ${tournamentId}`); }
  };

  return <Button title="Join" onPress={handleJoin} color="#ED1C24" />;
}