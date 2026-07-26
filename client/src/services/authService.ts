import ENV from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = ENV.apiUrl;

let globalToken: string | null = null;
export const setToken = (token: string | null) => globalToken = token;
export const getToken = () => globalToken;

export const authService = {
  login: async (email?: string, password?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) setToken(data.token);
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Auth Service Error:', error);
      return { success: false, message: 'Could not connect to the server' };
    }
  },
  saveCredentials: async (email?: string, password?: string) => {
    try {
      if (email && password) {
        await AsyncStorage.setItem('@app_email', email);
        await AsyncStorage.setItem('@app_password', password);
      }
    } catch (e) {
      console.error('Failed to save credentials', e);
    }
  },
  loadCredentials: async () => {
    try {
      const email = await AsyncStorage.getItem('@app_email');
      const password = await AsyncStorage.getItem('@app_password');
      if (email !== null && password !== null) {
        return { email, password };
      }
    } catch (e) {
      console.error('Failed to load credentials', e);
    }
    return null;
  },
  clearCredentials: async () => {
    try {
      await AsyncStorage.removeItem('@app_email');
      await AsyncStorage.removeItem('@app_password');
    } catch (e) {
      console.error('Failed to clear credentials', e);
    }
  }
};
