import { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/gemini.js';
import './ChatInput.css';

export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  function toggleVoice() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  async function sendMessage() {
    const messageText = inputText;
    if (isLoading || messageText.trim() === '') return;

    setIsLoading(true);
    setInputText('');

    // Check for commands
    const playMatch = messageText.match(/^\/play\s+(.+)/i);

    const newChatMessages = [
      ...chatMessages,
      { message: messageText, sender: 'user', id: crypto.randomUUID() },
    ];
    setChatMessages(newChatMessages);

    if (playMatch) {
      // Music command
      setChatMessages([
        ...newChatMessages,
        { message: `__MUSIC__${playMatch[1]}`, sender: 'bot', id: crypto.randomUUID() },
      ]);
      setIsLoading(false);
      return;
    }



    // Normal message
    setChatMessages([
      ...newChatMessages,
      { message: '__TYPING__', sender: 'bot', id: crypto.randomUUID() },
    ]);

    const response = await getGeminiResponse(messageText);
    setChatMessages([
      ...newChatMessages,
      { message: response, sender: 'bot', id: crypto.randomUUID() },
    ]);
    setIsLoading(false);
  }

  return (
    <div className="chat-input-wrapper">
      <div className={`chat-input-container ${isLoading ? 'is-loading' : ''}`}>
        <textarea
          ref={textareaRef}
          placeholder="Type a message... (try /play)"
          className="text-input"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          rows={1}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            } else if (event.key === 'Escape') {
              setInputText('');
            }
          }}
        />
        {recognitionRef.current && (
          <button
            className={`voice-btn ${isListening ? 'voice-btn--active' : ''}`}
            onClick={toggleVoice}
            title={isListening ? 'Stop listening' : 'Voice input'}
            aria-label="Voice input"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
        )}
        <button
          onClick={sendMessage}
          className={`send-button ${inputText.trim() ? 'send-button--ready' : ''}`}
          disabled={isLoading || !inputText.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
