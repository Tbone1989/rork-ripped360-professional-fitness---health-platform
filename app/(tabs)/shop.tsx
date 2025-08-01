import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Search, Filter, ShoppingCart, Star, Heart, Camera } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useShopStore } from '@/store/shopStore';
import { Product, ProductCategory } from '@/types/product';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChipGroup } from '@/components/ui/ChipGroup';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 48) / 2; // 2 columns with padding

const categories: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'ebooks', label: 'E-books' },
  { id: 'bags', label: 'Bags' },
  { id: 'accessories', label: 'Accessories' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest' },
  { id: 'name', label: 'Name' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Rating' },
];

export default function ShopScreen() {
  const {
    filteredProducts,
    selectedCategory,
    searchQuery,
    sortBy,
    cartItems,
    setCategory,
    setSearchQuery,
    setSortBy,
    filterProducts,
    addToCart,
  } = useShopStore();

  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    filterProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Show success feedback here if needed
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderProduct = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/shop/product/${product.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.productImage} />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => toggleWishlist(product.id)}
        >
          <Heart
            size={20}
            color={wishlist.includes(product.id) ? colors.accent.primary : colors.text.secondary}
            fill={wishlist.includes(product.id) ? colors.accent.primary : 'transparent'}
          />
        </TouchableOpacity>
        {product.originalPrice && (
          <Badge
            label={`${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF`}
            variant="error"
            style={styles.discountBadge}
          />
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color={colors.status.warning} fill={colors.status.warning} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
          )}
        </View>
        
        <Button
          title="Add to Cart"
          onPress={() => handleAddToCart(product)}
          style={styles.addToCartButton}
          variant="outline"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Ripped City Store',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push('/shop/scan')}
                style={styles.scanButton}
              >
                <Camera size={20} color={colors.accent.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/shop/cart')}
                style={styles.cartButton}
              >
                <ShoppingCart size={24} color={colors.text.primary} />
                {cartItems.length > 0 && (
                  <Badge
                    label={cartItems.length.toString()}
                    variant="error"
                    style={styles.cartBadge}
                  />
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Ripped City Inc.</Text>
        <Text style={styles.brandSubtitle}>Est. 2019 • Premium Fitness Gear</Text>
      </View>
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Category</Text>
          <ChipGroup
            options={categories}
            selectedIds={[selectedCategory]}
            onChange={(ids: string[]) => setCategory(ids[0] as ProductCategory | 'all')}
            multiSelect={false}
            style={styles.categoryChips}
          />
          
          <Text style={styles.filterTitle}>Sort By</Text>
          <ChipGroup
            options={sortOptions}
            selectedIds={[sortBy]}
            onChange={(ids: string[]) => setSortBy(ids[0] as 'name' | 'price-low' | 'price-high' | 'rating' | 'newest')}
            multiSelect={false}
            style={styles.sortChips}
          />
        </View>
      )}
      
      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Text>
      </View>
      
      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  filterButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  categoryChips: {
    marginBottom: 16,
  },
  sortChips: {
    marginBottom: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  productsContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
  scanButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});