import React, { useState } from 'react';
import { X, Copy, Check, Loader2, Save } from 'lucide-react';
import Button from './Button';
import './DraftModal.css';

export default function DraftModal({ 
  isOpen, 
  onClose, 
  title, 
  draftText, 
  onChange, 
  loading, 
  onSave, 
  isSaving, 
  saved 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (draftText) {
      navigator.clipboard.writeText(draftText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="draft-modal-overlay" onClick={onClose}>
      <div className="draft-modal" onClick={(e) => e.stopPropagation()}>
        <header className="draft-modal-header">
          <h2 className="draft-modal-title">Draft: {title}</h2>
          <button className="draft-modal-close" onClick={onClose} aria-label="Close" disabled={isSaving}>
            <X size={20} />
          </button>
        </header>

        <div className="draft-modal-body">
          {loading ? (
            <div className="draft-modal-loader">
              <Loader2 size={36} className="draft-modal-spinner" />
              <p className="text-body">Generating document draft with AI...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', height: '100%' }}>
              {saved && (
                <div style={{ 
                  backgroundColor: 'var(--olive-light, #ecfdf5)', 
                  border: '1px solid var(--olive, #10b981)', 
                  borderRadius: 'var(--radius-md, 8px)', 
                  padding: 'var(--space-3)',
                  color: 'var(--olive, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: '0.9rem'
                }}>
                  <Check size={18} /> Draft saved successfully to your Profile!
                </div>
              )}
              {onChange ? (
                <textarea
                  className="draft-content-textarea"
                  value={draftText}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={isSaving || saved}
                />
              ) : (
                <pre className="draft-content-pre">{draftText}</pre>
              )}
            </div>
          )}
        </div>

        <footer className="draft-modal-footer">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Close
          </Button>
          {!loading && (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant="secondary"
                icon={copied ? Check : Copy}
                onClick={handleCopy}
                disabled={isSaving}
              >
                {copied ? 'Copied!' : 'Copy Draft'}
              </Button>
              {onSave && !saved && (
                <Button
                  variant="primary"
                  icon={Save}
                  onClick={onSave}
                  disabled={isSaving || !draftText}
                >
                  {isSaving ? 'Saving...' : 'Save to Profile'}
                </Button>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
