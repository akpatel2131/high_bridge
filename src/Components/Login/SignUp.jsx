import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import SocialLogin from './SocialLogin';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthForm.module.css';
import { SyncLoader } from 'react-spinners';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup, notification, hideNotification } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            hideNotification();
            notification.message = "Passwords don't match!";
            notification.severity = 'error';
            notification.open = true;
            return;
        }

        try {
            setLoading(true);
            await signup(email, password);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="CREATE ACCOUNT"
            subtitle="Sign Up for Free"
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

                <div className={styles.formGroup}>
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        placeholder="Type here..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    className={styles.loginButton}
                    disabled={loading}
                >
                    {loading ? <SyncLoader color="#fff" size={10} /> : 'Sign Up'}
                </button>
                
                <SocialLogin type="signup" />
                
                <p className={styles.signupPrompt}>
                    Already have an account? <Link to="/login">LOG IN HERE</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignUp; 