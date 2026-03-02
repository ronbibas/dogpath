import Link from 'next/link';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';

export default function NewExercisePage() {
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
        <h1 className="text-2xl font-bold text-gray-900">תרגיל חדש 🆕</h1>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <ExerciseForm />
      </div>
    </div>
  );
}
