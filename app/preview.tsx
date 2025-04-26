import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated, Easing } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, router } from 'expo-router';
import { useHistory } from '../components/HistoryContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface AnalysisResult {
  isCoffee: boolean;
  rating: number;
  pattern: string;
  confidence: number;
  patternComplexity: number;
  executionScore: number;
  strictClassification: string;
  technicalDetails: {
    milkTexture: string;
    pouringTechnique: string;
    patternDefinition: string;
  };
  improvementTips: string[];
}

export default function PreviewScreen() {
  const { 
    imageUri, 
    analysisResult
  } = useLocalSearchParams<{
    imageUri: string;
    analysisResult: string;
  }>();

  const [selectedPattern, setSelectedPattern] = useState('Heart');
  const { addAttempt } = useHistory();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const dotAnim1 = React.useRef(new Animated.Value(0)).current;
  const dotAnim2 = React.useRef(new Animated.Value(0)).current;
  const dotAnim3 = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim1, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(dotAnim2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim2, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(dotAnim3, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim3, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    if (analysisResult) {
      try {
        const parsedAnalysis = JSON.parse(analysisResult);
        setAnalysis(parsedAnalysis);
        setSelectedPattern(parsedAnalysis.pattern);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error parsing analysis result:', error);
        Alert.alert('Error', 'Failed to parse analysis results');
      }
    }
  }, [analysisResult]);

  const saveToHistory = () => {
    if (!analysis) return;

    const attempt = {
      id: Date.now().toString(),
      imageUri: imageUri || '',
      date: new Date().toISOString().split('T')[0],
      rating: analysis.rating,
      feedback: analysis.improvementTips.join('\n'),
      pattern: selectedPattern,
      patternComplexity: analysis.patternComplexity,
      executionScore: analysis.executionScore,
      technicalDetails: analysis.technicalDetails
    };
    addAttempt(attempt);
    router.back();
  };

  if (!analysis || isLoading) {
    return (
      <LinearGradient
        colors={["#FFF8E7", "#FFFFFF"]}
        style={styles.loadingContainer}
      >
        <Animated.View 
          style={[
            styles.loadingContent,
            { 
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <View style={styles.loadingIconContainer}>
            <FontAwesome name="coffee" size={80} color="#DAA520" />
            <View style={styles.loadingDots}>
              <Animated.View style={[styles.dot, { opacity: dotAnim1 }]} />
              <Animated.View style={[styles.dot, { opacity: dotAnim2 }]} />
              <Animated.View style={[styles.dot, { opacity: dotAnim3 }]} />
            </View>
          </View>
          <Text style={styles.loadingText}>Analyzing your latte art</Text>
          <Text style={styles.loadingSubtext}>Please wait while we process your image</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (!analysis.isCoffee) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorTitle}>Not a Coffee Image</Text>
          <Text style={styles.errorText}>
            The image doesn't appear to be a top-down view of a coffee cup. Please take a photo of your latte art from above.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.analysisContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>Rating: {analysis.rating}/5</Text>
            <Text style={styles.confidence}>Confidence: {analysis.confidence}%</Text>
          </View>
          
          <View style={styles.scoresContainer}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Pattern Complexity</Text>
              <Text style={styles.scoreValue}>{analysis.patternComplexity}/5</Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Execution Score</Text>
              <Text style={styles.scoreValue}>{analysis.executionScore}/5</Text>
            </View>
          </View>

          <View style={styles.technicalContainer}>
            <Text style={styles.sectionTitle}>Technical Details</Text>
            <View style={styles.technicalCard}>
              <Text style={styles.technicalLabel}>Milk Texture</Text>
              <Text style={styles.technicalValue}>{analysis.technicalDetails.milkTexture}</Text>
            </View>
            <View style={styles.technicalCard}>
              <Text style={styles.technicalLabel}>Pouring Technique</Text>
              <Text style={styles.technicalValue}>{analysis.technicalDetails.pouringTechnique}</Text>
            </View>
            <View style={styles.technicalCard}>
              <Text style={styles.technicalLabel}>Pattern Definition</Text>
              <Text style={styles.technicalValue}>{analysis.technicalDetails.patternDefinition}</Text>
            </View>
          </View>
          
          <View style={styles.patternContainer}>
            <Text style={styles.patternLabel}>Pattern:</Text>
            {analysis.strictClassification && (
              <View style={styles.classificationContainer}>
                <Text style={styles.classificationValue}>{analysis.strictClassification}</Text>
              </View>
            )}
          </View>

          {analysis.improvementTips.length > 0 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.sectionTitle}>Improvement Tips</Text>
              {analysis.improvementTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <FontAwesome name="lightbulb-o" size={16} color="#FFD700" style={styles.tipIcon} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={saveToHistory}
      >
        <FontAwesome name="save" size={24} color="#fff" />
        <Text style={styles.saveButtonText}>Save to History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 24,
  },
  loadingIconContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DAA520',
    marginHorizontal: 6,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#DAA520',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    maxWidth: 280,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  analysisContainer: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  confidence: {
    fontSize: 16,
    color: '#666',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  technicalContainer: {
    marginBottom: 20,
  },
  technicalCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  technicalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  technicalValue: {
    fontSize: 16,
    color: '#333',
  },
  patternContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  patternLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 10,
  },
  classificationContainer: {
    backgroundColor: '#FFF8E7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DAA520',
    alignItems: 'center',
  },
  classificationValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#DAA520', // Beige color
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
}); 