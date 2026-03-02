import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('הסיסמה צריכה להכיל לפחות 8 תווים');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('הסיסמה צריכה להכיל לפחות אות גדולה אחת');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('הסיסמה צריכה להכיל לפחות אות קטנה אחת');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('הסיסמה צריכה להכיל לפחות ספרה אחת');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  label: string;
  color: string;
} {
  const validation = validatePassword(password);
  const score = 4 - validation.errors.length;

  if (score <= 1) {
    return { strength: 'weak', label: 'חלשה', color: 'bg-red-500' };
  }
  if (score === 2 || score === 3) {
    return { strength: 'medium', label: 'בינונית', color: 'bg-yellow-500' };
  }
  return { strength: 'strong', label: 'חזקה', color: 'bg-green-500' };
}

export const errorMessages: Record<string, string> = {
  'Invalid login credentials': 'פרטי התחברות שגויים',
  'Email not confirmed': 'האימייל לא אומת',
  'User already registered': 'משתמש כבר רשום',
  'Password should be at least 6 characters': 'הסיסמה צריכה להכיל לפחות 6 תווים',
  'Unable to validate email address: invalid format': 'כתובת אימייל לא תקינה',
  'Signup requires a valid password': 'נדרשת סיסמה תקינה',
};

export function formatError(error: unknown): string {
  if (typeof error === 'string') {
    return errorMessages[error] || error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;
    return errorMessages[message] || message;
  }

  return 'אירעה שגיאה. אנא נסה שוב';
}
