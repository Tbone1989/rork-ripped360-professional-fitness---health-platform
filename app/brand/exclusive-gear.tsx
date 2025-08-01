import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Crown, Clock, Users, Star, Lock, ShoppingBag } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useBrandStore } from '@/store/brandStore';
import { useShopStore } from '@/store/shopStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ExclusiveGear } from '@/types/brand';
import { Product } from '@/types/product';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 48) / 2;

// Mock exclusive products data
const exclusiveProducts: (Product & { exclusiveInfo: ExclusiveGear })[] = [
  {
    id: 'exclusive-1',
    name: 'Elite Member Hoodie - Limited Edition',
    description: 'Premium hoodie with exclusive Elite member embroidery and unique colorway. Only 500 pieces made.',
    price: 45.99,
    originalPrice: 65.99,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=500',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Elite Black', 'Crimson Red'],
    inStock: true,
    stockCount: 127,
    rating: 4.9,
    reviewCount: 89,
    tags: ['exclusive', 'limited-edition', 'elite'],
    featured: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    exclusiveInfo: {
      id: '1',
      productId: 'exclusive-1',
      membershipTier: 'elite',
      limitedEdition: true,
      quantityLimit: 500,
      releaseDate: '2024-02-01T00:00:00Z',
      exclusivityPeriod: 30,
      memberPrice: 45.99,
      regularPrice: 65.99,
      description: 'Limited edition Elite member hoodie with premium embroidery and exclusive colorway.',
    }
  },
  {
    id: 'exclusive-2',
    name: 'Champion Training Jacket',
    description: 'Advanced moisture-wicking training jacket exclusive to Champion members. Features cutting-edge fabric technology.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=500',
      'https://images.unsplash.com/photo-1506629905607-d9c841d08508?q=80&w=500',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Champion Gold', 'Midnight Black'],
    inStock: true,
    stockCount: 43,
    rating: 4.8,
    reviewCount: 34,
    tags: ['exclusive', 'champion', 'performance'],
    featured: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    exclusiveInfo: {
      id: '2',
      productId: 'exclusive-2',
      membershipTier: 'champion',
      limitedEdition: true,
      quantityLimit: 100,
      releaseDate: '2024-01-15T00:00:00Z',
      exclusivityPeriod: 60,
      memberPrice: 89.99,
      regularPrice: 129.99,
      description: 'Champion-exclusive training jacket with advanced moisture-wicking technology.',
    }
  },
  {
    id: 'exclusive-3',
    name: 'Ripped City Founder\'s Edition Tank',
    description: 'Commemorative tank top celebrating our founders. Elite and Champion members only.',
    price: 34.99,
    originalPrice: 44.99,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Founder Black', 'Legacy Gray'],
    inStock: true,
    stockCount: 234,
    rating: 4.7,
    reviewCount: 156,
    tags: ['exclusive', 'commemorative', 'founders'],
    featured: false,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    exclusiveInfo: {
      id: '3',
      productId: 'exclusive-3',
      membershipTier: 'elite',
      limitedEdition: false,
      releaseDate: '2024-01-20T00:00:00Z',
      exclusivityPeriod: 90,
      memberPrice: 34.99,
      regularPrice: 44.99,
      description: 'Commemorative tank top celebrating our founders. Elite and Champion members only.',
    }
  },
];

export default function ExclusiveGearScreen() {
  const { userMembership } = useBrandStore();
  const { addToCart } = useShopStore();
  const user = useUserStore((state) => state.user);
  
  const [selectedTier, setSelectedTier] = useState<string>('all');
  
  const tierOptions = [
    { id: 'all', label: 'All Exclusive' },
    { id: 'elite', label: 'Elite Only' },
    { id: 'champion', label: 'Champion Only' },
  ];
  
  const filteredProducts = exclusiveProducts.filter(product => {
    if (selectedTier === 'all') return true;
    return product.exclusiveInfo.membershipTier === selectedTier;
  });
  
  const canAccessProduct = (product: typeof exclusiveProducts[0]) => {
    if (!userMembership || userMembership.status !== 'active') return false;
    
    const requiredTier = product.exclusiveInfo.membershipTier;
    const userTier = userMembership.tier.id;
    
    // Champion can access everything, Elite can access Elite and Basic items
    if (userTier === 'champion') return true;
    if (userTier === 'elite' && (requiredTier === 'elite' || requiredTier === 'basic')) return true;
    if (userTier === 'basic' && requiredTier === 'basic') return true;
    
    return false;
  };
  
  const handleAddToCart = (product: Product) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add items to cart.');
      return;
    }
    
    if (!canAccessProduct(product as typeof exclusiveProducts[0])) {
      Alert.alert(
        'Membership Required',
        'This exclusive item requires a higher membership tier.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/brand/membership') }
        ]
      );
      return;
    }
    
    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };
  
  const renderProduct = ({ item: product }: { item: typeof exclusiveProducts[0] }) => {
    const canAccess = canAccessProduct(product);
    const isLimitedEdition = product.exclusiveInfo.limitedEdition;
    const quantityLeft = product.exclusiveInfo.quantityLimit ? 
      product.exclusiveInfo.quantityLimit - (product.exclusiveInfo.quantityLimit - product.stockCount) : null;
    
    const releaseDate = new Date(product.exclusiveInfo.releaseDate);
    const exclusivityEnd = new Date(releaseDate.getTime() + product.exclusiveInfo.exclusivityPeriod * 24 * 60 * 60 * 1000);
    const isExclusivityActive = new Date() < exclusivityEnd;
    
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/shop/product/${product.id}`)}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: product.images[0] }} style={styles.productImage} />
          
          <View style={styles.productOverlay}>
            {isLimitedEdition && (
              <Badge label="Limited Edition" variant="error" style={styles.limitedBadge} />
            )}
            {!canAccess && (
              <View style={styles.lockBadge}>
                <Lock size={12} color={colors.text.primary} />
              </View>
            )}
          </View>
          
          {isExclusivityActive && (
            <View style={styles.exclusivityBadge}>
              <Crown size={12} color={colors.status.warning} />
              <Text style={styles.exclusivityText}>Member Exclusive</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          
          <View style={styles.tierInfo}>
            <Badge
              label={`${product.exclusiveInfo.membershipTier.toUpperCase()} ONLY`}
              style={[styles.tierBadge, { 
                backgroundColor: product.exclusiveInfo.membershipTier === 'champion' ? 
                  colors.status.warning + '20' : colors.accent.primary + '20' 
              }]}
              textStyle={{ 
                color: product.exclusiveInfo.membershipTier === 'champion' ? 
                  colors.status.warning : colors.accent.primary 
              }}
            />
          </View>
          
          {isLimitedEdition && quantityLeft && (
            <View style={styles.quantityInfo}>
              <Users size={12} color={colors.text.secondary} />
              <Text style={styles.quantityText}>
                Only {quantityLeft} left
              </Text>
            </View>
          )}
          
          <View style={styles.ratingContainer}>
            <Star size={12} color={colors.status.warning} fill={colors.status.warning} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount})</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.memberPrice}>${product.exclusiveInfo.memberPrice}</Text>
            <Text style={styles.regularPrice}>${product.exclusiveInfo.regularPrice}</Text>
            <Text style={styles.savings}>
              Save ${(product.exclusiveInfo.regularPrice - product.exclusiveInfo.memberPrice).toFixed(2)}
            </Text>
          </View>
          
          <Button
            title={canAccess ? 'Add to Cart' : 'Upgrade Required'}
            onPress={() => handleAddToCart(product)}
            disabled={!canAccess}
            size="small"
            style={styles.addButton}
          />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Exclusive Gear',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/shop/cart')}>
              <ShoppingBag size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Member Exclusive Gear</Text>
          <Text style={styles.headerSubtitle}>
            Premium products available only to our valued members
          </Text>
          
          {userMembership ? (
            <View style={styles.membershipInfo}>
              <Badge
                label={userMembership.tier.name}
                style={[styles.membershipBadge, { backgroundColor: userMembership.tier.color + '20' }]}
                textStyle={{ color: userMembership.tier.color }}
              />
              <Text style={styles.discountText}>
                Your {userMembership.tier.discountPercentage}% member discount is already applied
              </Text>
            </View>
          ) : (
            <Card style={styles.upgradeCard}>
              <Crown size={24} color={colors.status.warning} />
              <Text style={styles.upgradeTitle}>Unlock Exclusive Access</Text>
              <Text style={styles.upgradeDescription}>
                Become a member to access exclusive gear and member-only pricing
              </Text>
              <Button
                title="View Membership Plans"
                onPress={() => router.push('/brand/membership')}
                style={styles.upgradeButton}
              />
            </Card>
          )}
        </View>
        
        {/* Tier Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter by Tier</Text>
          <View style={styles.tierFilters}>
            {tierOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.tierFilter,
                  selectedTier === option.id && styles.tierFilterActive
                ]}
                onPress={() => setSelectedTier(option.id)}
              >
                <Text style={[
                  styles.tierFilterText,
                  selectedTier === option.id && styles.tierFilterTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Products Grid */}
        <View style={styles.productsSection}>
          <Text style={styles.resultsText}>
            {filteredProducts.length} exclusive item{filteredProducts.length !== 1 ? 's' : ''}
          </Text>
          
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productsContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  membershipInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  membershipBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  discountText: {
    fontSize: 14,
    color: colors.status.success,
    fontWeight: '600',
  },
  upgradeCard: {
    alignItems: 'center',
    padding: 20,
    marginTop: 8,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeButton: {
    paddingHorizontal: 24,
  },
  filterSection: {
    padding: 20,
    paddingTop: 0,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tierFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  tierFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tierFilterActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  tierFilterText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  tierFilterTextActive: {
    color: colors.text.primary,
  },
  productsSection: {
    padding: 20,
    paddingTop: 0,
  },
  resultsText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  productsContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitedBadge: {
    alignSelf: 'flex-start',
  },
  lockBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 4,
  },
  exclusivityBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  exclusivityText: {
    fontSize: 10,
    color: colors.text.primary,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 18,
  },
  tierInfo: {
    marginBottom: 8,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  quantityText: {
    fontSize: 11,
    color: colors.status.warning,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 2,
  },
  rating: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reviewCount: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  priceContainer: {
    marginBottom: 10,
  },
  memberPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  regularPrice: {
    fontSize: 12,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: 11,
    color: colors.status.success,
    fontWeight: '600',
  },
  addButton: {
    marginTop: 4,
  },
});