import axios from 'axios';

// Same-origin by default: requests go to /api/* and nginx (prod) or the Vite
// dev proxy (dev) forwards them to the backend. Set VITE_API_URL only to point
// at a different origin.
const API_URL = import.meta.env.VITE_API_URL || '/api';

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
