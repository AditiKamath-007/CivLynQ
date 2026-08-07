import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Send } from 'lucide-react';
import { generateQuestions, generateWorkflow } from '../services/api';
import { STATES } from '../data/states';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import './RoadmapQuestions.css';

export default function RoadmapQuestions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const goal = searchParams.get('goal');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const fetchQuestions = useCallback(async () => {
    if (!goal) return;
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
  }, [goal]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSelectOption = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit all answers
      setSubmitting(true);
      setSubmitError(false);
      try {
        const res = await generateWorkflow(goal, answers);
        if (res && res.success && res.workflow) {
          const id = `roadmap-${Date.now()}`;
          localStorage.setItem(id, JSON.stringify(res.workflow));
          navigate(`/roadmap/${id}`);
        } else {
          throw new Error('Failed to build roadmap');
        }
      } catch (err) {
        console.error(err);
        setSubmitError(true);
        setSubmitting(false);
      }
    }
  };

  if (!goal) {
    return (
      <div className="roadmap-questions-page">
        <ErrorState message="No goal specified. Please start over." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="roadmap-questions-page">
        <div className="progress-dots-container">
          <div className="progress-dot" />
          <div className="progress-dot" />
          <div className="progress-dot" />
        </div>
        <Card className="question-card">
          <Skeleton variant="text" height="32px" style={{ marginBottom: 'var(--space-6)' }} />
          <Skeleton variant="rectangular" height="48px" style={{ marginBottom: 'var(--space-3)' }} />
          <Skeleton variant="rectangular" height="48px" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-questions-page">
        <Card className="question-card">
          <ErrorState message="Failed to load questions." onRetry={fetchQuestions} />
        </Card>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="roadmap-questions-page">
        <Card className="question-card loading-card">
          <Loader2 className="building-spinner" />
          <p className="text-h2 building-text">Building your roadmap…</p>
        </Card>
      </div>
    );
  }

  if (submitError) {
    return (
      <div className="roadmap-questions-page">
        <Card className="question-card">
          <ErrorState message="Failed to generate roadmap." onRetry={handleNext} />
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentValue = answers[currentQuestion.id] || '';
  const isSelect = currentQuestion.id === 'state' || currentQuestion.id === 'location';

  return (
    <div className="roadmap-questions-page">
      <div className="progress-dots-container">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`progress-dot ${idx <= currentIndex ? 'completed' : ''}`}
          />
        ))}
      </div>

      <Card className="question-card">
        <h2 className="text-h2 question-text">{currentQuestion.question}</h2>

        <div className="question-options">
          {isSelect ? (
            <select
              className="question-select"
              value={currentValue}
              onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
            >
              <option value="" disabled>
                Select an option
              </option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          ) : (currentQuestion.options && currentQuestion.options.length > 0) || ['single-choice', 'multi-choice', 'radio'].includes(currentQuestion.type) ? (
            <div className="radio-group">
              {(currentQuestion.options || []).map((opt) => {
                const isSelected = currentValue === opt;
                return (
                  <button
                    key={opt}
                    className={`radio-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                  >
                    <div className="radio-circle">
                      {isSelected && <div className="radio-circle-inner" />}
                    </div>
                    <span className="text-body">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="input-wrapper">
              <input
                type="text"
                className="question-input"
                placeholder="Type your answer here..."
                value={currentValue}
                onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentValue.trim()) {
                    handleNext();
                  }
                }}
              />
              <button
                className="input-send-btn"
                disabled={!currentValue.trim()}
                onClick={handleNext}
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="question-actions">
          <Button
            variant="primary"
            iconOnly
            icon={ArrowRight}
            onClick={handleNext}
            disabled={!currentValue.trim()}
            className="next-btn"
            aria-label="Next"
          />
        </div>
      </Card>
    </div>
  );
}
