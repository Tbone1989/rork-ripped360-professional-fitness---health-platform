import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            icon={<ArrowRight size={20} color={colors.text.primary} />}
          />

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
          <TouchableOpacity 
            style={styles.coachLoginButton}
            onPress={() => router.push('/(auth)/coach-login')}
          >
            <Text style={styles.coachLoginText}>Coach Login</Text>
          </TouchableOpacity>
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
  coachLoginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  coachLoginText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});