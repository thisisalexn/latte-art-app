import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

const LATTE_ART_IMAGES = [
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGF0dGUlMjBhcnR8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGF0dGUlMjBhcnR8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1681838853984-697bbb001257?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhdHRlJTIwYXJ0fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhdHRlJTIwYXJ0fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhdHRlJTIwYXJ0fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGF0dGUlMjBhcnR8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGF0dGUlMjBhcnR8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1681838853984-697bbb001257?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhdHRlJTIwYXJ0fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhdHRlJTIwYXJ0fGVufDB8fDB8fHww'
];
const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const imageMargin = 10;
const imageSize = (screenWidth - imageMargin * (numColumns + 1)) / numColumns;

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={LATTE_ART_IMAGES}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={numColumns}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
      />
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
          <Text style={styles.loginButtonText}>Log in to see other people's latte art</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  listContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: imageMargin,
    paddingBottom: 100,
  },
  imageWrapper: {
    margin: imageMargin,
    borderRadius: 18,
    overflow: 'hidden',
    width: imageSize,
    height: imageSize * 1.2,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
}); 