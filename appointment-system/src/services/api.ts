import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const serviceApi = {
  getServices: async (shopId: string) => {
    try {
      console.log('Making API request to:', `${API_URL}/services?shopId=${shopId}`);
      const response = await api.get(`/services?shopId=${shopId}`);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}; 