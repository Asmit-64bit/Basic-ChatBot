import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import { Sidebar } from './components/Sidebar';
import { getGeminiResponse } from './services/gemini.js';
import {
  loadHistory,
  saveConversation,
  deleteConversation,
  getTheme,
  setTheme as persistTheme,
  exportChat,
} from './services/chatHistory.js';
import './App.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Hey, night owl';
}

const SUGGESTIONS = [
  { text: "Tell me something fun", emoji: "😊" },
  { text: "Help me brainstorm", emoji: "💡" },
  { text: "Write something creative", emoji: "✨" },
  { text: "Explain something simply", emoji: "🧠" },
];

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [conversationId, setConversationId] = useState(crypto.randomUUID());
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setThemeState] = useState('dark');

  // Load theme and history on mount
  useEffect(() => {
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setHistory(loadHistory());
  }, []);

  // Auto-save conversation when messages change
  useEffect(() => {
    if (chatMessages.length > 0) {
      const firstUserMsg = chatMessages.find((m) => m.sender === 'user');
      const title = firstUserMsg
        ? firstUserMsg.message.slice(0, 40)
        : 'New Chat';
      const cleanMessages = chatMessages.filter((m) => m.message !== '__TYPING__');
      if (cleanMessages.length > 0) {
        const updated = saveConversation(conversationId, title, cleanMessages);
        setHistory(updated);
      }
    }
  }, [chatMessages, conversationId]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    persistTheme(next);
  }

  function handleNewChat() {
    setChatMessages([]);
    setConversationId(crypto.randomUUID());
    setSidebarOpen(false);
  }

  function handleLoadChat(chat) {
    setChatMessages(chat.messages);
    setConversationId(chat.id);
  }

  function handleDeleteChat(id) {
    const updated = deleteConversation(id);
    setHistory(updated);
    if (id === conversationId) {
      handleNewChat();
    }
  }

  function handleExport() {
    const clean = chatMessages.filter(
      (m) => typeof m.message === 'string' && !m.message.startsWith('__')
    );
    exportChat(clean);
  }

  async function handleSuggestionClick(text) {
    const userMessage = {
      message: text,
      sender: 'user',
      id: crypto.randomUUID(),
    };
    const newMessages = [userMessage];
    setChatMessages(newMessages);

    setChatMessages([
      ...newMessages,
      { message: '__TYPING__', sender: 'bot', id: crypto.randomUUID() },
    ]);

    const response = await getGeminiResponse(text);
    setChatMessages([
      ...newMessages,
      { message: response, sender: 'bot', id: crypto.randomUUID() },
    ]);
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={history}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
      />

      {/* Background */}
      <div className="bg-ambient">
        <div className="ambient-blob ambient-blob--1"></div>
        <div className="ambient-blob ambient-blob--2"></div>
      </div>

      <div className="app-content">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
          onExport={handleExport}
          onToggleTheme={toggleTheme}
          theme={theme}
          hasMessages={chatMessages.length > 0}
        />

        {chatMessages.length === 0 ? (
          <div className="empty-state">
            <div className="greeting-section">
              <span className="greeting-wave">👋</span>
              <h2 className="greeting-text">{getGreeting()}</h2>
              <p className="greeting-sub">
                I'm here to chat, help, or just hang out. <br />
                What's on your mind?
              </p>
            </div>

            <div className="suggestion-list">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(s.text)}
                >
                  <span className="suggestion-emoji">{s.emoji}</span>
                  <span className="suggestion-text">{s.text}</span>
                  <svg className="suggestion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              ))}
            </div>

            <p className="commands-hint">
              Try <code>/play lofi beats</code> or <code>/imagine sunset over mountains</code>
            </p>
          </div>
        ) : (
          <ChatMessages chatMessages={chatMessages} />
        )}

        <ChatInput
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      </div>
    </div>
  );
}

export default App;
