import api from './api';

export const getTotal = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/total`);
export const getWins = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/wins`);
export const getLosses = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/losses`);
export const getDraws = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/draws`);
export const getGamesByArmy = (playerId, army) =>
  api.get(`/api/PlayerStats/${playerId}/army/${army}/total`);
export const getWinsByArmy = (playerId, army) =>
  api.get(`/api/PlayerStats/${playerId}/army/${army}/wins`);
export const getMapWinRate = (playerId, map) =>
  api.get(`/api/PlayerStats/${playerId}/map/${map}/winrate`);
export const getDeploymentWinRate = (playerId, deployment) =>
  api.get(`/api/PlayerStats/${playerId}/deployment/${deployment}/winrate`);
export const getPrimaryWinRate = (playerId, mission) =>
  api.get(`/api/PlayerStats/${playerId}/primary/${mission}/winrate`);
export const getBestOpponent = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/best-opponent`);
export const getWorstOpponent = (playerId) =>
  api.get(`/api/PlayerStats/${playerId}/worst-opponent`);
export const getIdealScenario = (playerId, top = 1) =>
  api.get(`/api/PlayerStats/${playerId}/ideal-scenario/${top}`);
