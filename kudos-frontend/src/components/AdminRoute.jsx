// /Users/jonchun/Workspace/kudos/kudos-frontend/src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function AdminRoute({ children }) {
    const { user, token, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!token) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (!user || !user.is_admin) {
        // Logged in but not an admin, redirect to the main dashboard
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;