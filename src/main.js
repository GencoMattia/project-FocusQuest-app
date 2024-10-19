import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "bootstrap";
import axios from 'axios';

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

const app = createApp(App);
app.use(router);
app.mount('#app');
