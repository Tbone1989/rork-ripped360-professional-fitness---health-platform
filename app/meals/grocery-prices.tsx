import React, { useState, useMemo, useEffect } from 'react';
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
    maxDistance: 5
  });

  // Initialize with default location
  useEffect(() => {
    if (!currentLocation) {
      setCurrentLocation({
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        coordinates: { latitude: 39.7817, longitude: -89.6501 }
      });
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
    
    const comparisons = createPriceComparisons();
    // Update store distances based on current location
    return comparisons.map(comparison => ({
      ...comparison,
      prices: comparison.prices.map(price => ({
        ...price,
        store: {
          ...price.store,
          distance: locationService.calculateDistance(
            currentLocation.coordinates.latitude,
            currentLocation.coordinates.longitude,
            price.store.coordinates.latitude,
            price.store.coordinates.longitude
          )
        }
      })),
      lowestPrice: {
        ...comparison.lowestPrice,
        store: {
          ...comparison.lowestPrice.store,
          distance: locationService.calculateDistance(
            currentLocation.coordinates.latitude,
            currentLocation.coordinates.longitude,
            comparison.lowestPrice.store.coordinates.latitude,
            comparison.lowestPrice.store.coordinates.longitude
          )
        }
      }
    }));
  }, [currentLocation]);

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

  const filteredComparisons = useMemo(() => {
    let filtered = priceComparisons;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(comparison =>
        comparison.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comparison.item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comparison.item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(comparison => comparison.item.category === filters.category);
    }

    // Distance filter
    if (filters.maxDistance) {
      filtered = filtered.filter(comparison => 
        comparison.lowestPrice.store.distance! <= filters.maxDistance!
      );
    }

    // Sort
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
        // Sort by rating if available, fallback to price
        filtered.sort((a, b) => (a.lowestPrice.salePrice || a.lowestPrice.price) - (b.lowestPrice.salePrice || b.lowestPrice.price));
        break;
    }

    return filtered;
  }, [priceComparisons, searchQuery, filters]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const calculateSavingsPercentage = (comparison: PriceComparison) => {
    if (comparison.savings <= 0) return 0;
    return Math.round((comparison.savings / comparison.averagePrice) * 100);
  };

  const handleLocationChange = (location: UserLocation) => {
    setCurrentLocation(location);
    locationService.setCurrentLocation(location);
    setShowLocationPicker(false);
  };

  const getCurrentLocationText = () => {
    if (!currentLocation) return 'Select Location';
    return `${currentLocation.city}, ${currentLocation.state}`;
  };

  const getNearbyStoresCount = () => {
    if (!currentLocation) return 0;
    
    return mockGroceryStores.filter(store => {
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
    const userLocation: UserLocation = {
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      coordinates: location.coordinates
    };
    setCurrentLocation(userLocation);
    locationService.setCurrentLocation(userLocation);
    setShowLocationPicker(false);
    setLocationSearchQuery('');
    setLocationSearchResults([]);
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
            onPress={() => setShowLocationPicker(true)}
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
              {[1, 3, 5, 10].map(distance => (
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

      {/* Results Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          Found {filteredComparisons.length} items • Sorted by {sortOptions.find(opt => opt.id === filters.sortBy)?.label}
        </Text>
      </View>

      {/* Price Comparisons */}
      <View style={styles.resultsSection}>
        {filteredComparisons.map((comparison) => {
          const savingsPercentage = calculateSavingsPercentage(comparison);
          const currentPrice = comparison.lowestPrice.salePrice || comparison.lowestPrice.price;
          const isOnSale = !!comparison.lowestPrice.salePrice;

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
                    <Text style={styles.storeName}>{comparison.lowestPrice.store.name}</Text>
                    <View style={styles.storeLocation}>
                      <MapPin size={12} color={colors.text.secondary} />
                      <Text style={styles.storeDistance}>
                        {comparison.lowestPrice.store.distance?.toFixed(1)} mi away
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.storeActions}>
                    <TouchableOpacity style={styles.directionsButton}>
                      <Navigation size={16} color={colors.accent.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addToListButton}>
                      <ShoppingCart size={16} color={colors.accent.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Price Comparison */}
              <View style={styles.priceComparison}>
                <Text style={styles.comparisonTitle}>Price Comparison</Text>
                <View style={styles.priceList}>
                  {comparison.prices.slice(0, 3).map((priceData, index) => {
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
                  })}
                </View>
                
                {comparison.prices.length > 3 && (
                  <TouchableOpacity style={styles.viewAllButton}>
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
                  onPress={() => {}}
                  icon={<ShoppingCart size={16} color={colors.accent.primary} />}
                  style={styles.actionButton}
                />
                <Button
                  title="Price Alert"
                  variant="outline"
                  onPress={() => {}}
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
          onPress={() => router.push('/meals/shopping-list')}
          icon={<ShoppingCart size={18} color={colors.text.primary} />}
          style={styles.quickActionButton}
        />
        <Button
          title="Set Price Alerts"
          variant="outline"
          onPress={() => router.push('/meals/price-alerts')}
          icon={<Bell size={18} color={colors.accent.primary} />}
          style={styles.quickActionButton}
        />
      </View>

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
              <View style={styles.currentLocationContent}>
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
            {mockGroceryStores.reduce((uniqueLocations: any[], store) => {
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
                  onPress={() => handleLocationChange(location)}
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
});