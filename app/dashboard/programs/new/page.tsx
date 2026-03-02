'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

export default function NewProgramPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('שם התוכנית הוא שדה חובה');
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('programs')
        .insert({
          trainer_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
        })
        .select('id')
        .single();

      if (error) throw error;
      router.push(`/dashboard/programs/${(data as { id: string }).id}`);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'אירעה שגיאה. נסה שנית.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard/programs"
          className="text-amber-600 hover:text-amber-700 font-medium text-sm"
        >
          → חזרה לתוכניות
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">תוכנית חדשה 📋</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="title" required>שם התוכנית</Label>
            <Input
              id="title"
              placeholder="לדוגמה: תוכנית בסיסית לכלב גור"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
              error={titleError}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">תיאור (אופציונלי)</Label>
            <Textarea
              id="description"
              placeholder="תאר את מטרת התוכנית, למי היא מתאימה..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 text-right">{submitError}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/programs')}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              צור תוכנית
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
