import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  Star,
  Calendar,
  MessageCircle,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  Users,
  Phone,
  FileText,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { trpc } from '@/lib/trpc';
import type { Coach } from '@/types/coaching';

export default function CoachDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const bookMutation = trpc.coaching.sessions.book.useMutation();

  const coachesQuery = trpc.coaching.list.useQuery({ showPricing: true });

  const coach: Coach | undefined = useMemo(() => {
    const raw = (coachesQuery.data as any)?.coaches as any[] | undefined;
    const arr = Array.isArray(raw) ? raw : [];
    const api = arr.find((c) => String(c?.id) === String(id));
    if (!api) return undefined;

    const pricingVisibility: Coach['pricingVisibility'] =
      api?.pricingVisibility === 'after_engagement'
        ? 'after_contact'
        : (api?.pricingVisibility as Coach['pricingVisibility']);

    const hourlyRate = typeof api?.hourlyRate === 'number' ? api.hourlyRate : 0;

    return {
      id: String(api?.id ?? ''),
      userId: String(api?.userId ?? ''),
      name: String(api?.name ?? ''),
      bio: String(api?.bio ?? ''),
      specialties: Array.isArray(api?.specialties) ? api.specialties.map((s: any) => String(s)) : [],
      certifications: Array.isArray(api?.certifications)
        ? api.certifications.map((c: any) => ({
            id: String(c?.id ?? ''),
            name: String(c?.name ?? ''),
            organization: String(c?.organization ?? ''),
            year: Number(c?.year ?? 0),
            verified: Boolean(c?.verified),
          }))
        : [],
      experience: Number(api?.experience ?? 0),
      rating: Number(api?.rating ?? 0),
      reviewCount: Number(api?.reviewCount ?? 0),
      hourlyRate,
      availability: Array.isArray(api?.availability) ? api.availability : [],
      profileImageUrl: String(api?.profileImageUrl ?? ''),
      coverImageUrl: String(api?.profileImageUrl ?? ''),
      featured: Boolean(api?.featured),
      pricingVisibility: pricingVisibility ?? 'upfront',
      consultationFee: undefined,
      packageDeals: Array.isArray(api?.packages)
        ? api.packages.map((p: any) => ({
            id: String(p?.id ?? ''),
            name: String(p?.name ?? ''),
            description: String(p?.description ?? ''),
            sessions: 1,
            duration: Number(p?.duration ?? 0),
            price: typeof p?.price === 'number' ? p.price : 0,
            features: [],
          }))
        : undefined,
    } as Coach;
  }, [coachesQuery.data, id]);

  const isBooking = bookMutation.isPending ?? false;

  const availableSlots = useMemo(() => {
    const base = Array.isArray(coach?.availability) ? coach?.availability : [];

    const slotsFromCoach = base.flatMap((day: any) => {
      const dayName = String(day?.day ?? 'monday');
      const slots = Array.isArray(day?.slots) ? day.slots : [];
      return slots
        .filter((slot: any) => !slot?.booked)
        .map((slot: any) => ({
          day: dayName,
          startTime: String(slot?.startTime ?? ''),
          endTime: String(slot?.endTime ?? ''),
        }));
    });

    if (slotsFromCoach.length > 0) return slotsFromCoach;

    return [
      { day: 'monday', startTime: '09:00', endTime: '09:30' },
      { day: 'tuesday', startTime: '12:00', endTime: '12:30' },
      { day: 'wednesday', startTime: '18:00', endTime: '18:30' },
      { day: 'thursday', startTime: '08:00', endTime: '08:30' },
      { day: 'friday', startTime: '16:00', endTime: '16:30' },
      { day: 'saturday', startTime: '10:00', endTime: '10:30' },
    ];
  }, [coach?.availability]);

  if (coachesQuery.isLoading) {
    return (
      <View style={styles.errorContainer} testID="coach-detail-loading">
        <Text style={styles.errorText}>Loading coach…</Text>
      </View>
    );
  }

  if (coachesQuery.error && !coachesQuery.isLoading) {
    return (
      <View style={styles.errorContainer} testID="coach-detail-error">
        <Text style={styles.errorText}>Couldn’t load coach</Text>
        <Button title="Go Back" onPress={() => router.back()} testID="coach-detail-back-error" />
      </View>
    );
  }

  if (!coach) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Coach not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: coach.coverImageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000' }}
          style={styles.coverImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        {coach.featured && (
          <Badge
            label="Featured"
            variant="primary"
            size="small"
            style={styles.featuredBadge}
          />
        )}
      </View>
      
      <View style={styles.profileSection}>
        <Avatar
          source={coach.profileImageUrl}
          size="xlarge"
          style={styles.avatar}
          verified={true}
        />
        
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{coach.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.status.warning} fill={colors.status.warning} />
            <Text style={styles.rating}>
              {coach.rating.toFixed(1)} ({coach.reviewCount} reviews)
            </Text>
          </View>
          
          <View style={styles.experienceContainer}>
            <Award size={16} color={colors.text.secondary} />
            <Text style={styles.experience}>{coach.experience} years experience</Text>
          </View>
          
          {coach.pricingVisibility === 'upfront' ? (
            <Text style={styles.rate}>${coach.hourlyRate}/hour</Text>
          ) : coach.pricingVisibility === 'after_contact' ? (
            <View style={styles.pricingContainer}>
              <Text style={styles.contactForPrice}>Contact for pricing</Text>
              <Badge label="Custom rates" variant="default" size="small" />
            </View>
          ) : (
            <View style={styles.pricingContainer}>
              <Text style={styles.consultationRequired}>Consultation required</Text>
              {coach.consultationFee && (
                <Text style={styles.consultationFee}>Consultation: ${coach.consultationFee}</Text>
              )}
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.specialtiesSection}>
        <Text style={styles.sectionTitle}>Specialties</Text>
        <View style={styles.specialtiesContainer}>
          {coach.specialties.map((specialty, index) => (
            <Badge
              key={index}
              label={specialty}
              variant="default"
              style={styles.specialtyBadge}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.bioSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{coach.bio}</Text>
      </View>
      
      <View style={styles.certificationsSection}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {coach.certifications.map((cert) => (
          <Card key={cert.id} style={styles.certCard}>
            <View style={styles.certHeader}>
              <View style={styles.certInfo}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certOrg}>{cert.organization}</Text>
                <Text style={styles.certYear}>{cert.year}</Text>
              </View>
              {cert.verified && (
                <CheckCircle size={20} color={colors.status.success} />
              )}
            </View>
          </Card>
        ))}
      </View>
      
      {coach.packageDeals && coach.packageDeals.length > 0 && (
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>Coaching Packages</Text>
          {coach.packageDeals.map((pkg) => (
            <Card key={pkg.id} style={styles.packageCard}>
              <View style={styles.packageHeader}>
                <View style={styles.packageInfo}>
                  <View style={styles.packageTitleRow}>
                    <Text style={styles.packageName}>{pkg.name}</Text>
                    {pkg.popular && (
                      <Badge label="Popular" variant="primary" size="small" />
                    )}
                  </View>
                  <Text style={styles.packageDescription}>{pkg.description}</Text>
                  
                  <View style={styles.packageDetails}>
                    <View style={styles.packageDetailItem}>
                      <Users size={14} color={colors.text.secondary} />
                      <Text style={styles.packageDetailText}>{pkg.sessions} sessions</Text>
                    </View>
                    <View style={styles.packageDetailItem}>
                      <Clock size={14} color={colors.text.secondary} />
                      <Text style={styles.packageDetailText}>{pkg.duration} weeks</Text>
                    </View>
                  </View>
                  
                  <View style={styles.packageFeatures}>
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <Text key={index} style={styles.packageFeature}>• {feature}</Text>
                    ))}
                    {pkg.features.length > 3 && (
                      <Text style={styles.moreFeatures}>+{pkg.features.length - 3} more features</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.packagePricing}>
                  {coach.pricingVisibility === 'upfront' ? (
                    <>
                      <Text style={styles.packagePrice}>${pkg.price}</Text>
                      {pkg.discount && (
                        <Text style={styles.packageDiscount}>{pkg.discount}% off</Text>
                      )}
                      <Text style={styles.packagePricePerSession}>
                        ${Math.round(pkg.price / pkg.sessions)}/session
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.packageContactPrice}>Contact for pricing</Text>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
      
      <View style={styles.availabilitySection}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <View style={styles.slotsContainer}>
          {availableSlots.slice(0, 6).map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                selectedTimeSlot === `${slot.day}-${slot.startTime}-${slot.endTime}` && styles.selectedTimeSlot
              ]}
              onPress={() => setSelectedTimeSlot(`${slot.day}-${slot.startTime}-${slot.endTime}`)}
              testID={`slot-${slot.day}-${slot.startTime}`}
              accessibilityRole="button"
              accessibilityLabel={`Select ${slot.day} ${slot.startTime}`}
            >
              <Text style={[
                styles.slotDay,
                selectedTimeSlot === `${slot.day}-${slot.startTime}-${slot.endTime}` && styles.selectedSlotText
              ]}>
                {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}
              </Text>
              <Text style={[
                styles.slotTime,
                selectedTimeSlot === `${slot.day}-${slot.startTime}-${slot.endTime}` && styles.selectedSlotText
              ]}>
                {slot.startTime} - {slot.endTime}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <Button
          title="Review & Sign Contract"
          variant="outline"
          icon={<FileText size={18} color={colors.accent.primary} />}
          style={styles.contractButton}
          fullWidth
          onPress={() => router.push({
            pathname: '/coaching/contract',
            params: { coachId: coach.id, coachName: coach.name }
          })}
          testID="sign-contract"
        />
        
        {coach.pricingVisibility === 'consultation_required' ? (
          <>
            <Button
              title={`Book Consultation${coach.consultationFee ? ` - ${coach.consultationFee}` : ''}`}
              icon={<Phone size={18} color={colors.text.primary} />}
              style={styles.bookButton}
              fullWidth
              onPress={() => router.push(`/coaching/message/${coach.id}`)}
              testID="book-consultation"
            />
            <Button
              title="Send Message"
              variant="outline"
              icon={<MessageCircle size={18} color={colors.accent.primary} />}
              style={styles.messageButton}
              fullWidth
              onPress={() => router.push(`/coaching/message/${coach.id}`)}
              testID="send-message"
            />
          </>
        ) : coach.pricingVisibility === 'after_contact' ? (
          <>
            <Button
              title="Request Pricing"
              icon={<DollarSign size={18} color={colors.text.primary} />}
              style={styles.bookButton}
              fullWidth
              onPress={() => router.push(`/coaching/message/${coach.id}`)}
              testID="request-pricing"
            />
            <Button
              title="Send Message"
              variant="outline"
              icon={<MessageCircle size={18} color={colors.accent.primary} />}
              style={styles.messageButton}
              fullWidth
              onPress={() => router.push(`/coaching/message/${coach.id}`)}
              testID="send-message"
            />
          </>
        ) : (
          <>
            <Button
              title={isBooking ? 'Booking…' : 'Book Session'}
              icon={<Calendar size={18} color={colors.text.primary} />}
              style={styles.bookButton}
              fullWidth
              disabled={!selectedTimeSlot || isBooking}
              onPress={async () => {
                if (!selectedTimeSlot) return;
                try {
                  const [day, startTime, endTime] = selectedTimeSlot.split('-');
                  const dayMap: Record<string, number> = {
                    sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
                  };
                  const targetDow = dayMap[day.toLowerCase()] ?? new Date().getDay();
                  const today = new Date();
                  const date = new Date(today);
                  const addDays = (targetDow - today.getDay() + 7) % 7 || 7;
                  date.setDate(today.getDate() + addDays);
                  const yyyy = date.getFullYear();
                  const mm = String(date.getMonth() + 1).padStart(2, '0');
                  const dd = String(date.getDate()).padStart(2, '0');
                  const isoDate = `${yyyy}-${mm}-${dd}`;
                  const res = await bookMutation.mutateAsync({
                    coachId: String(coach.id),
                    date: isoDate,
                    startTime,
                    endTime,
                  });
                  if (res?.success) {
                    Alert.alert('Session booked', `Your session on ${isoDate} at ${startTime} is scheduled.`, [
                      { text: 'OK', onPress: () => {} },
                      { text: 'Message Coach', onPress: () => router.push(`/coaching/message/${coach.id}`) },
                    ]);
                  } else {
                    Alert.alert('Booking failed', 'Please try again.');
                  }
                } catch {
                  Alert.alert('Booking failed', 'Please check your connection and try again.');
                }
              }}
              testID="book-session"
            />
            <Button
              title="Send Message"
              variant="outline"
              icon={<MessageCircle size={18} color={colors.accent.primary} />}
              style={styles.messageButton}
              fullWidth
              onPress={() => router.push(`/coaching/message/${coach.id}`)}
              testID="send-message"
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background.primary,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 16,
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    marginTop: -50,
    borderWidth: 4,
    borderColor: colors.background.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  experience: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  rate: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  pricingContainer: {
    alignItems: 'flex-end',
  },
  contactForPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  consultationRequired: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  consultationFee: {
    fontSize: 12,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  packagesSection: {
    padding: 16,
    paddingTop: 0,
  },
  packageCard: {
    marginBottom: 16,
    padding: 0,
  },
  packageHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  packageInfo: {
    flex: 1,
    marginRight: 16,
  },
  packageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  packageDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  packageDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  packageDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  packageDetailText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  packageFeatures: {
    gap: 2,
  },
  packageFeature: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  moreFeatures: {
    fontSize: 11,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  packagePricing: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  packageDiscount: {
    fontSize: 11,
    color: colors.status.success,
    fontWeight: '600',
    marginTop: 2,
  },
  packagePricePerSession: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
  },
  packageContactPrice: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  specialtiesSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyBadge: {
    backgroundColor: colors.background.tertiary,
  },
  bioSection: {
    padding: 16,
    paddingTop: 0,
  },
  bioText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  certificationsSection: {
    padding: 16,
    paddingTop: 0,
  },
  certCard: {
    marginBottom: 12,
    padding: 0,
  },
  certHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  certInfo: {
    flex: 1,
  },
  certName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  certOrg: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  certYear: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  availabilitySection: {
    padding: 16,
    paddingTop: 0,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  selectedTimeSlot: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  slotDay: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  slotTime: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  selectedSlotText: {
    color: colors.text.primary,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  bookButton: {
    marginBottom: 0,
  },
  messageButton: {
    marginBottom: 0,
  },
  contractButton: {
    marginBottom: 0,
  },
});