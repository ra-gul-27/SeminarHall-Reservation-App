import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type VenueSelectorProps = {
  activeVenue: string;
  onSelectVenue: (venue: string) => void;
};

export default function VenueSelector({ activeVenue, onSelectVenue }: VenueSelectorProps) {
  return (
    <View className="flex-col gap-4 mb-12 mt-6">
      <Text className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Select Venue</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity 
          onPress={() => onSelectVenue('main')}
          className={`flex-1 py-6 px-2 rounded-xl items-center gap-1 ${activeVenue === 'main' ? 'bg-primary shadow-md' : 'bg-surface border border-outline-variant'}`}
        >
          <MaterialIcons name="meeting-room" size={24} color={activeVenue === 'main' ? 'white' : '#031635'} />
          <Text className={`text-center text-sm font-bold ${activeVenue === 'main' ? 'text-on-primary' : 'text-primary'}`}>MT Seminar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onSelectVenue('mini')}
          className={`flex-1 py-6 px-2 rounded-xl items-center gap-1 ${activeVenue === 'mini' ? 'bg-primary shadow-md' : 'bg-surface border border-outline-variant'}`}
        >
          <MaterialIcons name="apartment" size={24} color={activeVenue === 'mini' ? 'white' : '#031635'} />
          <Text className={`text-center text-sm font-bold ${activeVenue === 'mini' ? 'text-on-primary' : 'text-primary'}`}>Lib Seminar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onSelectVenue('meeting')}
          className={`flex-1 py-6 px-2 rounded-xl items-center gap-1 ${activeVenue === 'meeting' ? 'bg-primary shadow-md' : 'bg-surface border border-outline-variant'}`}
        >
          <MaterialIcons name="groups" size={24} color={activeVenue === 'meeting' ? 'white' : '#031635'} />
          <Text className={`text-center text-sm font-bold ${activeVenue === 'meeting' ? 'text-on-primary' : 'text-primary'}`}>Meeting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
