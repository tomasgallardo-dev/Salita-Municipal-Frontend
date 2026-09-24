import axios from 'axios';
import type { AxiosError } from 'axios';

const clientesAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: agrega token automáticamente a cada request
clientesAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('authorization', token);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor global de errores
clientesAxios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Si el token expiró o es inválido, redirigir al login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default clientesAxios;