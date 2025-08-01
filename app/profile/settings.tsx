import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Bell,
  Moon,
  Globe,
  Shield,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useUserStore } from '@/store/userStore';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { logout, updateUser } = useUserStore();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  const handleChangeProfilePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Photo upload is not available on web. Please use the mobile app.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to change your profile photo.');
      return;
    }

    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Photo Library', onPress: () => openImagePicker() },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateUser({ profileImageUrl: result.assets[0].uri });
      Alert.alert('Success', 'Profile photo updated successfully!');
    }
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateUser({ profileImageUrl: result.assets[0].uri });
      Alert.alert('Success', 'Profile photo updated successfully!');
    }
  };

  interface SettingItem {
    icon: React.ReactElement;
    title: string;
    subtitle?: string;
    titleColor?: string;
    rightComponent?: React.ReactElement;
    onPress?: () => void;
  }

  interface SettingSection {
    title: string;
    items: SettingItem[];
  }

  const settingSections: SettingSection[] = [
    {
      title: 'Profile',
      items: [
        {
          icon: <User size={20} color={colors.text.secondary} />,
          title: 'Edit Profile',
          onPress: () => router.push('/profile/account'),
        },
        {
          icon: <Camera size={20} color={colors.text.secondary} />,
          title: 'Change Photo',
          onPress: () => handleChangeProfilePhoto(),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell size={20} color={colors.text.secondary} />,
          title: 'Push Notifications',
          rightComponent: (
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
              thumbColor={colors.background.card}
            />
          ),
        },
        {
          icon: <Mail size={20} color={colors.text.secondary} />,
          title: 'Email Notifications',
          rightComponent: (
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
              thumbColor={colors.background.card}
            />
          ),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Moon size={20} color={colors.text.secondary} />,
          title: 'Dark Mode',
          subtitle: 'Coming soon',
          rightComponent: (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              disabled={true}
              trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
              thumbColor={colors.background.card}
            />
          ),
        },
        {
          icon: <Globe size={20} color={colors.text.secondary} />,
          title: 'Language',
          subtitle: 'English',
          onPress: () => {
            Alert.alert('Language', 'Multiple languages coming soon!');
          },
        },
        {
          icon: <Download size={20} color={colors.text.secondary} />,
          title: 'Auto-download Workouts',
          rightComponent: (
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
              thumbColor={colors.background.card}
            />
          ),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: <Shield size={20} color={colors.text.secondary} />,
          title: 'Privacy Settings',
          onPress: () => router.push('/profile/privacy'),
        },
        {
          icon: <Edit3 size={20} color={colors.text.secondary} />,
          title: 'Data & Privacy',
          onPress: () => {
            Alert.alert('Data & Privacy', 'View and manage your data preferences.');
          },
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: <LogOut size={20} color={colors.status.error} />,
          title: 'Log Out',
          titleColor: colors.status.error,
          onPress: handleLogout,
        },
        {
          icon: <Trash2 size={20} color={colors.status.error} />,
          title: 'Delete Account',
          titleColor: colors.status.error,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              source={user?.profileImageUrl}
              name={user?.name}
              size="large"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.subscriptionBadge}>
                <Text style={styles.subscriptionText}>
                  {user?.subscription?.plan === 'premium' ? 'Premium Member' : 'Free Member'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                >
                  <View style={styles.settingLeft}>
                    {item.icon}
                    <View style={styles.settingTextContainer}>
                      <Text
                        style={[
                          styles.settingTitle,
                          item.titleColor && { color: item.titleColor },
                        ]}
                      >
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    {item.rightComponent || (
                      item.onPress && (
                        <ChevronRight size={20} color={colors.text.tertiary} />
                      )
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Ripped360 v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Ripped City Inc. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  subscriptionBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionCard: {
    marginHorizontal: 16,
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  settingRight: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  appVersion: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});