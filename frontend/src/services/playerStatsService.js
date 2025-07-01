import api, { authHeaders } from './api';

export const getTotal = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/total`, { headers: authHeaders() });
export const getWins = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/wins`, { headers: authHeaders() });
export const getLosses = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/losses`, { headers: authHeaders() });
export const getDraws = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/draws`, { headers: authHeaders() });
export const getGamesByArmy = (playerId, army) =>
  api.get(`/api/PlayerStats/${playerId}/army/${army}/total`, { headers: authHeaders() });
export const getWinsByArmy = (playerId, army) =>
  api.get(`/api/PlayerStats/${playerId}/army/${army}/wins`, { headers: authHeaders() });
export const getMapWinRate = (playerId, map) =>
  api.get(`/api/PlayerStats/${playerId}/map/${map}/winrate`, { headers: authHeaders() });
export const getDeploymentWinRate = (playerId, deployment) =>
  api.get(`/api/PlayerStats/${playerId}/deployment/${deployment}/winrate`, { headers: authHeaders() });
export const getPrimaryWinRate = (playerId, mission) =>
  api.get(`/api/PlayerStats/${playerId}/primary/${mission}/winrate`, { headers: authHeaders() });
export const getBestOpponent = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/best-opponent`, { headers: authHeaders() });
export const getWorstOpponent = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/worst-opponent`, { headers: authHeaders() });
export const getIdealScenario = (playerId, top = 1) =>
  api.get(`/api/PlayerStats/${playerId}/ideal-scenario/${top}`, { headers: authHeaders() });
