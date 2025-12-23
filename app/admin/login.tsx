import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Shield, Eye, EyeOff } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { adminLogin, isLoading } = useUserStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await adminLogin(email, password);
      router.replace('/admin/dashboard' as any);
    } catch {
      Alert.alert('Login Failed', 'Invalid admin credentials');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Admin Access', headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Shield size={48} color={colors.accent.primary} />
        </View>
        <Text style={styles.title}>Administrator Login</Text>
        <Text style={styles.subtitle}>
          Secure access to Ripped360 administration panel
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Admin Email"
          placeholder="admin@ripped360.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <Input
            label="Admin Password"
            placeholder="Enter admin password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.text.secondary} />
            ) : (
              <Eye size={20} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
        </View>

        <Button
          title={isLoading ? "Authenticating..." : "Access Admin Panel"}
          onPress={handleLogin}
          disabled={isLoading}
          fullWidth
          style={styles.loginButton}
        />
      </View>

      <View style={styles.info}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Admin Credentials</Text>
          <Text style={styles.infoText}>Email: admin@ripped360.com</Text>
          <Text style={styles.infoText}>Password: RippedAdmin2024!</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Admin Capabilities</Text>
          <Text style={styles.infoText}>• User access management</Text>
          <Text style={styles.infoText}>• Subscription control</Text>
          <Text style={styles.infoText}>• Medical data oversight</Text>
          <Text style={styles.infoText}>• Coach verification</Text>
          <Text style={styles.infoText}>• System monitoring</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back to App</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 44,
    padding: 4,
  },
  loginButton: {
    marginTop: 24,
  },
  info: {
    paddingHorizontal: 24,
    gap: 16,
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 32,
  },
  backText: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '500',
  },
});