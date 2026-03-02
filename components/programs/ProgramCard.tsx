'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Program } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface ProgramCardProps {
  program: Program;
  stageCount: number;
  onDelete: (id: string) => void;
}

export function ProgramCard({ program, stageCount, onDelete }: ProgramCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(program.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-md transition-all">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-right">{program.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-500 text-right line-clamp-2 mb-3 min-h-[2.5rem]">
        {program.description || 'אין תיאור'}
      </p>

      {/* Stage count badge */}
      <div className="flex justify-end mb-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
          📋 {stageCount} שלבים
        </span>
      </div>

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
        <Link href={`/dashboard/programs/${program.id}`}>
          <Button type="button" variant="secondary" size="sm">
            ערוך
          </Button>
        </Link>
      </div>
    </div>
  );
}
