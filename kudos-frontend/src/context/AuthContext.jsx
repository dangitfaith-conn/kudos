// /Users/jonchun/Workspace/kudos/kudos-frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('kudos-token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This effect runs on initial app load to check for an existing token
        const initializeAuth = async () => {
            if (token) {
                try {
                    // Verify token is not expired (optional but good practice)
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        throw new Error('Token expired');
                    }
                    // Token is valid, fetch user data
                    const response = await apiClient.get('/users/me');
                    setUser(response.data);
                } catch (error) {
                    // Token is invalid or expired, clear it
                    console.error("Auth initialization error:", error);
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('kudos-token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [token]); // This effect depends on the token state

    const login = (newToken) => {
        localStorage.setItem('kudos-token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('kudos-token');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        // Re-fetches user data from the API and updates the context state.
        // This is useful for after an action that changes user data, like their balance.
        try {
            if (token) {
                const response = await apiClient.get('/users/me');
                setUser(response.data);
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            // If fetching fails (e.g., token is now invalid), log the user out.
            logout();
        }
    };

    const value = { user, token, login, logout, loading, refreshUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
    return useContext(AuthContext);
};