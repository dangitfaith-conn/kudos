
import { render, screen } from '@testing-library/react';
import KudosFeed from '../KudosFeed';
import { describe, it, expect } from 'vitest';

describe('KudosFeed', () => {
  it('shows a message when there are no transactions', () => {
    render(<KudosFeed transactions={[]} />);
    expect(screen.getByText(/No recent Kudos to show/i)).toBeInTheDocument();
  });

  it('renders a list of transactions', () => {
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
        message: null,
        created_at: new Date().toISOString(),
      },
    ];
    render(<KudosFeed transactions={mockTransactions} />);

    const firstTransaction = screen.getByTestId('transaction-1');
    expect(firstTransaction.textContent).toContain('Alice gave 50 Kudos to Bob for Teamwork');
    expect(firstTransaction.textContent).toContain('Great collaboration!');

    const secondTransaction = screen.getByTestId('transaction-2');
    expect(secondTransaction.textContent).toContain('Charlie gave 20 Kudos to Dana for Integrity');
    expect(secondTransaction.textContent).not.toContain('null');
  });
});
