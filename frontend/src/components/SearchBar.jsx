import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ initialTitle = '', initialLocation = '', onSearch, large = false }) {
  const [title, setTitle] = useState(initialTitle);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ title, location });
    } else {
      navigate(`/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`);
    }
  };

  if (large) {
    return (
      <form onSubmit={handleSearch} className="w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2 shadow-2xl border border-gray-100">
          {/* Job Title */}
          <div className="flex items-center gap-3 flex-1 px-3">
            <Search size={18} className="text-primary-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Job title, skills, or company..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-body text-sm"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-gray-200 my-2" />

          {/* Location */}
          <div className="flex items-center gap-3 flex-1 px-3">
            <MapPin size={18} className="text-primary-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="City or remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-body text-sm"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn-primary rounded-xl px-8 text-sm whitespace-nowrap"
          >
            Search Jobs
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>
      <div className="relative flex-1">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>
      <button type="submit" className="btn-primary text-sm px-6">
        Search
      </button>
    </form>
  );
}
