import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { healthyRecipes } from '@/constants/recipes';

export default function RecipesScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="RecipesScreen">
      <Stack.Screen options={{ title: 'Healthy Recipes' }} />

      {healthyRecipes.map((r) => (
        <Card key={r.id} style={styles.recipeCard}>
          <TouchableOpacity activeOpacity={0.9} style={styles.row} onPress={() => {}} testID={`recipe-${r.id}`}>
            {r.image ? (
              <Image source={{ uri: r.image }} style={styles.image} />
            ) : null}
            <View style={styles.info}>
              <Text style={styles.title}>{r.title}</Text>
              <Text style={styles.summary} numberOfLines={2}>{r.summary}</Text>
              <View style={styles.metaRow}>
                {typeof r.calories === 'number' && (
                  <Text style={styles.meta}>{r.calories} cal</Text>
                )}
                {typeof r.protein === 'number' && (
                  <Text style={styles.meta}>{r.protein}g P</Text>
                )}
                {r.time ? (
                  <Text style={styles.meta}>{r.time}</Text>
                ) : null}
              </View>
              <Text style={styles.subTitle}>Ingredients</Text>
              {r.ingredients.slice(0, 4).map((ing, i) => (
                <Text key={`${r.id}-ing-${i}`} style={styles.ingredient}>• { ing }</Text>
              ))}
            </View>
          </TouchableOpacity>
        </Card>
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { padding: 16 },
  recipeCard: { marginBottom: 12, padding: 12 },
  row: { flexDirection: 'row', gap: 12 },
  image: { width: 110, height: 110, borderRadius: 10 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  summary: { fontSize: 13, color: colors.text.secondary, marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  meta: { fontSize: 12, color: colors.text.secondary },
  subTitle: { fontSize: 13, color: colors.text.primary, fontWeight: '600', marginBottom: 4 },
  ingredient: { fontSize: 12, color: colors.text.secondary },
});
