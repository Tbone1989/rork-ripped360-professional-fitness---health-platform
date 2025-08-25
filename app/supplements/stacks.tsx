import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Pill, Moon, Brain, Dumbbell, Flame, Soup, Bone, GaugeCircle, Syringe } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { TabBar } from '@/components/ui/TabBar';
import { PEPTIDES, SUPPLEMENT_STACKS, StackCategory, StackDefinition, PeptideItem } from '@/constants/supplementStacks';

const categoryIcons: Record<StackCategory, React.ReactNode> = {
  'Sleep': <Moon size={16} color={colors.accent.primary} />,
  'Stress': <Brain size={16} color={colors.accent.primary} />,
  'Muscle': <Dumbbell size={16} color={colors.accent.primary} />,
  'Fat loss': <Flame size={16} color={colors.accent.primary} />,
  'Gut': <Soup size={16} color={colors.accent.primary} />,
  'Joint': <Bone size={16} color={colors.accent.primary} />,
  'Metabolic': <GaugeCircle size={16} color={colors.accent.primary} />,
};

export default function SupplementStacksScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stacks' | 'peptides'>('stacks');
  const [selectedCategory, setSelectedCategory] = useState<StackCategory>('Sleep');

  const categories = useMemo(() => SUPPLEMENT_STACKS.map(s => ({ id: s.category, label: s.category })), []);

  const currentStack: StackDefinition | undefined = useMemo(
    () => SUPPLEMENT_STACKS.find(s => s.category === selectedCategory),
    [selectedCategory]
  );

  const onSaveToProtocol = useCallback((name: string) => {
    console.log('[Stacks] Save to protocol clicked for', name);
    try {
      router.push('/contest/create-protocol');
    } catch (e) {
      console.error('Navigation error', e);
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Stacks',
          headerRight: () => (
            <View style={styles.headerRight}>
              <Pill size={20} color={colors.accent.primary} />
            </View>
          )
        }}
      />

      <View style={styles.tabsWrap}>
        <TabBar
          tabs={[
            { key: 'stacks', label: 'Stacks', icon: <Pill size={16} color={colors.text.primary} /> },
            { key: 'peptides', label: 'Peptides', icon: <Syringe size={16} color={colors.text.primary} /> },
          ]}
          activeTab={activeTab}
          onTabChange={(k) => setActiveTab(k as 'stacks' | 'peptides')}
        />
      </View>

      {activeTab === 'stacks' ? (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} testID="stacks-scroll">
          <Card style={styles.categoryCard}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ChipGroup
              options={categories}
              selectedIds={[selectedCategory]}
              onChange={(ids) => setSelectedCategory((ids[0] as StackCategory) ?? 'Sleep')}
              style={styles.chips}
            />
          </Card>

          {currentStack && (
            <Card style={styles.stackCard} testID={`stack-${currentStack.category}`}>
              <View style={styles.stackHeader}>
                <View style={styles.stackTitleRow}>
                  <View style={styles.iconBubble}>
                    {categoryIcons[currentStack.category]}
                  </View>
                  <Text style={styles.stackTitle}>{currentStack.title}</Text>
                </View>
                <Text style={styles.stackSubtitle}>{currentStack.category}</Text>
              </View>

              <View style={styles.itemsList}>
                {currentStack.items.map((it) => (
                  <View key={it.id} style={styles.itemRow} testID={`stack-item-${it.id}`}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{it.name}</Text>
                      <TouchableOpacity onPress={() => onSaveToProtocol(it.name)} accessibilityRole="button" testID={`save-${it.id}`}>
                        <Text style={styles.saveText}>Save to protocol</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.metaRow}>
                      <View style={styles.metaPill}><Text style={styles.metaText}>Dose: {it.dosage}</Text></View>
                      <View style={styles.metaPill}><Text style={styles.metaText}>Timing: {it.timing}</Text></View>
                    </View>
                    {it.contraindications ? (
                      <View style={styles.ctaBox}>
                        <Text style={styles.ctaLabel}>Contraindications</Text>
                        <Text style={styles.ctaText}>{it.contraindications}</Text>
                      </View>
                    ) : null}
                    {it.notes ? (
                      <View style={styles.notesBox}>
                        <Text style={styles.notesText}>{it.notes}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>

              <Button
                title="Save Entire Stack to Protocol"
                onPress={() => onSaveToProtocol(currentStack.title)}
                style={styles.primaryButton}
                testID="btn-save-stack"
              />
            </Card>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} testID="peptides-scroll">
          <Card style={styles.stackCard}>
            <View style={styles.stackHeader}>
              <View style={styles.stackTitleRow}>
                <View style={styles.iconBubble}>
                  <Syringe size={16} color={colors.accent.primary} />
                </View>
                <Text style={styles.stackTitle}>Peptides</Text>
              </View>
              <Text style={styles.stackSubtitle}>Education only</Text>
            </View>
            <View style={styles.itemsList}>
              {PEPTIDES.map((p: PeptideItem) => (
                <View key={p.id} style={styles.itemRow} testID={`peptide-item-${p.id}`}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{p.name}</Text>
                    <TouchableOpacity onPress={() => onSaveToProtocol(p.name)} accessibilityRole="button" testID={`save-peptide-${p.id}`}>
                      <Text style={styles.saveText}>Save to protocol</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}><Text style={styles.metaText}>Protocol: {p.protocol}</Text></View>
                  </View>
                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}><Text style={styles.metaText}>Dose: {p.dosage}</Text></View>
                    <View style={styles.metaPill}><Text style={styles.metaText}>Timing: {p.timing}</Text></View>
                  </View>
                  {p.contraindications ? (
                    <View style={styles.ctaBox}>
                      <Text style={styles.ctaLabel}>Contraindications</Text>
                      <Text style={styles.ctaText}>{p.contraindications}</Text>
                    </View>
                  ) : null}
                  {p.notes ? (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesText}>{p.notes}</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  tabsWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  scroll: {
    flex: 1,
  },
  categoryCard: {
    margin: 16,
    marginTop: 12,
    padding: 16,
  },
  chips: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  stackCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
  },
  stackHeader: {
    marginBottom: 12,
  },
  stackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  stackSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  itemsList: {
    marginTop: 8,
  },
  itemRow: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    paddingRight: 8,
  },
  saveText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  metaPill: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
  },
  ctaBox: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(255, 165, 0, 0.08)' : '#FFF7E6',
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: 10,
    borderRadius: 10,
  },
  ctaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.status.warning,
    marginBottom: 4,
  },
  ctaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  notesBox: {
    marginTop: 6,
  },
  notesText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  primaryButton: {
    marginTop: 16,
  },
});
