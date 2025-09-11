import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';
import { trpc } from '@/lib/trpc';
import talkService from '@/services/talkService';
import { FileText, Link as LinkIcon, Users2, Headphones } from 'lucide-react-native';

interface ClientItem { id: string; name: string; email: string; profileImageUrl?: string; }

export default function CoachAttachmentsScreen() {
  const user = useUserStore((s) => s.user);
  const viewerId = user?.id ?? '';
  const viewerRole = user?.role === 'medical' ? 'medical' as const : 'coach' as const;

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const clientsQuery = trpc.coaching.clients.useQuery({ viewerId, viewerRole, status: 'all' }, { enabled: viewerId.length > 0 });

  const attachmentsQuery = trpc.coaching.clientAttachments.useQuery(
    { viewerId, viewerRole, clientId: selectedClientId ?? '' },
    { enabled: viewerId.length > 0 && !!selectedClientId }
  );

  const clients: ClientItem[] = useMemo(() => clientsQuery.data?.clients ?? [], [clientsQuery.data?.clients]);

  const openUrl = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link'));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: viewerRole === 'medical' ? 'Patient Attachments' : 'Client Attachments' }} />

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Users2 size={18} color={colors.accent.primary} />
          <Text style={styles.infoText}>Select a {viewerRole === 'medical' ? 'patient' : 'client'} to view files shared with professionals.</Text>
          <TouchableOpacity
            onPress={() => talkService.speak(`Select a ${viewerRole === 'medical' ? 'patient' : 'client'} to view files shared with professionals.`)}
            style={styles.speakBtn}
            testID="speak-coach-attachments-info"
            accessibilityRole="button"
            accessibilityLabel="Read info"
          >
            <Headphones size={18} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Your {viewerRole === 'medical' ? 'Patients' : 'Clients'}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={clients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.clientList}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`client-${item.id}`}
            style={[styles.clientChip, selectedClientId === item.id && styles.clientChipActive]}
            onPress={() => setSelectedClientId(item.id)}
          >
            <Text numberOfLines={1} style={[styles.clientChipText, selectedClientId === item.id && styles.clientChipTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText} testID="clients-empty">No assigned {viewerRole === 'medical' ? 'patients' : 'clients'}.</Text>
        )}
      />

      {selectedClientId == null ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText} testID="attachments-prompt">Select a {viewerRole === 'medical' ? 'patient' : 'client'} to view attachments.</Text>
        </View>
      ) : (
        <FlatList
          data={attachmentsQuery.data?.attachments ?? []}
          keyExtractor={(item, index) => (typeof item.id === 'string' && item.id.trim().length > 0) ? item.id : `att-${index}`}
          ListEmptyComponent={() => (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText} testID="attachments-empty">No attachments available.</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={styles.left}>
                  <View style={styles.iconWrap}>
                    <FileText size={18} color={colors.text.secondary} />
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <TouchableOpacity onPress={() => talkService.speak(item.title)} style={styles.itemSpeakBtn} testID={`speak-${typeof item.id === 'string' ? item.id : 'att'}`} accessibilityRole="button" accessibilityLabel={`Read ${item.title}`}>
                      <Headphones size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkRow} onPress={() => openUrl(item.url)}>
                      <LinkIcon size={14} color={colors.accent.primary} />
                      <Text style={styles.link} numberOfLines={1}>{item.url}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={(attachmentsQuery.data?.attachments?.length ?? 0) === 0 ? styles.listEmptyContainer : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  infoCard: { margin: 16, padding: 12, position: 'relative' as const },
  infoRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  infoText: { color: colors.text.secondary, fontSize: 13, flex: 1 },
  sectionTitle: { color: colors.text.primary, fontSize: 16, fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  clientList: { paddingHorizontal: 16, paddingBottom: 8 },
  clientChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: colors.background.secondary, marginRight: 8 },
  clientChipActive: { backgroundColor: colors.accent.primary },
  clientChipText: { color: colors.text.secondary, fontSize: 13, maxWidth: 160 },
  clientChipTextActive: { color: colors.text.primary },
  emptyWrap: { alignItems: 'center', padding: 24 },
  emptyText: { color: colors.text.secondary },
  listEmptyContainer: { flexGrow: 1, justifyContent: 'center' },
  itemCard: { marginHorizontal: 16, marginBottom: 12, padding: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  meta: { flex: 1 },
  title: { color: colors.text.primary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  link: { color: colors.accent.primary, fontSize: 12, flexShrink: 1 },
  speakBtn: { position: 'absolute' as const, right: 10, top: 10, padding: 6, borderRadius: 8, backgroundColor: colors.background.secondary },
  itemSpeakBtn: { padding: 6, borderRadius: 8, backgroundColor: colors.background.secondary, marginTop: 6, alignSelf: 'flex-start' as const },
});