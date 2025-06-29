import api from './api';

export const getAllReports = () => api.get('/api/MatchReports');
export const createReport = (report) => api.post('/api/MatchReports', report);
export const getReportById = (id) => api.get(`/api/MatchReports/${id}`);
export const getReportsByPlayer = (playerId) =>
  api.get(`/api/MatchReports/GetByPlayerId?playerId=${playerId}`);
export const updateReport = (id, report) =>
  api.put(`/api/MatchReports/${id}`, report);
export const deleteReport = (id) => api.delete(`/api/MatchReports/${id}`);

