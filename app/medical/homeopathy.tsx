import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Droplets, ShieldAlert, Info, BookOpen, ArrowRight, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Remedy {
  id: string;
  name: string;
  indications: string[];
  keynotes: string[];
  cautions?: string[];
  potency?: string;
  category: 'Sleep' | 'Stress' | 'Digestion' | 'Pain' | 'Cold & Flu' | 'Skin';
}

const remedies: Remedy[] = [
  {
    id: 'r1',
    name: 'Arnica montana',
    category: 'Pain',
    indications: ['Muscle soreness after exertion', 'Bruising', 'Trauma'],
    keynotes: ['Sore, beaten feeling', 'Worse touch', 'Better rest'],
    potency: '30C as needed up to 3x/day for 24–48h',
  },
  {
    id: 'r2',
    name: 'Nux vomica',
    category: 'Digestion',
    indications: ['Indigestion', 'Bloating', 'Irritability', 'Overindulgence'],
    keynotes: ['Worse in morning', 'Craves stimulants', 'Tense, driven type'],
    potency: '30C at bedtime or on symptoms, max 2–3 doses/day',
  },
  {
    id: 'r3',
    name: 'Chamomilla',
    category: 'Sleep',
    indications: ['Teething pain', 'Overwound nerves', 'Restless sleep'],
    keynotes: ['Irritable, wants things then rejects', 'Better being carried'],
    potency: '30C in evening or on symptoms',
  },
  {
    id: 'r4',
    name: 'Gelsemium',
    category: 'Cold & Flu',
    indications: ['Flu with heaviness', 'Droopy eyes', 'Apathy'],
    keynotes: ['Dull, drowsy, dizzy', 'Chills up spine'],
    potency: '30C every 6–8h, taper as better',
  },
  {
    id: 'r5',
    name: 'Rhus toxicodendron',
    category: 'Pain',
    indications: ['Stiffness better with movement', 'Sprains/strains'],
    keynotes: ['Restless, must move', 'Worse cold/damp; better warm'],
    potency: '30C 1–3x/day on active days',
  },
  {
    id: 'r6',
    name: 'Pulsatilla',
    category: 'Digestion',
    indications: ['After rich/fatty food', 'Variable symptoms'],
    keynotes: ['Weepy, seeks fresh air', 'Not thirsty'],
    potency: '30C 1–2x/day as needed',
  },
  {
    id: 'r7',
    name: 'Calendula',
    category: 'Skin',
    indications: ['Minor cuts/abrasions', 'Skin healing support'],
    keynotes: ['Promotes granulation', 'Gentle antiseptic action'],
    potency: 'Topical tincture/gel; 30C oral for soreness',
  },
];

const categories: Array<Remedy['category']> = ['Sleep', 'Stress', 'Digestion', 'Pain', 'Cold & Flu', 'Skin'];

export default function HomeopathyScreen() {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [activeCat, setActiveCat] = useState<Remedy['category'] | 'All'>('All');

  console.log('[HomeopathyScreen] mount');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return remedies.filter(r => {
      const matchesCat = activeCat === 'All' ? true : r.category === activeCat;
      const matchesQ = q.length === 0
        ? true
        : r.name.toLowerCase().includes(q) ||
          r.indications.some(i => i.toLowerCase().includes(q)) ||
          r.keynotes.some(k => k.toLowerCase().includes(q));
      return matchesCat && matchesQ;
    });
  }, [query, activeCat]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Homeopathic Remedies' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.headerCard}>
          <View style={styles.row}>
            <Droplets size={18} color={colors.accent.primary} />
            <Text style={styles.headerTitle}>Gentle, symptom-pattern support</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Match remedy keynotes to your current pattern. Reduce frequency as symptoms improve.
          </Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity
              onPress={() => setActiveCat('All')}
              style={[styles.chip, activeCat === 'All' && styles.chipActive]}
              testID="chip-all"
            >
              <Text style={[styles.chipText, activeCat === 'All' && styles.chipTextActive]}>All</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCat(cat)}
                style={[styles.chip, activeCat === cat && styles.chipActive]}
                testID={`chip-${cat}`}
              >
                <Text style={[styles.chipText, activeCat === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.searchRow}>
            <Input
              placeholder="Search remedies or symptoms..."
              value={query}
              onChangeText={setQuery}
              inputStyle={styles.searchInputText}
              leftIcon={<Search size={16} color={colors.text.tertiary} />}
              testID="search-homeopathy"
            />
          </View>

          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/medical/attachments')} testID="open-attachments">
            <Info size={16} color={colors.accent.primary} />
            <Text style={styles.linkText}>Open Patient Attachments</Text>
            <ArrowRight size={16} color={colors.accent.primary} />
          </TouchableOpacity>
        </Card>

        {filtered.map(r => (
          <Card key={r.id} style={styles.card} testID={`remedy-${r.id}`}>
            <View style={styles.cardHeader}>
              <Droplets size={18} color={colors.text.primary} />
              <Text style={styles.title}>{r.name}</Text>
              <Badge label={r.category} size="small" variant="default" />
            </View>

            <Text style={styles.sectionLabel}>Indications</Text>
            {r.indications.map((i, idx) => (
              <Text key={idx} style={styles.itemText}>• {i}</Text>
            ))}

            <Text style={styles.sectionLabel}>Keynotes</Text>
            <View style={styles.badgesRow}>
              {r.keynotes.map((k, idx) => (
                <Badge key={idx} label={k} size="small" variant="default" />
              ))}
            </View>

            {r.potency && (
              <View style={styles.potencyRow}>
                <BookOpen size={16} color={colors.text.secondary} />
                <Text style={styles.potencyText}>{r.potency}</Text>
              </View>
            )}

            {!!r.cautions?.length && (
              <View style={styles.cautionBox}>
                <ShieldAlert size={16} color={colors.accent.primary} />
                <Text style={styles.cautionTitle}>Cautions</Text>
                {r.cautions!.map((c, idx) => (
                  <Text key={idx} style={styles.cautionText}>• {c}</Text>
                ))}
              </View>
            )}
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText} testID="homeopathy-empty">No remedies match your search.</Text>
          </Card>
        )}

        <Button
          title="See Holistic Care"
          onPress={() => router.push('/medical/holistic')}
          variant="outline"
          style={styles.bottomBtn}
          testID="go-holistic"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { padding: 16, paddingBottom: 32 },
  headerCard: { marginBottom: 12, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  headerTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 18 },
  headerSubtitle: { color: colors.text.secondary, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  linkText: { color: colors.accent.primary, fontWeight: '600' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: colors.background.secondary },
  chipActive: { backgroundColor: colors.accent.primary },
  chipText: { color: colors.text.secondary, fontSize: 12 },
  chipTextActive: { color: colors.text.primary, fontWeight: '600' },
  searchRow: { marginTop: 10 },
  searchInputText: { paddingVertical: 10 },
  card: { marginBottom: 12, paddingBottom: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  title: { color: colors.text.primary, fontWeight: '700', fontSize: 16, flex: 1 },
  sectionLabel: { color: colors.text.primary, fontWeight: '600', marginTop: 6, marginBottom: 4 },
  itemText: { color: colors.text.secondary, fontSize: 13, lineHeight: 18 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  potencyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  potencyText: { color: colors.text.secondary, fontSize: 12 },
  cautionBox: { backgroundColor: colors.background.secondary, borderRadius: 12, borderWidth: 1, borderColor: colors.border.light, padding: 10, gap: 4 },
  cautionTitle: { color: colors.text.primary, fontWeight: '600', marginTop: 2 },
  cautionText: { color: colors.text.secondary, fontSize: 12 },
  emptyCard: { padding: 12 },
  emptyText: { color: colors.text.secondary },
  bottomBtn: { marginTop: 8 },
});