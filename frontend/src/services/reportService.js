import api from './api';

export const getAllReports = () => api.get('/api/matchreports');
export const createReport = (report) => api.post('/api/matchreports', report);

