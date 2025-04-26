import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useHistory } from '@/components/HistoryContext';

export default function HistoryScreen() {
  const { history } = useHistory();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your History</Text>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="coffee" size={50} color="#666" />
          <Text style={styles.emptyText}>No photos yet</Text>
          <Text style={styles.emptySubtext}>Take your first photo to see it here!</Text>
        </View>
      ) : (
        <FlatList
          data={history}
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
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>Rating: {item.rating}/5</Text>
                  <Text style={styles.pattern}>Pattern: {item.pattern}</Text>
                </View>
                
                <View style={styles.scoresContainer}>
                  <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>Complexity</Text>
                    <Text style={styles.scoreValue}>{item.patternComplexity}/5</Text>
                  </View>
                  <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>Execution</Text>
                    <Text style={styles.scoreValue}>{item.executionScore}/5</Text>
                  </View>
                </View>

                <View style={styles.technicalContainer}>
                  <Text style={styles.technicalLabel}>Milk Texture:</Text>
                  <Text style={styles.technicalValue}>{item.technicalDetails.milkTexture}</Text>
                  
                  <Text style={styles.technicalLabel}>Pouring Technique:</Text>
                  <Text style={styles.technicalValue}>{item.technicalDetails.pouringTechnique}</Text>
                  
                  <Text style={styles.technicalLabel}>Pattern Definition:</Text>
                  <Text style={styles.technicalValue}>{item.technicalDetails.patternDefinition}</Text>
                </View>

                <Text style={styles.feedback}>{item.feedback}</Text>
              </View>
            </View>
          )}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
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
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pattern: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreCard: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  technicalContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  technicalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  technicalValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  feedback: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
}); 