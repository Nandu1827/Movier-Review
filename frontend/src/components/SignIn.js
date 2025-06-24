import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = ({ setIsAdmin, setIsSignedIn, setUserEmail, setUserFullName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Use admin sign-in endpoint for admin@example.com
      const endpoint = email === 'admin@example.com' 
        ? 'http://localhost:15400/api/users/admin/signin'
        : 'http://localhost:15400/api/users/signin';

      console.log('Attempting sign in with:', { email, endpoint });

      const response = await axios.post(endpoint, {
        email,
        password,
      });

      console.log('Sign in response:', response.data);

      const { token, user, admin } = response.data;
      const userData = user || admin; // Handle both user and admin responses
      
      if (!userData) {
        throw new Error('No user data received');
      }

      // Store user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set user state
      setIsSignedIn(true);
      setUserEmail(userData.email);
      setUserFullName(userData.fullName || userData.name || '');
      
      // Check if user is admin
      const isUserAdmin = userData.role === 'admin';
      console.log('User role:', userData.role);
      console.log('Is admin:', isUserAdmin);
      setIsAdmin(isUserAdmin);

      setSuccess('Login successful!');
      
      // Redirect based on role
      setTimeout(() => {
        if (isUserAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      console.error('Sign-in error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Sign in failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;