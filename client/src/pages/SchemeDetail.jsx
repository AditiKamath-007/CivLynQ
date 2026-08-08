import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Gift, ExternalLink, Landmark, Heart, Coins, GraduationCap, Shield, Tractor, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { schemes } from '../data/schemes';

function getCategoryIcon(scheme) {
  const name = scheme.name?.toLowerCase() || '';
  if (name.includes('kisan') || name.includes('fasal') || name.includes('ujjwala')) return Tractor;
  if (name.includes('ayushman') || name.includes('suraksha')) return Heart;
  if (name.includes('mudra') || name.includes('stand-up') || name.includes('jan dhan')) return Coins;
  if (name.includes('skill') || name.includes('sukanya')) return GraduationCap;
  if (name.includes('bima') || name.includes('pension')) return Shield;
  if (name.includes('awas')) return Landmark;
  return Landmark;
}

function getCategoryColor(scheme) {
  const name = scheme.name?.toLowerCase() || '';
  if (name.includes('kisan') || name.includes('fasal') || name.includes('ujjwala')) return { bg: 'bg-emerald-50', text: 'text-emerald-600', accent: '#10b981' };
  if (name.includes('ayushman') || name.includes('suraksha')) return { bg: 'bg-rose-50', text: 'text-rose-500', accent: '#f43f5e' };
  if (name.includes('mudra') || name.includes('stand-up') || name.includes('jan dhan')) return { bg: 'bg-amber-50', text: 'text-amber-600', accent: '#d97706' };
  if (name.includes('skill') || name.includes('sukanya')) return { bg: 'bg-violet-50', text: 'text-violet-500', accent: '#8b5cf6' };
  if (name.includes('bima') || name.includes('pension')) return { bg: 'bg-sky-50', text: 'text-sky-500', accent: '#0ea5e9' };
  if (name.includes('awas')) return { bg: 'bg-orange-50', text: 'text-brand-orange', accent: '#E8702A' };
  return { bg: 'bg-brand-orange-lt', text: 'text-brand-orange', accent: '#E8702A' };
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08 },
  }),
};

export default function SchemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const scheme = schemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <div className="bg-bone min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-brand-ink mb-2">Scheme not found</h2>
          <p className="text-brand-ink-mute text-sm mb-6">The scheme you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/schemes')}
            className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-dk text-white rounded-pill font-semibold transition-colors"
          >
            Back to Schemes
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = getCategoryIcon(scheme);
  const colors = getCategoryColor(scheme);

  return (
    <div className="bg-bone min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-ink-mute hover:text-brand-ink font-medium text-sm mb-6 group transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Schemes
        </button>

        {/* Hero Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6 sm:p-8 mb-6 relative overflow-hidden"
        >
          {/* Decorative gradient top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, ${colors.accent}, #7AB55A)` }} />
          
          <div className="flex items-start gap-4 mt-1">
            <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}>
              <IconComponent size={28} />
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-ink leading-tight">
                {scheme.name}
              </h1>
              <p className="text-[15px] text-brand-ink-mute mt-2 leading-relaxed">
                {scheme.description}
              </p>
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${colors.bg} ${colors.text} font-medium text-xs rounded-pill uppercase tracking-wider`}>
                  {scheme.category || 'Government Scheme'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-5">
          
          {/* Eligibility */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6"
          >
            <h2 className="font-display font-bold text-lg text-brand-ink flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Check size={16} className="text-emerald-500" />
              </div>
              Eligibility
            </h2>
            <ul className="space-y-3">
              {scheme.eligibility.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-green-accent dark:bg-brand-green-accent-dark/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-brand-green-accent dark:text-brand-green-accent-dark" />
                  </div>
                  <span className="text-[15px] text-brand-ink leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Benefits */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6"
          >
            <h2 className="font-display font-bold text-lg text-brand-ink flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-orange-lt flex items-center justify-center">
                <Gift size={16} className="text-brand-orange" />
              </div>
              Benefits
            </h2>
            <ul className="space-y-3">
              {scheme.benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-orange-lt flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Gift size={12} className="text-brand-orange" />
                  </div>
                  <span className="text-[15px] text-brand-ink leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* How to Apply */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6"
          >
            <h2 className="font-display font-bold text-lg text-brand-ink mb-4">How to Apply</h2>
            <ol className="space-y-4">
              {scheme.howToApply.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-orange-lt text-brand-orange font-display font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-[15px] text-brand-ink leading-relaxed pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Official Links */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6"
          >
            <h2 className="font-display font-bold text-lg text-brand-ink mb-4">Official Links</h2>
            <div className="flex flex-wrap gap-3">
              {scheme.officialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange-lt hover:bg-brand-orange text-brand-orange hover:text-white rounded-pill font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-card-hov group"
                >
                  {link.label}
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Start Journey CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-brand-green dark:from-brand-green-dark to-brand-green-lt dark:to-brand-green-lt-dark rounded-2xl p-6 text-center text-white"
        >
          <p className="font-display font-bold text-lg mb-1">Ready to apply?</p>
          <p className="text-sm text-white/80 mb-4">Let CivLynQ guide you step-by-step through the application process.</p>
          <button
            onClick={() => navigate(`/roadmap/questions?goal=${encodeURIComponent(scheme.name + ' application')}`)}
            className="px-6 py-2.5 bg-white text-brand-green dark:text-brand-green-dark font-display font-bold rounded-pill hover:bg-brand-cream transition-colors shadow-card"
          >
            Start Journey →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
