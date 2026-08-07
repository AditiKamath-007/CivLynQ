import React, { useState } from 'react';
import { X, Copy, Check, Loader2 } from 'lucide-react';
import Button from './Button';
import './DraftModal.css';

export default function DraftModal({ isOpen, onClose, title, draftText, loading }) {
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
          <button className="draft-modal-close" onClick={onClose} aria-label="Close">
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
            <pre className="draft-content-pre">{draftText}</pre>
          )}
        </div>

        <footer className="draft-modal-footer">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {!loading && (
            <Button
              variant="primary"
              icon={copied ? Check : Copy}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy Draft'}
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
