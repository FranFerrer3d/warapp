import axios from 'axios';

// BaseURL apuntando directamente a la API desplegada con prefijo /api
const api = axios.create({
  baseURL: 'https://warapi.onrender.com/api'
});

export default api;
