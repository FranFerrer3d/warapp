import api from './api';

export const login = ({ user, pass }) =>
  api.post('/Player/Login', null, {
    params: { user, pass },
  });

