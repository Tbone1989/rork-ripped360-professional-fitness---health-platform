import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Sparkles, Clock, ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';

function getParam(param: string | string[] | undefined, fallback: string): string {
  if (Array.isArray(param)) return param[0] ?? fallback;
  return param ?? fallback;
}

export default function ComingSoonScreen() {
  const params = useLocalSearchParams();
  const title = useMemo(() => getParam(params.title, 'Coming Soon'), [params.title]);
  const feature = useMemo(() => getParam(params.feature, 'This feature'), [params.feature]);

  return (
    <View style={styles.container} testID="coming-soon-screen">
      <Stack.Screen 
        options={{ 
          title,
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Sparkles size={80} color={colors.accent.secondary} />
        </View>

        <Text style={styles.title} testID="coming-soon-title">Coming Soon</Text>
        <Text style={styles.subtitle} testID="coming-soon-subtitle">{feature}</Text>

        <View style={styles.card}>
          <Clock size={24} color={colors.accent.primary} />
          <Text style={styles.cardText}>
            {feature} is under development. We're crafting an awesome experience. Check back soon!
          </Text>
        </View>

        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          variant="secondary"
          icon={<ArrowLeft size={20} color={colors.text.primary} />}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.primary,
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
    fontWeight: 'bold' as const,
    color: colors.accent.secondary,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: { 
    fontSize: 18, 
    color: colors.text.secondary, 
    textAlign: 'center' as const,
    marginBottom: 30,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
  button: {
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'stretch',
  },
});
