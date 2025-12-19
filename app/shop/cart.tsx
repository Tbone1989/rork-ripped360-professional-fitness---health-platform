import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useShopStore } from '@/store/shopStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CartScreen() {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateCartItem,
    clearCart,
  } = useShopStore();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    const url = `https://www.rippedcityinc.com/cart`;
    const encoded = encodeURIComponent(url);
    router.push((`/shop/web-checkout?url=${encoded}`) as never);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Shopping Cart' }} />
        
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color={colors.text.secondary} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our products and add items to your cart
          </Text>
          <Button
            title="Continue Shopping"
            onPress={() => router.back()}
            style={styles.continueButton}
          />
        </View>
      </View>
    );
  }

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shopping Cart',
          headerRight: () => (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cartItems.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.itemContent}>
                <Image
                  source={{ uri: item.product.images[0] }}
                  style={styles.itemImage}
                />
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  
                  {item.selectedSize && (
                    <Text style={styles.itemOption}>Size: {item.selectedSize}</Text>
                  )}
                  
                  {item.selectedColor && (
                    <Text style={styles.itemOption}>Color: {item.selectedColor}</Text>
                  )}
                  
                  <Text style={styles.itemPrice}>${item.product.price}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} color={colors.text.primary} />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
        
        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          
          {subtotal < 50 && (
            <Text style={styles.freeShippingNote}>
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </Text>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </Card>
      </ScrollView>
      
      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title={`Checkout • $${total.toFixed(2)}`}
          onPress={handleCheckout}
          style={styles.checkoutButton}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    paddingHorizontal: 32,
  },
  clearButton: {
    fontSize: 16,
    color: colors.accent.primary,
    marginRight: 16,
  },
  itemsContainer: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 16,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  itemOption: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
    marginTop: 8,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 6,
    padding: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    padding: 16,
    paddingBottom: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  freeShippingNote: {
    fontSize: 14,
    color: colors.accent.primary,
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  checkoutButton: {
    paddingVertical: 16,
  },
});