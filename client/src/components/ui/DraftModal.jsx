import React, { useState } from 'react';
import { X, Copy, Check, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-white rounded-2xl shadow-pop flex flex-col max-w-2xl w-full max-h-[90vh] z-10"
        >
          <header className="flex items-center justify-between p-6 border-b border-brand-cream-dk">
            <h2 className="font-display font-semibold text-lg text-brand-ink">Draft: {title}</h2>
            <button 
              className="text-brand-ink-mute hover:text-brand-ink transition-colors disabled:opacity-50" 
              onClick={onClose} 
              disabled={isSaving}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 bg-bone/30">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-brand-ink-mute">
                <Loader2 size={36} className="animate-spin mb-4 text-brand-orange" />
                <p className="text-[15px]">Generating document draft with AI...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 h-full min-h-[200px]">
                {saved && (
                  <div className="bg-brand-green-accent dark:bg-brand-green-accent-dark/10 border border-brand-green-accent dark:border-brand-green-accent-dark text-brand-green dark:text-brand-green-dark rounded-lg p-3 flex items-center gap-2 text-sm font-medium">
                    <Check size={18} /> Draft saved successfully to your Profile!
                  </div>
                )}
                
                {onChange ? (
                  <textarea
                    className="flex-1 w-full p-4 rounded-xl border border-brand-cream-dk bg-white text-[15px] font-sans text-brand-ink leading-relaxed resize-y focus:outline-none focus:border-brand-orange focus:shadow-pop transition-all min-h-[300px]"
                    value={draftText}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isSaving || saved}
                  />
                ) : (
                  <pre className="flex-1 w-full p-4 rounded-xl border border-brand-cream-dk bg-white text-[15px] font-sans text-brand-ink whitespace-pre-wrap leading-relaxed min-h-[300px]">
                    {draftText}
                  </pre>
                )}
              </div>
            )}
          </div>

          <footer className="p-6 border-t border-brand-cream-dk flex items-center justify-between bg-white rounded-b-2xl">
            <button 
              className="h-10 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink font-medium hover:bg-brand-cream transition-colors disabled:opacity-50" 
              onClick={onClose} 
              disabled={isSaving}
            >
              Close
            </button>
            
            {!loading && (
              <div className="flex items-center gap-3">
                <button
                  className="h-10 px-4 rounded-pill border border-brand-cream-dk bg-white hover:bg-brand-orange-lt text-brand-ink font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  onClick={handleCopy}
                  disabled={isSaving}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Draft'}
                </button>
                {onSave && !saved && (
                  <button
                    className="h-10 px-4 rounded-pill bg-brand-orange hover:bg-brand-orange-dk text-white font-semibold flex items-center gap-2 shadow-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onSave}
                    disabled={isSaving || !draftText}
                  >
                    <Save size={16} />
                    {isSaving ? 'Saving...' : 'Save to Profile'}
                  </button>
                )}
              </div>
            )}
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
