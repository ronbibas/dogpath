import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-amber-600">
            <span>🐕</span>
            <span>DogPath</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">
            הצטרף אלינו היום
          </h1>
          <p className="text-gray-600 mt-2">
            התחל את מסע אילוף הכלבים שלך עכשיו
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <SignupForm />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-amber-600">
            ← חזור לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
