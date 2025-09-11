import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Lightbulb, ShoppingCart, Plus, CheckCircle2, Circle, Tags, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SmartItem {
  id: string;
  name: string;
  category: 'produce' | 'meat' | 'dairy' | 'pantry' | 'frozen' | 'beverages' | 'other';
  reason: string;
  checked: boolean;
}

const starterItems: SmartItem[] = [
  { id: 'banana', name: 'Bananas', category: 'produce', reason: 'Pre-workout carbs + potassium', checked: false },
  { id: 'chicken', name: 'Chicken Breast', category: 'meat', reason: 'Lean protein for muscle repair', checked: false },
  { id: 'yogurt', name: 'Greek Yogurt', category: 'dairy', reason: 'High-protein snack with probiotics', checked: false },
  { id: 'rice', name: 'Brown Rice', category: 'pantry', reason: 'Stable carb source for training days', checked: false },
  { id: 'broccoli', name: 'Broccoli', category: 'produce', reason: 'Micros + fiber for recovery', checked: false },
  { id: 'oats', name: 'Oats', category: 'pantry', reason: 'Breakfast carbs + beta-glucans', checked: false },
];

export default function SmartGroceryListScreen() {
  const params = useLocalSearchParams();
  const autoItem = (params.item as string | undefined) ?? '';

  const [items, setItems] = useState<SmartItem[]>(() => {
    const base = starterItems.map(i => ({ ...i }));
    if (autoItem) {
      const id = autoItem.toLowerCase().replace(/\s+/g, '-');
      if (!base.find(b => b.name.toLowerCase() === autoItem.toLowerCase())) {
        base.unshift({ id, name: autoItem, category: 'other', reason: 'Added from previous screen', checked: false });
      }
    }
    return base;
  });
  const [newItem, setNewItem] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => i.name.toLowerCase().includes(q) || i.reason.toLowerCase().includes(q));
  }, [items, query]);

  const toggle = useCallback((id: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const add = useCallback(() => {
    const name = newItem.trim();
    if (!name) return;
    if (items.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert('Already in list', 'This item is already on your smart list.');
      return;
    }
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setItems(prev => [{ id, name, category: 'other', reason: 'Manually added', checked: false }, ...prev]);
    setNewItem('');
  }, [newItem, items]);

  const addCheapest = useCallback((name: string) => {
    router.push(`/meals/grocery-prices?search=${encodeURIComponent(name)}`);
  }, []);

  const renderItem = ({ item }: { item: SmartItem }) => (
    <View style={styles.row} testID={`smart-item-${item.id}`}>
      <TouchableOpacity onPress={() => toggle(item.id)} style={styles.check}>
        {item.checked ? (
          <CheckCircle2 size={22} color={colors.accent.primary} />
        ) : (
          <Circle size={22} color={colors.text.secondary} />
        )}
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.name, item.checked && styles.nameChecked]} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.reason} numberOfLines={2}>{item.reason}</Text>
      </View>
      <TouchableOpacity style={styles.action} onPress={() => addCheapest(item.name)}>
        <Text style={styles.actionText}>Cheapest</Text>
        <ChevronRight size={14} color={colors.accent.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Smart Grocery List' }} />

      <Card style={styles.hero}>
        <View style={styles.heroIcon}>
          <Lightbulb size={20} color={colors.accent.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>Auto-built for your goals</Text>
          <Text style={styles.heroSubtitle}>We suggest staples for muscle repair, performance, and recovery.</Text>
        </View>
      </Card>

      <Card style={styles.inputCard}>
        <Input placeholder="Quick filter…" value={query} onChangeText={setQuery} />
        <View style={{ height: 8 }} />
        <View style={styles.addRow}>
          <Input placeholder="Add custom item" value={newItem} onChangeText={setNewItem} style={{ flex: 1 }} />
          <Button title="Add" onPress={add} icon={<Plus size={14} color={colors.text.primary} />} style={{ width: 96 }} />
        </View>
      </Card>

      <Card style={styles.listCard}>
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ padding: 8 }}
        />
      </Card>

      <View style={styles.footer}>
        <Button title="Open Price Finder" onPress={() => router.push('/meals/grocery-prices')} icon={<Tags size={16} color={colors.text.primary} />} style={{ flex: 1 }} />
        <Button title="Shopping List" variant="outline" onPress={() => router.push('/meals/shopping-list')} icon={<ShoppingCart size={16} color={colors.accent.primary} />} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary, padding: 16 },
  hero: { padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background.tertiary, justifyContent: 'center', alignItems: 'center' },
  heroTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 16 },
  heroSubtitle: { color: colors.text.secondary, marginTop: 2 },
  inputCard: { padding: 12, gap: 8, marginBottom: 12 },
  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  listCard: { flex: 1, paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  check: { paddingRight: 12 },
  info: { flex: 1 },
  name: { color: colors.text.primary, fontWeight: '600', fontSize: 15 },
  nameChecked: { color: colors.text.secondary, textDecorationLine: 'line-through' },
  reason: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.background.secondary },
  actionText: { color: colors.accent.primary, fontWeight: '700', fontSize: 12 },
  sep: { height: 1, backgroundColor: colors.border.light },
  footer: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
