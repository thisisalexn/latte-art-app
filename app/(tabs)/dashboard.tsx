import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Alert, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useHistory } from '../../components/HistoryContext';
import * as ImagePicker from 'expo-image-picker';
import { analyzeLatteArt } from '@/utils/openai';
import { LoadingScreen } from '@/components/LoadingScreen';

// Добавляем тип для достижений
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
};

export default function DashboardScreen() {
  const { history } = useHistory();
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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
    const averageRating = Number(
      (history.reduce((sum, a) => sum + a.rating, 0) / totalAttempts).toFixed(1)
    );
    const bestRating = Number(Math.max(...history.map((a) => a.rating)).toFixed(1));
    const improvement = Number(
      (history[0].rating - history[history.length - 1].rating).toFixed(1)
    );

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
    const data = history.slice().reverse().map((a) => a.rating);
    return {
      labels: Array(data.length).fill(''),
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`,
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
    color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 44, 44, ${opacity})`,
    style: {
      borderRadius: 20,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#8B4513',
      fill: '#fff',
    },
    propsForLabels: {
      fontSize: 12,
    },
    fillShadowGradient: 'transparent',
    fillShadowGradientOpacity: 0,
    strokeWidth: 2,
    propsForBackgroundLines: {
      strokeDasharray: [2, 2],
      strokeWidth: 1,
      stroke: 'rgba(139, 69, 19, 0.1)',
    },
    propsForVerticalLabels: {
      fontSize: 12,
      fontWeight: '600',
      color: '#8B4513',
      rotation: 0,
    },
    propsForHorizontalLabels: {
      fontSize: 12,
      fontWeight: '600',
      color: '#8B4513',
    },
  };

  const screenWidth = Dimensions.get('window').width;

  const getProgressColor = (value: number) => {
    if (value >= 4) return '#4CAF50';
    if (value >= 3) return '#FFC107';
    return '#F44336';
  };

  // Функция для расчета достижений
  const calculateAchievements = useMemo(() => {
    const achievements: Achievement[] = [
      {
        id: 'first_attempt',
        title: 'First Attempt',
        description: 'Create your first latte art',
        icon: 'coffee',
        progress: history.length > 0 ? 1 : 0,
        total: 1,
        unlocked: history.length > 0
      },
      {
        id: 'five_attempts',
        title: 'Five Attempts',
        description: 'Create 5 latte arts',
        icon: 'trophy',
        progress: Math.min(history.length, 5),
        total: 5,
        unlocked: history.length >= 5
      },
      {
        id: 'high_score',
        title: 'High Score',
        description: 'Get a rating of 4.5 or higher',
        icon: 'star',
        progress: history.some(h => h.rating >= 4.5) ? 1 : 0,
        total: 1,
        unlocked: history.some(h => h.rating >= 4.5)
      },
      {
        id: 'consistency',
        title: 'Consistency',
        description: 'Create 3 latte arts in a row with a rating of 4.0+',
        icon: 'check-circle',
        progress: history.length >= 3 ? 
          history.slice(-3).filter(h => h.rating >= 4.0).length : 0,
        total: 3,
        unlocked: history.length >= 3 && 
          history.slice(-3).every(h => h.rating >= 4.0)
      }
    ];
    return achievements;
  }, [history]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setIsLoading(true);
        try {
          const analysis = await analyzeLatteArt(result.assets[0].base64);
          
          if (!analysis.isLatteArt) {
            Alert.alert('Not a Latte Art', 'Please select a photo of a latte art');
            setIsLoading(false);
            return;
          }

          router.push({
            pathname: "/preview",
            params: {
              imageUri: result.assets[0].uri,
              analysisResult: JSON.stringify({
                isCoffee: analysis.isLatteArt,
                rating: analysis.rating,
                pattern: analysis.pattern,
                confidence: analysis.confidence,
                patternComplexity: analysis.patternComplexity || 0,
                executionScore: analysis.executionScore || 0,
                technicalDetails: {
                  milkTexture: analysis.technicalDetails?.milkTexture || 'Not analyzed',
                  pouringTechnique: analysis.technicalDetails?.pouringTechnique || 'Not analyzed',
                  patternDefinition: analysis.technicalDetails?.patternDefinition || 'Not analyzed'
                },
                improvementTips: analysis.improvementTips || []
              })
            }
          });
        } catch (error) {
          console.error('Error analyzing image:', error);
          Alert.alert('Error', 'Failed to analyze the image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Your Progress</Text>
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="coffee" size={64} color="#DAA520" style={{ marginBottom: 16 }} />
              <Text style={styles.emptyText}>No data yet</Text>
              <Text style={styles.emptySubtext}>Take your first photo and save your result!</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.cameraButton, { marginRight: 12 }]}
                  onPress={() => router.push('/camera')}
                >
                  <FontAwesome name="camera" size={22} color="#222" />
                  <Text style={styles.cameraButtonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.cameraButton, { marginLeft: 12 }]}
                  onPress={pickImage}
                  disabled={isLoading}
                >
                  <FontAwesome name="photo" size={22} color="#222" />
                  <Text style={styles.cameraButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.statsContainer}>
                <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                  <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Average Score</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${(stats.averageRating / 5) * 100}%`,
                          backgroundColor: getProgressColor(stats.averageRating)
                        }
                      ]} 
                    />
                  </View>
                </Animated.View>
                <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                  <Text style={styles.statValue}>{stats.totalAttempts}</Text>
                  <Text style={styles.statLabel}>Attempts</Text>
                  <FontAwesome name="coffee" size={24} color="#8B4513" style={{ marginTop: 8 }} />
                </Animated.View>
                <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                  <Text style={[
                    styles.statValue,
                    { color: stats.improvement > 0 ? '#4CAF50' : '#F44336' }
                  ]}>
                    {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}
                  </Text>
                  <Text style={styles.statLabel}>Improvement</Text>
                  <FontAwesome 
                    name={stats.improvement > 0 ? "arrow-up" : "arrow-down"} 
                    size={24} 
                    color={stats.improvement > 0 ? "#4CAF50" : "#F44336"} 
                    style={{ marginTop: 8 }} 
                  />
                </Animated.View>
                <Animated.View style={[styles.statCard, { transform: [{ scale: fadeAnim }] }]}>
                  <Text style={styles.statValue}>{stats.bestRating.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Best Score</Text>
                  <FontAwesome name="star" size={24} color="#8B4513" style={{ marginTop: 8 }} />
                </Animated.View>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Best Pattern</Text>
                <View style={[styles.statCard, { width: '100%', marginBottom: 0, marginTop: 0, paddingVertical: 18 }]}> 
                  <Text style={[styles.statValue, { fontSize: 22 }]}>{stats.bestPattern}</Text>
                  <Text style={styles.statLabel}>Pattern with highest average score</Text>
                  <View style={styles.patternIcon}>
                    <FontAwesome name="coffee" size={32} color="#DAA520" />
                  </View>
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
                    onDataPointClick={({ index }) => setSelectedPoint(index)}
                    withDots={true}
                    withInnerLines={true}
                    withOuterLines={true}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    withShadow={false}
                    segments={4}
                    fromZero={true}
                    formatYLabel={(value) => `${Math.round(parseFloat(value))}`}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1}
                    yLabelsOffset={10}
                  />
                  {selectedPoint !== null && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>
                        Score: {history[history.length - 1 - selectedPoint].rating}
                      </Text>
                      <Text style={styles.tooltipSubtext}>
                        {history[history.length - 1 - selectedPoint].pattern}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <View style={styles.achievementsContainer}>
                  {calculateAchievements.map((achievement) => (
                    <View 
                      key={achievement.id} 
                      style={[
                        styles.achievementCard,
                        achievement.unlocked && styles.achievementUnlocked
                      ]}
                    >
                      <View style={styles.achievementIcon}>
                        <FontAwesome 
                          name={achievement.icon as any} 
                          size={24} 
                          color={achievement.unlocked ? '#DAA520' : '#999'} 
                        />
                      </View>
                      <View style={styles.achievementContent}>
                        <Text style={[
                          styles.achievementTitle,
                          achievement.unlocked && styles.achievementTitleUnlocked
                        ]}>
                          {achievement.title}
                        </Text>
                        <Text style={styles.achievementDescription}>
                          {achievement.description}
                        </Text>
                        <View style={styles.achievementProgressBar}>
                          <View 
                            style={[
                              styles.achievementProgressFill, 
                              { 
                                width: `${(achievement.progress / achievement.total) * 100}%`,
                                backgroundColor: achievement.unlocked ? '#DAA520' : '#E0E0E0'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {achievement.progress}/{achievement.total}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.cameraButton, { marginRight: 12 }]}
                  onPress={() => router.push('/camera')}
                >
                  <FontAwesome name="camera" size={22} color="#222" />
                  <Text style={styles.cameraButtonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.cameraButton, { marginLeft: 12 }]}
                  onPress={pickImage}
                  disabled={isLoading}
                >
                  <FontAwesome name="photo" size={22} color="#222" />
                  <Text style={styles.cameraButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.1)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
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
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD580',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 6,
    minWidth: 160,
  },
  cameraButtonText: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
    flexShrink: 1,
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
  progressBar: {
    height: 6,
    width: '80%',
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  patternIcon: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FFF8E7',
    borderRadius: 20,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.2)',
  },
  tooltipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  tooltipSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.1)',
  },
  achievementUnlocked: {
    borderColor: '#DAA520',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  achievementTitleUnlocked: {
    color: '#DAA520',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  achievementProgressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 4,
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
}); 