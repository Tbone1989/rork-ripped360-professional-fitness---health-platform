import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Linking, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';
import { Attachment } from '@/types/user';
import { FileText, Link as LinkIcon, ShieldAlert, ShieldCheck } from 'lucide-react-native';

export default function AttachmentsVisibilityScreen() {
  const user = useUserStore((s) => s.user);
  const { updateUser } = useUserStore();
  const [localAttachments, setLocalAttachments] = useState<Attachment[]>(user?.attachments ?? []);
  const isClient = user?.role === 'user';

  const toggleVisibility = (index: number) => {
    if (!isClient) {
      Alert.alert('Not available', 'Only clients can modify attachment visibility.');
      return;
    }
    setLocalAttachments((prev) => prev.map((a, i) => (i === index ? { ...a, visibleToCoaches: !a.visibleToCoaches } : a)));
  };

  const save = () => {
    try {
      if (!isClient) {
        Alert.alert('Not available', 'Only clients can save attachment visibility.');
        return;
      }
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
        {!isClient && (
          <View style={styles.warnRow}>
            <ShieldAlert size={18} color={colors.status.warning} />
            <Text style={styles.warnText}>This area is for clients. Please use your portal to view client files.</Text>
          </View>
        )}
      </Card>

      <FlatList
        data={localAttachments}
        keyExtractor={(item, index) => {
          const id = typeof item.id === 'string' ? item.id.trim() : '';
          const url = typeof item.url === 'string' ? item.url.trim() : '';
          const created = typeof item.createdAt === 'string' ? item.createdAt.trim() : '';

          if (id.length > 0) return `att-id-${id}`;
          if (url.length > 0) return `att-url-${url.replace(/\W+/g, '-')}`;
          if (created.length > 0) return `att-created-${created.replace(/\W+/g, '-')}`;
          return `att-idx-${index}`;
        }}
        ListEmptyComponent={emptyState}
        contentContainerStyle={localAttachments.length === 0 ? styles.listEmptyContainer : undefined}
        renderItem={({ item, index }) => (
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
                testID={`visible-${(typeof item.id === 'string' && item.id.trim().length > 0) ? item.id.trim() : `idx-${index}`}`}
                value={!!item.visibleToCoaches}
                onValueChange={() => toggleVisibility(index)}
                trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
                thumbColor={colors.background.card}
                disabled={!isClient}
              />
            </View>
          </Card>
        )}
      />

      <TouchableOpacity style={[styles.saveBtn, !isClient && styles.saveBtnDisabled]} onPress={save} disabled={!isClient} testID="save-attachments">
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
  warnRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  warnText: { color: colors.status.warning, fontSize: 12, flex: 1 },
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
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { color: colors.text.primary, fontWeight: '700', fontSize: 16 },
});