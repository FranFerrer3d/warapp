import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // En Vercel las serverless están bajo /api
});

export default api;
