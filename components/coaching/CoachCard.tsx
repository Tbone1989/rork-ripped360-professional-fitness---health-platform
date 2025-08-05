import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Star, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Coach } from '@/types/coaching';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

interface CoachCardProps {
  coach: Coach;
  onPress?: () => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({
  coach,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/coaching/${coach.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: coach.coverImageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000' }}
          style={styles.coverImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.overlay} />
        {coach.featured && (
          <Badge
            label="Featured"
            variant="primary"
            size="small"
            style={styles.featuredBadge}
          />
        )}
      </View>
      
      <View style={styles.profileContainer}>
        <Avatar
          source={coach.profileImageUrl}
          size="large"
          style={styles.avatar}
          verified={true}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{coach.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.status.warning} fill={colors.status.warning} />
            <Text style={styles.rating}>
              {coach.rating.toFixed(1)} ({coach.reviewCount})
            </Text>
          </View>
          
          <View style={styles.specialtiesContainer}>
            {coach.specialties.slice(0, 2).map((specialty, index) => (
              <Badge
                key={index}
                label={specialty}
                size="small"
                variant="default"
                style={styles.specialtyBadge}
              />
            ))}
            {coach.specialties.length > 2 && (
              <Badge
                label={`+${coach.specialties.length - 2}`}
                size="small"
                variant="default"
                style={styles.specialtyBadge}
              />
            )}
          </View>
        </View>
        
        <ChevronRight size={20} color={colors.text.secondary} style={styles.chevron} />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.experience}>{coach.experience} years experience</Text>
        {coach.pricingVisibility === 'upfront' ? (
          <Text style={styles.rate}>${coach.hourlyRate}/hour</Text>
        ) : coach.pricingVisibility === 'after_contact' ? (
          <Text style={styles.contactForPrice}>Contact for pricing</Text>
        ) : (
          <View style={styles.consultationContainer}>
            <Text style={styles.consultationText}>Consultation required</Text>
            {coach.consultationFee && (
              <Text style={styles.consultationFee}>${coach.consultationFee}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverContainer: {
    height: 100,
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
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    marginTop: -40,
    borderWidth: 3,
    borderColor: colors.background.card,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  specialtyBadge: {
    backgroundColor: colors.background.tertiary,
  },
  chevron: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingTop: 0,
  },
  experience: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  rate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  contactForPrice: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  consultationContainer: {
    alignItems: 'flex-end',
  },
  consultationText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  consultationFee: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.primary,
  },
});