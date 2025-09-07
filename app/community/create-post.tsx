import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Camera,
  Image as ImageIcon,
  Hash,
  MapPin,
  Users,
  X,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export default function CreatePostScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const suggestedTags = [
    'fitness', 'nutrition', 'workout', 'progress', 'motivation',
    'healthy', 'strength', 'cardio', 'yoga', 'running',
    'weightloss', 'muscle', 'transformation', 'goals'
  ];

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something to share!');
      return;
    }

    setIsPosting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPosting(false);
      Alert.alert(
        'Post Shared!',
        'Your post has been shared with the community.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Create Post',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Button
              title="Post"
              size="small"
              onPress={handlePost}
              loading={isPosting}
              disabled={!content.trim() || isPosting}
            />
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.postCard}>
          <View style={styles.userHeader}>
            <Avatar
              source="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500"
              size="medium"
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>You</Text>
              <Text style={styles.visibility}>Public post</Text>
            </View>
          </View>
          
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind? Share your fitness journey, achievements, or tips with the community..."
            placeholderTextColor={colors.text.tertiary}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            maxLength={500}
          />
          
          <View style={styles.mediaButtons}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => Alert.alert('Camera', 'Feature coming soon!')}
            >
              <Camera size={20} color={colors.accent.primary} />
              <Text style={styles.mediaButtonText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => Alert.alert('Gallery', 'Feature coming soon!')}
            >
              <ImageIcon size={20} color={colors.accent.primary} />
              <Text style={styles.mediaButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => Alert.alert('Location', 'Feature coming soon!')}
            >
              <MapPin size={20} color={colors.accent.primary} />
              <Text style={styles.mediaButtonText}>Location</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        <Card style={styles.tagsCard}>
          <View style={styles.tagsHeader}>
            <Hash size={20} color={colors.accent.primary} />
            <Text style={styles.tagsTitle}>Add Tags</Text>
          </View>
          
          {selectedTags.length > 0 && (
            <View style={styles.selectedTags}>
              {selectedTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.selectedTag}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Text style={styles.selectedTagText}>#{tag}</Text>
                  <X size={14} color={colors.text.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Text style={styles.suggestedTitle}>Suggested Tags</Text>
          <View style={styles.suggestedTags}>
            {suggestedTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.suggestedTag,
                  selectedTags.includes(tag) && styles.suggestedTagSelected
                ]}
                onPress={() => handleAddTag(tag)}
                disabled={selectedTags.includes(tag)}
              >
                <Text style={[
                  styles.suggestedTagText,
                  selectedTags.includes(tag) && styles.suggestedTagTextSelected
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.tagLimit}>
            {selectedTags.length}/5 tags selected
          </Text>
        </Card>
        
        <Card style={styles.audienceCard}>
          <View style={styles.audienceHeader}>
            <Users size={20} color={colors.accent.primary} />
            <Text style={styles.audienceTitle}>Audience</Text>
          </View>
          
          <View style={styles.audienceOptions}>
            <TouchableOpacity style={styles.audienceOption}>
              <View style={styles.audienceOptionContent}>
                <Text style={styles.audienceOptionTitle}>Public</Text>
                <Text style={styles.audienceOptionDescription}>
                  Anyone in the community can see this post
                </Text>
              </View>
              <View style={styles.radioSelected} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.audienceOption}>
              <View style={styles.audienceOptionContent}>
                <Text style={styles.audienceOptionTitle}>Followers Only</Text>
                <Text style={styles.audienceOptionDescription}>
                  Only people who follow you can see this post
                </Text>
              </View>
              <View style={styles.radio} />
            </TouchableOpacity>
          </View>
        </Card>
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
    padding: 16,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  visibility: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  contentInput: {
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
  },
  mediaButtonText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  tagsCard: {
    marginBottom: 16,
    padding: 16,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.accent.primary,
    borderRadius: 16,
  },
  selectedTagText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  suggestedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  suggestedTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  suggestedTagSelected: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.accent.primary,
  },
  suggestedTagText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  suggestedTagTextSelected: {
    color: colors.accent.primary,
    fontWeight: '500',
  },
  tagLimit: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'right',
  },
  audienceCard: {
    marginBottom: 16,
    padding: 16,
  },
  audienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  audienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  audienceOptions: {
    gap: 12,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    gap: 12,
  },
  audienceOptionContent: {
    flex: 1,
  },
  audienceOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  audienceOptionDescription: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent.primary,
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
});