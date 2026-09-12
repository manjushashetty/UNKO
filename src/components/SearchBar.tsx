'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search characters, meanings, readings...' }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E7A83]"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#351522] border border-[#6E1835] text-[#F8FAFC] placeholder-[#8E7A83] text-sm focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all shadow-inner"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E7A83] hover:text-[#F8FAFC] transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
