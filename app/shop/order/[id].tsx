import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Package, Truck, MapPin, CreditCard, Calendar, ArrowRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useShopStore } from '@/store/shopStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const statusColors = {
  pending: colors.status.warning,
  confirmed: colors.status.info,
  processing: colors.status.info,
  shipped: colors.accent.primary,
  delivered: colors.status.success,
  cancelled: colors.status.error,
};

const statusLabels = {
  pending: 'Order Pending',
  confirmed: 'Order Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useShopStore();
  
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Order Not Found' }} />
        <View style={styles.notFoundContainer}>
          <Package size={80} color={colors.text.secondary} />
          <Text style={styles.notFoundTitle}>Order not found</Text>
          <Text style={styles.notFoundSubtitle}>
            The order you're looking for doesn't exist or has been removed.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.goBackButton}
          />
        </View>
      </View>
    );
  }
  
  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order ${order.id.slice(-8)}` }} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Package size={24} color={statusColors[order.status]} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{statusLabels[order.status]}</Text>
              <Text style={styles.orderDate}>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Badge label={order.status.toUpperCase()} variant={getStatusVariant(order.status)} />
          </View>
          
          {order.trackingNumber && (
            <View style={styles.trackingContainer}>
              <Truck size={20} color={colors.text.secondary} />
              <View style={styles.trackingInfo}>
                <Text style={styles.trackingLabel}>Tracking Number</Text>
                <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
              </View>
            </View>
          )}
          
          {order.estimatedDelivery && (
            <View style={styles.deliveryContainer}>
              <Calendar size={20} color={colors.text.secondary} />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                <Text style={styles.deliveryDate}>
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </Card>
        
        {/* Order Items */}
        <Card style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          {order.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.orderItem}
              onPress={() => router.push(`/shop/product/${item.productId}`)}
            >
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
                
                <View style={styles.itemPricing}>
                  <Text style={styles.itemPrice}>${item.product.price}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
              </View>
              
              <ArrowRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </Card>
        
        {/* Shipping Address */}
        <Card style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <MapPin size={24} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>
          
          <View style={styles.addressContent}>
            <Text style={styles.addressName}>{order.shippingAddress.name}</Text>
            <Text style={styles.addressText}>{order.shippingAddress.street}</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Text>
            <Text style={styles.addressText}>{order.shippingAddress.country}</Text>
          </View>
        </Card>
        
        {/* Payment Method */}
        <Card style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <CreditCard size={24} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          
          <View style={styles.paymentContent}>
            <Text style={styles.paymentMethod}>
              {order.paymentMethod.brand?.toUpperCase()} •••• {order.paymentMethod.last4}
            </Text>
            <Text style={styles.paymentType}>
              {order.paymentMethod.type === 'card' ? 'Credit Card' : order.paymentMethod.type}
            </Text>
          </View>
        </Card>
        
        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </Card>
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {order.status === 'pending' && (
          <Button
            title="Cancel Order"
            variant="outline"
            onPress={() => {
              // Handle order cancellation
            }}
            style={styles.actionButton}
          />
        )}
        
        <Button
          title="Reorder Items"
          onPress={() => {
            // Handle reorder
            router.push('/shop');
          }}
          style={styles.actionButton}
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  notFoundSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  goBackButton: {
    paddingHorizontal: 32,
  },
  statusCard: {
    margin: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  trackingInfo: {
    flex: 1,
  },
  trackingLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  deliveryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  itemsCard: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    padding: 20,
    paddingBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  itemImage: {
    width: 60,
    height: 60,
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
  itemPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addressCard: {
    margin: 16,
    marginTop: 0,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    gap: 12,
  },
  addressContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  paymentCard: {
    margin: 16,
    marginTop: 0,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    gap: 12,
  },
  paymentContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  paymentType: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    paddingBottom: 20,
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
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  actionButton: {
    flex: 1,
  },
});