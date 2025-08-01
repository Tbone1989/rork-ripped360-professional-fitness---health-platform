import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ClientQuestionnaireForm from '@/components/questionnaire/ClientQuestionnaireForm';
import { ClientQuestionnaire } from '@/types/questionnaire';

export default function ClientQuestionnairePage() {
  const router = useRouter();

  const handleSubmit = (questionnaire: ClientQuestionnaire) => {
    console.log('Client questionnaire submitted:', questionnaire);
    
    // Here you would typically save to your backend/database
    // For now, we'll just show a success message
    
    Alert.alert(
      'Questionnaire Submitted',
      'Your health questionnaire has been submitted successfully. Your coach will review it and provide an assessment.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <ClientQuestionnaireForm 
      onSubmit={handleSubmit}
    />
  );
}