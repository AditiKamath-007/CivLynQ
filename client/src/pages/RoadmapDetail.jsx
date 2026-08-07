import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, IndianRupee, ListChecks, ChevronDown, ChevronUp, Check, ExternalLink, PenTool } from 'lucide-react';
import { toArray } from '../utils/toArray';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import Tag from '../components/ui/Tag';
import ErrorState from '../components/ui/ErrorState';
import './RoadmapDetail.css';

function CollapsibleSection({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!content) return null;
  
  return (
    <div className="collapsible-section">
      <button 
        className="collapsible-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-h2">{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        <div className="collapsible-content-inner text-body">
          {content}
        </div>
      </div>
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

  useEffect(() => {
    try {
      const data = localStorage.getItem(id);
      if (data) {
        setWorkflow(JSON.parse(data));
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="roadmap-detail-page">Loading...</div>;
  }

  if (error || !workflow) {
    return (
      <div className="roadmap-detail-page">
        <ErrorState message="Roadmap not found or invalid." onRetry={() => navigate('/')} />
      </div>
    );
  }

  const toggleCheck = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markStepComplete = () => {
    setCompletedSteps(prev => ({ ...prev, [currentStepIdx]: !prev[currentStepIdx] }));
  };

  const steps = workflow.steps || [];
  const currentStep = steps[currentStepIdx] || {};

  const docs = toArray(currentStep.requiredDocuments);
  const prereqs = toArray(currentStep.prerequisites);
  const mistakes = toArray(currentStep.commonMistakes);
  const subTasks = toArray(currentStep.subTasks);

  return (
    <div className="roadmap-detail-page">
      {/* Desktop Sidebar */}
      <aside className="roadmap-sidebar">
        <h1 className="text-h1 sidebar-title">{workflow.goal || 'Your Roadmap'}</h1>
        {workflow.summary && <p className="text-body sidebar-summary">{workflow.summary}</p>}
        
        <div className="sidebar-meta">
          <Chip icon={Clock}>{workflow.totalEstimatedTime || 'N/A'}</Chip>
          <Chip icon={IndianRupee}>{workflow.totalEstimatedCost || 'Free'}</Chip>
          <Chip icon={ListChecks}>{steps.length} steps</Chip>
        </div>

        <nav className="desktop-stepper">
          {steps.map((step, idx) => (
            <button
              key={idx}
              className={`step-item ${currentStepIdx === idx ? 'active' : ''} ${completedSteps[idx] ? 'completed' : ''}`}
              onClick={() => setCurrentStepIdx(idx)}
            >
              <div className="step-indicator">
                {completedSteps[idx] ? <Check size={14} className="check-icon" /> : <span>{idx + 1}</span>}
              </div>
              <span className="step-title">{step.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Horizontal Stepper */}
      <div className="mobile-stepper">
        <div className="mobile-stepper-inner">
          {steps.map((step, idx) => (
            <Chip 
              key={idx}
              active={currentStepIdx === idx}
              completed={completedSteps[idx]}
              clickable
              onClick={() => setCurrentStepIdx(idx)}
              className="mobile-step-chip"
            >
              {completedSteps[idx] ? <Check size={14} /> : idx + 1}
            </Chip>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="roadmap-main">
        <Card className="step-card">
          <header className="step-header">
            <h1 className="text-h1">{currentStep.title}</h1>
            {currentStep.governmentDepartment && (
              <Tag variant="olive">{currentStep.governmentDepartment}</Tag>
            )}
          </header>
          
          <p className="text-body step-desc">{currentStep.description}</p>

          <div className="step-meta">
            <div className="meta-item">
              <span className="meta-label">Est. Fee:</span>
              <span className="meta-value">{currentStep.estimatedFee || 'Free'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Est. Time:</span>
              <span className="meta-value">{currentStep.estimatedDays || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <Tag variant={currentStep.canBeDoneOnline ? 'olive' : 'muted'}>
                {currentStep.canBeDoneOnline ? 'Online' : 'In-person'}
              </Tag>
            </div>
          </div>

          <div className="step-content">
            <CollapsibleSection 
              title="Why this step is required" 
              content={currentStep.whyThisStepIsRequired} 
            />
            <CollapsibleSection 
              title="In plain terms" 
              content={currentStep.legalJargonSimplified} 
            />

            {prereqs.length > 0 && (
              <div className="content-section">
                <h3 className="text-h2">Prerequisites</h3>
                <ul className="bullet-list">
                  {prereqs.map((item, idx) => (
                    <li key={idx} className="text-body">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {docs.length > 0 && (
              <div className="content-section">
                <h3 className="text-h2">Required Documents</h3>
                <div className="checklist">
                  {docs.map((doc, idx) => {
                    const key = `doc_${currentStepIdx}_${idx}`;
                    return (
                      <label key={idx} className="check-item">
                        <input 
                          type="checkbox" 
                          checked={!!checkedItems[key]} 
                          onChange={() => toggleCheck(key)} 
                        />
                        <span className="text-body">{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {subTasks.length > 0 && (
              <div className="content-section">
                <h3 className="text-h2">Sub-tasks</h3>
                <div className="checklist">
                  {subTasks.map((task, idx) => {
                    const key = `task_${currentStepIdx}_${idx}`;
                    const taskStr = typeof task === 'string' ? task : task.title;
                    const isDraftable = typeof task === 'object' && task.isDocumentDraftable || taskStr.toLowerCase().includes('draftable');
                    
                    return (
                      <div key={idx} className="subtask-row">
                        <label className="check-item">
                          <input 
                            type="checkbox" 
                            checked={!!checkedItems[key]} 
                            onChange={() => toggleCheck(key)} 
                          />
                          <span className="text-body">{taskStr}</span>
                        </label>
                        {isDraftable && (
                          <Button variant="secondary" size="sm" icon={PenTool} className="draft-btn">
                            Draft this
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep.tips && (
              <div className="tips-callout text-body">
                <strong>Tip:</strong> {currentStep.tips}
              </div>
            )}

            {mistakes.length > 0 && (
              <div className="mistakes-callout">
                <h4 className="text-label error-text">Common mistakes to avoid</h4>
                <ul className="bullet-list error-text">
                  {mistakes.map((item, idx) => (
                    <li key={idx} className="text-body">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentStep.officialUrl && (
              <div className="content-section">
                <Button 
                  variant="primary" 
                  icon={ExternalLink} 
                  onClick={() => window.open(currentStep.officialUrl, '_blank')}
                >
                  Official Link
                </Button>
              </div>
            )}
          </div>

          <footer className="step-footer">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
              disabled={currentStepIdx === 0}
            >
              Previous
            </Button>
            
            <div className="right-actions">
              <Button 
                variant={completedSteps[currentStepIdx] ? 'secondary' : 'primary'} 
                onClick={markStepComplete}
              >
                {completedSteps[currentStepIdx] ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
              
              <Button 
                variant="primary" 
                onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={currentStepIdx === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </footer>
        </Card>
      </main>
    </div>
  );
}
