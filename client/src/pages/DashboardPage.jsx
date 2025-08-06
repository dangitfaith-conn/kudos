import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';
import KudosBalanceCard from '../components/dashboard/KudosBalanceCard';
import RecentTransactionsList from '../components/dashboard/RecentTransactionsList';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profile, transactions, loading, error } = useDashboardData(user);

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">
          Welcome, {profile?.full_name || 'User'}!
        </Heading>

        <KudosBalanceCard profile={profile} loading={loading} error={error} />

        <RecentTransactionsList transactions={transactions} loading={loading} error={error} />

      </VStack>
    </Box>
  );
};

export default DashboardPage;


