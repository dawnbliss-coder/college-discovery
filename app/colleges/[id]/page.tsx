'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface Course { id: string; name: string; duration: string; seats: number; fees: number }
interface Placement { id: string; year: number; avgPackage: number; highestPackage: number; placementRate: number; topRecruiters: string }
interface Review { id: string; userName: string; rating: number; comment: string; pros?: string | null; cons?: string | null; createdAt: string }
interface College {
  id: string; name: string; location: string; state: string; type: string; category: string;
  fees: number; rating: number; established: number; website?: string | null; description: string;
  imageUrl?: string | null; courses: Course[]; placements: Placement[]; reviews: Review[];
  _count: { reviews: number; savedBy: number }
}

type TabType = 'overview' | 'courses' | 'placements' | 'reviews';

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, savedCollegeIds, toggleSave } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/colleges/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) router.push('/colleges');
        else setCollege(data.college);
        setLoading(false);
      })
      .catch(() => { setLoading(false); router.push('/colleges'); });
  }, [id, router]);

  const isSaved = college ? savedCollegeIds.has(college.id) : false;

  const handleSave = async () => {
    if (!user) { alert('Please login to save colleges'); return; }
    if (!college) return;
    setSaving(true);
    await toggleSave(college.id);
    setSaving(false);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-slate-200 rounded-xl" />
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  );

  if (!college) return null;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'courses', label: `Courses (${college.courses.length})` },
    { key: 'placements', label: 'Placements' },
    { key: 'reviews', label: `Reviews (${college._count.reviews})` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link href="/colleges" className="text-sm text-brand-600 hover:underline mb-4 inline-flex items-center gap-1">
        ← Back to Colleges
      </Link>

      {/* Hero */}
      <div className="card overflow-hidden mt-3">
        <div className="relative h-56 bg-gradient-to-br from-brand-200 to-slate-300">
          {college.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{college.type}</span>
              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{college.category}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">{college.name}</h1>
            <p className="text-sm text-white/80 mt-0.5">📍 {college.location}, {college.state} • Est. {college.established}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="stat-chip">
                <p className="stat-label">Rating</p>
                <p className="stat-value text-lg">⭐ {college.rating.toFixed(1)}</p>
              </div>
              <div className="stat-chip">
                <p className="stat-label">Annual Fees</p>
                <p className="stat-value text-lg">₹{(college.fees / 100000).toFixed(1)}L</p>
              </div>
              {college.placements[0] && (
                <>
                  <div className="stat-chip">
                    <p className="stat-label">Avg Package ({college.placements[0].year})</p>
                    <p className="stat-value text-lg">{college.placements[0].avgPackage} LPA</p>
                  </div>
                  <div className="stat-chip">
                    <p className="stat-label">Placement Rate</p>
                    <p className="stat-value text-lg">{college.placements[0].placementRate}%</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSaved ? 'bg-red-50 text-red-600 border border-red-200' : 'btn-secondary'
                }`}
              >
                {isSaved ? '♥ Saved' : '♡ Save'}
              </button>
              {college.website && (
                <a href={college.website} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                  Visit Website ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mt-6 flex gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-2">About</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{college.description}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Type', value: college.type },
                { label: 'Category', value: college.category },
                { label: 'Location', value: `${college.location}, ${college.state}` },
                { label: 'Established', value: college.established.toString() },
              ].map((item) => (
                <div key={item.label} className="card p-3">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-3">
            {college.courses.map((course) => (
              <div key={course.id} className="card p-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="font-medium text-slate-800">{course.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{course.duration} • {course.seats} seats</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-brand-600">₹{(course.fees / 100000).toFixed(1)}L/yr</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'placements' && (
          <div className="space-y-4">
            {college.placements.map((p) => (
              <div key={p.id} className="card p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Placements {p.year}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Average Package', value: `${p.avgPackage} LPA` },
                    { label: 'Highest Package', value: `${p.highestPackage} LPA` },
                    { label: 'Placement Rate', value: `${p.placementRate}%` },
                  ].map((stat) => (
                    <div key={stat.label} className="stat-chip">
                      <p className="stat-label">{stat.label}</p>
                      <p className="stat-value text-lg">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Top Recruiters</p>
                  <div className="flex flex-wrap gap-2">
                    {p.topRecruiters.split(',').map((r) => (
                      <span key={r} className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">{r.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {college.reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No reviews yet</div>
            ) : (
              college.reviews.map((review) => (
                <div key={review.id} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{review.userName}</p>
                      <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gold-400">
                      {'★'.repeat(Math.round(review.rating))}
                      <span className="text-slate-600 text-sm ml-1">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{review.comment}</p>
                  {(review.pros || review.cons) && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {review.pros && (
                        <div className="bg-green-50 rounded-lg p-2">
                          <p className="text-xs font-medium text-green-700">👍 Pros</p>
                          <p className="text-xs text-green-600 mt-0.5">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="bg-red-50 rounded-lg p-2">
                          <p className="text-xs font-medium text-red-700">👎 Cons</p>
                          <p className="text-xs text-red-600 mt-0.5">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
