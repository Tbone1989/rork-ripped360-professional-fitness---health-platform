import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';


interface TutorialStep {
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconUri?: string;
  action?: () => void;
}

interface TutorialProps {
  visible: boolean;
  onClose: () => void;
  steps: TutorialStep[];
  tutorialKey: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const Tutorial: React.FC<TutorialProps> = ({
  visible,
  onClose,
  steps,
  tutorialKey,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(`tutorial_${tutorialKey}`);
        if (isMounted) setHasSeenTutorial(seen === 'true');
      } catch (error) {
        console.error('Failed to check tutorial status:', error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [tutorialKey]);

  const markTutorialAsSeen = async () => {
    try {
      await AsyncStorage.setItem(`tutorial_${tutorialKey}`, 'true');
      setHasSeenTutorial(true);
    } catch (error) {
      console.error('Failed to mark tutorial as seen:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    markTutorialAsSeen();
    onClose();
    setCurrentStep(0);
  };

  const handleSkip = () => {
    markTutorialAsSeen();
    onClose();
    setCurrentStep(0);
  };



  const currentStepData = steps[currentStep];



  return (
    <Modal
      visible={visible || (!hasSeenTutorial && steps.length > 0)}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.iconContainer} accessibilityRole="image" accessibilityLabel="App logo" testID="tutorial-logo-container">
              {currentStepData?.icon ? (
                currentStepData.icon
              ) : currentStepData?.iconUri ? (
                <Image
                  source={{ uri: currentStepData.iconUri }}
                  style={styles.logo}
                  accessibilityLabel="Tutorial logo"
                  testID="tutorial-logo"
                  onError={(e) => {
                    console.warn('Tutorial icon failed to load, falling back to app icon', e?.nativeEvent);
                  }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/icon.png')}
                  style={styles.logo}
                  accessibilityLabel="Ripped360 logo"
                  testID="tutorial-logo"
                />
              )}
            </View>

            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>

            <View style={styles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentStep && styles.progressDotActive,
                    index < currentStep && styles.progressDotCompleted,
                  ]}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              onPress={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={20} color={currentStep === 0 ? colors.text.disabled : colors.text.primary} />
              <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            <Text style={styles.stepIndicator}>
              {currentStep + 1} of {steps.length}
            </Text>

            <TouchableOpacity style={styles.navButton} onPress={handleNext}>
              <Text style={styles.navButtonText}>
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Text>
              {currentStep === steps.length - 1 ? (
                <CheckCircle size={20} color={colors.accent.primary} />
              ) : (
                <ChevronRight size={20} color={colors.text.primary} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Platform.select({
      web: Math.min(screenWidth * 0.9, 500),
      default: screenWidth * 0.9,
    }),
    maxHeight: '80%',
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.light,
  },
  progressDotActive: {
    backgroundColor: colors.accent.primary,
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: colors.status.success,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600' as const,
  },
  navButtonTextDisabled: {
    color: colors.text.disabled,
  },
  stepIndicator: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});