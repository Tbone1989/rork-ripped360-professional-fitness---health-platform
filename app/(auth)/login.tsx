import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Apple, Users, ShieldQuestion, Stethoscope, ShieldCheck, Info, HelpCircle, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { Tutorial } from '@/components/ui/Tutorial';
import securityService from '@/services/securityService';

const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const demoLogin = useUserStore((state) => state.demoLogin);
  const isLoading = useUserStore((state) => state.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Initialize security features
    securityService.blockAutoUpdates();
    
    // Check if user needs tutorial
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenTutorial = await AsyncStorage.getItem('has_seen_login_tutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.log('Tutorial check failed:', error);
    }
  };

  const handleLogin = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Security validation
    const canLogin = await securityService.validateLogin(email);
    if (!canLogin) {
      return;
    }

    try {
      setError('');
      await login(email, password);
      securityService.recordLoginAttempt(email, true);
      securityService.updateActivity();
      router.replace('/(tabs)');
    } catch (loginError) {
      console.error('[Login] error', loginError);
      securityService.recordLoginAttempt(email, false);
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

  const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? '';
  const APPLE_CLIENT_ID = process.env.EXPO_PUBLIC_APPLE_OAUTH_CLIENT_ID ?? '';

  const ensureEnvVal = useCallback((label: string, val: string) => {
    if (!val) {
      const msg = `Missing ${label}. Please add it to your .env and restart.`;
      setError(msg);
      Alert.alert('Configuration needed', msg);
    }
    return val ?? '';
  }, []);

  const handleOAuth = useCallback(async (provider: 'google' | 'apple') => {
    await withHaptics(Haptics.ImpactFeedbackStyle.Light);
    try {
      setError('');
      const clientId = {
        google: ensureEnvVal('EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID', GOOGLE_CLIENT_ID),
        apple: ensureEnvVal('EXPO_PUBLIC_APPLE_OAUTH_CLIENT_ID', APPLE_CLIENT_ID),
      }[provider];
      if (!clientId || !redirectUri) return;

      const discovery = {
        google: { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' },
        apple: { authorizationEndpoint: 'https://appleid.apple.com/auth/authorize' },
      }[provider];

      const scope = {
        google: 'openid profile email',
        apple: 'name email',
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
  }, [ensureEnvVal, redirectUri, router, withHaptics, GOOGLE_CLIENT_ID, APPLE_CLIENT_ID]);

  const handleDemoAccess = useCallback(async () => {
    await withHaptics(Haptics.ImpactFeedbackStyle.Light);
    try {
      setError('');
      await demoLogin();
      router.replace('/(tabs)');
    } catch (demoError) {
      console.error('[DemoLogin] error', demoError);
      setError('Unable to load demo mode right now. Please try again.');
    }
  }, [demoLogin, router, withHaptics]);

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
              <Image
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/6i6sp2yhczg09pyzjyomj' }}
                style={styles.logoImage}
                resizeMode="contain"
                accessibilityLabel="RIPPED360 app icon"
                testID="login-logo"
              />
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
          </View>

          <Button
            title="Explore Demo Experience"
            onPress={handleDemoAccess}
            variant="ghost"
            fullWidth
            style={styles.demoButton}
            icon={<Sparkles size={18} color={colors.accent.primary} />}
            testID="demo-mode-button"
          />
          <Text style={styles.demoHint}>Loads a sample account so you can tour the full app instantly.</Text>

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
              onLongPress={() => {
                Alert.alert(
                  'Coach Portal',
                  'Access for certified fitness coaches and personal trainers. Manage clients, create workout plans, and track progress. Requires coach certification and admin approval.',
                  [{ text: 'OK' }]
                );
              }}
              testID="coach-login-link"
            >
              <Users size={16} color={colors.text.secondary} />
              <Text style={styles.roleButtonText}>Coach</Text>
              <TouchableOpacity
                style={styles.infoIcon}
                onPress={() => {
                  Alert.alert(
                    'Coach Portal',
                    'Access for certified fitness coaches and personal trainers. Manage clients, create workout plans, and track progress. Requires coach certification and admin approval.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Info size={12} color={colors.text.secondary} />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(auth)/doctor-login')}
              onLongPress={() => {
                Alert.alert(
                  'Medical Portal',
                  'Access for licensed medical professionals. Review patient health data, provide medical guidance, and manage treatment plans. Requires medical license verification and admin approval.',
                  [{ text: 'OK' }]
                );
              }}
              testID="doctor-login-link"
            >
              <Stethoscope size={16} color={colors.text.secondary} />
              <Text style={styles.roleButtonText}>Doctor</Text>
              <TouchableOpacity
                style={styles.infoIcon}
                onPress={() => {
                  Alert.alert(
                    'Medical Portal',
                    'Access for licensed medical professionals. Review patient health data, provide medical guidance, and manage treatment plans. Requires medical license verification and admin approval.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Info size={12} color={colors.text.secondary} />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(auth)/admin-login')}
              onLongPress={() => {
                Alert.alert(
                  'Admin Portal',
                  'System administration access. Manage users, grant permissions, monitor system health, and configure platform settings. Restricted to authorized administrators only.',
                  [{ text: 'OK' }]
                );
              }}
              testID="admin-login-link"
            >
              <ShieldCheck size={16} color={colors.text.secondary} />
              <Text style={styles.roleButtonText}>Admin</Text>
              <TouchableOpacity
                style={styles.infoIcon}
                onPress={() => {
                  Alert.alert(
                    'Admin Portal',
                    'System administration access. Manage users, grant permissions, monitor system health, and configure platform settings. Restricted to authorized administrators only.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Info size={12} color={colors.text.secondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Tutorial
        visible={showTutorial}
        onClose={() => {
          setShowTutorial(false);
          AsyncStorage.setItem('has_seen_login_tutorial', 'true');
        }}
        tutorialKey="login"
        steps={[
          {
            title: 'Welcome to RIPPED360',
            description: 'Your comprehensive fitness and health platform. Let\'s get you started with a quick tour.',
            icon: <HelpCircle size={48} color={colors.accent.primary} />,
          },
          {
            title: 'Sign In Options',
            description: 'You can sign in using your email and password, or use your Google or Apple account for quick access.',
            icon: <ShieldQuestion size={48} color={colors.accent.primary} />,
          },
          {
            title: 'Different User Roles',
            description: 'Choose the appropriate portal based on your role: Regular users use the main login, while Coaches, Doctors, and Admins have dedicated portals with special access requirements.',
            icon: <Users size={48} color={colors.accent.primary} />,
          },
          {
            title: 'Security & Privacy',
            description: 'Your data is protected with HIPAA-compliant security. We use encryption, secure authentication, and block screen recording to keep your information safe.',
            icon: <ShieldCheck size={48} color={colors.status.success} />,
          },
          {
            title: 'Need Help?',
            description: 'Tap the info icons next to each role button to learn more about access requirements. Contact support if you need assistance.',
            icon: <Info size={48} color={colors.accent.primary} />,
          },
        ]}
      />
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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    marginBottom: 4,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
    overflow: 'hidden',
  },
  logoContent: {
    alignItems: 'center',
  },
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: '#000000',
  },
  logoMainText: {
    fontSize: 36,
    fontWeight: '900' as const,
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
    fontWeight: '700' as const,
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
    fontSize: 32,
    fontWeight: '900' as const,
    color: colors.text.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: 20,
    opacity: 0.85,
  },
  formContainer: {
    marginBottom: 24,
    maxWidth: Platform.OS === 'web' ? Math.min(screenWidth * 0.9, 400) : screenWidth,
    width: '100%',
    alignSelf: 'center',
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
    fontWeight: '600' as const,
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
    paddingHorizontal: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    position: 'relative',
  },
  infoIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
  },
  roleButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600' as const,
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
  demoButton: {
    marginTop: 12,
  },
  demoHint: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 8,
  },
});