import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Dimensions
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  Zap, 
  Calendar, 
  TrendingUp, 
  Pill, 
  Camera,
  Plus,
  Settings,
  Play,
  Pause,
  BarChart3,
  Clock
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AutomatedProtocol } from '@/types/contest';

const { width } = Dimensions.get('window');

export default function AutomatedProtocolsScreen() {
  const { 
    currentPrep, 
    automatedProtocols, 
    toggleProtocol, 
    executeProtocol,
    deleteAutomatedProtocol 
  } = useContestStore();
  
  const [selectedProtocol, setSelectedProtocol] = useState<AutomatedProtocol | null>(null);

  if (!currentPrep) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Automated Protocols' }} />
        <View style={styles.emptyState}>
          <Zap size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Selected</Text>
          <Text style={styles.emptyDescription}>
            Please select a contest prep to manage automated protocols.
          </Text>
        </View>
      </View>
    );
  }

  const contestProtocols = automatedProtocols.filter(
    protocol => protocol.contestPrepId === currentPrep.id
  );

  const handleCreateProtocol = () => {
    router.push('/contest/create-protocol');
  };

  const handleToggleProtocol = (protocolId: string) => {
    toggleProtocol(protocolId);
  };

  const handleExecuteProtocol = (protocolId: string) => {
    Alert.alert(
      'Execute Protocol',
      'This will generate the scheduled items for this protocol. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Execute', 
          onPress: () => executeProtocol(protocolId),
          style: 'default'
        }
      ]
    );
  };

  const handleDeleteProtocol = (protocolId: string) => {
    Alert.alert(
      'Delete Protocol',
      'Are you sure you want to delete this protocol? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => deleteAutomatedProtocol(protocolId),
          style: 'destructive'
        }
      ]
    );
  };

  const getProtocolIcon = (type: string) => {
    switch (type) {
      case 'calorie-cycling': return TrendingUp;
      case 'macro-adjustment': return BarChart3;
      case 'cardio-programming': return Calendar;
      case 'supplement-timing': return Pill;
      case 'progress-photos': return Camera;
      default: return Zap;
    }
  };

  const getProtocolColor = (type: string) => {
    switch (type) {
      case 'calorie-cycling': return '#FF6B35';
      case 'macro-adjustment': return '#4ECDC4';
      case 'cardio-programming': return '#45B7D1';
      case 'supplement-timing': return '#96CEB4';
      case 'progress-photos': return '#FFEAA7';
      default: return colors.accent.primary;
    }
  };

  const renderProtocolCard = (protocol: AutomatedProtocol) => {
    const IconComponent = getProtocolIcon(protocol.type);
    const protocolColor = getProtocolColor(protocol.type);
    
    return (
      <Card key={protocol.id} style={styles.protocolCard}>
        <View style={styles.protocolHeader}>
          <View style={styles.protocolInfo}>
            <View style={styles.protocolTitleRow}>
              <IconComponent size={20} color={protocolColor} />
              <Text style={styles.protocolName}>{protocol.name}</Text>
            </View>
            <Badge 
              label={protocol.type.replace('-', ' ')} 
              variant="secondary"
              style={{ backgroundColor: protocolColor + '20' }}
            />
          </View>
          
          <View style={styles.protocolControls}>
            <Switch
              value={protocol.isActive}
              onValueChange={() => handleToggleProtocol(protocol.id)}
              trackColor={{ false: colors.border.light, true: protocolColor + '40' }}
              thumbColor={protocol.isActive ? protocolColor : colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.protocolStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{protocol.history.length}</Text>
            <Text style={styles.statLabel}>Executions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {protocol.schedule.frequency}
            </Text>
            <Text style={styles.statLabel}>Frequency</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: protocol.isActive ? colors.status.success : colors.text.tertiary }]}>
              {protocol.isActive ? 'Active' : 'Inactive'}
            </Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>

        <View style={styles.protocolActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: protocolColor + '20' }]}
            onPress={() => handleExecuteProtocol(protocol.id)}
            disabled={!protocol.isActive}
          >
            <Play size={16} color={protocolColor} />
            <Text style={[styles.actionText, { color: protocolColor }]}>Execute</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/contest/protocol/${protocol.id}`)}
          >
            <Settings size={16} color={colors.text.secondary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteProtocol(protocol.id)}
          >
            <Text style={[styles.actionText, { color: colors.status.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const renderQuickSetup = () => (
    <Card style={styles.quickSetupCard}>
      <Text style={styles.quickSetupTitle}>Quick Protocol Setup</Text>
      <Text style={styles.quickSetupDescription}>
        Get started with pre-configured protocols for common contest prep needs.
      </Text>
      
      <View style={styles.quickSetupGrid}>
        <TouchableOpacity 
          style={styles.quickSetupItem}
          onPress={() => router.push('/contest/create-protocol?template=calorie-cycling')}
        >
          <TrendingUp size={24} color="#FF6B35" />
          <Text style={styles.quickSetupText}>Calorie Cycling</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickSetupItem}
          onPress={() => router.push('/contest/create-protocol?template=cardio-programming')}
        >
          <Calendar size={24} color="#45B7D1" />
          <Text style={styles.quickSetupText}>Cardio Program</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickSetupItem}
          onPress={() => router.push('/contest/create-protocol?template=supplement-timing')}
        >
          <Pill size={24} color="#96CEB4" />
          <Text style={styles.quickSetupText}>Supplements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickSetupItem}
          onPress={() => router.push('/contest/create-protocol?template=progress-photos')}
        >
          <Camera size={24} color="#FFEAA7" />
          <Text style={styles.quickSetupText}>Progress Photos</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Automated Protocols',
          headerRight: () => (
            <TouchableOpacity onPress={handleCreateProtocol}>
              <Plus size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.contestName}>{currentPrep.contestName}</Text>
          <Text style={styles.headerDescription}>
            Automate your contest prep with intelligent protocols that adapt to your progress.
          </Text>
        </View>

        {contestProtocols.length === 0 ? (
          <>
            {renderQuickSetup()}
            
            <View style={styles.emptyProtocols}>
              <Zap size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyProtocolsTitle}>No Protocols Active</Text>
              <Text style={styles.emptyProtocolsDescription}>
                Create automated protocols to streamline your contest prep and ensure consistency.
              </Text>
              <Button
                title="Create First Protocol"
                onPress={handleCreateProtocol}
                style={styles.createButton}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.activeProtocols}>
              <Text style={styles.sectionTitle}>Active Protocols</Text>
              {contestProtocols.filter(p => p.isActive).map(renderProtocolCard)}
            </View>
            
            {contestProtocols.some(p => !p.isActive) && (
              <View style={styles.inactiveProtocols}>
                <Text style={styles.sectionTitle}>Inactive Protocols</Text>
                {contestProtocols.filter(p => !p.isActive).map(renderProtocolCard)}
              </View>
            )}
            
            {renderQuickSetup()}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  contestName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  activeProtocols: {
    padding: 20,
    paddingTop: 10,
  },
  inactiveProtocols: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  protocolCard: {
    marginBottom: 16,
  },
  protocolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  protocolName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  protocolControls: {
    marginLeft: 16,
  },
  protocolStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  protocolActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: 4,
  },
  quickSetupCard: {
    margin: 20,
    marginTop: 0,
  },
  quickSetupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  quickSetupDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  quickSetupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickSetupItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 80) / 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  quickSetupText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyProtocols: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    margin: 20,
  },
  emptyProtocolsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyProtocolsDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    minWidth: 200,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});