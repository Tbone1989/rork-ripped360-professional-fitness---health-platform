import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { User, Mail, Phone, Calendar, MapPin, Edit3, Camera, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useUserStore } from '@/store/userStore';

export default function AccountScreen() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    location: 'San Francisco, CA',
  });

  const handleSave = () => {
    updateUser({ name: formData.name, email: formData.email });
    setIsEditing(false);
    Alert.alert('Success', 'Account information updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-01-15',
      location: 'San Francisco, CA',
    });
    setIsEditing(false);
  };

  const handleChangePhoto = () => {
    const options = [
      {
        text: 'Photo Library',
        onPress: () => pickImage('library'),
      },
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ];

    // Add camera option only on mobile
    if (Platform.OS !== 'web') {
      options.unshift({
        text: 'Camera',
        onPress: () => pickImage('camera'),
      });
    }

    Alert.alert(
      'Change Profile Photo',
      'Choose how you want to update your profile photo',
      options
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      // On web, camera is not supported, so always use library
      if (Platform.OS === 'web' && source === 'camera') {
        Alert.alert('Not supported', 'Camera is not supported on web. Please select from photo library.');
        return;
      }

      // Request permissions (not needed on web)
      if (Platform.OS !== 'web') {
        if (source === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take photos.');
            return;
          }
        } else {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Photo library permission is required to select photos.');
            return;
          }
        }
      }

      let result;
      if (source === 'camera' && Platform.OS !== 'web') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        // Update user profile with new image
        updateUser({ profileImageUrl: imageUri });
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile photo. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Account Settings',
          headerRight: () => (
            <Button
              title={isEditing ? 'Cancel' : 'Edit'}
              variant="ghost"
              onPress={isEditing ? handleCancel : () => setIsEditing(true)}
              icon={<Edit3 size={16} color={colors.accent.primary} />}
            />
          ),
        }} 
      />

      {/* Profile Photo Section */}
      <View style={styles.photoSection}>
        <Avatar
          source={user?.profileImageUrl}
          name={user?.name}
          size="xlarge"
        />
        <Text style={styles.photoLabel}>Profile Photo</Text>
        <Button
          title="Change Photo"
          variant="outline"
          onPress={handleChangePhoto}
          icon={<Camera size={16} color={colors.accent.primary} />}
        />
      </View>

      {/* Personal Information */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputGroup}>
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            editable={isEditing}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            editable={isEditing}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            editable={isEditing}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
            editable={isEditing}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            editable={isEditing}
            placeholder="Enter your location"
          />
        </View>
      </Card>

      {/* Account Details */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <User size={16} color={colors.text.secondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Account Type</Text>
            <Text style={styles.detailValue}>
              {user?.subscription?.plan === 'premium' ? 'Premium Member' : 'Free Member'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Calendar size={16} color={colors.text.secondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Member Since</Text>
            <Text style={styles.detailValue}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Calendar size={16} color={colors.text.secondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Last Active</Text>
            <Text style={styles.detailValue}>
              {user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </Card>

      {isEditing && (
        <View style={styles.actionButtons}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            fullWidth
          />
        </View>
      )}

      <View style={styles.dangerZone}>
        <Card style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Text style={styles.dangerDescription}>
            These actions are permanent and cannot be undone.
          </Text>
          
          <Button
            title="Delete Account"
            variant="outline"
            onPress={() => Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive' },
              ]
            )}
            style={styles.dangerButton}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  photoSection: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 16,
  },
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  actionButtons: {
    padding: 16,
  },
  dangerZone: {
    margin: 16,
    marginTop: 32,
  },
  dangerCard: {
    padding: 16,
    borderColor: colors.status.error,
    borderWidth: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.error,
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  dangerButton: {
    borderColor: colors.status.error,
  },
});