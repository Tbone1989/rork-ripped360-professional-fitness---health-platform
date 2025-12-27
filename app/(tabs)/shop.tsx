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
import * as Haptics from 'expo-haptics';
import { Stack, router } from 'expo-router';
import { ArrowUpDown, ExternalLink, Plus, ScanLine, Search, ShoppingCart, Sparkles, X } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc';
import { useShopStore } from '@/store/shopStore';
import type { Product, ProductCategory } from '@/types/product';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 48) / 2;

type ShopProduct = {
  id: string;
  title: string;
  url: string;
  image?: string;
  price?: number;
  category?: string;
};

type SortKey = 'featured' | 'price-low' | 'price-high' | 'a-z';

const DEFAULT_CATEGORY: ProductCategory = 'accessories';

const mapShopProductToCartProduct = (p: ShopProduct): Product => {
  const nowIso = new Date().toISOString();
  const price = typeof p.price === 'number' && Number.isFinite(p.price) ? p.price : 0;

  return {
    id: p.id,
    name: p.title,
    description: '',
    price,
    originalPrice: undefined,
    category: DEFAULT_CATEGORY,
    images: p.image ? [p.image] : [],
    sizes: undefined,
    colors: undefined,
    inStock: true,
    stockCount: 999,
    rating: 4.7,
    reviewCount: 120,
    tags: [],
    featured: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
};

const normalizeImageUrl = (src?: string): string | undefined => {
  if (!src || typeof src !== 'string') return undefined;
  const s = src.trim();
  if (!s) return undefined;
  if (s.startsWith('//')) return `https:${s}`;
  if (s.startsWith('/')) return `https://www.rippedcityinc.com${s}`;
  try { new URL(s); return s; } catch { return undefined; }
};

const ProductCard = ({
  item,
  onAddToCart,
}: {
  item: ShopProduct;
  onAddToCart: (p: ShopProduct) => void;
}) => {
  const hasPrice = typeof item.price === 'number' && Number.isFinite(item.price);

  return (
    <View style={styles.productCard} testID={`shop-product-${item.id}`}>
      <TouchableOpacity
        style={styles.productImageContainer}
        activeOpacity={0.9}
        onPress={() => Linking.openURL(item.url)}
        testID={`shop-product-open-${item.id}`}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>No Image</Text>
            </View>
          )}
        </View>
        <View style={styles.imageOverlay}>
          <View style={styles.overlayPill}>
            <ExternalLink size={14} color={colors.text.primary} />
            <Text style={styles.overlayPillText}>Details</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.priceRow}>
          {hasPrice ? (
            <Text style={styles.price}>${item.price!.toFixed(2)}</Text>
          ) : (
            <Text style={styles.priceUnavailable}>See price</Text>
          )}
          {item.category ? (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText} numberOfLines={1}>
                {item.category}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.productActions}>
          <TouchableOpacity
            testID={`shop-add-${item.id}`}
            activeOpacity={0.85}
            onPress={() => onAddToCart(item)}
            style={[styles.addButton, !hasPrice && styles.addButtonDisabled]}
            disabled={!hasPrice}
          >
            <Plus size={16} color={colors.text.primary} />
            <Text style={styles.addButtonText}>{hasPrice ? 'Add' : 'N/A'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID={`shop-view-${item.id}`}
            activeOpacity={0.85}
            onPress={() => Linking.openURL(item.url)}
            style={styles.viewPill}
          >
            <Text style={styles.viewPillText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'men' | 'women' | 'kids'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('featured');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { data, isLoading, error, refetch } = trpc.shop.products.useQuery({});
  const [fallback, setFallback] = useState<ShopProduct[]>([]);
  const [isFallbackLoading, setIsFallbackLoading] = useState<boolean>(false);
  const [fallbackTried, setFallbackTried] = useState<boolean>(false);
  const { cartItems, addToCart, fetchProducts, filteredProducts, isLoadingProducts } = useShopStore()

  // Fetch products from Shopify on mount
  useEffect(() => {
    fetchProducts();
  }, []);
;

  const tryFetchJson = useCallback(async (url: string) => {
    try {
      const res = await fetch(url, { cache: 'no-store' as const, headers: { Accept: 'application/json, text/plain, */*' } });
      if (!res.ok) return null;
      const text = await res.text();
      try {
        return JSON.parse(text) as any;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }, []);

  const parseProductsFromJson = useCallback((dataAny: any): ShopProduct[] => {
    const arr = Array.isArray(dataAny?.products) ? dataAny.products : Array.isArray(dataAny) ? dataAny : [];
    return arr.slice(0, 250).map((p: any, index: number) => {
      const id = String(p.id || p.handle || `shop-${Date.now()}-${index}`);
      const image = normalizeImageUrl(p.image?.src ?? p.images?.[0]?.src ?? p.featured_image ?? undefined);
      const price = typeof p.price === 'number' ? (p.price > 1000 ? p.price / 100 : p.price) : typeof p.price_min === 'number' ? p.price_min / 100 : typeof p.variants?.[0]?.price === 'string' ? Number(p.variants[0].price) : undefined;
      const handle = p.handle ?? undefined;
      const url = handle ? `https://www.rippedcityinc.com/products/${handle}` : typeof p.url === 'string' ? p.url : `https://www.rippedcityinc.com`;
      const title = String(p.title ?? '');
      const categoryRaw = p.product_type ?? p.type ?? p.collections?.[0]?.title ?? p.collection ?? undefined;
      const category = typeof categoryRaw === 'string' ? categoryRaw.trim() : undefined;
      const product: ShopProduct = { id, title, url, image, price, category };
      return product;
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
    const apiList = (Array.isArray(data) ? (data as ShopProduct[]) : [])
      .map((p) => ({ ...p, image: normalizeImageUrl(p.image) }));
    const base = apiList.length > 0 ? apiList : fallback;
    const dedup = base.filter((p, idx, arr) => arr.findIndex(x => x.url === p.url) === idx);
    return dedup;
  }, [data, fallback]);

  const categories: string[] = useMemo(() => {
    const uniq = Array.from(new Set(sourceList.map(p => (p.category ?? '').trim()).filter(Boolean)));
    const sorted = uniq.sort((a, b) => a.localeCompare(b));
    return ['all', ...sorted];
  }, [sourceList]);

  const detectAudience = (p: ShopProduct): 'men' | 'women' | 'kids' | 'all' => {
    const title = (p.title ?? '').toLowerCase();
    const category = (p.category ?? '').toLowerCase();
    const url = (p.url ?? '').toLowerCase();
    const text = `${title} ${category} ${url}`;
    const isWomen = /(\bwomen\b|\bwoman\b|ladies|female|\bgirls\b)/.test(text);
    const isMen = /(\bmen\b|\bman\b|male|guys\b)/.test(text);
    const isKids = /(\bkid\b|\bkids\b|youth|\bboy\b|\bgirl\b|junior|toddler)/.test(text);
    if (isKids) return 'kids';
    if (isWomen && !isMen) return 'women';
    if (isMen && !isWomen) return 'men';
    return 'all';
  };

  const products: ShopProduct[] = useMemo(() => {
    let list = sourceList;
    if (selectedAudience !== 'all') {
      list = list.filter((p) => detectAudience(p) === selectedAudience);
    }
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => (p.category ?? '').toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    const sorted = [...list];
    if (sortKey === 'a-z') {
      sorted.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
    } else if (sortKey === 'price-low') {
      sorted.sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
    } else if (sortKey === 'price-high') {
      sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    } else {
      sorted.sort((a, b) => {
        const scoreA = (typeof a.price === 'number' ? 2 : 0) + (a.image ? 1 : 0);
        const scoreB = (typeof b.price === 'number' ? 2 : 0) + (b.image ? 1 : 0);
        return scoreB - scoreA;
      });
    }

    return sorted;
  }, [sourceList, searchQuery, selectedCategory, selectedAudience, sortKey]);

  const featured: ShopProduct[] = useMemo(() => products.slice(0, 8), [products]);

  const handleAddToCart = useCallback(
    async (p: ShopProduct) => {
      try {
        const product = mapShopProductToCartProduct(p);
        addToCart(product, 1);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        console.log('[Shop] addToCart failed:', e);
      }
    },
    [addToCart]
  );

  const renderProduct = useCallback(
    ({ item }: { item: ShopProduct }) => <ProductCard item={item} onAddToCart={handleAddToCart} />,
    [handleAddToCart]
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Ripped City Store',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.scanButton}
                onPress={() => router.push('/shop/scan' as never)}
              >
                <ScanLine size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={() => router.push('/shop/cart' as never)}
              >
                <ShoppingCart size={20} color={colors.text.primary} />
                {cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.brandMark}>
            <Sparkles size={18} color={colors.text.primary} />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.brandTitle}>Ripped City Store</Text>
            <Text style={styles.brandSubtitle}>
              Tap “Add” to build your cart • Checkout securely
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.text.secondary} />
            <TextInput
              testID="shop-search-input"
              style={styles.searchInput}
              placeholder="Search gear, supplements, ebooks…"
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity
                testID="shop-search-clear"
                onPress={() => setSearchQuery('')}
                activeOpacity={0.85}
                style={styles.clearBtn}
              >
                <X size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            testID="shop-filters-toggle"
            onPress={() => setShowFilters((v) => !v)}
            activeOpacity={0.85}
            style={[styles.sortBtn, showFilters && styles.sortBtnActive]}
          >
            <ArrowUpDown size={18} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {showFilters ? (
          <View style={styles.filterPanel} testID="shop-filter-panel">
            <Text style={styles.panelLabel}>Sort</Text>
            <View style={styles.sortRow}>
              {([
                { key: 'featured', label: 'Featured' },
                { key: 'price-low', label: 'Price ↑' },
                { key: 'price-high', label: 'Price ↓' },
                { key: 'a-z', label: 'A–Z' },
              ] as const).map((o) => (
                <TouchableOpacity
                  key={o.key}
                  testID={`shop-sort-${o.key}`}
                  onPress={() => setSortKey(o.key)}
                  activeOpacity={0.85}
                  style={[styles.sortChip, sortKey === o.key && styles.sortChipSelected]}
                >
                  <Text style={[styles.sortChipText, sortKey === o.key && styles.sortChipTextSelected]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.audienceContainer}>
        {(['all','men','women','kids'] as const).map((aud) => (
          <TouchableOpacity
            key={aud}
            testID={`audience-${aud}`}
            onPress={() => setSelectedAudience(aud)}
            activeOpacity={0.85}
            style={[styles.audienceChip, selectedAudience === aud && styles.audienceChipSelected]}
          >
            <Text style={[styles.audienceChipText, selectedAudience === aud && styles.audienceChipTextSelected]}>
              {aud === 'all' ? 'All' : aud.charAt(0).toUpperCase() + aud.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {categories.length > 1 && (
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(c) => c}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                testID={`category-${item}`}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.8}
                style={[styles.categoryChip, selectedCategory === item && styles.categoryChipSelected]}
              >
                <Text style={[styles.categoryChipText, selectedCategory === item && styles.categoryChipTextSelected]}>
                  {item === 'all' ? 'All' : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

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
            {selectedAudience !== 'all' ? (
              <Text style={styles.resultsCategory}>for {selectedAudience}</Text>
            ) : null}
            {selectedCategory !== 'all' ? (
              <Text style={styles.resultsCategory}>in {selectedCategory}</Text>
            ) : null}
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
            ListHeaderComponent={
              featured.length > 0 ? (
                <View style={styles.featuredWrap} testID="shop-featured">
                  <View style={styles.featuredHeader}>
                    <Text style={styles.featuredTitle}>Featured picks</Text>
                    <Text style={styles.featuredSub}>Fast adds, popular items</Text>
                  </View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={featured}
                    keyExtractor={(p) => `featured-${p.id}`}
                    contentContainerStyle={styles.featuredList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        testID={`shop-featured-open-${item.id}`}
                        activeOpacity={0.9}
                        onPress={() => Linking.openURL(item.url)}
                        style={styles.featuredCard}
                      >
                        {item.image ? (
                          <Image source={{ uri: item.image }} style={styles.featuredImage} />
                        ) : (
                          <View style={[styles.featuredImage, styles.imagePlaceholder]} />
                        )}
                        <View style={styles.featuredInfo}>
                          <Text style={styles.featuredName} numberOfLines={2}>
                            {item.title}
                          </Text>
                          <View style={styles.featuredBottomRow}>
                            <Text style={styles.featuredPrice} numberOfLines={1}>
                              {typeof item.price === 'number' ? `${item.price.toFixed(2)}` : 'See price'}
                            </Text>
                            <TouchableOpacity
                              testID={`shop-featured-add-${item.id}`}
                              activeOpacity={0.85}
                              onPress={() => handleAddToCart(item)}
                              style={[styles.featuredAddBtn, typeof item.price !== 'number' && styles.addButtonDisabled]}
                              disabled={typeof item.price !== 'number'}
                            >
                              <Plus size={14} color={colors.text.primary} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : null
            }
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
  hero: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextWrap: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sortBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sortBtnActive: {
    backgroundColor: colors.background.card,
  },
  filterPanel: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 10,
  },
  panelLabel: {
    color: colors.text.secondary,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sortChipSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  sortChipText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  sortChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
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
  resultsCategory: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  productsContainer: {
    padding: 16,
    paddingTop: 10,
  },
  featuredWrap: {
    marginBottom: 16,
  },
  featuredHeader: {
    paddingHorizontal: 2,
    paddingBottom: 10,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text.primary,
  },
  featuredSub: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  featuredList: {
    paddingHorizontal: 2,
    paddingBottom: 6,
    gap: 12,
  },
  featuredCard: {
    width: Math.min(260, width * 0.64),
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  featuredImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  featuredInfo: {
    padding: 12,
    gap: 8,
  },
  featuredName: {
    color: colors.text.primary,
    fontWeight: '800',
    lineHeight: 18,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredPrice: {
    color: colors.text.secondary,
    fontWeight: '800',
  },
  featuredAddBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  productImageContainer: {
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.40)',
  },
  overlayPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  imageContainer: {
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: 178,
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  categoryPill: {
    maxWidth: 96,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoryPillText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '700',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  addButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addButtonDisabled: {
    opacity: 0.45,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  viewPill: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPillText: {
    color: colors.text.primary,
    fontWeight: '800',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  audienceContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    gap: 8,
  },
  audienceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
  },
  audienceChipSelected: {
    backgroundColor: colors.accent.primary,
  },
  audienceChipText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  audienceChipTextSelected: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  categoriesList: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    marginHorizontal: 4,
  },
  categoryChipSelected: {
    backgroundColor: colors.accent.primary,
  },
  categoryChipText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: colors.text.primary,
    fontWeight: '700',
  },
});