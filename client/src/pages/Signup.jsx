import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, login, user } = useAuth(); // login is still used for Google auth
  const { setLanguage } = useLanguage();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setSubmitting(true);
    try {
      await signup(email, password, fullName);
      setShowLanguageModal(true);
    } catch (err) {
      console.error('Failed to sign up:', err);
      const code = err?.code || '';
      if (code.includes('email-already-in-use')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (code.includes('weak-password')) {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to create an account. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    try {
      await login();
      // After successful Google login, navigate to home
      navigate('/');
    } catch (err) {
      console.error('Failed to sign up with Google:', err);
      setError('Google sign-up failed. Please try again.');
    }
  };

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden md:flex md:w-1/2 bg-brand-green p-12 flex-col justify-between relative overflow-hidden">
        <h1 className="text-white font-display font-extrabold text-4xl relative z-10">CIVLYNQ</h1>
        <h2 className="text-white/90 font-display text-2xl font-medium leading-snug max-w-sm relative z-10">
          "Navigate government processes with confidence."
        </h2>
        
        {/* Decorative Dots */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.12]" 
          style={{
            backgroundImage: 'radial-gradient(#E8702A 2px, transparent 2px)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-bone flex items-center justify-center p-8 min-h-screen relative">
        <AnimatePresence>
          {showLanguageModal ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8 z-10 relative"
            >
              <div className="w-12 h-12 bg-brand-orange-lt rounded-full flex items-center justify-center mb-6">
                <Globe className="text-brand-orange" size={24} />
              </div>
              <h2 className="font-display font-bold text-2xl text-brand-ink">Choose Language</h2>
              <p className="text-sm text-brand-ink-mute mt-1 mb-6">Select your preferred language. You can change this later in your profile.</p>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="w-full h-12 flex items-center justify-between px-4 rounded-xl border border-brand-cream-dk hover:border-brand-orange hover:bg-brand-orange-lt transition-colors group"
                  >
                    <span className="font-sans text-brand-ink font-medium">{lang.name}</span>
                    <ChevronRight size={18} className="text-brand-ink-mute group-hover:text-brand-orange transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8 absolute"
            >
              <h2 className="font-display font-bold text-2xl text-brand-ink">Create your account.</h2>
              <p className="text-sm text-brand-ink-mute mt-1 mb-6">It takes less than a minute.</p>

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-ink-mute">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 w-full rounded-lg border border-brand-cream-dk bg-white pl-10 pr-3 font-sans text-[15px] focus:border-brand-orange focus:shadow-pop outline-none transition"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-ink-mute">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-lg border border-brand-cream-dk bg-white pl-10 pr-3 font-sans text-[15px] focus:border-brand-orange focus:shadow-pop outline-none transition"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-ink-mute">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-brand-cream-dk bg-white pl-10 pr-10 font-sans text-[15px] focus:border-brand-orange focus:shadow-pop outline-none transition"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-ink-mute hover:text-brand-ink transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 mt-2 bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold rounded-pill shadow-card transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-brand-cream-dk"></div>
                <span className="px-3 text-xs text-brand-ink-mute">or</span>
                <div className="flex-1 h-px bg-brand-cream-dk"></div>
              </div>

              <button
                onClick={handleGoogleSignup}
                className="w-full h-11 border border-brand-cream-dk bg-white hover:bg-brand-orange-lt text-brand-ink font-medium rounded-pill flex items-center justify-center gap-2 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-sm text-brand-ink-mute text-center mt-5">
                Already have an account? <Link to="/login" className="text-brand-orange font-semibold hover:underline">Sign in</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
