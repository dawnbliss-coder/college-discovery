'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface Question {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string };
  _count: { answers: number };
}

export default function DiscussionsPage() {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const loadQuestions = () => {
    fetch('/api/discussions')
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions || []))
      .catch(() => setError('Failed to load discussions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError('Please login to ask a question');
      return;
    }
    setPosting(true);
    setError('');
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post');
      setTitle('');
      setBody('');
      loadQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post question');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800">Q&A / Discussions</h1>
      <p className="text-slate-500 text-sm mt-1">Ask questions and help others with college decisions.</p>

      <form onSubmit={handleAsk} className="card p-6 mt-6 space-y-3">
        <h2 className="font-semibold text-slate-800">Ask a question</h2>
        {!user && (
          <p className="text-sm text-amber-600">Login to post a question. You can still browse below.</p>
        )}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Question title"
          className="input-field"
          disabled={!user}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe your question..."
          rows={3}
          className="input-field resize-none"
          disabled={!user}
        />
        <button type="submit" disabled={!user || posting} className="btn-primary">
          {posting ? 'Posting...' : 'Post question'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <div className="mt-8">
        <h2 className="font-semibold text-slate-800 mb-4">Recent discussions</h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-slate-500 text-sm">No questions yet. Be the first to ask!</p>
        ) : (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li key={q.id}>
                <Link href={`/discussions/${q.id}`} className="card p-4 block hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-slate-800">{q.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{q.body}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {q.user.name} · {q._count.answers} answer{q._count.answers !== 1 ? 's' : ''} ·{' '}
                    {new Date(q.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
