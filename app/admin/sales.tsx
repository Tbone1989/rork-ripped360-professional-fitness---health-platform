import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,


  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Calendar, Download } from 'lucide-react-native';




interface SalesData {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  productSales: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  revenueHistory: Array<{
    date: string;
    revenue: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export default function SalesScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual tRPC query
  const salesData: SalesData = {
    totalRevenue: 125430.50,
    monthlyRevenue: 28450.00,
    weeklyRevenue: 7230.00,
    dailyRevenue: 1045.00,
    totalSubscriptions: 842,
    activeSubscriptions: 756,
    cancelledSubscriptions: 86,
    productSales: [
      { id: '1', name: 'Premium Membership', quantity: 245, revenue: 12250 },
      { id: '2', name: 'Elite Coaching', quantity: 89, revenue: 8900 },
      { id: '3', name: 'Nutrition Plans', quantity: 156, revenue: 4680 },
      { id: '4', name: 'Supplements Bundle', quantity: 312, revenue: 9360 },
      { id: '5', name: 'Workout Programs', quantity: 423, revenue: 8460 },
    ],
    revenueByCategory: [
      { category: 'Subscriptions', revenue: 45000, percentage: 35.9 },
      { category: 'Coaching', revenue: 32000, percentage: 25.5 },
      { category: 'Products', revenue: 28430, percentage: 22.7 },
      { category: 'Meal Plans', revenue: 20000, percentage: 15.9 },
    ],
    revenueHistory: [
      { date: 'Jan', revenue: 18500 },
      { date: 'Feb', revenue: 21200 },
      { date: 'Mar', revenue: 19800 },
      { date: 'Apr', revenue: 24500 },
      { date: 'May', revenue: 26700 },
      { date: 'Jun', revenue: 28450 },
    ],
    topCustomers: [
      { id: '1', name: 'John Smith', totalSpent: 2450, orderCount: 12 },
      { id: '2', name: 'Sarah Johnson', totalSpent: 1890, orderCount: 8 },
      { id: '3', name: 'Mike Wilson', totalSpent: 1650, orderCount: 15 },
    ],
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };



  const pieData = salesData.revenueByCategory.map((item, index) => ({
    name: item.category,
    population: item.revenue,
    color: ['#FF0000', '#FF4444', '#FF6666', '#FF8888'][index % 4],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />
        }
      >
        {/* Header Stats */}
        <View style={styles.header}>
          <Text style={styles.title}>Sales Analytics</Text>
          <View style={styles.timeRangeContainer}>
            {(['day', 'week', 'month', 'year', 'all'] as TimeRange[]).map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
                onPress={() => setTimeRange(range)}
              >
                <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Revenue Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <DollarSign size={20} color={colors.accent.primary} />
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
            <Text style={styles.statValue}>${salesData.totalRevenue.toLocaleString()}</Text>
            <View style={styles.statChange}>
              <TrendingUp size={16} color="#4CAF50" />
              <Text style={[styles.statChangeText, { color: '#4CAF50' }]}>+12.5%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Calendar size={20} color={colors.accent.primary} />
              <Text style={styles.statLabel}>Monthly Revenue</Text>
            </View>
            <Text style={styles.statValue}>${salesData.monthlyRevenue.toLocaleString()}</Text>
            <View style={styles.statChange}>
              <TrendingUp size={16} color="#4CAF50" />
              <Text style={[styles.statChangeText, { color: '#4CAF50' }]}>+8.3%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Users size={20} color={colors.accent.primary} />
              <Text style={styles.statLabel}>Active Subscriptions</Text>
            </View>
            <Text style={styles.statValue}>{salesData.activeSubscriptions}</Text>
            <View style={styles.statChange}>
              <TrendingUp size={16} color="#4CAF50" />
              <Text style={[styles.statChangeText, { color: '#4CAF50' }]}>+45</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Package size={20} color={colors.accent.primary} />
              <Text style={styles.statLabel}>Products Sold</Text>
            </View>
            <Text style={styles.statValue}>1,225</Text>
            <View style={styles.statChange}>
              <TrendingDown size={16} color="#F44336" />
              <Text style={[styles.statChangeText, { color: '#F44336' }]}>-3.2%</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          <View style={styles.simpleChart} testID="revenue-trend-chart">
            {(() => {
              try {
                console.log('Rendering simple revenue chart');
                const values = salesData.revenueHistory.map((i) => i.revenue);
                const max = Math.max(...values);
                return (
                  <View style={styles.barRow}>
                    {salesData.revenueHistory.map((item, idx) => {
                      const barHeight = Math.max(6, Math.round((item.revenue / (max || 1)) * 160));
                      return (
                        <View key={item.date + idx} style={styles.barWrapper}>
                          <View style={[styles.bar, { height: barHeight }]} />
                          <Text style={styles.barLabel}>{item.date}</Text>
                        </View>
                      );
                    })}
                  </View>
                );
              } catch (e) {
                console.error('Revenue chart render error', e);
                return (
                  <View style={styles.fallbackBox}>
                    <Text style={styles.fallbackText}>Unable to render chart</Text>
                  </View>
                );
              }
            })()}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue by Category</Text>
          <View style={styles.simpleChart} testID="category-breakdown">
            {pieData.map((p, idx) => {
              const pct = Math.round(((p.population as number) / salesData.revenueByCategory.reduce((a, b) => a + b.revenue, 0)) * 100);
              return (
                <View key={String(p.name) + idx} style={styles.catRow}>
                  <View style={[styles.colorDot, { backgroundColor: String(p.color) }]} />
                  <Text style={styles.catLabel}>{String(p.name)}</Text>
                  <View style={styles.catBarTrack}>
                    <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: String(p.color) }]} />
                  </View>
                  <Text style={styles.catPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          {salesData.productSales.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>{product.quantity} sold</Text>
              </View>
              <Text style={styles.productRevenue}>${product.revenue.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Top Customers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Customers</Text>
          {salesData.topCustomers.map((customer) => (
            <View key={customer.id} style={styles.customerItem}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerOrders}>{customer.orderCount} orders</Text>
              </View>
              <Text style={styles.customerSpent}>${customer.totalSpent.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton}>
          <Download size={20} color={colors.text.primary} />
          <Text style={styles.exportButtonText}>Export Sales Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background.card,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  timeRangeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  timeRangeTextActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  simpleChart: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    height: 180,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    width: 18,
    backgroundColor: colors.accent.primary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text.secondary,
  },
  fallbackBox: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: colors.text.secondary,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  catLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  catBarTrack: {
    flex: 2,
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  catBarFill: {
    height: 8,
    borderRadius: 4,
  },
  catPct: {
    width: 40,
    textAlign: 'right',
    color: colors.text.secondary,
    fontSize: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  productQuantity: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  productRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  customerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  customerOrders: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  customerSpent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent.primary,
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
});