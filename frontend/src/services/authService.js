import api from './api';

export const login = (credentials) => api.post('/Player/login', credentials);

