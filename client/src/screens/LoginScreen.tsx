import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, BackHandler, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { authService } from '../services/authService';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [btnState, setBtnState] = useState('normal');

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleSubmit = async () => {
    if (!email || !password) return;
    setBtnState('loading');

    const result = await authService.login(email, password);

    if (result.success) {
      setBtnState('success');
      setTimeout(() => {
        setBtnState('normal');
        
        if (result.data?.user?.role === 'ADMIN' && email === 'ADMIN5') {
          navigation.replace('AdminDashboard');
        } else {
          navigation.replace('Dashboard');
        }
      }, 1000);
    } else {
      setBtnState('normal');
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <View className="flex-1 bg-surface-bright relative">
      {/* Background Watermark */}
      <View className="absolute inset-0 justify-center items-center pointer-events-none w-full h-full">
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUT9DiGQVmpgbpMRElJkwrMEf0BK-obaOEcSXSWtN7_70dd4sU2E7aOLrXFbpMUWA190WmqXeMwmr5Zo2hHcvk4DGnhOuSbgnkZrhnZOxAOPvsfsmA9dy-Ql9EZj28N2IjbRZDxcP2ITxHCnhBWUwibrXgebhOXOoDnVPI3rgSgmmz3VpLtyIZwdHykp4-ywx_k27Q5Sf7UmHOL8pYOSGeIoBT12ZTq6U-8NJdeqIiquW8oWZ0tIiIvpkOxg-WbYO8g-7nWOjRSzbP' }}
          style={{ width: '100%', height: '100%', opacity: 0.15 }}
          resizeMode="contain"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 w-full"
      >
        <ScrollView 
          contentContainerClassName="flex-grow justify-center items-center" 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-md px-8 py-6">

          {/* Header */}
          <View className="items-center mb-10 mt-2">
            <View className="w-24 h-24 bg-[#d3e4fe] rounded-full items-center justify-center mb-4 -mt-6">
              <MaterialIcons name="school" size={48} color="#031635" />
            </View>
            <Text className="text-3xl font-bold text-[#031635] mb-2">Staff Portal</Text>
            <Text className="text-sm text-gray-500 text-center px-4">
              Secure access to the College Seminar  Reservation system
            </Text>
          </View>

          {/* Form Area */}
          <View className="flex flex-col mb-8 gap-y-4">

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-700 mb-2">Official College ID </Text>
              <View className="relative">
                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                  <MaterialIcons name="mail-outline" size={20} color="#75777f" />
                </View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="College ID"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full h-12 bg-white border border-gray-300 rounded-lg pl-12 pr-4 text-base text-gray-800 focus:border-[#031635] focus:bg-white"
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-700 mb-2">Password</Text>
              <View className="relative">
                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                  <MaterialIcons name="lock-outline" size={20} color="#75777f" />
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#a0a0a0"
                  secureTextEntry={!showPassword}
                  className="w-full h-12 bg-white border border-gray-300 rounded-lg pl-12 pr-12 text-base text-gray-800 focus:border-[#031635] focus:bg-white"
                />
                <TouchableOpacity
                  className="absolute right-4 top-0 bottom-0 justify-center z-10"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color="#75777f" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Device & Forgot Password */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberDevice(!rememberDevice)}
              >
                <View className={`w-4 h-4 border rounded border-gray-400 items-center justify-center mr-2 ${rememberDevice ? 'bg-[#031635] border-[#031635]' : 'bg-white'}`}>
                  {rememberDevice && <MaterialIcons name="check" size={12} color="white" />}
                </View>
                <Text className="text-sm font-semibold text-gray-600">Remember device</Text>
              </TouchableOpacity>
              {/* Forgot link removed */}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={btnState === 'loading' || !email || !password}
              className={`w-full h-14 rounded-xl items-center justify-center ${!email || !password ? 'bg-gray-400' : btnState === 'success' ? 'bg-green-600' : 'bg-[#031635]'
                }`}
            >
              {btnState === 'normal' && (
                <Text className="text-white text-base font-bold">Secure Login</Text>
              )}
              {btnState === 'loading' && (
                <Text className="text-white text-base font-bold">Authenticating...</Text>
              )}
              {btnState === 'success' && (
                <Text className="text-white text-base font-bold">Access Granted</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* Footer Area */}
          <View className="items-center">
            <View className="flex-row items-center justify-center mt-6 p-4 rounded-xl bg-surface-container border border-outline-variant">
              <MaterialIcons name="shield" size={14} color="#75777f" className="mr-1.5" />
              <Text className="text-[10px] font-bold text-gray-500 tracking-wider">END-TO-END ENCRYPTED</Text>
            </View>
            <Text className="text-xs text-gray-500 mt-4">
              Need help? <Text className="font-bold text-[#031635]">IT Support Desk</Text>
            </Text>
          </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
