import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, IndianRupee, ListChecks, ChevronDown, ChevronUp, Check, ExternalLink, PenTool, Shield, X, CheckCircle2 } from 'lucide-react';
import { toArray } from '../utils/toArray';
import { draftDocument, checkConsent, saveConsent, saveUserDraft } from '../services/api';
import DraftModal from '../components/ui/DraftModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import CompletionModal from '../components/ui/CompletionModal';
import { useAuth } from '../context/AuthContext';

function CollapsibleSection({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!content) return null;
  
  return (
    <div className="mb-4">
      <button 
        className="flex items-center justify-between w-full text-left font-display font-semibold text-[17px] text-brand-ink py-3 border-b border-brand-cream-dk hover:text-brand-orange transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="pt-3 pb-4 text-[15px] text-brand-ink-mute font-sans leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}

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
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const toggleCheck = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markStepComplete = () => {
    setCompletedSteps(prev => {
      const next = { ...prev, [currentStepIdx]: !prev[currentStepIdx] };
      const compKey = id.startsWith('roadmap-') ? `completed-${id}` : `completed-roadmap-${id}`;
      localStorage.setItem(compKey, JSON.stringify(next));
      return next;
    });
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
      navigate('/login');
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
    return <div className="bg-bone min-h-screen flex items-center justify-center font-sans text-brand-ink-mute">Loading...</div>;
  }

  if (error || !workflow) {
    return (
      <div className="bg-bone min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-brand-ink mb-4">Roadmap not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-brand-orange text-white rounded-pill font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const steps = workflow.steps || [];
  const currentStep = steps[currentStepIdx] || {};

  const docs = toArray(currentStep.requiredDocuments);
  const prereqs = toArray(currentStep.prerequisites);
  const mistakes = toArray(currentStep.commonMistakes);
  const subTasks = toArray(currentStep.subTasks);

  const department = currentStep.governmentDepartment || currentStep.agency;
  const fee = currentStep.estimatedFee || currentStep.cost || 'Free';
  const time = currentStep.estimatedDays || currentStep.estimatedTime || 'N/A';
  const officialUrl = currentStep.officialUrl || (currentStep.links && currentStep.links[0]?.url);

  return (
    <div className="bg-bone min-h-screen pb-24 relative overflow-x-hidden">
      
      {/* ALWAYS VISIBLE EXIT BUTTON */}
      <div className="absolute top-6 right-6 md:right-10 z-20">
        <button
          onClick={() => setExitModalOpen(true)}
          className="h-10 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink-mute hover:bg-brand-cream hover:text-brand-ink font-medium text-sm flex items-center gap-2 transition-all shadow-sm"
        >
          <X size={16} /> Exit Journey
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-20 md:pt-16">
        
        {/* Top: title & progress indicator */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-ink pr-32">
            {workflow.goal || workflow.title}
          </h1>
          <p className="text-[15px] font-medium text-brand-orange mt-2">
            Step {currentStepIdx + 1} of {steps.length}
          </p>
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6 md:p-8 mt-4">
          <header className="mb-4">
            <h2 className="font-display font-bold text-xl text-brand-ink mb-2">{currentStep.title}</h2>
            {department && (
              <span className="inline-block px-3 py-1 bg-brand-green-accent/15 text-brand-green font-medium text-xs rounded-pill">
                {department}
              </span>
            )}
          </header>
          
          <p className="text-[15px] text-brand-ink-mute leading-relaxed mb-6">{currentStep.description}</p>

          <div className="flex flex-wrap gap-4 mb-8 bg-brand-cream/30 p-4 rounded-xl border border-brand-cream-dk">
            <div className="flex-1 min-w-[120px]">
              <span className="block text-xs font-semibold text-brand-ink-mute uppercase tracking-wider mb-1">Est. Fee</span>
              <span className="text-[15px] text-brand-ink font-medium">{fee}</span>
            </div>
            <div className="flex-1 min-w-[120px]">
              <span className="block text-xs font-semibold text-brand-ink-mute uppercase tracking-wider mb-1">Est. Time</span>
              <span className="text-[15px] text-brand-ink font-medium">{time}</span>
            </div>
            <div className="flex-1 min-w-[120px]">
              <span className="block text-xs font-semibold text-brand-ink-mute uppercase tracking-wider mb-1">Method</span>
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${currentStep.canBeDoneOnline ? 'bg-brand-green-accent/20 text-brand-green' : 'bg-brand-cream-dk text-brand-ink-mute'}`}>
                {currentStep.canBeDoneOnline ? 'Online' : 'In-person'}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <CollapsibleSection 
              title="Why this step is required" 
              content={currentStep.whyThisStepIsRequired} 
            />
            <CollapsibleSection 
              title="In plain terms" 
              content={currentStep.legalJargonSimplified} 
            />
          </div>

          {prereqs.length > 0 && (
            <div className="mb-8">
              <h3 className="font-display font-semibold text-lg text-brand-ink mb-3">Prerequisites</h3>
              <ul className="list-disc list-outside ml-5 space-y-1 text-[15px] text-brand-ink-mute">
                {prereqs.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {docs.length > 0 && (
            <div className="mb-8">
              <h3 className="font-display font-semibold text-lg text-brand-ink mb-3">Required Documents</h3>
              <div className="space-y-3">
                {docs.map((doc, idx) => {
                  const key = `doc_${currentStepIdx}_${idx}`;
                  return (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 border-2 rounded transition-colors border-brand-cream-dk group-hover:border-brand-orange flex-shrink-0">
                        <input 
                          type="checkbox" 
                          checked={!!checkedItems[key]} 
                          onChange={() => toggleCheck(key)} 
                          className="opacity-0 absolute inset-0 cursor-pointer"
                        />
                        {checkedItems[key] && <Check size={14} className="text-brand-orange" />}
                      </div>
                      <span className={`text-[15px] transition-colors ${checkedItems[key] ? 'text-brand-ink-mute line-through' : 'text-brand-ink'}`}>
                        {doc}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {subTasks.length > 0 && (
            <div className="mb-8">
              <h3 className="font-display font-semibold text-lg text-brand-ink mb-3">Sub-tasks</h3>
              <div className="space-y-3">
                {subTasks.map((task, idx) => {
                  const key = `task_${currentStepIdx}_${idx}`;
                  const taskStr = typeof task === 'string' ? task : task.title;
                  const isDraftable = typeof task === 'object' ? task.isDocumentDraftable : taskStr.toLowerCase().includes('draftable') || taskStr.toLowerCase().includes('draft') || taskStr.toLowerCase().includes('form') || taskStr.toLowerCase().includes('affidavit');
                  
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-bone rounded-lg border border-brand-cream-dk">
                      <label className="flex items-start gap-3 cursor-pointer group flex-1">
                        <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 border-2 rounded transition-colors border-brand-cream-dk group-hover:border-brand-orange flex-shrink-0">
                          <input 
                            type="checkbox" 
                            checked={!!checkedItems[key]} 
                            onChange={() => toggleCheck(key)} 
                            className="opacity-0 absolute inset-0 cursor-pointer"
                          />
                          {checkedItems[key] && <Check size={14} className="text-brand-orange" />}
                        </div>
                        <span className={`text-[15px] transition-colors ${checkedItems[key] ? 'text-brand-ink-mute line-through' : 'text-brand-ink'}`}>
                          {taskStr}
                        </span>
                      </label>
                      {isDraftable && (
                        <button 
                          onClick={() => handleDraftClick(taskStr)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-brand-cream-dk text-brand-ink rounded-lg hover:bg-brand-cream hover:border-brand-orange transition-colors self-start sm:self-auto"
                        >
                          <PenTool size={14} /> Draft this
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.tips && (
            <div className="mb-8 p-4 bg-brand-green-accent/10 border-l-4 border-brand-green-accent rounded-r-lg">
              <span className="font-semibold text-brand-green">Tip: </span>
              <span className="text-[15px] text-brand-ink">{typeof currentStep.tips === 'string' ? currentStep.tips : currentStep.tips.join(' ')}</span>
            </div>
          )}

          {mistakes.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <h4 className="font-semibold text-red-700 mb-2">Common mistakes to avoid</h4>
              <ul className="list-disc list-outside ml-5 space-y-1 text-[15px] text-red-700/80">
                {mistakes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {officialUrl && (
            <div className="mb-4">
              <button 
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange-lt text-brand-orange hover:bg-brand-orange hover:text-white rounded-pill font-medium text-sm transition-colors"
                onClick={() => {
                  const absoluteUrl = officialUrl.startsWith('http') ? officialUrl : `https://${officialUrl}`;
                  window.open(absoluteUrl, '_blank');
                }}
              >
                <ExternalLink size={16} /> Official Link
              </button>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-brand-cream-dk">
            <button
              className="w-full sm:w-auto text-brand-ink-mute hover:text-brand-ink font-medium px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
              disabled={currentStepIdx === 0}
            >
              Previous
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
                  completedSteps[currentStepIdx] 
                    ? 'bg-brand-cream text-brand-ink-mute hover:bg-brand-cream-dk border border-brand-cream-dk'
                    : 'bg-white border border-brand-cream-dk text-brand-ink hover:border-brand-orange hover:text-brand-orange'
                }`}
                onClick={markStepComplete}
              >
                {completedSteps[currentStepIdx] ? 'Mark Incomplete' : 'Mark Complete'}
              </button>

              {currentStepIdx === steps.length - 1 ? (
                <button
                  className="h-11 px-6 rounded-pill bg-brand-green hover:bg-brand-green-lt text-white font-display font-semibold flex items-center gap-2 shadow-card hover:shadow-card-hov transition-all duration-200"
                  onClick={() => setCompletionModalOpen(true)}
                >
                  <CheckCircle2 size={18} /> Finish Journey
                </button>
              ) : (
                <button
                  className="h-10 px-6 rounded-pill bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold transition-all duration-200 shadow-card"
                  onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        onConfirm={() => navigate('/dashboard')}
        title="Exit this journey?"
        body="Your progress is saved. You can return anytime from the dashboard."
        confirmText="Exit"
        confirmStyle="secondary"
      />

      <CompletionModal isOpen={completionModalOpen} />

      {/* Legacy Draft Modal integration - assuming DraftModal uses its own styling or is already Tailwind compatible */}
      <DraftModal
        isOpen={draftModalOpen}
        onClose={() => setDraftModalOpen(false)}
        title={draftTitle}
        draftText={draftContent}
        onChange={(val) => setDraftContent(val)}
        loading={draftLoading}
        onSave={handleSaveDraft}
        isSaving={isSavingDraft}
        saved={draftSaved}
      />

      {/* AI Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-pop p-6 max-w-md w-full relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg text-brand-ink flex items-center gap-2">
                <Shield className="text-brand-orange" size={20} /> AI Drafter Permissions
              </h2>
              <button className="text-brand-ink-mute hover:text-brand-ink" onClick={() => setShowConsentModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="text-[15px] text-brand-ink-mute space-y-4">
              <p>To draft <strong>{pendingDraftTask}</strong> on your behalf, the AI Drafter requires your authorization:</p>
              
              <div className="space-y-3 bg-brand-cream/30 p-4 rounded-xl border border-brand-cream-dk">
                <div className="flex gap-3">
                  <Check size={16} className="text-brand-green mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-brand-ink block text-sm">Profile Integration</strong>
                    <p className="text-xs">Autofills templates with your name, email, and contact info if available.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check size={16} className="text-brand-green mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-brand-ink block text-sm">AI Generation & Processing</strong>
                    <p className="text-xs">Uses secure AI processing to compose drafts relevant to <em>{workflow.goal || workflow.title}</em>.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check size={16} className="text-brand-green mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-brand-ink block text-sm">Cloud Database Storage</strong>
                    <p className="text-xs">Saves the completed draft securely to your profile drafts database.</p>
                  </div>
                </div>
              </div>

              <p className="text-xs italic bg-bone p-3 rounded text-brand-ink-mute border border-brand-cream-dk">
                By granting permissions, you authorize the AI Drafter to construct this draft. You retain full ownership and can review/edit the document before finalized usage.
              </p>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="h-10 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink font-medium hover:bg-brand-cream transition-colors"
                onClick={() => setShowConsentModal(false)}
              >
                Cancel
              </button>
              <button 
                className="h-10 px-4 rounded-pill bg-brand-orange hover:bg-brand-orange-dk text-white font-semibold shadow-card transition-colors"
                onClick={handleGrantConsent}
              >
                Grant Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
