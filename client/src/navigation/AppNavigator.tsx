import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import BookingScreen from '../screens/BookingScreen';
import FinalReservationScreen from '../screens/FinalReservationScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminDownloadScreen from '../screens/AdminDownloadScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login">
        {() => <LoginScreen />}
      </Stack.Screen>
      <Stack.Screen name="Dashboard">
        {() => <DashboardScreen />}
      </Stack.Screen>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminDownload" component={AdminDownloadScreen} />
      <Stack.Screen name="Booking" options={{ animation: 'slide_from_bottom' }}>
        {() => <BookingScreen />}
      </Stack.Screen>
      <Stack.Screen name="FinalReservation" options={{ animation: 'slide_from_right' }}>
        {() => <FinalReservationScreen />}
      </Stack.Screen>
      <Stack.Screen name="History" options={{ animation: 'fade' }}>
        {() => <HistoryScreen />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
