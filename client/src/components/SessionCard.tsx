import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type SessionCardProps = {
  time: string;
  title: string;
  status: 'available' | 'booked' | 'expired';
  instructor?: string;
  instructorAvatar?: string;
  backgroundIcon?: keyof typeof MaterialIcons.glyphMap;
  purposeText?: string;
  onPressArrow?: () => void;
};

export default function SessionCard({ time, title, status, instructor, instructorAvatar, backgroundIcon, purposeText, onPressArrow }: SessionCardProps) {
  if (status === 'available') {
    return (
      <View className="p-6 rounded-xl bg-[#ecfdf5] border border-[#10b981] flex-row justify-between items-center">
        <View className="flex-col gap-1">
          <Text className="text-sm font-semibold text-on-surface-variant">{time}</Text>
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-1 rounded-full bg-[#10b981]">
              <Text className="text-white text-xs font-bold uppercase tracking-tighter">Available</Text>
            </View>
            <Text className="text-xl font-bold text-primary">{title}</Text>
          </View>
        </View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={onPressArrow}
          className="w-12 h-12 rounded-full border border-[#10b981] items-center justify-center"
        >
          <MaterialIcons name="arrow-forward" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'expired') {
    return (
      <View className="p-6 rounded-xl bg-gray-100 border border-gray-300 flex-row justify-between items-center opacity-60">
        <View className="flex-col gap-1">
          <Text className="text-sm font-semibold text-gray-500">{time}</Text>
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-1 rounded-full bg-gray-400">
              <Text className="text-white text-xs font-bold uppercase tracking-tighter">Expired</Text>
            </View>
            <Text className="text-xl font-bold text-gray-500">{title}</Text>
          </View>
        </View>
        <View className="w-12 h-12 rounded-full border border-gray-300 items-center justify-center bg-gray-200">
           <MaterialIcons name="block" size={20} color="#9ca3af" />
        </View>
      </View>
    );
  }

  return (
    <View className="p-6 rounded-xl bg-[#fef2f2] border border-outline-variant flex-col gap-4 relative overflow-hidden">
      <View className="flex-row justify-between items-start">
        <View className="flex-col gap-1">
          <Text className="text-sm font-semibold text-on-surface-variant">{time}</Text>
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-1 rounded-full bg-error">
              <Text className="text-white text-xs font-bold uppercase tracking-tighter">Booked</Text>
            </View>
            <Text className="text-xl font-bold text-primary">{title}</Text>
          </View>
        </View>
        <View className="w-10 h-10 rounded-full border border-outline-variant bg-surface items-center justify-center">
          <MaterialIcons name="lock" size={20} color="#75777f" />
        </View>
      </View>
      
      {(instructor || purposeText) && (
        <View className="flex-col gap-3 pt-3 border-t border-outline-variant z-10">
          {instructor && (
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container items-center justify-center">
                {instructorAvatar ? (
                  <Image source={{ uri: instructorAvatar }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <MaterialIcons name="person" size={16} color="#75777f" />
                )}
              </View>
              <Text className="text-sm text-on-surface">Staff Member: <Text className="font-bold">{instructor}</Text></Text>
            </View>
          )}
          {purposeText && (
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container items-center justify-center">
                <MaterialIcons name="event-note" size={16} color="#75777f" />
              </View>
              <Text className="text-sm text-on-surface flex-1">Event Purpose: <Text className="font-bold">{purposeText}</Text></Text>
            </View>
          )}
        </View>
      )}
      
      {backgroundIcon && (
        <View className="absolute -right-4 -bottom-4 opacity-10">
          <MaterialIcons name={backgroundIcon} size={100} color="black" />
        </View>
      )}
    </View>
  );
}
