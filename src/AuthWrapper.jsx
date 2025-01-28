import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const { data: session } = await supabase.auth.getSession();

            if (session?.session) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/'); // Redirect to login page if not authenticated
            }
            setLoading(false);
        };

        checkAuthStatus();

        // Listen for authentication changes (e.g., logout)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/');
            }
        });

        // Cleanup the listener
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; // Show a loading spinner or message while checking authentication
    }

    return isAuthenticated ? <>{children}</> : null;
};

export default AuthWrapper;
