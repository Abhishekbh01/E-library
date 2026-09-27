import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  withCredentials: true, // Important: This allows sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we've shown the 401 toast in this session
let hasShownUnauthorizedToast = false;

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Clear any existing auth state
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          // Only show the toast if we haven't shown it yet in this session
          if (!hasShownUnauthorizedToast) {
            toast.error('Your session has expired. Please log in again.');
            hasShownUnauthorizedToast = true;
          }
          window.location.href = '/login';
        }
      }
      
      // Handle other error statuses
      const errorMessage = error.response.data?.message || 'An error occurred';
      if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.response.status === 404) {
        toast.error('The requested resource was not found.');
      } else if (error.response.status !== 401) {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default api;