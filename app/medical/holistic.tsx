import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { HeartPulse, Leaf, Droplets, Wind, SunMedium, Activity, Utensils, FlaskConical, ShieldAlert, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { herbalInteractions } from '@/mocks/supplements';

interface Modality {
  id: string;
  title: string;
  icon: 'Leaf' | 'Droplets' | 'Wind' | 'Sun' | 'Heart' | 'Activity';
  summary: string;
  benefits: string[];
  cautions: string[];
  idealFor: string[];
}

const modalities: Modality[] = [
  {
    id: 'm1',
    title: 'Breathwork',
    icon: 'Wind',
    summary: 'Downshift stress, improve HRV, support sleep quality.',
    benefits: ['Stress regulation', 'HRV improvement', 'Sleep onset', 'CO2 tolerance'],
    cautions: ['Dizziness with hyperventilation', 'Avoid prolonged breath holds in pregnancy'],
    idealFor: ['Anxiety', 'Pre-sleep routine', 'Recovery days'],
  },
  {
    id: 'm2',
    title: 'Sauna',
    icon: 'Sun',
    summary: 'Passive heat acclimation to boost cardiovascular and recovery markers.',
    benefits: ['Cardiovascular fitness surrogate', 'Growth hormone pulse', 'Detox via sweat', 'DOMS reduction'],
    cautions: ['Dehydration risk', 'Avoid right after heavy drinking', 'Consult if low blood pressure'],
    idealFor: ['Rest days', 'Post-workout 3-6h later'],
  },
  {
    id: 'm3',
    title: 'Cold Exposure',
    icon: 'Droplets',
    summary: 'Acute cold for alertness and resilience. Time away from hypertrophy window.',
    benefits: ['Acute dopamine rise', 'Brown fat activation', 'Grit training'],
    cautions: ['Avoid immediately post-hypertrophy', 'Raynaud’s caution', 'Cardiac disease consult'],
    idealFor: ['Morning focus', 'Non-lifting days'],
  },
  {
    id: 'm4',
    title: 'Mindful Walking',
    icon: 'Activity',
    summary: 'Zone-2 base with parasympathetic bias and light sunlight exposure.',
    benefits: ['Glucose control', 'Fat oxidation', 'Mood elevation'],
    cautions: ['Sun exposure management', 'Foot/ankle overuse awareness'],
    idealFor: ['Everyday baseline', 'Active recovery'],
  },
  {
    id: 'm5',
    title: 'Herbal Support',
    icon: 'Leaf',
    summary: 'Targeted botanicals layered with medication safety in mind.',
    benefits: ['Sleep support', 'Cognition', 'Digestion', 'Hormonal balance'],
    cautions: ['Drug-herb interactions', 'Pregnancy/lactation safety'],
    idealFor: ['Personalized stacks', 'Symptom-targeted cycles'],
  },
  {
    id: 'm6',
    title: 'Protein-Forward Meals',
    icon: 'Heart',
    summary: 'Build meals around protein + plants for body recomposition and satiety.',
    benefits: ['Satiety', 'Muscle retention', 'Stable energy'],
    cautions: ['Space iron vs calcium', 'Levodopa timing vs protein'],
    idealFor: ['Cutting phases', 'General health'],
  },
];

export default function HolisticCareScreen() {
  const router = useRouter();
  const [query] = useState<string>('');

  const highRiskHerbs = useMemo(() => herbalInteractions.filter(h => h.pregnancySafety === 'avoid' || h.breastfeedingSafety === 'avoid'), []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Holistic Care' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.headerCard}>
          <View style={styles.row}>
            <HeartPulse size={18} color={colors.accent.primary} />
            <Text style={styles.headerTitle}>Whole-person plan</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Combine habits, safe botanicals, and recovery practices. Interactions are checked against your stack in Interactions.
          </Text>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/medical/interactions')} testID="open-interactions">
            <ShieldAlert size={16} color={colors.accent.primary} />
            <Text style={styles.linkText}>Open Interaction Checker</Text>
            <ArrowRight size={16} color={colors.accent.primary} />
          </TouchableOpacity>
        </Card>

        {modalities.map(m => (
          <Card key={m.id} style={styles.card} testID={`modality-${m.id}`}>
            <View style={styles.cardHeader}>
              {m.icon === 'Leaf' && <Leaf size={18} color={colors.text.primary} />}
              {m.icon === 'Droplets' && <Droplets size={18} color={colors.text.primary} />}
              {m.icon === 'Wind' && <Wind size={18} color={colors.text.primary} />}
              {m.icon === 'Sun' && <SunMedium size={18} color={colors.text.primary} />}
              {m.icon === 'Heart' && <HeartPulse size={18} color={colors.text.primary} />}
              {m.icon === 'Activity' && <Activity size={18} color={colors.text.primary} />}
              <Text style={styles.title}>{m.title}</Text>
            </View>
            <Text style={styles.summary}>{m.summary}</Text>
            <View style={styles.badgesRow}>
              {m.benefits.slice(0, 3).map((b, i) => (
                <Badge key={i} label={b} size="small" variant="default" />
              ))}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Cautions</Text>
              {m.cautions.map((c, i) => (
                <Text key={i} style={styles.metaItem}>• {c}</Text>
              ))}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Ideal For</Text>
              {m.idealFor.map((c, i) => (
                <Text key={i} style={styles.metaItem}>• {c}</Text>
              ))}
            </View>
          </Card>
        ))}

        <Card style={styles.foodDrug}>
          <View style={styles.cardHeader}>
            <Utensils size={18} color={colors.text.primary} />
            <Text style={styles.title}>Food–Drug Timing Rules</Text>
          </View>
          <Text style={styles.summary}>Simple timing to minimize conflicts.</Text>
          <View style={styles.timingRow}>
            <Badge label="Iron ↔ Calcium" size="small" variant="default" />
            <Text style={styles.timingText}>Separate by 2-4 hours.</Text>
          </View>
          <View style={styles.timingRow}>
            <Badge label="Levodopa ↔ Protein" size="small" variant="default" />
            <Text style={styles.timingText}>Take 30-60 min before protein meals.</Text>
          </View>
          <View style={styles.timingRow}>
            <Badge label="Warfarin ↔ Vitamin K" size="small" variant="default" />
            <Text style={styles.timingText}>Keep leafy-green intake consistent.</Text>
          </View>
        </Card>

        <Card style={styles.highRisk}>
          <View style={styles.cardHeader}>
            <FlaskConical size={18} color={colors.text.primary} />
            <Text style={styles.title}>Higher-Risk Botanicals</Text>
          </View>
          {highRiskHerbs.map(h => (
            <View key={h.id} style={styles.riskItem}>
              <Text style={styles.riskTitle}>{h.herb}</Text>
              <Text style={styles.riskSub}>{h.scientificName}</Text>
              <View style={styles.badgesRow}>
                <Badge label={`Pregnancy: ${h.pregnancySafety}`} size="small" variant="default" />
                <Badge label={`Breastfeeding: ${h.breastfeedingSafety}`} size="small" variant="default" />
              </View>
              <Text style={styles.riskMeta}>Interacts with: {h.interactsWith.slice(0, 3).join(', ')}{h.interactsWith.length > 3 ? ` +${h.interactsWith.length - 3}` : ''}</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/supplements/herb/[id]', params: { id: h.id } })} style={styles.moreLink} testID={`see-herb-${h.id}`}>
                <Text style={styles.moreLinkText}>See details</Text>
                <ArrowRight size={14} color={colors.accent.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { padding: 16 },
  headerCard: { marginBottom: 12, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  headerTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 18 },
  headerSubtitle: { color: colors.text.secondary, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  linkText: { color: colors.accent.primary, fontWeight: '600' },
  card: { marginBottom: 12, paddingBottom: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  title: { color: colors.text.primary, fontWeight: '700', fontSize: 16 },
  summary: { color: colors.text.secondary, fontSize: 13, marginBottom: 8, lineHeight: 18 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  metaRow: { marginBottom: 8 },
  metaLabel: { color: colors.text.primary, fontWeight: '600', marginBottom: 4 },
  metaItem: { color: colors.text.secondary, fontSize: 13, lineHeight: 18 },
  foodDrug: { paddingBottom: 8, marginBottom: 12 },
  timingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  timingText: { color: colors.text.secondary, fontSize: 13 },
  highRisk: { paddingBottom: 8, marginBottom: 20 },
  riskItem: { borderTopWidth: 1, borderTopColor: colors.border.medium, paddingTop: 8, marginTop: 8 },
  riskTitle: { color: colors.text.primary, fontWeight: '600' },
  riskSub: { color: colors.text.tertiary, fontStyle: 'italic', marginBottom: 6 },
  riskMeta: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  moreLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  moreLinkText: { color: colors.accent.primary, fontWeight: '600' },
});