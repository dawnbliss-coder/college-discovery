'use client';

import { useState, useEffect, useCallback } from 'react';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  category: string;
  fees: number;
  rating: number;
  established: number;
  imageUrl?: string | null;
  placements?: { avgPackage: number; placementRate: number }[];
  _count?: { reviews: number };
}

interface Filters {
  states: string[];
  types: string[];
  categories: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filters, setFilters] = useState<Filters>({ states: [], types: [], categories: [] });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);

  // Fetch filters once
  useEffect(() => {
    fetch('/api/colleges/filters')
      .then((r) => r.json())
      .then((data) => setFilters(data));
  }, []);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      state: selectedState,
      type: selectedType,
      category: selectedCategory,
      sortBy,
      page: page.toString(),
      limit: '12',
    });

    const res = await fetch(`/api/colleges?${params}`);
    const data = await res.json();
    setColleges(data.colleges || []);
    setPagination(data.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 });
    setLoading(false);
  }, [search, selectedState, selectedType, selectedCategory, sortBy, page]);

  useEffect(() => {
    const timer = setTimeout(fetchColleges, 300);
    return () => clearTimeout(timer);
  }, [fetchColleges]);

  const resetFilters = () => {
    setSearch('');
    setSelectedState('');
    setSelectedType('');
    setSelectedCategory('');
    setSortBy('rating');
    setPage(1);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) {
        alert('You can compare up to 3 colleges at a time');
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Explore Colleges</h1>
        <p className="text-slate-500 text-sm mt-1">{pagination.total} colleges found</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by college name, city, or state..."
          className="input-field pl-9 py-3 text-base"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All States</option>
          {filters.states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Types</option>
          {filters.types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Categories</option>
          {filters.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto">
          <option value="rating">Sort: Rating</option>
          <option value="fees">Sort: Fees (Low)</option>
          <option value="name">Sort: Name A-Z</option>
          <option value="established">Sort: Established</option>
        </select>
        {(search || selectedState || selectedType || selectedCategory) && (
          <button onClick={resetFilters} className="text-sm text-brand-600 hover:underline px-2">
            Clear filters
          </button>
        )}
      </div>

      {/* Compare bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-brand-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-4">
          <span className="text-sm font-medium">{compareIds.length} college{compareIds.length > 1 ? 's' : ''} selected</span>
          {compareIds.length >= 2 && (
            <Link
              href={`/compare?ids=${compareIds.join(',')}`}
              className="bg-white text-brand-600 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
            >
              Compare Now →
            </Link>
          )}
          <button onClick={() => setCompareIds([])} className="text-brand-200 hover:text-white text-sm">✕ Clear</button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-80 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🏫</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No colleges found</h3>
          <p className="text-slate-500 text-sm mb-4">Try adjusting your search or filters</p>
          <button onClick={resetFilters} className="btn-primary">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onCompareToggle={toggleCompare}
                inCompare={compareIds.includes(college.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center text-sm text-slate-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="btn-secondary px-4 py-2 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
