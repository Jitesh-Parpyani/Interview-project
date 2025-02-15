import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const instance = axios.create({
  baseURL: "https://swapi.dev/api",
});

// Interceptor to attach token
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
