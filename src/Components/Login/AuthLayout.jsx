import React from 'react';
import logo from '../../Images/LoginImages/high_bridge_logo.svg';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginLeft}>
                <div className={styles.loginLeftHeader}>
                    <img src={logo} alt="HighBridge Logo" className={styles.logo} />
                    <h1>HighBridge</h1>
                </div>
                <h1 className={styles.loginLeftBuildText}>Building the Future...</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            
            <div className={styles.loginRight}>
                <div className={styles.loginFormContainer}>
                    <h5 className={styles.loginFormTitle}>{title}</h5>
                    <h1 className={styles.loginFormSubtitle}>{subtitle}</h1>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout; 