'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';

interface SavedCollege {
  id: string;
  college: {
    id: string; name: string; location: string; state: string; type: string; category: string;
    fees: number; rating: number; established: number; imageUrl?: string | null;
    placements?: { avgPackage: number; placementRate: number }[];
    _count?: { reviews: number };
  };
}

export default function SavedPage() {
  const { user, token, isLoading } = useAuth();
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) { setLoading(false); return; }

    fetch('/api/saved', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setSavedColleges(data.savedColleges || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, token]);

  if (isLoading || loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="h-72 bg-slate-200 rounded-xl" />)}
        </div>
      </div>
    </div>
  );

  if (!user) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Login to see saved colleges</h1>
      <p className="text-slate-500 mb-6">Create an account to save and track your favorite colleges</p>
      <Link href="/colleges" className="btn-primary">Browse Colleges</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Saved Colleges</h1>
        <p className="text-slate-500 text-sm mt-1">{savedColleges.length} college{savedColleges.length !== 1 ? 's' : ''} saved</p>
      </div>

      {savedColleges.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🏫</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No saved colleges yet</h3>
          <p className="text-slate-500 text-sm mb-6">Browse colleges and click the heart icon to save them here</p>
          <Link href="/colleges" className="btn-primary">Browse Colleges</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {savedColleges.map(({ college }) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}
