import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Tag from '../components/ui/Tag';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="text-h1">Dashboard</h1>
          <Button variant="primary" onClick={() => navigate('/')}>+ New</Button>
        </div>
        <div className="dashboard-grid">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="dashboard-card-skeleton">
              <Skeleton height="32px" width="80%" style={{ marginBottom: '16px' }} />
              <Skeleton height="8px" width="100%" style={{ marginBottom: '8px', borderRadius: '4px' }} />
              <Skeleton height="16px" width="60%" style={{ marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton height="24px" width="60px" style={{ borderRadius: '12px' }} />
                <Skeleton height="24px" width="80px" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="text-h1">Dashboard</h1>
        <Button variant="primary" onClick={() => navigate('/')}>+ New</Button>
      </div>

      {journeys.length === 0 ? (
        <EmptyState
          icon={<Compass size={48} />}
          title="No journeys yet"
          description="Start exploring government processes and your progress will appear here."
          action={<Button variant="primary" onClick={() => navigate('/')}>Start a Journey</Button>}
        />
      ) : (
        <div className="dashboard-grid">
          {journeys.map((journey) => (
            <Card
              key={journey.id}
              hoverable
              clickable
              onClick={() => navigate(`/roadmap/${journey.id}`)}
              className="dashboard-card"
            >
              <h2 className="text-h2 dashboard-card-title">{journey.goal || 'Untitled Journey'}</h2>
              
              <div className="dashboard-card-progress">
                <ProgressBar 
                  progress={journey.totalSteps > 0 ? (journey.completedCount / journey.totalSteps) * 100 : 0} 
                />
                <span className="text-caption progress-text">
                  {journey.completedCount} of {journey.totalSteps} steps completed
                </span>
              </div>

              <div className="dashboard-card-footer">
                <Tag className="category-tag">
                  {journey.category || journey.complexity || 'Standard'}
                </Tag>
                <span className="text-caption last-updated">
                  {journey.createdAt ? new Date(journey.createdAt).toLocaleDateString() : 'Recently added'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
