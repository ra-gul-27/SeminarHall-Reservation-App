import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, BackHandler, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { reservationService } from '../services/reservationService';
import { authService } from '../services/authService';
import AdminBottomNavBar from '../components/AdminBottomNavBar';

type Booking = {
  id: string;
  hallId: string;
  dateObj: Date;
  dateStr: string;
  slot: 'fn' | 'an';
  purpose: string;
  user: string;
  department: string;
};

let hasFetchedInitially = false;

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const [groupedBookings, setGroupedBookings] = useState<{ main: Booking[], mini: Booking[], meeting: Booking[] }>({
    main: [],
    mini: [],
    meeting: []
  });

  const [isLoading, setIsLoading] = useState<boolean>(!hasFetchedInitially);

  const getDeptAbbreviation = (dept?: string) => {
    switch (dept) {
      case 'Computer Science & Engineering': return 'CSE';
      case 'Electronics and Communication Engineering': return 'ECE';
      case 'Electrical and Electronics Engineering': return 'EEE';
      case 'Artificial Intelligence & Data Science': return 'AIDS';
      case 'Artificial Intelligence & Machine Learning': return 'AIML';
      case 'Mechanical Engineering': return 'MECH';
      case 'CSE [Cyber Security]': return 'CSE (CS)';
      case 'Information Technology': return 'IT';
      case 'Master of Business Administration': return 'MBA';
      case 'ECE [VLSI]': return 'ECE (VLSI)';
      case 'Innovation Park': return 'IP';
      case 'Placement and Training': return 'P&T';
      case 'Management': return 'MGMT';
      default: return dept ? dept.substring(0, 4).toUpperCase() : '';
    }
  };

  const fetchReservations = async (showLoading: boolean = true) => {
    if (showLoading) setIsLoading(true);
    const response = await reservationService.getReservations();
    if (response.success) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let filteredData = response.data.filter((r: any) => {
        const d = new Date(r.startTime);
        d.setHours(0, 0, 0, 0);
        return d.getTime() >= today.getTime();
      });

      const bookings: Booking[] = filteredData.map((r: any) => {
        const dateObj = new Date(r.startTime);
        const hour = dateObj.getHours();

        let parsedData = { organizer: r.user?.email || 'Faculty', purpose: r.purpose, department: '' };
        try {
          parsedData = JSON.parse(r.purpose);
        } catch (e) { }

        return {
          id: r.id,
          hallId: r.hallId,
          dateObj: dateObj,
          dateStr: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
          slot: hour < 12 ? 'fn' : 'an',
          purpose: parsedData.purpose,
          user: parsedData.organizer,
          department: getDeptAbbreviation(parsedData.department)
        };
      });

      bookings.sort((a, b) => {
        const timeDiff = a.dateObj.getTime() - b.dateObj.getTime();
        if (timeDiff !== 0) return timeDiff;
        return a.slot === 'fn' ? -1 : 1;
      });

      setGroupedBookings({
        main: bookings.filter(b => b.hallId === 'main'),
        mini: bookings.filter(b => b.hallId === 'mini'),
        meeting: bookings.filter(b => b.hallId === 'meeting')
      });
    }
    if (showLoading) setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservations(!hasFetchedInitially);
      hasFetchedInitially = true;
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this booking and make the slot available?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel it",
          style: "destructive",
          onPress: async () => {
            const res = await reservationService.deleteReservation(id);
            if (res.success) {
              fetchReservations(false);
            } else {
              Alert.alert("Error", res.message);
            }
          }
        }
      ]
    );
  };

  const renderHallSection = (title: string, data: Booking[]) => (
    <View className="mb-8">
      <View className="flex-row items-center gap-2 mb-4 bg-surface pb-3 pt-2 border-b-2 border-gray-300 sticky top-0 z-10">
        <MaterialIcons name="business" size={24} color="#031635" />
        <Text className="text-xl font-bold text-primary">{title}</Text>
      </View>

      {isLoading ? (
        <View className="bg-surface-container rounded-xl p-6 items-center justify-center border border-outline-variant border-dashed">
          <ActivityIndicator size="small" color="#031635" />
          <Text className="text-secondary mt-3 font-medium">Fetching...</Text>
        </View>
      ) : data.length === 0 ? (
        <View className="bg-surface-container rounded-xl p-6 items-center justify-center border border-outline-variant border-dashed">
          <MaterialIcons name="event-busy" size={40} color="#8293b8" />
          <Text className="text-secondary mt-2 font-medium">No active bookings.</Text>
        </View>
      ) : (
        <View className="flex-col gap-4">
          {data.map((item, index) => (
            <View key={item.id} className="relative">
              {(index === 0 || data[index - 1].dateStr !== item.dateStr) && (
                <View className="flex-row items-center gap-2 mb-2 ml-1 mt-2">
                  <MaterialIcons name="calendar-today" size={14} color="#505f76" />
                  <Text className="text-sm font-bold text-secondary uppercase tracking-wider">
                    {item.dateStr}
                  </Text>
                </View>
              )}
              <View className="bg-white rounded-xl border border-outline-variant p-4 flex-row items-center justify-between shadow-sm">
                <View className="flex-col gap-1 flex-1">
                  <View className="flex-row items-start gap-2">
                    <View className={`px-2 py-0.5 rounded-md shrink-0 mt-0.5 ${item.slot === 'fn' ? 'bg-[#eff6ff]' : 'bg-[#fdf4ff]'}`}>
                      <Text className={`text-[10px] font-bold uppercase tracking-widest ${item.slot === 'fn' ? 'text-[#1d4ed8]' : 'text-[#a21caf]'}`}>
                        {item.slot === 'fn' ? 'Forenoon' : 'Afternoon'}
                      </Text>
                    </View>
                    <Text className="text-base font-bold text-primary flex-1 leading-tight">{item.purpose}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-2 gap-2">
                    <View className="flex-row items-start gap-1 flex-1">
                      <MaterialIcons name="person-outline" size={14} color="#75777f" style={{ marginTop: 2 }} />
                      <Text className="text-xs text-on-surface-variant font-medium flex-1 leading-tight">
                        {item.department ? `${item.user} [${item.department}]` : item.user}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1 shrink-0">
                      <MaterialIcons name="schedule" size={14} color="#75777f" />
                      <Text className="text-xs text-on-surface-variant font-medium shrink-0">
                        {item.slot === 'fn' ? "10:00 AM - 12:00 PM" : "01:00 PM - 04:10 PM"}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  className="p-2 ml-2"
                  onPress={() => handleDelete(item.id)}
                >
                  <MaterialIcons name="delete-outline" size={28} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface relative">
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
          onPress={() => {
            authService.clearCredentials();
            navigation.replace('Login');
          }}
        >
          <Image
            source={require('../../assets/QUIT.png')}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-[120px]" className="flex-1 w-full" showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-[480px] self-center">

          <View className="flex-col gap-1 mb-8 mt-4">
            <Text className="text-3xl font-bold text-primary">Active Reservations</Text>
            <Text className="text-base text-on-surface-variant">Manage and monitor all active campus bookings.</Text>
          </View>

          {renderHallSection('MT Seminar Hall', groupedBookings.main)}
          {renderHallSection('Lib Seminar Hall', groupedBookings.mini)}
          {renderHallSection('Meeting Hall', groupedBookings.meeting)}

        </View>
      </ScrollView>

      <AdminBottomNavBar activeTab="history" />
    </SafeAreaView>
  );
}
