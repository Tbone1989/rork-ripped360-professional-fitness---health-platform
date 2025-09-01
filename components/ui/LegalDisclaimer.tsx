import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Shield, AlertTriangle, X, CheckCircle, FileText, Scale } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from './Button';
import { Card } from './Card';

interface LegalDisclaimerProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: 'medical' | 'coach' | 'product_selling' | 'general';
  title?: string;
}

export function LegalDisclaimer({ visible, onClose, onAccept, type, title }: LegalDisclaimerProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const getDisclaimerContent = () => {
    switch (type) {
      case 'medical':
        return {
          title: 'Medical Information Disclaimer',
          icon: Shield,
          color: colors.status.error,
          sections: [
            {
              title: 'Not Medical Advice',
              content: 'This application provides informational analysis only and does not constitute medical advice, diagnosis, or treatment recommendations. The AI analysis is for educational purposes and should not replace professional medical consultation.'
            },
            {
              title: 'Consult Healthcare Providers',
              content: 'Always consult with qualified healthcare professionals before making any medical decisions based on this analysis. Your doctor should be your primary source for medical advice and treatment decisions.'
            },
            {
              title: 'Data Security & Privacy',
              content: 'Your medical data is encrypted and stored securely in compliance with HIPAA regulations. We do not share your personal health information with third parties without your explicit consent.'
            },
            {
              title: 'Accuracy Limitations',
              content: 'AI analysis may contain errors or inaccuracies. This tool is meant to supplement, not replace, professional medical evaluation. Results should always be verified by healthcare professionals.'
            },
            {
              title: 'Emergency Situations',
              content: 'If you have urgent health concerns or medical emergencies, contact emergency services (911) or your healthcare provider immediately. Do not rely on this app for emergency medical situations.'
            },
            {
              title: 'Liability Limitation',
              content: 'Ripped360 and its affiliates are not liable for any health decisions made based on this analysis. Users assume full responsibility for their health decisions and outcomes.'
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
              content: 'All coaches on this platform are required to maintain current certifications and undergo background checks. However, users should verify credentials independently.'
            },
            {
              title: 'Service Limitations',
              content: 'Coaching services are for fitness and wellness guidance only. Coaches cannot provide medical advice, diagnose conditions, or prescribe treatments.'
            },
            {
              title: 'Monthly Fees',
              content: 'Coaches pay monthly fees to use this platform for their business. This fee structure helps maintain platform quality and security.'
            },
            {
              title: 'Communication Guidelines',
              content: 'All coach-client communications are monitored for safety and compliance. Inappropriate behavior will result in immediate account suspension.'
            },
            {
              title: 'Results Disclaimer',
              content: 'Individual results may vary. No guarantee is made regarding specific outcomes from coaching services. Success depends on individual effort and adherence to programs.'
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
              content: 'Selling products on this platform requires prior approval and payment of monthly fees. Unauthorized selling will result in account suspension.'
            },
            {
              title: 'Prohibited Products',
              content: 'Prescription medications, illegal substances, unregulated supplements, and products making medical claims are strictly prohibited.'
            },
            {
              title: 'Content Restrictions',
              content: 'Product descriptions cannot contain false claims, medical advice, or guaranteed results. All content is subject to review and approval.'
            },
            {
              title: 'Liability & Insurance',
              content: 'Sellers must maintain appropriate business licenses and liability insurance. Ripped360 is not responsible for product quality or customer disputes.'
            },
            {
              title: 'Fee Structure',
              content: 'Monthly fees apply for product selling privileges. Additional transaction fees may apply. Failure to pay fees will result in selling privileges being revoked.'
            },
            {
              title: 'Compliance Monitoring',
              content: 'All product listings are monitored for compliance. Violations may result in immediate removal and account penalties.'
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
              content: 'By using this application, you agree to comply with all terms and conditions outlined in our Terms of Service and Privacy Policy.'
            },
            {
              title: 'User Responsibilities',
              content: 'Users are responsible for maintaining account security, providing accurate information, and using the platform in accordance with community guidelines.'
            },
            {
              title: 'Content Guidelines',
              content: 'All user-generated content must comply with our community standards. Inappropriate content will be removed and may result in account suspension.'
            },
            {
              title: 'Privacy Protection',
              content: 'We are committed to protecting your privacy and personal information in accordance with applicable privacy laws and regulations.'
            }
          ]
        };
    }
  };

  const disclaimerContent = getDisclaimerContent();
  const IconComponent = disclaimerContent.icon;

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setHasScrolledToBottom(isScrolledToBottom);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${disclaimerContent.color}20` }]}>
            <IconComponent size={32} color={disclaimerContent.color} />
          </View>
          <Text style={styles.title}>{title || disclaimerContent.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.warningBox}>
            <AlertTriangle size={20} color={colors.status.warning} />
            <Text style={styles.warningText}>Important Legal Notice</Text>
          </View>
          
          <Text style={styles.introText}>
            By proceeding, you acknowledge and agree to the following terms and conditions:
          </Text>
          
          <View style={styles.sectionsContainer}>
            {disclaimerContent.sections.map((section, index) => (
              <Card key={index} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </Card>
            ))}
          </View>
          
          <View style={styles.footerNotice}>
            <Text style={styles.footerText}>
              By proceeding, you confirm that you understand these terms and agree to use this service 
              responsibly. This agreement is legally binding and governs your use of our platform.
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
            icon={<CheckCircle size={18} color={hasScrolledToBottom ? colors.text.primary : colors.text.tertiary} />}
          />
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={styles.cancelButton}
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
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.status.warning}15`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.warning,
  },
  introText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
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
    fontWeight: '600',
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
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scrollIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scrollText: {
    fontSize: 12,
    color: colors.status.warning,
    fontWeight: '600',
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