
import React, { useState, useRef, useEffect } from 'react';
import './chatpage.css'; 
import { ChatMessage } from './ChatInterface';



export default function ChatPageComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: '嗨嗨～我是你的AI小助手！✨ 今天想聊什麼呢？', sender: 'ai', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        text: '哇～好有趣喔！我也超喜歡的！',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chat-container-kids">
      <div className="chat-header-kids">
        AI 聊天小助手
      </div>

      <div className="chat-messages-kids">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message-kids ${msg.sender === 'user' ? 'user' : 'ai'}`}
          >
            <div>{msg.text}</div>
            <div className="message-time-kids">{formatTime(msg.timestamp)}</div>
          </div>
        ))}

        {isLoading && (
          <div className="loading-kids">
            <div className="dino-loading" role="img" aria-label="thinking">思考中...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area-kids">
        <div className="chat-input-wrapper-kids">
          <textarea
            className="chat-textarea-kids"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="跟小助手說話吧～"
            rows={1}
          />
          <button
            className="chat-send-button-kids"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            >
            {isLoading ? (
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>
                思考中
                </span>
            ) : (
                <>發送</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}