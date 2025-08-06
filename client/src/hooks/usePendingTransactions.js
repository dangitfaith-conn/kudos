import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import * as adminService from '../services/adminService';

export const usePendingTransactions = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingTransactions();
      setPending(data);
    } catch (err) {
      setError('Failed to fetch pending transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (transactionId) => {
    try {
      await adminService.approveTransaction(transactionId);
      toast({ title: 'Transaction approved', status: 'success' });
      fetchPending(); // Refresh the list
    } catch (err) {
      toast({ title: 'Approval failed', description: err.message, status: 'error' });
    }
  };

  const handleDeny = async (transactionId) => {
    try {
      await adminService.denyTransaction(transactionId);
      toast({ title: 'Transaction denied', status: 'warning' });
      fetchPending(); // Refresh the list
    } catch (err) {
      toast({ title: 'Denial failed', description: err.message, status: 'error' });
    }
  };

  return { pending, loading, error, handleApprove, handleDeny };
};
