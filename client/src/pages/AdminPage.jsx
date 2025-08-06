import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  useToast,
} from '@chakra-ui/react';
import * as adminService from '../services/adminService';
import KudoCard from '../components/ui/KudoCard';
import CreateUserForm from '../components/admin/CreateUserForm';
import AwardKudosForm from '../components/admin/AwardKudosForm';


const AdminPage = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchPending = async () => {
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
  };

  useEffect(() => {
    fetchPending();
  }, []);

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

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>Admin Dashboard</Heading>
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab>Transaction Moderation</Tab>
          <Tab>User Management</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Heading as="h2" size="lg">Pending Kudos</Heading>
              {loading ? (
                <Spinner />
              ) : error ? (
                <Alert status="error"><AlertIcon />{error}</Alert>
              ) : pending.length === 0 ? (
                <Alert status="info"><AlertIcon />No pending transactions.</Alert>
              ) : (
                pending.map((tx) => (
                  <Box key={tx.id} p={4} borderWidth="1px" borderRadius="md">
                    <KudoCard transaction={tx} />
                    <HStack mt={4} justify="flex-end">
                      <Button colorScheme="green" onClick={() => handleApprove(tx.id)}>Approve</Button>
                      <Button colorScheme="red" onClick={() => handleDeny(tx.id)}>Deny</Button>
                    </HStack>
                  </Box>
                ))
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={8}>
              <Box w="100%">
                <Heading as="h2" size="lg" mb={4}>Create User</Heading>
                <CreateUserForm />
              </Box>
              <Box w="100%">
                <Heading as="h2" size="lg" mt={8} mb={4}>Award Kudos</Heading>
                <AwardKudosForm />
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminPage;
