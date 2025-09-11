import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, Play, Pause, RotateCcw, Timer, Target } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Pose {
  id: string;
  name: string;
  description: string;
  holdTime: number;
  tips: string[];
}

const mandatoryPoses: Pose[] = [
  {
    id: 'front-double-bicep',
    name: 'Front Double Bicep',
    description: 'Face forward, flex both biceps, spread lats, tighten abs',
    holdTime: 15,
    tips: ['Keep shoulders back', 'Flex abs hard', 'Show lat spread', 'Smile confidently']
  },
  {
    id: 'front-lat-spread',
    name: 'Front Lat Spread',
    description: 'Hands on hips, spread lats wide, show V-taper',
    holdTime: 15,
    tips: ['Push hands into hips', 'Spread lats as wide as possible', 'Keep chest up', 'Tighten core']
  },
  {
    id: 'side-chest',
    name: 'Side Chest',
    description: 'Turn sideways, flex chest and arms, show thickness',
    holdTime: 15,
    tips: ['Turn body 45 degrees', 'Flex chest hard', 'Show arm thickness', 'Keep back straight']
  },
  {
    id: 'back-double-bicep',
    name: 'Back Double Bicep',
    description: 'Turn around, flex biceps and back muscles',
    holdTime: 15,
    tips: ['Flex entire back', 'Show bicep peaks', 'Tighten glutes', 'Keep head up']
  },
  {
    id: 'rear-lat-spread',
    name: 'Rear Lat Spread',
    description: 'Back to judges, spread lats, show back width',
    holdTime: 15,
    tips: ['Spread lats maximally', 'Show back width', 'Flex rear delts', 'Keep stance wide']
  },
  {
    id: 'side-tricep',
    name: 'Side Tricep',
    description: 'Side view, flex tricep and leg, show definition',
    holdTime: 15,
    tips: ['Flex tricep hard', 'Show leg separation', 'Keep chest out', 'Flex calf']
  },
  {
    id: 'abs-thigh',
    name: 'Abs and Thigh',
    description: 'Front view, flex abs and front leg, show conditioning',
    holdTime: 15,
    tips: ['Vacuum abs', 'Flex front thigh', 'Show conditioning', 'Keep balance']
  }
];

export default function VirtualPosingScreen() {
  console.log('[VirtualPosingScreen] Component mounted');
  
  const [currentPose, setCurrentPose] = useState<Pose | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (sessionActive && currentPoseIndex < mandatoryPoses.length - 1) {
              // Auto advance to next pose
              setTimeout(() => {
                setCurrentPoseIndex(prev => prev + 1);
                setCurrentPose(mandatoryPoses[currentPoseIndex + 1]);
                setTimer(mandatoryPoses[currentPoseIndex + 1].holdTime);
                setIsRunning(true);
              }, 2000);
            } else if (sessionActive) {
              Alert.alert('Session Complete!', 'Great job! You\'ve completed all mandatory poses.');
              setSessionActive(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, sessionActive, currentPoseIndex]);

  const startPose = (pose: Pose) => {
    setCurrentPose(pose);
    setTimer(pose.holdTime);
    setIsRunning(true);
    setSessionActive(false);
  };

  const startFullSession = () => {
    setCurrentPoseIndex(0);
    setCurrentPose(mandatoryPoses[0]);
    setTimer(mandatoryPoses[0].holdTime);
    setIsRunning(true);
    setSessionActive(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (currentPose) {
      setTimer(currentPose.holdTime);
    }
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  console.log('[VirtualPosingScreen] Rendering with currentPose:', currentPose?.name);
  
  return (
    <View style={styles.container} testID="virtual-posing-screen">
      <Stack.Screen options={{ title: 'Virtual Posing Practice' }} />
      
      <View style={styles.testContainer}>
        <Text style={styles.testText}>Virtual Posing Coach is Working!</Text>
        <Text style={styles.testSubtext}>This page loaded successfully.</Text>
      </View>
      
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.heroCard}>
          <View style={styles.headerRow}>
            <Camera size={24} color={colors.accent.primary} />
            <Text style={styles.title}>Posing Practice</Text>
          </View>
          <Text style={styles.subtitle}>Practice mandatory poses with guided timers. Perfect your stage presentation.</Text>
          
          <Button
            title="Start Full Routine (7 Poses)"
            onPress={startFullSession}
            testID="start-full-session"
            style={styles.sessionButton}
          />
        </Card>

        {currentPose && (
          <Card style={styles.activeCard}>
            <View style={styles.poseHeader}>
              <Target size={20} color={colors.accent.primary} />
              <Text style={styles.poseName}>{currentPose.name}</Text>
              {sessionActive && (
                <Text style={styles.poseCounter}>{currentPoseIndex + 1}/7</Text>
              )}
            </View>
            
            <Text style={styles.poseDescription}>{currentPose.description}</Text>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
              <View style={styles.timerControls}>
                <TouchableOpacity style={styles.controlBtn} onPress={toggleTimer}>
                  {isRunning ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlBtn} onPress={resetTimer}>
                  <RotateCcw size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>Key Points:</Text>
              {currentPose.tips.map((tip, index) => (
                <Text key={index} style={styles.tip}>• {tip}</Text>
              ))}
            </View>
          </Card>
        )}

        <Card style={styles.posesCard}>
          <Text style={styles.sectionTitle}>Mandatory Poses</Text>
          <Text style={styles.sectionSubtitle}>Practice individual poses or run the full routine</Text>
          
          {mandatoryPoses.map((pose, index) => (
            <TouchableOpacity
              key={pose.id}
              style={[
                styles.poseItem,
                currentPose?.id === pose.id && styles.poseItemActive
              ]}
              onPress={() => startPose(pose)}
            >
              <View style={styles.poseItemContent}>
                <Text style={styles.poseItemName}>{pose.name}</Text>
                <Text style={styles.poseItemTime}>{pose.holdTime}s hold</Text>
              </View>
              <Timer size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </Card>

        <Card style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>Posing Tips</Text>
          <Text style={styles.generalTip}>• Practice in front of a mirror daily</Text>
          <Text style={styles.generalTip}>• Hold each pose for 15-30 seconds</Text>
          <Text style={styles.generalTip}>• Focus on smooth transitions</Text>
          <Text style={styles.generalTip}>• Practice your stage walk and quarter turns</Text>
          <Text style={styles.generalTip}>• Work on your confidence and stage presence</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  testContainer: { padding: 20, alignItems: 'center', backgroundColor: colors.accent.primary + '20', margin: 20, borderRadius: 12 },
  testText: { fontSize: 18, fontWeight: '600', color: colors.accent.primary, marginBottom: 4 },
  testSubtext: { fontSize: 14, color: colors.text.secondary },
  scroll: { flex: 1 },
  heroCard: { margin: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  subtitle: { fontSize: 14, color: colors.text.secondary, lineHeight: 20, marginBottom: 16 },
  sessionButton: { marginTop: 8 },
  activeCard: { marginHorizontal: 20, marginBottom: 16 },
  poseHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  poseName: { fontSize: 18, fontWeight: '600', color: colors.text.primary, flex: 1 },
  poseCounter: { fontSize: 14, color: colors.accent.primary, fontWeight: '600' },
  poseDescription: { fontSize: 14, color: colors.text.secondary, marginBottom: 16, lineHeight: 20 },
  timerContainer: { alignItems: 'center', marginBottom: 16 },
  timerText: { fontSize: 48, fontWeight: 'bold', color: colors.accent.primary, marginBottom: 12 },
  timerControls: { flexDirection: 'row', gap: 12 },
  controlBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent.primary, alignItems: 'center', justifyContent: 'center' },
  tipsSection: { borderTopWidth: 1, borderTopColor: colors.background.secondary, paddingTop: 16 },
  tipsTitle: { fontSize: 16, fontWeight: '600', color: colors.text.primary, marginBottom: 8 },
  tip: { fontSize: 14, color: colors.text.secondary, marginBottom: 4, lineHeight: 20 },
  posesCard: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary, marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: colors.text.secondary, marginBottom: 16 },
  poseItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 8, backgroundColor: colors.background.secondary },
  poseItemActive: { backgroundColor: colors.accent.primary + '20', borderWidth: 1, borderColor: colors.accent.primary },
  poseItemContent: { flex: 1 },
  poseItemName: { fontSize: 16, fontWeight: '500', color: colors.text.primary, marginBottom: 2 },
  poseItemTime: { fontSize: 12, color: colors.text.secondary },
  tipsCard: { marginHorizontal: 20, marginBottom: 20 },
  generalTip: { fontSize: 14, color: colors.text.secondary, marginBottom: 6, lineHeight: 20 },
});