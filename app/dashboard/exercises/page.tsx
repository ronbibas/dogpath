'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Exercise } from '@/lib/types';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { Button } from '@/components/ui/Button';

export default function ExercisesPage() {
  const { user, loading: authLoading } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async () => {
    if (!user) return;
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setExercises((data ?? []) as Exercise[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'שגיאה בטעינת התרגילים';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchExercises();
  }, [authLoading, user]);

  const handleDelete = async (id: string) => {
    const exercise = exercises.find((e) => e.id === id);
    if (!exercise) return;

    try {
      const supabase = createClient();

      // Delete storage files first
      const filesToDelete: string[] = [];
      const extractPath = (url: string) => {
        const match = url.match(/\/exercises\/(.+)$/);
        return match ? match[1] : null;
      };

      if (exercise.video_file_url) {
        const path = extractPath(exercise.video_file_url);
        if (path) filesToDelete.push(path);
      }
      if (exercise.voice_memo_url) {
        const path = extractPath(exercise.voice_memo_url);
        if (path) filesToDelete.push(path);
      }
      if (filesToDelete.length > 0) {
        await supabase.storage.from('exercises').remove(filesToDelete);
      }

      // Delete the exercise record
      const { error: deleteError } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setExercises((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'שגיאה במחיקת התרגיל';
      setError(message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען תרגילים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/exercises/new">
          <Button variant="primary">+ תרגיל חדש</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">בנק התרגילים 🎾</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-right">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {exercises.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">🐾</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">עדיין אין תרגילים!</h2>
          <p className="text-gray-500 mb-6">בוא ניצור את הראשון ויתחיל את המסע</p>
          <Link href="/dashboard/exercises/new">
            <Button variant="primary">צור את התרגיל הראשון</Button>
          </Link>
        </div>
      )}

      {/* Exercise grid */}
      {exercises.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
