import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AdminBottomNavBar from '../components/AdminBottomNavBar';

export default function AdminDownloadScreen() {
  const navigation = useNavigation<any>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleDownload = () => {
    if (!selectedOption) {
      Alert.alert("Selection Required", "Please select a statement period to generate.");
      return;
    }

    // Simulate generation delay
    Alert.alert(
      "Generating Report",
      `Compiling report for: ${selectedOption}...`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download PDF",
          onPress: () => Alert.alert("Success", "Statement downloaded successfully to your device.")
        }
      ]
    );
  };

  const renderOption = (id: string, title: string, subtitle: string, icon: keyof typeof MaterialIcons.glyphMap) => {
    const isSelected = selectedOption === id;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedOption(id)}
        className={`flex-row items-center p-4 border-b border-outline-variant ${isSelected ? 'bg-[#e8f0fe] border-l-4 border-l-primary' : 'bg-surface border-l-4 border-l-transparent'}`}
      >
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isSelected ? 'bg-primary border border-primary' : 'bg-surface-container border border-outline-variant'}`}>
          <MaterialIcons name={icon} size={20} color={isSelected ? 'white' : '#505f76'} />
        </View>
        <View className="flex-1">
          <Text className={`text-base font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{title}</Text>
          <Text className={`text-xs mt-0.5 ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>{subtitle}</Text>
        </View>
        <View className="w-6 h-6 items-center justify-center">
          {isSelected && <MaterialIcons name="check-circle" size={20} color="#031635" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface relative">
      {/* Header */}
      <View className="w-full bg-surface border-b border-outline-variant px-4 py-2 flex-row justify-between items-center z-50">
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-primary-container">
            <Image
              source={require('../../assets/ifet-logo.png')}
              className="w-full h-full bg-white"
              resizeMode="contain"
            />
          </View>
          <Text className="text-xl font-bold text-primary">Admin Portal</Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full"
          onPress={() => navigation.replace('Login')}
        >
          <Image
            source={require('../../assets/QUIT.png')}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-[140px]" className="flex-1 w-full" showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-[480px] self-center">

          <View className="flex-col gap-1 mb-8 mt-4">
            <Text className="text-3xl font-bold text-primary">Statements</Text>
            <Text className="text-base text-on-surface-variant">Generate E-Statement report of campus reservations.</Text>
          </View>

          {/* Quick Ledger Options */}
          <View className="bg-white rounded-2xl border border-outline-variant overflow-hidden mb-6 shadow-sm">
            <View className="bg-surface-container-highest px-4 py-3 border-b border-outline-variant">
              <Text className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Quick Statements</Text>
            </View>
            {renderOption('current_month', 'Current Month', 'Report for the ongoing month', 'calendar-today')}
            {renderOption('last_2_months', 'Last 2 Months', 'Comprehensive 60-day Report', 'date-range')}
            {renderOption('last_3_months', 'Last 3 Months', 'Quarterly campus reservation report', 'event-note')}
          </View>

          {/* Custom Date Range */}
          <View className="bg-white rounded-2xl border border-outline-variant overflow-hidden mb-8 shadow-sm">
            <View className="bg-surface-container-highest px-4 py-3 border-b border-outline-variant flex-row justify-between items-center">
              <Text className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Custom Range</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedOption('custom_range')}
              className={`flex-col p-4 ${selectedOption === 'custom_range' ? 'bg-[#e8f0fe] border-l-4 border-l-primary' : 'bg-surface border-l-4 border-l-transparent'}`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">From Date</Text>
                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => setShowStartPicker(true)}
                    className="flex-row items-center bg-surface-container px-3 py-2 rounded-lg border border-outline-variant"
                  >
                    <MaterialIcons name="edit-calendar" size={16} color="#75777f" />
                    <Text className="ml-2 text-on-surface font-medium">{startDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                </View>
                <View className="px-3 pt-6">
                  <MaterialIcons name="arrow-forward" size={16} color="#a0a0a0" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">To Date</Text>
                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => setShowEndPicker(true)}
                    className="flex-row items-center bg-surface-container px-3 py-2 rounded-lg border border-outline-variant"
                  >
                    <MaterialIcons name="edit-calendar" size={16} color="#75777f" />
                    <Text className="ml-2 text-on-surface font-medium">{endDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Download Action */}
          <TouchableOpacity
            className={`w-full py-4 rounded-xl items-center justify-center flex-row shadow-sm ${selectedOption ? 'bg-[#031635]' : 'bg-gray-300'}`}
            disabled={!selectedOption}
            onPress={handleDownload}
          >
            <MaterialIcons name="picture-as-pdf" size={20} color={selectedOption ? 'white' : '#9ca3af'} />
            <Text className={`ml-2 text-base font-bold ${selectedOption ? 'text-white' : 'text-gray-500'}`}>
              Generate Report
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onValueChange={onStartDateChange}
          onDismiss={() => setShowStartPicker(false)}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onValueChange={onEndDateChange}
          onDismiss={() => setShowEndPicker(false)}
        />
      )}

      <AdminBottomNavBar activeTab="download" />
    </SafeAreaView>
  );
}
