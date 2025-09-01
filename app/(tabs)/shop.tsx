import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Search, ShoppingCart, ExternalLink } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { trpc } from '@/lib/trpc';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 48) / 2;

type ShopProduct = {
  id: string;
  title: string;
  url: string;
  image?: string;
  price?: number;
};

export default function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { data, isLoading, error, refetch } = trpc.shop.products.useQuery({});
  const [fallback, setFallback] = useState<ShopProduct[]>([]);
  const [isFallbackLoading, setIsFallbackLoading] = useState<boolean>(false);
  const [fallbackTried, setFallbackTried] = useState<boolean>(false);

  const tryFetchJson = useCallback(async (url: string) => {
    try {
      const res = await fetch(url, { cache: 'no-store' as const, headers: { 'Accept': 'application/json, text/plain, */*' } });
      if (!res.ok) return null;
      const text = await res.text();
      try {
        return JSON.parse(text) as any;
      } catch {
        return null;
      }
    } catch (e) {
      return null;
    }
  }, []);

  const parseProductsFromJson = useCallback((dataAny: any): ShopProduct[] => {
    const arr = Array.isArray(dataAny?.products) ? dataAny.products : Array.isArray(dataAny) ? dataAny : [];
    return arr.slice(0, 250).map((p: any, index: number) => {
      const id = String(p.id || p.handle || `shop-${Date.now()}-${index}`);
      const image = p.image?.src ?? p.images?.[0]?.src ?? p.featured_image ?? undefined;
      const price = typeof p.price === 'number' ? (p.price > 1000 ? p.price / 100 : p.price) : typeof p.price_min === 'number' ? p.price_min / 100 : typeof p.variants?.[0]?.price === 'string' ? Number(p.variants[0].price) : undefined;
      const handle = p.handle ?? undefined;
      const url = handle ? `https://www.rippedcityinc.com/products/${handle}` : typeof p.url === 'string' ? p.url : `https://www.rippedcityinc.com`;
      const title = String(p.title ?? '');
      return { id, title, url, image, price } as ShopProduct;
    }).filter((p: ShopProduct) => !!p.title);
  }, []);

  useEffect(() => {
    const run = async () => {
      if (Array.isArray(data) && data.length > 0) return;
      if (fallbackTried) return;
      setIsFallbackLoading(true);
      setFallbackTried(true);
      const urls = [
        `https://www.rippedcityinc.com/products.json?limit=250&_v=${Date.now()}`,
        `https://www.rippedcityinc.com/collections/all/products.json?limit=250&_v=${Date.now()}`,
      ];
      let merged: ShopProduct[] = [];
      for (const u of urls) {
        const json = await tryFetchJson(u);
        if (json) {
          const parsed = parseProductsFromJson(json);
          if (parsed.length > 0) {
            merged = parsed;
            break;
          }
        }
      }
      setFallback(merged);
      setIsFallbackLoading(false);
    };
    run();
  }, [data, fallbackTried, parseProductsFromJson, tryFetchJson]);

  const sourceList: ShopProduct[] = useMemo(() => {
    const apiList = (data ?? []) as ShopProduct[];
    return apiList.length > 0 ? apiList : fallback;
  }, [data, fallback]);

  const products: ShopProduct[] = useMemo(() => {
    const list = sourceList;
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((p) => p.title.toLowerCase().includes(q));
  }, [sourceList, searchQuery]);

  const renderProduct = ({ item }: { item: ShopProduct }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.priceContainer}>
          {typeof item.price === 'number' ? (
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          ) : (
            <Text style={styles.priceUnavailable}>Price on site</Text>
          )}
        </View>
        <Button
          title="View on Site"
          onPress={() => Linking.openURL(item.url)}
          style={styles.viewButton}
          variant="outline"
          icon={<ExternalLink size={16} color={colors.accent.primary} />}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Ripped City Store',
        }}
      />

      <View style={styles.header}>
        <Text style={styles.brandTitle}>Ripped City Inc.</Text>
        <Text style={styles.brandSubtitle}>Premium Gear • Direct from rippedcityinc.com</Text>
      </View>

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
      </View>

      {(isLoading || isFallbackLoading) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>Loading products…</Text>
        </View>
      )}

      {error && !isLoading && products.length === 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Could not load products. Pull to retry.</Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      )}

      {products.length > 0 && (
        <>
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </Text>
          </View>

          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productsContainer}
            showsVerticalScrollIndicator={false}
            onRefresh={refetch}
            refreshing={isLoading}
          />
        </>
      )}
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
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.text.secondary,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: colors.text.secondary,
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
  imagePlaceholder: {
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: colors.text.tertiary,
    fontSize: 12,
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
  priceUnavailable: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    marginTop: 4,
  },
  viewButton: {
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