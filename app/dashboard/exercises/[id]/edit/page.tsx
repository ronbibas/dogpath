'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Exercise } from '@/lib/types';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const exerciseId = params.id as string;

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchExercise = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseId)
          .single();

        if (fetchError || !data) {
          router.push('/dashboard/exercises');
          return;
        }

        const exercise = data as Exercise;

        // Verify ownership (RLS handles this, but double-check for UX)
        if (exercise.trainer_id !== user.id) {
          router.push('/dashboard/exercises');
          return;
        }

        setExercise(exercise);
      } catch {
        setError('לא ניתן לטעון את התרגיל');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [authLoading, user, exerciseId, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען תרגיל...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/dashboard/exercises" className="text-amber-600 underline">
          חזרה לבנק התרגילים
        </Link>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard/exercises"
          className="text-amber-600 hover:text-amber-700 font-medium text-sm"
        >
          → חזרה לבנק התרגילים
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">עריכת תרגיל ✏️</h1>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <ExerciseForm exercise={exercise} />
      </div>
    </div>
  );
}
