import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { ScanLine, Camera, Upload, Volume2, Trash2, Info, ShieldAlert, ListChecks } from 'lucide-react-native';
import { generateText } from '@rork-ai/toolkit-sdk';

interface ParsedLabel {
  productName?: string;
  brand?: string;
  servingSize?: string;
  servingsPerContainer?: string;
  directions?: string;
  dosage?: string;
  ingredients: string[];
  activeIngredients?: string[];
  allergens?: string[];
  warnings?: string[];
  benefits?: string[];
  notes?: string[];
}

const emptyParsed: ParsedLabel = { ingredients: [] };

export default function LabelReader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [manualText, setManualText] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedLabel>(emptyParsed);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const askCameraPermission = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined');
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to scan labels.');
      }
    } catch (e) {
      console.log('[LabelReader] askCameraPermission error', e);
      setPermissionStatus('denied');
    }
  }, []);



  const takePhoto = useCallback(async () => {
    try {
      setErrorText(undefined);
      const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.8 });
      if (!res.canceled && res.assets && res.assets[0]) {
        const asset = res.assets[0];
        setImageBase64(asset.base64 ?? undefined);
        setImageUri(asset.uri ?? undefined);
      }

    } catch (e) {
      console.log('[LabelReader] takePhoto error', e);
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
      console.log('[LabelReader] pickImage error', e);
      setErrorText('Failed to pick image.');
    }
  }, []);

  const reset = useCallback(() => {
    setImageBase64(undefined);
    setImageUri(undefined);
    setManualText('');
    setParsed(emptyParsed);
    setErrorText(undefined);
  }, []);

  const canAnalyze = useMemo(() => !!imageBase64 || manualText.trim().length > 10, [imageBase64, manualText]);

  const analyze = useCallback(async () => {
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
      parts.push({ type: 'text', text: 'Extract supplement or medicine label into JSON with these fields: productName, brand, servingSize, servingsPerContainer, directions, dosage, ingredients[], activeIngredients[], allergens[], warnings[], benefits[], notes[]. Keep arrays unique, concise. If information is missing, omit the field.' });
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
          directions: typeof parsedJson.directions === 'string' ? parsedJson.directions : undefined,
          dosage: typeof parsedJson.dosage === 'string' ? parsedJson.dosage : undefined,
          ingredients: Array.isArray(parsedJson.ingredients) ? parsedJson.ingredients.filter((x: unknown) => typeof x === 'string') : [],
          activeIngredients: Array.isArray(parsedJson.activeIngredients) ? parsedJson.activeIngredients.filter((x: unknown) => typeof x === 'string') : undefined,
          allergens: Array.isArray(parsedJson.allergens) ? parsedJson.allergens.filter((x: unknown) => typeof x === 'string') : undefined,
          warnings: Array.isArray(parsedJson.warnings) ? parsedJson.warnings.filter((x: unknown) => typeof x === 'string') : undefined,
          benefits: Array.isArray(parsedJson.benefits) ? parsedJson.benefits.filter((x: unknown) => typeof x === 'string') : undefined,
          notes: Array.isArray(parsedJson.notes) ? parsedJson.notes.filter((x: unknown) => typeof x === 'string') : undefined,
        };
      } catch (parseErr) {
        console.log('[LabelReader] JSON parse failed, got text:', text);
        setErrorText('Analyzer returned unexpected format. Try another photo or paste the text.');
      }

      const cleaned: ParsedLabel = {
        productName: r.productName,
        brand: r.brand,
        servingSize: r.servingSize,
        servingsPerContainer: r.servingsPerContainer,
        directions: r.directions,
        dosage: r.dosage,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        activeIngredients: r.activeIngredients,
        allergens: r.allergens,
        warnings: r.warnings,
        benefits: r.benefits,
        notes: r.notes,
      };

      setParsed(cleaned);
    } catch (e) {
      console.log('[LabelReader] analyze error', e);
      setErrorText('Could not analyze the label. Please try a clearer photo or paste the text.');
    } finally {
      setLoading(false);
    }
  }, [canAnalyze, imageBase64, manualText]);

  const readAloud = useCallback(() => {
    try {
      const summary = [
        parsed.productName ? `${parsed.productName}${parsed.brand ? ' by ' + parsed.brand : ''}` : undefined,
        parsed.servingSize ? `Serving size: ${parsed.servingSize}` : undefined,
        parsed.dosage ? `Dosage: ${parsed.dosage}` : undefined,
        parsed.ingredients && parsed.ingredients.length ? `Ingredients: ${parsed.ingredients.join(', ')}` : undefined,
        parsed.allergens && parsed.allergens.length ? `Allergens: ${parsed.allergens.join(', ')}` : undefined,
        parsed.warnings && parsed.warnings.length ? `Warnings: ${parsed.warnings.join('. ')}` : undefined,
      ].filter(Boolean).join('. ');

      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(summary);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } else {
        Alert.alert('Read aloud', summary.length > 0 ? summary : 'No details to read yet.');
      }
    } catch (e) {
      console.log('[LabelReader] readAloud error', e);
    }
  }, [parsed]);

  const renderImage = () => {
    if (!imageUri) return null;
    return (
      <View style={styles.previewBox}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
      </View>
    );
  };

  const Section = ({ title, items, type }: { title: string; items?: string[]; type: 'good' | 'warn' | 'neutral' }) => {
    if (!items || items.length === 0) return null;
    return (
      <Card style={styles.sectionCard} testID={`section-${title}`}>
        <View style={styles.sectionHeader}>
          {type === 'warn' ? <ShieldAlert color={colors.status.warning} size={18} /> : type === 'good' ? <ListChecks color={colors.accent.primary} size={18} /> : <Info color={colors.text.secondary} size={18} />}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.tagsWrap}>
          {items.map((t, idx) => (
            <Badge key={`${title}-${idx}`} label={t} style={styles.tag} />
          ))}
        </View>
      </Card>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: Math.max(16, insets.bottom) }]} testID="label-reader-screen">
      <LinearGradient colors={colors.gradient.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.header, { paddingTop: 14 + insets.top }] }>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" testID="back-button">
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <ScanLine color={colors.text.primary} size={20} />
            <Text style={styles.title}>Label Reader</Text>
          </View>
          <View style={styles.rightSpacer} />
        </View>
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
            placeholder="e.g., Supplement Facts: Serving size 2 capsules..."
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
            title={loading ? 'Analyzing…' : 'Analyze Label'}
            onPress={analyze}
            disabled={!canAnalyze || loading}
            fullWidth
            testID="analyze-button"
            rightIcon={loading ? <ActivityIndicator color={colors.text.primary} /> : undefined}
          />
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

        {parsed ? (
          <View style={styles.resultWrap}>
            {(parsed.productName || parsed.brand) && (
              <Card style={styles.productCard} testID="product-card">
                <Text style={styles.productTitle}>{parsed.productName ?? 'Supplement'}</Text>
                {parsed.brand ? <Text style={styles.productBrand}>{parsed.brand}</Text> : null}
                <View style={styles.productMetaRow}>
                  {parsed.servingSize ? <Badge label={`Serving: ${parsed.servingSize}`} /> : null}
                  {parsed.servingsPerContainer ? <Badge label={`${parsed.servingsPerContainer} per container`} /> : null}
                  {parsed.dosage ? <Badge label={`Dosage: ${parsed.dosage}`} /> : null}
                </View>
              </Card>
            )}

            <Section title="Active Ingredients" items={parsed.activeIngredients} type="good" />
            <Section title="Ingredients" items={parsed.ingredients} type="neutral" />
            <Section title="Allergens" items={parsed.allergens} type="warn" />
            <Section title="Warnings" items={parsed.warnings} type="warn" />
            <Section title="Benefits" items={parsed.benefits} type="good" />

            {parsed.directions ? (
              <Card style={styles.sectionCard} testID="directions-card">
                <View style={styles.sectionHeader}>
                  <ListChecks color={colors.accent.primary} size={18} />
                  <Text style={styles.sectionTitle}>Directions</Text>
                </View>
                <Text style={styles.paragraph}>{parsed.directions}</Text>
              </Card>
            ) : null}

            {parsed.notes && parsed.notes.length > 0 ? (
              <Card style={styles.sectionCard} testID="notes-card">
                <View style={styles.sectionHeader}>
                  <Info color={colors.text.secondary} size={18} />
                  <Text style={styles.sectionTitle}>Notes</Text>
                </View>
                <View style={styles.tagsWrap}>
                  {parsed.notes.map((n, i) => (
                    <Badge key={`note-${i}`} label={n} style={styles.tag} />
                  ))}
                </View>
              </Card>
            ) : null}
          </View>
        ) : null}
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
  title: { color: colors.text.primary, fontSize: 18, fontWeight: '700' },
  rightSpacer: { width: 48 },

  content: { padding: 16 },
  actionsRow: {},
  previewBox: { borderRadius: 12, overflow: 'hidden', height: 220, marginBottom: 12, backgroundColor: colors.background.secondary },
  previewImage: { width: '100%', height: '100%' },

  manualBox: { marginTop: 12 },
  label: { marginBottom: 8, color: colors.text.secondary },

  primaryActions: { marginTop: 12 },
  errorText: { color: colors.status.error, marginTop: 8 },

  resultWrap: { marginTop: 16 },
  productCard: {},
  productTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  productBrand: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
  productMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },

  sectionCard: { marginTop: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text.primary },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {},
  paragraph: { color: colors.text.primary, lineHeight: 20 },
});
