import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:8000',
});

// Attach JWT token from localStorage before each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = '*/*';
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;

