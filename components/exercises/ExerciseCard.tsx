'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Exercise } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface ExerciseCardProps {
  exercise: Exercise;
  onDelete: (id: string) => void;
}

export function ExerciseCard({ exercise, onDelete }: ExerciseCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hasVideo = !!(exercise.video_url || exercise.video_file_url);
  const hasVoice = !!exercise.voice_memo_url;

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(exercise.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-md transition-all">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-right">{exercise.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 text-right line-clamp-2 mb-3">{exercise.description}</p>

      {/* Media badges */}
      {(hasVideo || hasVoice) && (
        <div className="flex gap-2 justify-end mb-4">
          {hasVideo && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
              🎬 סרטון
            </span>
          )}
          {hasVoice && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">
              🎙️ הקלטה
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end border-t border-gray-100 pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          className={confirmDelete ? 'border-red-500 text-red-600 hover:bg-red-50' : ''}
        >
          {confirmDelete ? 'לחץ שנית לאישור' : 'מחק'}
        </Button>
        <Link href={`/dashboard/exercises/${exercise.id}/edit`}>
          <Button type="button" variant="secondary" size="sm">
            ערוך
          </Button>
        </Link>
      </div>
    </div>
  );
}
