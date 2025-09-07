import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Star, Heart, ShoppingCart, Share, ArrowLeft } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useShopStore } from '@/store/shopStore';
import { products, reviews } from '@/mocks/products';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChipGroup } from '@/components/ui/ChipGroup';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useShopStore();
  
  // Try to find product in mock data first
  let product = products.find(p => p.id === id);
  let productReviews = reviews.filter(r => r.productId === id);
  
  // If not found in mocks, create a mock product for API products
  if (!product && id) {
    product = {
      id: id,
      name: 'Ripped City Product',
      description: 'Premium product from Ripped City Inc. Visit our website for full details and specifications.',
      price: 29.99,
      category: 'clothing' as const,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500'],
      inStock: true,
      stockCount: 50,
      rating: 4.5,
      reviewCount: 25,
      tags: ['ripped city', 'premium'],
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    productReviews = [];
  }
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  if (!product) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Product Not Found' }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Product not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && !selectedSize) {
      Alert.alert('Size Required', 'Please select a size before adding to cart.');
      return;
    }
    
    if (product.colors && !selectedColor) {
      Alert.alert('Color Required', 'Please select a color before adding to cart.');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/shop/cart') }
    ]);
  };
  
  const handleShare = () => {
    // In a real app, implement sharing functionality
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setIsWishlisted(!isWishlisted)} style={styles.headerButton}>
                <Heart
                  size={24}
                  color={isWishlisted ? colors.accent.primary : colors.text.primary}
                  fill={isWishlisted ? colors.accent.primary : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Share size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.productImage} />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
          
          {/* Discount Badge */}
          {product.originalPrice && (
            <Badge 
              label={`${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF`}
              variant="error" 
              style={styles.discountBadge}
            />
          )}
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  color={star <= product.rating ? colors.status.warning : colors.text.tertiary}
                  fill={star <= product.rating ? colors.status.warning : 'transparent'}
                />
              ))}
            </View>
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
          </View>
          
          <Text style={styles.description}>{product.description}</Text>
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.optionContainer}>
              <Text style={styles.optionTitle}>Size</Text>
              <ChipGroup
                options={product.sizes.map(size => ({ id: size, label: size }))}
                selectedIds={selectedSize ? [selectedSize] : []}
                onChange={(ids: string[]) => setSelectedSize(ids[0])}
                multiSelect={false}
                style={styles.optionChips}
              />
            </View>
          )}
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.optionContainer}>
              <Text style={styles.optionTitle}>Color</Text>
              <ChipGroup
                options={product.colors.map(color => ({ id: color, label: color }))}
                selectedIds={selectedColor ? [selectedColor] : []}
                onChange={(ids: string[]) => setSelectedColor(ids[0])}
                multiSelect={false}
                style={styles.optionChips}
              />
            </View>
          )}
          
          {/* Quantity */}
          <View style={styles.quantityContainer}>
            <Text style={styles.optionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
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
          </View>
          
          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Badge 
              label={product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
              variant={product.inStock ? 'success' : 'error'}
            />
          </View>
        </View>
        
        {/* Reviews */}
        {productReviews.length > 0 && (
          <Card style={styles.reviewsCard}>
            <Text style={styles.reviewsTitle}>Customer Reviews</Text>
            {productReviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    {review.userAvatar && (
                      <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
                    )}
                    <View>
                      <Text style={styles.reviewUserName}>{review.userName}</Text>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            color={star <= review.rating ? colors.status.warning : colors.text.tertiary}
                            fill={star <= review.rating ? colors.status.warning : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  {review.verified && (
                    <Badge 
                      label="Verified"
                      variant="success" 
                      style={styles.verifiedBadge}
                    />
                  )}
                </View>
                <Text style={styles.reviewTitle}>{review.title}</Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
            
            {productReviews.length > 3 && (
              <TouchableOpacity style={styles.viewAllReviews}>
                <Text style={styles.viewAllReviewsText}>
                  View all {productReviews.length} reviews
                </Text>
              </TouchableOpacity>
            )}
          </Card>
        )}
      </ScrollView>
      
      {/* Add to Cart Button */}
      <View style={styles.addToCartContainer}>
        <Button
          title={`Add to Cart • $${(product.price * quantity).toFixed(2)}`}
          onPress={handleAddToCart}
          style={styles.addToCartButton}
          fullWidth
          disabled={!product.inStock}
          icon={<ShoppingCart size={20} color={colors.text.primary} />}
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
  notFoundText: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 24,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width,
    height: 400,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: colors.accent.primary,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reviewCount: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  originalPrice: {
    fontSize: 20,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  optionContainer: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  optionChips: {
    marginBottom: 0,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    minWidth: 44,
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 32,
    textAlign: 'center',
  },
  stockContainer: {
    marginBottom: 24,
  },
  reviewsCard: {
    margin: 20,
    marginTop: 0,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    padding: 20,
    paddingBottom: 0,
  },
  reviewItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  viewAllReviews: {
    padding: 20,
    alignItems: 'center',
  },
  viewAllReviewsText: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  addToCartContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  addToCartButton: {
    paddingVertical: 16,
  },
});