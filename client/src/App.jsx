import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Box } from '@chakra-ui/react';

function App() {
  return (
    <Box p={4}>
      <Routes>
        {/* Public route accessible to everyone */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirects the root path "/" to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes that require a user to be logged in */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } 
        />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />

        {/* A catch-all route for any path that doesn't match */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  );
}

export default App;
