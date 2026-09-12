'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
}

export function FilterDropdown({ options, selectedId, onSelect, label = 'Filter' }: FilterDropdownProps) {
  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#351522] border border-[#6E1835] text-xs font-medium text-[#F8FAFC]">
        <Filter size={14} className="text-[#22D3EE]" />
        <span className="text-[#8E7A83] hidden sm:inline">{label}:</span>
        <select
          value={selectedId}
          onChange={e => onSelect(e.target.value)}
          className="bg-transparent text-[#F8FAFC] focus:outline-none cursor-pointer pr-2 font-medium"
        >
          {options.map(opt => (
            <option key={opt.id} value={opt.id} className="bg-[#351522] text-[#F8FAFC]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
