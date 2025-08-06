import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <Box>
      <Navbar />
      <Box p={8}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;

