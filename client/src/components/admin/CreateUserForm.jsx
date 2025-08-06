import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  useToast,
  VStack,
} from '@chakra-ui/react';
import * as adminService from '../../services/adminService';

const CreateUserForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createUser({ email, password, fullName, isAdmin });
      toast({ title: 'User created successfully', status: 'success' });
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
      setIsAdmin(false);
    } catch (err) {
      toast({ title: 'Error creating user', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Checkbox isChecked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}>
            Is Admin?
          </Checkbox>
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Create User
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateUserForm;
