import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, FileText, TrendingUp, TrendingDown } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { BloodworkResult } from '@/types/medical';
import { Card } from '@/components/ui/Card';

interface BloodworkCardProps {
  result: BloodworkResult;
  onPress?: () => void;
}

export const BloodworkCard: React.FC<BloodworkCardProps> = ({
  result,
  onPress,
}) => {
  const router = useRouter();
  const date = new Date(result.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Count markers by status
  const statusCounts = result.markers.reduce(
    (acc, marker) => {
      acc[marker.status] = (acc[marker.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate overall trend
  const trends = result.markers
    .filter(marker => marker.trend)
    .reduce(
      (acc, marker) => {
        if (marker.trend) {
          acc[marker.trend] = (acc[marker.trend] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

  const trendUp = trends.up || 0;
  const trendDown = trends.down || 0;
  const trendStable = (trends.stable || 0);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/medical/bloodwork/${result.id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.labInfo}>
            <Text style={styles.labName}>{result.labName}</Text>
            <View style={styles.dateContainer}>
              <Calendar size={14} color={colors.text.secondary} />
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
          </View>
          <FileText size={20} color={colors.text.secondary} />
        </View>

        <View style={styles.divider} />

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{result.markers.length}</Text>
            <Text style={styles.statLabel}>Markers</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{statusCounts.normal || 0}</Text>
            <Text style={styles.statLabel}>Normal</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.warningText]}>
              {(statusCounts.high || 0) + (statusCounts.low || 0)}
            </Text>
            <Text style={styles.statLabel}>Flagged</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.errorText]}>
              {statusCounts.critical || 0}
            </Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
        </View>

        <View style={styles.trends}>
          <View style={styles.trendItem}>
            <TrendingUp size={16} color={colors.status.success} />
            <Text style={styles.trendValue}>{trendUp}</Text>
          </View>
          
          <View style={styles.trendItem}>
            <TrendingDown size={16} color={colors.status.error} />
            <Text style={styles.trendValue}>{trendDown}</Text>
          </View>
          
          <Text style={styles.trendStable}>{trendStable} stable</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labInfo: {
    flex: 1,
  },
  labName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  warningText: {
    color: colors.status.warning,
  },
  errorText: {
    color: colors.status.error,
  },
  trends: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  trendStable: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});