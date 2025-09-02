import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DeviceCapability {
  type: 'watch' | 'scale' | 'fitness_tracker' | 'glucose_monitor' | 'blood_pressure' | 'heart_rate';
  brand: string;
  model: string;
  capabilities: string[];
  isSupported: boolean;
  connectionType: 'bluetooth' | 'wifi' | 'api' | 'manual';
}

export interface HealthMetric {
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
  source: string;
  deviceId?: string;
}

export interface DeviceConnection {
  id: string;
  name: string;
  type: DeviceCapability['type'];
  brand: string;
  isConnected: boolean;
  lastSync: Date | null;
  batteryLevel?: number;
}

class DeviceIntegrationService {
  private connectedDevices: Map<string, DeviceConnection> = new Map();
  private syncListeners: Set<(metrics: HealthMetric[]) => void> = new Set();

  // Supported device configurations
  private supportedDevices: DeviceCapability[] = [
    // Smartwatches
    {
      type: 'watch',
      brand: 'Apple',
      model: 'Apple Watch',
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep', 'workouts', 'ecg', 'blood_oxygen'],
      isSupported: Platform.OS === 'ios',
      connectionType: 'api'
    },
    {
      type: 'watch',
      brand: 'Samsung',
      model: 'Galaxy Watch',
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep', 'workouts', 'blood_pressure'],
      isSupported: Platform.OS === 'android',
      connectionType: 'api'
    },
    {
      type: 'watch',
      brand: 'Garmin',
      model: 'Garmin Connect',
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep', 'workouts', 'vo2max', 'stress'],
      isSupported: true,
      connectionType: 'api'
    },
    {
      type: 'watch',
      brand: 'Fitbit',
      model: 'Fitbit Devices',
      capabilities: ['heart_rate', 'steps', 'calories', 'sleep', 'workouts', 'spo2'],
      isSupported: true,
      connectionType: 'api'
    },
    {
      type: 'watch',
      brand: 'Whoop',
      model: 'Whoop Strap',
      capabilities: ['heart_rate', 'hrv', 'sleep', 'recovery', 'strain'],
      isSupported: true,
      connectionType: 'api'
    },
    {
      type: 'watch',
      brand: 'Oura',
      model: 'Oura Ring',
      capabilities: ['heart_rate', 'hrv', 'sleep', 'temperature', 'readiness'],
      isSupported: true,
      connectionType: 'api'
    },

    // Body Metric Scales
    {
      type: 'scale',
      brand: 'Withings',
      model: 'Body+',
      capabilities: ['weight', 'body_fat', 'muscle_mass', 'bone_mass', 'water_percentage', 'bmi'],
      isSupported: true,
      connectionType: 'api'
    },
    {
      type: 'scale',
      brand: 'Renpho',
      model: 'Smart Scale',
      capabilities: ['weight', 'body_fat', 'muscle_mass', 'bone_mass', 'bmr', 'protein', 'visceral_fat'],
      isSupported: true,
      connectionType: 'bluetooth'
    },
    {
      type: 'scale',
      brand: 'Eufy',
      model: 'Smart Scale',
      capabilities: ['weight', 'body_fat', 'muscle_mass', 'bone_mass', 'water_percentage'],
      isSupported: true,
      connectionType: 'bluetooth'
    },
    {
      type: 'scale',
      brand: 'InBody',
      model: 'InBody Dial',
      capabilities: ['weight', 'body_fat', 'muscle_mass', 'visceral_fat', 'segmental_analysis'],
      isSupported: true,
      connectionType: 'api'
    },
    {
      type: 'scale',
      brand: 'Tanita',
      model: 'RD-545',
      capabilities: ['weight', 'body_fat', 'muscle_mass', 'muscle_quality', 'metabolic_age'],
      isSupported: true,
      connectionType: 'bluetooth'
    },

    // Fitness Trackers
    {
      type: 'fitness_tracker',
      brand: 'Polar',
      model: 'Polar H10',
      capabilities: ['heart_rate', 'hrv', 'training_load'],
      isSupported: true,
      connectionType: 'bluetooth'
    },
    {
      type: 'fitness_tracker',
      brand: 'MyZone',
      model: 'MZ-3',
      capabilities: ['heart_rate', 'effort_points', 'calories'],
      isSupported: true,
      connectionType: 'bluetooth'
    },

    // Medical Devices
    {
      type: 'glucose_monitor',
      brand: 'Dexcom',
      model: 'G7',
      capabilities: ['glucose_continuous', 'glucose_trends', 'alerts'],
      isSupported: true,
      connectionType: 'api'
    },
    {
      type: 'glucose_monitor',
      brand: 'Abbott',
      model: 'FreeStyle Libre',
      capabilities: ['glucose_continuous', 'glucose_history'],
      isSupported: true,
      connectionType: 'api'
    },
    {
      type: 'blood_pressure',
      brand: 'Omron',
      model: 'Evolv',
      capabilities: ['blood_pressure', 'pulse'],
      isSupported: true,
      connectionType: 'bluetooth'
    },
    {
      type: 'blood_pressure',
      brand: 'Withings',
      model: 'BPM Connect',
      capabilities: ['blood_pressure', 'pulse', 'irregular_heartbeat'],
      isSupported: true,
      connectionType: 'wifi'
    }
  ];

  // Get supported devices for current platform
  getSupportedDevices(): DeviceCapability[] {
    return this.supportedDevices.filter(device => device.isSupported);
  }

  // Check if a specific device type is supported
  isDeviceTypeSupported(type: DeviceCapability['type']): boolean {
    return this.supportedDevices.some(device => device.type === type && device.isSupported);
  }

  // Connect to a device
  async connectDevice(deviceId: string, deviceInfo: Partial<DeviceConnection>): Promise<boolean> {
    try {
      const connection: DeviceConnection = {
        id: deviceId,
        name: deviceInfo.name || 'Unknown Device',
        type: deviceInfo.type || 'fitness_tracker',
        brand: deviceInfo.brand || 'Unknown',
        isConnected: true,
        lastSync: new Date(),
        batteryLevel: deviceInfo.batteryLevel
      };

      this.connectedDevices.set(deviceId, connection);
      await this.saveConnectedDevices();
      
      console.log(`[DeviceIntegration] Connected to ${connection.name}`);
      return true;
    } catch (error) {
      console.error('[DeviceIntegration] Connection failed:', error);
      return false;
    }
  }

  // Disconnect device
  async disconnectDevice(deviceId: string): Promise<void> {
    this.connectedDevices.delete(deviceId);
    await this.saveConnectedDevices();
    console.log(`[DeviceIntegration] Disconnected device ${deviceId}`);
  }

  // Get connected devices
  getConnectedDevices(): DeviceConnection[] {
    return Array.from(this.connectedDevices.values());
  }

  // Sync data from device
  async syncDeviceData(deviceId: string): Promise<HealthMetric[]> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) {
      throw new Error('Device not connected');
    }

    // Simulate data sync based on device type
    const metrics: HealthMetric[] = [];
    const now = new Date();

    switch (device.type) {
      case 'watch':
        metrics.push(
          {
            type: 'heart_rate',
            value: 65 + Math.random() * 20,
            unit: 'bpm',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'steps',
            value: Math.floor(5000 + Math.random() * 10000),
            unit: 'steps',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'calories',
            value: Math.floor(1500 + Math.random() * 1000),
            unit: 'kcal',
            timestamp: now,
            source: device.name,
            deviceId
          }
        );
        break;

      case 'scale':
        metrics.push(
          {
            type: 'weight',
            value: 70 + Math.random() * 30,
            unit: 'kg',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'body_fat',
            value: 15 + Math.random() * 10,
            unit: '%',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'muscle_mass',
            value: 30 + Math.random() * 20,
            unit: 'kg',
            timestamp: now,
            source: device.name,
            deviceId
          }
        );
        break;

      case 'glucose_monitor':
        metrics.push({
          type: 'glucose',
          value: 80 + Math.random() * 40,
          unit: 'mg/dL',
          timestamp: now,
          source: device.name,
          deviceId
        });
        break;

      case 'blood_pressure':
        metrics.push(
          {
            type: 'systolic_bp',
            value: 110 + Math.random() * 30,
            unit: 'mmHg',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'diastolic_bp',
            value: 70 + Math.random() * 20,
            unit: 'mmHg',
            timestamp: now,
            source: device.name,
            deviceId
          }
        );
        break;
    }

    // Update last sync time
    device.lastSync = now;
    await this.saveConnectedDevices();

    // Notify listeners
    this.notifySyncListeners(metrics);

    return metrics;
  }

  // Add sync listener
  addSyncListener(listener: (metrics: HealthMetric[]) => void): void {
    this.syncListeners.add(listener);
  }

  // Remove sync listener
  removeSyncListener(listener: (metrics: HealthMetric[]) => void): void {
    this.syncListeners.delete(listener);
  }

  // Notify all sync listeners
  private notifySyncListeners(metrics: HealthMetric[]): void {
    this.syncListeners.forEach(listener => listener(metrics));
  }

  // Save connected devices to storage
  private async saveConnectedDevices(): Promise<void> {
    try {
      const devices = Array.from(this.connectedDevices.entries());
      await AsyncStorage.setItem('connected_devices', JSON.stringify(devices));
    } catch (error) {
      console.error('[DeviceIntegration] Failed to save devices:', error);
    }
  }

  // Load connected devices from storage
  async loadConnectedDevices(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('connected_devices');
      if (stored) {
        const devices = JSON.parse(stored) as [string, DeviceConnection][];
        this.connectedDevices = new Map(devices);
      }
    } catch (error) {
      console.error('[DeviceIntegration] Failed to load devices:', error);
    }
  }

  // Get device compatibility info
  getDeviceCompatibilityInfo(): {
    platform: string;
    supportedTypes: string[];
    totalSupported: number;
  } {
    const supported = this.getSupportedDevices();
    const types = [...new Set(supported.map(d => d.type))];
    
    return {
      platform: Platform.OS,
      supportedTypes: types,
      totalSupported: supported.length
    };
  }

  // Check health permissions
  async checkHealthPermissions(): Promise<{
    hasPermissions: boolean;
    missingPermissions: string[];
  }> {
    // Platform-specific permission checks would go here
    // For now, return mock data
    return {
      hasPermissions: true,
      missingPermissions: []
    };
  }

  // Request health permissions
  async requestHealthPermissions(permissions: string[]): Promise<boolean> {
    console.log('[DeviceIntegration] Requesting permissions:', permissions);
    // Platform-specific permission requests would go here
    return true;
  }
}

export const deviceIntegrationService = new DeviceIntegrationService();