'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

interface ClientProgramWithDetails {
  id: string;
  client_id: string | null;
  trainer_id: string;
  program_id: string;
  invite_code: string;
  status: 'pending' | 'active' | 'completed';
  advancement_mode: 'auto' | 'manual';
  created_at: string;
  client: { full_name: string } | null;
  program: { title: string } | null;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [clientPrograms, setClientPrograms] = useState<ClientProgramWithDetails[]>([]);
  const [programCount, setProgramCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      const supabase = createClient();

      // Fetch program count (this table always exists)
      try {
        const { count } = await supabase
          .from('programs')
          .select('*', { count: 'exact', head: true });
        setProgramCount(count ?? 0);
      } catch (err) {
        console.error('Error fetching program count:', err);
      }

      // Fetch client programs (table may not exist yet - that's OK)
      try {
        const { data: cpData, error: cpError } = await supabase
          .from('client_programs')
          .select('*, client:profiles!client_id(full_name), program:programs(title)')
          .order('created_at', { ascending: false });

        if (!cpError && cpData) {
          setClientPrograms(cpData as unknown as ClientProgramWithDetails[]);
        }
      } catch (err) {
        console.error('Error fetching client programs (table may not exist yet):', err);
        // Silently ignore - table might not exist yet
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [authLoading, user]);

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

  const activeClients = clientPrograms.filter((cp) => cp.status === 'active');
  const pendingInvites = clientPrograms.filter((cp) => cp.status === 'pending');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          שלום, {user?.profile?.full_name || 'מאלף'}! 🐕
        </h1>
        <p className="text-gray-600">
          ברוך הבא ללוח הבקרה של המאלפים
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-right">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">{activeClients.length}</div>
          <div className="text-sm text-gray-600">לקוחות פעילים</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-right">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-2xl font-bold text-gray-900">{programCount}</div>
          <div className="text-sm text-gray-600">תוכניות אימון</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-right">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-gray-900">{pendingInvites.length}</div>
          <div className="text-sm text-gray-600">הזמנות ממתינות</div>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/invite">
            <Button variant="primary" size="sm">+ הזמן לקוח</Button>
          </Link>
          <h2 className="text-xl font-bold text-gray-900">הלקוחות שלי</h2>
        </div>

        {clientPrograms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">עדיין אין לקוחות</h3>
            <p className="text-gray-500 mb-6">שלח הזמנה ראשונה וההרפתקה מתחילה!</p>
            <Link href="/dashboard/invite">
              <Button variant="primary">שלח הזמנה ראשונה 🔗</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {clientPrograms.map((cp) => (
              <div
                key={cp.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/30 transition-colors"
              >
                {/* Status badge */}
                <div className="flex items-center gap-2">
                  {cp.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                      ⏳ ממתין
                    </span>
                  )}
                  {cp.status === 'active' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      ✅ פעיל
                    </span>
                  )}
                  {cp.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      🎉 הושלם
                    </span>
                  )}
                </div>

                {/* Client info */}
                <div className="text-right flex-1 mr-4">
                  <p className="font-medium text-gray-900">
                    {cp.status === 'pending'
                      ? 'ממתין להרשמה ⏳'
                      : cp.client?.full_name || 'לקוח'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cp.program?.title || 'תוכנית'}
                    {cp.advancement_mode === 'manual' && (
                      <span className="mr-2 text-amber-600">• ידני</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
