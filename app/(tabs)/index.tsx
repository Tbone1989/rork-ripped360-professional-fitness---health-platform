import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Dumbbell, Users, Activity, TrendingUp, ShoppingBag, Star, Trophy, Crown, BookOpen, DollarSign } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { brandAssets } from '@/constants/brand';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { WorkoutCard } from '@/components/workout/WorkoutCard';
import { CategoryCard } from '@/components/workout/CategoryCard';
import { CoachCard } from '@/components/coaching/CoachCard';
import { Avatar } from '@/components/ui/Avatar';
import { useUserStore } from '@/store/userStore';
import { useShopStore } from '@/store/shopStore';
import { featuredWorkoutPlans } from '@/mocks/workouts';
import { workoutCategories } from '@/mocks/workouts';
import { featuredCoaches } from '@/mocks/coaches';
import { featuredProducts } from '@/mocks/products';
import { trpc } from '@/lib/trpc';

type ShopProduct = { id: string; title: string; url: string; image?: string; price?: number };

export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { cartItems } = useShopStore();
  const { data: shopData } = trpc.shop.products.useQuery({});

  const [fallback, setFallback] = React.useState<ShopProduct[]>([]);
  const [fallbackTried, setFallbackTried] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchFallback = async () => {
      if ((Array.isArray(shopData) && shopData.length > 0) || fallbackTried) return;
      setFallbackTried(true);
      try {
        const urls = [
          `https://www.rippedcityinc.com/products.json?limit=50&_v=${Date.now()}`,
          `https://www.rippedcityinc.com/collections/all/products.json?limit=50&_v=${Date.now()}`,
        ];
        for (const u of urls) {
          try {
            const res = await fetch(u, { cache: 'no-store' as const, headers: { Accept: 'application/json, text/plain, */*' } });
            if (!res.ok) continue;
            const text = await res.text();
            let json: any;
            try { json = JSON.parse(text); } catch { continue; }
            const arr = Array.isArray(json?.products) ? json.products : Array.isArray(json) ? json : [];
            const parsed: ShopProduct[] = arr.slice(0, 12).map((p: any) => {
              const handle = p.handle ?? undefined;
              const url = handle ? `https://www.rippedcityinc.com/products/${handle}` : (typeof p.url === 'string' ? p.url : 'https://www.rippedcityinc.com');
              const image = p.image?.src ?? p.images?.[0]?.src ?? p.featured_image ?? undefined;
              const price = typeof p.price === 'number' ? (p.price > 1000 ? p.price / 100 : p.price) : typeof p.price_min === 'number' ? p.price_min / 100 : typeof p.variants?.[0]?.price === 'string' ? Number(p.variants[0].price) : undefined;
              return { id: String(p.id ?? p.handle ?? p.title ?? Math.random()), title: String(p.title ?? ''), url, image, price };
            }).filter((p: ShopProduct) => !!p.title);
            if (parsed.length > 0) {
              setFallback(parsed);
              break;
            }
          } catch {}
        }
      } catch {}
    };
    fetchFallback();
  }, [shopData, fallbackTried]);

  type FeaturedItem = { id: string; name: string; image: string; price?: number; rating?: number; isExternal: boolean; url?: string };
  const featuredList: FeaturedItem[] = React.useMemo(() => {
    const source = Array.isArray(shopData) && shopData.length > 0 ? (shopData as any[]).slice(0, 3) : fallback.slice(0, 3);
    if (source.length > 0) {
      return source.map((p: any) => ({
        id: String(p.id ?? p.title ?? Math.random()),
        name: String(p.title ?? 'Product'),
        image: String(p.image ?? 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=500'),
        price: typeof p.price === 'number' ? p.price : undefined,
        isExternal: true,
        url: typeof p.url === 'string' ? p.url : undefined,
      }));
    }
    return featuredProducts.slice(0, 3).map((p) => ({
      id: p.id,
      name: p.name,
      image: p.images[0],
      price: p.price,
      rating: p.rating,
      isExternal: false,
    }));
  }, [shopData, fallback]);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Ripped City 360',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/shop/cart')}
              style={styles.cartButton}
              testID="cart-button"
            >
              <ShoppingBag size={24} color={colors.text.primary} />
              {cartItems.length > 0 && (
                <Badge label={cartItems.length.toString()} variant="error" style={styles.cartBadge} />
              )}
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandHeader} testID="brand-header">
          <Image
            source={{ uri: brandAssets.primaryLogo }}
            style={styles.brandLogo}
            accessibilityLabel="Ripped City Inc. Logo"
            testID="brand-logo"
          />
          <Text style={styles.slogan}>{`GET RIPPED.\nSTAY REAL.`}</Text>
          <Text style={styles.brandTitle}>Ripped City Inc.</Text>
          <Text style={styles.brandSubtitle}>Premium Coaching • Elite Training • Real Results</Text>
          <Text style={styles.brandDescription}>
            Built for athletes who demand more. Train harder, recover smarter, live the RCI standard.
          </Text>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
            <Text style={styles.subtitle}>Ready for your next workout?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Avatar
              source={user?.profileImageUrl}
              name={user?.name}
              size="medium"
            />
          </TouchableOpacity>
        </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/workouts')}
          style={styles.quickActionCard}
          testID="qa-workouts"
          accessibilityRole="button"
          accessibilityLabel="Go to Workouts"
        >
          <Card>
            <View style={styles.quickActionContent}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 0, 0, 0.12)' }]}>
                <Dumbbell size={20} color={colors.accent.primary} />
              </View>
              <Text style={styles.quickActionText}>Workouts</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/coaching')}
          style={styles.quickActionCard}
          testID="qa-coaching"
          accessibilityRole="button"
          accessibilityLabel="Go to Coaching"
        >
          <Card>
            <View style={styles.quickActionContent}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(30, 136, 229, 0.12)' }]}>
                <Users size={20} color={colors.status.info} />
              </View>
              <Text style={styles.quickActionText}>Coaching</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/medical')}
          style={styles.quickActionCard}
          testID="qa-medical"
          accessibilityRole="button"
          accessibilityLabel="Go to Medical"
        >
          <Card>
            <View style={styles.quickActionContent}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 200, 81, 0.12)' }]}>
                <Activity size={20} color={colors.status.success} />
              </View>
              <Text style={styles.quickActionText}>Medical</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/meals/progress')}
          style={styles.quickActionCard}
          testID="qa-progress"
          accessibilityRole="button"
          accessibilityLabel="Go to Progress"
        >
          <Card>
            <View style={styles.quickActionContent}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.16)' }]}>
                <TrendingUp size={20} color={colors.status.warning} />
              </View>
              <Text style={styles.quickActionText}>Progress</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Gear</Text>
            <Button
              title="Shop All"
              variant="ghost"
              size="small"
              onPress={() => router.push('/shop')}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredProduct}
                onPress={() => (item.isExternal && item.url ? Linking.openURL(item.url) : router.push(`/shop/product/${item.id}`))}
                testID={`featured-product-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.name}`}
              >
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                <Text style={styles.featuredName} numberOfLines={2}>{item.name}</Text>
                {typeof item.rating === 'number' && (
                  <View style={styles.featuredRating}>
                    <Star size={12} color={colors.status.warning} fill={colors.status.warning} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                )}
                {typeof item.price === 'number' && (
                  <Text style={styles.featuredPrice}>${item.price}</Text>
                )}
              </TouchableOpacity>
            ))}
            {featuredList.length === 0 && (
              <View style={{ paddingHorizontal: 16, justifyContent: 'center' }}>
                <Text style={{ color: colors.text.secondary }}>No featured items yet. Tap Shop All to browse.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Workouts</Text>
            <Button
              title="See All"
              variant="ghost"
              size="small"
              onPress={() => router.push('/workouts')}
            />
          </View>
          
          {featuredWorkoutPlans.map((plan) => (
            <WorkoutCard key={plan.id} item={plan} type="plan" />
          ))}
        </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Workout Categories</Text>
          <Button
            title="See All"
            variant="ghost"
            size="small"
            onPress={() => router.push('/workouts')}
          />
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {workoutCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Coaches</Text>
          <Button
            title="See All"
            variant="ghost"
            size="small"
            onPress={() => router.push('/coaching')}
          />
        </View>
        
        {featuredCoaches.slice(0, 2).map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </View>

      <View style={styles.aiWorkoutContainer}>
        <Card style={styles.aiWorkoutCard}>
          <Text style={styles.aiWorkoutTitle}>Generate Custom Workout</Text>
          <Text style={styles.aiWorkoutDescription}>
            Let our AI create a personalized workout based on your goals, equipment, and time available.
          </Text>
          <Button
            title="Create Workout"
            onPress={() => router.push('/workouts/generate')}
            style={styles.aiWorkoutButton}
          />
        </Card>
      </View>

        {/* Brand Synergy Features */}
        <View style={styles.brandSynergySection}>
          <Text style={styles.sectionTitle}>Exclusive Member Benefits</Text>
          
          <View style={styles.synergyGrid}>
            <TouchableOpacity
              style={styles.synergyCard}
              onPress={() => router.push('/brand/challenges')}
            >
              <Card style={styles.synergyCardContent}>
                <Trophy size={24} color={colors.accent.primary} />
                <Text style={styles.synergyTitle}>Member Challenges</Text>
                <Text style={styles.synergyDescription}>Exclusive challenges with premium rewards</Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.synergyCard}
              onPress={() => router.push('/brand/exclusive-gear')}
            >
              <Card style={styles.synergyCardContent}>
                <Crown size={24} color={colors.status.warning} />
                <Text style={styles.synergyTitle}>Exclusive Gear</Text>
                <Text style={styles.synergyDescription}>Member-only products & early access</Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.synergyCard}
              onPress={() => router.push('/brand/guides')}
            >
              <Card style={styles.synergyCardContent}>
                <BookOpen size={24} color={colors.status.info} />
                <Text style={styles.synergyTitle}>Branded Guides</Text>
                <Text style={styles.synergyDescription}>Expert nutrition & training guides</Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.synergyCard}
              onPress={() => router.push('/brand/affiliate')}
            >
              <Card style={styles.synergyCardContent}>
                <DollarSign size={24} color={colors.status.success} />
                <Text style={styles.synergyTitle}>Affiliate Program</Text>
                <Text style={styles.synergyDescription}>Earn commissions promoting our brand</Text>
              </Card>
            </TouchableOpacity>
          </View>
          
          <Card style={styles.membershipPromoCard}>
            <Text style={styles.promoTitle}>Unlock All Benefits</Text>
            <Text style={styles.promoDescription}>
              Join our membership program to access exclusive challenges, gear, coaching, and earn affiliate commissions.
            </Text>
            <Button
              title="View Membership Plans"
              onPress={() => router.push('/brand/membership')}
              style={styles.promoButton}
            />
          </Card>
        </View>

        {/* Brand Footer */}
        <View style={styles.brandFooter}>
          <Card style={styles.brandFooterCard}>
            <Text style={styles.footerTitle}>Visit Our Website</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.rippedcityinc.com')}>
              <Text style={styles.footerSubtitle}>www.rippedcityinc.com</Text>
            </TouchableOpacity>
            <Text style={styles.footerDescription}>
              Discover our full range of products, read our blog, and connect with the Ripped City community.
            </Text>
            <Button
              title="Learn More"
              variant="outline"
              onPress={() => Linking.openURL('https://www.rippedcityinc.com')}
              style={styles.learnMoreButton}
            />
          </Card>
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
  cartButton: {
    position: 'relative',
    marginRight: 16,
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
  brandHeader: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 28,
    margin: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  brandLogo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  slogan: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent.tertiary,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.accent.secondary,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: 10,
  },
  brandDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  featuredScroll: {
    paddingLeft: 0,
  },
  featuredProduct: {
    width: 140,
    marginRight: 16,
  },
  featuredImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
    lineHeight: 18,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  featuredOriginalPrice: {
    fontSize: 12,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  brandFooter: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  brandFooterCard: {
    alignItems: 'center',
    padding: 24,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  footerSubtitle: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  footerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  learnMoreButton: {
    paddingHorizontal: 32,
  },
  brandSynergySection: {
    padding: 16,
    paddingTop: 0,
  },
  synergyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  synergyCard: {
    width: '48%',
  },
  synergyCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  synergyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  synergyDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  membershipPromoCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  promoButton: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 0,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  aiWorkoutContainer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  aiWorkoutCard: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    padding: 16,
  },
  aiWorkoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  aiWorkoutDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  aiWorkoutButton: {
    alignSelf: 'flex-start',
  },
});