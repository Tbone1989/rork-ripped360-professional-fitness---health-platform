import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { colors } from '@/constants/colors';
import { ShoppingBag, Users, Trophy, Activity, HeartHandshake, User, Store, Brain, RefreshCw, DownloadCloud } from 'lucide-react-native';
import * as Updates from 'expo-updates';
import * as Haptics from 'expo-haptics';

interface LinkItem {
  key: string;
  title: string;
  href: Href;
  icon: React.ReactNode;
}

export default function MoreScreen() {
  const router = useRouter();

  const [updateState, setUpdateState] = useState<{
    status: 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'upToDate' | 'unsupported' | 'error';
    message?: string;
    lastCheckedAt?: number;
  }>({ status: 'idle' });

  const checkForUpdates = useCallback(async () => {
    console.log('[More] checkForUpdates pressed');

    if (Platform.OS === 'web') {
      setUpdateState({
        status: 'unsupported',
        message: 'Updates are not available on web preview. Use a device build for OTA updates.',
        lastCheckedAt: Date.now(),
      });
      return;
    }

    setUpdateState({ status: 'checking', lastCheckedAt: Date.now() });
    try {
      await Haptics.selectionAsync().catch(() => undefined);

      if (!Updates.isEnabled) {
        console.log('[More] expo-updates is not enabled (likely dev mode).');
        setUpdateState({
          status: 'unsupported',
          message: 'Updates are disabled in development. Try in a production/preview build.',
          lastCheckedAt: Date.now(),
        });
        return;
      }

      const result = await Updates.checkForUpdateAsync();
      console.log('[More] checkForUpdateAsync result:', result);

      if (result.isAvailable) {
        setUpdateState({
          status: 'available',
          message: 'An update is available. Download to apply it.',
          lastCheckedAt: Date.now(),
        });
        return;
      }

      setUpdateState({
        status: 'upToDate',
        message: 'You are on the latest version.',
        lastCheckedAt: Date.now(),
      });
    } catch (e) {
      console.log('[More] checkForUpdates error:', e);
      setUpdateState({
        status: 'error',
        message: 'Could not check for updates. Please try again.',
        lastCheckedAt: Date.now(),
      });
    }
  }, []);

  const downloadUpdate = useCallback(async () => {
    console.log('[More] downloadUpdate pressed');

    if (Platform.OS === 'web') return;

    setUpdateState((s) => ({ ...s, status: 'downloading', message: 'Downloading update…' }));
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);

      const fetched = await Updates.fetchUpdateAsync();
      console.log('[More] fetchUpdateAsync result:', fetched);

      setUpdateState((s) => ({
        ...s,
        status: 'ready',
        message: 'Update downloaded. Restart to apply.',
      }));

      Alert.alert('Update ready', 'Restart the app to apply the update now?', [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Restart',
          style: 'default',
          onPress: () => {
            console.log('[More] Reloading app to apply update');
            void Updates.reloadAsync();
          },
        },
      ]);
    } catch (e) {
      console.log('[More] downloadUpdate error:', e);
      setUpdateState((s) => ({
        ...s,
        status: 'error',
        message: 'Download failed. Please try again.',
      }));
    }
  }, []);

  const links = useMemo<LinkItem[]>(() => [
    { key: 'ai', title: 'AI Features', href: '/ai/all-features' as any, icon: <Brain size={18} color={colors.text.primary} /> },
    { key: 'shop', title: 'Shop', href: '/shop' as any, icon: <ShoppingBag size={18} color={colors.text.primary} /> },
    { key: 'community', title: 'Community', href: '/community' as any, icon: <Users size={18} color={colors.text.primary} /> },
    { key: 'contest', title: 'Contest', href: '/contest' as any, icon: <Trophy size={18} color={colors.text.primary} /> },
    { key: 'coaching', title: 'Coaching', href: '/coaching' as any, icon: <HeartHandshake size={18} color={colors.text.primary} /> },
    { key: 'health', title: 'Health', href: '/medical' as any, icon: <Activity size={18} color={colors.text.primary} /> },
    { key: 'profile', title: 'Profile', href: '/profile' as any, icon: <User size={18} color={colors.text.primary} /> },
  ], []);

  return (
    <View style={styles.container} testID="more-container">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>More</Text>
        <View style={styles.card}>
          {links.map((l, idx) => (
            <TouchableOpacity
              key={l.key}
              style={[styles.row, idx !== 0 ? styles.rowDivider : undefined]}
              onPress={() => router.push(l.href)}
              activeOpacity={0.85}
              testID={`more-link-${l.key}`}
              accessibilityRole="button"
              accessibilityLabel={l.title}
            >
              <View style={styles.iconWrap}>{l.icon}</View>
              <Text style={styles.rowText}>{l.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.updateCard} testID="more-updates-card">
          <View style={styles.updateHeader}>
            <View style={styles.updateTitleRow}>
              <DownloadCloud size={18} color={colors.accent.secondary} />
              <Text style={styles.updateTitle}>Updates</Text>
            </View>
            <TouchableOpacity
              style={styles.updateAction}
              onPress={checkForUpdates}
              activeOpacity={0.85}
              testID="more-check-updates"
              accessibilityRole="button"
              accessibilityLabel="Check for updates"
            >
              <RefreshCw size={16} color={colors.text.primary} />
              <Text style={styles.updateActionText}>
                {updateState.status === 'checking' ? 'Checking…' : 'Check'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.updateMessage} testID="more-updates-message">
            {updateState.message ?? 'Check for the latest improvements and fixes.'}
          </Text>

          {updateState.lastCheckedAt ? (
            <Text style={styles.updateMeta} testID="more-updates-last-checked">
              Last checked: {new Date(updateState.lastCheckedAt).toLocaleString()}
            </Text>
          ) : null}

          {updateState.status === 'available' || updateState.status === 'downloading' ? (
            <TouchableOpacity
              style={styles.downloadRow}
              onPress={downloadUpdate}
              activeOpacity={0.85}
              disabled={updateState.status === 'downloading'}
              testID="more-download-update"
              accessibilityRole="button"
              accessibilityLabel="Download update"
            >
              <Text style={styles.downloadText}>
                {updateState.status === 'downloading' ? 'Downloading…' : 'Download update'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.supportCard}>
          <Store size={18} color={colors.accent.primary} />
          <Text style={styles.supportText}>Looking for something else? Explore AI Features, check Shop categories, Community feed, or open Coaching.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  updateCard: {
    marginTop: 16,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: 12,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  updateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  updateTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  updateAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  updateActionText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  updateMessage: {
    marginTop: 10,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  updateMeta: {
    marginTop: 6,
    color: colors.text.tertiary,
    fontSize: 12,
  },
  downloadRow: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.12)',
    borderWidth: 1,
    borderColor: colors.border.focused,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: {
    color: colors.text.primary,
    fontWeight: '800' as const,
  },
  supportCard: {
    marginTop: 16,
    borderRadius: 14,
    padding: 12,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  supportText: {
    color: colors.text.secondary,
    flex: 1,
  },
});
