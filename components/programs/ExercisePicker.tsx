'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Exercise } from '@/lib/types';
import { Input } from '@/components/ui/Input';

interface ExercisePickerProps {
  alreadyAdded: string[];
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

export function ExercisePicker({ alreadyAdded, onSelect, onClose }: ExercisePickerProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('exercises')
        .select('*')
        .order('title');
      setExercises((data ?? []) as Exercise[]);
      setLoading(false);
    };
    fetchExercises();
  }, []);

  const filtered = exercises.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold text-gray-900">בחר תרגיל</h2>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <Input
            placeholder="חפש לפי שם..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Exercise list */}
        <div className="overflow-y-auto flex-1 p-2">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">לא נמצאו תרגילים</p>
          )}

          {!loading && filtered.map((exercise) => {
            const isAdded = alreadyAdded.includes(exercise.id);
            return (
              <button
                key={exercise.id}
                type="button"
                disabled={isAdded}
                onClick={() => { onSelect(exercise); onClose(); }}
                className={[
                  'w-full text-right p-3 rounded-lg mb-1 transition-colors',
                  isAdded
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-amber-50 hover:text-amber-800 text-gray-800',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium shrink-0">
                    {isAdded ? '✓ נוסף' : ''}
                  </span>
                  <div className="text-right">
                    <p className="font-medium">{exercise.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{exercise.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
