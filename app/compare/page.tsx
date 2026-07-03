'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Placement { year: number; avgPackage: number; highestPackage: number; placementRate: number; topRecruiters: string }
interface College {
  id: string; name: string; location: string; state: string; type: string; category: string;
  fees: number; rating: number; established: number; courses: { id: string; name: string }[];
  placements: Placement[]; _count: { reviews: number };
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get('ids') || '';
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!idsParam) {
      setLoading(false);
      setColleges([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    fetch(`/api/colleges/compare?ids=${idsParam}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          setError(data.error || 'Failed to load comparison');
          setColleges([]);
        } else {
          setColleges(data.colleges || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load comparison');
        setColleges([]);
        setLoading(false);
      });
  }, [idsParam]);

  const Row = ({ label, values, mono }: { label: string; values: (string | number | null | undefined)[]; mono?: boolean }) => (
    <tr className="border-b border-slate-100">
      <td className="py-3 px-4 text-sm font-medium text-slate-500 bg-slate-50 w-36">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`py-3 px-4 text-sm text-slate-700 text-center ${mono ? 'font-mono' : ''}`}>
          {v ?? <span className="text-slate-300">—</span>}
        </td>
      ))}
    </tr>
  );

  if (!idsParam) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">⚖️</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Compare Colleges</h1>
        <p className="text-slate-500 mb-6">Go to the colleges list and select 2-3 colleges to compare them side by side</p>
        <Link href="/colleges" className="btn-primary">Browse Colleges →</Link>
      </div>
    );
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <p className="text-red-500">{error}</p>
      <Link href="/colleges" className="btn-primary mt-4">Go back</Link>
    </div>
  );

  if (colleges.length === 0) return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <p className="text-slate-500">No colleges found for this comparison.</p>
      <Link href="/colleges" className="btn-primary mt-4">Go back</Link>
    </div>
  );

  const latestPlacements = colleges.map((c) => c.placements?.[0]);
  const bestRating = colleges.reduce((best, c) => (c.rating > best.rating ? c : best), colleges[0]);
  const lowestFees = colleges.reduce((best, c) => (c.fees < best.fees ? c : best), colleges[0]);
  const bestPlacement = colleges.reduce((best, c) => {
    const cPkg = c.placements?.[0]?.avgPackage ?? 0;
    const bPkg = best.placements?.[0]?.avgPackage ?? 0;
    return cPkg > bPkg ? c : best;
  }, colleges[0]);
  const highlights = [
    { icon: '⭐', label: 'Best Rated', college: bestRating },
    { icon: '💰', label: 'Most Affordable', college: lowestFees },
    { icon: '🏆', label: 'Best Placements', college: bestPlacement },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">College Comparison</h1>
          <p className="text-slate-500 text-sm mt-1">Comparing {colleges.length} colleges</p>
        </div>
        <Link href="/colleges" className="btn-secondary text-sm">← Change Selection</Link>
      </div>

      {/* College Headers */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-4 text-left text-sm text-slate-400 bg-slate-50 w-36">Feature</th>
                {colleges.map((c) => (
                  <th key={c.id} className="py-4 px-4 text-center">
                    <Link href={`/colleges/${c.id}`} className="font-semibold text-slate-800 hover:text-brand-600 text-sm block">
                      {c.name}
                    </Link>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">{c.location}, {c.state}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Rating" values={colleges.map((c) => `⭐ ${c.rating.toFixed(1)}`)} mono />
              <Row label="Type" values={colleges.map((c) => c.type)} />
              <Row label="Category" values={colleges.map((c) => c.category)} />
              <Row label="Annual Fees" values={colleges.map((c) => `₹${(c.fees / 100000).toFixed(1)}L`)} mono />
              <Row label="Established" values={colleges.map((c) => c.established)} mono />
              <Row label="No. of Courses" values={colleges.map((c) => c.courses.length)} mono />
              <Row label="Reviews" values={colleges.map((c) => c._count.reviews)} mono />
            </tbody>
          </table>
        </div>
      </div>

      {/* Placements */}
      <div className="card overflow-hidden mt-6">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Latest Placement Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-4 text-left text-sm text-slate-400 bg-slate-50 w-36">Metric</th>
                {colleges.map((c) => (
                  <th key={c.id} className="py-3 px-4 text-center text-sm font-medium text-slate-600">{c.name.split(' ').slice(0, 3).join(' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm font-medium text-slate-500 bg-slate-50">Year</td>
                {latestPlacements.map((p, i) => <td key={i} className="py-3 px-4 text-sm text-center font-mono text-slate-700">{p?.year ?? '—'}</td>)}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm font-medium text-slate-500 bg-slate-50">Avg Package</td>
                {latestPlacements.map((p, i) => <td key={i} className="py-3 px-4 text-sm text-center font-mono font-semibold text-brand-600">{p ? `${p.avgPackage} LPA` : '—'}</td>)}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm font-medium text-slate-500 bg-slate-50">Highest Package</td>
                {latestPlacements.map((p, i) => <td key={i} className="py-3 px-4 text-sm text-center font-mono text-slate-700">{p ? `${p.highestPackage} LPA` : '—'}</td>)}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm font-medium text-slate-500 bg-slate-50">Placement Rate</td>
                {latestPlacements.map((p, i) => <td key={i} className="py-3 px-4 text-sm text-center font-mono text-slate-700">{p ? `${p.placementRate}%` : '—'}</td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-slate-500 bg-slate-50">Top Recruiters</td>
                {latestPlacements.map((p, i) => (
                  <td key={i} className="py-3 px-4 text-xs text-center text-slate-500">
                    {p ? p.topRecruiters.split(',').slice(0, 3).join(', ') : '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {highlights.map(({ icon, label, college: winner }) => (
          <div key={label} className="card p-4 text-center border-2 border-brand-100">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-brand-600 mt-1">{winner.name.split(' ').slice(0, 4).join(' ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
