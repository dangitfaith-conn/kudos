// /Users/jonchun/Workspace/kudos/kudos-frontend/src/components/KudosFeed.jsx
import { Box, Heading, Text, VStack, List, ListItem, ListIcon } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

function KudosFeed({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return (
            <Box mt={8}>
                <Heading as="h3" size="lg" mb={4}>Recent Activity</Heading>
                <Text>No recent Kudos to show. Be the first!</Text>
            </Box>
        );
    }

    return (
        <Box mt={8}>
            <Heading as="h3" size="lg" mb={4}>Recent Activity</Heading>
            <VStack spacing={4} align="stretch">
                {transactions.map((tx) => (
                    <Box key={tx.id} p={5} shadow="md" borderWidth="1px" borderRadius="md" data-testid={`transaction-${tx.id}`}>
                        <Text fontSize="lg">
                            <Text as="b">{tx.sender_name}</Text> gave <Text as="b">{tx.amount} Kudos</Text> to <Text as="b">{tx.recipient_name}</Text> for <em>{tx.value_name}</em>.
                        </Text>
                        {tx.message && (
                            <List spacing={2} mt={2}>
                                <ListItem>
                                    <ListIcon as={ChatIcon} color="green.500" />
                                    <Text as="i" color="gray.600">"{tx.message}"</Text>
                                </ListItem>
                            </List>
                        )}
                        <Text fontSize="sm" color="gray.500" mt={2}>
                            {new Date(tx.created_at).toLocaleString()}
                        </Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}

export default KudosFeed;