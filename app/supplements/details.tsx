import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ShoppingCart, Star, Heart, Share, Pill, Clock, Shield } from 'lucide-react-native';
import { Image } from 'expo-image';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ProductData {
  name: string;
  brand: string;
  type: string;
  servingSize?: string;
  servingsPerContainer?: number;
  price: string;
  barcode: string;
}

export default function SupplementDetailsScreen() {
  const router = useRouter();
  const { productData } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productData && typeof productData === 'string') {
      try {
        const parsed = JSON.parse(productData);
        setProduct(parsed);
      } catch (error) {
        console.error('Error parsing product data:', error);
      }
    }
  }, [productData]);

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${product?.name} has been added to your cart`,
      [{ text: 'OK' }]
    );
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Supplement Details' }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Supplement Details',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Heart size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Share size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' }}
          style={styles.productImage}
          contentFit="cover"
        />
        <View style={styles.badgeContainer}>
          <Badge variant="success" text="Scanned" />
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <View style={styles.brandContainer}>
          <Pill size={16} color={colors.accent.primary} />
          <Text style={styles.brandText}>{product.brand}</Text>
        </View>
        
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productType}>{product.type}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.price}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.status.warning} fill={colors.status.warning} />
            <Text style={styles.rating}>4.8 (124 reviews)</Text>
          </View>
        </View>
      </View>

      {/* Product Details */}
      <Card style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Product Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Serving Size:</Text>
          <Text style={styles.detailValue}>{product.servingSize || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Servings Per Container:</Text>
          <Text style={styles.detailValue}>{product.servingsPerContainer || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Barcode:</Text>
          <Text style={styles.detailValue}>{product.barcode}</Text>
        </View>
      </Card>

      {/* Benefits */}
      <Card style={styles.benefitsCard}>
        <Text style={styles.cardTitle}>Key Benefits</Text>
        
        <View style={styles.benefitItem}>
          <Shield size={16} color={colors.status.success} />
          <Text style={styles.benefitText}>High-quality ingredients</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Clock size={16} color={colors.status.info} />
          <Text style={styles.benefitText}>Fast absorption</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Star size={16} color={colors.status.warning} />
          <Text style={styles.benefitText}>Third-party tested</Text>
        </View>
      </Card>

      {/* Usage Instructions */}
      <Card style={styles.usageCard}>
        <Text style={styles.cardTitle}>Usage Instructions</Text>
        <Text style={styles.usageText}>
          Take 1 serving (30g) mixed with 6-8 oz of water or your favorite beverage. 
          For best results, consume within 30 minutes after your workout.
        </Text>
      </Card>

      {/* Add to Cart */}
      <View style={styles.addToCartContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          icon={<ShoppingCart size={18} color={colors.text.primary} />}
          style={styles.addToCartButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: colors.background.secondary,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  productInfo: {
    padding: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  productType: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  benefitsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  usageCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  usageText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    paddingHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
  },
});