import React from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { usePendingTransactions } from '../hooks/usePendingTransactions';
import PendingTransactionsList from '../components/admin/PendingTransactionsList';
import UserManagement from '../components/admin/UserManagement';

const AdminPage = () => {
  const { pending, loading, error, handleApprove, handleDeny } = usePendingTransactions();

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
            <PendingTransactionsList
              pending={pending}
              loading={loading}
              error={error}
              onApprove={handleApprove}
              onDeny={handleDeny}
            />
          </TabPanel>
          <TabPanel>
            <UserManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminPage;
