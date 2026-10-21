import axios from 'axios';
import {API_BASE_URL} from '../constants/api';

import {useAuthStore} from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    const token = useAuthStore.getState().token;
    if (error.response?.status === 401 && token &&
      error.config?.headers?.Authorization === `Bearer ${token}` &&
      !error.config?.url?.startsWith('/api/auth/')) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
