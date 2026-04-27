import React, { useState, useEffect } from 'react';

import './App.css';
import LoginPageComponent from './Component/Login/LoginPagecomponent';
import MainPageComponent from './Component/MainPage/MainPageComponent';
import ChatPageComponent from './Component/Chat/ChatPageComponent';
import ParentMainPageComponent from './Component/ParentPage/ParentMainPageComponent';
import CreateStoryComponent from './Component/Scene/CreateStoryComponent';

export interface UserLogin {
  username: string;
  nickname: string;
  role: 'kid' | 'parent';
  loginTime: string;
  isParent: boolean;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserLogin | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'main' | 'chat' | 'create'>('login');

  useEffect(() => {
    const storedLogin = localStorage.getItem('userLogin');
    if (storedLogin) {
      try {
        const user = JSON.parse(storedLogin) as UserLogin;
        setCurrentUser(user);
        setIsLoggedIn(true);
        setCurrentPage('main');
      } catch (error) {
        localStorage.removeItem('userLogin');
      }
    }
  }, []);

  const backToStoryList = () => {
    setCurrentPage('main');
  };

  const handleStorySelect = (storyId: string) => {
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('userLogin');
    localStorage.removeItem('selectedStory');
    localStorage.removeItem('selectedKid');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleTokenExpired = () => {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('selectedStory');
    localStorage.removeItem('selectedKid');

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
          {currentUser.isParent ? (
            <ParentMainPageComponent 
              onLogout={handleLogout}
              onTokenExpired={handleTokenExpired}
              onStorySelect={handleStorySelect}
              onCreateStoryClick={() => setCurrentPage('create')}
            />
          ) : (
            <MainPageComponent 
              onStorySelect={handleStorySelect}
              onLogout={handleLogout}
              onTokenExpired={handleTokenExpired}
              onCreateStoryClick={() => setCurrentPage('create')}
            />
          )}
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
              <strong> Welcome, {currentUser.username}!</strong> 
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
                {currentUser.isParent ? '📖 Dashboard' : '📖 Story List'}
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
          <ChatPageComponent onTokenExpired={handleTokenExpired} currentUser={currentUser} />
        </>
      ) : currentPage === 'create' && currentUser ? (
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
              <strong>✨ Create New Story</strong> 
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
                {currentUser.isParent ? '📖 Dashboard' : '📖 Story List'}
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
          <CreateStoryComponent onTokenExpired={handleTokenExpired} currentUser={currentUser} backToStoryList={backToStoryList}   />
        </>
      ) : (
        <LoginPageComponent />
      )}
    </div>
  );
}

export default App;
