import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, User, Users, Wallet } from 'lucide-react';

export default function EligibilityCalculator({ isOpen, onClose, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({ age: '', gender: '', category: '', income: '' });

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setAnswers({ age: '', gender: '', category: '', income: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentIndex < 3) setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleComplete = () => {
    onComplete(answers);
  };

  const isCurrentQuestionAnswered = () => {
    if (currentIndex === 0) return !!answers.age;
    if (currentIndex === 1) return !!answers.gender;
    if (currentIndex === 2) return !!answers.category;
    if (currentIndex === 3) return !!answers.income;
    return false;
  };

  // Options for single-choice questions
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  const categoryOptions = [
    { value: 'General', label: 'General' },
    { value: 'OBC', label: 'OBC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' },
    { value: 'EWS', label: 'EWS' }
  ];

  const incomeOptions = [
    { value: 'below-1l', label: 'Below ₹1 Lakh' },
    { value: '1-3l', label: '₹1–3 Lakhs' },
    { value: '3-5l', label: '₹3–5 Lakhs' },
    { value: '5-10l', label: '₹5–10 Lakhs' },
    { value: 'above-10l', label: 'Above ₹10 Lakhs' }
  ];

  const renderSingleChoice = (options, valueKey, Icon) => {
    return (
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = answers[valueKey] === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => setAnswers({ ...answers, [valueKey]: opt.value })}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-brand-orange bg-brand-orange-lt dark:bg-brand-dark-accent-orange/15 shadow-pop' 
                  : 'border-brand-cream-dk dark:border-brand-dark-border bg-white dark:bg-brand-dark-card hover:border-brand-orange-lt dark:hover:border-brand-orange'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-brand-orange' : 'border-brand-cream-dk dark:border-brand-dark-border'
                }`}>
                  {isSelected && (
                    <motion.span 
                      layoutId={`dot-${valueKey}`}
                      className="w-2.5 h-2.5 rounded-full bg-brand-orange"
                    />
                  )}
                </div>
                <span className="font-sans font-medium text-brand-ink dark:text-brand-dark-ink">
                  {opt.label}
                </span>
              </div>
              {Icon && <Icon size={18} className="text-brand-ink-mute dark:text-brand-dark-ink-mute" />}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCurrentQuestion = () => {
    switch (currentIndex) {
      case 0:
        return (
          <div className="flex flex-col">
            <label className="block font-display font-bold text-xl text-brand-ink dark:text-brand-dark-ink mb-4">
              How old are you?
            </label>
            <input 
              type="number" 
              min={0}
              max={120}
              placeholder="25"
              value={answers.age}
              onChange={(e) => setAnswers({ ...answers, age: e.target.value })}
              className="w-full h-14 bg-white dark:bg-brand-dark-card border-2 border-brand-cream-dk dark:border-brand-dark-border focus:border-brand-orange rounded-xl px-4 font-display font-semibold text-2xl text-brand-ink dark:text-brand-dark-ink text-center outline-none transition focus:shadow-pop"
            />
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col">
            <label className="block font-display font-bold text-xl text-brand-ink dark:text-brand-dark-ink mb-4">
              What is your gender?
            </label>
            {renderSingleChoice(genderOptions, 'gender', User)}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col">
            <label className="block font-display font-bold text-xl text-brand-ink dark:text-brand-dark-ink mb-4">
              Which social category do you belong to?
            </label>
            {renderSingleChoice(categoryOptions, 'category', Users)}
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col">
            <label className="block font-display font-bold text-xl text-brand-ink dark:text-brand-dark-ink mb-4">
              What is your annual household income?
            </label>
            {renderSingleChoice(incomeOptions, 'income', Wallet)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-pop max-w-lg w-full p-0 overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* HEADER */}
        <div className="bg-gradient-to-br from-brand-orange to-brand-orange-dk p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mt-4">
            Eligibility Calculator
          </h2>
          <p className="text-sm text-white/85 mt-1">
            Answer 4 quick questions to find schemes you qualify for.
          </p>
        </div>

        {/* PROGRESS DOTS */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex gap-2 w-full">
            {[0, 1, 2, 3].map((step) => {
              let dotBg = 'bg-brand-cream-dk dark:bg-brand-dark-border';
              if (step < currentIndex) dotBg = 'bg-brand-green-accent dark:bg-brand-green-accent-dark';
              else if (step === currentIndex) dotBg = 'bg-brand-orange';

              return (
                <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${dotBg}`} />
              );
            })}
          </div>
          <p className="text-xs font-sans text-brand-ink-mute dark:text-brand-dark-ink-mute mt-2 text-center">
            Step {currentIndex + 1} of 4
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 flex-1 overflow-y-auto min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {renderCurrentQuestion()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-brand-cream-dk dark:border-brand-dark-border flex items-center justify-between">
          <div className="flex-1">
            {currentIndex > 0 && (
              <button 
                onClick={handleBack}
                className="h-11 px-6 rounded-xl font-semibold text-brand-ink dark:text-brand-dark-ink hover:bg-brand-cream dark:hover:bg-brand-dark-border transition"
              >
                Back
              </button>
            )}
          </div>
          
          <div className="flex-1 flex justify-end">
            {currentIndex < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered()}
                className="h-11 px-8 rounded-xl font-semibold bg-brand-orange hover:bg-brand-orange-dk text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-card"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!isCurrentQuestionAnswered()}
                className="h-11 px-6 rounded-xl font-semibold bg-gradient-to-r from-brand-orange to-brand-orange-dk text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-card whitespace-nowrap"
              >
                Find My Schemes
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
