import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import * as adminService from '../../services/adminService';

const AwardKudosForm = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.awardCredits(userId, amount);
      toast({ title: 'Kudos awarded successfully', status: 'success' });
      // Clear form
      setUserId('');
      setAmount(1);
    } catch (err) {
      toast({ title: 'Error awarding kudos', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>User ID</FormLabel>
          <Input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Amount</FormLabel>
          <NumberInput value={amount} min={1} onChange={(value) => setAmount(parseInt(value, 10))}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Award Kudos
        </Button>
      </VStack>
    </Box>
  );
};

export default AwardKudosForm;
