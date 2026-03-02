'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Program } from '@/lib/types';
import { Button } from '@/components/ui/Button';

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message);
  return fallback;
}

export default function InvitePage() {
  const { user, loading: authLoading } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [advancementMode, setAdvancementMode] = useState<'auto' | 'manual'>('auto');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch trainer's programs
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPrograms = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('programs')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setPrograms((data ?? []) as Program[]);
      } catch (err: unknown) {
        console.error('Error fetching programs:', err);
        setError(getErrorMessage(err, 'שגיאה בטעינת התוכניות'));
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [authLoading, user]);

  const generateInviteCode = () => {
    return crypto.randomUUID().substring(0, 8);
  };

  const handleGenerate = async () => {
    if (!selectedProgramId || !user) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedLink('');
    setCopied(false);

    try {
      const supabase = createClient();
      const inviteCode = generateInviteCode();

      const { error: insertError } = await supabase
        .from('client_programs')
        .insert({
          trainer_id: user.id,
          program_id: selectedProgramId,
          invite_code: inviteCode,
          advancement_mode: advancementMode,
          status: 'pending',
        });

      if (insertError) throw insertError;

      const link = `${window.location.origin}/join/${inviteCode}`;
      setGeneratedLink(link);
    } catch (err: unknown) {
      console.error('Error generating invite:', err);
      setError(getErrorMessage(err, 'שגיאה ביצירת ההזמנה'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
          → חזרה לדף הבית
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">הזמנת לקוח 🔗</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Program selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            בחר תוכנית אימון <span className="text-red-500">*</span>
          </label>
          {programs.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-3">עדיין אין תוכניות אימון</p>
              <Link href="/dashboard/programs/new">
                <Button variant="primary" size="sm">צור תוכנית חדשה</Button>
              </Link>
            </div>
          ) : (
            <select
              value={selectedProgramId}
              onChange={(e) => {
                setSelectedProgramId(e.target.value);
                setGeneratedLink('');
                setCopied(false);
              }}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              dir="rtl"
            >
              <option value="">-- בחר תוכנית --</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Advancement mode */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            מצב התקדמות
          </label>
          <div className="space-y-3">
            <label className="flex items-center justify-end gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-amber-50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
              <div className="text-right flex-1">
                <div className="font-medium text-gray-900">אוטומטי 🚀</div>
                <div className="text-sm text-gray-600">הלקוח מתקדם לבד אחרי דיווח הצלחה</div>
              </div>
              <input
                type="radio"
                name="advancementMode"
                value="auto"
                checked={advancementMode === 'auto'}
                onChange={() => setAdvancementMode('auto')}
                className="w-4 h-4 text-amber-500"
              />
            </label>

            <label className="flex items-center justify-end gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-amber-50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
              <div className="text-right flex-1">
                <div className="font-medium text-gray-900">ידני ✋</div>
                <div className="text-sm text-gray-600">אתה מאשר כל מעבר שלב</div>
              </div>
              <input
                type="radio"
                name="advancementMode"
                value="manual"
                checked={advancementMode === 'manual'}
                onChange={() => setAdvancementMode('manual')}
                className="w-4 h-4 text-amber-500"
              />
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700 text-right">{error}</p>
          </div>
        )}

        {/* Generate button */}
        {!generatedLink && (
          <Button
            type="button"
            variant="primary"
            className="w-full"
            size="lg"
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!selectedProgramId}
          >
            צור לינק הזמנה
          </Button>
        )}

        {/* Generated link display */}
        {generatedLink && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700 text-right mb-2">✅ ההזמנה נוצרה בהצלחה!</p>
              <div className="bg-white rounded-lg border border-green-300 p-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {copied ? '✓ הועתק!' : '📋 העתק'}
                </button>
                <p className="text-sm text-gray-700 break-all flex-1 text-left font-mono" dir="ltr">
                  {generatedLink}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-right">
              שלח את הלינק ללקוח שלך דרך וואטסאפ, אימייל או כל אמצעי אחר 📱
            </p>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setGeneratedLink('');
                setCopied(false);
                setSelectedProgramId('');
              }}
            >
              צור הזמנה נוספת
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
