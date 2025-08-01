import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { SupplementInfo, MedicineInfo } from '@/types/medical';
import { Badge } from '@/components/ui/Badge';

interface SupplementCardProps {
  item: SupplementInfo | MedicineInfo;
  type: 'supplement' | 'medicine';
  onPress?: () => void;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({
  item,
  type,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (type === 'supplement') {
        router.push(`/supplements/${item.id}`);
      } else {
        router.push(`/medicines/${item.id}`);
      }
    }
  };

  const isPrescriptionRequired = type === 'medicine' && (item as MedicineInfo).prescriptionRequired;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {isPrescriptionRequired && (
              <Badge
                label="Rx"
                size="small"
                variant="error"
                style={styles.rxBadge}
              />
            )}
          </View>
          <Badge
            label={item.category}
            size="small"
            variant="default"
            style={styles.categoryBadge}
          />
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.benefitsContainer}>
            {item.benefits.slice(0, 1).map((benefit, index) => (
              <Text key={index} style={styles.benefit} numberOfLines={1}>
                • {benefit}
              </Text>
            ))}
            {item.benefits.length > 1 && (
              <Text style={styles.moreBenefits}>
                +{item.benefits.length - 1} more
              </Text>
            )}
          </View>
          <ChevronRight size={16} color={colors.text.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    height: 120,
  },
  image: {
    width: 100,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  rxBadge: {
    backgroundColor: colors.status.error,
    marginLeft: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    backgroundColor: colors.background.tertiary,
  },
  description: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  benefitsContainer: {
    flex: 1,
  },
  benefit: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  moreBenefits: {
    fontSize: 12,
    color: colors.accent.primary,
    fontWeight: '500',
  },
});