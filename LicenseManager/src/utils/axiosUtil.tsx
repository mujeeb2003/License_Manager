import axios from "axios";
import { getToken, removeToken } from "./tokenUtil";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    maxRedirects: 0, // Prevent automatic redirects
});

api.interceptors.request.use(
    async (config) => {
        let currentDate = new Date();
        let token = getToken();
        if (!token) {
            return Promise.reject({ error: "No token found" });
            
        }
        
        const decodedToken = jwtDecode(token);
        
        if (!decodedToken) {
            return Promise.reject({ error: "Invalid token" });
        }
        if (decodedToken.exp! * 1000 < currentDate.getTime()) {
            removeToken();
            toast.error("Session expired, please login again");
            window.location.reload();
            return Promise.reject({ error: "Token expired", status: 401 });
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
