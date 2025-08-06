import React from 'react';
import {
  Box,
  Heading,
  VStack,
} from '@chakra-ui/react';
import CreateUserForm from './CreateUserForm';
import AwardKudosForm from './AwardKudosForm';

const UserManagement = () => {
  return (
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
  );
};

export default UserManagement;
