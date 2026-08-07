import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import { askHelper } from '../services/api';
import './Ai.css';

export default function Ai() {
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: "Hi! I'm LynQbot, your AI assistant for government processes. Ask me anything about documents, procedures, or schemes.",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const userMsg = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const searchParams = new URLSearchParams(location.search);
      let context = null;
      
      const stepTitle = searchParams.get('stepTitle') || location.state?.stepTitle;
      const requiredDocuments = searchParams.get('requiredDocuments') || location.state?.requiredDocuments;
      
      if (stepTitle && requiredDocuments) {
        context = { stepTitle, requiredDocuments };
      }

      const response = await askHelper(text, context);
      const answerText = typeof response === 'string' ? response : (response?.answer || 'No response received');
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: answerText,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: "Something went wrong — try again",
        isUser: false,
        isError: true,
        originalText: text,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = (originalText, idToRemove) => {
    setMessages(prev => prev.filter(m => m.id !== idToRemove));
    handleSend(originalText);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        text: "Hi! I'm LynQbot, your AI assistant for government processes. Ask me anything about documents, procedures, or schemes.",
        isUser: false,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const shouldShowTimestampGroup = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const curr = new Date(currentMsg.timestamp).getTime();
    const prev = new Date(prevMsg.timestamp).getTime();
    return (curr - prev) > 2 * 60 * 1000; // 2 minutes
  };

  return (
    <div className="ai-page-container">
      <header className="ai-header">
        <h1 className="ai-title">LynQbot</h1>
        <button className="new-chat-btn" onClick={handleNewChat}>+ New</button>
      </header>

      <div className="ai-message-list" ref={scrollRef}>
        {messages.map((msg, index) => {
          const showGroupTime = shouldShowTimestampGroup(msg, messages[index - 1]);
          return (
            <React.Fragment key={msg.id}>
              {showGroupTime && (
                <div className="time-separator">
                  {formatTime(msg.timestamp)}
                </div>
              )}
              <MessageBubble
                message={msg.text}
                isUser={msg.isUser}
                timestamp={msg.isError ? null : formatTime(msg.timestamp)}
                error={msg.isError}
                onRetry={msg.isError ? () => handleRetry(msg.originalText, msg.id) : undefined}
              />
            </React.Fragment>
          );
        })}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="ai-input-wrapper">
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
