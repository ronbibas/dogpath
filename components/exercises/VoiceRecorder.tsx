'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

type RecorderState = 'idle' | 'recording' | 'recorded';

interface VoiceRecorderProps {
  existingUrl?: string | null;
  onRecordingReady: (blob: Blob | null) => void;
}

export function VoiceRecorder({ existingUrl, onRecordingReady }: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>(existingUrl ? 'recorded' : 'idle');
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingUrl ?? null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && !existingUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, existingUrl]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState('recorded');
        onRecordingReady(blob);
      };

      recorder.start();
      setState('recording');
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError('לא ניתן לגשת למיקרופון. אנא אשר גישה ונסה שנית.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
  };

  const resetRecording = () => {
    if (audioUrl && !existingUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState('idle');
    setSeconds(0);
    onRecordingReady(null);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="text-sm font-medium text-gray-700 mb-3 text-right">הקלטה קולית</p>

      {state === 'idle' && (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white text-2xl flex items-center justify-center shadow-md transition-colors"
            title="התחל הקלטה"
          >
            🎙️
          </button>
          <span className="text-sm text-gray-500">לחץ להתחלת הקלטה</span>
        </div>
      )}

      {state === 'recording' && (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-red-500 text-white text-2xl flex items-center justify-center shadow-md animate-pulse"
            title="עצור הקלטה"
          >
            ⏹️
          </button>
          <span className="text-lg font-mono text-red-600 font-bold">{formatTime(seconds)}</span>
          <span className="text-sm text-gray-500">מקליט... לחץ לעצירה</span>
        </div>
      )}

      {state === 'recorded' && audioUrl && (
        <div className="flex flex-col gap-3">
          <audio src={audioUrl} controls className="w-full" />
          <Button type="button" variant="outline" size="sm" onClick={resetRecording}>
            🔄 הקלט מחדש
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600 text-right">{error}</p>}
    </div>
  );
}
