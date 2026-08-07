import React from 'react';
import { Bot } from 'lucide-react';
import './TypingIndicator.css';

export default function TypingIndicator() {
  return (
    <div className="message-bubble-container bot typing-indicator-container">
      <div className="bot-avatar">
        <Bot size={16} color="white" />
      </div>
      <div className="message-content-wrapper">
        <div className="message-bubble bot-bubble typing-bubble">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
}
