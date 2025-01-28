import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle the login form submission
    const login = async (e) => {
        e.preventDefault();
        const { user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            navigate('/admin'); // Redirect to the admin panel after successful login
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login</h2>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <form onSubmit={login}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                />
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none' }}>
                    Login
                </button>
            </form>

            <div>
                <p>Don't have an account? <Link to="/register">Register here</Link></p> {/* Link to register page */}
            </div>
        </div>
    );
};

export default Login;
