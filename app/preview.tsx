import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, router } from 'expo-router';
import { useHistory } from '../components/HistoryContext';
import { FontAwesome } from '@expo/vector-icons';

export default function PreviewScreen() {
  const { imageUri, rating, feedback, pattern, confidence, improvementTips } = useLocalSearchParams<{
    imageUri: string;
    rating: string;
    feedback: string;
    pattern: string;
    confidence: string;
    improvementTips: string;
  }>();

  const [selectedPattern, setSelectedPattern] = useState(pattern || 'Heart');
  const { addAttempt } = useHistory();

  const parsedImprovementTips = improvementTips ? JSON.parse(improvementTips) : [];

  const saveToHistory = () => {
    const attempt = {
      id: Date.now().toString(),
      imageUri: imageUri || '',
      date: new Date().toISOString().split('T')[0],
      rating: Number(rating),
      feedback: feedback || '',
      pattern: selectedPattern,
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
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  feedbackContainer: {
    marginBottom: 20,
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
    padding: 12,
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
  },
  tipIcon: {
    marginRight: 8,
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
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 