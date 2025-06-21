import api from './api';

export const getAllReports = () => api.get('/MatchReport');
export const createReport = (report) => api.post('/MatchReport', report);

