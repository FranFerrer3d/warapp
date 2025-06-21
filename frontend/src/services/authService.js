import api from './api';

export const login = (credentials) => api.post('/Player/Login', credentials);

