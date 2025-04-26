import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { analyzeLatteArt } from '../../utils/openai';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      setIsProcessing(true);
      try {
        const photo = await camera.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        if (photo.base64) {
          const analysis = await analyzeLatteArt(photo.base64);
          router.push({
            pathname: '/preview',
            params: { 
              imageUri: photo.uri,
              rating: analysis.rating.toString(),
              feedback: analysis.feedback
            }
          });
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.overlay}>
          <View style={styles.guideFrame} />
          <TouchableOpacity
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <FontAwesome name="camera" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    opacity: 0.5,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
}); 