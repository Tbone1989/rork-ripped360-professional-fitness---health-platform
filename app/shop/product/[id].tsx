import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Star, Heart, ShoppingCart, Share, ExternalLink, Package, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useShopStore } from '@/store/shopStore';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChipGroup } from '@/components/ui/ChipGroup';

const { width } = Dimensions.get('window');

type ProductDetail = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  comparePrice?: number;
  images: string[];
  variants?: Array<{
    id: string;
    title: string;
    price: string;
    available: boolean;
    option1?: string;
    option2?: string;
    option3?: string;
  }>;
  options?: Array<{
    name: string;
    values: string[];
  }>;
  vendor?: string;
  productType?: string;
  tags?: string[];
  available?: boolean;
  url: string;
};

const normalizeImageUrl = (src?: string): string | undefined => {
  if (!src || typeof src !== 'string') return undefined;
  const s = src.trim();
  if (!s) return undefined;
  if (s.startsWith('//')) return `https:${s}`;
  if (s.startsWith('/')) return `https://www.rippedcityinc.com${s}`;
  try { new URL(s); return s; } catch { return undefined; }
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useShopStore();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const imageScrollRef = useRef<ScrollView>(null);

  // Fetch product details from Ripped City API
  const fetchProductDetails = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // First try to get all products and find the matching one
      const productsUrl = `https://www.rippedcityinc.com/products.json?limit=250`;
      const productsResponse = await fetch(productsUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const products = productsData.products || [];
        
        // Find the product by ID
        const productIdNum = id.replace('shop-', '');
        const matchingProduct = products.find((p: any) => 
          String(p.id) === productIdNum || 
          String(p.id) === id ||
          p.handle === id
        );
        
        if (matchingProduct) {
          const p = matchingProduct;
          const productDetail: ProductDetail = {
            id: String(p.id),
            title: p.title || 'Ripped City Product',
            description: p.body_html?.replace(/<[^>]*>/g, '') || p.description || '',
            price: p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : undefined,
            comparePrice: p.variants?.[0]?.compare_at_price ? parseFloat(p.variants[0].compare_at_price) : undefined,
            images: (p.images || []).map((img: any) => normalizeImageUrl(img.src)).filter(Boolean),
            variants: p.variants,
            options: p.options,
            vendor: p.vendor,
            productType: p.product_type,
            tags: p.tags ? p.tags.split(', ') : [],
            available: p.available !== false,
            url: `https://www.rippedcityinc.com/products/${p.handle}`,
          };
          setProduct(productDetail);
          
          // Set initial variant
          if (p.variants?.length > 0) {
            setSelectedVariant(p.variants[0]);
            // Set initial options
            const initialOptions: Record<string, string> = {};
            if (p.options) {
              p.options.forEach((opt: any, index: number) => {
                const variantOption = p.variants[0][`option${index + 1}`];
                if (variantOption) {
                  initialOptions[opt.name] = variantOption;
                }
              });
            }
            setSelectedOptions(initialOptions);
          }
          return;
        }
      }
      
      // If not found in products list, try direct product URL with handle
      const handle = id.replace('shop-', '').replace(/\d+$/, '') || id;
      const productUrl = `https://www.rippedcityinc.com/products/${handle}.json`;
      
      const response = await fetch(productUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.product) {
          const p = data.product;
          const productDetail: ProductDetail = {
            id: String(p.id),
            title: p.title || 'Ripped City Product',
            description: p.body_html?.replace(/<[^>]*>/g, '') || p.description || '',
            price: p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : undefined,
            comparePrice: p.variants?.[0]?.compare_at_price ? parseFloat(p.variants[0].compare_at_price) : undefined,
            images: (p.images || []).map((img: any) => normalizeImageUrl(img.src)).filter(Boolean),
            variants: p.variants,
            options: p.options,
            vendor: p.vendor,
            productType: p.product_type,
            tags: p.tags ? p.tags.split(', ') : [],
            available: p.available !== false,
            url: `https://www.rippedcityinc.com/products/${p.handle}`,
          };
          setProduct(productDetail);
          
          // Set initial variant
          if (p.variants?.length > 0) {
            setSelectedVariant(p.variants[0]);
            // Set initial options
            const initialOptions: Record<string, string> = {};
            if (p.options) {
              p.options.forEach((opt: any, index: number) => {
                const variantOption = p.variants[0][`option${index + 1}`];
                if (variantOption) {
                  initialOptions[opt.name] = variantOption;
                }
              });
            }
            setSelectedOptions(initialOptions);
          }
        } else {
          throw new Error('Product not found');
        }
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Show error message instead of generic fallback
      Alert.alert(
        'Product Not Available',
        'Unable to load product details. Please try again later.',
        [
          { text: 'Go Back', onPress: () => router.back() },
          { text: 'Visit Website', onPress: () => Linking.openURL('https://www.rippedcityinc.com') }
        ]
      );
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) return;
    
    const matchingVariant = product.variants.find(v => {
      return Object.entries(selectedOptions).every(([optName, optValue], index) => {
        return v[`option${index + 1}` as keyof typeof v] === optValue;
      });
    });
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [selectedOptions, product]);
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </View>
    );
  }

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
    
    // Check if all options are selected
    if (product.options && product.options.length > 0) {
      const missingOptions = product.options.filter(opt => !selectedOptions[opt.name]);
      if (missingOptions.length > 0) {
        Alert.alert(
          'Selection Required', 
          `Please select ${missingOptions.map(o => o.name).join(', ')} before adding to cart.`
        );
        return;
      }
    }
    
    const cartProduct = {
      id: product.id,
      name: product.title,
      description: product.description || '',
      price: selectedVariant?.price ? parseFloat(selectedVariant.price) : product.price || 0,
      category: 'clothing' as const,
      images: product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500'],
      inStock: selectedVariant?.available ?? product.available ?? true,
      stockCount: 50,
      rating: 4.5,
      reviewCount: 12,
      tags: product.tags || [],
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const variantTitle = selectedVariant?.title !== 'Default Title' ? selectedVariant?.title : undefined;
    addToCart(cartProduct, quantity, variantTitle);
    
    Alert.alert('Added to Cart', `${product.title} has been added to your cart.`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/shop/cart') }
    ]);
  };
  
  const handleShare = async () => {
    if (!product) return;
    try {
      await Linking.openURL(product.url);
    } catch (error) {
      Alert.alert('Error', 'Could not open product page');
    }
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!product || product.images.length <= 1) return;
    
    let newIndex = selectedImageIndex;
    if (direction === 'prev') {
      newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : product.images.length - 1;
    } else {
      newIndex = selectedImageIndex < product.images.length - 1 ? selectedImageIndex + 1 : 0;
    }
    
    setSelectedImageIndex(newIndex);
    imageScrollRef.current?.scrollTo({ x: width * newIndex, animated: true });
  };

  const currentPrice = selectedVariant?.price ? parseFloat(selectedVariant.price) : product.price;
  const comparePrice = selectedVariant?.compare_at_price ? parseFloat(selectedVariant.compare_at_price) : product.comparePrice;
  const isOnSale = comparePrice && currentPrice && comparePrice > currentPrice;
  const discountPercentage = isOnSale ? Math.round((1 - currentPrice / comparePrice) * 100) : 0;
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product.title,
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
                <ExternalLink size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {product.images.length > 0 ? (
            <>
              <ScrollView
                ref={imageScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setSelectedImageIndex(index);
                }}
              >
                {product.images.map((image, index) => (
                  <Image 
                    key={index} 
                    source={{ uri: image }} 
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <TouchableOpacity 
                    style={[styles.imageNavButton, styles.imageNavPrev]}
                    onPress={() => navigateImage('prev')}
                  >
                    <ChevronLeft size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.imageNavButton, styles.imageNavNext]}
                    onPress={() => navigateImage('next')}
                  >
                    <ChevronRight size={24} color="white" />
                  </TouchableOpacity>
                </>
              )}
              
              {/* Image Indicators */}
              {product.images.length > 1 && (
                <View style={styles.imageIndicators}>
                  {product.images.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedImageIndex(index);
                        imageScrollRef.current?.scrollTo({ x: width * index, animated: true });
                      }}
                      style={[
                        styles.indicator,
                        selectedImageIndex === index && styles.activeIndicator,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Package size={48} color={colors.text.tertiary} />
              <Text style={styles.imagePlaceholderText}>No Image Available</Text>
            </View>
          )}
          
          {/* Discount Badge */}
          {isOnSale && (
            <Badge 
              label={`${discountPercentage}% OFF`}
              variant="error" 
              style={styles.discountBadge}
            />
          )}
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.title}</Text>
          
          {/* Vendor and Type */}
          {(product.vendor || product.productType) && (
            <View style={styles.metaContainer}>
              {product.vendor && (
                <Text style={styles.metaText}>by {product.vendor}</Text>
              )}
              {product.productType && (
                <Badge 
                  label={product.productType}
                  variant="secondary"
                  style={styles.typeBadge}
                />
              )}
            </View>
          )}
          
          {/* Price */}
          <View style={styles.priceContainer}>
            {currentPrice ? (
              <>
                <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
                {comparePrice && comparePrice > currentPrice && (
                  <Text style={styles.originalPrice}>${comparePrice.toFixed(2)}</Text>
                )}
              </>
            ) : (
              <Text style={styles.priceUnavailable}>Price available on website</Text>
            )}
          </View>
          
          {/* Description */}
          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}
          
          {/* Options Selection */}
          {product.options && product.options.map((option) => (
            <View key={option.name} style={styles.optionContainer}>
              <Text style={styles.optionTitle}>{option.name}</Text>
              <ChipGroup
                options={option.values.map(value => ({ id: value, label: value }))}
                selectedIds={selectedOptions[option.name] ? [selectedOptions[option.name]] : []}
                onChange={(ids: string[]) => {
                  setSelectedOptions(prev => ({
                    ...prev,
                    [option.name]: ids[0]
                  }));
                }}
                multiSelect={false}
                style={styles.optionChips}
              />
            </View>
          ))}
          
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
              label={selectedVariant?.available ?? product.available ? 'In Stock' : 'Out of Stock'}
              variant={selectedVariant?.available ?? product.available ? 'success' : 'error'}
            />
          </View>
          
          {/* Product Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Truck size={20} color={colors.text.secondary} />
              <Text style={styles.featureText}>Free shipping on orders over $50</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={20} color={colors.text.secondary} />
              <Text style={styles.featureText}>Authentic Ripped City merchandise</Text>
            </View>
            <View style={styles.featureItem}>
              <Package size={20} color={colors.text.secondary} />
              <Text style={styles.featureText}>Ships within 2-3 business days</Text>
            </View>
          </View>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Tags</Text>
              <View style={styles.tags}>
                {product.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    label={tag}
                    variant="secondary"
                    style={styles.tagBadge}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
        
        {/* Visit Website Card */}
        <Card style={styles.websiteCard}>
          <Text style={styles.websiteTitle}>Want more details?</Text>
          <Text style={styles.websiteDescription}>
            Visit the official Ripped City website for complete product specifications, size charts, and customer reviews.
          </Text>
          <Button
            title="View on Website"
            onPress={() => Linking.openURL(product.url)}
            style={styles.websiteButton}
            icon={<ExternalLink size={20} color={colors.text.primary} />}
          />
        </Card>
      </ScrollView>
      
      {/* Add to Cart Button */}
      <View style={styles.addToCartContainer}>
        <Button
          title={currentPrice ? `Add to Cart • ${(currentPrice * quantity).toFixed(2)}` : 'View on Website'}
          onPress={currentPrice ? handleAddToCart : () => Linking.openURL(product.url)}
          style={styles.addToCartButton}
          fullWidth
          disabled={!(selectedVariant?.available ?? product.available)}
          icon={currentPrice ? <ShoppingCart size={20} color={colors.text.primary} /> : <ExternalLink size={20} color={colors.text.primary} />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 16,
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
    backgroundColor: colors.background.secondary,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: colors.text.tertiary,
    marginTop: 16,
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNavPrev: {
    left: 16,
  },
  imageNavNext: {
    right: 16,
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
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  metaText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceUnavailable: {
    fontSize: 18,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  websiteCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
  },
  websiteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  websiteDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  websiteButton: {
    paddingVertical: 12,
  },
});