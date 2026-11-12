import React, { useState } from 'react';
import { adminLogin } from '../../lib/admin';

interface AdminLoginProps {
  onLoginSuccess: (token: string, email: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await adminLogin(email, password);

      if (result) {
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_email', result.email);
        onLoginSuccess(result.token, result.email);
      } else {
        setError('That email and password don’t match.');
      }
    } catch (err) {
      setError('Couldn’t reach the server. Try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-signin">
      <div className="admin-signin-card">
        <h1>Admin</h1>
        <p>Sign in to manage the gallery, résumés, and blurbs.</p>

        {error && <p className="admin-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          <button type="submit" className="admin-button admin-button-primary" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
