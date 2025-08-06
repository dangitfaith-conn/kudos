// /Users/jonchun/Workspace/kudos/kudos-frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import GiveKudosForm from '../components/GiveKudosForm';
import KudosFeed from '../components/KudosFeed';
import { useAuth } from '../context/AuthContext.jsx';
import {
    Box,
    Heading,
    Spinner,
    Alert,
    AlertIcon,
    VStack,
    Stat, StatLabel, StatNumber, StatGroup
} from '@chakra-ui/react';

function DashboardPage() {
    const { user, refreshUser } = useAuth(); // Get user and refreshUser from context
    const [users, setUsers] = useState([]);
    const [values, setValues] = useState([]);
    const [error, setError] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This is an Immediately Invoked Function Expression (IIFE).
        // It's a standard pattern for running async logic inside a useEffect hook
        // while keeping the hook's main body synchronous, which avoids race conditions
        // and satisfies linter rules about unhandled promises.
        (async () => {
            try {
                // Fetch all necessary data in parallel for a faster load time
                // We no longer need to fetch the user here; the AuthContext handles it.
                const [usersResponse, valuesResponse, transactionsResponse] = await Promise.all([
                    apiClient.get('/users'),
                    apiClient.get('/values'),
                    apiClient.get('/transactions'), // Fetch the approved transactions feed
                ]);

                setUsers(usersResponse.data);
                setValues(valuesResponse.data);
                setTransactions(transactionsResponse.data);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        })();
    }, []); // The empty dependency array ensures this runs only once when the component mounts.

    const handleKudosSubmitted = async (amount) => {
        // The child form has already submitted the kudo and shown a success message.
        // Now, we just need to refresh the user's data to reflect the new balance.
        // The UI will update automatically because it's subscribed to the AuthContext.
        await refreshUser();
    };

    if (loading) return <Spinner />;
    if (error) return (
        <Alert status="error">
            <AlertIcon />
            {error}
        </Alert>
    );

    return (
        <VStack spacing={8} align="stretch">
            {user && (
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                    <Heading as="h2" size="lg" mb={4}>Welcome, {user.full_name}!</Heading>
                    <StatGroup>
                        <Stat>
                            <StatLabel>Your Award Balance</StatLabel>
                            <StatNumber>{user.award_balance}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Your Spending Balance</StatLabel>
                            <StatNumber>{user.spending_balance}</StatNumber>
                        </Stat>
                    </StatGroup>
                </Box>
            )}
            <GiveKudosForm users={users} values={values} onKudoSubmit={handleKudosSubmitted} />
            <KudosFeed transactions={transactions} />
        </VStack>
    );
}

export default DashboardPage;