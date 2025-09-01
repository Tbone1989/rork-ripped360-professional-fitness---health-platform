import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Users,
  Shield,
  Activity,
  Settings,
  Database,
  MessageSquare,
  FileText,
  TrendingUp,
  UserCheck,
  UserX,
  Crown,
  Stethoscope,
  LogOut,
  Camera,
  User,
  TestTube,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useUserStore } from '@/store/userStore';

interface UserManagementItem {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'coach' | 'doctor';
  subscription: 'free' | 'premium' | 'medical';
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
}

const mockUsers: UserManagementItem[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    subscription: 'premium',
    status: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'coach',
    subscription: 'premium',
    status: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    email: 'dr.chen@example.com',
    role: 'doctor',
    subscription: 'medical',
    status: 'active',
    lastActive: '30 minutes ago',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'user',
    subscription: 'free',
    status: 'pending',
    lastActive: '1 day ago',
  },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, logout, grantUserAccess, revokeUserAccess, isAdmin, updateUser } = useUserStore();
  const [users, setUsers] = useState<UserManagementItem[]>(mockUsers);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      router.replace('/admin/login');
    }
  }, [isAdmin]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleGrantAccess = (userId: string, accessLevel: 'free' | 'premium' | 'medical') => {
    grantUserAccess(userId, accessLevel);
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, subscription: accessLevel, status: 'active' }
          : user
      )
    );
    Alert.alert('Success', `Access granted successfully`);
  };

  const handleRevokeAccess = (userId: string) => {
    Alert.alert(
      'Revoke Access',
      'Are you sure you want to revoke access for this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => {
            revokeUserAccess(userId);
            setUsers(prev =>
              prev.map(user =>
                user.id === userId
                  ? { ...user, status: 'suspended' }
                  : user
              )
            );
            Alert.alert('Success', 'Access revoked successfully');
          },
        },
      ]
    );
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'database':
        router.push('/admin/database');
        break;
      case 'messages':
        router.push('/admin/messages');
        break;
      case 'reports':
        router.push('/admin/reports');
        break;
      case 'settings':
        router.push('/admin/settings');
        break;
      case 'testing':
        router.push('/admin/testing');
        break;
      case 'volume-tracking':
        router.push('/admin/volume-tracking');
        break;
      case 'user-issues':
        router.push('/admin/user-issues');
        break;
      default:
        break;
    }
  };

  const handleStatClick = (statTitle: string) => {
    switch (statTitle) {
      case 'Total Users':
        Alert.alert('Total Users', 'Detailed user analytics and breakdown would be shown here.');
        break;
      case 'Active Sessions':
        Alert.alert('Active Sessions', 'Real-time session monitoring and details.');
        break;
      case 'Premium Users':
        Alert.alert('Premium Users', 'Premium subscription analytics and management.');
        break;
      case 'Medical Users':
        Alert.alert('Medical Users', 'Medical subscription users and health data overview.');
        break;
      default:
        break;
    }
  };

  const handleUserClick = (user: UserManagementItem) => {
    Alert.alert(
      'User Details',
      `Name: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nSubscription: ${user.subscription}\nStatus: ${user.status}\nLast Active: ${user.lastActive}`,
      [
        { text: 'OK', style: 'default' },
        { text: 'Edit User', onPress: () => Alert.alert('Edit User', 'User editing interface would open here.') }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.status.success;
      case 'suspended':
        return colors.status.error;
      case 'pending':
        return colors.status.warning;
      default:
        return colors.text.secondary;
    }
  };

  const getSubscriptionIcon = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return <Crown size={16} color={colors.status.warning} />;
      case 'medical':
        return <Stethoscope size={16} color={colors.accent.primary} />;
      default:
        return <Users size={16} color={colors.text.secondary} />;
    }
  };

  const stats = [
    { title: 'Total Users', value: '2,847', icon: Users, color: colors.accent.primary },
    { title: 'Active Sessions', value: '1,234', icon: Activity, color: colors.status.success },
    { title: 'Premium Users', value: '892', icon: Crown, color: colors.status.warning },
    { title: 'Medical Users', value: '156', icon: Stethoscope, color: colors.accent.primary },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Admin Dashboard',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleChangeProfilePhoto} style={styles.avatarContainer}>
            <Avatar
              source={user?.profileImageUrl}
              name={user?.name}
              size="large"
            />
            <View style={styles.cameraIcon}>
              <Camera size={16} color={colors.background.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.adminName}>{user?.name}</Text>
            <Text style={styles.adminEmail}>{user?.email}</Text>
            <Badge variant="success" style={styles.adminBadge}>Administrator</Badge>
          </View>
        </View>
        <Text style={styles.title}>System Administration</Text>
        <Text style={styles.subtitle}>Ripped360 Management Console</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleStatClick(stat.title)}
            activeOpacity={0.8}
          >
            <Card style={styles.statCard}>
              <View style={styles.statHeader}>
                <stat.icon size={24} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('database')}
            activeOpacity={0.7}
          >
            <Database size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Database</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('messages')}
            activeOpacity={0.7}
          >
            <MessageSquare size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('reports')}
            activeOpacity={0.7}
          >
            <FileText size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('settings')}
            activeOpacity={0.7}
          >
            <Settings size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('testing')}
            activeOpacity={0.7}
          >
            <TestTube size={24} color={colors.status.warning} />
            <Text style={styles.actionText}>Testing</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('volume-tracking')}
            activeOpacity={0.7}
          >
            <TrendingUp size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Volume</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('user-issues')}
            activeOpacity={0.7}
          >
            <MessageSquare size={24} color={colors.status.error} />
            <Text style={styles.actionText}>Issues</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>
        {users.map((user) => (
          <TouchableOpacity 
            key={user.id} 
            onPress={() => handleUserClick(user)}
            activeOpacity={0.9}
          >
            <Card style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <View style={styles.userMeta}>
                    <Badge variant="info" style={styles.roleBadge}>{user.role}</Badge>
                    <View style={styles.subscriptionBadge}>
                      {getSubscriptionIcon(user.subscription)}
                      <Text style={styles.subscriptionText}>{user.subscription}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.userStatus}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(user.status) },
                    ]}
                  />
                  <Text style={styles.statusText}>{user.status}</Text>
                </View>
              </View>
              
              <View style={styles.userActions}>
                <Text style={styles.lastActive}>Last active: {user.lastActive}</Text>
                <View style={styles.actionButtons}>
                  {user.status === 'pending' && (
                    <>
                      <Button
                        title="Grant Free"
                        variant="outline"
                        onPress={() => handleGrantAccess(user.id, 'free')}
                        style={styles.actionButton}
                      />
                      <Button
                        title="Grant Premium"
                        onPress={() => handleGrantAccess(user.id, 'premium')}
                        style={styles.actionButton}
                      />
                    </>
                  )}
                  {user.status === 'active' && (
                    <Button
                      title="Revoke Access"
                      variant="outline"
                      onPress={() => handleRevokeAccess(user.id)}
                      style={styles.actionButton}
                    />
                  )}
                  {user.status === 'suspended' && (
                    <Button
                      title="Restore Access"
                      onPress={() => handleGrantAccess(user.id, user.subscription)}
                      style={styles.actionButton}
                    />
                  )}
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  logoutButton: {
    padding: 8,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.secondary,
  },
  profileInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  adminBadge: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statTitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  userCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    marginRight: 0,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionText: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  userStatus: {
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  userActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: 12,
  },
  lastActive: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 0,
    paddingHorizontal: 16,
  },
});