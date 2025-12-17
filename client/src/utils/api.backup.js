import axios from 'axios';

// Use relative path for Vite proxy to work
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { mockDashboardData, mockAnalyticsStats, mockMonitoringStatus, mockAlerts } from './mockData';

// Add auth token to requests
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const authData = JSON.parse(authStorage);
      const token = authData?.state?.token || authData?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return config;
});

// Mock Fallback Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Request Failed, falling back to mock data:', error.config?.url);

    // Fallback logic based on URL
    if (error.config && error.config.method === 'get') {
      if (error.config.url.includes('/dashboard/data')) {
        return Promise.resolve({ data: mockDashboardData, status: 200 });
      }
      if (error.config.url.includes('/analytics/stats')) {
        return Promise.resolve({ data: mockAnalyticsStats, status: 200 });
      }
      if (error.config.url.includes('/monitoring/status')) {
        return Promise.resolve({ data: mockMonitoringStatus, status: 200 });
      }
      if (error.config.url.includes('/monitoring/alerts')) {
        return Promise.resolve({ data: { alerts: mockAlerts }, status: 200 });
      }
    }

    // Mock PDF Report Download
    if (error.config && error.config.url.includes('/reports/pdf') && error.config.method === 'post') {
      return Promise.resolve({
        data: { filename: 'dashboard_report_mock.pdf', url: '#' },
        status: 200
      });
    }

    // Mock Monitoring Actions
    if (error.config && error.config.url.includes('/monitoring/') && error.config.method === 'post') {
      return Promise.resolve({ data: { success: true }, status: 200 });
    }

    return Promise.reject(error);
  }
);

export default api;

