import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { CreditCard, MapPin, Truck, Check } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useShopStore } from '@/store/shopStore';
import { Address, PaymentMethod } from '@/types/product';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CheckoutScreen() {
  const {
    cartItems,
    cartTotal,
    addresses,
    paymentMethods,
    createOrder,
    addAddress,
    addPaymentMethod,
    isLoading,
  } = useShopStore();

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(addr => addr.isDefault)?.id || addresses[0]?.id
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    paymentMethods.find(pm => pm.isDefault)?.id || paymentMethods[0]?.id
  );
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // New address form
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  // New payment form
  const [newPayment, setNewPayment] = useState({
    type: 'card' as const,
    last4: '',
    brand: '',
    expiryMonth: 0,
    expiryYear: 0,
  });

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const selectedPayment = paymentMethods.find(pm => pm.id === selectedPaymentId);

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      Alert.alert('Error', 'Please fill in all address fields.');
      return;
    }

    addAddress({
      ...newAddress,
      isDefault: addresses.length === 0,
    });

    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    });
    setShowAddAddress(false);
  };

  const handleAddPayment = () => {
    if (!newPayment.last4 || !newPayment.brand) {
      Alert.alert('Error', 'Please fill in payment details.');
      return;
    }

    addPaymentMethod({
      ...newPayment,
      isDefault: paymentMethods.length === 0,
    });

    setNewPayment({
      type: 'card',
      last4: '',
      brand: '',
      expiryMonth: 0,
      expiryYear: 0,
    });
    setShowAddPayment(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a shipping address.');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    try {
      const order = await createOrder(selectedAddress, selectedAddress, selectedPayment);
      Alert.alert(
        'Order Placed!',
        `Your order #${order.id} has been placed successfully. You will receive a confirmation email shortly.`,
        [
          {
            text: 'View Order',
            onPress: () => router.replace(`/shop/order/${order.id}`),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Checkout' }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button title="Continue Shopping" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Checkout' }} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>
          
          {addresses.length > 0 ? (
            <View>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressItem,
                    selectedAddressId === address.id && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedAddressId(address.id)}
                >
                  <View style={styles.addressContent}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    <Text style={styles.addressText}>
                      {address.street}
                    </Text>
                    <Text style={styles.addressText}>
                      {address.city}, {address.state} {address.zipCode}
                    </Text>
                  </View>
                  {selectedAddressId === address.id && (
                    <Check size={20} color={colors.accent.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          
          {showAddAddress ? (
            <View style={styles.addForm}>
              <Input
                label="Full Name"
                value={newAddress.name}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, name: text }))}
                style={styles.input}
              />
              <Input
                label="Street Address"
                value={newAddress.street}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, street: text }))}
                style={styles.input}
              />
              <View style={styles.row}>
                <Input
                  label="City"
                  value={newAddress.city}
                  onChangeText={(text) => setNewAddress(prev => ({ ...prev, city: text }))}
                  style={[styles.input, styles.halfInput]}
                />
                <Input
                  label="State"
                  value={newAddress.state}
                  onChangeText={(text) => setNewAddress(prev => ({ ...prev, state: text }))}
                  style={[styles.input, styles.halfInput]}
                />
              </View>
              <Input
                label="ZIP Code"
                value={newAddress.zipCode}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, zipCode: text }))}
                style={styles.input}
              />
              <View style={styles.formActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setShowAddAddress(false)}
                  style={styles.formButton}
                />
                <Button
                  title="Add Address"
                  onPress={handleAddAddress}
                  style={styles.formButton}
                />
              </View>
            </View>
          ) : (
            <Button
              title="Add New Address"
              variant="outline"
              onPress={() => setShowAddAddress(true)}
              style={styles.addButton}
            />
          )}
        </Card>
        
        {/* Payment Method */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={24} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          
          {paymentMethods.length > 0 ? (
            <View>
              {paymentMethods.map((payment) => (
                <TouchableOpacity
                  key={payment.id}
                  style={[
                    styles.paymentItem,
                    selectedPaymentId === payment.id && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedPaymentId(payment.id)}
                >
                  <View style={styles.paymentContent}>
                    <Text style={styles.paymentBrand}>
                      {payment.brand?.toUpperCase()} •••• {payment.last4}
                    </Text>
                    <Text style={styles.paymentExpiry}>
                      Expires {payment.expiryMonth}/{payment.expiryYear}
                    </Text>
                  </View>
                  {selectedPaymentId === payment.id && (
                    <Check size={20} color={colors.accent.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          
          {showAddPayment ? (
            <View style={styles.addForm}>
              <Input
                label="Card Number (Last 4 digits)"
                value={newPayment.last4}
                onChangeText={(text) => setNewPayment(prev => ({ ...prev, last4: text }))}
                keyboardType="numeric"
                maxLength={4}
                style={styles.input}
              />
              <Input
                label="Card Brand (e.g., Visa, Mastercard)"
                value={newPayment.brand}
                onChangeText={(text) => setNewPayment(prev => ({ ...prev, brand: text }))}
                style={styles.input}
              />
              <View style={styles.formActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setShowAddPayment(false)}
                  style={styles.formButton}
                />
                <Button
                  title="Add Payment"
                  onPress={handleAddPayment}
                  style={styles.formButton}
                />
              </View>
            </View>
          ) : (
            <Button
              title="Add Payment Method"
              variant="outline"
              onPress={() => setShowAddPayment(true)}
              style={styles.addButton}
            />
          )}
        </Card>
        
        {/* Order Summary */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck size={24} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
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
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </Card>
      </ScrollView>
      
      {/* Place Order Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title={isLoading ? 'Placing Order...' : `Place Order • $${total.toFixed(2)}`}
          onPress={handlePlaceOrder}
          style={styles.checkoutButton}
          fullWidth
          disabled={isLoading || !selectedAddress || !selectedPayment}
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
  emptyText: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 24,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    paddingBottom: 0,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    backgroundColor: colors.background.secondary,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    backgroundColor: colors.background.secondary,
  },
  paymentContent: {
    flex: 1,
  },
  paymentBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  paymentExpiry: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addButton: {
    margin: 16,
    marginTop: 8,
  },
  addForm: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
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