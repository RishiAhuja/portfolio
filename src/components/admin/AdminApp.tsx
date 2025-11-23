import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { verifyAdminSession } from '../../lib/admin';

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has existing session
    const checkSession = async () => {
      const storedToken = localStorage.getItem('admin_token');
      const storedEmail = localStorage.getItem('admin_email');

      if (storedToken && storedEmail) {
        try {
          const session = await verifyAdminSession(storedToken);
          if (session) {
            setToken(storedToken);
            setEmail(storedEmail);
            setIsAuthenticated(true);
          } else {
            // Invalid session, clear storage
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_email');
          }
        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_email');
        }
      }
      setIsChecking(false);
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (newToken: string, newEmail: string) => {
    setToken(newToken);
    setEmail(newEmail);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    setEmail('');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-codGray flex items-center justify-center">
        <p className="text-gunSmoke font-ptMono">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard token={token} email={email} onLogout={handleLogout} />;
};

export default AdminApp;
