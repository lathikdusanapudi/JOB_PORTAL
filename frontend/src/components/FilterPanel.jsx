import React, { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { jobCategories, jobTypes, locations } from '../services/mockData';

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  const [openSections, setOpenSections] = useState({
    jobType: true,
    category: true,
    location: false,
    salary: false,
  });

  const toggle = (section) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

  const handleMultiSelect = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const activeCount = [
    ...(filters.jobType || []),
    ...(filters.category || []),
    ...(filters.location || []),
  ].length + (filters.salaryMin ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary-600" />
          <h3 className="font-semibold text-gray-900 font-display text-sm">Filters</h3>
          {activeCount > 0 && (
            <span className="bg-primary-100 text-primary-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-50">
        {/* Job Type */}
        <FilterSection
          title="Job Type"
          open={openSections.jobType}
          onToggle={() => toggle('jobType')}
        >
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.jobType || []).includes(type)}
                  onChange={() => handleMultiSelect('jobType', type)}
                  className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection
          title="Category"
          open={openSections.category}
          onToggle={() => toggle('category')}
        >
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {jobCategories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.category || []).includes(cat)}
                  onChange={() => handleMultiSelect('category', cat)}
                  className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection
          title="Location"
          open={openSections.location}
          onToggle={() => toggle('location')}
        >
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {locations.map((loc) => (
              <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.location || []).includes(loc)}
                  onChange={() => handleMultiSelect('location', loc)}
                  className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{loc}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Salary Range */}
        <FilterSection
          title="Salary Range"
          open={openSections.salary}
          onToggle={() => toggle('salary')}
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Min Salary (LPA)</label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={filters.salaryMin || 0}
                onChange={(e) => onFilterChange({ ...filters, salaryMin: parseInt(e.target.value) })}
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹0</span>
                <span className="text-primary-600 font-medium">₹{filters.salaryMin || 0}L</span>
                <span>₹50L</span>
              </div>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

const FilterSection = ({ title, open, onToggle, children }) => (
  <div className="px-5 py-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between mb-3"
    >
      <span className="text-sm font-semibold text-gray-800 font-display">{title}</span>
      {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
    </button>
    {open && children}
  </div>
);
