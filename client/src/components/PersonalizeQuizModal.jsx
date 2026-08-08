import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wallet, IdCard, Briefcase, Heart, 
  Wheat, GraduationCap, Building2, Store, User, 
  Zap, Clock, Search, ChevronLeft, ChevronRight, X 
} from 'lucide-react';

const ICON_MAP = {
  Wallet, IdCard, Briefcase, Heart, Wheat, GraduationCap, 
  Building2, Store, User, Zap, Clock, Search
};

const quizQuestions = [
  {
    id: 'category',
    question: 'What kind of support are you looking for?',
    options: [
      { value: 'financial', label: 'Financial support', icon: 'Wallet' },
      { value: 'identity', label: 'Identity documents', icon: 'IdCard' },
      { value: 'business', label: 'Business setup', icon: 'Briefcase' },
      { value: 'health', label: 'Health & welfare', icon: 'Heart' },
    ],
  },
  {
    id: 'occupation',
    question: 'What best describes you?',
    options: [
      { value: 'farmer', label: 'Farmer', icon: 'Wheat' },
      { value: 'student', label: 'Student', icon: 'GraduationCap' },
      { value: 'business', label: 'Business owner', icon: 'Building2' },
      { value: 'salaried', label: 'Salaried employee', icon: 'Briefcase' },
      { value: 'self-employed', label: 'Self-employed', icon: 'Store' },
      { value: 'other', label: 'Other', icon: 'User' },
    ],
  },
  {
    id: 'urgency',
    question: 'How soon do you need this?',
    options: [
      { value: 'urgent', label: 'Within a week', icon: 'Zap' },
      { value: 'soon', label: 'Within a month', icon: 'Clock' },
      { value: 'exploring', label: 'Just exploring', icon: 'Search' },
    ],
  },
];

export default function PersonalizeQuizModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentIndex(0);
    setAnswers({});
    onClose();
  };

  const currentQuestion = quizQuestions[currentIndex];
  const hasAnsweredCurrent = !!answers[currentQuestion.id];

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    let recommendedSchemes = [];
    if (answers.category === 'financial') recommendedSchemes.push('PAN', 'GST', 'Income Tax');
    if (answers.category === 'business') recommendedSchemes.push('Company Registration', 'Shop Act');
    if (answers.occupation === 'farmer') recommendedSchemes.push('PM-KISAN', 'KCC');
    if (answers.occupation === 'student') recommendedSchemes.push('National Scholarship', 'Education Loan');
    if (answers.urgency === 'urgent') recommendedSchemes.push('Tatkal Passport');
    
    // 🤖 AI INTEGRATION POINT: teammate replaces with real filter logic or AI-driven recommendations.
    
    const count = Math.max(recommendedSchemes.length, 3);
    alert(`Showing ${count} schemes for you.`);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-pop max-w-lg w-full p-6 md:p-8 relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-brand-cream dark:hover:bg-brand-dark-card-hover flex items-center justify-center transition"
        >
          <X size={18} className="text-brand-ink dark:text-brand-dark-ink" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dk flex items-center justify-center shadow-card">
          <Sparkles size={26} className="text-white" />
        </div>
        
        <h2 className="font-display font-bold text-2xl text-brand-ink dark:text-brand-dark-ink mt-5">
          Find schemes for you
        </h2>
        <p className="text-sm text-brand-ink-mute dark:text-brand-dark-ink-mute mt-2 leading-relaxed">
          Answer 3 quick questions and we'll show the most relevant schemes.
        </p>

        <div className="mt-6 mb-6">
          <div className="flex items-center gap-2">
            {quizQuestions.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx < currentIndex 
                    ? 'bg-brand-green-accent dark:bg-brand-green-accent-dark' 
                    : idx === currentIndex 
                      ? 'bg-brand-orange' 
                      : 'bg-brand-cream-dk dark:bg-brand-dark-border'
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-sans text-brand-ink-mute dark:text-brand-dark-ink-mute mt-2">
            Step {currentIndex + 1} of 3
          </p>
        </div>

        <div className="bg-brand-bone dark:bg-brand-dark-tint rounded-card border border-brand-cream-dk dark:border-brand-dark-border p-5 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="font-display font-semibold text-lg text-brand-ink dark:text-brand-dark-ink leading-snug">
                  {currentQuestion.question}
                </h3>
                <div className="flex flex-col gap-2 mt-4">
                  {currentQuestion.options.map(option => {
                    const isSelected = answers[currentQuestion.id] === option.value;
                    const Icon = ICON_MAP[option.icon];
                    return (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(currentQuestion.id, option.value)}
                        className={`w-full text-left bg-white dark:bg-brand-dark-card border rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 font-sans text-[15px] text-brand-ink dark:text-brand-dark-ink ${
                          isSelected 
                            ? 'border-brand-orange bg-brand-orange-lt dark:bg-brand-dark-card-hover' 
                            : 'border-brand-cream-dk dark:border-brand-dark-border hover:border-brand-orange hover:bg-brand-orange-lt dark:hover:bg-brand-dark-card-hover'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? 'border-brand-orange' : 'border-brand-cream-dk dark:border-brand-dark-border'
                        }`}>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-2.5 h-2.5 rounded-full bg-brand-orange"
                            />
                          )}
                        </div>
                        <span className="flex-1 font-sans text-[15px]">{option.label}</span>
                        {Icon && <Icon size={18} className="text-brand-ink-mute dark:text-brand-dark-ink-mute" />}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-6 pt-5 border-t border-brand-cream-dk dark:border-brand-dark-border">
          {currentIndex > 0 ? (
            <button
              onClick={handleBack}
              className="h-11 px-5 rounded-pill border border-brand-cream-dk dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-brand-ink dark:text-brand-dark-ink hover:bg-brand-cream dark:hover:bg-brand-dark-card-hover font-medium font-sans flex items-center gap-2 transition"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentIndex < quizQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card hover:shadow-card-hov flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream-dk"
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!hasAnsweredCurrent}
              className="bg-gradient-to-r from-brand-orange to-brand-orange-dk hover:to-brand-orange text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card hover:shadow-card-hov flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream-dk"
            >
              Get Recommendations
              <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
