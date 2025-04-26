import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useHistory } from '@/components/HistoryContext';

export default function HistoryScreen() {
  const { history, removeAttempt } = useHistory();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedId) {
      removeAttempt(selectedId);
      setSelectedId(null);
      setModalVisible(false);
    }
  };

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
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <FontAwesome name="trash" size={20} color="#DAA520" />
              </TouchableOpacity>
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
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome name="warning" size={40} color="#FFD700" style={{ marginBottom: 16 }} />
            <Text style={styles.modalTitle}>Delete Entry?</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this entry from your history?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDelete}>
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: '#fff',
    width: 36,                // Equal width and height
    height: 36,
    borderRadius: 18,         // Half of width/height for a perfect circle
    justifyContent: 'center', // Center the icon
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD580',
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#DAA520',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
}); 