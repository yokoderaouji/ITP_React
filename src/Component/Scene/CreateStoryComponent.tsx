import React, { useState } from 'react';
import { UserLogin } from '../../App';
import './createstory.css';

interface CreateStoryProps {
  onTokenExpired?: () => void;
  currentUser: UserLogin | null;
  backToStoryList: () => void;
}

interface StoryTemplate {
  title: string;
  setting: string;
  description: string;
  tag1: string;
  tag2?: string;
  tag3?: string;
}

export default function CreateStoryComponent({ onTokenExpired, currentUser, backToStoryList }: CreateStoryProps) {
  const [template, setTemplate] = useState<StoryTemplate>({
    title: '',
    setting: '',
    description: '',
    tag1: '',
    tag2: '',
    tag3: '',
  });

  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [isLoadingFinal, setIsLoadingFinal] = useState(false);
  const [testOutput, setTestOutput] = useState<string>('');
  const [genTemplate, setGenTemplate] = useState<string>('');

  const handleInputChange = (field: keyof StoryTemplate, value: string) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const CheckRequireInput = (CheckTemp:boolean): boolean => {
    if (!template.title.trim()) {
      alert('Please enter a story title');
      return false;
    }

    if (!template.setting.trim()) {
      alert('Please enter the story setting');
      return false;
    }

    if (!template.description.trim()) {
      alert('Please enter a story description');
      return false;
    }

    if (!template.tag1.trim()) {
      alert('Please enter a tag1');
      return false;
    }

    if(CheckTemp && !genTemplate.trim()) {
      alert('Please create a story template first');
      return false;
    }

    return true;
  };

  const handleCreateTemplate = async () => {

    if(!CheckRequireInput(false)) {
      return;
    }
    setIsLoading(true);
    setTestOutput('');
    setGenTemplate('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/chatpj/GenerateStory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          user_message: template.setting,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to create template: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setGenTemplate(data.story_temp || '');
      }
    } catch (error) {
      // console.error('Error creating template:', error);
      alert(`Model is currently experiencing high demand. Please try again later.`);

    } finally {
      setIsLoading(false);
    }
  };


  const handleTestTemplate = async () => {
    
    if(!CheckRequireInput(true)) {
      return;
    }


    setIsLoadingTest(true);
    setTestOutput('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/chatpj/GenerateStoryIntro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_storysetting: genTemplate,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to test template: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setTestOutput(data.story_intro || '');
        setResult(data.story_intro || '');
      } else {
        setTestOutput('Model is currently experiencing high demand. Please try again later.');
      }
    } catch (error) {
      setTestOutput(`Model is currently experiencing high demand. Please try again later.`);
    } finally {
      setIsLoadingTest(false);
    }
  };

  const handleClearAll = () => {
    setTemplate({
      title: '',
      setting: '',
      description: '',
      tag1: '',
      tag2: '',
      tag3: '',
    });
    setResult('');
    setTestOutput('');
    setGenTemplate('');
  };

  const  handleFinalCreate = async () => {
    CheckRequireInput(true);
    if (!testOutput) {
      alert('Please test the template first.');
    }
    setIsLoadingFinal(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/chatpj/GenerateStoryToDB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          user_storysetting: genTemplate,
          user_storysetting_intro: testOutput,
          tag1: template.tag1,
          tag2: template.tag2,
          tag3: template.tag3,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`Final creation failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        alert('Story template created successfully!');
        handleClearAll();
        backToStoryList();
      } else {
        alert('Model is currently experiencing high demand. Please try again later.');
      }
    } catch (error) {

      alert('Model is currently experiencing high demand. Please try again later.');
    } finally {
      setIsLoadingFinal(false);
    }


  };

  return (
    <div className="create-story-wrapper">
      <div className="create-story-container">
        <div className="create-header">
          <h1>✨ Create Story Template</h1>
          <p>Design your own AI story adventure</p>
        </div>
        <div className="create-content">
          <div className="input-panel">
            <div className="panel-title">📝 Story Settings</div>

            <div className="form-group">
              <label htmlFor="title">Story Title *</label>
              <input
                id="title"
                type="text"
                className="input-field"
                placeholder="Enter story title..."
                value={template.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={30}
              />
              <span className="char-count">{template.title.length}/30</span>
            </div>

            <div className="form-group">
              <label htmlFor="title">Story Description *</label>
              <textarea
                id="description"
                className="textarea-field"
                placeholder="Enter story description..."
                value={template.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={500}
              />
              <span className="char-count">{template.description.length}/500</span>
            </div>


            <div className="form-group">
              <label htmlFor="setting">Setting *</label>
              <textarea
                id="setting"
                className="textarea-field"
                placeholder="Please provide the story setting Here."
                value={template.setting}
                onChange={(e) => handleInputChange('setting', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <div className="tags-input">
                <input
                  id="tag1"
                  type="text"
                  style={{ marginBottom: '8px', width: '80%' }}
                  className="input-field"
                  placeholder="Tag 1 *"
                  value={template.tag1}
                  onChange={(e) => handleInputChange('tag1', e.target.value)}
                  
                />
                <input
                  id="tag2"
                  type="text"
                  style={{ marginBottom: '8px', width: '80%' }}
                  className="input-field"
                  placeholder="Tag 2  (optional)"
                  value={template.tag2}
                  onChange={(e) => handleInputChange('tag2', e.target.value)}
                />
                <input
                  id="tag3"
                  type="text"
                  style={{ marginBottom: '8px', width: '80%' }}
                  className="input-field"
                  placeholder="Tag 3  (optional)"
                  value={template.tag3}
                  onChange={(e) => handleInputChange('tag3', e.target.value)}
                />
              </div>
            </div>


            <div className="input-actions">
              <button
                className="action-btn btn-test"
                onClick={handleCreateTemplate}
                disabled={isLoading || isLoadingTest || isLoadingFinal}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>🚀 (Step 1)Create a story Template</>
                )}
              </button>

              <button
                className="action-btn btn-test"
                onClick={handleTestTemplate}
                disabled={isLoading || isLoadingTest || isLoadingFinal}
              >
                {isLoadingTest ? (
                  <>
                    <span className="loading-spinner"></span>
                    Testing...
                  </>
                ) : (
                  <>🚀 (Step 2)Test Template</>
                )}
              </button>

              
            </div>

            <div className="input-actions" style={{ marginTop: '10px' }}>
              <button
                className="action-btn btn-clear"
                onClick={handleClearAll}
                disabled={isLoading || isLoadingTest || isLoadingFinal}
              >
                🔄 Clear All
              </button>
              </div>

            <div className="form-group">
              <label htmlFor="plot">Output setting (!!!Must not edit here if you do not know what you are doing!!!)</label>
              <textarea
                id="plot"
                className="textarea-field"
                placeholder="Story template output setting"
                value={genTemplate}
                onChange={(e) => setGenTemplate(e.target.value)}
                rows={4}
              />
            </div>

          </div>


          <div className="output-panel">
            <div className="panel-title">📺 Preview Result</div>

            {isLoadingTest && (
              <div className="loading-state">
                <div className="loading-animation">
                  <div className="spinner"></div>
                  <p>Generating story preview...</p>
                </div>
              </div>
            )}

            {!isLoadingTest && testOutput && (
              <>
                <div className="result-display">
                  <div
                    className="result-content"
                    dangerouslySetInnerHTML={{ __html: testOutput }}
                  />
                </div>

                <div className="output-actions">
                  <button className="action-btn btn-copy" onClick={handleFinalCreate}>
                    📋 Confirm Creation
                  </button>
                </div>
              </>
            )}

            {!isLoadingTest && !testOutput && (
              <div className="empty-state">
                <div className="empty-icon">🎬</div>
                <p>Your story preview will appear here after testing the template</p>
                <small>Fill in the story settings and click "Create a story Template" then click "Test Template" to see the result</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
