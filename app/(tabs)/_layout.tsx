import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Image, View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/pourfect_logo.png')}
              style={{ width: 28, height: 28, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold'}}>Pourfect</Text>
          </View>),
          headerStyle: {
            backgroundColor: '#fff', // Always light
          },
          headerTintColor: '#222',
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <FontAwesome name="newspaper-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => <FontAwesome name="camera" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontAwesome name="history" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
