
import React, { useState } from 'react';
import './login.css';
import { LoginFormData } from './LoginInterface';



export default function LoginPageComponent() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    role: 'kid',
    userPassword: '',
    agreedToTerms: false,
  });

  const [isParentLogin, setIsParentLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMessage(''); 
  };

  // Handle role selection
  const handleRoleChange = (role: 'kid' | 'parent') => {
    setFormData(prev => ({
      ...prev,
      role,
    }));
    setErrorMessage('');
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setErrorMessage('Please enter your name! 😊');
      return false;
    }

    if (formData.username.length < 2) {
      setErrorMessage('Your name should be at least 2 characters! 🎮');
      return false;
    }

    if (!formData.agreedToTerms && formData.role === 'kid') {
      setErrorMessage('Please ask your parents to agree before continuing! 👨‍👩‍👧');
      return false;
    }

    if (!formData.userPassword) {
      setErrorMessage('Password is required! 🔐');
      return false;
    }

    return true;
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const usertype = isParentLogin ? 'parent' : 'kid';

        const response = await fetch(`http://localhost:8000/chatpj/Login`, {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.userPassword,
                usertype: usertype,          
            }),
        });

        const data = await response.json();

        // Handle backend error responses (400, 401, etc.)
        if (!response.ok) {
            throw new Error(data.error || 'Login failed. Please try again.');
        }

        // ✅ SUCCESS
        setSuccessMessage(`Welcome, ${formData.username}! 🎉`);

        // Store everything in localStorage (real tokens + user info)
        const loginData = {
            username: data.user.username,
            role: data.user.type,                    // e.g. "Kid" or "Parent"
            loginTime: new Date().toISOString(),
            isParent: isParentLogin,
            accessToken: data.access,                // ← Important for future API calls
            refreshToken: data.refresh,
        };

        localStorage.setItem('userLogin', JSON.stringify(loginData));
        localStorage.setItem('accessToken', data.access);    // Easy access later
        localStorage.setItem('refreshToken', data.refresh);

        // Redirect after showing success message
        setTimeout(() => {
            window.location.href = '/';   // or use react-router: navigate('/')
        }, 2000);

    } catch (error: any) {
      const errorMsg = error.message || 'Something went wrong! Please try again. 😅';
        setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <span className="emoji-header">🚀✨</span>
          <h1 className="login-title">Story Quest</h1>
          <p className="login-subtitle">Your Epic Adventure Awaits!</p>
        </div>

        {/* Messages */}
        <div className={`error-message ${errorMessage ? 'show' : ''}`}>
          {errorMessage}
        </div>
        <div className={`success-message ${successMessage ? 'show' : ''}`}>
          {successMessage}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Username Input */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-emoji">👤</span>
              What's your name, adventurer?
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Type your name..."
              className="form-input"
              maxLength={30}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
                <label className="form-label">
                  <span className="form-label-emoji">🔑</span>
                   Password
                </label>
                <input
                  type="password"
                  name="userPassword"
                  value={formData.userPassword}
                  onChange={handleInputChange}
                  placeholder="Enter password..."
                  className="form-input"
                />
              </div>

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-emoji">👥</span>
              Who are you?
            </label>
            <div className="role-selection">
              <button
                type="button"
                className={`role-option ${formData.role === 'kid' ? 'active' : ''}`}
                onClick={() => handleRoleChange('kid')}
                disabled={isLoading}
              >
                <span className="role-emoji">🧒</span>
                <span>Kid</span>
              </button>
              <button
                type="button"
                className={`role-option ${formData.role === 'parent' ? 'active' : ''}`}
                onClick={() => handleRoleChange('parent')}
                disabled={isLoading}
              >
                <span className="role-emoji">👨‍👩‍👧</span>
                <span>Parent</span>
              </button>
            </div>
          </div>

          {/* Parent Agreement (for kids) */}
          {formData.role === 'kid' && (
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreement"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                className="checkbox-input"
                disabled={isLoading}
              />
              <label htmlFor="agreement" className="checkbox-label">
                My parents said it's OK for me to play 👨‍👩‍👧‍👦
              </label>
            </div>
          )}


          {/* Login Buttons */}
          <div className="login-button-group">
            <button
              type="submit"
              className="login-button btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Loading...
                </>
              ) : (
                <>
                  <span className="btn-emoji">🎮</span>
                  Start Adventure
                </>
              )}
            </button>

            <button
              type="reset"
              className="login-button btn-secondary"
              onClick={() => {
                setFormData({ username: '', role: 'kid', userPassword: '', agreedToTerms: false });
                setIsParentLogin(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              disabled={isLoading}
            >
              <span className="btn-emoji">🔄</span>
              Clear
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            🎨 Made with love for young adventurers everywhere!
          </p>
          <div className="safety-badges">
            <div className="badge">
              <span className="badge-emoji">✅</span>
              Safe
            </div>
            <div className="badge">
              <span className="badge-emoji">👶</span>
              Kid-Friendly
            </div>
            <div className="badge">
              <span className="badge-emoji">🎯</span>
              Fun
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}