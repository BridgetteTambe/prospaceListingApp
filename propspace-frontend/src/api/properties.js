import api from './client.js';

export const fetchProperties = (params) =>
  api.get('/properties', { params }).then((r) => r.data);

export const fetchProperty = (id) =>
  api.get(`/properties/${id}`).then((r) => r.data);

export const fetchMyProperties = () =>
  api.get('/properties/mine/list').then((r) => r.data);

export const createProperty = (data) =>
  api.post('/properties', data).then((r) => r.data);

export const updateProperty = (id, data) =>
  api.put(`/properties/${id}`, data).then((r) => r.data);

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`).then((r) => r.data);
