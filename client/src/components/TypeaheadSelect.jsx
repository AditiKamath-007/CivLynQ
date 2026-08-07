import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function TypeaheadSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select or type...", 
  label, 
  required 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(query.toLowerCase())
  );

  const exactMatch = options.find(opt => opt.toLowerCase() === query.toLowerCase());

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery(value || ''); // Reset query to selected value
        if (required && !value) {
          setShowError(true);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [value, required]);

  useEffect(() => {
    if (isOpen) {
      setQuery(''); // Clear on open to show all options
      setHighlightedIndex(0);
    } else {
      setQuery(value || '');
    }
  }, [isOpen, value]);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setQuery(selectedValue);
    setIsOpen(false);
    setShowError(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const totalItems = filteredOptions.length + (!exactMatch && query.trim() ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!exactMatch && query.trim() && highlightedIndex === 0) {
        handleSelect(query.trim());
      } else {
        const adjustedIndex = (!exactMatch && query.trim()) ? highlightedIndex - 1 : highlightedIndex;
        if (adjustedIndex >= 0 && adjustedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[adjustedIndex]);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setQuery(value || '');
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-display font-semibold text-brand-ink mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : (value || '')}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (required && !value && !isOpen) {
              setShowError(true);
            }
          }}
          placeholder={placeholder}
          className={`w-full h-11 bg-white rounded-lg px-3 pr-10 font-sans text-[15px] outline-none transition ${
            showError 
              ? 'border-2 border-red-500 focus:border-red-500' 
              : 'border border-brand-cream-dk focus:border-brand-orange focus:shadow-pop'
          }`}
        />
        <ChevronDown 
          size={16} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ink-mute pointer-events-none" 
        />
      </div>
      
      {showError && (
        <p className="text-xs text-red-500 mt-1">This field is required.</p>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-cream-dk rounded-lg shadow-pop max-h-60 overflow-y-auto z-30">
          {(!exactMatch && query.trim()) && (
            <div 
              className={`px-4 py-3 cursor-pointer text-sm font-medium transition ${
                highlightedIndex === 0 ? 'bg-brand-orange-lt text-brand-orange' : 'text-brand-orange hover:bg-brand-orange-lt'
              }`}
              onClick={() => handleSelect(query.trim())}
            >
              Use "{query}"
            </div>
          )}

          {filteredOptions.length === 0 && (!query.trim() || exactMatch) ? (
            <div className="px-4 py-3 text-sm text-brand-ink-mute">
              No matches
            </div>
          ) : (
            filteredOptions.map((opt, index) => {
              const itemIndex = (!exactMatch && query.trim()) ? index + 1 : index;
              const isSelected = value === opt;
              
              return (
                <div 
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2.5 text-sm font-sans flex items-center justify-between cursor-pointer transition ${
                    highlightedIndex === itemIndex ? 'bg-brand-orange-lt text-brand-ink' : 'text-brand-ink hover:bg-brand-orange-lt hover:text-brand-ink'
                  } ${isSelected ? 'font-semibold text-brand-orange-dk' : ''}`}
                >
                  {opt}
                  {isSelected && <Check size={14} className="text-brand-orange-dk" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
