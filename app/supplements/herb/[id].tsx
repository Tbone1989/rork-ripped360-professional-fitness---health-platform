import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, AlertTriangle, Info, Leaf, BookOpenCheck } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { herbalInteractions } from '@/mocks/supplements';

export default function HerbDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const herb = herbalInteractions.find(h => h.id === id);

  if (!herb) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Herb not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backPill} testID="HerbNotFoundBack">
          <ArrowLeft size={18} color={colors.text.primary} />
          <Text style={styles.backPillText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUri = `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&herb=${encodeURIComponent(
    herb.herb,
  )}`;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: herb.herb }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerImageWrap}>
          <Image source={{ uri: imageUri }} style={styles.headerImage} contentFit="cover" />
          <View style={styles.headerOverlay}>
            <View style={styles.titleRow}>
              <Leaf size={18} color={colors.text.primary} />
              <Text style={styles.title}>{herb.herb}</Text>
            </View>
            <Text style={styles.subtitle}>{herb.commonName} • {herb.scientificName}</Text>
            <View style={styles.badgesRow}>
              <Badge label={`Pregnancy: ${herb.pregnancySafety}`} size="small" variant="default" />
              <Badge label={`Breastfeeding: ${herb.breastfeedingSafety}`} size="small" variant="default" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Interactions</Text>
            {herb.interactsWith.map((item, idx) => (
              <Text key={idx} style={styles.listItem}>• {item}</Text>
            ))}
          </Card>

          <Card style={styles.card}>
            <View style={styles.iconHeader}>
              <AlertTriangle size={18} color={colors.status.warning} />
              <Text style={styles.sectionTitle}>Contraindications</Text>
            </View>
            {herb.contraindications.map((item, idx) => (
              <Text key={idx} style={styles.listItem}>• {item}</Text>
            ))}
          </Card>

          <Card style={styles.card}>
            <View style={styles.iconHeader}>
              <Info size={18} color={colors.status.info} />
              <Text style={styles.sectionTitle}>Dosage Guidelines</Text>
            </View>
            <Text style={styles.paragraph}>{herb.dosageGuidelines}</Text>
            <Text style={styles.metaLabel}>Quality Standards</Text>
            {herb.qualityStandards.map((q, idx) => (
              <Text key={idx} style={styles.listItem}>• {q}</Text>
            ))}
          </Card>

          <Card style={styles.card}>
            <View style={styles.iconHeader}>
              <BookOpenCheck size={18} color={colors.accent.primary} />
              <Text style={styles.sectionTitle}>Clinical Notes</Text>
            </View>
            <Text style={styles.paragraph}>
              This content is educational and not a substitute for medical advice. Consult a qualified practitioner before starting any herbal regimen, especially if you have medical conditions or take medications.
            </Text>
          </Card>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Safety categories are generalized; individual risk varies. Monitor for reactions and discontinue if adverse effects occur.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => router.back()} style={styles.fabBack} testID="HerbBackFab">
        <ArrowLeft size={22} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  scroll: { flex: 1 },
  headerImageWrap: { height: 240, position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', bottom: 12, left: 12, right: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text.primary, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  subtitle: { fontSize: 13, color: colors.text.primary },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  section: { padding: 16 },
  card: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  iconHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  listItem: { fontSize: 14, color: colors.text.secondary, lineHeight: 20, marginBottom: 4 },
  paragraph: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
  metaLabel: { fontSize: 13, fontWeight: '600', color: colors.text.primary, marginTop: 8, marginBottom: 4 },
  disclaimer: { padding: 16, paddingTop: 0 },
  disclaimerText: { fontSize: 12, color: colors.text.tertiary, textAlign: 'center', lineHeight: 18 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background.primary },
  errorText: { fontSize: 16, color: colors.text.primary, marginBottom: 12 },
  backPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.background.secondary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  backPillText: { color: colors.text.primary, fontWeight: '600' },
  fabBack: { position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
});
