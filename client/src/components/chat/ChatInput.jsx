import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './ChatInput.css';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        className="chat-input-field"
        placeholder="Ask LynQbot anything…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button 
        className="chat-send-btn" 
        onClick={handleSend} 
        disabled={disabled || !text.trim()}
        aria-label="Send message"
      >
        <Send size={20} color="white" />
      </button>
    </div>
  );
}
