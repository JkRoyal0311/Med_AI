/**
 * Central API service for web.
 * All backend calls go through here — easy to change BASE_URL for production.
 * Axios interceptors automatically attach JWT token to every request.
 */
import axios from 'axios';

// Change this to your computer's local IP for local testing
// Find it: Mac → ifconfig | grep inet, Windows → ipconfig
// For local development, use: http://localhost:8000/api
export const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,  // 60s — Meditron can be slow on first run
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  res => res.data,
  async err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medai_token');
      localStorage.removeItem('medai_user');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || { error: 'Network error' });
  }
);

export const authAPI = {
  register: (d: any) => api.post('/auth/register', d),
  login:    (d: any) => api.post('/auth/login',    d),
};

export const medicalAPI = {
  getDiseaseInfo:    (name: string)         => api.get(`/medical/disease?name=${encodeURIComponent(name)}`),
  predictDisease:    (symptoms: string[])   => api.post('/medical/symptoms/predict', { symptoms }),
  getDrugInfo:       (name: string)         => api.get(`/medical/drug?name=${encodeURIComponent(name)}`),
  getSuggestions:    (q: string)            => api.get(`/medical/search/suggestions?q=${encodeURIComponent(q)}`),
  getHistory:        ()                     => api.get('/medical/history'),
};

// Streaming chat — returns a ReadableStream for SSE
export async function streamChat(data: {
  message: string;
  history: any[];
  user_conditions?: string[];
  pregnancy?: boolean;
}): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const token = localStorage.getItem('medai_token');
  const response = await fetch(`${BASE_URL}/medical/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.body!.getReader();
}
