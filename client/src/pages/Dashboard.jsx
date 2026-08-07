import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Trash2, Plus } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [journeys, setJourneys] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, journeyId: null, journeyTitle: '' });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signup', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    // Simulate initial loading
    const timer = setTimeout(() => {
      const loadedJourneys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('roadmap-')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            
            // Get completed steps
            let completedStepsCount = 0;
            const completedData = localStorage.getItem(`completed-${key}`) || localStorage.getItem(`completed-${key.replace('roadmap-', '')}`);
            if (completedData) {
              const parsed = JSON.parse(completedData);
              completedStepsCount = Array.isArray(parsed) ? parsed.length : Object.values(parsed).filter(Boolean).length;
            }

            loadedJourneys.push({
              id: key,
              ...data,
              completedCount: completedStepsCount,
              totalSteps: data.steps ? data.steps.length : 0,
            });
          } catch (e) {
            console.error('Error parsing roadmap data', e);
          }
        }
      }
      setJourneys(loadedJourneys);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id) => {
    // Remove from local storage
    localStorage.removeItem(id);
    localStorage.removeItem(`completed-${id}`);
    localStorage.removeItem(`completed-${id.replace('roadmap-', '')}`);
    
    // Update state
    setJourneys(prev => prev.filter(j => j.id !== id));
  };

  const openDeleteModal = (e, journey) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      journeyId: journey.id,
      journeyTitle: journey.goal || 'this journey'
    });
  };

  return (
    <div className="bg-bone min-h-screen pb-20 md:pb-10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-brand-ink">Dashboard</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-card border border-brand-cream-dk p-6 animate-pulse">
                <div className="h-6 bg-brand-cream-dk rounded w-3/4 mb-4"></div>
                <div className="h-2 bg-brand-cream-dk rounded-pill w-full mb-2"></div>
                <div className="h-4 bg-brand-cream-dk rounded w-1/2 mt-4"></div>
              </div>
            ))}
          </div>
        ) : journeys.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Compass size={64} className="text-brand-orange-lt mb-4" />
            <h2 className="font-display font-semibold text-xl text-brand-ink mb-2">No journeys yet</h2>
            <p className="text-sm text-brand-ink-mute mb-6">Start your first government process today.</p>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dk text-white font-semibold font-display text-[15px] px-6 h-11 rounded-pill shadow-card hover:shadow-card-hov transition-all duration-200"
            >
              <Plus size={18} aria-hidden="true" />
              <span>New Journey</span>
            </button>
          </div>
        ) : (
          /* Grid of Journeys */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {journeys.map((journey) => {
              const percent = journey.totalSteps > 0 ? (journey.completedCount / journey.totalSteps) * 100 : 0;
              const isCompleted = journey.totalSteps > 0 && journey.completedCount === journey.totalSteps;

              return (
                <div
                  key={journey.id}
                  onClick={() => navigate(`/roadmap/${journey.id}`)}
                  className="bg-white rounded-card border border-brand-cream-dk shadow-card hover:shadow-card-hov transition-all duration-200 p-6 relative cursor-pointer group"
                >
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => openDeleteModal(e, journey)}
                    className="absolute top-3 right-3 p-2 text-brand-ink-mute hover:text-red-600 transition-colors rounded-full hover:bg-red-50 z-10"
                    aria-label="Delete journey"
                  >
                    <Trash2 size={16} />
                  </button>

                  <h2 className="font-display font-semibold text-lg text-brand-ink pr-10 line-clamp-2">
                    {journey.goal || 'Untitled Journey'}
                  </h2>
                  
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-brand-cream-dk rounded-pill mt-4 overflow-hidden">
                    <div 
                      className="h-full bg-brand-orange transition-all duration-[600ms] ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-brand-ink-mute">
                      {journey.completedCount} of {journey.totalSteps} steps completed
                    </span>
                    
                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="bg-brand-green-accent/15 text-brand-green text-[10px] px-2 py-0.5 rounded-pill font-medium uppercase tracking-wider">
                        Completed
                      </span>
                    ) : (
                      <span className="bg-brand-orange-lt text-brand-orange text-[10px] px-2 py-0.5 rounded-pill font-medium uppercase tracking-wider">
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end mt-6">
                    <span className="bg-white border border-brand-cream-dk text-brand-ink-mute text-xs px-3 py-1 rounded-pill">
                      {journey.category || journey.complexity || 'Standard'}
                    </span>
                    <span className="text-xs text-brand-ink-mute">
                      {journey.createdAt ? new Date(journey.createdAt).toLocaleDateString() : 'Recently added'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, journeyId: null, journeyTitle: '' })}
        onConfirm={() => handleDelete(deleteModal.journeyId)}
        title="Delete this journey?"
        body={`This action cannot be undone. All progress for "${deleteModal.journeyTitle}" will be permanently removed.`}
      />
    </div>
  );
};

export default Dashboard;
