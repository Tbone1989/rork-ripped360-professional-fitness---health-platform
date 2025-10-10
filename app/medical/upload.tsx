import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Upload, Camera, File, X, Check, Brain } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Image } from 'expo-image';
import { apiService } from '@/services/api';
import securityService from '@/services/securityService';
import { useDisclaimer } from '@/store/legalDisclaimerProvider';

export default function UploadBloodworkScreen() {
  const router = useRouter();
  const { ensureAccepted } = useDisclaimer();
  const [labName, setLabName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleUpload = async () => {
    if (!labName || !date) {
      Alert.alert('Missing Information', 'Please enter lab name and date');
      return;
    }
    
    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload at least one image');
      return;
    }
    
    const accepted = await ensureAccepted('medical');
    if (!accepted) {
      return;
    }
    
    // Log security event for medical data upload
    await securityService.logSecurityEvent({
      type: 'content_violation',
      details: {
        type: 'medical_upload',
        labName,
        imageCount: images.length,
        hasNotes: !!notes
      },
      severity: 'medium'
    });
    
    setUploading(true);
    setIsAnalyzing(true);
    
    try {
      // Prepare data for analysis
      const analysisData = {
        labName,
        date,
        notes,
        images: images.map((uri, index) => ({
          uri,
          name: `bloodwork_${index + 1}.jpg`,
          type: 'image/jpeg'
        }))
      };
      
      const analysisResults = await apiService.analyzeBloodwork(analysisData);
      
      Alert.alert(
        'Analysis Complete',
        `Your bloodwork has been analyzed. Found ${analysisResults.length} test results with recommendations.`,
        [
          {
            text: 'View Results',
            onPress: () => {
              // Navigate to results screen
              router.back();
              console.log('Analysis results:', analysisResults);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error analyzing bloodwork:', error);
      Alert.alert('Analysis Error', 'Unable to analyze bloodwork. Please try again.');
    } finally {
      setUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Upload size={24} color={colors.accent.primary} />
        </View>
        <Text style={styles.title}>Upload Bloodwork Results</Text>
        <Text style={styles.subtitle}>
          Upload images of your lab results for analysis and tracking
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Lab Name"
          placeholder="e.g., LabCorp, Quest Diagnostics"
          value={labName}
          onChangeText={setLabName}
        />
        
        <Input
          label="Date of Test"
          placeholder="MM/DD/YYYY"
          value={date}
          onChangeText={setDate}
        />
        
        <Input
          label="Notes (Optional)"
          placeholder="Any additional information about this test..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>Attachments:</Text>
        <Text style={styles.sectionSubtitle}>
          Upload clear images of your lab results
        </Text>
        
        <View style={styles.uploadButtons}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <File size={24} color={colors.text.primary} />
            <Text style={styles.uploadButtonText}>Choose File</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={takePhoto}
            activeOpacity={0.8}
          >
            <Camera size={24} color={colors.text.primary} />
            <Text style={styles.uploadButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        
        {images.length > 0 && (
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  contentFit="cover"
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Card>
          <View style={styles.infoCardContent}>
            <View style={styles.infoIconContainer}>
              <Check size={20} color={colors.status.success} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Automatic Analysis</Text>
              <Text style={styles.infoText}>
                Our AI will automatically extract and analyze your lab results, identifying trends and potential issues.
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
          onPress={handleUpload}
          loading={uploading}
          disabled={uploading}
          fullWidth
          icon={isAnalyzing ? 
            <ActivityIndicator size={18} color={colors.text.primary} /> :
            <Brain size={18} color={colors.text.primary} />
          }
        />
        {isAnalyzing && (
          <Text style={styles.analyzingText}>
            AI is analyzing your bloodwork results...
          </Text>
        )}
      </View>


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
    padding: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  formContainer: {
    padding: 16,
  },
  uploadSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    width: '48%',
    aspectRatio: 3/4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    padding: 16,
    paddingTop: 8,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 24,
  },
  analyzingText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    position: 'relative',
  },
  disclaimerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
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
  modalContent: {
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
  disclaimerText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 20,
  },
  disclaimerPoints: {
    marginBottom: 20,
  },
  disclaimerPoint: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  disclaimerFooter: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: 12,
  },
  agreeButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});