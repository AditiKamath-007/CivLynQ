import React from 'react';
import { Bot } from 'lucide-react';
import './MessageBubble.css';

export default function MessageBubble({ message, isUser, timestamp, error, onRetry }) {
  return (
    <div className={`message-bubble-container ${isUser ? 'user' : 'bot'}`}>
      {!isUser && (
        <div className="bot-avatar">
          <Bot size={16} color="white" />
        </div>
      )}
      <div className="message-content-wrapper">
        <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'} ${error ? 'error-bubble' : ''}`}>
          {message}
          {error && onRetry && (
            <button className="retry-btn" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
        {timestamp && <div className="message-timestamp">{timestamp}</div>}
      </div>
    </div>
  );
}
