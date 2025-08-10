import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Bell, Plus, Trash2, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PriceAlert {
  id: string;
  itemName: string;
  targetPrice: number;
  active: boolean;
}

export default function PriceAlertsScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [item, setItem] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const addAlert = useCallback(() => {
    const name = item.trim();
    const target = parseFloat(price);
    if (!name || isNaN(target)) {
      Alert.alert('Missing info', 'Enter an item and target price.');
      return;
    }
    const alert: PriceAlert = {
      id: Math.random().toString(36).slice(2),
      itemName: name,
      targetPrice: target,
      active: true,
    };
    console.log('Adding price alert', alert);
    setAlerts(prev => [alert, ...prev]);
    setItem('');
    setPrice('');
  }, [item, price]);

  const toggleAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, active: !a.active } : a)));
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const renderAlert = ({ item: a }: { item: PriceAlert }) => (
    <View style={styles.alertRow} testID={`price-alert-${a.id}`}>
      <View style={styles.alertInfo}>
        <Text style={styles.alertName}>{a.itemName}</Text>
        <Text style={styles.alertMeta}>{'Notify when <= $' + a.targetPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.alertActions}>
        <TouchableOpacity onPress={() => toggleAlert(a.id)} style={styles.alertToggle} testID={`toggle-${a.id}`}>
          <Text style={[styles.toggleText, a.active ? styles.toggleOn : styles.toggleOff]}>{a.active ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeAlert(a.id)} style={styles.alertDelete} testID={`delete-${a.id}`}>
          <Trash2 size={18} color={colors.status.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Price Alerts',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/meals/grocery-prices')} style={styles.headerRight} testID="go-price-finder">
              <Text style={styles.headerLink}>Browse Items</Text>
              <ChevronRight size={16} color={colors.accent.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <Card style={styles.inputCard}>
        <View style={styles.inputRow}>
          <Input
            placeholder="Item name"
            value={item}
            onChangeText={setItem}
            style={styles.input}
            testID="item-input"
          />
          <Input
            placeholder="Target price"
            value={price}
            onChangeText={setPrice}
            style={styles.priceInput}
            keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
            testID="price-input"
          />
          <Button title="Add" onPress={addAlert} icon={<Plus size={16} color={colors.text.primary} />} style={styles.addBtn} testID="add-alert-btn" />
        </View>
      </Card>

      {alerts.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Bell size={28} color={colors.text.secondary} />
          <Text style={styles.emptyTitle}>No alerts yet</Text>
          <Text style={styles.emptySubtitle}>Create a price alert to get notified when items drop below your target price.</Text>
          <Button title="Find Items" onPress={() => router.push('/meals/grocery-prices')} />
        </Card>
      ) : (
        <Card style={styles.listCard}>
          <FlatList
            data={alerts}
            keyExtractor={(i) => i.id}
            renderItem={renderAlert}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
        </Card>
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
  priceInput: {
    width: 140,
  },
  addBtn: {
    width: 100,
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
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  alertInfo: {
    flex: 1,
  },
  alertName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  alertMeta: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  alertActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  toggleOn: {
    color: colors.status.success,
  },
  toggleOff: {
    color: colors.text.secondary,
  },
  alertDelete: {
    paddingHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
  },
});
