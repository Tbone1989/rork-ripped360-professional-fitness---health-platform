import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Clock, ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';

export default function PeakWeekAIScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Peak Week AI',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Zap size={80} color={colors.accent.secondary} />
        </View>
        
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>Peak Week AI Planner</Text>
        
        <View style={styles.card}>
          <Clock size={24} color={colors.accent.primary} />
          <Text style={styles.cardText}>
            Our AI-powered peak week planner will help you dial in your competition prep with personalized protocols.
          </Text>
        </View>
        
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>What to Expect:</Text>
          <Text style={styles.feature}>• Automated carb loading protocols</Text>
          <Text style={styles.feature}>• Water manipulation strategies</Text>
          <Text style={styles.feature}>• Sodium and electrolyte timing</Text>
          <Text style={styles.feature}>• Training taper recommendations</Text>
          <Text style={styles.feature}>• Day-by-day peak week schedule</Text>
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