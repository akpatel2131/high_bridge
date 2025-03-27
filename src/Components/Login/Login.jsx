import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import SocialLogin from './SocialLogin';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthForm.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            // Error is handled by AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="WELCOME BACK!"
            subtitle="Log In to your Account"
        >
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Type here.."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Type here..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className={styles.formOptions}>
                    <label className={styles.rememberMe}>
                        <input 
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                    </label>
                    <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
                </div>
                
                <button 
                    type="submit" 
                    className={styles.loginButton}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
                
                <SocialLogin type="login" />
                
                <p className={styles.signupPrompt}>
                    New User? <Link to="/signup">SIGN UP HERE</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login; 