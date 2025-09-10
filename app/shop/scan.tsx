import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Flashlight, FlashlightOff, RotateCcw, ShoppingBag } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { trpcClient } from '@/lib/trpc';

// Web fallback component
const WebScanner = () => {
  const router = useRouter();
  
  const handleManualEntry = () => {
    Alert.alert(
      'Manual Entry',
      'Browse products manually',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Browse Shop', onPress: () => router.back() }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Scan Product Barcode' }} />
      <View style={styles.webContainer}>
        <Text style={styles.webTitle}>Camera Scanner</Text>
        <Text style={styles.webSubtitle}>Camera scanning is not available on web</Text>
        <Button title="Browse Shop" onPress={handleManualEntry} />
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
  const [CameraView, setCameraView] = useState<any>(null);
  const [cameraPermission, setCameraPermission] = useState<any>(null);
  const [requestCameraPermission, setRequestCameraPermission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import expo-camera only on mobile
    if (Platform.OS !== 'web') {
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
    }
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
      // Try to get nutrition data from API (for food products)
      const nutritionData = await trpcClient.nutrition.barcode.query({ barcode: data });
      
      if (nutritionData && nutritionData.name !== 'Unknown Item') {
        // Convert nutrition data to shop product format
        const productData = {
          id: data,
          name: nutritionData.name,
          brand: nutritionData.brand || 'Ripped City Inc.',
          category: 'nutrition',
          price: 0, // Price would come from shop API
          calories: nutritionData.calories,
          protein: nutritionData.protein,
          carbs: nutritionData.carbs,
          fat: nutritionData.fat,
          servingSize: nutritionData.servingSize,
          barcode: data,
          image: nutritionData.image || 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400'
        };

        Alert.alert(
          'Product Found!',
          `${productData.name}${productData.brand ? ` by ${productData.brand}` : ''}\n${productData.calories} cal | ${productData.protein}g protein`,
          [
            {
              text: 'Scan Another',
              onPress: () => setScanned(false),
              style: 'cancel'
            },
            {
              text: 'View Details',
              onPress: () => {
                router.push({
                  pathname: '/meals/[id]',
                  params: { 
                    id: data,
                    productData: JSON.stringify(productData)
                  }
                });
              }
            }
          ]
        );
      } else {
        // Fallback to mock product data for non-food items
        const mockProductData = {
          id: 'rci-001',
          name: 'Ripped City Performance Tee',
          brand: 'Ripped City Inc.',
          category: 'apparel',
          price: 29.99,
          originalPrice: 39.99,
          rating: 4.8,
          reviews: 124,
          inStock: true,
          description: 'Premium performance t-shirt designed for intense workouts',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Navy', 'Red'],
          barcode: data,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
        };

        Alert.alert(
          'Product Scanned',
          `Barcode: ${data}\nShowing sample product`,
          [
            {
              text: 'Scan Another',
              onPress: () => setScanned(false),
              style: 'cancel'
            },
            {
              text: 'View Product',
              onPress: () => {
                router.push({
                  pathname: '/shop/product/[id]',
                  params: { 
                    id: mockProductData.id,
                    productData: JSON.stringify(mockProductData)
                  }
                });
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
            text: 'Browse Shop',
            onPress: () => router.back()
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
      
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128', 'code39'],
        }}
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
              <ShoppingBag size={20} color={colors.accent.primary} />
              <Text style={styles.instructionTitle}>Scan Product Barcode</Text>
            </View>
            <Text style={styles.instructionText}>
              Position the barcode within the frame to find Ripped City products
            </Text>
          </View>

          {/* Manual entry option */}
          <View style={styles.bottomControls}>
            <Button
              title="Browse Shop"
              variant="outline"
              onPress={() => router.back()}
              style={styles.manualButton}
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default function ShopScanScreen() {
  return Platform.OS === 'web' ? <WebScanner /> : <MobileScanner />;
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
    marginBottom: 24,
    lineHeight: 22,
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