
import React, { useState, useRef, useEffect } from 'react';
import './chatpage.css'; 
import { ChatMessage, ChatPageProps } from './ChatInterface';





export default function ChatPageComponent({ onTokenExpired }: ChatPageProps) {
  const tempmsg = "<html><head><title id='1'>The 5CM Adventure(1)</title></head><body style=\"background-color: #1a1a2e; color: #e0e0ff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0;\"><div style=\"padding: 20px 10px; text-align: center; background: linear-gradient(90deg, #6a00ff 0%, #00ffc8 100%); color: #1a1a2e; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; border-bottom: 5px solid #ffc800; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);\">THE 5CM ADVENTURE(1)</div><details open style=\"background-color: #3a3f5b; margin: 15px; padding: 5px; border: 2px solid #00ffc8; border-radius: 10px;\"><summary style=\"font-weight: bold; cursor: pointer; color: #00ffc8; padding: 10px; font-size: 16px; background-color: #3a3f5b; border-radius: 8px; list-style: none; text-shadow: 0 0 5px #00ffc8;\">::: CURRENT STATUS ::: (Click to Toggle)</summary><div style=\"padding: 10px 15px; font-size: 14px; color: #e0e0ff;\"><p style=\"margin: 5px 0;\">◆ Real Time: <span style=\"color: #ffc800;\">10:00 AM</span> (10 hours until parents return)</p><p style=\"margin: 5px 0;\">◆ Current Height: <span style=\"color: #ffc800;\">5 cm</span></p><p style=\"margin: 5px 0;\">◆ Location: <span style=\"color: #e0e0ff;\">Floor, next to the Mysterious Puddle</span></p><p style=\"margin: 5px 0;\">◆ Stamina: <span style=\"color: #00ffc8;\">■■■■</span><span style=\"color: #6d6d8d;\">□</span> (4/5)</p><p style=\"margin: 5px 0;\">◆ Hunger: <span style=\"color: #6d6d8d;\">□□□□□</span> (0/5)</p><p style=\"margin: 5px 0;\">◆ Inventory: <span style=\"color: #e0e0ff;\">None</span></p><p style=\"margin: 5px 0;\">◆ Key Clues: <span style=\"color: #ffc800;\">0/4</span></p><p style=\"margin: 5px 0;\">◆ Current Biggest Threat: <span style=\"color: #6d6d8d;\">None (Cat sleeping on bed)</span></p></div></details><div style=\"background-color: #1a1a2e; margin: 15px; padding: 20px; border: 1px solid #3a3f5b; border-radius: 10px;\"><p>You wake up to a world that has fundamentally changed. The room is a colossal, alien landscape. The soft cotton of your pajamas feels like heavy armor on your 5 cm body. You are lying next to a small, dark stain—a 'Mysterious Puddle' from last night's spilled juice, now a glistening, waist-high pool.</p><p>A few meters away, what looks like a mountain range of brown dust and hair lies next to a colossal, perfectly round structure: a Yo-Yo, now a giant, silent wheel. The carpet fibers look like an impenetrable jungle, and the air is thick with the scent of dust.</p><p>Your first priority must be to find safety or a source of food. The scale is terrifying, and the clock is ticking.</p><p style=\"color: #ffc800; font-weight: bold; margin-top: 15px;\">What is your first move?</p></div><div style=\"margin: 15px; padding: 15px; background-color: #3a3f5b; border-radius: 10px; text-align: center; border: 2px solid #6a00ff;\"><div style=\"display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;\"><button onclick=\"const textarea = document.querySelector('#chat-textarea-kids');if (textarea) {textarea.value='Carefully investigate the Mysterious Puddle, noting its color and composition, and whether it is a potential water source.'; textarea.dispatchEvent(new Event('input', { bubbles: true }));} else { alert('textarea not found'); }\" style=\"background-color: #00ffc8; color: #1a1a2e; border: none; padding: 12px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 0 10px #00ffc8;\">[A] Investigate Puddle (Clue)</button><button onclick=\"const textarea = document.querySelector('#chat-textarea-kids');if (textarea) {textarea.value='Climb the nearest dust bunny mountain to scout the area and look for a biscuit crumb or water droplet.'; textarea.dispatchEvent(new Event('input', { bubbles: true }));} else { alert('textarea not found'); }\" style=\"background-color: #ffc800; color: #1a1a2e; border: none; padding: 12px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 0 10px #ffc800;\">[B] Search for Supplies (Hunger)</button><button onclick=\"const textarea = document.querySelector('#chat-textarea-kids');if (textarea) {textarea.value='Attempt to climb the giant Yo-Yo to see if it can be stabilized for a look-out post or future escape tool.'; textarea.dispatchEvent(new Event('input', { bubbles: true }));} else { alert('textarea not found'); }\" style=\"background-color: #6a00ff; color: #e0e0ff; border: none; padding: 12px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 0 10px #6a00ff;\">[C] Approach Yo-Yo (Gear)</button><button onclick=\"const textarea = document.querySelector('#chat-textarea-kids');if (textarea) {textarea.value='Shout loudly, hoping to attract attention from the giant world, fully aware this will attract the cat.'; textarea.dispatchEvent(new Event('input', { bubbles: true }));} else { alert('textarea not found'); }\" style=\"background-color: #e0e0ff; color: #1a1a2e; border: 3px solid #ff0066; padding: 9px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 0 10px #ff0066;\">[D] Call Out Loudly! (DANGER)</button></div></div></body></html>";

  const tempstart = "<html><head><title>5CM Adventure Introduction</title></head><body style=\"background-color: #1a1a2e; color: #e0e0ff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0;\"><div style=\"background-color: #3a3f5b; margin: 20px; padding: 25px; border: 3px solid #6a00ff; border-radius: 12px; box-shadow: 0 0 15px rgba(106, 0, 255, 0.7); line-height: 1.6; font-size: 16px;\"><p style=\"font-size: 20px; font-weight: bold; text-align: center; color: #ffc800; border-bottom: 2px solid #ffc800; padding-bottom: 10px; margin-top: 0;\">WELCOME TO YOUR MICRO-ADVENTURE!</p><p>This morning you woke up… and you’re only <strong style=\"color: #00ffc8; font-size: 18px;\">5 centimeters tall!</strong></p><p>That’s smaller than your favorite toy car!</p><p>Your whole room suddenly turned into a giant jungle:</p><ul style=\"list-style-type: none; padding-left: 15px; margin: 10px 0;\"><li style=\"margin-bottom: 5px;\">• Your bed is now a huge mountain</li><li style=\"margin-bottom: 5px;\">• The floor is a giant desert</li><li style=\"margin-bottom: 5px;\">• One biscuit crumb is as big as your dinner plate</li><li style=\"margin-bottom: 5px;\">• And your cat (or dog)? It’s now a <strong style=\"color: #ffc800;\">roaring T-rex monster!</strong></li></ul><p>Your mom and dad went out and will be back at <strong style=\"color: #ffc800;\">8 o’clock tonight.</strong></p><p>If they find you this tiny, they might think you’re a strange little bug!</p><p style=\"font-weight: bold; color: #00ffc8; margin-top: 15px;\">So before 8 PM, you have to:</p><ul style=\"list-style-type: '👉 '; padding-left: 20px; margin: 10px 0; color: #e0e0ff;\"><li>Explore the giant room</li><li>Find food and water (tiny crumbs and water drops)</li><li>Stay away from the cat, ants, and scary spiders</li><li><strong style=\"color: #6a00ff;\">Look for clues to grow back to normal size!</strong></li></ul><p>You can climb <span style=\"color: #00ffc8;\">Lego walls</span>, ride a <span style=\"color: #00ffc8;\">remote-control car</span>, use a <span style=\"color: #00ffc8;\">paper clip as a sword</span>, and turn an <span style=\"color: #00ffc8;\">eraser into shoes</span>!</p><p style=\"font-size: 18px; font-weight: bold; text-align: center; color: #ffc800; margin-top: 20px;\">Every choice is yours—what you do decides if you become a tiny hero… or get caught!</p></div></body></html>"

  const [messages, setMessages] = useState<ChatMessage[]>([
    // { id: 1, text: tempmsg, sender: 'ai', timestamp: new Date() ,title:"The 5CM Adventure(1)"},
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [userStoryId, setUserStoryId] = useState<number | null>(null);
  const [firstload, setFirstLoad] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (firstload) {
      fetchStoryContent();
      setFirstLoad(false);
    }
  }, [firstload]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {

    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // const updatedMessages = [...messages, userMessage];

    try {
      const storyId = localStorage.getItem('selectedStory');

      const requestBody = {
        // history: updatedMessages,
        user_story_id: userStoryId,
        user_message: userMessage.text,
        chat_tem: storyId,
      };

      console.log(requestBody);

  
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/chatpj/StoryChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`server error：${response.status}`);
      }

      const data = await response.json();

      const historyMessages: ChatMessage[] = data.history.map((entry: any) => ({
        id: entry.user_story_entry_id,
        title: entry.entry_title,
        text: entry.entry_content,
        sender: entry.entry_role as 'user' | 'ai',
        timestamp: new Date(entry.created_on),
      }));

      setMessages(historyMessages);

    } catch (error) {

      const errorMsg: ChatMessage = {
        id: Date.now() + 1,
        text: 'something went wrong... Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
  };

  const scrollToMessage = (messageId : string) => {
    const element = document.getElementById(`msg-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleTrackBack = async (userStoryEntryId: number) => {
    const isConfirmed = window.confirm('Are you sure you want to trace back the chat to this point?');
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('accessToken');

      if (!userStoryId) {
        console.error('No user story ID found');
        alert('Error: User story not found');
        return;
      }

      const response = await fetch(
        'http://localhost:8000/chatpj/RetraceStoryChat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            user_story_id: userStoryId,
            user_story_entry_id: userStoryEntryId,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        if (onTokenExpired) onTokenExpired();
        return;
      }

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.status === 'SUCCESS') {
          const retracedEntryId = responseData.retraced_entry_id;
          setMessages(prevMessages => 
            prevMessages.filter(msg => msg.id < retracedEntryId)
          );
          alert('Chat traced back successfully!');
        }
      } else {
        throw new Error(`Failed to trace back: ${response.status}`);
      }
    } catch (error) {
      console.error('Error tracing back chat:', error);
      alert('Failed to trace back chat. Please try again.');
    }
  };
  
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const fetchStoryContent = async () => {
    try {
      setStoryLoading(true);
      const storyId = localStorage.getItem('selectedStory');
      const token = localStorage.getItem('accessToken');

      if (!storyId) {
        console.error('No story selected');
        setStoryLoading(false);
        return;
      }


      const response = await fetch(
        `http://localhost:8000/chatpj/SetUpNewStoryOrGetOldStory?story_id=${storyId}`,
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
        throw new Error(`Failed to fetch story: ${response.status}`);
      }

      const responseData = await response.json();

      setUserStoryId(responseData.data.user_story_id);

      if (responseData.status === 'SUCCESS' && responseData.data.entries) {
        const initialMessages: ChatMessage[] = responseData.data.entries.map((entry: any) => ({
          id: entry.user_story_entry_id,
          text: entry.entry_content.replace(/\\"/g, '"'),
          sender: entry.entry_role,
          title: entry.entry_title,
          timestamp: new Date(entry.created_on),
        }));
        setMessages(initialMessages);
        // if (initialMessages.length > 0) {
        //   setStoryTitle(initialMessages[0].title || 'Story');
        // }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      // Fallback message
      const fallbackMessage: ChatMessage = {
        id: 1,
        text: '<p>Sorry, could not load the story. Please try again.</p>',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([fallbackMessage]);
    } finally {
      setStoryLoading(false);
    }
  };

  return (
    <div className="page-wrapper-kids">
      
      {/* TABLE OF CONTENTS SIDEBAR */}
      <div className="toc-sidebar-kids">
        <div className="toc-header-kids">
          🗺️ Story Map
        </div>
        <div className="toc-list-kids">
          {messages.map((msg, index) => (
            msg.sender === 'ai' && (
              <button
                key={`toc-${msg.id}`}
                className="toc-item-kids"
                onClick={() => scrollToMessage(msg.id.toString())}
              >
                <span className="toc-icon">📍</span> 
                {msg.title ? msg.title : "Story Part"}
              </button>
            )
          ))}
        </div>
      </div>

      {/* 3. EXISTING CHAT CONTAINER (Slightly modified) */}
      <div className="chat-container-kids">
        <div className="chat-header-kids">
          AI Story Chat
        </div>

        <div className="chat-messages-kids">
          {/* Start Message */}
          {/* <div
            id="msg--1" 
            key={-1}
            className={`message-kids ai`}
          >
            <div dangerouslySetInnerHTML={{ __html: tempstart }} />
            <div className="message-time-kids"></div>
          </div> */}

          {/* Message Loop */}
          {messages.map(msg => (
            <div
              id={`msg-${msg.id}`} // IMPORTANT: ID for scrolling
              key={msg.id}
              className={`message-kids ${msg.sender === 'user' ? 'user' : 'ai'}`}
            >
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              {msg.sender === 'user' && (
                <button
                  className="trackback-button-kids"
                  onClick={() => handleTrackBack(msg.id)}
                  title="Trace back to this point"
                >
                  ↶ Trace Back
                </button>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="loading-kids">
              <div className="dino-loading" role="img" aria-label="thinking">Thinking...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area-kids">
          <div className="chat-input-wrapper-kids">
            <textarea
              className="chat-textarea-kids"
              id='chat-textarea-kids'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Do/Say some thing～"
              rows={1}
            />
            <button
              className="chat-send-button-kids"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>Wait</span>
              ) : (
                  <>Send</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}