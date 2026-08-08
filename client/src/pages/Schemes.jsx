import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Landmark, Heart, Briefcase, Coins, GraduationCap, Shield, Tractor, ChevronDown, Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from '../components/ui/SearchBar';
import EligibilityCalculator from '../components/EligibilityCalculator';
import { checkEligibility } from '../services/api';
import { schemes } from '../data/schemes';
import { getSchemeIcon } from '../lib/schemeIcons';

function getCategoryColor(scheme) {
  const category = scheme.category?.toLowerCase() || '';
  if (category === 'farmers') return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
  if (category === 'health & insurance') return { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100' };
  if (category === 'business & loans') return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
  if (category === 'women & girls' || category === 'youth & students') return { bg: 'bg-violet-50', text: 'text-violet-500', border: 'border-violet-100' };
  if (category === 'seniors') return { bg: 'bg-sky-50', text: 'text-sky-500', border: 'border-sky-100' };
  if (category === 'housing') return { bg: 'bg-orange-50', text: 'text-brand-orange', border: 'border-orange-100' };
  
  // Fallbacks for backward compatibility if category is missing
  const name = scheme.name?.toLowerCase() || '';
  if (name.includes('kisan') || name.includes('fasal') || name.includes('ujjwala')) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
  if (name.includes('ayushman') || name.includes('suraksha')) return { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100' };
  if (name.includes('mudra') || name.includes('stand-up') || name.includes('jan dhan')) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
  
  return { bg: 'bg-brand-orange-lt', text: 'text-brand-orange', border: 'border-brand-cream-dk' };
}

export default function Schemes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [eligibleIds, setEligibleIds] = useState(null);
  
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    occupation: '',
    category: '',
    income: ''
  });

  const categories = [
    { name: 'All', keywords: [] },
    { name: 'Farmers', keywords: ['kisan', 'fasal', 'farmer', 'agriculture', 'crop'] },
    { name: 'Women & Girls', keywords: ['ujjwala', 'sukanya', 'women', 'girl'] },
    { name: 'Seniors', keywords: ['pension', 'atal', '60'] },
    { name: 'Youth & Students', keywords: ['skill', 'youth', 'student', 'pmkvy'] },
    { name: 'Health & Insurance', keywords: ['ayushman', 'health', 'bima', 'suraksha', 'insurance'] },
    { name: 'Business & Loans', keywords: ['mudra', 'stand-up', 'loan', 'business', 'enterprise'] },
    { name: 'Housing', keywords: ['awas', 'housing', 'home'] },
  ];

  const handleSearch = (query) => {
    if (typeof query === 'string') {
      setSearchQuery(query.toLowerCase());
    } else if (query?.target) {
      setSearchQuery(query.target.value.toLowerCase());
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    if (eligibleIds !== null) {
       if (!eligibleIds.includes(scheme.id)) return false;
    }

    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery) ||
                          scheme.description.toLowerCase().includes(searchQuery);
    
    if (selectedCategory === 'All') return matchesSearch;

    const categoryKeywords = categories.find(c => c.name === selectedCategory)?.keywords || [];
    const searchString = `${scheme.name.toLowerCase()} ${scheme.description.toLowerCase()} ${scheme.eligibility.join(' ').toLowerCase()}`;
    const matchesCategory = categoryKeywords.some(kw => searchString.includes(kw));

    return matchesSearch && matchesCategory;
  });

  const handleEligibilityComplete = (answers) => {
    // Simple mock filtering
    let filtered = schemes.filter(scheme => {
      let matches = true;
      const desc = (scheme.description + ' ' + scheme.eligibility.join(' ')).toLowerCase();
      
      // Rule 1: Income
      if (answers.income === 'above-10l' && desc.includes('low income')) matches = false;
      
      // Rule 2: Gender
      if (answers.gender === 'Male' && desc.includes('women')) matches = false;
      
      // Rule 3: Category
      if (answers.category === 'General' && (desc.includes('sc/st') || desc.includes('obc'))) matches = false;
      
      return matches;
    });

    const mockIds = filtered.slice(0, 4).map(s => s.id);
    setEligibleIds(mockIds);
    setIsCalcOpen(false);
    alert(`Showing ${mockIds.length} schemes for you.`);
  };

  return (
    <div className="bg-bone min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-sm font-medium text-brand-orange mb-1 tracking-wide uppercase">Explore</p>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-ink mb-2">
                Government Schemes
              </h1>
              <p className="text-[15px] text-brand-ink-mute max-w-2xl">
                Discover benefits, subsidies, and welfare programs you may be eligible for.
              </p>
            </div>
            
            <div>
              {eligibleIds !== null ? (
                <button 
                  onClick={() => setEligibleIds(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-cream-dk shadow-sm rounded-xl text-sm font-medium text-brand-ink hover:border-brand-orange-lt transition-colors"
                >
                  <X size={16} />
                  Clear Eligibility Filter
                </button>
              ) : (
                <button 
                  onClick={() => setIsCalcOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-orange to-[#F2994A] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles size={18} />
                  Check Eligibility
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3 w-full max-w-3xl mx-auto">
            <div className="flex-1 flex items-center gap-2 bg-white border border-brand-cream-dk rounded-pill px-2 py-2 shadow-card hover:shadow-card-hov focus-within:border-brand-orange focus-within:shadow-pop transition-all duration-200 relative">
              <Search size={18} className="text-brand-ink-mute flex-shrink-0 ml-2" />
              
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 bg-brand-cream hover:bg-brand-orange-lt border border-brand-cream-dk text-brand-ink text-sm font-sans font-medium px-3 h-9 rounded-pill transition cursor-pointer flex-shrink-0"
              >
                <span>{selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
                <ChevronDown size={14} className={`text-brand-ink-mute transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <input
                type="text"
                placeholder="Search by scheme name or keyword…"
                value={searchQuery}
                onChange={handleSearch}
                className="flex-1 bg-transparent outline-none px-3 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink-mute min-w-[120px]"
              />

              <button
                type="button"
                className="w-10 h-10 rounded-full bg-brand-orange hover:bg-brand-orange-dk text-white flex items-center justify-center transition shadow-card flex-shrink-0"
              >
                <ArrowRight size={18} />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <div className="absolute z-20 top-full left-0 mt-2 w-full sm:w-64 bg-white border border-brand-cream-dk rounded-xl shadow-card overflow-hidden">
                    <ul className="max-h-64 overflow-y-auto p-1.5 flex flex-col gap-0.5">
                      {categories.map(category => {
                        const dummyScheme = { category: category.name === 'All' ? '' : category.name };
                        const colors = category.name === 'All' 
                          ? { bg: 'bg-brand-cream-dk', text: 'text-brand-ink-mute' }
                          : getCategoryColor(dummyScheme);
                          
                        const dotColor = category.name === 'All' 
                          ? 'bg-brand-ink-mute' 
                          : colors.text.replace('text-', 'bg-');

                        return (
                          <li
                            key={category.name}
                            onClick={() => {
                              setSelectedCategory(category.name);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              selectedCategory === category.name 
                                ? 'bg-brand-orange-lt text-brand-ink font-semibold' 
                                : 'hover:bg-brand-cream/50 text-brand-ink font-medium'
                            }`}
                          >
                            <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                            <span className="text-sm">
                              {category.name === 'All' ? 'All Categories' : category.name}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, index) => {
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
                      <div className={`w-10 h-10 rounded-xl bg-brand-orange-lt flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        {React.createElement(getSchemeIcon(scheme.name), { size: 20, className: "text-brand-orange" })}
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

      {/* Eligibility Modal */}
      <EligibilityCalculator 
        isOpen={isCalcOpen} 
        onClose={() => setIsCalcOpen(false)} 
        onComplete={handleEligibilityComplete} 
      />
    </div>
  );
}
