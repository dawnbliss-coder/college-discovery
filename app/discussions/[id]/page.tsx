'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface Answer {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string };
}

interface Question {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string };
  answers: Answer[];
}

export default function DiscussionDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answerBody, setAnswerBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const loadQuestion = () => {
    if (!id) return;
    fetch(`/api/discussions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setQuestion(data.question);
      })
      .catch(() => setError('Failed to load discussion'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError('Please login to answer');
      return;
    }
    setPosting(true);
    setError('');
    try {
      const res = await fetch(`/api/discussions/${id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: answerBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post answer');
      setAnswerBody('');
      loadQuestion();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post answer');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-slate-400">Loading...</div>;
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error || 'Question not found'}</p>
        <Link href="/discussions" className="btn-primary mt-4 inline-block">Back to discussions</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/discussions" className="text-sm text-brand-600 hover:underline">
        ← All discussions
      </Link>

      <article className="card p-6 mt-4">
        <h1 className="text-xl font-bold text-slate-800">{question.title}</h1>
        <p className="text-sm text-slate-400 mt-1">
          {question.user.name} · {new Date(question.createdAt).toLocaleString()}
        </p>
        <p className="text-slate-700 mt-4 whitespace-pre-wrap">{question.body}</p>
      </article>

      <section className="mt-8">
        <h2 className="font-semibold text-slate-800 mb-4">
          {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
        </h2>
        {question.answers.length === 0 ? (
          <p className="text-slate-500 text-sm">No answers yet.</p>
        ) : (
          <ul className="space-y-3">
            {question.answers.map((a) => (
              <li key={a.id} className="card p-4">
                <p className="text-sm text-slate-400">
                  {a.user.name} · {new Date(a.createdAt).toLocaleString()}
                </p>
                <p className="text-slate-700 mt-2 whitespace-pre-wrap">{a.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={handleAnswer} className="card p-6 mt-6 space-y-3">
        <h2 className="font-semibold text-slate-800">Your answer</h2>
        {!user && <p className="text-sm text-amber-600">Login to post an answer.</p>}
        <textarea
          value={answerBody}
          onChange={(e) => setAnswerBody(e.target.value)}
          rows={4}
          className="input-field resize-none"
          placeholder="Write your answer..."
          disabled={!user}
        />
        <button type="submit" disabled={!user || posting} className="btn-primary">
          {posting ? 'Posting...' : 'Post answer'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}
