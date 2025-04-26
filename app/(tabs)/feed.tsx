import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function FeedScreen() {
  // TODO: Implement feed data fetching
  const dummyData = [
    { id: '1', title: 'Beautiful Rosetta', user: 'CoffeeMaster', rating: 4.5 },
    { id: '2', title: 'Perfect Heart', user: 'LatteArtist', rating: 4.8 },
    { id: '3', title: 'Swan Design', user: 'BaristaPro', rating: 4.2 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latte Art Feed</Text>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardUser}>by {item.user}</Text>
            <Text style={styles.cardRating}>Rating: {item.rating}/5</Text>
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardUser: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardRating: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
}); 