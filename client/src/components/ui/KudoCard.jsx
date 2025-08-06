import React from 'react';
import { Box, Text, VStack, HStack, Tag, Flex, Spacer } from '@chakra-ui/react';

const KudoCard = ({ transaction }) => {
  const { sender_name, recipient_name, amount, message, value_name, created_at } = transaction;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" w="100%">
      <VStack align="stretch" spacing={3}>
        <Flex>
          <Text fontWeight="bold">{sender_name} gave kudos to {recipient_name}</Text>
          <Spacer />
          <Text fontSize="sm" color="gray.500">{formatDate(created_at)}</Text>
        </Flex>
        <Text fontSize="xl" pl={4} fontStyle="italic">"{message}"</Text>
        <HStack justify="flex-end" spacing={4}>
          <Tag size="md" variant="solid" colorScheme="yellow">{amount} 👏</Tag>
          <Tag size="md" variant="solid" colorScheme="teal">{value_name}</Tag>
        </HStack>
      </VStack>
    </Box>
  );
};

export default KudoCard;
