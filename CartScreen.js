// screens/CartScreen.js
import React
import { showToast } from '../components/ToastService';
import { useTheme } from '../context/ThemeContext';, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { getCart, removeFromCart, getCartTotal, clearCart } from '../services/ecommerceService';
import { processPayment, initializePayments } from '../services/paymentService';
import { formatCurrency } from '../utils/formatCurrency';

export default function CartScreen() {
  const { theme } = useTheme();

const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    initializePayments();
    setCartItems(getCart());
    setTotal(getCartTotal());
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    setCartItems(getCart());
    setTotal(getCartTotal());
  };

  const handleCheckout = async () => {
    try {
      const paymentResult = await processPayment(total);
      if (paymentResult.success) {
showToast(`Transaction Successful: ${paymentResult.transactionId}`, 'success');
        clearCart();
        setCartItems([]);
        setTotal(0);
      }
    } catch (error) {
// TODO: UX-safe alert refactor needed
showToast(`Payment Error: ${error.message}`, 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.itemText}>
                  {item.name} - {formatCurrency(item.price)}
                </Text>
                <Button title="Remove" onPress={() => handleRemove(item.id)} />
              </View>
            )}
          />
          <Text style={styles.total}>Total: {formatCurrency(total)}</Text>
          <View style={styles.buttonWrap}>
            <Button title="Checkout" onPress={handleCheckout} disabled={cartItems.length === 0} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.card },
  title: { fontSize: 24, color: theme.subtle, marginBottom: 20, textAlign: 'center' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  itemText: { color: theme.text, fontSize: 16 },
  total: { fontSize: 20, color: theme.accent, marginTop: 20, textAlign: 'center' },
  empty: { color: theme.muted, textAlign: 'center', marginTop: 40 },
  buttonWrap: { marginTop: 20 }
});
