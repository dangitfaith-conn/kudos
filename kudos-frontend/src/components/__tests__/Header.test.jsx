
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header';
import { describe, it, expect, vi } from 'vitest';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockLogout = vi.fn();

describe('Header', () => {
  it('renders the header with title', () => {
    useAuth.mockReturnValue({ user: null });
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByText(/Kudos App/i)).toBeInTheDocument();
  });

  it('shows logout button when user is logged in', () => {
    useAuth.mockReturnValue({ user: { name: 'Test User' }, logout: mockLogout });
    render(
      <Router>
        <Header />
      </Router>
    );
    const logoutButton = screen.getByText(/Logout/i);
    expect(logoutButton).toBeInTheDocument();
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('shows admin button when user is an admin', () => {
    useAuth.mockReturnValue({ user: { is_admin: true }, logout: mockLogout });
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });

  it('does not show admin button for non-admin users', () => {
    useAuth.mockReturnValue({ user: { is_admin: false }, logout: mockLogout });
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
  });
});
