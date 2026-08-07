import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, User, FileText, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getUserDrafts } from '../services/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [expandedRow, setExpandedRow] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoadingDrafts(true);
      getUserDrafts()
        .then(response => {
          if (response.success) {
            setDrafts(response.drafts || []);
          }
        })
        .catch(err => {
          console.error('Error fetching drafts:', err);
        })
        .finally(() => {
          setLoadingDrafts(false);
        });
    }
  }, [currentUser]);

  const toggleRow = (row) => {
    setExpandedRow(expandedRow === row ? null : row);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const getInitials = () => {
    if (!currentUser?.displayName) return 'CU';
    return currentUser.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <div className="profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              getInitials()
            )}
          </div>
          <Button 
            variant="ghost" 
            className="edit-avatar-btn" 
            aria-label="Edit profile"
          >
            <Pencil size={16} />
          </Button>
        </div>
        <h1 className="text-h1 profile-name">{currentUser?.displayName || 'CivLynQ User'}</h1>
      </div>

      <Card className="profile-list-card">
        {/* Personal Info Row */}
        <div className="profile-list-item-container">
          <button 
            className="profile-list-row" 
            onClick={() => toggleRow('personal')}
          >
            <User size={20} className="row-icon" />
            <span className="text-label row-label">Personal Info</span>
            <ChevronRight 
              size={20} 
              className={`row-chevron ${expandedRow === 'personal' ? 'expanded' : ''}`} 
            />
          </button>
          
          <div className={`profile-expandable-content ${expandedRow === 'personal' ? 'open' : ''}`}>
            <div className="expandable-inner">
              <div className="form-group">
                <label className="text-caption">Full Name</label>
                <input 
                  type="text" 
                  className="profile-input text-body" 
                  value={currentUser?.displayName || 'CivLynQ User'} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label className="text-caption">Email</label>
                <input 
                  type="email" 
                  className="profile-input text-body" 
                  value={currentUser?.email || 'user@civlynq.in'} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label className="text-caption">Phone Number</label>
                <input 
                  type="tel" 
                  className="profile-input text-body" 
                  value={currentUser?.phoneNumber || '+91 98765 43210'} 
                  readOnly 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drafts & Documents Row */}
        <div className="profile-list-item-container">
          <button 
            className="profile-list-row" 
            onClick={() => toggleRow('drafts')}
          >
            <FileText size={20} className="row-icon" />
            <span className="text-label row-label">Drafts &amp; Documents</span>
            <ChevronRight 
              size={20} 
              className={`row-chevron ${expandedRow === 'drafts' ? 'expanded' : ''}`} 
            />
          </button>
          
          <div className={`profile-expandable-content ${expandedRow === 'drafts' ? 'open' : ''}`}>
            <div className="expandable-inner">
              {loadingDrafts ? (
                <p className="text-body" style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>Loading drafts...</p>
              ) : drafts.length === 0 ? (
                <EmptyState
                  icon={<FileText size={32} />}
                  title="No drafts yet"
                  description="Draft documents from your Roadmap steps."
                />
              ) : (
                <div className="drafts-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', width: '100%', padding: 'var(--spacing-sm)' }}>
                  {drafts.map((draft) => (
                    <Card key={draft.id} className="draft-item" style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 className="text-label" style={{ margin: 0, fontWeight: '600' }}>{draft.title}</h4>
                        <span className="text-caption" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                          {new Date(draft.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-caption" style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                        Category: {draft.templateType}
                      </p>
                      <div className="draft-preview-container" style={{ position: 'relative' }}>
                        <pre className="text-body" style={{ 
                          whiteSpace: 'pre-wrap', 
                          fontFamily: 'inherit',
                          background: 'var(--color-bg-secondary)', 
                          padding: 'var(--spacing-sm)', 
                          borderRadius: 'var(--radius-sm)',
                          maxHeight: '150px',
                          overflowY: 'auto',
                          fontSize: '0.85rem',
                          margin: 'var(--spacing-xs) 0 0 0',
                          border: '1px solid var(--color-border-light)'
                        }}>
                          {draft.content}
                        </pre>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Log out Row */}
        <div className="profile-list-item-container last-item">
          <button 
            className="profile-list-row logout-row" 
            onClick={() => toggleRow('logout')}
          >
            <span className="text-label row-label destructive-text">Log out</span>
          </button>
          
          <div className={`profile-expandable-content ${expandedRow === 'logout' ? 'open' : ''}`}>
            <div className="expandable-inner confirm-logout-box">
              <p className="text-body logout-prompt">Are you sure you want to log out?</p>
              <div className="logout-actions">
                <Button variant="ghost" onClick={() => toggleRow('logout')}>Cancel</Button>
                <Button variant="destructive" onClick={handleLogout}>Confirm</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
