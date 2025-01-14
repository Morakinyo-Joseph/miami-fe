import { ApiConfig } from './types';

export const API_CONFIG: ApiConfig = {
  apiKey: import.meta.env.VITE_API_KEY || '',
  bearerToken: import.meta.env.VITE_BEARER_TOKEN || '',
  baseUrl: 'https://miami-fid0.onrender.com'
};