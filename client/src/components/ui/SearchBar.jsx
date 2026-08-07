import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search...', onSubmit, className = '' }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
    }
  }

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <Search size={20} className="search-bar-icon" />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="search-bar-submit" aria-label="Search">
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
