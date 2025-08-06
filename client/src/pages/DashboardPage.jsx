import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { getApprovedTransactions } from '../services/transactionService';
import * as userService from '../services/userService';
import KudoCard from '../components/ui/KudoCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">
          Welcome, {profile?.full_name || user?.name || 'User'}!
        </Heading>

        <Card>
          <CardHeader>
            <Heading as="h2" size="lg">
              Your Award Balance
            </Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="4xl" fontWeight="bold" color="teal.500">
              {profile?.award_balance || 0} 🏆
            </Text>
          </CardBody>
        </Card>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Recent Kudos Transactions
          </Heading>
          {loading ? (
            <HStack justify="center">
              <Spinner size="xl" />
            </HStack>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {transactions.map((tx) => (
                <KudoCard
                  key={tx.id}
                  transaction={tx}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default DashboardPage;


