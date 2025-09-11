import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Shield, AlertTriangle, X, CheckCircle, FileText, Scale, Stethoscope, Headphones } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from './Button';
import { Card } from './Card';

type DisclaimerType = 'medical' | 'doctor' | 'audio' | 'coach' | 'product_selling' | 'general';

interface LegalDisclaimerProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: DisclaimerType;
  title?: string;
  testID?: string;
}

export function LegalDisclaimer({ visible, onClose, onAccept, type, title, testID }: LegalDisclaimerProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<boolean>(false);

  const disclaimerContent = useMemo(() => {
    switch (type) {
      case 'doctor':
        return {
          title: 'Clinical Use & Telehealth Disclaimer',
          icon: Stethoscope,
          color: colors.status.error,
          sections: [
            {
              title: 'Licensed Clinical Use Only',
              content: 'Clinical features are intended for use by licensed healthcare professionals acting within their scope of practice and in compliance with local laws and regulations.'
            },
            {
              title: 'Not a Substitute for Examination',
              content: 'Digital assessments, AI outputs, and uploaded data are adjunct tools and do not replace a clinician’s independent judgement, physical examination, or diagnostic testing.'
            },
            {
              title: 'Telehealth Compliance',
              content: 'You are responsible for obtaining patient consent, documenting encounters, and following telemedicine rules for your jurisdiction, including licensure and cross‑state practice limitations.'
            },
            {
              title: 'PHI Handling (HIPAA/GDPR)',
              content: 'Store only the minimum necessary patient data. Do not upload sensitive information unless you have consent. We provide encryption-in-transit and at-rest; however, you are responsible for proper access control to your device and account.'
            },
            {
              title: 'Emergency Care',
              content: 'This platform is not for emergencies. Direct patients to call local emergency services (e.g., 911) for urgent symptoms.'
            },
            {
              title: 'Documentation & EHR',
              content: 'Export or copy summaries into your official medical record as required. This app is not an EHR and does not replace mandated clinical documentation systems.'
            }
          ]
        };
      case 'audio':
        return {
          title: 'Audio Safety & Recording Consent',
          icon: Headphones,
          color: colors.accent.primary,
          sections: [
            {
              title: 'Safe Listening',
              content: 'Keep volume at a safe level. Be aware of your surroundings when using headphones during workouts. Do not use audio features where they could create safety hazards.'
            },
            {
              title: 'Background Audio',
              content: 'Music from third‑party apps (e.g., Spotify, Apple Music) may continue while using this app. Manage playback and volume from your device controls.'
            },
            {
              title: 'Recording Consent',
              content: 'If you choose to record voice notes or sessions, obtain consent from all participants. Recording availability varies by platform, and recordings may be stored on your device or cloud according to your settings.'
            },
            {
              title: 'Privacy',
              content: 'Do not capture sensitive information in audio unless necessary and lawful. Review files before sharing. You are responsible for compliance with local privacy and wiretapping laws.'
            }
          ]
        };
      case 'medical':
        return {
          title: 'Medical Information Disclaimer',
          icon: Shield,
          color: colors.status.error,
          sections: [
            {
              title: 'Not Medical Advice',
              content: 'Information and AI outputs are for educational purposes and are not medical advice, diagnosis, or treatment.'
            },
            {
              title: 'Consult Healthcare Providers',
              content: 'Always consult a qualified professional before making medical decisions. Do not ignore professional advice because of content in this app.'
            },
            {
              title: 'Data Security & Privacy',
              content: 'We implement encryption and access controls; however, no system is perfect. Limit sensitive uploads and review sharing settings.'
            },
            {
              title: 'Accuracy Limitations',
              content: 'AI may be inaccurate or incomplete. Verify results with licensed professionals.'
            },
            {
              title: 'Emergency Situations',
              content: 'For emergencies, call local emergency services immediately.'
            }
          ]
        };
      case 'coach':
        return {
          title: 'Coach Services Agreement',
          icon: Scale,
          color: colors.accent.primary,
          sections: [
            {
              title: 'Professional Standards',
              content: 'Coaches must maintain current certifications. Users should verify credentials.'
            },
            {
              title: 'Service Limitations',
              content: 'Coaching is not medical care and does not diagnose or prescribe.'
            },
            {
              title: 'Communication Guidelines',
              content: 'All communications must remain professional and compliant with community standards.'
            },
            {
              title: 'Results Disclaimer',
              content: 'Individual outcomes vary and are not guaranteed.'
            }
          ]
        };
      case 'product_selling':
        return {
          title: 'Product Selling Agreement',
          icon: FileText,
          color: colors.status.warning,
          sections: [
            {
              title: 'Approval Required',
              content: 'Selling requires prior approval and ongoing compliance.'
            },
            {
              title: 'Prohibited Products',
              content: 'No prescription drugs, illegal substances, or items making illegal claims.'
            },
            {
              title: 'Liability & Insurance',
              content: 'Sellers must maintain appropriate licenses and insurance.'
            }
          ]
        };
      default:
        return {
          title: 'Terms of Service',
          icon: FileText,
          color: colors.text.secondary,
          sections: [
            {
              title: 'Acceptance of Terms',
              content: 'By using this application, you agree to our Terms and Privacy Policy.'
            },
            {
              title: 'User Responsibilities',
              content: 'Keep your account secure and follow community guidelines.'
            },
            {
              title: 'Privacy Protection',
              content: 'We aim to protect your data; review your settings before sharing.'
            }
          ]
        };
    }
  }, [type]);

  const IconComponent = disclaimerContent.icon;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom = layoutMeasurement?.height + contentOffset?.y >= (contentSize?.height ?? 0) - 20;
    setHasScrolledToBottom(!!isScrolledToBottom);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      transparent={false}
      testID={testID ?? 'legalDisclaimerModal'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${disclaimerContent.color}20` }]}>
            <IconComponent size={32} color={disclaimerContent.color} />
          </View>
          <Text style={styles.title}>{title || disclaimerContent.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="legalDisclaimerCloseBtn">
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator
          onScroll={handleScroll}
          scrollEventThrottle={16}
          testID="legalDisclaimerScrollView"
        >
          <View style={styles.warningBox}>
            <AlertTriangle size={20} color={colors.status.warning} />
            <Text style={styles.warningText}>Important Legal Notice</Text>
          </View>
          
          <Text style={styles.introText}>
            By proceeding, you acknowledge and agree to the following terms and conditions:
          </Text>
          
          <View style={styles.sectionsContainer}>
            {disclaimerContent.sections.map((section: { title: string; content: string }, index: number) => (
              <Card key={`disclaimer-section-${index}`} style={styles.sectionCard} testID={`disclaimerSection-${index}`}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </Card>
            ))}
          </View>
          
          <View style={styles.footerNotice}>
            <Text style={styles.footerText}>
              By proceeding, you confirm that you understand these terms and agree to use this service responsibly. This agreement governs your use of our platform.
            </Text>
          </View>
          
          <View style={styles.scrollIndicator}>
            {!hasScrolledToBottom && (
              <Text style={styles.scrollText}>Please scroll to read all terms</Text>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="I Understand & Agree"
            onPress={onAccept}
            disabled={!hasScrolledToBottom}
            style={[styles.acceptButton, !hasScrolledToBottom && styles.disabledButton]}
            testID="legalDisclaimerAcceptBtn"
            icon={<CheckCircle size={18} color={hasScrolledToBottom ? colors.text.primary : colors.text.tertiary} />}
          />
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={styles.cancelButton}
            testID="legalDisclaimerCancelBtn"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    position: 'relative',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text.primary,
    textAlign: 'center' as const,
  },
  closeButton: {
    position: 'absolute' as const,
    top: 24,
    right: 24,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  warningBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: `${colors.status.warning}15`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.status.warning,
  },
  introText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center' as const,
  },
  sectionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  sectionCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footerNotice: {
    backgroundColor: colors.background.secondary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
  },
  scrollIndicator: {
    alignItems: 'center' as const,
    paddingVertical: 16,
  },
  scrollText: {
    fontSize: 12,
    color: colors.status.warning,
    fontWeight: '600' as const,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: 12,
  },
  acceptButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButton: {
    width: '100%',
  },
});