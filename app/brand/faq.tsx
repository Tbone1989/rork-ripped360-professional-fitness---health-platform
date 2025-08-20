import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 'billing-1',
    question: 'How does monthly vs yearly billing work?',
    answer:
      'You can switch between monthly and yearly billing anytime. Yearly plans are billed upfront and include a discount equal to roughly two free months compared to paying monthly.',
  },
  {
    id: 'cancel-1',
    question: 'Can I cancel my membership?',
    answer:
      'Yes. You can cancel anytime from Profile > Subscription. Your plan will remain active until the end of the current billing period, and you will not be charged again.',
  },
  {
    id: 'refund-1',
    question: 'Do you offer refunds?',
    answer:
      'We do not offer partial-period refunds. If you believe you were charged in error, contact support and we will make it right.',
  },
  {
    id: 'features-1',
    question: 'What features are included in each tier?',
    answer:
      'All plans include workout library, nutrition tracking, progress tracking, community access, and mobile apps. Higher tiers add premium coaching features, exclusive challenges, and member-only gear perks.',
  },
  {
    id: 'coach-1',
    question: 'Will coaches see my data?',
    answer:
      'Only coaches you explicitly work with can view your shared data. Admins can audit globally for safety and policy compliance. You control what you share with coaches.',
  },
];

export default function BrandFAQScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    if (Platform.OS !== 'web') {
      try {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      } catch (e) {
        console.log('[FAQ] LayoutAnimation not available', e);
      }
    }
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const items = useMemo(() => faqs, []);

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="brand-faq-screen">
        <Stack.Screen options={{ title: 'Frequently Asked Questions' }} />
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <HelpCircle size={28} color={colors.accent.primary} />
            </View>
            <Text style={styles.title}>Membership FAQs</Text>
            <Text style={styles.subtitle}>Quick answers about billing, features, and privacy</Text>
          </View>

          <View style={styles.list}>
            {items.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <Card key={item.id} style={styles.card}>
                  <TouchableOpacity
                    testID={`faq-item-${item.id}`}
                    accessibilityRole="button"
                    onPress={() => toggle(item.id)}
                    style={styles.questionRow}
                  >
                    <Text style={styles.questionText}>{item.question}</Text>
                    {isOpen ? (
                      <ChevronUp size={18} color={colors.text.secondary} />
                    ) : (
                      <ChevronDown size={18} color={colors.text.secondary} />
                    )}
                  </TouchableOpacity>
                  {isOpen && (
                    <View style={styles.answerWrap}>
                      <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>

          <View style={styles.cta}>
            <Button
              testID="faq-contact-support"
              title="Contact Support"
              onPress={() => router.push('/profile/support')}
              style={styles.ctaButton}
            />
            <Button
              testID="faq-view-plans"
              title="View Membership Plans"
              variant="outline"
              onPress={() => router.push('/brand/membership')}
            />
          </View>
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary + '20',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  list: {
    gap: 12,
    marginTop: 16,
  },
  card: {
    padding: 16,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 12,
  },
  answerWrap: {
    marginTop: 10,
  },
  answerText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  cta: {
    marginTop: 24,
    gap: 12,
  },
  ctaButton: {
    paddingVertical: 14,
  },
});