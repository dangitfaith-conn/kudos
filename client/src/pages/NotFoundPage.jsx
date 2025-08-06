import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Box textAlign="center" mt={20}>
    <Heading>404 - Not Found</Heading>
    <Text mt={4}>The page you are looking for does not exist.</Text>
    <Button as={Link} to="/dashboard" colorScheme="teal" mt={6}>Go to Dashboard</Button>
  </Box>
);

export default NotFoundPage;