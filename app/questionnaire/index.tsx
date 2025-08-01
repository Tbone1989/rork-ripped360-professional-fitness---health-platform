import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  FileText, 
  User, 
  UserCheck, 
  ChevronRight,
  Heart,
  Shield
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';

export default function QuestionnairePage() {
  const router = useRouter();

  const questionnaires = [
    {
      id: 'client',
      title: 'Client Health Questionnaire',
      description: 'Complete your health and fitness assessment for your coach',
      icon: User,
      color: '#007AFF',
      route: '/questionnaire/client',
      userType: 'Client',
    },
    {
      id: 'coach-assessment',
      title: 'Coach Assessment Form',
      description: 'Review and assess client questionnaire responses',
      icon: UserCheck,
      color: '#34C759',
      route: '/questionnaire/coach-assessment',
      userType: 'Coach',
    },
  ];

  const features = [
    {
      icon: Heart,
      title: 'Health History',
      description: 'Comprehensive medical and health background assessment',
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Professional evaluation of training risks and limitations',
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Complete documentation for safe and effective training',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Health Questionnaires',
          headerBackTitle: 'Back'
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Health & Safety Assessment</Text>
          <Text style={styles.subtitle}>
            Comprehensive questionnaires to ensure safe and effective training programs
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Questionnaires</Text>
          
          {questionnaires.map((questionnaire) => (
            <TouchableOpacity
              key={questionnaire.id}
              style={styles.questionnaireCard}
              onPress={() => router.push(questionnaire.route as any)}
              activeOpacity={0.7}
            >
              <Card style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${questionnaire.color}15` }]}>
                    {React.createElement(questionnaire.icon, { 
                      size: 24, 
                      color: questionnaire.color 
                    })}
                  </View>
                  
                  <View style={styles.cardText}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{questionnaire.title}</Text>
                      <Text style={[styles.userType, { color: questionnaire.color }]}>
                        {questionnaire.userType}
                      </Text>
                    </View>
                    <Text style={styles.cardDescription}>
                      {questionnaire.description}
                    </Text>
                  </View>
                  
                  <ChevronRight size={20} color="#C7C7CC" />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                {React.createElement(feature.icon, { 
                  size: 20, 
                  color: '#007AFF' 
                })}
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Important Information</Text>
            <Text style={styles.infoText}>
              • All health information is kept confidential and secure{'\n'}
              • Questionnaires should be completed honestly and thoroughly{'\n'}
              • Medical clearance may be required before starting training{'\n'}
              • Coaches will review all responses before program design{'\n'}
              • Updates should be made when health status changes
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  questionnaireCard: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  userType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  infoSection: {
    padding: 16,
    paddingTop: 0,
  },
  infoCard: {
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD60A',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});