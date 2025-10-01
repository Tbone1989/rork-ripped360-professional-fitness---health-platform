import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleAlert, Camera, ImageIcon, Trash2, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { generateText } from '@rork/toolkit-sdk';

interface AnalysisResult {
  verdict: 'good' | 'moderate' | 'avoid';
  score: number;
  category: string;
  summary: string;
  positives: string[];
  negatives: string[];
  warnings: string[];
  reasons: string[];
  keyNutrients: { name: string; amount: string; dailyValue?: string }[];
  additives: string[];
  allergens: string[];
  betterAlternatives: string[];
}

const initialResult: AnalysisResult = {
  verdict: 'moderate',
  score: 50,
  category: 'unknown',
  summary: '',
  positives: [],
  negatives: [],
  warnings: [],
  reasons: [],
  keyNutrients: [],
  additives: [],
  allergens: [],
  betterAlternatives: [],
};

export default function MealsLabelReaderScreen(): React.ReactElement {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const handleRequestPermission = useCallback(async () => {
    try {
      console.log('[LabelReader] Requesting camera permission');
      const res = await requestPermission();
      console.log('[LabelReader] Permission result', res);
      if (res?.granted) setCameraActive(true);
      else Alert.alert('Permission needed', 'Camera access is required to scan labels.');
    } catch (e) {
      console.error('[LabelReader] Permission error', e);
      Alert.alert('Error', 'Unable to request camera permission.');
    }
  }, [requestPermission]);

  const openCamera = useCallback(async () => {
    if (!permission?.granted) {
      await handleRequestPermission();
      return;
    }
    setCameraActive(true);
    setErrorText(null);
  }, [permission?.granted, handleRequestPermission]);

  const pickImage = useCallback(async () => {
    try {
      console.log('[LabelReader] Opening image library');
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1, base64: true });
      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (asset?.uri) {
        setImageUri(asset.uri);
        setResult(null);
      }
    } catch (e) {
      console.error('[LabelReader] Image pick error', e);
      setErrorText('Failed to open the photo library.');
    }
  }, []);

  const analyze = useCallback(async () => {
    if (!imageUri) {
      setErrorText('Please capture or select a label image first.');
      return;
    }
    try {
      setLoading(true);
      setErrorText(null);
      setResult(null);
      console.log('[LabelReader] Analyzing image', imageUri);

      const system =
        'You are a nutrition label analyst. Return STRICT JSON only. No prose. Keys: verdict (good|moderate|avoid), score (0-100), category, summary, positives[], negatives[], warnings[], reasons[], keyNutrients[{name, amount, dailyValue?}], additives[], allergens[], betterAlternatives[]. Keep arrays concise and user-safe. Consider sodium, added sugar, refined grains, seed oils, artificial additives, fiber, protein quality, serving size.';

      const prompt = `Analyze this nutrition label photo. Output JSON only. If unreadable, set verdict:"moderate", summary:"Image unclear" and include warnings. Provide everyday language.`;

      const jsonTemplate =
        '{"verdict":"good","score":80,"category":"cereal","summary":"...","positives":["..."],"negatives":["..."],"warnings":["..."],"reasons":["..."],"keyNutrients":[{"name":"Calories","amount":"190"},{"name":"Protein","amount":"6g"}],"additives":["BHT"],"allergens":["wheat"],"betterAlternatives":["Whole grain cereal with <6g sugar/serving"]}';

      const text = await generateText({
        messages: [
          { role: 'user', content: [ { type: 'text', text: system }, { type: 'image', image: imageUri } ] },
          { role: 'user', content: [ { type: 'text', text: prompt } ] },
          { role: 'assistant', content: jsonTemplate },
        ],
      });

      console.log('[LabelReader] Raw AI response', text);
      let parsed: AnalysisResult | null = null;
      try {
        parsed = JSON.parse(text) as AnalysisResult;
      } catch (e) {
        console.warn('[LabelReader] JSON parse failed, attempting to extract JSON');
        const match = text.match(/\{[\s\S]*\}$/);
        if (match) {
          try { parsed = JSON.parse(match[0]) as AnalysisResult; } catch {}
        }
      }
      if (!parsed) throw new Error('AI returned an unexpected format');

      const normalized: AnalysisResult = {
        ...initialResult,
        ...parsed,
        verdict: parsed.verdict === 'good' || parsed.verdict === 'avoid' ? parsed.verdict : 'moderate',
        score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : 50,
        positives: parsed.positives ?? [],
        negatives: parsed.negatives ?? [],
        warnings: parsed.warnings ?? [],
        reasons: parsed.reasons ?? [],
        keyNutrients: parsed.keyNutrients?.map((k) => ({ name: k.name, amount: k.amount, dailyValue: k.dailyValue })) ?? [],
        additives: parsed.additives ?? [],
        allergens: parsed.allergens ?? [],
        betterAlternatives: parsed.betterAlternatives ?? [],
      };

      setResult(normalized);
    } catch (e) {
      console.error('[LabelReader] Analyze error', e);
      setErrorText('Could not analyze the label. Please try a clearer photo.');
    } finally {
      setLoading(false);
    }
  }, [imageUri]);

  const capture = useCallback(async () => {
    try {
      if (!cameraRef.current) return;
      console.log('[LabelReader] Capturing photo');
      const photo = await cameraRef.current.takePictureAsync?.({ quality: 1, base64: false });
      const uri = (photo as unknown as { uri?: string })?.uri ?? null;
      if (uri) {
        setImageUri(uri);
        setCameraActive(false);
        setResult(null);
      }
    } catch (e) {
      console.error('[LabelReader] Capture error', e);
      setErrorText('Failed to capture photo.');
    }
  }, []);

  const verdictInfo = useMemo(() => {
    const v = result?.verdict ?? 'moderate';
    switch (v) {
      case 'good':
        return { color: '#10b981', Icon: CheckCircle2 };
      case 'avoid':
        return { color: '#ef4444', Icon: XCircle };
      default:
        return { color: '#f59e0b', Icon: Info };
    }
  }, [result?.verdict]);

  return (
    <ErrorBoundary>
      <Stack.Screen options={{ title: 'Food Label Reader' }} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container} testID="labelReaderContainer">
          <View style={styles.actionsRow}>
            <Button testID="openCameraBtn" onPress={openCamera} variant="secondary" title="Scan with Camera" leftIcon={<Camera size={18} color="#111827" />} />
            <Button testID="pickImageBtn" onPress={pickImage} title="Upload Photo" leftIcon={<ImageIcon size={18} color="#ffffff" />} />
          </View>

          {cameraActive && (
            <View style={styles.cameraWrap} testID="cameraWrap">
              <CameraView ref={cameraRef as unknown as React.RefObject<CameraView>} style={styles.camera} facing={'back'}>
                <View style={styles.cameraOverlay}>
                  <TouchableOpacity accessibilityRole="button" testID="captureBtn" onPress={capture} style={styles.shutter}>
                    <View style={styles.shutterInner} />
                  </TouchableOpacity>
                  <TouchableOpacity accessibilityRole="button" testID="closeCameraBtn" onPress={() => setCameraActive(false)} style={styles.closeCamera}>
                    <XCircle color="#fff" size={28} />
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          )}

          {imageUri && !cameraActive && (
            <Card testID="previewCard" style={styles.previewCard}>
              <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
              <View style={styles.previewActions}>
                <Button testID="analyzeBtn" title={loading ? 'Analyzing…' : 'Analyze Label'} onPress={analyze} disabled={loading} leftIcon={<Sparkles size={18} color="#ffffff" />} />
                <Button testID="removeImageBtn" title="Remove" onPress={() => { setImageUri(null); setResult(null); }} variant="ghost" leftIcon={<Trash2 size={18} color="#111827" />} />
              </View>
              {loading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#111827" />
                  <Text style={styles.loadingText}>Reading nutrition facts…</Text>
                </View>
              )}
            </Card>
          )}

          {errorText && (
            <View style={styles.errorBox} testID="errorBox">
              <CircleAlert color="#ef4444" size={18} />
              <Text style={styles.errorText}>{errorText}</Text>
            </View>
          )}

          {result && (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} testID="resultScroll">
              <Card style={styles.resultCard} testID="resultCard">
                <View style={styles.verdictRow}>
                  {React.createElement(verdictInfo.Icon, { color: verdictInfo.color, size: 20 })}
                  <Text style={[styles.verdictText, { color: verdictInfo.color }]}>{result.verdict.toUpperCase()}</Text>
                  <View style={styles.scoreWrap}>
                    <Text style={styles.scoreLabel}>Score</Text>
                    <ProgressBar progress={result.score / 100} />
                  </View>
                </View>
                {result.summary ? <Text style={styles.summary}>{result.summary}</Text> : null}
                <View style={styles.chipsRow}>
                  <Badge label={result.category || 'food'} />
                  {result.allergens?.slice(0, 3).map((a, i) => (
                    <Chip key={`allergen-${i}`} label={`Allergen: ${a}`} />
                  ))}
                </View>
              </Card>

              {result.keyNutrients?.length > 0 && (
                <Card style={styles.section}>
                  <Text style={styles.sectionTitle}>Key nutrients</Text>
                  <View style={styles.listWrap}>
                    {result.keyNutrients.map((n, i) => (
                      <View key={`nut-${i}`} style={styles.kvRow}>
                        <Text style={styles.kvKey}>{n.name}</Text>
                        <Text style={styles.kvVal}>
                          {n.amount}
                          {n.dailyValue ? ` • ${n.dailyValue}` : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>
              )}

              {result.positives?.length > 0 && (
                <Card style={styles.section}>
                  <Text style={styles.sectionTitle}>Positives</Text>
                  {result.positives.map((p, i) => (
                    <Text key={`pos-${i}`} style={styles.bullet}>• {p}</Text>
                  ))}
                </Card>
              )}

              {result.negatives?.length > 0 && (
                <Card style={styles.section}>
                  <Text style={styles.sectionTitle}>Concerns</Text>
                  {result.negatives.map((n, i) => (
                    <Text key={`neg-${i}`} style={styles.bullet}>• {n}</Text>
                  ))}
                </Card>
              )}

              {result.warnings?.length > 0 && (
                <Card style={styles.warningCard}>
                  <Text style={styles.sectionTitle}>Warnings</Text>
                  {result.warnings.map((w, i) => (
                    <Text key={`warn-${i}`} style={styles.warningText}>• {w}</Text>
                  ))}
                </Card>
              )}

              {(result.additives?.length ?? 0) > 0 && (
                <Card style={styles.section}>
                  <Text style={styles.sectionTitle}>Additives</Text>
                  <View style={styles.chipsRowWrap}>
                    {result.additives.map((a, i) => (
                      <Chip key={`add-${i}`} label={a} />
                    ))}
                  </View>
                </Card>
              )}

              {(result.betterAlternatives?.length ?? 0) > 0 && (
                <Card style={styles.section}>
                  <Text style={styles.sectionTitle}>Better alternatives</Text>
                  {result.betterAlternatives.map((alt, i) => (
                    <Text key={`alt-${i}`} style={styles.bullet}>• {alt}</Text>
                  ))}
                </Card>
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  cameraWrap: { borderRadius: 16, overflow: 'hidden', height: 420, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 24 },
  shutter: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  shutterInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff' },
  closeCamera: { position: 'absolute', top: 16, right: 16 },
  previewCard: { padding: 12 },
  preview: { width: '100%', height: 240, backgroundColor: '#0b1220', borderRadius: 12 },
  previewActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  loadingText: { color: '#9ca3af' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, backgroundColor: '#2b1111', borderWidth: 1, borderColor: '#ef4444' },
  errorText: { color: '#fecaca' },
  scroll: { flex: 1, marginTop: 12 },
  scrollContent: { paddingBottom: 40, gap: 12 },
  resultCard: { padding: 16 },
  verdictRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  verdictText: { fontSize: 16, fontWeight: '700' as const },
  scoreWrap: { flex: 1, marginLeft: 12 },
  scoreLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  summary: { color: '#e5e7eb', marginTop: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chipsRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700' as const, color: '#e5e7eb', marginBottom: 8 },
  listWrap: { gap: 8 },
  kvRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  kvKey: { color: '#9ca3af' },
  kvVal: { color: '#e5e7eb', fontWeight: '600' as const },
  bullet: { color: '#d1d5db', marginBottom: 6 },
  warningCard: { padding: 16, borderColor: '#f59e0b', borderWidth: 1, backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  warningText: { color: '#fbbf24' },
});
