'use client';

import { useState } from 'react';
import Link from 'next/link';

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  rating: number;
  fees: number;
  category: string;
}

interface Recommendation {
  cutoffRank: number;
  college: College;
}

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState<Recommendation[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`/api/predictor?exam=${exam}&rank=${rank}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Prediction failed');
        setResults([]);
      } else {
        setResults(data.recommendations || []);
        setMessage(data.message || '');
      }
    } catch {
      setError('Failed to fetch recommendations');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800">College Predictor</h1>
      <p className="text-slate-500 text-sm mt-1">
        Enter your exam and rank to see colleges you may qualify for (lower rank = better).
      </p>

      <form onSubmit={handleSubmit} className="card p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Exam</label>
          <select value={exam} onChange={(e) => setExam(e.target.value)} className="input-field">
            <option value="JEE">JEE (Engineering)</option>
            <option value="NEET">NEET (Medical)</option>
            <option value="CUET">CUET (University)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Your rank</label>
          <input
            type="number"
            min={1}
            required
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="e.g. 5000"
            className="input-field"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Finding colleges...' : 'Get recommendations'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {message && <p className="text-amber-600 text-sm mt-4">{message}</p>}

      {results.length > 0 && (
        <div className="mt-8 space-y-3">
          <h2 className="font-semibold text-slate-800">Recommended colleges</h2>
          {results.map(({ cutoffRank, college }) => (
            <div key={college.id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <Link href={`/colleges/${college.id}`} className="font-display text-brand-600 hover:underline">
                  {college.name}
                </Link>
                <p className="text-xs text-slate-500 mt-1">
                  {college.location}, {college.state} · {college.category}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Est. cutoff rank for {exam}: up to {cutoffRank.toLocaleString()}
                </p>
              </div>
              <div className="text-sm font-mono text-slate-600 shrink-0">
                ⭐ {college.rating.toFixed(1)} · ₹{(college.fees / 100000).toFixed(1)}L/yr
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
