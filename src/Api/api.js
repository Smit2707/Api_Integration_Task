import axios from 'axios';

const BASE_URL = 'https://interview-task-bmcl.onrender.com/api/user';

export const userApi = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/user_login`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getUserDetails: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/userDetails`, {
        params: { userId },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};