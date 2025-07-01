import api, { authHeaders } from './api'

export const getAllTeams = () => api.get('/Team', { headers: authHeaders() })
export const getTeamById = (id) => api.get(`/Team/${id}`, { headers: authHeaders() })
export const createTeam = (team) => api.post('/Team', team, { headers: authHeaders() })
export const updateTeam = (team) => api.put('/Team', team, { headers: authHeaders() })
export const deleteTeam = (id) => api.delete(`/Team/${id}`, { headers: authHeaders() })

