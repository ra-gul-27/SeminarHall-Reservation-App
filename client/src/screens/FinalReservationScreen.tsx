import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal, FlatList, Alert, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopAppBar from '../components/TopAppBar';
import { reservationService } from '../services/reservationService';

export default function FinalReservationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract params from BookingScreen
  const venue = route.params?.venue || 'main';
  const selectedDay = route.params?.selectedDay || 15;
  const activeDate = route.params?.activeDate ? new Date(route.params.activeDate) : new Date();
  const selectedSlot = route.params?.selectedSlot || 'fn';

  const venueName = venue === 'main' ? 'MT Seminar Hall' : venue === 'mini' ? 'Lib Seminar Hall' : 'Meeting Hall';

  // Construct nice date string
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateStr = `${monthNames[activeDate.getMonth()]} ${selectedDay}, ${activeDate.getFullYear()}`;

  // Mock time string based on slot
  const timeStr = selectedSlot === 'fn' ? '10:00 AM - 12:00 PM [F.N]' : '01:00 PM - 04:10 PM [A.N]';

  // UI States: 'form' | 'processing' | 'success'
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [countdown, setCountdown] = useState(6);

  const [organizerName, setOrganizerName] = useState('');
  const [department, setDepartment] = useState('Select Department');
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState({ organizerName: false, department: false, purpose: false });
  const [isDeptModalVisible, setDeptModalVisible] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Artificial Intelligence & Data Science',
    'Artificial Intelligence & Machine Learning',
    'Mechanical Engineering',
    'CSE [Cyber Security]',
    'Information Technology',
    'ECE [VLSI]',
    'Master of Business Administration',
    'Innovation Park',
    'Placement and Training',
    'Professional Society',
    'Research and Development',
    'Management'
  ];

  const handleConfirm = async () => {
    const isOrganizerNameEmpty = !organizerName.trim();
    const isDepartmentEmpty = department === 'Select Department';
    const isPurposeEmpty = !purpose.trim();

    if (isOrganizerNameEmpty || isDepartmentEmpty || isPurposeEmpty) {
      setErrors({
        organizerName: isOrganizerNameEmpty,
        department: isDepartmentEmpty,
        purpose: isPurposeEmpty
      });
      Alert.alert('Required Fields Missing', 'Please fill in all mandatory fields before confirming.');
      return;
    }

    setStep('processing');

    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const startHour = selectedSlot === 'fn' ? 10 : 13;
    const endHour = selectedSlot === 'fn' ? 12 : 16;
    const endMin = selectedSlot === 'fn' ? 0 : 10;

    const startTime = new Date(year, month, selectedDay, startHour, 0).toISOString();
    const endTime = new Date(year, month, selectedDay, endHour, endMin).toISOString();

    const payloadStr = JSON.stringify({
      organizer: organizerName || 'Staff Member',
      department: department,
      purpose: purpose || `Reserved for ${department}`
    });

    const response = await reservationService.createReservation(venue, startTime, endTime, payloadStr);

    // Add artificial delay to ensure the beautiful transition animation is visible
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (response.success) {
      setStep('success');
    } else {
      setStep('form');
      Alert.alert('Booking Failed', response.message);
    }
  };

  useEffect(() => {
    if (step !== 'success') return;

    if (countdown <= 0) {
      navigation.navigate('Dashboard');
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, countdown, navigation]);

  useEffect(() => {
    if (Platform.OS !== 'android' || step !== 'success') return;

    const onBackPress = () => {
      navigation.navigate('Dashboard');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [step, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-surface relative">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        className="flex-1 w-full"
      >
        {step === 'form' && (
          <>
            <TopAppBar />
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="p-4 pb-[120px]" className="flex-1 w-full">
              <View className="w-full max-w-2xl mx-auto flex-col gap-6 mt-4">

                <View className="mb-2">
                  <Text className="text-3xl font-bold text-primary mb-1">Finalize Reservation</Text>
                  <Text className="text-base text-on-surface-variant">Please review your booking details before confirming.</Text>
                </View>

                {/* Summary Box (Bento Style) */}
                <View className="bg-white border border-outline-variant rounded-xl p-6 flex-col gap-4 shadow-sm">
                  <View className="flex-row items-center gap-4 border-b border-outline-variant pb-4">
                    <View className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center">
                      <MaterialIcons name="event-available" size={24} color="#0b1c30" />
                    </View>
                    <View className="flex-1 pr-2">
                      <Text className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Schedule</Text>
                      <Text className="text-xl font-bold text-primary flex-wrap">{dateStr} | {timeStr}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center">
                      <MaterialIcons name="meeting-room" size={24} color="#0b1c30" />
                    </View>
                    <View className="flex-1 pr-2">
                      <Text className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Location</Text>
                      <Text className="text-xl font-bold text-primary flex-wrap">{venueName}</Text>
                    </View>
                  </View>
                </View>

                {/* Form Inputs */}
                <View className="flex-col gap-4">
                  <View className="flex-col gap-1">
                    <Text className={`text-sm font-semibold ${errors.organizerName ? 'text-red-500' : 'text-on-surface-variant'}`}>Organizer Name *</Text>
                    <TextInput
                      className={`w-full h-12 bg-surface-container-low border rounded-lg px-4 text-on-surface ${errors.organizerName ? 'border-red-500' : 'border-outline-variant'}`}
                      placeholder="Enter your full name"
                      value={organizerName}
                      onChangeText={(val) => {
                        setOrganizerName(val);
                        if (errors.organizerName) setErrors({ ...errors, organizerName: false });
                      }}
                    />
                    {errors.organizerName && <Text className="text-xs text-red-500">Organizer name is required.</Text>}
                  </View>

                  <View className="flex-col gap-1">
                    <Text className={`text-sm font-semibold ${errors.department ? 'text-red-500' : 'text-on-surface-variant'}`}>Department *</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setDeptModalVisible(true)}
                      className={`w-full h-12 bg-surface-container-low border rounded-lg px-4 flex-row justify-between items-center ${errors.department ? 'border-red-500' : 'border-outline-variant'}`}
                    >
                      <Text className={`${department === 'Select Department' ? 'text-on-surface-variant' : 'text-on-surface'} flex-1`} numberOfLines={1}>{department}</Text>
                      <MaterialIcons name="arrow-drop-down" size={24} color={errors.department ? '#ef4444' : '#44474e'} />
                    </TouchableOpacity>
                    {errors.department && <Text className="text-xs text-red-500">Please select a department.</Text>}
                  </View>

                  <View className="flex-col gap-1">
                    <Text className={`text-sm font-semibold ${errors.purpose ? 'text-red-500' : 'text-on-surface-variant'}`}>Event Purpose *</Text>
                    <TextInput
                      className={`w-full border bg-surface-container-low rounded-lg px-4 py-3 text-on-surface ${errors.purpose ? 'border-red-500' : 'border-outline-variant'}`}
                      placeholder="Briefly describe the seminar agenda..."
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={purpose}
                      onChangeText={(val) => {
                        setPurpose(val);
                        if (errors.purpose) setErrors({ ...errors, purpose: false });
                      }}
                    />
                    {errors.purpose && <Text className="text-xs text-red-500">Event purpose is required.</Text>}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleConfirm}
                    className="w-full bg-[#1A365D] py-4 rounded-xl mt-4 items-center shadow-md"
                  >
                    <Text className="text-white font-bold text-lg">Confirm Booking</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </ScrollView>
            {/* Department Selection Modal */}
            <Modal
              visible={isDeptModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setDeptModalVisible(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setDeptModalVisible(false)}
                className="flex-1 bg-black/50 justify-center items-center p-4"
              >
                <View className="bg-white w-full max-w-sm rounded-xl py-2 shadow-xl max-h-[80%]">
                  <Text className="text-lg font-bold text-primary p-4 border-b border-outline-variant">Select Department</Text>
                  <FlatList
                    data={departments}
                    keyExtractor={(item) => item}
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                    indicatorStyle="black"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="p-4 border-b border-outline-variant/30"
                        onPress={() => {
                          setDepartment(item);
                          setErrors({ ...errors, department: false });
                          setDeptModalVisible(false);
                        }}
                      >
                        <Text className={`text-base ${department === item ? 'font-bold text-primary' : 'text-on-surface'}`}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <View className="absolute inset-0 z-50 bg-[#1A365D] flex-col items-center justify-center p-4">
            <ActivityIndicator size="large" color="#ffffff" className="mb-4" />
            <Text className="text-2xl font-bold text-white tracking-wide">Securing your slot...</Text>
          </View>
        )}

        {/* Success State */}
        {step === 'success' && (
          <View className="absolute inset-0 z-50 bg-emerald-500 flex-col items-center justify-center p-6">
            <View className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl">
              <MaterialIcons name="check" size={80} color="#10b981" />
            </View>

            <Text className="text-4xl font-bold text-white mb-6 text-center">Booking Confirmed!</Text>

            {/* Receipt Card */}
            <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex-col gap-4 mb-8">
              <View className="flex-row justify-between items-center border-b border-outline-variant pb-4">
                <Text className="text-sm font-semibold text-on-surface-variant uppercase">Venue</Text>
                <Text className="font-bold text-[#1A365D]">{venueName}</Text>
              </View>
              <View className="flex-row justify-between items-center border-b border-outline-variant pb-4">
                <Text className="text-sm font-semibold text-on-surface-variant uppercase">Date & Session</Text>
                <Text className="font-bold text-[#1A365D] text-right flex-shrink pl-4">{dateStr} | {selectedSlot === 'fn' ? 'F.N' : 'A.N'}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-on-surface-variant uppercase">Host</Text>
                <Text className="font-bold text-[#1A365D]">{department.substring(0, 15)}{department.length > 15 ? '...' : ''}</Text>
              </View>
            </View>

            <Text className="text-sm font-medium text-white opacity-90 text-center">
              Redirecting to Dashboard in {countdown} seconds...
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
