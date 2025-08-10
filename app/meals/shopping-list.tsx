import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, Trash2, CheckCircle2, Circle, ShoppingCart, Share2, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  store?: string;
}

export default function ShoppingListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [storeFilter, setStoreFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    const incoming = (params.item as string | undefined) ?? '';
    if (incoming) {
      const exists = items.some(i => i.name.toLowerCase() === incoming.toLowerCase());
      if (!exists) {
        const toAdd: ShoppingItem = {
          id: Math.random().toString(36).slice(2),
          name: incoming,
          quantity: 1,
          checked: false,
        };
        console.log('Prefilling shopping list item from params:', toAdd);
        setItems(prev => [toAdd, ...prev]);
      }
    }
  }, [params.item]);

  const filteredItems = useMemo(() => {
    if (storeFilter === 'all') return items;
    return items.filter(i => i.store === storeFilter);
  }, [items, storeFilter]);

  const toggleItem = useCallback((id: string) => {
    console.log('Toggling item', id);
    setItems(prev => prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }, []);

  const removeItem = useCallback((id: string) => {
    console.log('Removing item', id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const addItem = useCallback(() => {
    const name = newItem.trim();
    if (!name) return;
    if (items.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert('Already added', 'This item is already in your list.');
      return;
    }
    const toAdd: ShoppingItem = {
      id: Math.random().toString(36).slice(2),
      name,
      quantity: 1,
      checked: false,
    };
    console.log('Adding new item', toAdd);
    setItems(prev => [toAdd, ...prev]);
    setNewItem('');
  }, [newItem, items]);

  const clearChecked = useCallback(() => {
    const any = items.some(i => i.checked);
    if (!any) return;
    Alert.alert('Clear purchased?', 'Remove all checked items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setItems(prev => prev.filter(i => !i.checked)) },
    ]);
  }, [items]);

  const renderItem = ({ item }: { item: ShoppingItem }) => {
    return (
      <View style={styles.itemRow} testID={`shopping-item-${item.id}`}>
        <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkButton} testID={`toggle-${item.id}`}>
          {item.checked ? (
            <CheckCircle2 size={22} color={colors.accent.primary} />
          ) : (
            <Circle size={22} color={colors.text.secondary} />
          )}
        </TouchableOpacity>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, item.checked && styles.itemNameChecked]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemMeta}>Qty {item.quantity}{item.store ? ` • ${item.store}` : ''}</Text>
        </View>
        <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton} testID={`delete-${item.id}`}>
          <Trash2 size={18} color={colors.status.error} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shopping List',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/meals/grocery-prices')} style={styles.headerRight} testID="go-price-finder">
              <Text style={styles.headerLink}>Find Prices</Text>
              <ChevronRight size={16} color={colors.accent.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <Card style={styles.inputCard}>
        <View style={styles.inputRow}>
          <Input
            placeholder="Add an item..."
            value={newItem}
            onChangeText={setNewItem}
            style={styles.input}
            testID="new-item-input"
          />
          <Button title="Add" onPress={addItem} icon={<Plus size={16} color={colors.text.primary} />} style={styles.addBtn} testID="add-item-btn" />
        </View>
        {items.length > 0 && (
          <View style={styles.listStats}>
            <Text style={styles.statsText}>{items.filter(i => !i.checked).length} to buy • {items.filter(i => i.checked).length} purchased</Text>
            <TouchableOpacity onPress={clearChecked} testID="clear-checked">
              <Text style={styles.clearChecked}>Clear purchased</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {items.length === 0 ? (
        <Card style={styles.emptyCard}>
          <ShoppingCart size={28} color={colors.text.secondary} />
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySubtitle}>Start by adding groceries or pick from best prices.</Text>
          <Button title="Browse Grocery Prices" onPress={() => router.push('/meals/grocery-prices')} />
        </Card>
      ) : (
        <Card style={styles.listCard}>
          <FlatList
            data={filteredItems}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
        </Card>
      )}

      <View style={styles.footerActions}>
        <Button title="Share List" variant="outline" onPress={() => Alert.alert('Share', 'Sharing coming soon.')} icon={<Share2 size={16} color={colors.accent.primary} />} style={styles.footerBtn} />
        <Button title="Find Cheapest" onPress={() => router.push('/meals/grocery-prices')} style={styles.footerBtn} />
      </View>
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
    gap: 4,
    paddingRight: 8,
  },
  headerLink: {
    color: colors.accent.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  inputCard: {
    margin: 16,
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
  },
  addBtn: {
    width: 100,
  },
  listStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statsText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  clearChecked: {
    color: colors.accent.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    marginHorizontal: 16,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  listCard: {
    marginHorizontal: 16,
    padding: 8,
    marginTop: 8,
    flex: 1,
  },
  listContent: {
    padding: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkButton: {
    paddingRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  footerBtn: {
    flex: 1,
  },
});