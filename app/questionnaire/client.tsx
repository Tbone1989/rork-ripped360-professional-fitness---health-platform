import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ClientQuestionnaireForm from '@/components/questionnaire/ClientQuestionnaireForm';
import { ClientQuestionnaire } from '@/types/questionnaire';
import { Tutorial } from '@/components/ui/Tutorial';

export default function ClientQuestionnairePage() {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  const handleSubmit = (questionnaire: ClientQuestionnaire) => {
    console.log('Client questionnaire submitted:', questionnaire);

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

  const steps = useMemo(() => ([
    {
      title: 'Add a Profile Image',
      description: 'Paste a link to a clear headshot so your coach can recognize you.',
    },
    {
      title: 'Be Specific About Training',
      description: 'Tell us your training focus, preferred days/times, and experience to personalize your plan.',
    },
    {
      title: 'Be Honest About Health',
      description: 'List injuries, medications, and allergies accurately for safe programming.',
    },
  ]), []);

  return (
    <>
      <ClientQuestionnaireForm onSubmit={handleSubmit} />
      <Tutorial
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
        steps={steps}
        tutorialKey="client_questionnaire_v1"
      />
    </>
  );
}