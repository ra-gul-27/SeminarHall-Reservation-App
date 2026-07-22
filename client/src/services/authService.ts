import ENV from '../config';

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
  }
};
