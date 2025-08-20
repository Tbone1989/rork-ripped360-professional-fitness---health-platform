import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Apple, Microscope, ShieldQuestion, Stethoscope, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleSignUp = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(auth)/signup');
  };

  const redirectUri = useMemo(() => {
    try {
      const uri = makeRedirectUri();
      return uri;
    } catch (e) {
      console.warn('Redirect URI generation failed', e);
      return '';
    }
  }, []);

  const withHaptics = useCallback(async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') {
      try { await Haptics.impactAsync(style); } catch {}
    }
  }, []);

  const ensureEnv = useCallback((key: string) => {
    const val = process.env[key];
    if (!val) {
      const msg = `Missing ${key}. Please add it to your .env and restart.`;
      setError(msg);
      Alert.alert('Configuration needed', msg);
    }
    return val ?? '';
  }, []);

  const handleOAuth = useCallback(async (provider: 'google' | 'apple' | 'microsoft') => {
    await withHaptics(Haptics.ImpactFeedbackStyle.Light);
    try {
      setError('');
      const clientIdKey = {
        google: 'EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID',
        apple: 'EXPO_PUBLIC_APPLE_OAUTH_CLIENT_ID',
        microsoft: 'EXPO_PUBLIC_MICROSOFT_OAUTH_CLIENT_ID',
      }[provider];
      const clientId = ensureEnv(clientIdKey);
      if (!clientId || !redirectUri) return;

      const discovery = {
        google: { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' },
        apple: { authorizationEndpoint: 'https://appleid.apple.com/auth/authorize' },
        microsoft: { authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize' },
      }[provider];

      const scope = {
        google: 'openid profile email',
        apple: 'name email',
        microsoft: 'openid profile email offline_access',
      }[provider];

      const query = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope,
        prompt: 'consent',
      }).toString();

      const authUrl = `${discovery.authorizationEndpoint}?${query}`;
      console.log('[OAuth] Starting', provider, { authUrl, redirectUri });

      WebBrowser.maybeCompleteAuthSession();
      const res = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      console.log('[OAuth] Result', res);

      if (res.type === 'success' && typeof res.url === 'string') {
        const parsed = new URL(res.url);
        const hash = parsed.hash.startsWith('#') ? parsed.hash.substring(1) : parsed.hash;
        const params = new URLSearchParams(hash || parsed.search);
        const token = params.get('access_token');
        if (token) {
          await useUserStore.getState().login(`${provider}@oauth.local`, 'oauth', 'user');
          router.replace('/(tabs)');
          return;
        }
      }
      if (res.type === 'cancel' || res.type === 'dismiss') {
        setError('Sign-in was canceled');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } catch (e) {
      console.error('[OAuth] Error', e);
      setError('Unable to sign in right now. Please try again later.');
    }
  }, [ensureEnv, redirectUri, router, withHaptics]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoContainer}>
              <View style={styles.logoContent}>
                <Text style={styles.logoMainText}>R</Text>
                <View style={styles.logoSubContainer}>
                  <Text style={styles.logoSubText}>360</Text>
                  <View style={styles.logoDot} />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.title}>Welcome to Ripped360</Text>
          <Text style={styles.subtitle}>
            Sign in to access your personalized fitness and health platform
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText} testID="login-error">{error}</Text> : null}

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            icon={<ArrowRight size={20} color={colors.text.primary} />}
            testID="email-signin"
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <Button
              title="Sign in with Google"
              onPress={() => handleOAuth('google')}
              variant="secondary"
              fullWidth
              style={styles.socialButton}
              icon={<ShieldQuestion size={18} color={colors.text.primary} />}
              testID="google-signin"
            />
            <Button
              title="Sign in with Apple"
              onPress={() => handleOAuth('apple')}
              variant="secondary"
              fullWidth
              style={styles.socialButton}
              icon={<Apple size={18} color={colors.text.primary} />}
              testID="apple-signin"
            />
            <Button
              title="Sign in with Microsoft"
              onPress={() => handleOAuth('microsoft')}
              variant="secondary"
              fullWidth
              style={styles.socialButton}
              icon={<Microscope size={18} color={colors.text.primary} />}
              testID="microsoft-signin"
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.roleButtonsRow}>
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(auth)/coach-login')}
              testID="coach-login-link"
            >
              <Microscope size={16} color={colors.text.secondary} />
              <Text style={styles.roleButtonText}>Coach</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(auth)/doctor-login')}
              testID="doctor-login-link"
            >
              <Stethoscope size={16} color={colors.text.secondary} />
              <Text style={styles.roleButtonText}>Doctor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(auth)/admin-login')}
              testID="admin-login-link"
            >
              <ShieldCheck size={16} color={colors.text.secondary} />
              <Text style={styles.roleButtonText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E53935',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContent: {
    alignItems: 'center',
  },
  logoMainText: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text.primary,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
  },
  logoSubText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    opacity: 0.9,
  },
  logoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginLeft: 2,
    marginTop: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
  },
  errorText: {
    color: colors.status.error,
    marginTop: 8,
    textAlign: 'center',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: colors.accent.primary,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    color: colors.text.secondary,
    marginRight: 4,
  },
  signUpText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  roleButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  roleButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    textAlign: 'center',
  },
  dividerRow: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  socialRow: {
    gap: 10,
    marginTop: 8,
  },
  socialButton: {
    width: '100%',
  },
});