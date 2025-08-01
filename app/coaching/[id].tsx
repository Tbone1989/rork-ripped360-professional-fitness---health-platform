import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
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
  ArrowLeft
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { allCoaches } from '@/mocks/coaches';

export default function CoachDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  const coach = allCoaches.find(c => c.id === id);
  
  if (!coach) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Coach not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const availableSlots = coach.availability.flatMap(day => 
    day.slots.filter(slot => !slot.booked).map(slot => ({
      day: day.day,
      ...slot
    }))
  );

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
          
          <Text style={styles.rate}>${coach.hourlyRate}/hour</Text>
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
      
      <View style={styles.availabilitySection}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <View style={styles.slotsContainer}>
          {availableSlots.slice(0, 6).map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                selectedTimeSlot === `${slot.day}-${slot.startTime}` && styles.selectedTimeSlot
              ]}
              onPress={() => setSelectedTimeSlot(`${slot.day}-${slot.startTime}`)}
            >
              <Text style={[
                styles.slotDay,
                selectedTimeSlot === `${slot.day}-${slot.startTime}` && styles.selectedSlotText
              ]}>
                {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}
              </Text>
              <Text style={[
                styles.slotTime,
                selectedTimeSlot === `${slot.day}-${slot.startTime}` && styles.selectedSlotText
              ]}>
                {slot.startTime} - {slot.endTime}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <Button
          title="Book Session"
          icon={<Calendar size={18} color={colors.text.primary} />}
          style={styles.bookButton}
          fullWidth
          disabled={!selectedTimeSlot}
          onPress={() => {
            if (selectedTimeSlot) {
              // Handle booking logic here
              console.log('Booking session for:', selectedTimeSlot);
            }
          }}
        />
        
        <Button
          title="Send Message"
          variant="outline"
          icon={<MessageCircle size={18} color={colors.accent.primary} />}
          style={styles.messageButton}
          fullWidth
          onPress={() => router.push(`/coaching/message/${coach.id}`)}
        />
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
});