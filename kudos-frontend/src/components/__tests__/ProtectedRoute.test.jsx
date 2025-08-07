
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import { describe, it, expect, vi } from 'vitest';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock child component to render for a successful protected route
const ProtectedPage = () => <div>Protected Page</div>;
const LoginPage = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  it('shows loading state', () => {
    useAuth.mockReturnValue({ loading: true });
    render(<ProtectedRoute> <ProtectedPage/> </ProtectedRoute>);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('redirects to login if not authenticated', () => {
    useAuth.mockReturnValue({ token: null, loading: false });
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/protected" element={<ProtectedRoute><ProtectedPage /></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders child component if authenticated', () => {
    useAuth.mockReturnValue({ token: 'some-token', loading: false });
    render(
        <MemoryRouter initialEntries={['/protected']}>
            <Routes>
                <Route path="/protected" element={<ProtectedRoute><ProtectedPage /></ProtectedRoute>} />
            </Routes>
        </MemoryRouter>
    );
    expect(screen.getByText('Protected Page')).toBeInTheDocument();
  });
});
