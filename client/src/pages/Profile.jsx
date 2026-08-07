import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, User, FileText, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserDrafts } from '../services/api';

export default function Profile() {
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

  // Dummy member date
  const memberDate = 'August 2026';

  return (
    <div className="bg-bone min-h-screen">
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Avatar Section */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 rounded-full bg-brand-green text-white font-display font-bold text-3xl flex items-center justify-center overflow-hidden">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials()
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-card cursor-pointer hover:bg-brand-cream transition-colors">
            <Pencil size={14} className="text-brand-ink" />
          </div>
        </div>

        <h1 className="font-display font-bold text-2xl text-brand-ink text-center">
          {currentUser?.displayName || 'CivLynQ User'}
        </h1>
        <p className="text-sm text-brand-ink-mute text-center mt-1">
          Member since {memberDate}
        </p>

        {/* Options List */}
        <div className="mt-8 bg-white rounded-2xl shadow-card border border-brand-cream-dk divide-y divide-brand-cream-dk overflow-hidden">
          
          {/* Personal Info Row */}
          <div>
            <button 
              className="w-full h-14 flex items-center gap-3 px-5 hover:bg-brand-cream transition cursor-pointer"
              onClick={() => toggleRow('personal')}
            >
              <User size={20} className="text-brand-green flex-shrink-0" aria-hidden="true" />
              <span className="font-sans text-[15px] font-medium text-brand-ink flex-1 text-left">Personal Info</span>
              <ChevronRight size={20} className={`text-brand-ink-mute transition-transform ${expandedRow === 'personal' ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
            {expandedRow === 'personal' && (
              <div className="px-5 pb-5 pt-2 bg-brand-cream/30 space-y-4 border-t border-brand-cream-dk">
                <div>
                  <label className="block text-xs text-brand-ink-mute mb-1">Full Name</label>
                  <input type="text" readOnly value={currentUser?.displayName || 'CivLynQ User'} className="w-full bg-white border border-brand-cream-dk rounded-lg px-3 py-2 text-sm text-brand-ink" />
                </div>
                <div>
                  <label className="block text-xs text-brand-ink-mute mb-1">Email</label>
                  <input type="email" readOnly value={currentUser?.email || 'user@civlynq.in'} className="w-full bg-white border border-brand-cream-dk rounded-lg px-3 py-2 text-sm text-brand-ink" />
                </div>
              </div>
            )}
          </div>

          {/* Drafts Row */}
          <div>
            <button 
              className="w-full h-14 flex items-center gap-3 px-5 hover:bg-brand-cream transition cursor-pointer"
              onClick={() => toggleRow('drafts')}
            >
              <FileText size={20} className="text-brand-green flex-shrink-0" aria-hidden="true" />
              <span className="font-sans text-[15px] font-medium text-brand-ink flex-1 text-left">Drafts & Documents</span>
              <ChevronRight size={20} className={`text-brand-ink-mute transition-transform ${expandedRow === 'drafts' ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
            {expandedRow === 'drafts' && (
              <div className="px-5 pb-5 pt-2 bg-brand-cream/30 border-t border-brand-cream-dk">
                {loadingDrafts ? (
                  <p className="text-sm text-brand-ink-mute text-center py-4">Loading drafts...</p>
                ) : drafts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-brand-ink-mute">
                    <FileText size={24} className="mb-2 opacity-50" />
                    <p className="text-sm">No drafts yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {drafts.map(draft => (
                      <div key={draft.id} className="bg-white border border-brand-cream-dk rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-sm text-brand-ink">{draft.title}</h4>
                          <span className="text-xs text-brand-ink-mute">{new Date(draft.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-brand-ink-mute mb-2">Category: {draft.templateType}</p>
                        <pre className="text-xs bg-bone p-2 rounded border border-brand-cream-dk whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {draft.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Log Out Row */}
          <button 
            className="w-full h-14 flex items-center gap-3 px-5 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={20} className="text-brand-orange-dk flex-shrink-0" aria-hidden="true" />
            <span className="font-sans text-[15px] font-semibold text-brand-orange-dk flex-1 text-left">Log out</span>
          </button>
          
        </div>
      </div>
    </div>
  );
}
