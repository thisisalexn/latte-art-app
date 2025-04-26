import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function HistoryScreen() {
  // TODO: Implement history data fetching
  const dummyData = [
    {
      id: '1',
      imageUri: 'https://example.com/latte1.jpg',
      date: '2024-03-15',
      rating: 4.2,
      feedback: 'Good symmetry, but could improve milk texture',
    },
    {
      id: '2',
      imageUri: 'https://example.com/latte2.jpg',
      date: '2024-03-14',
      rating: 3.8,
      feedback: 'Nice attempt at a heart, work on contrast',
    },
    {
      id: '3',
      imageUri: 'https://example.com/latte3.jpg',
      date: '2024-03-13',
      rating: 4.5,
      feedback: 'Excellent rosetta! Perfect milk texture',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your History</Text>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageUri }}
                style={styles.image}
                onError={() => {
                  // If image fails to load, show placeholder
                  return (
                    <View style={styles.placeholderContainer}>
                      <FontAwesome name="coffee" size={50} color="#666" />
                    </View>
                  );
                }}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.rating}>Rating: {item.rating}/5</Text>
              <Text style={styles.feedback}>{item.feedback}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 16,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  feedback: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 