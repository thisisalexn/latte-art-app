import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, router } from 'expo-router';
import { useHistory } from '../components/HistoryContext';
import { FontAwesome } from '@expo/vector-icons';

export default function PreviewScreen() {
  const { 
    imageUri, 
    rating, 
    feedback, 
    pattern, 
    confidence, 
    improvementTips,
    patternComplexity,
    executionScore,
    technicalDetails
  } = useLocalSearchParams<{
    imageUri: string;
    rating: string;
    feedback: string;
    pattern: string;
    confidence: string;
    improvementTips: string;
    patternComplexity: string;
    executionScore: string;
    technicalDetails: string;
  }>();

  const [selectedPattern, setSelectedPattern] = useState(pattern || 'Heart');
  const { addAttempt } = useHistory();

  const parsedImprovementTips = improvementTips ? JSON.parse(improvementTips) : [];
  const parsedTechnicalDetails = technicalDetails ? JSON.parse(technicalDetails) : {};

  const saveToHistory = () => {
    const attempt = {
      id: Date.now().toString(),
      imageUri: imageUri || '',
      date: new Date().toISOString().split('T')[0],
      rating: Number(rating),
      feedback: feedback || '',
      pattern: selectedPattern,
      patternComplexity: Number(patternComplexity),
      executionScore: Number(executionScore),
      technicalDetails: parsedTechnicalDetails
    };
    addAttempt(attempt);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.analysisContainer}>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>Rating: {rating}/5</Text>
          <Text style={styles.confidence}>Confidence: {confidence}%</Text>
        </View>
        
        <View style={styles.scoresContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Pattern Complexity</Text>
            <Text style={styles.scoreValue}>{patternComplexity}/5</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Execution Score</Text>
            <Text style={styles.scoreValue}>{executionScore}/5</Text>
          </View>
        </View>

        <View style={styles.technicalContainer}>
          <Text style={styles.sectionTitle}>Technical Details</Text>
          <View style={styles.technicalCard}>
            <Text style={styles.technicalLabel}>Milk Texture</Text>
            <Text style={styles.technicalValue}>{parsedTechnicalDetails.milkTexture}</Text>
          </View>
          <View style={styles.technicalCard}>
            <Text style={styles.technicalLabel}>Pouring Technique</Text>
            <Text style={styles.technicalValue}>{parsedTechnicalDetails.pouringTechnique}</Text>
          </View>
          <View style={styles.technicalCard}>
            <Text style={styles.technicalLabel}>Pattern Definition</Text>
            <Text style={styles.technicalValue}>{parsedTechnicalDetails.patternDefinition}</Text>
          </View>
        </View>
        
        <View style={styles.patternContainer}>
          <Text style={styles.patternLabel}>Pattern:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedPattern}
              onValueChange={(itemValue) => setSelectedPattern(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Heart" value="Heart" />
              <Picker.Item label="Rosetta" value="Rosetta" />
              <Picker.Item label="Tulip" value="Tulip" />
              <Picker.Item label="Swan" value="Swan" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        <View style={styles.feedbackContainer}>
          <Text style={styles.sectionTitle}>Analysis</Text>
          <Text style={styles.feedback}>{feedback}</Text>
        </View>

        {parsedImprovementTips.length > 0 && (
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Improvement Tips</Text>
            {parsedImprovementTips.map((tip: string, index: number) => (
              <View key={index} style={styles.tipItem}>
                <FontAwesome name="lightbulb-o" size={16} color="#FFD700" style={styles.tipIcon} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={saveToHistory}>
          <Text style={styles.buttonText}>Save to History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#007AFF',
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
    color: '#007AFF',
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
    marginBottom: 20,
  },
  patternLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  feedbackContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  feedback: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
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
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 