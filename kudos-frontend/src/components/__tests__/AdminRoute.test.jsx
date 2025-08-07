
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminRoute from '../AdminRoute';
import { describe, it, expect, vi } from 'vitest';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock child component to render for a successful admin route
const AdminPage = () => <div>Admin Page</div>;
const LoginPage = () => <div>Login Page</div>;
const HomePage = () => <div>Home Page</div>;

describe('AdminRoute', () => {
  it('shows loading state', () => {
    useAuth.mockReturnValue({ loading: true });
    render(<AdminRoute> <AdminPage/> </AdminRoute>);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('redirects to login if not authenticated', () => {
    useAuth.mockReturnValue({ user: null, token: null, loading: false });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to home if user is not an admin', () => {
    useAuth.mockReturnValue({ user: { is_admin: false }, token: 'some-token', loading: false });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders child component if user is an admin', () => {
    useAuth.mockReturnValue({ user: { is_admin: true }, token: 'some-token', loading: false });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });
});
