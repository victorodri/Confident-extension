'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserContext {
  description: string;
  concerns: string;
  goals: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({
    description: '',
    concerns: '',
    goals: ''
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      router.push('/auth');
      return;
    }

    setUser(session.user);

    // Cargar contexto del usuario si existe
    try {
      const response = await fetch('/api/profile/context', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user_context) {
          setUserContext(data.user_context);
        }
      }
    } catch (error) {
      console.error('Error loading user context:', error);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/profile/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(userContext)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }

    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
              href="/dashboard"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Planes
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
              <p className="text-slate-600">{user?.email}</p>
            </div>
          </div>
          <p className="text-slate-600">
            Personaliza tu experiencia con Confident. Cuéntanos más sobre ti para recibir sugerencias más relevantes y precisas.
          </p>
        </div>

        {/* Personalization Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-semibold text-slate-900">Personaliza tus sugerencias</h2>
            </div>
            <p className="text-sm text-slate-500">
              Esta información es privada y solo se usa para personalizar las sugerencias de IA que recibes durante tus conversaciones.
            </p>
          </div>

          {/* Campo 1: Quién eres */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-semibold text-slate-900">¿Quién eres?</span>
              <span className="block text-xs text-slate-500 mt-1">
                Tu rol, experiencia, industria, especialidad...
              </span>
            </label>
            <textarea
              value={userContext.description}
              onChange={(e) => setUserContext({ ...userContext, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Ej: Soy ingeniero de software con 5 años de experiencia en startups. Me especializo en backend y liderazgo técnico..."
            />
          </div>

          {/* Campo 2: Qué te preocupa */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-semibold text-slate-900">¿Qué te preocupa en conversaciones?</span>
              <span className="block text-xs text-slate-500 mt-1">
                Nervios, palabras adecuadas, claridad, estructura...
              </span>
            </label>
            <textarea
              value={userContext.concerns}
              onChange={(e) => setUserContext({ ...userContext, concerns: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Ej: Me pongo nervioso, pierdo el hilo de mis ideas, me cuesta sonar seguro..."
            />
          </div>

          {/* Campo 3: Qué quieres mejorar */}
          <div className="mb-8">
            <label className="block mb-2">
              <span className="text-sm font-semibold text-slate-900">¿Qué quieres mejorar?</span>
              <span className="block text-xs text-slate-500 mt-1">
                Objetivos, habilidades, resultados específicos...
              </span>
            </label>
            <textarea
              value={userContext.goals}
              onChange={(e) => setUserContext({ ...userContext, goals: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Ej: Responder con más estructura, manejar objeciones con calma, ser más persuasivo..."
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Volver al dashboard
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar cambios'}
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800 text-center">
                ✓ Perfil actualizado correctamente
              </p>
            </div>
          )}
        </form>

        {/* Privacy Note */}
        <div className="mt-6 p-4 bg-slate-100 rounded-xl">
          <p className="text-xs text-slate-600 text-center">
            🔒 Tu información es privada y segura. Solo se usa para personalizar las sugerencias de IA que recibes durante tus sesiones.
          </p>
        </div>
      </main>
    </div>
  );
}
