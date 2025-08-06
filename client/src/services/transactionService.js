import api from './api';

export const getApprovedTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const getCompanyValues = async () => {
  const response = await api.get('/transactions/values');
  return response.data;
};
