import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { HerbalInteraction } from '@/types/medical';
import { Badge } from '@/components/ui/Badge';
import { herbsImageUrl } from '@/utils/medicalImages';

interface HerbCardProps {
  herb: HerbalInteraction;
}

export const HerbCard: React.FC<HerbCardProps> = ({ herb }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({ pathname: '/supplements/herb/[id]', params: { id: herb.id } });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
      testID={`HerbCard-${herb.id}`}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: herbsImageUrl }} style={styles.image} contentFit="cover" transition={250} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {herb.herb}
          </Text>
          <ChevronRight size={16} color={colors.text.secondary} />
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>
          {herb.commonName} • {herb.scientificName}
        </Text>
        <View style={styles.badges}>
          <Badge label={`Pregnancy: ${herb.pregnancySafety}`} size="small" variant="default" />
          <Badge label={`Breastfeeding: ${herb.breastfeedingSafety}`} size="small" variant="default" style={styles.badge} />
        </View>
        <Text style={styles.meta} numberOfLines={2}>
          Interacts with: {herb.interactsWith.slice(0, 3).join(', ')}{herb.interactsWith.length > 3 ? ' +' + (herb.interactsWith.length - 3) : ''}
        </Text>
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
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  subtitle: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: 8,
  },
  meta: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 4,
  },
});
