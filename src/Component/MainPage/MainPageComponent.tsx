
import React, { useState, useEffect } from 'react';
import { UserLogin } from '../../App';
import './mainpage.css';
import { ApiStory, Story } from './MainPageInterface';




interface MainPageComponentProps {
  onStorySelect?: (storyId: string) => void;
  onLogout?: () => void;
  onTokenExpired?: () => void; 
  onCreateStoryClick?: () => void;
}

export default function MainPageComponent({ onStorySelect, onLogout, onTokenExpired, onCreateStoryClick }: MainPageComponentProps) {
  const [currentUser, setCurrentUser] = useState<UserLogin | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);


  const mapApiToStory = (api: ApiStory): Story => {
    const tags: string[] = [];
    [api.story_tag_1, api.story_tag_2, api.story_tag_3].forEach(t => {
      if (t && t.trim()) tags.push(t.trim());
    });

    const category = api.story_setting_1 || '';

    return {
      id: api.story_id.toString(),
      title: api.story_title,
      description: api.story_description,
      emoji: '📖',
      category,
      locked: api.story_status !== 'Y',
      tags,
    };
  };

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8000/chatpj/GetStoryTemp', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 401 || res.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }
      if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
      const json = await res.json();
      if (json.status === 'SUCCESS' && Array.isArray(json.data)) {
        const loaded = json.data.map((itm: ApiStory) => mapApiToStory(itm));
        setStories(loaded);
      } else {
        console.warn('Unexpected story API response', json);
      }
    } catch (err) {
      console.error('Error loading stories', err);
    } finally {
      setIsLoading(false);
    }
  };

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
    fetchStories();
  }, []);

  const handleStoryClick = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story && !story.locked) {
      if (onStorySelect) {
 
        localStorage.setItem('selectedStory', story.id);
        console.log('Selected story:', story.id);
        onStorySelect(storyId);
      }
    }
  };

  const toggleFavorite = (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId];
      localStorage.setItem('storyFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userLogin');
    localStorage.removeItem('selectedStory');
    if (onLogout) {
      onLogout();
    }
  };

  if (isLoading) {
    return (
      <div className="mainpage-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your adventures...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mainpage-wrapper">

      <div className="mainpage-navbar">
        <div className="navbar-left">
          <div className="navbar-avatar">🧒</div>
          <div className="navbar-info">
            <h2>{currentUser?.nickname || 'Adventurer'}</h2>
            <p>Ready for an adventure?</p>
          </div>
        </div>
        <div className="navbar-right">
          <button 
            className="navbar-button btn-nav-settings"
            onClick={onCreateStoryClick}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              marginRight: '10px'
            }}
          >
            ✨ Create Story
          </button>
          <button 
            className="navbar-button btn-nav-logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

    
      <div className="mainpage-content">
        <h1 className="section-title">📖 Choose Your Story</h1>
        <p className="section-subtitle">Pick an adventure and get started! 🎮</p>

        {stories.length > 0 ? (
          <div className="stories-grid">
            {stories.map(story => (
              <div
                key={story.id}
                className={`story-card ${story.locked ? 'locked' : ''}`}
                onClick={() => handleStoryClick(story.id)}
              >
  
                <div className="story-card-header">
                  {story.locked && (
                    <div className="story-lock-badge">🔒</div>
                  )}
                  <div className="story-emoji">{story.emoji}</div>
                </div>

                <div className="story-card-body">
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-description">{story.description}</p>

                  <div className="story-meta">
                    {story.tags.map(tag => (
                      <span key={tag} className="story-badge" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="story-card-footer">
                  {story.locked ? (
                    <button className="story-button btn-play" disabled>
                      🔒 Locked 
                    </button>
                  ) : (
                    <button className="story-button btn-play">
                      ▶️ Start Adventure
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-stories">
            <span className="no-stories-emoji">😴</span>
            <h3>No stories here yet</h3>
          </div>
        )}
      </div>

    </div>
  );
}