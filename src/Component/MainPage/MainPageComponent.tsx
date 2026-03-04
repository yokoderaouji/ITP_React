
import React, { useState, useEffect } from 'react';
import './mainpage.css';

interface UserLogin {
  username: string;
  role: 'kid' | 'parent';
  loginTime: string;
  isParent: boolean;
}

interface Story {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  locked: boolean;
  requiredLevel?: number;
  tags: string[];
}

interface ApiStory {
  story_id: number;
  story_title: string;
  story_description: string;
  story_content?: string;
  story_start?: string;
  story_setting_1?: string;
  story_setting_2?: string;
  story_setting_3?: string;
  story_setting_4?: string;
  story_setting_5?: string;
  story_tag_1?: string;
  story_tag_2?: string;
  story_tag_3?: string;
  story_status?: string;
  [key: string]: any;
}

interface MainPageComponentProps {
  onStorySelect?: (storyId: string) => void;
  onLogout?: () => void;
}

// we'll keep a placeholder so the type above compiles correctly; actual data comes from API
// const AVAILABLE_STORIES: Story[] = [];


export default function MainPageComponent({ onStorySelect, onLogout }: MainPageComponentProps) {
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

    const category = api.story_setting_1 || 'General';

    return {
      id: api.story_id.toString(),
      title: api.story_title,
      description: api.story_description,
      emoji: '📖',
      category,
      locked: api.story_status !== 'Y',
      requiredLevel: undefined,
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
    // Load user info
    const storedLogin = localStorage.getItem('userLogin');
    if (storedLogin) {
      try {
        const user = JSON.parse(storedLogin) as UserLogin;
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing stored login:', error);
      }
    }

    // fetch list of stories from server
    fetchStories();
  }, []);


  // Filter stories based on selected category
  const filteredStories = selectedCategory === 'All' 
    ? stories 
    : stories.filter(s => s.category === selectedCategory);

  const handleStoryClick = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story && !story.locked) {
      if (onStorySelect) {
 
        localStorage.setItem('selectedStory', story.id);
        onStorySelect(storyId);
      }
      // } else {
      //   // Store selected story in localStorage
      //   localStorage.setItem('selectedStory', story.id);
      //   console.log('Selected story:', story.id);
      //   // In a real app, you would navigate to the chat page here
      //   console.log('Starting story:', storyId);
      // }
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
      {/* Navbar */}
      <div className="mainpage-navbar">
        <div className="navbar-left">
          <div className="navbar-avatar">🧒</div>
          <div className="navbar-info">
            <h2>{currentUser?.username || 'Adventurer'}</h2>
            <p>Ready for an adventure?</p>
          </div>
        </div>
        <div className="navbar-right">
          <button 
            className="navbar-button btn-nav-settings"
            onClick={() => console.log('Settings clicked')}
          >
            ⚙️ Settings
          </button>
          <button 
            className="navbar-button btn-nav-logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mainpage-content">
        <h1 className="section-title">📖 Choose Your Story</h1>
        <p className="section-subtitle">Pick an adventure and let's get started! 🎮</p>

        {/* Category Tabs */}
        <div className="category-tabs">
          {/* {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))} */}
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="stories-grid">
            {filteredStories.map(story => (
              <div
                key={story.id}
                className={`story-card ${story.locked ? 'locked' : ''}`}
                onClick={() => handleStoryClick(story.id)}
              >
                {/* Header with emoji */}
                <div className="story-card-header">
                  {story.locked && (
                    <div className="story-lock-badge">🔒</div>
                  )}
                  <div className="story-emoji">{story.emoji}</div>
                </div>

                {/* Body */}
                <div className="story-card-body">
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-description">{story.description}</p>


                  {/* Tags */}
                  <div className="story-meta">
                    {story.tags.map(tag => (
                      <span key={tag} className="story-badge" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with buttons */}
                <div className="story-card-footer">
                  {story.locked ? (
                    <button className="story-button btn-play" disabled>
                      🔒 Locked (Level {story.requiredLevel}+)
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