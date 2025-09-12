import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  Smartphone,
  Watch,
  Activity,
  Heart,
  Droplet,
  Battery,
  Wifi,
  Bluetooth,
  X,
  Plus,
  RefreshCw,
  Info,
  Scan
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  deviceIntegrationService,
  DeviceCapability,
  DeviceConnection,
  HealthMetric
} from '@/services/deviceIntegrationService';

export default function DevicesScreen() {
  const [connectedDevices, setConnectedDevices] = useState<DeviceConnection[]>([]);
  const [supportedDevices, setSupportedDevices] = useState<DeviceCapability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastMetrics, setLastMetrics] = useState<HealthMetric[]>([]);
  const [isAutoSync, setIsAutoSync] = useState<boolean>(false);
  const [btScanning, setBtScanning] = useState<boolean>(false);
  const [btAvailable, setBtAvailable] = useState<boolean>(false);
  const [btList, setBtList] = useState<DeviceCapability[]>([]);

  useEffect(() => {
    const init = async () => {
      await deviceIntegrationService.init();
      setIsAutoSync(deviceIntegrationService.isAutoSyncEnabled());
      setBtAvailable(deviceIntegrationService.isBluetoothAvailable());
      await loadDevices();
    };
    init();
    const handleSync = (metrics: HealthMetric[]) => {
      setLastMetrics(metrics);
    };
    deviceIntegrationService.addSyncListener(handleSync);
    return () => {
      deviceIntegrationService.removeSyncListener(handleSync);
    };
  }, []);

  const loadDevices = useCallback(async () => {
    try {
      await deviceIntegrationService.loadConnectedDevices();
      const connected = deviceIntegrationService.getConnectedDevices();
      const supported = deviceIntegrationService.getSupportedDevices();
      setConnectedDevices(connected);
      setSupportedDevices(supported);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleConnectDevice = useCallback(async (device: DeviceCapability) => {
    Alert.alert(
      'Connect Device',
      `Connect to ${device.brand} ${device.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: async () => {
            const deviceId = `${device.brand}_${device.model}_${Date.now()}`;
            const success = await deviceIntegrationService.connectDevice(deviceId, {
              name: `${device.brand} ${device.model}`,
              type: device.type,
              brand: device.brand,
              batteryLevel: 85 + Math.random() * 15
            });
            if (success) {
              await loadDevices();
              Alert.alert('Success', 'Device connected successfully');
            } else {
              Alert.alert('Error', 'Failed to connect device');
            }
          }
        }
      ]
    );
  }, [loadDevices]);

  const handleDisconnectDevice = useCallback(async (deviceId: string) => {
    Alert.alert(
      'Disconnect Device',
      'Are you sure you want to disconnect this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await deviceIntegrationService.disconnectDevice(deviceId);
            await loadDevices();
          }
        }
      ]
    );
  }, [loadDevices]);

  const handleSyncDevice = useCallback(async (deviceId: string) => {
    setIsSyncing(deviceId);
    try {
      const metrics = await deviceIntegrationService.syncDeviceData(deviceId);
      await loadDevices();
      Alert.alert(
        'Sync Complete',
        `Synced ${metrics.length} metrics from device`
      );
    } catch (error) {
      Alert.alert('Sync Failed', 'Failed to sync device data');
    } finally {
      setIsSyncing(null);
    }
  }, [loadDevices]);

  const handleToggleAutoSync = useCallback(async (value: boolean) => {
    setIsAutoSync(value);
    await deviceIntegrationService.setAutoSyncEnabled(value);
  }, []);

  const handleBtScan = useCallback(async () => {
    if (!btAvailable) return;
    setBtScanning(true);
    try {
      const list = await deviceIntegrationService.scanBluetoothDevices();
      setBtList(list);
    } catch (e) {
      Alert.alert('Bluetooth', 'Failed to scan for devices');
    } finally {
      setBtScanning(false);
    }
  }, [btAvailable]);

  const handleBtPair = useCallback(async (cap: DeviceCapability) => {
    const ok = await deviceIntegrationService.pairBluetoothDevice(cap);
    if (ok) {
      await loadDevices();
      Alert.alert('Bluetooth', 'Device paired and connected');
    } else {
      Alert.alert('Bluetooth', 'Pairing failed');
    }
  }, [loadDevices]);

  const getDeviceIcon = (type: DeviceCapability['type']) => {
    switch (type) {
      case 'watch':
        return <Watch size={24} color={colors.accent.primary} />;
      case 'scale':
        return <Activity size={24} color={colors.accent.primary} />;
      case 'fitness_tracker':
        return <Heart size={24} color={colors.accent.primary} />;
      case 'glucose_monitor':
        return <Droplet size={24} color={colors.accent.primary} />;
      case 'blood_pressure':
        return <Heart size={24} color={colors.accent.primary} />;
      default:
        return <Smartphone size={24} color={colors.accent.primary} />;
    }
  };

  const getConnectionIcon = (type: DeviceCapability['connectionType']) => {
    switch (type) {
      case 'bluetooth':
        return <Bluetooth size={16} color={colors.text.secondary} />;
      case 'wifi':
        return <Wifi size={16} color={colors.text.secondary} />;
      default:
        return <Wifi size={16} color={colors.text.secondary} />;
    }
  };

  const renderConnectedDevice = (device: DeviceConnection) => (
    <Card key={device.id} style={styles.deviceCard} testID={`connected-device-${device.id}`}>
      <View style={styles.deviceHeader}>
        {getDeviceIcon(device.type)}
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceBrand}>{device.brand}</Text>
        </View>
        <Badge
          variant={device.isConnected ? 'success' : 'default'}
          style={styles.statusBadge}
        >
          {device.isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </View>

      {device.batteryLevel && (
        <View style={styles.batteryContainer}>
          <Battery size={16} color={colors.text.secondary} />
          <Text style={styles.batteryText}>{Math.round(device.batteryLevel)}%</Text>
        </View>
      )}

      {device.lastSync && (
        <Text style={styles.lastSync}>
          Last synced: {new Date(device.lastSync).toLocaleString()}
        </Text>
      )}

      <View style={styles.deviceActions}>
        <TouchableOpacity
          testID={`sync-${device.id}`}
          style={[styles.actionButton, styles.syncButton]}
          onPress={() => handleSyncDevice(device.id)}
          disabled={isSyncing === device.id}
        >
          {isSyncing === device.id ? (
            <ActivityIndicator size="small" color={colors.accent.primary} />
          ) : (
            <RefreshCw size={20} color={colors.accent.primary} />
          )}
          <Text style={styles.actionButtonText}>Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID={`disconnect-${device.id}`}
          style={[styles.actionButton, styles.disconnectButton]}
          onPress={() => handleDisconnectDevice(device.id)}
        >
          <X size={20} color={colors.status.error} />
          <Text style={[styles.actionButtonText, { color: colors.status.error }]}>
            Disconnect
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderAvailableDevice = (device: DeviceCapability) => {
    const isConnected = connectedDevices.some(
      d => d.brand === device.brand && d.name.includes(device.model)
    );

    if (isConnected) return null;

    return (
      <Card key={`${device.brand}_${device.model}`} style={styles.availableCard} testID={`available-${device.brand}-${device.model}`}>
        <View style={styles.deviceHeader}>
          {getDeviceIcon(device.type)}
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.model}</Text>
            <Text style={styles.deviceBrand}>{device.brand}</Text>
          </View>
          {getConnectionIcon(device.connectionType)}
        </View>

        <View style={styles.capabilitiesContainer}>
          {device.capabilities.slice(0, 3).map((capability, index) => (
            <Badge key={index} variant="secondary" style={styles.capabilityBadge}>
              {capability.replace(/_/g, ' ')}
            </Badge>
          ))}
          {device.capabilities.length > 3 && (
            <Text style={styles.moreCapabilities}>
              +{device.capabilities.length - 3} more
            </Text>
          )}
        </View>

        <TouchableOpacity
          testID={`connect-${device.brand}-${device.model}`}
          style={styles.connectButton}
          onPress={() => handleConnectDevice(device)}
        >
          <Plus size={16} color={colors.background.primary} />
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  const compatibilityInfo = deviceIntegrationService.getDeviceCompatibilityInfo();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Connected Devices' }} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadDevices();
            }}
            tintColor={colors.accent.primary}
          />
        }
      >
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color={colors.accent.primary} />
            <Text style={styles.infoTitle}>Device Compatibility</Text>
          </View>
          <Text style={styles.infoText}>
            Platform: {Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
          </Text>
          <Text style={styles.infoText}>
            Supported Devices: {compatibilityInfo.totalSupported}
          </Text>
          <Text style={styles.infoText}>
            Device Types: {compatibilityInfo.supportedTypes.join(', ')}
          </Text>
          <View style={styles.autoSyncRow}>
            <Text style={styles.autoSyncLabel}>Auto Sync</Text>
            <Switch
              testID="toggle-auto-sync"
              value={isAutoSync}
              onValueChange={handleToggleAutoSync}
              trackColor={{ true: colors.accent.primary + '80', false: colors.border.light }}
              thumbColor={isAutoSync ? colors.accent.primary : colors.background.primary}
            />
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          {connectedDevices.length > 0 ? (
            connectedDevices.map(renderConnectedDevice)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No devices connected</Text>
              <Text style={styles.emptySubtext}>
                Connect your fitness devices to sync health data
              </Text>
            </Card>
          )}
        </View>

        {lastMetrics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Metrics</Text>
            <Card style={styles.metricsCard}>
              {lastMetrics.map((metric, index) => (
                <View key={index} style={styles.metricRow}>
                  <Text style={styles.metricType}>
                    {metric.type.replace(/_/g, ' ')}
                  </Text>
                  <Text style={styles.metricValue}>
                    {metric.value.toFixed(1)} {metric.unit}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bluetooth</Text>
          <Card style={styles.btCard}>
            <View style={styles.btHeader}>
              <Bluetooth size={18} color={colors.text.secondary} />
              <Text style={styles.btLabel}>{btAvailable ? 'Available' : 'Unavailable on this platform'}</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                testID="bt-scan"
                onPress={handleBtScan}
                disabled={!btAvailable || btScanning}
                style={[styles.btScanButton, (!btAvailable || btScanning) && styles.btScanDisabled]}
              >
                {btScanning ? (
                  <ActivityIndicator size="small" color={colors.background.primary} />
                ) : (
                  <Scan size={16} color={colors.background.primary} />
                )}
                <Text style={styles.btScanText}>{btScanning ? 'Scanning...' : 'Scan'}</Text>
              </TouchableOpacity>
            </View>
            {btList.length > 0 && (
              <View style={styles.btList}>
                {btList.map((cap, idx) => (
                  <View key={`${cap.brand}-${cap.model}-${idx}`} style={styles.btRow}>
                    <Text style={styles.btDeviceText}>{cap.brand} {cap.model}</Text>
                    <TouchableOpacity testID={`bt-pair-${cap.brand}-${cap.model}`} onPress={() => handleBtPair(cap)} style={styles.btPairBtn}>
                      <Text style={styles.btPairText}>Pair</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Devices</Text>
          {supportedDevices.map(renderAvailableDevice)}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoCard: {
    margin: 16,
    padding: 16,
  },
  autoSyncRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoSyncLabel: {
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  deviceCard: {
    marginBottom: 12,
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  deviceBrand: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  batteryText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  lastSync: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  deviceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  syncButton: {
    backgroundColor: colors.accent.primary + '20',
  },
  disconnectButton: {
    backgroundColor: colors.status.error + '20',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.accent.primary,
  },
  availableCard: {
    marginBottom: 12,
    padding: 16,
  },
  btCard: {
    padding: 12,
    gap: 10,
  },
  btHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 6,
  },
  btScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btScanDisabled: {
    opacity: 0.5,
  },
  btScanText: {
    color: colors.background.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  btList: {
    gap: 8,
  },
  btRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  btDeviceText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  btPairBtn: {
    backgroundColor: colors.accent.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btPairText: {
    color: colors.accent.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  capabilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 12,
  },
  capabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moreCapabilities: {
    fontSize: 12,
    color: colors.text.secondary,
    alignSelf: 'center',
    marginLeft: 4,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background.primary,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  metricsCard: {
    padding: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  metricType: {
    fontSize: 14,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  bottomPadding: {
    height: 32,
  },
});