import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { showSuccess, showError } from '../components/toast';
import Loader from '../components/loader';
import '../styles/login.css';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '' 
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      showError('Please enter both username and password!');
      return;
    }
    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
      showSuccess('Login successful!');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      showError(error?.response?.data?.message || error.message || error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match!');
      return;
    }
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      showError('Please fill in all required fields!');
      return;
    }
    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      showSuccess('Registration successful! Please login.');
      setActiveTab('login');
    } catch (error) {
      showError(error?.response?.data?.message || error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {isLoading && <Loader />}
      <div className="auth-box">
        <div className="auth-tabs">
          <button
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            LOGIN
          </button>
          <button
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            REGISTER
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <div className="password-input-container">
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                  aria-label={showPassword.password ? "Hide password" : "Show password"}
                >
                  {showPassword.password ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <button type="submit" className="submit-button">
              LOGIN
            </button>
            {/* <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div> */}
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <div className="password-input-container">
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                  aria-label={showPassword.password ? "Hide password" : "Show password"}
                >
                  {showPassword.password ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="form-group">
              <div className="password-input-container">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                  aria-label={showPassword.confirmPassword ? "Hide password" : "Show password"}
                >
                  {showPassword.confirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <button type="submit" className="submit-button">
              REGISTER
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
