import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { ArrowRight, Stethoscope, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

export default function DoctorLoginScreen() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState<boolean>(false);

  const handleLogin = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!acceptedDisclaimer) {
      setShowDisclaimer(true);
      return;
    }

    try {
      setError('');
      await login(email, password, 'medical');
      router.replace('/medical' as any);
    } catch (err) {
      console.log('[DoctorLogin] login failed', err);
      setError('Invalid doctor credentials');
    }
  };

  const handleBackToClient = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(auth)/login' as any);
  };

  return (
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
                testID="doctor-logo"
              />
            </View>
          </View>
          <Text style={styles.title}>Wellness Provider Portal</Text>
          <Text style={styles.subtitle}>
            Access client health insights, labs, and practitioner tools
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Stethoscope size={20} color={colors.accent.primary} />
            <Text style={styles.featureText}>Review Labs</Text>
          </View>
          <View style={styles.featureItem}>
            <Shield size={20} color={colors.accent.primary} />
            <Text style={styles.featureText}>Medication Safety</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Provider Email"
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

          {error ? <Text style={styles.errorText} testID="doctor-login-error">{error}</Text> : null}

          <Button
            title="Sign In as Wellness Provider"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            icon={<ArrowRight size={20} color={colors.text.primary} />}
            testID="doctor-signin"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Not a provider?</Text>
          <TouchableOpacity onPress={handleBackToClient} testID="back-to-client">
            <Text style={styles.clientLoginText}>Client Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LegalDisclaimer
        visible={showDisclaimer}
        type="doctor"
        onClose={() => setShowDisclaimer(false)}
        onAccept={() => {
          setAcceptedDisclaimer(true);
          setShowDisclaimer(false);
          handleLogin();
        }}
        title="Provider Compliance Notice"
      />
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
  logoWrapper: {
    marginBottom: 24,
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
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: '#000000',
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
    backgroundColor: '#2BB673',
  },
  errorText: {
    color: colors.status.error,
    marginTop: 8,
    textAlign: 'center',
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