import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TopAppBar() {
  return (
    <View className="w-full bg-surface border-b border-outline-variant px-4 py-2 flex-row justify-between items-center z-50 pt-10">
      <View className="flex-row items-center gap-2">
        <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container-highest">
          <Image 
            source={require('../../assets/ifet-logo.png')}
            className="w-full h-full bg-white"
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="text-xl font-bold text-primary">Welcome !</Text>
          <Text className="text-sm text-on-surface-variant">
            Today: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
      </View>
      {/* Bell icon removed */}
    </View>
  );
}
