// /Users/jonchun/Workspace/kudos/kudos-frontend/src/components/GiveKudosForm.jsx
import { useState } from 'react';
import apiClient from '../api/apiClient';

function GiveKudosForm({ users, values, onKudoSubmit }) {
    const [recipientId, setRecipientId] = useState('');
    const [valueId, setValueId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!recipientId || !valueId || !amount) {
            setError('Please fill out all required fields.');
            return;
        }

        try {
            const response = await apiClient.post('/transactions', {
                recipient_id: parseInt(recipientId, 10),
                value_id: parseInt(valueId, 10),
                amount: parseInt(amount, 10),
                message,
            });

            setSuccess(response.data.message);
            onKudoSubmit(parseInt(amount, 10)); // Notify parent to update balance

            // Reset form
            setRecipientId('');
            setValueId('');
            setAmount('');
            setMessage('');

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h3>Give a Kudo</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="recipient">To:</label>
                    <select id="recipient" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} required>
                        <option value="">Select a colleague</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.full_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="value">For:</label>
                    <select id="value" value={valueId} onChange={(e) => setValueId(e.target.value)} required>
                        <option value="">Select a company value</option>
                        {values.map((value) => (
                            <option key={value.id} value={value.id}>{value.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength="280" />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Send Kudo</button>
            </form>
        </div>
    );
}

export default GiveKudosForm;