import api, { authHeaders } from './api';

export const getAllPlayers = () => api.get('/Player', { headers: authHeaders() });
export const createPlayer = (player) => api.post('/Player', player, { headers: authHeaders() });
export const deletePlayer = (id) => api.delete(`/Player/${id}`, { headers: authHeaders() });
export const getPlayerByEmail = (email) => api.get(`/Player/GetByEmail?email=${email}`, { headers: authHeaders() });
export const getPlayerById = (id) => api.get(`/Player/${id}`, { headers: authHeaders() });
export const updatePlayer = (player) => api.put('/Player', player, { headers: authHeaders() });

