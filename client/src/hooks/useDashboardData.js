import { useState, useEffect } from 'react';
import * as userService from '../services/userService';
import { getApprovedTransactions } from '../services/transactionService';

export const useDashboardData = (user) => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, transactionsData] = await Promise.all([
          userService.getMe(),
          getApprovedTransactions(),
        ]);
        setProfile(profileData);
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return { profile, transactions, loading, error };
};
