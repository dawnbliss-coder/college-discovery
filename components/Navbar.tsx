'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="font-display font-semibold text-xl text-brand-600">CollegeCompass</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/colleges" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                Colleges
              </Link>
              <Link href="/compare" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                Compare
              </Link>
              <Link href="/predictor" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                Predictor
              </Link>
              <Link href="/discussions" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                Q&A
              </Link>
              {user && (
                <Link href="/saved" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                  Saved
                </Link>
              )}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">Hi, <span className="font-semibold text-slate-800">{user.name.split(' ')[0]}</span></span>
                  <button onClick={handleLogout} className="btn-secondary text-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={openLogin} className="btn-secondary text-sm">Login</button>
                  <button onClick={openRegister} className="btn-primary text-sm">Sign Up</button>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2">
            <Link href="/colleges" className="block py-2 text-sm font-medium text-slate-600" onClick={() => setMenuOpen(false)}>Colleges</Link>
            <Link href="/compare" className="block py-2 text-sm font-medium text-slate-600" onClick={() => setMenuOpen(false)}>Compare</Link>
            <Link href="/predictor" className="block py-2 text-sm font-medium text-slate-600" onClick={() => setMenuOpen(false)}>Predictor</Link>
            <Link href="/discussions" className="block py-2 text-sm font-medium text-slate-600" onClick={() => setMenuOpen(false)}>Q&A</Link>
            {user && <Link href="/saved" className="block py-2 text-sm font-medium text-slate-600" onClick={() => setMenuOpen(false)}>Saved</Link>}
            <div className="pt-2 flex gap-2">
              {user ? (
                <button onClick={handleLogout} className="btn-secondary text-sm w-full">Logout</button>
              ) : (
                <>
                  <button onClick={openLogin} className="btn-secondary text-sm flex-1">Login</button>
                  <button onClick={openRegister} className="btn-primary text-sm flex-1">Sign Up</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}
    </>
  );
}
