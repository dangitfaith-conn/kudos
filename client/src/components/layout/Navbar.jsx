import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Spacer, Button, Text, HStack } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import * as userService from '../../services/userService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getMe();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        // Handle error, maybe logout user
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex as="nav" p={4} bg="teal.500" color="white" alignItems="center">
      <Heading as="h1" size="md">Kudos</Heading>
      <HStack spacing={4} ml={10}>
        <NavLink to="/dashboard"><Text>Dashboard</Text></NavLink>
        <NavLink to="/give-kudos"><Text>Give Kudos</Text></NavLink>
        {user?.isAdmin && <NavLink to="/admin"><Text>Admin</Text></NavLink>}
      </HStack>
      <Spacer />
      {profile && (
        <HStack spacing={6}>
          <Text>Welcome, {profile.full_name}</Text>
          <Box textAlign="right">
            <Text fontSize="sm">Award Balance: {profile.award_balance}</Text>
            <Text fontSize="sm">Spending Balance: {profile.spending_balance}</Text>
          </Box>
          <Button bg="teal.500" color="white" variant="outline" onClick={handleLogout}>Logout</Button>
        </HStack>
      )}
    </Flex>
  );
};

export default Navbar;

