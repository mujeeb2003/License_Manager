import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    maxRedirects: 0 // Prevent automatic redirects
});

// Add an interceptor to log requests
api.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.log('Response Error:', error.response);
        return Promise.reject(error);
    }
);

export default api;