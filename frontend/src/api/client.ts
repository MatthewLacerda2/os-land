import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL: API_URL,
});

// Ground Truth: All requests automatically look for the JWT
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('os_land_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
