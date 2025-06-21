import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 10000,
});

// Interceptor per aggiungere il token JWT a tutte le richieste
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Interceptor per errori (puoi personalizzare)
api.interceptors.response.use(
  response => response,
  error => {
    // Puoi gestire errori globali qui
    return Promise.reject(error);
  }
);

export default api;