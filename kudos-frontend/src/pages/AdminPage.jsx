// /Users/jonchun/Workspace/kudos/kudos-frontend/src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import ModerationQueue from '../components/ModerationQueue';

function AdminPage() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const response = await apiClient.get('/transactions/pending');
                setPending(response.data);
            } catch (err) {
                setError('Failed to fetch pending transactions.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleApprove = async (transactionId) => {
        try {
            await apiClient.patch(`/transactions/${transactionId}/approve`);
            // Remove the approved transaction from the local state for an instant UI update
            setPending((prev) => prev.filter((tx) => tx.id !== transactionId));
        } catch (err) {
            alert('Failed to approve transaction. Please try again.');
        }
    };

    const handleDeny = async (transactionId) => {
        try {
            await apiClient.patch(`/transactions/${transactionId}/deny`);
            // Remove the denied transaction from the local state
            setPending((prev) => prev.filter((tx) => tx.id !== transactionId));
        } catch (err) {
            alert('Failed to deny transaction. Please try again.');
        }
    };

    if (loading) return <div>Loading moderation queue...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Admin Moderation</h2>
            <ModerationQueue
                transactions={pending}
                onApprove={handleApprove}
                onDeny={handleDeny}
            />
        </div>    );
}

export default AdminPage;