import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomNavBarProps = {
  activeTab?: 'home' | 'book' | 'history';
};

export default function BottomNavBar({ activeTab = 'home' }: BottomNavBarProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute bottom-0 w-full bg-surface border-t border-outline-variant flex-row justify-around py-3 shadow-lg z-50"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <TouchableOpacity 
        className={`flex-col items-center justify-center px-4 py-1 rounded-xl ${activeTab === 'home' ? 'bg-primary-container' : ''}`}
        activeOpacity={0.6}
        onPress={() => {
          if (activeTab !== 'home') navigation.goBack();
        }}
      >
        <MaterialIcons name="home" size={24} color={activeTab === 'home' ? '#8293b8' : '#505f76'} />
        <Text className={`text-sm font-semibold mt-1 ${activeTab === 'home' ? 'text-on-primary-container' : 'text-secondary'}`}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className={`flex-col items-center justify-center px-4 py-1 rounded-xl ${activeTab === 'book' ? 'bg-primary-container' : ''}`}
        activeOpacity={0.6}
        onPress={() => {
          if (activeTab !== 'book') navigation.navigate('Booking');
        }}
      >
        <MaterialIcons name="add-circle" size={24} color={activeTab === 'book' ? '#8293b8' : '#505f76'} />
        <Text className={`text-sm font-semibold mt-1 ${activeTab === 'book' ? 'text-on-primary-container' : 'text-secondary'}`}>
          Book
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className={`flex-col items-center justify-center px-4 py-1 rounded-xl ${activeTab === 'history' ? 'bg-primary-container' : ''}`}
        activeOpacity={0.6}
        onPress={() => {
          if (activeTab !== 'history') navigation.navigate('History');
        }}
      >
        <MaterialIcons name="history" size={24} color={activeTab === 'history' ? '#8293b8' : '#505f76'} />
        <Text className={`text-sm font-semibold mt-1 ${activeTab === 'history' ? 'text-on-primary-container' : 'text-secondary'}`}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );
}
