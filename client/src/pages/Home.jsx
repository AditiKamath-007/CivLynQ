import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, IdCard, FileText, Building } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import { procedures } from '../data/procedures';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simple');

  const handleSearch = (query) => {
    if (query && typeof query === 'string' && query.trim()) {
      navigate(`/roadmap/questions?goal=${encodeURIComponent(query)}`);
    } else if (query && query.target && query.target.value) {
      // In case SearchBar passes an event
      navigate(`/roadmap/questions?goal=${encodeURIComponent(query.target.value)}`);
    }
  };

  const handleRowClick = (procedureName) => {
    navigate(`/roadmap/questions?goal=${encodeURIComponent(procedureName)}`);
  };

  return (
    <div className="home-container">
      <section className="home-hero">
        <h1 className="text-h1 home-tagline">
          &quot;Navigate government processes with confidence&quot;
        </h1>
        <div className="home-search-wrapper">
          <SearchBar 
            placeholder="What do you need to do?"
            onSubmit={handleSearch}
          />
        </div>
        <ChevronDown className="home-chevron-down" />
      </section>

      <section className="home-procedures">
        <div className="home-tabs mobile-only">
          <button 
            className={`home-tab ${activeTab === 'simple' ? 'active' : ''}`}
            onClick={() => setActiveTab('simple')}
          >
            Simple
          </button>
          <button 
            className={`home-tab ${activeTab === 'complex' ? 'active' : ''}`}
            onClick={() => setActiveTab('complex')}
          >
            Complex
          </button>
        </div>

        <div className="home-columns">
          <div className={`home-column ${activeTab === 'simple' ? 'active-mobile' : ''}`}>
            <h2 className="text-label home-column-header desktop-only">Simple</h2>
            <div className="home-list">
              {procedures.simple.map((proc, idx) => (
                <div 
                  key={proc.id} 
                  className="home-list-row"
                  onClick={() => handleRowClick(proc.name)}
                >
                  <div className="home-list-icon-chip">
                    <FileText size={16} />
                  </div>
                  <span className="home-list-badge text-caption">{idx + 1}</span>
                  <span className="home-list-name text-body">{proc.name}</span>
                  <ChevronRight className="home-list-chevron" />
                </div>
              ))}
            </div>
          </div>
          
          <div className={`home-column ${activeTab === 'complex' ? 'active-mobile' : ''}`}>
            <h2 className="text-label home-column-header desktop-only">Complex</h2>
            <div className="home-list">
              {procedures.complex.map((proc, idx) => (
                <div 
                  key={proc.id} 
                  className="home-list-row"
                  onClick={() => handleRowClick(proc.name)}
                >
                  <div className="home-list-icon-chip">
                    <Building size={16} />
                  </div>
                  <span className="home-list-badge text-caption">{idx + 1}</span>
                  <span className="home-list-name text-body">{proc.name}</span>
                  <ChevronRight className="home-list-chevron" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
