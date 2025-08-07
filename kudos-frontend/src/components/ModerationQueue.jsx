// /Users/jonchun/Workspace/kudos/kudos-frontend/src/components/ModerationQueue.jsx

function ModerationQueue({ transactions, onApprove, onDeny }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <h3>Pending Kudos</h3>
                <p>The moderation queue is empty. Great job!</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Pending Kudos</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {transactions.map((tx) => (
                    <li key={tx.id} data-testid={`transaction-item-${tx.id}`} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                        <p>
                            <strong>{tx.sender_name}</strong> wants to give <strong>{tx.amount} Kudos</strong> to <strong>{tx.recipient_name}</strong> for <em>{tx.value_name}</em>.
                        </p>
                        {tx.message && <p style={{ fontStyle: 'italic', color: '#555' }}>"{tx.message}"</p>}
                        <small style={{ color: '#999' }}>
                            Submitted on: {new Date(tx.created_at).toLocaleString()}
                        </small>
                        <div style={{ marginTop: '0.5rem' }}>
                            <button onClick={() => onApprove(tx.id)} style={{ marginRight: '0.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>
                                Approve
                            </button>
                            <button onClick={() => onDeny(tx.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>
                                Deny
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ModerationQueue;