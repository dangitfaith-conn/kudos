import api from './api';

export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

