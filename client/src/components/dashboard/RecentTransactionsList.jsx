import React from 'react';
import {
  Box,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';
import KudoCard from '../ui/KudoCard';

const RecentTransactionsList = ({ transactions, loading, error }) => {
  if (loading) return <HStack justify="center"><Spinner size="xl" /></HStack>;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Recent Kudos Transactions
      </Heading>
      {transactions.length === 0 ? (
        <Alert status="info"><AlertIcon />No recent transactions.</Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {transactions.map((tx) => (
            <KudoCard key={tx.id} transaction={tx} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default RecentTransactionsList;
