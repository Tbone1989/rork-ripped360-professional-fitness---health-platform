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
import { Download, Star, Lock, Eye, BookOpen, User } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useBrandStore } from '@/store/brandStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { BrandedGuide } from '@/types/brand';

const { width } = Dimensions.get('window');
const GUIDE_WIDTH = (width - 48) / 2;

const categories = [
  { id: 'all', label: 'All Guides' },
  { id: 'training', label: 'Training' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'contest-prep', label: 'Contest Prep' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

export default function GuidesScreen() {
  const {
    brandedGuides,
    purchasedGuides,
    userMembership,
    purchaseGuide,
    canAccessGuide,
  } = useBrandStore();
  const user = useUserStore((state) => state.user);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPurchased, setShowPurchased] = useState(false);
  
  const filteredGuides = brandedGuides.filter(guide => {
    if (showPurchased && !purchasedGuides.includes(guide.id)) return false;
    if (selectedCategory === 'all') return true;
    return guide.category === selectedCategory;
  });
  
  const handlePurchaseGuide = (guide: BrandedGuide) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to purchase guides.');
      return;
    }
    
    if (!canAccessGuide(guide)) {
      if (guide.membershipRequired) {
        Alert.alert(
          'Membership Required',
          'This guide requires an active membership.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'View Plans', onPress: () => router.push('/brand/membership') }
          ]
        );
        return;
      }
      
      if (guide.price) {
        Alert.alert(
          'Purchase Guide',
          `Purchase "${guide.title}" for $${guide.price}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Purchase',
              onPress: () => {
                purchaseGuide(guide.id);
                Alert.alert('Success!', 'Guide purchased successfully!');
              }
            }
          ]
        );
        return;
      }
    }
    
    // Guide is accessible, download it
    Alert.alert('Download Started', 'Your guide is being downloaded.');
  };
  
  const renderGuide = ({ item: guide }: { item: BrandedGuide }) => {
    const isPurchased = purchasedGuides.includes(guide.id);
    const canAccess = canAccessGuide(guide);
    const memberDiscount = userMembership?.tier.discountPercentage || 0;
    const discountedPrice = guide.price ? guide.price * (1 - memberDiscount / 100) : 0;
    
    return (
      <TouchableOpacity
        style={styles.guideCard}
        onPress={() => router.push(`/brand/guide/${guide.id}`)}
      >
        <View style={styles.guideImageContainer}>
          <Image source={{ uri: guide.image }} style={styles.guideImage} />
          <View style={styles.guideOverlay}>
            {guide.featured && (
              <Badge label="Featured" variant="error" style={styles.featuredBadge} />
            )}
            {!canAccess && (
              <View style={styles.lockBadge}>
                <Lock size={12} color={colors.text.primary} />
              </View>
            )}
          </View>
          
          <View style={styles.guideStats}>
            <View style={styles.statItem}>
              <Download size={12} color={colors.text.primary} />
              <Text style={styles.statText}>{guide.downloadCount}</Text>
            </View>
            <View style={styles.statItem}>
              <BookOpen size={12} color={colors.text.primary} />
              <Text style={styles.statText}>{guide.pages}p</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.guideInfo}>
          <Text style={styles.guideTitle} numberOfLines={2}>
            {guide.title}
          </Text>
          
          <View style={styles.guideAuthor}>
            <User size={12} color={colors.text.secondary} />
            <Text style={styles.authorText} numberOfLines={1}>
              {guide.author}
            </Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={12} color={colors.status.warning} fill={colors.status.warning} />
            <Text style={styles.rating}>{guide.rating}</Text>
            <Text style={styles.reviewCount}>({guide.reviewCount})</Text>
          </View>
          
          <View style={styles.priceContainer}>
            {guide.membershipRequired && !guide.price ? (
              <Badge
                label="Member Exclusive"
                variant="success"
                style={styles.exclusiveBadge}
              />
            ) : guide.price ? (
              <View style={styles.priceInfo}>
                {memberDiscount > 0 && (
                  <Text style={styles.originalPrice}>${guide.price}</Text>
                )}
                <Text style={styles.price}>
                  ${memberDiscount > 0 ? discountedPrice.toFixed(2) : guide.price}
                </Text>
              </View>
            ) : (
              <Badge label="Free" variant="success" style={styles.freeBadge} />
            )}
          </View>
          
          <Button
            title={isPurchased ? 'Download' : canAccess ? 'Get Guide' : guide.price ? 'Purchase' : 'Upgrade Required'}
            onPress={() => handlePurchaseGuide(guide)}
            disabled={!canAccess && !guide.price}
            size="small"
            style={styles.actionButton}
          />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Branded Guides',
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nutrition & Training Guides</Text>
          <Text style={styles.headerSubtitle}>
            Expert knowledge from the Ripped City team
          </Text>
          
          {userMembership && (
            <View style={styles.memberBenefits}>
              <Badge
                label={`${userMembership.tier.discountPercentage}% Member Discount`}
                variant="success"
                style={styles.discountBadge}
              />
            </View>
          )}
        </View>
        
        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterTitle}>Category</Text>
          <ChipGroup
            options={categories}
            selectedIds={[selectedCategory]}
            onChange={(ids) => setSelectedCategory(ids[0])}
            multiSelect={false}
            style={styles.categoryChips}
          />
          
          <TouchableOpacity
            style={styles.purchasedToggle}
            onPress={() => setShowPurchased(!showPurchased)}
          >
            <Text style={[styles.purchasedText, showPurchased && styles.purchasedActive]}>
              {showPurchased ? 'Show All' : 'My Guides Only'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        {/* Guides Grid */}
        <FlatList
          data={filteredGuides}
          renderItem={renderGuide}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.guidesContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
        
        {filteredGuides.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {showPurchased ? 'No purchased guides found' : 'No guides found'}
            </Text>
            {!userMembership && (
              <Button
                title="Upgrade Membership"
                onPress={() => router.push('/brand/membership')}
                style={styles.upgradeButton}
              />
            )}
          </Card>
        )}
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
  },
  memberBenefits: {
    marginTop: 16,
  },
  discountBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filtersSection: {
    padding: 20,
    paddingTop: 0,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  categoryChips: {
    marginBottom: 16,
  },
  purchasedToggle: {
    alignSelf: 'flex-start',
  },
  purchasedText: {
    fontSize: 14,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  purchasedActive: {
    color: colors.accent.primary,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  guidesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  row: {
    justifyContent: 'space-between',
  },
  guideCard: {
    width: GUIDE_WIDTH,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  guideImageContainer: {
    position: 'relative',
  },
  guideImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  guideOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
  },
  lockBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 4,
  },
  guideStats: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  statText: {
    fontSize: 10,
    color: colors.text.primary,
    fontWeight: '600',
  },
  guideInfo: {
    padding: 12,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
    lineHeight: 18,
  },
  guideAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  authorText: {
    fontSize: 11,
    color: colors.text.secondary,
    flex: 1,
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
    minHeight: 20,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  exclusiveBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionButton: {
    marginTop: 4,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
    margin: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    paddingHorizontal: 24,
  },
});