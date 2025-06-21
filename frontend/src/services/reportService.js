import api from './api';

export const getAllReports = () => api.get('/MatchReports');
export const createReport = (report) => api.post('/MatchReports', report);

