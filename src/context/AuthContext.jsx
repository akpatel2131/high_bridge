import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info' // 'error', 'warning', 'info', 'success'
    });

    const showNotification = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Sign Up with email/password
    const signup = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            showNotification('Account created successfully!', 'success');
            return userCredential.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    };

    // Login with email/password
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            showNotification('Logged in successfully!', 'success');
            return userCredential.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            showNotification('Logged out successfully!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    };

    // Google Sign In
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            showNotification('Logged in with Google successfully!', 'success');
            return result.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    };

    // Facebook Sign In
    const signInWithFacebook = async () => {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            showNotification('Logged in with Facebook successfully!', 'success');
            return result.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    };

    // Apple Sign In
    const signInWithApple = async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            const result = await signInWithPopup(auth, provider);
            showNotification('Logged in with Apple successfully!', 'success');
            return result.user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    };

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
        hideNotification
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 