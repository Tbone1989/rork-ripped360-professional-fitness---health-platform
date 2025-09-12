import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Clock, ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';

export default function VirtualPosingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Virtual Posing Coach',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Trophy size={80} color={colors.accent.secondary} />
        </View>
        
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>Virtual Posing Coach</Text>
        
        <View style={styles.card}>
          <Clock size={24} color={colors.accent.primary} />
          <Text style={styles.cardText}>
            We're working hard to bring you an AI-powered virtual posing coach that will help perfect your stage presence.
          </Text>
        </View>
        
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>What to Expect:</Text>
          <Text style={styles.feature}>• Real-time pose analysis and feedback</Text>
          <Text style={styles.feature}>• Mandatory pose tutorials and practice</Text>
          <Text style={styles.feature}>• Stage presence coaching</Text>
          <Text style={styles.feature}>• Competition-specific posing routines</Text>
          <Text style={styles.feature}>• Progress tracking and improvement metrics</Text>
        </View>
        
        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          variant="secondary"
          icon={<ArrowLeft size={20} color={colors.text.primary} />}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.primary 
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: colors.accent.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 18, 
    color: colors.text.secondary, 
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cardText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  features: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 15,
  },
  feature: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
});