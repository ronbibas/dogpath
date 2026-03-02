'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Exercise } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { VoiceRecorder } from '@/components/exercises/VoiceRecorder';

interface ExerciseFormProps {
  exercise?: Exercise;
}

const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message);
  return fallback;
}

function isVideoUrl(url: string) {
  return /youtube\.com|youtu\.be|tiktok\.com/i.test(url);
}

export function ExerciseForm({ exercise }: ExerciseFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!exercise;

  const [title, setTitle] = useState(exercise?.title ?? '');
  const [description, setDescription] = useState(exercise?.description ?? '');
  const [videoUrl, setVideoUrl] = useState(exercise?.video_url ?? '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'שם התרגיל הוא שדה חובה';
    if (!description.trim()) newErrors.description = 'תיאור התרגיל הוא שדה חובה';
    if (videoUrl && !isVideoUrl(videoUrl)) {
      newErrors.videoUrl = 'הכנס קישור תקין של YouTube או TikTok';
    }
    if (videoFile && videoFile.size > MAX_VIDEO_BYTES) {
      newErrors.videoFile = 'גודל הסרטון לא יעלה על 100MB';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFile = async (
    supabase: ReturnType<typeof createClient>,
    blob: Blob | File,
    trainerId: string,
    filename: string
  ): Promise<string> => {
    const path = `${trainerId}/${Date.now()}-${filename}`;
    const { error } = await supabase.storage.from('exercises').upload(path, blob);
    if (error) throw new Error(`שגיאה בהעלאת קובץ: ${error.message}`);
    const { data } = supabase.storage.from('exercises').getPublicUrl(path);
    return data.publicUrl;
  };

  const deleteOldFile = async (
    supabase: ReturnType<typeof createClient>,
    publicUrl: string
  ) => {
    try {
      // Extract path after /exercises/ in the storage URL
      const match = publicUrl.match(/\/exercises\/(.+)$/);
      if (match) {
        await supabase.storage.from('exercises').remove([match[1]]);
      }
    } catch {
      // Non-critical: old file deletion failure shouldn't block the save
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) {
      setSubmitError('יש להתחבר מחדש לפני שמירה');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const supabase = createClient();
      const trainerId = user.id;

      let videoFileUrl = exercise?.video_file_url ?? null;
      let voiceMemoUrl = exercise?.voice_memo_url ?? null;

      // Upload new video file if provided
      if (videoFile) {
        if (isEdit && exercise?.video_file_url) {
          await deleteOldFile(supabase, exercise.video_file_url);
        }
        videoFileUrl = await uploadFile(supabase, videoFile, trainerId, videoFile.name);
      }

      // Upload new voice recording if provided
      if (voiceBlob) {
        if (isEdit && exercise?.voice_memo_url) {
          await deleteOldFile(supabase, exercise.voice_memo_url);
        }
        voiceMemoUrl = await uploadFile(supabase, voiceBlob, trainerId, 'voice.webm');
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        video_url: videoUrl.trim() || null,
        video_file_url: videoFileUrl,
        voice_memo_url: voiceMemoUrl,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('exercises')
          .update(payload)
          .eq('id', exercise.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('exercises')
          .insert({ ...payload, trainer_id: trainerId });
        if (error) throw error;
      }

      router.push('/dashboard/exercises');
    } catch (err: unknown) {
      console.error('Error saving exercise:', err);
      const message = getErrorMessage(err, 'אירעה שגיאה. אנא נסה שנית.');
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setVideoFile(file);
    if (file && file.size > MAX_VIDEO_BYTES) {
      setErrors((prev) => ({ ...prev, videoFile: 'גודל הסרטון לא יעלה על 100MB' }));
    } else {
      setErrors((prev) => { const next = { ...prev }; delete next.videoFile; return next; });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <Label htmlFor="title" required>שם התרגיל</Label>
        <Input
          id="title"
          placeholder="לדוגמה: ישיבה בסיסית"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description" required>תיאור / הנחיות</Label>
        <Textarea
          id="description"
          placeholder="הסבר כיצד לבצע את התרגיל, מה לשים לב אליו..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          error={errors.description}
        />
      </div>

      {/* Video URL */}
      <div className="space-y-1">
        <Label htmlFor="videoUrl">קישור לסרטון (YouTube / TikTok)</Label>
        <Input
          id="videoUrl"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          error={errors.videoUrl}
          dir="ltr"
          className="text-left placeholder:text-right"
        />
        {videoUrl && isVideoUrl(videoUrl) && (
          <p className="text-xs text-green-600 text-right">✓ קישור תקין</p>
        )}
      </div>

      {/* Video File Upload */}
      <div className="space-y-1">
        <Label htmlFor="videoFile">העלאת סרטון (עד 100MB)</Label>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {isEdit && exercise?.video_file_url && !videoFile && (
            <div className="mb-3 text-sm text-right">
              <span className="text-gray-600">קובץ נוכחי: </span>
              <a
                href={exercise.video_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline"
              >
                צפה בסרטון
              </a>
            </div>
          )}
          <input
            id="videoFile"
            type="file"
            accept="video/*"
            ref={videoInputRef}
            onChange={handleVideoFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-colors text-sm"
          >
            {videoFile ? `📹 ${videoFile.name} (${formatBytes(videoFile.size)})` : '📁 בחר קובץ סרטון'}
          </button>
          {errors.videoFile && (
            <p className="mt-1 text-sm text-red-600 text-right">{errors.videoFile}</p>
          )}
        </div>
      </div>

      {/* Voice Recorder */}
      <div className="space-y-1">
        <Label>הקלטה קולית</Label>
        <VoiceRecorder
          existingUrl={exercise?.voice_memo_url}
          onRecordingReady={setVoiceBlob}
        />
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 text-right">{submitError}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/exercises')}
          disabled={isSubmitting}
        >
          ביטול
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEdit ? 'שמור שינויים' : 'צור תרגיל'}
        </Button>
      </div>
    </form>
  );
}
