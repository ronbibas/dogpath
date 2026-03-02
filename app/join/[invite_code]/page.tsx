'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { validateEmail, validatePassword, getPasswordStrength, formatError } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

interface InviteInfo {
  id: string;
  program_title: string;
  program_description: string | null;
  trainer_name: string;
  status: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message);
  return fallback;
}

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const inviteCode = params.invite_code as string;

  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalidInvite, setInvalidInvite] = useState(false);

  // Registration form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const passwordStrength = password ? getPasswordStrength(password) : null;

  // Fetch invite info on mount
  useEffect(() => {
    const fetchInviteInfo = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .rpc('get_invite_info', { code: inviteCode });

        if (error) throw error;

        if (!data || data.status !== 'pending') {
          setInvalidInvite(true);
        } else {
          setInviteInfo(data as InviteInfo);
        }
      } catch (err: unknown) {
        console.error('Error fetching invite info:', err);
        setInvalidInvite(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInviteInfo();
  }, [inviteCode]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'נא להזין שם מלא';
    }

    if (!email) {
      newErrors.email = 'נא להזין כתובת אימייל';
    } else if (!validateEmail(email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = 'נא להזין סיסמה';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const supabase = createClient();

      // 1. Sign up the user as a client
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'client',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error('שגיאה ביצירת המשתמש');
      }

      // 2. Setup client after join (atomic: assign client_id + create stage_progress)
      const { error: setupError } = await supabase
        .rpc('setup_client_after_join', {
          p_invite_code: inviteCode,
          p_client_id: signUpData.user.id,
        });

      if (setupError) throw setupError;

      // 3. Redirect to client training page
      router.push('/train');
    } catch (err: unknown) {
      console.error('Error during registration:', err);
      setSubmitError(formatError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען הזמנה...</p>
        </div>
      </div>
    );
  }

  // Invalid invite
  if (invalidInvite) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">הזמנה לא תקינה</h1>
          <p className="text-gray-600 mb-6">
            ההזמנה הזו לא קיימת, כבר נוצלה, או שפג תוקפה.
          </p>
          <Link href="/">
            <Button variant="primary">חזרה לדף הבית</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold text-amber-600">
            🐕 DogPath
          </Link>
        </div>

        {/* Invite info card */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-right">
          <p className="text-sm text-amber-700 mb-1">הוזמנת על ידי</p>
          <p className="text-lg font-bold text-gray-900 mb-2">{inviteInfo?.trainer_name}</p>
          <div className="border-t border-amber-200 pt-2 mt-2">
            <p className="text-sm text-amber-700 mb-1">לתוכנית האימון</p>
            <p className="text-lg font-bold text-gray-900">{inviteInfo?.program_title}</p>
            {inviteInfo?.program_description && (
              <p className="text-sm text-gray-600 mt-1">{inviteInfo.program_description}</p>
            )}
          </div>
        </div>

        {/* Registration form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 text-right mb-6">הרשמה ✨</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Submit error */}
            {submitError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-right">
                {submitError}
              </div>
            )}

            {/* Full name */}
            <div>
              <Label htmlFor="fullName" required>שם מלא</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                placeholder="שם פרטי ומשפחה"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" required>אימייל</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" required>סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm text-gray-600">{passwordStrength.label}</span>
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength.color}`}
                        style={{
                          width:
                            passwordStrength.strength === 'weak'
                              ? '33%'
                              : passwordStrength.strength === 'medium'
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              הירשם והתחל לאמן 🐕
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              התחבר
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
