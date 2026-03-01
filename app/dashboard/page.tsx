'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Session {
  id: string;
  profile: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  suggestions_count: number;
}

interface SessionSummary {
  executive_summary: string;
  key_points: string[];
  recommendations: string[];
  learnings: string;
}

interface SessionDetails {
  session: Session & {
    summary?: SessionSummary | null;
  };
  transcriptions: Array<{
    id: string;
    speaker: string;
    text: string;
    created_at: string;
  }>;
  suggestions: Array<{
    id: string;
    suggestion_text: string;
    context_text: string;
    keywords: string[];
    urgency_level: number;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSession, setLoadingSession] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [remainingSessions, setRemainingSessions] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      router.push('/auth');
      return;
    }

    setUser(session.user);

    // Obtener perfil
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Obtener sesiones
    let loadedSessions: Session[] = [];
    try {
      const response = await fetch('/api/sessions', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        loadedSessions = data.sessions || [];
        setSessions(loadedSessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }

    // Obtener contador de sesiones
    try {
      const { data: { anonymous_id } } = await supabase.auth.getUser();
      const usageResponse = await fetch(`/api/usage?anonymous_id=${profileData?.anonymous_id || session.user.id}`);

      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        if (usageData.user_type === 'pro') {
          setRemainingSessions(null); // Pro es ilimitado
        } else {
          setRemainingSessions(usageData.remaining);
        }
      }
    } catch (error) {
      console.error('Error loading usage:', error);
    }

    setLoading(false);

    // Auto-seleccionar sesión si viene en la URL
    const sessionIdFromUrl = searchParams.get('session');
    if (sessionIdFromUrl) {
      // Verificar que la sesión existe en la lista cargada
      const sessionExists = loadedSessions.find(s => s.id === sessionIdFromUrl);
      if (sessionExists) {
        // Esperar un momento para que el UI se renderice
        setTimeout(() => {
          loadSessionDetails(sessionIdFromUrl);
        }, 300);
      }
    }
  };

  const loadSessionDetails = async (sessionId: string) => {
    setLoadingSession(true);
    setLoadingSummary(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedSession(data);

        // Si la sesión está completada pero no tiene resumen, mostrar mensaje de carga
        if (data.session.status === 'completed' && !data.session.summary) {
          setLoadingSummary(true);
        }
      }
    } catch (error) {
      console.error('Error loading session details:', error);
    }
    setLoadingSession(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProfileIcon = (profileType: string) => {
    switch (profileType) {
      case 'candidato': return '🎓';
      case 'vendedor': return '💼';
      case 'defensor': return '🛡️';
      default: return '💡';
    }
  };

  if (loading) {
    const sessionFromUrl = searchParams.get('session');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">
            {sessionFromUrl ? 'Cargando resumen de tu sesión...' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Confident
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Mi Perfil
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {profile?.plan === 'free' ? 'Actualizar a Pro' : 'Ver planes'}
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{user?.email}</p>
                <p className="text-sm text-slate-500">
                  Plan {profile?.plan === 'free' ? 'Gratuito' : 'Pro'} • {profile?.total_sessions || 0} sesiones completadas
                </p>
                {remainingSessions !== null && (
                  <p className="text-sm font-medium text-purple-600 mt-1">
                    {remainingSessions} {remainingSessions === 1 ? 'sesión restante' : 'sesiones restantes'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Sessions */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Historial de sesiones</h2>

            {sessions.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-600 mb-4">Aún no tienes sesiones</p>
                <p className="text-sm text-slate-500">Instala la extensión de Chrome y comienza tu primera sesión</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => loadSessionDetails(session.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedSession?.session.id === session.id
                        ? 'bg-purple-50 border-purple-300'
                        : 'bg-white border-slate-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getProfileIcon(session.profile)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 capitalize truncate">
                          {session.profile}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(session.started_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span>{formatDuration(session.duration_seconds)}</span>
                      <span>•</span>
                      <span>{session.suggestions_count} sugerencias</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main - Session Details */}
          <div className="md:col-span-2">
            {selectedSession ? (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Detalles de la sesión</h2>

                {loadingSession ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500 mb-1">Duración</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatDuration(selectedSession.session.duration_seconds)}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500 mb-1">Sugerencias recibidas</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {selectedSession.suggestions.length}
                        </p>
                      </div>
                    </div>

                    {/* Session Summary (AI-generated) */}
                    {loadingSummary ? (
                      <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="text-center py-8">
                          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                          <h3 className="font-semibold text-slate-900 mb-2">Generando tu resumen...</h3>
                          <p className="text-sm text-slate-600 mb-1">
                            Estamos analizando tu sesión con IA. Esto puede tardar hasta 2 minutos.
                          </p>
                          <p className="text-sm text-slate-500">
                            También recibirás el resumen por correo electrónico.
                          </p>
                        </div>
                      </div>
                    ) : selectedSession.session.summary ? (
                      <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <span>📊</span>
                          <span>Resumen de tu sesión</span>
                        </h3>

                        <div className="space-y-6">
                          {/* Executive Summary */}
                          <div>
                            <h4 className="text-sm font-semibold text-purple-700 mb-2">Balance general</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {selectedSession.session.summary.executive_summary}
                            </p>
                          </div>

                          {/* Key Points */}
                          <div>
                            <h4 className="text-sm font-semibold text-purple-700 mb-2">Momentos clave</h4>
                            <ul className="space-y-2">
                              {selectedSession.session.summary.key_points.map((point, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-slate-700">
                                  <span className="text-purple-500 font-bold">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Recommendations */}
                          <div>
                            <h4 className="text-sm font-semibold text-purple-700 mb-2">Cosas a mejorar para la próxima</h4>
                            <ol className="space-y-2">
                              {selectedSession.session.summary.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-slate-700">
                                  <span className="text-purple-500 font-semibold">{idx + 1}.</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Learnings */}
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-purple-700 mb-2">💡 Aprendizajes clave</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {selectedSession.session.summary.learnings}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Resumen</h3>
                        <p className="text-sm text-slate-500 italic">
                          Esta sesión no tiene resumen generado. Las sesiones nuevas incluirán análisis automático al finalizar.
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-600 mb-2">Selecciona una sesión</p>
                <p className="text-sm text-slate-500">Haz clic en una sesión de la izquierda para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
