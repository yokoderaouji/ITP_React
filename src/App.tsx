import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPageComponent from './Component/Login/LoginPagecomponent';
import MainPageComponent from './Component/MainPage/MainPageComponent';
import ChatPageComponent from './Component/Chat/ChatPageComponent';

interface UserLogin {
  username: string;
  role: 'kid' | 'parent';
  loginTime: string;
  isParent: boolean;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserLogin | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'main' | 'chat'>('login');

  useEffect(() => {
    // Check if user is already logged in
    const storedLogin = localStorage.getItem('userLogin');
    if (storedLogin) {
      try {
        const user = JSON.parse(storedLogin) as UserLogin;
        setCurrentUser(user);
        setIsLoggedIn(true);
        setCurrentPage('main');
      } catch (error) {
        console.error('Error parsing stored login:', error);
        localStorage.removeItem('userLogin');
      }
    }
  }, []);

  // const handleLoginSuccess = (user: UserLogin) => {
  //   setCurrentUser(user);
  //   setIsLoggedIn(true);
  //   setCurrentPage('main');
  // };

  const handleStorySelect = (storyId: string) => {
    // Transition to chat page when story is selected
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('userLogin');
    localStorage.removeItem('selectedStory');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="App">
      {currentPage === 'login' ? (
        <LoginPageComponent />
      ) : currentPage === 'main' && currentUser ? (
        <>
          <MainPageComponent 
            onStorySelect={handleStorySelect}
            onLogout={handleLogout}
          />
        </>
      ) : currentPage === 'chat' && currentUser ? (
        <>
          <div style={{ 
            padding: '10px 20px', 
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid #ffca28',
            fontFamily: 'Comic Sans MS, Arial Rounded MT Bold'
          }}>
            <div>
              <strong>👋 Welcome, {currentUser.username}!</strong> ({currentUser.role === 'kid' ? '🧒 Kid Mode' : '👨‍👩‍👧 Parent Mode'})
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setCurrentPage('main')}
                style={{
                  background: '#ffc800',
                  color: '#333',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                📖 Story List
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
          <ChatPageComponent/>
        </>
      ) : (
        <LoginPageComponent />
      )}
    </div>
  );
}

export default App;
