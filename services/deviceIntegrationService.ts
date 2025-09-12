import { AppState, AppStateStatus, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DeviceCapability {
  type: 'watch' | 'scale' | 'fitness_tracker' | 'glucose_monitor' | 'blood_pressure' | 'heart_rate' | 'body_composition' | 'dexa_scanner';
  brand: string;
  model: string;
  capabilities: string[];
  isSupported: boolean;
  connectionType: 'bluetooth' | 'wifi' | 'api' | 'manual' | 'qr_code' | 'nfc';
  isProfessional?: boolean;
  requiresClinic?: boolean;
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
  private appState: AppStateStatus = 'active';
  private autoSync = {
    enabled: false,
    intervalMs: 5 * 60 * 1000,
    timer: null as ReturnType<typeof setInterval> | null,
  };

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

    // Professional Body Composition Analyzers
    {
      type: 'body_composition',
      brand: 'InBody',
      model: 'InBody 270',
      capabilities: [
        'weight', 'skeletal_muscle_mass', 'body_fat_mass', 'total_body_water',
        'protein', 'minerals', 'body_fat_percentage', 'segmental_lean_analysis',
        'ecw_ratio', 'phase_angle', 'visceral_fat_level', 'basal_metabolic_rate'
      ],
      isSupported: true,
      connectionType: 'qr_code',
      isProfessional: true,
      requiresClinic: false
    },
    {
      type: 'body_composition',
      brand: 'InBody',
      model: 'InBody 570',
      capabilities: [
        'weight', 'skeletal_muscle_mass', 'body_fat_mass', 'total_body_water',
        'protein', 'minerals', 'body_fat_percentage', 'segmental_lean_analysis',
        'segmental_fat_analysis', 'ecw_ratio', 'phase_angle', 'visceral_fat_level',
        'basal_metabolic_rate', 'body_cell_mass', 'bone_mineral_content'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: true,
      requiresClinic: false
    },
    {
      type: 'body_composition',
      brand: 'InBody',
      model: 'InBody 770',
      capabilities: [
        'weight', 'skeletal_muscle_mass', 'body_fat_mass', 'total_body_water',
        'intracellular_water', 'extracellular_water', 'protein', 'minerals',
        'body_fat_percentage', 'segmental_lean_analysis', 'segmental_fat_analysis',
        'ecw_ratio', 'phase_angle', 'visceral_fat_level', 'basal_metabolic_rate',
        'body_cell_mass', 'bone_mineral_content', 'impedance_values'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: true,
      requiresClinic: true
    },
    {
      type: 'body_composition',
      brand: 'InBody',
      model: 'InBody BWA 2.0',
      capabilities: [
        'weight', 'skeletal_muscle_mass', 'body_fat_mass', 'total_body_water',
        'intracellular_water', 'extracellular_water', 'dry_lean_mass', 'body_cell_mass',
        'ecw_tbw_ratio', 'segmental_water_analysis', 'segmental_lean_mass',
        'segmental_phase_angle', 'whole_body_phase_angle', 'reactance', 'resistance'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: true,
      requiresClinic: true
    },
    {
      type: 'body_composition',
      brand: 'DEXA',
      model: 'Hologic Horizon',
      capabilities: [
        'bone_density', 'bone_mineral_content', 'lean_mass', 'fat_mass',
        'visceral_adipose_tissue', 'android_gynoid_ratio', 'regional_body_composition',
        't_score', 'z_score', 'fracture_risk_assessment'
      ],
      isSupported: true,
      connectionType: 'manual',
      isProfessional: true,
      requiresClinic: true
    },
    {
      type: 'body_composition',
      brand: 'DEXA',
      model: 'GE Lunar iDXA',
      capabilities: [
        'bone_density', 'bone_mineral_content', 'lean_mass', 'fat_mass',
        'visceral_adipose_tissue', 'android_gynoid_ratio', 'regional_body_composition',
        'core_body_composition', 'advanced_hip_assessment', 'vertebral_assessment'
      ],
      isSupported: true,
      connectionType: 'manual',
      isProfessional: true,
      requiresClinic: true
    },
    {
      type: 'body_composition',
      brand: 'Bod Pod',
      model: 'COSMED BOD POD',
      capabilities: [
        'body_volume', 'body_density', 'fat_mass', 'fat_free_mass',
        'body_fat_percentage', 'resting_metabolic_rate', 'total_energy_expenditure'
      ],
      isSupported: true,
      connectionType: 'manual',
      isProfessional: true,
      requiresClinic: true
    },
    {
      type: 'body_composition',
      brand: 'Tanita',
      model: 'MC-980MA Plus',
      capabilities: [
        'weight', 'body_fat_percentage', 'fat_mass', 'fat_free_mass',
        'muscle_mass', 'total_body_water', 'bone_mass', 'visceral_fat_rating',
        'basal_metabolic_rate', 'metabolic_age', 'physique_rating', 'segmental_analysis'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: true,
      requiresClinic: false
    },
    {
      type: 'body_composition',
      brand: 'Seca',
      model: 'mBCA 555',
      capabilities: [
        'weight', 'fat_mass', 'fat_free_mass', 'skeletal_muscle_mass',
        'total_body_water', 'extracellular_water', 'intracellular_water',
        'visceral_adipose_tissue', 'phase_angle', 'bioimpedance_vector_analysis'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: true,
      requiresClinic: true
    },
    {
      type: 'body_composition',
      brand: 'Styku',
      model: 'Styku S100',
      capabilities: [
        '3d_body_scan', 'body_measurements', 'body_fat_percentage', 'lean_mass',
        'posture_analysis', 'body_shape_rating', 'waist_hip_ratio', 'body_surface_area',
        'circumference_measurements', 'body_composition_risk_assessment'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: true,
      requiresClinic: false
    },
    {
      type: 'body_composition',
      brand: 'Fit3D',
      model: 'ProScanner',
      capabilities: [
        '3d_body_scan', 'body_measurements', 'body_fat_percentage', 'posture_analysis',
        'balance_assessment', 'circumference_measurements', 'body_shape_wellness_score',
        'basal_metabolic_rate', 'trunk_to_leg_volume_ratio'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: true,
      requiresClinic: false
    },
    {
      type: 'body_composition',
      brand: 'Evolt',
      model: 'Evolt 360',
      capabilities: [
        'weight', 'skeletal_muscle_mass', 'body_fat_mass', 'body_fat_percentage',
        'visceral_fat_level', 'subcutaneous_fat', 'total_body_water', 'protein',
        'minerals', 'bio_age', 'basal_metabolic_rate', 'segmental_analysis'
      ],
      isSupported: true,
      connectionType: 'api',
      isProfessional: false,
      requiresClinic: false
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
      brand: 'InBody',
      model: 'InBody H30',
      capabilities: ['weight', 'body_fat', 'muscle_mass', 'water_percentage', 'segmental_analysis', 'bmi', 'basal_metabolic_rate'],
      isSupported: true,
      connectionType: 'bluetooth'
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

  // Initialization (call once at app start)
  async init(): Promise<void> {
    console.log('[DeviceIntegration] Initializing');
    await this.loadConnectedDevices();
    await this.loadAutoSyncPreference();
    this.setupAppStateListener();
    if (this.autoSync.enabled) {
      this.startAutoSyncTimer();
    }
  }

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
        name: deviceInfo.name ?? 'Unknown Device',
        type: deviceInfo.type ?? 'fitness_tracker',
        brand: deviceInfo.brand ?? 'Unknown',
        isConnected: true,
        lastSync: new Date(),
        batteryLevel: deviceInfo.batteryLevel,
      };

      this.connectedDevices.set(deviceId, connection);
      await this.saveConnectedDevices();

      console.log(`[DeviceIntegration] Connected to ${connection.name}`);

      if (this.autoSync.enabled) {
        console.log('[DeviceIntegration] Auto-sync enabled: triggering immediate sync for', deviceId);
        try {
          await this.syncDeviceData(deviceId);
        } catch (e) {
          console.warn('[DeviceIntegration] Initial auto-sync failed for', deviceId, e);
        }
        this.startAutoSyncTimer();
      }

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
    if (this.connectedDevices.size === 0) {
      this.stopAutoSyncTimer();
    }
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
    console.log('[DeviceIntegration] Sync start for', deviceId);

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

      case 'body_composition':
        // Simulate InBody-style comprehensive analysis
        const weight = 70 + Math.random() * 30;
        const bodyFatPercentage = 15 + Math.random() * 10;
        const muscleMass = weight * (0.4 + Math.random() * 0.2);
        
        metrics.push(
          {
            type: 'weight',
            value: weight,
            unit: 'kg',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'skeletal_muscle_mass',
            value: muscleMass,
            unit: 'kg',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'body_fat_mass',
            value: weight * (bodyFatPercentage / 100),
            unit: 'kg',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'body_fat_percentage',
            value: bodyFatPercentage,
            unit: '%',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'total_body_water',
            value: weight * (0.5 + Math.random() * 0.1),
            unit: 'L',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'protein',
            value: weight * (0.15 + Math.random() * 0.05),
            unit: 'kg',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'minerals',
            value: weight * (0.04 + Math.random() * 0.01),
            unit: 'kg',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'visceral_fat_level',
            value: 5 + Math.random() * 10,
            unit: 'level',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'basal_metabolic_rate',
            value: 1400 + Math.random() * 600,
            unit: 'kcal',
            timestamp: now,
            source: device.name,
            deviceId
          },
          {
            type: 'phase_angle',
            value: 4.5 + Math.random() * 2,
            unit: '°',
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

    console.log('[DeviceIntegration] Sync complete for', deviceId, 'metrics:', metrics.length);
    return metrics;
  }

  // Auto-sync API
  isAutoSyncEnabled(): boolean {
    return this.autoSync.enabled;
  }

  async setAutoSyncEnabled(enabled: boolean, intervalMs?: number): Promise<void> {
    this.autoSync.enabled = enabled;
    if (typeof intervalMs === 'number' && intervalMs > 0) {
      this.autoSync.intervalMs = intervalMs;
    }
    await AsyncStorage.setItem('auto_sync_enabled', JSON.stringify({ enabled: this.autoSync.enabled, intervalMs: this.autoSync.intervalMs }));
    console.log('[DeviceIntegration] Auto-sync set to', enabled, 'interval', this.autoSync.intervalMs);
    if (enabled && this.connectedDevices.size > 0) {
      this.startAutoSyncTimer();
    } else {
      this.stopAutoSyncTimer();
    }
  }

  private async loadAutoSyncPreference(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem('auto_sync_enabled');
      if (raw) {
        const parsed = JSON.parse(raw) as { enabled?: boolean; intervalMs?: number };
        this.autoSync.enabled = parsed.enabled ?? this.autoSync.enabled;
        this.autoSync.intervalMs = parsed.intervalMs ?? this.autoSync.intervalMs;
      }
    } catch (e) {
      console.warn('[DeviceIntegration] Failed to load auto-sync preference', e);
    }
  }

  private setupAppStateListener(): void {
    AppState.addEventListener('change', (next: AppStateStatus) => {
      this.appState = next;
      if (next === 'active') {
        if (this.autoSync.enabled && this.connectedDevices.size > 0) {
          this.startAutoSyncTimer();
        }
      } else {
        this.stopAutoSyncTimer();
      }
    });
  }

  private startAutoSyncTimer(): void {
    if (this.autoSync.timer) return;
    console.log('[DeviceIntegration] Starting auto-sync timer', this.autoSync.intervalMs);
    this.autoSync.timer = setInterval(async () => {
      if (!this.autoSync.enabled) return;
      try {
        const ids = Array.from(this.connectedDevices.keys());
        for (const id of ids) {
          try {
            await this.syncDeviceData(id);
          } catch (err) {
            console.warn('[DeviceIntegration] Auto-sync failed for', id, err);
          }
        }
      } catch (e) {
        console.warn('[DeviceIntegration] Auto-sync cycle error', e);
      }
    }, this.autoSync.intervalMs);
  }

  private stopAutoSyncTimer(): void {
    if (this.autoSync.timer) {
      console.log('[DeviceIntegration] Stopping auto-sync timer');
      clearInterval(this.autoSync.timer);
      this.autoSync.timer = null;
    }
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

  // Bluetooth helpers (mocked in Expo Go/web)
  isBluetoothAvailable(): boolean {
    if (Platform.OS === 'web') {
      // Web Bluetooth is not supported in Expo web reliably
      return false;
    }
    return true;
  }

  async scanBluetoothDevices(): Promise<DeviceCapability[]> {
    console.log('[DeviceIntegration] Scanning for Bluetooth devices...');
    if (!this.isBluetoothAvailable()) {
      console.warn('[DeviceIntegration] Bluetooth scanning not available on this platform');
      return [];
    }
    return this.supportedDevices.filter(d => d.connectionType === 'bluetooth' && d.isSupported);
  }

  async pairBluetoothDevice(capability: DeviceCapability): Promise<boolean> {
    console.log('[DeviceIntegration] Pairing with', capability.brand, capability.model);
    if (!this.isBluetoothAvailable()) {
      console.warn('[DeviceIntegration] Bluetooth pairing not available on this platform');
      return false;
    }
    const id = `${capability.brand}-${capability.model}`.toLowerCase().replace(/\s+/g, '-');
    return this.connectDevice(id, {
      name: `${capability.brand} ${capability.model}`,
      type: capability.type,
      brand: capability.brand,
    });
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
    professionalDevices: number;
    clinicRequiredDevices: number;
  } {
    const supported = this.getSupportedDevices();
    const types = [...new Set(supported.map(d => d.type))];
    const professional = supported.filter(d => d.isProfessional).length;
    const clinicRequired = supported.filter(d => d.requiresClinic).length;
    
    return {
      platform: Platform.OS,
      supportedTypes: types,
      totalSupported: supported.length,
      professionalDevices: professional,
      clinicRequiredDevices: clinicRequired
    };
  }

  // Get professional body composition devices
  getProfessionalDevices(): DeviceCapability[] {
    return this.supportedDevices.filter(device => 
      device.isProfessional && device.isSupported
    );
  }

  // Get InBody specific devices
  getInBodyDevices(): DeviceCapability[] {
    return this.supportedDevices.filter(device => 
      device.brand === 'InBody' && device.isSupported
    );
  }

  // Parse InBody QR code or result sheet
  async parseInBodyResult(qrData: string): Promise<HealthMetric[]> {
    try {
      // Parse QR code data (InBody typically uses a specific format)
      const metrics: HealthMetric[] = [];
      const timestamp = new Date();
      
      // This would parse actual InBody QR code format
      // For now, returning mock parsed data
      const parsedData = {
        weight: 75.2,
        skeletalMuscleMass: 32.1,
        bodyFatMass: 15.3,
        bodyFatPercentage: 20.3,
        totalBodyWater: 41.2,
        protein: 11.2,
        minerals: 3.85,
        visceralFatLevel: 8,
        basalMetabolicRate: 1652,
        phaseAngle: 5.2
      };

      Object.entries(parsedData).forEach(([key, value]) => {
        const type = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        let unit = 'kg';
        
        if (key.includes('Percentage')) unit = '%';
        else if (key === 'visceralFatLevel') unit = 'level';
        else if (key === 'basalMetabolicRate') unit = 'kcal';
        else if (key === 'phaseAngle') unit = '°';
        else if (key === 'totalBodyWater') unit = 'L';
        
        metrics.push({
          type,
          value: value as number,
          unit,
          timestamp,
          source: 'InBody Scan',
          deviceId: 'inbody-qr'
        });
      });

      return metrics;
    } catch (error) {
      console.error('[DeviceIntegration] Failed to parse InBody result:', error);
      throw new Error('Invalid InBody QR code format');
    }
  }

  // Import DEXA scan results
  async importDEXAResults(data: any): Promise<HealthMetric[]> {
    const metrics: HealthMetric[] = [];
    const timestamp = new Date();
    
    // Parse DEXA scan data format
    if (data.boneDensity) {
      metrics.push({
        type: 'bone_density',
        value: data.boneDensity,
        unit: 'g/cm²',
        timestamp,
        source: 'DEXA Scan'
      });
    }
    
    if (data.leanMass) {
      metrics.push({
        type: 'lean_mass',
        value: data.leanMass,
        unit: 'kg',
        timestamp,
        source: 'DEXA Scan'
      });
    }
    
    if (data.fatMass) {
      metrics.push({
        type: 'fat_mass',
        value: data.fatMass,
        unit: 'kg',
        timestamp,
        source: 'DEXA Scan'
      });
    }
    
    if (data.visceralAdiposeTissue) {
      metrics.push({
        type: 'visceral_adipose_tissue',
        value: data.visceralAdiposeTissue,
        unit: 'cm²',
        timestamp,
        source: 'DEXA Scan'
      });
    }
    
    return metrics;
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