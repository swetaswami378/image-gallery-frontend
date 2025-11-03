import axios from 'axios';
import { API_BASE_URL } from '../constants/constants';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// List of endpoints that should not trigger token refresh
const noAuthEndpoints = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh'
];

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest.url;

    // Don't retry for auth endpoints or if already retried
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !noAuthEndpoints.some(endpoint => requestUrl.includes(endpoint))) {
      
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API.defaults.baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        localStorage.setItem("accessToken", newToken);
        API.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        processQueue(null, newToken);
        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // optional: logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    if (error.response) {
      // Handle specific error responses
      const { status, data } = error.response;
      if (status === 401) {
        console.error('Unauthorized access - possibly invalid token');
      } else if (status === 403) {
        console.error('Forbidden - you do not have permission to access this resource');
      } else if (status === 404) {
        console.error('Resource not found');
      }
      return Promise.reject(data.detail);
    }
    return Promise.reject(error);
  }
);

export default API;