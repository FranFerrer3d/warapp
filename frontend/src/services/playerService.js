import api from './api';

export const getAllPlayers = () => api.get('/Player');
export const createPlayer = (player) => api.post('/Player', player);
export const deletePlayer = (id) => api.delete(`/Player/${id}`);
export const getPlayerByEmail = (email) => api.get(`/Player/${email}`);

