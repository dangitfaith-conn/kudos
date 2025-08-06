import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  Textarea,
  Button,
  useToast,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import * as userService from '../services/userService';
import * as transactionService from '../services/transactionService';

const GiveKudosPage = () => {
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState(1);
  const [valueId, setValueId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, valuesData] = await Promise.all([
          userService.getAllUsers(),
          transactionService.getCompanyValues(),
        ]);
        setUsers(usersData);
        setValues(valuesData);
      } catch (err) {
        setError('Failed to load necessary data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionService.createTransaction({
        recipientId,
        amount,
        valueId,
        message,
      });
      toast({ title: 'Kudos sent for approval!', status: 'success' });
      // Reset form
      setRecipientId('');
      setAmount(1);
      setValueId('');
      setMessage('');
    } catch (err) {
      toast({ title: 'Failed to send kudos', description: err.message, status: 'error' });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>Give Kudos</Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Recipient</FormLabel>
            <Select
              placeholder="Select a colleague"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Amount</FormLabel>
            <NumberInput min={1} value={amount} onChange={(val) => setAmount(parseInt(val, 10))}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Company Value</FormLabel>
            <Select
              placeholder="Select a value"
              value={valueId}
              onChange={(e) => setValueId(e.target.value)}
            >
              {values.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why are you giving these kudos?"
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" size="lg">
            Send Kudos
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default GiveKudosPage;
