'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { validateEmail, formatError } from '@/lib/utils';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'נא להזין כתובת אימייל';
    } else if (!validateEmail(email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!password) {
      newErrors.password = 'נא להזין סיסמה';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard'); // Will be redirected by middleware based on role
    } catch (error) {
      setErrors({ general: formatError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-right">
          {errors.general}
        </div>
      )}

      <div>
        <Label htmlFor="email" required>
          אימייל
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="your@email.com"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="password" required>
          סיסמה
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-sm text-amber-600 hover:text-amber-700"
        >
          שכחתי סיסמה
        </Link>
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        התחבר
      </Button>

      <p className="text-center text-sm text-gray-600">
        עדיין אין לך חשבון?{' '}
        <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-medium">
          הירשם עכשיו
        </Link>
      </p>
    </form>
  );
}
