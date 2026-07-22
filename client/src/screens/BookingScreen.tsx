import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { reservationService } from '../services/reservationService';
import BottomNavBar from '../components/BottomNavBar';
import { useCalendar } from '../hooks/useCalendar';

export default function BookingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const venue = route.params?.venue || 'main';
  const venueName = venue === 'main' ? 'MT Seminar Hall' : venue === 'mini' ? 'Lib Seminar Hall' : 'Meeting Hall';
  const {
    monthOffset,
    activeDate,
    daysInMonth,
    firstDayIndex,
    selectedDay,
    setSelectedDay,
    selectedSlot,
    setSelectedSlot,
    nextMonth,
    prevMonth,
  } = useCalendar();

  const handleSelectDate = (day: number) => {
    setSelectedDay(day);
    setSelectedSlot(null);
  };

  const [bookedSlots, setBookedSlots] = useState<{ day: number, slot: 'fn' | 'an' }[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchReservations = async () => {
        const response = await reservationService.getReservations();
        if (response.success && isActive) {
          const year = activeDate.getFullYear();
          const month = activeDate.getMonth();
          const booked = response.data
            .filter((r: any) => {
               const d = new Date(r.startTime);
               return r.hallId === venue && d.getFullYear() === year && d.getMonth() === month;
            })
            .map((r: any) => {
               const d = new Date(r.startTime);
               return { day: d.getDate(), slot: d.getHours() < 12 ? 'fn' : 'an' };
            });
          setBookedSlots(booked);
        }
      };
      fetchReservations();
      return () => { isActive = false; };
    }, [venue, activeDate])
  );

  const isToday = selectedDay === new Date().getDate() && monthOffset === 0;
  const now = new Date();
  const isFnExpired = isToday && now.getHours() >= 12;
  const isAnExpired = isToday && (now.getHours() > 16 || (now.getHours() === 16 && now.getMinutes() >= 10));

  const currentSlotData = selectedDay ? {
    fn: bookedSlots.find(b => b.day === selectedDay && b.slot === 'fn') ? 'booked' : (isFnExpired ? 'expired' : 'available'),
    an: bookedSlots.find(b => b.day === selectedDay && b.slot === 'an') ? 'booked' : (isAnExpired ? 'expired' : 'available')
  } : null;

  const isPastDay = (day: number) => monthOffset === 0 && day < new Date().getDate();

  const getDayClasses = (day: number) => {
    const isSelected = selectedDay === day;
    const past = isPastDay(day);
    const baseClasses = "h-10 w-[12%] m-[1%] flex items-center justify-center rounded-lg font-bold ";
    
    if (past) return baseClasses + "bg-gray-100 border border-transparent opacity-50";
    if (isSelected) return baseClasses + "bg-[#031635] border-2 border-[#031635]";

    const fnBooked = bookedSlots.find(b => b.day === day && b.slot === 'fn');
    const anBooked = bookedSlots.find(b => b.day === day && b.slot === 'an');

    if (fnBooked && anBooked) return baseClasses + "bg-[#fef2f2] border border-[#fee2e2]"; // red-50
    if (fnBooked || anBooked) return baseClasses + "bg-[#fef3c7] border border-[#fde68a]"; // amber-100
    
    return baseClasses + "bg-[#d1fae5] border border-transparent"; // emerald-100
  };

  const getDayTextColor = (day: number) => {
    const past = isPastDay(day);
    if (past) return "text-gray-400";
    if (selectedDay === day) return "text-white";
    
    const fnBooked = bookedSlots.find(b => b.day === day && b.slot === 'fn');
    const anBooked = bookedSlots.find(b => b.day === day && b.slot === 'an');

    if (fnBooked && anBooked) return "text-[#991b1b]"; // red-800
    if (fnBooked || anBooked) return "text-[#92400e]"; // amber-800
    
    return "text-[#065f46]"; // emerald-800
  };

  const getSlotClasses = (type: 'fn' | 'an') => {
    const isBooked = currentSlotData?.[type] === 'booked';
    const isExpired = currentSlotData?.[type] === 'expired';
    const isSelected = selectedSlot === type;
    const baseClasses = "flex-1 flex-col items-center justify-center p-4 rounded-xl border-2 ";

    if (isBooked) return baseClasses + "bg-[#f8fafc] border-[#fecaca] opacity-60";
    if (isExpired) return baseClasses + "bg-gray-100 border-gray-300 opacity-50";
    if (isSelected) return baseClasses + "bg-[#eff6ff] border-[#3b82f6]";
    return baseClasses + "bg-[#ecfdf5] border-[#a7f3d0]";
  };

  const getSlotTextColor = (type: 'fn' | 'an') => {
    const isBooked = currentSlotData?.[type] === 'booked';
    const isExpired = currentSlotData?.[type] === 'expired';
    const isSelected = selectedSlot === type;

    if (isBooked) return "text-[#991b1b]";
    if (isExpired) return "text-gray-400";
    if (isSelected) return "text-[#1e3a8a]";
    return "text-[#065f46]";
  };

  const getSlotIcon = (type: 'fn' | 'an') => {
    const isBooked = currentSlotData?.[type] === 'booked';
    const isExpired = currentSlotData?.[type] === 'expired';
    if (isBooked) return 'lock';
    if (isExpired) return 'block';
    return 'check-circle';
  };

  const getSlotIconColor = (type: 'fn' | 'an') => {
    const isBooked = currentSlotData?.[type] === 'booked';
    const isExpired = currentSlotData?.[type] === 'expired';
    const isSelected = selectedSlot === type;

    if (isBooked) return "#991b1b";
    if (isExpired) return "#9ca3af";
    if (isSelected) return "#1e3a8a";
    return "#065f46";
  };

  const getSlotStatusText = (type: 'fn' | 'an') => {
    const isBooked = currentSlotData?.[type] === 'booked';
    const isExpired = currentSlotData?.[type] === 'expired';
    const isSelected = selectedSlot === type;

    if (isBooked) return "Booked";
    if (isExpired) return "Expired";
    if (isSelected) return "Selected";
    return "Available";
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(<View key={`empty-${i}`} className="h-10 w-[12%] m-[1%]" />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const past = isPastDay(i);
    calendarDays.push(
      <TouchableOpacity
        key={i}
        onPress={() => handleSelectDate(i)}
        className={getDayClasses(i)}
        disabled={past}
      >
        <Text className={`${getDayTextColor(i)} font-bold`}>{i}</Text>
      </TouchableOpacity>
    );
  }

  const isContinueEnabled = selectedDay !== null && selectedSlot !== null;

  return (
    <SafeAreaView className="flex-1 bg-surface relative">
      {/* TopAppBar */}
      <View className="w-full bg-surface border-b border-outline-variant px-4 py-2 flex-row justify-between items-center z-50">
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-primary-container">
            <Image 
              source={require('../../assets/ifet-logo.png')}
              className="w-full h-full bg-white"
              resizeMode="contain"
            />
          </View>
          <Text className="text-xl font-bold text-primary">Campus Reservations</Text>
        </View>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full"
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="close" size={28} color="#031635" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-[120px]" className="flex-1 w-full">
        <View className="w-full max-w-[480px] self-center">
          
          {/* Breadcrumb / Header Title */}
          <View className="flex-col gap-1 mb-6 mt-4">
            <Text className="text-3xl font-bold text-primary">Select Date & Slot</Text>
            <Text className="text-base text-on-surface-variant">Choose your preferred session for {venueName}</Text>
          </View>

          {/* Section 1: Calendar Grid */}
          <View className="bg-white border border-outline-variant rounded-xl p-4 mb-6 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-primary">
                {activeDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  className={`p-1 rounded-full ${monthOffset === 0 ? 'opacity-30' : ''}`}
                  disabled={monthOffset === 0}
                  onPress={prevMonth}
                >
                  <MaterialIcons name="chevron-left" size={24} color="#031635" />
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`p-1 rounded-full ${monthOffset >= 2 ? 'opacity-30' : ''}`}
                  disabled={monthOffset >= 2}
                  onPress={nextMonth}
                >
                  <MaterialIcons name="chevron-right" size={24} color="#031635" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendar Header */}
            <View className="flex-row justify-between mb-2 px-[1%]">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <Text key={idx} className="w-[12%] text-center text-xs font-bold text-outline uppercase">{day}</Text>
              ))}
            </View>

            {/* Calendar Days */}
            <View className="flex-row flex-wrap justify-start">
              {calendarDays}
            </View>
          </View>

          {/* Section 2: Dynamic Slot Selection */}
          <View className={`flex-col gap-4 mb-8 ${!selectedDay ? 'opacity-30' : 'opacity-100'}`} pointerEvents={!selectedDay ? 'none' : 'auto'}>
            <Text className="text-xl font-bold text-primary">
              Available Sessions {selectedDay ? `for ${activeDate.toLocaleDateString('en-US', { month: 'long' })} ${selectedDay}` : ''}
            </Text>
            
            <View className="flex-row gap-4">
              {/* Forenoon Slot */}
              <TouchableOpacity 
                className={getSlotClasses('fn')}
                onPress={() => setSelectedSlot('fn')}
                disabled={currentSlotData?.fn === 'booked' || currentSlotData?.fn === 'expired'}
              >
                <Text className={`text-2xl font-bold mb-1 ${getSlotTextColor('fn')}`}>F.N.</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name={getSlotIcon('fn')} size={16} color={getSlotIconColor('fn')} />
                  <Text className={`text-sm font-bold ${getSlotTextColor('fn')}`}>{getSlotStatusText('fn')}</Text>
                </View>
              </TouchableOpacity>

              {/* Afternoon Slot */}
              <TouchableOpacity 
                className={getSlotClasses('an')}
                onPress={() => setSelectedSlot('an')}
                disabled={currentSlotData?.an === 'booked' || currentSlotData?.an === 'expired'}
              >
                <Text className={`text-2xl font-bold mb-1 ${getSlotTextColor('an')}`}>A.N.</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name={getSlotIcon('an')} size={16} color={getSlotIconColor('an')} />
                  <Text className={`text-sm font-bold ${getSlotTextColor('an')}`}>{getSlotStatusText('an')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 3: Sequential Button */}
          <TouchableOpacity
            disabled={!isContinueEnabled}
            onPress={() => navigation.navigate('FinalReservation', { venue, activeDate: activeDate.toISOString(), selectedDay, selectedSlot })}
            className={`w-full py-4 rounded-xl items-center justify-center ${isContinueEnabled ? 'bg-[#031635]' : 'bg-gray-400 opacity-50'}`}
          >
            <Text className="text-white font-bold uppercase tracking-wider text-sm">
              Continue to Booking
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <BottomNavBar activeTab="book" />
    </SafeAreaView>
  );
}
