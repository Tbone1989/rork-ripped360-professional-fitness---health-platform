import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Modal, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  TrendingDown,
  Clock,
  Star,
  Navigation,
  ShoppingCart,
  Bell,
  Tag,
  X,
  Check,
  Crosshair,
  Loader
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Badge } from '@/components/ui/Badge';
import { createPriceComparisons, mockGroceryStores } from '@/mocks/groceryData';
import { PriceComparison, GrocerySearchFilters, GroceryCategory } from '@/types/grocery';
import locationService, { UserLocation, LocationSearchResult } from '@/services/locationService';

export default function GroceryPricesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [locationSearchResults, setLocationSearchResults] = useState<LocationSearchResult[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [filters, setFilters] = useState<GrocerySearchFilters>({
    sortBy: 'price',
    maxDistance: 10
  });
  const [showAllModal, setShowAllModal] = useState<boolean>(false);
  const [selectedComparison, setSelectedComparison] = useState<PriceComparison | null>(null);
  const [allSort, setAllSort] = useState<'price' | 'distance'>('price');
  const [allIncludeFar, setAllIncludeFar] = useState<boolean>(false);

  useEffect(() => {
    if (!currentLocation) {
      (async () => {
        try {
          console.log('Requesting current location on mount...');
          const loc = await locationService.getCurrentLocation();
          if (loc) {
            console.log('Current location acquired on mount:', loc);
            setCurrentLocation(loc);
            locationService.setCurrentLocation(loc);
          } else {
            console.warn('Current location not available on mount, using sample location');
            const fallbackStore = mockGroceryStores[0];
            const fallbackLocation: UserLocation = {
              city: fallbackStore.city,
              state: fallbackStore.state,
              zipCode: fallbackStore.zipCode,
              coordinates: fallbackStore.coordinates,
              address: fallbackStore.address
            };
            setCurrentLocation(fallbackLocation);
            locationService.setCurrentLocation(fallbackLocation);
          }
        } catch (e) {
          console.error('Failed to acquire current location on mount', e);
          const fallbackStore = mockGroceryStores[0];
          const fallbackLocation: UserLocation = {
            city: fallbackStore.city,
            state: fallbackStore.state,
            zipCode: fallbackStore.zipCode,
            coordinates: fallbackStore.coordinates,
            address: fallbackStore.address
          };
          setCurrentLocation(fallbackLocation);
          locationService.setCurrentLocation(fallbackLocation);
        }
      })();
    }
  }, []);

  // Search locations when query changes
  useEffect(() => {
    const searchLocations = async () => {
      if (locationSearchQuery.length > 2) {
        setIsSearchingLocations(true);
        try {
          const results = await locationService.searchLocations(locationSearchQuery);
          setLocationSearchResults(results);
        } catch (error) {
          console.error('Error searching locations:', error);
        } finally {
          setIsSearchingLocations(false);
        }
      } else {
        setLocationSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [locationSearchQuery]);

  const priceComparisons = useMemo(() => {
    if (!currentLocation) return [];

    const isEligibleStore = (storeState?: string, storeZip?: string, closed?: boolean, distance?: number) => {
      if (closed) return false;
      if (!storeState || storeState !== currentLocation.state) return false;
      const maxD = filters.maxDistance ?? 10;
      const withinDistance = (distance ?? Number.MAX_SAFE_INTEGER) <= maxD;
      if (currentLocation.zipCode && storeZip) {
        const sameZip = currentLocation.zipCode === storeZip;
        return sameZip || withinDistance;
      }
      return withinDistance;
    };
    
    const comparisons = createPriceComparisons();
    return comparisons.map(comparison => {
      const pricesWithDistance = comparison.prices.map(price => {
        const dist = locationService.calculateDistance(
          currentLocation.coordinates.latitude,
          currentLocation.coordinates.longitude,
          price.store.coordinates.latitude,
          price.store.coordinates.longitude
        );
        return {
          ...price,
          store: {
            ...price.store,
            distance: dist,
          }
        };
      });

      const eligiblePrices = pricesWithDistance.filter(p =>
        isEligibleStore(p.store.state, p.store.zipCode, p.store.permanentlyClosed, p.store.distance)
      );

      const lowest = eligiblePrices.length > 0
        ? [...eligiblePrices].sort((a,b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))[0]
        : pricesWithDistance.sort((a,b) => (a.store.distance ?? 0) - (b.store.distance ?? 0))[0];

      return {
        ...comparison,
        prices: eligiblePrices,
        lowestPrice: lowest,
      };
    });
  }, [currentLocation, filters.maxDistance]);

  const categoryOptions = [
    { id: 'all' as const, label: 'All Categories' },
    { id: 'produce' as const, label: 'Produce' },
    { id: 'meat' as const, label: 'Meat & Seafood' },
    { id: 'dairy' as const, label: 'Dairy' },
    { id: 'pantry' as const, label: 'Pantry' },
    { id: 'frozen' as const, label: 'Frozen' },
    { id: 'beverages' as const, label: 'Beverages' }
  ];

  const sortOptions = [
    { id: 'price' as const, label: 'Lowest Price' },
    { id: 'distance' as const, label: 'Nearest Store' },
    { id: 'name' as const, label: 'Name A-Z' },
    { id: 'rating' as const, label: 'Best Rating' }
  ];

  const computedComparisons = useMemo(() => {
    let filtered = priceComparisons;
    let note: 'none' | 'expanded' | 'nearest' = 'none';

    if (searchQuery) {
      filtered = filtered.filter(comparison =>
        comparison.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comparison.item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comparison.item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(comparison => comparison.item.category === filters.category);
    }

    if (filters.maxDistance) {
      filtered = filtered.filter(comparison => {
        const maxD = filters.maxDistance ?? Number.MAX_SAFE_INTEGER;
        const hasLocal = comparison.prices.some(p => (p.store.distance ?? Number.MAX_SAFE_INTEGER) <= maxD);
        return hasLocal;
      });
    }

    if (currentLocation) {
      filtered = filtered.filter(comparison =>
        comparison.prices.some(p => p.store.state === currentLocation.state && !p.store.permanentlyClosed)
      );
    }

    if (filtered.length === 0 && priceComparisons.length > 0) {
      const expanded = priceComparisons.filter(c => {
        const d = c.lowestPrice.store.distance ?? Number.MAX_SAFE_INTEGER;
        const sameState = currentLocation ? c.lowestPrice.store.state === currentLocation.state : true;
        return sameState && d <= 25;
      });
      if (expanded.length > 0) {
        note = 'expanded';
        filtered = expanded;
      } else {
        note = 'nearest';
        filtered = [...priceComparisons]
          .filter(c => (currentLocation ? c.lowestPrice.store.state === currentLocation.state : true))
          .sort((a, b) => (a.lowestPrice.store.distance ?? Number.MAX_SAFE_INTEGER) - (b.lowestPrice.store.distance ?? Number.MAX_SAFE_INTEGER))
          .slice(0, 10);
      }
    }

    switch (filters.sortBy) {
      case 'price':
        filtered.sort((a, b) => (a.lowestPrice.salePrice || a.lowestPrice.price) - (b.lowestPrice.salePrice || b.lowestPrice.price));
        break;
      case 'distance':
        filtered.sort((a, b) => (a.lowestPrice.store.distance || 0) - (b.lowestPrice.store.distance || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.item.name.localeCompare(b.item.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (a.lowestPrice.salePrice || a.lowestPrice.price) - (b.lowestPrice.salePrice || b.lowestPrice.price));
        break;
    }

    return { list: filtered, note } as const;
  }, [priceComparisons, searchQuery, filters]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const calculateSavingsPercentage = (comparison: PriceComparison) => {
    if (comparison.savings <= 0) return 0;
    return Math.round((comparison.savings / comparison.averagePrice) * 100);
  };

  const handleLocationChange = (location: UserLocation) => {
    console.log('Changing location to:', location);
    setCurrentLocation(location);
    locationService.setCurrentLocation(location);
    setShowLocationPicker(false);
    setLocationSearchQuery('');
    setLocationSearchResults([]);
  };

  const getCurrentLocationText = () => {
    if (!currentLocation) return 'Select Location';
    return `${currentLocation.city}, ${currentLocation.state}`;
  };

  const getNearbyStoresCount = () => {
    if (!currentLocation) return 0;
    
    return mockGroceryStores.filter(store => {
      if (store.permanentlyClosed) return false;
      if (store.state !== currentLocation.state) return false;
      const distance = locationService.calculateDistance(
        currentLocation.coordinates.latitude,
        currentLocation.coordinates.longitude,
        store.coordinates.latitude,
        store.coordinates.longitude
      );
      return distance <= (filters.maxDistance || 10);
    }).length;
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        locationService.setCurrentLocation(location);
        Alert.alert('Location Updated', `Found your location: ${location.city}, ${location.state}`);
      } else {
        Alert.alert(
          'Location Access Denied', 
          'Please enable location services to find stores near you, or manually select your location.'
        );
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Please try again or select manually.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSelect = (location: LocationSearchResult) => {
    console.log('Selecting location from search:', location);
    const userLocation: UserLocation = {
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      coordinates: location.coordinates
    };
    handleLocationChange(userLocation);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Grocery Price Finder',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowFilters(!showFilters)}
              testID="toggle-filters"
            >
              <Filter size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Location Header */}
      <Card style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <View style={styles.locationIcon}>
            <MapPin size={20} color={colors.accent.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>{getCurrentLocationText()}</Text>
            <Text style={styles.locationSubtitle}>Searching {getNearbyStoresCount()} nearby stores</Text>
          </View>
          <TouchableOpacity 
            style={styles.changeLocationButton}
            onPress={() => {
              console.log('Change location button pressed');
              setShowLocationPicker(true);
            }}
            activeOpacity={0.7}
            testID="change-location"
          >
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Search */}
      <View style={styles.searchSection}>
        <Input
          placeholder="Search for groceries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          testID="search-input"
        />
      </View>

      {/* Filters */}
      {showFilters && (
        <Card style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category</Text>
            <ChipGroup
              options={categoryOptions}
              selectedIds={[filters.category || 'all']}
              onChange={(ids) => {
                const selectedId = ids[0];
                if (selectedId === 'all') {
                  setFilters(prev => ({ ...prev, category: undefined }));
                } else {
                  setFilters(prev => ({ ...prev, category: selectedId as GroceryCategory }));
                }
              }}
              style={styles.filterChips}
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <ChipGroup
              options={sortOptions}
              selectedIds={[filters.sortBy || 'price']}
              onChange={(ids) => setFilters(prev => ({ ...prev, sortBy: ids[0] as 'price' | 'distance' | 'name' | 'rating' }))}
              style={styles.filterChips}
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Max Distance</Text>
            <View style={styles.distanceOptions}>
              {[1, 3, 5, 10, 15, 20].map(distance => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.distanceOption,
                    filters.maxDistance === distance && styles.distanceOptionSelected
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, maxDistance: distance }))}
                >
                  <Text style={[
                    styles.distanceOptionText,
                    filters.maxDistance === distance && styles.distanceOptionTextSelected
                  ]}>
                    {distance} mi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>
      )}

      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          Found {computedComparisons.list.length} items • Sorted by {sortOptions.find(opt => opt.id === filters.sortBy)?.label}
        </Text>
        {computedComparisons.note !== 'none' && (
          <View style={styles.sampleNotice}>
            <Text style={styles.sampleNoticeText}>
              {computedComparisons.note === 'expanded' ? 'No nearby stores in your selected distance. Expanded search to 25 miles.' : 'No nearby stores. Showing the nearest options we could find.'}
            </Text>
          </View>
        )}
        {!currentLocation && (
          <View style={styles.sampleNotice}>
            <Text style={styles.sampleNoticeText}>Location not set. Using a sample area. Tap Change to pick yours.</Text>
          </View>
        )}
      </View>

      {/* Price Comparisons */}
      <View style={styles.resultsSection}>
        {computedComparisons.list.length === 0 && (
          <Card style={styles.comparisonCard}>
            <Text style={styles.summaryText}>No stores found within your filters.</Text>
            <View style={{ height: 8 }} />
            <Button
              title={`Expand distance to 25 mi`}
              onPress={() => setFilters(prev => ({ ...prev, maxDistance: 25 }))}
            />
          </Card>
        )}
        {computedComparisons.list.map((comparison) => {
          const maxD = filters.maxDistance ?? Number.MAX_SAFE_INTEGER;
          const localPrices = comparison.prices.filter(p => (p.store.distance ?? Number.MAX_SAFE_INTEGER) <= maxD);
          const displayBest = (localPrices.length > 0
            ? localPrices.reduce((a, b) => ((a.salePrice ?? a.price) <= (b.salePrice ?? b.price) ? a : b))
            : comparison.lowestPrice);
          const savingsPercentage = calculateSavingsPercentage({ ...comparison, lowestPrice: displayBest });
          const currentPrice = displayBest.salePrice || displayBest.price;
          const isOnSale = !!displayBest.salePrice;

          return (
            <Card key={comparison.item.id} style={styles.comparisonCard}>
              <View style={styles.comparisonHeader}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemImagePlaceholder}>
                    <Text style={styles.itemImageText}>
                      {comparison.item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{comparison.item.name}</Text>
                    {comparison.item.brand && (
                      <Text style={styles.itemBrand}>{comparison.item.brand}</Text>
                    )}
                    <View style={styles.itemTags}>
                      {comparison.item.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} label={tag} variant="default" style={styles.itemTag} />
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.priceInfo}>
                  <View style={styles.bestPrice}>
                    <Text style={styles.currentPrice}>{formatPrice(currentPrice)}</Text>
                    {isOnSale && comparison.lowestPrice.price && (
                      <Text style={styles.originalPrice}>{formatPrice(comparison.lowestPrice.price)}</Text>
                    )}
                  </View>
                  {savingsPercentage > 0 && (
                    <View style={styles.savingsBadge}>
                      <TrendingDown size={12} color={colors.status.success} />
                      <Text style={styles.savingsText}>Save {savingsPercentage}%</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Best Store */}
              <View style={styles.bestStore}>
                <View style={styles.storeHeader}>
                  <Text style={styles.bestStoreLabel}>Best Price at:</Text>
                  {isOnSale && (
                    <View style={styles.saleTag}>
                      <Tag size={12} color={colors.status.warning} />
                      <Text style={styles.saleText}>ON SALE</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.storeInfo}>
                  <View style={styles.storeDetails}>
                    <Text style={styles.storeName}>{displayBest.store.name}</Text>
                    <View style={styles.storeLocation}>
                      <MapPin size={12} color={colors.text.secondary} />
                      <Text style={styles.storeDistance}>
                        {displayBest.store.distance?.toFixed(1)} mi away
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.storeActions}>
                    <TouchableOpacity 
                      style={styles.directionsButton}
                      onPress={() => {
                        console.log('Get directions to:', displayBest.store.name);
                        // In a real app, this would open maps with directions
                      }}
                    >
                      <Navigation size={16} color={colors.accent.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.addToListButton}
                      onPress={() => {
                        router.push(`/meals/shopping-list?item=${encodeURIComponent(comparison.item.name)}`)
                      }}
                    >
                      <ShoppingCart size={16} color={colors.accent.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Price Comparison */}
              <View style={styles.priceComparison}>
                <Text style={styles.comparisonTitle}>Price Comparison</Text>
                <View style={styles.priceList}>
                  {(() => {
                    const maxD = filters.maxDistance ?? Number.MAX_SAFE_INTEGER;
                    const local = comparison.prices.filter(p => (p.store.distance ?? Number.MAX_SAFE_INTEGER) <= maxD);
                    const list = (local.length > 0
                      ? [...local].sort((a,b)=> (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
                      : [...comparison.prices].sort((a,b)=> (a.store.distance ?? 0) - (b.store.distance ?? 0))
                    ).filter(p => !p.store.permanentlyClosed).slice(0,3);
                    return list.map((priceData, index) => {
                      const price = priceData.salePrice || priceData.price;
                      const isLowest = index === 0;
                      return (
                        <View key={priceData.id} style={styles.priceItem}>
                          <View style={styles.priceStoreInfo}>
                            <Text style={[
                              styles.priceStoreName,
                              isLowest && styles.priceStoreNameBest
                            ]}>
                              {priceData.store.name}
                            </Text>
                            <Text style={styles.priceStoreDistance}>
                              {priceData.store.distance?.toFixed(1)} mi
                            </Text>
                          </View>
                          <View style={styles.priceValue}>
                            <Text style={[
                              styles.priceAmount,
                              isLowest && styles.priceAmountBest
                            ]}>
                              {formatPrice(price)}
                            </Text>
                            {priceData.salePrice && (
                              <Text style={styles.priceOriginal}>
                                {formatPrice(priceData.price)}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    });
                  })()}
                </View>
                
                {comparison.prices.length > 3 && (
                  <TouchableOpacity 
                    style={styles.viewAllButton}
                    onPress={() => {
                      console.log('Opening all stores modal for:', comparison.item.name);
                      setSelectedComparison(comparison);
                      setAllSort('price');
                      setShowAllModal(true);
                    }}
                    testID={`view-all-stores-${comparison.item.id}`}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>
                      View all {comparison.prices.length} stores
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Actions */}
              <View style={styles.itemActions}>
                <Button
                  title="Add to List"
                  variant="outline"
                  onPress={() => {
                    router.push(`/meals/shopping-list?item=${encodeURIComponent(comparison.item.name)}`)
                  }}
                  icon={<ShoppingCart size={16} color={colors.accent.primary} />}
                  style={styles.actionButton}
                />
                <Button
                  title="Price Alert"
                  variant="outline"
                  onPress={() => {
                    console.log('Set price alert for:', comparison.item.name);
                    // In a real app, this would set up price alerts
                  }}
                  icon={<Bell size={16} color={colors.accent.primary} />}
                  style={styles.actionButton}
                />
              </View>
            </Card>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="Create Shopping List"
          onPress={() => {
            router.push('/meals/shopping-list')
          }}
          icon={<ShoppingCart size={18} color={colors.text.primary} />}
          style={styles.quickActionButton}
        />
        <Button
          title="Set Price Alerts"
          variant="outline"
          onPress={() => {
            router.push('/meals/price-alerts')
          }}
          icon={<Bell size={18} color={colors.accent.primary} />}
          style={styles.quickActionButton}
        />
      </View>

      {/* All Stores Modal */}
      <Modal
        visible={showAllModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAllModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedComparison ? `All stores • ${selectedComparison.item.name}` : 'All stores'}
            </Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowAllModal(false)}
              testID="close-all-stores"
            >
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedComparison && (
              <>
                <View style={styles.allStoresHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.summaryText}>
                      {allIncludeFar ? `Showing all ${selectedComparison.prices.length} stores` : `Showing nearby stores (within ${filters.maxDistance ?? 10} mi)`}
                    </Text>
                    <Text style={[styles.summaryText, { marginTop: 4 }]}>
                      Prices are sample data for demo only
                    </Text>
                  </View>
                  <View style={styles.allStoresSortTabs}>
                    <TouchableOpacity
                      style={[styles.sortTab, allSort === 'price' && styles.sortTabActive]}
                      onPress={() => setAllSort('price')}
                      testID="sort-all-price"
                    >
                      <Text style={[styles.sortTabText, allSort === 'price' && styles.sortTabTextActive]}>Lowest Price</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.sortTab, allSort === 'distance' && styles.sortTabActive]}
                      onPress={() => setAllSort('distance')}
                      testID="sort-all-distance"
                    >
                      <Text style={[styles.sortTabText, allSort === 'distance' && styles.sortTabTextActive]}>Nearest</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <TouchableOpacity
                    onPress={() => setAllIncludeFar(prev => !prev)}
                    style={[styles.distanceOption, allIncludeFar && styles.distanceOptionSelected]}
                    testID="toggle-include-far"
                  >
                    <Text style={[styles.distanceOptionText, allIncludeFar && styles.distanceOptionTextSelected]}>
                      {allIncludeFar ? 'Include far stores' : 'Only nearby stores'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.allStoresList}>
                  {(() => {
                    const maxD = filters.maxDistance ?? Number.MAX_SAFE_INTEGER;
                    const withDistance = selectedComparison.prices.map(p => p).filter(p => !p.store.permanentlyClosed && (!currentLocation || p.store.state === currentLocation.state));
                    const scoped = allIncludeFar ? withDistance : withDistance.filter(p => (p.store.distance ?? Number.MAX_SAFE_INTEGER) <= maxD);
                    const sorted = scoped.sort((a,b) => {
                      if (allSort === 'price') {
                        return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
                      }
                      return (a.store.distance ?? Number.MAX_SAFE_INTEGER) - (b.store.distance ?? Number.MAX_SAFE_INTEGER);
                    });
                    return sorted.map((p) => {
                      const price = p.salePrice ?? p.price;
                      return (
                        <View key={p.id} style={styles.allStoreRow} testID={`all-store-${p.id}`}>
                          <View style={styles.allStoreLeft}>
                            <Text style={styles.priceStoreName}>{p.store.name}</Text>
                            <View style={styles.storeLocation}>
                              <MapPin size={12} color={colors.text.secondary} />
                              <Text style={styles.priceStoreDistance}>{p.store.distance?.toFixed(1)} mi</Text>
                            </View>
                          </View>
                          <View style={styles.allStoreRight}>
                            <Text style={styles.priceAmount}>{formatPrice(price)}</Text>
                            {p.salePrice && (
                              <Text style={styles.priceOriginal}>{formatPrice(p.price)}</Text>
                            )}
                          </View>
                        </View>
                      );
                    });
                  })()}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Location</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowLocationPicker(false)}
            >
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Select your location to find the best grocery prices near you
            </Text>
            
            {/* Current Location Button */}
            <TouchableOpacity 
              style={styles.currentLocationButton}
              onPress={handleGetCurrentLocation}
              disabled={isLoadingLocation}
            >
              <View style={styles.currentLocationContent} testID="use-current-location">
                <View style={styles.currentLocationIcon}>
                  {isLoadingLocation ? (
                    <ActivityIndicator size="small" color={colors.accent.primary} />
                  ) : (
                    <Crosshair size={20} color={colors.accent.primary} />
                  )}
                </View>
                <View style={styles.currentLocationInfo}>
                  <Text style={styles.currentLocationTitle}>
                    {isLoadingLocation ? 'Getting your location...' : 'Use Current Location'}
                  </Text>
                  <Text style={styles.currentLocationSubtitle}>
                    Automatically detect your location
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Search Location */}
            <View style={styles.locationSearchSection}>
              <Text style={styles.locationSearchLabel}>Or search for a location:</Text>
              <Input
                placeholder="Enter city, state, or zip code"
                value={locationSearchQuery}
                onChangeText={setLocationSearchQuery}
                style={styles.locationSearchInput}
              />
              
              {/* Search Results */}
              {isSearchingLocations && (
                <View style={styles.searchingIndicator}>
                  <ActivityIndicator size="small" color={colors.accent.primary} />
                  <Text style={styles.searchingText}>Searching...</Text>
                </View>
              )}
              
              {locationSearchResults.length > 0 && (
                <View style={styles.searchResults}>
                  {locationSearchResults.map((location) => (
                    <TouchableOpacity
                      key={location.id}
                      style={styles.searchResultItem}
                      onPress={() => handleLocationSelect(location)}
                      activeOpacity={0.7}
                      testID={`location-result-${location.id}`}
                    >
                      <View style={styles.searchResultIcon}>
                        <MapPin size={16} color={colors.text.secondary} />
                      </View>
                      <Text style={styles.searchResultText}>
                        {location.displayName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Popular Locations</Text>
              <View style={styles.dividerLine} />
            </View>
            
            {/* Available Locations */}
            {mockGroceryStores.reduce((uniqueLocations: UserLocation[], store) => {
              const locationKey = `${store.city}-${store.state}`;
              if (!uniqueLocations.find(loc => `${loc.city}-${loc.state}` === locationKey)) {
                uniqueLocations.push({
                  city: store.city,
                  state: store.state,
                  zipCode: store.zipCode,
                  coordinates: store.coordinates
                });
              }
              return uniqueLocations;
            }, []).map((location) => {
              const isSelected = currentLocation && location.city === currentLocation.city && location.state === currentLocation.state;
              
              return (
                <TouchableOpacity
                  key={`${location.city}-${location.state}`}
                  style={[
                    styles.locationOption,
                    isSelected && styles.locationOptionSelected
                  ]}
                  onPress={() => {
                    console.log('Location option pressed:', location);
                    handleLocationChange(location);
                  }}
                  activeOpacity={0.7}
                  testID={`popular-location-${location.city}-${location.state}`}
                >
                  <View style={styles.locationOptionContent}>
                    <View style={styles.locationOptionIcon}>
                      <MapPin size={20} color={isSelected ? colors.accent.primary : colors.text.secondary} />
                    </View>
                    <View style={styles.locationOptionInfo}>
                      <Text style={[
                        styles.locationOptionTitle,
                        isSelected && styles.locationOptionTitleSelected
                      ]}>
                        {location.city}, {location.state}
                      </Text>
                      {location.zipCode && (
                        <Text style={styles.locationOptionSubtitle}>
                          {location.zipCode}
                        </Text>
                      )}
                    </View>
                    {isSelected && (
                      <View style={styles.locationOptionCheck}>
                        <Check size={20} color={colors.accent.primary} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
            
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>
                Don&apos;t see your location? We&apos;re expanding to more areas soon!
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationCard: {
    margin: 16,
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  locationSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  changeLocationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
  },
  changeLocationText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  filterChips: {
    marginBottom: 0,
  },
  distanceOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  distanceOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  distanceOptionSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  distanceOptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  distanceOptionTextSelected: {
    color: colors.text.primary,
  },
  summarySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  sampleNotice: {
    marginTop: 8,
    backgroundColor: colors.background.secondary,
    padding: 8,
    borderRadius: 8,
  },
  sampleNoticeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  resultsSection: {
    paddingHorizontal: 16,
  },
  comparisonCard: {
    marginBottom: 16,
    padding: 16,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemImageText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  itemTags: {
    flexDirection: 'row',
    gap: 6,
  },
  itemTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  bestPrice: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.status.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '600',
  },
  bestStore: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bestStoreLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  saleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.status.warning + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saleText: {
    fontSize: 10,
    color: colors.status.warning,
    fontWeight: '600',
  },
  storeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  storeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeDistance: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  storeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  directionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToListButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceComparison: {
    marginBottom: 16,
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  priceList: {
    gap: 8,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  priceStoreInfo: {
    flex: 1,
  },
  priceStoreName: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  priceStoreNameBest: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  priceStoreDistance: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  priceValue: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  priceAmountBest: {
    color: colors.accent.primary,
  },
  priceOriginal: {
    fontSize: 12,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  locationOption: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locationOptionSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary + '10',
  },
  locationOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  locationOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationOptionInfo: {
    flex: 1,
  },
  locationOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  locationOptionTitleSelected: {
    color: colors.accent.primary,
  },
  locationOptionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  locationOptionCheck: {
    marginLeft: 12,
  },
  modalFooter: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  modalFooterText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  currentLocationButton: {
    backgroundColor: colors.accent.primary + '10',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.accent.primary + '30',
  },
  currentLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentLocationInfo: {
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  currentLocationSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  locationSearchSection: {
    marginBottom: 24,
  },
  locationSearchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  locationSearchInput: {
    marginBottom: 12,
  },
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  searchingText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  searchResults: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  searchResultIcon: {
    marginRight: 12,
  },
  searchResultText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  allStoresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  allStoresSortTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sortTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortTabActive: {
    backgroundColor: colors.background.tertiary,
  },
  sortTabText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  sortTabTextActive: {
    color: colors.text.primary,
  },
  allStoresList: {
    marginTop: 8,
    gap: 8,
  },
  allStoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  allStoreLeft: {
    flex: 1,
  },
  allStoreRight: {
    alignItems: 'flex-end',
  },
});