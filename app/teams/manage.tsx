import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Target, 
  TrendingUp,
  MapPin,
  Clock,
  Star,
  UserPlus,
  Settings,
  BarChart3
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TeamManagement, TeamMember } from '@/types/workout';

export default function TeamManagementScreen() {
  const router = useRouter();
  
  const [teams, setTeams] = useState<TeamManagement[]>([
    {
      id: '1',
      name: 'Basketball Team A',
      coachId: 'coach1',
      members: [
        {
          userId: '1',
          name: 'John Smith',
          position: 'Point Guard',
          skillLevel: 'advanced',
          injuries: [],
          limitations: [],
          goals: ['improve shooting', 'increase speed'],
          attendance: 95,
          performance: {
            strength: 8,
            endurance: 7,
            flexibility: 6,
            technique: 9,
            consistency: 8,
            improvement: 15,
            lastAssessment: '2024-01-15'
          }
        },
        {
          userId: '2',
          name: 'Mike Johnson',
          position: 'Center',
          skillLevel: 'intermediate',
          injuries: ['knee strain'],
          limitations: ['limited jumping'],
          goals: ['build strength', 'improve mobility'],
          attendance: 88,
          performance: {
            strength: 9,
            endurance: 6,
            flexibility: 5,
            technique: 7,
            consistency: 7,
            improvement: 12,
            lastAssessment: '2024-01-10'
          }
        }
      ],
      skillLevel: 'mixed',
      sport: 'Basketball',
      season: 'inseason',
      goals: ['championship preparation', 'injury prevention'],
      trainingPhase: 'Competition Phase',
      meetingSchedule: [],
      equipment: ['full-gym', 'court'],
      facility: 'Main Gym',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Fitness Bootcamp',
      coachId: 'coach1',
      members: [
        {
          userId: '3',
          name: 'Sarah Wilson',
          skillLevel: 'beginner',
          injuries: [],
          limitations: [],
          goals: ['weight loss', 'general fitness'],
          attendance: 92,
          performance: {
            strength: 4,
            endurance: 5,
            flexibility: 6,
            technique: 5,
            consistency: 8,
            improvement: 25,
            lastAssessment: '2024-01-12'
          }
        },
        {
          userId: '4',
          name: 'David Brown',
          skillLevel: 'intermediate',
          injuries: ['lower back pain'],
          limitations: ['avoid heavy lifting'],
          goals: ['core strength', 'flexibility'],
          attendance: 85,
          performance: {
            strength: 6,
            endurance: 7,
            flexibility: 4,
            technique: 6,
            consistency: 6,
            improvement: 18,
            lastAssessment: '2024-01-08'
          }
        }
      ],
      skillLevel: 'mixed',
      goals: ['general fitness', 'weight management'],
      trainingPhase: 'General Conditioning',
      meetingSchedule: [],
      equipment: ['minimal', 'bodyweight'],
      facility: 'Outdoor Field',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-12'
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState<TeamManagement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }

    const newTeam: TeamManagement = {
      id: Date.now().toString(),
      name: newTeamName,
      coachId: 'coach1',
      members: [],
      skillLevel: 'mixed',
      goals: [],
      trainingPhase: 'General',
      meetingSchedule: [],
      equipment: [],
      facility: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTeams(prev => [...prev, newTeam]);
    setNewTeamName('');
    setShowCreateModal(false);
    Alert.alert('Success', 'Team created successfully!');
  };

  const handleDeleteTeam = (teamId: string) => {
    Alert.alert(
      'Delete Team',
      'Are you sure you want to delete this team? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setTeams(prev => prev.filter(team => team.id !== teamId));
            if (selectedTeam?.id === teamId) {
              setSelectedTeam(null);
            }
          }
        }
      ]
    );
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return colors.status.warning;
      case 'intermediate': return colors.accent.primary;
      case 'advanced': return colors.status.success;
      default: return colors.text.secondary;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 8) return colors.status.success;
    if (score >= 6) return colors.status.warning;
    return colors.status.error;
  };

  if (selectedTeam) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Team Header */}
        <View style={styles.teamHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedTeam(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.teamTitle}>{selectedTeam.name}</Text>
          
          <View style={styles.teamMeta}>
            <Badge text={selectedTeam.skillLevel} variant="default" />
            {selectedTeam.sport && (
              <Badge text={selectedTeam.sport} variant="success" />
            )}
            <Badge text={selectedTeam.season || 'General'} variant="warning" />
          </View>
          
          <View style={styles.teamStats}>
            <View style={styles.statItem}>
              <Users size={16} color={colors.text.secondary} />
              <Text style={styles.statText}>{selectedTeam.members.length} members</Text>
            </View>
            
            <View style={styles.statItem}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.statText}>{selectedTeam.facility}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Target size={16} color={colors.text.secondary} />
              <Text style={styles.statText}>{selectedTeam.trainingPhase}</Text>
            </View>
          </View>
        </View>

        {/* Team Actions */}
        <View style={styles.teamActions}>
          <Button
            title="Add Member"
            variant="outline"
            size="small"
            onPress={() => Alert.alert('Coming Soon', 'Add member feature coming soon!')}
            icon={<UserPlus size={16} color={colors.accent.primary} />}
          />
          
          <Button
            title="Generate Workout"
            size="small"
            onPress={() => router.push('/workouts/generate-group')}
            icon={<Target size={16} color={colors.text.primary} />}
          />
          
          <Button
            title="Settings"
            variant="outline"
            size="small"
            onPress={() => Alert.alert('Coming Soon', 'Team settings coming soon!')}
            icon={<Settings size={16} color={colors.accent.primary} />}
          />
        </View>

        {/* Team Goals */}
        {selectedTeam.goals.length > 0 && (
          <Card style={styles.goalsCard}>
            <Text style={styles.cardTitle}>Team Goals</Text>
            <View style={styles.goalsList}>
              {selectedTeam.goals.map((goal, index) => (
                <View key={index} style={styles.goalItem}>
                  <Target size={14} color={colors.accent.primary} />
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Team Performance Overview */}
        <Card style={styles.performanceCard}>
          <Text style={styles.cardTitle}>Team Performance Overview</Text>
          
          <View style={styles.performanceMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Average Attendance</Text>
              <Text style={styles.metricValue}>
                {Math.round(selectedTeam.members.reduce((sum, member) => sum + member.attendance, 0) / selectedTeam.members.length)}%
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Average Improvement</Text>
              <Text style={styles.metricValue}>
                {Math.round(selectedTeam.members.reduce((sum, member) => sum + member.performance.improvement, 0) / selectedTeam.members.length)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.skillBreakdown}>
            <Text style={styles.skillTitle}>Skill Level Distribution</Text>
            <View style={styles.skillBars}>
              {['beginner', 'intermediate', 'advanced'].map(level => {
                const count = selectedTeam.members.filter(m => m.skillLevel === level).length;
                const percentage = (count / selectedTeam.members.length) * 100;
                
                return (
                  <View key={level} style={styles.skillBar}>
                    <Text style={styles.skillLabel}>{level}</Text>
                    <View style={styles.skillBarContainer}>
                      <ProgressBar 
                        progress={percentage} 
                        color={getSkillLevelColor(level)}
                        height={8}
                      />
                      <Text style={styles.skillCount}>{count}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>

        {/* Team Members */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Team Members</Text>
          
          {selectedTeam.members.map((member) => (
            <Card key={member.userId} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  {member.position && (
                    <Text style={styles.memberPosition}>{member.position}</Text>
                  )}
                </View>
                
                <View style={styles.memberBadges}>
                  <Badge 
                    text={member.skillLevel} 
                    variant={member.skillLevel === 'advanced' ? 'success' : 'default'}
                  />
                  <View style={styles.attendanceContainer}>
                    <Text style={styles.attendanceText}>{member.attendance}%</Text>
                  </View>
                </View>
              </View>
              
              {/* Performance Metrics */}
              <View style={styles.performanceGrid}>
                {Object.entries(member.performance).map(([key, value]) => {
                  if (key === 'lastAssessment') return null;
                  
                  const displayValue = key === 'improvement' ? `${value}%` : value.toString();
                  const color = key === 'improvement' 
                    ? (value >= 15 ? colors.status.success : colors.status.warning)
                    : getPerformanceColor(value as number);
                  
                  return (
                    <View key={key} style={styles.performanceItem}>
                      <Text style={styles.performanceLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Text>
                      <Text style={[styles.performanceValue, { color }]}>
                        {displayValue}
                      </Text>
                    </View>
                  );
                })}
              </View>
              
              {/* Injuries & Limitations */}
              {(member.injuries.length > 0 || member.limitations.length > 0) && (
                <View style={styles.healthInfo}>
                  {member.injuries.length > 0 && (
                    <View style={styles.healthSection}>
                      <Text style={styles.healthTitle}>Injuries:</Text>
                      <Text style={styles.healthText}>{member.injuries.join(', ')}</Text>
                    </View>
                  )}
                  
                  {member.limitations.length > 0 && (
                    <View style={styles.healthSection}>
                      <Text style={styles.healthTitle}>Limitations:</Text>
                      <Text style={styles.healthText}>{member.limitations.join(', ')}</Text>
                    </View>
                  )}
                </View>
              )}
              
              {/* Goals */}
              {member.goals.length > 0 && (
                <View style={styles.memberGoals}>
                  <Text style={styles.goalsTitle}>Goals:</Text>
                  <View style={styles.goalTags}>
                    {member.goals.map((goal, index) => (
                      <View key={index} style={styles.goalTag}>
                        <Text style={styles.goalTagText}>{goal}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <View style={styles.memberActions}>
                <Button
                  title="View Profile"
                  variant="outline"
                  size="small"
                  onPress={() => Alert.alert('Coming Soon', 'Member profile coming soon!')}
                />
                
                <Button
                  title="Assessment"
                  size="small"
                  onPress={() => Alert.alert('Coming Soon', 'Assessment feature coming soon!')}
                  icon={<BarChart3 size={14} color={colors.text.primary} />}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Users size={24} color={colors.accent.primary} />
        </View>
        <Text style={styles.title}>Team Management</Text>
        <Text style={styles.subtitle}>
          Manage your teams, track member progress, and generate group workouts
        </Text>
      </View>

      {/* Create Team Button */}
      <View style={styles.createSection}>
        <Button
          title="Create New Team"
          onPress={() => setShowCreateModal(true)}
          fullWidth
          icon={<Plus size={18} color={colors.text.primary} />}
        />
      </View>

      {/* Teams List */}
      <View style={styles.teamsSection}>
        <Text style={styles.sectionTitle}>Your Teams</Text>
        
        {teams.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={styles.teamCard}
            onPress={() => setSelectedTeam(team)}
            activeOpacity={0.8}
          >
            <View style={styles.teamCardHeader}>
              <View style={styles.teamCardInfo}>
                <Text style={styles.teamCardName}>{team.name}</Text>
                <Text style={styles.teamCardMeta}>
                  {team.members.length} members • {team.facility}
                </Text>
              </View>
              
              <View style={styles.teamCardBadges}>
                <Badge text={team.skillLevel} variant="default" />
                {team.sport && (
                  <Badge text={team.sport} variant="success" />
                )}
              </View>
            </View>
            
            <View style={styles.teamCardStats}>
              <View style={styles.statItem}>
                <TrendingUp size={14} color={colors.status.success} />
                <Text style={styles.statText}>
                  {Math.round(team.members.reduce((sum, member) => sum + member.performance.improvement, 0) / team.members.length)}% avg improvement
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Clock size={14} color={colors.text.secondary} />
                <Text style={styles.statText}>
                  {Math.round(team.members.reduce((sum, member) => sum + member.attendance, 0) / team.members.length)}% attendance
                </Text>
              </View>
            </View>
            
            <View style={styles.teamCardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push('/workouts/generate-group');
                }}
              >
                <Target size={16} color={colors.accent.primary} />
                <Text style={styles.actionButtonText}>Generate Workout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  Alert.alert('Coming Soon', 'Edit team feature coming soon!');
                }}
              >
                <Edit3 size={16} color={colors.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteTeam(team.id);
                }}
              >
                <Trash2 size={16} color={colors.status.error} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Team Modal */}
      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Create New Team</Text>
            
            <Input
              placeholder="Team name"
              value={newTeamName}
              onChangeText={setNewTeamName}
              style={styles.modalInput}
            />
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => {
                  setShowCreateModal(false);
                  setNewTeamName('');
                }}
                style={styles.modalButton}
              />
              
              <Button
                title="Create"
                onPress={handleCreateTeam}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  createSection: {
    padding: 16,
  },
  teamsSection: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  teamCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teamCardInfo: {
    flex: 1,
  },
  teamCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  teamCardMeta: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  teamCardBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  teamCardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  teamCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  // Team Detail Styles
  teamHeader: {
    padding: 16,
    backgroundColor: colors.background.card,
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  teamTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  teamMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  teamStats: {
    flexDirection: 'row',
    gap: 16,
  },
  teamActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },
  goalsCard: {
    margin: 16,
    marginTop: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  goalsList: {
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  performanceCard: {
    margin: 16,
    marginTop: 0,
  },
  performanceMetrics: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  skillBreakdown: {
    marginTop: 16,
  },
  skillTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  skillBars: {
    gap: 8,
  },
  skillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skillLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    width: 80,
    textTransform: 'capitalize',
  },
  skillBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillCount: {
    fontSize: 12,
    color: colors.text.secondary,
    width: 20,
    textAlign: 'right',
  },
  membersSection: {
    padding: 16,
    paddingTop: 0,
  },
  memberCard: {
    marginBottom: 16,
    padding: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  memberPosition: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  memberBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attendanceContainer: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  attendanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  performanceItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  healthInfo: {
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  healthSection: {
    marginBottom: 8,
  },
  healthTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.status.error,
    marginBottom: 2,
  },
  healthText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  memberGoals: {
    marginBottom: 12,
  },
  goalsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  goalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  goalTag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  goalTagText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 12,
  },
});