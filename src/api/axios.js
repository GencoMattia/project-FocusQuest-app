import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 10000,
});

// Interceptor per errori (puoi personalizzare)
api.interceptors.response.use(
  response => response,
  error => {
    // Puoi gestire errori globali qui
    return Promise.reject(error);
  }
);

export default api;