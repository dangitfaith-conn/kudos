// /Users/jonchun/Workspace/kudos/kudos-frontend/src/components/Header.jsx
import { useAuth } from '../context/AuthContext.jsx';
import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
    const { user, logout } = useAuth();

    return (
        <Box bg="teal.500" p={4} color="white">
            <Flex>
                <RouterLink to="/">
                    <Heading as="h1" size="md">Kudos App</Heading>
                </RouterLink>
                <Spacer />
                {user && (
                    <>
                        <RouterLink to="/admin">
                            {user.is_admin && <Button colorScheme="teal" variant="ghost" mr={4}>Admin</Button>}
                        </RouterLink>
                        <Button onClick={logout} colorScheme="teal" variant="outline">Logout</Button>
                    </>
                )}
            </Flex>
        </Box>
    );
}

export default Header;