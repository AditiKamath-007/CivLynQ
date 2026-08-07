import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Check, ExternalLink, PenTool, Shield, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toArray } from '../utils/toArray';
import { draftDocument, checkConsent, saveConsent, saveUserDraft } from '../services/api';
import DraftModal from '../components/ui/DraftModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import CompletionModal from '../components/ui/CompletionModal';
import { useAuth } from '../context/AuthContext';

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

  const { currentUser } = useAuth();

  // Modals state
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  // Draft modal state
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // AI Drafter consent state
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasConsented, setHasConsented] = useState(null);
  const [pendingDraftTask, setPendingDraftTask] = useState(null);

  useEffect(() => {
    if (currentUser) {
      checkConsent()
        .then(res => {
          if (res.success) {
            setHasConsented(res.consented);
          }
        })
        .catch(err => console.error('Error checking consent:', err));
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      let data = localStorage.getItem(id);
      if (!data && !id.startsWith('roadmap-')) {
        data = localStorage.getItem(`roadmap-${id}`);
      }
      if (data) {
        setWorkflow(JSON.parse(data));
      } else {
        setError(true);
      }

      // Load saved completed steps
      const compKey = id.startsWith('roadmap-') ? `completed-${id}` : `completed-roadmap-${id}`;
      const savedComp = localStorage.getItem(compKey) || localStorage.getItem(`completed-${id}`);
      let parsedComp = {};
      if (savedComp) {
        parsedComp = JSON.parse(savedComp);
        setCompletedSteps(parsedComp);
      }
      
      // Auto-advance to first incomplete step
      if (data) {
        const parsedData = JSON.parse(data);
        if (parsedData.steps) {
          const firstIncomplete = parsedData.steps.findIndex((_, idx) => !parsedComp[idx]);
          if (firstIncomplete > 0) {
            setCurrentStepIdx(firstIncomplete);
          }
        }
      }

      // Load saved checked items
      const checkedKey = `checked-${id}`;
      const savedChecked = localStorage.getItem(checkedKey);
      if (savedChecked) {
        setCheckedItems(JSON.parse(savedChecked));
      }

    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const toggleCheck = (key) => {
    setCheckedItems(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`checked-${id}`, JSON.stringify(next));
      return next;
    });
  };

  const markStepCompleteAndContinue = () => {
    setCompletedSteps(prev => {
      const next = { ...prev, [currentStepIdx]: true };
      const compKey = id.startsWith('roadmap-') ? `completed-${id}` : `completed-roadmap-${id}`;
      localStorage.setItem(compKey, JSON.stringify(next));
      return next;
    });
    
    if (workflow && currentStepIdx < workflow.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleFinishJourney = () => {
    // Mark journey completed
    try {
      let dataStr = localStorage.getItem(id);
      if (!dataStr && !id.startsWith('roadmap-')) {
        dataStr = localStorage.getItem(`roadmap-${id}`);
      }
      if (dataStr) {
        const data = JSON.parse(dataStr);
        data.status = 'completed';
        data.completedAt = Date.now();
        localStorage.setItem(id.startsWith('roadmap-') ? id : `roadmap-${id}`, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
    setCompletionModalOpen(true);
  };

  const executeDraft = async (taskStr) => {
    setDraftTitle(taskStr);
    setDraftContent('');
    setDraftLoading(true);
    setDraftSaved(false);
    setDraftModalOpen(true);
    try {
      const res = await draftDocument(taskStr, {}, workflow?.goal || workflow?.title || 'Civic Process');
      if (res && res.draft) {
        setDraftContent(res.draft);
      } else {
        setDraftContent('Failed to generate document draft.');
      }
    } catch (err) {
      console.error(err);
      setDraftContent('Error connecting to draft generation service.');
    } finally {
      setDraftLoading(false);
    }
  };

  const handleDraftClick = async (taskStr) => {
    if (!currentUser) {
      navigate('/signup');
      return;
    }
    if (hasConsented) {
      await executeDraft(taskStr);
    } else {
      setPendingDraftTask(taskStr);
      setShowConsentModal(true);
    }
  };

  const handleGrantConsent = async () => {
    try {
      setShowConsentModal(false);
      // Wait a moment then redirect to profile for toggling permissions
      navigate('/profile');
    } catch (error) {
      console.error('Failed to grant consent:', error);
    }
  };

  const handleSaveDraft = async () => {
    if (!draftContent || draftLoading) return;
    setIsSavingDraft(true);
    try {
      const res = await saveUserDraft({
        title: draftTitle,
        templateType: draftTitle,
        content: draftContent,
        goal: workflow?.goal || workflow?.title || ''
      });
      if (res.success) {
        setDraftSaved(true);
        setTimeout(() => {
          setDraftModalOpen(false);
        }, 1500);
      } else {
        alert('Failed to save draft.');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft: ' + error.message);
    } finally {
      setIsSavingDraft(false);
    }
  };

  if (loading) {
    return <div className="bg-brand-bone min-h-screen flex items-center justify-center font-sans text-brand-ink-mute">Loading...</div>;
  }

  if (error || !workflow) {
    return (
      <div className="bg-brand-bone min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-brand-ink mb-4">Roadmap not found</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-brand-orange hover:bg-brand-orange-dk text-white rounded-pill font-semibold shadow-card transition"
          >
            Go Dashboard
          </button>
        </div>
      </div>
    );
  }

  const steps = workflow.steps || [];
  const currentStep = steps[currentStepIdx] || {};
  const totalSteps = steps.length;
  const completedCount = Object.keys(completedSteps).filter(k => completedSteps[k]).length;
  const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  const docs = toArray(currentStep.requiredDocuments || currentStep.documents);
  const subTasks = toArray(currentStep.subTasks);
  const time = currentStep.estimatedDays || currentStep.estimatedTime || currentStep.duration;
  const mistakes = toArray(currentStep.mistakes);
  const officialUrl = currentStep.officialLink || currentStep.link || currentStep.url;

  // Determine completion logic
  let hasRequiredItems = false;
  let allRequiredChecked = true;

  // Check subtasks
  subTasks.forEach((task, idx) => {
    const isReq = typeof task === 'object' ? task.required : false;
    if (isReq) {
      hasRequiredItems = true;
      if (!checkedItems[`task_${currentStepIdx}_${idx}`]) {
        allRequiredChecked = false;
      }
    }
  });

  // Check documents
  docs.forEach((doc, idx) => {
    const isReq = typeof doc === 'object' ? doc.required : true; // Usually docs are required if listed as requiredDocuments
    if (isReq) {
      hasRequiredItems = true;
      if (!checkedItems[`doc_${currentStepIdx}_${idx}`]) {
        allRequiredChecked = false;
      }
    }
  });

  const isStepComplete = hasRequiredItems ? allRequiredChecked : completedSteps[currentStepIdx];

  return (
    <div className="bg-brand-bone min-h-screen">
      <div className="max-w-full md:max-w-4xl mx-auto px-4 md:px-6 py-8">
        
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm text-brand-ink-mute hover:text-brand-orange font-sans transition"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <button
            onClick={() => setExitModalOpen(true)}
            className="h-10 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink-mute hover:bg-brand-cream hover:text-brand-ink font-medium text-sm flex items-center gap-2 transition"
          >
            <X size={16} /> Exit Journey
          </button>
        </div>

        <h1 className="font-display font-bold text-3xl text-brand-ink mb-6">
          {workflow.goal || workflow.title}
        </h1>

        {/* Progress section */}
        <div className="bg-white rounded-2xl border border-brand-cream-dk shadow-card p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-sans text-brand-ink-mute">Step {currentStepIdx + 1} of {totalSteps}</span>
            <span className="font-display font-semibold text-brand-orange">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full bg-brand-cream-dk rounded-pill overflow-hidden">
            <div 
              className="h-full bg-brand-orange rounded-pill transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Current step card */}
        <div className="bg-white rounded-2xl border border-brand-cream-dk shadow-card p-5 md:p-8 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-orange-lt text-brand-orange font-display font-bold flex items-center justify-center text-base">
            {currentStepIdx + 1}
          </div>
          
          <h2 className="font-display font-bold text-2xl text-brand-ink mt-4">{currentStep.title}</h2>
          
          {currentStep.description && (
            <p className="text-base text-brand-ink-mute mt-3 leading-relaxed font-sans">
              {currentStep.description}
            </p>
          )}

          {time && (
            <div className="inline-flex items-center gap-1.5 bg-brand-cream border border-brand-cream-dk text-brand-ink-mute text-xs font-medium px-3 py-1 rounded-pill mt-3">
              <Clock size={12} />
              Estimated {time}
            </div>
          )}

          {/* Sub-tasks checklist */}
          {subTasks.length > 0 && (
            <>
              <h3 className="text-sm font-display font-semibold text-brand-ink uppercase tracking-wide mt-6 mb-3">Sub-tasks</h3>
              <div className="space-y-2">
                {subTasks.map((task, idx) => {
                  const key = `task_${currentStepIdx}_${idx}`;
                  const taskStr = typeof task === 'string' ? task : task.title;
                  const isReq = typeof task === 'object' ? task.required : false;
                  const isChecked = !!checkedItems[key];
                  
                  return (
                    <div key={idx} className="flex items-start gap-3 px-4 py-3 bg-brand-bone border border-brand-cream-dk rounded-lg cursor-pointer hover:bg-brand-cream transition">
                      <div 
                        className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-brand-green-accent border-brand-green-accent' : 'border-brand-cream-dk'}`}
                        onClick={() => toggleCheck(key)}
                      >
                        {isChecked && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2" onClick={() => toggleCheck(key)}>
                        <span className={`font-sans text-[15px] ${isChecked ? 'text-brand-ink-mute line-through' : 'text-brand-ink'}`}>
                          {taskStr}
                        </span>
                        {isReq && (
                          <span className="bg-red-50 text-red-600 text-[11px] font-medium px-2 py-0.5 rounded-pill shrink-0">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Documents checklist */}
          {docs.length > 0 && (
            <>
              <h3 className="text-sm font-display font-semibold text-brand-ink uppercase tracking-wide mt-6 mb-3">Documents needed</h3>
              <div className="space-y-2">
                {docs.map((doc, idx) => {
                  const key = `doc_${currentStepIdx}_${idx}`;
                  const docStr = typeof doc === 'string' ? doc : doc.name || doc.title;
                  const isReq = typeof doc === 'object' ? doc.required : true;
                  const isChecked = !!checkedItems[key];
                  
                  return (
                    <div key={idx} className="flex items-start gap-3 px-4 py-3 bg-brand-bone border border-brand-cream-dk rounded-lg cursor-pointer hover:bg-brand-cream transition">
                      <div 
                        className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-brand-green-accent border-brand-green-accent' : 'border-brand-cream-dk'}`}
                        onClick={() => toggleCheck(key)}
                      >
                        {isChecked && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2" onClick={() => toggleCheck(key)}>
                        <span className={`font-sans text-[15px] ${isChecked ? 'text-brand-ink-mute line-through' : 'text-brand-ink'}`}>
                          {docStr}
                        </span>
                        {isChecked ? (
                          <span className="bg-brand-green-accent/15 text-brand-green text-xs px-2 py-0.5 rounded-pill shrink-0">Ready</span>
                        ) : isReq ? (
                          <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-pill shrink-0">Required</span>
                        ) : (
                          <span className="bg-brand-cream border border-brand-cream-dk text-brand-ink-mute text-xs px-2 py-0.5 rounded-pill shrink-0">Optional</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {mistakes.length > 0 && (
            <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <h4 className="font-semibold text-red-700 mb-2">Common mistakes to avoid</h4>
              <ul className="list-disc list-outside ml-5 space-y-1 text-[15px] text-red-700/80">
                {mistakes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {officialUrl && (
            <div className="mt-6 mb-2">
              <button 
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange-lt text-brand-orange hover:bg-brand-orange hover:text-white rounded-pill font-medium text-sm transition-colors shadow-sm"
                onClick={() => {
                  const absoluteUrl = officialUrl.startsWith('http') ? officialUrl : `https://${officialUrl}`;
                  window.open(absoluteUrl, '_blank');
                }}
              >
                <ExternalLink size={16} /> Official Link
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-cream-dk">
            {currentStepIdx > 0 ? (
              <button
                onClick={() => setCurrentStepIdx(prev => prev - 1)}
                className="h-11 px-5 rounded-pill border border-brand-cream-dk bg-white text-brand-ink hover:bg-brand-cream font-medium font-sans flex items-center gap-2 transition"
              >
                <ArrowLeft size={18} />
                Previous
              </button>
            ) : <div />}

            {currentStepIdx < totalSteps - 1 ? (
              isStepComplete ? (
                <button
                  onClick={markStepCompleteAndContinue}
                  className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card flex items-center gap-2 transition"
                >
                  <Check size={18} /> Mark as Done & Continue
                </button>
              ) : (
                <button
                  disabled
                  className="bg-brand-cream-dk text-brand-ink-mute font-display font-semibold px-6 h-11 rounded-pill shadow-none flex items-center gap-2 cursor-not-allowed opacity-50"
                >
                  Next
                </button>
              )
            ) : (
              <button
                onClick={handleFinishJourney}
                className="bg-brand-green hover:bg-brand-green-lt text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card-hov flex items-center gap-2 transition"
              >
                <CheckCircle2 size={18} /> Finish Journey
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Modal (custom design) */}
      {exitModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-pop p-6 max-w-sm w-full mx-4">
            <h2 className="font-display font-semibold text-lg text-brand-ink">Exit this journey?</h2>
            <p className="text-sm text-brand-ink-mute mt-2 font-sans">
              Your progress is saved automatically. You can return to this journey anytime from your dashboard.
            </p>
            <div className="flex gap-3 mt-5">
              <button 
                onClick={() => setExitModalOpen(false)}
                className="flex-1 h-10 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink font-medium hover:bg-brand-cream transition font-sans"
              >
                Cancel
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-10 px-4 rounded-pill bg-brand-orange hover:bg-brand-orange-dk text-white font-semibold font-display shadow-card transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {completionModalOpen && (
        <div className="fixed inset-0 bg-brand-bone/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-pop p-10 max-w-md w-full mx-4 text-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="flex justify-center"
            >
              <CheckCircle2 size={80} className="text-brand-green-accent" />
            </motion.div>
            <h2 className="font-display font-bold text-2xl text-brand-ink mt-6">Journey complete!</h2>
            <p className="text-sm text-brand-ink-mute mt-2 font-sans">
              Great work. All your steps are saved to your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-5 h-11 rounded-pill shadow-card transition"
              >
                Back to Dashboard
              </button>
              <button 
                onClick={() => navigate('/')}
                className="border border-brand-cream-dk bg-white hover:bg-brand-cream text-brand-ink font-medium px-5 h-11 rounded-pill transition font-sans"
              >
                Start Another Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
