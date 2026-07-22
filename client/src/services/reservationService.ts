import { API_BASE_URL, getToken } from './authService';

export const reservationService = {
  getReservations: async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      }
      return { success: false, message: data.message || 'Failed to fetch reservations' };
    } catch (error) {
      console.error('Fetch reservations error:', error);
      return { success: false, message: 'Could not connect to the server' };
    }
  },
  
  createReservation: async (hallId: string, startTime: string, endTime: string, purpose: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hallId, startTime, endTime, purpose })
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      }
      return { success: false, message: data.message || 'Failed to create reservation' };
    } catch (error) {
      console.error('Create reservation error:', error);
      return { success: false, message: 'Could not connect to the server' };
    }
  },

  deleteReservation: async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      }
      return { success: false, message: data.message || 'Failed to delete reservation' };
    } catch (error) {
      console.error('Delete reservation error:', error);
      return { success: false, message: 'Could not connect to the server' };
    }
  }
};
