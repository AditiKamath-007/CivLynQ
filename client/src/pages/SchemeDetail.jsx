import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Gift, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ErrorState from '../components/ui/ErrorState';
import Tag from '../components/ui/Tag';
import { schemes } from '../data/schemes';
import '../styles/_legacy/SchemeDetail.css';

export default function SchemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const scheme = schemes.find(s => s.id === id);

  if (!scheme) {
    return <ErrorState message="Scheme not found" onRetry={() => navigate('/schemes')} />;
  }

  return (
    <div className="scheme-detail-container">
      <header className="scheme-detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            className="scheme-detail-back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="scheme-detail-back-icon" />
          </button>
          <h1 className="text-h1 scheme-detail-title" style={{ margin: 0 }}>{scheme.name}</h1>
        </div>
        <div style={{ marginTop: 'var(--space-3)', marginLeft: '52px' }}>
          <Tag style={{ backgroundColor: 'var(--olive-light)', color: 'var(--olive)' }}>
            {scheme.category || 'Government'}
          </Tag>
        </div>
      </header>

      <div className="scheme-detail-sections">
        <Card className="scheme-detail-card">
          <h2 className="text-h2 scheme-detail-section-title">Eligibility</h2>
          <ul className="scheme-detail-list">
            {scheme.eligibility.map((item, i) => (
              <li key={i} className="scheme-detail-list-item">
                <Check className="scheme-detail-icon text-olive" />
                <span className="text-body">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="scheme-detail-card">
          <h2 className="text-h2 scheme-detail-section-title">Benefits</h2>
          <ul className="scheme-detail-list">
            {scheme.benefits.map((item, i) => (
              <li key={i} className="scheme-detail-list-item">
                <Gift className="scheme-detail-icon text-saffron" />
                <span className="text-body">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="scheme-detail-card">
          <h2 className="text-h2 scheme-detail-section-title">How to Apply</h2>
          <ol className="scheme-detail-ordered-list">
            {scheme.howToApply.map((step, i) => (
              <li key={i} className="scheme-detail-ordered-item">
                <span className="scheme-detail-step-num">{i + 1}</span>
                <span className="text-body">{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="scheme-detail-card">
          <h2 className="text-h2 scheme-detail-section-title">Official Links</h2>
          <div className="scheme-detail-links">
            {scheme.officialLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="scheme-detail-link-btn"
              >
                <Button variant="ghost" className="scheme-detail-link-content">
                  {link.label}
                  <ExternalLink className="scheme-detail-link-icon" />
                </Button>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
