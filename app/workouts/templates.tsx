import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  Target,
  Copy,
  Edit3,
  Trash2,
  Play,
  Share,
  Download
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { WorkoutTemplate } from '@/types/workout';

const categoryOptions = [
  { id: 'all', label: 'All' },
  { id: 'strength', label: 'Strength' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'hiit', label: 'HIIT' },
  { id: 'flexibility', label: 'Flexibility' },
  { id: 'sports-specific', label: 'Sports Specific' },
  { id: 'rehabilitation', label: 'Rehabilitation' },
];

const classTypeOptions = [
  { id: 'all', label: 'All' },
  { id: 'group', label: 'Group Class' },
  { id: 'team', label: 'Team Training' },
  { id: 'bootcamp', label: 'Bootcamp' },
  { id: 'circuit', label: 'Circuit Training' },
];

const difficultyOptions = [
  { id: 'all', label: 'All' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'mixed', label: 'Mixed Levels' },
];

export default function WorkoutTemplatesScreen() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['all']);
  const [selectedClassType, setSelectedClassType] = useState<string[]>(['all']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(['all']);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'my-templates' | 'public' | 'favorites'>('my-templates');

  // Mock templates data
  const [templates] = useState<WorkoutTemplate[]>([
    {
      id: '1',
      name: 'High-Intensity Basketball Training',
      description: 'A comprehensive basketball-specific workout focusing on agility, strength, and endurance for competitive teams.',
      coachId: 'coach1',
      category: 'sports-specific',
      classType: 'team',
      duration: 90,
      difficulty: 'advanced',
      maxParticipants: 15,
      exercises: [
        {
          exerciseId: '1',
          name: 'Dynamic Warm-up',
          description: 'Basketball-specific movement preparation',
          sets: 1,
          duration: 600,
          restTime: 0,
          intensity: 'low',
          modifications: [],
          equipment: ['cones', 'basketballs'],
          instructions: ['Set up cone drills', 'Include ball handling'],
          coachingCues: ['Focus on proper form', 'Increase intensity gradually'],
          safetyNotes: ['Watch for proper landing mechanics']
        },
        {
          exerciseId: '2',
          name: 'Plyometric Circuit',
          description: 'Explosive power development',
          sets: 3,
          reps: 12,
          restTime: 90,
          intensity: 'high',
          modifications: [],
          equipment: ['plyo boxes', 'hurdles'],
          instructions: ['4 stations', '3 minutes per station'],
          coachingCues: ['Land softly', 'Full extension on jumps'],
          safetyNotes: ['Proper landing technique essential']
        }
      ],
      equipment: ['basketballs', 'cones', 'plyo boxes'],
      spaceRequirements: ['full court', 'gym space'],
      tags: ['basketball', 'plyometrics', 'team sport'],
      isPublic: true,
      usageCount: 45,
      rating: 4.8,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Beginner Bootcamp Basics',
      description: 'Perfect introduction to fitness bootcamp training with modifications for all fitness levels.',
      coachId: 'coach1',
      category: 'cardio',
      classType: 'bootcamp',
      duration: 45,
      difficulty: 'beginner',
      maxParticipants: 25,
      exercises: [
        {
          exerciseId: '3',
          name: 'Bodyweight Circuit',
          description: 'Full body conditioning using bodyweight exercises',
          sets: 3,
          duration: 900,
          restTime: 60,
          intensity: 'moderate',
          modifications: [
            {
              id: '1',
              level: 'beginner',
              name: 'Modified Push-ups',
              description: 'Knee push-ups for beginners',
              repsModifier: 0.7
            }
          ],
          equipment: ['mats', 'water bottles'],
          instructions: ['6 stations', '2.5 minutes per station'],
          coachingCues: ['Focus on form over speed', 'Breathe consistently'],
          safetyNotes: ['Modify as needed', 'Stay hydrated']
        }
      ],
      equipment: ['mats', 'resistance bands'],
      spaceRequirements: ['outdoor field', 'large room'],
      tags: ['beginner-friendly', 'bodyweight', 'group fitness'],
      isPublic: true,
      usageCount: 78,
      rating: 4.6,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12'
    },
    {
      id: '3',
      name: 'Strength & Power Circuit',
      description: 'Advanced strength training circuit for experienced athletes focusing on compound movements.',
      coachId: 'coach2',
      category: 'strength',
      classType: 'group',
      duration: 60,
      difficulty: 'advanced',
      maxParticipants: 12,
      exercises: [],
      equipment: ['barbells', 'dumbbells', 'kettlebells'],
      spaceRequirements: ['weight room', 'full gym'],
      tags: ['strength', 'powerlifting', 'advanced'],
      isPublic: true,
      usageCount: 32,
      rating: 4.9,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-14'
    },
    {
      id: '4',
      name: 'Flexibility & Recovery Session',
      description: 'Comprehensive stretching and mobility routine for post-workout recovery.',
      coachId: 'coach1',
      category: 'flexibility',
      classType: 'group',
      duration: 30,
      difficulty: 'beginner',
      maxParticipants: 20,
      exercises: [],
      equipment: ['yoga mats', 'foam rollers', 'resistance bands'],
      spaceRequirements: ['studio space', 'quiet room'],
      tags: ['recovery', 'flexibility', 'wellness'],
      isPublic: false,
      usageCount: 15,
      rating: 4.7,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-16'
    }
  ]);

  const [favorites, setFavorites] = useState<string[]>(['2', '3']);

  const filteredTemplates = templates.filter(template => {
    // Filter by view mode
    if (viewMode === 'my-templates' && template.coachId !== 'coach1') return false;
    if (viewMode === 'public' && !template.isPublic) return false;
    if (viewMode === 'favorites' && !favorites.includes(template.id)) return false;

    // Filter by search query
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Filter by category
    if (!selectedCategory.includes('all') && !selectedCategory.includes(template.category)) {
      return false;
    }

    // Filter by class type
    if (!selectedClassType.includes('all') && !selectedClassType.includes(template.classType)) {
      return false;
    }

    // Filter by difficulty
    if (!selectedDifficulty.includes('all') && !selectedDifficulty.includes(template.difficulty)) {
      return false;
    }

    return true;
  });

  const handleUseTemplate = (template: WorkoutTemplate) => {
    Alert.alert(
      'Use Template',
      `Use "${template.name}" to generate a new workout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Template', 
          onPress: () => {
            // Navigate to generate screen with template data
            router.push('/workouts/generate-group');
            Alert.alert('Success', 'Template loaded! Customize and generate your workout.');
          }
        }
      ]
    );
  };

  const handleToggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleDeleteTemplate = (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Template deleted successfully!');
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.status.warning;
      case 'intermediate': return colors.accent.primary;
      case 'advanced': return colors.status.success;
      case 'mixed': return colors.text.secondary;
      default: return colors.text.secondary;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return colors.status.success;
      case 'cardio': return colors.accent.primary;
      case 'hiit': return colors.status.error;
      case 'flexibility': return colors.status.warning;
      case 'sports-specific': return '#8B5CF6';
      case 'rehabilitation': return '#06B6D4';
      default: return colors.text.secondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <BookOpen size={24} color={colors.accent.primary} />
        </View>
        <Text style={styles.title}>Workout Templates</Text>
        <Text style={styles.subtitle}>
          Save, share, and reuse your favorite workout configurations
        </Text>
      </View>

      {/* View Mode Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'my-templates' && styles.activeTab]}
          onPress={() => setViewMode('my-templates')}
        >
          <Text style={[styles.tabText, viewMode === 'my-templates' && styles.activeTabText]}>
            My Templates
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, viewMode === 'public' && styles.activeTab]}
          onPress={() => setViewMode('public')}
        >
          <Text style={[styles.tabText, viewMode === 'public' && styles.activeTabText]}>
            Public Library
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, viewMode === 'favorites' && styles.activeTab]}
          onPress={() => setViewMode('favorites')}
        >
          <Text style={[styles.tabText, viewMode === 'favorites' && styles.activeTabText]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.secondary} />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={colors.accent.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Category</Text>
            <ChipGroup
              options={categoryOptions}
              selectedIds={selectedCategory}
              onChange={setSelectedCategory}
              multiSelect={false}
              scrollable={true}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Class Type</Text>
            <ChipGroup
              options={classTypeOptions}
              selectedIds={selectedClassType}
              onChange={setSelectedClassType}
              multiSelect={false}
              scrollable={true}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Difficulty</Text>
            <ChipGroup
              options={difficultyOptions}
              selectedIds={selectedDifficulty}
              onChange={setSelectedDifficulty}
              multiSelect={false}
              scrollable={true}
            />
          </View>
        </View>
      )}

      {/* Create Template Button */}
      {viewMode === 'my-templates' && (
        <View style={styles.createSection}>
          <Button
            title="Create New Template"
            onPress={() => router.push('/workouts/generate-group')}
            fullWidth
            icon={<Plus size={18} color={colors.text.primary} />}
          />
        </View>
      )}

      {/* Templates List */}
      <View style={styles.templatesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {viewMode === 'my-templates' ? 'Your Templates' : 
             viewMode === 'public' ? 'Public Templates' : 'Favorite Templates'}
          </Text>
          <Text style={styles.resultsCount}>
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        {filteredTemplates.map((template) => (
          <Card key={template.id} style={styles.templateCard}>
            <View style={styles.templateHeader}>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleToggleFavorite(template.id)}
              >
                <Star 
                  size={20} 
                  color={favorites.includes(template.id) ? colors.status.warning : colors.text.tertiary}
                  fill={favorites.includes(template.id) ? colors.status.warning : 'transparent'}
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.templateMeta}>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={14} color={colors.text.secondary} />
                  <Text style={styles.metaText}>{template.duration} min</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Users size={14} color={colors.text.secondary} />
                  <Text style={styles.metaText}>Max {template.maxParticipants}</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Target size={14} color={colors.text.secondary} />
                  <Text style={styles.metaText}>{template.exercises.length} exercises</Text>
                </View>
              </View>
              
              <View style={styles.badgeRow}>
                <Badge 
                  variant="default"
                  style={{ backgroundColor: getCategoryColor(template.category) + '20' }}
                >{template.category}</Badge>
                <Badge 
                  variant="default"
                >{template.classType}</Badge>
                <Badge 
                  variant="default"
                  style={{ backgroundColor: getDifficultyColor(template.difficulty) + '20' }}
                >{template.difficulty}</Badge>
              </View>
            </View>
            
            {template.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {template.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {template.tags.length > 3 && (
                  <Text style={styles.moreTags}>+{template.tags.length - 3} more</Text>
                )}
              </View>
            )}
            
            <View style={styles.templateStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{template.usageCount}</Text>
                <Text style={styles.statLabel}>uses</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{template.rating}</Text>
                <Text style={styles.statLabel}>rating</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {new Date(template.updatedAt).toLocaleDateString()}
                </Text>
                <Text style={styles.statLabel}>updated</Text>
              </View>
            </View>
            
            <View style={styles.templateActions}>
              <Button
                title="Use Template"
                size="small"
                onPress={() => handleUseTemplate(template)}
                icon={<Play size={14} color={colors.text.primary} />}
              />
              
              <View style={styles.secondaryActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Coming Soon', 'Copy template feature coming soon!')}
                >
                  <Copy size={16} color={colors.text.secondary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Coming Soon', 'Share template feature coming soon!')}
                >
                  <Share size={16} color={colors.text.secondary} />
                </TouchableOpacity>
                
                {template.coachId === 'coach1' && (
                  <>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => Alert.alert('Coming Soon', 'Edit template feature coming soon!')}
                    >
                      <Edit3 size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 size={16} color={colors.status.error} />
                    </TouchableOpacity>
                  </>
                )}
                
                {viewMode === 'public' && template.coachId !== 'coach1' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Coming Soon', 'Download template feature coming soon!')}
                  >
                    <Download size={16} color={colors.accent.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
        ))}
        
        {filteredTemplates.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No templates found</Text>
            <Text style={styles.emptyDescription}>
              {viewMode === 'my-templates' 
                ? 'Create your first template by generating a workout and saving it.'
                : 'Try adjusting your search or filter criteria.'}
            </Text>
            {viewMode === 'my-templates' && (
              <Button
                title="Create Template"
                onPress={() => router.push('/workouts/generate-group')}
                style={styles.emptyButton}
                icon={<Plus size={16} color={colors.text.primary} />}
              />
            )}
          </View>
        )}
      </View>
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
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.accent.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.primary,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  createSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  templatesSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  templateCard: {
    marginBottom: 16,
    padding: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
    marginRight: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  favoriteButton: {
    padding: 4,
  },
  templateMeta: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  moreTags: {
    fontSize: 11,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  templateStats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
});