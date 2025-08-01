import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Users, Award, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';

export default function CoachLoginScreen() {
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
      // Login as coach role
      await login(email, password, 'coach');
      router.replace('/coach/dashboard');
    } catch (err) {
      setError('Invalid coach credentials');
    }
  };

  const handleBackToClient = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#1E88E5', '#1565C0']}
            style={styles.logoContainer}
          >
            <View style={styles.logoContent}>
              <Text style={styles.logoMainText}>R</Text>
              <View style={styles.logoSubContainer}>
                <Text style={styles.logoSubText}>360</Text>
                <View style={styles.logoDot} />
              </View>
            </View>
          </LinearGradient>
          <Text style={styles.title}>Coach Portal</Text>
          <Text style={styles.subtitle}>
            Access your coaching dashboard and manage your clients
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Users size={20} color={colors.accent.primary} />
            <Text style={styles.featureText}>Manage Clients</Text>
          </View>
          <View style={styles.featureItem}>
            <Calendar size={20} color={colors.accent.primary} />
            <Text style={styles.featureText}>Schedule Sessions</Text>
          </View>
          <View style={styles.featureItem}>
            <Award size={20} color={colors.accent.primary} />
            <Text style={styles.featureText}>Track Progress</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Coach Email"
            placeholder="Enter your coach email"
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
            title="Sign In as Coach"
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
          <Text style={styles.footerText}>Not a coach?</Text>
          <TouchableOpacity onPress={handleBackToClient}>
            <Text style={styles.clientLoginText}>Client Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 28,
    fontWeight: '800',
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
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: '#1E88E5',
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
    color: '#1E88E5',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.text.secondary,
    marginRight: 4,
  },
  clientLoginText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
});