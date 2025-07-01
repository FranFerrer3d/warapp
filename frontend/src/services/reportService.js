import api, { authHeaders } from './api';

export const getAllReports = () => api.get('/api/MatchReports', { headers: authHeaders() });
export const createReport = (report) => api.post('/api/MatchReports', report, { headers: authHeaders() });
export const getReportById = (id) => api.get(`/api/MatchReports/${id}`, { headers: authHeaders() });
export const getReportsByPlayer = (playerId) =>
  api.get(`/api/MatchReports/GetByPlayerId?playerId=${playerId}`, { headers: authHeaders() });
export const updateReport = (id, report) =>
  api.put(`/api/MatchReports/${id}`, report, { headers: authHeaders() });
export const deleteReport = (id) => api.delete(`/api/MatchReports/${id}`, { headers: authHeaders() });

