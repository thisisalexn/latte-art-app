import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ActivityIndicator, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { analyzeLatteArt } from '@/utils/openai';
import { NotLatteArtModal } from '@/components/NotLatteArtModal';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [showNotLatteArtModal, setShowNotLatteArtModal] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: true,
      });

      if (photo?.base64) {
        // Analyze the image using OpenAI
        const analysis = await analyzeLatteArt(photo.base64);
        
        if (!analysis.isLatteArt) {
          setShowNotLatteArtModal(true);
          return;
        }

        // Navigate to preview with the analysis results
        router.push({
          pathname: "/preview",
          params: {
            imageUri: photo.uri,
            analysisResult: JSON.stringify({
              isCoffee: analysis.isLatteArt,
              rating: analysis.rating,
              pattern: analysis.pattern,
              confidence: analysis.confidence,
              patternComplexity: analysis.patternComplexity || 0,
              executionScore: analysis.executionScore || 0,
              technicalDetails: {
                milkTexture: analysis.technicalDetails?.milkTexture || 'Not analyzed',
                pouringTechnique: analysis.technicalDetails?.pouringTechnique || 'Not analyzed',
                patternDefinition: analysis.technicalDetails?.patternDefinition || 'Not analyzed'
              },
              improvementTips: analysis.improvementTips || []
            })
          }
        });
      } else {
        Alert.alert('Error', 'Failed to capture image');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#DAA520" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <FontAwesome name="camera" size={50} color="#666" />
        <Text style={styles.text}>No access to camera</Text>
        <Text style={styles.subtext}>Please enable camera access in your device settings</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
      >
        <View style={styles.overlay}>
          <View style={styles.guideFrame} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.captureButton, isLoading && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <FontAwesome name="camera" size={28} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFD580" />
          <Text style={styles.loadingText}>Analyzing your latte art...</Text>
        </View>
      )}
      <NotLatteArtModal 
        visible={showNotLatteArtModal} 
        onClose={() => setShowNotLatteArtModal(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFD580',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  subtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#FFD580',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
});