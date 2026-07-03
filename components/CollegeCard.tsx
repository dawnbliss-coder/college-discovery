'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

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

interface Props {
  college: College;
  onCompareToggle?: (id: string) => void;
  inCompare?: boolean;
}

export default function CollegeCard({ college, onCompareToggle, inCompare }: Props) {
  const { user, savedCollegeIds, toggleSave } = useAuth();
  const [saving, setSaving] = useState(false);
  const isSaved = savedCollegeIds.has(college.id);
  const latestPlacement = college.placements?.[0];

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to save colleges');
      return;
    }
    setSaving(true);
    try {
      await toggleSave(college.id);
    } finally {
      setSaving(false);
    }
  };

  const typeColor: Record<string, string> = {
    Government: 'bg-green-100 text-green-700',
    Private: 'bg-orange-100 text-orange-700',
    Deemed: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="card hover:shadow-md transition-shadow overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-brand-100 to-slate-200 overflow-hidden">
        {college.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">🏛️</div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
              isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-500 hover:text-red-500'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save college'}
          >
            <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor[college.type] || 'bg-slate-100 text-slate-600'}`}>
            {college.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-slate-800 text-sm leading-tight line-clamp-2 flex-1">{college.name}</h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="text-gold-500">★</span>
            <span className="text-sm font-mono font-semibold text-slate-700">{college.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-1">
          📍 {college.location}, {college.state}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{college.category}</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Est. {college.established}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="stat-chip">
            <p className="stat-label">Annual Fees</p>
            <p className="stat-value text-sm">₹{(college.fees / 100000).toFixed(1)}L</p>
          </div>
          {latestPlacement && (
            <div className="stat-chip">
              <p className="stat-label">Avg Package</p>
              <p className="stat-value text-sm">{latestPlacement.avgPackage} LPA</p>
            </div>
          )}
        </div>

        {college._count && (
          <p className="text-xs text-slate-400 mt-2">{college._count.reviews} reviews</p>
        )}

        <div className="mt-3 flex gap-2">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center text-xs font-medium text-brand-600 border border-brand-200 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            View Details
          </Link>
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(college.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                inCompare
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {inCompare ? '✓ Added' : '+ Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
