import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Flashlight, FlashlightOff, RotateCcw, Pill, Syringe } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { TabBar } from '@/components/ui/TabBar';
import { trpcClient } from '@/lib/trpc';

// Helper function to detect if we're on a mobile browser
const isMobileBrowser = () => {
  if (Platform.OS !== 'web') return false;
  
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};

const scanTabs = [
  { key: 'supplements', label: 'Supplements' },
  { key: 'medicines', label: 'Medicines' },
  { key: 'peptides', label: 'Peptides' },
];

// Web fallback component (only for desktop browsers)
const WebScanner = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('supplements');
  
  const handleManualEntry = () => {
    Alert.alert(
      'Manual Entry',
      'Browse products manually',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Browse Shop', onPress: () => router.push('/shop') }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Scan Product Barcode' }} />
      <View style={styles.tabContainer}>
        <TabBar
          tabs={scanTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabBar}
        />
      </View>
      <View style={styles.webContainer}>
        <Text style={styles.webTitle}>Camera Scanner</Text>
        <Text style={styles.webSubtitle}>Camera scanning requires a mobile device</Text>
        <Text style={styles.webHint}>Please use your phone's browser or the mobile app to scan barcodes</Text>
        <Button title="Browse Products" onPress={handleManualEntry} />
      </View>
    </View>
  );
};

// Mobile camera component
const MobileScanner = () => {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [activeTab, setActiveTab] = useState('supplements');
  const [CameraView, setCameraView] = useState<any>(null);
  const [cameraPermission, setCameraPermission] = useState<any>(null);
  const [requestCameraPermission, setRequestCameraPermission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load camera for native apps and mobile browsers
    const loadCamera = async () => {
      try {
        const camera = await import('expo-camera');
        setCameraView(() => camera.CameraView);
        
        // Get initial permission status
        const { status } = await camera.Camera.getCameraPermissionsAsync();
        setCameraPermission({ granted: status === 'granted' });
        
        // Set up request permission function
        setRequestCameraPermission(() => async () => {
          const { status: newStatus } = await camera.Camera.requestCameraPermissionsAsync();
          const newPermission = { granted: newStatus === 'granted' };
          setCameraPermission(newPermission);
          return newPermission;
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load camera:', error);
        setIsLoading(false);
      }
    };
    
    loadCamera();
  }, []);

  const handleRequestPermission = async () => {
    if (requestCameraPermission) {
      await requestCameraPermission();
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);

    try {
      // Try to get supplement data from API
      const supplementData = await trpcClient.health.supplements.barcode({ barcode: data });
      
      if (supplementData) {
        Alert.alert(
          `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Found!`,
          `${supplementData.name} by ${supplementData.brand}\n${supplementData.category}`,
          [
            {
              text: 'Scan Another',
              onPress: () => setScanned(false),
              style: 'cancel'
            },
            {
              text: 'View Details',
              onPress: () => {
                if (activeTab === 'supplements') {
                  router.push({
                    pathname: `/supplements/[id]`,
                    params: { 
                      id: supplementData.id,
                      productData: JSON.stringify(supplementData)
                    }
                  });
                } else if (activeTab === 'medicines') {
                  router.push({
                    pathname: `/medicines/[id]`,
                    params: { 
                      id: supplementData.id,
                      productData: JSON.stringify(supplementData)
                    }
                  });
                } else {
                  // For peptides, use supplements view for now
                  router.push({
                    pathname: `/supplements/[id]`,
                    params: { 
                      id: supplementData.id,
                      productData: JSON.stringify(supplementData),
                      type: 'peptide'
                    }
                  });
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Product Not Found',
          'This barcode was not found in our database. Would you like to browse our products?',
          [
            {
              text: 'Scan Another',
              onPress: () => setScanned(false),
              style: 'cancel'
            },
            {
              text: 'Browse Products',
              onPress: () => {
                if (activeTab === 'supplements') {
                  router.push('/medical');
                } else if (activeTab === 'medicines') {
                  router.push('/medicines');
                } else {
                  router.push('/medical');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      Alert.alert(
        'Scan Error',
        'Unable to process barcode. Please try again or browse products manually.',
        [
          {
            text: 'Scan Another',
            onPress: () => setScanned(false),
            style: 'cancel'
          },
          {
            text: 'Browse Products',
            onPress: () => {
              if (activeTab === 'supplements') {
                router.push('/medical');
              } else if (activeTab === 'medicines') {
                router.push('/medicines');
              } else {
                router.push('/medical');
              }
            }
          }
        ]
      );
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const toggleCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const getIcon = () => {
    switch (activeTab) {
      case 'supplements':
        return <Pill size={20} color={colors.accent.primary} />;
      case 'medicines':
        return <Pill size={20} color={colors.status.error} />;
      case 'peptides':
        return <Syringe size={20} color={colors.status.warning} />;
      default:
        return <Pill size={20} color={colors.accent.primary} />;
    }
  };

  if (isLoading || !CameraView) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Scan Product Barcode' }} />
        <View style={styles.permissionContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!cameraPermission || !cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Scan Product Barcode' }} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan product barcodes
          </Text>
          <Button
            title="Grant Permission"
            onPress={handleRequestPermission}
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Scan Product Barcode',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      {/* Tab selector */}
      <View style={styles.tabContainer}>
        <TabBar
          tabs={scanTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabBar}
        />
      </View>
      
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128', 'code39'],
        }}
        enableTorch={flashEnabled}
      >
        <View style={styles.overlay}>
          {/* Top controls */}
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              {flashEnabled ? (
                <FlashlightOff size={24} color={colors.text.primary} />
              ) : (
                <Flashlight size={24} color={colors.text.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCamera}
            >
              <RotateCcw size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Scanning frame */}
          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <View style={styles.instructionHeader}>
              {getIcon()}
              <Text style={styles.instructionTitle}>
                Scan {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Barcode
              </Text>
            </View>
            <Text style={styles.instructionText}>
              Position the barcode within the frame to scan
            </Text>
          </View>

          {/* Manual entry option */}
          <View style={styles.bottomControls}>
            <Button
              title="Browse Products"
              variant="outline"
              onPress={() => {
                if (activeTab === 'supplements') {
                  router.push('/medical');
                } else if (activeTab === 'medicines') {
                  router.push('/medicines');
                } else {
                  router.push('/medical');
                }
              }}
              style={styles.manualButton}
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default function MedicalScanScreen() {
  // Show camera scanner on native apps and mobile browsers
  // Only show web fallback on desktop browsers
  const shouldUseCamera = Platform.OS !== 'web' || isMobileBrowser();
  return shouldUseCamera ? <MobileScanner /> : <WebScanner />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  webSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  webHint: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  tabContainer: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tabBar: {
    marginBottom: 0,
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
    paddingTop: 20,
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
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
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