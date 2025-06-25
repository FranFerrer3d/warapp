import api from './api';

export const getAllReports = () => api.get('/api/matchreports');
export const createReport = (report) => api.post('/api/matchreports', report);
export const getReportById = (id) => api.get(`/api/matchreports/${id}`);
export const getReportsByPlayer = (playerId) =>
  api.get(`/api/matchreports/player/${playerId}`);
export const updateReport = (id, report) =>
  api.put(`/api/matchreports/${id}`, report);
export const deleteReport = (id) => api.delete(`/api/matchreports/${id}`);

