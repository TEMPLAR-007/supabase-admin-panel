import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Handle registration form submission
    const register = async (e) => {
        e.preventDefault();
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            setSuccessMessage('Registration successful! Please check your email for a confirmation link.');
            setTimeout(() => navigate('/'), 2000); // Redirect to login page after success
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Register</h2>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <form onSubmit={register}>
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
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                    }}
                >
                    Register
                </button>
            </form>

            <div>
                <p>Already a user! <Link to="/">Login</Link></p> {/* Link to register page */}
            </div>
        </div>
    );
};

export default Register;
