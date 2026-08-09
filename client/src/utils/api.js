import axios from 'axios';
import Swal from 'sweetalert2';
import { store } from '../redux/store';
import { signOut } from '../redux/user/userSlice';

// The baseUrl is standardly the current origin if not configured, or could be read from env.
const api = axios.create({
  baseURL: '/', 
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      config.headers.Authorization = `Bearer ${refreshToken},${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      // Notify the user using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Session expired or invalid token. Please sign in again.',
        confirmButtonText: 'Log In'
      }).then(() => {
        // Clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        store.dispatch(signOut());
        
        // Redirect to signin after they click OK
        window.location.href = '/signin';
      });
    }
    return Promise.reject(error);
  }
);

export default api;
