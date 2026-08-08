import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, User, FileText, ChevronRight, LogOut, Shield, X, Check, Globe, Moon, Sun } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getUserDrafts, checkConsent, saveConsent } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile } = useAuth();
  const { language, setLanguage, currentLanguageName } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  
  const [expandedRow, setExpandedRow] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [hasConsented, setHasConsented] = useState(false);

  // Avatar Crop State
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const imgRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

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

      checkConsent()
        .then(res => {
          if (res.success) {
            setHasConsented(res.consented);
          }
        })
        .catch(err => console.error('Error checking consent:', err));
    }
  }, [currentUser]);

  const handleToggleConsent = async () => {
    const newValue = !hasConsented;
    setHasConsented(newValue); // Optimistic update
    try {
      await saveConsent(newValue);
    } catch (error) {
      console.error('Failed to update consent:', error);
      setHasConsented(!newValue); // Revert on failure
    }
  };

  const toggleRow = (row) => {
    setExpandedRow(expandedRow === row ? null : row);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signup');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    // reset input
    e.target.value = '';
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropArea = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 90 },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(cropArea);
  };

  const saveAvatar = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsSavingAvatar(true);
    
    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      
      const pixelRatio = window.devicePixelRatio;
      canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);
      
      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';
      
      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;
      
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.9);
      await updateProfile({ photoURL: base64Image });
      setIsCropModalOpen(false);
    } catch (error) {
      console.error('Failed to save avatar:', error);
      alert('Failed to save avatar. Please try again.');
    } finally {
      setIsSavingAvatar(false);
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
          <div className="w-24 h-24 rounded-full bg-brand-green dark:bg-brand-green-dark text-white font-display font-bold text-3xl flex items-center justify-center overflow-hidden">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials()
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-card cursor-pointer hover:bg-brand-cream transition-colors border border-brand-cream-dk"
            aria-label="Change Avatar"
          >
            <Pencil size={14} className="text-brand-ink" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onSelectFile}
            className="hidden"
          />
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
              <User size={20} className="text-brand-green dark:text-brand-green-dark flex-shrink-0" aria-hidden="true" />
              <span className="font-sans text-[15px] font-medium text-brand-ink flex-1 text-left">Personal Info</span>
              <ChevronRight size={20} className={`text-brand-ink-mute transition-transform ${expandedRow === 'personal' ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
            {expandedRow === 'personal' && (
              <div className="px-5 pb-5 pt-2 bg-brand-cream/30 space-y-4 border-t border-brand-cream-dk">
                <div>
                  <label className="block text-xs text-brand-ink-mute mb-1">Full Name</label>
                  <input type="text" readOnly value={currentUser?.displayName || 'CivLynQ User'} className="w-full bg-white border border-brand-cream-dk rounded-lg px-3 py-2 text-sm text-brand-ink outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-brand-ink-mute mb-1">Email</label>
                  <input type="email" readOnly value={currentUser?.email || 'user@civlynq.in'} className="w-full bg-white border border-brand-cream-dk rounded-lg px-3 py-2 text-sm text-brand-ink outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* Language Preference Row */}
          <div>
            <button 
              className="w-full h-14 flex items-center gap-3 px-5 hover:bg-brand-cream transition cursor-pointer"
              onClick={() => toggleRow('language')}
            >
              <Globe size={20} className="text-brand-green dark:text-brand-green-dark flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-1 flex-col items-start justify-center">
                <span className="font-sans text-[15px] font-medium text-brand-ink leading-none">Language</span>
                <span className="font-sans text-xs text-brand-ink-mute mt-1">{currentLanguageName}</span>
              </div>
              <ChevronRight size={20} className={`text-brand-ink-mute transition-transform ${expandedRow === 'language' ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
            {expandedRow === 'language' && (
              <div className="px-5 pb-5 pt-2 bg-brand-cream/30 space-y-2 border-t border-brand-cream-dk max-h-64 overflow-y-auto">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); toggleRow(null); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                      language === lang.code 
                        ? 'border-brand-orange bg-brand-orange-lt' 
                        : 'border-brand-cream-dk bg-white hover:border-brand-orange hover:bg-brand-orange-lt'
                    }`}
                  >
                    <span className="font-sans text-[14px] font-medium text-brand-ink">{lang.name}</span>
                    {language === lang.code && <Check size={16} className="text-brand-orange" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Drafts Row */}
          <div>
            <button 
              className="w-full h-14 flex items-center gap-3 px-5 hover:bg-brand-cream transition cursor-pointer"
              onClick={() => toggleRow('drafts')}
            >
              <FileText size={20} className="text-brand-green dark:text-brand-green-dark flex-shrink-0" aria-hidden="true" />
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

          {/* Dark Mode Row */}
          <div>
            <div className="w-full h-14 flex items-center justify-between px-5 hover:bg-brand-cream transition">
              <div className="flex items-center gap-3">
                {isDark ? <Moon size={20} className="text-yellow-400 flex-shrink-0" /> : <Sun size={20} className="text-brand-orange flex-shrink-0" />}
                <span className="font-sans text-[15px] font-medium text-brand-ink">Dark Mode</span>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-brand-orange' : 'bg-brand-cream-dk'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* AI Drafter Permissions Row */}
          <div>
            <div className="w-full h-14 flex items-center justify-between px-5 hover:bg-brand-cream transition">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-brand-orange flex-shrink-0" aria-hidden="true" />
                <span className="font-sans text-[15px] font-medium text-brand-ink">AI Drafter Permissions</span>
              </div>
              <button 
                onClick={handleToggleConsent}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasConsented ? 'bg-brand-green dark:bg-brand-green-dark' : 'bg-brand-cream-dk'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasConsented ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
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

      {/* Crop Modal */}
      {isCropModalOpen && !!imgSrc && (
        <div className="fixed inset-0 bg-brand-bone/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-pop p-6 max-w-sm w-full mx-4 flex flex-col items-center relative">
            <button 
              onClick={() => setIsCropModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-ink-mute hover:text-brand-ink transition-colors rounded-full hover:bg-brand-cream"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h2 className="font-display font-semibold text-xl text-brand-ink mb-6">Crop Avatar</h2>
            
            <div className="w-full max-h-[300px] overflow-hidden rounded-lg flex justify-center bg-brand-bone border border-brand-cream-dk mb-6">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-h-[300px] object-contain"
                />
              </ReactCrop>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setIsCropModalOpen(false)}
                className="flex-1 h-11 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink font-medium hover:bg-brand-cream transition font-sans"
              >
                Cancel
              </button>
              <button 
                onClick={saveAvatar}
                disabled={isSavingAvatar || !completedCrop?.width || !completedCrop?.height}
                className="flex-1 h-11 px-4 rounded-pill bg-brand-orange hover:bg-brand-orange-dk text-white font-semibold font-display shadow-card transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingAvatar ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check size={16} /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
