import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LinearGradient } from 'expo-linear-gradient';
import { ScanLine, Camera, Upload, Volume2, Trash2, Info, ShieldAlert, ListChecks, AlertTriangle, CheckCircle, XCircle, Leaf, Droplet } from 'lucide-react-native';
import { generateText } from '@rork/toolkit-sdk';

interface ParsedLabel {
  productName?: string;
  brand?: string;
  servingSize?: string;
  servingsPerContainer?: string;
  calories?: number;
  totalFat?: string;
  saturatedFat?: string;
  transFat?: string;
  cholesterol?: string;
  sodium?: string;
  totalCarbs?: string;
  fiber?: string;
  sugars?: string;
  addedSugars?: string;
  protein?: string;
  ingredients: string[];
  allergens?: string[];
  warnings?: string[];
  additives?: string[];
  preservatives?: string[];
  artificialIngredients?: string[];
}

interface HealthAnalysis {
  overallScore: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'avoid';
  phBalance: number;
  isBalanced: boolean;
  isPlantBased: boolean;
  isProcessed: boolean;
  healthImpacts: {
    positive: string[];
    negative: string[];
    concerns: string[];
  };
  dietAlignment: {
    wholeFoodBased: boolean;
    reasons: string[];
  };
  alternatives?: string[];
  detailedAnalysis: string;
}

const emptyParsed: ParsedLabel = { ingredients: [] };

export default function FoodLabelReader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [manualText, setManualText] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedLabel>(emptyParsed);
  const [analysis, setAnalysis] = useState<HealthAnalysis | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const takePhoto = useCallback(async () => {
    try {
      setErrorText(undefined);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to scan labels.');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.8 });
      if (!res.canceled && res.assets && res.assets[0]) {
        const asset = res.assets[0];
        setImageBase64(asset.base64 ?? undefined);
        setImageUri(asset.uri ?? undefined);
      }
    } catch (e) {
      console.log('[FoodLabelReader] takePhoto error', e);
      setErrorText('Failed to capture photo. Please try again.');
    }
  }, []);

  const pickImage = useCallback(async () => {
    try {
      setErrorText(undefined);
      const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.9 });
      if (!res.canceled && res.assets && res.assets[0]) {
        const asset = res.assets[0];
        setImageBase64(asset.base64 ?? undefined);
        setImageUri(asset.uri ?? undefined);
      }
    } catch (e) {
      console.log('[FoodLabelReader] pickImage error', e);
      setErrorText('Failed to pick image.');
    }
  }, []);

  const reset = useCallback(() => {
    setImageBase64(undefined);
    setImageUri(undefined);
    setManualText('');
    setParsed(emptyParsed);
    setAnalysis(undefined);
    setErrorText(undefined);
  }, []);

  const canAnalyze = useMemo(() => !!imageBase64 || manualText.trim().length > 10, [imageBase64, manualText]);

  const extractLabel = useCallback(async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setErrorText(undefined);
    try {
      const messages = [] as (
        | { role: 'user'; content: string }
        | { role: 'user'; content: ({ type: 'text'; text: string } | { type: 'image'; image: string })[] }
        | { role: 'assistant'; content: { type: 'text'; text: string }[] }
      )[];

      const parts: ({ type: 'text'; text: string } | { type: 'image'; image: string })[] = [];
      parts.push({ 
        type: 'text', 
        text: `Extract food product label into JSON with these fields: productName, brand, servingSize, servingsPerContainer, calories (number), totalFat, saturatedFat, transFat, cholesterol, sodium, totalCarbs, fiber, sugars, addedSugars, protein, ingredients[] (list all ingredients in order), allergens[], warnings[], additives[] (artificial colors, flavors, sweeteners), preservatives[] (BHA, BHT, sodium benzoate, etc), artificialIngredients[] (anything synthetic or highly processed). 

Be thorough with ingredients list. Include everything. Identify harmful additives, preservatives, artificial ingredients. If information is missing, omit the field. Return only valid JSON.` 
      });
      
      if (manualText.trim().length > 0) {
        parts.push({ type: 'text', text: manualText.trim() });
      }
      if (imageBase64) {
        parts.push({ type: 'image', image: `data:image/jpeg;base64,${imageBase64}` });
      }
      messages.push({ role: 'user', content: parts });

      const text = await generateText({ messages });

      let r: ParsedLabel = emptyParsed;
      try {
        const parsedJson = JSON.parse(text as unknown as string);
        r = {
          productName: typeof parsedJson.productName === 'string' ? parsedJson.productName : undefined,
          brand: typeof parsedJson.brand === 'string' ? parsedJson.brand : undefined,
          servingSize: typeof parsedJson.servingSize === 'string' ? parsedJson.servingSize : undefined,
          servingsPerContainer: typeof parsedJson.servingsPerContainer === 'string' ? parsedJson.servingsPerContainer : undefined,
          calories: typeof parsedJson.calories === 'number' ? parsedJson.calories : undefined,
          totalFat: typeof parsedJson.totalFat === 'string' ? parsedJson.totalFat : undefined,
          saturatedFat: typeof parsedJson.saturatedFat === 'string' ? parsedJson.saturatedFat : undefined,
          transFat: typeof parsedJson.transFat === 'string' ? parsedJson.transFat : undefined,
          cholesterol: typeof parsedJson.cholesterol === 'string' ? parsedJson.cholesterol : undefined,
          sodium: typeof parsedJson.sodium === 'string' ? parsedJson.sodium : undefined,
          totalCarbs: typeof parsedJson.totalCarbs === 'string' ? parsedJson.totalCarbs : undefined,
          fiber: typeof parsedJson.fiber === 'string' ? parsedJson.fiber : undefined,
          sugars: typeof parsedJson.sugars === 'string' ? parsedJson.sugars : undefined,
          addedSugars: typeof parsedJson.addedSugars === 'string' ? parsedJson.addedSugars : undefined,
          protein: typeof parsedJson.protein === 'string' ? parsedJson.protein : undefined,
          ingredients: Array.isArray(parsedJson.ingredients) ? parsedJson.ingredients.filter((x: unknown) => typeof x === 'string') : [],
          allergens: Array.isArray(parsedJson.allergens) ? parsedJson.allergens.filter((x: unknown) => typeof x === 'string') : undefined,
          warnings: Array.isArray(parsedJson.warnings) ? parsedJson.warnings.filter((x: unknown) => typeof x === 'string') : undefined,
          additives: Array.isArray(parsedJson.additives) ? parsedJson.additives.filter((x: unknown) => typeof x === 'string') : undefined,
          preservatives: Array.isArray(parsedJson.preservatives) ? parsedJson.preservatives.filter((x: unknown) => typeof x === 'string') : undefined,
          artificialIngredients: Array.isArray(parsedJson.artificialIngredients) ? parsedJson.artificialIngredients.filter((x: unknown) => typeof x === 'string') : undefined,
        };
      } catch (parseErr) {
        console.log('[FoodLabelReader] JSON parse failed, got text:', text);
        setErrorText('Could not parse label. Try another photo or paste the text.');
      }

      setParsed(r);
    } catch (e) {
      console.log('[FoodLabelReader] extractLabel error', e);
      setErrorText('Could not analyze the label. Please try a clearer photo or paste the text.');
    } finally {
      setLoading(false);
    }
  }, [canAnalyze, imageBase64, manualText]);

  const analyzeHealth = useCallback(async () => {
    if (!parsed || parsed.ingredients.length === 0) return;
    setAnalyzing(true);
    setErrorText(undefined);
    try {
      const prompt = `Analyze this food product for comprehensive health impact assessment.

Product: ${parsed.productName ?? 'Unknown'}
Brand: ${parsed.brand ?? 'Unknown'}
Ingredients: ${parsed.ingredients.join(', ')}
${parsed.additives && parsed.additives.length > 0 ? `Additives: ${parsed.additives.join(', ')}` : ''}
${parsed.preservatives && parsed.preservatives.length > 0 ? `Preservatives: ${parsed.preservatives.join(', ')}` : ''}
${parsed.artificialIngredients && parsed.artificialIngredients.length > 0 ? `Artificial: ${parsed.artificialIngredients.join(', ')}` : ''}
${parsed.sodium ? `Sodium: ${parsed.sodium}` : ''}
${parsed.sugars ? `Sugars: ${parsed.sugars}` : ''}
${parsed.addedSugars ? `Added Sugars: ${parsed.addedSugars}` : ''}
${parsed.fiber ? `Fiber: ${parsed.fiber}` : ''}

Provide comprehensive analysis as JSON:
{
  "overallScore": 0-100,
  "rating": "excellent" | "good" | "fair" | "poor" | "avoid",
  "phBalance": 0-100,
  "isBalanced": boolean,
  "isPlantBased": boolean,
  "isProcessed": boolean,
  "healthImpacts": {
    "positive": ["list positive health aspects"],
    "negative": ["list negative health aspects"],
    "concerns": ["list specific health concerns with dosage context"]
  },
  "dietAlignment": {
    "wholeFoodBased": boolean,
    "reasons": ["assessment of whole food vs processed food characteristics"]
  },
  "alternatives": ["suggest 3-5 healthier alternatives"],
  "detailedAnalysis": "2-3 paragraph detailed explanation of health impact, ingredient risks with dosage context, pH balance, processing level, and recommendations"
}

Consider:
- Ingredient quantity and dosage (not just presence)
- pH balance of foods
- Natural vs processed ingredients
- Whole food vs refined ingredients
- Harmful additives and their actual risk levels
- Nutritional density
- Environmental impact

Return only valid JSON.`;

      const text = await generateText(prompt);
      
      try {
        const analysisJson = JSON.parse(text as unknown as string);
        const healthAnalysis: HealthAnalysis = {
          overallScore: typeof analysisJson.overallScore === 'number' ? analysisJson.overallScore : 50,
          rating: ['excellent', 'good', 'fair', 'poor', 'avoid'].includes(analysisJson.rating) ? analysisJson.rating : 'fair',
          phBalance: typeof analysisJson.phBalance === 'number' ? analysisJson.phBalance : 50,
          isBalanced: analysisJson.isBalanced === true,
          isPlantBased: analysisJson.isPlantBased === true,
          isProcessed: analysisJson.isProcessed === true,
          healthImpacts: {
            positive: Array.isArray(analysisJson.healthImpacts?.positive) ? analysisJson.healthImpacts.positive : [],
            negative: Array.isArray(analysisJson.healthImpacts?.negative) ? analysisJson.healthImpacts.negative : [],
            concerns: Array.isArray(analysisJson.healthImpacts?.concerns) ? analysisJson.healthImpacts.concerns : [],
          },
          dietAlignment: {
            wholeFoodBased: analysisJson.dietAlignment?.wholeFoodBased === true,
            reasons: Array.isArray(analysisJson.dietAlignment?.reasons) ? analysisJson.dietAlignment.reasons : [],
          },
          alternatives: Array.isArray(analysisJson.alternatives) ? analysisJson.alternatives : undefined,
          detailedAnalysis: typeof analysisJson.detailedAnalysis === 'string' ? analysisJson.detailedAnalysis : 'Analysis unavailable',
        };
        setAnalysis(healthAnalysis);
      } catch (parseErr) {
        console.log('[FoodLabelReader] Analysis JSON parse failed:', text);
        setErrorText('Could not parse health analysis. Please try again.');
      }
    } catch (e) {
      console.log('[FoodLabelReader] analyzeHealth error', e);
      setErrorText('Could not analyze health impact. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }, [parsed]);

  const readAloud = useCallback(() => {
    try {
      const summary = [
        parsed.productName ? `${parsed.productName}${parsed.brand ? ' by ' + parsed.brand : ''}` : undefined,
        analysis ? `Health score: ${analysis.overallScore} out of 100. Rating: ${analysis.rating}` : undefined,
        analysis?.isBalanced ? 'This is a pH balanced food' : 'This food may be acidic',
        analysis?.dietAlignment.wholeFoodBased ? 'Whole food based' : 'Contains processed ingredients',
        parsed.ingredients && parsed.ingredients.length ? `Ingredients: ${parsed.ingredients.slice(0, 5).join(', ')}` : undefined,
      ].filter(Boolean).join('. ');

      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(summary);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } else {
        Alert.alert('Read aloud', summary.length > 0 ? summary : 'No details to read yet.');
      }
    } catch (e) {
      console.log('[FoodLabelReader] readAloud error', e);
    }
  }, [parsed, analysis]);

  const renderImage = () => {
    if (!imageUri) return null;
    return (
      <View style={styles.previewBox}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
      </View>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.status.success;
    if (score >= 60) return colors.status.info;
    if (score >= 40) return colors.status.warning;
    return colors.status.error;
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'excellent': return <CheckCircle color={colors.status.success} size={24} />;
      case 'good': return <CheckCircle color={colors.status.info} size={24} />;
      case 'fair': return <AlertTriangle color={colors.status.warning} size={24} />;
      case 'poor': return <XCircle color={colors.status.error} size={24} />;
      case 'avoid': return <ShieldAlert color={colors.status.error} size={24} />;
      default: return <Info color={colors.text.secondary} size={24} />;
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: Math.max(16, insets.bottom) }]} testID="food-label-reader-screen">
      <LinearGradient colors={colors.gradient.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.header, { paddingTop: 14 + insets.top }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" testID="back-button">
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <ScanLine color={colors.text.primary} size={20} />
            <Text style={styles.title}>Food Label Reader</Text>
          </View>
          <View style={styles.rightSpacer} />
        </View>
        <Text style={styles.subtitle}>Comprehensive health & nutrition analysis</Text>
      </LinearGradient>

      <View style={styles.content}>
        {renderImage()}

        <View style={styles.actionsRow}>
          <Button
            title="Scan with Camera"
            onPress={takePhoto}
            leftIcon={<Camera color={colors.text.primary} size={18} />}
            fullWidth
            testID="scan-camera"
          />
          <View style={{ height: 12 }} />
          <Button
            title="Upload Label Photo"
            variant="secondary"
            onPress={pickImage}
            leftIcon={<Upload color={colors.text.primary} size={18} />}
            fullWidth
            testID="upload-photo"
          />
        </View>

        <Card style={styles.manualBox}>
          <Text style={styles.label}>Or paste label text</Text>
          <Input
            value={manualText}
            onChangeText={setManualText}
            placeholder="e.g., Ingredients: Whole grain oats, sugar, salt..."
            multiline
            numberOfLines={5}
            testID="manual-text-input"
          />
        </Card>

        {errorText ? (
          <Text style={styles.errorText} testID="error-text">{errorText}</Text>
        ) : null}

        <View style={styles.primaryActions}>
          <Button
            title={loading ? 'Extracting…' : 'Extract Label'}
            onPress={extractLabel}
            disabled={!canAnalyze || loading}
            fullWidth
            testID="extract-button"
            rightIcon={loading ? <ActivityIndicator color={colors.text.primary} /> : undefined}
          />
          {parsed && parsed.ingredients.length > 0 && (
            <>
              <View style={{ height: 12 }} />
              <Button
                title={analyzing ? 'Analyzing Health…' : 'Analyze Health Impact'}
                onPress={analyzeHealth}
                variant="secondary"
                disabled={analyzing}
                fullWidth
                testID="analyze-health-button"
                rightIcon={analyzing ? <ActivityIndicator color={colors.text.primary} /> : undefined}
              />
            </>
          )}
          <View style={{ height: 12 }} />
          <Button
            title="Read Aloud"
            variant="outline"
            onPress={readAloud}
            disabled={!parsed || parsed.ingredients.length === 0}
            leftIcon={<Volume2 color={colors.accent.primary} size={18} />}
            fullWidth
            testID="read-aloud-button"
          />
          <View style={{ height: 12 }} />
          <Button
            title="Clear"
            variant="ghost"
            onPress={reset}
            leftIcon={<Trash2 color={colors.accent.primary} size={18} />}
            fullWidth
            testID="clear-button"
          />
        </View>

        {analysis && (
          <View style={styles.analysisWrap}>
            <Card style={styles.scoreCard} testID="score-card">
              <View style={styles.scoreHeader}>
                {getRatingIcon(analysis.rating)}
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreTitle}>Health Score</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(analysis.overallScore) }]}>
                    {analysis.overallScore}/100
                  </Text>
                  <Text style={styles.scoreRating}>{analysis.rating.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.badgesRow}>
                {analysis.isBalanced && (
                  <View style={[styles.badge, { backgroundColor: colors.status.success + '20' }]}>
                    <Droplet color={colors.status.success} size={14} />
                    <Text style={[styles.badgeText, { color: colors.status.success }]}>pH Balanced</Text>
                  </View>
                )}
                {analysis.isPlantBased && (
                  <View style={[styles.badge, { backgroundColor: colors.status.success + '20' }]}>
                    <Leaf color={colors.status.success} size={14} />
                    <Text style={[styles.badgeText, { color: colors.status.success }]}>Plant-Based</Text>
                  </View>
                )}
                {analysis.dietAlignment.wholeFoodBased && (
                  <View style={[styles.badge, { backgroundColor: colors.brand.PREMIUM + '20' }]}>
                    <CheckCircle color={colors.brand.PREMIUM} size={14} />
                    <Text style={[styles.badgeText, { color: colors.brand.PREMIUM }]}>Whole Food Based</Text>
                  </View>
                )}
                {analysis.isProcessed && (
                  <View style={[styles.badge, { backgroundColor: colors.status.warning + '20' }]}>
                    <AlertTriangle color={colors.status.warning} size={14} />
                    <Text style={[styles.badgeText, { color: colors.status.warning }]}>Processed</Text>
                  </View>
                )}
              </View>

              <View style={styles.phSection}>
                <Text style={styles.phLabel}>pH Balance Score</Text>
                <View style={styles.phBar}>
                  <View style={[styles.phFill, { width: `${analysis.phBalance}%`, backgroundColor: getScoreColor(analysis.phBalance) }]} />
                </View>
                <Text style={styles.phValue}>{analysis.phBalance}/100</Text>
              </View>
            </Card>

            {analysis.healthImpacts.positive.length > 0 && (
              <Card style={styles.impactCard} testID="positive-impacts">
                <View style={styles.impactHeader}>
                  <CheckCircle color={colors.status.success} size={18} />
                  <Text style={styles.impactTitle}>Positive Health Impacts</Text>
                </View>
                {analysis.healthImpacts.positive.map((item, idx) => (
                  <View key={`pos-${idx}`} style={styles.impactItem}>
                    <Text style={styles.impactBullet}>•</Text>
                    <Text style={styles.impactText}>{item}</Text>
                  </View>
                ))}
              </Card>
            )}

            {analysis.healthImpacts.negative.length > 0 && (
              <Card style={styles.impactCard} testID="negative-impacts">
                <View style={styles.impactHeader}>
                  <XCircle color={colors.status.error} size={18} />
                  <Text style={styles.impactTitle}>Negative Health Impacts</Text>
                </View>
                {analysis.healthImpacts.negative.map((item, idx) => (
                  <View key={`neg-${idx}`} style={styles.impactItem}>
                    <Text style={styles.impactBullet}>•</Text>
                    <Text style={styles.impactText}>{item}</Text>
                  </View>
                ))}
              </Card>
            )}

            {analysis.healthImpacts.concerns.length > 0 && (
              <Card style={styles.impactCard} testID="concerns">
                <View style={styles.impactHeader}>
                  <AlertTriangle color={colors.status.warning} size={18} />
                  <Text style={styles.impactTitle}>Health Concerns</Text>
                </View>
                {analysis.healthImpacts.concerns.map((item, idx) => (
                  <View key={`concern-${idx}`} style={styles.impactItem}>
                    <Text style={styles.impactBullet}>•</Text>
                    <Text style={styles.impactText}>{item}</Text>
                  </View>
                ))}
              </Card>
            )}

            {analysis.dietAlignment.reasons.length > 0 && (
              <Card style={styles.impactCard} testID="diet-alignment">
                <View style={styles.impactHeader}>
                  <Info color={colors.brand.PREMIUM} size={18} />
                  <Text style={styles.impactTitle}>Diet Quality Assessment</Text>
                </View>
                {analysis.dietAlignment.reasons.map((item, idx) => (
                  <View key={`diet-${idx}`} style={styles.impactItem}>
                    <Text style={styles.impactBullet}>•</Text>
                    <Text style={styles.impactText}>{item}</Text>
                  </View>
                ))}
              </Card>
            )}

            {analysis.alternatives && analysis.alternatives.length > 0 && (
              <Card style={styles.impactCard} testID="alternatives">
                <View style={styles.impactHeader}>
                  <Leaf color={colors.status.success} size={18} />
                  <Text style={styles.impactTitle}>Healthier Alternatives</Text>
                </View>
                {analysis.alternatives.map((item, idx) => (
                  <View key={`alt-${idx}`} style={styles.alternativeItem}>
                    <CheckCircle color={colors.status.success} size={14} />
                    <Text style={styles.alternativeText}>{item}</Text>
                  </View>
                ))}
              </Card>
            )}

            <Card style={styles.detailedCard} testID="detailed-analysis">
              <View style={styles.impactHeader}>
                <ListChecks color={colors.accent.primary} size={18} />
                <Text style={styles.impactTitle}>Detailed Analysis</Text>
              </View>
              <Text style={styles.detailedText}>{analysis.detailedAnalysis}</Text>
            </Card>
          </View>
        )}

        {parsed && parsed.ingredients.length > 0 && (
          <View style={styles.resultWrap}>
            {(parsed.productName || parsed.brand) && (
              <Card style={styles.productCard} testID="product-card">
                <Text style={styles.productTitle}>{parsed.productName ?? 'Food Product'}</Text>
                {parsed.brand ? <Text style={styles.productBrand}>{parsed.brand}</Text> : null}
                <View style={styles.productMetaRow}>
                  {parsed.servingSize ? <Badge label={`Serving: ${parsed.servingSize}`} /> : null}
                  {parsed.servingsPerContainer ? <Badge label={`${parsed.servingsPerContainer} servings`} /> : null}
                  {parsed.calories ? <Badge label={`${parsed.calories} cal`} /> : null}
                </View>
              </Card>
            )}

            {(parsed.totalFat || parsed.sodium || parsed.totalCarbs || parsed.protein) && (
              <Card style={styles.nutritionCard} testID="nutrition-facts">
                <Text style={styles.sectionTitle}>Nutrition Facts</Text>
                <View style={styles.nutritionGrid}>
                  {parsed.totalFat && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Total Fat</Text>
                      <Text style={styles.nutritionValue}>{parsed.totalFat}</Text>
                    </View>
                  )}
                  {parsed.saturatedFat && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Saturated Fat</Text>
                      <Text style={styles.nutritionValue}>{parsed.saturatedFat}</Text>
                    </View>
                  )}
                  {parsed.transFat && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Trans Fat</Text>
                      <Text style={styles.nutritionValue}>{parsed.transFat}</Text>
                    </View>
                  )}
                  {parsed.cholesterol && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Cholesterol</Text>
                      <Text style={styles.nutritionValue}>{parsed.cholesterol}</Text>
                    </View>
                  )}
                  {parsed.sodium && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Sodium</Text>
                      <Text style={styles.nutritionValue}>{parsed.sodium}</Text>
                    </View>
                  )}
                  {parsed.totalCarbs && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Total Carbs</Text>
                      <Text style={styles.nutritionValue}>{parsed.totalCarbs}</Text>
                    </View>
                  )}
                  {parsed.fiber && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Fiber</Text>
                      <Text style={styles.nutritionValue}>{parsed.fiber}</Text>
                    </View>
                  )}
                  {parsed.sugars && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Sugars</Text>
                      <Text style={styles.nutritionValue}>{parsed.sugars}</Text>
                    </View>
                  )}
                  {parsed.addedSugars && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Added Sugars</Text>
                      <Text style={styles.nutritionValue}>{parsed.addedSugars}</Text>
                    </View>
                  )}
                  {parsed.protein && (
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Protein</Text>
                      <Text style={styles.nutritionValue}>{parsed.protein}</Text>
                    </View>
                  )}
                </View>
              </Card>
            )}

            {parsed.ingredients.length > 0 && (
              <Card style={styles.sectionCard} testID="ingredients-card">
                <View style={styles.sectionHeader}>
                  <ListChecks color={colors.accent.primary} size={18} />
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                </View>
                <View style={styles.tagsWrap}>
                  {parsed.ingredients.map((t, idx) => (
                    <Badge key={`ing-${idx}`} label={t} style={styles.tag} />
                  ))}
                </View>
              </Card>
            )}

            {parsed.additives && parsed.additives.length > 0 && (
              <Card style={styles.sectionCard} testID="additives-card">
                <View style={styles.sectionHeader}>
                  <AlertTriangle color={colors.status.warning} size={18} />
                  <Text style={styles.sectionTitle}>Additives</Text>
                </View>
                <View style={styles.tagsWrap}>
                  {parsed.additives.map((t, idx) => (
                    <Badge key={`add-${idx}`} label={t} style={styles.tag} />
                  ))}
                </View>
              </Card>
            )}

            {parsed.preservatives && parsed.preservatives.length > 0 && (
              <Card style={styles.sectionCard} testID="preservatives-card">
                <View style={styles.sectionHeader}>
                  <ShieldAlert color={colors.status.error} size={18} />
                  <Text style={styles.sectionTitle}>Preservatives</Text>
                </View>
                <View style={styles.tagsWrap}>
                  {parsed.preservatives.map((t, idx) => (
                    <Badge key={`pres-${idx}`} label={t} style={styles.tag} />
                  ))}
                </View>
              </Card>
            )}

            {parsed.artificialIngredients && parsed.artificialIngredients.length > 0 && (
              <Card style={styles.sectionCard} testID="artificial-card">
                <View style={styles.sectionHeader}>
                  <XCircle color={colors.status.error} size={18} />
                  <Text style={styles.sectionTitle}>Artificial Ingredients</Text>
                </View>
                <View style={styles.tagsWrap}>
                  {parsed.artificialIngredients.map((t, idx) => (
                    <Badge key={`art-${idx}`} label={t} style={styles.tag} />
                  ))}
                </View>
              </Card>
            )}

            {parsed.allergens && parsed.allergens.length > 0 && (
              <Card style={styles.sectionCard} testID="allergens-card">
                <View style={styles.sectionHeader}>
                  <ShieldAlert color={colors.status.warning} size={18} />
                  <Text style={styles.sectionTitle}>Allergens</Text>
                </View>
                <View style={styles.tagsWrap}>
                  {parsed.allergens.map((t, idx) => (
                    <Badge key={`all-${idx}`} label={t} style={styles.tag} />
                  ))}
                </View>
              </Card>
            )}

            {parsed.warnings && parsed.warnings.length > 0 && (
              <Card style={styles.sectionCard} testID="warnings-card">
                <View style={styles.sectionHeader}>
                  <AlertTriangle color={colors.status.error} size={18} />
                  <Text style={styles.sectionTitle}>Warnings</Text>
                </View>
                <View style={styles.tagsWrap}>
                  {parsed.warnings.map((t, idx) => (
                    <Badge key={`warn-${idx}`} label={t} style={styles.tag} />
                  ))}
                </View>
              </Card>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 48 },
  header: { paddingTop: 14, paddingBottom: 14, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { paddingVertical: 8, paddingHorizontal: 8 },
  backText: { color: colors.text.primary, fontSize: 14 },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: colors.text.primary, fontSize: 18, fontWeight: '700' as const },
  subtitle: { color: colors.text.secondary, fontSize: 12, textAlign: 'center', marginTop: 4 },
  rightSpacer: { width: 48 },

  content: { padding: 16 },
  actionsRow: {},
  previewBox: { borderRadius: 12, overflow: 'hidden', height: 220, marginBottom: 12, backgroundColor: colors.background.secondary },
  previewImage: { width: '100%', height: '100%' },

  manualBox: { marginTop: 12 },
  label: { marginBottom: 8, color: colors.text.secondary },

  primaryActions: { marginTop: 12 },
  errorText: { color: colors.status.error, marginTop: 8 },

  analysisWrap: { marginTop: 16 },
  scoreCard: { padding: 20 },
  scoreHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  scoreInfo: { flex: 1 },
  scoreTitle: { fontSize: 14, color: colors.text.secondary, marginBottom: 4 },
  scoreValue: { fontSize: 32, fontWeight: '700' as const, marginBottom: 2 },
  scoreRating: { fontSize: 14, fontWeight: '600' as const, color: colors.text.secondary },

  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  badgeText: { fontSize: 12, fontWeight: '600' as const },

  phSection: { marginTop: 8 },
  phLabel: { fontSize: 14, color: colors.text.secondary, marginBottom: 8 },
  phBar: { height: 8, backgroundColor: colors.background.tertiary, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  phFill: { height: '100%', borderRadius: 4 },
  phValue: { fontSize: 12, color: colors.text.secondary, textAlign: 'right' },

  impactCard: { marginTop: 12, padding: 16 },
  impactHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  impactTitle: { fontSize: 16, fontWeight: '700' as const, color: colors.text.primary },
  impactItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  impactBullet: { color: colors.text.secondary, fontSize: 16, lineHeight: 20 },
  impactText: { flex: 1, color: colors.text.primary, fontSize: 14, lineHeight: 20 },

  alternativeItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, padding: 8, backgroundColor: colors.background.tertiary, borderRadius: 8 },
  alternativeText: { flex: 1, color: colors.text.primary, fontSize: 14 },

  detailedCard: { marginTop: 12, padding: 16 },
  detailedText: { color: colors.text.primary, fontSize: 14, lineHeight: 22 },

  resultWrap: { marginTop: 16 },
  productCard: {},
  productTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.text.primary },
  productBrand: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
  productMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },

  nutritionCard: { marginTop: 12, padding: 16 },
  nutritionGrid: { marginTop: 12, gap: 8 },
  nutritionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border.light },
  nutritionLabel: { fontSize: 14, color: colors.text.secondary },
  nutritionValue: { fontSize: 14, fontWeight: '600' as const, color: colors.text.primary },

  sectionCard: { marginTop: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: colors.text.primary },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {},
});
