// screens/ArmyBuilderPage.js
import React
import { useTheme } from '../context/ThemeContext';, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const { theme } = useTheme();

const ArmyBuilderPage = () => {
  const [unitName, setUnitName] = useState('');
  const [unitPoints, setUnitPoints] = useState('');
  const [units, setUnits] = useState([]);

  const handleAddUnit = () => {
    const points = parseInt(unitPoints, 10);
    if (!unitName || isNaN(points)) {
if (__DEV__) { Alert.alert('Invalid Input', 'Please enter a unit name and valid points.'); }
      return;
    }
    setUnits([...units, { name: unitName, points }]);
    setUnitName('');
    setUnitPoints('');
  };

  const handleRemoveUnit = (index) => {
    const filtered = units.filter((_, i) => i !== index);
    setUnits(filtered);
  };

  const totalPoints = units.reduce((sum, unit) => sum + unit.points, 0);

  const handleSave = () => {
if (__DEV__) {
}
if (__DEV__) { Alert.alert('Success', 'Army list saved locally (for now)'); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Army Builder</Text>
      <Text style={styles.subtitle}>Create and manage your army list</Text>

      <TextInput
        placeholder="Unit Name"
        value={unitName}
        onChangeText={setUnitName}
        style={styles.input}
      />
      <TextInput
        placeholder="Points"
        value={unitPoints}
        onChangeText={setUnitPoints}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Unit" onPress={handleAddUnit} />

      <FlatList
        data={units}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.unitCard}>
            <Text style={styles.unitText}>{item.name} – {item.points} pts</Text>
            <TouchableOpacity onPress={() => handleRemoveUnit(index)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No units added yet.</Text>}
        style={{ marginVertical: 20 }}
      />

      <Text style={styles.total}>Total Points: {totalPoints}</Text>
      <Button title="Save Army List" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.background },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.accent, marginBottom: 10 },
  subtitle: { fontSize: 16, color: theme.subtle, marginBottom: 20 },
  input: {
    height: 40,
    backgroundColor: theme.card,
    color: theme.text,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  unitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  unitText: { color: theme.text },
  remove: { color: theme.accent },
  total: { fontSize: 16, fontWeight: 'bold', color: '#0f0', marginBottom: 10 },
  empty: { color: '#666', textAlign: 'center', marginVertical: 20 },
});

export default ArmyBuilderPage;
