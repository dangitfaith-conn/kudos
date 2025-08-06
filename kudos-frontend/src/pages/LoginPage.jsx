// /Users/jonchun/Workspace/kudos/kudos-frontend/src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext.jsx';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token, login } = useAuth();

    useEffect(() => {
        // If the user is already logged in, redirect them to the dashboard.
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        setError(''); // Clear previous errors

        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });

            // The backend sends back a token on successful login
            const { token } = response.data;

            // Store the token in the browser's localStorage
            login(token); // Use the login function from our context

            // Redirect the user to the dashboard
            navigate('/');

        } catch (err) {
            // If the API returns an error, display it
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <Container centerContent>
            <Box
                p={8}
                mt={20}
                maxWidth="500px"
                borderWidth={1}
                borderRadius={8}
                boxShadow="lg"
            >
                <VStack as="form" onSubmit={handleLogin} spacing={4}>
                    <Heading as="h2" size="lg">Login</Heading>
                    <FormControl isRequired>
                        <FormLabel htmlFor="email">Email:</FormLabel>
                        <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor="password">Password:</FormLabel>
                        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    {error && (
                        <Alert status="error">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}
                    <Button type="submit" colorScheme="teal" width="full">
                        Login
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
}

export default LoginPage;