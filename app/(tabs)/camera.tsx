import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useHistory } from '@/components/HistoryContext';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const cameraRef = useRef<any>(null);
  const { addAttempt } = useHistory();

  const saveToLocalStorage = async (uri: string) => {
    try {
      // Create directory if it doesn't exist
      const directory = `${FileSystem.documentDirectory}latte_art_photos`;
      const dirInfo = await FileSystem.getInfoAsync(directory);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      // Generate unique filename
      const timestamp = new Date().getTime();
      const filename = `latte_art_${timestamp}.jpg`;
      const newPath = `${directory}/${filename}`;

      // Copy the file to our app's directory
      await FileSystem.copyAsync({
        from: uri,
        to: newPath
      });

      return newPath;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw new Error('Failed to save photo');
    }
  };

  const toggleFlash = () => {
    setFlash(prev => prev === 'off' ? 'on' : 'off');
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
        skipProcessing: true,
      });

      if (photo?.uri) {
        // Save to local storage and get the path
        const savedPath = await saveToLocalStorage(photo.uri);
        
        // Navigate to preview
        router.push({
          pathname: "/preview",
          params: {
            imageUri: savedPath,
            rating: "0",
            feedback: "Analyzing your latte art..."
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
  }

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
        style={styles.camera} 
        facing={facing}
        flash={flash}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <View style={styles.guideFrame} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setFacing(facing === 'back' ? 'front' : 'back');
            }}
            disabled={isLoading}
          >
            <FontAwesome name="refresh" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconButton,
              flash === 'on' && styles.flashActiveButton
            ]}
            onPress={toggleFlash}
            disabled={isLoading}
          >
            <FontAwesome
              name="bolt"
              size={24}
              color={flash === 'on' ? '#FFD700' : '#fff'}
            />
            <Text style={[styles.flashLabel, flash === 'on' && styles.flashLabelActive]}>
              {flash === 'on' ? 'On' : 'Off'}
            </Text>
          </TouchableOpacity>

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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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
  flashActiveButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)', // subtle gold highlight
  },
  flashLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  flashLabelActive: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});