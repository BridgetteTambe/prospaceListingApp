import api from './client.js';

export const updateProfileRequest = (data) =>
  api.put('/users/profile', data).then((r) => r.data);

export const changePasswordRequest = (data) =>
  api.put('/users/password', data).then((r) => r.data);
