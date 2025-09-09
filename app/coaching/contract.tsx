import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, FileText, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { trpc } from '@/lib/trpc';

interface SignatureData {
  clientName: string;
  clientSignature: string;
  signedDate: string;
  agreedToTerms: boolean;
}

export default function CoachingContract() {
  const router = useRouter();
  const { coachId, coachName } = useLocalSearchParams();
  const [signatureData, setSignatureData] = useState<SignatureData>({
    clientName: '',
    clientSignature: '',
    signedDate: new Date().toLocaleDateString(),
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!signatureData.clientName || !signatureData.clientSignature) {
      Alert.alert('Missing Information', 'Please provide your full name and signature.');
      return;
    }

    if (!signatureData.agreedToTerms) {
      Alert.alert('Agreement Required', 'You must agree to the terms to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would submit the contract to your backend
      // await trpc.coaching.submitContract.mutate({
      //   coachId: coachId as string,
      //   ...signatureData,
      // });

      Alert.alert(
        'Contract Signed',
        'Your coaching agreement has been successfully signed and submitted.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit contract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <FileText size={32} color={colors.primary} />
            <Text style={styles.title}>Coaching Services Agreement</Text>
            <Text style={styles.subtitle}>Please review and sign the agreement below</Text>
          </View>

          <View style={styles.contractContainer}>
            <Text style={styles.contractDate}>
              Date: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            <Text style={styles.parties}>
              <Text style={styles.bold}>Coach:</Text> {coachName || 'Coach Name'}
              {"\n"}
              <Text style={styles.bold}>Client:</Text> To be filled by client
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Services Provided</Text>
              <Text style={styles.sectionContent}>
                The Coach agrees to provide online nutritional coaching services to the Client. These services are designed to assist the Client in developing healthier eating habits, achieving personal transformation goals, and improving overall well-being. The services specifically include:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Online Nutritional Coaching: Guidance and support focused on developing sustainable healthy eating habits.</Text>
                <Text style={styles.bulletItem}>• Transformation Plans: Development of personalized plans aimed at achieving the Client's specific health and fitness transformation objectives.</Text>
                <Text style={styles.bulletItem}>• Meal Plans: Creation of individualized meal plans tailored to the Client's dietary needs, preferences, and goals.</Text>
                <Text style={styles.bulletItem}>• Exercise Routines: Provision of exercise routines designed for the individual Client. It is explicitly understood that the Coach is not a physical trainer, and these routines are for guidance only.</Text>
                <Text style={styles.bulletItem}>• Check-ins: A minimum of two (2) online check-ins per month. Additional check-ins may be subject to an upcharge.</Text>
                <Text style={styles.bulletItem}>• Supplementation Guidance: Discussion and guidance on supplements, Performance Enhancing Drugs (PEDs), peptides, and appropriate dosages for informational purposes only.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Pricing and Payment Terms</Text>
              <Text style={styles.sectionContent}>
                The standard coaching fee is $600.00 USD for the personalized meal plan, individualized exercise routine, and the two monthly check-ins. This fee is subject to variation based on the Client's specific needs and the scope of services agreed upon. All payments are due upfront and in full before any services commence.
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Additional Services: Any in-person physical training sessions will be subject to additional costs per session.</Text>
                <Text style={styles.bulletItem}>• Consultations: Initial consultations are provided free of charge.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Coaching Duration</Text>
              <Text style={styles.sectionContent}>
                The duration of the coaching engagement will vary depending on the Client's individual goals and needs, as discussed and agreed upon by both Parties. Common durations include three (3) months, six (6) months, one (1) year, or continuous engagement.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Cancellation and Rescheduling Policy</Text>
              <Text style={styles.sectionContent}>
                Due to the Coach's commitment to other clients and scheduling demands:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Client Cancellations: If the Client cancels a scheduled check-in or session, they will not be entitled to reschedule that specific session.</Text>
                <Text style={styles.bulletItem}>• Emergency Rescheduling: In cases of genuine emergency, and at the sole discretion of the Coach, a check-in may be rescheduled.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Confidentiality</Text>
              <Text style={styles.sectionContent}>
                All information shared by the Client with the Coach, and vice versa, will be treated as strictly confidential. This includes personal details, health information, progress, and any discussions.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Disclaimers and Acknowledgments</Text>
              <Text style={styles.sectionContent}>
                By entering into this Agreement, the Client acknowledges and agrees to the following:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Not Medical Advice: The coaching services are for educational and motivational purposes only and are not a substitute for professional medical advice.</Text>
                <Text style={styles.bulletItem}>• Individual Results May Vary: Results are not guaranteed and will vary based on individual effort and other factors.</Text>
                <Text style={styles.bulletItem}>• Exercise at Own Risk: The Client assumes all risk of injury or illness arising from participation in any exercise program.</Text>
                <Text style={styles.bulletItem}>• Supplementation Guidance: Discussions regarding supplements are for informational purposes only.</Text>
                <Text style={styles.bulletItem}>• No Refunds: All payments made for coaching services are non-refundable.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Termination</Text>
              <Text style={styles.sectionContent}>
                This Agreement may be terminated by either Party:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• By Client: The Client may terminate at any time. No refunds will be provided.</Text>
                <Text style={styles.bulletItem}>• By Coach: The Coach reserves the right to terminate upon written notice to the Client.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Governing Law</Text>
              <Text style={styles.sectionContent}>
                This Agreement shall be governed by and construed in accordance with the laws of the State of Florida.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Entire Agreement</Text>
              <Text style={styles.sectionContent}>
                This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior discussions, negotiations, and agreements.
              </Text>
            </View>
          </View>

          <View style={styles.signatureSection}>
            <Text style={styles.signatureTitle}>Electronic Signature</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Legal Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full legal name"
                value={signatureData.clientName}
                onChangeText={(text) =>
                  setSignatureData({ ...signatureData, clientName: text })
                }
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Electronic Signature *</Text>
              <TextInput
                style={styles.input}
                placeholder="Type your name as signature"
                value={signatureData.clientSignature}
                onChangeText={(text) =>
                  setSignatureData({ ...signatureData, clientSignature: text })
                }
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.signatureNote}>
                By typing your name above, you are providing an electronic signature
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() =>
                setSignatureData({
                  ...signatureData,
                  agreedToTerms: !signatureData.agreedToTerms,
                })
              }
            >
              <View style={[
                styles.checkbox,
                signatureData.agreedToTerms && styles.checkboxChecked
              ]}>
                {signatureData.agreedToTerms && (
                  <Check size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxText}>
                I have read, understood, and agree to be bound by the terms and conditions of this Agreement
              </Text>
            </TouchableOpacity>

            <View style={styles.warningBox}>
              <AlertCircle size={20} color={colors.warning} />
              <Text style={styles.warningText}>
                This is a legally binding agreement. Please read carefully before signing.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!signatureData.agreedToTerms || !signatureData.clientName || !signatureData.clientSignature) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!signatureData.agreedToTerms || !signatureData.clientName || !signatureData.clientSignature || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Sign Agreement'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  contractContainer: {
    padding: 20,
  },
  contractDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  parties: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 24,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletList: {
    marginTop: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 8,
  },
  signatureSection: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  signatureTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  signatureNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic' as const,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.white,
  },
});