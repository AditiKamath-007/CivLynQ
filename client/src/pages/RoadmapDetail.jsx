import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Check, ExternalLink, Shield, X, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArray } from '../utils/toArray';
import { draftDocument, checkConsent, saveConsent, saveUserDraft } from '../services/api';
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
  const [openDoc, setOpenDoc] = useState(null); // Document info modal state

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
  const subTasks = toArray(currentStep.subTasks || currentStep.checklist);
  const time = currentStep.estimatedDays || currentStep.estimatedTime || currentStep.duration;
  const mistakes = toArray(currentStep.mistakes);
  const officialUrl = currentStep.officialLink || currentStep.link || currentStep.url;

  // Determine completion logic for current step
  let hasRequiredItems = false;
  let allRequiredChecked = true;

  subTasks.forEach((task, idx) => {
    const isReq = typeof task === 'object' ? task.required : false;
    if (isReq) {
      hasRequiredItems = true;
      if (!checkedItems[`task_${currentStepIdx}_${idx}`]) {
        allRequiredChecked = false;
      }
    }
  });

  docs.forEach((doc, idx) => {
    const isReq = typeof doc === 'object' ? doc.required : true;
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT RAIL */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-sm text-brand-ink-mute hover:text-brand-orange font-sans transition cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="font-display font-bold text-xl text-brand-ink mt-3">
              {workflow.goal || workflow.title}
            </h1>
            
            <div className="mt-3 mb-4">
              <div className="text-sm text-brand-ink-mute font-sans">
                {completedCount} of {totalSteps} completed
              </div>
              <div className="h-2 w-full bg-brand-cream-dk rounded-pill overflow-hidden mt-2">
                <div 
                  className="h-full bg-brand-orange rounded-pill transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            <div className="border-t border-brand-cream-dk my-4" />
            
            <div className="space-y-1">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIdx;
                const isDone = completedSteps[idx];
                
                return (
                  <div 
                    key={idx}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition border ${
                      isActive ? 'bg-brand-orange-lt border-brand-orange shadow-card' 
                      : isDone ? 'bg-brand-green-accent/10 border-brand-green-accent/30 hover:bg-brand-cream hover:border-brand-cream-dk'
                      : 'border-transparent hover:bg-brand-cream hover:border-brand-cream-dk'
                    }`}
                  >
                    <div className={`w-7 h-7 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 font-display font-semibold text-xs ${
                      isActive ? 'bg-brand-orange text-white' 
                      : isDone ? 'bg-brand-green-accent text-white'
                      : 'bg-brand-bone text-brand-ink-mute border-2 border-brand-cream-dk'
                    }`}>
                      {isDone && !isActive ? <Check size={14} /> : idx + 1}
                    </div>
                    <div>
                      <div className={`font-sans text-[14px] font-semibold leading-tight ${
                        isActive ? 'text-brand-orange-dk' 
                        : isDone ? 'text-brand-ink-mute line-through'
                        : 'text-brand-ink'
                      }`}>
                        {step.title}
                      </div>
                      {(step.estimatedTime || step.estimatedDays || step.duration) && (
                        <div className="text-xs text-brand-ink-mute mt-0.5">
                          {step.estimatedTime || step.estimatedDays || step.duration}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANE */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-sans text-brand-ink-mute">
                Step {currentStepIdx + 1} of {totalSteps}
              </span>
              <button
                onClick={() => setExitModalOpen(true)}
                className="h-10 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink-mute hover:bg-brand-cream hover:text-brand-ink font-medium text-sm flex items-center gap-2 transition"
              >
                <X size={16} /> Exit Journey
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-brand-cream-dk shadow-card p-6 md:p-8">
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
                  <h3 className="text-xs font-display font-semibold text-brand-ink uppercase tracking-wider mt-6 mb-3">Sub-tasks</h3>
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
                  <h3 className="text-xs font-display font-semibold text-brand-ink uppercase tracking-wider mt-6 mb-3">Documents needed</h3>
                  <div className="space-y-2">
                    {docs.map((doc, idx) => {
                      const key = `doc_${currentStepIdx}_${idx}`;
                      const docStr = typeof doc === 'string' ? doc : doc.name || doc.title;
                      const isReq = typeof doc === 'object' ? doc.required : true;
                      const isChecked = !!checkedItems[key];
                      
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-brand-bone border border-brand-cream-dk rounded-lg hover:bg-brand-cream transition">
                          <div className="flex items-start sm:items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleCheck(key)}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-brand-green-accent border-brand-green-accent' : 'border-brand-cream-dk'}`}>
                              {isChecked && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                                  <Check size={14} className="text-white" />
                                </motion.div>
                              )}
                            </div>
                            <span className={`font-sans text-[15px] flex-1 ${isChecked ? 'text-brand-ink-mute line-through' : 'text-brand-ink'}`}>
                              {docStr}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 ml-8 sm:ml-0">
                            {/* NEW FEATURE: "Get this document" button */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setOpenDoc(docStr); }}
                              className="inline-flex items-center gap-1.5 text-sm text-brand-orange hover:text-brand-orange-dk font-medium font-sans transition cursor-pointer shrink-0"
                            >
                              <ExternalLink size={14} /> How to get this
                            </button>

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
                    <ChevronLeft size={18} />
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
                      className="bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-6 h-11 rounded-pill shadow-card flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream-dk"
                    >
                      Next <ChevronRight size={18} />
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
        </div>
      </div>

      {/* Exit Modal */}
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

      {/* Document Info Modal */}
      <AnimatePresence>
        {openDoc && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-pop max-w-md w-full p-6 relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange-lt flex items-center justify-center">
                  <FileText size={20} className="text-brand-orange" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-ink">How to get: {openDoc}</h2>
                  <p className="text-xs text-brand-ink-mute">Step-by-step guide</p>
                </div>
              </div>
              
              {/* 🤖 AI INTEGRATION POINT 4: Document guides */}
              <div className="space-y-4 mb-6 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-orange-lt text-brand-orange font-display font-semibold flex items-center justify-center text-xs flex-shrink-0">1</div>
                  <p className="text-sm text-brand-ink font-sans leading-relaxed mt-1">Visit your nearest government office or the official online portal for {openDoc}.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-orange-lt text-brand-orange font-display font-semibold flex items-center justify-center text-xs flex-shrink-0">2</div>
                  <p className="text-sm text-brand-ink font-sans leading-relaxed mt-1">Fill out the application form and submit the required supporting documents.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-orange-lt text-brand-orange font-display font-semibold flex items-center justify-center text-xs flex-shrink-0">3</div>
                  <p className="text-sm text-brand-ink font-sans leading-relaxed mt-1">Pay any applicable fees and collect your {openDoc} (usually issued within 7-15 working days).</p>
                </div>
              </div>

              <button 
                onClick={() => setOpenDoc(null)}
                className="w-full h-11 bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold rounded-pill shadow-card flex items-center justify-center transition"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
