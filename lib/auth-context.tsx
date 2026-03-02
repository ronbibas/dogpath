'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from './supabase';
import type { AuthContextType, UserWithProfile, Profile, UserRole } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    let mounted = true;
    const supabase = supabaseRef.current;

    const loadProfile = async (authUser: User) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!mounted) return;

        if (error) throw error;

        setUser({
          id: authUser.id,
          email: authUser.email || '',
          profile: profile as Profile,
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        if (!mounted) return;
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          profile: null,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Use ONLY onAuthStateChange — it fires INITIAL_SESSION on setup.
    // Do NOT also call getSession() — that causes the lock conflict.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      try {
        if (session?.user) {
          await loadProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        if (mounted) setLoading(false);
      }
    });

    // Safety timeout — never stay loading forever
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout — forcing load complete');
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseRef.current.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    const { data, error } = await supabaseRef.current.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) throw error;
    // onAuthStateChange will fire and load the profile automatically
  };

  const signOut = async () => {
    const { error } = await supabaseRef.current.auth.signOut();
    if (error) throw error;
    setUser(null);
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isTrainer: user?.profile?.role === 'trainer',
    isClient: user?.profile?.role === 'client',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
