import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "bootstrap";
import api from './api/axios';
import { store } from './store';
import '@/assets/theme.css';

const app = createApp(App);

// Set initial theme on load
document.documentElement.setAttribute('data-theme', store.theme);
if (store.theme === 'dark') document.body.classList.add('dark');

// Axios interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token expired or invalid -> auto logout
      localStorage.removeItem('token');
      store.loggedUser = { id: '', name: '', surname: '', email: '' };
      store.addToast('Sessione scaduta. Effettua di nuovo il login.', 'warning');
      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
      }
      return Promise.reject(error);
    }
    // Global error toast (skip noise if desired)
    const msg = error?.response?.data?.message || 'Si è verificato un errore.';
    store.addToast(msg, 'error', 3500);
    return Promise.reject(error);
  }
);

app.use(router);
app.mount('#app');
