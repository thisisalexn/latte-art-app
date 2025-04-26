import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing={facing} />
      <Button
        title="Flip Camera"
        onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
      />
    </View>
  );
}