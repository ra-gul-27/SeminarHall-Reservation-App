import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, BackHandler, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { reservationService } from '../services/reservationService';

import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import VenueSelector from '../components/VenueSelector';
import SessionCard from '../components/SessionCard';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [activeVenue, setActiveVenue] = useState('main');
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [monthlyCounts, setMonthlyCounts] = useState({ main: 0, mini: 0, meeting: 0 });

  const getDeptAbbreviation = (dept?: string) => {
    switch(dept) {
      case 'Computer Science & Engineering': return 'CSE';
      case 'Electronics and Communication Engineering': return 'ECE';
      case 'Electrical and Electronics Engineering': return 'EEE';
      case 'Artificial Intelligence & Data Science': return 'AIDS';
      case 'Artificial Intelligence & Machine Learning': return 'AIML';
      case 'Mechanical Engineering': return 'MECH';
      default: return dept ? dept.substring(0, 4).toUpperCase() : '';
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchReservations = async () => {
        const response = await reservationService.getReservations();
        if (response.success && isActive) {
          const todayStr = new Date().toISOString().split('T')[0];
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const counts = { main: 0, mini: 0, meeting: 0 };
          response.data.forEach((r: any) => {
            const d = new Date(r.startTime);
            if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
              if (r.hallId === 'main') counts.main++;
              if (r.hallId === 'mini') counts.mini++;
              if (r.hallId === 'meeting') counts.meeting++;
            }
          });
          setMonthlyCounts(counts);

          const booked = response.data
            .filter((r: any) => new Date(r.startTime).toISOString().split('T')[0] === todayStr)
            .map((r: any) => {
              const hour = new Date(r.startTime).getHours();
              
              let parsedData = { organizer: r.user?.email, purpose: r.purpose, department: '' };
              try {
                parsedData = JSON.parse(r.purpose);
              } catch(e) {}

              return { 
                hallId: r.hallId, 
                slot: hour < 12 ? 'fn' : 'an', 
                purpose: parsedData.purpose, 
                user: parsedData.organizer,
                department: getDeptAbbreviation(parsedData.department)
              };
            });
          setBookedSlots(booked);
        }
      };
      fetchReservations();
      return () => { isActive = false; };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const onBackPress = () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => navigation.replace('Login'), style: 'destructive' },
          ],
          { cancelable: true }
        );
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const checkStatus = (hallId: string, slot: 'fn' | 'an'): 'available' | 'booked' | 'expired' => {
    const isBooked = bookedSlots.find(b => b.hallId === hallId && b.slot === slot);
    if (isBooked) return 'booked';

    const now = new Date();
    if (slot === 'fn' && now.getHours() >= 12) return 'expired';
    if (slot === 'an' && (now.getHours() > 16 || (now.getHours() === 16 && now.getMinutes() >= 10))) return 'expired';

    return 'available';
  };

  const getBookedDetails = (hallId: string, slot: 'fn' | 'an') => {
    const b = bookedSlots.find(b => b.hallId === hallId && b.slot === slot);
    return b ? { 
      title: b.purpose, 
      instructor: b.department ? `${b.user} [${b.department}]` : b.user 
    } : null;
  };

  return (
    <SafeAreaView className="flex-1 bg-surface relative">
      <View className="w-full bg-surface border-b border-outline-variant px-4 py-2 flex-row justify-between items-center z-50">
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
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full"
          onPress={() => navigation.navigate('Login')}
        >
          <Image
            source={require('../../assets/QUIT.png')}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-[120px] items-center" className="flex-1 w-full">
        <View className="w-full max-w-[480px]">
          <VenueSelector activeVenue={activeVenue} onSelectVenue={setActiveVenue} />

          {/* Book by Date section */}
          <View className="flex-col gap-4 mb-12">
            <Text className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Book by Date</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              className="relative overflow-hidden rounded-xl shadow-md"
              onPress={() => navigation.navigate('Booking', { venue: activeVenue })}
            >
              <LinearGradient
                colors={activeVenue === 'main' ? ['#6366f1', '#8b5cf6'] : activeVenue === 'mini' ? ['#0ea5e9', '#3b82f6'] : ['#f59e0b', '#ea580c']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <View className="p-6 relative">
                  <View className="flex-col gap-1 w-[70%] z-10">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xl font-bold text-white">
                        {`Reserve ${activeVenue === 'main' ? 'MT Seminar Hall' : activeVenue === 'mini' ? 'Lib Seminar Hall' : 'Meeting Hall'}`}
                      </Text>
                      <MaterialIcons name="chevron-right" size={24} color="white" />
                    </View>
                    <Text className="text-sm text-white/90">Choose a date to view all available slots for your event.</Text>
                  </View>
                  <View className="absolute right-0 top-0 opacity-30 overflow-hidden">
                    <MaterialIcons name="calendar-month" size={80} color="white" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Daily Sessions List */}
          <View className="flex-col gap-4 mb-12">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Today's Schedule</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Booking', { venue: activeVenue })}>
                <Text className="text-base font-medium text-primary">View Calendar</Text>
              </TouchableOpacity>
            </View>

            {/* Schedule Container */}
            <View className="flex-col gap-4">
              <SessionCard
                time="10:00 AM - 12:00 PM"
                title="Forenoon Session"
                status={checkStatus(activeVenue, 'fn')}
                instructor={getBookedDetails(activeVenue, 'fn')?.instructor}
                purposeText={getBookedDetails(activeVenue, 'fn')?.title}
                onPressArrow={() => navigation.navigate('FinalReservation', { venue: activeVenue, activeDate: new Date().toISOString(), selectedDay: new Date().getDate(), selectedSlot: 'fn' })}
              />
              <SessionCard
                time="01:00 PM - 04:10 PM"
                title="Afternoon Session"
                status={checkStatus(activeVenue, 'an')}
                instructor={getBookedDetails(activeVenue, 'an')?.instructor}
                purposeText={getBookedDetails(activeVenue, 'an')?.title}
                onPressArrow={() => navigation.navigate('FinalReservation', { venue: activeVenue, activeDate: new Date().toISOString(), selectedDay: new Date().getDate(), selectedSlot: 'an' })}
              />
            </View>
          </View>

          {/* Quick Stats Bento-ish section */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1 p-4 rounded-xl bg-white border border-outline-variant flex-col gap-1">
              <MaterialIcons name="event-note" size={24} color="#031635" className="mb-1" />
              <Text className="text-2xl font-bold text-primary">{monthlyCounts[activeVenue as keyof typeof monthlyCounts]}</Text>
              <Text className="text-sm font-semibold tracking-wider text-on-surface-variant">Monthly Bookings</Text>
            </View>
            <View className="flex-1 p-4 rounded-xl bg-white border border-outline-variant flex-col gap-1">
              <MaterialIcons name="verified-user" size={24} color="#031635" className="mb-1" />
              <Text className="text-2xl font-bold text-primary">100%</Text>
              <Text className="text-sm font-semibold tracking-wider text-on-surface-variant">Approval Rate</Text>
            </View>
          </View>
        </View>
      </ScrollView>



      <BottomNavBar activeTab="home" />
    </SafeAreaView>
  );
}
