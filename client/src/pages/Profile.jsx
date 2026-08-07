import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, User, FileText, ChevronRight, Compass } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (row) => {
    setExpandedRow(expandedRow === row ? null : row);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <div className="profile-avatar">
            CU
          </div>
          <Button 
            variant="ghost" 
            className="edit-avatar-btn" 
            aria-label="Edit profile"
          >
            <Pencil size={16} />
          </Button>
        </div>
        <h1 className="text-h1 profile-name">CivLynQ User</h1>
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
                <input type="text" className="profile-input text-body" value="CivLynQ User" readOnly />
              </div>
              <div className="form-group">
                <label className="text-caption">Email</label>
                <input type="email" className="profile-input text-body" value="user@civlynq.in" readOnly />
              </div>
              <div className="form-group">
                <label className="text-caption">Phone Number</label>
                <input type="tel" className="profile-input text-body" value="+91 98765 43210" readOnly />
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
              <EmptyState
                icon={<FileText size={32} />}
                title="No drafts yet"
                description="Draft documents from your Roadmap steps."
              />
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
