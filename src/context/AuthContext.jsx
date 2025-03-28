import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
    OAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info' // 'error', 'warning', 'info', 'success'
    });

    const showNotification = useCallback((message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    }, []);

    // Sign Up with email/password
    const signup = useCallback(async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            localStorage.setItem('user', JSON.stringify(userCredential.user));
            showNotification('Account created successfully!', 'success');
            return userCredential.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }, [showNotification]);

    // Login with email/password
    const login = useCallback(async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('user', JSON.stringify(userCredential.user));
            showNotification('Logged in successfully!', 'success');
            return userCredential.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }, [showNotification]);

    // Logout
    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            showNotification('Logged out successfully!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }, [showNotification]);

    // Google Sign In
    const signInWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            showNotification('Logged in with Google successfully!', 'success');
            return result.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }, [showNotification]);

    // Facebook Sign In
    const signInWithFacebook = useCallback(async () => {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            showNotification('Logged in with Facebook successfully!', 'success');
            return result.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }, [showNotification]);

    // Apple Sign In
    const signInWithApple = useCallback(async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            const result = await signInWithPopup(auth, provider);
            showNotification('Logged in with Apple successfully!', 'success');
            return result.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    }, [showNotification]);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        user,
        signup,
        login,
        logout,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        notification,
        hideNotification,
        showNotification,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 