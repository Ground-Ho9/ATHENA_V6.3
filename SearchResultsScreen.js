
// screens/SearchResultsScreen.js

import React
import { useTheme } from '../context/ThemeContext';, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { searchElastic } from '../services/elasticSearchService';

export default function SearchResultsScreen() {
  const { theme } = useTheme();

const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query.trim().length > 0) {
      const data = await searchElastic(query);
      setResults(data);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(handleSearch, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const groupByType = (type) => results.filter(r => r._type === type);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search Athena..."
        placeholderTextColor=theme.muted
        value={query}
        onChangeText={setQuery}
      />
      {['users', 'posts', 'tournaments'].map(type => (
        <View key={type}>
          <Text style={styles.header}>{type.toUpperCase()}</Text>
          <FlatList
            data={groupByType(type)}
            keyExtractor={(item, index) => `${type}_${index}`}
            renderItem={({ item }) => (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>{item.displayName || item.title || item.username}</Text>
                <Text style={styles.resultDetail}>{item.body || item.tagline || item.location}</Text>
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101010', padding: 16 },
  searchBox: { backgroundColor: '#222', color: theme.text, padding: 10, borderRadius: 8 },
  header: { color: '#ED6A0C', marginTop: 16, fontWeight: 'bold', fontSize: 16 },
  resultCard: { padding: 8, borderBottomColor: '#333', borderBottomWidth: 1 },
  resultTitle: { color: theme.text, fontSize: 16 },
  resultDetail: { color: theme.muted, fontSize: 13 }
});
