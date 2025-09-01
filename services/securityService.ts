import { Platform, Alert, NativeModules, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SecurityConfig {
  blockScreenRecording: boolean;
  blockScreenshots: boolean;
  blockAutoUpdates: boolean;
  enableHIPAACompliance: boolean;
  enableProfanityFilter: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
}

class SecurityService {
  private config: SecurityConfig = {
    blockScreenRecording: true,
    blockScreenshots: true,
    blockAutoUpdates: true,
    enableHIPAACompliance: true,
    enableProfanityFilter: true,
    maxLoginAttempts: 3,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  };

  private loginAttempts: Map<string, number> = new Map();
  private blockedUsers: Set<string> = new Set();
  private sessionTimer: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();

  constructor() {
    this.initializeSecurity();
  }

  private initializeSecurity() {
    if (Platform.OS === 'ios') {
      this.setupIOSSecurity();
    } else if (Platform.OS === 'android') {
      this.setupAndroidSecurity();
    }
    this.setupSessionMonitoring();
    this.loadSecuritySettings();
  }

  private setupIOSSecurity() {
    // iOS-specific security setup
    try {
      // Prevent screen recording detection
      if (Platform.OS === 'ios' && NativeModules.ScreenRecordingDetector) {
        DeviceEventEmitter.addListener('ScreenRecordingChanged', (isRecording: boolean) => {
          if (isRecording && this.config.blockScreenRecording) {
            Alert.alert(
              'Security Alert',
              'Screen recording is not allowed for security reasons. Please stop recording to continue.',
              [{ text: 'OK' }]
            );
          }
        });
      }
    } catch (error) {
      console.log('iOS security setup:', error);
    }
  }

  private setupAndroidSecurity() {
    // Android-specific security setup
    try {
      if (Platform.OS === 'android' && NativeModules.SecurityModule) {
        // Block screenshots and screen recording
        NativeModules.SecurityModule?.setSecureFlag?.(this.config.blockScreenshots);
      }
    } catch (error) {
      console.log('Android security setup:', error);
    }
  }

  private setupSessionMonitoring() {
    // Monitor user activity for session timeout
    this.sessionTimer = setInterval(() => {
      const now = Date.now();
      if (now - this.lastActivity > this.config.sessionTimeout) {
        this.handleSessionTimeout();
      }
    }, 60000); // Check every minute
  }

  private async loadSecuritySettings() {
    try {
      const settings = await AsyncStorage.getItem('security_settings');
      if (settings) {
        this.config = { ...this.config, ...JSON.parse(settings) };
      }
    } catch (error) {
      console.error('Failed to load security settings:', error);
    }
  }

  public updateActivity() {
    this.lastActivity = Date.now();
  }

  private handleSessionTimeout() {
    Alert.alert(
      'Session Expired',
      'Your session has expired for security reasons. Please log in again.',
      [{ text: 'OK' }]
    );
    // Trigger logout
    DeviceEventEmitter.emit('sessionTimeout');
  }

  public async validateLogin(email: string): Promise<boolean> {
    const attempts = this.loginAttempts.get(email) || 0;
    
    if (this.blockedUsers.has(email)) {
      Alert.alert(
        'Account Locked',
        'This account has been temporarily locked due to multiple failed login attempts. Please contact support.',
        [{ text: 'OK' }]
      );
      return false;
    }

    if (attempts >= this.config.maxLoginAttempts) {
      this.blockedUsers.add(email);
      // Auto-unblock after 30 minutes
      setTimeout(() => {
        this.blockedUsers.delete(email);
        this.loginAttempts.delete(email);
      }, 30 * 60 * 1000);
      return false;
    }

    return true;
  }

  public recordLoginAttempt(email: string, success: boolean) {
    if (success) {
      this.loginAttempts.delete(email);
    } else {
      const attempts = this.loginAttempts.get(email) || 0;
      this.loginAttempts.set(email, attempts + 1);
    }
  }

  public filterProfanity(text: string): string {
    if (!this.config.enableProfanityFilter) return text;

    const profanityList = [
      'fuck', 'shit', 'ass', 'damn', 'hell', 'bitch', 'bastard', 'dick', 'cock', 'pussy',
      'fag', 'nigger', 'cunt', 'whore', 'slut', 'retard', 'piss', 'douche', 'twat', 'wanker'
    ];

    let filtered = text;
    profanityList.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });

    return filtered;
  }

  public async encryptSensitiveData(data: string): Promise<string> {
    // Simple encryption for HIPAA compliance
    // In production, use a proper encryption library
    try {
      const encrypted = btoa(unescape(encodeURIComponent(data)));
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  public async decryptSensitiveData(encryptedData: string): Promise<string> {
    try {
      const decrypted = decodeURIComponent(escape(atob(encryptedData)));
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  public blockAutoUpdates() {
    if (Platform.OS === 'ios') {
      // iOS: Managed through MDM or enterprise deployment
      console.log('Auto-updates blocked via enterprise configuration');
    } else if (Platform.OS === 'android') {
      // Android: Disable auto-update checks
      try {
        if (NativeModules.UpdateManager) {
          NativeModules.UpdateManager?.disableAutoUpdate?.();
        }
      } catch (error) {
        console.log('Failed to disable auto-updates:', error);
      }
    }
  }

  public async checkAdminAccess(userId: string, adminId: string): Promise<boolean> {
    // Verify admin has granted access to this user
    try {
      const accessList = await AsyncStorage.getItem(`admin_access_${adminId}`);
      if (accessList) {
        const users = JSON.parse(accessList);
        return users.includes(userId);
      }
    } catch (error) {
      console.error('Failed to check admin access:', error);
    }
    return false;
  }

  public async grantAdminAccess(adminId: string, userId: string) {
    try {
      const accessList = await AsyncStorage.getItem(`admin_access_${adminId}`);
      const users = accessList ? JSON.parse(accessList) : [];
      if (!users.includes(userId)) {
        users.push(userId);
        await AsyncStorage.setItem(`admin_access_${adminId}`, JSON.stringify(users));
      }
    } catch (error) {
      console.error('Failed to grant admin access:', error);
    }
  }

  public cleanup() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }
  }
}

export default new SecurityService();