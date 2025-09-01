import React, { useState, useRef, useCallback, useEffect } from 'react';
import '../../css/Main.css';
import { assets } from '../../assets/assets';
import { useGemini } from '../../context/GeminiContext';
import { useAppContext } from '../../context/AppContext';

const cardPrompts = [
  {
    text: 'Can you explain the concept of quantum computing in simple terms, and how does it differ from classical computing?',
    icon: assets.QS_icon,
  },
  {
    text: 'What are the ethical implications of using AI in creative fields like art and music?',
    icon: assets.ethic_icon,
  },
  {
    text: 'Given the current global economic trends, what are three potential strategies for a young adult to build financial stability?',
    icon: assets.piggy_icon,
  },
  {
    text: "I'm planning a solo trip to Japan. What are some lesser-known places to visit, and what unique cultural customs should I be aware of?",
    icon: assets.nav_icon,
  },
];

const Main = () => {
  const { generateContent, loading, error } = useGemini();
  const { addRecentChat, setSendMessage, newChatSignal } = useAppContext();

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const typingRef = useRef({ stop: false, chars: [], currentSegmentIndex: 0 });
  const segmentQueueRef = useRef([]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

   
    setMessages(prev => [...prev, { type: 'user', text }]);
    typingRef.current.stop = false;
    setIsPaused(false);

    addRecentChat(text);

    try {
      const result = await generateContent(text);
      const segments = result.split(/(?<=[.?!])/).map(s => s.trim()).filter(Boolean);
      segmentQueueRef.current = segments;
      typeSegment(segmentQueueRef.current[0]);
    } catch (err) {
      setMessages(prev => [...prev, { type: 'gemini', text: 'Error: ' + err.message }]);
    }
  }, [addRecentChat, generateContent]);

  // Expose sendMessage to context
  useEffect(() => {
    if (setSendMessage) setSendMessage(sendMessage);
  }, [setSendMessage, sendMessage]);

  // Reset chat
  useEffect(() => {
    setMessages([]);
    typingRef.current = { stop: false, chars: [], currentSegmentIndex: 0 };
    segmentQueueRef.current = [];
    setPrompt('');
    setIsPaused(false);
  }, [newChatSignal]);

  const typeSegment = async (segment) => {
    if (!segment) return;

    typingRef.current.chars = segment.split('');
    setMessages(prev => [...prev, { type: 'gemini', text: '' }]);

    while (typingRef.current.chars.length > 0) {
      if (typingRef.current.stop) return;
      const nextChar = typingRef.current.chars.shift();

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text += nextChar;
        return newMessages;
      });

      await new Promise(res => setTimeout(res, 30));
    }

    typingRef.current.currentSegmentIndex += 1;
    const nextSegment = segmentQueueRef.current[typingRef.current.currentSegmentIndex];
    if (nextSegment) {
      await new Promise(res => setTimeout(res, 300));
      typeSegment(nextSegment);
    }
  };

  const pauseResumeTyping = () => {
    if (isPaused) {
      setIsPaused(false);
      typingRef.current.stop = false;
      typeSegment(typingRef.current.chars.join(''));
    } else {
      setIsPaused(true);
      typingRef.current.stop = true;
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className='main'>
      <div className='nav'>
        <p>Gemini</p>
        <img src={assets.user_icon} alt='user-icon' />
      </div>

      <div className='main-container'>
        {/* Greeting */}
        <div className={`greet ${hasMessages ? 'fade-out' : ''}`}>
          {!hasMessages && (
            <>
              <h1><span>Hello, Rahul</span></h1>
              <h2>How can I help you today?</h2>
            </>
          )}
        </div>

        {/* Prompt cards */}
        <div className={`cards ${hasMessages ? 'fade-out' : ''}`}>
          {!hasMessages && cardPrompts.map((card, idx) => (
            <div key={idx} className='card' onClick={() => sendMessage(card.text)}>
              <p>{card.text}</p>
              <img src={card.icon} alt='card-icon' className='card-icon' />
            </div>
          ))}
        </div>

        {/* Conversation */}
        <div className='conversation'>
          {messages.map((msg, idx) =>
            msg.type === 'user' ? (
              <div key={idx} className='conversation-bubble user'>{msg.text}</div>
            ) : (
              <p key={idx} className='conversation-gemini'>{msg.text}</p>
            )
          )}
        </div>

        {/* Input and actions */}
        <div className='chat-input'>
          <input
            type='text'
            placeholder='Type your message...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(prompt);
                setPrompt('');
              }
            }}
          />
          <div className='chat-actions'>
            <img src={assets.gallery_icon} alt='gallery' title='Upload image' className='chat-action-icon' />
            <img src={assets.mic_icon} alt='mic' title='Voice input' className='chat-action-icon' />
            <img
              src={assets.send_icon}
              alt='send'
              title='Send message'
              onClick={() => {
                sendMessage(prompt);
                setPrompt('');
              }}
              className='chat-action-icon send-icon'
              style={{ opacity: loading ? 0.5 : 1 }}
            />
            <button onClick={pauseResumeTyping} className='pause-button' style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <img
                  src={isPaused ? assets.play : assets.pause}
                  alt={isPaused ? 'Resume' : 'Pause'}
                  style={{ width: '24px', height: '24px' }}
              />
            </button>
          </div>
        </div>

        {loading && <p className='bottom-response'>Loading...</p>}
        {error && <p className='bottom-response'>Error: {error.message}</p>}
        <p className='bottom-info'>Gemini can make mistakes, so double-check it</p>
      </div>
    </div>
  );
};

export default Main;
