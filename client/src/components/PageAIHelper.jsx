import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPageContext } from '../lib/aiPageContext';
import { askHelper } from '../services/api';

const formatMessage = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function PageAIHelper() {
  const location = useLocation();
  const pathname = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef(null);

  // 3.2 — Visibility rules
  const isHidden = pathname.startsWith('/ai') || pathname.startsWith('/login') || pathname.startsWith('/signup');

  const pageContext = { ...getPageContext(pathname) };
  let apiContextData = { page: pageContext.name };

  if (pathname.startsWith('/roadmap/')) {
    const roadmapId = pathname.split('/').pop();
    const dataStr = localStorage.getItem(roadmapId) || localStorage.getItem(`roadmap-${roadmapId}`);
    if (dataStr) {
      try {
        const workflow = JSON.parse(dataStr);
        const compKey = roadmapId.startsWith('roadmap-') ? `completed-${roadmapId}` : `completed-roadmap-${roadmapId}`;
        const savedComp = localStorage.getItem(compKey) || localStorage.getItem(`completed-${roadmapId}`);
        const parsedComp = savedComp ? JSON.parse(savedComp) : {};
        
        let currentStepIdx = 0;
        if (workflow.steps) {
          const firstIncomplete = workflow.steps.findIndex((_, idx) => !parsedComp[idx]);
          if (firstIncomplete > 0) currentStepIdx = firstIncomplete;
          
          const currentStep = workflow.steps[currentStepIdx];
          if (currentStep) {
            apiContextData = {
              goal: workflow.goal || workflow.title,
              stepTitle: currentStep.title,
              stepDescription: currentStep.description
            };
            pageContext.subtitle = `Step ${currentStepIdx + 1}: ${currentStep.title}`;
            pageContext.chips = [
              `Explain "${currentStep.title}"`,
              `What documents do I need for this?`,
              `I'm stuck on this step`
            ];
          }
        }
      } catch (e) {
        console.error("Error reading roadmap for AI context", e);
      }
    }
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (isHidden) return null;

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Add loading bot message
    const botMsgId = Date.now();
    setMessages((prev) => [...prev, { id: botMsgId, role: 'bot', content: '', loading: true, timestamp: new Date() }]);

    try {
      const response = await askHelper(text, apiContextData);
      let answerText = response?.answer;
      
      if (typeof answerText !== 'string') {
        // Fallback if AI hallucinates an object instead of a string
        answerText = JSON.stringify(answerText || response);
      }
      
      setMessages((prev) => prev.map((msg) => 
        msg.id === botMsgId 
          ? { ...msg, loading: false, content: answerText }
          : msg
      ));
    } catch (error) {
      setMessages((prev) => prev.map((msg) => 
        msg.id === botMsgId 
          ? { ...msg, loading: false, content: 'Something went wrong. Please try again.' }
          : msg
      ));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-orange hover:bg-brand-orange-dk shadow-card-hov hover:shadow-pop text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label="Open AI helper for this page"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Expanded panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 z-50 bg-white rounded-t-2xl md:rounded-2xl shadow-pop w-full md:w-[400px] md:bottom-6 md:right-6 max-h-[80vh] flex flex-col overflow-hidden h-[600px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-cream-dk">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-green text-white font-display font-bold text-sm flex items-center justify-center">
                    LQ
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[15px] text-brand-ink leading-tight">LynQbot</h3>
                    {pageContext.subtitle && (
                      <p className="text-xs text-brand-ink-mute">{pageContext.subtitle}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-brand-cream flex items-center justify-center transition"
                >
                  <X size={18} className="text-brand-ink" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 bg-brand-bone flex flex-col gap-4">
                {messages.length === 0 ? (
                  <>
                    <div className="max-w-[85%] bg-white border border-brand-cream-dk rounded-2xl rounded-tl-sm px-4 py-3 font-sans text-[15px] text-brand-ink shadow-card self-start">
                      {pageContext.greeting}
                    </div>
                    {pageContext.chips && pageContext.chips.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {pageContext.chips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(chip)}
                            className="bg-white border border-brand-cream-dk hover:bg-brand-orange hover:text-white hover:border-brand-orange text-brand-ink text-sm font-medium rounded-pill px-4 h-9 flex items-center cursor-pointer transition"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`max-w-[85%] px-4 py-3 font-sans text-[15px] whitespace-pre-wrap leading-relaxed ${
                            isUser 
                              ? 'bg-brand-orange text-white rounded-2xl rounded-tr-sm' 
                              : 'bg-white border border-brand-cream-dk rounded-2xl rounded-tl-sm text-brand-ink shadow-card'
                          }`}
                        >
                          {msg.loading ? (
                            <div className="flex items-center gap-1 h-5">
                              <div className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          ) : (
                            formatMessage(msg.content)
                          )}
                        </div>
                        {msg.timestamp && (
                          <span className="text-[11px] text-brand-ink-mute mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-brand-cream-dk bg-white">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this page…"
                  className="flex-1 h-10 bg-brand-bone border border-brand-cream-dk rounded-pill px-4 font-sans text-[15px] focus:border-brand-orange focus:shadow-pop outline-none transition"
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-full bg-brand-orange hover:bg-brand-orange-dk text-white flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream-dk"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
