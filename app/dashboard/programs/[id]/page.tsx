'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Exercise, Program, ProgramStageWithExercise } from '@/lib/types';
import { StageList } from '@/components/programs/StageList';
import { ExercisePicker } from '@/components/programs/ExercisePicker';
import { Button } from '@/components/ui/Button';

export default function ProgramBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const programId = params.id as string;

  const [program, setProgram] = useState<Program | null>(null);
  const [stages, setStages] = useState<ProgramStageWithExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titleDraft, setTitleDraft] = useState('');
  const [descDraft, setDescDraft] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchProgram = async () => {
      try {
        const supabase = createClient();

        // Fetch program
        const { data: prog, error: progErr } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .single();

        if (progErr || !prog) { router.push('/dashboard/programs'); return; }

        const p = prog as Program;
        if (p.trainer_id !== user.id) { router.push('/dashboard/programs'); return; }

        setProgram(p);
        setTitleDraft(p.title);
        setDescDraft(p.description ?? '');

        // Fetch stages with exercises
        const { data: stagesData } = await supabase
          .from('program_stages')
          .select('*, exercise:exercises(*)')
          .eq('program_id', programId)
          .order('order_index');

        setStages((stagesData ?? []) as unknown as ProgramStageWithExercise[]);
      } catch {
        setError('שגיאה בטעינת התוכנית');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [authLoading, user, programId, router]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);

  const handleAddExercise = (exercise: Exercise) => {
    const newStage: ProgramStageWithExercise = {
      id: '',
      program_id: programId,
      exercise_id: exercise.id,
      order_index: stages.length,
      created_at: '',
      exercise,
    };
    setStages((prev) => [...prev, newStage]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setStages((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === stages.length - 1) return;
    setStages((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleRemove = (index: number) => {
    setStages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!titleDraft.trim()) return;
    setIsSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      await supabase
        .from('programs')
        .update({ title: titleDraft.trim(), description: descDraft.trim() || null })
        .eq('id', programId);

      await supabase
        .from('program_stages')
        .delete()
        .eq('program_id', programId);

      if (stages.length > 0) {
        await supabase.from('program_stages').insert(
          stages.map((s, i) => ({
            program_id: programId,
            exercise_id: s.exercise_id,
            order_index: i,
          }))
        );
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירה');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען תוכנית...</p>
        </div>
      </div>
    );
  }

  if (!program) return null;

  const addedIds = stages.map((s) => s.exercise_id);

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/dashboard/programs" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
          → חזרה לתוכניות
        </Link>
      </div>

      {/* Title (inline edit) */}
      <div className="mb-2 text-right">
        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitle(false); }}
            className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-amber-500 outline-none w-full text-right"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingTitle(true)}
            className="text-2xl font-bold text-gray-900 hover:text-amber-700 transition-colors text-right w-full group"
            title="לחץ לעריכת שם"
          >
            {titleDraft || 'ללא שם'}
            <span className="text-sm text-gray-400 font-normal mr-2 opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
          </button>
        )}
      </div>

      {/* Description */}
      <textarea
        value={descDraft}
        onChange={(e) => setDescDraft(e.target.value)}
        placeholder="הוסף תיאור לתוכנית (אופציונלי)..."
        rows={2}
        className="w-full text-sm text-gray-600 text-right bg-transparent border border-transparent hover:border-gray-200 focus:border-amber-400 rounded-lg p-2 outline-none resize-none transition-colors mb-6 placeholder:text-gray-400"
      />

      {/* Stage list */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPicker(true)}
          >
            + הוסף תרגיל
          </Button>
          <h2 className="font-semibold text-gray-700">שלבי התוכנית</h2>
        </div>

        <StageList
          stages={stages}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRemove={handleRemove}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700 text-right">{error}</p>
        </div>
      )}

      {/* Exercise picker modal */}
      {showPicker && (
        <ExercisePicker
          alreadyAdded={addedIds}
          onSelect={handleAddExercise}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Sticky save button */}
      <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 p-4 flex justify-center">
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          className="min-w-[160px]"
        >
          {saveSuccess ? 'נשמר ✓' : 'שמור תוכנית'}
        </Button>
      </div>
    </div>
  );
}
