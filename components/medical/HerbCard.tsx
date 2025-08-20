import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { HerbalInteraction } from '@/types/medical';
import { Badge } from '@/components/ui/Badge';

interface HerbCardProps {
  herb: HerbalInteraction;
}

export const HerbCard: React.FC<HerbCardProps> = ({ herb }) => {
  const router = useRouter();

  const imageUri = `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=&herb=${encodeURIComponent(
    herb.herb,
  )}`;

  const handlePress = () => {
    router.push({ pathname: `/supplements/herb/${herb.id}` });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
      testID={`HerbCard-${herb.id}`}
    >
      <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" transition={250} />
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
    marginBottom: 16,
    height: 110,
  },
  image: {
    width: 110,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
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
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: 8,
  },
  meta: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 6,
  },
});
