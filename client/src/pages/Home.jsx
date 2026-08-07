import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import { procedures } from '../data/procedures';
import { getSchemeIcon } from '../lib/schemeIcons';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('simple');

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signup', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSearch = (query) => {
    if (query && typeof query === 'string' && query.trim()) {
      navigate(`/roadmap/questions?goal=${encodeURIComponent(query)}`);
    } else if (query && query.target && query.target.value) {
      navigate(`/roadmap/questions?goal=${encodeURIComponent(query.target.value)}`);
    }
  };

  const handleRowClick = (procedureName) => {
    navigate(`/roadmap/questions?goal=${encodeURIComponent(procedureName)}`);
  };

  return (
    <div className="bg-bone min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-center font-display font-bold text-3xl md:text-4xl text-brand-ink mb-8">
            &ldquo;Navigate government processes with confidence.&rdquo;
          </h1>
          <SearchBar 
            placeholder="What do you need to do?"
            onSubmit={handleSearch}
          />
        </section>

        {/* Procedures Section */}
        <section>
          {/* Mobile Tabs (if keeping the existing logic) */}
          <div className="md:hidden flex gap-2 mb-6 border-b border-brand-cream-dk pb-2">
            <button 
              className={`flex-1 pb-2 font-display font-semibold text-[15px] border-b-2 transition-colors ${
                activeTab === 'simple' ? 'border-brand-orange text-brand-ink' : 'border-transparent text-brand-ink-mute'
              }`}
              onClick={() => setActiveTab('simple')}
            >
              Simple
            </button>
            <button 
              className={`flex-1 pb-2 font-display font-semibold text-[15px] border-b-2 transition-colors ${
                activeTab === 'complex' ? 'border-brand-orange text-brand-ink' : 'border-transparent text-brand-ink-mute'
              }`}
              onClick={() => setActiveTab('complex')}
            >
              Complex
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Simple Column */}
            <div className={`flex-1 flex-col gap-4 ${activeTab === 'simple' ? 'flex' : 'hidden md:flex'}`}>
              <h2 className="hidden md:block font-display font-semibold text-xl text-brand-ink mb-2">Simple</h2>
              
              <div className="flex flex-col gap-3">
                {procedures.simple.map((proc, idx) => (
                  <div 
                    key={proc.id} 
                    className="flex items-center bg-white rounded-card border border-brand-cream-dk shadow-card hover:shadow-card-hov hover:border-brand-orange-lt hover:-translate-y-0.5 transition-all duration-200 p-4 cursor-pointer gap-4 group"
                    onClick={() => handleRowClick(proc.name)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-orange-lt flex items-center justify-center flex-shrink-0">
                      {React.createElement(getSchemeIcon(proc.name), { size: 20, className: "text-brand-orange" })}
                    </div>
                    <span className="font-display font-semibold text-[15px] text-brand-ink flex-1">
                      {proc.name}
                    </span>
                    <ChevronRight size={20} className="text-brand-ink-mute group-hover:text-brand-orange transition-colors" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Complex Column */}
            <div className={`flex-1 flex-col gap-4 ${activeTab === 'complex' ? 'flex' : 'hidden md:flex'}`}>
              <h2 className="hidden md:block font-display font-semibold text-xl text-brand-ink mb-2">Complex</h2>
              
              <div className="flex flex-col gap-3">
                {procedures.complex.map((proc, idx) => (
                  <div 
                    key={proc.id} 
                    className="flex items-center bg-white rounded-card border border-brand-cream-dk shadow-card hover:shadow-card-hov hover:border-brand-orange-lt hover:-translate-y-0.5 transition-all duration-200 p-4 cursor-pointer gap-4 group"
                    onClick={() => handleRowClick(proc.name)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-orange-lt flex items-center justify-center flex-shrink-0">
                      {React.createElement(getSchemeIcon(proc.name), { size: 20, className: "text-brand-orange" })}
                    </div>
                    <span className="font-display font-semibold text-[15px] text-brand-ink flex-1">
                      {proc.name}
                    </span>
                    <ChevronRight size={20} className="text-brand-ink-mute group-hover:text-brand-orange transition-colors" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
