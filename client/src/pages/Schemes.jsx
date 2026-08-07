import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Landmark, Heart, Briefcase, Coins, GraduationCap, Shield, Tractor } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from '../components/ui/SearchBar';
import { schemes } from '../data/schemes';

const CATEGORY_ICONS = {
  'Agriculture': Tractor,
  'Health': Heart,
  'Finance': Coins,
  'Education': GraduationCap,
  'Insurance': Shield,
  'Employment': Briefcase,
  'Housing': Landmark,
};

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
  if (name.includes('kisan') || name.includes('fasal') || name.includes('ujjwala')) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
  if (name.includes('ayushman') || name.includes('suraksha')) return { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100' };
  if (name.includes('mudra') || name.includes('stand-up') || name.includes('jan dhan')) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
  if (name.includes('skill') || name.includes('sukanya')) return { bg: 'bg-violet-50', text: 'text-violet-500', border: 'border-violet-100' };
  if (name.includes('bima') || name.includes('pension')) return { bg: 'bg-sky-50', text: 'text-sky-500', border: 'border-sky-100' };
  if (name.includes('awas')) return { bg: 'bg-orange-50', text: 'text-brand-orange', border: 'border-orange-100' };
  return { bg: 'bg-brand-orange-lt', text: 'text-brand-orange', border: 'border-brand-cream-dk' };
}

export default function Schemes() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    if (typeof query === 'string') {
      setSearchQuery(query.toLowerCase());
    } else if (query?.target) {
      setSearchQuery(query.target.value.toLowerCase());
    }
  };

  const filteredSchemes = schemes.filter(scheme => 
    scheme.name.toLowerCase().includes(searchQuery) ||
    scheme.description.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="bg-bone min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-brand-orange mb-1 tracking-wide uppercase">Explore</p>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-ink">
                Government Schemes
              </h1>
            </div>
            <span className="hidden sm:inline-block text-sm text-brand-ink-mute font-medium bg-white border border-brand-cream-dk rounded-pill px-3 py-1">
              {schemes.length} schemes
            </span>
          </div>
          <p className="text-[15px] text-brand-ink-mute mt-2 max-w-2xl">
            Discover benefits, subsidies, and welfare programs you may be eligible for.
          </p>
          <div className="mt-6">
            <SearchBar 
              placeholder="Search by scheme name or keyword…"
              onSubmit={handleSearch}
            />
          </div>
        </header>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, index) => {
              const IconComponent = getCategoryIcon(scheme);
              const colors = getCategoryColor(scheme);
              
              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <Link 
                    to={`/schemes/${scheme.id}`} 
                    className="block bg-white rounded-2xl border border-brand-cream-dk shadow-card hover:shadow-card-hov hover:-translate-y-1 transition-all duration-250 p-5 group relative overflow-hidden"
                  >
                    {/* Decorative top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity`}
                      style={{ background: 'linear-gradient(90deg, #E8702A, #7AB55A)' }}
                    />

                    <div className="flex items-start gap-4">
                      {/* Icon Badge */}
                      <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <IconComponent size={22} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h2 className="font-display font-bold text-[16px] text-brand-ink group-hover:text-brand-orange transition-colors leading-snug">
                          {scheme.name}
                        </h2>
                        <p className="text-[13px] text-brand-ink-mute mt-1.5 line-clamp-2 leading-relaxed">
                          {scheme.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-cream-dk/60">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} ${colors.text} font-medium text-[11px] rounded-pill uppercase tracking-wider`}>
                        {scheme.category || 'Government'}
                      </span>
                      <div className="flex items-center gap-1 text-brand-ink-mute group-hover:text-brand-orange transition-colors">
                        <span className="text-[12px] font-medium">View details</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mb-4">
                <Search size={28} className="text-brand-ink-mute" />
              </div>
              <p className="text-brand-ink font-display font-semibold text-lg mb-1">No schemes found</p>
              <p className="text-sm text-brand-ink-mute mb-5">Try a different keyword or clear your search</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="px-5 py-2 text-sm font-semibold text-brand-orange bg-brand-orange-lt hover:bg-brand-orange hover:text-white rounded-pill transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
