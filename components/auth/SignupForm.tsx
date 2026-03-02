'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { validateEmail, validatePassword, getPasswordStrength, formatError } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

export function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'client' as UserRole,
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'נא להזין שם מלא';
    }

    if (!formData.email) {
      newErrors.email = 'נא להזין כתובת אימייל';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'נא להזין סיסמה';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'עליך לאשר את התנאים וההגבלות';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.role);
      // Redirect based on role
      const redirectPath = formData.role === 'trainer' ? '/dashboard' : '/train';
      router.push(redirectPath);
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
        <Label htmlFor="fullName" required>
          שם מלא
        </Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
          placeholder="שם פרטי ומשפחה"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="email" required>
          אימייל
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          placeholder="••••••••"
          disabled={loading}
        />
        {formData.password && passwordStrength && (
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

      <div>
        <Label required>בחר תפקיד</Label>
        <div className="space-y-3 mt-2">
          <label className="flex items-center justify-end gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-amber-50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
            <div className="text-right flex-1">
              <div className="font-medium text-gray-900">מאלף 🐕</div>
              <div className="text-sm text-gray-600">אני מאלף כלבים ורוצה לנהל לקוחות</div>
            </div>
            <input
              type="radio"
              name="role"
              value="trainer"
              checked={formData.role === 'trainer'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              disabled={loading}
              className="w-4 h-4 text-amber-500"
            />
          </label>

          <label className="flex items-center justify-end gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-amber-50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
            <div className="text-right flex-1">
              <div className="font-medium text-gray-900">לקוח 🦴</div>
              <div className="text-sm text-gray-600">אני בעל כלב ורוצה לאמן את הכלב שלי</div>
            </div>
            <input
              type="radio"
              name="role"
              value="client"
              checked={formData.role === 'client'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              disabled={loading}
              className="w-4 h-4 text-amber-500"
            />
          </label>
        </div>
      </div>

      <div className="flex items-start justify-end gap-2">
        <label htmlFor="acceptTerms" className="text-sm text-gray-600 text-right cursor-pointer">
          אני מאשר/ת את{' '}
          <Link href="/terms" className="text-amber-600 hover:text-amber-700">
            התנאים וההגבלות
          </Link>
        </label>
        <input
          id="acceptTerms"
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          disabled={loading}
          className="mt-0.5 w-4 h-4 text-amber-500 rounded"
        />
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-red-600 text-right -mt-4">{errors.acceptTerms}</p>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        הירשם
      </Button>

      <p className="text-center text-sm text-gray-600">
        כבר יש לך חשבון?{' '}
        <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
          התחבר
        </Link>
      </p>
    </form>
  );
}
