import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompletionModal({ isOpen }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-pop p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="mx-auto w-20 flex justify-center mb-4"
          >
            <CircleCheckBig size={72} className="text-brand-green-accent dark:text-brand-green-accent-dark" aria-hidden="true" />
          </motion.div>
          
          <h2 className="font-display font-bold text-2xl text-brand-ink mt-4">Journey complete!</h2>
          <p className="text-sm text-brand-ink-mute mt-2">
            Great work. All your steps are saved to your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="h-11 px-6 rounded-pill bg-brand-orange hover:bg-brand-orange-dk text-white font-semibold font-display shadow-card hover:shadow-card-hov transition-all duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="h-11 px-6 rounded-pill border border-brand-cream-dk bg-white text-brand-ink font-medium hover:bg-brand-cream transition-colors"
            >
              Start Another Journey
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
