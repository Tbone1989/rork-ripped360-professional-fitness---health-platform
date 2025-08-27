import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Flashlight, FlashlightOff, RotateCcw, TestTube } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/services/api';

const Scanner = () => {
  const router = useRouter();
  const [scanned, setScanned] = useState<boolean>(false);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const handleRequestPermission = async () => {
    try {
      await requestPermission();
    } catch (e) {
      console.error('Camera permission request failed', e);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const startTime = Date.now();
      const foodData = await apiService.getFoodByBarcode(data);
      const apiDuration = Date.now() - startTime;

      if (foodData) {
        Alert.alert(
          'Food Found! ✓',
          `${foodData.name}${foodData.brand ? ` by ${foodData.brand}` : ''}\n${foodData.calories} calories per ${foodData.servingSize}\n\nAPI Response: ${apiDuration}ms`,
          [
            { text: 'Scan Another', onPress: () => setScanned(false), style: 'cancel' },
            { text: 'Add to Meal', onPress: () => router.push({ pathname: '/meals/add', params: { foodData: JSON.stringify(foodData) } }) },
          ]
        );
      } else {
        Alert.alert(
          'Food Not Found',
          `This barcode was not found in our database. Would you like to add it manually?\n\nAPI Response: ${apiDuration}ms`,
          [
            { text: 'Scan Another', onPress: () => setScanned(false), style: 'cancel' },
            { text: 'Add Manually', onPress: () => router.push({ pathname: '/meals/add', params: { barcode: data } }) },
          ]
        );
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        'API Error ✗',
        `Unable to process barcode: ${errorMessage}\n\nPlease try again or add food manually.`,
        [
          { text: 'Scan Another', onPress: () => setScanned(false), style: 'cancel' },
          { text: 'Add Manually', onPress: () => router.push('/meals/add') },
        ]
      );
    }
  };

  const toggleFlash = () => setFlashEnabled(!flashEnabled);
  const toggleCamera = () => setFacing(current => (current === 'back' ? 'front' : 'back'));

  if (!permission) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Scan Food Barcode' }} />
        <View style={styles.permissionContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Scan Food Barcode' }} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>We need access to your camera to scan food barcodes</Text>
          <Button title="Grant Permission" onPress={handleRequestPermission} style={styles.permissionButton} testID="grant-permission" />
          <Button title="Enter Manually" variant="outline" onPress={() => router.push('/meals/add')} style={[styles.permissionButton, { marginTop: 12 }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Scan Food Barcode',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} testID="close-scanner">
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128', 'code39'] }}
        {...(flashEnabled ? { enableTorch: true } : {})}
        testID="camera-view"
      >
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash} testID="toggle-flash">
              {flashEnabled ? (
                <FlashlightOff size={24} color={colors.text.primary} />
              ) : (
                <Flashlight size={24} color={colors.text.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={toggleCamera} testID="toggle-camera">
              <RotateCcw size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>Scan Food Barcode</Text>
            <Text style={styles.instructionText}>Position the barcode within the frame to scan</Text>
          </View>

          <View style={styles.bottomControls}>
            <Button title="Enter Manually" variant="outline" onPress={() => router.push('/meals/add')} style={styles.manualButton} testID="enter-manually" />
            <Button title="Test Nutrition API" variant="outline" onPress={() => router.push('/test-apis')} style={[styles.manualButton, { marginTop: 8 }]} icon={<TestTube size={16} color={colors.text.primary} />} testID="test-nutrition-api" />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default function MealScanScreen() {
  return <Scanner />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.accent.primary,
    borderWidth: 3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: -15,
    left: -15,
  },
  scanCornerTopRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    top: -15,
    right: -15,
    left: 'auto',
  },
  scanCornerBottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    bottom: -15,
    top: 'auto',
    left: -15,
  },
  scanCornerBottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: -15,
    right: -15,
    top: 'auto',
    left: 'auto',
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomControls: {
    padding: 20,
    paddingBottom: 40,
  },
  manualButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: colors.text.primary,
  },
});