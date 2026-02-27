import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// 1. PUBLIC CLIENT: For the Masonry grid and reading blog posts
export const publicClient = axios.create({
  baseURL,
  headers: defaultHeaders,
});

// 2. ADMIN CLIENT: For uploads and management
const adminClient = axios.create({
  baseURL,
  headers: defaultHeaders,
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      // Use window.location only if absolutely necessary, 
      // otherwise handle this in your AuthContext
      if (!window.location.pathname.includes('/login')) {
         window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default adminClient;