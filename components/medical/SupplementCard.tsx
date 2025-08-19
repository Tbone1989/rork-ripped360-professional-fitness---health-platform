import React, { useState } from 'react';
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
  initialExpanded?: boolean;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({
  item,
  type,
  onPress,
  initialExpanded,
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(initialExpanded ?? false);

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

  const displayBenefits: string[] =
    type === 'supplement'
      ? ((item as SupplementInfo).benefits ?? [])
      : ((item as MedicineInfo).usedFor ?? []);

  const imageUri = item.imageUrl ?? 'https://images.unsplash.com/photo-1586015555751-63bb77f4326b?q=80&w=600&auto=format&fit=crop';

  const toggleExpanded = () => {
    console.log('[SupplementCard] toggleExpanded', { id: item.id, name: item.name, expandedTo: !expanded });
    setExpanded(prev => !prev);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
      testID="SupplementCard"
    >
      <Image
        source={{ uri: imageUri }}
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
            {(expanded ? displayBenefits : displayBenefits.slice(0, 1)).map((benefit, index) => (
              <Text key={index} style={styles.benefit} numberOfLines={expanded ? 2 : 1}>
                • {benefit}
              </Text>
            ))}
            {displayBenefits.length > 1 && (
              <TouchableOpacity
                onPress={toggleExpanded}
                activeOpacity={0.7}
                style={styles.expandButton}
                testID="SupplementCardExpandToggle"
              >
                <Text style={styles.moreBenefits}>
                  {expanded ? 'Show less' : `+${displayBenefits.length - 1} more`}
                </Text>
              </TouchableOpacity>
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
  expandButton: {
    marginTop: 4,
  },
});