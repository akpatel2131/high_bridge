import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import googleIcon from '../../Images/LoginImages/google_logo.svg';
import facebookIcon from '../../Images/LoginImages/facebook_logo.svg';
import appleIcon from '../../Images/LoginImages/apple_logo.svg';
import styles from './SocialLogin.module.css';

const SocialLogin = ({ type }) => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();
    const buttonText = type === 'signup' ? 'Sign Up' : 'Log In';

    const handleSocialLogin = async (provider) => {
        try {
            setError('');
            let user;
            switch (provider) {
                case 'google':
                    user = await signInWithGoogle();
                    break;
                case 'facebook':
                    user = await signInWithFacebook();
                    break;
                case 'apple':
                    user = await signInWithApple();
                    break;
                default:
                    throw new Error('Invalid provider');
            }
            if (user) {
                navigate('/dashboard');
            }
        } catch (error) {
            setError(`Failed to ${buttonText.toLowerCase()} with ${provider}. ${error.message}`);
        }
    };

    return (
        <>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.divider}>
                <span className={styles.dividerText}>Or</span>
            </div>
            
            <div className={styles.socialLogins}>
                <button 
                    className={styles.socialButton}
                    onClick={() => handleSocialLogin('google')}
                >
                    <img src={googleIcon} alt="Google" className={styles.socialIcon} />
                    {buttonText} with Google
                </button>
                <button 
                    className={styles.socialButton}
                    onClick={() => handleSocialLogin('facebook')}
                >
                    <img src={facebookIcon} alt="Facebook" className={styles.socialIcon} />
                    {buttonText} with Facebook
                </button>
                <button 
                    className={styles.socialButton}
                    onClick={() => handleSocialLogin('apple')}
                >
                    <img src={appleIcon} alt="Apple" className={styles.socialIcon} />
                    {buttonText} with Apple
                </button>
            </div>
        </>
    );
};

export default SocialLogin; 