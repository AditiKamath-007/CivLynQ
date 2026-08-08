import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Loader2, AlertCircle, RefreshCw, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateQuestions, generateWorkflow } from '../services/api';
import TypeaheadSelect from '../components/TypeaheadSelect';
import { indianStates } from '../lib/indianStates';

export default function RoadmapQuestions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawGoal = searchParams.get('goal');
  const goal = rawGoal ? decodeURIComponent(rawGoal) : 'your goal';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchQuestions = useCallback(async () => {
    if (!rawGoal) return;
    setLoading(true);
    setError(false);
    try {
      const res = await generateQuestions(goal);
      if (res && res.success && res.questions) {
        setQuestions(res.questions);
      } else {
        throw new Error('Failed to load questions');
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [rawGoal, goal]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSelectOption = (questionId, value, isMulti = false) => {
    if (isMulti) {
      setAnswers((prev) => {
        const currentArr = prev[questionId] || [];
        if (currentArr.includes(value)) {
          return { ...prev, [questionId]: currentArr.filter((v) => v !== value) };
        } else {
          return { ...prev, [questionId]: [...currentArr, value] };
        }
      });
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleTextChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await generateWorkflow(goal, answers);
      if (res && res.success && res.workflow) {
        const id = `roadmap-${Date.now()}`;
        const workflowData = { ...res.workflow, goal };
        localStorage.setItem(id, JSON.stringify(workflowData));
        navigate(`/roadmap/${id}`);
      } else {
        throw new Error('Failed to build roadmap');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!rawGoal) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-brand-cream-dk shadow-card p-8 text-center max-w-md mx-auto">
          <AlertCircle size={48} className="text-brand-orange-dk mx-auto" />
          <h2 className="font-display font-semibold text-xl text-brand-ink mt-4">No goal specified.</h2>
          <p className="text-sm text-brand-ink-mute mt-2">Please return to the dashboard and start over.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-brand-orange mb-4" />
          <p className="text-sm text-brand-ink-mute font-sans">Generating your questions…</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-brand-cream-dk shadow-card p-8 text-center max-w-md mx-auto">
          <AlertCircle size={48} className="text-brand-orange-dk mx-auto" />
          <h2 className="font-display font-semibold text-xl text-brand-ink mt-4">Couldn't generate questions.</h2>
          <p className="text-sm text-brand-ink-mute mt-2">We had trouble reaching the AI. Check your connection and try again.</p>
          <button 
            onClick={fetchQuestions}
            className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-5 h-10 rounded-pill mt-6 flex items-center gap-2 mx-auto transition"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const qType = currentQuestion.type || currentQuestion.inputType;
  const isMulti = qType === 'multi-choice' || qType === 'multiselect' || qType === 'documents';
  const val = answers[currentQuestion.id];
  const selectedArr = Array.isArray(val) ? val : [];

  const isRequired = currentQuestion.required !== false; 
  let hasAnswer = false;
  if (Array.isArray(val)) {
    hasAnswer = val.length > 0;
  } else {
    hasAnswer = val !== undefined && val !== null && String(val).trim() !== '';
  }
  const isNextDisabled = (currentQuestion.required === true || isRequired) && !hasAnswer;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Top section */}
      <div>
        {currentIndex === 0 && (
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-brand-ink-mute hover:text-brand-orange font-sans transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        <h1 className="font-display font-bold text-3xl text-brand-ink mt-2">
          Let's personalize your journey.
        </h1>
        <div className="inline-flex items-center gap-2 bg-brand-cream border border-brand-cream-dk text-brand-ink-mute text-sm font-sans px-4 py-1.5 rounded-pill mt-3">
          <Target size={14} />
          {goal}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-sans text-brand-ink-mute">
            {`Question ${currentIndex + 1} of ${questions.length}`}
          </span>
          <span className="text-sm font-display font-semibold text-brand-orange">
            {`${Math.round(((currentIndex + 1) / questions.length) * 100)}%`}
          </span>
        </div>
        <div className="h-1.5 w-full bg-brand-cream-dk rounded-pill overflow-hidden mt-2 mb-8">
          <div 
            className="h-full bg-brand-orange rounded-pill transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Single question card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white dark:bg-brand-dark-card rounded-card border border-brand-cream-dk dark:border-brand-dark-border shadow-card hover:shadow-card-hov transition-all duration-200 p-6 mb-4 min-h-[400px] flex flex-col"
      >
        <div className="w-9 h-9 rounded-full bg-brand-orange-lt dark:bg-brand-dark-accent-orange/20 text-brand-orange dark:text-brand-dark-accent-orange font-display font-bold flex items-center justify-center text-sm flex-shrink-0">
          {currentIndex + 1}
        </div>
        
        <h2 className="font-display font-semibold text-lg text-brand-ink dark:text-brand-dark-ink mt-4 leading-snug">
          {currentQuestion.question}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </h2>
        
        {(currentQuestion.helper || currentQuestion.description) && (
          <p className="text-sm text-brand-ink-mute dark:text-brand-dark-ink-mute mt-2 font-sans leading-relaxed">
            {currentQuestion.helper || currentQuestion.description}
          </p>
        )}

        <div className="mt-6 flex-1">
          {/* Documents type */}
          {(qType === 'documents' || currentQuestion.documents) ? (
            <div>
              {(currentQuestion.documents || []).map((doc) => {
                const isSelected = selectedArr.includes(doc.id);
                return (
                  <div
                    key={doc.id || doc.name}
                    onClick={() => handleSelectOption(currentQuestion.id, doc.id, true)}
                    className={`flex items-center gap-3 px-4 py-3 border rounded-lg mb-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-brand-green-accent dark:bg-brand-green-accent-dark/10 dark:bg-brand-dark-accent-green/15 border-brand-green-accent dark:border-brand-green-accent-dark' 
                        : 'bg-white dark:bg-brand-dark-card border-brand-cream-dk dark:border-brand-dark-border hover:bg-brand-cream dark:hover:bg-brand-dark-card-hover'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected ? 'bg-brand-green-accent dark:bg-brand-green-accent-dark border-brand-green-accent dark:border-brand-green-accent-dark' : 'border-brand-cream-dk dark:border-brand-dark-border'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </span>
                    <span className="flex-1 font-sans text-[15px] text-brand-ink dark:text-brand-dark-ink">{doc.name}</span>
                    {doc.required && (
                      <span className="bg-red-50 text-red-600 text-[11px] font-medium px-2 py-0.5 rounded-pill">Required</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : /* Multi-choice type */
          (qType === 'multi-choice' || qType === 'multiselect') && currentQuestion.options ? (
            <div>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedArr.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, opt, true)}
                    className={`w-full text-left border rounded-lg px-4 py-3 mb-2 cursor-pointer transition-all duration-200 flex items-center gap-3 font-sans text-[15px] ${
                      isSelected
                        ? 'border-brand-green-accent dark:border-brand-green-accent-dark bg-brand-green-accent dark:bg-brand-green-accent-dark/10 dark:bg-brand-dark-accent-green/15 text-brand-ink dark:text-brand-dark-ink shadow-card'
                        : 'bg-white dark:bg-brand-dark-card border-brand-cream-dk dark:border-brand-dark-border text-brand-ink dark:text-brand-dark-ink hover:border-brand-orange hover:bg-brand-orange-lt dark:hover:bg-brand-dark-card-hover'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-brand-green-accent dark:bg-brand-green-accent-dark border-brand-green-accent dark:border-brand-green-accent-dark' 
                        : 'border-brand-cream-dk dark:border-brand-dark-border'
                    }`}>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <Check size={14} className="text-white" />
                        </motion.span>
                      )}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : /* Single-choice type */
          (qType === 'single-choice' || qType === 'radio' || (qType === 'select' && currentQuestion.options)) && currentQuestion.options ? (
            <div>
              {currentQuestion.options.map((opt) => {
                const isSelected = val === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, opt, false)}
                    className={`w-full text-left border rounded-lg px-4 py-3 mb-2 cursor-pointer transition-all duration-200 flex items-center gap-3 font-sans text-[15px] ${
                      isSelected
                        ? 'border-brand-orange bg-brand-orange-lt dark:bg-brand-dark-accent-orange/15 text-brand-ink dark:text-brand-dark-ink shadow-card'
                        : 'bg-white dark:bg-brand-dark-card border-brand-cream-dk dark:border-brand-dark-border text-brand-ink dark:text-brand-dark-ink hover:border-brand-orange hover:bg-brand-orange-lt dark:hover:bg-brand-dark-card-hover'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected ? 'border-brand-orange' : 'border-brand-cream-dk dark:border-brand-dark-border'
                    }`}>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="w-2.5 h-2.5 rounded-full bg-brand-orange"
                        />
                      )}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isSelected && <Check size={18} className="text-brand-orange flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : /* Textarea type */
          qType === 'textarea' ? (
            <textarea
              className="w-full h-28 bg-white dark:bg-brand-dark-card border border-brand-cream-dk dark:border-brand-dark-border rounded-lg px-3 py-2 mt-3 font-sans text-[15px] text-brand-ink dark:text-brand-dark-ink placeholder:text-brand-ink-mute dark:placeholder:text-brand-dark-ink-mute focus:border-brand-orange focus:shadow-pop outline-none transition resize-none"
              placeholder={currentQuestion.placeholder || "Type your answer…"}
              value={val || ''}
              onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
            />
          ) : /* Text type (default) */ 
          (currentQuestion.question.toLowerCase().includes('state') || currentQuestion.question.toLowerCase().includes('location') || currentQuestion.id.toLowerCase().includes('state')) ? (
            <div className="mt-2">
              <TypeaheadSelect
                value={val || ''}
                onChange={(value) => handleTextChange(currentQuestion.id, value)}
                options={indianStates}
                required={isRequired}
                placeholder="Select your state…"
              />
            </div>
          ) : (
            <input
              type="text"
              className="w-full h-11 bg-white dark:bg-brand-dark-card border border-brand-cream-dk dark:border-brand-dark-border rounded-lg px-3 mt-3 font-sans text-[15px] text-brand-ink dark:text-brand-dark-ink placeholder:text-brand-ink-mute dark:placeholder:text-brand-dark-ink-mute focus:border-brand-orange focus:shadow-pop outline-none transition"
              placeholder={currentQuestion.placeholder || "Type your answer…"}
              value={val || ''}
              onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-cream-dk">
          {currentIndex > 0 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="h-11 px-5 rounded-pill border border-brand-cream-dk bg-white text-brand-ink hover:bg-brand-cream font-medium font-sans flex items-center gap-2 transition"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>
          ) : <div />}

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={isNextDisabled}
              className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card hover:shadow-card-hov flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream-dk"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isNextDisabled || submitting}
              className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card hover:shadow-card-hov flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream-dk"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {submitting ? <span>Generating...</span> : <span>Generate Roadmap</span>}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
