'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';

export default function TrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                התנתק
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/train"
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  האימונים שלי
                </Link>
                <Link
                  href="/train/progress"
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  ההתקדמות שלי
                </Link>
                <Link
                  href="/train/achievements"
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  הישגים
                </Link>
              </nav>

              <Link
                href="/train"
                className="flex items-center gap-2 text-xl font-bold text-amber-600"
              >
                <span>DogPath</span>
                <span>🦴</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
