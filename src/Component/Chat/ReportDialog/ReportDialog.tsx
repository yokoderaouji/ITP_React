import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './reportdialog.css';
import { ReportDialogProps } from './ReportDialogInterface';

export default function ReportDialog({
  isOpen,
  storyTitle,
  kidName,
  userStoryId,
  ViewState,
  onClose,
  onTokenExpired,
}: ReportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reportContent, setReportContent] = useState<string>('');
  const [view, setView] = useState<'new' | 'old'>('old');

  const handleGenerateNewReport = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/chatpj/GenOrGetReportFromStory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_story_id: userStoryId,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.status}`);
      }

      const data = await response.json();
      setReportContent(data.report);
      setView('new');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOldReport = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:8000/chatpj/GenOrGetReportFromStory?user_story_id=${userStoryId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setReportContent(data.report);
        setView('old');
      } else {
        alert('No previous report found for this story.');
      }
    } catch (error) {
      //console.error('Error fetching report:', error);
      alert('Model is currently experiencing high demand. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (ViewState === 'new') {
        console.log('Generating new report for story', userStoryId);
        handleGenerateNewReport();
      } else {
        console.log('Fetching old report for story', userStoryId);
        handleViewOldReport();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="report-dialog-overlay" onClick={onClose}>
      <div className="report-dialog-content" onClick={(e) => e.stopPropagation()}>
        {!isLoading && <button className="dialog-close-btn" onClick={onClose}>
          ✕
        </button>

        }
        

        {(view === 'new' || view === 'old') && reportContent && (
          <>
            <div className="dialog-header">
              <h2>
                {view === 'new' ? '✨ New Report' : '📋 Previous Report'}
              </h2>

            </div>

            <div className="dialog-body report-body">
              <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => <h2 className="report-title" {...props} />,
              h3: ({ node, ...props }) => {
                let icon = '📌';
                if (props.children?.toString().includes('Imagination')) icon = '🌌';
                if (props.children?.toString().includes('Language')) icon = '🗣️';
                if (props.children?.toString().includes('Emotion')) icon = '💖';
                if (props.children?.toString().includes('Conversation')) icon = '💬';
                
                return (
                  <h3 className="report-section-title">
                    <span className="section-icon">{icon}</span>
                    {props.children}
                  </h3>
                );
              },
              strong: ({ node, ...props }) => <strong className="report-highlight" {...props} />,
              ul: ({ node, ...props }) => <ul className="report-list" {...props} />,
              li: ({ node, ...props }) => <li className="report-list-item" {...props} />
            }}
          >
            {reportContent}
          </ReactMarkdown>
            </div>

          </>
        )}

        {isLoading && (
          <div className="dialog-loading">
            <div className="loading-spinner"></div>
            <p>Processing...</p>
          </div>
        )}
      </div>
    </div>
  );
}
