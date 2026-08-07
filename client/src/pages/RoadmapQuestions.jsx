import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Send } from 'lucide-react';
import { generateQuestions, generateWorkflow } from '../services/api';
import { STATES } from '../data/states';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';

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
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
        <ErrorState message="No goal specified. Please start over." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
        <div className="flex justify-center gap-3 mb-8 w-full max-w-2xl">
          <div className="w-2 h-2 rounded-full bg-slate-200" />
          <div className="w-2 h-2 rounded-full bg-slate-200" />
          <div className="w-2 h-2 rounded-full bg-slate-200" />
        </div>
        <Card className="w-full max-w-2xl p-8">
          <Skeleton variant="text" height="32px" style={{ marginBottom: '1.5rem' }} />
          <Skeleton variant="rectangular" height="48px" style={{ marginBottom: '0.75rem' }} />
          <Skeleton variant="rectangular" height="48px" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <ErrorState message="Failed to load questions." onRetry={fetchQuestions} />
        </Card>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600 mb-4 h-10 w-10" />
          <p className="text-xl font-medium text-slate-900">Building your roadmap…</p>
        </Card>
      </div>
    );
  }

  if (submitError) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <ErrorState message="Failed to generate roadmap." onRetry={handleNext} />
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentValue = answers[currentQuestion.id] || '';
  const isSelect = currentQuestion.id === 'state' || currentQuestion.id === 'location';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <div className="flex justify-center gap-3 mb-8 w-full max-w-2xl">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${idx <= currentIndex ? 'bg-emerald-600' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <Card className="w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{currentQuestion.question}</h2>

        <div className="mb-8">
          {isSelect ? (
            <select
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
          ) : (currentQuestion.type === 'radio' || currentQuestion.type === 'single-choice' || currentQuestion.type === 'multi-choice') ? (
            <div className="flex flex-col gap-3">
              {(currentQuestion.options || []).map((opt) => {
                const isSelected = currentValue === opt;
                return (
                  <button
                    key={opt}
                    className={`flex items-center gap-3 p-4 w-full rounded-xl transition-colors text-left ${isSelected ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border border-slate-200 hover:border-emerald-500'}`}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-emerald-600' : 'border-slate-300'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                    </div>
                    <span className="text-base text-slate-900">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="relative flex items-center">
              <input
                type="text"
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                className="absolute right-2 p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50 disabled:text-slate-400 disabled:hover:bg-transparent transition-colors"
                disabled={!currentValue.trim()}
                onClick={handleNext}
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            iconOnly
            icon={ArrowRight}
            onClick={handleNext}
            disabled={!currentValue.trim()}
            className="w-12 h-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
            aria-label="Next"
          />
        </div>
      </Card>
    </div>
  );
}
