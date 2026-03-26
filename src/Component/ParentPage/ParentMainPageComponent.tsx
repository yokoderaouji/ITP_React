import React, { useState, useEffect } from 'react';
import './parentmainpage.css';

interface UserLogin {
  username: string;
  role: 'kid' | 'parent';
  loginTime: string;
  isParent: boolean;
}

interface KidProfile {
  user_id: number;
  user_nickname: string;
  created_on?: string;
}

interface StoryRecord {
  user_story_id: number;
  story_id: number;
  story_title: string;
}

interface ParentMainPageProps {
  onLogout?: () => void;
  onTokenExpired?: () => void;
  onStorySelect?: (storyId: string) => void;
}

export default function ParentMainPageComponent({ onLogout, onTokenExpired,onStorySelect }: ParentMainPageProps) {
  const [currentUser, setCurrentUser] = useState<UserLogin | null>(null);
  const [kids, setKids] = useState<KidProfile[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<number | null>(null);
  const [storyRecords, setStoryRecords] = useState<StoryRecord[]>([]);
  const [isLoadingKids, setIsLoadingKids] = useState(true);
  const [isLoadingStories, setIsLoadingStories] = useState(false);


  // Load parent user info
  useEffect(() => {
    const storedLogin = localStorage.getItem('userLogin');
    if (storedLogin) {
      try {
        const user = JSON.parse(storedLogin) as UserLogin;
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing stored login:', error);
      }
    }
  }, []);

  // Fetch kids list on mount
  useEffect(() => {
    fetchKids();
  }, []);

  // Fetch story records when kid is selected
  useEffect(() => {
    if (selectedKidId) {
      fetchStoryRecords(selectedKidId);
    }
  }, [selectedKidId]);

  const fetchKids = async () => {
    setIsLoadingKids(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/chatpj/getChildrenListByParentId', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch kids: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'SUCCESS' && Array.isArray(data.children)) {
        setKids(data.children);
        // Auto-select first kid if available
        if (data.children.length > 0) {
          setSelectedKidId(data.children[0].user_id);
        }
      }
    } catch (error) {
      console.error('Error fetching kids list:', error);
    } finally {
      setIsLoadingKids(false);
    }
  };

  const fetchStoryRecords = async (kidId: number) => {
    setIsLoadingStories(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/chatpj/GetKidStoryRecords?kid_id=${kidId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch story records: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'SUCCESS' && Array.isArray(data.stories)) {
        setStoryRecords(data.stories);
      }
    } catch (error) {
      console.error('Error fetching story records:', error);
    } finally {
      setIsLoadingStories(false);
    }
  };

  const goToChatPage = (storyId: number) => {
    if (onStorySelect) {
      //console.log('Selected kid ID:', selectedKidId);
      localStorage.setItem('selectedKid', selectedKidId?.toString() || '');
      localStorage.setItem('selectedStory', storyId.toString());
      onStorySelect(storyId.toString());
    } else {
      console.warn('onStorySelect callback not provided');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('userLogin');
    localStorage.removeItem('accessToken');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="parent-mainpage-wrapper">
      {/* Header */}
      <div className="parent-navbar">
        <div className="navbar-left">
          <div className="navbar-avatar">👨‍👩‍👧‍👦</div>
          <div className="navbar-info">
            <h2>Parent Dashboard</h2>
            <p>Welcome, {currentUser?.username || 'Parent'}!</p>
          </div>
        </div>
        <div className="navbar-right">
          <button 
            className="navbar-button btn-nav-logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="parent-content-wrapper">
        {/* Kids Selector Panel */}
        <div className="kids-panel">
          <div className="panel-header">
            <h3>👶 Select a Child</h3>
          </div>

          {isLoadingKids ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading kids...</p>
            </div>
          ) : kids.length === 0 ? (
            <div className="empty-state">
              <p>No kids found</p>
            </div>
          ) : (
            <div className="kids-list">
              {kids.map((kid) => (
                <button
                  key={kid.user_id}
                  className={`kid-card ${selectedKidId === kid.user_id ? 'selected' : ''}`}
                  onClick={() => setSelectedKidId(kid.user_id)}
                >
                  <div className="kid-avatar">🧒</div>
                  <div className="kid-info">
                    <h4>{kid.user_nickname}</h4>
                  </div>
                  {selectedKidId === kid.user_id && <div className="selected-badge">✓</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Story Records Panel */}
        <div className="stories-panel">
          <div className="panel-header">
            <h3>📚 Story Records</h3>
            {selectedKidId && (
              <p className="subtitle">
                {kids.find(k => k.user_id === selectedKidId)?.user_nickname}'s Learning Progress
              </p>
            )}
          </div>

          {!selectedKidId ? (
            <div className="empty-state">
              <p>Select a child to view their story records</p>
            </div>
          ) : isLoadingStories ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading story records...</p>
            </div>
          ) : storyRecords.length === 0 ? (
            <div className="empty-state">
              <p>No story records yet</p>
            </div>
          ) : (
            <div className="stories-list">
              {storyRecords.map((record) => (
                <div
                  key={record.user_story_id}
                  className={`story-record-card`}
                  onClick={() => {
                    goToChatPage(record.story_id);
                  }}
                >
                  {/* Card Header */}
                  <div className="record-header">
                    <div className="record-title-section">
                      <h4 className="record-title">{record.story_title}</h4>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
