import * as FileSystem from 'expo-file-system';

export async function saveToLocalStorage(uri: string): Promise<string> {
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
} 