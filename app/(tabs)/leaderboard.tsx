import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Generate dummy leaderboard data
const leaderboard = Array.from({ length: 100 }, (_, i) => ({
  placement: i + 1,
  avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i % 100}.jpg`,
  username: `Barista${i + 1}`,
  latteCount: Math.floor(Math.random() * 1000) + 100,
  avgScore: (Math.random() * 2 + 3).toFixed(2), // 3.00 - 5.00
}));

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 100 Latte Artists</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={item => item.placement.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.placementBadge}>
              <Text style={styles.placement}>{item.placement}</Text>
            </View>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
            <View style={styles.latteCountBox}>
              <FontAwesome name="coffee" size={16} color="#DAA520" />
              <Text style={styles.latteCount}>{item.latteCount}</Text>
            </View>
            <View style={styles.scoreBox}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.avgScore}>{item.avgScore}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  placementBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD580',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  placement: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#FFD580',
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  latteCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  latteCount: {
    marginLeft: 4,
    color: '#DAA520',
    fontWeight: 'bold',
    fontSize: 15,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  avgScore: {
    marginLeft: 4,
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 