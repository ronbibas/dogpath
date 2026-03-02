import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                התחבר
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">הירשם</Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-amber-600">DogPath</h1>
            <span className="text-3xl">🐕</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            הדואולינגו של אילוף כלבים
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            פלטפורמה אינטראקטיבית לאימון כלבים שמחברת בין מאלפים מקצועיים לבעלי כלבים
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup?role=client">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                🦴 הצטרף כלקוח
              </Button>
            </Link>
            <Link href="/signup?role=trainer">
              <Button size="lg" className="w-full sm:w-auto">
                🐕 התחל כמאלף
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          למה DogPath?
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 text-center hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">🎯</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              תוכנית אימון מותאמת אישית
            </h4>
            <p className="text-gray-600">
              מאלפים מקצועיים בונים תוכניות אימון ייחודיות המותאמות לכל כלב ובעליו
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">📊</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              מעקב והתקדמות
            </h4>
            <p className="text-gray-600">
              עקוב אחרי ההתקדמות שלך עם מערכת ניקוד וביצועים כמו בדואולינגו
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 text-center hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">💬</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              תקשורת ישירה
            </h4>
            <p className="text-gray-600">
              תקשורת קלה ונוחה בין המאלף ללקוח עם משוב וסיוע בזמן אמת
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">🏆</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              הישגים ופרסים
            </h4>
            <p className="text-gray-600">
              הרוויח תגים והישגים בדרך להפיכת הכלב שלך למאומן מושלם
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 text-center hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">📱</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              נגיש מכל מקום
            </h4>
            <p className="text-gray-600">
              גש לתוכנית האימון שלך מכל מכשיר, בכל זמן ובכל מקום
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">👥</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              קהילה תומכת
            </h4>
            <p className="text-gray-600">
              הצטרף לקהילה של בעלי כלבים ומאלפים שחולקים טיפים וחוויות
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="bg-gradient-to-l from-amber-500 to-orange-500 rounded-3xl p-12 text-center text-white max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            מוכנים להתחיל את המסע?
          </h3>
          <p className="text-lg md:text-xl mb-8 opacity-95">
            הצטרפו אלינו עכשיו והפכו את אילוף הכלבים לחוויה מהנה ואפקטיבית
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
              התחל עכשיו בחינם
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/about" className="hover:text-amber-600">
                אודות
              </Link>
              <Link href="/contact" className="hover:text-amber-600">
                צור קשר
              </Link>
              <Link href="/terms" className="hover:text-amber-600">
                תנאי שימוש
              </Link>
              <Link href="/privacy" className="hover:text-amber-600">
                מדיניות פרטיות
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 DogPath. כל הזכויות שמורות.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
