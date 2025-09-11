import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Linking, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';
import { Attachment } from '@/types/user';
import { FileText, Link as LinkIcon, ShieldAlert, ShieldCheck, Headphones } from 'lucide-react-native';

import talkService from '@/services/talkService';

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

  const seedSamples = useCallback(() => {
    try {
      const now = new Date().toISOString();
      const samples: Attachment[] = [
        {
          id: `s-${Date.now()}-1`,
          title: 'Blood Panel - Comprehensive',
          url: 'https://www.hhs.texas.gov/sites/default/files/documents/laws-regulations/forms/hhs-1100.pdf',
          createdAt: now,
          visibleToCoaches: false,
        },
        {
          id: `s-${Date.now()}-2`,
          title: 'MRI Report - Left Knee',
          url: 'https://www.massgeneral.org/assets/mgh/pdf/imaging/radiology-report-example.pdf',
          createdAt: now,
          visibleToCoaches: true,
        },
        {
          id: `s-${Date.now()}-3`,
          title: 'Supplement Protocol',
          url: 'https://files.nccih.nih.gov/s3fs-public/media_files/Herbal_Supplements_At_A_Glance.pdf',
          createdAt: now,
          visibleToCoaches: true,
        },
      ];
      setLocalAttachments(samples);
      if (isClient) {
        updateUser({ attachments: samples });
      }
      Alert.alert('Added', 'Sample attachments have been added.');
    } catch (e) {
      console.log('[Attachments] seedSamples error', e);
      Alert.alert('Error', 'Could not add samples.');
    }
  }, [isClient, updateUser]);

  const emptyState = useMemo(() => (
    <View style={styles.empty} testID="attachments-empty">
      <Text style={styles.emptyTitle}>No attachments yet</Text>
      <Text style={styles.emptySubtitle}>Upload medical PDFs or links in Medical {'>'} Upload, then manage which ones coaches can see here.</Text>
      <TouchableOpacity onPress={seedSamples} style={styles.addSamplesBtn} testID="add-sample-attachments">
        <Text style={styles.addSamplesText}>Add sample files</Text>
      </TouchableOpacity>
    </View>
  ), [seedSamples]);

  useEffect(() => {
    try {
      const isEmpty = (localAttachments?.length ?? 0) === 0;
      const userEmpty = (user?.attachments?.length ?? 0) === 0;
      if (isEmpty && userEmpty) {
        seedSamples();
      }
    } catch (e) {
      console.log('[Attachments] auto-seed error', e);
    }
  }, [user?.attachments, localAttachments?.length, seedSamples]);

  const openUrl = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link'));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Files' }} />

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <ShieldCheck size={20} color={colors.accent.primary} />
          <Text style={styles.infoText}>Only items toggled on are visible to verified coaches. Your email and phone stay hidden.</Text>
          <TouchableOpacity
            onPress={() => talkService.speak('Manage which of your files coaches can view. Toggle a file to grant or revoke access. Your contact details remain private.')}
            style={styles.speakBtn}
            testID="speak-attachments-info"
            accessibilityRole="button"
            accessibilityLabel="Read info"
          >
            <Headphones size={18} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>
        {!isClient && (
          <View style={styles.warnRow}>
            <ShieldAlert size={20} color={colors.status.warning} />
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
                  <FileText size={22} color={colors.text.secondary} />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity style={styles.linkRow} onPress={() => openUrl(item.url)}>
                    <LinkIcon size={16} color={colors.accent.primary} />
                    <Text style={styles.link} numberOfLines={1}>{item.url}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.actionsRight}>
                <TouchableOpacity
                  onPress={() => talkService.speak(`${item.title}. ${typeof item.url === 'string' ? 'Link available.' : ''}`)}
                  style={styles.itemSpeakBtn}
                  testID={`speak-${(typeof item.id === 'string' && item.id.trim().length > 0) ? item.id.trim() : `idx-${index}`}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Read ${item.title}`}
                >
                  <Headphones size={18} color={colors.text.secondary} />
                </TouchableOpacity>
                <Switch
                testID={`visible-${(typeof item.id === 'string' && item.id.trim().length > 0) ? item.id.trim() : `idx-${index}`}`}
                value={!!item.visibleToCoaches}
                onValueChange={() => toggleVisibility(index)}
                trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
                thumbColor={colors.background.card}
                disabled={!isClient}
              />
              </View>
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
  infoCard: { margin: 16, padding: 14, position: 'relative' as const },
  infoRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  infoText: { color: colors.text.secondary, fontSize: 14, flex: 1 },
  warnRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  warnText: { color: colors.status.warning, fontSize: 13, flex: 1 },
  listEmptyContainer: { flexGrow: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', padding: 26 },
  addSamplesBtn: { marginTop: 16, backgroundColor: colors.accent.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  addSamplesText: { color: colors.text.primary, fontWeight: '700', fontSize: 16 },
  emptyTitle: { color: colors.text.primary, fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtitle: { color: colors.text.secondary, fontSize: 15, textAlign: 'center' },
  itemCard: { marginHorizontal: 16, marginBottom: 12, padding: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  meta: { flex: 1 },
  title: { color: colors.text.primary, fontSize: 17, fontWeight: '600', marginBottom: 4 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  link: { color: colors.accent.primary, fontSize: 13, flexShrink: 1 },
  saveBtn: { margin: 16, backgroundColor: colors.accent.primary, borderRadius: 12, alignItems: 'center', paddingVertical: 16 },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { color: colors.text.primary, fontWeight: '700', fontSize: 18 },
  speakBtn: { position: 'absolute' as const, right: 10, top: 10, padding: 6, borderRadius: 8, backgroundColor: colors.background.secondary },
  actionsRight: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  itemSpeakBtn: { padding: 6, borderRadius: 8, backgroundColor: colors.background.secondary },
});