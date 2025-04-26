import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, router } from 'expo-router';
import { useHistory } from '../components/HistoryContext';

export default function PreviewScreen() {
  const { imageUri, rating, feedback } = useLocalSearchParams<{
    imageUri: string;
    rating: string;
    feedback: string;
  }>();

  const [pattern, setPattern] = useState('Heart');
  const { addAttempt } = useHistory();

  const saveToHistory = () => {
    const attempt = {
      id: Date.now().toString(),
      imageUri: imageUri || '',
      date: new Date().toISOString().split('T')[0],
      rating: Number(rating),
      feedback: feedback || '',
      pattern,
    };
    addAttempt(attempt);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.analysisContainer}>
        <Text style={styles.rating}>Rating: {rating}/5</Text>
        <Text style={styles.feedback}>{feedback}</Text>
        <Text style={styles.patternLabel}>Pattern:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={pattern}
            onValueChange={(itemValue) => setPattern(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Heart" value="Heart" />
            <Picker.Item label="Rosetta" value="Rosetta" />
            <Picker.Item label="Tulip" value="Tulip" />
            <Picker.Item label="Swan" value="Swan" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={saveToHistory}>
          <Text style={styles.buttonText}>Save to History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
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
  analysisContainer: {
    marginTop: 20,
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  feedback: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  patternLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#444',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 44,
    width: '100%',
  },
}); 