import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Share,
  Send,
  MoreHorizontal,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
  tags: string[];
}

const mockPost: Post = {
  id: '1',
  userId: 'user1',
  userName: 'Sarah Johnson',
  userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=500',
  content: 'Just completed my first 5K run! 🏃‍♀️ The training program from my coach really paid off. Feeling stronger every day! #FitnessJourney #5K',
  imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000',
  likes: 24,
  comments: 8,
  timestamp: '2 hours ago',
  isLiked: true,
  tags: ['fitness', 'running', 'achievement'],
};

const mockComments: Comment[] = [
  {
    id: '1',
    userId: 'user2',
    userName: 'Mike Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500',
    content: 'Congratulations! That\'s amazing progress. What training program did you follow?',
    timestamp: '1 hour ago',
    likes: 3,
    isLiked: false,
  },
  {
    id: '2',
    userId: 'user3',
    userName: 'Emily Rodriguez',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500',
    content: 'So inspiring! I\'m training for my first 5K too. Any tips for a beginner?',
    timestamp: '45 minutes ago',
    likes: 2,
    isLiked: true,
  },
  {
    id: '3',
    userId: 'user4',
    userName: 'Alex Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500',
    content: 'Great job! The feeling of accomplishment after your first 5K is unmatched. Keep it up! 💪',
    timestamp: '30 minutes ago',
    likes: 5,
    isLiked: false,
  },
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(mockPost);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');

  console.log('Post ID:', id);

  const handleLikePost = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'You',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500',
        content: newComment.trim(),
        timestamp: 'Just now',
        likes: 0,
        isLiked: false,
      };
      setComments(prev => [...prev, comment]);
      setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
      setNewComment('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: 'Post',
          headerRight: () => (
            <TouchableOpacity>
              <MoreHorizontal size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.postCard}>
          <View style={styles.postHeader}>
            <Avatar
              source={post.userAvatar}
              size="medium"
            />
            <View style={styles.postUserInfo}>
              <Text style={styles.postUserName}>{post.userName}</Text>
              <Text style={styles.postTimestamp}>{post.timestamp}</Text>
            </View>
          </View>
          
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.postTags}>
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                label={`#${tag}`}
                variant="default"
                size="small"
                style={styles.tagBadge}
              />
            ))}
          </View>
          
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.postAction}
              onPress={handleLikePost}
            >
              <Heart 
                size={20} 
                color={post.isLiked ? colors.status.error : colors.text.secondary}
                fill={post.isLiked ? colors.status.error : 'none'}
              />
              <Text style={styles.postActionText}>{post.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.postAction}>
              <MessageCircle size={20} color={colors.text.secondary} />
              <Text style={styles.postActionText}>{post.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.postAction}>
              <Share size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </Card>
        
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
          
          {comments.map((comment) => (
            <Card key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Avatar
                  source={comment.userAvatar}
                  size="small"
                />
                <View style={styles.commentUserInfo}>
                  <Text style={styles.commentUserName}>{comment.userName}</Text>
                  <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                </View>
              </View>
              
              <Text style={styles.commentContent}>{comment.content}</Text>
              
              <TouchableOpacity 
                style={styles.commentLike}
                onPress={() => handleLikeComment(comment.id)}
              >
                <Heart 
                  size={16} 
                  color={comment.isLiked ? colors.status.error : colors.text.secondary}
                  fill={comment.isLiked ? colors.status.error : 'none'}
                />
                <Text style={styles.commentLikeText}>{comment.likes}</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.commentInput}>
        <Avatar
          source="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500"
          size="small"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Add a comment..."
          placeholderTextColor={colors.text.secondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send 
            size={20} 
            color={newComment.trim() ? colors.accent.primary : colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  postCard: {
    margin: 16,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  postTimestamp: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 12,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: colors.background.tertiary,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  commentsSection: {
    padding: 16,
    paddingTop: 0,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  commentCard: {
    marginBottom: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  commentTimestamp: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 1,
  },
  commentContent: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  commentLikeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});