import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Linking, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';
import { Attachment } from '@/types/user';
import { FileText, Link as LinkIcon, ShieldCheck } from 'lucide-react-native';

export default function AttachmentsVisibilityScreen() {
  const user = useUserStore((s) => s.user);
  const { updateUser } = useUserStore();
  const [localAttachments, setLocalAttachments] = useState<Attachment[]>(user?.attachments ?? []);

  const toggleVisibility = (id: string) => {
    setLocalAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, visibleToCoaches: !a.visibleToCoaches } : a)));
  };

  const save = () => {
    try {
      updateUser({ attachments: localAttachments });
      Alert.alert('Saved', 'Attachment visibility updated.');
    } catch (e) {
      console.log('[Attachments] save error', e);
      Alert.alert('Error', 'Could not save visibility. Please try again.');
    }
  };

  const emptyState = useMemo(() => (
    <View style={styles.empty} testID="attachments-empty">
      <Text style={styles.emptyTitle}>No attachments yet</Text>
      <Text style={styles.emptySubtitle}>Upload medical PDFs or links in Medical {'>'} Upload, then manage which ones coaches can see here.</Text>
    </View>
  ), []);

  const openUrl = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link'));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Attachments' }} />

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <ShieldCheck size={18} color={colors.accent.primary} />
          <Text style={styles.infoText}>Only items toggled on are visible to verified coaches. Your email and phone stay hidden.</Text>
        </View>
      </Card>

      <FlatList
        data={localAttachments}
        keyExtractor={(item, index) => `${item.id ?? item.url ?? 'att'}-${index}`}
        ListEmptyComponent={emptyState}
        contentContainerStyle={localAttachments.length === 0 ? styles.listEmptyContainer : undefined}
        renderItem={({ item }) => (
          <Card style={styles.itemCard}>
            <View style={styles.itemRow}>
              <View style={styles.left}>
                <View style={styles.iconWrap}>
                  <FileText size={18} color={colors.text.secondary} />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity style={styles.linkRow} onPress={() => openUrl(item.url)}>
                    <LinkIcon size={14} color={colors.accent.primary} />
                    <Text style={styles.link} numberOfLines={1}>{item.url}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Switch
                testID={`visible-${item.id}`}
                value={!!item.visibleToCoaches}
                onValueChange={() => toggleVisibility(item.id)}
                trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
                thumbColor={colors.background.card}
              />
            </View>
          </Card>
        )}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={save} testID="save-attachments">
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  infoCard: { margin: 16, padding: 12 },
  infoRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  infoText: { color: colors.text.secondary, fontSize: 13, flex: 1 },
  listEmptyContainer: { flexGrow: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', padding: 24 },
  emptyTitle: { color: colors.text.primary, fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptySubtitle: { color: colors.text.secondary, fontSize: 14, textAlign: 'center' },
  itemCard: { marginHorizontal: 16, marginBottom: 12, padding: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  meta: { flex: 1 },
  title: { color: colors.text.primary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  link: { color: colors.accent.primary, fontSize: 12, flexShrink: 1 },
  saveBtn: { margin: 16, backgroundColor: colors.accent.primary, borderRadius: 10, alignItems: 'center', paddingVertical: 14 },
  saveText: { color: colors.text.primary, fontWeight: '700', fontSize: 16 },
});