import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tag from '../components/ui/Tag';
import { schemes } from '../data/schemes';
import './Schemes.css';

export default function Schemes() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    if (query && typeof query === 'string') {
      setSearchQuery(query.toLowerCase());
    } else if (query && query.target) {
      setSearchQuery(query.target.value.toLowerCase());
    }
  };

  const filteredSchemes = schemes.filter(scheme => 
    scheme.name.toLowerCase().includes(searchQuery) ||
    scheme.description.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="schemes-container">
      <header className="schemes-header">
        <h1 className="text-h1 schemes-title">Schemes</h1>
        <SearchBar 
          placeholder="Search schemes"
          onSubmit={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </header>

      <div className="schemes-list">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme, index) => (
            <Link key={scheme.id} to={`/schemes/${scheme.id}`} className="scheme-card-link">
              <Card className="scheme-card">
                <div className="scheme-card-content">
                  <div className="scheme-card-number text-caption">{index + 1}</div>
                  <div className="scheme-card-text">
                    <h2 className="text-h2 scheme-card-name">{scheme.name}</h2>
                    <p className="text-caption scheme-card-desc">{scheme.description}</p>
                    <div style={{marginTop: 'var(--space-2)'}}>
                      <Tag className="category-tag" style={{ backgroundColor: 'var(--olive-light)', color: 'var(--olive)' }}>
                        {scheme.category || 'Government'}
                      </Tag>
                    </div>
                  </div>
                  <ChevronRight className="scheme-card-icon" />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="schemes-empty">
            <p className="text-body schemes-empty-text">No schemes match your search</p>
            <Button variant="ghost" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
