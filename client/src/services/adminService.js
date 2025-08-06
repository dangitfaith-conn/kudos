import api from './api';

// --- Transaction Moderation ---

export const getPendingTransactions = async () => {
  const response = await api.get('/admin/transactions/pending');
  return response.data;
};

export const approveTransaction = async (transactionId) => {
  const response = await api.post(`/admin/transactions/${transactionId}/approve`);
  return response.data;
};

export const denyTransaction = async (transactionId) => {
  const response = await api.post(`/admin/transactions/${transactionId}/deny`);
  return response.data;
};

// --- User Management ---

export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const awardCredits = async (userId, amount) => {
  const response = await api.post(`/admin/users/${userId}/award`, { amount });
  return response.data;
};
