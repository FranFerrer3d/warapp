import axios from 'axios';

// BaseURL apuntando directamente a la API desplegada
const api = axios.create({
  baseURL: 'https://warapi.onrender.com'
});

export default api;
