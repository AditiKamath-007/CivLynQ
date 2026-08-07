import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Gift, ExternalLink } from 'lucide-react';
import { schemes } from '../data/schemes';

export default function SchemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const scheme = schemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-brand-ink mb-2">Scheme not found</h2>
          <button onClick={() => navigate('/schemes')} className="px-6 py-2 bg-brand-orange text-white rounded-pill font-medium">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <button 
              className="p-2 rounded-full hover:bg-brand-cream text-brand-ink transition-colors"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-display font-bold text-brand-ink">{scheme.name}</h1>
          </div>
          <div className="ml-14">
            <span className="inline-block px-3 py-1 bg-brand-green-accent/20 text-brand-green font-medium text-sm rounded-pill">
              {scheme.category || 'Government'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6">
            <h2 className="text-xl font-display font-bold text-brand-ink mb-4 border-b border-brand-cream-dk pb-3">Eligibility</h2>
            <ul className="space-y-3">
              {scheme.eligibility.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="text-brand-green mt-1 flex-shrink-0" size={18} />
                  <span className="text-[15px] text-brand-ink-mute">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6">
            <h2 className="text-xl font-display font-bold text-brand-ink mb-4 border-b border-brand-cream-dk pb-3">Benefits</h2>
            <ul className="space-y-3">
              {scheme.benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Gift className="text-brand-orange mt-1 flex-shrink-0" size={18} />
                  <span className="text-[15px] text-brand-ink-mute">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6 md:col-span-2">
            <h2 className="text-xl font-display font-bold text-brand-ink mb-4 border-b border-brand-cream-dk pb-3">How to Apply</h2>
            <ol className="space-y-4">
              {scheme.howToApply.map((step, i) => (
                <li key={i} className="flex items-start gap-4 bg-brand-cream/30 p-4 rounded-xl">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-green text-white font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-brand-ink font-medium mt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-brand-cream-dk p-6 md:col-span-2">
            <h2 className="text-xl font-display font-bold text-brand-ink mb-4 border-b border-brand-cream-dk pb-3">Official Links</h2>
            <div className="flex flex-wrap gap-4">
              {scheme.officialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange-lt text-brand-orange hover:bg-brand-orange hover:text-white rounded-pill font-medium text-sm transition-colors"
                >
                  {link.label}
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
