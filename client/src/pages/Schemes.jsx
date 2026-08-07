import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import { schemes } from '../data/schemes';

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
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="font-display font-bold text-3xl text-brand-ink mb-6">Schemes</h1>
          <SearchBar 
            placeholder="Search schemes"
            onSubmit={handleSearch}
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, index) => (
              <Link 
                key={scheme.id} 
                to={`/schemes/${scheme.id}`} 
                className="bg-white rounded-card border border-brand-cream-dk shadow-card hover:shadow-card-hov hover:-translate-y-0.5 transition-all duration-200 p-5 flex items-start gap-4 group"
              >
                <div className="w-8 h-8 rounded-full bg-brand-orange-lt text-brand-orange font-display font-semibold flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="font-display font-semibold text-lg text-brand-ink">{scheme.name}</h2>
                  <p className="text-sm text-brand-ink-mute mt-1">{scheme.description}</p>
                  <div className="inline-block mt-3 px-3 py-1 bg-brand-green-accent/15 text-brand-green font-medium text-xs rounded-pill">
                    {scheme.category || 'Government'}
                  </div>
                </div>
                <ChevronRight 
                  size={20} 
                  className="text-brand-ink-mute self-center group-hover:text-brand-orange transition-colors ml-2" 
                  aria-hidden="true" 
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-brand-ink-mute mb-4 text-center">No schemes match your search</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-sm font-medium text-brand-ink hover:text-brand-orange transition-colors"
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
