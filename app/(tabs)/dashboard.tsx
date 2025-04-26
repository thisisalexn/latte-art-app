import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen() {
  // TODO: Implement analytics data fetching
  const stats = {
    totalAttempts: 42,
    averageRating: 3.8,
    bestRating: 4.5,
    improvement: '+0.7',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalAttempts}</Text>
          <Text style={styles.statLabel}>Total Attempts</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.averageRating}</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.bestRating}</Text>
          <Text style={styles.statLabel}>Best Rating</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.improvement}</Text>
          <Text style={styles.statLabel}>Improvement</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Feedback</Text>
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>
            "Great improvement on your rosetta! Try to maintain consistent milk flow for better symmetry."
          </Text>
          <Text style={styles.feedbackDate}>2 days ago</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  feedbackCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 24,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
}); 