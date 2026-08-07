import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchBar({ placeholder = 'Search...', onSubmit, className = '' }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
    }
  }

  return (
    <form 
      className={`h-12 w-full max-w-2xl mx-auto rounded-pill bg-white border border-brand-cream-dk focus-within:border-brand-orange focus-within:shadow-pop flex items-center px-2 transition-all duration-200 ${className}`} 
      onSubmit={handleSubmit}
    >
      <div className="pl-2 pr-3 text-brand-ink-mute">
        <Search size={20} aria-hidden="true" />
      </div>
      <input
        type="text"
        className="flex-1 bg-transparent border-none outline-none font-sans text-[15px] text-brand-ink placeholder-brand-ink-mute"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button 
        type="submit" 
        className="w-9 h-9 ml-2 rounded-full bg-brand-orange hover:bg-brand-orange-dk flex items-center justify-center text-white transition-colors" 
        aria-label="Search"
      >
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
