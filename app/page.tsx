import Link from 'next/link';

export default function HomePage() {
  const features = [
    { icon: '🔍', title: 'Smart Search', desc: 'Search across 15+ top colleges with advanced filters by state, type, fees & category' },
    { icon: '⚖️', title: 'Side-by-Side Compare', desc: 'Compare up to 3 colleges simultaneously across fees, placements, ratings and more' },
    { icon: '🔖', title: 'Save & Shortlist', desc: 'Save your favorite colleges and build a personalized shortlist for easy access' },
    { icon: '📊', title: 'Placement Insights', desc: 'Real placement data with average packages, highest offers, and top recruiters' },
    { icon: '🎯', title: 'Rank Predictor', desc: 'Enter your exam rank and get college recommendations based on cutoff data' },
    { icon: '💬', title: 'Q&A Community', desc: 'Ask questions and read answers from students exploring colleges' },
  ];

  const stats = [
    { value: '15+', label: 'Colleges Listed' },
    { value: '50+', label: 'Courses Available' },
    { value: '4', label: 'States Covered' },
    { value: '100%', label: 'Free to Use' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white py-20 px-4 border-b-4 border-gold-500">
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow text-gold-300 mb-3">India's college admissions companion</p>
          <h1 className="text-4xl md:text-5xl leading-tight mb-4">
            Find your <span className="italic text-gold-300">perfect college</span>
          </h1>
          <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto font-sans">
            Discover, compare, and shortlist the best colleges in India. Make data-driven decisions with real placement stats and honest reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/colleges" className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors">
              Browse Colleges →
            </Link>
            <Link href="/predictor" className="border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Rank Predictor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats, styled like admit-card scoreboard tiles */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="stat-chip text-center">
                <p className="stat-value text-2xl">{s.value}</p>
                <p className="stat-label mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl text-center text-slate-800 mb-2">Everything you need to decide</h2>
          <p className="text-slate-500 text-center mb-10">All the tools to make your college search easier</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-sans font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 py-16 px-4 text-center">
        <h2 className="text-2xl text-slate-800 mb-3">Ready to find your college?</h2>
        <p className="text-slate-500 mb-6">Browse our comprehensive database of India top colleges</p>
        <Link href="/colleges" className="btn-primary px-8 py-3 text-base">
          Explore Colleges →
        </Link>
      </section>
    </div>
  );
}
