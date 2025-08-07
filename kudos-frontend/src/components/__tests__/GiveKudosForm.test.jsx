
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GiveKudosForm from '../GiveKudosForm';
import apiClient from '../../api/apiClient';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the apiClient
vi.mock('../../api/apiClient');

const mockUsers = [
  { id: 2, full_name: 'Jane Doe' },
  { id: 3, full_name: 'John Smith' },
];

const mockValues = [
  { id: 1, name: 'Integrity' },
  { id: 2, name: 'Teamwork' },
];

const mockOnKudoSubmit = vi.fn();

describe('GiveKudosForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <GiveKudosForm
        users={mockUsers}
        values={mockValues}
        onKudoSubmit={mockOnKudoSubmit}
      />
    );
  });

  it('renders the form with all fields', () => {
    expect(screen.getByLabelText(/To:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/For:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message:/i)).toBeInTheDocument();
    expect(screen.getByText(/Send Kudo/i)).toBeInTheDocument();
  });

  it('shows an error if required fields are not filled', async () => {
    fireEvent.submit(screen.getByTestId('kudos-form'));

    await waitFor(() => {
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(/Please fill out all required fields./i);
    });
  });

  it('submits the form and shows a success message', async () => {
    apiClient.post.mockResolvedValue({ data: { message: 'Kudo submitted successfully!' } });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/To:/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/For:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Amount:/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Message:/i), { target: { value: 'Test message' } });

    fireEvent.submit(screen.getByTestId('kudos-form'));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/transactions', {
        recipient_id: 2,
        value_id: 1,
        amount: 50,
        message: 'Test message',
      });
    });

    expect(await screen.findByText(/Kudo submitted successfully!/i)).toBeInTheDocument();
    expect(mockOnKudoSubmit).toHaveBeenCalledWith(50);
  });

  it('shows an error message on API failure', async () => {
    apiClient.post.mockRejectedValue({ response: { data: { message: 'Insufficient balance.' } } });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/To:/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/For:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Amount:/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Message:/i), { target: { value: 'Test message' } });

    fireEvent.submit(screen.getByTestId('kudos-form'));

    expect(await screen.findByText(/Insufficient balance./i)).toBeInTheDocument();
  });
});
