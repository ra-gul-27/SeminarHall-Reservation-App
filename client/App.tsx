import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import './global.css';

import AppNavigator from './src/navigation/AppNavigator';

function UpdateOverlay() {
  const { isDownloading, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  if (!isDownloading) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 9999, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', backgroundColor: 'white', marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
        <Image source={require('./assets/ifet-logo.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
      </View>
      <ActivityIndicator size="large" color="#031635" />
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#031635' }}>Updating the app...</Text>
      <Text style={{ marginTop: 8, fontSize: 14, color: '#64748b' }}>Please wait a moment.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
        <UpdateOverlay />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
