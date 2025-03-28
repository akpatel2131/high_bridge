import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Notification from './Components/Common/Notification';
import Login from './Components/Login/Login';
import SignUp from './Components/Login/SignUp';
import Dashboard from './Components/Dashboard/Dashboard';
import Workflow from './Components/Workflow/Workflow';
import './App.css';


const AppContent = () => {
  const { notification, hideNotification } = useAuth();

  return (
    <Router>
      <div className="App">
        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={hideNotification}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
