import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeRunner } from './CodeRunner';
import { MusicPlayer } from './MusicPlayer';
import './ChatMessage.css';

export function ChatMessage({ message, sender }) {
  const isUser = sender === 'user';
  const isTyping = message === '__TYPING__';
  const isMusic = typeof message === 'string' && message.startsWith('__MUSIC__');
  const [copied, setCopied] = useState(false);

  const musicQuery = isMusic ? message.replace('__MUSIC__', '') : '';

  let textContent = message;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }

  // Custom renderer for code blocks to add "Run" button for JS
  const codeRenderer = ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : '';
    const codeText = String(children).replace(/\n$/, '');

    if (lang === 'javascript' || lang === 'js') {
      return (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span className="code-block-lang">{lang}</span>
          </div>
          <pre className={className} {...props}>
            <code>{children}</code>
          </pre>
          <CodeRunner code={codeText} />
        </div>
      );
    }

    return (
      <pre className={className} {...props}>
        <code>{children}</code>
      </pre>
    );
  };

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--bot'}`}>
      {!isUser && (
        <div className="message-avatar message-avatar--bot">
          <span>✦</span>
        </div>
      )}

      <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
        {isTyping ? (
          <div className="typing-indicator">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        ) : isMusic ? (
          <MusicPlayer query={musicQuery} />
        ) : isUser ? (
          <span>{message}</span>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{ pre: codeRenderer }}
            >
              {textContent}
            </ReactMarkdown>
          </>
        )}

        {/* Copy button for text messages */}
        {!isTyping && !isMusic && typeof message === 'string' && (
          <button className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`} onClick={handleCopy} title="Copy">
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        )}
      </div>

      {isUser && (
        <div className="message-avatar message-avatar--user">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      )}
    </div>
  );
}