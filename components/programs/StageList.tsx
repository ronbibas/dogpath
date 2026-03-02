import { ProgramStageWithExercise } from '@/lib/types';

interface StageListProps {
  stages: ProgramStageWithExercise[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
}

export function StageList({ stages, onMoveUp, onMoveDown, onRemove }: StageListProps) {
  if (stages.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400">
        <p className="text-4xl mb-2">📋</p>
        <p>עדיין אין שלבים בתוכנית</p>
        <p className="text-sm mt-1">לחץ "הוסף תרגיל" כדי להתחיל</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {stages.map((stage, index) => (
        <div
          key={stage.exercise_id + '-' + index}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-200 transition-colors"
        >
          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none shrink-0"
            title="הסר שלב"
          >
            ✕
          </button>

          {/* Up / Down arrows */}
          <div className="flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="text-gray-400 hover:text-amber-600 disabled:opacity-20 disabled:cursor-not-allowed text-xs leading-none"
              title="הזז למעלה"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === stages.length - 1}
              className="text-gray-400 hover:text-amber-600 disabled:opacity-20 disabled:cursor-not-allowed text-xs leading-none"
              title="הזז למטה"
            >
              ▼
            </button>
          </div>

          {/* Exercise info */}
          <div className="flex-1 text-right">
            <p className="font-medium text-gray-900">{stage.exercise.title}</p>
            <p className="text-xs text-gray-500 line-clamp-1">{stage.exercise.description}</p>
          </div>

          {/* Order badge */}
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
