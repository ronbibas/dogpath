'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Program } from '@/lib/types';
import { ProgramCard } from '@/components/programs/ProgramCard';
import { Button } from '@/components/ui/Button';

type ProgramWithCount = Program & { program_stages: { count: number }[] };

export default function ProgramsPage() {
  const { user, loading: authLoading } = useAuth();
  const [programs, setPrograms] = useState<ProgramWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    if (!user) return;
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*, program_stages(count)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPrograms((data ?? []) as unknown as ProgramWithCount[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת התוכניות');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchPrograms();
  }, [authLoading, user]);

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה במחיקת התוכנית');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען תוכניות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/programs/new">
          <Button variant="primary">+ תוכנית חדשה</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">תוכניות אימון 📋</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-right">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {programs.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">🐾</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">עדיין אין תוכניות!</h2>
          <p className="text-gray-500 mb-6">צור את תוכנית האימון הראשונה שלך</p>
          <Link href="/dashboard/programs/new">
            <Button variant="primary">צור תוכנית חדשה</Button>
          </Link>
        </div>
      )}

      {/* Programs grid */}
      {programs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              stageCount={program.program_stages?.[0]?.count ?? 0}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
