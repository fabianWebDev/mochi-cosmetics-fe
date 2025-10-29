import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import Loading from '../components/ui/common/Loading';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = authService.getUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                await authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        setLoginLoading(true);
        try {
            const userData = await authService.login(credentials);
            setUser(userData);
            await cartService.mergeLocalCartWithBackend();
            return { success: true };
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            return {
                success: false,
                error: error.message || 'Error logging in'
            };
        } finally {
            setLoginLoading(false);
        }
    };

    const logout = async () => {
        setLogoutLoading(true);
        try {
            await authService.logout();
            setUser(null);
            return { success: true };
        } catch (error) {
            console.error('Error during logout:', error);
            return { success: false, error: 'Error al cerrar sesión' };
        } finally {
            setLogoutLoading(false);
        }
    };

    const value = {
        user,
        loading,
        loginLoading,
        logoutLoading,
        login,
        logout,
        isAuthenticated: authService.isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <Loading 
                    text="Initializing authentication..." 
                    variant="default"
                />
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export { useAuth }; 