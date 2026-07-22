import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AdminBottomNavBarProps = {
  activeTab?: 'history' | 'download';
};

export default function AdminBottomNavBar({ activeTab = 'history' }: AdminBottomNavBarProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute bottom-0 w-full bg-surface border-t border-outline-variant flex-row justify-around py-3 shadow-lg z-50"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      
      {/* History Button */}
      <TouchableOpacity 
        className={`flex-col items-center justify-center px-8 py-1 rounded-xl ${activeTab === 'history' ? 'bg-primary-container' : ''}`}
        activeOpacity={0.6}
        onPress={() => {
          if (activeTab !== 'history') navigation.navigate('AdminDashboard');
        }}
      >
        <MaterialIcons name="history" size={24} color={activeTab === 'history' ? '#8293b8' : '#505f76'} />
        <Text className={`text-sm font-semibold mt-1 ${activeTab === 'history' ? 'text-on-primary-container' : 'text-secondary'}`}>
          History
        </Text>
      </TouchableOpacity>

      {/* Download Button */}
      <TouchableOpacity 
        className={`flex-col items-center justify-center px-8 py-1 rounded-xl ${activeTab === 'download' ? 'bg-primary-container' : ''}`}
        activeOpacity={0.6}
        onPress={() => {
          if (activeTab !== 'download') navigation.navigate('AdminDownload');
        }}
      >
        <MaterialIcons name="cloud-download" size={24} color={activeTab === 'download' ? '#8293b8' : '#505f76'} />
        <Text className={`text-sm font-semibold mt-1 ${activeTab === 'download' ? 'text-on-primary-container' : 'text-secondary'}`}>
          Download
        </Text>
      </TouchableOpacity>

    </View>
  );
}
