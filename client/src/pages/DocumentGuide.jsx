import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getDocumentGuide } from '../services/api';

export default function DocumentGuide() {
  const { docId } = useParams();
  const navigate = useNavigate();
  
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const result = await getDocumentGuide(docId);
        if (result && result.success && result.guide) {
          setGuide(result.guide);
        } else {
          setGuide(null);
        }
      } catch (error) {
        console.error("Failed to fetch document guide", error);
        setGuide(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (docId) {
      fetchGuide();
    }
  }, [docId]);

  if (loading) {
    return (
      <div className="bg-bone min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin"></div>
          <p className="text-sm text-brand-ink-mute">Getting instructions for {docId}...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="bg-bone min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-brand-ink mb-4">Instructions not available</h2>
          <p className="text-sm text-brand-ink-mute mb-6">Please check the official government portal.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-brand-orange hover:bg-brand-orange-dk text-white rounded-pill font-semibold shadow-card transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bone min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Top Row */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-brand-ink-mute hover:text-brand-orange font-sans transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Roadmap
        </button>
        
        <h1 className="font-display font-bold text-3xl text-brand-ink mt-2">
          How to get: {docId}
        </h1>
        <p className="text-sm text-brand-ink-mute mt-1">
          Step-by-step guide to obtain this document.
        </p>

        {/* Steps Content */}
        <div className="mt-8 space-y-3">
          {guide.steps && guide.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-white border border-brand-cream-dk rounded-card p-5 shadow-card">
              <div className="w-10 h-10 rounded-full bg-brand-orange-lt text-brand-orange font-display font-bold flex items-center justify-center text-base flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-base text-brand-ink font-sans leading-relaxed pt-2">
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* External Link Card */}
        {guide.link && (
          <div className="bg-white border border-brand-cream-dk rounded-card p-6 shadow-card mt-6">
            <h2 className="font-display font-semibold text-lg text-brand-ink">Official Source</h2>
            <p className="text-sm text-brand-ink-mute mt-2">
              For the most accurate and up-to-date information, visit the official government portal.
            </p>
            <button
              onClick={() => {
                const url = guide.link;
                const absoluteUrl = url.startsWith('http') ? url : `https://${url}`;
                window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center gap-2 mt-4 bg-brand-orange hover:bg-brand-orange-dk text-white font-display font-semibold px-5 h-11 rounded-pill shadow-card transition"
            >
              <ExternalLink size={16} /> Apply / Renew Here
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
