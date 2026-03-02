'use client';

import { useAuth } from '@/lib/auth-context';

export default function TrainPage() {
  const { user, loading } = useAuth();

  if (loading) {
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
    <div className="max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          שלום, {user?.profile?.full_name || 'חבר'}! 🦴
        </h1>
        <p className="text-gray-600 mb-4">
          ברוך הבא לאזור האימון שלך
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium">
          <span>מחובר כ:</span>
          <span className="font-bold">{user?.profile?.role === 'client' ? 'לקוח' : 'מאלף'}</span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">ימי סטרייק</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">נקודות</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">הישגים</div>
        </div>
      </div>

      {/* Today's Lesson Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">שיעור היום</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600">אין שיעורים זמינים כרגע</p>
          <p className="text-sm text-gray-500 mt-2">
            המאלף שלך יוסיף תוכנית אימון בקרוב
          </p>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gradient-to-l from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold mb-2">בקרוב...</h2>
        <p className="text-lg opacity-95">
          תכונות מרגשות בדרך אליך!
        </p>
        <ul className="mt-6 text-right max-w-md mx-auto space-y-2">
          <li>✨ שיעורי אימון אינטראקטיביים</li>
          <li>✨ וידאו והדרכות מהמאלף</li>
          <li>✨ מעקב התקדמות יומי</li>
          <li>✨ תגובות ופידבק בזמן אמת</li>
          <li>✨ קהילה ופורומים</li>
        </ul>
      </div>
    </div>
  );
}
