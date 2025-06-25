import api from './api';

export const getTotal = (playerId) =>
  api.get(`/api/playerstats/${playerId}/total`);
export const getWins = (playerId) =>
  api.get(`/api/playerstats/${playerId}/wins`);
export const getLosses = (playerId) =>
  api.get(`/api/playerstats/${playerId}/losses`);
export const getDraws = (playerId) =>
  api.get(`/api/playerstats/${playerId}/draws`);
export const getGamesByArmy = (playerId, army) =>
  api.get(`/api/playerstats/${playerId}/army/${army}/total`);
export const getWinsByArmy = (playerId, army) =>
  api.get(`/api/playerstats/${playerId}/army/${army}/wins`);
export const getMapWinRate = (playerId, map) =>
  api.get(`/api/playerstats/${playerId}/map/${map}/winrate`);
export const getDeploymentWinRate = (playerId, deployment) =>
  api.get(`/api/playerstats/${playerId}/deployment/${deployment}/winrate`);
export const getPrimaryWinRate = (playerId, mission) =>
  api.get(`/api/playerstats/${playerId}/primary/${mission}/winrate`);
export const getBestOpponent = (playerId) =>
  api.get(`/api/playerstats/${playerId}/best-opponent`);
export const getWorstOpponent = (playerId) =>
  api.get(`/api/playerstats/${playerId}/worst-opponent`);
