import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { askHelper } from '../services/api';

const SUGGESTED_CHIPS = [
  "How do I apply for Aadhaar?",
  "What documents are needed for a driving license?",
  "Explain PM-KISAN eligibility.",
  "Steps to register a company in India."
];

export default function Ai() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
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
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: response.answer || response,
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-bone min-h-screen flex flex-col pt-4 pb-20 md:pb-6 relative">
      <div className="max-w-3xl mx-auto w-full px-4 flex-1 flex flex-col relative h-[calc(100vh-64px)]">
        
        {/* Header */}
        <div className="flex-shrink-0 text-center mb-6">
          <h1 className="font-display font-bold text-2xl text-brand-ink">LynQbot</h1>
        </div>

        {/* Message Area */}
        <div 
          className="flex-1 overflow-y-auto mb-4 scrollbar-hide flex flex-col gap-4"
          ref={scrollRef}
        >
          {messages.length === 0 && !isTyping ? (
            /* Empty State */
            <div className="max-w-md mx-auto mt-8 flex flex-wrap gap-2 justify-center">
              {SUGGESTED_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="bg-white border border-brand-cream-dk hover:bg-brand-orange hover:text-white hover:border-brand-orange text-brand-ink text-sm font-medium rounded-pill px-4 h-9 flex items-center transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col w-full ${msg.isUser ? 'items-end' : 'items-start'}`}
              >
                {!msg.isUser && (
                  <div className="w-7 h-7 rounded-full bg-brand-green text-white font-display font-bold flex items-center justify-center text-xs mb-1 ml-1">
                    LQ
                  </div>
                )}
                <div 
                  className={`max-w-[80%] px-4 py-3 font-sans text-[15px] ${
                    msg.isUser 
                      ? 'bg-brand-orange text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white border border-brand-cream-dk text-brand-ink rounded-2xl rounded-tl-sm shadow-card'
                  } ${msg.isError ? 'border-red-500 text-red-600' : ''}`}
                >
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <div className={`text-[11px] text-brand-ink-mute mt-1 mx-1 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col w-full items-start">
              <div className="w-7 h-7 rounded-full bg-brand-green text-white font-display font-bold flex items-center justify-center text-xs mb-1 ml-1">
                LQ
              </div>
              <div className="max-w-[80%] px-5 py-4 bg-white border border-brand-cream-dk rounded-2xl rounded-tl-sm shadow-card flex gap-1 items-center">
                <motion.div 
                  className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full" 
                  animate={{ y: [0, -3, 0] }} 
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} 
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full" 
                  animate={{ y: [0, -3, 0] }} 
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} 
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full" 
                  animate={{ y: [0, -3, 0] }} 
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-bone pt-3 flex-shrink-0 z-10">
          <div className="max-w-3xl mx-auto flex items-center gap-2 bg-white rounded-pill border border-brand-cream-dk p-1 pl-2 shadow-card focus-within:border-brand-orange focus-within:shadow-pop transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask LynQbot anything…"
              className="flex-1 bg-transparent outline-none px-3 font-sans text-[15px] text-brand-ink placeholder-brand-ink-mute"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                !input.trim() || isTyping 
                  ? 'bg-brand-cream-dk cursor-not-allowed text-white/70' 
                  : 'bg-brand-orange hover:bg-brand-orange-dk text-white shadow-sm'
              }`}
            >
              <Send size={18} aria-hidden="true" className="ml-[-2px] mt-[1px]" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
