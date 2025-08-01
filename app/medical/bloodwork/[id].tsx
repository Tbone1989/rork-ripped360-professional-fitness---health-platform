import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { recentBloodworkResults } from '@/mocks/bloodwork';

export default function BloodworkDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const result = recentBloodworkResults.find(r => r.id === id);
  
  if (!result) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bloodwork result not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return colors.status.success;
      case 'high': return colors.status.warning;
      case 'low': return colors.status.warning;
      case 'critical': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle size={16} color={colors.status.success} />;
      case 'high': return <AlertTriangle size={16} color={colors.status.warning} />;
      case 'low': return <AlertTriangle size={16} color={colors.status.warning} />;
      case 'critical': return <AlertTriangle size={16} color={colors.status.error} />;
      default: return null;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} color={colors.status.success} />;
      case 'down': return <TrendingDown size={16} color={colors.status.error} />;
      case 'stable': return <Minus size={16} color={colors.text.secondary} />;
      default: return null;
    }
  };

  const date = new Date(result.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Bloodwork Results</Text>
          <View style={styles.headerDetails}>
            <View style={styles.headerDetail}>
              <Calendar size={16} color={colors.text.secondary} />
              <Text style={styles.headerDetailText}>{formattedDate}</Text>
            </View>
            <View style={styles.headerDetail}>
              <FileText size={16} color={colors.text.secondary} />
              <Text style={styles.headerDetailText}>{result.labName}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.summarySection}>
          <Card style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{result.markers.length}</Text>
                <Text style={styles.summaryLabel}>Total Markers</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.status.success }]}>
                  {result.markers.filter(m => m.status === 'normal').length}
                </Text>
                <Text style={styles.summaryLabel}>Normal</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.status.warning }]}>
                  {result.markers.filter(m => m.status === 'high' || m.status === 'low').length}
                </Text>
                <Text style={styles.summaryLabel}>Flagged</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.status.error }]}>
                  {result.markers.filter(m => m.status === 'critical').length}
                </Text>
                <Text style={styles.summaryLabel}>Critical</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.markersSection}>
          <Text style={styles.sectionTitle}>Biomarkers</Text>
          {result.markers.map((marker) => (
            <Card key={marker.id} style={styles.markerCard}>
              <View style={styles.markerHeader}>
                <View style={styles.markerInfo}>
                  <Text style={styles.markerName}>{marker.name}</Text>
                  <Badge
                    label={marker.status.toUpperCase()}
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(marker.status) }]}
                    size="small"
                  />
                </View>
                <View style={styles.markerIcons}>
                  {getStatusIcon(marker.status)}
                  {getTrendIcon(marker.trend)}
                </View>
              </View>
              
              <View style={styles.markerDetails}>
                <View style={styles.markerValue}>
                  <Text style={styles.currentValue}>
                    {marker.value} {marker.unit}
                  </Text>
                  {marker.previousValue && (
                    <Text style={styles.previousValue}>
                      Previous: {marker.previousValue} {marker.unit}
                    </Text>
                  )}
                </View>
                
                <View style={styles.referenceRange}>
                  <Text style={styles.rangeLabel}>Reference Range:</Text>
                  <Text style={styles.rangeValue}>
                    {marker.referenceRangeLow} - {marker.referenceRangeHigh} {marker.unit}
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressBar}>
                <View style={styles.progressTrack}>
                  <View 
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, Math.max(0, 
                          ((marker.value - marker.referenceRangeLow) / 
                          (marker.referenceRangeHigh - marker.referenceRangeLow)) * 100
                        ))}%`,
                        backgroundColor: getStatusColor(marker.status)
                      }
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>{marker.referenceRangeLow}</Text>
                  <Text style={styles.progressLabel}>{marker.referenceRangeHigh}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {result.notes && (
          <View style={styles.notesSection}>
            <Card style={styles.notesCard}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notesText}>{result.notes}</Text>
            </Card>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background.primary,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerDetails: {
    gap: 8,
  },
  headerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerDetailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  markersSection: {
    marginBottom: 24,
  },
  markerCard: {
    marginBottom: 16,
  },
  markerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  markerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  markerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  markerDetails: {
    marginBottom: 12,
  },
  markerValue: {
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  previousValue: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  referenceRange: {
    flexDirection: 'row',
    gap: 8,
  },
  rangeLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  rangeValue: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  progressBar: {
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesCard: {
    backgroundColor: colors.background.secondary,
  },
  notesText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});