// /Users/jonchun/Workspace/kudos/kudos-frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
    const { token, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!token) {
        // If no token is found, redirect the user to the login page.
        // The `replace` prop is used to replace the current entry in the history stack
        // instead of pushing a new one, which is better for login redirects.
        return <Navigate to="/login" replace />;
    }

    // If a token exists, render the child components (the protected page).
    return children;
}

export default ProtectedRoute;