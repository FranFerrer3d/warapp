import axios from 'axios';

// BaseURL configurable a través de variables de entorno para permitir
// utilizar un proxy de desarrollo y así evitar problemas de CORS.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Añadimos el token de autenticación a cada petición si está disponible
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
