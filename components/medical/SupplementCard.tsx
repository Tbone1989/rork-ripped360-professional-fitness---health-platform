import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { SupplementInfo, MedicineInfo } from '@/types/medical';
import { Badge } from '@/components/ui/Badge';
import { getImageForMedicine, getImageForSupplement } from '@/utils/medicalImages';

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
  const [imageFailed, setImageFailed] = useState<boolean>(false);

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

  const isPeptide = useMemo<boolean>(() => {
    const n = (item.name ?? '').toLowerCase();
    const c = (item.category ?? '').toLowerCase();
    return (
      c.includes('peptide') ||
      c.includes('glp') ||
      c.includes('gip') ||
      c.includes('myostatin') ||
      n.includes('semaglutide') ||
      n.includes('tirzepatide') ||
      n.includes('cjc') ||
      n.includes('ipamorelin') ||
      n.includes('bpc') ||
      n.includes('tb-500') ||
      n.includes('follistatin') ||
      n.includes('igf') ||
      n.includes('mgf') ||
      n.includes('peg-mgf') ||
      n.includes('ghk') ||
      n.includes('kisspeptin') ||
      n.includes('gonadorelin') ||
      n.includes('semax') ||
      n.includes('selank') ||
      n.includes('aod') ||
      n.includes('ll-37') ||
      n.includes('sermorelin') ||
      n.includes('ghrh') ||
      n.includes('ghrp') ||
      n.includes('ace-031') ||
      n.includes('ace-083') ||
      n.includes('anti-myostatin') ||
      n.includes('mab') ||
      n.includes('next-gen myostatin') ||
      n.includes('myostatin modulator')
    );
  }, [item]);

  const imageUri = useMemo<string>(() => {
    const provided = (item as any)?.imageUrl as string | undefined;
    const mapped = type === 'medicine' ? getImageForMedicine(item as MedicineInfo) : getImageForSupplement(item as SupplementInfo);
    const uri = isPeptide ? mapped : (provided ?? mapped);
    console.log('[SupplementCard] imageUri resolved', { id: item.id, name: item.name, isPeptide, provided, mapped, uri });
    return uri;
  }, [item, type, isPeptide]);

  const fallbackUri = useMemo<string>(() => {
    if (type === 'medicine') {
      if (isPeptide) return 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/s5bpf20odmg1xc4s0f6gk';
      return 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1535747790212-30c585ab4863?q=80&w=900&auto=format&fit=crop';
  }, [type, isPeptide]);

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
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: imageFailed ? fallbackUri : imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          onError={(e) => {
            console.log('[SupplementCard] image load error - switching to fallback', { id: item.id, name: item.name, uri: imageUri, error: (e as any)?.nativeEvent });
            setImageFailed(true);
          }}
        />
      </View>
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
    marginBottom: 12,
    height: 104,
  },
  imageWrap: {
    width: 104,
    height: '100%',
    padding: 8,
    backgroundColor: colors.background.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
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
    marginBottom: 4,
    backgroundColor: colors.background.tertiary,
  },
  description: {
    fontSize: 11,
    color: colors.text.secondary,
    lineHeight: 15,
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
    fontSize: 11,
    color: colors.text.secondary,
  },
  moreBenefits: {
    fontSize: 11,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  expandButton: {
    marginTop: 2,
  },
});