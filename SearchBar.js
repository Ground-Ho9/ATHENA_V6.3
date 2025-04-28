// components/SearchBar.js
import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SearchBar({ mode = 'users' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/search/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
  console.error('Search failed:', err);
}
    }
  };

  const handleSelect = (item) => {
    if (mode === 'users') {
      navigation.navigate('Profile', { userId: item.id });
    }
    // Extend this for products, posts, news, tournaments, etc.
  };

  return (
    <View style={styles.container}>
<TextInput placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        placeholder="Search..."
        placeholderTextColor="#888"
        style={styles.input}
      />
      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.result}>
            <Text style={styles.resultText}>{item.username || item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.results}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#1F1F1F' },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  results: {
    backgroundColor: '#1F1F1F'
  },
  result: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  resultText: {
    color: '#F0F0F0'
  }
});