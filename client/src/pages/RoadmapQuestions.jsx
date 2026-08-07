import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Loader2, AlertCircle, RefreshCw, Check, Sparkles } from 'lucide-react';
import { generateQuestions, generateWorkflow } from '../services/api';

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
        localStorage.setItem(id, JSON.stringify(res.workflow));
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

  // Check if all required questions are answered
  let answeredCount = 0;
  let requiredCount = 0;
  let allRequiredAnswered = true;

  questions.forEach((q) => {
    const isRequired = q.required === true;
    if (isRequired) requiredCount++;
    
    const ans = answers[q.id];
    let hasAnswer = false;
    
    if (Array.isArray(ans)) {
      hasAnswer = ans.length > 0;
    } else {
      hasAnswer = ans !== undefined && ans !== null && String(ans).trim() !== '';
    }

    if (hasAnswer && isRequired) {
      answeredCount++;
    } else if (hasAnswer && !isRequired) {
      // Just for progress tracking if we count optionals
      answeredCount++;
    }

    if (isRequired && !hasAnswer) {
      allRequiredAnswered = false;
    }
  });

  // If there are no explicitly required questions, we might just require all of them for safety, 
  // or rely on explicit 'required: true' flag. The prompt says: "iterate questions, for each `required: true` question, verify `answers[question.id]` is non-empty".
  // Let's also count total questions for the progress text.
  const progressText = `${Object.keys(answers).filter(k => {
    const a = answers[k];
    return Array.isArray(a) ? a.length > 0 : String(a).trim() !== '';
  }).length} of ${questions.length} answered`;


  if (!rawGoal) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <div className="bg-white rounded-2xl border border-brand-cream-dk shadow-card p-8 text-center max-w-md mx-auto">
          <AlertCircle size={48} className="text-brand-orange-dk mx-auto" />
          <h2 className="font-display font-semibold text-xl text-brand-ink mt-4">No goal specified.</h2>
          <p className="text-sm text-brand-ink-mute mt-2">Please return to the dashboard and start over.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full md:max-w-3xl mx-auto px-4 md:px-6 py-10 pb-20">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-brand-ink-mute hover:text-brand-orange transition font-sans text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-ink mt-2">
          Let's personalize your journey.
        </h1>
        <div className="inline-flex items-center gap-2 bg-brand-cream border border-brand-cream-dk text-brand-ink-mute text-sm font-sans px-4 py-1.5 rounded-pill mt-3">
          <Target size={14} />
          {goal}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-brand-orange mb-4" />
          <p className="text-sm text-brand-ink-mute font-sans">Generating your questions…</p>
        </div>
      ) : error ? (
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
      ) : (
        <>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const val = answers[q.id];
              const isMulti = q.inputType === 'multiselect' || q.inputType === 'documents';

              return (
                <div key={q.id} className="bg-white rounded-card border border-brand-cream-dk shadow-card p-4 md:p-6 hover:shadow-card-hov transition-all duration-200">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-orange-lt text-brand-orange font-display font-semibold flex items-center justify-center text-sm flex-shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg text-brand-ink">
                        {q.question}
                        {q.required && <span className="text-red-500 ml-1">*</span>}
                      </h3>
                      {(q.helper || q.description) && (
                        <p className="text-sm text-brand-ink-mute mt-1 font-sans">{q.helper || q.description}</p>
                      )}

                      <div className="mt-4">
                        {q.inputType === 'documents' && q.documents ? (
                          <div className="space-y-2">
                            {q.documents.map((doc) => {
                              const selectedArr = Array.isArray(val) ? val : [];
                              const isSelected = selectedArr.includes(doc.id);
                              return (
                                <div 
                                  key={doc.id}
                                  onClick={() => handleSelectOption(q.id, doc.id, true)}
                                  className="flex items-center gap-3 px-4 py-3 bg-brand-bone border border-brand-cream-dk rounded-lg cursor-pointer hover:bg-brand-cream transition"
                                >
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-brand-green-accent border-brand-green-accent' : 'border-brand-cream-dk'}`}>
                                    {isSelected && <Check size={14} className="text-white" />}
                                  </div>
                                  <span className="font-sans text-[15px] text-brand-ink flex-1">{doc.name}</span>
                                  {doc.required && (
                                    <span className="bg-red-50 text-red-600 text-[11px] font-medium px-2 py-0.5 rounded-pill ml-auto">
                                      Required
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : q.options && q.options.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {q.options.map((opt) => {
                              const isSelected = isMulti 
                                ? (Array.isArray(val) && val.includes(opt))
                                : val === opt;
                              
                              return (
                                <div 
                                  key={opt}
                                  onClick={() => handleSelectOption(q.id, opt, isMulti)}
                                  className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg border font-sans text-[15px] transition cursor-pointer ${
                                    isSelected 
                                      ? 'bg-brand-orange text-white border-brand-orange font-medium shadow-card' 
                                      : 'bg-brand-bone border-brand-cream-dk hover:bg-brand-orange-lt hover:border-brand-orange text-brand-ink'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isSelected && <Check size={16} />}
                                </div>
                              );
                            })}
                          </div>
                        ) : q.inputType === 'textarea' ? (
                          <textarea
                            className="w-full h-28 resize-none bg-white border border-brand-cream-dk rounded-lg p-3 font-sans text-[15px] focus:border-brand-orange focus:shadow-pop outline-none transition"
                            placeholder={q.placeholder || "Provide details…"}
                            value={val || ''}
                            onChange={(e) => handleTextChange(q.id, e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            className="w-full h-11 bg-white border border-brand-cream-dk rounded-lg px-3 font-sans text-[15px] focus:border-brand-orange focus:shadow-pop outline-none transition"
                            placeholder={q.placeholder || "Type your answer…"}
                            value={val || ''}
                            onChange={(e) => handleTextChange(q.id, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-brand-bone/95 backdrop-blur-sm border-t border-brand-cream-dk py-4 -mx-4 md:-mx-6 px-4 md:px-6 mt-8 flex items-center justify-between z-10">
            <span className="text-sm text-brand-ink-mute font-sans">{progressText}</span>
            <button
              onClick={handleSubmit}
              disabled={!allRequiredAnswered || submitting}
              className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card hover:shadow-card-hov flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {submitting ? 'Generating...' : 'Generate Roadmap'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
