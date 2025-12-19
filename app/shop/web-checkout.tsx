import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ExternalLink, Lock } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/constants/colors';

type Params = {
  url?: string;
};

function safeDecodeUrl(input?: string): string | null {
  if (!input || typeof input !== 'string') return null;
  try {
    const decoded = decodeURIComponent(input);
    const u = new URL(decoded);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

export default function WebCheckoutScreen() {
  const params = useLocalSearchParams<Params>();
  const initialUrl = useMemo(() => safeDecodeUrl(params.url) ?? 'https://www.rippedcityinc.com/cart', [params.url]);

  const webviewRef = useRef<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  const handleBack = useCallback(() => {
    if (canGoBack && Platform.OS !== 'web') {
      webviewRef.current?.goBack();
      return;
    }
    router.back();
  }, [canGoBack]);

  const handleOpenExternal = useCallback(async () => {
    try {
      await Linking.openURL(initialUrl);
    } catch {
      Alert.alert('Could not open browser', 'Please try again.');
    }
  }, [initialUrl]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container} testID="web-checkout-screen">
        <Stack.Screen options={{ title: 'Checkout' }} />
        <View style={styles.topBar}>
          <TouchableOpacity testID="web-checkout-back" onPress={handleClose} style={styles.iconButton}>
            <ChevronLeft size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <View style={styles.securePill}>
              <Lock size={14} color={colors.text.primary} />
              <Text style={styles.secureText}>Secure checkout</Text>
            </View>
          </View>
          <TouchableOpacity testID="web-checkout-external" onPress={handleOpenExternal} style={styles.iconButton}>
            <ExternalLink size={18} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.webFallbackCard}>
          <Text style={styles.webFallbackTitle}>Checkout opens in a browser on web preview</Text>
          <Text style={styles.webFallbackBody} numberOfLines={3}>
            {initialUrl}
          </Text>
          <View style={styles.webFallbackActions}>
            <TouchableOpacity testID="web-checkout-open" onPress={handleOpenExternal} style={[styles.primaryBtn]}>
              <Text style={styles.primaryBtnText}>Open Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="web-checkout-close" onPress={handleClose} style={[styles.secondaryBtn]}>
              <Text style={styles.secondaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="web-checkout-screen">
      <Stack.Screen options={{ title: 'Checkout' }} />

      <View style={styles.topBar}>
        <TouchableOpacity testID="web-checkout-back" onPress={handleBack} style={styles.iconButton}>
          <ChevronLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <View style={styles.securePill}>
            <Lock size={14} color={colors.text.primary} />
            <Text style={styles.secureText}>Secure checkout</Text>
          </View>
        </View>

        <TouchableOpacity testID="web-checkout-external" onPress={handleOpenExternal} style={styles.iconButton}>
          <ExternalLink size={18} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.webviewWrap}>
        <WebView
          ref={(r) => {
            webviewRef.current = r;
          }}
          testID="web-checkout-webview"
          source={{ uri: initialUrl }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onNavigationStateChange={(nav) => {
            setCanGoBack(!!nav.canGoBack);
          }}
          onError={(e) => {
            console.log('[WebCheckout] WebView error:', e.nativeEvent);
            Alert.alert('Checkout failed to load', 'Please try opening in your browser.');
          }}
          onHttpError={(e) => {
            console.log('[WebCheckout] WebView HTTP error:', e.nativeEvent);
          }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.accent.primary} />
              <Text style={styles.loadingText}>Loading checkout…</Text>
            </View>
          )}
          allowsBackForwardNavigationGestures
        />

        {isLoading ? (
          <View pointerEvents="none" style={styles.loadingToast}>
            <ActivityIndicator size="small" color={colors.text.primary} />
            <Text style={styles.loadingToastText}>Opening secure checkout…</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.background.secondary,
  },
  secureText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  webviewWrap: {
    flex: 1,
  },
  loadingOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    color: colors.text.secondary,
  },
  loadingToast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.background.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  loadingToastText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  webFallbackCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 10,
  },
  webFallbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  webFallbackBody: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  webFallbackActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  secondaryBtnText: {
    color: colors.text.primary,
    fontWeight: '700',
  },
});
