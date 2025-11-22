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
        // Store token in localStorage
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_email', result.email);
        onLoginSuccess(result.token, result.email);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-codGray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-8">
          <h1 className="text-2xl font-bold font-ptMono text-quillGray mb-2">
            Admin Login
          </h1>
          <p className="text-sm text-gunSmoke mb-6 font-ptMono">
            Uncompiled Management Panel
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
              <p className="text-sm text-red-400 font-ptMono">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-ptMono text-gunSmoke mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm 
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none
                  transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-ptMono text-gunSmoke mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm 
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none
                  transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent-light/10 border border-accent-light/40 rounded-sm
                text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
