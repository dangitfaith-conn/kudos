
import { render, screen, fireEvent, within } from '@testing-library/react';
import ModerationQueue from '../ModerationQueue';
import { describe, it, expect, vi } from 'vitest';

const mockOnApprove = vi.fn();
const mockOnDeny = vi.fn();

const mockTransactions = [
  {
    id: 1,
    sender_name: 'Alice',
    recipient_name: 'Bob',
    amount: 50,
    value_name: 'Teamwork',
    message: 'Great collaboration!',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    sender_name: 'Charlie',
    recipient_name: 'Dana',
    amount: 20,
    value_name: 'Integrity',
    message: 'Thanks for your honesty.',
    created_at: new Date().toISOString(),
  },
];

describe('ModerationQueue', () => {
  it('shows a message when the queue is empty', () => {
    render(<ModerationQueue transactions={[]} onApprove={mockOnApprove} onDeny={mockOnDeny} />);
    expect(screen.getByText(/The moderation queue is empty/i)).toBeInTheDocument();
  });

  it('renders a list of pending transactions', () => {
    render(<ModerationQueue transactions={mockTransactions} onApprove={mockOnApprove} onDeny={mockOnDeny} />);
    const transaction1 = screen.getByTestId('transaction-item-1');
    expect(transaction1).toHaveTextContent('Alice wants to give 50 Kudos to Bob for Teamwork.');

    const transaction2 = screen.getByTestId('transaction-item-2');
    expect(transaction2).toHaveTextContent('Charlie wants to give 20 Kudos to Dana for Integrity.');
  });

  it('calls onApprove when the approve button is clicked', () => {
    render(<ModerationQueue transactions={mockTransactions} onApprove={mockOnApprove} onDeny={mockOnDeny} />);
    const transaction1 = screen.getByTestId('transaction-item-1');
    const approveButton = within(transaction1).getByText('Approve');
    fireEvent.click(approveButton);
    expect(mockOnApprove).toHaveBeenCalledWith(1);
  });

  it('calls onDeny when the deny button is clicked', () => {
    render(<ModerationQueue transactions={mockTransactions} onApprove={mockOnApprove} onDeny={mockOnDeny} />);
    const transaction2 = screen.getByTestId('transaction-item-2');
    const denyButton = within(transaction2).getByText('Deny');
    fireEvent.click(denyButton);
    expect(mockOnDeny).toHaveBeenCalledWith(2);
  });
});
