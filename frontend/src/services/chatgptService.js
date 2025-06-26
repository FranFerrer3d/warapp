import api from './api'

export const askChatGPT = (payload) => api.post('/chatgpt', payload)
