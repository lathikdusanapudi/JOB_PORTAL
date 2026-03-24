import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import { getJobs } from './api';

const JOBS_PER_PAGE = 6;

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ jobType: [], category: [], location: [], salaryMin: 0 });
  const [search, setSearch] = useState({ title: searchParams.get('title') || '', location: searchParams.get('location') || '' });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs({ page_size: 1000 });
        setJobs(data.results || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchTitle = !search.title || job.title.toLowerCase().includes(search.title.toLowerCase()) || job.company_name.toLowerCase().includes(search.title.toLowerCase()) || (job.skills || []).some(s => s.toLowerCase().includes(search.title.toLowerCase()));
      const matchLocation = !search.location || job.location.toLowerCase().includes(search.location.toLowerCase());
      const matchJobType = filters.jobType.length === 0 || filters.jobType.includes(job.job_type);
      const matchCategory = filters.category.length === 0 || filters.category.includes(job.category);
      const matchFilterLoc = filters.location.length === 0 || filters.location.some(l => job.location.includes(l.split(',')[0]));
      const matchSalary = filters.salaryMin === 0 || job.salary_min >= filters.salaryMin * 100000;
      return matchTitle && matchLocation && matchJobType && matchCategory && matchFilterLoc && matchSalary;
    });
  }, [filters, search]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const handleSearch = (s) => {
    setSearch(s);
    setPage(1);
    setSearchParams({ ...(s.title && { title: s.title }), ...(s.location && { location: s.location }) });
  };

  const handleFilterChange = (f) => {
    setFilters(f);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ jobType: [], category: [], location: [], salaryMin: 0 });
    setPage(1);
  };

  const activeFilterCount = [...(filters.jobType || []), ...(filters.category || []), ...(filters.location || [])].length + (filters.salaryMin ? 1 : 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Search Bar */}
      <div className="bg-white border-b border-gray-100 py-6 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar initialTitle={search.title} initialLocation={search.location} onSearch={handleSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
                  {(search.title || search.location) && (
                    <span> for{search.title && <b> "{search.title}"</b>}{search.location && <span> in <b>{search.location}</b></span>}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 hover:border-primary-300 transition-colors"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
                  )}
                </button>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <LayoutGrid size={16} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...filters.jobType, ...filters.category, ...filters.location].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-100">
                    {tag}
                    <button onClick={() => {
                      const updated = { ...filters };
                      ['jobType', 'category', 'location'].forEach(k => {
                        updated[k] = (updated[k] || []).filter(v => v !== tag);
                      });
                      handleFilterChange(updated);
                    }}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-red-500 px-2">Clear all</button>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedJobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No Jobs Found</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">Try adjusting your search terms or removing some filters.</p>
                <button onClick={() => { resetFilters(); handleSearch({ title: '', location: '' }); }} className="mt-4 btn-outline text-sm">
                  Reset Search
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {paginatedJobs.map((job) => (
                  viewMode === 'list'
                    ? <JobCard key={job.id} job={job} compact />
                    : <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  ← Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 font-display">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
              <button onClick={() => setMobileFilterOpen(false)} className="w-full mt-4 btn-primary text-sm">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
