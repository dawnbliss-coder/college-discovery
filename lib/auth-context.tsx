'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  savedCollegeIds: Set<string>;
  toggleSave: (collegeId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedCollegeIds, setSavedCollegeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchMe(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchMe = async (t: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        fetchSaved(t);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSaved = async (t: string) => {
    try {
      const res = await fetch('/api/saved', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedCollegeIds(new Set(data.savedColleges.map((s: { college: { id: string } }) => s.college.id)));
      }
    } catch {
      // ignore
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    await fetchSaved(data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setSavedCollegeIds(new Set());
  };

  const toggleSave = async (collegeId: string) => {
    if (!user || !token) throw new Error('Please login to save colleges');

    const isSaved = savedCollegeIds.has(collegeId);

    if (isSaved) {
      const res = await fetch('/api/saved', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collegeId }),
      });
      if (res.ok) {
        setSavedCollegeIds((prev) => {
          const next = new Set(prev);
          next.delete(collegeId);
          return next;
        });
      }
    } else {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collegeId }),
      });
      if (res.ok) {
        setSavedCollegeIds((prev) => new Set([...prev, collegeId]));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, savedCollegeIds, toggleSave }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
