import React
import { showToast } from '../components/ToastService';
import { useTheme } from '../context/ThemeContext'; from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { addToCart } from '../services/ecommerceService';
import { formatCurrency } from '../utils/formatCurrency';

const { theme } = useTheme();

const products = [
  { id: 'p1', name: 'Starter Box Set', price: 99.99 },
  { id: 'p2', name: 'Challenge Coin', price: 75.00 },
  { id: 'p3', name: 'Rulebook', price: 25.00 }
];

export default function StoreScreen() {
  const handleAddToCart = (product) => {
    addToCart(product);
showToast(`${product.name} added to cart.`, 'info');
showToast(`${product.name} added to cart.`, 'info');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text style={styles.productText}>{item.name} - {formatCurrency(item.price)}</Text>
            <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.card },
  title: { fontSize: 24, color: theme.subtle, marginBottom: 20 },
  product: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  productText: { color: theme.text, fontSize: 16 }
});