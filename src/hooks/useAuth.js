import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [user, setUser] = useState(authService.getUser());

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(authService.isAuthenticated());
            setUser(authService.getUser());
        };

        // Listen for storage events from other tabs
        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for auth state changes in the current tab
        const interval = setInterval(() => {
            const currentAuth = authService.isAuthenticated();
            const currentUser = authService.getUser();
            if (currentAuth !== isAuthenticated || JSON.stringify(currentUser) !== JSON.stringify(user)) {
                setIsAuthenticated(currentAuth);
                setUser(currentUser);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [isAuthenticated, user]);

    const login = (token, refresh, user) => {
        authService.setAuthData(token, refresh, user);
        setIsAuthenticated(true);
        setUser(user);
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return { 
        isAuthenticated, 
        login, 
        logout,
        getUser: () => user,
        getToken: authService.getToken
    };
}
