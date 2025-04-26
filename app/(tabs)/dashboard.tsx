import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useHistory } from '../../components/HistoryContext';

export default function DashboardScreen() {
  const { history } = useHistory();

  // Вычисление статистики
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalAttempts: 0,
        averageRating: 0,
        bestRating: 0,
        improvement: 0,
        bestPattern: '-',
      };
    }
    const totalAttempts = history.length;
    const averageRating = (
      history.reduce((sum, a) => sum + a.rating, 0) / totalAttempts
    ).toFixed(2);
    const bestRating = Math.max(...history.map((a) => a.rating));
    const improvement = (history[0].rating - history[history.length - 1].rating).toFixed(2);

    // Группировка по паттернам
    const patternStats: Record<string, { sum: number; count: number }> = {};
    history.forEach((a) => {
      if (!patternStats[a.pattern]) patternStats[a.pattern] = { sum: 0, count: 0 };
      patternStats[a.pattern].sum += a.rating;
      patternStats[a.pattern].count += 1;
    });
    let bestPattern = '-';
    let bestPatternAvg = 0;
    Object.entries(patternStats).forEach(([pattern, { sum, count }]) => {
      const avg = sum / count;
      if (count > 0 && avg > bestPatternAvg) {
        bestPattern = pattern;
        bestPatternAvg = avg;
      }
    });
    return {
      totalAttempts,
      averageRating,
      bestRating,
      improvement,
      bestPattern,
    };
  }, [history]);

  // Данные для графика (по дате)
  const chartData = useMemo(() => {
    if (history.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }
    const labels = history.slice().reverse().map((a) => a.date.slice(5));
    const data = history.slice().reverse().map((a) => a.rating);
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(218, 165, 32, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  }, [history]);

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(218, 165, 32, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 44, 44, ${opacity})`,
    style: {
      borderRadius: 20,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#DAA520',
    },
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <LinearGradient
      colors={["#FFF8E7", "#FFFFFF"]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="coffee" size={64} color="#DAA520" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No data yet</Text>
            <Text style={styles.emptySubtext}>Take your first photo and save your result!</Text>
            <TouchableOpacity 
              style={[styles.cameraButton, { marginTop: 24 }]}
              onPress={() => router.push('/camera')}
            >
              <FontAwesome name="camera" size={22} color="#222" />
              <Text style={styles.cameraButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.averageRating}</Text>
                <Text style={styles.statLabel}>Average Score</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalAttempts}</Text>
                <Text style={styles.statLabel}>Attempts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.improvement}</Text>
                <Text style={styles.statLabel}>Improvement</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.bestRating}</Text>
                <Text style={styles.statLabel}>Best Score</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Best Pattern</Text>
              <View style={[styles.statCard, { width: '100%', marginBottom: 0, marginTop: 0, paddingVertical: 18 }]}> 
                <Text style={[styles.statValue, { fontSize: 22 }]}>{stats.bestPattern}</Text>
                <Text style={styles.statLabel}>Pattern with highest average score</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Score History</Text>
              <View style={styles.chartCard}>
                <LineChart
                  data={chartData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            </View>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => router.push('/camera')}
            >
              <FontAwesome name="camera" size={22} color="#222" />
              <Text style={styles.cameraButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: '47%',
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 22,
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#DAA520',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#444',
    opacity: 0.8,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 14,
    marginLeft: 6,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 0,
    alignItems: 'center',
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  cameraButton: {
    backgroundColor: '#FFD580', // Gold accent
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraButtonText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#DAA520',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
    maxWidth: 260,
  },
}); 