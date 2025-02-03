import axios from 'axios';

const api = axios.create({
    baseURL: 'https://licapi.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
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