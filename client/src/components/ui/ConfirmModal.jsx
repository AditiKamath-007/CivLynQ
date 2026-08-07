import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, body, confirmText = "Delete", confirmStyle = "destructive" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-white rounded-2xl shadow-pop p-6 max-w-sm w-full z-10"
        >
          <h3 className="font-display font-semibold text-lg text-brand-ink">{title}</h3>
          <p className="text-sm text-brand-ink-mute mt-2 mb-5">{body}</p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-pill border border-brand-cream-dk bg-white text-brand-ink font-medium hover:bg-brand-cream transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`h-10 px-4 rounded-pill text-white font-semibold shadow-card transition-colors ${
                confirmStyle === 'destructive' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-brand-orange hover:bg-brand-orange-dk'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
