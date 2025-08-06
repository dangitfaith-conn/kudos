import React from 'react';
import {
  Box,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import KudoCard from '../ui/KudoCard';

const PendingTransactionsList = ({ pending, loading, error, onApprove, onDeny }) => {
  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="lg">Pending Kudos</Heading>
      {pending.length === 0 ? (
        <Alert status="info"><AlertIcon />No pending transactions.</Alert>
      ) : (
        pending.map((tx) => (
          <Box key={tx.id} p={4} borderWidth="1px" borderRadius="md">
            <KudoCard transaction={tx} />
            <HStack mt={4} justify="flex-end">
              <Button colorScheme="green" onClick={() => onApprove(tx.id)}>Approve</Button>
              <Button colorScheme="red" onClick={() => onDeny(tx.id)}>Deny</Button>
            </HStack>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default PendingTransactionsList;
